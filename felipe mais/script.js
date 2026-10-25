/* ============================================================
   PROF. FELIPE MAIA — SCRIPT PRINCIPAL
   ============================================================ */
(function () {
  'use strict';

  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));
  const WHATSAPP_NUMBER = '5535998896845';

  /* ============================================================
     ANO NO FOOTER
     ============================================================ */
  const yearEl = $('#year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ============================================================
     LGPD BANNER
     ============================================================ */
  const lgpdBanner = $('#lgpdBanner');
  const LGPD_KEY = 'lgpd_consent_v1';

  function showLgpdBanner() {
    if (!lgpdBanner) return;
    if (!localStorage.getItem(LGPD_KEY)) lgpdBanner.hidden = false;
  }

  function hideLgpdBanner(consent) {
    if (!lgpdBanner) return;
    lgpdBanner.hidden = true;
    try { localStorage.setItem(LGPD_KEY, consent); } catch (e) { }
  }

  const lgpdAccept = $('#lgpdAccept');
  const lgpdReject = $('#lgpdReject');
  if (lgpdAccept) lgpdAccept.addEventListener('click', () => hideLgpdBanner('all'));
  if (lgpdReject) lgpdReject.addEventListener('click', () => hideLgpdBanner('essential'));

  showLgpdBanner();

  /* ============================================================
     ACESSIBILIDADE
     ============================================================ */
  const a11yToggle = $('#a11yToggle');
  const a11yPanel = $('#a11yPanel');
  const A11Y_FONT_KEY = 'a11y_font_size';
  const A11Y_CONTRAST_KEY = 'a11y_contrast';
  const A11Y_DARK_KEY = 'a11y_dark_mode';

  function applyFontSize(size) {
    document.documentElement.style.fontSize = size + 'px';
  }

  function applyContrast(enabled) {
    document.body.classList.toggle('a11y-high-contrast', enabled);
    const btn = $('[data-a11y="contrast"]');
    if (btn) btn.setAttribute('aria-pressed', enabled ? 'true' : 'false');
  }

  function applyDarkMode(enabled) {
    document.body.classList.toggle('a11y-dark-mode', enabled);
    const btn = $('[data-a11y="dark-mode"]');
    if (btn) {
      btn.setAttribute('aria-pressed', enabled ? 'true' : 'false');
      btn.innerHTML = enabled ? '☀️ Modo Claro' : '🌙 Modo Escuro';
    }
    const headerBtn = $('#themeToggleHeader');
    if (headerBtn) {
      headerBtn.setAttribute('aria-label', enabled ? 'Ativar modo claro' : 'Ativar modo escuro');
      headerBtn.setAttribute('title', enabled ? 'Ativar modo claro' : 'Ativar modo escuro');
    }
  }

  try {
    const savedFont = localStorage.getItem(A11Y_FONT_KEY);
    if (savedFont) applyFontSize(parseInt(savedFont, 10));
    if (localStorage.getItem(A11Y_CONTRAST_KEY) === 'true') applyContrast(true);
    if (localStorage.getItem(A11Y_DARK_KEY) === 'true') applyDarkMode(true);
  } catch (e) { /* ignore */ }

  if (a11yToggle && a11yPanel) {
    a11yToggle.addEventListener('click', () => {
      const isHidden = a11yPanel.hidden;
      a11yPanel.hidden = !isHidden;
      a11yToggle.setAttribute('aria-expanded', isHidden ? 'true' : 'false');
    });

    document.addEventListener('click', (e) => {
      if (!a11yPanel.hidden &&
        !a11yPanel.contains(e.target) &&
        !a11yToggle.contains(e.target)) {
        a11yPanel.hidden = true;
        a11yToggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  const themeToggleHeader = $('#themeToggleHeader');
  if (themeToggleHeader) {
    themeToggleHeader.addEventListener('click', () => {
      const isActive = document.body.classList.contains('a11y-dark-mode');
      applyDarkMode(!isActive);
      try { localStorage.setItem(A11Y_DARK_KEY, (!isActive).toString()); } catch (e) { }
    });
  }

  $$('[data-a11y]').forEach(btn => {
    btn.addEventListener('click', () => {
      const action = btn.dataset.a11y;
      const currentSize = parseFloat(getComputedStyle(document.documentElement).fontSize);

      if (action === 'font-increase') {
        const newSize = Math.min(currentSize + 1, 22);
        applyFontSize(newSize);
        try { localStorage.setItem(A11Y_FONT_KEY, newSize); } catch (e) { }
      } else if (action === 'font-decrease') {
        const newSize = Math.max(currentSize - 1, 12);
        applyFontSize(newSize);
        try { localStorage.setItem(A11Y_FONT_KEY, newSize); } catch (e) { }
      } else if (action === 'font-reset') {
        applyFontSize(16);
        try { localStorage.setItem(A11Y_FONT_KEY, 16); } catch (e) { }
      } else if (action === 'contrast') {
        const isActive = btn.getAttribute('aria-pressed') === 'true';
        applyContrast(!isActive);
        try { localStorage.setItem(A11Y_CONTRAST_KEY, (!isActive).toString()); } catch (e) { }
      } else if (action === 'dark-mode') {
        const isActive = btn.getAttribute('aria-pressed') === 'true';
        applyDarkMode(!isActive);
        try { localStorage.setItem(A11Y_DARK_KEY, (!isActive).toString()); } catch (e) { }
      } else if (action === 'vlibras') {
        if (window.VLibras && typeof window.VLibras.Plugin === 'function') {
          try { new window.VLibras.Plugin({ rootPath: 'https://vlibras.gov.br/app' }); }
          catch (e) { console.warn('VLibras:', e); }
        }
        const widget = $('[vw]');
        if (widget) widget.scrollIntoView({ behavior: 'smooth', block: 'center' });
      } else if (action === 'reset') {
        applyFontSize(16);
        applyContrast(false);
        applyDarkMode(false);
        try {
          localStorage.removeItem(A11Y_FONT_KEY);
          localStorage.removeItem(A11Y_CONTRAST_KEY);
          localStorage.removeItem(A11Y_DARK_KEY);
        } catch (e) { }
      }
    });
  });

  /* ============================================================
     MOBILE MENU
     ============================================================ */
  const mobileToggle = $('#mobileToggle');
  const navMenu = $('#navMenu');

  if (mobileToggle && navMenu) {
    mobileToggle.addEventListener('click', () => {
      const isOpen = navMenu.classList.toggle('open');
      mobileToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });

    $$('.nav-link', navMenu).forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('open');
        mobileToggle.setAttribute('aria-expanded', 'false');
      });
    });

    document.addEventListener('click', (e) => {
      if (navMenu.classList.contains('open') &&
        !navMenu.contains(e.target) &&
        !mobileToggle.contains(e.target)) {
        navMenu.classList.remove('open');
        mobileToggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  /* ============================================================
     LINK ATIVO NO MENU
     ============================================================ */
  const sections = $$('section[id]');
  const navLinks = $$('.nav-link');

  function setActiveLink() {
    const scrollPos = window.scrollY + 140;
    let currentId = '';
    sections.forEach(sec => { if (sec.offsetTop <= scrollPos) currentId = sec.id; });
    navLinks.forEach(link => {
      link.classList.toggle('active', link.getAttribute('href') === '#' + currentId);
    });
  }

  window.addEventListener('scroll', setActiveLink, { passive: true });
  setActiveLink();

  /* ============================================================
     BACK TO TOP
     ============================================================ */
  const backToTop = $('#backToTop');

  function toggleBackToTop() {
    if (!backToTop) return;
    backToTop.hidden = window.scrollY <= 500;
  }

  window.addEventListener('scroll', toggleBackToTop, { passive: true });
  toggleBackToTop();

  if (backToTop) {
    backToTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
  }

  /* ============================================================
     REVEAL ON SCROLL
     ============================================================ */
  const revealEls = $$('.reveal');
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    revealEls.forEach(el => io.observe(el));
  } else {
    revealEls.forEach(el => el.classList.add('is-visible'));
  }

  /* ============================================================
     CONTADOR DE ESTATÍSTICAS
     ============================================================ */
  const statNumbers = $$('.stat-number');
  let statsAnimated = false;

  function animateStats() {
    if (statsAnimated) return;
    const statsSection = $('.stats-banner');
    if (!statsSection) return;

    const rect = statsSection.getBoundingClientRect();
    if (rect.top < window.innerHeight - 100) {
      statsAnimated = true;
      statNumbers.forEach(el => {
        const target = parseInt(el.dataset.target, 10);
        const prefix = el.dataset.prefix || '';
        const suffix = el.dataset.suffix || '';
        const duration = 1600;
        const start = performance.now();

        function update(now) {
          const elapsed = now - start;
          const progress = Math.min(elapsed / duration, 1);
          const eased = 1 - Math.pow(1 - progress, 3);
          const current = Math.floor(eased * target);
          el.textContent = prefix + current + suffix;
          if (progress < 1) requestAnimationFrame(update);
          else el.textContent = prefix + target + suffix;
        }
        requestAnimationFrame(update);
      });
    }
  }

  window.addEventListener('scroll', animateStats, { passive: true });
  animateStats();

  /* ============================================================
     TOGGLE PÚBLICO (FAMÍLIAS / ESCOLAS)
     ============================================================ */
  const audienceBtns = $$('.audience-btn');
  const audiencePanels = $$('.audience-panel');

  audienceBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const target = btn.dataset.audience;

      audienceBtns.forEach(b => {
        const isActive = b === btn;
        b.classList.toggle('active', isActive);
        b.setAttribute('aria-selected', isActive ? 'true' : 'false');
      });

      audiencePanels.forEach(panel => {
        panel.hidden = panel.id !== 'panel-' + target;
      });
    });
  });

  /* ============================================================
     FAQ ACCORDION
     ============================================================ */
  $$('.faq-item').forEach(item => {
    const question = $('.faq-question', item);
    if (!question) return;

    question.addEventListener('click', () => {
      const isActive = item.classList.contains('active');

      $$('.faq-item').forEach(other => {
        other.classList.remove('active');
        const q = $('.faq-question', other);
        if (q) q.setAttribute('aria-expanded', 'false');
      });

      if (!isActive) {
        item.classList.add('active');
        question.setAttribute('aria-expanded', 'true');
      }
    });
  });

  /* ============================================================
     MODAIS — abrir/fechar
     ============================================================ */
  function openModal(modal) {
    if (!modal) return;
    modal.hidden = false;
    document.body.style.overflow = 'hidden';
  }

  function closeModal(modal) {
    if (!modal) return;
    modal.hidden = true;
    document.body.style.overflow = '';
  }

  function closeAllModals() {
    $$('.modal-overlay').forEach(m => closeModal(m));
  }

  $$('[data-close-modal]').forEach(btn => {
    btn.addEventListener('click', () => {
      const modal = btn.closest('.modal-overlay');
      if (modal) closeModal(modal);
    });
  });

  $$('.modal-overlay').forEach(overlay => {
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) closeModal(overlay);
    });
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeAllModals();
  });

  $$('[data-open-modal]').forEach(btn => {
    btn.addEventListener('click', () => {
      const modalId = btn.dataset.openModal + 'Modal';
      openModal($('#' + modalId));
    });
  });

  /* ============================================================
     MODAL DE AGENDAMENTO (bookingModal)
     ============================================================ */
  const modalClose = $('#modalClose');
  if (modalClose) {
    modalClose.addEventListener('click', () => closeModal($('#bookingModal')));
  }

  const modalAppointmentForm = $('#modalAppointmentForm');
  if (modalAppointmentForm) {
    modalAppointmentForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = $('#modalName').value.trim();
      const phone = $('#modalPhone').value.trim();
      const service = $('#modalReasonSelect').value;

      if (!name) {
        alert('Por favor, informe seu nome.');
        return;
      }

      const msg = `Olá, Prof. Felipe! 👋

*Nome:* ${name}
*Telefone:* ${phone || 'Não informado'}
*Serviço de interesse:* ${service}

Gostaria de agendar uma conversa.`;

      const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`;
      window.open(url, '_blank', 'noopener,noreferrer');
      closeModal($('#bookingModal'));
    });
  }

  /* ============================================================
     BOTÕES COM data-service → abre o modal já com o serviço
     ============================================================ */
  $$('[data-open-quiz="booking"][data-service]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const service = btn.dataset.service;
      const sel = $('#modalReasonSelect');
      if (sel && service) {
        Array.from(sel.options).forEach(opt => {
          if (opt.value === service || opt.textContent === service) {
            sel.value = opt.value;
          }
        });
      }
      openModal($('#bookingModal'));
    });
  });

  /* ============================================================
     FORMULÁRIO PRINCIPAL DE AGENDAMENTO
     ============================================================ */
  const appointmentForm = $('#appointmentForm');
  if (appointmentForm) {
    appointmentForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const parentName = $('#parentName').value.trim();
      const childName = $('#childName').value.trim();
      const childAge = $('#childAge').value.trim();
      const period = $('#periodSelect').value;
      const reason = $('#reasonSelect').value;
      const notes = $('#userNotes').value.trim();

      if (!parentName || !reason) {
        alert('Por favor, preencha os campos obrigatórios (*).');
        return;
      }

      const msg = `Olá, Prof. Felipe! 👋

*Nome do responsável:* ${parentName}
${childName ? `*Nome da criança/aluno(a):* ${childName}\n` : ''}${childAge ? `*Idade/Escolaridade:* ${childAge}\n` : ''}*Período preferencial:* ${period}
*Motivo principal:* ${reason}${notes ? `\n\n*Observações:*\n${notes}` : ''}

Gostaria de agendar uma conversa.`;

      const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`;
      window.open(url, '_blank', 'noopener,noreferrer');
    });
  }

  /* ============================================================
     QUIZ DE AGENDAMENTO (3 passos)
     ============================================================ */
  const quizModal = $('#quizModal');
  const quizClose = $('#quizClose');
  const quizSteps = $$('.quiz-step');
  const quizProgressBar = $('#quizProgressBar');
  const quizStepNumber = $('#quizStepNumber');
  const quizPreview = $('#quizPreview');
  const quizPreviewBox = $('#quizPreviewBox');
  const quizBackBtn = $('#quizBackBtn');
  const quizFinishBtn = $('#quizFinishBtn');

  let currentStep = 1;
  const quizData = { audience: '', need: '', period: '' };

  function updateQuizUI() {
    quizSteps.forEach(step => {
      step.hidden = parseInt(step.dataset.quizStep, 10) !== currentStep;
    });

    if (quizProgressBar) {
      quizProgressBar.style.width = ((currentStep - 1) / 3 * 100) + '%';
    }
    if (quizStepNumber) {
      quizStepNumber.textContent = Math.min(currentStep, 3);
    }

    if (quizPreview) {
      quizPreview.hidden = currentStep <= 3;
    }

    if (quizBackBtn) {
      quizBackBtn.style.display = currentStep === 1 ? 'none' : '';
    }

    if (quizPreviewBox && currentStep > 3) {
      quizPreviewBox.textContent = buildQuizMessage();
    }
  }

  function buildQuizMessage() {
    return `Olá, Prof. Felipe! 👋

*Para quem é o atendimento:* ${quizData.audience || 'Não informado'}
*Principal necessidade:* ${quizData.need || 'Não informado'}
*Período de preferência:* ${quizData.period || 'Não informado'}

Gostaria de conversar para entender como posso ser ajudado(a).`;
  }

  function openQuiz() {
    currentStep = 1;
    quizData.audience = '';
    quizData.need = '';
    quizData.period = '';

    $$('.quiz-option').forEach(opt => opt.classList.remove('selected'));

    updateQuizUI();
    openModal(quizModal);
  }

  // Botões do quiz (SEM data-service) abrem o quiz
  $$('[data-open-quiz="booking"]:not([data-service])').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      openQuiz();
    });
  });

  if (quizClose) {
    quizClose.addEventListener('click', () => closeModal(quizModal));
  }

  $$('.quiz-option').forEach(opt => {
    opt.addEventListener('click', () => {
      const field = opt.dataset.quizField;
      const value = opt.dataset.value;

      quizData[field] = value;

      $$(`.quiz-option[data-quiz-field="${field}"]`).forEach(o => o.classList.remove('selected'));
      opt.classList.add('selected');

      setTimeout(() => {
        if (currentStep < 3) {
          currentStep++;
          updateQuizUI();
        } else {
          currentStep = 4;
          updateQuizUI();
        }
      }, 350);
    });
  });

  if (quizBackBtn) {
    quizBackBtn.addEventListener('click', () => {
      if (currentStep > 1) {
        currentStep--;
        updateQuizUI();
      }
    });
  }

  if (quizFinishBtn) {
    quizFinishBtn.addEventListener('click', () => {
      const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(buildQuizMessage())}`;
      window.open(url, '_blank', 'noopener,noreferrer');
      closeModal(quizModal);
    });
  }

  /* ============================================================
     NEWSLETTER
     ============================================================ */
  const newsletterForm = $('#newsletterForm');
  const newsletterFeedback = $('#newsletterFeedback');

  if (newsletterForm && newsletterFeedback) {
    newsletterForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const email = $('#newsletterEmail').value.trim();
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (!emailRegex.test(email)) {
        newsletterFeedback.textContent = '⚠️ Por favor, informe um e-mail válido.';
        newsletterFeedback.className = 'newsletter-feedback error';
        return;
      }

      newsletterFeedback.textContent = '✅ Inscrição realizada com sucesso! Obrigado.';
      newsletterFeedback.className = 'newsletter-feedback success';
      newsletterForm.reset();

      setTimeout(() => {
        newsletterFeedback.textContent = '';
        newsletterFeedback.className = 'newsletter-feedback';
      }, 6000);
    });
  }

  /* ============================================================
     VLIBRAS — inicialização automática
     ============================================================ */
  window.addEventListener('load', () => {
    if (window.VLibras && typeof window.VLibras.Plugin === 'function') {
      try {
        new window.VLibras.Plugin({ rootPath: 'https://vlibras.gov.br/app' });
      } catch (e) {
        console.warn('VLibras init:', e);
      }
    }
  });

})();