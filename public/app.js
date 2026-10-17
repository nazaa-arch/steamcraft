/**
 * STEAM-Craft — Client-Side Application
 * Full real-time synchronization with SQLite backend API.
 */

// Global State
let currentUser = null;
let currentRole = 'student';
let allProjects = [];
let selectedProjectId = null;

// Helper: Filter projects strictly belonging to the currently logged in user
function getUserProjects() {
  if (!currentUser) return [];
  return allProjects.filter(p => {
    if (p.creator_id && p.creator_id === currentUser.id) return true;
    if (p.members && Array.isArray(p.members)) {
      return p.members.some(m => 
        (m.user_id && m.user_id === currentUser.id) || 
        (m.identifier && currentUser.identifier && String(m.identifier).toLowerCase() === String(currentUser.identifier).toLowerCase()) ||
        (m.name && currentUser.name && m.name.toLowerCase() === currentUser.name.toLowerCase())
      );
    }
    if (currentUser.role === 'lecturer' && p.lecturer && currentUser.name && p.lecturer.toLowerCase().includes(currentUser.name.toLowerCase())) {
      return true;
    }
    return false;
  });
}
let currentActivePage = 'dashboard';
let currentMissionTab = 'supervision';
let missionSelectedProjectId = null;
let currentInspectorSubtab = 'checkpoints';
let inspectorProjectCache = {};
let currentTemplateKey = 'data';
let cachedTemplates = [];
let pendingCheckpointProjectId = null;
let pendingCheckpointStageIndex = null;
let pendingCheckpointTitle = '';
let pendingCheckpointDesc = '';
let currentAppMode = 'demo';
let selectedTargetMode = 'demo';
let cachedAnnouncements = [];

// Helper: Toast Notification
function showToast(msg) {
  const t = document.getElementById('toastMessage');
  if (!t) return;
  t.textContent = msg;
  t.style.display = 'block';
  clearTimeout(window.toastTimer);
  window.toastTimer = setTimeout(() => {
    t.style.display = 'none';
  }, 3500);
}

// Helper: File Upload (Converts file to base64 and posts to /api/upload)
function uploadFile(fileInput) {
  return new Promise((resolve, reject) => {
    if (!fileInput || !fileInput.files || fileInput.files.length === 0) {
      return resolve(null);
    }
    const file = fileInput.files[0];
    const reader = new FileReader();
    reader.onload = async () => {
      try {
        const res = await api('/api/upload', 'POST', {
          filename: file.name,
          base64Data: reader.result
        });
        resolve(res);
      } catch (e) {
        reject(e);
      }
    };
    reader.onerror = (err) => reject(err);
    reader.readAsDataURL(file);
  });
}

// Helper: Open Printable Official Scientific Dossier (PDF/Print View)
function openPrintableDossier() {
  window.open(`/api/projects/${selectedProjectId}/dossier`, '_blank');
}

// Helper: Interactive 5-Pillar STEAM Radar / Spider Chart SVG Generator
function renderSvgRadar(scores, size = 280) {
  const S = (scores && scores.S !== undefined) ? Number(scores.S) : 88;
  const T = (scores && scores.T !== undefined) ? Number(scores.T) : 85;
  const E = (scores && scores.E !== undefined) ? Number(scores.E) : 82;
  const A = (scores && scores.A !== undefined) ? Number(scores.A) : 78;
  const M = (scores && scores.M !== undefined) ? Number(scores.M) : 92;

  const data = [
    { label: 'Science', key: 'S', val: S, angle: -90 },
    { label: 'Technology', key: 'T', val: T, angle: -18 },
    { label: 'Engineering', key: 'E', val: E, angle: 54 },
    { label: 'Art/Design', key: 'A', val: A, angle: 126 },
    { label: 'Mathematics', key: 'M', val: M, angle: 198 }
  ];

  const cx = size / 2;
  const cy = size / 2;
  const rMax = size * 0.35;

  const toRad = deg => (deg * Math.PI) / 180;
  const getXY = (angle, radius) => ({
    x: cx + radius * Math.cos(toRad(angle)),
    y: cy + radius * Math.sin(toRad(angle))
  });

  // Concentric polygon background grids (20%, 40%, 60%, 80%, 100%)
  let gridPolys = '';
  [20, 40, 60, 80, 100].forEach(level => {
    const r = (level / 100) * rMax;
    const pts = data.map(d => {
      const pt = getXY(d.angle, r);
      return `${pt.x.toFixed(1)},${pt.y.toFixed(1)}`;
    }).join(' ');
    gridPolys += `<polygon points="${pts}" fill="${level === 100 ? '#f8fafc' : 'none'}" stroke="#cbd5e1" stroke-width="${level === 100 ? '1.5' : '0.8'}" />`;
  });

  // Axis spokes from center
  let spokes = '';
  data.forEach(d => {
    const pt = getXY(d.angle, rMax);
    spokes += `<line x1="${cx}" y1="${cy}" x2="${pt.x.toFixed(1)}" y2="${pt.y.toFixed(1)}" stroke="#cbd5e1" stroke-width="1" stroke-dasharray="2,2" />`;
  });

  // Data polygon
  const dataPts = data.map(d => {
    const r = (Math.max(10, Math.min(100, d.val)) / 100) * rMax;
    const pt = getXY(d.angle, r);
    return `${pt.x.toFixed(1)},${pt.y.toFixed(1)}`;
  }).join(' ');

  // Data point markers
  const dataCircles = data.map(d => {
    const r = (Math.max(10, Math.min(100, d.val)) / 100) * rMax;
    const pt = getXY(d.angle, r);
    return `<circle cx="${pt.x.toFixed(1)}" cy="${pt.y.toFixed(1)}" r="4.5" fill="#2563eb" stroke="#ffffff" stroke-width="2"><title>${d.label} (${d.key}): ${d.val}</title></circle>`;
  }).join('');

  // Labels around perimeter
  let labels = '';
  data.forEach(d => {
    const pt = getXY(d.angle, rMax + 24);
    let anchor = 'middle';
    if (d.angle === -18 || d.angle === 54) anchor = 'start';
    else if (d.angle === 126 || d.angle === 198) anchor = 'end';

    labels += `
      <text x="${pt.x.toFixed(1)}" y="${pt.y.toFixed(1)}" text-anchor="${anchor}" dominant-baseline="middle" font-size="11" font-weight="700" fill="#1e293b">
        ${d.key} (${d.val})
      </text>
      <text x="${pt.x.toFixed(1)}" y="${(pt.y + 11).toFixed(1)}" text-anchor="${anchor}" dominant-baseline="middle" font-size="9" fill="#64748b">
        ${d.label}
      </text>
    `;
  });

  return `
    <svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" style="max-width: 100%; height: auto; overflow: visible;">
      ${gridPolys}
      ${spokes}
      <polygon points="${dataPts}" fill="rgba(37, 99, 235, 0.25)" stroke="#2563eb" stroke-width="2.5" />
      ${dataCircles}
      ${labels}
    </svg>
  `;
}

// Helper: Synchronize Live Navigation Notification Badges
async function updateNotificationBadges() {
  try {
    const res = await api('/api/notifications');
    const { pendingConsultations, activeBlockers, pendingReviews, unreadAnnouncements } = res;

    const bStudentConsult = document.getElementById('badgeStudentConsult');
    if (bStudentConsult) {
      bStudentConsult.textContent = (pendingConsultations > 0) ? pendingConsultations : '';
    }

    const bStudentAnn = document.getElementById('badgeStudentAnn');
    if (bStudentAnn) {
      bStudentAnn.textContent = (unreadAnnouncements > 0) ? unreadAnnouncements : '';
    }

    const bMission = document.getElementById('badgeMission');
    if (bMission) {
      const mCount = (activeBlockers || 0) + (pendingReviews || 0);
      bMission.textContent = (mCount > 0) ? mCount : '';
    }

    const bLecturerConsult = document.getElementById('badgeLecturerConsult');
    if (bLecturerConsult) {
      bLecturerConsult.textContent = (pendingConsultations > 0) ? pendingConsultations : '';
    }

    const bNotifBell = document.getElementById('badgeNotifBell');
    if (bNotifBell) {
      if (unreadAnnouncements > 0) {
        bNotifBell.textContent = unreadAnnouncements;
        bNotifBell.style.display = 'inline-flex';
      } else {
        bNotifBell.style.display = 'none';
      }
    }

    const bDashUnread = document.getElementById('dashAnnUnreadBadge');
    if (bDashUnread) {
      if (unreadAnnouncements > 0) {
        bDashUnread.textContent = `${unreadAnnouncements} baru`;
        bDashUnread.style.display = 'inline-block';
      } else {
        bDashUnread.style.display = 'none';
      }
    }

    const bDropdownCount = document.getElementById('dropdownUnreadCount');
    if (bDropdownCount) {
      if (unreadAnnouncements > 0) {
        bDropdownCount.textContent = `${unreadAnnouncements} baru`;
        bDropdownCount.style.display = 'inline-block';
      } else {
        bDropdownCount.style.display = 'none';
      }
    }
  } catch (e) {
    // Silent fail if not authenticated
  }
}

// Helper: API Client
async function api(endpoint, method = 'GET', body = null) {
  const headers = { 'Content-Type': 'application/json' };
  const token = localStorage.getItem('steamcraft_token');
  if (token) {
    headers['Authorization'] = 'Bearer ' + token;
  }
  if (currentUser && currentUser.id) {
    headers['X-User-Id'] = String(currentUser.id);
  }
  const options = { method, headers };
  if (body) options.body = JSON.stringify(body);

  try {
    const res = await fetch(endpoint, options);
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || 'Terjadi kesalahan sistem');
    }
    return data;
  } catch (err) {
    showToast(err.message);
    throw err;
  }
}

// Modal Helpers
function openModal(id) {
  const m = document.getElementById(id);
  if (m) m.classList.add('active');
}

function closeModal(id) {
  const m = document.getElementById(id);
  if (m) m.classList.remove('active');
}

// Close modal on escape key or clicking backdrop
window.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    document.querySelectorAll('.modal-overlay.active').forEach(m => m.classList.remove('active'));
  }
});

document.addEventListener('click', (e) => {
  if (e.target.classList.contains('modal-overlay')) {
    e.target.classList.remove('active');
  }
});

// ==================== DUAL APPLICATION MODE (DEMO VS PRODUCTION) ====================
async function loadAppMode() {
  try {
    const res = await api('/api/system/mode');
    currentAppMode = res.mode || 'demo';
    selectedTargetMode = currentAppMode;
    applyAppModeUI(currentAppMode);
  } catch (err) {
    console.error('Failed to load app mode:', err);
    currentAppMode = 'demo';
    applyAppModeUI('demo');
  }
}

function applyAppModeUI(mode) {
  // 1. Topbar Mode Badge
  const topIcon = document.getElementById('topAppModeIcon');
  const topText = document.getElementById('topAppModeText');
  const topBtn = document.getElementById('topAppModeBtn');
  
  if (topIcon && topText) {
    if (mode === 'production') {
      topIcon.textContent = '🚀';
      topText.textContent = 'Mode Operasi Riil';
      if (topBtn) {
        topBtn.style.borderColor = 'var(--teal)';
        topBtn.style.color = '#0d9488';
      }
    } else {
      topIcon.textContent = '🎯';
      topText.textContent = 'Mode Demo Lomba';
      if (topBtn) {
        topBtn.style.borderColor = 'var(--line)';
        topBtn.style.color = 'inherit';
      }
    }
  }

  // 2. Admin Console Mode Badge if loaded
  const admMode = document.getElementById('admActiveMode');
  if (admMode) {
    if (mode === 'production') {
      admMode.textContent = '🚀 Operasi Riil';
      admMode.style.color = '#0d9488';
    } else {
      admMode.textContent = '🎯 Demo Lomba';
      admMode.style.color = '#4338ca';
    }
  }
}

function setLoginAppMode(mode) {
  applyAppModeUI(mode);
  selectedTargetMode = mode;
  api('/api/system/mode', 'POST', { mode })
    .then(res => {
      currentAppMode = res.mode;
      showToast(mode === 'production' ? 'Beralih ke Tampilan Operasi Riil' : 'Beralih ke Tampilan Demo Lomba');
    })
    .catch(e => console.error(e));
}

function openSwitchModeModal() {
  selectedTargetMode = currentAppMode;
  selectModeOption(currentAppMode);
  openModal('switchModeModal');
}

function selectModeOption(mode) {
  selectedTargetMode = mode;
  const cardDemo = document.getElementById('cardModeDemo');
  const cardProd = document.getElementById('cardModeProd');

  if (cardDemo && cardProd) {
    if (mode === 'demo') {
      cardDemo.style.border = '2px solid var(--primary)';
      cardDemo.style.background = 'var(--primary-light)';
      cardProd.style.border = '1px solid var(--line)';
      cardProd.style.background = 'white';
    } else {
      cardProd.style.border = '2px solid var(--teal)';
      cardProd.style.background = '#f0fdf4';
      cardDemo.style.border = '1px solid var(--line)';
      cardDemo.style.background = 'white';
    }
  }
}

async function applySystemModeChange() {
  const btn = document.getElementById('btnApplySwitchMode');
  if (btn) btn.disabled = true;

  try {
    const res = await api('/api/system/mode', 'POST', { mode: selectedTargetMode });
    currentAppMode = res.mode;
    applyAppModeUI(currentAppMode);
    closeModal('switchModeModal');
    showToast(currentAppMode === 'production' 
      ? 'Mode Operasi Riil Aktif! Proyek demo disembunyikan.' 
      : 'Mode Demo Lomba Aktif! 13 Proyek demo kembali ditampilkan.');

    // Reload projects and views
    await loadAllProjects();
    if (currentUser) {
      if (currentActivePage === 'dashboard') {
        loadDashboard();
      } else if (currentActivePage === 'projects') {
        loadProjectsCatalog();
      } else if (currentActivePage === 'mission') {
        loadMissionControl();
      }
    }
  } catch (err) {
    alert('Gagal mengubah mode sistem: ' + err.message);
  } finally {
    if (btn) btn.disabled = false;
  }
}

// ==================== CIVITAS REGISTRATION (PRODUCTION MODE) ====================
function openRegisterUserModal() {
  const form = document.getElementById('registerUserForm');
  if (form) form.reset();
  const errDiv = document.getElementById('registerError');
  if (errDiv) {
    errDiv.textContent = '';
    errDiv.style.display = 'none';
  }
  handleRegisterRoleChange('student');
  openModal('registerUserModal');
}

function handleRegisterRoleChange(role) {
  const label = document.getElementById('regIdentifierLabel');
  const input = document.getElementById('regIdentifier');
  if (!label || !input) return;

  if (role === 'lecturer') {
    label.textContent = 'NIP (Nomor Induk Pegawai) *';
    input.placeholder = 'Contoh: 198504122010121002';
  } else {
    label.textContent = 'NIM (Nomor Induk Mahasiswa) *';
    input.placeholder = 'Contoh: 202610145';
  }
}

async function handleRegisterSubmit(e) {
  e.preventDefault();
  const name = document.getElementById('regName').value.trim();
  const username = document.getElementById('regUsername').value.trim();
  const role = document.getElementById('regRole').value;
  const identifier = document.getElementById('regIdentifier').value.trim();
  const email = document.getElementById('regEmail').value.trim();
  const study_program = document.getElementById('regStudy').value;
  const password = document.getElementById('regPassword').value;
  const errDiv = document.getElementById('registerError');
  const btn = document.getElementById('btnSubmitRegister');

  if (errDiv) {
    errDiv.textContent = '';
    errDiv.style.display = 'none';
  }

  if (btn) btn.disabled = true;

  try {
    const payload = {
      name,
      username,
      email,
      password,
      role,
      study_program,
      nim: role === 'student' ? identifier : undefined,
      nip: role === 'lecturer' ? identifier : undefined
    };

    const res = await api('/api/auth/register', 'POST', payload);
    if (res.requiresVerification) {
      closeModal('registerUserModal');
      openEmailVerificationModal(res.userId, res.email, res.simulatedOtp);
      showToast(res.message || 'Silakan masukkan kode OTP verifikasi email.');
    } else if (res.user) {
      currentUser = res.user;
      currentRole = res.user.role;
      localStorage.setItem('steamcraft_user', JSON.stringify(res.user));
      if (res.token) localStorage.setItem('steamcraft_token', res.token);
      selectedProjectId = null;
      closeModal('registerUserModal');
      enterWorkspace();
      showToast(`Registrasi berhasil! Selamat datang, ${res.user.name}`);
    }
  } catch (err) {
    if (errDiv) {
      errDiv.textContent = err.message || 'Gagal mendaftar akun.';
      errDiv.style.display = 'block';
    }
  } finally {
    if (btn) btn.disabled = false;
  }
}

// ==================== EMAIL VERIFICATION & OTP ====================
let pendingVerificationUserId = null;
let pendingVerificationEmail = '';
let resendTimerInterval = null;

function openEmailVerificationModal(userId, email, simulatedOtp = null) {
  pendingVerificationUserId = userId;
  pendingVerificationEmail = email;

  const displayEl = document.getElementById('verifyEmailDisplay');
  if (displayEl) displayEl.textContent = email || '-';

  const simBanner = document.getElementById('verifyDevSimulatedBanner');
  const simText = document.getElementById('verifyDevOtpText');
  const otpInput = document.getElementById('otpInput');
  const errDiv = document.getElementById('verifyOtpError');

  if (errDiv) {
    errDiv.textContent = '';
    errDiv.style.display = 'none';
  }

  if (simulatedOtp && simBanner && simText) {
    simBanner.style.display = 'block';
    simText.textContent = simulatedOtp;
    if (otpInput) otpInput.value = simulatedOtp;
  } else {
    if (simBanner) simBanner.style.display = 'none';
    if (otpInput) otpInput.value = '';
  }

  startResendTimer();
  openModal('emailVerificationModal');
  setTimeout(() => {
    if (otpInput) otpInput.focus();
  }, 200);
}

function startResendTimer() {
  if (resendTimerInterval) clearInterval(resendTimerInterval);

  let seconds = 60;
  const countText = document.getElementById('resendCountdownText');
  const secEl = document.getElementById('resendSeconds');
  const btnResend = document.getElementById('btnResendOtp');

  if (countText) countText.style.display = 'inline';
  if (btnResend) btnResend.style.display = 'none';
  if (secEl) secEl.textContent = seconds;

  resendTimerInterval = setInterval(() => {
    seconds--;
    if (secEl) secEl.textContent = seconds;
    if (seconds <= 0) {
      clearInterval(resendTimerInterval);
      if (countText) countText.style.display = 'none';
      if (btnResend) btnResend.style.display = 'inline';
    }
  }, 1000);
}

async function resendVerificationOtp() {
  const btnResend = document.getElementById('btnResendOtp');
  if (btnResend) btnResend.disabled = true;

  try {
    const res = await api('/api/auth/resend-otp', 'POST', {
      userId: pendingVerificationUserId,
      email: pendingVerificationEmail
    });

    if (res.simulatedOtp) {
      const simBanner = document.getElementById('verifyDevSimulatedBanner');
      const simText = document.getElementById('verifyDevOtpText');
      const otpInput = document.getElementById('otpInput');
      if (simBanner) simBanner.style.display = 'block';
      if (simText) simText.textContent = res.simulatedOtp;
      if (otpInput) otpInput.value = res.simulatedOtp;
      showToast(`Kode OTP verifikasi akun Anda: ${res.simulatedOtp}`);
    } else {
      showToast(res.message || 'Kode OTP baru telah dikirimkan ke email Anda.');
    }

    startResendTimer();
  } catch (err) {
    showToast(err.message || 'Gagal mengirim ulang kode OTP.');
  } finally {
    if (btnResend) btnResend.disabled = false;
  }
}

async function handleVerifyOtpSubmit(e) {
  e.preventDefault();
  const otpInput = document.getElementById('otpInput');
  const otpCode = otpInput ? otpInput.value.trim() : '';
  const errDiv = document.getElementById('verifyOtpError');
  const btn = document.getElementById('btnSubmitOtp');

  if (errDiv) {
    errDiv.textContent = '';
    errDiv.style.display = 'none';
  }

  if (!otpCode || otpCode.length !== 6) {
    if (errDiv) {
      errDiv.textContent = 'Harap masukkan 6 digit kode OTP lengkap.';
      errDiv.style.display = 'block';
    }
    return;
  }

  if (btn) btn.disabled = true;

  try {
    const res = await api('/api/auth/verify-email', 'POST', {
      userId: pendingVerificationUserId,
      email: pendingVerificationEmail,
      otpCode
    });

    if (res.user) {
      if (resendTimerInterval) clearInterval(resendTimerInterval);
      currentUser = res.user;
      currentRole = res.user.role;
      localStorage.setItem('steamcraft_user', JSON.stringify(res.user));
      if (res.token) localStorage.setItem('steamcraft_token', res.token);
      selectedProjectId = null;
      closeModal('emailVerificationModal');
      enterWorkspace();
      showToast(`✓ ${res.message || 'Email berhasil diverifikasi! Selamat datang.'}`);
    }
  } catch (err) {
    if (errDiv) {
      errDiv.textContent = err.message || 'Kode OTP tidak valid atau sudah kedaluwarsa.';
      errDiv.style.display = 'block';
    }
  } finally {
    if (btn) btn.disabled = false;
  }
}

