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

  function addMessage(text, type = 'bot', showWA = false, opts = []) {
    const msg = document.createElement('div');
    msg.className = `chatbot-message ${type === 'user' ? 'user-message' : 'bot-message'}`;
    const p = document.createElement('div');
    p.textContent = text;
    msg.appendChild(p);
    if (showWA) {
      const a = document.createElement('a');
      a.href = whatsappUrl; a.target = '_blank';
      a.className = 'chatbot-whatsapp-link';
      a.textContent = 'Hablar por WhatsApp';
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

  function mainOpts() {
    return [
      { label:'Servicios',       question:'Qué servicios ofrecen' },
      { label:'Precios',         question:'Cuáles son sus precios' },
      { label:'Proyectos',       question:'Qué proyectos han realizado' },
      { label:'Método de trabajo',question:'Cómo trabajan' },
      { label:'Contacto',        question:'Cómo puedo contactarlos' },
    ];
  }

  function getResponse(question) {
    const q = normalize(question);
    if (/hola|buenos|buenas|saludos|hey/.test(q))
      return { text:'¡Hola! Soy el asistente de QUBIRA. Puedo orientarte sobre servicios, precios, proyectos, metodología y contacto.', options:mainOpts() };
    if (/servicio|ofrec|hacen|haces|ayudar|ayuda|que puedes/.test(q))
      return { text:'En QUBIRA ofrecemos desarrollo web y móvil, diseño UX/UI, automatización, QA, datos e IA aplicada.', options:[
        { label:'Quiero una página web',   question:'Quiero una página web' },
        { label:'Quiero un sistema',       question:'Quiero un sistema' },
        { label:'Quiero automatizar',      question:'Quiero automatizar procesos' },
        { label:'Quiero una app móvil',    question:'Quiero una app móvil' },
      ]};
    if (/precio|costo|cuanto|cotiz|presupuesto/.test(q))
      return { text:'Los precios dependen del alcance, funcionalidades y complejidad. Para una cotización real, escríbenos por WhatsApp.', showWhatsapp:true, options:[
        { label:'Quiero cotizar mi proyecto', question:'Quiero cotizar mi proyecto' },
        { label:'Qué datos necesitan',        question:'Qué datos necesitan para cotizar' },
      ]};
    if (/datos necesitan|cotizar mi proyecto/.test(q))
      return { text:'Para cotizar necesitamos: qué deseas construir, funcionalidades, si tienes diseño, fecha estimada y referencias visuales.', showWhatsapp:true };
    if (/pagina web|landing|sitio web/.test(q))
      return { text:'Creamos páginas web corporativas, landing pages, portales, tiendas, dashboards y sistemas a medida.', showWhatsapp:true };
    if (/sistema|dashboard|panel|administrativo|plataforma/.test(q))
      return { text:'Desarrollamos paneles de control, dashboards, gestión de usuarios, reportes y flujos operativos personalizados.', showWhatsapp:true };
    if (/app|movil|mobile|aplicacion/.test(q))
      return { text:'Sí, desarrollamos apps móviles para servicios, ventas, operaciones internas, reservas y productos digitales.', showWhatsapp:true };
    if (/automatizacion|automatizar|ia|inteligencia artificial|procesos/.test(q))
      return { text:'Podemos automatizar tareas repetitivas, conectar formularios, generar reportes, crear flujos con IA aplicada.', showWhatsapp:true };
    if (/proyecto|casos|portafolio|trabajos|clientes/.test(q))
      return { text:'En la sección de casos puedes ver proyectos con impacto real: plataformas, automatización y productos digitales.', options:[
        { label:'Ver método',            question:'Cómo trabajan' },
        { label:'Contactar WhatsApp',    question:'Quiero contactar por WhatsApp' },
      ]};
    if (/metodo|trabajan|proceso|desarrollan|estrategia/.test(q))
      return { text:'Entendemos el objetivo, definimos alcance, diseñamos la experiencia, desarrollamos por etapas y validamos calidad.', options:[
        { label:'Cuánto demora',         question:'Cuánto demora un proyecto' },
        { label:'Cómo iniciamos',        question:'Cómo iniciamos un proyecto' },
      ]};
    if (/demora|tiempo|plazo|duracion/.test(q))
      return { text:'Depende del alcance. Una landing puede ser rápida; un sistema complejo necesita evaluación previa.', showWhatsapp:true };
    if (/iniciar|empezar|comenzar|contratar/.test(q))
      return { text:'Cuéntanos tu idea o problema, revisamos alcance, funcionalidades, tiempos y presupuesto estimado.', showWhatsapp:true };
    if (/contacto|contactar|whatsapp|llamada|hablar/.test(q))
      return { text:'Puedes comunicarte directamente con nuestro equipo por WhatsApp para atención personalizada.', showWhatsapp:true };
    if (/horario|atienden|atencion/.test(q))
      return { text:'Para coordinar una llamada o reunión, escríbenos por WhatsApp.', showWhatsapp:true };
    if (/qubira|quienes son/.test(q))
      return { text:'QUBIRA es un equipo de estrategia, diseño, ingeniería y automatización para construir productos digitales modernos.', options:mainOpts() };
    return { text:'Puedo orientarte mejor si eliges una opción. Para consultas específicas, también puedes escribirnos por WhatsApp.', showWhatsapp:true, options:mainOpts() };
  }

  function handleMsg(text) {
    if (!text?.trim()) return;
    addMessage(text, 'user');
    if (chatbotInput) chatbotInput.value = '';
    setTimeout(() => {
      const res = getResponse(text);
      addMessage(res.text, 'bot', res.showWhatsapp, res.options);
    }, 300);
  }
  function sendMessage() { handleMsg(chatbotInput?.value?.trim()); }

  chatbotButton.addEventListener('click',  openChat);
  closeChatbot?.addEventListener('click',  closeChat);
  expandChatbot?.addEventListener('click', toggleExpand);
  sendChatbot?.addEventListener('click',   sendMessage);
  chatbotInput?.addEventListener('keydown', (e) => { if (e.key === 'Enter') sendMessage(); });
}

initChatbot();
