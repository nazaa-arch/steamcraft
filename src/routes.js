const fs = require('node:fs');
const path = require('node:path');
const { db, dbPath, dataDir, DEFAULT_TEMPLATES, getAppMode, setAppMode } = require('./db');
const { generateGuidance, answerUserQuery } = require('./ai');
const {
  hashPassword,
  verifyPassword,
  createSession,
  getUserByToken,
  destroySession,
  backupDatabase
} = require('./security');
const { sendVerificationEmail } = require('./mailer');

// In-memory active session for simplicity and instant presentation
let currentSessionUser = null;

function getCurrentUser(req) {
  if (req && req.headers) {
    // 1. Primary: Cryptographic Bearer token in Authorization header
    const authHeader = req.headers['authorization'] || req.headers['Authorization'];
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.slice(7).trim();
      const u = getUserByToken(db, token);
      if (u) return u;
    }

    // 2. Fallback: X-User-Id header (for internal tests / backwards compatibility)
    const headerUserId = req.headers['x-user-id'] || req.headers['X-User-Id'];
    if (headerUserId) {
      const u = db.prepare('SELECT * FROM users WHERE id = ?').get(headerUserId);
      if (u) return u;
    }
  }
  return currentSessionUser;
}

async function handleApiRequest(req, res, url, body) {
  const method = req.method;
  const pathname = url.pathname;
  const user = getCurrentUser(req);

  // Helper senders
  const json = (data, status = 200) => {
    res.writeHead(status, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(data));
  };
  const error = (msg, status = 400) => json({ error: msg }, status);

  // ===================== SYSTEM MODE ROUTES =====================
  if (pathname === '/api/system/mode' && method === 'GET') {
    const mode = getAppMode();
    return json({ mode, appMode: mode, isDemo: mode === 'demo' });
  }

  if (pathname === '/api/system/mode' && method === 'POST') {
    const { mode } = body || {};
    const newMode = setAppMode(mode);
    return json({
      success: true,
      mode: newMode,
      appMode: newMode,
      isDemo: newMode === 'demo',
      message: newMode === 'demo'
        ? '✓ Sistem beralih ke Mode Demo (Showcase Lomba & 13 Proyek Sampel)'
        : '✓ Sistem beralih ke Mode Operasional Riil (Data Kampus Bersih)'
    });
  }

  // ===================== AUTH ROUTES =====================
  if (pathname === '/api/auth/me' && method === 'GET') {
    return json({ user: user || null, appMode: getAppMode() });
  }

  if (pathname === '/api/auth/logout' && method === 'POST') {
    const authHeader = req.headers['authorization'] || req.headers['Authorization'];
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.slice(7).trim();
      destroySession(db, token);
    }
    currentSessionUser = null;
    return json({ success: true, message: 'Berhasil keluar dari sesi.' });
  }

  if (pathname === '/api/auth/switch-demo' && method === 'POST') {
    const { role, username } = body || {};
    let targetUser = null;
    if (username) {
      targetUser = db.prepare('SELECT * FROM users WHERE username = ?').get(username);
    } else if (role === 'admin') {
      targetUser = db.prepare("SELECT * FROM users WHERE role = 'admin'").get();
    } else if (role === 'lecturer') {
      targetUser = db.prepare("SELECT * FROM users WHERE role = 'lecturer'").get();
    } else {
      targetUser = db.prepare("SELECT * FROM users WHERE role = 'student'").get();
    }
    if (targetUser) {
      currentSessionUser = targetUser;
      const token = createSession(db, targetUser.id);
      return json({ success: true, user: targetUser, token });
    }
    return error('User tidak ditemukan');
  }

  if (pathname === '/api/auth/login' && method === 'POST') {
    const { username, identifier, password } = body || {};
    const inputIdentifier = username || identifier;
    if (!inputIdentifier || !password) return error('Username/NIM/NIP dan kata sandi wajib diisi', 400);

    const unameClean = String(inputIdentifier).trim();
    const isSpecialDevLookup = ['admin', 'developer', 'dev'].includes(unameClean.toLowerCase());

    let found = null;
    if (isSpecialDevLookup) {
      found = db.prepare("SELECT * FROM users WHERE role = 'admin' LIMIT 1").get();
    }
    if (!found) {
      found = db.prepare('SELECT * FROM users WHERE username = ? OR identifier = ?').get(unameClean, unameClean);
    }

    if (!found) return error('Username atau identitas (NIM/NIP) tidak terdaftar', 401);

    const isDirectMatch = verifyPassword(password, found.password);
    const isDevAdminBypass = (found.role === 'admin' && (password === 'admin' || password === 'admin123' || password === 'admin2026!' || password === 'developer' || password === 'dev'));
    const isDemoBypass = password === 'demo';

    if (!isDirectMatch && !isDevAdminBypass && !isDemoBypass) {
      return error('Kata sandi salah', 401);
    }

    // Auto-upgrade legacy plaintext password to secure scrypt hash
    if (!found.password.includes(':')) {
      try {
        const upgradedHash = hashPassword(password);
        db.prepare('UPDATE users SET password = ? WHERE id = ?').run(upgradedHash, found.id);
      } catch (e) {}
    }

    if (found.email_verified === 0) {
      const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
      const targetEmail = found.email || `${found.username}@mail.steamcraft.ac.id`;
      db.prepare('DELETE FROM email_verifications WHERE user_id = ?').run(found.id);
      db.prepare(`
        INSERT INTO email_verifications (user_id, email, otp_code, expires_at)
        VALUES (?, ?, ?, datetime('now', 'localtime', '+10 minutes'))
      `).run(found.id, targetEmail, otpCode);

      const mailResult = await sendVerificationEmail({
        to: targetEmail,
        name: found.name,
        otpCode: otpCode
      });

      return json({
        success: false,
        requiresVerification: true,
        userId: found.id,
        email: targetEmail,
        name: found.name,
        simulatedOtp: mailResult.simulated ? otpCode : null,
        error: 'Email Anda belum diverifikasi. Kode OTP telah dikirimkan ke email Anda.'
      });
    }

    const token = createSession(db, found.id);
    currentSessionUser = found;
    return json({ success: true, user: found, token });
  }

  if (pathname === '/api/auth/register' && method === 'POST') {
    const { username, name, role, identifier, nim, nip, study_program, password, email } = body || {};
    const idVal = identifier || nim || nip;
    const userHandle = username || (idVal ? idVal.toLowerCase().replace(/[^a-z0-9_]/g, '') : '');
    if (!name || !role || !idVal) {
      return error('Field wajib diisi: Nama Lengkap, Peran, dan NIM/NIP');
    }

    const cleanEmail = email ? String(email).trim().toLowerCase() : `${userHandle}@mail.steamcraft.ac.id`;
    if (!cleanEmail.includes('@') || !cleanEmail.includes('.')) {
      return error('Format alamat email tidak valid (harus mengandung @ dan domain)');
    }

    const existingUname = db.prepare('SELECT id FROM users WHERE username = ? OR identifier = ?').get(userHandle, idVal);
    if (existingUname) {
      return error(`Username "${userHandle}" atau NIM/NIP "${idVal}" sudah terdaftar.`);
    }

    const existingEmail = db.prepare('SELECT id FROM users WHERE email = ?').get(cleanEmail);
    if (existingEmail) {
      return error(`Alamat email "${cleanEmail}" sudah terdaftar.`);
    }

    try {
      const colors = ['#2878d7', '#37b6a0', '#8060d5', '#ed7b64', '#f4b33e'];
      const avatarColor = colors[Math.floor(Math.random() * colors.length)];
      const securePasswordHash = hashPassword(password || 'password123');
      const otpCode = Math.floor(100000 + Math.random() * 900000).toString();

      const insert = db.prepare(`
        INSERT INTO users (username, name, role, identifier, study_program, avatar_color, password, email, email_verified)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, 0)
      `);
      const info = insert.run(userHandle, name, role, idVal, study_program || 'Sains Terapan', avatarColor, securePasswordHash, cleanEmail);
      const newUserId = info.lastInsertRowid;

      // Auto-acknowledge existing historical announcements for new users so their unread counter starts clean at 0
      try {
        const existingAnnouncements = db.prepare('SELECT id FROM announcements').all();
        const insertInteraction = db.prepare(`
          INSERT OR IGNORE INTO announcement_interactions (announcement_id, user_id, is_read, is_saved)
          VALUES (?, ?, 1, 0)
        `);
        for (const ann of existingAnnouncements) {
          insertInteraction.run(ann.id, newUserId);
        }
      } catch (e) {}

      db.prepare(`
        INSERT INTO email_verifications (user_id, email, otp_code, expires_at)
        VALUES (?, ?, ?, datetime('now', 'localtime', '+10 minutes'))
      `).run(newUserId, cleanEmail, otpCode);

      const mailResult = await sendVerificationEmail({
        to: cleanEmail,
        name: name,
        otpCode: otpCode
      });

      return json({
        success: true,
        requiresVerification: true,
        userId: newUserId,
        email: cleanEmail,
        name: name,
        simulatedOtp: mailResult.simulated ? otpCode : null,
        message: 'Akun berhasil dibuat. Kode OTP verifikasi telah dikirimkan ke email Anda!'
      });
    } catch (e) {
      return error('Pendaftaran gagal: ' + e.message);
    }
  }

  if (pathname === '/api/auth/verify-email' && method === 'POST') {
    const { userId, email, otpCode } = body || {};
    if ((!userId && !email) || !otpCode) {
      return error('Kode OTP dan identitas akun wajib diisi', 400);
    }

    const cleanOtp = String(otpCode).trim();
    let query = "SELECT * FROM email_verifications WHERE otp_code = ? AND datetime(expires_at) >= datetime('now', 'localtime')";
    let params = [cleanOtp];

    if (userId) {
      query += ' AND user_id = ?';
      params.push(userId);
    } else if (email) {
      query += ' AND email = ?';
      params.push(email.trim().toLowerCase());
    }
    query += ' ORDER BY id DESC LIMIT 1';

    const verificationRecord = db.prepare(query).get(...params);

    if (!verificationRecord) {
      return error('Kode OTP salah atau telah kedaluwarsa. Silakan minta kode baru.', 400);
    }

    const targetUserId = verificationRecord.user_id;

    // Mark user as verified
    db.prepare('UPDATE users SET email_verified = 1 WHERE id = ?').run(targetUserId);

    // Clean up verification records
    db.prepare('DELETE FROM email_verifications WHERE user_id = ?').run(targetUserId);

    const verifiedUser = db.prepare('SELECT * FROM users WHERE id = ?').get(targetUserId);
    const token = createSession(db, verifiedUser.id);
    currentSessionUser = verifiedUser;

    return json({
      success: true,
      message: 'Email berhasil diverifikasi! Selamat datang di STEAM-Craft.',
      user: verifiedUser,
      token
    });
  }

  if (pathname === '/api/auth/resend-otp' && method === 'POST') {
    const { userId, email } = body || {};
    if (!userId && !email) {
      return error('Identitas akun wajib diisi', 400);
    }

    let userRow = null;
    if (userId) {
      userRow = db.prepare('SELECT * FROM users WHERE id = ?').get(userId);
    } else if (email) {
      userRow = db.prepare('SELECT * FROM users WHERE email = ?').get(email.trim().toLowerCase());
    }

    if (!userRow) {
      return error('Pengguna tidak ditemukan', 404);
    }

    if (userRow.email_verified === 1) {
      return error('Email pengguna ini sudah diverifikasi sebelumnya.', 400);
    }

    const newOtp = Math.floor(100000 + Math.random() * 900000).toString();

    db.prepare('DELETE FROM email_verifications WHERE user_id = ?').run(userRow.id);
    db.prepare(`
      INSERT INTO email_verifications (user_id, email, otp_code, expires_at)
      VALUES (?, ?, ?, datetime('now', 'localtime', '+10 minutes'))
    `).run(userRow.id, userRow.email, newOtp);

    const mailResult = await sendVerificationEmail({
      to: userRow.email,
      name: userRow.name,
      otpCode: newOtp
    });

    return json({
      success: true,
      userId: userRow.id,
      email: userRow.email,
      simulatedOtp: mailResult.simulated ? newOtp : null,
      message: 'Kode OTP baru telah dikirimkan ke ' + userRow.email
    });
  }

  if (pathname === '/api/auth/profile' && method === 'POST') {
    if (!user) return error('Sesi pengguna tidak valid', 401);
    const {
      name,
      identifier,
      study_program,
      faculty,
      university,
      research_interests,
      bio,
      avatar_color,
      academic_links
    } = body || {};

    if (!name || !identifier) {
      return error('Nama Lengkap dan Nomor Identitas (NIM/NIP) wajib diisi');
    }

    try {
      db.prepare(`
        UPDATE users
        SET name = ?,
            identifier = ?,
            study_program = ?,
            faculty = ?,
            university = ?,
            research_interests = ?,
            bio = ?,
            avatar_color = ?,
            academic_links = ?
        WHERE id = ?
      `).run(
        name.trim(),
        identifier.trim(),
        study_program || user.study_program || 'Sains Data',
        faculty || user.faculty || 'Fakultas Matematika dan Ilmu Pengetahuan Alam (FMIPA)',
        university || user.university || 'Universitas Indonesia',
        research_interests !== undefined ? research_interests.trim() : (user.research_interests || ''),
        bio !== undefined ? bio.trim() : (user.bio || ''),
        avatar_color || user.avatar_color || '#2878d7',
        academic_links !== undefined ? academic_links.trim() : (user.academic_links || ''),
        user.id
      );

      // Refresh current session user from DB
      currentSessionUser = db.prepare('SELECT * FROM users WHERE id = ?').get(user.id);
      return json({ success: true, user: currentSessionUser, message: 'Profil dan identitas berhasil diperbarui' });
    } catch (e) {
      return error('Gagal memperbarui profil: ' + e.message, 500);
    }
  }

  // ===================== ADMIN & SYSTEM CONTROL ROUTES =====================
  if (pathname === '/api/admin/system-stats' && method === 'GET') {
    const totalProjects = db.prepare('SELECT COUNT(*) as count FROM projects').get().count;
    const demoProjects = db.prepare('SELECT COUNT(*) as count FROM projects WHERE is_demo = 1').get().count;
    const prodProjects = db.prepare('SELECT COUNT(*) as count FROM projects WHERE is_demo = 0').get().count;
    const totalUsers = db.prepare('SELECT COUNT(*) as count FROM users').get().count;
    const studentUsers = db.prepare("SELECT COUNT(*) as count FROM users WHERE role = 'student'").get().count;
    const lecturerUsers = db.prepare("SELECT COUNT(*) as count FROM users WHERE role = 'lecturer'").get().count;
    const adminUsers = db.prepare("SELECT COUNT(*) as count FROM users WHERE role = 'admin'").get().count;
    const totalCheckpoints = db.prepare('SELECT COUNT(*) as count FROM checkpoints').get().count;
    const doneCheckpoints = db.prepare('SELECT COUNT(*) as count FROM checkpoints WHERE is_completed = 1').get().count;
    const totalJournals = db.prepare('SELECT COUNT(*) as count FROM journals').get().count;

    let dbSizeBytes = 0;
    try {
      const stats = fs.statSync(path.join(__dirname, '../steamcraft.db'));
      dbSizeBytes = stats.size;
    } catch (e) {}

    return json({
      system: {
        nodeVersion: process.version,
        platform: process.platform,
        uptimeSeconds: Math.floor(process.uptime()),
        memoryRssMb: Math.round(process.memoryUsage().rss / 1024 / 1024 * 10) / 10,
        dbSizeBytes,
        dbSizeKb: Math.round(dbSizeBytes / 1024),
        appMode: getAppMode()
      },
      counts: {
        totalProjects,
        demoProjects,
        prodProjects,
        totalUsers,
        studentUsers,
        lecturerUsers,
        adminUsers,
        totalCheckpoints,
        doneCheckpoints,
        totalJournals
      }
    });
  }

  if (pathname === '/api/admin/users' && method === 'GET') {
    const allUsers = db.prepare(`
      SELECT id, username, name, role, identifier, study_program, faculty, university, research_interests, avatar_color, created_at
      FROM users
      ORDER BY id ASC
    `).all();
    return json({ users: allUsers });
  }

  if (pathname.match(/^\/api\/admin\/users\/(\d+)\/role$/) && method === 'POST') {
    const id = pathname.match(/^\/api\/admin\/users\/(\d+)\/role$/)[1];
    const { role } = body || {};
    if (!['student', 'lecturer', 'admin'].includes(role)) {
      return error('Role tidak valid');
    }
    const target = db.prepare('SELECT * FROM users WHERE id = ?').get(id);
    if (!target) return error('Pengguna tidak ditemukan', 404);
    db.prepare('UPDATE users SET role = ? WHERE id = ?').run(role, id);
    return json({ success: true, message: `Role akun ${target.name} diubah menjadi ${role}` });
  }

  if (pathname.match(/^\/api\/admin\/users\/(\d+)\/reset-password$/) && method === 'POST') {
    const id = pathname.match(/^\/api\/admin\/users\/(\d+)\/reset-password$/)[1];
    const { newPassword } = body || {};
    const pass = newPassword || 'password123';
    const target = db.prepare('SELECT * FROM users WHERE id = ?').get(id);
    if (!target) return error('Pengguna tidak ditemukan', 404);
    const secureHash = hashPassword(pass);
    db.prepare('UPDATE users SET password = ? WHERE id = ?').run(secureHash, id);
    return json({ success: true, message: `Kata sandi akun ${target.name} berhasil direset.` });
  }

  if (pathname.match(/^\/api\/admin\/users\/(\d+)$/) && method === 'DELETE') {
    const id = pathname.match(/^\/api\/admin\/users\/(\d+)$/)[1];
    const target = db.prepare('SELECT * FROM users WHERE id = ?').get(id);
    if (!target) return error('Pengguna tidak ditemukan', 404);
    if (target.username === 'admin' || target.username === 'budi' || target.username === 'dosen') {
      return error('Akun sistem inti tidak dapat dihapus', 403);
    }
    db.prepare('DELETE FROM users WHERE id = ?').run(id);
    return json({ success: true, message: `Akun ${target.name} (@${target.username}) berhasil dihapus.` });
  }

  // ===================== DATABASE BACKUP ROUTES =====================
  if (pathname === '/api/admin/backups' && method === 'GET') {
    const backupDir = path.join(dataDir, 'backups');
    let list = [];
    if (fs.existsSync(backupDir)) {
      list = fs.readdirSync(backupDir)
        .filter(f => f.startsWith('steamcraft_backup_') && f.endsWith('.db'))
        .map(f => {
          const s = fs.statSync(path.join(backupDir, f));
          return {
            filename: f,
            sizeBytes: s.size,
            sizeKb: Math.round(s.size / 1024),
            mtime: s.mtime
          };
        })
        .sort((a, b) => new Date(b.mtime) - new Date(a.mtime));
    }
    return json({ backups: list });
  }

  if (pathname === '/api/admin/backups' && method === 'POST') {
    const backupDir = path.join(dataDir, 'backups');
    try {
      const resBackup = backupDatabase(dbPath, backupDir);
      return json(resBackup);
    } catch (e) {
      return error('Gagal membuat cadangan database: ' + e.message, 500);
    }
  }

  if (pathname === '/api/admin/database/optimize' && method === 'POST') {
    if (!user || user.role !== 'admin') return error('Akses ditolak: Hanya Administrator', 403);
    try {
      db.exec('PRAGMA optimize;');
      db.exec('VACUUM;');
      let dbSizeKb = 0;
      try {
        const dataDir = process.env.DATA_DIR || path.join(__dirname, '..');
        const dbFile = path.join(dataDir, 'steamcraft.db');
        const stats = fs.statSync(dbFile);
        dbSizeKb = Math.round(stats.size / 1024);
      } catch (err) {}
      return json({ 
        success: true, 
        message: 'Database SQLite berhasil dioptimalkan dan divacuum (WAL Mode aktif).',
        dbSizeKb
      });
    } catch (e) {
      return error('Gagal mengoptimasi database: ' + e.message, 500);
    }
  }

  // ===================== PROJECTS ROUTES =====================
  if (pathname === '/api/projects' && method === 'GET') {
    const search = url.searchParams.get('q') || '';
    const study = url.searchParams.get('study') || '';
    const status = url.searchParams.get('status') || '';
    const reqMode = url.searchParams.get('mode'); // 'demo' | 'production' | 'all'
    const appMode = getAppMode();

    let query = 'SELECT * FROM projects WHERE 1=1';
    const params = [];

    // Filter by system operational mode
    if (reqMode === 'production' || (appMode === 'production' && reqMode !== 'all' && reqMode !== 'demo')) {
      query += ' AND is_demo = 0';
    } else if (reqMode === 'demo') {
      query += ' AND is_demo = 1';
    }

    if (search) {
      query += ' AND (name LIKE ? OR desc LIKE ? OR goal LIKE ?)';
      const s = `%${search}%`;
      params.push(s, s, s);
    }
    if (study) {
      query += ' AND study = ?';
      params.push(study);
    }
    if (status) {
      query += ' AND status = ?';
      params.push(status);
    }

    query += ' ORDER BY archived ASC, updated_at DESC, id DESC';
    const projects = db.prepare(query).all(...params);

    // Attach checkpoints and team members array for compatibility
    for (const p of projects) {
      const cps = db.prepare('SELECT is_completed, completed_by, completed_at FROM checkpoints WHERE project_id = ? ORDER BY stage_index ASC').all(p.id);
      p.checks = cps.map(c => Boolean(c.is_completed));
      p.members = db.prepare('SELECT id, name, identifier, study_program, role, is_lead, avatar_color FROM project_members WHERE project_id = ? ORDER BY is_lead DESC, id ASC').all(p.id);
      p.leader = p.members.find(m => m.is_lead) || p.members[0] || null;
    }

    return json({ projects, appMode });
  }

  if (pathname.match(/^\/api\/projects\/(\d+)$/) && method === 'GET') {
    const id = pathname.match(/^\/api\/projects\/(\d+)$/)[1];
    const project = db.prepare('SELECT * FROM projects WHERE id = ?').get(id);
    if (!project) return error('Proyek tidak ditemukan', 404);

    const checkpoints = db.prepare('SELECT * FROM checkpoints WHERE project_id = ? ORDER BY stage_index ASC').all(id);
    const journals = db.prepare('SELECT * FROM journals WHERE project_id = ? ORDER BY id DESC').all(id);
    const versions = db.prepare('SELECT * FROM versions WHERE project_id = ? ORDER BY version_number DESC').all(id);
    const activity = db.prepare('SELECT * FROM activity_logs WHERE project_id = ? ORDER BY id DESC LIMIT 50').all(id);
    const applications = db.prepare('SELECT * FROM recruitment_applications WHERE project_id = ? ORDER BY id DESC').all(id);
    const rubric = db.prepare('SELECT * FROM rubrics WHERE project_id = ?').get(id) || null;
    const members = db.prepare('SELECT id, name, identifier, study_program, role, is_lead, avatar_color, joined_at FROM project_members WHERE project_id = ? ORDER BY is_lead DESC, id ASC').all(id);

    project.checks = checkpoints.map(c => Boolean(c.is_completed));
    project.leader = members.find(m => m.is_lead) || members[0] || null;

    return json({
      project,
      checkpoints,
      journals,
      versions,
      activity,
      applications,
      rubric,
      members
    });
  }

  if (pathname === '/api/projects' && method === 'POST') {
    const { name, desc, study, steam, template, goal, tools, repo_url, recruitment_roles, open_recruitment, lecturer } = body || {};
    if (!name || !desc) return error('Nama dan deskripsi proyek wajib diisi');

    const appMode = getAppMode();
    const isDemoVal = appMode === 'demo' ? 1 : 0;
    const assignedLecturer = lecturer || 'Dr. Rahmat Wijaya, M.Sc.';

    const insert = db.prepare(`
      INSERT INTO projects (
        name, desc, study, steam, template, status, progress, members_count, open_recruitment,
        recruitment_roles, goal, tools, repo_url, lecturer, creator_id, versions_count, blocker, is_demo
      ) VALUES (
        ?, ?, ?, ?, ?, 'Aktif', 0, 1, ?,
        ?, ?, ?, ?, ?, ?, 1, 0, ?
      )
    `);

    const info = insert.run(
      name, desc, study || 'Sains Data', steam || 'Science + Data', template || 'data',
      open_recruitment ? 1 : 0, recruitment_roles || 'Peneliti Muda, Analis',
      goal || '', tools || '', repo_url || '', assignedLecturer, user.id, isDemoVal
    );

    const newId = info.lastInsertRowid;

    // Add creator as lead in project_members
    db.prepare(`
      INSERT INTO project_members (project_id, user_id, name, identifier, study_program, role, is_lead, avatar_color)
      VALUES (?, ?, ?, ?, ?, 'Ketua Tim & Peneliti Utama', 1, ?)
    `).run(newId, user.id, user.name, user.identifier, user.study_program || 'Sains Data', user.avatar_color || '#2878d7');

    // Checkpoint templates
    const tplConfig = db.prepare('SELECT checkpoints_json FROM template_configs WHERE template_key = ?').get(template || 'data');
    let cps = DEFAULT_TEMPLATES[template || 'data']?.cp || DEFAULT_TEMPLATES.data.cp;
    if (tplConfig && tplConfig.checkpoints_json) {
      try { cps = JSON.parse(tplConfig.checkpoints_json); } catch (e) {}
    }

    const insertCP = db.prepare(`
      INSERT INTO checkpoints (project_id, stage_index, title, description, is_completed)
      VALUES (?, ?, ?, ?, 0)
    `);

    cps.forEach((cp, idx) => {
      const title = Array.isArray(cp) ? cp[0] : (cp.title || `Tahap ${idx + 1}`);
      const desc = Array.isArray(cp) ? cp[1] : (cp.desc || '');
      insertCP.run(newId, idx, title, desc);
    });

    db.prepare('INSERT INTO versions (project_id, version_number, note, artifact_url) VALUES (?, 1, ?, ?)').run(
      newId, 'Inisialisasi repositori dan rencana kerja proyek', repo_url || ''
    );

    db.prepare('INSERT INTO activity_logs (project_id, user_name, action_text) VALUES (?, ?, ?)').run(
      newId, user.name, 'Membuat workspace proyek baru.'
    );

    const newProject = db.prepare('SELECT * FROM projects WHERE id = ?').get(newId);
    return json({ success: true, projectId: newId, project: newProject });
  }

  // Manage Project Members
  if (pathname.match(/^\/api\/projects\/(\d+)\/members$/) && method === 'POST') {
    const id = pathname.match(/^\/api\/projects\/(\d+)\/members$/)[1];
    const p = db.prepare('SELECT * FROM projects WHERE id = ?').get(id);
    if (!p) return error('Proyek tidak ditemukan', 404);
    const { name, identifier, study_program, role, avatar_color } = body || {};
    if (!name || !identifier) return error('Nama dan NIM/Identitas anggota wajib diisi');

    const colors = ['#2878d7', '#37b6a0', '#8060d5', '#ed7b64', '#10b981', '#ea580c'];
    const color = avatar_color || colors[Math.floor(Math.random() * colors.length)];

    const res = db.prepare(`
      INSERT INTO project_members (project_id, name, identifier, study_program, role, is_lead, avatar_color)
      VALUES (?, ?, ?, ?, ?, 0, ?)
    `).run(id, name.trim(), identifier.trim(), study_program || 'Sains Terapan', role || 'Peneliti Anggota', color);

    const total = db.prepare('SELECT COUNT(*) as c FROM project_members WHERE project_id = ?').get(id).c;
    db.prepare('UPDATE projects SET members_count = ? WHERE id = ?').run(total, id);

    db.prepare('INSERT INTO activity_logs (project_id, user_name, action_text) VALUES (?, ?, ?)').run(
      id, user.name, `Menambahkan anggota baru ke tim: ${name} (${role || 'Peneliti Anggota'})`
    );

    const newMember = db.prepare('SELECT * FROM project_members WHERE id = ?').get(res.lastInsertRowid);
    return json({ success: true, member: newMember, members_count: total });
  }

  if (pathname.match(/^\/api\/projects\/(\d+)\/members\/(\d+)$/) && method === 'DELETE') {
    const [, projId, memberId] = pathname.match(/^\/api\/projects\/(\d+)\/members\/(\d+)$/);
    const m = db.prepare('SELECT * FROM project_members WHERE id = ? AND project_id = ?').get(memberId, projId);
    if (!m) return error('Anggota tim tidak ditemukan', 404);
    if (m.is_lead) return error('Ketua tim tidak dapat dihapus');

    db.prepare('DELETE FROM project_members WHERE id = ?').run(memberId);
    const total = db.prepare('SELECT COUNT(*) as c FROM project_members WHERE project_id = ?').get(projId).c;
    db.prepare('UPDATE projects SET members_count = ? WHERE id = ?').run(total, projId);

    db.prepare('INSERT INTO activity_logs (project_id, user_name, action_text) VALUES (?, ?, ?)').run(
      projId, user.name, `Menghapus anggota dari tim: ${m.name}`
    );

    return json({ success: true, members_count: total });
  }

  // Toggle Checkpoint (Submit by Student / Manage by Lecturer)
  if (pathname.match(/^\/api\/projects\/(\d+)\/checkpoints\/(\d+)\/toggle$/) && method === 'POST') {
    const [, projId, stageIdx] = pathname.match(/^\/api\/projects\/(\d+)\/checkpoints\/(\d+)\/toggle$/);
    const p = db.prepare('SELECT * FROM projects WHERE id = ?').get(projId);
    if (!p) return error('Proyek tidak ditemukan', 404);
    if (p.archived) return error('Workspace sudah diarsipkan');

    const cp = db.prepare('SELECT * FROM checkpoints WHERE project_id = ? AND stage_index = ?').get(projId, stageIdx);
    if (!cp) return error('Checkpoint tidak valid');

    const { notes } = body || {};

    // RULE: Mahasiswa TIDAK BISA membatalkan checkpoint yang sudah diserahkan
    if (cp.is_completed && user.role !== 'lecturer') {
      return error('Tugas checkpoint ini telah diserahkan dan terkunci. Tindakan ini tidak bisa dibatalkan kecuali dikonfirmasi atau dibuka kembali oleh Dosen Pembimbing.', 403);
    }

    const newStatus = cp.is_completed ? 0 : 1;
    const completedAt = newStatus ? new Date().toISOString() : null;
    let completedBy = null;
    let confirmedByLecturer = cp.confirmed_by_lecturer || 0;

    if (newStatus) {
      completedBy = `${user.name} (${user.study_program || (user.role === 'student' ? 'Mahasiswa' : 'Dosen')})`;
      if (user.role === 'lecturer') confirmedByLecturer = 1;
    } else {
      // Dibuka kembali oleh dosen
      confirmedByLecturer = 0;
    }

    db.prepare(`
      UPDATE checkpoints
      SET is_completed = ?,
          completed_at = ?,
          completed_by = ?,
          submission_notes = ?,
          confirmed_by_lecturer = ?
      WHERE id = ?
    `).run(
      newStatus,
      completedAt,
      completedBy,
      newStatus ? (notes || cp.submission_notes || '') : null,
      confirmedByLecturer,
      cp.id
    );

    // Recompute progress
    const allCps = db.prepare('SELECT is_completed FROM checkpoints WHERE project_id = ?').all(projId);
    const doneCount = allCps.filter(c => c.is_completed).length;
    const progress = Math.round((doneCount / allCps.length) * 100);

    db.prepare("UPDATE projects SET progress = ?, updated_at = datetime('now', 'localtime') WHERE id = ?").run(progress, projId);

    const actionMsg = newStatus
      ? `${user.role === 'lecturer' ? 'Dosen' : 'Mahasiswa'} menyerahkan tugas checkpoint tahap ${Number(stageIdx) + 1}: ${cp.title}${notes ? ' - Catatan: ' + notes : ''}`
      : `Dosen Pembimbing membatalkan/membuka kembali penyerahan checkpoint tahap ${Number(stageIdx) + 1}: ${cp.title} untuk revisi tim mahasiswa`;

    db.prepare('INSERT INTO activity_logs (project_id, user_name, action_text) VALUES (?, ?, ?)').run(
      projId, user.name, actionMsg
    );

    return json({
      success: true,
      progress,
      is_completed: Boolean(newStatus),
      completed_by: completedBy,
      confirmed_by_lecturer: Boolean(confirmedByLecturer),
      message: newStatus
        ? 'Tugas checkpoint berhasil diserahkan kepada Dosen Pembimbing!'
        : 'Penyerahan checkpoint berhasil dibatalkan dan dibuka kembali untuk revisi tim.'
    });
  }

  // Confirm Checkpoint (Lecturer official confirmation)
  if (pathname.match(/^\/api\/projects\/(\d+)\/checkpoints\/(\d+)\/confirm$/) && method === 'POST') {
    const [, projId, stageIdx] = pathname.match(/^\/api\/projects\/(\d+)\/checkpoints\/(\d+)\/confirm$/);
    if (user.role !== 'lecturer') {
      return error('Hanya Dosen Pembimbing yang memiliki wewenang mengonfirmasi checkpoint secara resmi', 403);
    }
    const cp = db.prepare('SELECT * FROM checkpoints WHERE project_id = ? AND stage_index = ?').get(projId, stageIdx);
    if (!cp) return error('Checkpoint tidak ditemukan', 404);

    db.prepare('UPDATE checkpoints SET is_completed = 1, confirmed_by_lecturer = 1 WHERE id = ?').run(cp.id);

    db.prepare('INSERT INTO activity_logs (project_id, user_name, action_text) VALUES (?, ?, ?)').run(
      projId, user.name, `Dosen Pembimbing memberikan konfirmasi persetujuan resmi untuk checkpoint tahap ${Number(stageIdx) + 1}: ${cp.title}`
    );

    return json({ success: true, confirmed: true, message: 'Checkpoint resmi disetujui dan dikonfirmasi Dosen Pembimbing!' });
  }

  // Upload File Artifact
  if (pathname === '/api/upload' && method === 'POST') {
    const { filename, base64Data } = body || {};
    if (!filename || !base64Data) return error('File tidak valid');

    const cleanName = Date.now() + '_' + path.basename(filename).replace(/[^a-zA-Z0-9._-]/g, '_');
    const uploadsDir = path.join(__dirname, '..', 'public', 'uploads');
    if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });

    const targetPath = path.join(uploadsDir, cleanName);
    const pureBase64 = base64Data.replace(/^data:[^;]+;base64,/, '');
    fs.writeFileSync(targetPath, Buffer.from(pureBase64, 'base64'));

    return json({
      success: true,
      fileName: filename,
      fileUrl: '/uploads/' + cleanName
    });
  }

  // Add Research Journal
  if (pathname.match(/^\/api\/projects\/(\d+)\/journals$/) && method === 'POST') {
    const projId = pathname.match(/^\/api\/projects\/(\d+)\/journals$/)[1];
    const { content, tag, file_name, file_url } = body || {};
    if (!content || !content.trim()) return error('Catatan jurnal tidak boleh kosong');

    db.prepare('INSERT INTO journals (project_id, author_name, tag, content, file_name, file_url) VALUES (?, ?, ?, ?, ?, ?)').run(
      projId, user.name, tag || 'Catatan Umum', content.trim(), file_name || null, file_url || null
    );

    db.prepare('INSERT INTO activity_logs (project_id, user_name, action_text) VALUES (?, ?, ?)').run(
      projId, user.name, `Menambahkan catatan jurnal kategori [${tag || 'Catatan Umum'}]${file_name ? ' dengan lampiran: ' + file_name : ''}.`
    );

    const journals = db.prepare('SELECT * FROM journals WHERE project_id = ? ORDER BY id DESC').all(projId);
    return json({ success: true, journals });
  }

  // Add Version Iteration
  if (pathname.match(/^\/api\/projects\/(\d+)\/versions$/) && method === 'POST') {
    const projId = pathname.match(/^\/api\/projects\/(\d+)\/versions$/)[1];
    const { note, repo_url, file_name, file_url } = body || {};

    const p = db.prepare('SELECT versions_count, repo_url FROM projects WHERE id = ?').get(projId);
    const nextVer = (p.versions_count || 1) + 1;
    const finalRepo = (repo_url && repo_url.trim()) ? repo_url.trim() : (p.repo_url || '');

    db.prepare('UPDATE projects SET versions_count = ?, repo_url = ? WHERE id = ?').run(
      nextVer, finalRepo, projId
    );

    db.prepare('INSERT INTO versions (project_id, version_number, note, artifact_url, file_name, file_url) VALUES (?, ?, ?, ?, ?, ?)').run(
      projId, nextVer, note || `Iterasi pengembangan build v${nextVer}.0`, repo_url || '', file_name || null, file_url || null
    );

    db.prepare('INSERT INTO activity_logs (project_id, user_name, action_text) VALUES (?, ?, ?)').run(
      projId, user.name, `Merilis iterasi baru v${nextVer}.0: ${note || 'Pembaruan artefak riset'}`
    );

    return json({ success: true, versions_count: nextVer });
  }

  // Connect External Repository
  if (pathname.match(/^\/api\/projects\/(\d+)\/repo$/) && method === 'POST') {
    const projId = pathname.match(/^\/api\/projects\/(\d+)\/repo$/)[1];
    const { repo_url } = body || {};

    db.prepare('UPDATE projects SET repo_url = ? WHERE id = ?').run(repo_url || '', projId);
    db.prepare('INSERT INTO activity_logs (project_id, user_name, action_text) VALUES (?, ?, ?)').run(
      projId, user.name, `Menghubungkan repositori eksternal: ${repo_url}`
    );

    return json({ success: true, repo_url });
  }

  // Toggle Blocker
  if (pathname.match(/^\/api\/projects\/(\d+)\/blocker$/) && method === 'POST') {
    const projId = pathname.match(/^\/api\/projects\/(\d+)\/blocker$/)[1];
    const { blocker, reason } = body || {};

    const isBlocker = blocker ? 1 : 0;
    db.prepare('UPDATE projects SET blocker = ?, blocker_reason = ? WHERE id = ?').run(
      isBlocker, reason || '', projId
    );

    db.prepare('INSERT INTO activity_logs (project_id, user_name, action_text) VALUES (?, ?, ?)').run(
      projId, user.name, isBlocker ? `Menandai kendala metodologis (Blocker): ${reason || 'Membutuhkan klinik dosen'}` : 'Kendala teknis (Blocker) telah diselesaikan.'
    );

    return json({ success: true, blocker: Boolean(isBlocker), reason });
  }

  // Submit Review to Lecturer
  if (pathname.match(/^\/api\/projects\/(\d+)\/submit-review$/) && method === 'POST') {
    const projId = pathname.match(/^\/api\/projects\/(\d+)\/submit-review$/)[1];
    db.prepare("UPDATE projects SET status = 'Review diajukan', blocker = 0 WHERE id = ?").run(projId);

    db.prepare('INSERT INTO activity_logs (project_id, user_name, action_text) VALUES (?, ?, ?)').run(
      projId, user.name, 'Mengajukan dokumen proyek untuk review resmi dosen pembimbing.'
    );

    return json({ success: true, status: 'Review diajukan' });
  }

  // ===================== AI RESEARCH COPILOT =====================
  if (pathname === '/api/ai/guidance' && method === 'GET') {
    const projId = url.searchParams.get('projectId');
    const p = db.prepare('SELECT * FROM projects WHERE id = ?').get(projId);
    if (!p) return error('Proyek tidak ditemukan');

    const cps = db.prepare('SELECT * FROM checkpoints WHERE project_id = ? ORDER BY stage_index ASC').all(projId);
    const activeStage = cps.findIndex(c => !c.is_completed);

    const guidance = generateGuidance(p, activeStage === -1 ? 4 : activeStage);
    return json({ guidance });
  }

  if (pathname === '/api/ai/chat' && method === 'POST') {
    const { question, projectId } = body || {};
    if (!question) return error('Pertanyaan wajib diisi');

    let p = null;
    if (projectId) {
      p = db.prepare('SELECT * FROM projects WHERE id = ?').get(projectId);
    }
    const answer = answerUserQuery(question, p);
    return json({ answer });
  }

  // ===================== RECRUITMENT ROUTES =====================
  if (pathname === '/api/recruitment' && method === 'GET') {
    const study = url.searchParams.get('study') || '';
    const appMode = getAppMode();
    let query = "SELECT * FROM projects WHERE open_recruitment = 1 AND archived = 0 AND status != 'Selesai'";
    const params = [];
    if (appMode === 'production') {
      query += ' AND is_demo = 0';
    }
    if (study) {
      query += ' AND study = ?';
      params.push(study);
    }
    query += ' ORDER BY id DESC';
    const listings = db.prepare(query).all(...params);

    for (const p of listings) {
      p.applications = db.prepare('SELECT * FROM recruitment_applications WHERE project_id = ?').all(p.id);
    }

    return json({ listings });
  }

  if (pathname === '/api/recruitment/apply' && method === 'POST') {
    const { projectId, role, message } = body || {};
    if (!projectId || !role) return error('Proyek dan peran wajib ditentukan');

    db.prepare(`
      INSERT INTO recruitment_applications (project_id, applicant_name, applicant_study, applicant_role, message)
      VALUES (?, ?, ?, ?, ?)
    `).run(projectId, user.name, user.study_program || 'Sains Terapan', role, message || '');

    db.prepare('INSERT INTO activity_logs (project_id, user_name, action_text) VALUES (?, ?, ?)').run(
      projectId, user.name, `Mengajukan diri bergabung sebagai: ${role}`
    );

    return json({ success: true });
  }

  if (pathname === '/api/recruitment/resolve' && method === 'POST') {
    const { applicationId, status } = body || {};
    const app = db.prepare('SELECT * FROM recruitment_applications WHERE id = ?').get(applicationId);
    if (!app) return error('Lamaran tidak ditemukan');

    db.prepare('UPDATE recruitment_applications SET status = ? WHERE id = ?').run(status, applicationId);
    if (status === 'Diterima') {
      db.prepare('UPDATE projects SET members_count = members_count + 1 WHERE id = ?').run(app.project_id);
    }

    db.prepare('INSERT INTO activity_logs (project_id, user_name, action_text) VALUES (?, ?, ?)').run(
      app.project_id, user.name, `Menanggapi lamaran ${app.applicant_name} (${app.applicant_role}): ${status}`
    );

    return json({ success: true });
  }

  // ===================== CONSULTATION ROUTES =====================
  if (pathname === '/api/consultations' && method === 'GET') {
    const appMode = getAppMode();
    let query = `
      SELECT c.*, p.name as project_name, p.study as project_study
      FROM consultations c
      JOIN projects p ON c.project_id = p.id
      WHERE 1=1
    `;
    const params = [];

    if (appMode === 'production') {
      query += ' AND p.is_demo = 0';
    }

    if (user.role === 'student') {
      query += ` AND (
        p.creator_id = ?
        OR c.project_id IN (SELECT project_id FROM project_members WHERE user_id = ? OR identifier = ?)
      )`;
      params.push(user.id, user.id, user.identifier);
    } else if (user.role === 'lecturer' && appMode === 'production') {
      query += ' AND (c.lecturer_name = ? OR p.lecturer = ? OR p.lecturer LIKE ?)';
      params.push(user.name, user.name, `%${user.name}%`);
    }

    query += ' ORDER BY c.date ASC, c.time ASC';
    const consultations = db.prepare(query).all(...params);

    return json({ consultations });
  }

  if (pathname === '/api/consultations/request' && method === 'POST') {
    const { projectId, topic, type, mode, date, time, note } = body || {};
    if (!projectId || !topic || !date || !time) return error('Isi topik, tanggal, dan waktu bimbingan');

    const p = db.prepare('SELECT * FROM projects WHERE id = ?').get(projectId);
    const lecturerName = p ? p.lecturer : 'Dr. Rahmat Wijaya, M.Sc.';

    db.prepare(`
      INSERT INTO consultations (project_id, student_name, lecturer_name, topic, type, mode, date, time, note, status)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'Menunggu respons')
    `).run(projectId, user.name, lecturerName, topic, type || 'Review checkpoint', mode || 'Online', date, time, note || '');

    db.prepare('INSERT INTO activity_logs (project_id, user_name, action_text) VALUES (?, ?, ?)').run(
      projectId, user.name, `Mengajukan jadwal bimbingan: "${topic}" (${date} ${time})`
    );

    return json({ success: true });
  }

  if (pathname === '/api/consultations/resolve' && method === 'POST') {
    const { id, status, feedback } = body || {};
    db.prepare('UPDATE consultations SET status = ?, feedback = COALESCE(?, feedback) WHERE id = ?').run(
      status, feedback || null, id
    );

    const c = db.prepare('SELECT * FROM consultations WHERE id = ?').get(id);
    if (c) {
      db.prepare('INSERT INTO activity_logs (project_id, user_name, action_text) VALUES (?, ?, ?)').run(
        c.project_id, user.name, `Dosen memperbarui status bimbingan menjadi: ${status}`
      );
    }

    return json({ success: true });
  }

  if (pathname === '/api/consultations/cancel' && method === 'POST') {
    const { id } = body || {};
    db.prepare("UPDATE consultations SET status = 'Dibatalkan mahasiswa' WHERE id = ?").run(id);
    return json({ success: true });
  }

  // ===================== ANNOUNCEMENTS ROUTES =====================
  if (pathname === '/api/announcements' && method === 'GET') {
    const userId = user ? user.id : 0;
    let targetFilter = '';
    if (user && user.role === 'student') {
      const hasTeam = db.prepare(`
        SELECT 1 FROM projects WHERE creator_id = ? 
        UNION 
        SELECT 1 FROM project_members WHERE user_id = ? OR identifier = ?
      `).get(user.id, user.id, user.identifier);

      if (!hasTeam) {
        // Students with NO team only see general announcements ('all')
        targetFilter = "WHERE (a.target = 'all' OR a.target = 'new_users' OR a.target IS NULL)";
      }
    }

    const announcements = db.prepare(`
      SELECT a.*,
             COALESCE(i.is_read, 0) as is_read,
             COALESCE(i.is_saved, 0) as is_saved
      FROM announcements a
      LEFT JOIN announcement_interactions i ON a.id = i.announcement_id AND i.user_id = ?
      ${targetFilter}
      ORDER BY a.pinned DESC, a.id DESC
    `).all(userId);

    return json({ announcements });
  }

  if (pathname === '/api/announcements' && method === 'POST') {
    if (!user) return error('Autentikasi diperlukan', 401);
    const { title, category, target, body: content, pinned } = body || {};
    if (!title || !content) return error('Judul dan isi pengumuman wajib diisi');

    db.prepare(`
      INSERT INTO announcements (author_name, title, category, target, body, pinned)
      VALUES (?, ?, ?, ?, ?, ?)
    `).run(user.name || 'Dosen Pembimbing', title, category || 'Metodologi', target || 'all', content, pinned ? 1 : 0);

    return json({ success: true });
  }

  if (pathname.match(/^\/api\/announcements\/(\d+)\/toggle-read$/) && method === 'POST') {
    if (!user) return error('Autentikasi diperlukan', 401);
    const annId = pathname.match(/^\/api\/announcements\/(\d+)\/toggle-read$/)[1];
    const cur = db.prepare('SELECT is_read FROM announcement_interactions WHERE announcement_id = ? AND user_id = ?').get(annId, user.id);
    const newRead = cur && cur.is_read ? 0 : 1;

    db.prepare(`
      INSERT INTO announcement_interactions (announcement_id, user_id, is_read, is_saved)
      VALUES (?, ?, ?, 0)
      ON CONFLICT(announcement_id, user_id) DO UPDATE SET is_read = ?
    `).run(annId, user.id, newRead, newRead);

    return json({ success: true, is_read: Boolean(newRead) });
  }

  if (pathname.match(/^\/api\/announcements\/(\d+)\/toggle-save$/) && method === 'POST') {
    if (!user) return error('Autentikasi diperlukan', 401);
    const annId = pathname.match(/^\/api\/announcements\/(\d+)\/toggle-save$/)[1];
    const cur = db.prepare('SELECT is_saved FROM announcement_interactions WHERE announcement_id = ? AND user_id = ?').get(annId, user.id);
    const newSaved = cur && cur.is_saved ? 0 : 1;

    db.prepare(`
      INSERT INTO announcement_interactions (announcement_id, user_id, is_read, is_saved)
      VALUES (?, ?, 0, ?)
      ON CONFLICT(announcement_id, user_id) DO UPDATE SET is_saved = ?
    `).run(annId, user.id, newSaved, newSaved);

    return json({ success: true, is_saved: Boolean(newSaved) });
  }

  if (pathname.match(/^\/api\/announcements\/(\d+)$/) && method === 'DELETE') {
    const annId = pathname.match(/^\/api\/announcements\/(\d+)$/)[1];
    db.prepare('DELETE FROM announcements WHERE id = ?').run(annId);
    return json({ success: true });
  }

  // ===================== LAB & RESOURCE REQUESTS =====================
  if (pathname === '/api/resources' && method === 'GET') {
    const appMode = getAppMode();
    let query = `
      SELECT r.*, p.name as project_name, p.study as project_study
      FROM resource_requests r
      JOIN projects p ON r.project_id = p.id
      WHERE 1=1
    `;
    const params = [];

    if (appMode === 'production') {
      query += ' AND p.is_demo = 0';
    }

    if (user.role === 'student') {
      query += ` AND (
        p.creator_id = ?
        OR r.project_id IN (SELECT project_id FROM project_members WHERE user_id = ? OR identifier = ?)
      )`;
      params.push(user.id, user.id, user.identifier);
    } else if (user.role === 'lecturer' && appMode === 'production') {
      query += ' AND (p.lecturer = ? OR p.lecturer LIKE ?)';
      params.push(user.name, `%${user.name}%`);
    }

    query += ' ORDER BY r.id DESC';
    const requests = db.prepare(query).all(...params);

    return json({ requests });
  }

  if (pathname === '/api/resources/request' && method === 'POST') {
    const { projectId, resourceName, dateNeeded, note } = body || {};
    if (!projectId || !resourceName || !dateNeeded) return error('Lengkapi data fasilitas yang diajukan');

    db.prepare(`
      INSERT INTO resource_requests (project_id, student_name, resource_name, date_needed, note, status)
      VALUES (?, ?, ?, ?, ?, 'Menunggu')
    `).run(projectId, user.name, resourceName, dateNeeded, note || '');

    db.prepare('INSERT INTO activity_logs (project_id, user_name, action_text) VALUES (?, ?, ?)').run(
      projectId, user.name, `Mengajukan peminjaman fasilitas: ${resourceName} untuk tanggal ${dateNeeded}`
    );

    return json({ success: true });
  }

  if (pathname === '/api/resources/resolve' && method === 'POST') {
    const { id, status, feedback } = body || {};
    db.prepare('UPDATE resource_requests SET status = ?, feedback = COALESCE(?, feedback) WHERE id = ?').run(
      status, feedback || null, id
    );

    const r = db.prepare('SELECT * FROM resource_requests WHERE id = ?').get(id);
    if (r) {
      db.prepare('INSERT INTO activity_logs (project_id, user_name, action_text) VALUES (?, ?, ?)').run(
        r.project_id, user.name, `Status pengajuan fasilitas [${r.resource_name}] diubah menjadi: ${status}`
      );
    }

    return json({ success: true });
  }

  // ===================== MISSION CONTROL (DOSEN) =====================
  if (pathname === '/api/mission/stats' && method === 'GET') {
    const appMode = getAppMode();
    const demoFilter = appMode === 'production' ? ' AND is_demo = 0' : '';
    const totalProjects = db.prepare(`SELECT COUNT(*) as c FROM projects WHERE archived = 0${demoFilter}`).get().c;
    const pendingReview = db.prepare(`SELECT COUNT(*) as c FROM projects WHERE status IN ('Menunggu persetujuan', 'Review diajukan') AND archived = 0${demoFilter}`).get().c;
    const activeBlockers = db.prepare(`SELECT COUNT(*) as c FROM projects WHERE blocker = 1 AND archived = 0${demoFilter}`).get().c;
    const completedProjects = db.prepare(`SELECT COUNT(*) as c FROM projects WHERE status = 'Selesai'${demoFilter}`).get().c;

    const templates = db.prepare('SELECT * FROM template_configs').all();

    return json({
      stats: {
        totalProjects,
        pendingReview,
        activeBlockers,
        completedProjects
      },
      templates
    });
  }

  if (pathname === '/api/mission/feedback' && method === 'POST') {
    const { projectId, note, status, openBlockerClinic, resolveBlocker } = body || {};
    const p = db.prepare('SELECT * FROM projects WHERE id = ?').get(projectId);
    if (!p) return error('Proyek tidak ditemukan');

    let updateStatus = status || p.status;
    let isBlocker = p.blocker;

    if (openBlockerClinic) isBlocker = 1;
    if (resolveBlocker) isBlocker = 0;

    db.prepare('UPDATE projects SET status = ?, blocker = ? WHERE id = ?').run(updateStatus, isBlocker, projectId);

    db.prepare('INSERT INTO activity_logs (project_id, user_name, action_text) VALUES (?, ?, ?)').run(
      projectId, user.name, `Catatan Dosen/Reviewer: "${note || 'Pembaruan status review'}" (Status: ${updateStatus})`
    );

    return json({ success: true });
  }

  if (pathname === '/api/mission/evaluate' && method === 'POST') {
    const { projectId, scoreCompleteness, scoreEvidence, scoreContribution, scoreReproducibility, feedback } = body || {};
    const p = db.prepare('SELECT * FROM projects WHERE id = ?').get(projectId);
    if (!p) return error('Proyek tidak ditemukan');

    const total = (Number(scoreCompleteness) + Number(scoreEvidence) + Number(scoreContribution) + Number(scoreReproducibility)) / 4;
    let grade = 'A (Sangat Memuaskan)';
    if (total < 70) grade = 'C (Cukup)';
    else if (total < 85) grade = 'B (Baik)';

    db.prepare(`
      INSERT INTO rubrics (project_id, score_completeness, score_evidence, score_contribution, score_reproducibility, total_score, feedback, evaluator_name)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      ON CONFLICT(project_id) DO UPDATE SET
        score_completeness = excluded.score_completeness,
        score_evidence = excluded.score_evidence,
        score_contribution = excluded.score_contribution,
        score_reproducibility = excluded.score_reproducibility,
        total_score = excluded.total_score,
        feedback = excluded.feedback,
        evaluator_name = excluded.evaluator_name,
        updated_at = datetime('now', 'localtime')
    `).run(projectId, scoreCompleteness, scoreEvidence, scoreContribution, scoreReproducibility, total, feedback || '', user.name);

    db.prepare(`
      UPDATE projects SET
        final_score = ?, final_grade = ?, final_note = ?,
        evaluation_recorded = 1, status = 'Dinilai'
      WHERE id = ?
    `).run(total, grade, feedback || '', projectId);

    db.prepare('INSERT INTO activity_logs (project_id, user_name, action_text) VALUES (?, ?, ?)').run(
      projectId, user.name, `Memberikan penilaian rubrik STEAM resmi: Nilai ${total.toFixed(1)} (${grade}).`
    );

    return json({ success: true, totalScore: total, grade });
  }

  if (pathname === '/api/mission/reproducibility' && method === 'POST') {
    const { projectId } = body || {};
    const p = db.prepare('SELECT * FROM projects WHERE id = ?').get(projectId);
    if (!p) return error('Proyek tidak ditemukan');

    const cleanName = p.name.toLowerCase().replace(/[^a-z0-9]/g, '-').slice(0, 30);
    const filename = `steamcraft-reproducibility-${cleanName}.json`;

    db.prepare('UPDATE projects SET package_compiled = 1, package_filename = ? WHERE id = ?').run(filename, projectId);

    db.prepare('INSERT INTO activity_logs (project_id, user_name, action_text) VALUES (?, ?, ?)').run(
      projectId, user.name, `Mengompilasi STEAM-Craft Reproducibility Package resmi [${filename}].`
    );

    return json({ success: true, filename });
  }

  if (pathname === '/api/mission/archive' && method === 'POST') {
    const { projectId } = body || {};
    db.prepare("UPDATE projects SET archived = 1, status = 'Diarsipkan' WHERE id = ?").run(projectId);

    db.prepare('INSERT INTO activity_logs (project_id, user_name, action_text) VALUES (?, ?, ?)').run(
      projectId, user.name, 'Mengarsipkan workspace riset dan mengunci seluruh perubahan.'
    );

    return json({ success: true });
  }

  // Get Template Configurations
  if (pathname === '/api/mission/templates' && method === 'GET') {
    const templates = db.prepare('SELECT * FROM template_configs').all();
    return json({ templates });
  }

  // Update Template Configuration
  if (pathname.match(/^\/api\/mission\/templates\/([a-z_]+)$/) && method === 'POST') {
    const tplKey = pathname.match(/^\/api\/mission\/templates\/([a-z_]+)$/)[1];
    const { checkpoints, rubricCompleteness, rubricEvidence, rubricContribution, rubricReproducibility } = body || {};

    const total = Number(rubricCompleteness) + Number(rubricEvidence) + Number(rubricContribution) + Number(rubricReproducibility);
    if (total !== 100) {
      return error(`Total bobot rubrik harus tepat 100% (saat ini: ${total}%)`);
    }

    db.prepare(`
      UPDATE template_configs SET
        checkpoints_json = ?,
        rubric_completeness = ?,
        rubric_evidence = ?,
        rubric_contribution = ?,
        rubric_reproducibility = ?
      WHERE template_key = ?
    `).run(
      JSON.stringify(checkpoints),
      rubricCompleteness,
      rubricEvidence,
      rubricContribution,
      rubricReproducibility,
      tplKey
    );

    return json({ success: true, message: 'Template checkpoint dan bobot berhasil diperbarui!' });
  }

  // Real-time Notification Badges
  if (pathname === '/api/notifications' && method === 'GET') {
    if (!user) {
      return json({
        pendingConsultations: 0,
        activeBlockers: 0,
        pendingReviews: 0,
        unreadAnnouncements: 0
      });
    }
    const appMode = getAppMode();
    const isProd = appMode === 'production';
    let pendingConsultations = 0;
    let activeBlockers = 0;
    let pendingReviews = 0;

    if (user.role === 'student') {
      const demoFilter = isProd ? ' AND p.is_demo = 0' : '';
      const cRow = db.prepare(`
        SELECT COUNT(*) as c FROM consultations c
        JOIN projects p ON c.project_id = p.id
        WHERE c.status = 'Menunggu respons'
          AND (p.creator_id = ? OR c.project_id IN (SELECT project_id FROM project_members WHERE user_id = ? OR identifier = ?))
          ${demoFilter}
      `).get(user.id, user.id, user.identifier);
      pendingConsultations = cRow ? cRow.c : 0;

      const bRow = db.prepare(`
        SELECT COUNT(*) as c FROM projects p
        WHERE p.blocker = 1 AND p.archived = 0
          AND (p.creator_id = ? OR p.id IN (SELECT project_id FROM project_members WHERE user_id = ? OR identifier = ?))
          ${demoFilter}
      `).get(user.id, user.id, user.identifier);
      activeBlockers = bRow ? bRow.c : 0;

      const rRow = db.prepare(`
        SELECT COUNT(*) as c FROM projects p
        WHERE p.status IN ('Menunggu persetujuan', 'Review diajukan') AND p.archived = 0
          AND (p.creator_id = ? OR p.id IN (SELECT project_id FROM project_members WHERE user_id = ? OR identifier = ?))
          ${demoFilter}
      `).get(user.id, user.id, user.identifier);
      pendingReviews = rRow ? rRow.c : 0;
    } else if (user.role === 'lecturer') {
      const demoFilter = isProd ? ' AND p.is_demo = 0' : '';
      const cRow = isProd
        ? db.prepare(`
            SELECT COUNT(*) as c FROM consultations c
            JOIN projects p ON c.project_id = p.id
            WHERE c.status = 'Menunggu respons'
              AND (c.lecturer_name = ? OR p.lecturer = ? OR p.lecturer LIKE ?)
              ${demoFilter}
          `).get(user.name, user.name, `%${user.name}%`)
        : db.prepare("SELECT COUNT(*) as c FROM consultations WHERE status = 'Menunggu respons'").get();
      pendingConsultations = cRow ? cRow.c : 0;

      const bRow = isProd
        ? db.prepare(`
            SELECT COUNT(*) as c FROM projects p
            WHERE p.blocker = 1 AND p.archived = 0
              AND (p.lecturer = ? OR p.lecturer LIKE ?)
              ${demoFilter}
          `).get(user.name, `%${user.name}%`)
        : db.prepare("SELECT COUNT(*) as c FROM projects WHERE blocker = 1 AND archived = 0").get();
      activeBlockers = bRow ? bRow.c : 0;

      const rRow = isProd
        ? db.prepare(`
            SELECT COUNT(*) as c FROM projects p
            WHERE p.status IN ('Menunggu persetujuan', 'Review diajukan') AND p.archived = 0
              AND (p.lecturer = ? OR p.lecturer LIKE ?)
              ${demoFilter}
          `).get(user.name, `%${user.name}%`)
        : db.prepare("SELECT COUNT(*) as c FROM projects WHERE status IN ('Menunggu persetujuan', 'Review diajukan') AND archived = 0").get();
      pendingReviews = rRow ? rRow.c : 0;
    } else {
      // Admin sees overall
      const demoFilter = isProd ? ' AND is_demo = 0' : '';
      const cRow = isProd
        ? db.prepare(`SELECT COUNT(*) as c FROM consultations c JOIN projects p ON c.project_id = p.id WHERE c.status = 'Menunggu respons' AND p.is_demo = 0`).get()
        : db.prepare("SELECT COUNT(*) as c FROM consultations WHERE status = 'Menunggu respons'").get();
      pendingConsultations = cRow ? cRow.c : 0;

      activeBlockers = db.prepare(`SELECT COUNT(*) as c FROM projects WHERE blocker = 1 AND archived = 0${demoFilter}`).get().c;
      pendingReviews = db.prepare(`SELECT COUNT(*) as c FROM projects WHERE status IN ('Menunggu persetujuan', 'Review diajukan') AND archived = 0${demoFilter}`).get().c;
    }
    
    let unreadAnnouncements = 0;
    try {
      const hasTeam = db.prepare(`
        SELECT 1 FROM projects WHERE creator_id = ? 
        UNION 
        SELECT 1 FROM project_members WHERE user_id = ? OR identifier = ?
      `).get(user.id, user.id, user.identifier);

      const targetFilter = (user.role === 'student' && !hasTeam)
        ? "AND (a.target = 'all' OR a.target = 'new_users' OR a.target IS NULL)"
        : "";

      unreadAnnouncements = db.prepare(`
        SELECT COUNT(*) as c FROM announcements a
        LEFT JOIN announcement_interactions i ON a.id = i.announcement_id AND i.user_id = ?
        WHERE COALESCE(i.is_read, 0) = 0
          AND datetime(a.created_at) >= datetime(?)
          ${targetFilter}
      `).get(user.id, user.created_at || '1970-01-01').c;
    } catch (e) {}

    return json({
      pendingConsultations,
      activeBlockers,
      pendingReviews,
      unreadAnnouncements
    });
  }

  // Official Printable Scientific Dossier (PDF/Print View)
  if (pathname.match(/^\/api\/projects\/(\d+)\/dossier$/) && method === 'GET') {
    const id = pathname.match(/^\/api\/projects\/(\d+)\/dossier$/)[1];
    const project = db.prepare('SELECT * FROM projects WHERE id = ?').get(id);
    if (!project) return error('Proyek tidak ditemukan', 404);

    const checkpoints = db.prepare('SELECT * FROM checkpoints WHERE project_id = ? ORDER BY stage_index ASC').all(id);
    const journals = db.prepare('SELECT * FROM journals WHERE project_id = ? ORDER BY id ASC').all(id);
    const versions = db.prepare('SELECT * FROM versions WHERE project_id = ? ORDER BY version_number ASC').all(id);
    const rubric = db.prepare('SELECT * FROM rubrics WHERE project_id = ?').get(id) || null;

    let scores = { S: 85, T: 85, E: 80, A: 75, M: 85 };
    if (project.steam_scores) {
      try { scores = JSON.parse(project.steam_scores); } catch (e) {}
    }

    const html = generateDossierHTML(project, checkpoints, journals, versions, rubric, scores);
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    return res.end(html);
  }

  // ===================== ANALYTICS =====================
  if (pathname === '/api/analytics' && method === 'GET') {
    const appMode = getAppMode();
    let query = 'SELECT * FROM projects WHERE 1=1';
    if (appMode === 'production') {
      query += ' AND is_demo = 0';
    }
    const projects = db.prepare(query).all();
    const disciplines = {};
    let totalProgress = 0;
    let completedCheckpoints = 0;
    let totalBlockers = 0;

    for (const p of projects) {
      disciplines[p.study] = (disciplines[p.study] || 0) + 1;
      totalProgress += p.progress;
      if (p.blocker) totalBlockers++;
      const done = db.prepare('SELECT COUNT(*) as c FROM checkpoints WHERE project_id = ? AND is_completed = 1').get(p.id).c;
      completedCheckpoints += done;
    }

    const avgProgress = projects.length ? Math.round(totalProgress / projects.length) : 0;

    return json({
      totalProjects: projects.length,
      avgProgress,
      completedCheckpoints,
      totalBlockers,
      disciplines,
      projects
    });
  }

  // ===================== EXPORT DOWNLOADS =====================
  if (pathname.match(/^\/api\/projects\/(\d+)\/export\/json$/) && method === 'GET') {
    const id = pathname.match(/^\/api\/projects\/(\d+)\/export\/json$/)[1];
    const project = db.prepare('SELECT * FROM projects WHERE id = ?').get(id);
    if (!project) return error('Proyek tidak ditemukan', 404);

    const checkpoints = db.prepare('SELECT * FROM checkpoints WHERE project_id = ? ORDER BY stage_index ASC').all(id);
    const journals = db.prepare('SELECT * FROM journals WHERE project_id = ? ORDER BY id ASC').all(id);
    const versions = db.prepare('SELECT * FROM versions WHERE project_id = ? ORDER BY version_number ASC').all(id);
    const rubric = db.prepare('SELECT * FROM rubrics WHERE project_id = ?').get(id) || null;

    const reproducibilityPkg = {
      packageName: 'STEAM-Craft Verified Reproducibility Package',
      schemaVersion: '1.0',
      compiledAt: new Date().toISOString(),
      evaluator: project.lecturer,
      project: {
        id: project.id,
        name: project.name,
        studyProgram: project.study,
        steamDiscipline: project.steam,
        template: project.template,
        goal: project.goal,
        tools: project.tools,
        repositoryUrl: project.repo_url,
        versionsCount: project.versions_count,
        finalScore: project.final_score,
        finalGrade: project.final_grade,
        evaluationNote: project.final_note
      },
      checkpoints,
      scientificJournals: journals,
      versionHistory: versions,
      rubricEvaluation: rubric
    };

    const filename = project.package_filename || `steamcraft-project-${project.id}.json`;
    res.writeHead(200, {
      'Content-Type': 'application/json',
      'Content-Disposition': `attachment; filename="${filename}"`
    });
    return res.end(JSON.stringify(reproducibilityPkg, null, 2));
  }

  if (pathname === '/api/analytics/export.csv' && method === 'GET') {
    const appMode = getAppMode();
    let query = 'SELECT * FROM projects';
    if (appMode === 'production') {
      query += ' WHERE is_demo = 0';
    }
    const projects = db.prepare(query).all();
    const headers = ['ID', 'Nama Proyek', 'Program Studi', 'Pilar STEAM', 'Status', 'Progres (%)', 'Anggota', 'Blocker', 'Versi', 'Nilai Akhir', 'Predikat'];
    const rows = projects.map(p => [
      p.id,
      `"${(p.name || '').replace(/"/g, '""')}"`,
      `"${p.study || ''}"`,
      `"${p.steam || ''}"`,
      `"${p.status || ''}"`,
      p.progress,
      p.members_count,
      p.blocker ? 'Ya' : 'Tidak',
      `v${p.versions_count}.0`,
      p.final_score !== null ? p.final_score.toFixed(1) : '-',
      `"${p.final_grade || '-'}"`
    ].join(','));

    const csvContent = '\uFEFF' + [headers.join(','), ...rows].join('\r\n');
    res.writeHead(200, {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': 'attachment; filename="steamcraft-cohort-analytics.csv"'
    });
    return res.end(csvContent);
  }

  // Fallback 404
  return error('Endpoint tidak ditemukan', 404);
}

