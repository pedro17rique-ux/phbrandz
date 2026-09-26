/* ============================================================
   PH BRANDZ — ULTRA REFINED MOTION & INTERACTIONS ENGINE (FINAL)
   GSAP 3 + ScrollTrigger + Lenis Smooth Scroll + Video Modal
   ============================================================ */

(() => {
  'use strict';

  // ═══════════════════════════════════════════════════════════
  // 1. LENIS SMOOTH SCROLL (SINGLE TICKER COM GSAP)
  // ═══════════════════════════════════════════════════════════
  if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
  }

  const prefersReducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  let lenis = null;
  if (!prefersReducedMotion && typeof Lenis !== 'undefined') {
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
      clockEl.textContent = 'Goiânia BRT';
    }
  }

  updateGoianiaTime();
  setInterval(updateGoianiaTime, 1000);

  // ═══════════════════════════════════════════════════════════
  // 3. BARRA DE PROGRESSO NO TOPO
  // ═══════════════════════════════════════════════════════════
  const scrollProgressBar = document.getElementById('scroll-progress');

  if (scrollProgressBar && typeof gsap !== 'undefined') {
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
  // 4. AMBIENT GLOW & CURSOR EM ASTERISCO (*) KINÉTICO
  // ═══════════════════════════════════════════════════════════
  const cursorEl       = document.getElementById('custom-cursor');
  const cursorAsterisk = document.getElementById('cursor-asterisk');
  const cursorBadge    = document.getElementById('cursor-badge');
  const ambientGlow    = document.getElementById('ambient-glow');

  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;
  let curX = mouseX, curY = mouseY;
  let glowX = mouseX, glowY = mouseY;
  let asteriskAngle = 0;

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  function renderCursorGlow() {
    const prevX = curX;
    const prevY = curY;
    curX += (mouseX - curX) * 0.2;
    curY += (mouseY - curY) * 0.2;

    const vx = curX - prevX;
    const vy = curY - prevY;
    const deltaDist = Math.hypot(vx, vy);
    asteriskAngle = (asteriskAngle + deltaDist * 0.7) % 360;

    // Física de Squish & Stretch sutil no asterisco conforme a velocidade
    const stretch = Math.min(deltaDist * 0.012, 0.22);
    const squish = stretch * 0.45;

    if (cursorEl) {
      cursorEl.style.transform = `translate(${curX}px, ${curY}px)`;
    }
    if (cursorAsterisk) {
      cursorAsterisk.style.transform = `translate(-50%, -50%) rotate(${asteriskAngle}deg) scale(${1 + stretch}, ${1 - squish})`;
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

  // Estados de Cor do Cursor (Verde, Azul, Neutro) & Rótulo Contextual
  function setupCursorHoverTargets() {
    const hoverElements = document.querySelectorAll(
      'a, button, .channel-card, .service-card-clean, .process-step-item, .repertoire-card, .film-player-box, [data-cursor], [data-cursor-state]'
    );

    hoverElements.forEach((el) => {
      el.addEventListener('mouseenter', () => {
        if (!cursorEl) return;
        cursorEl.classList.add('hover');

        // Estado de Cor
        const state = el.dataset.cursorState;
        if (state === 'green') {
          cursorEl.classList.add('state-green');
        } else if (state === 'blue') {
          cursorEl.classList.add('state-blue');
        }

        // Rótulo
        const customBadge = el.dataset.cursor || (el.tagName === 'A' ? '( Abrir )' : '( Ver )');
        if (cursorBadge) cursorBadge.textContent = customBadge;
      });

      el.addEventListener('mouseleave', () => {
        if (!cursorEl) return;
        cursorEl.classList.remove('hover', 'state-green', 'state-blue');
        if (cursorBadge) cursorBadge.textContent = '';
      });
    });
  }

  setupCursorHoverTargets();

  // ═══════════════════════════════════════════════════════════
  // 5. EFEITO MAGNÉTICO SUAVE
  // ═══════════════════════════════════════════════════════════
  if (typeof gsap !== 'undefined') {
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
  }

  // ═══════════════════════════════════════════════════════════
  // 6. HERO MOTION: 3D TILT + TRANSIÇÃO DE ZOOM/PORTAL NO SCROLL
  // ═══════════════════════════════════════════════════════════
  const tiltCard = document.getElementById('hero-tilt-card');
  const portalWrap = document.getElementById('hero-portal-wrap');

  // 3D Card Tilt no Desktop
  if (tiltCard && window.innerWidth > 992 && typeof gsap !== 'undefined') {
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

  // Transição de Zoom/Portal no Primeiro Scroll
  if (portalWrap && typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
    gsap.to(portalWrap, {
      scale: 1.06,
      yPercent: 8,
      ease: 'power1.out',
      scrollTrigger: {
        trigger: '.hero-section',
        start: 'top top',
        end: 'bottom top',
        scrub: 0.3
      }
    });

    gsap.to('.hero-watermark', {
      yPercent: -20,
      ease: 'none',
      scrollTrigger: {
        trigger: '.hero-section',
        start: 'top top',
        end: 'bottom top',
        scrub: 0.2
      }
    });
  }

  // ═══════════════════════════════════════════════════════════
  // 7. MODAL DE VÍDEO SOB DEMANDA (KOOMBO, BUY HOME, FILME)
  // ═══════════════════════════════════════════════════════════
  const videoModal = document.getElementById('video-modal');
  const modalFrame = document.getElementById('modal-video-frame');
  const closeBtn   = document.getElementById('modal-close-btn');
  const backdrop   = document.getElementById('modal-backdrop');

  let lastActiveElement = null;

  function openVideoModal(videoId) {
    if (!videoModal || !modalFrame || !videoId) return;
    // Sanitização estrita do videoId (apenas alfanuméricos, hífen e underscore)
    const sanitizedId = String(videoId).trim().replace(/[^a-zA-Z0-9_-]/g, '');
    if (!sanitizedId || sanitizedId.length > 20) return;

    lastActiveElement = document.activeElement;
    modalFrame.src = `https://www.youtube-nocookie.com/embed/${encodeURIComponent(sanitizedId)}?autoplay=1&rel=0`;
    videoModal.classList.add('active');
    videoModal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    if (closeBtn) closeBtn.focus();
  }

  function closeVideoModal() {
    if (!videoModal || !modalFrame) return;
    videoModal.classList.remove('active');
    videoModal.setAttribute('aria-hidden', 'true');
    modalFrame.src = 'about:blank'; // Descarrega o iframe de forma segura
    document.body.style.overflow = '';
    if (lastActiveElement && typeof lastActiveElement.focus === 'function') {
      lastActiveElement.focus();
    }
  }

  // Disparadores de Vídeo (Cards ou Botões)
  document.querySelectorAll('.video-trigger-box, .video-trigger-btn, .btn-play-film').forEach((trigger) => {
    trigger.addEventListener('click', (e) => {
      e.preventDefault();
      const target = trigger.closest('[data-video-id]') || trigger;
      const videoId = target.dataset.videoId;
      if (videoId) {
        openVideoModal(videoId);
      }
    });
  });

  if (closeBtn) closeBtn.addEventListener('click', closeVideoModal);
  if (backdrop) backdrop.addEventListener('click', closeVideoModal);

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && videoModal && videoModal.classList.contains('active')) {
      closeVideoModal();
    }
  });

  // ═══════════════════════════════════════════════════════════
  // 8. SCROLL REVEALS SUAVES
  // ═══════════════════════════════════════════════════════════
  // 8. CARDS E CONTEÚDO 100% SÓLIDOS (SEM FADE-OUT / SEM SUMIR)
  // ═══════════════════════════════════════════════════════════
  // Garantimos que todos os cards fiquem sempre 100% visíveis e estáveis
  if (typeof gsap !== 'undefined') {
    gsap.set('.service-card-clean, .repertoire-card, .process-step-item, .case-editorial-block', {
      opacity: 1,
      visibility: 'visible',
      clearProps: 'opacity'
    });
  }

  // ═══════════════════════════════════════════════════════════
  // 9. NAVEGAÇÃO SUAVE & ACTIVE STATE NO DOCK E HEADER
  // ═══════════════════════════════════════════════════════════
  const navSections = [
    { id: 'projetos', el: document.getElementById('projetos') },
    { id: 'servicos', el: document.getElementById('servicos') },
    { id: 'processo', el: document.getElementById('processo') },
    { id: 'filme',    el: document.getElementById('filme') },
    { id: 'sobre',    el: document.getElementById('sobre') },
    { id: 'contato',  el: document.getElementById('contato') }
  ];

  const dockLinks = document.querySelectorAll('.dock-link');
  const navMenuLinks = document.querySelectorAll('.nav-menu-link');

  function updateActiveNav() {
    let currentId = '';
    const triggerPoint = window.innerHeight * 0.35;

    // Se estiver no topo antes da primeira seção, nenhum link fica ativo
    if (window.scrollY > 250) {
      navSections.forEach(({ id, el }) => {
        if (!el) return;
        const rect = el.getBoundingClientRect();
        if (rect.top <= triggerPoint && rect.bottom > triggerPoint) {
          currentId = id;
        }
      });
    }

    dockLinks.forEach((link) => {
      const href = (link.getAttribute('href') || '').replace('#', '');
      link.classList.toggle('active', !!currentId && href === currentId);
    });

    navMenuLinks.forEach((link) => {
      const href = (link.getAttribute('href') || '').replace('#', '');
      link.classList.toggle('active', !!currentId && href === currentId);
    });
  }

  window.addEventListener('scroll', updateActiveNav, { passive: true });
  updateActiveNav();

  // Rolagem suave nos links com proteção de seletor
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', (e) => {
      const targetId = anchor.getAttribute('href');
      if (!targetId || targetId === '#') return;
      try {
        const target = document.querySelector(targetId);
        if (target) {
          e.preventDefault();
          if (lenis) {
            lenis.scrollTo(target, {
              offset: -40,
              duration: 1.2,
              easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t))
            });
          } else {
            target.scrollIntoView({ behavior: 'smooth' });
          }
        }
      } catch (err) {
        // Ignora seletores inválidos sem quebrar a execução
      }
    });
  });
  // ═══════════════════════════════════════════════════════════
  // 10. DRAG-TO-SCROLL & MOMENTUM TILT (DANKON PACKS)
  // ═══════════════════════════════════════════════════════════
  const dankonTrack = document.querySelector('.dankon-scroll-sequence');
  const dankonCards = document.querySelectorAll('.dankon-pack-card');

  if (dankonTrack) {
    let isDown = false;
    let startX;
    let scrollLeft;
    let lastDragX = 0;

    dankonTrack.addEventListener('mousedown', (e) => {
      isDown = true;
      startX = e.pageX - dankonTrack.offsetLeft;
      scrollLeft = dankonTrack.scrollLeft;
      lastDragX = e.pageX;
      dankonTrack.style.cursor = 'grabbing';
    });

    const resetDankonTilt = () => {
      isDown = false;
      dankonTrack.style.cursor = '';
      if (typeof gsap !== 'undefined') {
        gsap.to(dankonCards, {
          rotateY: 0,
          rotateZ: 0,
          duration: 0.6,
          ease: 'power2.out',
          overwrite: 'auto'
        });
      }
    };

    dankonTrack.addEventListener('mouseleave', resetDankonTilt);
    dankonTrack.addEventListener('mouseup', resetDankonTilt);

    dankonTrack.addEventListener('mousemove', (e) => {
      if (!isDown) return;
      e.preventDefault();
      const x = e.pageX - dankonTrack.offsetLeft;
      const dragVelocity = e.pageX - lastDragX;
      lastDragX = e.pageX;

      const walk = (x - startX) * 1.6;
      dankonTrack.scrollLeft = scrollLeft - walk;

      // Leve tilt inercial proporcional à velocidade do arraste
      if (typeof gsap !== 'undefined' && !prefersReducedMotion) {
        const tiltAngle = Math.max(-3.5, Math.min(3.5, dragVelocity * 0.22));
        gsap.to(dankonCards, {
          rotateY: -tiltAngle * 1.5,
          rotateZ: tiltAngle * 0.35,
          duration: 0.2,
          ease: 'power1.out',
          overwrite: 'auto'
        });
      }
    });
  }

  // ═══════════════════════════════════════════════════════════
  // 11. SCROLL-SCRUBBED TEXT REVEAL (SEÇÃO 02 - TENSÃO)
  // ═══════════════════════════════════════════════════════════
  const scrubElements = document.querySelectorAll('.scrub-reveal-text');
  if (scrubElements.length && !prefersReducedMotion && typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
    scrubElements.forEach((el) => {
      const words = [];
      Array.from(el.childNodes).forEach((node) => {
        if (node.nodeType === Node.TEXT_NODE) {
          const parts = node.textContent.split(/(\s+)/);
          parts.forEach((part) => {
            if (part.trim().length) {
              const span = document.createElement('span');
              span.className = 'scrub-word';
              span.textContent = part;
              words.push(span);
            } else if (part.length) {
              words.push(document.createTextNode(part));
            }
          });
        } else if (node.nodeType === Node.ELEMENT_NODE) {
          const span = document.createElement('span');
          span.className = 'scrub-word ' + node.className;
          span.innerHTML = node.innerHTML;
          if (node.tagName === 'EM') {
            span.classList.add('scrub-em');
          }
          words.push(span);
        }
      });

      el.innerHTML = '';
      words.forEach((w) => el.appendChild(w));

      const wordSpans = el.querySelectorAll('.scrub-word');
      if (wordSpans.length) {
        gsap.fromTo(
          wordSpans,
          { opacity: 0.22, filter: 'blur(0.5px)' },
          {
            opacity: 1,
            filter: 'blur(0px)',
            stagger: 0.05,
            ease: 'none',
            scrollTrigger: {
              trigger: el,
              start: 'top 82%',
              end: 'bottom 52%',
              scrub: 0.4
            }
          }
        );
      }
    });
  }

  // ═══════════════════════════════════════════════════════════
  // 12. PARALLAX DE JANELA NOS CASES (DEPTH SHIFT)
  // ═══════════════════════════════════════════════════════════
  if (!prefersReducedMotion && typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined' && window.innerWidth > 768) {
    const parallaxImages = document.querySelectorAll(
      '.case-media-box img, .case-editorial-media img, .portal-media-frame img'
    );
    parallaxImages.forEach((img) => {
      const container = img.closest('.case-media-box, .case-editorial-media, .portal-media-frame');
      if (container) {
        gsap.fromTo(
          img,
          { yPercent: -5 },
          {
            yPercent: 5,
            ease: 'none',
            scrollTrigger: {
              trigger: container,
              start: 'top bottom',
              end: 'bottom top',
              scrub: 0.6
            }
          }
        );
      }
    });
  }

  // ═══════════════════════════════════════════════════════════
  // 13. TRAÇO DE LUZ CONECTIVO NAS ETAPAS DO PROCESSO
  // ═══════════════════════════════════════════════════════════
  const wireGlow = document.getElementById('process-wire-glow');
  const processTrack = document.querySelector('.process-steps-track');
  if (wireGlow && processTrack && !prefersReducedMotion && typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
    gsap.to(wireGlow, {
      width: '100%',
      ease: 'none',
      scrollTrigger: {
        trigger: processTrack,
        start: 'top 78%',
        end: 'bottom 60%',
        scrub: 0.5
      }
    });
  }

  // ═══════════════════════════════════════════════════════════
  // 14. VARREDURA SOLAR NO RETRATO DO FUNDADOR
  // ═══════════════════════════════════════════════════════════
  const sunbeam = document.getElementById('sunbeam-sweep');
  const portraitFrame = document.querySelector('.portrait-card-frame');
  if (sunbeam && portraitFrame && !prefersReducedMotion && typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
    ScrollTrigger.create({
      trigger: portraitFrame,
      start: 'top 72%',
      once: true,
      onEnter: () => {
        gsap.fromTo(
          sunbeam,
          { xPercent: -150 },
          { xPercent: 150, duration: 1.4, ease: 'power2.inOut' }
        );
      }
    });
  }

})();

