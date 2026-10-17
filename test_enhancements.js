const http = require('node:http');
const assert = require('node:assert');
const fs = require('node:fs');
const path = require('node:path');

const BASE_URL = 'http://localhost:3000';

function request(path, options = {}) {
  return new Promise((resolve, reject) => {
    const url = new URL(path, BASE_URL);
    const req = http.request(url, options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        let json = null;
        try { json = JSON.parse(data); } catch (e) {}
        resolve({ status: res.statusCode, headers: res.headers, text: data, json });
      });
    });
    req.on('error', reject);
    if (options.body) req.write(options.body);
    req.end();
  });
}

async function runTests() {
  console.log('🧪 Starting STEAM-Craft 5-Enhancements Verification Suite...\n');

  // Test 1: Notifications API
  console.log('1. Testing GET /api/notifications...');
  const notifRes = await request('/api/notifications');
  assert.strictEqual(notifRes.status, 200);
  assert(notifRes.json.hasOwnProperty('pendingConsultations'));
  assert(notifRes.json.hasOwnProperty('activeBlockers'));
  assert(notifRes.json.hasOwnProperty('pendingReviews'));
  console.log('   ✅ Badges count:', notifRes.json);

  // Test 2: File Upload (Base64)
  console.log('2. Testing POST /api/upload (Base64 file storage)...');
  const dummyContent = 'Sensor_ID,Timestamp,Temperature_C,Humidity_Pct\nBME280_01,2026-10-17T10:00:00Z,27.4,65.2\n';
  const base64Data = 'data:text/csv;base64,' + Buffer.from(dummyContent).toString('base64');
  const uploadRes = await request('/api/upload', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ filename: 'test_telemetri.csv', base64Data })
  });
  assert.strictEqual(uploadRes.status, 200);
  assert(uploadRes.json.fileUrl.startsWith('/uploads/'));
  const localFilePath = path.join(__dirname, 'public', uploadRes.json.fileUrl.replace('/', path.sep));
  assert(fs.existsSync(localFilePath), 'Uploaded file must exist in public/uploads');
  console.log('   ✅ File uploaded to:', uploadRes.json.fileUrl);

  // Test 3: Journal with File Attachment
  console.log('3. Testing POST /api/projects/1/journals with attachment...');
  const journalRes = await request('/api/projects/1/journals', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      tag: 'Eksperimen',
      content: 'Pengujian kalibrasi batch 3 dengan dataset telemetri terunggah.',
      file_name: uploadRes.json.fileName,
      file_url: uploadRes.json.fileUrl
    })
  });
  assert.strictEqual(journalRes.status, 200);
  const createdJournal = journalRes.json.journals.find(j => j.file_name === uploadRes.json.fileName);
  assert(createdJournal, 'Journal should contain attachment');
  console.log('   ✅ Journal recorded with attachment:', createdJournal.file_name);

  // Test 4: Version Iteration with Attachment
  console.log('4. Testing POST /api/projects/1/versions with artifact...');
  const versionRes = await request('/api/projects/1/versions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      note: 'Rilis build validasi instrumen terkalibrasi',
      file_name: uploadRes.json.fileName,
      file_url: uploadRes.json.fileUrl,
      repo_url: 'https://github.com/steamcraft/ai-wildfire'
    })
  });
  assert.strictEqual(versionRes.status, 200);
  console.log('   ✅ Version release created with build v' + versionRes.json.versions_count + '.0');

  // Test 5: Printable Scientific Dossier (PDF/HTML)
  console.log('5. Testing GET /api/projects/1/dossier (Official Dossier)...');
  const dossierRes = await request('/api/projects/1/dossier');
  assert.strictEqual(dossierRes.status, 200);
  assert(dossierRes.headers['content-type'].includes('text/html'));
  assert(dossierRes.text.includes('Kementerian Pendidikan, Kebudayaan, Riset, dan Teknologi'));
  assert(dossierRes.text.includes('STEAM-CRAFT SCIENTIFIC RESEARCH DOSSIER'));
  assert(dossierRes.text.includes('<polygon points='), 'Must include SVG radar polygon');
  assert(dossierRes.text.includes('Ketua Tim Mahasiswa'), 'Must include student signature block');
  assert(dossierRes.text.includes('Dosen Pembimbing Riset'), 'Must include lecturer signature block');
  assert(dossierRes.text.includes('Ketua Dewan Juri STEAM'), 'Must include jury signature block');
  console.log('   ✅ Printable scientific dossier generated (Length: ' + dossierRes.text.length + ' bytes)');

  // Test 6: Templates API (GET)
  console.log('6. Testing GET /api/mission/templates...');
  const tplsRes = await request('/api/mission/templates');
  assert.strictEqual(tplsRes.status, 200);
  assert(Array.isArray(tplsRes.json.templates));
  assert(tplsRes.json.templates.length >= 4);
  console.log('   ✅ Available templates:', tplsRes.json.templates.map(t => t.template_key));

  // Test 7: Template Update with 100% Weight (POST)
  console.log('7. Testing POST /api/mission/templates/data with valid 100% weights...');
  const validUpdate = await request('/api/mission/templates/data', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      checkpoints: [
        { title: 'Tahap 1: Formulir Hipotesis & Studi Awal', desc: 'Identifikasi celah ilmiah riset' },
        { title: 'Tahap 2: Kalibrasi & Validasi Perangkat', desc: 'Setup instrumen presisi tinggi' },
        { title: 'Tahap 3: Pengambilan Data & Machine Learning', desc: 'Akuisisi data lapangan dan pelatihan model' },
        { title: 'Tahap 4: Uji Signifikansi & Analisis Error', desc: 'Validasi cross-domain dan metrik F1' },
        { title: 'Tahap 5: Publikasi & Reproducibility Package', desc: 'Kompilasi paket artefak lengkap' }
      ],
      rubricCompleteness: 30,
      rubricEvidence: 30,
      rubricContribution: 20,
      rubricReproducibility: 20
    })
  });
  assert.strictEqual(validUpdate.status, 200);
  assert.strictEqual(validUpdate.json.success, true);
  console.log('   ✅ Valid template update accepted: 30+30+20+20 = 100%');

  // Test 8: Template Update with Invalid Weight (Must fail with 400)
  console.log('8. Testing POST /api/mission/templates/data with invalid 85% weights...');
  const invalidUpdate = await request('/api/mission/templates/data', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      checkpoints: [],
      rubricCompleteness: 20,
      rubricEvidence: 20,
      rubricContribution: 20,
      rubricReproducibility: 25 // Total 85%
    })
  });
  assert.strictEqual(invalidUpdate.status, 400);
  assert(invalidUpdate.json.error.includes('100%'));
  console.log('   ✅ Invalid weights rejected with error: "' + invalidUpdate.json.error + '"');

  // Test 9: Static App Assets
  console.log('9. Testing Static Asset Delivery (HTML, CSS, JS, Uploads)...');
  const indexRes = await request('/');
  assert.strictEqual(indexRes.status, 200);
  assert(indexRes.text.includes('SteamCraft'));

  const cssRes = await request('/style.css');
  assert.strictEqual(cssRes.status, 200);
  assert(cssRes.text.includes('.mission-master-detail'));

  const jsRes = await request('/app.js');
  assert.strictEqual(jsRes.status, 200);
  assert(jsRes.text.includes('renderSvgRadar'));

  console.log('   ✅ All static frontend assets served correctly.');

  console.log('\n🎉 ALL 9 ENHANCEMENT TESTS PASSED PERFECTLY!\n');
}

runTests().catch(err => {
  console.error('\n❌ Test suite failed:', err);
  process.exit(1);
});