// ==================== AUTHENTICATION ====================
function setAuthRole(role) {
  const sBtn = document.getElementById('tabStudent');
  const lBtn = document.getElementById('tabLecturer');
  const label = document.getElementById('authIdLabel');
  const input = document.getElementById('authUsername');

  if (sBtn) sBtn.classList.toggle('active', role === 'student');
  if (lBtn) lBtn.classList.toggle('active', role === 'lecturer');

  if (role === 'student') {
    label.textContent = 'NIM (Nomor Induk Mahasiswa) / Username';
    input.placeholder = 'Contoh: 202610101 (NIM) atau username';
  } else {
    label.textContent = 'NIP (Nomor Induk Pegawai) / Username';
    input.placeholder = 'Contoh: 198504122010121002 (NIP / NIDN) atau username';
  }
}

async function quickLoginDemo(target) {
  try {
    let username = target;
    if (target === 'student') username = 'budi';
    else if (target === 'lecturer') username = 'dosen';

    const res = await api('/api/auth/switch-demo', 'POST', { username });
    if (res.user) {
      currentUser = res.user;
      currentRole = res.user.role;
      localStorage.setItem('steamcraft_user', JSON.stringify(res.user));
      if (res.token) localStorage.setItem('steamcraft_token', res.token);
      selectedProjectId = null;
      enterWorkspace();
      showToast(`Masuk sebagai ${res.user.name} (${res.user.study_program || (res.user.role === 'student' ? 'Mahasiswa' : 'Dosen/Juri')})`);
    }
  } catch (e) {
    console.error(e);
  }
}

async function handleLoginSubmit(e) {
  e.preventDefault();
  const username = document.getElementById('authUsername').value.trim();
  const password = document.getElementById('authPassword').value;
  const errDiv = document.getElementById('authError');
  errDiv.textContent = '';

  try {
    const res = await api('/api/auth/login', 'POST', { username, password });
    if (res.requiresVerification) {
      openEmailVerificationModal(res.userId, res.email, res.simulatedOtp);
      showToast(res.error || 'Silakan masukkan kode OTP verifikasi email Anda.');
      return;
    }
    if (res.user) {
      currentUser = res.user;
      currentRole = res.user.role;
      localStorage.setItem('steamcraft_user', JSON.stringify(res.user));
      if (res.token) localStorage.setItem('steamcraft_token', res.token);
      selectedProjectId = null;
      enterWorkspace();
      showToast(`Selamat datang, ${res.user.name}`);
    }
  } catch (err) {
    errDiv.textContent = err.message;
  }
}

async function toggleRoleSwitch() {
  const targetRole = currentRole === 'student' ? 'lecturer' : 'student';
  const targetUsername = targetRole === 'lecturer' ? 'dosen' : 'budi';
  try {
    const res = await api('/api/auth/switch-demo', 'POST', { username: targetUsername });
    if (res.user) {
      currentUser = res.user;
      currentRole = res.user.role;
      localStorage.setItem('steamcraft_user', JSON.stringify(res.user));
      if (res.token) localStorage.setItem('steamcraft_token', res.token);
      selectedProjectId = null;
      updateUserProfileUI();
      syncNavigation();
      showPage(currentRole === 'student' ? 'dashboard' : 'mission');
      showToast(`Beralih ke peran: ${currentRole === 'student' ? 'Mahasiswa' : 'Dosen Pembimbing / Juri'}`);
    }
  } catch (e) {
    console.error(e);
  }
}

function logout() {
  localStorage.removeItem('steamcraft_token');
  localStorage.removeItem('steamcraft_user');
  api('/api/auth/logout', 'POST').catch(() => {});
  currentUser = null;
  currentRole = 'student';
  selectedProjectId = null;
  const devPill = document.getElementById('devModeIndicator');
  if (devPill) devPill.style.display = 'none';
  const topModeBtn = document.getElementById('topAppModeBtn');
  if (topModeBtn) topModeBtn.style.display = 'none';
  document.body.classList.remove('dev-mode-active');
  document.getElementById('workspaceApp').style.display = 'none';
  document.getElementById('loginScreen').style.display = 'grid';
  showToast('Anda telah keluar.');
}

function enterWorkspace() {
  document.getElementById('loginScreen').style.display = 'none';
  document.getElementById('workspaceApp').style.display = 'block';

  const devPill = document.getElementById('devModeIndicator');
  const topModeBtn = document.getElementById('topAppModeBtn');

  if (currentRole === 'admin') {
    if (devPill) devPill.style.display = 'inline-flex';
    if (topModeBtn) topModeBtn.style.display = 'inline-flex';
    document.body.classList.add('dev-mode-active');
    showToast('🛠️ Sesi Administrator Sistem Aktif.');
  } else {
    if (devPill) devPill.style.display = 'none';
    if (topModeBtn) topModeBtn.style.display = 'none';
    document.body.classList.remove('dev-mode-active');
  }

  applyAppModeUI(currentAppMode);
  updateUserProfileUI();
  syncNavigation();
  loadAllProjects();
  updateNotificationBadges();

  if (currentRole === 'admin') {
    showPage('admin');
  } else if (currentRole === 'lecturer') {
    showPage('mission');
  } else {
    showPage('dashboard');
  }
}

function updateUserProfileUI() {
  if (!currentUser) return;
  document.getElementById('userName').textContent = currentUser.name;
  const initial = (currentUser.name || 'U').charAt(0).toUpperCase();
  const avatarEl = document.getElementById('userAvatar');
  if (avatarEl) {
    avatarEl.textContent = initial;
    avatarEl.style.background = currentUser.avatar_color || 'var(--primary)';
  }

  let roleText = '';
  if (currentUser.role === 'admin') {
    roleText = `🛠️ Administrator · ${currentUser.study_program || 'Sistem'}`;
  } else if (currentUser.role === 'lecturer') {
    roleText = `Dosen Pembimbing · ${currentUser.study_program}`;
  } else {
    roleText = `Mahasiswa · ${currentUser.study_program}`;
  }
  document.getElementById('userRoleBadge').textContent = roleText;
}

// ==================== PROFILE & IDENTITY MANAGEMENT ====================
function openEditProfileModal() {
  if (!currentUser) return;
  
  const nameInput = document.getElementById('profileName');
  if (nameInput) nameInput.value = currentUser.name || '';

  const idInput = document.getElementById('profileIdentifier');
  if (idInput) idInput.value = currentUser.identifier || '';
  
  const studySelect = document.getElementById('profileStudy');
  if (studySelect) {
    studySelect.value = currentUser.study_program || 'Sains Data';
  }

  const roleDisplay = document.getElementById('profileRoleDisplay');
  if (roleDisplay) {
    roleDisplay.value = currentUser.role === 'student' ? 'Mahasiswa Peneliti' : 'Dosen Pembimbing / Dewan Juri';
  }

  const facInput = document.getElementById('profileFaculty');
  if (facInput) facInput.value = currentUser.faculty || 'Fakultas Matematika dan Ilmu Pengetahuan Alam (FMIPA)';

  const univInput = document.getElementById('profileUniversity');
  if (univInput) univInput.value = currentUser.university || 'Universitas Indonesia';

  const intInput = document.getElementById('profileInterests');
  if (intInput) intInput.value = currentUser.research_interests || '';

  const bioInput = document.getElementById('profileBio');
  if (bioInput) bioInput.value = currentUser.bio || '';

  const linksInput = document.getElementById('profileLinks');
  if (linksInput) linksInput.value = currentUser.academic_links || '';

  const avatarColor = currentUser.avatar_color || '#2878d7';
  selectAvatarColor(avatarColor);

  openModal('editProfileModal');
}

function selectAvatarColor(hex) {
  const hiddenInput = document.getElementById('profileAvatarColor');
  if (hiddenInput) hiddenInput.value = hex;

  const preview = document.getElementById('profileModalAvatarPreview');
  if (preview) {
    const nameVal = document.getElementById('profileName') ? document.getElementById('profileName').value : (currentUser ? currentUser.name : 'B');
    preview.textContent = (nameVal || 'U').charAt(0).toUpperCase();
    preview.style.background = hex;
  }

  document.querySelectorAll('#avatarColorPickerList .color-dot-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.color === hex);
  });
}

function updateProfileAvatarPreview() {
  const nameVal = document.getElementById('profileName') ? document.getElementById('profileName').value : '';
  const preview = document.getElementById('profileModalAvatarPreview');
  if (preview) {
    preview.textContent = (nameVal.trim() || 'U').charAt(0).toUpperCase();
  }
}

async function handleEditProfileSubmit(e) {
  e.preventDefault();
  const name = document.getElementById('profileName').value.trim();
  const identifier = document.getElementById('profileIdentifier').value.trim();
  const study_program = document.getElementById('profileStudy').value;
  const faculty = document.getElementById('profileFaculty').value.trim();
  const university = document.getElementById('profileUniversity').value.trim();
  const research_interests = document.getElementById('profileInterests').value.trim();
  const bio = document.getElementById('profileBio').value.trim();
  const academic_links = document.getElementById('profileLinks').value.trim();
  const avatar_color = document.getElementById('profileAvatarColor').value;

  const btnSave = document.getElementById('btnSaveProfile');
  if (btnSave) {
    btnSave.disabled = true;
    btnSave.innerHTML = '<span>Menyimpan identitas...</span>';
  }

  try {
    const res = await api('/api/auth/profile', 'POST', {
      name,
      identifier,
      study_program,
      faculty,
      university,
      research_interests,
      bio,
      academic_links,
      avatar_color
    });

    if (res.user) {
      currentUser = res.user;
      updateUserProfileUI();
      if (currentActivePage === 'studentPortfolio') {
        loadStudentPortfolio();
      }
      closeModal('editProfileModal');
      showToast('✅ Identitas dan profil peneliti STEAM berhasil diperbarui!');
    }
  } catch (err) {
    console.error(err);
  } finally {
    if (btnSave) {
      btnSave.disabled = false;
      btnSave.innerHTML = '<span>💾 Simpan Identitas & Perbarui Profil</span>';
    }
  }
}

function syncNavigation() {
  document.querySelectorAll('#mainNav button').forEach(btn => {
    const roleAttr = btn.dataset.roles;
    if (currentRole === 'admin') {
      // Administrator has full visibility across all pages
      btn.style.display = 'inline-block';
    } else if (!roleAttr || roleAttr.includes(currentRole)) {
      btn.style.display = 'inline-block';
    } else {
      btn.style.display = 'none';
    }
  });
}

// ==================== PAGE NAVIGATION ====================
function showPage(pageId) {
  currentActivePage = pageId;

  // Update nav buttons
  document.querySelectorAll('#mainNav button').forEach(b => {
    b.classList.toggle('active', b.dataset.page === pageId);
  });

  // Show page section
  document.querySelectorAll('main.wrap > section.page').forEach(sec => {
    sec.classList.toggle('active', sec.id === pageId);
  });

  window.scrollTo({ top: 0, behavior: 'smooth' });
  updateNotificationBadges();

  // Trigger page-specific data refresh
  switch (pageId) {
    case 'dashboard':
      loadDashboard();
      break;
    case 'projects':
      loadProjectsCatalog();
      break;
    case 'workspace':
      if (!selectedProjectId) {
        const myProjs = getUserProjects();
        if (myProjs.length > 0) {
          selectedProjectId = myProjs[0].id;
        } else if (currentUser && currentUser.role === 'admin' && allProjects.length > 0) {
          selectedProjectId = allProjects[0].id;
        }
      }
      loadWorkspace(selectedProjectId);
      break;
    case 'recruitment':
      loadRecruitment();
      break;
    case 'studentConsultations':
      loadStudentConsultations();
      break;
    case 'studentAnnouncements':
      loadStudentAnnouncements();
      break;
    case 'studentResources':
      loadStudentResources();
      break;
    case 'studentPortfolio':
      loadStudentPortfolio();
      break;
    case 'mission':
      loadMissionControl();
      break;
    case 'consultations':
      loadLecturerConsultations();
      break;
    case 'announcements':
      loadLecturerAnnouncements();
      break;
    case 'resources':
      loadLecturerResources();
      break;
    case 'analytics':
      loadAnalytics();
      break;
    case 'admin':
      loadAdminDashboard();
      break;
  }
}

// Set click events on nav buttons
document.querySelectorAll('#mainNav button').forEach(b => {
  b.addEventListener('click', () => showPage(b.dataset.page));
});

// ==================== PROJECTS DATA & DASHBOARD ====================
async function loadAllProjects() {
  try {
    const res = await api('/api/projects');
    allProjects = res.projects || [];
    renderDashboardStats();
  } catch (e) {
    console.error(e);
  }
}

function renderDashboardStats() {
  const isStudent = currentRole === 'student';
  const myProjects = isStudent ? getUserProjects() : allProjects.filter(p => !p.archived);

  const activeCount = myProjects.filter(p => !p.archived).length;
  const doneCps = myProjects.reduce((acc, p) => acc + (p.checks ? p.checks.filter(Boolean).length : 0), 0);
  const totalCps = myProjects.length * 5;
  const avgProgress = totalCps > 0 ? Math.round((doneCps / totalCps) * 100) : 0;
  const totalMembers = myProjects.reduce((acc, p) => acc + (p.members_count || (p.members ? p.members.length : 1)), 0);
  const activeBlockers = myProjects.filter(p => p.blocker && !p.archived).length;

  const statProjects = document.getElementById('statProjects');
  const statChecks = document.getElementById('statChecks');
  const statPeople = document.getElementById('statPeople');
  const statBlockers = document.getElementById('statBlockers');

  if (statProjects) statProjects.textContent = activeCount;
  if (statChecks) statChecks.textContent = `${avgProgress}%`;
  if (statPeople) statPeople.textContent = (isStudent && myProjects.length === 0) ? 0 : totalMembers;
  if (statBlockers) statBlockers.textContent = activeBlockers;
}

function projectCardHTML(p) {
  let badgeClass = 'badge-blue';
  const s = p.study.toLowerCase();
  if (s.includes('fisika')) badgeClass = 'badge-orange';
  else if (s.includes('kimia')) badgeClass = 'badge-purple';
  else if (s.includes('biologi')) badgeClass = 'badge-teal';
  else if (s.includes('matematika')) badgeClass = 'badge-blue';
  else if (s.includes('pendidikan')) badgeClass = 'badge-rose';
  else if (s.includes('artificial') || s.includes('data')) badgeClass = 'badge-teal';
  else if (s.includes('aktuaria')) badgeClass = 'badge-purple';
  else if (s.includes('biomedis') || s.includes('robot')) badgeClass = 'badge-orange';
  else if (s.includes('bio')) badgeClass = 'badge-rose';

  const isBlocked = p.blocker && !p.archived;
  const statusBadge = isBlocked
    ? '<span class="badge badge-orange">🚩 Kendala (Blocker)</span>'
    : `<span class="badge badge-gray">${p.status}</span>`;

  const isMine = currentUser && (
    (p.creator_id && p.creator_id === currentUser.id) ||
    (p.members && p.members.some(m => 
      (m.user_id && m.user_id === currentUser.id) || 
      (m.identifier && currentUser.identifier && String(m.identifier).toLowerCase() === String(currentUser.identifier).toLowerCase()) ||
      (m.name && currentUser.name && m.name.toLowerCase() === currentUser.name.toLowerCase())
    ))
  );

  return `
    <div class="project-card" style="${isMine ? 'border: 2px solid var(--primary-light); box-shadow: 0 4px 12px rgba(40,120,215,0.08);' : ''}">
      <div>
        <div class="project-card-top">
          <div style="display: flex; gap: 6px; align-items: center; flex-wrap: wrap;">
            <span class="badge ${badgeClass}">${p.study}</span>
            ${isMine ? '<span class="badge badge-teal" style="font-weight: 800;">⭐ Proyek Saya</span>' : ''}
          </div>
          ${statusBadge}
        </div>
        <h3>${p.name}</h3>
        <p>${p.desc}</p>
        <div style="font-size: 11px; color: var(--muted); margin-bottom: 8px;">
          <strong>Target:</strong> ${p.goal || 'Belum dirumuskan'}
        </div>
      </div>

      <div>
        <div class="progress-bar-wrap">
          <div class="progress-label-row">
            <span>Progres Riset (${p.checks ? p.checks.filter(Boolean).length : 0}/5 Checkpoint)</span>
            <span style="color: var(--primary); font-weight: 800;">${p.progress}%</span>
          </div>
          <div class="progress-track">
            <div class="progress-fill" style="width: ${p.progress}%;"></div>
          </div>
        </div>

        ${p.members && p.members.length > 0 ? `
          <div style="font-size: 11px; color: var(--navy); margin-bottom: 8px; background: var(--surface-alt); padding: 6px 10px; border-radius: 8px; border: 1px solid var(--line-light);">
            <strong>👥 Tim Kelompok:</strong> ${p.members.map(m => m.name.split(' ')[0]).join(', ')}
            ${p.leader ? `<span style="color: var(--muted); font-size: 10px; display: block; margin-top: 2px;">Ketua: <strong>${p.leader.name}</strong> (${p.leader.study_program})</span>` : ''}
          </div>
        ` : ''}

        <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 8px; padding-top: 10px; border-top: 1px solid var(--line);">
          <small style="color: var(--muted);">👥 ${p.members_count || (p.members ? p.members.length : 1)} Mahasiswa</small>
          <button class="btn ${isMine ? 'btn-primary' : 'btn-secondary'} btn-sm" onclick="openWorkspace(${p.id})">
            <span>${isMine ? 'Buka Ruang Kerja &rarr;' : 'Lihat Ruang Kerja &rarr;'}</span>
          </button>
        </div>
      </div>
    </div>
  `;
}

async function loadDashboard() {
  await loadAllProjects();
  loadDashboardAnnouncementsWidget();
  const list = document.getElementById('dashboardProjectsList');
  if (!list) return;

  const myProjects = getUserProjects();

  if (myProjects.length === 0) {
    list.innerHTML = `
      <div class="card" style="grid-column: 1/-1; text-align: center; color: var(--muted); padding: 52px 24px; background: white; border: 1.5px dashed var(--line); border-radius: 16px;">
        <div style="font-size: 46px; margin-bottom: 12px;">🧪</div>
        <h3 style="font-size: 18px; font-weight: 800; color: var(--navy); margin-bottom: 8px;">Selamat Datang di STEAM-Craft, ${currentUser ? currentUser.name : 'Peneliti'}!</h3>
        <p style="font-size: 13.5px; color: var(--ink-secondary); margin-bottom: 20px; max-width: 520px; margin-left: auto; margin-right: auto; line-height: 1.6;">
          Akun Anda sudah terdaftar di database kampus. Anda belum memiliki proyek riset aktif. Mulai kolaborasi riset multidisiplin dengan membuat proyek baru atau temukan tim di rekrutmen terbuka.
        </p>
        <div style="display: flex; gap: 10px; justify-content: center; flex-wrap: wrap;">
          <button class="btn btn-primary" onclick="openNewProjectModal()">
            <span>+ Buat Proyek Riset Baru</span>
          </button>
          <button class="btn btn-secondary" onclick="showPage('projects')">
            <span>🔍 Jelajahi Katalog Proyek Kampus</span>
          </button>
          <button class="btn btn-ghost" onclick="showPage('recruitment')">
            <span>👥 Rekrutmen Kolaborator</span>
          </button>
        </div>
      </div>
    `;
  } else {
    const recent = myProjects.slice(0, 3);
    list.innerHTML = recent.map(projectCardHTML).join('');
  }
}

async function loadProjectsCatalog() {
  await loadAllProjects();
  filterProjects();
}

function filterProjects() {
  const query = (document.getElementById('searchProjects')?.value || '').toLowerCase();
  const study = document.getElementById('filterStudy')?.value || '';
  const status = document.getElementById('filterStatus')?.value || '';
  const scope = document.getElementById('filterScope')?.value || 'all';

  const myProjects = getUserProjects();
  const myIds = new Set(myProjects.map(p => p.id));

  const filtered = allProjects.filter(p => {
    if (scope === 'mine' && !myIds.has(p.id)) return false;
    const matchQ = !query || p.name.toLowerCase().includes(query) || p.desc.toLowerCase().includes(query) || (p.goal && p.goal.toLowerCase().includes(query));
    const matchS = !study || p.study === study;
    const matchSt = !status || p.status === status;
    return matchQ && matchS && matchSt;
  });

  const list = document.getElementById('allProjectsList');
  if (list) {
    if (filtered.length === 0) {
      list.innerHTML = scope === 'mine'
        ? `<div class="card" style="grid-column: 1/-1; text-align: center; color: var(--muted); padding: 48px;">
            <div style="font-size: 32px; margin-bottom: 8px;">📁</div>
            <strong style="font-size: 15px; color: var(--navy);">Anda belum memiliki proyek riset sendiri.</strong>
            <p style="font-size: 13px; margin: 8px 0 16px;">Mulai buat proyek riset STEAM baru atau pilih "Semua Proyek Kampus".</p>
            <button class="btn btn-primary btn-sm" onclick="openNewProjectModal()">+ Buat Proyek Baru</button>
          </div>`
        : `<div class="card" style="grid-column: 1/-1; text-align: center; color: var(--muted); padding: 48px;">Tidak ada proyek yang sesuai dengan kriteria filter.</div>`;
    } else {
      list.innerHTML = filtered.map(projectCardHTML).join('');
    }
  }
}

// ==================== WORKSPACE (RUANG KERJA) ====================
async function openWorkspace(id) {
  selectedProjectId = id;
  showPage('workspace');
}

