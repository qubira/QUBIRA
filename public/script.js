'use strict';

/* ============================================================
   CURSOR MAGNÉTICO PERSONALIZADO
   ============================================================ */
(function initCursor() {
  if (window.matchMedia('(hover: none)').matches) return;

  const ring = document.createElement('div');
  ring.className = 'cursor-ring';
  const dot = document.createElement('div');
  dot.className = 'cursor-dot';
  document.body.append(ring, dot);

  let mx = -100, my = -100;
  let rx = -100, ry = -100;

  document.addEventListener('mousemove', (e) => {
    mx = e.clientX;
    my = e.clientY;
    dot.style.left = mx + 'px';
    dot.style.top  = my + 'px';
  });

  document.addEventListener('mousedown', () => ring.classList.add('is-clicking'));
  document.addEventListener('mouseup',   () => ring.classList.remove('is-clicking'));

  const hoverTargets = 'a, button, .tilt-card, .case-panel, .logo-item, .marquee__track span';

  document.querySelectorAll(hoverTargets).forEach(el => {
    el.addEventListener('mouseenter', () => ring.classList.add('is-hovering'));
    el.addEventListener('mouseleave', () => ring.classList.remove('is-hovering'));
  });

  (function loop() {
    rx += (mx - rx) * 0.1;
    ry += (my - ry) * 0.1;
    ring.style.left = rx + 'px';
    ring.style.top  = ry + 'px';
    requestAnimationFrame(loop);
  })();
})();

/* ============================================================
   BARRA DE PROGRESO DE SCROLL
   ============================================================ */
(function initScrollProgress() {
  const bar = document.createElement('div');
  bar.className = 'scroll-progress';
  document.body.prepend(bar);

  window.addEventListener('scroll', () => {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    bar.style.width = ((window.scrollY / max) * 100).toFixed(2) + '%';
  }, { passive: true });
})();

/* ============================================================
   RIPPLE AL HACER CLICK
   ============================================================ */
document.addEventListener('click', (e) => {
  if (e.target.closest('.chatbot-window, .fullscreen-menu, .floating-actions')) return;
  const r = document.createElement('div');
  r.className = 'click-ripple';
  r.style.left = e.clientX + 'px';
  r.style.top  = e.clientY + 'px';
  document.body.appendChild(r);
  r.addEventListener('animationend', () => r.remove());
});

/* ============================================================
   GLOW DEL FONDO SIGUE AL MOUSE
   ============================================================ */
(function initGlowTracker() {
  const glow = document.querySelector('.grid-glow');
  if (!glow) return;

  let gx = 78, gy = 16;
  let tx = 78, ty = 16;

  document.addEventListener('mousemove', (e) => {
    tx = (e.clientX / window.innerWidth)  * 100;
    ty = (e.clientY / window.innerHeight) * 100;
  }, { passive: true });

  (function loop() {
    gx += (tx - gx) * 0.05;
    gy += (ty - gy) * 0.05;
    glow.style.background = `
      radial-gradient(circle at ${gx.toFixed(1)}% ${gy.toFixed(1)}%, rgba(123,97,255,.28), transparent 28%),
      radial-gradient(circle at ${(100 - gx).toFixed(1)}% ${(100 - gy).toFixed(1)}%, rgba(119,242,200,.14), transparent 26%)
    `;
    requestAnimationFrame(loop);
  })();
})();

/* ============================================================
   SISTEMA DE PARTÍCULAS – CONSTELACIÓN
   ============================================================ */