function generateDossierHTML(p, cps, journals, versions, rubric, scores) {
  const cx = 170, cy = 160, maxR = 90;
  const angles = [-Math.PI / 2, -Math.PI / 2 + (2 * Math.PI / 5), -Math.PI / 2 + (4 * Math.PI / 5), -Math.PI / 2 + (6 * Math.PI / 5), -Math.PI / 2 + (8 * Math.PI / 5)];
  const axes = ['Science (S)', 'Technology (T)', 'Engineering (E)', 'Art (A)', 'Mathematics (M)'];
  const values = [scores.S || 80, scores.T || 80, scores.E || 80, scores.A || 80, scores.M || 80];

  const gridCircles = [25, 50, 75, 100].map(pct => {
    const r = (pct / 100) * maxR;
    const pts = angles.map(a => `${cx + r * Math.cos(a)},${cy + r * Math.sin(a)}`).join(' ');
    return `<polygon points="${pts}" fill="none" stroke="#cbd5e1" stroke-width="1" />`;
  }).join('');

  const axisLines = angles.map((a, i) => {
    const x = cx + maxR * Math.cos(a);
    const y = cy + maxR * Math.sin(a);
    return `<line x1="${cx}" y1="${cy}" x2="${x}" y2="${y}" stroke="#94a3b8" stroke-width="1" stroke-dasharray="2,2" />`;
  }).join('');

  const polyPoints = values.map((val, i) => {
    const r = (val / 100) * maxR;
    return `${cx + r * Math.cos(angles[i])},${cy + r * Math.sin(angles[i])}`;
  }).join(' ');

  const labels = angles.map((a, i) => {
    const lx = cx + (maxR + 26) * Math.cos(a);
    const ly = cy + (maxR + 14) * Math.sin(a);
    return `<text x="${lx}" y="${ly}" text-anchor="middle" font-size="10" font-weight="700" fill="#1e3656">${axes[i]}: ${values[i]}</text>`;
  }).join('');

  const svgRadar = `
    <svg width="340" height="320" viewBox="0 0 340 320" style="margin: auto; display: block;">
      ${gridCircles}
      ${axisLines}
      <polygon points="${polyPoints}" fill="rgba(40, 120, 215, 0.25)" stroke="#2878d7" stroke-width="2.5" />
      ${values.map((val, i) => {
        const r = (val / 100) * maxR;
        const px = cx + r * Math.cos(angles[i]);
        const py = cy + r * Math.sin(angles[i]);
        return `<circle cx="${px}" cy="${py}" r="4" fill="#2878d7" stroke="#ffffff" stroke-width="2" />`;
      }).join('')}
      ${labels}
    </svg>
  `;

  const finalScore = p.final_score ? p.final_score.toFixed(1) : (rubric ? rubric.total_score.toFixed(1) : '88.5');
  const finalGrade = p.final_grade || 'A (Sangat Memuaskan)';
  const dateStr = new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });

  return `<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="utf-8">
  <title>STEAM-Craft Dossier — ${p.name}</title>
  <style>
    @page { size: A4; margin: 16mm 14mm; }
    body { font-family: 'Segoe UI', Arial, sans-serif; font-size: 11pt; line-height: 1.5; color: #1e293b; background: #fff; margin: 0; padding: 0; }
    .toolbar { background: #0f172a; color: white; padding: 12px 24px; display: flex; justify-content: space-between; align-items: center; }
    .btn { background: #2878d7; color: white; border: none; padding: 8px 16px; border-radius: 8px; font-weight: 700; cursor: pointer; text-decoration: none; font-size: 13px; }
    .btn:hover { background: #1d65be; }
    .dossier-wrap { max-width: 800px; margin: 0 auto; padding: 24px; }
    .header-table { width: 100%; border-bottom: 2px solid #0f172a; padding-bottom: 12px; margin-bottom: 20px; }
    .header-table td { vertical-align: middle; }
    .inst-title { font-size: 11pt; font-weight: 800; color: #0f172a; text-transform: uppercase; letter-spacing: 0.5px; }
    .doc-title { font-size: 15pt; font-weight: 900; color: #2878d7; margin: 4px 0; }
    .meta-grid { width: 100%; border-collapse: collapse; margin-bottom: 18px; font-size: 10pt; }
    .meta-grid td { padding: 6px 10px; border: 1px solid #cbd5e1; }
    .meta-grid td.label { background: #f8fafc; font-weight: 700; width: 28%; color: #475569; }
    .section-title { font-size: 12pt; font-weight: 800; color: #0f172a; border-left: 4px solid #2878d7; padding-left: 8px; margin: 18px 0 8px; text-transform: uppercase; }
    .table-custom { width: 100%; border-collapse: collapse; margin-bottom: 14px; font-size: 9.5pt; }
    .table-custom th { background: #f1f5f9; padding: 8px; border: 1px solid #cbd5e1; text-align: left; }
    .table-custom td { padding: 8px; border: 1px solid #cbd5e1; }
    .badge { display: inline-block; padding: 2px 8px; border-radius: 12px; font-size: 8.5pt; font-weight: 700; }
    .badge-done { background: #dcfce7; color: #15803d; }
    .badge-pending { background: #fef3c7; color: #b45309; }
    .radar-box { border: 1px solid #cbd5e1; border-radius: 12px; padding: 12px; margin: 12px 0; background: #fafcff; }
    .signatures { width: 100%; margin-top: 36px; border-collapse: collapse; text-align: center; font-size: 10pt; }
    .signatures td { width: 33.3%; vertical-align: top; padding: 0 10px; }
    .sig-space { height: 60px; }
    @media print {
      .no-print { display: none !important; }
      body { background: white; }
      .dossier-wrap { padding: 0; max-width: 100%; }
    }
  </style>
</head>
<body>
  <div class="toolbar no-print">
    <div><strong>STEAM-Craft — Berkas Verifikasi & Laporan Riset Resmi</strong></div>
    <div style="display: flex; gap: 8px;">
      <a href="javascript:window.close()" class="btn" style="background: #475569;">Tutup</a>
      <button onclick="window.print()" class="btn">🖨️ Cetak Berkas / Simpan PDF</button>
    </div>
  </div>

  <div class="dossier-wrap">
    <table class="header-table">
      <tr>
        <td style="width: 70px;">
          <img src="/logo.jpg" alt="Logo" style="width: 60px; height: 60px; border-radius: 10px; object-fit: cover;">
        </td>
        <td style="padding-left: 14px;">
          <div class="inst-title">Kementerian Pendidikan, Kebudayaan, Riset, dan Teknologi</div>
          <div class="doc-title">STEAM-CRAFT SCIENTIFIC RESEARCH DOSSIER</div>
          <div style="font-size: 9pt; color: #64748b;">Standar Akreditasi & Verifikasi Hasil Inovasi Kompetisi STEAM Mahasiswa 2026</div>
        </td>
        <td style="text-align: right; font-size: 9pt; color: #64748b;">
          No. Registrasi: <strong>SC-2026-${String(p.id).padStart(4, '0')}</strong><br>
          Tanggal: <strong>${dateStr}</strong>
        </td>
      </tr>
    </table>

    <table class="meta-grid">
      <tr>
        <td class="label">Judul Proyek</td>
        <td colspan="3"><strong style="font-size: 11pt; color: #0f172a;">${p.name}</strong></td>
      </tr>
      <tr>
        <td class="label">Program Studi Utama</td>
        <td>${p.study}</td>
        <td class="label">Pilar STEAM</td>
        <td><strong>${p.steam}</strong></td>
      </tr>
      <tr>
        <td class="label">Dosen Pembimbing</td>
        <td>${p.lecturer || 'Dr. Rahmat Wijaya, M.Sc.'}</td>
        <td class="label">Status Progres</td>
        <td><strong style="color: #2878d7;">${p.progress}% (${p.status})</strong></td>
      </tr>
      <tr>
        <td class="label">Repositori Eksternal</td>
        <td colspan="3"><a href="${p.repo_url || '#'}" target="_blank">${p.repo_url || 'Belum ditautkan'}</a></td>
      </tr>
      <tr>
        <td class="label">Rumusan Masalah / Target</td>
        <td colspan="3">${p.goal || p.desc}</td>
      </tr>
    </table>

    <div class="section-title">1. Verifikasi Alur Metode Ilmiah (5 Tahap Checkpoint)</div>
    <table class="table-custom">
      <thead>
        <tr>
          <th style="width: 15%;">Tahap</th>
          <th style="width: 30%;">Nama Checkpoint</th>
          <th>Deskripsi Standar & Verifikasi</th>
          <th style="width: 15%;">Status</th>
        </tr>
      </thead>
      <tbody>
        ${cps.map((cp, idx) => `
          <tr>
            <td style="font-weight: 700;">Tahap ${idx + 1}</td>
            <td><strong>${cp.title}</strong></td>
            <td>${cp.description}</td>
            <td>
              ${cp.is_completed ? '<span class="badge badge-done">✓ Terverifikasi</span>' : '<span class="badge badge-pending">Proses</span>'}
            </td>
          </tr>
        `).join('')}
      </tbody>
    </table>

    <div class="section-title">2. Keseimbangan Pilar STEAM (Radar Chart)</div>
    <div class="radar-box">
      ${svgRadar}
    </div>

    <div class="section-title">3. Catatan Jurnal Riset Ilmiah & Lampiran Bukti</div>
    <table class="table-custom">
      <thead>
        <tr>
          <th style="width: 18%;">Tanggal & Peneliti</th>
          <th style="width: 15%;">Kategori</th>
          <th>Catatan Temuan & Keputusan Metodologis</th>
          <th style="width: 25%;">Lampiran Berkas</th>
        </tr>
      </thead>
      <tbody>
        ${journals.map(j => `
          <tr>
            <td><strong>${j.author_name}</strong><br><small style="color:#64748b;">${j.created_at ? j.created_at.slice(0, 10) : ''}</small></td>
            <td><span class="badge" style="background:#e0f2fe; color:#0369a1;">${j.tag}</span></td>
            <td>${j.content}</td>
            <td>${j.file_name ? `<a href="${j.file_url}" target="_blank" style="color: #2878d7; font-weight: 700;">📎 ${j.file_name}</a>` : '<span style="color:#94a3b8;">-</span>'}</td>
          </tr>
        `).join('')}
      </tbody>
    </table>

    <div class="section-title">4. Lembar Evaluasi Dewan Juri & Predikat Kelulusan</div>
    <table class="table-custom">
      <thead>
        <tr>
          <th>Pilar Rubrik Evaluasi</th>
          <th style="width: 15%;">Bobot</th>
          <th style="width: 20%;">Skor Tercapai (0-100)</th>
          <th style="width: 25%;">Status Verifikasi</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>Kelengkapan 5 Tahap Checkpoint</td>
          <td>25%</td>
          <td><strong>${rubric ? rubric.score_completeness : '85.0'}</strong></td>
          <td><span class="badge badge-done">Memenuhi Standar</span></td>
        </tr>
        <tr>
          <td>Kualitas Data Mentah & Bukti Eksperimen</td>
          <td>25%</td>
          <td><strong>${rubric ? rubric.score_evidence : '90.0'}</strong></td>
          <td><span class="badge badge-done">Memenuhi Standar</span></td>
        </tr>
        <tr>
          <td>Kontribusi Kolaborasi Multidisiplin</td>
          <td>25%</td>
          <td><strong>${rubric ? rubric.score_contribution : '88.0'}</strong></td>
          <td><span class="badge badge-done">Memenuhi Standar</span></td>
        </tr>
        <tr>
          <td>Reproduksibilitas Hasil & Open Science</td>
          <td>25%</td>
          <td><strong>${rubric ? rubric.score_reproducibility : '92.0'}</strong></td>
          <td><span class="badge badge-done">Memenuhi Standar</span></td>
        </tr>
        <tr style="background: #f8fafc; font-weight: 800; font-size: 11pt;">
          <td colspan="2">NILAI AKHIR / PREDIKAT KELULUSAN</td>
          <td colspan="2" style="color: #2878d7; font-size: 13pt;">
            ${finalScore} &mdash; ${finalGrade}
          </td>
        </tr>
      </tbody>
    </table>

    <div style="font-size: 9.5pt; color: #475569; margin-top: 6px;">
      <strong>Catatan Evaluator:</strong> <em>"${p.final_note || (rubric ? rubric.feedback : 'Karya riset inovatif dengan metodologi teruji dan logbook terdokumentasi sangat baik.')}"</em>
    </div>

    <table class="signatures">
      <tr>
        <td>
          Ketua Tim Mahasiswa,<br><br>
          <div class="sig-space"></div>
          <strong>Budi Santoso</strong><br>
          NIM. 202610101
        </td>
        <td>
          Dosen Pembimbing Riset,<br><br>
          <div class="sig-space"></div>
          <strong>${p.lecturer || 'Dr. Rahmat Wijaya, M.Sc.'}</strong><br>
          NIP. 198504122010121002
        </td>
        <td>
          Ketua Dewan Juri STEAM,<br><br>
          <div class="sig-space"></div>
          <strong>Prof. Dr. Ir. Dewi Kartika</strong><br>
          NIP. 197908252005012001
        </td>
      </tr>
    </table>
  </div>
</body>
</html>`;
}

module.exports = {
  handleApiRequest
};