async function loadWorkspace(projectId) {
  const emptyState = document.getElementById('wsEmptyState');
  const contentWrapper = document.getElementById('wsContentWrapper');

  if (!projectId) {
    if (emptyState) emptyState.style.display = 'block';
    if (contentWrapper) contentWrapper.style.display = 'none';
    return;
  }

  try {
    const res = await api(`/api/projects/${projectId}`);
    if (!res || !res.project) {
      if (emptyState) emptyState.style.display = 'block';
      if (contentWrapper) contentWrapper.style.display = 'none';
      return;
    }

    if (emptyState) emptyState.style.display = 'none';
    if (contentWrapper) contentWrapper.style.display = 'block';
    selectedProjectId = projectId;

    const { project, checkpoints, journals, versions, activity, rubric, members } = res;

    // Header info
    document.getElementById('wsTitle').textContent = project.name;
    document.getElementById('wsDesc').textContent = project.desc + (project.goal ? ` | Sasaran: ${project.goal}` : '');
    document.getElementById('wsStudyBadge').textContent = project.study;
    document.getElementById('wsSteamBadge').textContent = project.steam;

    const statusBadge = document.getElementById('wsStatusBadge');
    if (project.blocker) {
      statusBadge.textContent = '🚩 Blocker Aktif';
      statusBadge.className = 'badge badge-orange';
    } else {
      statusBadge.textContent = project.status;
      statusBadge.className = 'badge badge-gray';
    }

    document.getElementById('wsPercentText').textContent = `${project.progress}% Selesai`;
    document.getElementById('wsProgressBar').style.width = `${project.progress}%`;

    // Team Metadata Strip
    const teamMembers = members || [];
    const leader = teamMembers.find(m => m.is_lead) || teamMembers[0];

    const teamCountBadge = document.getElementById('wsTeamCountBadge');
    if (teamCountBadge) {
      teamCountBadge.textContent = `${teamMembers.length} Mahasiswa Peneliti`;
    }

    const lecturerEl = document.getElementById('wsLecturerName');
    if (lecturerEl) {
      lecturerEl.textContent = project.lecturer || 'Dosen Pembimbing';
    }

    const leaderEl = document.getElementById('wsTeamLeaderName');
    if (leaderEl) {
      leaderEl.textContent = leader ? `${leader.name} (${leader.study_program})` : '-';
    }

    const avatarsStrip = document.getElementById('wsTeamAvatarsStrip');
    if (avatarsStrip) {
      avatarsStrip.innerHTML = teamMembers.map(m => `
        <div class="user-avatar" style="width: 28px; height: 28px; font-size: 11px; background: ${m.avatar_color || '#2878d7'};" title="${m.name} (${m.role} · ${m.study_program})">
          ${(m.name || 'U').charAt(0).toUpperCase()}
        </div>
      `).join('');
    }

    const teamCardCount = document.getElementById('wsTeamCardCount');
    if (teamCardCount) {
      teamCardCount.textContent = `${teamMembers.length} Peneliti Multidisiplin`;
    }

    // Render Team Roster Grid
    renderTeamMembersList(teamMembers, journals);

    // External Repo Link
    const repoLink = document.getElementById('wsRepoLink');
    if (project.repo_url) {
      repoLink.href = project.repo_url;
      repoLink.textContent = project.repo_url;
    } else {
      repoLink.href = '#';
      repoLink.textContent = 'Belum terhubung (Klik tombol Repositori di atas)';
    }

    document.getElementById('wsVersionCount').textContent = `v${project.versions_count}.0`;

    // Render Checkpoints with task assignees & timestamps
    renderCheckpointsList(checkpoints, project.archived, teamMembers);

    // Render Journals
    renderJournalsFeed(journals);

    // Render Versions
    renderVersionsList(versions);

    // Render Activity Log
    renderActivityFeed(activity);

    // Load AI Copilot Guidance
    loadAiGuidance(projectId);

  } catch (err) {
    console.error(err);
    if (emptyState) emptyState.style.display = 'block';
    if (contentWrapper) contentWrapper.style.display = 'none';
  }
}

function renderTeamMembersList(members, journals = []) {
  const container = document.getElementById('wsTeamMembersList');
  if (!container) return;

  if (!members || members.length === 0) {
    container.innerHTML = `<div style="color: var(--muted); padding: 12px;">Belum ada anggota tim terdaftar.</div>`;
    return;
  }

  container.innerHTML = members.map(m => {
    const journalCount = journals.filter(j => j.author_name && j.author_name.toLowerCase().includes(m.name.toLowerCase().split(' ')[0])).length;

    return `
      <div class="member-card ${m.is_lead ? 'is-lead' : ''}">
        <div class="user-avatar" style="width: 40px; height: 40px; font-size: 16px; background: ${m.avatar_color || '#2878d7'}; flex-shrink: 0;">
          ${(m.name || 'U').charAt(0).toUpperCase()}
        </div>
        <div style="flex: 1; min-width: 0;">
          <div style="display: flex; align-items: center; gap: 6px; flex-wrap: wrap;">
            <strong style="font-size: 13px; color: var(--navy); white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${m.name}</strong>
            ${m.is_lead ? '<span class="badge badge-teal" style="font-size: 9px; padding: 1px 6px;">👑 Ketua Tim</span>' : '<span class="badge badge-gray" style="font-size: 9px; padding: 1px 6px;">Anggota</span>'}
          </div>
          <div style="font-size: 11px; color: var(--muted); margin-top: 2px;">
            <span>NIM: ${m.identifier}</span> · <span style="font-weight: 600; color: var(--primary);">${m.study_program}</span>
          </div>
          <div style="font-size: 11px; color: var(--navy); font-weight: 700; margin-top: 4px;">
            📌 ${m.role}
          </div>
          <div style="font-size: 10px; color: var(--muted); margin-top: 4px;">
            📝 Kontribusi: <strong>${journalCount} Logbook Jurnal</strong>
          </div>
        </div>
        ${!m.is_lead ? `
          <button class="btn btn-ghost btn-sm" onclick="handleRemoveTeamMember(${m.id}, '${m.name}')" title="Hapus anggota tim" style="padding: 4px 6px; color: var(--muted);">
            🗑️
          </button>
        ` : ''}
      </div>
    `;
  }).join('');
}

function openAddTeamMemberModal() {
  document.getElementById('newMemberName').value = '';
  document.getElementById('newMemberIdentifier').value = '';
  document.getElementById('newMemberRole').value = '';
  openModal('addTeamMemberModal');
}

async function handleAddTeamMemberSubmit(e) {
  e.preventDefault();
  const name = document.getElementById('newMemberName').value.trim();
  const identifier = document.getElementById('newMemberIdentifier').value.trim();
  const study_program = document.getElementById('newMemberStudy').value;
  const role = document.getElementById('newMemberRole').value.trim();

  try {
    await api(`/api/projects/${selectedProjectId}/members`, 'POST', {
      name, identifier, study_program, role
    });
    closeModal('addTeamMemberModal');
    showToast(`✓ Mahasiswa ${name} berhasil didaftarkan ke dalam tim kelompok!`);
    loadWorkspace(selectedProjectId);
    loadAllProjects();
  } catch (err) {
    console.error(err);
  }
}

async function handleRemoveTeamMember(memberId, memberName) {
  if (!confirm(`Hapus anggota ${memberName} dari kelompok proyek ini?`)) return;
  try {
    await api(`/api/projects/${selectedProjectId}/members/${memberId}`, 'DELETE');
    showToast(`Anggota ${memberName} telah dihapus dari tim.`);
    loadWorkspace(selectedProjectId);
    loadAllProjects();
  } catch (err) {
    console.error(err);
  }
}

function renderCheckpointsList(cps, isArchived, members = []) {
  const container = document.getElementById('checkpointsList');
  if (!container) return;

  const total = cps.length;
  const doneCount = cps.filter(c => c.is_completed).length;
  const pct = total > 0 ? Math.round((doneCount / total) * 100) : 0;
  const isLecturer = currentRole === 'lecturer';

  let html = `
    <div style="margin-bottom: 14px; background: var(--surface-alt); padding: 10px 14px; border-radius: 10px; border: 1px solid var(--line); display: flex; justify-content: space-between; align-items: center; font-size: 12px; flex-wrap: wrap; gap: 8px;">
      <span style="color: var(--navy); font-weight: 700;">Status Pengerjaan Tugas: <strong>${doneCount} dari ${total} Tahap Selesai (${pct}%)</strong></span>
      <div style="display: flex; align-items: center; gap: 6px;">
        <span class="badge ${pct === 100 ? 'badge-teal' : 'badge-blue'}">${pct === 100 ? '✓ Selesai Penuh' : 'Dalam Pengerjaan'}</span>
        ${isLecturer ? '<span class="badge badge-purple" style="font-size: 10px;">Mode Supervisi Dosen</span>' : ''}
      </div>
    </div>
  `;

  html += cps.map((cp, idx) => {
    const isDone = Boolean(cp.is_completed);
    const isConfirmed = Boolean(cp.confirmed_by_lecturer);
    const dateFormatted = cp.completed_at ? new Date(cp.completed_at).toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' }) : '';
    const assignee = cp.completed_by || 'Ketua/Anggota Tim';
    const cleanTitle = (cp.title || '').replace(/'/g, "\\'").replace(/"/g, '&quot;');
    const cleanDesc = (cp.description || cp.desc || '').replace(/'/g, "\\'").replace(/"/g, '&quot;');

    // Status Pill
    let statusPillHtml = '';
    if (isDone) {
      if (isConfirmed) {
        statusPillHtml = `<span class="checkpoint-status-pill done" style="background: #dcfce7; color: #15803d; border-color: #86efac;">✓ Dikonfirmasi Dosen</span>`;
      } else {
        statusPillHtml = `<span class="checkpoint-status-pill done" style="background: #e0f2fe; color: #0369a1; border-color: #bae6fd;">✓ Diserahkan (Terkunci)</span>`;
      }
    } else {
      statusPillHtml = `<span class="checkpoint-status-pill pending">⏳ Belum Diserahkan (0%)</span>`;
    }

    // Input Trigger / Checkbox logic
    let checkboxHtml = '';
    if (isDone) {
      if (isLecturer) {
        checkboxHtml = `<input type="checkbox" checked title="Klik untuk membuka opsi supervisi dosen" onchange="openReopenCheckpointModal(${selectedProjectId}, ${cp.stage_index}, '${cleanTitle}', '${cleanDesc}')">`;
      } else {
        checkboxHtml = `<input type="checkbox" checked disabled title="Tugas telah diserahkan dan terkunci" style="cursor: not-allowed; opacity: 0.85;" onclick="alertLockedCheckpoint()">`;
      }
    } else {
      checkboxHtml = `<input type="checkbox" ${isArchived ? 'disabled' : ''} title="Klik untuk menyerahkan tugas checkpoint" onclick="this.checked = false; openSubmitCheckpointModal(${selectedProjectId}, ${cp.stage_index}, '${cleanTitle}', '${cleanDesc}')">`;
    }

    // Action button logic
    let actionBtnHtml = '';
    if (!isArchived) {
      if (isDone) {
        if (isLecturer) {
          actionBtnHtml = `
            <div style="display: flex; gap: 6px; align-items: center;">
              ${!isConfirmed ? `
                <button class="btn btn-sm btn-success" onclick="confirmLecturerCheckpoint(${selectedProjectId}, ${cp.stage_index})" title="Konfirmasi & setujui secara resmi" style="font-size: 11px; padding: 4px 8px;">
                  ✓ Konfirmasi
                </button>
              ` : ''}
              <button class="btn btn-sm btn-ghost" onclick="openReopenCheckpointModal(${selectedProjectId}, ${cp.stage_index}, '${cleanTitle}', '${cleanDesc}')" title="Buka kembali checkpoint untuk revisi mahasiswa" style="font-size: 11px; padding: 4px 8px; color: #c2410c;">
                🔓 Buka Revisi
              </button>
            </div>
          `;
        } else {
          actionBtnHtml = `
            <button class="btn btn-ghost btn-sm" onclick="alertLockedCheckpoint()" title="Tugas terkunci" style="font-size: 11px; padding: 4px 8px; color: var(--muted); cursor: not-allowed;">
              🔒 Terkunci
            </button>
          `;
        }
      } else {
        actionBtnHtml = `
          <button class="btn btn-primary btn-sm" onclick="openSubmitCheckpointModal(${selectedProjectId}, ${cp.stage_index}, '${cleanTitle}', '${cleanDesc}')" style="font-size: 11px; padding: 5px 12px; white-space: nowrap;">
            📤 Serahkan
          </button>
        `;
      }
    }

    return `
      <div class="checkpoint-item ${isDone ? 'done' : ''}">
        ${checkboxHtml}
        <div class="checkpoint-info" style="flex: 1;">
          <div style="display: flex; justify-content: space-between; align-items: flex-start; gap: 8px;">
            <h4 style="margin: 0;">
              <span>Tahap ${idx + 1}: ${cp.title}</span>
            </h4>
            ${statusPillHtml}
          </div>
          <p style="margin: 4px 0 6px 0;">${cp.description}</p>
          <div class="checkpoint-meta-row">
            ${isDone ? `
              <span style="color: #15803d; font-weight: 700;">
                ✓ Diserahkan oleh: <strong style="color: var(--navy);">${assignee}</strong>
              </span>
              <span style="color: var(--muted);">Waktu: ${dateFormatted}</span>
              ${cp.submission_notes ? `<span style="color: var(--navy); display: block; width: 100%; margin-top: 2px;">📝 <em>"${cp.submission_notes}"</em></span>` : ''}
              <span style="color: #b45309; font-size: 10.5px; display: block; width: 100%; margin-top: 2px;">
                🔒 Tidak bisa dibatalkan kecuali dikonfirmasi/dibuka kembali oleh Dosen Pembimbing
              </span>
            ` : `
              <span style="color: var(--muted); font-style: italic;">
                ⏳ Menunggu pengerjaan dan penyerahan oleh tim kelompok mahasiswa
              </span>
            `}
          </div>
        </div>
        <div style="margin-left: 12px; display: flex; align-items: center;">
          ${actionBtnHtml}
        </div>
      </div>
    `;
  }).join('');

  container.innerHTML = html;
}

function openSubmitCheckpointModal(projectId, stageIndex, title, desc) {
  pendingCheckpointProjectId = projectId;
  pendingCheckpointStageIndex = stageIndex;
  pendingCheckpointTitle = title;
  pendingCheckpointDesc = desc;

  const stageBadge = document.getElementById('submitCpStageBadge');
  if (stageBadge) stageBadge.textContent = `Tahap ${stageIndex + 1}`;

  const titleEl = document.getElementById('submitCpStageTitle');
  if (titleEl) titleEl.textContent = title;

  const descEl = document.getElementById('submitCpStageDesc');
  if (descEl) descEl.textContent = desc;

  const studentEl = document.getElementById('submitCpStudentName');
  if (studentEl) {
    const uName = currentUser ? currentUser.name : 'Mahasiswa Peneliti';
    const uStudy = currentUser ? (currentUser.study_program || 'Sains Data') : 'Sains Terapan';
    studentEl.textContent = `${uName} (${uStudy})`;
  }

  const notesEl = document.getElementById('submitCpNotes');
  if (notesEl) notesEl.value = '';

  openModal('submitCheckpointModal');
}

async function confirmSubmitCheckpointAction() {
  if (!pendingCheckpointProjectId || pendingCheckpointStageIndex === null) return;
  const notes = (document.getElementById('submitCpNotes')?.value || '').trim();
  const btn = document.getElementById('btnConfirmSubmitCp');
  if (btn) btn.disabled = true;

  try {
    const res = await api(`/api/projects/${pendingCheckpointProjectId}/checkpoints/${pendingCheckpointStageIndex}/toggle`, 'POST', { notes });
    closeModal('submitCheckpointModal');
    showToast('✓ ' + (res.message || 'Tugas checkpoint berhasil diserahkan kepada Dosen Pembimbing!'));

    if (inspectorProjectCache[pendingCheckpointProjectId]) {
      delete inspectorProjectCache[pendingCheckpointProjectId];
    }
    await loadAllProjects();
    if (currentActivePage === 'workspace') {
      loadWorkspace(pendingCheckpointProjectId);
    }
    if (currentActivePage === 'mission') {
      renderMissionTabContent();
    }
  } catch (err) {
    alert(err.message || 'Gagal menyerahkan checkpoint');
  } finally {
    if (btn) btn.disabled = false;
  }
}

function openReopenCheckpointModal(projectId, stageIndex, title, desc) {
  pendingCheckpointProjectId = projectId;
  pendingCheckpointStageIndex = stageIndex;
  pendingCheckpointTitle = title;
  pendingCheckpointDesc = desc;

  const titleEl = document.getElementById('reopenCpStageTitle');
  if (titleEl) titleEl.textContent = `Tahap ${stageIndex + 1}: ${title}`;

  const descEl = document.getElementById('reopenCpStageDesc');
  if (descEl) descEl.textContent = desc;

  openModal('reopenCheckpointModal');
}

async function confirmReopenCheckpointAction() {
  if (!pendingCheckpointProjectId || pendingCheckpointStageIndex === null) return;
  const btn = document.getElementById('btnConfirmReopenCp');
  if (btn) btn.disabled = true;

  try {
    const res = await api(`/api/projects/${pendingCheckpointProjectId}/checkpoints/${pendingCheckpointStageIndex}/toggle`, 'POST');
    closeModal('reopenCheckpointModal');
    showToast('🔓 ' + (res.message || 'Penyerahan checkpoint dibatalkan. Tugas dibuka kembali untuk revisi tim.'));

    if (inspectorProjectCache[pendingCheckpointProjectId]) {
      delete inspectorProjectCache[pendingCheckpointProjectId];
    }
    await loadAllProjects();
    if (currentActivePage === 'workspace') {
      loadWorkspace(pendingCheckpointProjectId);
    }
    if (currentActivePage === 'mission') {
      renderMissionTabContent();
    }
  } catch (err) {
    alert(err.message || 'Gagal membuka kembali checkpoint');
  } finally {
    if (btn) btn.disabled = false;
  }
}

function alertLockedCheckpoint() {
  alert('🔒 Tugas checkpoint ini telah diserahkan dan terkunci.\n\nSesuai ketentuan, tindakan ini tidak bisa dibatalkan kecuali dikonfirmasi atau dibuka kembali oleh Dosen Pembimbing.');
}

async function confirmLecturerCheckpoint(projectId, stageIndex) {
  try {
    const res = await api(`/api/projects/${projectId}/checkpoints/${stageIndex}/confirm`, 'POST');
    showToast('✓ ' + (res.message || 'Checkpoint resmi disetujui Dosen Pembimbing!'));

    if (inspectorProjectCache[projectId]) {
      delete inspectorProjectCache[projectId];
    }
    await loadAllProjects();
    if (currentActivePage === 'workspace') {
      loadWorkspace(projectId);
    }
    if (currentActivePage === 'mission') {
      renderMissionTabContent();
    }
  } catch (err) {
    alert(err.message || 'Gagal mengonfirmasi checkpoint');
  }
}

async function toggleCheckpoint(stageIndex) {
  // Fallback for legacy calls
  openSubmitCheckpointModal(selectedProjectId, stageIndex, 'Checkpoint Tahap', 'Penyerahan tugas riset');
}

function renderJournalsFeed(journals) {
  const container = document.getElementById('journalFeed');
  if (!container) return;

  if (!journals || journals.length === 0) {
    container.innerHTML = `<div style="text-align: center; color: var(--muted); padding: 24px;">Belum ada catatan jurnal riset. Tambahkan catatan observasi pertama Anda!</div>`;
    return;
  }

  container.innerHTML = journals.map(j => {
    let tagBadge = 'badge-blue';
    if (j.tag === 'Metodologi') tagBadge = 'badge-teal';
    else if (j.tag === 'Eksperimen') tagBadge = 'badge-orange';
    else if (j.tag === 'Blocker') tagBadge = 'badge-rose';
    else if (j.tag === 'Evaluasi') tagBadge = 'badge-purple';

    const attachmentHtml = (j.file_name && j.file_url) ? `
      <div style="margin-top: 8px;">
        <a href="${j.file_url}" target="_blank" class="attachment-pill" download="${j.file_name}">
          📎 Berkas Lampiran: ${j.file_name}
        </a>
      </div>
    ` : '';

    return `
      <div class="journal-item">
        <div class="journal-header">
          <div>
            <strong>${j.author_name}</strong>
            <span class="badge ${tagBadge}" style="margin-left: 6px;">${j.tag}</span>
          </div>
          <small>${j.created_at || ''}</small>
        </div>
        <div class="journal-text">${j.content}</div>
        ${attachmentHtml}
      </div>
    `;
  }).join('');
}

function renderVersionsList(versions) {
  const container = document.getElementById('versionsList');
  if (!container) return;

  if (!versions || versions.length === 0) {
    container.innerHTML = `<small style="color: var(--muted);">Belum ada riwayat rilis.</small>`;
    return;
  }

  container.innerHTML = versions.map(v => {
    const attachHtml = (v.file_name && v.file_url) ? `
      <a href="${v.file_url}" target="_blank" class="attachment-pill" download="${v.file_name}" style="margin-left: 6px; font-size: 11px;">
        📎 ${v.file_name}
      </a>
    ` : '';

    const repoHtml = v.artifact_url ? `
      <a href="${v.artifact_url}" target="_blank" style="margin-left: 6px; color: var(--primary); text-decoration: underline; font-size: 11px;">
        🔗 Build Repo
      </a>
    ` : '';

    return `
      <div style="display: flex; justify-content: space-between; align-items: center; padding: 10px 0; border-bottom: 1px solid var(--line-light); font-size: 12px;">
        <div>
          <strong style="color: var(--navy);">Build v${v.version_number}.0</strong> · <span>${v.note}</span>
          ${attachHtml}
          ${repoHtml}
        </div>
        <small style="color: var(--muted);">${v.created_at ? v.created_at.slice(0, 10) : ''}</small>
      </div>
    `;
  }).join('');
}

