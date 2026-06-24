(function () {
  'use strict';

  const MAIN_SITE_URL = 'https://jusocamp.com';

  const header = document.querySelector('.header');
  const revealElements = document.querySelectorAll('.reveal');
  const parallaxStage = document.querySelector('[data-parallax]');

  function initSiteLinks() {
    const mainLink = document.getElementById('main-site-link');
    if (!mainLink) return;

    mainLink.setAttribute('href', MAIN_SITE_URL);
    mainLink.setAttribute('target', '_blank');
    mainLink.setAttribute('rel', 'noopener noreferrer');
  }

  function initHeaderScroll() {
    if (!header) return;

    let ticking = false;

    function update() {
      header.classList.toggle('scrolled', window.scrollY > 20);
      ticking = false;
    }

    window.addEventListener('scroll', function () {
      if (!ticking) {
        requestAnimationFrame(update);
        ticking = true;
      }
    }, { passive: true });

    update();
  }

  function initScrollReveal() {
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (reducedMotion) {
      revealElements.forEach(function (el) {
        el.classList.add('visible');
      });
      return;
    }

    const observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.08, rootMargin: '0px 0px -50px 0px' }
    );

    revealElements.forEach(function (el, i) {
      el.style.transitionDelay = Math.min(i * 0.04, 0.3) + 's';
      observer.observe(el);
    });
  }

  function initSmoothAnchor() {
    document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
      anchor.addEventListener('click', function (e) {
        const href = anchor.getAttribute('href');
        if (!href || href === '#') return;

        const target = document.querySelector(href);
        if (!target) return;

        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    });
  }

  function initParallax() {
    if (!parallaxStage) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if (window.matchMedia('(max-width: 767px)').matches) return;

    let targetX = 0;
    let targetY = 0;
    let currentX = 0;
    let currentY = 0;

    parallaxStage.addEventListener('mousemove', function (e) {
      const rect = parallaxStage.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      targetX = x * 10;
      targetY = y * 6;
    });

    parallaxStage.addEventListener('mouseleave', function () {
      targetX = 0;
      targetY = 0;
    });

    function animate() {
      currentX += (targetX - currentX) * 0.07;
      currentY += (targetY - currentY) * 0.07;
      parallaxStage.style.transform =
        'perspective(1200px) rotateY(' + (currentX * 0.3) + 'deg) rotateX(' + (-currentY * 0.25) + 'deg)';
      requestAnimationFrame(animate);
    }

    animate();
  }

  function initDashClock() {
    const dashTime = document.getElementById('dash-time');
    const fxTime = document.getElementById('fx-time');

    if (!dashTime && !fxTime) return;

    function tick() {
      const now = new Date();
      const h = String(now.getHours()).padStart(2, '0');
      const m = String(now.getMinutes()).padStart(2, '0');
      const s = String(now.getSeconds()).padStart(2, '0');
      const full = h + ':' + m + ':' + s;
      const short = h + ':' + m;

      if (dashTime) dashTime.textContent = full;
      if (fxTime) fxTime.textContent = short;
    }

    tick();
    setInterval(tick, 1000);
  }

  initSiteLinks();
  initHeaderScroll();
  initScrollReveal();
  initSmoothAnchor();
  initParallax();
  initDashClock();
})();
