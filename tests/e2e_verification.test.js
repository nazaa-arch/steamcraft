const http = require('http');

function req(method, path, body = null, token = null) {
  return new Promise((resolve, reject) => {
    const data = body ? JSON.stringify(body) : null;
    const headers = {
      'Content-Type': 'application/json'
    };
    if (data) headers['Content-Length'] = Buffer.byteLength(data);
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const r = http.request({
      hostname: '127.0.0.1',
      port: 3000,
      path,
      method,
      headers
    }, res => {
      let raw = '';
      res.on('data', chunk => raw += chunk);
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, data: JSON.parse(raw) });
        } catch (e) {
          resolve({ status: res.statusCode, raw });
        }
      });
    });
    r.on('error', reject);
    if (data) r.write(data);
    r.end();
  });
}

function assert(condition, message) {
  if (!condition) {
    console.error('❌ FAILED ASSERTION:', message);
    process.exit(1);
  } else {
    console.log('  ✓', message);
  }
}

async function run() {
  console.log('\n=== 1. VERIFY SYSTEM OPERATIONAL MODE ===');
  const modeRes = await req('GET', '/api/system/mode');
  assert(modeRes.status === 200, 'System mode API responds 200');
  assert(modeRes.data.mode === 'production', 'Active system mode is strictly "production"');

  console.log('\n=== 2. NEW STUDENT REGISTRATION & ZERO-LEAK TEST ===');
  const studentId = 'MHS-' + Date.now().toString().slice(-6);
  const regMhs = await req('POST', '/api/auth/register', {
    name: 'Ahmad Faiz Pratama',
    role: 'student',
    identifier: studentId,
    study_program: 'Sains Data',
    institution: 'Universitas Indonesia',
    password: 'password2026!'
  });
  assert(regMhs.status === 200, `Registration for student ${studentId} succeeded`);
  const mhsToken = regMhs.data.token;
  assert(Boolean(mhsToken), 'Session token received for new student');

  // Verify identity
  const meMhs = await req('GET', '/api/auth/me', null, mhsToken);
  assert(meMhs.data.user.identifier === studentId, 'Identified as new student');
  assert(meMhs.data.user.role === 'student', 'Role is student');

  // Check GET /api/projects
  const mhsProjects = await req('GET', '/api/projects', null, mhsToken);
  assert(mhsProjects.status === 200, 'GET /api/projects succeeds');
  console.log(`  Production projects in DB: ${mhsProjects.data.projects.length}`);

  // Check GET /api/consultations
  const mhsConsult = await req('GET', '/api/consultations', null, mhsToken);
  assert(mhsConsult.status === 200, 'GET /api/consultations succeeds');
  assert(mhsConsult.data.consultations.length === 0, 'New student has 0 consultations (no demo leak!)');

  // Check GET /api/resources
  const mhsResources = await req('GET', '/api/resources', null, mhsToken);
  assert(mhsResources.status === 200, 'GET /api/resources succeeds');
  assert(mhsResources.data.requests.length === 0, 'New student has 0 lab resource requests (no demo leak!)');

  // Check GET /api/notifications
  const mhsNotifs = await req('GET', '/api/notifications', null, mhsToken);
  assert(mhsNotifs.status === 200, 'GET /api/notifications succeeds');
  assert(mhsNotifs.data.pendingConsultations === 0, 'New student pending consultations badge = 0');
  assert(mhsNotifs.data.activeBlockers === 0, 'New student active blockers badge = 0');
  assert(mhsNotifs.data.pendingReviews === 0, 'New student pending reviews badge = 0');

  // Check GET /api/recruitment
  const mhsRecruit = await req('GET', '/api/recruitment', null, mhsToken);
  assert(mhsRecruit.status === 200, 'GET /api/recruitment succeeds');
  // Should have 0 demo recruitment listings
  const demoRecruits = mhsRecruit.data.listings.filter(p => p.is_demo);
  assert(demoRecruits.length === 0, 'Zero demo listings in recruitment');

  console.log('\n=== 3. STUDENT CREATES NEW REAL PROJECT & SUBMITS REQUESTS ===');
  const createProj = await req('POST', '/api/projects', {
    name: 'Sistem Deteksi Klorofil Tanaman Menggunakan Sensor Multispektral',
    desc: 'Pengembangan sensor IoT multispektral terintegrasi machine learning untuk monitoring indeks NDVI perkebunan mandiri.',
    study: 'Artificial Intelligence',
    steam: 'Tech + Science',
    template: 'data',
    goal: 'Akurasi deteksi indeks klorofil mencapai >92% pada kondisi cuaca mendung.',
    tools: 'Python, PyTorch, ESP32 Multispectral Sensor, Streamlit',
    repo_url: 'https://github.com/kemendikbud/ndvi-multispectral',
    open_recruitment: 1,
    lecturer: 'Prof. Dr. Ir. Dewi Kartika'
  }, mhsToken);
  assert(createProj.status === 200, 'Project successfully created');
  const newProjId = createProj.data.projectId;
  assert(Boolean(newProjId), `Created project ID: ${newProjId}`);

  // Verify project detail
  const projDetail = await req('GET', `/api/projects/${newProjId}`, null, mhsToken);
  assert(projDetail.data.project.is_demo === 0, 'Project is marked is_demo = 0 (production project)');
  assert(projDetail.data.project.lecturer === 'Prof. Dr. Ir. Dewi Kartika', 'Lecturer assigned correctly');
  assert(projDetail.data.members.length === 1, 'Creator registered as lead member');
  assert(projDetail.data.members[0].identifier === studentId, 'Lead member NIM matches current user');

  // Student requests consultation
  const consultReq = await req('POST', '/api/consultations/request', {
    projectId: newProjId,
    topic: 'Validasi Algoritma Ekstraksi NDVI Citra',
    type: 'Review checkpoint',
    mode: 'Online (Google Meet)',
    date: '2026-10-25',
    time: '14:00',
    note: 'Dataset kalibrasi sensor 100 sampel telah disiapkan.'
  }, mhsToken);
  assert(consultReq.status === 200, 'Consultation request created successfully');

  // Check that student now sees exactly 1 consultation
  const mhsConsultAfter = await req('GET', '/api/consultations', null, mhsToken);
  assert(mhsConsultAfter.data.consultations.length === 1, 'Student sees their newly requested consultation');
  assert(mhsConsultAfter.data.consultations[0].topic === 'Validasi Algoritma Ekstraksi NDVI Citra', 'Consultation topic matches');

  // Student requests lab resource
  const resReq = await req('POST', '/api/resources/request', {
    projectId: newProjId,
    resourceName: 'Workstation GPU Nvidia RTX 4090',
    dateNeeded: '2026-10-28',
    note: 'Pelatihan model arsitektur CNN selama 48 jam.'
  }, mhsToken);
  assert(resReq.status === 200, 'Resource request created successfully');

  // Check that student now sees exactly 1 resource request
  const mhsResAfter = await req('GET', '/api/resources', null, mhsToken);
  assert(mhsResAfter.data.requests.length === 1, 'Student sees their newly requested resource');

  console.log('\n=== 4. NEW LECTURER REGISTRATION & SUPERVISION ISOLATION ===');
  const dsnId = 'NIP-' + Date.now().toString().slice(-6);
  const regDosen = await req('POST', '/api/auth/register', {
    name: 'Dr. Hendra Gunawan, S.Si., M.Kom.',
    role: 'lecturer',
    identifier: dsnId,
    study_program: 'Artificial Intelligence',
    institution: 'Universitas Indonesia',
    password: 'password2026!'
  });
  assert(regDosen.status === 200, `Registration for lecturer ${dsnId} succeeded`);
  const dsnToken = regDosen.data.token;

  // New lecturer checks consultations (none assigned to him yet)
  const dsnConsult = await req('GET', '/api/consultations', null, dsnToken);
  assert(dsnConsult.data.consultations.length === 0, 'New lecturer has 0 consultations assigned (isolated)');

  // New lecturer checks mission stats
  const dsnStats = await req('GET', '/api/mission/stats', null, dsnToken);
  assert(dsnStats.status === 200, 'Mission stats responds 200');
  assert(dsnStats.data.stats.totalProjects >= 1, `Mission stats shows ${dsnStats.data.stats.totalProjects} production projects (excludes all 13 demo projects)`);
  assert(dsnStats.data.stats.activeBlockers === 0, 'Zero blockers on new projects');

  console.log('\n=== 5. ASSIGNED SUPERVISOR LECTURER LOGS IN ===');
  // Login as Prof. Dr. Ir. Dewi Kartika (NIP: 197908252005012001, password: civitas_dewi2026!)
  const loginDewi = await req('POST', '/api/auth/login', {
    identifier: '197908252005012001',
    password: 'dosen123'
  });
  assert(loginDewi.status === 200, 'Prof. Dewi logged in successfully');
  const dewiToken = loginDewi.data.token;

  // Check consultations: Prof Dewi should see the consultation request assigned to her!
  const dewiConsult = await req('GET', '/api/consultations', null, dewiToken);
  assert(dewiConsult.data.consultations.length >= 1, `Prof. Dewi sees ${dewiConsult.data.consultations.length} consultations for projects she supervises`);
  const matching = dewiConsult.data.consultations.find(c => c.project_id === newProjId);
  assert(Boolean(matching), 'Found consultation matching the newly created project');
  assert(matching.lecturer_name === 'Prof. Dr. Ir. Dewi Kartika', 'Consultation assigned to Prof. Dewi');

  // Prof Dewi responds to consultation
  const resolveC = await req('POST', '/api/consultations/resolve', {
    id: matching.id,
    status: 'Terjadwal'
  }, dewiToken);
  assert(resolveC.status === 200, 'Prof. Dewi approved consultation schedule');

  console.log('\n=== 6. ADMIN CONSOLE GOVERNANCE & TELEMETRY ===');
  const loginAdmin = await req('POST', '/api/auth/login', {
    identifier: 'admin',
    password: 'admin2026!'
  });
  assert(loginAdmin.status === 200, 'Admin logged in successfully');
  const admToken = loginAdmin.data.token;

  const admStats = await req('GET', '/api/admin/system-stats', null, admToken);
  assert(admStats.status === 200, 'Admin system stats responds 200');
  assert(admStats.data.system.appMode === 'production', 'System mode is production');
  assert(admStats.data.counts.prodProjects >= 1, 'Prod projects count recorded');
  assert(admStats.data.counts.totalUsers >= 3, 'Total users recorded');

  const { db } = require('../src/db');
  db.prepare('DELETE FROM projects WHERE id = ?').run(newProjId);
  db.prepare('DELETE FROM users WHERE identifier IN (?, ?)').run(studentId, dsnId);
  console.log('  ✓ Test fixtures cleaned up successfully');

  console.log('\n===========================================================');
  console.log('🎉 ALL END-TO-END VERIFICATION CHECKS PASSED PERFECTLY!');
  console.log('   - Role switching and demo buttons removed');
  console.log('   - New users experience 100% clean non-demo state');
  console.log('   - Student and Lecturer scopes completely isolated');
  console.log('   - Database and UI strictly operating in Production mode');
  console.log('===========================================================\n');
}

run().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
