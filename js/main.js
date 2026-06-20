/* ============================================================
   Casa Ba'wi Apartemento 8 — Main JS
   Header · mobile menu · animations · gallery · lightbox ·
   FAQ accordion · WhatsApp contact form
   Content is server-rendered per language; this only handles
   behaviour. WhatsApp links are real <a href> in the HTML and
   work without JS. Booking number comes from js/config.js.
   ============================================================ */
(function () {
  'use strict';

  var CFG = window.CASA_CONFIG || {};
  var LANG = (document.documentElement.lang || 'en').slice(0, 2);
  var isES = LANG === 'es';

  /* ---- Header scroll ---- */
  function initHeader() {
    var header = document.querySelector('.header');
    if (!header) return;
    function onScroll() { header.classList.toggle('scrolled', window.scrollY > 60); }
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ---- Mobile menu ---- */
  function initMobileMenu() {
    var burger = document.querySelector('.burger');
    var nav = document.querySelector('.mobile-nav');
    if (!burger || !nav) return;
    function close() { burger.classList.remove('open'); nav.classList.remove('active'); document.body.style.overflow = ''; }
    burger.addEventListener('click', function () {
      var open = burger.classList.toggle('open');
      nav.classList.toggle('active', open);
      document.body.style.overflow = open ? 'hidden' : '';
    });
    nav.querySelectorAll('a').forEach(function (a) { a.addEventListener('click', close); });
  }

  /* ---- Fade-up reveal (scroll-based, deep-link safe) ---- */
  function initAnimations() {
    var els = Array.prototype.slice.call(document.querySelectorAll('.fade-up'));
    if (!els.length) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      els.forEach(function (el) { el.classList.add('visible'); });
      return;
    }
    function reveal() {
      var vh = window.innerHeight || document.documentElement.clientHeight;
      els = els.filter(function (el) {
        var top = el.getBoundingClientRect().top;
        if (top < vh * 0.9) { el.classList.add('visible'); return false; }
        return true;
      });
      if (!els.length) {
        window.removeEventListener('scroll', onScroll);
        window.removeEventListener('resize', onScroll);
      }
    }
    var ticking = false;
    function onScroll() {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(function () { reveal(); ticking = false; });
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    window.addEventListener('load', reveal);
    reveal();
  }

  /* ---- Gallery category filter ---- */
  function initGallery() {
    var tabs = document.querySelectorAll('.gallery__tab');
    var items = document.querySelectorAll('.gallery__item');
    if (!tabs.length) return;
    tabs.forEach(function (tab) {
      tab.addEventListener('click', function () {
        tabs.forEach(function (t) { t.classList.remove('active'); });
        tab.classList.add('active');
        var f = tab.dataset.filter;
        items.forEach(function (it) {
          it.classList.toggle('hide', !(f === 'all' || it.dataset.cat === f));
        });
      });
    });
  }

  /* ---- Lightbox (cycles currently-visible photos) ---- */
  function initLightbox() {
    var lb = document.querySelector('.lightbox');
    if (!lb) return;
    var content = lb.querySelector('.lightbox__content');
    var all = Array.prototype.slice.call(document.querySelectorAll('.gallery__item'));
    var list = all, i = 0;
    function visible() { return all.filter(function (it) { return !it.classList.contains('hide'); }); }
    function show() {
      var img = list[i].querySelector('img');
      content.innerHTML = '';
      var e = document.createElement('img'); e.src = img.src; e.alt = img.alt; content.appendChild(e);
    }
    function open(item) { list = visible(); i = list.indexOf(item); if (i < 0) i = 0; show(); lb.classList.add('active'); document.body.style.overflow = 'hidden'; }
    function close() { lb.classList.remove('active'); document.body.style.overflow = ''; }
    function nxt() { i = (i + 1) % list.length; show(); }
    function prv() { i = (i - 1 + list.length) % list.length; show(); }
    all.forEach(function (it) { it.addEventListener('click', function () { open(it); }); });
    lb.querySelector('.lightbox__close').addEventListener('click', close);
    lb.querySelector('.lightbox__nav--next').addEventListener('click', nxt);
    lb.querySelector('.lightbox__nav--prev').addEventListener('click', prv);
    lb.addEventListener('click', function (e) { if (e.target === lb) close(); });
    document.addEventListener('keydown', function (e) {
      if (!lb.classList.contains('active')) return;
      if (e.key === 'Escape') close();
      if (e.key === 'ArrowRight') nxt();
      if (e.key === 'ArrowLeft') prv();
    });
  }

  /* ---- FAQ accordion ---- */
  function initFAQ() {
    document.querySelectorAll('.faq__item').forEach(function (item) {
      var q = item.querySelector('.faq__q');
      var a = item.querySelector('.faq__a');
      if (!q || !a) return;
      q.addEventListener('click', function () {
        var open = item.classList.toggle('open');
        q.setAttribute('aria-expanded', open ? 'true' : 'false');
        a.style.maxHeight = open ? a.scrollHeight + 'px' : '0';
      });
    });
  }

  /* ---- All enquiry forms -> WhatsApp (contact + popup) ---- */
  function labelFor(field, form) {
    if (field.id) { var l = form.querySelector('label[for="' + field.id + '"]'); if (l && l.textContent.trim()) return l.textContent.trim(); }
    return field.getAttribute('placeholder') || field.getAttribute('aria-label') || field.name;
  }
  function initForms() {
    var forms = document.querySelectorAll('.form');
    if (!forms.length) return;
    var phone = (CFG.whatsapp && CFG.whatsapp.phone) || '529581075503';
    var intro = isES ? 'Nueva consulta de Casa Ba\'wi Apartemento 8' : 'New enquiry for Casa Ba\'wi Apartemento 8';
    forms.forEach(function (form) {
      form.addEventListener('submit', function (e) {
        e.preventDefault();
        var fields = form.querySelectorAll('input[name], textarea[name], select[name]');
        var hasContactField = !!form.querySelector('[name="email"], [name="tel"]');
        var nameV = '', contactOk = false, lines = [];
        fields.forEach(function (f) {
          var val = (f.value || '').trim();
          if (f.name === 'name') nameV = val;
          if ((f.name === 'email' || f.name === 'tel') && val) contactOk = true;
          if (val) lines.push(labelFor(f, form) + ': ' + val);
        });
        /* The booking form routes to WhatsApp (which already carries the sender's
           number), so it only needs a name. Forms that still collect email/tel
           require one of those too. Dates + guests ride along in the lines below. */
        if (!nameV || (hasContactField && !contactOk)) {
          form.querySelectorAll('[required]').forEach(function (r) { if (!r.value.trim()) r.style.borderColor = '#c0392b'; });
          return;
        }
        var url = 'https://wa.me/' + phone + '?text=' + encodeURIComponent(intro + '\n\n' + lines.join('\n'));
        window.open(url, '_blank', 'noopener');
        form.reset();
        var modal = form.closest('.modal'); if (modal) modal.classList.remove('active');
        document.body.style.overflow = '';
      });
    });
  }

  /* ---- Lead-capture popup ---- */
  function initModal() {
    var modal = document.querySelector('.modal');
    if (!modal) return;
    var KEY = 'casabawi-popup';
    function open() { modal.classList.add('active'); document.body.style.overflow = 'hidden'; }
    function close() { modal.classList.remove('active'); document.body.style.overflow = ''; }
    modal.querySelector('.modal__close').addEventListener('click', close);
    modal.addEventListener('click', function (e) { if (e.target === modal) close(); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && modal.classList.contains('active')) close(); });
    document.querySelectorAll('[data-modal-open]').forEach(function (t) {
      t.addEventListener('click', function (e) { e.preventDefault(); open(); });
    });
    var cfg = CFG.popup || {};
    if (cfg.autoOpen && !sessionStorage.getItem(KEY)) {
      window.setTimeout(function () {
        if (!modal.classList.contains('active')) open();
        try { sessionStorage.setItem(KEY, '1'); } catch (err) {}
      }, (cfg.delaySeconds || 6) * 1000);
    }
  }

  /* ---- Availability signal (config-driven; no live calendar) ---- */
  function initAvailability() {
    var els = document.querySelectorAll('[data-availability]');
    if (!els.length) return;
    var avail = CFG.availability || {};
    var season = (avail.season || '').trim();
    if (!season) return; // null/empty -> leave the line hidden
    var label = isES ? ('Reservaciones abiertas: ' + season) : ('Now booking ' + season);
    els.forEach(function (el) {
      var slot = el.querySelector('[data-availability-text]') || el;
      slot.textContent = label;
      el.hidden = false;
    });
  }

  function init() {
    initHeader(); initMobileMenu(); initAnimations();
    initGallery(); initLightbox(); initFAQ(); initForms(); initModal();
    initAvailability();
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
