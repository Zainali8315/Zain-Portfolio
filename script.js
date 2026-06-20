// Footer year
document.getElementById('year').textContent = new Date().getFullYear();

// Mobile nav toggle
const navToggle = document.querySelector('.nav-toggle');
const navLinks = document.getElementById('nav-links');
if (navToggle && navLinks) {
  navToggle.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', String(isOpen));
  });
  navLinks.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
    });
  });
}

// Scroll progress bar
const scrollProgress = document.getElementById('scrollProgress');
function updateScrollProgress() {
  if (!scrollProgress) return;
  const scrollTop = window.scrollY;
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
  scrollProgress.style.width = pct + '%';
}
window.addEventListener('scroll', updateScrollProgress, { passive: true });
updateScrollProgress();

// Active nav link highlighting based on section in view
const navAnchors = document.querySelectorAll('[data-nav-link]');
const sections = Array.from(navAnchors)
  .map((a) => document.querySelector(a.getAttribute('href')))
  .filter(Boolean);

function setActiveNav() {
  let currentId = null;
  const offset = 110;
  for (const section of sections) {
    const rect = section.getBoundingClientRect();
    if (rect.top - offset <= 0 && rect.bottom - offset > 0) {
      currentId = '#' + section.id;
      break;
    }
  }
  navAnchors.forEach((a) => {
    a.classList.toggle('active', a.getAttribute('href') === currentId);
  });
}
window.addEventListener('scroll', setActiveNav, { passive: true });
setActiveNav();

// Scroll-reveal using IntersectionObserver
const revealEls = document.querySelectorAll('.reveal, .reveal-stagger');
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (prefersReducedMotion) {
  revealEls.forEach((el) => el.classList.add('visible'));
} else if ('IntersectionObserver' in window) {
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
  );
  revealEls.forEach((el) => revealObserver.observe(el));
} else {
  revealEls.forEach((el) => el.classList.add('visible'));
}

// Animated number counters (run once stats block becomes visible)
const counterEls = document.querySelectorAll('[data-count]');
function animateCounter(el) {
  if (el.dataset.noCount === 'true') return;
  const target = parseInt(el.dataset.count, 10);
  const suffix = el.dataset.suffix || '';
  const duration = 1100;
  const start = performance.now();
  function tick(now) {
    const progress = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    const value = Math.round(eased * target);
    el.textContent = value + suffix;
    if (progress < 1) requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
}

if (counterEls.length) {
  if (prefersReducedMotion || !('IntersectionObserver' in window)) {
    counterEls.forEach((el) => {
      el.textContent = el.dataset.noCount === 'true' ? el.dataset.count : el.dataset.count + (el.dataset.suffix || '');
    });
  } else {
    const counterObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            animateCounter(entry.target);
            counterObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.4 }
    );
    counterEls.forEach((el) => counterObserver.observe(el));
  }
}

// Rotating role-line typewriter
const roleTextEl = document.getElementById('roleText');
const roles = [
  'MERN stack applications',
  'AI-assisted automation',
  'REST APIs & dashboards',
  'Cross-platform apps with Flutter'
];

if (roleTextEl && !prefersReducedMotion) {
  let roleIndex = 0;
  let charIndex = 0;
  let deleting = false;

  function typeStep() {
    const currentRole = roles[roleIndex];
    if (!deleting) {
      charIndex++;
      roleTextEl.textContent = currentRole.slice(0, charIndex);
      if (charIndex === currentRole.length) {
        deleting = true;
        setTimeout(typeStep, 1800);
        return;
      }
      setTimeout(typeStep, 45);
    } else {
      charIndex--;
      roleTextEl.textContent = currentRole.slice(0, charIndex);
      if (charIndex === 0) {
        deleting = false;
        roleIndex = (roleIndex + 1) % roles.length;
        setTimeout(typeStep, 300);
        return;
      }
      setTimeout(typeStep, 25);
    }
  }
  typeStep();
} else if (roleTextEl) {
  roleTextEl.textContent = roles[0];
}
