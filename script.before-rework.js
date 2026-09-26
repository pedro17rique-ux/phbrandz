/* ============================================================
   PH BRANDZ — ULTRA REFINED MOTION & INTERACTIONS ENGINE
   GSAP 3 + ScrollTrigger + Lenis Smooth Scroll
   ============================================================ */

(() => {
  'use strict';

  // ═══════════════════════════════════════════════════════════
  // 1. LENIS SMOOTH SCROLL (CONFIGURAÇÃO LIMPA SEM DUPLICIDADE)
  // ═══════════════════════════════════════════════════════════
  if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
  }

  let lenis = null;
  if (typeof Lenis !== 'undefined') {
    lenis = new Lenis({
      duration: 1.0,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      touchMultiplier: 1.2,
      infinite: false,
    });

    if (typeof ScrollTrigger !== 'undefined') {
      lenis.on('scroll', ScrollTrigger.update);
    }

    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });
    gsap.ticker.lagSmoothing(0);
  }

  // ═══════════════════════════════════════════════════════════
  // 2. RELÓGIO AO VIVO — GOIÂNIA, BRASIL (GMT-3)
  // ═══════════════════════════════════════════════════════════
  const clockEl = document.getElementById('live-clock');

  function updateGoianiaTime() {
    if (!clockEl) return;
    try {
      const now = new Date();
      const options = {
        timeZone: 'America/Sao_Paulo',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
      };
      const timeString = new Intl.DateTimeFormat('pt-BR', options).format(now);
      clockEl.textContent = `${timeString} BRT`;
    } catch (e) {
      clockEl.textContent = '19:30 BRT';
    }
  }

  updateGoianiaTime();
  setInterval(updateGoianiaTime, 1000);

  // ═══════════════════════════════════════════════════════════
  // 3. PRELOADER EDITORIAL COM CONTAGEM NUMÉRICA
  // ═══════════════════════════════════════════════════════════
  const preloader = document.getElementById('preloader');
  const counterEl = document.getElementById('preloader-counter');
  const barEl     = document.getElementById('preloader-bar');

  let loadProgress = { value: 0 };

  gsap.to(loadProgress, {
    value: 100,
    duration: 1.5,
    ease: 'power2.inOut',
    onUpdate: () => {
      const v = Math.round(loadProgress.value);
      if (counterEl) counterEl.textContent = String(v).padStart(3, '0');
      if (barEl) barEl.style.width = v + '%';
    },
    onComplete: () => {
      setTimeout(dismissPreloader, 200);
    }
  });

  let heroAnimated = false;

  function dismissPreloader() {
    if (!preloader || preloader.classList.contains('finished')) return;
    preloader.classList.add('finished');
    if (typeof gsap !== 'undefined') {
      gsap.to(preloader, {
        yPercent: -100,
        duration: 0.8,
        ease: 'power4.inOut',
        onComplete: () => {
          if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.refresh();
          if (!heroAnimated) {
            heroAnimated = true;
            initHeroAnimations();
          }
        }
      });
    } else {
      preloader.style.display = 'none';
      if (!heroAnimated) {
        heroAnimated = true;
        initHeroAnimations();
      }
    }
  }

  // Failsafe garantido caso o GSAP demore ou trave
  setTimeout(dismissPreloader, 2200);

  // ═══════════════════════════════════════════════════════════
  // 4. BARRA DE PROGRESSO NO TOPO
  // ═══════════════════════════════════════════════════════════
  const scrollProgressBar = document.getElementById('scroll-progress');

  if (scrollProgressBar) {
    gsap.to(scrollProgressBar, {
      width: '100%',
      ease: 'none',
      scrollTrigger: {
        trigger: document.body,
        start: 'top top',
        end: 'bottom bottom',
        scrub: 0.2
      }
    });
  }

  // ═══════════════════════════════════════════════════════════
  // 5. AMBIENT GLOW & CURSOR CUSTOMIZADO (OURA RING)
  // ═══════════════════════════════════════════════════════════
  const cursorEl    = document.getElementById('custom-cursor');
  const cursorBadge = document.getElementById('cursor-badge');
  const ambientGlow = document.getElementById('ambient-glow');

  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;
  let curX = mouseX, curY = mouseY;
  let glowX = mouseX, glowY = mouseY;

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  function renderCursorGlow() {
    curX += (mouseX - curX) * 0.18;
    curY += (mouseY - curY) * 0.18;
    if (cursorEl) {
      cursorEl.style.transform = `translate(${curX}px, ${curY}px)`;
    }

    glowX += (mouseX - glowX) * 0.08;
    glowY += (mouseY - glowY) * 0.08;
    if (ambientGlow) {
      ambientGlow.style.left = `${glowX}px`;
      ambientGlow.style.top = `${glowY}px`;
    }

    requestAnimationFrame(renderCursorGlow);
  }
  renderCursorGlow();

  // Estados de Hover do Cursor
  function setupCursorHoverTargets() {
    const hoverElements = document.querySelectorAll(
      'a, button, .case-card, .logo-item, .hero-tilt-card, .insight-card, .service-card, .diagnosis-card, .faq-trigger, [data-cursor]'
    );

    hoverElements.forEach((el) => {
      el.addEventListener('mouseenter', () => {
        if (!cursorEl) return;
        cursorEl.classList.add('hover');
        const customBadge = el.dataset.cursor || (el.tagName === 'A' ? '( Abrir )' : '( Ver )');
        if (cursorBadge) cursorBadge.textContent = customBadge;
      });

      el.addEventListener('mouseleave', () => {
        if (!cursorEl) return;
        cursorEl.classList.remove('hover');
        if (cursorBadge) cursorBadge.textContent = '';
      });
    });
  }

  setupCursorHoverTargets();

  // ═══════════════════════════════════════════════════════════
  // 6. EFEITO MAGNÉTICO
  // ═══════════════════════════════════════════════════════════
  document.querySelectorAll('.magnetic').forEach((el) => {
    const strength = parseFloat(el.dataset.strength) || 15;

    el.addEventListener('mousemove', (e) => {
      const rect = el.getBoundingClientRect();
      const dx = e.clientX - (rect.left + rect.width / 2);
      const dy = e.clientY - (rect.top + rect.height / 2);

      gsap.to(el, {
        x: dx / (100 / strength),
        y: dy / (100 / strength),
        duration: 0.3,
        ease: 'power2.out'
      });
    });

    el.addEventListener('mouseleave', () => {
      gsap.to(el, {
        x: 0,
        y: 0,
        duration: 0.6,
        ease: 'elastic.out(1, 0.4)'
      });
    });
  });

  // ═══════════════════════════════════════════════════════════
  // 7. HERO ENTRANCE & PARALLAX
  // ═══════════════════════════════════════════════════════════
  function initHeroAnimations() {
    const heroTl = gsap.timeline();

    heroTl.from('#top-nav', {
      y: -30,
      opacity: 0,
      duration: 0.8,
      ease: 'power3.out'
    });

    heroTl.from('.hero-meta-row', {
      opacity: 0,
      y: 20,
      duration: 0.6,
      ease: 'power3.out'
    }, '-=0.4');

    document.querySelectorAll('.h1-line').forEach((line) => {
      const inner = line.querySelector('.h1-char-inner');
      if (inner) {
        heroTl.from(inner, {
          y: '100%',
          duration: 0.9,
          ease: 'power4.out'
        }, '-=0.7');
      }
    });

    heroTl.from('.hero-tilt-card', {
      scale: 0.96,
      y: 30,
      opacity: 0,
      duration: 1.0,
      ease: 'power3.out'
    }, '-=0.5');

    heroTl.from('.hero-footer-row', {
      opacity: 0,
      y: 20,
      duration: 0.7,
      ease: 'power3.out'
    }, '-=0.5');
  }

  // Parallax suave no Watermark
  gsap.to('.hero-watermark', {
    yPercent: -25,
    ease: 'none',
    scrollTrigger: {
      trigger: '.hero-section',
      start: 'top top',
      end: 'bottom top',
      scrub: 0.2
    }
  });

  // ═══════════════════════════════════════════════════════════
  // 8. 3D TILT NO CARD DO HERO
  // ═══════════════════════════════════════════════════════════
  const tiltCard = document.getElementById('hero-tilt-card');

  if (tiltCard && window.innerWidth > 992) {
    tiltCard.addEventListener('mousemove', (e) => {
      const rect = tiltCard.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;

      const rotateX = (-y / (rect.height / 2)) * 5;
      const rotateY = (x / (rect.width / 2)) * 5;

      gsap.to(tiltCard, {
        rotateX: rotateX,
        rotateY: rotateY,
        transformPerspective: 1000,
        duration: 0.3,
        ease: 'power1.out'
      });
    });

    tiltCard.addEventListener('mouseleave', () => {
      gsap.to(tiltCard, {
        rotateX: 0,
        rotateY: 0,
        duration: 0.7,
        ease: 'elastic.out(1, 0.5)'
      });
    });
  }

  // ═══════════════════════════════════════════════════════════
  // 9. FILTRO DE CASES
  // ═══════════════════════════════════════════════════════════
  const filterBtns = document.querySelectorAll('.filter-btn');
  const caseCards  = document.querySelectorAll('.case-card');

  filterBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      filterBtns.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.dataset.filter;

      caseCards.forEach((card) => {
        const cat = card.dataset.category || '';
        if (filter === 'all' || cat.includes(filter)) {
          gsap.to(card, {
            opacity: 1,
            scale: 1,
            duration: 0.35,
            display: 'block',
            ease: 'power2.out'
          });
        } else {
          gsap.to(card, {
            opacity: 0,
            scale: 0.97,
            duration: 0.25,
            display: 'none',
            ease: 'power2.in'
          });
        }
      });

      ScrollTrigger.refresh();
    });
  });

  // ═══════════════════════════════════════════════════════════
  // 10. FAQ ACCORDION LOGIC
  // ═══════════════════════════════════════════════════════════
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach((item) => {
    const trigger = item.querySelector('.faq-trigger');
    const panel = item.querySelector('.faq-panel');

    if (!trigger || !panel) return;

    trigger.addEventListener('click', () => {
      const isActive = item.classList.contains('active');

      // Fechar outros itens abertos para manter limpeza visual
      faqItems.forEach((other) => {
        if (other !== item && other.classList.contains('active')) {
          other.classList.remove('active');
          const otherTrigger = other.querySelector('.faq-trigger');
          const otherPanel = other.querySelector('.faq-panel');
          if (otherTrigger) otherTrigger.setAttribute('aria-expanded', 'false');
          if (otherPanel) otherPanel.style.maxHeight = null;
        }
      });

      if (isActive) {
        item.classList.remove('active');
        trigger.setAttribute('aria-expanded', 'false');
        panel.style.maxHeight = null;
      } else {
        item.classList.add('active');
        trigger.setAttribute('aria-expanded', 'true');
        panel.style.maxHeight = panel.scrollHeight + 'px';
      }

      setTimeout(() => ScrollTrigger.refresh(), 450);
    });
  });

  // ═══════════════════════════════════════════════════════════
  // 11. SCROLL REVEALS & ANIMAÇÕES DE ENTRADA
  // ═══════════════════════════════════════════════════════════
  // Diagnósticos do Problema
  gsap.from('.diagnosis-card', {
    scrollTrigger: {
      trigger: '.diagnosis-grid',
      start: 'top 85%',
      once: true
    },
    y: 35,
    opacity: 0,
    duration: 0.7,
    stagger: 0.1,
    ease: 'power3.out'
  });

  // Cards de Projetos
  gsap.from('.case-card', {
    scrollTrigger: {
      trigger: '.cases-grid',
      start: 'top 85%',
      once: true
    },
    y: 45,
    opacity: 0,
    duration: 0.9,
    stagger: 0.12,
    ease: 'power3.out'
  });

  // Serviços
  gsap.from('.service-card', {
    scrollTrigger: {
      trigger: '.services-grid',
      start: 'top 85%',
      once: true
    },
    y: 35,
    opacity: 0,
    duration: 0.7,
    stagger: 0.08,
    ease: 'power3.out'
  });

  // Passos do Método
  gsap.from('.method-step-card', {
    scrollTrigger: {
      trigger: '.method-steps-grid',
      start: 'top 85%',
      once: true
    },
    y: 35,
    opacity: 0,
    duration: 0.7,
    stagger: 0.08,
    ease: 'power3.out'
  });

  // Tokens de Identidade
  gsap.from('.token-card', {
    scrollTrigger: {
      trigger: '.identity-tokens-grid',
      start: 'top 85%',
      once: true
    },
    y: 25,
    opacity: 0,
    duration: 0.6,
    stagger: 0.06,
    ease: 'power3.out'
  });

  // Logo Matrix
  gsap.from('.logo-item', {
    scrollTrigger: {
      trigger: '.logo-matrix',
      start: 'top 85%',
      once: true
    },
    y: 30,
    opacity: 0,
    scale: 0.96,
    duration: 0.6,
    stagger: 0.07,
    ease: 'power3.out'
  });

  // Depoimentos
  gsap.from('.testimonial-card', {
    scrollTrigger: {
      trigger: '.testimonials-grid',
      start: 'top 85%',
      once: true
    },
    y: 35,
    opacity: 0,
    duration: 0.8,
    stagger: 0.12,
    ease: 'power3.out'
  });

  // Insights
  gsap.from('.insight-card', {
    scrollTrigger: {
      trigger: '.insights-grid',
      start: 'top 85%',
      once: true
    },
    y: 35,
    opacity: 0,
    duration: 0.7,
    stagger: 0.08,
    ease: 'power3.out'
  });

  // Contadores Numéricos Reais do Behance
  document.querySelectorAll('.proof-num[data-target]').forEach((statEl) => {
    const target = parseFloat(statEl.dataset.target) || 0;
    const isK = target > 999;
    const formattedTarget = isK ? target / 1000 : target;

    ScrollTrigger.create({
      trigger: statEl,
      start: 'top 85%',
      once: true,
      onEnter: () => {
        gsap.to({ val: 0 }, {
          val: formattedTarget,
          duration: 1.8,
          ease: 'power2.out',
          onUpdate: function () {
            const current = this.targets()[0].val;
            if (isK) {
              statEl.textContent = '+' + current.toFixed(1).replace('.', ',') + 'K';
            } else {
              statEl.textContent = Math.round(current);
            }
          }
        });
      }
    });
  });

  // ═══════════════════════════════════════════════════════════
  // 12. ACTIVE LINK NO FLOATING DOCK AO ROLAR & NAVEGAÇÃO SUAVE
  // ═══════════════════════════════════════════════════════════
  const navSections = [
    { id: 'projetos', el: document.getElementById('projetos') },
    { id: 'servicos', el: document.getElementById('servicos') },
    { id: 'metodo',   el: document.getElementById('metodo') },
    { id: 'estudio',  el: document.getElementById('estudio') },
    { id: 'insights', el: document.getElementById('insights') },
    { id: 'contato',  el: document.getElementById('contato') }
  ];

  const dockLinks = document.querySelectorAll('.dock-link');

  window.addEventListener('scroll', () => {
    let currentId = '';
    const scrollPos = window.scrollY + window.innerHeight * 0.4;

    navSections.forEach(({ id, el }) => {
      if (!el) return;
      const top = el.offsetTop;
      const height = el.offsetHeight;
      if (scrollPos >= top && scrollPos < top + height) {
        currentId = id;
      }
    });

    if (currentId) {
      dockLinks.forEach((link) => {
        const href = link.getAttribute('href').replace('#', '');
        link.classList.toggle('active', href === currentId);
      });
    }
  }, { passive: true });

  // Rolagem suave com Lenis nos links internos
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', (e) => {
      const targetId = anchor.getAttribute('href');
      if (targetId === '#' || targetId === '') return;
      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        lenis.scrollTo(target, {
          offset: -40,
          duration: 1.2,
          easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t))
        });
      }
    });
  });

})();
