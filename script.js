/**
 * PH BRANDZ: High Conversion Engine
 * Navegação, Interações, Modal de Vídeo, Cursor em Asterisco e Envio para WhatsApp
 */

document.addEventListener('DOMContentLoaded', () => {

  // --- 1. Relógio Dinâmico de Goiânia (-03:00) ---
  const clockEl = document.getElementById('live-clock');
  function updateLiveClock() {
    if (!clockEl) return;
    try {
      const now = new Date();
      const options = {
        timeZone: 'America/Sao_Paulo',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
      };
      clockEl.textContent = new Intl.DateTimeFormat('pt-BR', options).format(now);
    } catch (e) {
      const d = new Date();
      const h = String(d.getHours()).padStart(2, '0');
      const m = String(d.getMinutes()).padStart(2, '0');
      clockEl.textContent = `${h}:${m}`;
    }
  }
  updateLiveClock();
  setInterval(updateLiveClock, 30000);

  // --- 2. Barra de Progresso de Scroll e Estilo do Header ---
  const progressBar = document.getElementById('scroll-progress');
  const topNav = document.getElementById('top-nav');

  window.addEventListener('scroll', () => {
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const docHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    
    if (progressBar && docHeight > 0) {
      const progress = (scrollTop / docHeight) * 100;
      progressBar.style.width = `${progress}%`;
    }

    if (topNav) {
      if (scrollTop > 30) {
        topNav.classList.add('scrolled');
      } else {
        topNav.classList.remove('scrolled');
      }
    }
  }, { passive: true });

  // --- 3. Menu Mobile Drawer ---
  const mobileToggle = document.getElementById('mobile-toggle');
  const navMenu = document.getElementById('nav-menu');

  function closeMobileMenu() {
    if (!mobileToggle || !navMenu) return;
    mobileToggle.setAttribute('aria-expanded', 'false');
    navMenu.classList.remove('is-open');
    document.body.classList.remove('menu-open');
  }

  if (mobileToggle && navMenu) {
    mobileToggle.addEventListener('click', () => {
      const isExpanded = mobileToggle.getAttribute('aria-expanded') === 'true';
      mobileToggle.setAttribute('aria-expanded', String(!isExpanded));
      navMenu.classList.toggle('is-open', !isExpanded);
      document.body.classList.toggle('menu-open', !isExpanded);
    });

    navMenu.querySelectorAll('.nav-menu-link').forEach(link => {
      link.addEventListener('click', closeMobileMenu);
    });
  }

  window.addEventListener('resize', () => {
    if (window.innerWidth > 820) {
      closeMobileMenu();
    }
  });

  // --- 4. Modal de Vídeo Institucional ---
  const filmTrigger = document.getElementById('film-trigger');
  const videoModal = document.getElementById('video-modal');
  const modalVideoFrame = document.getElementById('modal-video-frame');
  const modalCloseBtn = document.getElementById('modal-close-btn');
  const modalBackdrop = document.getElementById('modal-backdrop');

  function openVideoModal(videoId) {
    if (!videoModal || !modalVideoFrame) return;
    const embedUrl = `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1`;
    modalVideoFrame.src = embedUrl;
    videoModal.classList.add('is-active');
    videoModal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeVideoModal() {
    if (!videoModal || !modalVideoFrame) return;
    modalVideoFrame.src = '';
    videoModal.classList.remove('is-active');
    videoModal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  if (filmTrigger) {
    filmTrigger.addEventListener('click', () => {
      const vid = filmTrigger.getAttribute('data-video-id') || 'sjd-VQP_b54';
      openVideoModal(vid);
    });
  }

  if (modalCloseBtn) {
    modalCloseBtn.addEventListener('click', closeVideoModal);
  }

  if (modalBackdrop) {
    modalBackdrop.addEventListener('click', closeVideoModal);
  }

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && videoModal && videoModal.classList.contains('is-active')) {
      closeVideoModal();
    }
  });

  // --- 5. Revelação Suave de Elementos (Scroll Reveal) ---
  const revealElements = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          obs.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.08,
      rootMargin: '0px 0px -40px 0px'
    });

    revealElements.forEach(el => observer.observe(el));
  } else {
    revealElements.forEach(el => el.classList.add('is-visible'));
  }

  // --- 6. Custom Cursor em Asterisco (*) para Desktops ---
  const isFinePointer = window.matchMedia('(pointer: fine)').matches && !window.matchMedia('(hover: none)').matches;
  const cursorEl = document.getElementById('custom-cursor');
  const badgeEl = document.getElementById('cursor-badge');

  if (isFinePointer && cursorEl) {
    cursorEl.style.opacity = '1';

    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let currentX = mouseX;
    let currentY = mouseY;

    window.addEventListener('pointermove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    });

    function renderCursor() {
      currentX += (mouseX - currentX) * 0.35;
      currentY += (mouseY - currentY) * 0.35;
      cursorEl.style.transform = `translate(${currentX}px, ${currentY}px)`;
      requestAnimationFrame(renderCursor);
    }
    requestAnimationFrame(renderCursor);

    // Efeitos Hover e Badges
    const hoverTargets = document.querySelectorAll('a, button, [data-cursor], input, select, textarea, summary');
    hoverTargets.forEach(target => {
      target.addEventListener('pointerenter', () => {
        cursorEl.classList.add('active');
        const customText = target.getAttribute('data-cursor');
        if (customText && badgeEl) {
          badgeEl.textContent = customText;
          badgeEl.classList.add('visible');
        }
      });

      target.addEventListener('pointerleave', () => {
        cursorEl.classList.remove('active');
        if (badgeEl) {
          badgeEl.classList.remove('visible');
        }
      });
    });
  }

  // --- 7. Formulário de Avaliação e Integração com WhatsApp Oficial ---
  const leadForm = document.getElementById('lead-form');

  if (leadForm) {
    leadForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const nomeInput = document.getElementById('form-nome');
      const empresaInput = document.getElementById('form-empresa');
      const presencaInput = document.getElementById('form-presenca');
      const projetoInput = document.getElementById('form-projeto');
      const investimentoInput = document.getElementById('form-investimento');
      const problemaInput = document.getElementById('form-problema');

      const nome = nomeInput ? nomeInput.value.trim() : '';
      const empresa = empresaInput ? empresaInput.value.trim() : '';
      const presenca = presencaInput ? presencaInput.value.trim() : '';
      const projeto = projetoInput ? projetoInput.value : '';
      const investimento = investimentoInput ? investimentoInput.value : '';
      const problema = problemaInput ? problemaInput.value.trim() : '';

      const formFields = [
        { el: nomeInput, val: nome },
        { el: empresaInput, val: empresa },
        { el: presencaInput, val: presenca },
        { el: projetoInput, val: projeto },
        { el: investimentoInput, val: investimento },
        { el: problemaInput, val: problema }
      ];

      // Remove destaques anteriores
      formFields.forEach(f => {
        if (f.el) f.el.classList.remove('input-invalid');
      });

      const feedbackEl = document.getElementById('form-feedback');
      const invalidFields = formFields.filter(f => !f.val);

      // Validação visual inline (sem alert popup intrusivo)
      if (invalidFields.length > 0) {
        invalidFields.forEach(f => {
          if (f.el) {
            f.el.classList.add('input-invalid');
            const clearOnError = () => {
              f.el.classList.remove('input-invalid');
              f.el.removeEventListener('input', clearOnError);
              f.el.removeEventListener('change', clearOnError);
              if (feedbackEl && !leadForm.querySelector('.input-invalid')) {
                feedbackEl.style.display = 'none';
              }
            };
            f.el.addEventListener('input', clearOnError);
            f.el.addEventListener('change', clearOnError);
          }
        });

        if (feedbackEl) {
          feedbackEl.innerHTML = '<span aria-hidden="true">✦</span><span>Opa, faltou preencher os campos destacados acima! Dá uma olhadinha pra gente poder te ajudar direitinho.</span>';
          feedbackEl.style.display = 'flex';
        }

        // Foca automaticamente no primeiro campo pendente
        if (invalidFields[0]?.el) {
          invalidFields[0].el.focus();
        }
        return;
      }

      if (feedbackEl) feedbackEl.style.display = 'none';

      // Feedback visual instantâneo no botão de envio
      const submitBtn = document.getElementById('btn-submit-form');
      const originalBtnHtml = submitBtn ? submitBtn.innerHTML : '';
      if (submitBtn) {
        submitBtn.innerHTML = '<span>Enviando seus dados com carinho...</span> <span class="btn-arrow" aria-hidden="true">⏳</span>';
        submitBtn.disabled = true;
      }

      // Envia os dados para o e-mail oficial (phbrandz@gmail.com) via FormSubmit
      const emailPayload = {
        _subject: `Novo Diagnóstico de Marca: ${nome} (${empresa})`,
        _template: "table",
        _captcha: "false",
        "Nome": nome,
        "Empresa": empresa,
        "Site ou Instagram": presenca,
        "Projeto desejado": projeto,
        "Faixa de investimento": investimento,
        "Principal problema": problema
      };

      // Dispara o envio para o e-mail e conecta no WhatsApp
      fetch('https://formsubmit.co/ajax/phbrandz@gmail.com', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(emailPayload)
      }).catch(err => {
        console.warn('Envio FormSubmit:', err);
      }).finally(() => {
        // Montagem da Mensagem Padronizada para WhatsApp
        const linhas = [
          "Fala PH, beleza? Acabei de preencher a avaliação da minha marca no site e bora trocar uma ideia sobre o projeto:",
          "",
          `*Nome:* ${nome}`,
          `*Empresa:* ${empresa}`,
          `*Site ou Instagram:* ${presenca}`,
          `*Projeto desejado:* ${projeto}`,
          `*Faixa de investimento:* ${investimento}`,
          `*Principal problema:* ${problema}`
        ];

        const mensagemFinal = linhas.join('\n');
        const whatsappUrl = `https://wa.me/5562993193775?text=${encodeURIComponent(mensagemFinal)}`;

        if (submitBtn) {
          submitBtn.innerHTML = '<span>Tudo pronto! Abrindo seu WhatsApp...</span> <span class="btn-arrow" aria-hidden="true">✓</span>';
        }

        // Abre no WhatsApp oficial
        window.open(whatsappUrl, '_blank', 'noopener,noreferrer');

        // Restaura o botão após 3.5 segundos
        setTimeout(() => {
          if (submitBtn) {
            submitBtn.innerHTML = originalBtnHtml;
            submitBtn.disabled = false;
          }
        }, 3500);
      });
    });
  }

  // --- 8. Hero Motion Interativo (Tilt 3D Suave com Inércia) ---
  const heroMotionWrap = document.getElementById('hero-motion-wrap');
  if (heroMotionWrap) {
    let targetX = 0;
    let targetY = 0;
    let currentX = 0;
    let currentY = 0;
    let isTracking = false;

    window.addEventListener('pointermove', (e) => {
      const { innerWidth, innerHeight } = window;
      targetX = (e.clientX / innerWidth - 0.5) * 10;
      targetY = (e.clientY / innerHeight - 0.5) * 8;
      if (!isTracking) {
        isTracking = true;
        requestAnimationFrame(updateHeroTilt);
      }
    });

    function updateHeroTilt() {
      currentX += (targetX - currentX) * 0.08;
      currentY += (targetY - currentY) * 0.08;
      heroMotionWrap.style.transform = `perspective(1200px) rotateY(${currentX.toFixed(2)}deg) rotateX(${(-currentY).toFixed(2)}deg)`;
      if (Math.abs(targetX - currentX) > 0.01 || Math.abs(targetY - currentY) > 0.01) {
        requestAnimationFrame(updateHeroTilt);
      } else {
        isTracking = false;
      }
    }
  }

  // --- 9. Sistema 3D Orbital de Soluções na Seção 6 (Física Suave & Parallax) ---
  const heroStage = document.getElementById('solutions-orbital-stage') || document.getElementById('hero-orbital-stage');
  const orbitalScene = document.getElementById('orbital-scene');
  const orbitalNodes = document.querySelectorAll('.orbital-node');
  const hudTag = document.querySelector('.orbital-hud-tag');

  if (heroStage && orbitalScene) {
    let targetTiltX = 0;
    let targetTiltY = 0;
    let currentTiltX = 0;
    let currentTiltY = 0;
    let isHoveringHero = false;

    // Mensagens descritivas em tempo real no HUD para cada solução
    const hudMessages = {
      'estrategia': 'ESTRATÉGIA: Diagnóstico, posicionamento claro e valor percebido',
      'naming': 'NAMING PROPRIETÁRIO: Construção fonética e pesquisa de viabilidade',
      'identidade': 'IDENTIDADE VISUAL: Sistema gráfico proprietário e coerência em todos os materiais',
      'rebranding': 'REBRANDING ESTRATÉGICO: Reposicionamento para novas fases de mercado',
      'percepcao': 'PERCEPÇÃO DE VALOR: O cliente reconhece a autoridade antes da conversa'
    };

    const defaultHudText = hudTag ? hudTag.innerHTML : '';

    heroStage.addEventListener('pointerenter', () => {
      isHoveringHero = true;
    });

    heroStage.addEventListener('pointerleave', () => {
      isHoveringHero = false;
      targetTiltX = 0;
      targetTiltY = 0;
      if (hudTag) hudTag.innerHTML = defaultHudText;
    });

    window.addEventListener('pointermove', (e) => {
      if (!isHoveringHero) return;
      const rect = heroStage.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      const normX = (x / rect.width) * 2 - 1; // -1 a +1
      const normY = (y / rect.height) * 2 - 1; // -1 a +1

      targetTiltY = normX * 16; // Rotação no eixo Y
      targetTiltX = -normY * 14; // Rotação no eixo X
    });

    // Render loop com interpolação suave (lerp)
    function renderOrbitalTilt() {
      currentTiltX += (targetTiltX - currentTiltX) * 0.08;
      currentTiltY += (targetTiltY - currentTiltY) * 0.08;

      orbitalScene.style.transform = `perspective(1000px) rotateX(${currentTiltX.toFixed(2)}deg) rotateY(${currentTiltY.toFixed(2)}deg)`;
      requestAnimationFrame(renderOrbitalTilt);
    }
    renderOrbitalTilt();

    // Hover e clique interativo nos nós orbitais
    orbitalNodes.forEach(node => {
      const solutionKey = node.getAttribute('data-solution');

      node.addEventListener('pointerenter', () => {
        if (hudTag && hudMessages[solutionKey]) {
          hudTag.innerHTML = `<span class="hud-status-dot"></span><span>${hudMessages[solutionKey]}</span>`;
        }
      });

      node.addEventListener('pointerleave', () => {
        if (hudTag) hudTag.innerHTML = defaultHudText;
      });

      node.addEventListener('click', () => {
        // Redireciona com rolagem suave para a seção mais relevante
        const targetId = (solutionKey === 'estrategia' || solutionKey === 'naming') ? '#servicos' : '#projetos';
        const targetSection = document.querySelector(targetId);
        if (targetSection) {
          targetSection.scrollIntoView({ behavior: 'smooth' });
        }
      });
    });
  }

  // --- 9. Câmara Radiográfica de Marca (O Raio-X PH Brandz) ---
  const btnXrayBefore = document.getElementById('btn-xray-before');
  const btnXrayAfter = document.getElementById('btn-xray-after');
  const switchTrack = document.getElementById('xray-switch-track');
  const plateBefore = document.getElementById('plate-before');
  const plateAfter = document.getElementById('plate-after');
  const xrayViewport = document.getElementById('xray-viewport');

  function setXrayMode(mode) {
    if (!plateBefore || !plateAfter) return;

    if (mode === 'before') {
      plateBefore.classList.add('is-visible');
      plateAfter.classList.remove('is-visible');
      if (btnXrayBefore) btnXrayBefore.classList.add('is-active');
      if (btnXrayAfter) btnXrayAfter.classList.remove('is-active');
      if (switchTrack) switchTrack.classList.add('is-before');
    } else {
      plateAfter.classList.add('is-visible');
      plateBefore.classList.remove('is-visible');
      if (btnXrayAfter) btnXrayAfter.classList.add('is-active');
      if (btnXrayBefore) btnXrayBefore.classList.remove('is-active');
      if (switchTrack) switchTrack.classList.remove('is-before');
    }
  }

  if (btnXrayBefore) {
    btnXrayBefore.addEventListener('click', (e) => {
      e.stopPropagation();
      setXrayMode('before');
    });
  }

  if (btnXrayAfter) {
    btnXrayAfter.addEventListener('click', (e) => {
      e.stopPropagation();
      setXrayMode('after');
    });
  }

  if (switchTrack) {
    switchTrack.addEventListener('click', (e) => {
      e.stopPropagation();
      const isBefore = switchTrack.classList.contains('is-before');
      setXrayMode(isBefore ? 'after' : 'before');
    });
  }

  const switchToggle = document.getElementById('xray-switch-toggle');
  if (switchToggle) {
    switchToggle.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        const isBefore = switchTrack && switchTrack.classList.contains('is-before');
        setXrayMode(isBefore ? 'after' : 'before');
      }
    });
  }

  if (xrayViewport) {
    xrayViewport.addEventListener('click', () => {
      const isCurrentlyAfter = plateAfter && plateAfter.classList.contains('is-visible');
      setXrayMode(isCurrentlyAfter ? 'before' : 'after');
    });
  }

  // --- 10. Seletor de Momento (Pinned Horizontal Scroll Carousel) ---
  const runway = document.getElementById('decision-runway');
  const track = document.getElementById('decision-track');
  const meterFill = document.getElementById('decision-meter-fill');
  const decisionCards = document.querySelectorAll('.decision-card');
  const projetoSelect = document.getElementById('form-projeto');
  const investimentoSelect = document.getElementById('form-investimento');
  const problemaTextarea = document.getElementById('form-problema');

  const momentPresets = {
    'Ainda preciso entender': {
      projeto: 'Ainda preciso entender',
      investimento: 'Até R$ 5 mil',
      problema: 'Estrutura enxuta precisando de identidade visual essencial, rápida e profissional para gerar confiança imediata.'
    },
    'Estratégia de marca + identidade visual': {
      projeto: 'Estratégia de marca + identidade visual',
      investimento: 'De R$ 5 mil a R$ 10 mil',
      problema: 'O faturamento e a entrega cresceram, mas a imagem atual ainda parece amadora e não reflete o valor real da empresa.'
    },
    'Rebranding estratégico': {
      projeto: 'Rebranding estratégico',
      investimento: 'De R$ 10 mil a R$ 15 mil',
      problema: 'Empresa com tradição precisando modernizar a presença, reposicionar autoridade e alcançar clientes mais qualificados.'
    },
    'Naming + marca completa': {
      projeto: 'Naming + marca completa',
      investimento: 'De R$ 5 mil a R$ 10 mil',
      problema: 'Projeto nascendo do zero que exige naming proprietário, pesquisa fonética e sistema de marca completo e integrado.'
    }
  };

  // Controlador de Pinned Scroll Horizontal
  function updateDecisionPinnedScroll() {
    if (!runway || !track) return;
    if (window.innerWidth <= 900) {
      track.style.transform = '';
      return;
    }
    const rect = runway.getBoundingClientRect();
    const runwayHeight = runway.offsetHeight;
    const windowH = window.innerHeight;
    const scrollDist = runwayHeight - windowH;
    if (scrollDist <= 0) return;

    // Progresso normalizado de 0 a 1
    const progress = Math.max(0, Math.min(1, -rect.top / scrollDist));

    // Máximo translado horizontal necessário
    const maxTranslate = track.scrollWidth - track.parentElement.clientWidth;
    if (maxTranslate > 0) {
      track.style.transform = `translate3d(-${progress * maxTranslate}px, 0, 0)`;
    }

    // Atualiza barra de progresso no footer HUD
    if (meterFill) {
      meterFill.style.width = `${progress * 100}%`;
    }

    // Determina o card ativo com base no progresso
    const numCards = decisionCards.length || 4;
    const activeIdx = Math.min(numCards - 1, Math.floor(progress * numCards * 0.999));

    decisionCards.forEach((c, idx) => {
      c.classList.toggle('is-in-focus', idx === activeIdx);
    });
  }

  window.addEventListener('scroll', updateDecisionPinnedScroll, { passive: true });
  window.addEventListener('resize', updateDecisionPinnedScroll, { passive: true });
  updateDecisionPinnedScroll();

  decisionCards.forEach(card => {
    card.addEventListener('click', () => {
      decisionCards.forEach(c => {
        c.classList.remove('is-selected');
        const btnText = c.querySelector('.btn-select-decision span:first-child');
        if (btnText) btnText.textContent = 'Selecionar este momento';
      });

      card.classList.add('is-selected');
      const activeBtnText = card.querySelector('.btn-select-decision span:first-child');
      if (activeBtnText) activeBtnText.textContent = 'Momento selecionado';

      const targetKey = card.getAttribute('data-target-project');
      const preset = momentPresets[targetKey];

      if (preset) {
        if (projetoSelect) projetoSelect.value = preset.projeto;
        if (investimentoSelect) investimentoSelect.value = preset.investimento;
        if (problemaTextarea && (!problemaTextarea.value.trim() || Object.values(momentPresets).some(p => p.problema === problemaTextarea.value.trim()))) {
          problemaTextarea.value = preset.problema;
        }
      }
      // Permanece na mesma seção, apenas pré-configura os campos sem rolar a tela
    });
  });

  // --- 11. Cards de Projetos (Editorial Sólido e Estável) ---
  // Motions removidos conforme solicitação direta para garantir leitura limpa


  // --- 12. Esquema Técnico CAD Industrial PH Brandz (Conforme Imagem 02) ---
  const cadCards = document.querySelectorAll('.cad-pcard');
  const valveButtons = document.querySelectorAll('.valve-btn');
  const cadBottomSteps = document.querySelectorAll('.cad-pstep');

  function setBlueprintChamber(chamberId) {
    if (!chamberId) return;

    // Atualiza comutadores de válvula no topo
    valveButtons.forEach(btn => {
      if (btn.getAttribute('data-chamber') === chamberId) {
        btn.classList.add('is-active');
      } else {
        btn.classList.remove('is-active');
      }
    });

    // Atualiza os 5 cards de processo
    cadCards.forEach(card => {
      if (card.getAttribute('data-chamber') === chamberId) {
        card.classList.add('is-active');
      } else {
        card.classList.remove('is-active');
      }
    });

    // Atualiza os steps na tira inferior
    cadBottomSteps.forEach(step => {
      if (step.getAttribute('data-chamber') === chamberId) {
        step.classList.add('is-active');
      } else {
        step.classList.remove('is-active');
      }
    });
  }

  // Inicializa na estação 02 (Compressão / Estratégia) como na Imagem 02 de referência
  setBlueprintChamber('2');

  // Listeners dos 5 cards
  cadCards.forEach(card => {
    const cId = card.getAttribute('data-chamber');
    card.addEventListener('click', () => setBlueprintChamber(cId));
  });

  // Listeners dos botões de válvula
  valveButtons.forEach(btn => {
    const cId = btn.getAttribute('data-chamber');
    btn.addEventListener('click', () => setBlueprintChamber(cId));
  });

  // Listeners dos steps inferiores
  cadBottomSteps.forEach(step => {
    const cId = step.getAttribute('data-chamber');
    step.addEventListener('click', () => setBlueprintChamber(cId));
  });

  // --- 13. Cartão Tátil de Manifesto (3D Gyro Card: Black Card de Titânio) ---
  const blackCard = document.getElementById('manifesto-black-card');
  const cardSheen = document.getElementById('card-sheen');

  if (blackCard) {
    blackCard.addEventListener('pointermove', (e) => {
      const rect = blackCard.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const normX = (x / rect.width) - 0.5;
      const normY = (y / rect.height) - 0.5;

      const tiltX = -normY * 12;
      const tiltY = normX * 12;

      blackCard.style.transform = `perspective(1000px) rotateX(${tiltX.toFixed(2)}deg) rotateY(${tiltY.toFixed(2)}deg) translateY(-6px)`;

      if (cardSheen) {
        const pctX = (x / rect.width) * 100;
        const pctY = (y / rect.height) * 100;
        cardSheen.style.setProperty('--mouse-x', `${pctX}%`);
        cardSheen.style.setProperty('--mouse-y', `${pctY}%`);
      }
    });

    blackCard.addEventListener('pointerleave', () => {
      blackCard.style.transform = '';
    });
  }

  // --- 15. Sintetizador de Valor Comercial (The Brand Synthesizer Chamber) ---
  const synthKeys = document.querySelectorAll('.synth-key');
  const synthPanels = document.querySelectorAll('.synth-panel');

  synthKeys.forEach(key => {
    key.addEventListener('click', () => {
      const serviceId = key.getAttribute('data-service');

      // Alterna classes ativas dos botões seletores
      synthKeys.forEach(k => k.classList.remove('is-active'));
      key.classList.add('is-active');

      // Alterna visibilidade dos painéis de Fricção vs. Cirurgia PH
      synthPanels.forEach(panel => {
        panel.classList.remove('is-visible');
      });

      const activePanel = document.getElementById(`synth-panel-${serviceId}`);
      if (activePanel) {
        activePanel.classList.add('is-visible');
      }
    });
  });

  // --- 16. Gavetas Retráteis de Detalhes dos Cases (Problema, Decisão, Sistema, Resultado) ---
  const caseToggleButtons = document.querySelectorAll('.btn-toggle-case');
  caseToggleButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetId = btn.getAttribute('data-target');
      const drawer = document.getElementById(targetId);
      if (!drawer) return;

      const isHidden = drawer.hasAttribute('hidden');
      if (isHidden) {
        drawer.removeAttribute('hidden');
        btn.classList.add('is-open');
        btn.setAttribute('aria-expanded', 'true');
        const label = btn.querySelector('.btn-toggle-label');
        if (label) label.textContent = 'Ocultar detalhes do projeto';
      } else {
        drawer.setAttribute('hidden', '');
        btn.classList.remove('is-open');
        btn.setAttribute('aria-expanded', 'false');
        const label = btn.querySelector('.btn-toggle-label');
        if (label) label.textContent = 'Ver detalhes técnicos do projeto';
      }
    });
  });

  // ============================================================
  // SEÇÃO 3: SANFONA INTERATIVA DE COLUNAS (PARA QUEM É)
  // ============================================================
  const situationCols = document.querySelectorAll('.situation-col');
  const accordionContainer = document.getElementById('situations-accordion');

  if (situationCols.length > 0 && accordionContainer) {
    situationCols.forEach((col) => {
      col.addEventListener('mouseenter', () => {
        situationCols.forEach((c) => c.classList.remove('is-active'));
        col.classList.add('is-active');
      });

      col.addEventListener('click', () => {
        situationCols.forEach((c) => c.classList.remove('is-active'));
        col.classList.add('is-active');
      });

      col.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          situationCols.forEach((c) => c.classList.remove('is-active'));
          col.classList.add('is-active');
        }
      });
    });

    accordionContainer.addEventListener('mouseleave', () => {
      situationCols.forEach((c) => c.classList.remove('is-active'));
      situationCols[0]?.classList.add('is-active');
    });

    // Conexão direta dos botões de ação do cenário com o formulário
    const scenarioCtaButtons = document.querySelectorAll('.btn-scenario-cta');
    const projetoSelectEl = document.getElementById('form-projeto');
    scenarioCtaButtons.forEach((btn) => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const projectVal = btn.getAttribute('data-project');
        if (projectVal && projetoSelectEl) {
          projetoSelectEl.value = projectVal;
        }
        const targetSection = document.getElementById('avaliacao');
        if (targetSection) {
          targetSection.scrollIntoView({ behavior: 'smooth' });
          const nomeInput = document.getElementById('form-nome');
          if (nomeInput) {
            setTimeout(() => nomeInput.focus(), 650);
          }
        }
      });
    });
  }

});


