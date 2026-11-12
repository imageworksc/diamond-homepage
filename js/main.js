/* ==========================================================================
   Diamond Building Services: page behaviour
   Loaded with `defer`, so the document is parsed when this runs. Everything
   here is an enhancement: without it the page is complete and readable.
   ========================================================================== */

'use strict';

const root = document.documentElement;
const utility = document.querySelector('.utility');
const header = document.querySelector('.site-header');

/* --------------------------------------------------------------------------
   1 · Mobile menu
   -------------------------------------------------------------------------- */
const setupMenu = () => {
  const btn = document.querySelector('.menu-btn');
  const nav = document.getElementById('mnav');
  if (!btn || !nav || !header) return;
  const label = btn.querySelector('.menu-btn__label');

  const place = () => {
    const { bottom } = header.getBoundingClientRect();
    nav.style.setProperty('--mnav-top', `${Math.max(0, bottom)}px`);
  };

  const setOpen = (open) => {
    if (open) place();
    nav.classList.toggle('open', open);
    btn.setAttribute('aria-expanded', String(open));
    if (label) label.textContent = open ? 'Close' : 'Menu';
    document.body.classList.toggle('menu-open', open);
  };

  btn.addEventListener('click', () => setOpen(btn.getAttribute('aria-expanded') !== 'true'));
  nav.addEventListener('click', (e) => { if (e.target.closest('a')) setOpen(false); });

  // One accordion open at a time
  const groups = nav.querySelectorAll('details');
  groups.forEach((d) => d.addEventListener('toggle', () => {
    if (d.open) groups.forEach((o) => { if (o !== d) o.open = false; });
  }));

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && nav.classList.contains('open')) { setOpen(false); btn.focus(); }
  });

  window.addEventListener('resize', () => {
    if (!nav.classList.contains('open')) return;
    if (window.innerWidth > 1200) setOpen(false); else place();
  });
};

/* --------------------------------------------------------------------------
   2 · Header: hero fits the screen below it, compact once scrolled
   -------------------------------------------------------------------------- */
const setupHeader = () => {
  const utilityHeight = () => (utility ? utility.offsetHeight : 0);

  const fit = () => {
    const total = utilityHeight() + (header ? header.offsetHeight : 0);
    root.style.setProperty('--hdr', `${total}px`);
  };

  let ticking = false;
  const onScroll = () => {
    if (header) header.classList.toggle('is-scrolled', window.scrollY > utilityHeight() + 8);
    ticking = false;
  };

  fit();
  onScroll();
  window.addEventListener('resize', fit);
  window.addEventListener('scroll', () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(onScroll);
  }, { passive: true });
};

/* --------------------------------------------------------------------------
   3 · Scroll reveal with a small stagger between siblings
   -------------------------------------------------------------------------- */
const setupReveal = () => {
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!('IntersectionObserver' in window) || reduced) return;

  const sel = [
    '.entity__main', '.entity__facts', '.services__head', '.svc-group', '.svc-help',
    '.safety__grid > *', '.creds > div', '.proof__grid > *', '.contact__grid > *',
    '.faq__aside', '.faq__list details', '.site-footer .wrap > *',
  ].join(', ');
  const els = document.querySelectorAll(sel);

  els.forEach((el) => {
    const sibs = [...el.parentNode.children].filter((c) => c.matches(sel));
    el.dataset.stagger = String(Math.min(sibs.indexOf(el), 5));
    el.classList.add('reveal');
  });

  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-in');
      io.unobserve(entry.target);
    });
  }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
  els.forEach((el) => io.observe(el));

  // Once revealed, drop the reveal classes so each element's own hover
  // transitions take over again.
  document.addEventListener('transitionend', (e) => {
    const t = e.target;
    if (e.propertyName !== 'opacity' || !t.classList || !t.classList.contains('is-in')) return;
    t.classList.remove('reveal', 'is-in');
    delete t.dataset.stagger;
  });
};

setupMenu();
setupHeader();
setupReveal();
