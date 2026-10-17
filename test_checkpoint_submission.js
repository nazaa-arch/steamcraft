const http = require('http');
const assert = require('assert');
const fs = require('fs');

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
  console.log('🧪 Memulai Pengujian Validasi Penyerahan Checkpoint & Kebijakan Dosen...\n');

  // 1. Pastikan role aktif adalah mahasiswa (student)
  console.log('--- 1. Pastikan Sesi Pengguna adalah Mahasiswa ---');
  await request('/api/auth/switch-demo', 'POST', { role: 'student', username: 'budi' });
  const authRes = await request('/api/auth/me');
  assert.strictEqual(authRes.data.user.role, 'student');
  console.log(`✓ Pengguna saat ini: ${authRes.data.user.name} (Role: ${authRes.data.user.role})`);

  // Buka kembali tahap 1 dulu jika sebelumnya completed (via role dosen)
  await request('/api/auth/switch-demo', 'POST', { role: 'lecturer', username: 'dosen' });
  const cpCheck = (await request('/api/projects/1')).data.checkpoints[0];
  if (cpCheck.is_completed) {
    await request('/api/projects/1/checkpoints/0/toggle', 'POST');
  }
  // Kembali ke mahasiswa
  await request('/api/auth/switch-demo', 'POST', { role: 'student', username: 'budi' });

  // 2. Mahasiswa menyerahkan tugas checkpoint dengan konfirmasi "Serahkan"
  console.log('\n--- 2. Mahasiswa Menyerahkan Tugas Checkpoint Tahap 1 ---');
  const submitRes = await request('/api/projects/1/checkpoints/0/toggle', 'POST', {
    notes: 'Hasil telaah 15 jurnal terindeks Scopus dan rumusan 3 hipotesis komputasi telah divalidasi tim kelompok.'
  });
  assert.strictEqual(submitRes.status, 200, 'Penyerahan awal harus berhasil (200 OK)');
  assert.strictEqual(submitRes.data.is_completed, true, 'Status checkpoint harus is_completed = true');
  console.log(`✓ Sukses serahkan: ${submitRes.data.message}`);
  console.log(`✓ Pelaksana tercatat: "${submitRes.data.completed_by}"`);

  // 3. MAHASISWA MENCOBA MEMBATALKAN -> HARUS DITOLAK DENGAN 403
  console.log('\n--- 3. Uji Keamanan: Mahasiswa Mencoba Membatalkan Checkpoint Terkunci ---');
  const cancelAttemptRes = await request('/api/projects/1/checkpoints/0/toggle', 'POST');
  assert.strictEqual(cancelAttemptRes.status, 403, 'Pembatalan oleh mahasiswa WAJIB ditolak dengan status 403 Forbidden');
  assert(
    cancelAttemptRes.data.error.includes('tidak bisa dibatalkan') || cancelAttemptRes.data.error.includes('Dosen Pembimbing'),
    'Pesan penolakan harus memberitahukan bahwa tidak bisa dibatalkan kecuali dikonfirmasi dosen'
  );
  console.log(`✓ Penolakan berhasil ditegakkan: "${cancelAttemptRes.data.error}"`);

  // Verifikasi status checkpoint di database tetap is_completed = 1
  const detailRes = await request('/api/projects/1');
  const cp0 = detailRes.data.checkpoints[0];
  assert.strictEqual(cp0.is_completed, 1, 'Checkpoint harus tetap terkunci 1');
  console.log('✓ Status checkpoint tetap terkunci (is_completed = 1)');

  // 4. DOSEN MEMBATALKAN / MEMBUKA KEMBALI CHECKPOINT UNTUK REVISI
  console.log('\n--- 4. Uji Otoritas Dosen: Dosen Membuka Kembali Checkpoint untuk Revisi ---');
  await request('/api/auth/switch-demo', 'POST', { role: 'lecturer', username: 'dosen' });
  const lecturerMe = await request('/api/auth/me');
  assert.strictEqual(lecturerMe.data.user.role, 'lecturer');

  const reopenRes = await request('/api/projects/1/checkpoints/0/toggle', 'POST');
  assert.strictEqual(reopenRes.status, 200, 'Dosen harus diizinkan membuka kembali checkpoint');
  assert.strictEqual(reopenRes.data.is_completed, false, 'Status harus berubah menjadi belum selesai (false)');
  console.log(`✓ Dosen berhasil membuka revisi: "${reopenRes.data.message}"`);

  // 5. MAHASISWA MENYERAHKAN ULANG DAN DOSEN MEMBERIKAN KONFIRMASI RESMI
  console.log('\n--- 5. Mahasiswa Menyerahkan Ulang & Dosen Memberikan Konfirmasi Resmi ---');
  await request('/api/auth/switch-demo', 'POST', { role: 'student', username: 'budi' });
  await request('/api/projects/1/checkpoints/0/toggle', 'POST', {
    notes: 'Perbaikan instrumen uji coba revisi dosen telah dilengkapi.'
  });

  // Switch ke dosen untuk konfirmasi resmi
  await request('/api/auth/switch-demo', 'POST', { role: 'lecturer', username: 'dosen' });
  const confirmRes = await request('/api/projects/1/checkpoints/0/confirm', 'POST');
  assert.strictEqual(confirmRes.status, 200, 'Dosen konfirmasi checkpoint harus 200 OK');
  assert.strictEqual(confirmRes.data.confirmed, true);
  console.log(`✓ Konfirmasi resmi dosen berhasil: "${confirmRes.data.message}"`);

  // 6. Verifikasi Frontend DOM & Modal Check
  console.log('\n--- 6. Verifikasi Komponen Frontend di index.html & app.js ---');
  const htmlContent = fs.readFileSync('public/index.html', 'utf8');
  assert(htmlContent.includes('id="submitCheckpointModal"'), 'Modal submitCheckpointModal harus ada di index.html');
  assert(htmlContent.includes('Serahkan'), 'Harus ada tombol atau teks Serahkan');
  assert(
    htmlContent.includes('tidak bisa dibatalkan') || htmlContent.includes('Dosen Pembimbing'),
    'Harus ada peringatan tidak bisa dibatalkan kecuali dikonfirmasi dosen'
  );
  assert(htmlContent.includes('id="reopenCheckpointModal"'), 'Modal reopenCheckpointModal untuk dosen harus ada di index.html');
  console.log('✓ Modal penyerahan dan teks konfirmasi terverifikasi di template HTML');

  const jsContent = fs.readFileSync('public/app.js', 'utf8');
  assert(jsContent.includes('openSubmitCheckpointModal'), 'Fungsi openSubmitCheckpointModal harus ada di app.js');
  assert(jsContent.includes('confirmSubmitCheckpointAction'), 'Fungsi confirmSubmitCheckpointAction harus ada di app.js');
  assert(jsContent.includes('alertLockedCheckpoint'), 'Fungsi alertLockedCheckpoint harus ada di app.js');
  console.log('✓ Logika penyerahan, penguncian tugas, dan supervisi dosen terverifikasi di app.js');

  // Kembalikan sesi ke mahasiswa
  await request('/api/auth/switch-demo', 'POST', { role: 'student', username: 'budi' });

  console.log('\n================================================================');
  console.log('🎉 SEMUA PENGUJIAN KONFIRMASI PENYERAHAN CHECKPOINT 100% SUKSES!');
  console.log('================================================================');
}

runTests().catch(err => {
  console.error('❌ PENGUJIAN GAGAL:', err);
  process.exit(1);
});
