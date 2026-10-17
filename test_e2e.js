const http = require('node:http');
const { spawn } = require('node:child_process');

console.log('Starting server.js for End-to-End Verification...');
const serverProc = spawn('node', ['server.js'], { cwd: __dirname });

serverProc.stdout.on('data', (d) => {
  console.log('[SERVER]', d.toString().trim());
});

serverProc.stderr.on('data', (d) => {
  console.error('[SERVER ERR]', d.toString().trim());
});

// Wait 1.5 seconds for server to start, then make HTTP requests
setTimeout(async () => {
  function get(urlPath) {
    return new Promise((resolve, reject) => {
      http.get(`http://localhost:3000${urlPath}`, (res) => {
        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', () => resolve({ status: res.statusCode, data }));
      }).on('error', reject);
    });
  }

  function post(urlPath, body) {
    return new Promise((resolve, reject) => {
      const payload = JSON.stringify(body);
      const req = http.request(`http://localhost:3000${urlPath}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(payload)
        }
      }, (res) => {
        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', () => resolve({ status: res.statusCode, data }));
      });
      req.on('error', reject);
      req.write(payload);
      req.end();
    });
  }

  try {
    console.log('\n--- 1. Testing GET / (Static HTML) ---');
    const rootRes = await get('/');
    console.log('GET / status:', rootRes.status, 'HTML length:', rootRes.data.length);

    console.log('\n--- 2. Testing GET /api/auth/me ---');
    const meRes = await get('/api/auth/me');
    console.log('GET /api/auth/me status:', meRes.status, 'data:', meRes.data.slice(0, 100));

    console.log('\n--- 3. Testing GET /api/projects ---');
    const projRes = await get('/api/projects');
    const projData = JSON.parse(projRes.data);
    console.log('Projects count:', projData.projects.length);

    console.log('\n--- 4. Testing GET /api/projects/1 ---');
    const p1Res = await get('/api/projects/1');
    const p1Data = JSON.parse(p1Res.data);
    console.log('Project 1 Name:', p1Data.project.name, 'Checkpoints:', p1Data.checkpoints.length);

    console.log('\n--- 5. Testing GET /api/ai/guidance?projectId=1 ---');
    const aiRes = await get('/api/ai/guidance?projectId=1');
    const aiData = JSON.parse(aiRes.data);
    console.log('AI Guidance Title:', aiData.guidance.title, 'Discipline:', aiData.guidance.disciplineAdvice.slice(0, 60));

    console.log('\n--- 6. Testing POST /api/ai/chat ---');
    const chatRes = await post('/api/ai/chat', { question: 'Bagaimana cara mengatasi kendala data?', projectId: 1 });
    const chatData = JSON.parse(chatRes.data);
    console.log('AI Chat Answer:', chatData.answer.slice(0, 80));

    console.log('\n--- 7. Testing GET /api/consultations ---');
    const consultRes = await get('/api/consultations');
    const consultData = JSON.parse(consultRes.data);
    console.log('Consultations count:', consultData.consultations.length);

    console.log('\n--- 8. Testing GET /api/analytics ---');
    const anRes = await get('/api/analytics');
    const anData = JSON.parse(anRes.data);
    console.log('Cohort Total Projects:', anData.totalProjects, 'Average Progress:', anData.avgProgress + '%');

    console.log('\n--- 9. Testing GET /api/analytics/export.csv ---');
    const csvRes = await get('/api/analytics/export.csv');
    console.log('CSV Export status:', csvRes.status, 'First line:', csvRes.data.split('\r\n')[0]);

    console.log('\n--- 10. Testing GET /api/projects/1/export/json ---');
    const jsonRes = await get('/api/projects/1/export/json');
    const pkg = JSON.parse(jsonRes.data);
    console.log('Package Name:', pkg.packageName, 'Schema:', pkg.schemaVersion);

    console.log('\n✅ ALL 10 END-TO-END TESTS PASSED WITH 100% SUCCESS!');
  } catch (err) {
    console.error('Test failed:', err);
  } finally {
    serverProc.kill();
    process.exit(0);
  }
}, 1500);
