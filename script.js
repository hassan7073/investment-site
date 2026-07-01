// ======================================================
// Vantara — Demo Investment UI (frontend only, no backend)
// ======================================================

document.addEventListener('DOMContentLoaded', () => {
  initTickerField();
  initNavbar();
  initMobileMenu();
  initSmoothActiveLink();
  initHeroCounters();
  initModal();
  initInvestButtons();
  initDepositForm();
  initWithdrawForm();
  initContactForm();
  initNewsletter();
});

/* ---------- Ticker background rows ---------- */
function initTickerField() {
  const field = document.getElementById('tickerField');
  if (!field) return;

  const symbols = ['BTC','ETH','GOLD','S&P','NASDAQ','OIL','SILVER','EUR/USD','VNT','FTSE'];
  const rowCount = 6;

  for (let r = 0; r < rowCount; r++) {
    const row = document.createElement('div');
    row.className = 'ticker-row';
    row.style.animationDuration = `${40 + r * 8}s`;
    row.style.animationDirection = r % 2 === 0 ? 'normal' : 'reverse';

    let html = '';
    for (let i = 0; i < 2; i++) {
      symbols.forEach(sym => {
        const up = Math.random() > 0.45;
        const pct = (Math.random() * 4 + 0.1).toFixed(2);
        html += `<span>${sym} <span class="${up ? 'up' : 'down'}">${up ? '▲' : '▼'} ${pct}%</span></span>`;
      });
    }
    row.innerHTML = html;
    field.appendChild(row);
  }
}

/* ---------- Sticky navbar shadow on scroll ---------- */
function initNavbar() {
  const navbar = document.getElementById('navbar');
  if (!navbar) return;
  const onScroll = () => {
    navbar.classList.toggle('scrolled', window.scrollY > 12);
  };
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });
}

/* ---------- Mobile hamburger menu ---------- */
function initMobileMenu() {
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('navLinks');
  if (!hamburger || !navLinks) return;

  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    navLinks.classList.toggle('open');
  });

  navLinks.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('open');
      navLinks.classList.remove('open');
    });
  });
}

/* ---------- Highlight active nav link on scroll ---------- */
function initSmoothActiveLink() {
  const sections = document.querySelectorAll('section[id]');
  const links = document.querySelectorAll('.nav-link');
  if (!sections.length || !links.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        links.forEach(l => l.classList.remove('active'));
        const match = document.querySelector(`.nav-link[href="#${entry.target.id}"]`);
        if (match) match.classList.add('active');
      }
    });
  }, { rootMargin: '-40% 0px -50% 0px', threshold: 0 });

  sections.forEach(sec => observer.observe(sec));
}

/* ---------- Animated hero stat counters ---------- */
function initHeroCounters() {
  const nums = document.querySelectorAll('.hero-stat-num');
  if (!nums.length) return;

  const formatValue = (el, value) => {
    const target = Number(el.dataset.count);
    if (target > 1000000) return `$${(value / 1000000).toFixed(1)}M`;
    if (target > 1000) return value.toLocaleString();
    return `${Math.round(value)}`;
  };

  const animate = (el) => {
    const target = Number(el.dataset.count);
    const duration = 1600;
    const start = performance.now();

    const step = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = formatValue(el, target * eased);
      if (progress < 1) requestAnimationFrame(step);
      else el.textContent = formatValue(el, target);
    };
    requestAnimationFrame(step);
  };

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animate(entry.target);
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  nums.forEach(n => observer.observe(n));
}