function renderActivityFeed(activity) {
  const container = document.getElementById('activityLogFeed');
  if (!container) return;

  if (!activity || activity.length === 0) {
    container.innerHTML = `<div style="color: var(--muted);">Belum ada aktivitas baru.</div>`;
    return;
  }

  container.innerHTML = activity.map(a => `
    <div style="padding: 6px 0; border-bottom: 1px solid var(--line-light);">
      <strong style="color: var(--navy);">${a.user_name}</strong>: <span>${a.action_text}</span>
      <div style="font-size: 10px; color: var(--muted);">${a.created_at || ''}</div>
    </div>
  `).join('');
}

// ==================== AI RESEARCH COPILOT ====================
async function loadAiGuidance(projectId) {
  const container = document.getElementById('aiGuidanceContent');
  if (!container) return;
  container.innerHTML = '<em>Menganalisis metodologi riset dan data proyek...</em>';

  try {
    const res = await api(`/api/ai/guidance?projectId=${projectId}`);
    const g = res.guidance;

    let html = `
      <div style="font-weight: 800; color: var(--primary); margin-bottom: 4px;">🎯 ${g.stage}</div>
      <p style="margin-bottom: 8px;">${g.disciplineAdvice}</p>
      <div style="font-weight: 700; margin-top: 8px;">Rekomendasi Langkah Nyata:</div>
      <ul>
        ${g.actionSteps.map(s => `<li>${s}</li>`).join('')}
      </ul>
      <div style="margin-top: 8px; font-size: 12px; color: var(--ink-secondary);">
        <strong>⚠️ Risiko Ilmiah:</strong> ${g.scientificRisk}
      </div>
      <div style="margin-top: 4px; font-size: 12px; color: var(--accent-teal);">
        <strong>📊 Kiat Rubrik STEAM:</strong> ${g.rubricFocus}
      </div>
    `;

    if (g.blockerAnalysis) {
      html += `
        <div style="background: var(--accent-orange-light); border: 1px solid var(--accent-orange); border-radius: 8px; padding: 10px; margin-top: 10px; color: var(--navy);">
          <strong>🚩 Analisis Blocker:</strong> ${g.blockerAnalysis.reason}
          <div style="font-size: 12px; margin-top: 4px;">${g.blockerAnalysis.urgentAction}</div>
        </div>
      `;
    }

    container.innerHTML = html;
  } catch (e) {
    container.innerHTML = '<span style="color: var(--muted);">AI Copilot siap membantu pertanyaan riset Anda.</span>';
  }
}

function refreshAiGuidance() {
  loadAiGuidance(selectedProjectId);
  showToast('Memperbarui saran riset AI Copilot...');
}

async function sendAiChat() {
  const input = document.getElementById('aiChatInput');
  const question = input.value.trim();
  if (!question) return;

  const container = document.getElementById('aiGuidanceContent');
  container.innerHTML = `<em>Sedang memproses pertanyaan: "${question}"...</em>`;
  input.value = '';

  try {
    const res = await api('/api/ai/chat', 'POST', { question, projectId: selectedProjectId });
    container.innerHTML = `
      <div style="margin-bottom: 8px; font-weight: 700; color: var(--primary);">💬 Tanya AI: "${question}"</div>
      <div style="white-space: pre-line; line-height: 1.6;">${res.answer}</div>
      <div style="margin-top: 12px; text-align: right;">
        <button class="btn btn-ghost btn-sm" onclick="loadAiGuidance(${selectedProjectId})">Kembali ke Panduan Checkpoint</button>
      </div>
    `;
  } catch (e) {
    console.error(e);
  }
}

// ==================== WORKSPACE MODAL ACTIONS ====================
function openConnectRepoModal() {
  const url = prompt('Masukkan URL repositori (GitHub, GitLab, Kaggle, atau Google Drive):', 'https://github.com/steamcraft/my-project');
  if (!url) return;
  api(`/api/projects/${selectedProjectId}/repo`, 'POST', { repo_url: url }).then(() => {
    showToast('Repositori eksternal berhasil dihubungkan!');
    loadWorkspace(selectedProjectId);
  });
}

function openAddJournalModal() {
  openModal('addJournalModal');
}

async function handleAddJournalSubmit(e) {
  e.preventDefault();
  const tag = document.getElementById('journalTag').value;
  const content = document.getElementById('journalContent').value.trim();
  const fileInput = document.getElementById('journalFileInput');

  try {
    let fileMeta = null;
    if (fileInput && fileInput.files && fileInput.files.length > 0) {
      showToast('Mengunggah berkas lampiran jurnal...');
      fileMeta = await uploadFile(fileInput);
    }

    await api(`/api/projects/${selectedProjectId}/journals`, 'POST', {
      tag,
      content,
      file_name: fileMeta ? fileMeta.fileName : null,
      file_url: fileMeta ? fileMeta.fileUrl : null
    });

    closeModal('addJournalModal');
    document.getElementById('journalContent').value = '';
    if (fileInput) fileInput.value = '';
    showToast('Catatan jurnal riset berhasil disimpan!');
    loadWorkspace(selectedProjectId);
  } catch (e) {
    console.error(e);
  }
}

function openAddVersionModal() {
  openModal('addVersionModal');
}

async function handleAddVersionSubmit(e) {
  e.preventDefault();
  const note = document.getElementById('versionNoteInput').value.trim();
  const repo_url = document.getElementById('versionRepoInput')?.value.trim() || '';
  const fileInput = document.getElementById('versionFileInput');

  try {
    let fileMeta = null;
    if (fileInput && fileInput.files && fileInput.files.length > 0) {
      showToast('Mengunggah berkas artefak build versi...');
      fileMeta = await uploadFile(fileInput);
    }

    await api(`/api/projects/${selectedProjectId}/versions`, 'POST', {
      note,
      repo_url,
      file_name: fileMeta ? fileMeta.fileName : null,
      file_url: fileMeta ? fileMeta.fileUrl : null
    });

    closeModal('addVersionModal');
    document.getElementById('versionNoteInput').value = '';
    if (document.getElementById('versionRepoInput')) document.getElementById('versionRepoInput').value = '';
    if (fileInput) fileInput.value = '';
    showToast('Versi iterasi baru berhasil dirilis!');
    loadWorkspace(selectedProjectId);
  } catch (e) {
    console.error(e);
  }
}

function openFlagBlockerModal() {
  openModal('flagBlockerModal');
}

async function handleFlagBlockerSubmit(e) {
  e.preventDefault();
  const reason = document.getElementById('blockerReason').value.trim();

  try {
    await api(`/api/projects/${selectedProjectId}/blocker`, 'POST', { blocker: 1, reason });
    closeModal('flagBlockerModal');
    document.getElementById('blockerReason').value = '';
    showToast('Status Blocker diaktifkan. Dosen pembimbing telah diberi notifikasi.');
    updateNotificationBadges();
    loadWorkspace(selectedProjectId);
    loadAllProjects();
  } catch (e) {
    console.error(e);
  }
}

async function submitProjectReview() {
  if (!confirm('Apakah Anda yakin ingin mengajukan seluruh dokumen dan artefak proyek ini untuk direview oleh Dosen Pembimbing?')) return;
  try {
    await api(`/api/projects/${selectedProjectId}/submit-review`, 'POST');
    showToast('Proyek berhasil diajukan untuk review resmi Dosen!');
    loadWorkspace(selectedProjectId);
    loadAllProjects();
  } catch (e) {
    console.error(e);
  }
}

function exportProjectSummary() {
  window.open(`/api/projects/${selectedProjectId}/export/json`, '_blank');
}

// ==================== NEW PROJECT WIZARD ====================
function openNewProjectModal() {
  openModal('newProjectModal');
}

function previewTemplateRecommendation() {
  // Live guidance preview when choosing template
}

async function handleCreateProjectSubmit(e) {
  e.preventDefault();
  const name = document.getElementById('newProjName').value.trim();
  const desc = document.getElementById('newProjDesc').value.trim();
  const study = document.getElementById('newProjStudy').value;
  const template = document.getElementById('newProjTemplate').value;
  const goal = document.getElementById('newProjGoal').value.trim();
  const tools = document.getElementById('newProjTools').value.trim();
  const repo_url = document.getElementById('newProjRepo').value.trim();
  const open_recruitment = document.getElementById('newProjOpenRecruit').checked ? 1 : 0;

  const lecturer = document.getElementById('newProjLecturer')?.value || 'Dr. Rahmat Wijaya, M.Sc.';

  let steamPillar = 'Science + Tech';
  if (template === 'actuary') steamPillar = 'Mathematics + Modelling';
  else if (template === 'experiment') steamPillar = 'Science + Engineering';
  else if (template === 'free') steamPillar = 'Multidiscipline + Art';

  try {
    const res = await api('/api/projects', 'POST', {
      name, desc, study, steam: steamPillar, template, goal, tools, repo_url, open_recruitment, lecturer
    });
    closeModal('newProjectModal');
    showToast('Workspace proyek STEAM baru berhasil dibuat!');
    await loadAllProjects();
    openWorkspace(res.projectId);
  } catch (e) {
    console.error(e);
  }
}

// ==================== RECRUITMENT ====================
async function loadRecruitment() {
  const container = document.getElementById('recruitmentList');
  if (!container) return;
  container.innerHTML = '<em>Memuat lowongan kolaborasi...</em>';

  try {
    const res = await api('/api/recruitment');
    const list = res.listings || [];

    if (list.length === 0) {
      container.innerHTML = `
        <div class="card" style="grid-column: 1/-1; text-align: center; color: var(--muted); padding: 56px 24px; border: 1.5px dashed var(--line); border-radius: 16px; background: white;">
          <div style="font-size: 46px; margin-bottom: 12px;">👥</div>
          <h3 style="font-size: 18px; font-weight: 800; color: var(--navy); margin-bottom: 6px;">Papan Kolaborasi & Rekrutmen Masih Kosong</h3>
          <p style="font-size: 13.5px; color: var(--ink-secondary); max-width: 480px; margin: 0 auto 18px; line-height: 1.5;">
            Belum ada tim riset yang membuka lowongan kolaborator saat ini. Buat proyek riset Anda dan buka rekrutmen untuk mengajak rekan lintas disiplin bergabung!
          </p>
          <button class="btn btn-primary btn-sm" onclick="openNewProjectModal()">
            <span>+ Buat Proyek & Buka Rekrutmen</span>
          </button>
        </div>
      `;
      return;
    }

    container.innerHTML = list.map(p => {
      const roles = (p.recruitment_roles || 'Peneliti Lintas Disiplin').split(',').map(r => r.trim());
      const apps = p.applications || [];

      return `
        <div class="project-card">
          <div>
            <div class="project-card-top">
              <span class="badge badge-teal">${p.study}</span>
              <span class="badge badge-blue">Mencari Anggota</span>
            </div>
            <h3>${p.name}</h3>
            <p>${p.desc}</p>
            <div style="margin: 12px 0;">
              <strong style="font-size: 11px; text-transform: uppercase; color: var(--muted); display: block; margin-bottom: 6px;">Peran yang Dibutuhkan:</strong>
              <div style="display: flex; gap: 6px; flex-wrap: wrap;">
                ${roles.map(r => `<span class="badge badge-purple">${r}</span>`).join('')}
              </div>
            </div>
          </div>

          <div>
            <div style="display: flex; justify-content: space-between; align-items: center; padding-top: 14px; border-top: 1px solid var(--line); margin-top: 12px;">
              <small style="color: var(--muted);">${apps.length} Pelamar Terdaftar</small>
              <button class="btn btn-primary btn-sm" onclick="openApplyRecruitmentModal(${p.id}, '${p.name}')">
                <span>Lamar Bergabung &rarr;</span>
              </button>
            </div>
          </div>
        </div>
      `;
    }).join('');
  } catch (e) {
    console.error(e);
  }
}

function openApplyRecruitmentModal(projId, projName) {
  document.getElementById('applyProjId').value = projId;
  document.getElementById('applyModalProjTitle').textContent = `Lamar ke: ${projName}`;
  openModal('applyRecruitModal');
}

async function handleApplyRecruitmentSubmit(e) {
  e.preventDefault();
  const projectId = document.getElementById('applyProjId').value;
  const role = document.getElementById('applyRole').value.trim();
  const message = document.getElementById('applyMessage').value.trim();

  try {
    await api('/api/recruitment/apply', 'POST', { projectId, role, message });
    closeModal('applyRecruitModal');
    showToast('Lamaran bergabung berhasil dikirim ke pemilik proyek!');
    loadRecruitment();
  } catch (e) {
    console.error(e);
  }
}

// ==================== STUDENT CONSULTATIONS ====================
async function loadStudentConsultations() {
  try {
    const res = await api('/api/consultations');
    const consultations = res.consultations || [];

    const pending = consultations.filter(c => ['Menunggu respons', 'Terjadwal'].includes(c.status));
    const done = consultations.filter(c => ['Selesai', 'Dibatalkan mahasiswa', 'Ditolak'].includes(c.status));

    const pContainer = document.getElementById('studentConsultPendingList');
    const dContainer = document.getElementById('studentConsultDoneList');

    if (pending.length === 0) {
      pContainer.innerHTML = `
        <div style="color: var(--muted); padding: 36px 18px; text-align: center; background: var(--surface-alt); border-radius: 12px; border: 1px dashed var(--line);">
          <div style="font-size: 32px; margin-bottom: 8px;">📅</div>
          <strong style="display: block; font-size: 14px; color: var(--navy); margin-bottom: 4px;">Tidak Ada Jadwal Bimbingan Aktif</strong>
          <p style="font-size: 12px; color: var(--ink-secondary); margin: 0;">Gunakan tombol "+ Ajukan Jadwal Bimbingan" di atas untuk meminta sesi review bersama dosen pembimbing.</p>
        </div>
      `;
    } else {
      pContainer.innerHTML = pending.map(c => `
        <div style="padding: 14px; border: 1px solid var(--line); border-radius: 12px; margin-bottom: 12px;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
            <strong style="color: var(--navy); font-size: 14px;">${c.topic}</strong>
            <span class="badge ${c.status === 'Terjadwal' ? 'badge-teal' : 'badge-orange'}">${c.status}</span>
          </div>
          <div style="font-size: 12px; color: var(--muted); margin-bottom: 8px;">
            <span>📅 ${c.date} ${c.time} WIB</span> · <span>📍 ${c.mode}</span>
          </div>
          <p style="font-size: 12px; color: var(--ink-secondary); margin-bottom: 8px;">${c.note || 'Tidak ada catatan persiapan.'}</p>
          <div style="display: flex; justify-content: space-between; align-items: center;">
            <small style="color: var(--primary); font-weight: 700;">Dosen: ${c.lecturer_name}</small>
            ${c.status === 'Menunggu respons' ? `<button class="btn btn-ghost btn-sm" onclick="cancelConsultation(${c.id})">Batalkan</button>` : ''}
          </div>
        </div>
      `).join('');
    }

    if (done.length === 0) {
      dContainer.innerHTML = `
        <div style="color: var(--muted); padding: 36px 18px; text-align: center; background: var(--surface-alt); border-radius: 12px; border: 1px dashed var(--line);">
          <div style="font-size: 32px; margin-bottom: 8px;">📓</div>
          <strong style="display: block; font-size: 14px; color: var(--navy); margin-bottom: 4px;">Belum Ada Riwayat Bimbingan Selesai</strong>
          <p style="font-size: 12px; color: var(--ink-secondary); margin: 0;">Catatan dan feedback evaluasi dari dosen setelah sesi konsultasi selesai akan diarsipkan di sini.</p>
        </div>
      `;
    } else {
      dContainer.innerHTML = done.map(c => `
        <div style="padding: 14px; border: 1px solid var(--line); border-radius: 12px; margin-bottom: 12px; background: var(--surface-alt);">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
            <strong style="color: var(--navy); font-size: 14px;">${c.topic}</strong>
            <span class="badge badge-gray">${c.status}</span>
          </div>
          <div style="font-size: 11px; color: var(--muted); margin-bottom: 6px;">
            ${c.date} · ${c.mode}
          </div>
          ${c.feedback ? `
            <div style="background: white; border-left: 3px solid var(--accent-teal); padding: 8px 12px; font-size: 12px; border-radius: 4px; margin-top: 6px;">
              <strong>Feedback Dosen:</strong> ${c.feedback}
            </div>
          ` : ''}
        </div>
      `).join('');
    }

  } catch (e) {
    console.error(e);
  }
}

function openRequestConsultModal() {
  const isStudent = currentUser && currentUser.role === 'student';
  const availableProjects = isStudent ? getUserProjects() : allProjects.filter(p => !p.archived);
  const sel = document.getElementById('consultProjectSelect');
  if (availableProjects.length === 0) {
    sel.innerHTML = '<option value="" disabled selected>Belum ada proyek riset aktif (Buat proyek terlebih dahulu)</option>';
  } else {
    sel.innerHTML = availableProjects.map(p => `<option value="${p.id}">${p.name}</option>`).join('');
  }
  document.getElementById('consultDate').value = new Date(Date.now() + 86400000 * 2).toISOString().slice(0, 10);
  openModal('requestConsultModal');
}

async function handleRequestConsultSubmit(e) {
  e.preventDefault();
  const projectId = document.getElementById('consultProjectSelect').value;
  if (!projectId) {
    showToast('Pilih proyek riset aktif Anda terlebih dahulu!');
    return;
  }
  const topic = document.getElementById('consultTopic').value.trim();
  const type = document.getElementById('consultType').value;
  const mode = document.getElementById('consultMode').value;
  const date = document.getElementById('consultDate').value;
  const time = document.getElementById('consultTime').value;
  const note = document.getElementById('consultNote').value.trim();

  try {
    await api('/api/consultations/request', 'POST', { projectId, topic, type, mode, date, time, note });
    closeModal('requestConsultModal');
    showToast('Permohonan jadwal bimbingan telah diajukan!');
    loadStudentConsultations();
  } catch (e) {
    console.error(e);
  }
}

async function cancelConsultation(id) {
  if (!confirm('Batalkan pengajuan jadwal bimbingan ini?')) return;
  try {
    await api('/api/consultations/cancel', 'POST', { id });
    showToast('Bimbingan dibatalkan.');
    loadStudentConsultations();
  } catch (e) {
    console.error(e);
  }
}

// ==================== STUDENT ANNOUNCEMENTS ====================
async function loadStudentAnnouncements() {
  const container = document.getElementById('studentAnnouncementsList');
  if (!container) return;

  try {
    const res = await api('/api/announcements');
    const list = res.announcements || [];

    if (list.length === 0) {
      container.innerHTML = `<div class="card" style="text-align: center; color: var(--muted); padding: 48px;">Belum ada pengumuman resmi.</div>`;
      return;
    }

    container.innerHTML = list.map(a => `
      <div class="card" style="${a.pinned ? 'border-color: #93c5fd; background: #fafcff;' : ''}">
        <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 10px;">
          <div style="display: flex; gap: 8px; align-items: center;">
            ${a.pinned ? '<span class="badge badge-rose">📌 Disematkan</span>' : ''}
            <span class="badge badge-teal">${a.category}</span>
            <small style="color: var(--muted);">${a.created_at ? a.created_at.slice(0, 10) : ''}</small>
          </div>
          <div style="display: flex; gap: 6px;">
            <button class="btn btn-ghost btn-sm" onclick="toggleSaveAnnouncement(${a.id})">
              <span>${a.is_saved ? '⭐ Tersimpan' : '☆ Simpan'}</span>
            </button>
            <button class="btn btn-ghost btn-sm" onclick="toggleReadAnnouncement(${a.id})">
              <span>${a.is_read ? '✓ Dibaca' : 'Tandai Dibaca'}</span>
            </button>
          </div>
        </div>
        <h3 style="font-size: 18px; font-weight: 800; color: var(--navy); margin-bottom: 8px;">${a.title}</h3>
        <p style="color: var(--ink-secondary); font-size: 13px; line-height: 1.6;">${a.body}</p>
        <div style="margin-top: 12px; font-size: 11px; color: var(--muted);">
          Dipublikasikan oleh: <strong>${a.author_name}</strong>
        </div>
      </div>
    `).join('');
  } catch (e) {
    console.error(e);
  }
}

async function toggleReadAnnouncement(id) {
  try {
    await api(`/api/announcements/${id}/toggle-read`, 'POST');
    loadStudentAnnouncements();
    updateNotificationBadges();
    loadDashboardAnnouncementsWidget();
    loadTopAnnouncements();
  } catch (e) {
    console.error(e);
  }
}

async function toggleSaveAnnouncement(id) {
  try {
    await api(`/api/announcements/${id}/toggle-save`, 'POST');
    loadStudentAnnouncements();
    updateNotificationBadges();
    loadDashboardAnnouncementsWidget();
    loadTopAnnouncements();
  } catch (e) {
    console.error(e);
  }
}

// ==================== NOTIFICATION BELL & TOP DROPDOWN ====================
function toggleNotifDropdown(e) {
  if (e) {
    e.stopPropagation();
  }
  const dropdown = document.getElementById('topNotifDropdown');
  if (!dropdown) return;

  const isHidden = dropdown.style.display === 'none' || !dropdown.style.display;
  if (isHidden) {
    dropdown.style.display = 'flex';
    loadTopAnnouncements();
  } else {
    dropdown.style.display = 'none';
  }
}

