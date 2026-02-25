/* ========================================================
   DEVARAKONDA JAYAVARDHAN PORTFOLIO – main.js
   GSAP + ScrollTrigger animations, typed text, cursor,
   navbar, theme toggle, canvas particles, tilt cards
   ======================================================== */

'use strict';

// ── Register GSAP Plugins ──────────────────────────────────
gsap.registerPlugin(ScrollTrigger, TextPlugin);

// ── Theme Toggle ───────────────────────────────────────────
const themeToggle = document.getElementById('theme-toggle');
const themeIcon   = document.getElementById('theme-icon');
const html        = document.documentElement;

function applyTheme(theme) {
  html.setAttribute('data-theme', theme);
  themeIcon.className = theme === 'dark' ? 'fa-solid fa-sun' : 'fa-solid fa-moon';
  localStorage.setItem('portfolio-theme', theme);
}

themeToggle.addEventListener('click', () => {
  applyTheme(html.getAttribute('data-theme') === 'dark' ? 'light' : 'dark');
});

const savedTheme = localStorage.getItem('portfolio-theme') || 'dark';
applyTheme(savedTheme);

// ── Hamburger ──────────────────────────────────────────────
const hamburger = document.getElementById('hamburger');
const navLinks  = document.getElementById('nav-links');
hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  navLinks.classList.toggle('open');
  hamburger.setAttribute('aria-expanded', navLinks.classList.contains('open'));
});
document.querySelectorAll('.nav-link').forEach(l => {
  l.addEventListener('click', () => {
    hamburger.classList.remove('open');
    navLinks.classList.remove('open');
  });
});

// ── Navbar Scroll ──────────────────────────────────────────
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 40);
}, { passive: true });

// ── Custom Cursor ──────────────────────────────────────────
const cursor   = document.getElementById('cursor');
const follower = document.getElementById('cursor-follower');
let mouseX = 0, mouseY = 0, followerX = 0, followerY = 0;

window.addEventListener('mousemove', e => {
  mouseX = e.clientX; mouseY = e.clientY;
  gsap.to(cursor, { x: mouseX, y: mouseY, duration: 0.1 });
});

(function animateFollower() {
  followerX += (mouseX - followerX) * 0.12;
  followerY += (mouseY - followerY) * 0.12;
  gsap.set(follower, { x: followerX, y: followerY });
  requestAnimationFrame(animateFollower);
})();

document.querySelectorAll('a, button, .skill-card, .project-card, .cert-card').forEach(el => {
  el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
  el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
});

