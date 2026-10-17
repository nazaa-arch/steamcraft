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
  console.log('--- TEST 1: Memverifikasi Daftar Proyek & Tim Kelompok di GET /api/projects ---');
  const resProjects = await request('/api/projects');
  assert.strictEqual(resProjects.status, 200, 'GET /api/projects harus 200 OK');
  assert(Array.isArray(resProjects.data.projects), 'Harus mengembalikan array projects');
  assert(resProjects.data.projects.length >= 13, 'Harus ada minimal 13 proyek');
  
  const p1 = resProjects.data.projects.find(p => p.id === 1);
  assert(p1, 'Proyek id 1 harus ada');
  assert(Array.isArray(p1.members), 'Proyek 1 harus memiliki array members');
  assert(p1.members.length >= 3, 'Proyek 1 harus memiliki minimal 3 anggota kelompok');
  assert(p1.leader, 'Proyek 1 harus memiliki ketua tim');
  console.log(`✓ Proyek #1 "${p1.name}": Ketua tim = ${p1.leader.name} (${p1.leader.study_program}), Total = ${p1.members.length} mahasiswa`);

  console.log('\n--- TEST 2: Memverifikasi Detail Proyek, Roster Tim & Checkpoint Audit di GET /api/projects/1 ---');
  const resDetail = await request('/api/projects/1');
  assert.strictEqual(resDetail.status, 200);
  assert(resDetail.data.members && resDetail.data.members.length >= 3);
  const leadMember = resDetail.data.members.find(m => m.is_lead);
  assert(leadMember, 'Harus ada anggota dengan is_lead = 1');
  console.log(`✓ Ketua Kelompok: ${leadMember.name} - NIM: ${leadMember.identifier} - Peran: ${leadMember.role}`);

  // Cek checkpoints
  const cps = resDetail.data.checkpoints;
  assert(Array.isArray(cps) && cps.length === 5, 'Harus ada 5 checkpoints');
  const completedCps = cps.filter(c => c.is_completed);
  console.log(`✓ Checkpoint selesai: ${completedCps.length}/5 tahap. Diselesaikan oleh: ${completedCps[0] ? completedCps[0].completed_by : 'N/A'}`);

  console.log('\n--- TEST 3: Pendaftaran Anggota Baru ke Kelompok Proyek ---');
  const newMemberPayload = {
    name: 'Siti Aminah Rahmawati',
    identifier: '202610199',
    study_program: 'Pendidikan Biologi',
    role: 'Bio-Pedagogy & Didaktik Visual'
  };
  const resAddMember = await request('/api/projects/1/members', 'POST', newMemberPayload);
  assert.strictEqual(resAddMember.status, 200, 'POST /api/projects/1/members harus 200 OK');
  assert(resAddMember.data.success, 'Penambahan anggota harus berhasil');
  console.log(`✓ Berhasil menambahkan anggota: ${resAddMember.data.member.name} (${resAddMember.data.member.study_program})`);
  const addedMemberId = resAddMember.data.member.id;

  // Verifikasi members_count bertambah
  const resAfterAdd = await request('/api/projects/1');
  assert.strictEqual(resAfterAdd.data.project.members_count, p1.members.length + 1, 'members_count harus bertambah');
  console.log(`✓ Jumlah anggota sekarang: ${resAfterAdd.data.project.members_count} orang`);

  console.log('\n--- TEST 4: Proteksi Ketua Tim & Hapus Anggota ---');
  // Coba hapus ketua tim -> harus ditolak
  const resDelLead = await request(`/api/projects/1/members/${leadMember.id}`, 'DELETE');
  assert.strictEqual(resDelLead.status, 400, 'Hapus ketua tim harus ditolak (400 Bad Request)');
  console.log(`✓ Proteksi berhasil: Ketua tim tidak dapat dihapus (${resDelLead.data.error})`);

  // Hapus anggota baru yang tadi ditambahkan
  const resDelMember = await request(`/api/projects/1/members/${addedMemberId}`, 'DELETE');
  assert.strictEqual(resDelMember.status, 200, 'Hapus anggota biasa harus 200 OK');
  console.log('✓ Anggota tambahan berhasil dihapus');

  console.log('\n--- TEST 5: Proteksi Pembatalan Checkpoint & Otoritas Dosen ---');
  // Mahasiswa mencoba membatalkan checkpoint yang sudah diserahkan -> harus 403
  const resToggleStudent = await request('/api/projects/1/checkpoints/0/toggle', 'POST');
  assert.strictEqual(resToggleStudent.status, 403, 'Mahasiswa tidak boleh membatalkan checkpoint yang sudah diserahkan');
  console.log(`✓ Proteksi aktif: Mahasiswa ditolak membatalkan (${resToggleStudent.data.error})`);

  // Switch ke Dosen untuk membatalkan/membuka revisi -> harus 200
  await request('/api/auth/switch-demo', 'POST', { role: 'lecturer', username: 'dosen' });
  const resToggleLecturer = await request('/api/projects/1/checkpoints/0/toggle', 'POST');
  assert.strictEqual(resToggleLecturer.status, 200, 'Dosen berwenang membuka kembali checkpoint');
  console.log('✓ Dosen berhasil membuka kembali checkpoint untuk revisi mahasiswa');

  // Kembalikan ke mahasiswa dan serahkan kembali tugas
  await request('/api/auth/switch-demo', 'POST', { role: 'student', username: 'budi' });
  const resResubmit = await request('/api/projects/1/checkpoints/0/toggle', 'POST', { notes: 'Penyerahan kembali oleh mahasiswa.' });
  assert.strictEqual(resResubmit.status, 200);
  const cp0 = (await request('/api/projects/1')).data.checkpoints[0];
  console.log(`✓ Checkpoint Tahap 1: Selesai = ${cp0.is_completed}, Pelaksana = "${cp0.completed_by}"`);

  console.log('\n======================================================');
  console.log('🎉 SEMUA PENGUJIAN KELOMPOK PROYEK & SUPERVISI DOSEN SUKSES!');
  console.log('======================================================');
}

runTests().catch(err => {
  console.error('❌ PENGUJIAN GAGAL:', err);
  process.exit(1);
});
