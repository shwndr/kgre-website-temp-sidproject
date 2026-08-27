/* =========================================================
   1. HEADER — switch to solid background once past the hero
   ========================================================= */
const header = document.querySelector('.site-header');

function updateHeader() {
  if (!header) return;
  header.classList.toggle('scrolled', window.scrollY > 60);
}
updateHeader();
window.addEventListener('scroll', updateHeader, { passive: true });

/* =========================================================
   2. BACKGROUND SLIDESHOWS — crossfade to the next image every
   3 seconds. CSS handles the fade; this just swaps which slide
   has the .active class. Runs independently for every
   .hero-media block on the page (hero, Buyers & Sellers, etc.)
   so multiple slideshows don't share one index.
   ========================================================= */
document.querySelectorAll('.hero-media').forEach((media) => {
  const slides = media.querySelectorAll('.hero-slide');
  if (slides.length < 2) return;

  let index = [...slides].findIndex((slide) => slide.classList.contains('active'));
  if (index === -1) index = 0;

  setInterval(() => {
    slides[index].classList.remove('active');
    index = (index + 1) % slides.length;
    slides[index].classList.add('active');
  }, 3000);
});

/* =========================================================
   3. MOBILE NAV TOGGLE
   ========================================================= */
const toggle = document.querySelector('.nav-toggle');
const nav = document.querySelector('.nav-collapse');

if (toggle && nav) {
  toggle.addEventListener('click', () => {
    const open = nav.classList.toggle('open');
    toggle.setAttribute('aria-expanded', String(open));
  });

  // Close the menu after tapping a link
  nav.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      nav.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
    });
  });
}

/* =========================================================
   4. SCROLLSPY — keep the matching nav link highlighted while
   its section is in view.
   ========================================================= */
const navLinks = document.querySelectorAll('.nav a[href^="#"]');
const spyEntries = [...navLinks]
  .map((link) => ({ link, section: document.querySelector(link.getAttribute('href')) }))
  .filter((entry) => entry.section);

if ('IntersectionObserver' in window && spyEntries.length) {
  const setActive = (id) => {
    navLinks.forEach((link) => {
      link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
    });
  };

  const spyObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) setActive(entry.target.id);
    });
  }, { rootMargin: '-45% 0px -50% 0px', threshold: 0 });

  spyEntries.forEach(({ section }) => spyObserver.observe(section));
}

/* =========================================================
   5. SCROLL REVEAL
   Elements are visible by default in CSS. Only if JS runs do
   we hide them (.pre) and then animate them in — so content
   is never invisible when JS is slow, blocked, or errors.
   ========================================================= */
const revealEls = document.querySelectorAll('.reveal');

if ('IntersectionObserver' in window && revealEls.length) {
  revealEls.forEach((el) => el.classList.add('pre'));

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  revealEls.forEach((el) => observer.observe(el));
}

/* =========================================================
   6. FOOTER YEAR
   ========================================================= */
const yearEl = document.querySelector('#year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

/* =========================================================
   7. PROPERTY PREVIEW MODALS — clicking a property card opens
   its matching <dialog> (native modal: Escape closes, focus is
   trapped automatically). A click on the backdrop or the close
   button also closes it.
   ========================================================= */
document.querySelectorAll('.property-card').forEach((card) => {
  const modal = document.getElementById(card.dataset.modal);
  if (!modal) return;
  card.addEventListener('click', () => modal.showModal());
});

document.querySelectorAll('.property-modal').forEach((modal) => {
  modal.querySelector('.property-modal-close')?.addEventListener('click', () => modal.close());

  // Clicking outside the modal's own box lands on the dialog element itself
  modal.addEventListener('click', (e) => {
    if (e.target === modal) modal.close();
  });
});