/* ---------- Auth modal (Login / Signup) ---------- */
function initModal() {
  const overlay = document.getElementById('modalOverlay');
  const closeBtn = document.getElementById('modalClose');
  const title = document.getElementById('modalTitle');
  const switchText = document.getElementById('modalSwitchText');
  const switchLink = document.getElementById('modalSwitchLink');
  const form = document.getElementById('modalForm');
  const loginBtn = document.getElementById('loginBtn');
  const signupBtn = document.getElementById('signupBtn');

  if (!overlay) return;

  const setMode = (mode) => {
    if (mode === 'login') {
      title.textContent = 'Log In';
      switchText.textContent = "Don't have an account?";
      switchLink.textContent = 'Sign up';
      form.querySelector('button').textContent = 'Log In';
    } else {
      title.textContent = 'Sign Up';
      switchText.textContent = 'Already have an account?';
      switchLink.textContent = 'Log in';
      form.querySelector('button').textContent = 'Create Account';
    }
    overlay.dataset.mode = mode;
  };

  const open = (mode) => {
    setMode(mode);
    overlay.classList.add('open');
    document.body.style.overflow = 'hidden';
  };
  const close = () => {
    overlay.classList.remove('open');
    document.body.style.overflow = '';
  };

  loginBtn?.addEventListener('click', () => open('login'));
  signupBtn?.addEventListener('click', () => open('signup'));
  closeBtn?.addEventListener('click', close);
  overlay.addEventListener('click', (e) => { if (e.target === overlay) close(); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') close(); });

  switchLink?.addEventListener('click', (e) => {
    e.preventDefault();
    setMode(overlay.dataset.mode === 'login' ? 'signup' : 'login');
  });

  form?.addEventListener('submit', (e) => {
    e.preventDefault();
    close();
    showToast(overlay.dataset.mode === 'login'
      ? 'Demo only — login is not connected to a backend.'
      : 'Demo only — signup is not connected to a backend.');
  });
}

/* ---------- Invest Now buttons on plan cards ---------- */
function initInvestButtons() {
  document.querySelectorAll('.invest-trigger').forEach(btn => {
    btn.addEventListener('click', () => {
      const plan = btn.dataset.plan || 'plan';
      document.getElementById('deposit')?.scrollIntoView({ behavior: 'smooth' });
      showToast(`"${plan}" selected — enter an amount below to continue (demo).`);
    });
  });
}

/* ---------- Deposit form ---------- */
function initDepositForm() {
  const form = document.getElementById('depositForm');
  const table = document.getElementById('depositTable')?.querySelector('tbody');
  if (!form || !table) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const amount = document.getElementById('depositAmount').value;
    const method = form.querySelector('input[name="method"]:checked');
    if (!amount || Number(amount) <= 0) {
      showToast('Enter a valid deposit amount.');
      return;
    }
    const methodLabel = { bkash: 'bKash', nagad: 'Nagad', bank: 'Bank Transfer' }[method.value] || method.value;

    const row = document.createElement('tr');
    row.style.opacity = '0';
    row.innerHTML = `
      <td>${formatToday()}</td>
      <td>${methodLabel}</td>
      <td class="mono">$${Number(amount).toFixed(2)}</td>
      <td><span class="badge badge-pending">Pending</span></td>
    `;
    table.prepend(row);
    requestAnimationFrame(() => {
      row.style.transition = 'opacity .4s ease';
      row.style.opacity = '1';
    });

    form.reset();
    document.querySelector('.method-card input[value="bkash"]').checked = true;
    showToast(`Deposit of $${Number(amount).toFixed(2)} submitted (demo — not processed).`);
  });
}

/* ---------- Withdraw form ---------- */
function initWithdrawForm() {
  const form = document.getElementById('withdrawForm');
  const table = document.getElementById('withdrawTable')?.querySelector('tbody');
  if (!form || !table) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const amount = document.getElementById('withdrawAmount').value;
    const account = document.getElementById('withdrawAccount').value.trim();

    if (!amount || Number(amount) <= 0) {
      showToast('Enter a valid withdrawal amount.');
      return;
    }
    if (!account) {
      showToast('Enter an account or wallet number.');
      return;
    }

    const masked = account.length > 4 ? `••••${account.slice(-4)}` : account;

    const row = document.createElement('tr');
    row.style.opacity = '0';
    row.innerHTML = `
      <td>${formatToday()}</td>
      <td>${masked}</td>
      <td class="mono">$${Number(amount).toFixed(2)}</td>
      <td><span class="badge badge-pending">Pending</span></td>
    `;
    table.prepend(row);
    requestAnimationFrame(() => {
      row.style.transition = 'opacity .4s ease';
      row.style.opacity = '1';
    });

    form.reset();
    showToast(`Withdrawal of $${Number(amount).toFixed(2)} requested (demo — not processed).`);
  });
}

/* ---------- Contact form ---------- */
function initContactForm() {
  const form = document.getElementById('contactForm');
  if (!form) return;
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    form.reset();
    showToast('Message sent — our demo team will "reply" shortly.');
  });
}

/* ---------- Newsletter ---------- */
function initNewsletter() {
  const form = document.querySelector('.newsletter');
  if (!form) return;
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    form.reset();
    showToast('Subscribed (demo only).');
  });
}

/* ---------- Toast helper ---------- */
let toastTimer;
function showToast(message) {
  const toast = document.getElementById('toast');
  if (!toast) return;
  toast.textContent = message;
  toast.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('show'), 3200);
}

/* ---------- Utils ---------- */
function formatToday() {
  const d = new Date();
  return d.toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' });
}