(function initParticles() {
  const canvas = document.createElement('canvas');
  canvas.id = 'particles-canvas';
  document.body.prepend(canvas);
  const ctx = canvas.getContext('2d');

  const COUNT  = 70;
  const MAX_DIST = 130;
  let W, H;
  const particles = [];
  let mouseX = -999, mouseY = -999;

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }

  function createParticle() {
    return {
      x:  Math.random() * W,
      y:  Math.random() * H,
      vx: (Math.random() - 0.5) * 0.35,
      vy: (Math.random() - 0.5) * 0.35,
      r:  Math.random() * 1.5 + 0.5,
      a:  Math.random() * 0.45 + 0.1,
    };
  }

  function init() {
    particles.length = 0;
    for (let i = 0; i < COUNT; i++) particles.push(createParticle());
  }

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  }, { passive: true });

  function draw() {
    ctx.clearRect(0, 0, W, H);

    /* mover y rebotar */
    particles.forEach(p => {
      p.x += p.vx;
      p.y += p.vy;
      if (p.x < 0 || p.x > W) p.vx *= -1;
      if (p.y < 0 || p.y > H) p.vy *= -1;

      /* repulsión suave del mouse */
      const dx = p.x - mouseX;
      const dy = p.y - mouseY;
      const d = Math.hypot(dx, dy);
      if (d < 80) {
        const force = (80 - d) / 80 * 0.5;
        p.vx += (dx / d) * force;
        p.vy += (dy / d) * force;
      }
      /* limitar velocidad */
      const speed = Math.hypot(p.vx, p.vy);
      if (speed > 1.2) { p.vx /= speed; p.vy /= speed; }

      /* dibujar punto */
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(119,242,200,${p.a})`;
      ctx.fill();
    });

    /* dibujar conexiones */
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const pi = particles[i], pj = particles[j];
        const dx = pi.x - pj.x, dy = pi.y - pj.y;
        const d = Math.hypot(dx, dy);
        if (d < MAX_DIST) {
          const a = (1 - d / MAX_DIST) * 0.12;
          ctx.beginPath();
          ctx.moveTo(pi.x, pi.y);
          ctx.lineTo(pj.x, pj.y);
          ctx.strokeStyle = `rgba(119,242,200,${a})`;
          ctx.lineWidth = 0.6;
          ctx.stroke();
        }
      }
    }

    requestAnimationFrame(draw);
  }

  resize();
  init();
  draw();
  window.addEventListener('resize', () => { resize(); init(); });
})();

/* ============================================================
   PARALLAX DEL HERO + FLOAT ANIMADO (JS-driven)
   ============================================================ */
(function initHeroParallax() {
  const hero    = document.querySelector('.hero');
  const orb     = document.querySelector('.hero-orb');
  const cards   = [...document.querySelectorAll('.hero-card')];
  if (!hero) return;

  /* factores de parallax: positivo = misma dir. mouse, negativo = opuesta */
  const pFactors  = [0.016, -0.026, 0.022];
  /* amplitud (px) y velocidad del float de cada tarjeta */
  const fAmp      = [9,  12,  8];
  const fSpeed    = [0.7, 0.85, 0.65];
  const fPhase    = [0,  1.8,  3.4];

  let targetX = 0, targetY = 0;
  let smoothX = 0, smoothY = 0;

  hero.addEventListener('mousemove', (e) => {
    const r = hero.getBoundingClientRect();
    targetX = e.clientX - r.left  - r.width  / 2;
    targetY = e.clientY - r.top   - r.height / 2;
  }, { passive: true });

  hero.addEventListener('mouseleave', () => {
    targetX = 0;
    targetY = 0;
  });

  (function tick() {
    const t = performance.now() / 1000;

    smoothX += (targetX - smoothX) * 0.055;
    smoothY += (targetY - smoothY) * 0.055;

    cards.forEach((card, i) => {
      const f  = pFactors[i] ?? 0.016;
      const fy = Math.sin(t * fSpeed[i] + fPhase[i]) * fAmp[i];
      const px = smoothX * f;
      const py = smoothY * f + fy;
      card.style.transform = `translate(${px.toFixed(2)}px, ${py.toFixed(2)}px)`;
    });

    if (orb) {
      const orbFloat = Math.sin(t * 0.5) * 16;
      const orbScale = 1 + Math.sin(t * 0.38) * 0.03;
      orb.style.transform = `translate(${(smoothX * 0.04).toFixed(2)}px, ${(smoothY * 0.04 + orbFloat).toFixed(2)}px) scale(${orbScale.toFixed(4)})`;
    }

    requestAnimationFrame(tick);
  })();
})();

/* ============================================================
   GLOW DE TARJETAS DE SERVICIOS (sigue al mouse)
   ============================================================ */
document.querySelectorAll('.service').forEach(card => {
  card.addEventListener('mousemove', (e) => {
    const r = card.getBoundingClientRect();
    card.style.setProperty('--mx', ((e.clientX - r.left) / r.width  * 100).toFixed(1) + '%');
    card.style.setProperty('--my', ((e.clientY - r.top)  / r.height * 100).toFixed(1) + '%');
  });
});

/* ============================================================
   HEADER – ESCONDER AL SCROLL ABAJO
   ============================================================ */
const header = document.getElementById('header');
let lastScroll = 0;
window.addEventListener('scroll', () => {
  const cur = window.scrollY;
  header.classList.toggle('is-hidden', cur > 120 && cur > lastScroll);
  lastScroll = cur <= 0 ? 0 : cur;
}, { passive: true });

/* ============================================================
   MENÚ FULLSCREEN
   ============================================================ */
const openMenu        = document.getElementById('openMenu');
const closeMenuBtn    = document.getElementById('closeMenu');
const fullscreenMenu  = document.getElementById('fullscreenMenu');

function showMenu() {
  if (!fullscreenMenu) return;
  fullscreenMenu.classList.add('is-open');
  fullscreenMenu.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
}
function hideMenu() {
  if (!fullscreenMenu) return;
  fullscreenMenu.classList.remove('is-open');
  fullscreenMenu.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
}

openMenu?.addEventListener('click', showMenu);
closeMenuBtn?.addEventListener('click', hideMenu);
fullscreenMenu?.addEventListener('click', (e) => { if (e.target === fullscreenMenu) hideMenu(); });
document.addEventListener('keydown', (e) => { if (e.key === 'Escape') hideMenu(); });
document.querySelectorAll('.fullscreen-menu a').forEach(l => l.addEventListener('click', hideMenu));

/* ============================================================
   REVEAL ON SCROLL
   ============================================================ */
(function initReveal() {
  const items = document.querySelectorAll('.reveal');
  if (!items.length) return;

  const obs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
      }
    });
  }, { threshold: 0.12 });

  items.forEach(el => obs.observe(el));
})();

/* ============================================================
   ACCORDION DE CASOS
   ============================================================ */
const casePanels = document.querySelectorAll('.case-panel');
if (casePanels.length) {
  casePanels.forEach(panel => {
    panel.addEventListener('click', () => {
      casePanels.forEach(p => p.classList.remove('is-active'));
      panel.classList.add('is-active');

      /* Animar el número grande */
      const strong = panel.querySelector('.case-panel__bottom strong');
      if (strong && !strong.dataset.animated) {
        animateCounter(strong);
        strong.dataset.animated = 'true';
      }
    });
  });

  /* Activar el primero ya activo al cargar */
  const firstActive = document.querySelector('.case-panel.is-active .case-panel__bottom strong');
  if (firstActive) animateCounter(firstActive);
}

function animateCounter(el) {
  const raw    = el.textContent.trim();
  const num    = parseFloat(raw);
  const suffix = raw.replace(/[\d.]/g, '');
  if (isNaN(num)) return;

  const start = Date.now();
  const dur   = 1200;
  const from  = num * 0.2;

  (function tick() {
    const p   = Math.min((Date.now() - start) / dur, 1);
    const ease = 1 - Math.pow(1 - p, 3);
    const val  = from + (num - from) * ease;
    el.textContent = (Number.isInteger(num) ? Math.round(val) : val.toFixed(1)) + suffix;
    if (p < 1) requestAnimationFrame(tick);
  })();
}

/* ============================================================
   TYPEWRITER TERMINAL
   ============================================================ */
const typedCode = document.getElementById('typedCode');
const codeText  = `Iniciando QUBIRA.system...
Cargando product_system...
Sincronizando estrategia / diseño / ingeniería...

> Diseñamos con intención
> Construimos con precisión
> Escalamos con claridad

status:
- Envíos más rápidos
- Sistemas más robustos
- Experiencias más fluidas

> ready_to_launch = true`;

let charIndex = 0, typingTimeout;

function writeCode() {
  if (!typedCode) return;
  if (charIndex <= codeText.length) {
    typedCode.innerHTML =
      codeText.slice(0, charIndex).replace(/\n/g, '<br>') + '<span class="cursor"></span>';
    charIndex++;
    const next  = codeText[charIndex];
    const speed = next === '\n' ? 70 : next === ' ' ? 16 : 26;
    typingTimeout = setTimeout(writeCode, speed);
  } else {
    typingTimeout = setTimeout(() => { charIndex = 0; writeCode(); }, 1800);
  }
}
if (typedCode) writeCode();

/* ============================================================
   BOTONES MAGNÉTICOS
   ============================================================ */
document.querySelectorAll('.magnetic').forEach(btn => {
  btn.addEventListener('mousemove', (e) => {
    if (window.innerWidth < 768) return;
    const r = btn.getBoundingClientRect();
    const x = e.clientX - r.left - r.width  / 2;
    const y = e.clientY - r.top  - r.height / 2;
    btn.style.transform = `translate(${x * 0.1}px, ${y * 0.1}px)`;
  });
  btn.addEventListener('mouseleave', () => { btn.style.transform = ''; });
});

/* ============================================================
   TILT 3D EN TARJETAS
   ============================================================ */
document.querySelectorAll('.tilt-card').forEach(card => {
  card.addEventListener('mousemove', (e) => {
    if (window.innerWidth < 900) return;
    const r  = card.getBoundingClientRect();
    const rx = ((e.clientY - r.top)  / r.height - 0.5) * -10;
    const ry = ((e.clientX - r.left) / r.width  - 0.5) *  10;
    card.style.transform = `perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg) translateY(-10px)`;
    card.style.boxShadow = `0 24px 60px rgba(0,0,0,.24), ${-ry * 0.8}px ${rx * 0.8}px 30px rgba(119,242,200,.06)`;
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform  = '';
    card.style.boxShadow  = '';
  });
});

/* ============================================================
   LIMPIEZA
   ============================================================ */
window.addEventListener('beforeunload', () => clearTimeout(typingTimeout));

/* ============================================================
   CHATBOT QUBIRA
   ============================================================ */
function initChatbot() {
  const chatbotButton   = document.getElementById('chatbot-button');
  const chatbotWindow   = document.getElementById('chatbot-window');
  const closeChatbot    = document.getElementById('close-chatbot');
  const expandChatbot   = document.getElementById('expand-chatbot');
  const sendChatbot     = document.getElementById('send-chatbot');
  const chatbotInput    = document.getElementById('chatbot-input');
  const chatbotContent  = document.getElementById('chatbot-content');

  if (!chatbotButton || !chatbotWindow) {
    console.warn('Faltan elementos del chatbot.');
    return;
  }

  const whatsappUrl = 'https://wa.me/51924687363';

  function normalize(t) {
    return t.toLowerCase()
      .normalize('NFD').replace(/[̀-ͯ]/g, '')
      .replace(/[¿?¡!,.;:()]/g, ' ').replace(/\s+/g, ' ').trim();
  }

  function openChat()  {
    chatbotWindow.classList.add('is-open');
    chatbotWindow.setAttribute('aria-hidden', 'false');
    setTimeout(() => chatbotInput?.focus(), 120);
  }
  function closeChat() {
    chatbotWindow.classList.remove('is-open', 'is-expanded');
    chatbotWindow.setAttribute('aria-hidden', 'true');
    if (expandChatbot) { expandChatbot.textContent = '⛶'; }
  }
  function toggleExpand() {
    const expanded = chatbotWindow.classList.toggle('is-expanded');
    if (expandChatbot) {
      expandChatbot.textContent = expanded ? '↙' : '⛶';
    }
    setTimeout(() => {
      chatbotContent.scrollTop = chatbotContent.scrollHeight;
      chatbotInput?.focus();
    }, 200);
  }

  /* ── Helpers de formato HTML ── */
  function sec(icon, title, body) {
    return `<div class="br-sec"><span class="br-tag">${icon} ${title}</span>${body}</div>`;
  }
  function ol(items)  { return '<ol class="br-ol">'  + items.map(i=>`<li>${i}</li>`).join('') + '</ol>'; }
  function ul(items)  { return '<ul class="br-ul">'  + items.map(i=>`<li>${i}</li>`).join('') + '</ul>'; }
  function code(lang, snippet) {
    return `<div class="br-code"><span class="br-code-lang">${lang}</span><pre>${snippet}</pre></div>`;
  }
  function warn(txt)  { return `<div class="br-warn">⚠️ ${txt}</div>`; }
  function note(txt)  { return `<div class="br-note">💡 ${txt}</div>`; }

  /* ── addMessage mejorado (soporta HTML enriquecido) ── */
  function addMessage(text, type = 'bot', showWA = false, opts = [], isHtml = false) {
    const msg = document.createElement('div');
    msg.className = `chatbot-message ${type === 'user' ? 'user-message' : 'bot-message'}`;
    if (type !== 'user' && isHtml) {
      const wrap = document.createElement('div');
      wrap.className = 'br-body';
      wrap.innerHTML = text;
      msg.appendChild(wrap);
    } else {
      const p = document.createElement('div');
      p.textContent = text;
      msg.appendChild(p);
    }
    if (showWA) {
      const a = document.createElement('a');
      a.href = whatsappUrl; a.target = '_blank';
      a.className = 'chatbot-whatsapp-link';
      a.innerHTML = '💬 Hablar por WhatsApp';
      msg.appendChild(a);
    }
    opts.forEach(opt => {
      const b = document.createElement('button');
      b.type = 'button'; b.className = 'chatbot-option';
      b.textContent = opt.label;
      b.addEventListener('click', () => handleMsg(opt.question));
      msg.appendChild(b);
    });
    chatbotContent.appendChild(msg);
    chatbotContent.scrollTop = chatbotContent.scrollHeight;
  }

  /* ── Opciones rápidas principales ── */
  function mainOpts() {
    return [
      { label:'🛠 Servicios',          question:'Qué servicios ofrecen' },
      { label:'🔒 Seguridad',          question:'Seguridad informática qué hacen' },
      { label:'📋 Matriz de riesgos',  question:'Cómo hacer una matriz de riesgos' },
      { label:'💻 Ejemplo de código',  question:'Ejemplo de código Node.js API REST' },
      { label:'💰 Precios',            question:'Cuáles son sus precios' },
      { label:'📞 Contacto',           question:'Cómo puedo contactarlos' },
    ];
  }
  function techOpts() {
    return [
      { label:'Seguridad informática',    question:'Cómo proteger mi sistema' },
      { label:'Backup automatizado',      question:'Cómo hacer backup automatizado' },
      { label:'Matriz de riesgos',        question:'Cómo hacer una matriz de riesgos' },
      { label:'Plan de continuidad',      question:'Qué es un plan de continuidad' },
      { label:'Control de accesos',       question:'Cómo implementar control de accesos' },
      { label:'Integración periféricos',  question:'Cómo integrar periféricos con software' },
    ];
  }

  /* ════════════════════════════════════════════════════════════
     MOTOR DE RESPUESTAS — Ingeniero Virtual QUBIRA
     ════════════════════════════════════════════════════════════ */
  function getResponse(question) {
    const q = normalize(question);

    /* ── SALUDOS ── */
    if (/^(hola|buenos dias|buenos|buenas|buenas tardes|buenas noches|saludos|hey|hi|holi)/.test(q))
      return { html:true, text:
        sec('👋','¡Bienvenido a QUBIRA!',
          '<p>Soy tu ingeniero virtual. Puedo ayudarte con:</p>' +
          ul(['Desarrollo de software (web, móvil, escritorio)','Seguridad informática y control de accesos',
              'Consultoría técnica y matrices de riesgos','Scripts de automatización y auditoría',
              'Integración de periféricos y APIs','Documentación y plan de continuidad'])
        ), options: mainOpts() };

    /* ── QUIÉNES SON / ABOUT ── */
    if (/qubira|quienes son|que es qubira|acerca de/.test(q))
      return { html:true, text:
        sec('🏢','Sobre QUBIRA',
          '<p><strong>QUBIRA</strong> es una empresa de desarrollo de software, consultoría tecnológica y seguridad informática. Construimos productos digitales modernos, escalables y seguros.</p>' +
          sec('⚡','Capacidades principales',
            ul(['Desarrollo web, móvil y escritorio','Seguridad informática defensiva',
                'Consultoría, diagnóstico y matrices de riesgos','Automatización de procesos e IA aplicada',
                'Integración de periféricos y dispositivos','Documentación técnica y planes de continuidad']))
        ), options: mainOpts() };

    /* ── SERVICIOS GENERALES ── */
    if (/servicio|ofrec|hacen|haces|ayudar|ayuda|que puedes|capacidades/.test(q))
      return { html:true, text:
        sec('🛠','Servicios QUBIRA',
          ul(['<strong>Desarrollo de software</strong> — web, móvil, desktop, APIs, dashboards',
              '<strong>Mantenimiento</strong> — corrección de errores, refactorización, optimización',
              '<strong>Consultoría</strong> — diagnóstico, arquitectura, análisis de riesgos',
              '<strong>Seguridad informática</strong> — control de accesos, auditorías, respuesta a incidentes',
              '<strong>Automatización e IA</strong> — flujos, bots, integraciones, machine learning',
              '<strong>Soporte técnico</strong> — integración de periféricos, drivers, SDKs'])
        ), options:[
          { label:'💻 Desarrollo web',    question:'Qué incluye el desarrollo web' },
          { label:'📱 App móvil',         question:'Desarrollo de aplicación móvil' },
          { label:'🔒 Seguridad',         question:'Seguridad informática qué hacen' },
          { label:'🤖 Automatización',    question:'Cómo automatizar mis procesos' },
        ]};

    /* ── DESARROLLO WEB ── */
    if (/pagina web|landing|sitio web|desarrollo web|frontend|backend|full.?stack/.test(q))
      return { html:true, text:
        sec('🌐','Desarrollo Web',
          '<p>Construimos soluciones web desde landing pages hasta sistemas empresariales complejos.</p>' +
          sec('📦','Stack tecnológico recomendado',
            ul(['<strong>Frontend:</strong> React, Vue, HTML5/CSS3, Tailwind',
                '<strong>Backend:</strong> Node.js + Express, Python + FastAPI, Laravel',
                '<strong>Base de datos:</strong> PostgreSQL, MySQL, MongoDB',
                '<strong>Deploy:</strong> Render, Vercel, AWS, VPS'])) +
          sec('🔢','Proceso de desarrollo',
            ol(['Levantamiento de requerimientos y alcance','Diseño UX/UI y prototipo','Desarrollo iterativo por sprints',
                'Pruebas de calidad (QA) y seguridad','Deploy y entrega con documentación'])) +
          code('javascript',
            `// Ejemplo: API REST en Node.js + Express\nconst express = require('express');\nconst app = express();\n\napp.get('/api/usuarios', async (req, res) => {\n  const usuarios = await db.query('SELECT * FROM usuarios');\n  res.json({ ok: true, data: usuarios.rows });\n});\n\napp.listen(3000);`)
        ), showWhatsapp:true };

    /* ── DESARROLLO MÓVIL ── */
    if (/app|movil|mobile|aplicacion movil|react native|flutter/.test(q))
      return { html:true, text:
        sec('📱','Desarrollo Móvil',
          sec('🔧','Tecnologías disponibles',
            ul(['<strong>React Native</strong> — una base de código para iOS y Android',
                '<strong>Flutter</strong> — alto rendimiento, UI nativa',
                '<strong>Kotlin / Swift</strong> — apps nativas puras'])) +
          sec('📋','Tipos de apps que desarrollamos',
            ul(['Apps de gestión interna (inventario, pedidos, reportes)','E-commerce y catálogos',
                'Apps de servicios y reservas','Dashboards ejecutivos móviles','Apps con escáner, GPS, cámara'])) +
          note('Para cotizar una app necesitamos: plataforma objetivo (iOS/Android/ambas), funcionalidades principales, si requiere backend propio y fecha estimada de lanzamiento.')
        ), showWhatsapp:true };

    /* ── SISTEMAS / DASHBOARD ── */
    if (/sistema|dashboard|panel|administrativo|plataforma|erp|crm/.test(q))
      return { html:true, text:
        sec('🖥','Sistemas a medida',
          '<p>Diseñamos e implementamos sistemas administrativos, ERP, CRM y plataformas internas adaptadas a tus procesos.</p>' +
          sec('✅','Módulos comunes que implementamos',
            ul(['Gestión de usuarios y roles (CEO, Admin, Viewer)','Reportes y dashboards con gráficos',
                'Control de inventario y stock','Facturación y pagos','Seguimiento de proyectos y tareas',
                'Integración con APIs externas (WhatsApp, correo, pasarelas de pago)'])) +
          sec('🔢','Pasos para iniciar',
            ol(['Reunión de levantamiento de requerimientos','Prototipo rápido (wireframes)','Desarrollo módulo por módulo',
                'Pruebas con usuarios reales','Capacitación y entrega']))
        ), showWhatsapp:true };

    /* ── SEGURIDAD INFORMÁTICA ── */
    if (/seguridad|ciberseguridad|hackeo|vulnerabilidad|proteger|pentest|amenaza/.test(q))
      return { html:true, text:
        sec('🔒','Seguridad Informática',
          '<p>QUBIRA ofrece asesoría defensiva y preventiva en seguridad. Nunca instruimos técnicas de ataque no autorizadas.</p>' +
          sec('🛡','Servicios de seguridad',
            ul(['Auditoría de código y vulnerabilidades','Control de accesos y gestión de roles',
                'Implementación de autenticación multifactor (MFA)','Plan de respuesta a incidentes',
                'Hardening de servidores y bases de datos','Revisión de políticas de contraseñas'])) +
          sec('🔢','Checklist básico de seguridad',
            ol(['Usar HTTPS en todos los endpoints','Hashear contraseñas con bcrypt (factor ≥ 12)',
                'Validar y sanitizar toda entrada del usuario','Implementar JWT con expiración corta',
                'Aplicar rate limiting en endpoints críticos','Mantener logs de acceso y auditoría'])) +
          code('javascript',
            `// Hashear contraseña con bcrypt (Node.js)\nconst bcrypt = require('bcryptjs');\n\n// Guardar:\nconst hash = await bcrypt.hash(password, 12);\n\n// Verificar:\nconst match = await bcrypt.compare(inputPassword, hash);\nif (!match) throw new Error('Credenciales incorrectas');`)
        ), options: techOpts() };

    /* ── CONTROL DE ACCESOS ── */
    if (/control de acceso|accesos|roles|permisos|autenticacion|jwt|login|password/.test(q))
      return { html:true, text:
        sec('🔑','Control de Accesos',
          sec('📋','Resumen del sistema recomendado',
            '<p>Un sistema de control de accesos seguro debe combinar autenticación robusta, roles definidos y auditoría de acciones.</p>') +
          sec('🔢','Pasos para implementar',
            ol(['Definir roles: CEO, Admin, Developer, Viewer, etc.','Asignar nivel de acceso numérico por rol (ej. CEO=100, Admin=80)',
                'Autenticar con JWT firmado y con expiración','Almacenar sesiones en base de datos para revocación',
                'Auditar cada acción sensible en tabla de auditoría','Revisar accesos mensualmente'])) +
          code('javascript',
            `// Middleware de autenticación JWT (Express)\nconst jwt = require('jsonwebtoken');\n\nfunction requireAuth(req, res, next) {\n  const token = req.headers.authorization?.split(' ')[1];\n  if (!token) return res.status(401).json({ error: 'Token requerido' });\n  try {\n    req.user = jwt.verify(token, process.env.JWT_SECRET);\n    next();\n  } catch {\n    res.status(401).json({ error: 'Token inválido' });\n  }\n}`) +
          warn('Nunca almacenar contraseñas en texto plano. Usar siempre bcrypt o argon2.')
        ), options: techOpts() };

    /* ── BACKUP / RESPALDO ── */
    if (/backup|respaldo|copia de seguridad|recuperacion|disaster recovery/.test(q))
      return { html:true, text:
        sec('💾','Estrategia de Backups',
          sec('📋','Regla 3-2-1 recomendada',
            ul(['<strong>3</strong> copias de los datos','<strong>2</strong> soportes diferentes (local + nube)','<strong>1</strong> copia offsite o en cloud'])) +
          sec('🔢','Pasos para implementar backup automatizado',
            ol(['Identificar datos críticos: base de datos, archivos, configuraciones','Definir frecuencia: diario, semanal, mensual',
                'Configurar script de respaldo automático','Verificar integridad periódicamente restaurando una copia de prueba',
                'Almacenar en S3, Google Drive o servidor secundario','Documentar procedimiento de restauración'])) +
          code('bash',
            `#!/bin/bash\n# Script de backup PostgreSQL automático\nDATE=$(date +%Y%m%d_%H%M)\nDB_NAME="mi_base"\nBACKUP_DIR="/backups"\n\npg_dump $DB_NAME | gzip > $BACKUP_DIR/backup_$DATE.sql.gz\necho "Backup completado: backup_$DATE.sql.gz"\n\n# Eliminar backups de más de 30 días\nfind $BACKUP_DIR -name "*.sql.gz" -mtime +30 -delete`)
        ), showWhatsapp:true };

    /* ── RESPUESTA A INCIDENTES ── */
    if (/incidente|incidentes|brecha|fuga de datos|ataque|ransomware|virus|malware/.test(q))
      return { html:true, text:
        sec('🚨','Respuesta a Incidentes de Seguridad',
          warn('Si estás experimentando un incidente activo, contacta a nuestro equipo de inmediato.') +
          sec('🔢','Protocolo de respuesta (PICERL)',
            ol(['<strong>Preparación:</strong> tener el plan documentado antes del incidente',
                '<strong>Identificación:</strong> detectar y confirmar el incidente',
                '<strong>Contención:</strong> aislar sistemas afectados (desconectar red si es necesario)',
                '<strong>Erradicación:</strong> eliminar malware, cerrar accesos no autorizados',
                '<strong>Recuperación:</strong> restaurar desde backup verificado',
                '<strong>Lecciones aprendidas:</strong> documentar, mejorar controles'])) +
          note('Se recomienda elaborar un Plan de Respuesta a Incidentes antes de que ocurran. QUBIRA puede ayudarte a construirlo.')
        ), showWhatsapp:true };

    /* ── MATRIZ DE RIESGOS ── */
    if (/matriz de riesgo|riesgo|riesgos|analisis de riesgo|gestion de riesgo/.test(q))
      return { html:true, text:
        sec('📊','Matriz de Riesgos',
          '<p>Una matriz de riesgos identifica, evalúa y prioriza amenazas para tomar decisiones preventivas.</p>' +
          sec('🔢','Cómo construirla',
            ol(['Identificar activos críticos (datos, sistemas, personas)','Listar amenazas por activo',
                'Evaluar probabilidad (1=Baja, 2=Media, 3=Alta)','Evaluar impacto (1=Bajo, 2=Medio, 3=Alto)',
                'Calcular nivel de riesgo: Probabilidad × Impacto','Definir controles para riesgos altos (≥6)'])) +
          `<div class="br-table-wrap"><table class="br-table">
            <thead><tr><th>Riesgo</th><th>Prob.</th><th>Impacto</th><th>Nivel</th><th>Control</th></tr></thead>
            <tbody>
              <tr><td>Acceso no autorizado</td><td>2</td><td>3</td><td class="risk-high">6</td><td>MFA + roles</td></tr>
              <tr><td>Pérdida de datos</td><td>1</td><td>3</td><td class="risk-med">3</td><td>Backups diarios</td></tr>
              <tr><td>Fallo del servidor</td><td>2</td><td>2</td><td class="risk-med">4</td><td>Alta disponibilidad</td></tr>
              <tr><td>Error de software</td><td>3</td><td>1</td><td class="risk-med">3</td><td>QA + pruebas</td></tr>
            </tbody></table></div>` +
          note('Podemos elaborar la matriz de riesgos completa para tu organización con activos reales.')
        ), showWhatsapp:true };

    /* ── PLAN DE CONTINUIDAD ── */
    if (/continuidad|plan de continuidad|bcp|contingencia|recuperacion del negocio/.test(q))
      return { html:true, text:
        sec('📑','Plan de Continuidad del Negocio (BCP)',
          '<p>El BCP garantiza que la organización siga operando durante y después de una interrupción grave.</p>' +
          sec('📋','Componentes del plan',
            ul(['<strong>Análisis de Impacto (BIA):</strong> qué procesos son críticos y cuánto tiempo pueden estar caídos',
                '<strong>Estrategias de recuperación:</strong> sistemas alternativos, personal de respaldo',
                '<strong>Procedimientos de activación:</strong> quién decide, cuándo y cómo',
                '<strong>Comunicación:</strong> clientes, proveedores, equipo interno',
                '<strong>Pruebas periódicas:</strong> simulacros cada 6-12 meses'])) +
          sec('🔢','Pasos para elaborarlo',
            ol(['Identificar procesos críticos del negocio','Determinar RTO (tiempo máximo de recuperación) y RPO (pérdida máxima de datos aceptable)',
                'Asignar responsables por área','Documentar procedimientos de recuperación','Realizar simulacro y ajustar el plan']))
        ), showWhatsapp:true };

    /* ── AUDITORÍA ── */
    if (/auditoria|audit|registro|log|monitoreo|compliance|control interno/.test(q))
      return { html:true, text:
        sec('🔍','Auditoría y Monitoreo',
          sec('🔢','Checklist de auditoría básica',
            ol(['Revisar logs de acceso de los últimos 30 días','Verificar usuarios activos vs. empleados actuales',
                'Comprobar contraseñas de más de 90 días','Revisar permisos de administrador',
                'Auditar backups (¿se realizaron? ¿son restaurables?)','Revisar parches y actualizaciones pendientes',
                'Verificar certificados SSL vigentes'])) +
          code('bash',
            `# Script básico de auditoría Linux\necho "=== Usuarios con acceso SSH ==="\ncat /etc/passwd | grep -v nologin | grep -v false\n\necho "=== Últimos 20 accesos al sistema ==="\nlast -n 20\n\necho "=== Puertos abiertos ==="\nss -tlnp\n\necho "=== Procesos con privilegios de root ==="\nps aux | grep root`) +
          note('QUBIRA puede realizar auditorías internas periódicas y elaborar el informe de hallazgos con recomendaciones.')
        ), showWhatsapp:true };

    /* ── OOP / PROGRAMACIÓN ── */
    if (/programacion orientada a objetos|poo|oop|clases|objetos|herencia|polimorfismo|encapsulamiento/.test(q))
      return { html:true, text:
        sec('💻','Programación Orientada a Objetos (POO)',
          sec('📋','Los 4 pilares de la POO',
            ul(['<strong>Encapsulamiento:</strong> ocultar datos internos, exponer solo lo necesario',
                '<strong>Herencia:</strong> reutilizar comportamiento de clases padre',
                '<strong>Polimorfismo:</strong> un método, múltiples comportamientos',
                '<strong>Abstracción:</strong> modelar solo lo relevante del mundo real'])) +
          code('javascript',
            `// Ejemplo POO en JavaScript\nclass Animal {\n  constructor(nombre) {\n    this.nombre = nombre; // encapsulado\n  }\n  hablar() { return \`\${this.nombre} hace un sonido\`; }\n}\n\nclass Perro extends Animal { // herencia\n  hablar() { return \`\${this.nombre} ladra\`; } // polimorfismo\n}\n\nconst p = new Perro('Rex');\nconsole.log(p.hablar()); // Rex ladra`) +
          code('python',
            `# Ejemplo POO en Python\nclass Vehiculo:\n    def __init__(self, marca):\n        self._marca = marca  # _ = convención protegido\n    def describir(self):\n        return f"Vehículo {self._marca}"\n\nclass Auto(Vehiculo):\n    def describir(self):\n        return f"Auto {self._marca}"  # polimorfismo\n\nauto = Auto("Toyota")\nprint(auto.describir())  # Auto Toyota`)
        ), options:[
          { label:'Más ejemplos de código',      question:'Ejemplo de código Node.js API REST' },
          { label:'Integración de periféricos',  question:'Cómo integrar periféricos con software' },
        ]};

    /* ── INTEGRACIÓN DE PERIFÉRICOS ── */
    if (/periferico|perifericos|usb|serial|bluetooth|sensor|impresora|escaner|lector|dispositivo|driver|sdk/.test(q))
      return { html:true, text:
        sec('🔌','Integración de Periféricos',
          '<p>Conectamos software con hardware mediante drivers, SDKs y protocolos de comunicación estándar.</p>' +
          sec('🔧','Protocolos soportados',
            ul(['<strong>USB HID:</strong> teclados, lectores de código, gamepads','<strong>Serial (RS232/RS485):</strong> básculas, impresoras, sensores industriales',
                '<strong>Bluetooth:</strong> dispositivos móviles, wearables','<strong>TCP/IP:</strong> impresoras de red, cámaras IP',
                '<strong>API REST:</strong> integraciones con servicios en la nube'])) +
          code('javascript',
            `// Leer puerto serial en Node.js (SerialPort)\nconst { SerialPort } = require('serialport');\nconst { ReadlineParser } = require('@serialport/parser-readline');\n\nconst port = new SerialPort({ path: 'COM3', baudRate: 9600 });\nconst parser = port.pipe(new ReadlineParser({ delimiter: '\\r\\n' }));\n\nparser.on('data', (data) => {\n  console.log('Recibido:', data); // ej: peso de balanza\n});`) +
          note('Indica el dispositivo específico (marca, modelo, protocolo) para darte un ejemplo más preciso.')
        ), showWhatsapp:true };

    /* ── EJEMPLO API REST ── */
    if (/ejemplo.*api|api rest|crear api|endpoint|express|node.*api/.test(q))
      return { html:true, text:
        sec('🔧','Ejemplo: API REST con Node.js + Express',
          code('javascript',
            `// server.js — API REST básica\nconst express = require('express');\nconst app = express();\napp.use(express.json());\n\n// GET — listar registros\napp.get('/api/productos', async (req, res) => {\n  const { rows } = await db.query('SELECT * FROM productos');\n  res.json({ ok: true, data: rows });\n});\n\n// POST — crear registro\napp.post('/api/productos', async (req, res) => {\n  const { nombre, precio } = req.body;\n  if (!nombre || !precio)\n    return res.status(400).json({ ok: false, error: 'Faltan campos' });\n  const { rows } = await db.query(\n    'INSERT INTO productos(nombre,precio) VALUES($1,$2) RETURNING *',\n    [nombre, precio]\n  );\n  res.status(201).json({ ok: true, data: rows[0] });\n});\n\napp.listen(3000, () => console.log('API corriendo en :3000'));`) +
          sec('🔢','Buenas prácticas en APIs',
            ol(['Validar y sanitizar todos los inputs','Usar códigos HTTP correctos (200, 201, 400, 401, 404, 500)',
                'Proteger endpoints sensibles con JWT','Implementar rate limiting','Documentar con Swagger o Postman',
                'Versionar la API: /api/v1/...']))
        ), options:[
          { label:'Control de accesos JWT', question:'Cómo implementar control de accesos' },
          { label:'Seguridad en APIs',       question:'Cómo proteger mi sistema' },
        ]};

    /* ── AUTOMATIZACIÓN / IA ── */
    if (/automatizacion|automatizar|ia|inteligencia artificial|bot|rpa|workflow|flujo/.test(q))
      return { html:true, text:
        sec('🤖','Automatización e IA Aplicada',
          sec('⚡','Qué podemos automatizar',
            ul(['Envío de correos y notificaciones automáticas','Generación de reportes en PDF/Excel',
                'Sincronización entre sistemas (ERP, CRM, e-commerce)','Chatbots con respuestas inteligentes',
                'Procesamiento y clasificación de documentos con IA','Monitoreo de servidores y alertas'])) +
          code('python',
            `# Ejemplo: envío automático de reporte por correo\nimport smtplib, schedule, time\nfrom email.mime.text import MIMEText\n\ndef enviar_reporte():\n    msg = MIMEText("Reporte diario generado a las " + time.strftime("%H:%M"))\n    msg['Subject'] = 'Reporte Automático'\n    msg['From'] = 'sistema@empresa.com'\n    msg['To'] = 'gerencia@empresa.com'\n    with smtplib.SMTP('smtp.gmail.com', 587) as s:\n        s.starttls()\n        s.login('user', 'pass')\n        s.send_message(msg)\n\nschedule.every().day.at("08:00").do(enviar_reporte)\nwhile True:\n    schedule.run_pending()\n    time.sleep(60)`) +
          note('Podemos implementar una prueba de concepto de automatización en 1-2 semanas.')
        ), showWhatsapp:true };

    /* ── DOCUMENTACIÓN INTERNA ── */
    if (/documentacion|politica|politicas|inventario|activos|procedimiento|manual/.test(q))
      return { html:true, text:
        sec('📄','Documentación Técnica Interna',
          '<p>QUBIRA puede elaborar o revisar la documentación técnica de tu organización.</p>' +
          sec('📋','Documentos que podemos generar',
            ul(['<strong>Política de seguridad de la información</strong>','<strong>Inventario de activos</strong> (laptops, correos, sistemas, accesos)',
                '<strong>Matriz de riesgos</strong> con controles','<strong>Procedimiento de respuesta a incidentes</strong>',
                '<strong>Plan básico de continuidad del negocio (BCP)</strong>','<strong>Registro de proveedores y acuerdos de confidencialidad</strong>',
                '<strong>Evidencias de capacitación interna</strong>'])) +
          note('Para obtener estos documentos personalizados, necesitamos información de tu organización: tamaño, sector, sistemas actuales y procesos críticos.')
        ), showWhatsapp:true };

    /* ── MANTENIMIENTO DE SOFTWARE ── */
    if (/mantenimiento|bugs|errores|optimizar|rendimiento|lento|refactori|actualizar/.test(q))
      return { html:true, text:
        sec('🔧','Mantenimiento de Software',
          sec('🔢','Tipos de mantenimiento',
            ol(['<strong>Correctivo:</strong> corregir bugs y errores reportados','<strong>Preventivo:</strong> actualizar librerías y parchar vulnerabilidades',
                '<strong>Perfectivo:</strong> optimizar rendimiento, refactorizar código','<strong>Adaptativo:</strong> ajustar a nuevos entornos o requerimientos'])) +
          sec('⚡','Script de análisis de rendimiento (Node.js)',
            code('javascript',
              `// Medir tiempo de ejecución de funciones\nconst { performance } = require('perf_hooks');\n\nfunction medirTiempo(nombre, fn) {\n  const inicio = performance.now();\n  const resultado = fn();\n  const fin = performance.now();\n  console.log(\`[\${nombre}] \${(fin - inicio).toFixed(2)}ms\`);\n  return resultado;\n}\n\n// Uso:\nmedirTiempo('consulta-db', () => db.query('SELECT ...'));`)) +
          note('Se recomienda evaluar el estado actual del software antes de planificar el mantenimiento. QUBIRA ofrece diagnósticos sin costo.')
        ), showWhatsapp:true };

    /* ── COTIZACIÓN / PRECIOS ── */
    if (/precio|costo|cuanto|cotiz|presupuesto|tarifa/.test(q))
      return { html:true, text:
        sec('💰','Cotizaciones QUBIRA',
          '<p>Los precios dependen del alcance, complejidad, tecnologías y tiempo estimado.</p>' +
          sec('📋','Información necesaria para cotizar',
            ul(['Tipo de proyecto (web, móvil, sistema, consultoría)','Funcionalidades principales requeridas',
                '¿Tienes diseño o logo? ¿Referencias visuales?','Fecha estimada de entrega','Número de usuarios y volumen de datos esperado',
                'Integraciones externas necesarias (pagos, correo, WhatsApp)'])) +
          note('Para proyectos complejos recomendamos una reunión de levantamiento de requerimientos antes de cotizar.')
        ), showWhatsapp:true };

    /* ── PROCESO / MÉTODO ── */
    if (/metodo|trabajan|proceso|desarrollan|estrategia|como funciona|metodologia/.test(q))
      return { html:true, text:
        sec('⚙️','Metodología QUBIRA',
          sec('🔢','Nuestro proceso',
            ol(['<strong>Descubrimiento:</strong> entendemos el negocio, objetivo y usuarios','<strong>Planificación:</strong> alcance, sprints, tecnologías y equipo',
                '<strong>Diseño UX/UI:</strong> wireframes, prototipo y validación','<strong>Desarrollo iterativo:</strong> entregas por sprints de 2 semanas',
                '<strong>QA y testing:</strong> pruebas funcionales, de seguridad y rendimiento','<strong>Entrega:</strong> deploy, documentación y capacitación',
                '<strong>Mantenimiento:</strong> soporte post-lanzamiento'])) +
          note('Trabajamos como extensión de tu equipo. Comunicación diaria por Slack o WhatsApp.')
        ), options:[
          { label:'¿Cuánto demora?',   question:'Cuánto demora un proyecto' },
          { label:'¿Cómo iniciamos?',  question:'Cómo iniciamos un proyecto' },
        ]};

    /* ── TIEMPOS ── */
    if (/demora|tiempo|plazo|duracion|cuanto tarda|semanas|meses/.test(q))
      return { html:true, text:
        sec('⏱','Tiempos de desarrollo estimados',
          `<div class="br-table-wrap"><table class="br-table">
            <thead><tr><th>Tipo de proyecto</th><th>Tiempo estimado</th></tr></thead>
            <tbody>
              <tr><td>Landing page</td><td>1–2 semanas</td></tr>
              <tr><td>Sitio web corporativo</td><td>2–4 semanas</td></tr>
              <tr><td>Sistema administrativo básico</td><td>4–8 semanas</td></tr>
              <tr><td>App móvil (MVP)</td><td>6–12 semanas</td></tr>
              <tr><td>Plataforma compleja / ERP</td><td>3–6 meses</td></tr>
              <tr><td>Consultoría / Auditoría</td><td>1–3 semanas</td></tr>
            </tbody></table></div>` +
          note('Estos son estimados. El tiempo final depende del alcance detallado y recursos disponibles.')
        ), showWhatsapp:true };

    /* ── CÓMO INICIAR ── */
    if (/iniciar|empezar|comenzar|contratar|primer paso/.test(q))
      return { html:true, text:
        sec('🚀','¿Cómo iniciamos?',
          sec('🔢','Pasos para arrancar un proyecto con QUBIRA',
            ol(['Escríbenos por WhatsApp o correo con una descripción breve de tu idea','Agendamos una reunión de discovery (30-60 min, sin costo)',
                'Presentamos propuesta técnica y económica','Definimos alcance, fechas y equipo asignado',
                'Firmamos acuerdo y arrancamos el primer sprint'])) +
          note('Dependerá del alcance técnico y requisitos específicos, pero podemos tener una propuesta en 48 horas.')
        ), showWhatsapp:true };

    /* ── CONTACTO ── */
    if (/contacto|contactar|whatsapp|llamada|hablar|correo|email/.test(q))
      return { html:true, text:
        sec('📞','Contacta con QUBIRA',
          ul(['<strong>WhatsApp:</strong> +51 924 687 363','<strong>Correo:</strong> qubirasac@gmail.com',
              '<strong>Horario:</strong> Lunes a Viernes, 9am – 7pm (PET)'])) +
        note('Para incidentes de seguridad activos, pérdida de datos o auditorías urgentes, escríbenos de inmediato por WhatsApp.')
      , showWhatsapp:true };

    /* ── PROYECTOS / CASOS ── */
    if (/proyecto|casos|portafolio|trabajo|cliente|referencia/.test(q))
      return { html:true, text:
        sec('🏆','Casos de éxito QUBIRA',
          ul(['<strong>The Twenties:</strong> plataforma de ventas con 3× de crecimiento en ingresos',
              '<strong>A&M Exportaciones:</strong> ecosistema digital implementado al 100%',
              '<strong>SVIM-OSIPTEL:</strong> plataforma móvil con 40% más velocidad de desarrollo',
              '<strong>How We Feel:</strong> cobertura QA 3× con menos pruebas manuales'])) +
        note('Podemos mostrarte casos similares a tu industria en la reunión de discovery.')
      , options:[
        { label:'Ver metodología',  question:'Cómo trabajan' },
        { label:'Iniciar proyecto', question:'Cómo iniciamos un proyecto' },
      ]};

    /* ── FALLBACK GENERAL ── */
    return { html:true, text:
      sec('🤔','No encontré respuesta exacta',
        '<p>Puedo ayudarte con consultas técnicas detalladas. Elige un tema o escríbeme una pregunta más específica:</p>' +
        ul(['Desarrollo web / móvil / sistemas','Seguridad, control de accesos, auditoría',
            'Matrices de riesgo, documentación interna','Scripts de automatización o backup',
            'Ejemplos de código en cualquier lenguaje','Plan de continuidad o respuesta a incidentes'])
      ), showWhatsapp:true, options: mainOpts() };
  }

  /* ── handleMsg con typing delay proporcional ── */
  function handleMsg(text) {
    if (!text?.trim()) return;
    addMessage(text, 'user');
    if (chatbotInput) chatbotInput.value = '';
    const typing = document.createElement('div');
    typing.className = 'chatbot-typing';
    typing.id = 'qbt-typing';
    typing.innerHTML = '<span></span><span></span><span></span>';
    chatbotContent.appendChild(typing);
    chatbotContent.scrollTop = chatbotContent.scrollHeight;
    const delay = Math.min(400 + text.length * 12, 1800);
    setTimeout(() => {
      document.getElementById('qbt-typing')?.remove();
      const res = getResponse(text);
      addMessage(res.text, 'bot', res.showWhatsapp, res.options, res.html || false);
    }, delay);
  }
  function sendMessage() { handleMsg(chatbotInput?.value?.trim()); }

  chatbotButton.addEventListener('click',  openChat);
  closeChatbot?.addEventListener('click',  closeChat);
  expandChatbot?.addEventListener('click', toggleExpand);
  sendChatbot?.addEventListener('click',   sendMessage);
  chatbotInput?.addEventListener('keydown', (e) => { if (e.key === 'Enter') sendMessage(); });
}

initChatbot();
