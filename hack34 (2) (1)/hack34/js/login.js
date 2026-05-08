/* ── Login / Signup JS ── */

function toggleDoctorFields(role) {
  const fields = document.getElementById('doctor-signup-fields');
  if (fields) {
    fields.style.display = role === 'doctor' ? 'block' : 'none';
  }
}


function switchTab(tab) {
  const loginForm = document.getElementById('loginForm');
  const signupForm = document.getElementById('signupForm');
  const tabLogin = document.getElementById('tab-login');
  const tabSignup = document.getElementById('tab-signup');
  const slider = document.getElementById('tabSlider');

  if (tab === 'login') {
    loginForm.classList.add('active');
    signupForm.classList.remove('active');
    tabLogin.classList.add('active');
    tabSignup.classList.remove('active');
    slider.classList.remove('right');
  } else {
    signupForm.classList.add('active');
    loginForm.classList.remove('active');
    tabSignup.classList.add('active');
    tabLogin.classList.remove('active');
    slider.classList.add('right');
  }
}

function togglePwd(inputId, btn) {
  const input = document.getElementById(inputId);
  const isText = input.type === 'text';
  input.type = isText ? 'password' : 'text';
  btn.innerHTML = isText
    ? '<i data-lucide="eye"></i>'
    : '<i data-lucide="eye-off"></i>';
  lucide.createIcons();
}

function checkStrength(val) {
  const fill = document.getElementById('strengthFill');
  const label = document.getElementById('strengthLabel');
  if (!fill) return;
  let score = 0;
  if (val.length >= 8) score++;
  if (/[A-Z]/.test(val)) score++;
  if (/[0-9]/.test(val)) score++;
  if (/[^A-Za-z0-9]/.test(val)) score++;
  const levels = [
    { w: '0%', color: 'transparent', text: '' },
    { w: '25%', color: '#FF6B6B', text: 'Weak' },
    { w: '50%', color: '#F59E0B', text: 'Fair' },
    { w: '75%', color: '#2DD4BF', text: 'Good' },
    { w: '100%', color: '#2DD4BF', text: 'Strong' },
  ];
  const lvl = levels[score] || levels[0];
  fill.style.width = lvl.w;
  fill.style.background = lvl.color;
  label.textContent = lvl.text;
  label.style.color = lvl.color;
}

function nextStep(step) {
  document.querySelectorAll('.modal-step').forEach(s => s.classList.remove('active'));
  document.getElementById('step-' + step).classList.add('active');
  document.querySelectorAll('.prog-step').forEach((p, i) => {
    p.classList.remove('active', 'done');
    if (i + 1 < step) p.classList.add('done');
    if (i + 1 === step) p.classList.add('active');
  });
  document.querySelectorAll('.prog-line').forEach((l, i) => {
    l.classList.toggle('done', i + 1 < step);
  });
  lucide.createIcons();
}


// ==========================================
// 1. FIX: Dashboard Security Validation
// 2. FIX: Login Redirection Path
// ==========================================
document.getElementById('loginForm')?.addEventListener('submit', function (e) {
  e.preventDefault();
  
  // 1. Login Security Validation
  const email = document.getElementById('loginEmail').value.trim();
  const pwd = document.getElementById('loginPassword').value.trim();
  
  if (!email || !pwd) {
    if (typeof showToast === 'function') {
      showToast('Please enter valid email and password.', 'danger');
    } else {
      alert('Please enter valid email and password.');
    }
    return; // STOP execution if validation fails
  }

  const btn = this.querySelector('[type=submit]');
  btn.textContent = 'Logging in...';
  btn.disabled = true;
  
  setTimeout(() => { 
    // 2. Login Redirection Path (updated target destination)
    const roleRadio = document.querySelector('input[name="loginRole"]:checked');
    if (roleRadio && roleRadio.value === 'doctor') {
      window.location.href = 'doctor-dashboard.html';
    } else {
      window.location.href = 'onboarding-complete.html'; 
    }
  }, 1200);
});


// ==========================================
// 3. FIX: Signup Flow Control & Final Redirection Chain
// ==========================================
document.getElementById('signupForm')?.addEventListener('submit', function (e) {
  e.preventDefault();
  const pwd = document.getElementById('signupPassword').value;
  const confirm = document.getElementById('confirmPassword').value;
  if (pwd !== confirm) { showToast('Passwords do not match', 'danger'); return; }
  if (!document.getElementById('agreeTerms').checked) { showToast('Please agree to the Terms', 'warning'); return; }
  const btn = this.querySelector('[type=submit]');
  btn.textContent = 'Creating account...';
  btn.disabled = true;
  
  // A) Signup Logic: Open the onboarding modal correctly
  setTimeout(() => {
    const roleRadio = document.querySelector('input[name="signupRole"]:checked');
    if (roleRadio && roleRadio.value === 'doctor') {
      btn.textContent = 'Account Created';
      window.location.href = 'doctor-dashboard.html';
    } else {
      document.getElementById('onboardingModal').classList.add('open');
      lucide.createIcons();
      btn.innerHTML = 'Create Account <i data-lucide="arrow-right" style="width:16px;height:16px;"></i>';
      btn.disabled = false;
      lucide.createIcons();
    }
  }, 1000);
});

// B) Finalizing the Redirect
// Add event listener to the final "Complete Onboarding" step button inside the modal
document.addEventListener('DOMContentLoaded', () => {
  // Target the anchor/button inside step-4 that previously went to dashboard.html
  const completeBtn = document.querySelector('#step-4 .btn-primary');
  
  if (completeBtn) {
    completeBtn.addEventListener('click', function(e) {
      e.preventDefault(); // Stop the default anchor jump
      // Redirect to the new target page
      window.location.href = 'onboarding-complete.html';
    });
  }
});

// Open signup tab if #signup in URL
if (location.hash === '#signup') switchTab('signup');
