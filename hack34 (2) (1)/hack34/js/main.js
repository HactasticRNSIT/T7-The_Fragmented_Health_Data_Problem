/* ── MediSight Health — Global JS ── */

document.addEventListener('DOMContentLoaded', () => {

  /* Navbar Scroll */
  const navbar = document.querySelector('.navbar');
  if (navbar) {
    window.addEventListener('scroll', () => {
      navbar.classList.toggle('scrolled', window.scrollY > 40);
    });
  }

  /* Hamburger / Mobile Drawer */
  const hamburger = document.querySelector('.hamburger');
  const mobileDrawer = document.querySelector('.mobile-drawer');
  const drawerOverlay = document.querySelector('.drawer-overlay');

  function closeDrawer() {
    hamburger?.classList.remove('open');
    mobileDrawer?.classList.remove('open');
    drawerOverlay?.classList.remove('open');
    document.body.style.overflow = '';
  }

  hamburger?.addEventListener('click', () => {
    const isOpen = mobileDrawer.classList.toggle('open');
    hamburger.classList.toggle('open', isOpen);
    drawerOverlay.classList.toggle('open', isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });

  drawerOverlay?.addEventListener('click', closeDrawer);
  document.querySelectorAll('.mobile-drawer .nav-link').forEach(l => l.addEventListener('click', closeDrawer));

  /* Active nav link highlight */
  const currentPage = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-link[href]').forEach(link => {
    const href = link.getAttribute('href').split('/').pop();
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });

  /* Scroll Reveal */
  const reveals = document.querySelectorAll('.reveal');
  if (reveals.length) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e, i) => {
        if (e.isIntersecting) {
          setTimeout(() => e.target.classList.add('visible'), i * 80);
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.12 });
    reveals.forEach(el => io.observe(el));
  }

  /* Counter Animation */
  function animateCounter(el) {
    const target = parseFloat(el.dataset.target);
    const suffix = el.dataset.suffix || '';
    const prefix = el.dataset.prefix || '';
    const duration = 1800;
    const start = performance.now();
    function tick(now) {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const val = target % 1 !== 0 ? (eased * target).toFixed(1) : Math.floor(eased * target);
      el.textContent = prefix + val + suffix;
      if (progress < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }

  const counters = document.querySelectorAll('[data-target]');
  if (counters.length) {
    const counterIO = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) { animateCounter(e.target); counterIO.unobserve(e.target); }
      });
    }, { threshold: 0.5 });
    counters.forEach(el => counterIO.observe(el));
  }

  /* Smooth scroll for anchor links */
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const target = document.querySelector(a.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        closeDrawer();
      }
    });
  });

  /* Toast helper */
  window.showToast = function(message, type = 'info') {
    const container = document.getElementById('toast-container') || (() => {
      const c = document.createElement('div');
      c.id = 'toast-container';
      c.style.cssText = 'position:fixed;bottom:24px;right:24px;z-index:9999;display:flex;flex-direction:column;gap:10px;';
      document.body.appendChild(c);
      return c;
    })();

    const colors = { success: '#2DD4BF', danger: '#FF6B6B', info: '#00D4CC', warning: '#F59E0B' };
    const toast = document.createElement('div');
    toast.style.cssText = `background:#0A1628;color:#F8FAFB;padding:14px 20px;border-radius:12px;border-left:4px solid ${colors[type]};box-shadow:0 8px 30px rgba(0,0,0,0.3);font-family:'DM Sans',sans-serif;font-size:0.9rem;min-width:240px;animation:fadeInUp 0.3s ease;`;
    toast.textContent = message;
    container.appendChild(toast);
    setTimeout(() => { toast.style.opacity = '0'; toast.style.transition = '0.3s'; setTimeout(() => toast.remove(), 300); }, 3500);
  };
});
