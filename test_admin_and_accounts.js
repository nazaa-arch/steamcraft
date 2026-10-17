const http = require('http');
const assert = require('assert');

function request(path, method = 'GET', data = null, headers = {}) {
  return new Promise((resolve, reject) => {
    const opts = {
      hostname: 'localhost',
      port: 3000,
      path,
      method,
      headers: {
        'Content-Type': 'application/json',
        ...headers
      }
    };
    const req = http.request(opts, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        try {
          const parsed = JSON.parse(body);
          resolve({ status: res.statusCode, headers: res.headers, data: parsed });
        } catch (e) {
          resolve({ status: res.statusCode, headers: res.headers, data: body });
        }
      });
    });
    req.on('error', reject);
    if (data) {
      req.write(JSON.stringify(data));
    }
    req.end();
  });
}

async function runTests() {
  console.log('=== TEST SUITE: ADMINISTRATOR / DEV ACCOUNT & USER GOVERNANCE ===\n');

  console.log('--- TEST 1: Memverifikasi Akun Administrator / Lead Dev (@admin) ---');
  const loginAdminRes = await request('/api/auth/login', 'POST', {
    username: 'admin',
    password: 'admin2026!'
  });
  assert.strictEqual(loginAdminRes.status, 200, 'Login admin dengan password admin2026! harus 200 OK');
  assert.strictEqual(loginAdminRes.data.user.username, 'admin');
  assert.strictEqual(loginAdminRes.data.user.role, 'admin', 'Role user harus admin');
  console.log(`✓ Berhasil login sebagai Administrator: ${loginAdminRes.data.user.name} (Role: ${loginAdminRes.data.user.role})`);

  console.log('\n--- TEST 2: Memverifikasi Login Menggunakan Identifier (NIM / NIP / ADM-ID) ---');
  const loginByIdRes = await request('/api/auth/login', 'POST', {
    username: 'ADM-2026-DEV01',
    password: 'admin2026!'
  });
  assert.strictEqual(loginByIdRes.status, 200, 'Login dengan ID ADM-2026-DEV01 harus 200 OK');
  assert.strictEqual(loginByIdRes.data.user.username, 'admin');
  console.log('✓ Login via identifier (ADM-2026-DEV01) berhasil.');

  console.log('\n--- TEST 3: Memverifikasi Akun Civitas Akademika Terdaftar (Mode Operasi Riil) ---');
  const loginSarah = await request('/api/auth/login', 'POST', {
    username: 'sarah.biotech',
    password: 'password123'
  });
  assert.strictEqual(loginSarah.status, 200);
  assert.strictEqual(loginSarah.data.user.study_program, 'Bioteknologi');
  console.log(`✓ Akun civitas riil terverifikasi: ${loginSarah.data.user.name} (@sarah.biotech)`);

  const loginHendra = await request('/api/auth/login', 'POST', {
    username: 'prof.hendra',
    password: 'dosen123'
  });
  assert.strictEqual(loginHendra.status, 200);
  assert.strictEqual(loginHendra.data.user.role, 'lecturer');
  console.log(`✓ Akun dosen riil terverifikasi: ${loginHendra.data.user.name} (@prof.hendra)`);

  console.log('\n--- TEST 4: Telemetri Sistem & Database (GET /api/admin/system-stats) ---');
  const statsRes = await request('/api/admin/system-stats');
  assert.strictEqual(statsRes.status, 200);
  const { system, counts } = statsRes.data;
  assert(system.nodeVersion.startsWith('v'), 'Harus menyertakan nodeVersion');
  assert(system.dbSizeKb > 0, 'Ukuran file database SQLite harus > 0 KB');
  assert(counts.totalUsers >= 10, 'Harus ada minimal 10 user terdaftar');
  assert(counts.adminUsers >= 1, 'Harus ada minimal 1 admin');
  console.log(`✓ Telemetri Sistem: Node.js ${system.nodeVersion}, DB SQLite: ${system.dbSizeKb} KB, Total Users: ${counts.totalUsers} (${counts.studentUsers} Mhs, ${counts.lecturerUsers} Dosen, ${counts.adminUsers} Admin)`);

  console.log('\n--- TEST 5: Mengambil Daftar Seluruh Pengguna (GET /api/admin/users) ---');
  const usersRes = await request('/api/admin/users');
  assert.strictEqual(usersRes.status, 200);
  assert(Array.isArray(usersRes.data.users));
  const adminInList = usersRes.data.users.find(u => u.username === 'admin');
  assert(adminInList, 'Akun admin harus ada di daftar pengguna');
  console.log(`✓ Berhasil memuat daftar ${usersRes.data.users.length} akun terdaftar.`);

  console.log('\n--- TEST 6: Proteksi Akun Inti Sistem (DELETE /api/admin/users/:id) ---');
  const deleteAdminAttempt = await request(`/api/admin/users/${adminInList.id}`, 'DELETE');
  assert.strictEqual(deleteAdminAttempt.status, 403, 'Menghapus admin inti harus ditolak (403 Forbidden)');
  console.log(`✓ Proteksi berhasil ditegakkan: "${deleteAdminAttempt.data.error}"`);

  console.log('\n--- TEST 7: Reset Kata Sandi Pengguna (POST /api/admin/users/:id/reset-password) ---');
  const testStudent = usersRes.data.users.find(u => u.username === 'sarah.biotech');
  const resetRes = await request(`/api/admin/users/${testStudent.id}/reset-password`, 'POST', {
    newPassword: 'newpassword2026'
  });
  assert.strictEqual(resetRes.status, 200);
  // Cek login dengan password baru
  const checkNewLogin = await request('/api/auth/login', 'POST', {
    username: 'sarah.biotech',
    password: 'newpassword2026'
  });
  assert.strictEqual(checkNewLogin.status, 200, 'Harus bisa login dengan password yang baru direset');
  console.log('✓ Reset kata sandi pengguna berhasil dan terverifikasi.');

  console.log('\n=== SEMUA 7 PENGUJIAN AKUN ADMINISTRATOR & TATA KELOLA SUKSES 100% ===');
}

runTests().catch(err => {
  console.error('\n❌ TEST GAGAL:', err);
  process.exit(1);
});
