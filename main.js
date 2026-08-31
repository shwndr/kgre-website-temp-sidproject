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
   6. TOPIC NAV SCROLLSPY (Buyer's/Seller's Guide pages)
   Same pattern as the main nav's scrollspy above, scoped to
   .topic-nav/.topic-rail so it's a no-op on any page that has
   neither. Both point at the same anchors (.topic-rail is just
   .topic-nav restyled as a fixed rail at wide viewports — see
   style.css), so they're kept in sync here rather than run as
   two separate observers.
   The scroll itself is native (anchor links + CSS scroll-behavior);
   this only keeps the matching button highlighted.
   ========================================================= */
const topicLinks = document.querySelectorAll('.topic-nav a[href^="#"], .topic-rail a[href^="#"]');
const topicEntries = [...topicLinks]
  .map((link) => ({ link, section: document.querySelector(link.getAttribute('href')) }))
  .filter((entry) => entry.section);

if ('IntersectionObserver' in window && topicEntries.length) {
  const setActiveTopic = (id) => {
    topicLinks.forEach((link) => {
      link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
    });
  };

  const topicObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) setActiveTopic(entry.target.id);
    });
  }, { rootMargin: '-45% 0px -50% 0px', threshold: 0 });

  topicEntries.forEach(({ section }) => topicObserver.observe(section));
}

/* =========================================================
   7. FOOTER YEAR
   ========================================================= */
const yearEl = document.querySelector('#year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

/* =========================================================
   8. PROPERTY PREVIEW MODALS — clicking a property card opens
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

/* =========================================================
   9. "COPY LINK" SHARE BUTTONS (Community Involvement page)
   Each button already carries its real URL in data-share-url, so
   without JS or without Clipboard API support it's just inert —
   nothing to fall back to since it's not a normal link, but nothing
   breaks either. With support, copies the link and shows a brief
   "Link copied" tooltip via the .copied class (see style.css).
   ========================================================= */
document.querySelectorAll('.share-copy').forEach((btn) => {
  if (!navigator.clipboard) return;
  btn.addEventListener('click', () => {
    navigator.clipboard.writeText(btn.dataset.shareUrl).then(() => {
      btn.classList.add('copied');
      setTimeout(() => btn.classList.remove('copied'), 1800);
    });
  });
});

/* =========================================================
   10. CLIENT REVIEWS — "See more" toggle
   Every review paragraph is CSS-clamped to a fixed number of lines
   (see .review p in style.css). On load, only cards whose full text
   actually overflows that clamp get their toggle button revealed
   (scrollHeight vs. clientHeight) — short reviews never get an
   unnecessary "See more". Clicking expands/collapses via the
   .expanded class, which lifts the clamp in CSS.
   ========================================================= */
document.querySelectorAll('.review').forEach((card) => {
  const p = card.querySelector('p');
  const btn = card.querySelector('.review-toggle');
  if (!p || !btn) return;

  if (p.scrollHeight > p.clientHeight + 1) {
    btn.classList.add('is-visible');
  }

  btn.addEventListener('click', () => {
    const expanded = card.classList.toggle('expanded');
    btn.textContent = expanded ? 'See less' : 'See more';
    btn.setAttribute('aria-expanded', String(expanded));
  });
});