function closeNotifDropdown() {
  const dropdown = document.getElementById('topNotifDropdown');
  if (dropdown) dropdown.style.display = 'none';
}

// Auto-close notification dropdown when clicking outside
document.addEventListener('click', (e) => {
  const wrapper = document.getElementById('notifBellWrapper');
  const dropdown = document.getElementById('topNotifDropdown');
  if (dropdown && dropdown.style.display !== 'none') {
    if (wrapper && !wrapper.contains(e.target)) {
      dropdown.style.display = 'none';
    }
  }
});

async function loadTopAnnouncements() {
  const listEl = document.getElementById('dropdownAnnouncementsList');
  const countBadge = document.getElementById('dropdownUnreadCount');
  if (!listEl) return;

  try {
    const res = await api('/api/announcements');
    cachedAnnouncements = res.announcements || [];
    const unreadCount = cachedAnnouncements.filter(a => !a.is_read).length;

    if (countBadge) {
      if (unreadCount > 0) {
        countBadge.textContent = `${unreadCount} baru`;
        countBadge.style.display = 'inline-block';
      } else {
        countBadge.style.display = 'none';
      }
    }

    const bNotifBell = document.getElementById('badgeNotifBell');
    if (bNotifBell) {
      if (unreadCount > 0) {
        bNotifBell.textContent = unreadCount;
        bNotifBell.style.display = 'inline-flex';
      } else {
        bNotifBell.style.display = 'none';
      }
    }

    const bDashUnread = document.getElementById('dashAnnUnreadBadge');
    if (bDashUnread) {
      if (unreadCount > 0) {
        bDashUnread.textContent = `${unreadCount} baru`;
        bDashUnread.style.display = 'inline-block';
      } else {
        bDashUnread.style.display = 'none';
      }
    }

    if (cachedAnnouncements.length === 0) {
      listEl.innerHTML = `
        <div style="text-align: center; color: var(--muted); padding: 32px 16px; font-size: 12.5px;">
          <div style="font-size: 26px; margin-bottom: 6px;">📭</div>
          Tidak ada pemberitahuan atau pengumuman kampus saat ini.
        </div>
      `;
      return;
    }

    listEl.innerHTML = cachedAnnouncements.map(a => `
      <div class="notif-dropdown-item ${!a.is_read ? 'unread' : ''}" onclick="handleAnnouncementItemClick(${a.id})">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 3px;">
          <div style="display: flex; gap: 6px; align-items: center;">
            ${a.pinned ? '<span class="badge badge-rose" style="font-size: 9.5px; padding: 1px 6px;">📌</span>' : ''}
            <span class="badge badge-teal" style="font-size: 10px; padding: 1px 6px;">${a.category || 'Umum'}</span>
            ${!a.is_read ? '<span style="display: inline-block; width: 7px; height: 7px; border-radius: 50%; background: #ef4444;" title="Belum dibaca"></span>' : ''}
          </div>
          <small style="color: var(--muted); font-size: 10.5px;">${a.created_at ? a.created_at.slice(0, 10) : ''}</small>
        </div>
        <div style="font-weight: 700; font-size: 12.5px; color: var(--navy); line-height: 1.35;">${a.title}</div>
        <p style="font-size: 11.5px; color: var(--ink-secondary); margin: 0; line-height: 1.4; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;">
          ${a.body}
        </p>
        <div style="font-size: 10.5px; color: var(--muted); margin-top: 3px;">
          Oleh: <strong>${a.author_name || 'Dosen Pembimbing'}</strong>
        </div>
      </div>
    `).join('');
  } catch (err) {
    listEl.innerHTML = `<div style="text-align: center; color: var(--rose); padding: 20px; font-size: 12px;">Gagal memuat pemberitahuan.</div>`;
  }
}

// ==================== DASHBOARD ANNOUNCEMENTS MINI WIDGET ====================
async function loadDashboardAnnouncementsWidget() {
  const container = document.getElementById('dashboardAnnouncementsMiniList');
  const unreadBadge = document.getElementById('dashAnnUnreadBadge');
  if (!container) return;

  try {
    const res = await api('/api/announcements');
    const list = res.announcements || [];
    cachedAnnouncements = list;
    const unreadCount = list.filter(a => !a.is_read).length;

    if (unreadBadge) {
      if (unreadCount > 0) {
        unreadBadge.textContent = `${unreadCount} baru`;
        unreadBadge.style.display = 'inline-block';
      } else {
        unreadBadge.style.display = 'none';
      }
    }

    if (list.length === 0) {
      container.innerHTML = `
        <div style="text-align: center; color: var(--muted); padding: 20px; font-size: 12.5px; background: white; border-radius: 10px; border: 1px dashed var(--line);">
          Belum ada pemberitahuan atau pengumuman kampus saat ini.
        </div>
      `;
      return;
    }

    const topItems = list.slice(0, 3);
    container.innerHTML = topItems.map(a => `
      <div class="dash-ann-item ${!a.is_read ? 'unread' : ''}" onclick="handleAnnouncementItemClick(${a.id})" style="cursor: pointer;">
        <div style="flex: 1; min-width: 0;">
          <div style="display: flex; gap: 6px; align-items: center; margin-bottom: 4px; flex-wrap: wrap;">
            ${a.pinned ? '<span class="badge badge-rose" style="font-size: 9.5px; padding: 1px 6px;">📌 Sematan</span>' : ''}
            <span class="badge badge-teal" style="font-size: 10px; padding: 1px 6px;">${a.category || 'Umum'}</span>
            ${!a.is_read ? '<span class="badge badge-blue" style="font-size: 9.5px; font-weight: 800; padding: 1px 6px;">Baru</span>' : ''}
            <strong style="font-size: 13.5px; color: var(--navy); margin-left: 2px;">${a.title}</strong>
          </div>
          <p style="font-size: 12px; color: var(--ink-secondary); margin: 0; line-height: 1.4; display: -webkit-box; -webkit-line-clamp: 1; -webkit-box-orient: vertical; overflow: hidden;">
            ${a.body}
          </p>
        </div>
        <div style="text-align: right; flex-shrink: 0; font-size: 11px;">
          <div style="color: var(--muted); margin-bottom: 2px;">📅 ${a.created_at ? a.created_at.slice(0, 10) : ''}</div>
          <span style="color: var(--primary); font-weight: 700;">Buka &rarr;</span>
        </div>
      </div>
    `).join('');
  } catch (err) {
    container.innerHTML = `<div style="text-align: center; color: var(--muted); padding: 16px; font-size: 12px;">Gagal memuat pemberitahuan terkini.</div>`;
  }
}

// Open and View Announcement Detail in Modal
async function handleAnnouncementItemClick(id) {
  let item = (cachedAnnouncements || []).find(a => a.id === id);
  if (!item) {
    try {
      const res = await api('/api/announcements');
      cachedAnnouncements = res.announcements || [];
      item = cachedAnnouncements.find(a => a.id === id);
    } catch (e) {
      console.error(e);
    }
  }

  if (item) {
    // If not yet marked as read, trigger toggle-read
    if (!item.is_read) {
      try {
        await api(`/api/announcements/${id}/toggle-read`, 'POST');
        item.is_read = 1;
        updateNotificationBadges();
      } catch (err) {
        console.error(err);
      }
    }
    openAnnouncementDetailModal(item);
    loadTopAnnouncements();
    loadDashboardAnnouncementsWidget();
  }
}

function openAnnouncementDetailModal(item) {
  if (!item) return;
  const catEl = document.getElementById('modalAnnCategory');
  const pinEl = document.getElementById('modalAnnPinned');
  const dateEl = document.getElementById('modalAnnDate');
  const titleEl = document.getElementById('modalAnnTitle');
  const authorEl = document.getElementById('modalAnnAuthor');
  const bodyEl = document.getElementById('modalAnnBody');

  if (catEl) catEl.textContent = item.category || 'Akademik';
  if (pinEl) pinEl.style.display = item.pinned ? 'inline-flex' : 'none';
  if (dateEl) dateEl.textContent = item.created_at ? item.created_at.slice(0, 10) : '-';
  if (titleEl) titleEl.textContent = item.title || 'Pengumuman';
  if (authorEl) authorEl.textContent = `✍️ Dipublikasikan oleh: ${item.author_name || 'Dosen Pembimbing / Fakultas'} (${item.target === 'all' ? 'Semua Mahasiswa' : 'Proyek Terkait'})`;
  if (bodyEl) bodyEl.textContent = item.body || '';

  openModal('announcementDetailModal');
}

// Mark All Campus Announcements as Read
async function markAllAnnouncementsRead(e) {
  if (e) e.stopPropagation();
  try {
    const res = await api('/api/announcements');
    const list = res.announcements || [];
    const unread = list.filter(a => !a.is_read);
    for (const a of unread) {
      await api(`/api/announcements/${a.id}/toggle-read`, 'POST');
    }
    showToast('✓ Semua pengumuman berhasil ditandai dibaca.');
    updateNotificationBadges();
    loadTopAnnouncements();
    loadDashboardAnnouncementsWidget();
    const stAnn = document.getElementById('studentAnnouncements');
    if (stAnn && stAnn.classList.contains('active')) {
      loadStudentAnnouncements();
    }
  } catch (err) {
    showToast('Gagal menandai pengumuman.');
  }
}

// Route to Full Announcements Feed
function openFullAnnouncementsPage(e) {
  if (e) e.stopPropagation();
  closeNotifDropdown();
  if (currentUser && (currentUser.role === 'lecturer' || currentUser.role === 'admin')) {
    showPage('announcements');
  } else {
    showPage('studentAnnouncements');
  }
}

// ==================== STUDENT RESOURCES ====================
async function loadStudentResources() {
  const container = document.getElementById('studentResourceRequestsList');
  if (!container) return;

  try {
    const res = await api('/api/resources');
    const requests = res.requests || [];

    if (requests.length === 0) {
      container.innerHTML = `
        <div style="text-align: center; color: var(--muted); padding: 48px 24px; border: 1.5px dashed var(--line); border-radius: 12px; background: var(--surface-alt);">
          <div style="font-size: 36px; margin-bottom: 8px;">🔬</div>
          <h4 style="font-size: 15px; font-weight: 800; color: var(--navy); margin-bottom: 4px;">Belum Ada Pengajuan Fasilitas</h4>
          <p style="font-size: 13px; color: var(--ink-secondary); margin: 0;">Ajukan peminjaman instrumen riset (spektrofotometer, GPU cluster, 3D printer) melalui tombol di atas.</p>
        </div>
      `;
      return;
    }

    container.innerHTML = requests.map(r => {
      let statusBadge = 'badge-orange';
      if (r.status === 'Disetujui') statusBadge = 'badge-teal';
      else if (r.status === 'Ditolak') statusBadge = 'badge-rose';

      return `
        <div style="display: flex; justify-content: space-between; align-items: center; padding: 16px 0; border-bottom: 1px solid var(--line);">
          <div>
            <div style="display: flex; gap: 8px; align-items: center; margin-bottom: 4px;">
              <strong style="font-size: 15px; color: var(--navy);">${r.resource_name}</strong>
              <span class="badge ${statusBadge}">${r.status}</span>
            </div>
            <div style="font-size: 12px; color: var(--muted);">
              Proyek: <strong>${r.project_name}</strong> · Tanggal Dibutuhkan: <strong>${r.date_needed}</strong>
            </div>
            <p style="font-size: 12px; color: var(--ink-secondary); margin-top: 4px;">${r.note}</p>
            ${r.feedback ? `<div style="font-size: 12px; color: var(--accent-teal); margin-top: 4px;"><strong>Umpan Balik Lab:</strong> ${r.feedback}</div>` : ''}
          </div>
          <small style="color: var(--muted);">${r.student_name}</small>
        </div>
      `;
    }).join('');
  } catch (e) {
    console.error(e);
  }
}

function openRequestResourceModal() {
  const isStudent = currentUser && currentUser.role === 'student';
  const availableProjects = isStudent ? getUserProjects() : allProjects.filter(p => !p.archived);
  const sel = document.getElementById('resourceProjectSelect');
  if (availableProjects.length === 0) {
    sel.innerHTML = '<option value="" disabled selected>Belum ada proyek riset aktif (Buat proyek terlebih dahulu)</option>';
  } else {
    sel.innerHTML = availableProjects.map(p => `<option value="${p.id}">${p.name}</option>`).join('');
  }
  document.getElementById('resourceDateNeeded').value = new Date(Date.now() + 86400000 * 3).toISOString().slice(0, 10);
  openModal('requestResourceModal');
}

async function handleRequestResourceSubmit(e) {
  e.preventDefault();
  const projectId = document.getElementById('resourceProjectSelect').value;
  if (!projectId) {
    showToast('Pilih proyek riset aktif Anda terlebih dahulu!');
    return;
  }
  const resourceName = document.getElementById('resourceChoice').value;
  const dateNeeded = document.getElementById('resourceDateNeeded').value;
  const note = document.getElementById('resourceNote').value.trim();

  try {
    await api('/api/resources/request', 'POST', { projectId, resourceName, dateNeeded, note });
    closeModal('requestResourceModal');
    showToast('Permohonan fasilitas berhasil diajukan ke pengelola lab!');
    loadStudentResources();
  } catch (e) {
    console.error(e);
  }
}

// ==================== STUDENT PORTFOLIO ====================
async function loadStudentPortfolio() {
  await loadAllProjects();

  // Populate student profile header
  if (currentUser) {
    const pfName = document.getElementById('pfStudentName');
    if (pfName) pfName.textContent = currentUser.name;
    const pfMeta = document.getElementById('pfStudentMeta');
    if (pfMeta) pfMeta.textContent = `NIM / Identitas: ${currentUser.identifier} · Program Studi: ${currentUser.study_program}`;
    const pfAvatar = document.getElementById('pfAvatar');
    if (pfAvatar) {
      pfAvatar.textContent = (currentUser.name || 'U').charAt(0).toUpperCase();
      pfAvatar.style.background = currentUser.avatar_color || 'var(--primary)';
    }
    const pfRole = document.getElementById('pfRoleBadge');
    if (pfRole) {
      pfRole.textContent = currentUser.role === 'student' ? 'Mahasiswa Peneliti STEAM' : 'Dosen Pembimbing / Reviewer';
    }
    const pfAffil = document.getElementById('pfAffiliation');
    if (pfAffil) {
      const fac = currentUser.faculty || 'Fakultas Matematika dan Ilmu Pengetahuan Alam (FMIPA)';
      const univ = currentUser.university || 'Universitas Indonesia';
      pfAffil.textContent = `${fac} · ${univ}`;
    }
    const pfBioSec = document.getElementById('pfBioSection');
    if (pfBioSec) {
      const interests = (currentUser.research_interests || 'Sains, Teknologi, Rekayasa & Matematika')
        .split(',')
        .map(i => i.trim())
        .filter(Boolean);
      const bioText = currentUser.bio || 'Belum ada deskripsi profil. Klik tombol "Kelola Identitas & Profil" untuk melengkapi data bio dan fokus riset Anda.';
      const linksText = currentUser.academic_links || '';

      pfBioSec.innerHTML = `
        <div style="display: flex; justify-content: space-between; align-items: flex-start; gap: 16px; flex-wrap: wrap;">
          <div style="flex: 1; min-width: 260px;">
            <strong style="color: var(--navy); display: block; margin-bottom: 4px;">Pernyataan Peneliti & Fokus Riset:</strong>
            <p style="margin: 0; color: var(--ink-secondary); font-size: 13px; line-height: 1.6;">${bioText}</p>
            ${linksText ? `<div style="margin-top: 8px; font-size: 12px; color: var(--primary);"><strong>🔗 Profil Akademik:</strong> ${linksText}</div>` : ''}
          </div>
          <div style="min-width: 220px;">
            <strong style="color: var(--navy); display: block; margin-bottom: 6px; font-size: 12px;">Bidang Minat & Spesialisasi:</strong>
            <div style="display: flex; gap: 6px; flex-wrap: wrap;">
              ${interests.map(it => `<span class="badge badge-purple" style="font-size: 11px;">🔬 ${it}</span>`).join('')}
            </div>
          </div>
        </div>
      `;
    }
  }

  const myProjects = getUserProjects();

  // Calculate or extract STEAM Pillar Scores for this student's projects
  let scores = { S: 0, T: 0, E: 0, A: 0, M: 0 };
  const pWithScores = myProjects.find(p => p.steam_scores);
  if (pWithScores && pWithScores.steam_scores) {
    try { scores = JSON.parse(pWithScores.steam_scores); } catch (e) {}
  } else if (myProjects.length > 0) {
    const avgProg = Math.round(myProjects.reduce((a, b) => a + (b.progress || 0), 0) / myProjects.length);
    scores = { S: avgProg, T: avgProg, E: avgProg, A: Math.max(0, avgProg - 10), M: avgProg };
  } else if (currentUser && currentUser.role === 'admin') {
    scores = { S: 90, T: 85, E: 82, A: 76, M: 92 };
  }

  // Render SVG Radar Spider Chart
  const chartContainer = document.getElementById('portfolioRadarChart');
  if (chartContainer) {
    chartContainer.innerHTML = renderSvgRadar(scores, 300);
  }

  // Render 5-Dimension Performance Breakdown
  const dimContainer = document.getElementById('portfolioDimensionScores');
  if (dimContainer) {
    const dims = [
      { key: 'S', name: 'Science (Inkuiri & Metodologi Ilmiah)', val: scores.S, badge: 'badge-blue' },
      { key: 'T', name: 'Technology (Instrumentasi & Komputasi)', val: scores.T, badge: 'badge-teal' },
      { key: 'E', name: 'Engineering (Desain Rekayasa & Solusi)', val: scores.E, badge: 'badge-orange' },
      { key: 'A', name: 'Art / Design (Komunikasi Visual & Human-Centered)', val: scores.A, badge: 'badge-rose' },
      { key: 'M', name: 'Mathematics (Pemodelan Kuantitatif & Validasi)', val: scores.M, badge: 'badge-purple' }
    ];
    dimContainer.innerHTML = dims.map(d => `
      <div style="background: var(--surface-alt); padding: 12px 14px; border-radius: 10px; border: 1px solid var(--line);">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
          <div>
            <span class="badge ${d.badge}" style="margin-right: 6px; font-weight: 800;">${d.key}</span>
            <strong style="font-size: 13px; color: var(--navy);">${d.name}</strong>
          </div>
          <span style="font-weight: 900; font-size: 14px; color: var(--primary);">${d.val}/100</span>
        </div>
        <div class="progress-track" style="height: 6px;">
          <div class="progress-fill" style="width: ${d.val}%;"></div>
        </div>
      </div>
    `).join('');
  }

  // Render Projects List
  const container = document.getElementById('portfolioProjectsList');
  if (!container) return;

  const displayList = (currentUser && currentUser.role === 'admin') ? allProjects : myProjects;

  if (displayList.length === 0) {
    container.innerHTML = `
      <div class="card" style="text-align: center; color: var(--muted); padding: 48px 24px; border: 1.5px dashed var(--line); border-radius: 12px; background: white;">
        <div style="font-size: 38px; margin-bottom: 10px;">📊</div>
        <h4 style="font-size: 16px; font-weight: 800; color: var(--navy); margin-bottom: 6px;">Belum Ada Portofolio Riset</h4>
        <p style="font-size: 13px; color: var(--ink-secondary); margin-bottom: 16px; max-width: 480px; margin-left: auto; margin-right: auto; line-height: 1.5;">
          Proyek riset STEAM yang Anda buat atau ikuti akan otomatis terdata di sini beserta nilai akhir, evaluasi dosen, dan penilaian pilar STEAM.
        </p>
        <button class="btn btn-sm btn-primary" onclick="openNewProjectModal()">+ Mulai Proyek Pertama Anda</button>
      </div>
    `;
    return;
  }

  container.innerHTML = displayList.map(p => `
    <div style="border: 1px solid var(--line); border-radius: 12px; padding: 18px; margin-bottom: 14px;">
      <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 8px;">
        <div>
          <span class="badge badge-teal">${p.study}</span>
          <h4 style="font-size: 16px; font-weight: 800; color: var(--navy); margin-top: 4px;">${p.name}</h4>
        </div>
        <div>
          ${p.final_score ? `<span class="badge badge-blue" style="font-size: 13px;">Nilai: ${p.final_score.toFixed(1)} (${p.final_grade})</span>` : `<span class="badge badge-gray">${p.status}</span>`}
        </div>
      </div>
      <p style="font-size: 13px; color: var(--muted); margin-bottom: 12px;">${p.desc}</p>
      <div style="display: flex; justify-content: space-between; align-items: center; border-top: 1px solid var(--line-light); padding-top: 10px; font-size: 12px;">
        <span>Progres Checkpoint: <strong>${p.checks ? p.checks.filter(Boolean).length : 0}/5</strong> (${p.progress}%)</span>
        <div style="display: flex; gap: 8px;">
          <button class="btn btn-secondary btn-sm" onclick="window.open('/api/projects/${p.id}/dossier', '_blank')">📄 Cetak Dossier (PDF)</button>
          ${p.package_compiled ? `<a href="/api/projects/${p.id}/export/json" class="btn btn-secondary btn-sm" download>Unduh Paket Reproducibility</a>` : ''}
          <button class="btn btn-ghost btn-sm" onclick="openWorkspace(${p.id})">Buka Workspace</button>
        </div>
      </div>
    </div>
  `).join('');
}

function exportPortfolioCSV() {
  window.open('/api/analytics/export.csv', '_blank');
}