// ── Hero Canvas Particles ──────────────────────────────────
(function initCanvas() {
  const canvas = document.getElementById('hero-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let W, H, particles = [];

  function resize() {
    W = canvas.width  = canvas.parentElement.offsetWidth;
    H = canvas.height = canvas.parentElement.offsetHeight;
  }
  resize();
  window.addEventListener('resize', resize, { passive: true });

  function Particle() {
    this.reset = function() {
      this.x  = Math.random() * W;
      this.y  = Math.random() * H;
      this.vx = (Math.random() - 0.5) * 0.3;
      this.vy = (Math.random() - 0.5) * 0.3;
      this.r  = Math.random() * 1.5 + 0.3;
      this.alpha = Math.random() * 0.5 + 0.1;
    };
    this.reset();
    this.update = function() {
      this.x += this.vx; this.y += this.vy;
      if (this.x < 0 || this.x > W || this.y < 0 || this.y > H) this.reset();
    };
    this.draw = function() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(0,195,255,${this.alpha})`;
      ctx.fill();
    };
  }

  for (let i = 0; i < 120; i++) particles.push(new Particle());

  // Connections
  function drawLines() {
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 100) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(0,195,255,${0.06 * (1 - dist / 100)})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    }
  }

  function render() {
    ctx.clearRect(0, 0, W, H);
    particles.forEach(p => { p.update(); p.draw(); });
    drawLines();
    requestAnimationFrame(render);
  }
  render();
})();

// ── Typed Text ─────────────────────────────────────────────
(function initTyped() {
  const el = document.getElementById('typed-text');
  if (!el) return;
  const words = ['Java Applications.', 'Embedded Systems.', 'IoT Solutions.', 'Smart Devices.'];
  let wordIdx = 0, charIdx = 0, deleting = false;
  const speed = { type: 90, delete: 50, pause: 2000 };

  function type() {
    const word = words[wordIdx];
    if (!deleting) {
      el.textContent = word.slice(0, ++charIdx);
      if (charIdx === word.length) { deleting = true; setTimeout(type, speed.pause); return; }
    } else {
      el.textContent = word.slice(0, --charIdx);
      if (charIdx === 0) { deleting = false; wordIdx = (wordIdx + 1) % words.length; }
    }
    setTimeout(type, deleting ? speed.delete : speed.type);
  }
  setTimeout(type, 800);
})();

// ── GSAP Hero Entrance ──────────────────────────────────────
(function heroEntrance() {
  const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
  tl.fromTo('.hero-badge',     { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.8 }, 0.3)
    .fromTo('.hero-line',      { opacity: 0, y: 60 }, { opacity: 1, y: 0, duration: 1, stagger: 0.15 }, 0.5)
    .fromTo('.hero-subtext',   { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.8 }, 1.1)
    .fromTo('.hero-role',      { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.6 }, 1.4)
    .fromTo('.hero-cta',       { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.6 }, 1.6)
    .fromTo('.hero-socials',   { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.6 }, 1.8)
    .fromTo('.hero-scroll-indicator', { opacity: 0 }, { opacity: 1, duration: 1 }, 2.2);
})();

// ── Scroll Reveal (generic [data-reveal]) ──────────────────
(function initScrollReveal() {
  const revealEls = document.querySelectorAll('[data-reveal]');
  revealEls.forEach((el, i) => {
    // Already animated in hero by GSAP — skip the hero's own [data-reveal] set
    if (el.closest('.hero')) return;

    ScrollTrigger.create({
      trigger: el,
      start: 'top 88%',
      once: true,
      onEnter: () => {
        const delay = el.dataset.delay || (i % 4) * 0.08;
        gsap.fromTo(el,
          { opacity: 0, y: 40 },
          { opacity: 1, y: 0, duration: 0.8, delay: parseFloat(delay), ease: 'power3.out',
            onComplete: () => el.classList.add('revealed') }
        );
      }
    });
  });
})();

// ── Skill Fill Animation ───────────────────────────────────
document.querySelectorAll('.skill-card').forEach(card => {
  ScrollTrigger.create({
    trigger: card,
    start: 'top 90%',
    once: true,
    onEnter: () => card.classList.add('revealed')
  });
});

// ── Counter Animation ──────────────────────────────────────
document.querySelectorAll('[data-count]').forEach(el => {
  ScrollTrigger.create({
    trigger: el,
    start: 'top 90%',
    once: true,
    onEnter: () => {
      const target = parseInt(el.dataset.count);
      gsap.to({ val: 0 }, {
        val: target, duration: 1.5, ease: 'power2.out',
        onUpdate: function() { el.textContent = Math.round(this.targets()[0].val); }
      });
    }
  });
});

// ── Education score fill ───────────────────────────────────
document.querySelectorAll('.edu-item').forEach(item => {
  ScrollTrigger.create({
    trigger: item,
    start: 'top 88%',
    once: true,
    onEnter: () => item.classList.add('revealed')
  });
});

// ── Timeline card entrance ─────────────────────────────────
document.querySelectorAll('.timeline-left .timeline-card').forEach(card => {
  ScrollTrigger.create({
    trigger: card,
    start: 'top 85%',
    once: true,
    onEnter: () => gsap.fromTo(card, { opacity: 0, x: -60 }, { opacity: 1, x: 0, duration: 0.9, ease: 'power3.out' })
  });
});
document.querySelectorAll('.timeline-right .timeline-card').forEach(card => {
  ScrollTrigger.create({
    trigger: card,
    start: 'top 85%',
    once: true,
    onEnter: () => gsap.fromTo(card, { opacity: 0, x: 60 }, { opacity: 1, x: 0, duration: 0.9, ease: 'power3.out' })
  });
});

// ── Stagger Cert Cards ─────────────────────────────────────
ScrollTrigger.create({
  trigger: '.certs-grid',
  start: 'top 85%',
  once: true,
  onEnter: () => {
    gsap.fromTo('.cert-card',
      { opacity: 0, y: 40, scale: 0.95 },
      { opacity: 1, y: 0, scale: 1, duration: 0.7, stagger: 0.12, ease: 'power3.out' }
    );
  }
});

// ── Section Tag + Title reveals ────────────────────────────
document.querySelectorAll('.section-header').forEach(header => {
  ScrollTrigger.create({
    trigger: header,
    start: 'top 85%',
    once: true,
    onEnter: () => {
      const tag   = header.querySelector('.section-tag');
      const title = header.querySelector('.section-title');
      const sub   = header.querySelector('.section-subtitle');
      if (tag)   gsap.fromTo(tag,   { opacity:0, y:20 }, { opacity:1, y:0, duration:0.6, ease:'power3.out' });
      if (title) gsap.fromTo(title, { opacity:0, y:30 }, { opacity:1, y:0, duration:0.8, delay:0.15, ease:'power3.out' });
      if (sub)   gsap.fromTo(sub,   { opacity:0, y:20 }, { opacity:1, y:0, duration:0.7, delay:0.35, ease:'power3.out' });
    }
  });
});

// ── Parallax Hero ──────────────────────────────────────────
gsap.to('.hero-gradient', {
  yPercent: 30,
  ease: 'none',
  scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true }
});

// ── Contact Form ───────────────────────────────────────────
const form    = document.getElementById('contact-form');
const success = document.getElementById('form-success');
if (form) {
  form.addEventListener('submit', e => {
    e.preventDefault();
    const btn = form.querySelector('button[type="submit"]');
    const orig = btn.innerHTML;
    btn.innerHTML = '<span>Sending…</span> <i class="fa-solid fa-spinner fa-spin"></i>';
    btn.disabled = true;
    setTimeout(() => {
      btn.innerHTML = orig;
      btn.disabled = false;
      success.classList.add('visible');
      form.reset();
      setTimeout(() => success.classList.remove('visible'), 5000);
    }, 1800);
  });
}

// ── Resume Download ────────────────────────────────────────
function setupResumeBtn(selector) {
  const btn = document.querySelector(selector);
  if (!btn) return;
  btn.addEventListener('click', e => {
    e.preventDefault();
    // Create a simple placeholder PDF download note
    const a = document.createElement('a');
    a.href = 'resume.pdf'; // Place your PDF as resume.pdf in root
    a.download = 'Devarakonda_Jayavardhan_Resume.pdf';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  });
}
setupResumeBtn('#resume-btn');
setupResumeBtn('#download-resume');

// ── Active Nav Highlight ───────────────────────────────────
const sections   = document.querySelectorAll('section[id]');
const navAnchors = document.querySelectorAll('.nav-link');

function activateNav() {
  let current = '';
  sections.forEach(sec => {
    if (window.scrollY >= sec.offsetTop - 140) current = sec.getAttribute('id');
  });
  navAnchors.forEach(a => {
    a.classList.toggle('active', a.getAttribute('href') === `#${current}`);
  });
}
window.addEventListener('scroll', activateNav, { passive: true });

// ── Vanilla Tilt init ──────────────────────────────────────
if (typeof VanillaTilt !== 'undefined') {
  VanillaTilt.init(document.querySelectorAll('.project-card[data-tilt]'), {
    max: 8, speed: 400, glare: true, 'max-glare': 0.15
  });
}

// ── Footer nav smooth scroll ───────────────────────────────
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

// ── Skill card hover sound-like pulse ─────────────────────
document.querySelectorAll('.skill-card').forEach(card => {
  card.addEventListener('mouseenter', () => {
    gsap.to(card, { scale: 1.04, duration: 0.25, ease: 'power2.out' });
  });
  card.addEventListener('mouseleave', () => {
    gsap.to(card, { scale: 1, duration: 0.3, ease: 'power2.inOut' });
  });
});

// ── Project card hover glow ────────────────────────────────
document.querySelectorAll('.project-card:not(.project-placeholder)').forEach(card => {
  card.addEventListener('mousemove', e => {
    const rect = card.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width  * 100).toFixed(1);
    const y = ((e.clientY - rect.top)  / rect.height * 100).toFixed(1);
    card.style.setProperty('--mx', x + '%');
    card.style.setProperty('--my', y + '%');
  });
});

// ── Reduced Motion Support ─────────────────────────────────
if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  gsap.globalTimeline.timeScale(100);
  ScrollTrigger.getAll().forEach(st => st.kill());
}

console.log('%c👋 Devarakonda Jayavardhan Portfolio', 'font-size:16px;color:#00c3ff;font-weight:bold;');
console.log('%cBuilt with passion — Java | Embedded Systems | IoT', 'color:#8ba0c0;');
