/* ============================================
   Casa Bawi — Main JavaScript
   i18n system, animations, gallery, navigation
   ============================================ */

(function () {
  'use strict';

  // ============================================
  // i18n SYSTEM
  // ============================================
  const LANG_KEY = 'casabawi-lang';
  const localeCache = {};
  let currentLocale = {};

  /**
   * Resolve a dot-notation key from an object.
   * e.g. resolve('nav.about', {nav:{about:'Sobre'}}) => 'Sobre'
   */
  function resolve(key, obj) {
    return key.split('.').reduce((acc, part) => (acc && acc[part] !== undefined ? acc[part] : null), obj);
  }

  /**
   * Load a locale JSON file, with caching.
   */
  async function loadLocale(lang) {
    if (localeCache[lang]) return localeCache[lang];

    try {
      const resp = await fetch(`locales/${lang}.json`);
      if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
      const data = await resp.json();
      localeCache[lang] = data;
      return data;
    } catch (err) {
      console.error(`Failed to load locale "${lang}":`, err);
      return null;
    }
  }

  /**
   * Apply translations to all elements with data-i18n and data-i18n-placeholder.
   */
  function applyTranslations(locale) {
    if (!locale) return;
    currentLocale = locale;

    // Text content
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      const value = resolve(key, locale);
      if (value !== null) {
        el.textContent = value;
      }
    });

    // Placeholders
    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
      const key = el.getAttribute('data-i18n-placeholder');
      const value = resolve(key, locale);
      if (value !== null) {
        el.placeholder = value;
      }
    });
  }

  /**
   * Set the language and apply all translations.
   */
  async function setLanguage(lang) {
    const locale = await loadLocale(lang);
    if (!locale) return;

    document.documentElement.lang = lang;
    localStorage.setItem(LANG_KEY, lang);

    applyTranslations(locale);

    // Update toggle buttons (both navbar and mobile)
    document.querySelectorAll('.lang-toggle__btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.lang === lang);
    });
  }

  function initLanguage() {
    const saved = localStorage.getItem(LANG_KEY) || 'es';

    // Bind click handlers on all toggle buttons
    document.querySelectorAll('.lang-toggle__btn').forEach(btn => {
      btn.addEventListener('click', () => {
        setLanguage(btn.dataset.lang);
      });
    });

    // Initial load
    setLanguage(saved);
  }

  // ============================================
  // NAVBAR SCROLL EFFECT
  // ============================================
  function initNavbar() {
    const navbar = document.querySelector('.navbar');
    if (!navbar) return;

    const threshold = 80;

    function onScroll() {
      navbar.classList.toggle('scrolled', window.scrollY > threshold);
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  // ============================================
  // MOBILE MENU
  // ============================================
  function initMobileMenu() {
    const burger = document.querySelector('.burger');
    const mobileNav = document.querySelector('.mobile-nav');
    if (!burger || !mobileNav) return;

    burger.addEventListener('click', () => {
      burger.classList.toggle('open');
      mobileNav.classList.toggle('active');
      document.body.style.overflow = mobileNav.classList.contains('active') ? 'hidden' : '';
    });

    // Close on link click
    mobileNav.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        burger.classList.remove('open');
        mobileNav.classList.remove('active');
        document.body.style.overflow = '';
      });
    });
  }

  // ============================================
  // SCROLL ANIMATIONS (Intersection Observer)
  // ============================================
  function initScrollAnimations() {
    const elements = document.querySelectorAll('.fade-in');
    if (!elements.length) return;

    // Respect reduced motion
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      elements.forEach(el => el.classList.add('visible'));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px',
      }
    );

    elements.forEach(el => observer.observe(el));
  }

  // ============================================
  // LIGHTBOX GALLERY
  // ============================================
  function initLightbox() {
    const lightbox = document.querySelector('.lightbox');
    const items = document.querySelectorAll('.gallery__item');
    if (!lightbox || !items.length) return;

    const closeBtn = lightbox.querySelector('.lightbox__close');
    const prevBtn = lightbox.querySelector('.lightbox__nav--prev');
    const nextBtn = lightbox.querySelector('.lightbox__nav--next');
    const contentArea = lightbox.querySelector('.lightbox__content');

    let currentIndex = 0;

    function openLightbox(index) {
      currentIndex = index;
      updateLightboxContent();
      lightbox.classList.add('active');
      document.body.style.overflow = 'hidden';
    }

    function closeLightbox() {
      lightbox.classList.remove('active');
      document.body.style.overflow = '';
    }

    function updateLightboxContent() {
      const item = items[currentIndex];
      const placeholder = item.querySelector('.gallery__placeholder');
      if (placeholder) {
        contentArea.innerHTML = '';
        const clone = placeholder.cloneNode(true);
        clone.style.width = '70vw';
        clone.style.height = '70vh';
        clone.style.maxWidth = '900px';
        clone.style.borderRadius = 'var(--radius)';
        contentArea.appendChild(clone);
      }
    }

    function nextSlide() {
      currentIndex = (currentIndex + 1) % items.length;
      updateLightboxContent();
    }

    function prevSlide() {
      currentIndex = (currentIndex - 1 + items.length) % items.length;
      updateLightboxContent();
    }

    items.forEach((item, index) => {
      item.addEventListener('click', () => openLightbox(index));
    });

    if (closeBtn) closeBtn.addEventListener('click', closeLightbox);
    if (prevBtn) prevBtn.addEventListener('click', prevSlide);
    if (nextBtn) nextBtn.addEventListener('click', nextSlide);

    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) closeLightbox();
    });

    document.addEventListener('keydown', (e) => {
      if (!lightbox.classList.contains('active')) return;
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowRight') nextSlide();
      if (e.key === 'ArrowLeft') prevSlide();
    });
  }

  // ============================================
  // SMOOTH SCROLL for anchor links
  // ============================================
  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', (e) => {
        const href = anchor.getAttribute('href');
        if (href === '#') return; // skip whatsapp-link buttons
        const target = document.querySelector(href);
        if (target) {
          e.preventDefault();
          const navHeight = document.querySelector('.navbar')?.offsetHeight || 0;
          const top = target.getBoundingClientRect().top + window.scrollY - navHeight;
          window.scrollTo({ top, behavior: 'smooth' });
        }
      });
    });
  }

  // ============================================
  // WHATSAPP LINK
  // ============================================
  function initWhatsApp() {
    const phone = '529581075503';

    document.querySelectorAll('.whatsapp-link').forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const msg = resolve('booking.whatsapp_message', currentLocale) || '';
        const url = `https://wa.me/${phone}?text=${encodeURIComponent(msg)}`;
        window.open(url, '_blank');
      });
    });
  }

  // ============================================
  // CONTACT FORM
  // ============================================
  function initContactForm() {
    const form = document.querySelector('.booking__form');
    if (!form) return;

    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = form.querySelector('[name="name"]')?.value || '';
      const email = form.querySelector('[name="email"]')?.value || '';
      const message = form.querySelector('[name="message"]')?.value || '';

      if (!name || !email || !message) return;

      const phone = '529581075503';
      const text = `Nuevo mensaje desde Casa Bawi web:\n\nNombre: ${name}\nEmail: ${email}\nMensaje: ${message}`;
      const url = `https://wa.me/${phone}?text=${encodeURIComponent(text)}`;
      window.open(url, '_blank');

      form.reset();
    });
  }

  // ============================================
  // INIT
  // ============================================
  function init() {
    initLanguage();
    initNavbar();
    initMobileMenu();
    initScrollAnimations();
    initLightbox();
    initSmoothScroll();
    initWhatsApp();
    initContactForm();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
