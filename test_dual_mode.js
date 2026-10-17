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

function extractCookie(headers) {
  const sc = headers['set-cookie'];
  if (!sc) return '';
  if (Array.isArray(sc)) {
    return sc.map(c => c.split(';')[0]).join('; ');
  }
  return sc.split(';')[0];
}

async function runTests() {
  console.log('=== TEST SUITE: DUAL APPLICATION MODE & PRODUCTION READINESS ===\n');

  console.log('--- TEST 1: Memverifikasi Endpoint Mode Sistem (GET & POST /api/system/mode) ---');
  // Set ke demo dulu
  const setDemoRes = await request('/api/system/mode', 'POST', { mode: 'demo' });
  assert.strictEqual(setDemoRes.status, 200, 'POST /api/system/mode harus 200 OK');
  assert.strictEqual(setDemoRes.data.mode, 'demo');

  const getModeRes = await request('/api/system/mode');
  assert.strictEqual(getModeRes.status, 200);
  assert.strictEqual(getModeRes.data.mode, 'demo', 'Mode aktif awal harus demo');
  console.log('✓ Mode sistem berhasil disetel ke "demo".');

  console.log('\n--- TEST 2: Memverifikasi Daftar Proyek pada Mode Demo (Harus ada 13 proyek lomba) ---');
  const demoProjectsRes = await request('/api/projects');
  assert.strictEqual(demoProjectsRes.status, 200);
  const demoList = demoProjectsRes.data.projects;
  assert(demoList.length >= 13, `Mode demo harus memiliki minimal 13 proyek lomba, didapat: ${demoList.length}`);
  console.log(`✓ Mode Demo mengembalikan ${demoList.length} proyek riset multidisiplin lengkap.`);

  console.log('\n--- TEST 3: Beralih ke Mode Operasi Riil (Production Mode) ---');
  const setProdRes = await request('/api/system/mode', 'POST', { mode: 'production' });
  assert.strictEqual(setProdRes.status, 200);
  assert.strictEqual(setProdRes.data.mode, 'production');

  const prodProjectsRes = await request('/api/projects');
  assert.strictEqual(prodProjectsRes.status, 200);
  const prodList = prodProjectsRes.data.projects;
  console.log(`✓ Proyek pada Mode Operasi Riil sebelum penambahan proyek baru: ${prodList.length} proyek.`);
  // Pastikan proyek demo disaring keluar
  const hasDemoInProd = prodList.some(p => p.is_demo === 1);
  assert.strictEqual(hasDemoInProd, false, 'Mode Operasi Riil TIDAK BOLEH memuat proyek bertanda is_demo = 1');
  console.log('✓ Proyek demo 100% terisolasi dan tidak tampil di Mode Operasi Riil.');

  console.log('\n--- TEST 4: Registrasi Peneliti Baru Civitas Akademika (POST /api/auth/register) ---');
  const uniqueUser = 'peneliti_' + Date.now();
  const regPayload = {
    name: 'Dr. Ilham Saputra, M.Si.',
    username: uniqueUser,
    password: 'Password123!',
    role: 'lecturer',
    study_program: 'Bioteknologi',
    nip: '198905202021021005'
  };

  const regRes = await request('/api/auth/register', 'POST', regPayload);
  assert.strictEqual(regRes.status, 200, 'Registrasi harus berhasil (200 OK)');
  assert.strictEqual(regRes.data.user.username, uniqueUser);
  assert.strictEqual(regRes.data.user.role, 'lecturer');
  assert(regRes.data.user.id, 'Harus mendapatkan user ID setelah registrasi');
  console.log(`✓ Akun "${regPayload.name}" (@${uniqueUser}) berhasil terdaftar dan aktif.`);

  console.log('\n--- TEST 5: Membuat Proyek Riset Baru di Mode Operasi Riil ---');
  const newProjectPayload = {
    name: 'Bioremediasi Limbah Mikroplastik Perairan Industri',
    study: 'Bioteknologi',
    desc: 'Pengembangan teknologi pengurai polimer sintetis ramah lingkungan di muara sungai perkotaan.',
    goal: 'Isolasi dan pemurnian koloni bakteri pengurai PET',
    status: 'Inisiasi Riset'
  };

  const createProjRes = await request('/api/projects', 'POST', newProjectPayload);
  assert.strictEqual(createProjRes.status, 200, 'Pembuatan proyek harus 200 OK');
  assert.strictEqual(createProjRes.data.project.name, newProjectPayload.name);
  assert.strictEqual(createProjRes.data.project.is_demo, 0, 'Proyek yang dibuat pada mode production harus memiliki is_demo = 0');
  console.log(`✓ Proyek riil baru "${createProjRes.data.project.name}" berhasil dibuat dengan flag is_demo = 0.`);

  console.log('\n--- TEST 6: Memverifikasi Proyek Riil Tampil di Mode Operasi Riil ---');
  const verifyProdRes = await request('/api/projects');
  const updatedProdList = verifyProdRes.data.projects;
  const createdInList = updatedProdList.find(p => p.id === createProjRes.data.project.id);
  assert(createdInList, 'Proyek riil yang baru dibuat harus muncul di katalog Mode Operasi Riil');
  console.log(`✓ Terverifikasi: Katalog Mode Operasi Riil sekarang menampilkan proyek riil (${updatedProdList.length} proyek).`);

  console.log('\n--- TEST 7: Kembalikan Mode ke Demo Lomba untuk Kebutuhan Penjurian ---');
  await request('/api/system/mode', 'POST', { mode: 'demo' });
  const finalDemoRes = await request('/api/projects');
  assert(finalDemoRes.data.projects.length >= 14, 'Mode Demo harus menampilkan 13 proyek lomba + proyek baru');
  console.log(`✓ Mode Demo aktif kembali dengan total ${finalDemoRes.data.projects.length} proyek.`);

  console.log('\n=== SEMUA 7 PENGUJIAN DUAL APPLICATION MODE BERHASIL 100% ===');
}

runTests().catch(err => {
  console.error('\n❌ TEST GAGAL:', err);
  process.exit(1);
});