function exportPortfolioJSON() {
  const data = {
    platform: 'STEAM-Craft',
    student: currentUser ? currentUser.name : 'Mahasiswa',
    identifier: currentUser ? currentUser.identifier : '',
    exportedAt: new Date().toISOString(),
    projects: allProjects
  };
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = `steamcraft-portfolio-${currentUser ? currentUser.username : 'student'}.json`;
  a.click();
}

// ==================== MISSION CONTROL (DOSEN) ====================
function setMissionTab(tab) {
  currentMissionTab = tab;
  document.querySelectorAll('.mission-tab-btn').forEach((b, idx) => {
    const tabs = ['supervision', 'evaluation', 'reproducibility', 'templates'];
    b.classList.toggle('active', tabs[idx] === tab);
  });
  renderMissionTabContent();
}

async function loadMissionControl() {
  await loadAllProjects();
  if (currentMissionTab === 'templates' && cachedTemplates.length === 0) {
    try {
      const res = await api('/api/mission/templates');
      cachedTemplates = res.templates || [];
    } catch (e) {
      console.error(e);
    }
  }

  // Pre-load current selected project details for inspector
  const active = allProjects.filter(p => !p.archived);
  if (!missionSelectedProjectId && active.length > 0) {
    missionSelectedProjectId = active[0].id;
  }
  if (missionSelectedProjectId && !inspectorProjectCache[missionSelectedProjectId]) {
    try {
      const detail = await api(`/api/projects/${missionSelectedProjectId}`);
      inspectorProjectCache[missionSelectedProjectId] = detail;
    } catch (e) {
      console.error(e);
    }
  }

  renderMissionTabContent();
}

function setInspectorSubtab(subtab) {
  currentInspectorSubtab = subtab;
  renderMissionTabContent();
}

async function selectMissionProject(id) {
  missionSelectedProjectId = id;
  if (!inspectorProjectCache[id]) {
    try {
      const detail = await api(`/api/projects/${id}`);
      inspectorProjectCache[id] = detail;
    } catch (e) {
      console.error(e);
    }
  }
  renderMissionTabContent();
}

async function toggleMissionCheckpoint(projectId, stageIdx) {
  try {
    await api(`/api/projects/${projectId}/checkpoints/${stageIdx}/toggle`, 'POST');
    // Refresh cached detail
    const detail = await api(`/api/projects/${projectId}`);
    inspectorProjectCache[projectId] = detail;
    await loadAllProjects();
    showToast('Status checkpoint tugas berhasil diperbarui!');
    renderMissionTabContent();
  } catch (err) {
    console.error(err);
  }
}

async function quickUpdateStatus(id, status, defaultNote) {
  try {
    await api('/api/mission/feedback', 'POST', {
      projectId: id,
      status,
      note: defaultNote
    });
    showToast(`Status proyek diperbarui menjadi: ${status}`);
    updateNotificationBadges();
    await loadAllProjects();
    renderMissionTabContent();
  } catch (e) {
    console.error(e);
  }
}

async function resolveMissionBlocker(id) {
  try {
    await api('/api/mission/feedback', 'POST', {
      projectId: id,
      resolveBlocker: true,
      note: 'Dosen menandai blocker telah tertangani setelah sesi evaluasi klinik.'
    });
    showToast('Blocker berhasil diselesaikan!');
    updateNotificationBadges();
    await loadAllProjects();
    renderMissionTabContent();
  } catch (e) {
    console.error(e);
  }
}

async function openBlockerClinic(id) {
  try {
    await api('/api/mission/feedback', 'POST', {
      projectId: id,
      status: 'Klinik metodologi dibuka',
      note: 'Dosen membuka slot klinik konsultasi terfokus untuk menyelesaikan kendala riset.'
    });
    showToast('Klinik metodologi dibuka untuk proyek ini.');
    updateNotificationBadges();
    await loadAllProjects();
    renderMissionTabContent();
  } catch (e) {
    console.error(e);
  }
}

async function handleInspectorFeedbackSubmit(e, id) {
  e.preventDefault();
  const status = document.getElementById('insStatusSelect').value;
  const note = document.getElementById('insNoteText').value.trim();

  try {
    await api('/api/mission/feedback', 'POST', { projectId: id, status, note });
    showToast('Umpan balik supervisi berhasil dikirim ke mahasiswa!');
    updateNotificationBadges();
    await loadAllProjects();
    renderMissionTabContent();
  } catch (e) {
    console.error(e);
  }
}

function changeTemplateEditor(key) {
  currentTemplateKey = key;
  renderMissionTabContent();
}

function calcTemplateWeights() {
  const c = Number(document.getElementById('tplRubricC')?.value) || 0;
  const e = Number(document.getElementById('tplRubricE')?.value) || 0;
  const ct = Number(document.getElementById('tplRubricCt')?.value) || 0;
  const r = Number(document.getElementById('tplRubricR')?.value) || 0;

  const total = c + e + ct + r;
  const statusEl = document.getElementById('rubricWeightStatus');
  const saveBtn = document.getElementById('btnSaveTemplate');

  if (statusEl) {
    if (total === 100) {
      statusEl.className = 'rubric-valid-pill valid';
      statusEl.innerHTML = '✓ Total Bobot: 100% (Sesuai Regulasi Akreditasi)';
      if (saveBtn) saveBtn.disabled = false;
    } else {
      statusEl.className = 'rubric-valid-pill invalid';
      statusEl.innerHTML = `⚠️ Total Bobot: ${total}% (Harus tepat 100% - ${total > 100 ? 'Kelebihan ' + (total - 100) + '%' : 'Kurang ' + (100 - total) + '%'})`;
      if (saveBtn) saveBtn.disabled = true;
    }
  }
}

async function saveTemplateConfig(e) {
  e.preventDefault();
  const c = Number(document.getElementById('tplRubricC').value);
  const ev = Number(document.getElementById('tplRubricE').value);
  const ct = Number(document.getElementById('tplRubricCt').value);
  const r = Number(document.getElementById('tplRubricR').value);

  const total = c + ev + ct + r;
  if (total !== 100) {
    showToast(`Total bobot harus tepat 100% (saat ini ${total}%)`);
    return;
  }

  const checkpoints = [];
  for (let i = 0; i < 5; i++) {
    const titleInput = document.getElementById(`tplStageTitle_${i}`);
    const descInput = document.getElementById(`tplStageDesc_${i}`);
    checkpoints.push({
      title: titleInput ? titleInput.value.trim() : `Tahap ${i + 1}`,
      desc: descInput ? descInput.value.trim() : ''
    });
  }

  try {
    await api(`/api/mission/templates/${currentTemplateKey}`, 'POST', {
      checkpoints,
      rubricCompleteness: c,
      rubricEvidence: ev,
      rubricContribution: ct,
      rubricReproducibility: r
    });
    showToast('Konfigurasi template checkpoint & bobot rubrik berhasil diperbarui!');
    const res = await api('/api/mission/templates');
    cachedTemplates = res.templates || [];
    renderMissionTabContent();
  } catch (err) {
    console.error(err);
  }
}

