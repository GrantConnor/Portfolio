// Premium portfolio interactions
// ------------------------------
// Lightweight features:
// 1. Mobile navigation toggle
// 2. Active section highlighting while scrolling
// 3. Scroll-triggered reveal animations on desktop/tablet
// 4. Footer year update

const body = document.body;
const navToggle = document.querySelector('.nav-toggle');
const navMenu = document.querySelector('.nav-menu');
const navLinks = [...document.querySelectorAll('.nav-link')];
const sections = [...document.querySelectorAll('main section[id]')];
const motionItems = [...document.querySelectorAll('.motion')];
const year = document.getElementById('year');
const devModeToggle = document.querySelector('.dev-mode-toggle');
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
const compactMotion = window.matchMedia('(max-width: 640px)');

window.addEventListener(
  'load',
  () => {
    body.classList.add('is-loaded');
  },
  { once: true }
);

if (year) {
  year.textContent = new Date().getFullYear();
}

function setMenuState(isOpen) {
  if (!navToggle || !navMenu) return;

  navToggle.setAttribute('aria-expanded', String(isOpen));
  navMenu.classList.toggle('is-open', isOpen);
  body.classList.toggle('menu-open', isOpen);
}

if (navToggle && navMenu) {
  navToggle.addEventListener('click', () => {
    const isOpen = navToggle.getAttribute('aria-expanded') === 'true';
    setMenuState(!isOpen);
  });

  navLinks.forEach((link) => {
    link.addEventListener('click', () => setMenuState(false));
  });

  window.addEventListener(
    'resize',
    () => {
      if (window.innerWidth > 980) {
        setMenuState(false);
      }
    },
    { passive: true }
  );
}

function updateActiveLink(sectionId) {
  navLinks.forEach((link) => {
    const isMatch = link.getAttribute('href') === `#${sectionId}`;
    link.classList.toggle('active', isMatch);

    if (isMatch) {
      link.setAttribute('aria-current', 'page');
    } else {
      link.removeAttribute('aria-current');
    }
  });
}

updateActiveLink('hero');

const sectionObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        updateActiveLink(entry.target.id);
      }
    });
  },
  {
    root: null,
    threshold: 0.4,
    rootMargin: '-14% 0px -42% 0px'
  }
);

sections.forEach((section) => sectionObserver.observe(section));

function enableMotion() {
  if (reduceMotion.matches || compactMotion.matches) {
    motionItems.forEach((item) => {
      item.classList.add('is-visible');
      item.classList.remove('is-past');
      item.style.transitionDelay = '0ms';
    });
    return;
  }

  const motionObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        const target = entry.target;

        if (entry.isIntersecting) {
          target.classList.add('is-visible');
          target.classList.remove('is-past');
          return;
        }

        if (entry.boundingClientRect.top < 0) {
          target.classList.remove('is-visible');
          target.classList.add('is-past');
        } else {
          target.classList.remove('is-visible');
          target.classList.remove('is-past');
        }
      });
    },
    {
      root: null,
      threshold: 0.12,
      rootMargin: '0px 0px -10% 0px'
    }
  );

  motionItems.forEach((item, index) => {
    item.style.transitionDelay = `${Math.min(index * 30, 120)}ms`;
    motionObserver.observe(item);
  });
}

enableMotion();

window.addEventListener(
  'hashchange',
  () => {
    const id = window.location.hash.replace('#', '');
    if (id) updateActiveLink(id);
  },
  { passive: true }
);


if (devModeToggle) {
  devModeToggle.addEventListener('click', () => {
    const isDevMode = body.classList.toggle('is-dev-mode');
    devModeToggle.setAttribute('aria-pressed', String(isDevMode));
    devModeToggle.classList.toggle('is-active', isDevMode);
  });
}
