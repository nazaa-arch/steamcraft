const assert = require('node:assert');

async function testProfile() {
  console.log('🧪 Starting Profile & Identity Management Verification Suite...\n');

  // 1. Initial State Check
  console.log('1. Testing GET /api/auth/me (Profile schema verification)...');
  const meRes = await fetch('http://localhost:3000/api/auth/me');
  assert.strictEqual(meRes.status, 200);
  const meData = await meRes.json();
  assert(meData.user, 'User object must exist');
  assert('faculty' in meData.user, 'faculty field must exist');
  assert('university' in meData.user, 'university field must exist');
  assert('research_interests' in meData.user, 'research_interests field must exist');
  assert('bio' in meData.user, 'bio field must exist');
  assert('academic_links' in meData.user, 'academic_links field must exist');
  console.log('   ✅ User profile contains all 5 new academic identity attributes.');

  // 2. Successful Profile Update
  console.log('2. Testing POST /api/auth/profile with comprehensive payload...');
  const payload = {
    name: 'Budi Santoso, S.Si., M.Sc.',
    identifier: '202610101-ID',
    study_program: 'Sains Data',
    faculty: 'Fakultas Matematika dan Ilmu Pengetahuan Alam (FMIPA)',
    university: 'Universitas Indonesia',
    research_interests: 'IoT Edge Computing, Deep Learning LSTM, Climate Analytics',
    bio: 'Peneliti muda berfokus pada integrasi sensor mikroklimat presisi dan pemodelan prediktif iklim mikro perkotaan.',
    academic_links: 'GitHub: github.com/budisantoso · ORCID: 0009-0002-4819-2101 · Scholar: Budi Santoso',
    avatar_color: '#10b981'
  };

  const updateRes = await fetch('http://localhost:3000/api/auth/profile', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  assert.strictEqual(updateRes.status, 200);
  const updateData = await updateRes.json();
  assert.strictEqual(updateData.success, true);
  assert.strictEqual(updateData.user.name, payload.name);
  assert.strictEqual(updateData.user.identifier, payload.identifier);
  assert.strictEqual(updateData.user.faculty, payload.faculty);
  assert.strictEqual(updateData.user.university, payload.university);
  assert.strictEqual(updateData.user.research_interests, payload.research_interests);
  assert.strictEqual(updateData.user.bio, payload.bio);
  assert.strictEqual(updateData.user.academic_links, payload.academic_links);
  assert.strictEqual(updateData.user.avatar_color, payload.avatar_color);
  console.log('   ✅ Profile updated successfully with response confirmation.');

  // 3. Validation Check (Missing name / identifier)
  console.log('3. Testing POST /api/auth/profile validation on empty fields...');
  const badRes = await fetch('http://localhost:3000/api/auth/profile', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name: '', identifier: '' })
  });
  assert.strictEqual(badRes.status, 400);
  const badData = await badRes.json();
  assert(badData.error.includes('wajib diisi'), 'Error message should report mandatory fields');
  console.log('   ✅ Incomplete payload appropriately rejected with HTTP 400.');

  // 4. Persistence across session calls
  console.log('4. Verifying persistence on subsequent GET /api/auth/me...');
  const verifyRes = await fetch('http://localhost:3000/api/auth/me');
  const verifyData = await verifyRes.json();
  assert.strictEqual(verifyData.user.name, payload.name);
  assert.strictEqual(verifyData.user.avatar_color, payload.avatar_color);
  console.log('   ✅ Updated identity persists in SQLite database.');

  // 5. Switching to Pure & Education Science users and verifying their rich profiles
  console.log('5. Testing identity switching and pre-seeded profiles for MIPA & Pendidikan...');
  const usersToTest = ['tiara', 'dimas', 'fitri', 'laila', 'prof_hartono'];
  for (const u of usersToTest) {
    const swRes = await fetch('http://localhost:3000/api/auth/switch-demo', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: u })
    });
    const swData = await swRes.json();
    assert.strictEqual(swData.success, true);
    assert(swData.user.bio.length > 0, `User ${u} must have non-empty bio`);
    assert(swData.user.research_interests.length > 0, `User ${u} must have non-empty research interests`);
    console.log(`   ✅ Account ${u} (${swData.user.name} - ${swData.user.study_program}): ${swData.user.faculty} | ${swData.user.university}`);
  }

  // Switch back to budi
  await fetch('http://localhost:3000/api/auth/switch-demo', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username: 'budi' })
  });

  // 6. Frontend HTML check
  console.log('6. Verifying Frontend Modal and Profile triggers...');
  const htmlRes = await fetch('http://localhost:3000/');
  const html = await htmlRes.text();
  assert(html.includes('id="topUserBadge"'), 'Header must have #topUserBadge');
  assert(html.includes('onclick="openEditProfileModal()"'), 'Must have openEditProfileModal trigger');
  assert(html.includes('id="editProfileModal"'), 'Must contain #editProfileModal');
  assert(html.includes('id="profileName"'), 'Must contain #profileName input');
  assert(html.includes('id="profileStudy"'), 'Must contain #profileStudy selector');
  assert(html.includes('id="profileFaculty"'), 'Must contain #profileFaculty input');
  assert(html.includes('id="profileUniversity"'), 'Must contain #profileUniversity input');
  assert(html.includes('id="profileInterests"'), 'Must contain #profileInterests input');
  assert(html.includes('id="profileBio"'), 'Must contain #profileBio textarea');
  assert(html.includes('id="profileLinks"'), 'Must contain #profileLinks input');
  assert(html.includes('id="avatarColorPickerList"'), 'Must contain avatar color picker');
  console.log('   ✅ All modal elements, inputs, and triggers verified in DOM.');

  console.log('\n🎉 ALL PROFILE & IDENTITY MANAGEMENT TESTS PASSED PERFECTLY!\n');
}

testProfile().catch(err => {
  console.error('❌ Test failed:', err);
  process.exit(1);
});