function renderMissionTabContent() {
  const container = document.getElementById('missionTabContent');
  if (!container) return;

  if (currentMissionTab === 'supervision') {
    // Mode 1: Supervision & Blocker Master-Detail Split
    const active = allProjects.filter(p => !p.archived);
    if (!missionSelectedProjectId && active.length > 0) {
      missionSelectedProjectId = active[0].id;
    }
    const currentProj = active.find(p => p.id === missionSelectedProjectId) || active[0];

    if (!currentProj) {
      container.innerHTML = `
        <div class="card" style="text-align: center; color: var(--muted); padding: 56px 24px; border: 1.5px dashed var(--line); border-radius: 16px; background: white;">
          <div style="font-size: 46px; margin-bottom: 14px;">🎓</div>
          <h3 style="font-size: 18px; font-weight: 800; color: var(--navy); margin-bottom: 8px;">Selamat Datang di Mission Control Dosen, ${currentUser ? currentUser.name : 'Bapak/Ibu Dosen'}!</h3>
          <p style="font-size: 13.5px; color: var(--ink-secondary); max-width: 500px; margin: 0 auto 20px; line-height: 1.6;">
            Saat ini belum ada proyek riset mahasiswa aktif di bawah supervisi Anda. Saat mahasiswa membuat proposal riset atau mengajukan bimbingan, proyek akan tampil di panel ini secara real-time.
          </p>
          <div style="display: flex; gap: 10px; justify-content: center; flex-wrap: wrap;">
            <button class="btn btn-primary btn-sm" onclick="showPage('consultations')">
              <span>📅 Periksa Antrean Bimbingan</span>
            </button>
            <button class="btn btn-secondary btn-sm" onclick="setMissionTab('templates')">
              <span>⚙️ Atur Template 5 Checkpoint & Rubrik</span>
            </button>
          </div>
        </div>
      `;
      return;
    }

    // Check if detailed cache is present; if not, trigger fetch and render when loaded
    const cached = inspectorProjectCache[currentProj.id];
    if (!cached) {
      api(`/api/projects/${currentProj.id}`).then(detail => {
        inspectorProjectCache[currentProj.id] = detail;
        renderMissionTabContent();
      }).catch(err => console.error(err));
    }

    const projectData = cached ? cached.project : currentProj;
    const checkpoints = cached ? (cached.checkpoints || []) : [];
    const members = cached ? (cached.members || []) : (currentProj.members || []);
    const journals = cached ? (cached.journals || []) : [];
    const leader = members.find(m => m.is_lead) || members[0] || null;
    const doneCount = checkpoints.filter(c => c.is_completed).length;
    const totalCps = checkpoints.length || 5;
    const pct = totalCps > 0 ? Math.round((doneCount / totalCps) * 100) : projectData.progress;

    // Subtab content generation
    let subtabContentHtml = '';

    if (currentInspectorSubtab === 'checkpoints') {
      subtabContentHtml = `
        <div class="inspector-section">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 14px; flex-wrap: wrap; gap: 8px;">
            <div>
              <h4 style="font-size: 15px; font-weight: 800; color: var(--navy); margin: 0;">📋 Alur 5 Tahapan Ilmiah & Audit Tugas Mahasiswa</h4>
              <p style="font-size: 12px; color: var(--muted); margin-top: 2px;">Dosen dapat melihat status ketuntasan tiap tahap, mahasiswa pelaksana, dan waktu penyelesaian.</p>
            </div>
            <span class="badge ${pct === 100 ? 'badge-teal' : 'badge-blue'}" style="font-size: 11px;">
              ${doneCount} dari ${totalCps} Checkpoint Selesai (${pct}%)
            </span>
          </div>

          <div style="display: flex; flex-direction: column; gap: 10px;">
            ${checkpoints.map((cp, idx) => {
              const isDone = Boolean(cp.is_completed);
              const isConfirmed = Boolean(cp.confirmed_by_lecturer);
              const dateFormatted = cp.completed_at ? new Date(cp.completed_at).toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' }) : '';
              const assignee = cp.completed_by || (leader ? leader.name : 'Tim Kelompok');
              const cleanTitle = (cp.title || '').replace(/'/g, "\\'").replace(/"/g, '&quot;');
              const cleanDesc = (cp.description || cp.desc || '').replace(/'/g, "\\'").replace(/"/g, '&quot;');

              let statusPill = '';
              if (isDone) {
                if (isConfirmed) {
                  statusPill = '<span class="checkpoint-status-pill done" style="background: #dcfce7; color: #15803d; border-color: #86efac;">✓ Dikonfirmasi Dosen (100%)</span>';
                } else {
                  statusPill = '<span class="checkpoint-status-pill done" style="background: #e0f2fe; color: #0369a1; border-color: #bae6fd;">✓ Diserahkan Mahasiswa</span>';
                }
              } else {
                statusPill = '<span class="checkpoint-status-pill pending">⏳ Belum Diserahkan (0%)</span>';
              }

              return `
                <div class="checkpoint-item ${isDone ? 'done' : ''}" style="margin-bottom: 0;">
                  <div class="checkpoint-info" style="flex: 1;">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px; gap: 8px;">
                      <h4 style="font-size: 13px; font-weight: 800; margin: 0; color: var(--navy);">
                        Tahap ${idx + 1}: ${cp.title}
                      </h4>
                      ${statusPill}
                    </div>
                    <p style="font-size: 12px; color: var(--muted); margin: 4px 0 6px 0; line-height: 1.4;">${cp.description || cp.desc || ''}</p>
                    <div class="checkpoint-meta-row">
                      ${isDone ? `
                        <span style="color: #15803d; font-weight: 700;">
                          ✓ Diserahkan oleh: <strong style="color: var(--navy);">${assignee}</strong>
                        </span>
                        <span style="color: var(--muted);">Waktu: ${dateFormatted}</span>
                        ${cp.submission_notes ? `<span style="color: var(--navy); display: block; width: 100%; margin-top: 2px;">📝 Catatan Mahasiswa: <em>"${cp.submission_notes}"</em></span>` : ''}
                      ` : `
                        <span style="color: var(--muted); font-style: italic;">
                          ⏳ Menunggu pengerjaan dan bukti verifikasi oleh tim kelompok
                        </span>
                      `}
                    </div>
                  </div>
                  <div style="margin-left: 12px; display: flex; align-items: center; gap: 6px;">
                    ${isDone ? `
                      ${!isConfirmed ? `
                        <button class="btn btn-sm btn-success" onclick="confirmLecturerCheckpoint(${projectData.id}, ${cp.stage_index})" title="Beri konfirmasi persetujuan resmi dosen" style="white-space: nowrap; font-size: 11px; padding: 4px 8px;">
                          ✓ Konfirmasi
                        </button>
                      ` : ''}
                      <button class="btn btn-sm btn-ghost" onclick="openReopenCheckpointModal(${projectData.id}, ${cp.stage_index}, '${cleanTitle}', '${cleanDesc}')" title="Buka kembali checkpoint ini untuk revisi mahasiswa" style="white-space: nowrap; font-size: 11px; padding: 4px 8px; color: #c2410c;">
                        🔓 Buka Revisi
                      </button>
                    ` : `
                      <button class="btn btn-sm btn-primary" onclick="openSubmitCheckpointModal(${projectData.id}, ${cp.stage_index}, '${cleanTitle}', '${cleanDesc}')" title="Verifikasi dan serahkan langsung" style="white-space: nowrap; font-size: 11px; padding: 4px 10px;">
                        ✓ Serahkan
                      </button>
                    `}
                  </div>
                </div>
              `;
            }).join('')}
          </div>
        </div>
      `;
    } else if (currentInspectorSubtab === 'members') {
      subtabContentHtml = `
        <div class="inspector-section">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 14px; flex-wrap: wrap; gap: 8px;">
            <div>
              <h4 style="font-size: 15px; font-weight: 800; color: var(--navy); margin: 0;">👥 Roster Anggota Tim Kelompok (${members.length} Mahasiswa)</h4>
              <p style="font-size: 12px; color: var(--muted); margin-top: 2px;">Kolaborasi mahasiswa lintas disiplin MIPA, Pendidikan, dan Sains Terapan.</p>
            </div>
            <button class="btn btn-secondary btn-sm" onclick="openWorkspace(${projectData.id})">Kelola di Ruang Kerja &rarr;</button>
          </div>

          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 12px;">
            ${members.map(m => {
              const journalCount = journals.filter(j => j.author_name && j.author_name.toLowerCase().includes(m.name.toLowerCase().split(' ')[0])).length;
              return `
                <div class="member-card ${m.is_lead ? 'is-lead' : ''}">
                  <div class="user-avatar" style="width: 42px; height: 42px; font-size: 16px; background: ${m.avatar_color || '#2878d7'}; flex-shrink: 0;">
                    ${(m.name || 'U').charAt(0).toUpperCase()}
                  </div>
                  <div style="flex: 1; min-width: 0;">
                    <div style="display: flex; align-items: center; gap: 6px; flex-wrap: wrap;">
                      <strong style="font-size: 13px; color: var(--navy);">${m.name}</strong>
                      ${m.is_lead ? '<span class="badge badge-teal" style="font-size: 9px; padding: 1px 6px;">👑 Ketua Tim</span>' : '<span class="badge badge-gray" style="font-size: 9px; padding: 1px 6px;">Anggota</span>'}
                    </div>
                    <div style="font-size: 11px; color: var(--muted); margin-top: 2px;">
                      <span>NIM: <strong>${m.identifier}</strong></span> · <span style="color: var(--primary); font-weight: 600;">${m.study_program}</span>
                    </div>
                    <div style="font-size: 11px; color: var(--navy); font-weight: 700; margin-top: 4px;">
                      📌 ${m.role}
                    </div>
                    <div style="font-size: 10px; color: var(--muted); margin-top: 4px;">
                      📝 Kontribusi: <strong>${journalCount} Logbook Jurnal</strong>
                    </div>
                  </div>
                </div>
              `;
            }).join('')}
          </div>
        </div>
      `;
    } else if (currentInspectorSubtab === 'journals') {
      subtabContentHtml = `
        <div class="inspector-section">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 14px; flex-wrap: wrap; gap: 8px;">
            <div>
              <h4 style="font-size: 15px; font-weight: 800; color: var(--navy); margin: 0;">📓 Logbook Riset & Bukti Empiris Mahasiswa</h4>
              <p style="font-size: 12px; color: var(--muted); margin-top: 2px;">Catatan harian observasi, data eksperimen, dan kemajuan riset tim.</p>
            </div>
            <span class="badge badge-gray">${journals.length} Catatan Jurnal</span>
          </div>

          ${journals.length === 0 ? `
            <div style="text-align: center; color: var(--muted); padding: 32px; background: var(--surface-alt); border-radius: 12px;">
              Belum ada entri logbook jurnal yang diunggah oleh kelompok mahasiswa ini.
            </div>
          ` : `
            <div style="display: flex; flex-direction: column; gap: 12px;">
              ${journals.map(j => `
                <div style="background: var(--surface-alt); border: 1px solid var(--line); border-radius: 10px; padding: 14px;">
                  <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 6px;">
                    <strong style="font-size: 13px; color: var(--navy);">${j.title}</strong>
                    <span style="font-size: 11px; color: var(--muted);">${new Date(j.created_at).toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' })}</span>
                  </div>
                  <div style="font-size: 11px; color: var(--primary); font-weight: 700; margin-bottom: 6px;">
                    ✍️ Penulis: ${j.author_name || 'Mahasiswa'}
                  </div>
                  <p style="font-size: 12px; color: var(--ink-secondary); line-height: 1.4; margin-bottom: 8px;">${j.content}</p>
                  ${j.attachment_url ? `
                    <a href="${j.attachment_url}" target="_blank" class="attachment-pill">
                      📎 Lampiran: ${j.attachment_name || 'Lihat Berkas Riset'}
                    </a>
                  ` : ''}
                </div>
              `).join('')}
            </div>
          `}
        </div>
      `;
    } else if (currentInspectorSubtab === 'supervision') {
      subtabContentHtml = `
        <div class="inspector-section">
          <h4 style="font-size: 14px; font-weight: 800; color: var(--navy); margin-bottom: 10px;">⚡ Tindakan Supervisi Cepat</h4>
          <div style="display: flex; gap: 8px; flex-wrap: wrap;">
            <button class="btn btn-success btn-sm" onclick="quickUpdateStatus(${projectData.id}, 'Disetujui', 'Rencana penelitian dan metodologi disetujui dosen.')">
              ✓ Setujui Rencana
            </button>
            <button class="btn btn-secondary btn-sm" onclick="quickUpdateStatus(${projectData.id}, 'Revisi rencana', 'Perlu perbaikan metodologi riset dan literatur.')">
              ⚠️ Minta Revisi
            </button>
            <button class="btn btn-ghost btn-sm" onclick="quickUpdateStatus(${projectData.id}, 'Selesai', 'Riset dinyatakan selesai dan siap dinilai dewan juri.')">
              🏆 Tandai Selesai
            </button>
          </div>
        </div>

        <div class="inspector-section">
          <h4 style="font-size: 14px; font-weight: 800; color: var(--navy); margin-bottom: 10px;">💬 Berikan Catatan Ilmiah & Feedback</h4>
          <form onsubmit="handleInspectorFeedbackSubmit(event, ${projectData.id})">
            <div class="field" style="margin-bottom: 10px;">
              <label style="font-size: 11px;">Status Proyek Baru</label>
              <select id="insStatusSelect">
                <option value="Aktif" ${projectData.status === 'Aktif' ? 'selected' : ''}>Aktif (Lanjutkan Progres)</option>
                <option value="Revisi rencana" ${projectData.status === 'Revisi rencana' ? 'selected' : ''}>Revisi Rencana Metodologi</option>
                <option value="Review diajukan" ${projectData.status === 'Review diajukan' ? 'selected' : ''}>Review Diajukan</option>
                <option value="Selesai" ${projectData.status === 'Selesai' ? 'selected' : ''}>Selesai (Siap Penilaian)</option>
              </select>
            </div>
            <div class="field" style="margin-bottom: 10px;">
              <label style="font-size: 11px;">Catatan Arahan Dosen</label>
              <textarea id="insNoteText" rows="3" placeholder="Masukkan arahan komputasi, saran literatur, atau evaluasi validitas..." required></textarea>
            </div>
            <button type="submit" class="btn btn-primary btn-sm" style="width: 100%;">Kirim Feedback ke Tim Mahasiswa</button>
          </form>
        </div>
      `;
    }

    container.innerHTML = `
      <div class="mission-master-detail">
        <!-- Master Column: Project List -->
        <div>
          <div style="margin-bottom: 12px; display: flex; justify-content: space-between; align-items: center;">
            <strong style="color: var(--navy); font-size: 14px;">Daftar Proyek Aktif (${active.length})</strong>
            <small style="color: var(--muted);">Pilih untuk inspeksi</small>
          </div>
          <div style="max-height: 640px; overflow-y: auto; padding-right: 4px;">
            ${active.map(p => {
              const isSel = p.id === currentProj.id;
              const hasBlocker = p.blocker;
              const pLeader = p.leader ? p.leader.name : (p.members && p.members[0] ? p.members[0].name : 'Mahasiswa');
              const pCount = p.members ? p.members.length : (p.members_count || 1);
              const pDone = p.checks ? p.checks.filter(Boolean).length : 0;

              return `
                <div class="project-list-item ${isSel ? 'selected' : ''}" onclick="selectMissionProject(${p.id})" style="${hasBlocker ? 'border-left: 4px solid var(--accent-orange);' : ''}">
                  <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px;">
                    <span class="badge ${p.study.includes('Artificial') ? 'badge-teal' : 'badge-blue'}" style="font-size: 10px;">${p.study}</span>
                    ${hasBlocker ? '<span class="badge badge-orange" style="font-size: 10px;">🚩 Blocker</span>' : `<span class="badge badge-gray" style="font-size: 10px;">${p.status}</span>`}
                  </div>
                  <strong style="font-size: 13px; color: var(--navy); display: block; margin-bottom: 4px; line-height: 1.3;">${p.name}</strong>
                  <div style="font-size: 11px; color: var(--ink-secondary); margin-bottom: 4px;">
                    👑 Ketua: <strong>${pLeader}</strong> · 👥 ${pCount} Mhs
                  </div>
                  <div class="progress-track" style="height: 6px; margin-top: 6px;">
                    <div class="progress-fill" style="width: ${p.progress}%;"></div>
                  </div>
                  <div style="display: flex; justify-content: space-between; font-size: 10px; color: var(--muted); margin-top: 4px;">
                    <span>Tugas: <strong>${pDone}/5 Selesai (${p.progress}%)</strong></span>
                    <span>v${p.versions_count || 1}.0</span>
                  </div>
                </div>
              `;
            }).join('')}
          </div>
        </div>

        <!-- Detail Column: Project Inspector -->
        <div class="project-inspector">
          <div class="inspector-section">
            <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 8px;">
              <div>
                <span class="badge badge-blue">${projectData.study}</span>
                <span class="badge badge-teal" style="margin-left: 6px;">${projectData.steam}</span>
                <span class="badge ${projectData.blocker ? 'badge-orange' : 'badge-gray'}" style="margin-left: 6px;">${projectData.status}</span>
                <h2 style="font-size: 20px; font-weight: 900; color: var(--navy); margin-top: 8px;">${projectData.name}</h2>
              </div>
              <div style="display: flex; gap: 6px;">
                <button class="btn btn-secondary btn-sm" onclick="openWorkspace(${projectData.id})">Buka Ruang Kerja &rarr;</button>
                <button class="btn btn-secondary btn-sm" onclick="window.open('/api/projects/' + ${projectData.id} + '/dossier', '_blank')">📄 Cetak Dossier</button>
              </div>
            </div>
            <p style="font-size: 13px; color: var(--muted); line-height: 1.5;">${projectData.desc}</p>
            <div style="margin-top: 10px; font-size: 12px; color: var(--ink-secondary);">
              <strong>Target / Hipotesis:</strong> ${projectData.goal || 'Belum dirumuskan'}
            </div>

            <!-- Group & Progress Snapshot Strip -->
            <div style="background: var(--surface-alt); border: 1px solid var(--line); border-radius: 12px; padding: 14px 18px; margin-top: 14px; display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 14px;">
              <div>
                <small style="color: var(--muted); font-size: 10px; text-transform: uppercase; font-weight: 700;">Persentase Pengerjaan</small>
                <div style="display: flex; align-items: baseline; gap: 6px; margin-top: 2px;">
                  <strong style="font-size: 18px; color: var(--primary);">${projectData.progress}%</strong>
                  <span style="font-size: 11px; color: var(--navy); font-weight: 700;">(${doneCount}/5 Tugas Selesai)</span>
                </div>
                <div class="progress-track" style="height: 6px; margin-top: 6px;">
                  <div class="progress-fill" style="width: ${projectData.progress}%;"></div>
                </div>
              </div>
              <div>
                <small style="color: var(--muted); font-size: 10px; text-transform: uppercase; font-weight: 700;">Ketua Tim Kelompok</small>
                <div style="font-size: 13px; font-weight: 800; color: var(--navy); margin-top: 2px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
                  👑 ${leader ? leader.name : 'Mahasiswa'}
                </div>
                <div style="font-size: 11px; color: var(--muted); margin-top: 1px;">
                  ${leader ? `${leader.identifier} · ${leader.study_program}` : '-'}
                </div>
              </div>
              <div>
                <small style="color: var(--muted); font-size: 10px; text-transform: uppercase; font-weight: 700;">Jumlah Anggota Kelompok</small>
                <div style="font-size: 13px; font-weight: 800; color: var(--navy); margin-top: 2px;">
                  👥 ${members.length} Mahasiswa Peneliti
                </div>
                <div style="font-size: 11px; color: var(--muted); margin-top: 1px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
                  ${members.map(m => m.name.split(' ')[0]).join(', ')}
                </div>
              </div>
              <div>
                <small style="color: var(--muted); font-size: 10px; text-transform: uppercase; font-weight: 700;">Dosen Pembimbing</small>
                <div style="font-size: 13px; font-weight: 800; color: var(--navy); margin-top: 2px;">
                  🎓 ${projectData.lecturer || 'Dr. Rahmat Wijaya, M.Sc.'}
                </div>
                <div style="font-size: 11px; color: var(--muted); margin-top: 1px;">
                  FMIPA / Supervisi Aktif
                </div>
              </div>
            </div>
          </div>

          ${projectData.blocker ? `
            <div class="inspector-section" style="background: var(--accent-orange-light); border: 1px solid var(--accent-orange); border-radius: 12px; padding: 14px;">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
                <strong style="color: #c2410c; font-size: 14px;">🚩 Kendala Metodologis Terdeteksi (Blocker)</strong>
                <button class="btn btn-sm btn-ghost" onclick="resolveMissionBlocker(${projectData.id})" style="background: white; color: #c2410c; font-weight: 700;">✓ Selesaikan Blocker</button>
              </div>
              <p style="font-size: 12px; color: var(--navy); margin-bottom: 8px;">"${projectData.blocker_reason || 'Tim mahasiswa memerlukan klinik metodologi segera.'}"</p>
              <button class="btn btn-sm btn-primary" onclick="openBlockerClinic(${projectData.id})">⚡ Buka Sesi Klinik Bimbingan Blocker</button>
            </div>
          ` : ''}

          <!-- Inspector Subtabs Navigation -->
          <div class="inspector-subtabs">
            <button class="inspector-subtab-btn ${currentInspectorSubtab === 'checkpoints' ? 'active' : ''}" onclick="setInspectorSubtab('checkpoints')">
              📋 5 Checkpoint Tugas (${doneCount}/5 Selesai)
            </button>
            <button class="inspector-subtab-btn ${currentInspectorSubtab === 'members' ? 'active' : ''}" onclick="setInspectorSubtab('members')">
              👥 Anggota Kelompok (${members.length})
            </button>
            <button class="inspector-subtab-btn ${currentInspectorSubtab === 'journals' ? 'active' : ''}" onclick="setInspectorSubtab('journals')">
              📓 Logbook Jurnal (${journals.length})
            </button>
            <button class="inspector-subtab-btn ${currentInspectorSubtab === 'supervision' ? 'active' : ''}" onclick="setInspectorSubtab('supervision')">
              💬 Arahan & Feedback Dosen
            </button>
          </div>

          <!-- Inspector Dynamic Subtab Content -->
          ${subtabContentHtml}
        </div>
      </div>
    `;
  } else if (currentMissionTab === 'evaluation') {
    // Mode 2: Final Evaluation & Rubric
    const forEval = allProjects.filter(p => !p.archived);
    if (forEval.length === 0) {
      container.innerHTML = `
        <div class="card" style="text-align: center; color: var(--muted); padding: 56px 24px; border: 1.5px dashed var(--line); border-radius: 16px; background: white;">
          <div style="font-size: 44px; margin-bottom: 12px;">📊</div>
          <h3 style="font-size: 18px; font-weight: 800; color: var(--navy); margin-bottom: 6px;">Belum Ada Proyek untuk Dinilai</h3>
          <p style="font-size: 13.5px; color: var(--ink-secondary); max-width: 480px; margin: 0 auto 16px; line-height: 1.5;">
            Proyek mahasiswa yang aktif akan muncul di sini untuk dinilai berdasarkan 4 pilar rubrik terstandarisasi STEAM (Completeness, Evidence, Contribution, Reproducibility).
          </p>
        </div>
      `;
    } else {
      container.innerHTML = `
        <div class="card">
          <h3 style="font-size: 18px; font-weight: 800; color: var(--navy); margin-bottom: 16px;">Penilaian Rubrik STEAM 4 Pilar Resmi</h3>
          <p style="font-size: 13px; color: var(--muted); margin-bottom: 18px;">Pilih proyek untuk memberikan evaluasi terstandarisasi:</p>
          <div style="display: grid; gap: 12px;">
            ${forEval.map(p => `
              <div style="border: 1px solid var(--line); border-radius: 12px; padding: 16px; display: flex; justify-content: space-between; align-items: center;">
                <div>
                  <strong style="font-size: 15px; color: var(--navy);">${p.name}</strong>
                  <div style="font-size: 12px; color: var(--muted); margin-top: 4px;">
                    Status: <strong>${p.status}</strong> · Progres: <strong>${p.progress}%</strong>
                    ${p.final_score ? ` · <span style="color: var(--primary); font-weight: 800;">Skor: ${p.final_score.toFixed(1)} (${p.final_grade})</span>` : ''}
                  </div>
                </div>
                <button class="btn btn-primary btn-sm" onclick="openMissionEvaluateModal(${p.id}, '${p.name}')">
                  <span>${p.evaluation_recorded ? 'Ubah Penilaian Rubrik' : 'Beri Nilai Rubrik STEAM'}</span>
                </button>
              </div>
            `).join('')}
          </div>
        </div>
      `;
    }
  } else if (currentMissionTab === 'reproducibility') {
    // Mode 3: Reproducibility Package Compiler
    if (allProjects.length === 0) {
      container.innerHTML = `
        <div class="card" style="text-align: center; color: var(--muted); padding: 56px 24px; border: 1.5px dashed var(--line); border-radius: 16px; background: white;">
          <div style="font-size: 44px; margin-bottom: 12px;">📦</div>
          <h3 style="font-size: 18px; font-weight: 800; color: var(--navy); margin-bottom: 6px;">Belum Ada Paket Reproducibility</h3>
          <p style="font-size: 13.5px; color: var(--ink-secondary); max-width: 480px; margin: 0 auto 16px; line-height: 1.5;">
            Setelah mahasiswa mengunggah seluruh checkpoint, logbook empiris, dan repositori, Anda dapat mengompilasi paket reproducibility berstandar resmi di sini.
          </p>
        </div>
      `;
    } else {
      container.innerHTML = `
        <div class="card">
          <h3 style="font-size: 18px; font-weight: 800; color: var(--navy); margin-bottom: 16px;">Kompilasi Standar Reproducibility Package & Arsip</h3>
          <p style="font-size: 13px; color: var(--muted); margin-bottom: 18px;">Paket ini memvalidasi kelengkapan jurnal, snapshot repositori, dan penilaian dewan juri untuk akreditasi kompetisi.</p>
          <div style="display: grid; gap: 12px;">
            ${allProjects.map(p => `
              <div style="border: 1px solid var(--line); border-radius: 12px; padding: 16px; display: flex; justify-content: space-between; align-items: center;">
                <div>
                  <strong style="font-size: 15px; color: var(--navy);">${p.name}</strong>
                  <div style="font-size: 12px; color: var(--muted); margin-top: 4px;">
                    ${p.package_compiled ? '<span class="badge badge-teal">✓ Paket Terkompilasi</span>' : '<span class="badge badge-gray">Belum Terkompilasi</span>'}
                    ${p.archived ? '<span class="badge badge-gray">🔒 Diarsipkan</span>' : ''}
                  </div>
                </div>
                <div style="display: flex; gap: 8px;">
                  <button class="btn btn-secondary btn-sm" onclick="compileReproducibilityPackage(${p.id})">
                    <span>Kompilasi Paket JSON</span>
                  </button>
                  ${!p.archived ? `
                    <button class="btn btn-danger btn-sm" onclick="archiveProject(${p.id})">
                      <span>Arsipkan Proyek</span>
                    </button>
                  ` : ''}
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      `;
    }
  } else if (currentMissionTab === 'templates') {
    // Mode 4: Dynamic Checkpoint & Rubric Template Editor
    if (cachedTemplates.length === 0) {
      api('/api/mission/templates').then(res => {
        cachedTemplates = res.templates || [];
        renderMissionTabContent();
      }).catch(err => console.error(err));
      container.innerHTML = `<div class="card" style="text-align: center; padding: 48px;">Memuat konfigurasi template...</div>`;
      return;
    }

    const tpl = cachedTemplates.find(t => t.template_key === currentTemplateKey) || cachedTemplates[0];
    let cps = [];
    try { cps = JSON.parse(tpl.checkpoints_json); } catch (e) {
      cps = [
        { title: 'Perumusan Masalah & Telaah Literatur', desc: 'Identifikasi celah ilmiah dan formulasi hipotesis' },
        { title: 'Desain Eksperimen & Validasi Instrumen', desc: 'Kalibrasi sensor, arsitektur data pipeline, dan sampling' },
        { title: 'Akuisisi Data & Implementasi Model', desc: 'Eksperimen komputasi, training model, dan logging artefak' },
        { title: 'Analisis Galat & Uji Signifikansi', desc: 'Evaluasi statistik, kurva loss, dan uji hipotesis multidisiplin' },
        { title: 'Penyusunan Laporan & Paket Reproducibility', desc: 'Dossier riset lengkap, repositori terverifikasi, dan seminar hasil' }
      ];
    }

    const rC = tpl.rubric_completeness !== undefined ? tpl.rubric_completeness : 25;
    const rE = tpl.rubric_evidence !== undefined ? tpl.rubric_evidence : 25;
    const rCt = tpl.rubric_contribution !== undefined ? tpl.rubric_contribution : 25;
    const rR = tpl.rubric_reproducibility !== undefined ? tpl.rubric_reproducibility : 25;

    container.innerHTML = `
      <div class="card">
        <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 20px; flex-wrap: wrap; gap: 14px;">
          <div>
            <h3 style="font-size: 18px; font-weight: 800; color: var(--navy);">Editor Dinamis: Checkpoint & Bobot Rubrik STEAM</h3>
            <p style="font-size: 13px; color: var(--muted); margin-top: 4px;">Konfigurasikan tahapan alur ilmiah dan distribusi bobot 4 pilar akreditasi resmi.</p>
          </div>
          <div style="display: flex; align-items: center; gap: 8px;">
            <label style="font-size: 12px; font-weight: 700; color: var(--navy);">Pilih Template:</label>
            <select onchange="changeTemplateEditor(this.value)" style="padding: 8px 12px; border-radius: 8px; border: 1px solid var(--line); font-weight: 700; color: var(--navy);">
              <option value="data" ${tpl.template_key === 'data' ? 'selected' : ''}>Sains Terapan & AI (Scientific AI / Data)</option>
              <option value="experiment" ${tpl.template_key === 'experiment' ? 'selected' : ''}>Rekayasa & Eksperimen Lab</option>
              <option value="actuary" ${tpl.template_key === 'actuary' ? 'selected' : ''}>Matematika & Aktuaria</option>
              <option value="free" ${tpl.template_key === 'free' ? 'selected' : ''}>Inovasi Bebas & Seni Multidisiplin</option>
            </select>
          </div>
        </div>

        <form onsubmit="saveTemplateConfig(event)">
          <div style="display: grid; grid-template-columns: 1.2fr 0.8fr; gap: 24px;">
            <!-- Left: 5 Checkpoint Pipeline Editor -->
            <div>
              <h4 style="font-size: 15px; font-weight: 800; color: var(--navy); margin-bottom: 12px;">Alur Ilmiah (5 Tahapan Checkpoint)</h4>
              ${cps.map((cp, idx) => `
                <div class="template-editor-item">
                  <label>Tahap ${idx + 1}: Judul Checkpoint</label>
                  <input type="text" id="tplStageTitle_${idx}" value="${cp.title}" required style="width: 100%; padding: 8px; border: 1px solid var(--line); border-radius: 8px; font-size: 13px; font-weight: 700; margin-bottom: 6px;">
                  <label style="color: var(--muted);">Deskripsi & Indikator Keberhasilan</label>
                  <input type="text" id="tplStageDesc_${idx}" value="${cp.desc}" required style="width: 100%; padding: 8px; border: 1px solid var(--line); border-radius: 8px; font-size: 12px;">
                </div>
              `).join('')}
            </div>

            <!-- Right: 4 Pillars Rubric Weight Validator -->
            <div>
              <h4 style="font-size: 15px; font-weight: 800; color: var(--navy); margin-bottom: 12px;">Bobot Rubrik 4 Pilar (Wajib = 100%)</h4>
              <div style="background: var(--surface-alt); padding: 18px; border-radius: 12px; border: 1px solid var(--line);">
                <div class="rubric-row" style="margin-bottom: 12px;">
                  <div>
                    <strong style="font-size: 13px; color: var(--navy); display: block;">Pilar 1: Kelengkapan Checkpoint</strong>
                    <small style="color: var(--muted);">Ketuntasan 5 tahapan riset</small>
                  </div>
                  <div style="display: flex; align-items: center; gap: 4px;">
                    <input type="number" id="tplRubricC" min="0" max="100" value="${rC}" oninput="calcTemplateWeights()" style="width: 60px; text-align: center; padding: 6px; border-radius: 8px; border: 1px solid var(--line); font-weight: 800;"> %
                  </div>
                </div>

                <div class="rubric-row" style="margin-bottom: 12px;">
                  <div>
                    <strong style="font-size: 13px; color: var(--navy); display: block;">Pilar 2: Bukti Empiris & Jurnal</strong>
                    <small style="color: var(--muted);">Logbook, lampiran data & kalibrasi</small>
                  </div>
                  <div style="display: flex; align-items: center; gap: 4px;">
                    <input type="number" id="tplRubricE" min="0" max="100" value="${rE}" oninput="calcTemplateWeights()" style="width: 60px; text-align: center; padding: 6px; border-radius: 8px; border: 1px solid var(--line); font-weight: 800;"> %
                  </div>
                </div>

                <div class="rubric-row" style="margin-bottom: 12px;">
                  <div>
                    <strong style="font-size: 13px; color: var(--navy); display: block;">Pilar 3: Kontribusi Multidisiplin</strong>
                    <small style="color: var(--muted);">Integrasi STEM + Desain/Seni</small>
                  </div>
                  <div style="display: flex; align-items: center; gap: 4px;">
                    <input type="number" id="tplRubricCt" min="0" max="100" value="${rCt}" oninput="calcTemplateWeights()" style="width: 60px; text-align: center; padding: 6px; border-radius: 8px; border: 1px solid var(--line); font-weight: 800;"> %
                  </div>
                </div>

                <div class="rubric-row" style="margin-bottom: 18px;">
                  <div>
                    <strong style="font-size: 13px; color: var(--navy); display: block;">Pilar 4: Reproducibility & Open Science</strong>
                    <small style="color: var(--muted);">Artefak kode & replikasi hasil</small>
                  </div>
                  <div style="display: flex; align-items: center; gap: 4px;">
                    <input type="number" id="tplRubricR" min="0" max="100" value="${rR}" oninput="calcTemplateWeights()" style="width: 60px; text-align: center; padding: 6px; border-radius: 8px; border: 1px solid var(--line); font-weight: 800;"> %
                  </div>
                </div>

                <div style="padding-top: 12px; border-top: 1px solid var(--line); margin-bottom: 16px;">
                  <div id="rubricWeightStatus" class="rubric-valid-pill valid">
                    ✓ Total Bobot: 100% (Sesuai Regulasi Akreditasi)
                  </div>
                </div>

                <button type="submit" id="btnSaveTemplate" class="btn btn-primary" style="width: 100%; padding: 12px;">
                  <span>💾 Simpan Perubahan Template</span>
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    `;
    calcTemplateWeights();
  }
}

function openMissionReviewModal(id, name, status) {
  document.getElementById('reviewProjId').value = id;
  document.getElementById('reviewModalProjTitle').textContent = `Review Supervisi: ${name}`;
  document.getElementById('reviewStatusSelect').value = status;
  openModal('missionReviewModal');
}

async function handleMissionFeedbackSubmit(e) {
  e.preventDefault();
  const projectId = document.getElementById('reviewProjId').value;
  const status = document.getElementById('reviewStatusSelect').value;
  const note = document.getElementById('reviewNoteText').value.trim();

  try {
    await api('/api/mission/feedback', 'POST', { projectId, status, note });
    closeModal('missionReviewModal');
    showToast('Feedback resmi dosen berhasil dikirim ke tim!');
    loadMissionControl();
  } catch (e) {
    console.error(e);
  }
}

function quickResolveBlocker() {
  const projectId = document.getElementById('reviewProjId').value;
  api('/api/mission/feedback', 'POST', { projectId, resolveBlocker: true, note: 'Dosen menandai blocker telah tertangani setelah sesi klinik.' }).then(() => {
    closeModal('missionReviewModal');
    showToast('Blocker berhasil diselesaikan!');
    loadMissionControl();
  });
}

function openMissionEvaluateModal(id, name) {
  document.getElementById('evalProjId').value = id;
  document.getElementById('evalModalProjTitle').textContent = `Evaluasi Rubrik: ${name}`;
  calcEvalTotal();
  openModal('missionEvaluateModal');
}

function calcEvalTotal() {
  const c = Number(document.getElementById('evalCompleteness').value) || 0;
  const e = Number(document.getElementById('evalEvidence').value) || 0;
  const ct = Number(document.getElementById('evalContribution').value) || 0;
  const r = Number(document.getElementById('evalReproducibility').value) || 0;

  const total = (c + e + ct + r) / 4;
  let grade = 'A';
  if (total < 70) grade = 'C';
  else if (total < 85) grade = 'B';

  document.getElementById('evalTotalScoreText').textContent = `${total.toFixed(1)} (${grade})`;
}

async function handleMissionEvaluateSubmit(e) {
  e.preventDefault();
  const projectId = document.getElementById('evalProjId').value;
  const scoreCompleteness = document.getElementById('evalCompleteness').value;
  const scoreEvidence = document.getElementById('evalEvidence').value;
  const scoreContribution = document.getElementById('evalContribution').value;
  const scoreReproducibility = document.getElementById('evalReproducibility').value;
  const feedback = document.getElementById('evalFeedback').value.trim();

  try {
    const res = await api('/api/mission/evaluate', 'POST', {
      projectId, scoreCompleteness, scoreEvidence, scoreContribution, scoreReproducibility, feedback
    });
    closeModal('missionEvaluateModal');
    showToast(`Penilaian disimpan! Nilai akhir: ${res.totalScore.toFixed(1)} (${res.grade})`);
    loadMissionControl();
  } catch (e) {
    console.error(e);
  }
}

async function compileReproducibilityPackage(projectId) {
  try {
    const res = await api('/api/mission/reproducibility', 'POST', { projectId });
    showToast(`Paket resmi berhasil dikompilasi: ${res.filename}`);
    loadMissionControl();
  } catch (e) {
    console.error(e);
  }
}

async function archiveProject(projectId) {
  if (!confirm('Arsipkan proyek ini? Seluruh perubahan pada workspace akan dikunci.')) return;
  try {
    await api('/api/mission/archive', 'POST', { projectId });
    showToast('Proyek berhasil diarsipkan!');
    loadMissionControl();
  } catch (e) {
    console.error(e);
  }
}

// ==================== DOSEN CONSULTATIONS ====================
async function loadLecturerConsultations() {
  const container = document.getElementById('lecturerConsultationsList');
  if (!container) return;

  try {
    const res = await api('/api/consultations');
    const consultations = res.consultations || [];

    if (consultations.length === 0) {
      container.innerHTML = `
        <div style="text-align: center; color: var(--muted); padding: 56px 24px; border: 1.5px dashed var(--line); border-radius: 14px; background: var(--surface-alt);">
          <div style="font-size: 42px; margin-bottom: 10px;">📅</div>
          <h4 style="font-size: 16px; font-weight: 800; color: var(--navy); margin-bottom: 4px;">Belum Ada Antrean Bimbingan</h4>
          <p style="font-size: 13px; color: var(--ink-secondary); margin: 0;">Permohonan jadwal bimbingan dan klinik riset dari mahasiswa akan tercatat di sini secara real-time.</p>
        </div>
      `;
      return;
    }

    container.innerHTML = consultations.map(c => `
      <div style="border: 1px solid var(--line); border-radius: 12px; padding: 18px; margin-bottom: 14px;">
        <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 8px;">
          <div>
            <span class="badge ${c.status === 'Terjadwal' ? 'badge-teal' : c.status === 'Menunggu respons' ? 'badge-orange' : 'badge-gray'}">${c.status}</span>
            <h4 style="font-size: 16px; font-weight: 800; color: var(--navy); margin-top: 4px;">${c.topic}</h4>
          </div>
          <small style="color: var(--muted);">📅 ${c.date} ${c.time} WIB</small>
        </div>
        <div style="font-size: 13px; color: var(--ink-secondary); margin-bottom: 8px;">
          Mahasiswa: <strong>${c.student_name}</strong> · Proyek: <strong>${c.project_name}</strong> (${c.project_study})
        </div>
        <p style="font-size: 12px; color: var(--muted); margin-bottom: 12px;">Mode: <strong>${c.mode}</strong> | Catatan: "${c.note || '-'}"</p>
        <div style="display: flex; gap: 8px; justify-content: flex-end; border-top: 1px solid var(--line-light); padding-top: 10px;">
          ${c.status === 'Menunggu respons' ? `
            <button class="btn btn-primary btn-sm" onclick="resolveConsultation(${c.id}, 'Terjadwal')">Terima Jadwal</button>
            <button class="btn btn-ghost btn-sm" onclick="resolveConsultation(${c.id}, 'Ditolak')">Tolak</button>
          ` : ''}
          ${c.status === 'Terjadwal' ? `
            <button class="btn btn-success btn-sm" onclick="completeConsultation(${c.id})">Selesaikan Sesi & Beri Feedback</button>
          ` : ''}
        </div>
      </div>
    `).join('');
  } catch (e) {
    console.error(e);
  }
}

async function resolveConsultation(id, status) {
  try {
    await api('/api/consultations/resolve', 'POST', { id, status });
    showToast(`Status bimbingan diubah menjadi: ${status}`);
    loadLecturerConsultations();
  } catch (e) {
    console.error(e);
  }
}

async function completeConsultation(id) {
  const feedback = prompt('Masukkan catatan/feedback hasil bimbingan untuk mahasiswa:');
  if (feedback === null) return;
  try {
    await api('/api/consultations/resolve', 'POST', { id, status: 'Selesai', feedback });
    showToast('Sesi bimbingan selesai dan feedback tersimpan.');
    loadLecturerConsultations();
  } catch (e) {
    console.error(e);
  }
}

// ==================== DOSEN ANNOUNCEMENTS ====================
async function loadLecturerAnnouncements() {
  const container = document.getElementById('lecturerAnnouncementsFeed');
  if (!container) return;

  try {
    const res = await api('/api/announcements');
    const list = res.announcements || [];

    if (list.length === 0) {
      container.innerHTML = `<div style="text-align: center; color: var(--muted); padding: 48px;">Belum ada pengumuman dibuat.</div>`;
      return;
    }

    container.innerHTML = list.map(a => `
      <div style="border: 1px solid var(--line); border-radius: 12px; padding: 16px; margin-bottom: 12px; ${a.pinned ? 'background: #fafcff; border-color: #93c5fd;' : ''}">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
          <div style="display: flex; gap: 6px; align-items: center;">
            ${a.pinned ? '<span class="badge badge-rose">📌 Pinned</span>' : ''}
            <span class="badge badge-teal">${a.category}</span>
          </div>
          <button class="btn btn-ghost btn-sm" onclick="deleteAnnouncement(${a.id})" style="color: #dc2626;">Hapus</button>
        </div>
        <h4 style="font-size: 15px; font-weight: 800; color: var(--navy); margin-bottom: 4px;">${a.title}</h4>
        <p style="font-size: 13px; color: var(--ink-secondary); line-height: 1.5;">${a.body}</p>
        <div style="font-size: 11px; color: var(--muted); margin-top: 8px;">Target: ${a.target === 'all' ? 'Semua Mahasiswa' : 'Proyek Spesifik'}</div>
      </div>
    `).join('');
  } catch (e) {
    console.error(e);
  }
}

async function handleCreateAnnouncement(e) {
  e.preventDefault();
  const title = document.getElementById('annTitle').value.trim();
  const category = document.getElementById('annCategory').value;
  const target = document.getElementById('annTarget').value;
  const body = document.getElementById('annBody').value.trim();
  const pinned = document.getElementById('annPinned').checked ? 1 : 0;

  try {
    await api('/api/announcements', 'POST', { title, category, target, body, pinned });
    document.getElementById('annTitle').value = '';
    document.getElementById('annBody').value = '';
    showToast('Pengumuman resmi berhasil dipublikasikan!');
    loadLecturerAnnouncements();
    updateNotificationBadges();
    loadDashboardAnnouncementsWidget();
    loadTopAnnouncements();
  } catch (e) {
    console.error(e);
  }
}

async function deleteAnnouncement(id) {
  if (!confirm('Hapus pengumuman ini?')) return;
  try {
    await api(`/api/announcements/${id}`, 'DELETE');
    showToast('Pengumuman dihapus.');
    loadLecturerAnnouncements();
    updateNotificationBadges();
    loadDashboardAnnouncementsWidget();
    loadTopAnnouncements();
  } catch (e) {
    console.error(e);
  }
}

// ==================== DOSEN RESOURCES ====================
async function loadLecturerResources() {
  const container = document.getElementById('lecturerResourceRequestsList');
  if (!container) return;

  try {
    const res = await api('/api/resources');
    const requests = res.requests || [];

    if (requests.length === 0) {
      container.innerHTML = `
        <div style="text-align: center; color: var(--muted); padding: 56px 24px; border: 1.5px dashed var(--line); border-radius: 14px; background: var(--surface-alt);">
          <div style="font-size: 42px; margin-bottom: 10px;">🔬</div>
          <h4 style="font-size: 16px; font-weight: 800; color: var(--navy); margin-bottom: 4px;">Belum Ada Pengajuan Fasilitas Riset</h4>
          <p style="font-size: 13px; color: var(--ink-secondary); margin: 0;">Pengajuan instrumen laboratorium atau komputasi HPC dari kelompok mahasiswa akan muncul di sini untuk ditinjau.</p>
        </div>
      `;
      return;
    }

    container.innerHTML = requests.map(r => `
      <div style="border: 1px solid var(--line); border-radius: 12px; padding: 18px; margin-bottom: 14px;">
        <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 8px;">
          <div>
            <strong style="font-size: 16px; color: var(--navy);">${r.resource_name}</strong>
            <span class="badge ${r.status === 'Disetujui' ? 'badge-teal' : r.status === 'Menunggu' ? 'badge-orange' : 'badge-rose'}" style="margin-left: 8px;">${r.status}</span>
          </div>
          <small style="color: var(--muted);">Dibutuhkan: ${r.date_needed}</small>
        </div>
        <div style="font-size: 13px; color: var(--ink-secondary); margin-bottom: 6px;">
          Pemohon: <strong>${r.student_name}</strong> · Proyek: <strong>${r.project_name}</strong>
        </div>
        <p style="font-size: 12px; color: var(--muted); margin-bottom: 12px;">Catatan: "${r.note}"</p>
        <div style="display: flex; gap: 8px; justify-content: flex-end; border-top: 1px solid var(--line-light); padding-top: 10px;">
          ${r.status === 'Menunggu' ? `
            <button class="btn btn-primary btn-sm" onclick="resolveResourceRequest(${r.id}, 'Disetujui')">Setujui Peminjaman</button>
            <button class="btn btn-danger btn-sm" onclick="resolveResourceRequest(${r.id}, 'Ditolak')">Tolak Permohonan</button>
          ` : `
            <small style="color: var(--muted);">Tindakan selesai: ${r.status}</small>
          `}
        </div>
      </div>
    `).join('');
  } catch (e) {
    console.error(e);
  }
}

async function resolveResourceRequest(id, status) {
  const feedback = prompt(`Catatan persetujuan / alasan ${status.toLowerCase()}:`, status === 'Disetujui' ? 'Disetujui. Silakan ambil kartu akses di ruang lab.' : 'Jadwal lab penuh.');
  if (feedback === null) return;

  try {
    await api('/api/resources/resolve', 'POST', { id, status, feedback });
    showToast(`Permohonan fasilitas berhasil diubah menjadi: ${status}`);
    loadLecturerResources();
  } catch (e) {
    console.error(e);
  }
}

// ==================== ANALYTICS ====================
async function loadAnalytics() {
  try {
    const res = await api('/api/analytics');
    document.getElementById('anTotalProjects').textContent = res.totalProjects || 0;
    document.getElementById('anAvgProgress').textContent = `${res.avgProgress || 0}%`;
    document.getElementById('anCompletedCps').textContent = res.completedCheckpoints || 0;
    document.getElementById('anActiveBlockers').textContent = res.totalBlockers || 0;

    const bars = document.getElementById('analyticsDisciplineBars');
    if (bars && res.disciplines) {
      const total = res.totalProjects || 1;
      bars.innerHTML = Object.entries(res.disciplines).map(([study, count]) => {
        const pct = Math.round((count / total) * 100);
        return `
          <div style="margin-bottom: 12px;">
            <div style="display: flex; justify-content: space-between; font-size: 12px; margin-bottom: 4px;">
              <strong>${study}</strong>
              <span>${count} Proyek (${pct}%)</span>
            </div>
            <div class="progress-track" style="height: 8px;">
              <div class="progress-fill" style="width: ${pct}%;"></div>
            </div>
          </div>
        `;
      }).join('');
    }
  } catch (e) {
    console.error(e);
  }
}

function exportAnalyticsCSV() {
  window.open('/api/analytics/export.csv', '_blank');
}

// ==================== ADMINISTRATOR & SYSTEM GOVERNANCE ====================
let cachedAdminUsers = [];

async function loadAdminDashboard() {
  await Promise.all([loadAdminSystemStats(), loadAdminUsers()]);
}

async function loadAdminSystemStats() {
  try {
    const res = await api('/api/admin/system-stats');
    const { system, counts } = res;

    const elMode = document.getElementById('admActiveMode');
    if (elMode) {
      if (system.appMode === 'production') {
        elMode.textContent = '🚀 Operasi Riil';
        elMode.style.color = '#0d9488';
      } else {
        elMode.textContent = '🎯 Demo Lomba';
        elMode.style.color = '#4338ca';
      }
    }

    const elUsers = document.getElementById('admTotalUsers');
    if (elUsers) elUsers.textContent = counts.totalUsers;

    const elProj = document.getElementById('admTotalProjects');
    if (elProj) elProj.textContent = counts.totalProjects;

    const elDb = document.getElementById('admDbSize');
    if (elDb) elDb.textContent = `${system.dbSizeKb || 0} KB`;

    const elNode = document.getElementById('admNodeVer');
    if (elNode) elNode.textContent = `${system.nodeVersion} (${system.platform})`;

    const elUp = document.getElementById('admUptime');
    if (elUp) {
      const up = system.uptimeSeconds;
      const hours = Math.floor(up / 3600);
      const mins = Math.floor((up % 3600) / 60);
      const secs = up % 60;
      elUp.textContent = hours > 0 ? `${hours}j ${mins}m ${secs}s` : (mins > 0 ? `${mins}m ${secs}s` : `${secs} detik`);
    }

    const elMem = document.getElementById('admMemory');
    if (elMem) elMem.textContent = `${system.memoryRssMb} MB`;

    const elDist = document.getElementById('admProjDist');
    if (elDist) elDist.textContent = `${counts.demoProjects} Demo · ${counts.prodProjects} Riil`;
  } catch (err) {
    console.error('Failed to load admin stats:', err);
  }
}

async function loadAdminUsers() {
  const tbody = document.getElementById('adminUsersTableBody');
  if (!tbody) return;
  try {
    const res = await api('/api/admin/users');
    cachedAdminUsers = res.users || [];
    renderAdminUsers(cachedAdminUsers);
  } catch (err) {
    tbody.innerHTML = `<tr><td colspan="5" style="text-align: center; color: #ef4444; padding: 20px;">Gagal memuat pengguna: ${err.message}</td></tr>`;
  }
}

function renderAdminUsers(usersList) {
  const tbody = document.getElementById('adminUsersTableBody');
  if (!tbody) return;

  if (usersList.length === 0) {
    tbody.innerHTML = `<tr><td colspan="5" style="text-align: center; color: var(--muted); padding: 24px;">Tidak ada pengguna yang cocok dengan pencarian.</td></tr>`;
    return;
  }

  tbody.innerHTML = usersList.map(u => {
    let roleBadge = '';
    if (u.role === 'admin') {
      roleBadge = '<span class="badge" style="background:#0f172a; color:#38bdf8; border:1px solid #0284c7;">🛠️ Admin / Dev</span>';
    } else if (u.role === 'lecturer') {
      roleBadge = '<span class="badge badge-purple">👨‍🏫 Dosen / Juri</span>';
    } else {
      roleBadge = '<span class="badge badge-blue">👤 Mahasiswa</span>';
    }

    const isCore = (u.username === 'admin' || u.username === 'budi' || u.username === 'dosen');

    return `
      <tr style="border-bottom: 1px solid var(--line-light);">
        <td style="padding: 10px 12px;">
          <div style="display: flex; align-items: center; gap: 8px;">
            <div style="width: 28px; height: 28px; border-radius: 50%; background: ${u.avatar_color || '#2878d7'}; color: white; display: flex; align-items: center; justify-content: center; font-weight: 800; font-size: 11px;">
              ${(u.name || 'U').charAt(0).toUpperCase()}
            </div>
            <div>
              <strong style="font-size: 13px; color: var(--navy); display: block;">${u.name}</strong>
              <small style="color: var(--muted);">@${u.username}</small>
            </div>
          </div>
        </td>
        <td style="padding: 10px 12px;">${roleBadge}</td>
        <td style="padding: 10px 12px; font-family: monospace; font-size: 11px;">${u.identifier || '-'}</td>
        <td style="padding: 10px 12px;">
          <strong style="color: var(--navy);">${u.study_program}</strong>
          <small style="display: block; color: var(--muted);">${u.university || 'Universitas Indonesia'}</small>
        </td>
        <td style="padding: 10px 12px; text-align: right;">
          <div style="display: inline-flex; gap: 6px;">
            <button class="btn btn-ghost btn-sm" onclick="adminResetPassword(${u.id}, '${u.name}')" title="Reset Kata Sandi" style="font-size: 11px; padding: 4px 8px;">
              🔑 Reset Pass
            </button>
            <button class="btn btn-secondary btn-sm" onclick="adminToggleRole(${u.id}, '${u.role}', '${u.name}')" title="Ubah Peran" style="font-size: 11px; padding: 4px 8px;">
              🔄 Peran
            </button>
            ${!isCore ? `
              <button class="btn btn-ghost btn-sm" onclick="adminDeleteUser(${u.id}, '${u.name}')" title="Hapus Akun" style="color: #ef4444; font-size: 11px; padding: 4px 8px;">
                🗑️
              </button>
            ` : ''}
          </div>
        </td>
      </tr>
    `;
  }).join('');
}

function filterAdminUsers() {
  const q = (document.getElementById('adminUserSearch')?.value || '').toLowerCase().trim();
  if (!q) {
    renderAdminUsers(cachedAdminUsers);
    return;
  }
  const filtered = cachedAdminUsers.filter(u =>
    u.name.toLowerCase().includes(q) ||
    u.username.toLowerCase().includes(q) ||
    (u.identifier && u.identifier.toLowerCase().includes(q)) ||
    (u.study_program && u.study_program.toLowerCase().includes(q))
  );
  renderAdminUsers(filtered);
}

async function adminToggleRole(userId, currentRoleVal, userName) {
  const nextRole = currentRoleVal === 'student' ? 'lecturer' : (currentRoleVal === 'lecturer' ? 'admin' : 'student');
  const roleName = nextRole === 'student' ? 'Mahasiswa' : (nextRole === 'lecturer' ? 'Dosen' : 'Admin');
  if (!confirm(`Ubah peran ${userName} menjadi ${roleName}?`)) return;

  try {
    const res = await api(`/api/admin/users/${userId}/role`, 'POST', { role: nextRole });
    showToast(res.message);
    loadAdminUsers();
  } catch (err) {
    alert('Gagal mengubah role: ' + err.message);
  }
}

async function adminResetPassword(userId, userName) {
  const newPass = prompt(`Masukkan kata sandi baru untuk ${userName}:`, 'password123');
  if (!newPass) return;

  try {
    const res = await api(`/api/admin/users/${userId}/reset-password`, 'POST', { newPassword: newPass });
    showToast(res.message);
  } catch (err) {
    alert('Gagal mereset kata sandi: ' + err.message);
  }
}

async function adminDeleteUser(userId, userName) {
  if (!confirm(`Hapus akun ${userName}? Tindakan ini tidak dapat dibatalkan.`)) return;

  try {
    const res = await api(`/api/admin/users/${userId}`, 'DELETE');
    showToast(res.message);
    loadAdminDashboard();
  } catch (err) {
    alert('Gagal menghapus akun: ' + err.message);
  }
}

// Initial Launch Check
window.addEventListener('DOMContentLoaded', async () => {
  try {
    await loadAppMode();
    const savedUserJson = localStorage.getItem('steamcraft_user');
    if (savedUserJson) {
      try {
        const savedUser = JSON.parse(savedUserJson);
        if (savedUser && savedUser.id) {
          currentUser = savedUser;
          currentRole = savedUser.role || 'student';
          const res = await api('/api/auth/me');
          if (res.user) {
            currentUser = res.user;
            currentRole = res.user.role;
            localStorage.setItem('steamcraft_user', JSON.stringify(res.user));
          }
          enterWorkspace();
          return;
        }
      } catch (err) {
        localStorage.removeItem('steamcraft_user');
      }
    }
    // If not authenticated, ensure login screen is visible
    document.getElementById('loginScreen').style.display = 'grid';
    document.getElementById('workspaceApp').style.display = 'none';
  } catch (e) {
    // If not authenticated, keep login screen
    document.getElementById('loginScreen').style.display = 'grid';
    document.getElementById('workspaceApp').style.display = 'none';
  }
});
