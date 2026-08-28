const TIPOS = {
  web: { label: "Aplicativo Web", badge: "meta-badge--web", icon: "🌐" },
  desktop: {
    label: "Aplicativo Escritorio",
    badge: "meta-badge--desktop",
    icon: "🖥️",
  },
  mobile: {
    label: "Aplicativo Móvil",
    badge: "meta-badge--mobile",
    icon: "📱",
  },
  enterprise: {
    label: "Proyecto Gran Escala",
    badge: "meta-badge--enterprise",
    icon: "🏢",
  },
};

// Mapeo tipo-key → nombre de archivo (español)
const TIPO_SLUG = {
  web:        "web",
  desktop:    "escritorio",
  mobile:     "movil",
  enterprise: "enterprise",
};

// Maquetas implementadas: { industria: [tipos disponibles] }
const MAQUETAS_DISPONIBLES = {
  ferreteria: ["web", "desktop", "mobile"],
};

function getMaquetaUrl(industriaId, tipo) {
  const slug = TIPO_SLUG[tipo] || tipo;
  if (MAQUETAS_DISPONIBLES[industriaId]?.includes(tipo)) {
    return `pruebas/${industriaId}/prueba_${slug}_${industriaId}.html`;
  }
  return `pruebas/proximamente.html?industria=${industriaId}&tipo=${slug}`;
}

const MODULOS = [
  {
    id: "ferreteria",
    name: "Ferreterías",
    emoji: "🔧",
    color: "mc-blue",
    desc: "Gestión de inventario, ventas y proveedores para ferreterías y distribuidoras de materiales de construcción.",
  },
  {
    id: "restaurante",
    name: "Restaurantes",
    emoji: "🍽️",
    color: "mc-orange",
    desc: "Sistema de pedidos, mesas, cocina y facturación para restaurantes, cafeterías y cadenas de comida.",
  },
  {
    id: "heladeria",
    name: "Heladerías",
    emoji: "🍦",
    color: "mc-teal",
    desc: "Control de sabores, stock de insumos y puntos de venta para heladerías y panaderías.",
  },
  {
    id: "farmacia",
    name: "Farmacias",
    emoji: "💊",
    color: "mc-green",
    desc: "Gestión de medicamentos, recetas médicas y control de vencimientos para farmacias y boticas.",
  },
  {
    id: "gimnasio",
    name: "Gimnasios",
    emoji: "🏋️",
    color: "mc-purple",
    desc: "Membresías, clases, rutinas y control de acceso para gimnasios y centros deportivos.",
  },
  {
    id: "tienda",
    name: "Tiendas",
    emoji: "🛍️",
    color: "mc-blue",
    desc: "Punto de venta, inventario y gestión de clientes para tiendas retail y comercios.",
  },
  {
    id: "minimarket",
    name: "Mini Markets",
    emoji: "🏪",
    color: "mc-green",
    desc: "Caja rápida, stock y proveedores para minimarkets, bodegas y abarrotes.",
  },
  {
    id: "bulevar",
    name: "Bulevares",
    emoji: "🌆",
    color: "mc-teal",
    desc: "Administración de locales, pagos y comunicación en bulevares y centros comerciales.",
  },
  {
    id: "discoteca",
    name: "Discotecas",
    emoji: "🪩",
    color: "mc-purple",
    desc: "Control de acceso, reservas VIP y caja para clubs nocturnos y bares.",
  },
  {
    id: "lavanderia",
    name: "Lavanderías",
    emoji: "🧺",
    color: "mc-blue",
    desc: "Órdenes de servicio, seguimiento de prendas y pagos en lavanderías.",
  },
  {
    id: "petshop",
    name: "Pet Shops",
    emoji: "🐾",
    color: "mc-orange",
    desc: "Gestión de mascotas, productos, peluquería y citas veterinarias en pet shops.",
  },
  {
    id: "veterinaria",
    name: "Veterinarias",
    emoji: "🐶",
    color: "mc-green",
    desc: "Historial clínico, consultas, cirugías y farmacia para clínicas veterinarias.",
  },
  {
    id: "peluqueria",
    name: "Peluquerías",
    emoji: "✂️",
    color: "mc-pink",
    desc: "Agenda de turnos, servicios, comisiones y fidelización de clientes en salones de belleza.",
  },
  {
    id: "spa",
    name: "Spas",
    emoji: "🧘",
    color: "mc-teal",
    desc: "Reservas de tratamientos, cabinas, personal y ventas de productos en spas y centros de bienestar.",
  },
  {
    id: "tecnologia",
    name: "Tiendas de Tecnología",
    emoji: "💻",
    color: "mc-blue",
    desc: "Inventario técnico, reparaciones, garantías y ventas de electrónica.",
  },
  {
    id: "clinica",
    name: "Clínicas Dentales",
    emoji: "🦷",
    color: "mc-green",
    desc: "Historial de pacientes, citas, tratamientos y facturación odontológica.",
  },
  {
    id: "licorera",
    name: "Licoreras",
    emoji: "🥃",
    color: "mc-orange",
    desc: "Control de inventario, ventas por mayor/menor y vencimientos en licoreras.",
  },
  {
    id: "colegio",
    name: "Colegios",
    emoji: "🎓",
    color: "mc-purple",
    desc: "Matrícula, calificaciones, asistencia y comunicación con padres en instituciones educativas.",
  },
  {
    id: "guarderia",
    name: "Guarderías",
    emoji: "🧒",
    color: "mc-pink",
    desc: "Registro de niños, asistencia, actividades y comunicación con familias en guarderías y nidos.",
  },
  {
    id: "trajes",
    name: "Alquiler de Trajes",
    emoji: "👔",
    color: "mc-blue",
    desc: "Catálogo de trajes, reservas, entregas y control de devoluciones.",
  },
  {
    id: "fotografia",
    name: "Estudios Fotográficos",
    emoji: "📸",
    color: "mc-teal",
    desc: "Agenda de sesiones fotográficas, entrega de fotos, paquetes y facturación.",
  },
  {
    id: "eventos",
    name: "Organizadores de Eventos",
    emoji: "🎉",
    color: "mc-orange",
    desc: "Planificación de eventos, proveedores, presupuestos y cronogramas.",
  },
  {
    id: "carpinteria",
    name: "Taller de Carpintería",
    emoji: "🪵",
    color: "mc-orange",
    desc: "Órdenes de trabajo, materiales, presupuestos y seguimiento de proyectos de carpintería.",
  },
  {
    id: "optica",
    name: "Ópticas",
    emoji: "👓",
    color: "mc-blue",
    desc: "Historial de prescripciones ópticas, inventario de lentes y citas de control visual.",
  },
  {
    id: "hotel",
    name: "Hoteles",
    emoji: "🏨",
    color: "mc-purple",
    desc: "Reservas, check-in/out, habitaciones, servicios adicionales y facturación hotelera.",
  },
];

// Declaración inicial del índice de búsqueda
const SEARCH_INDEX = [
  {
    label: "Dashboard",
    section: "Principal",
    screen: "dashboard",
    icon: "📊",
  },
  {
    label: "Proyectos",
    section: "Principal",
    screen: "proyectos",
    icon: "📋",
  },
  {
    label: "Sprints",
    section: "Principal",
    screen: "sprints",
    icon: "⚡",
  },
  { label: "Equipo", section: "Principal", screen: "equipo", icon: "👥" },
  {
    label: "Módulos",
    section: "Principal",
    screen: "modulos",
    icon: "🧩",
  },
  {
    label: "Métricas",
    section: "Analytics",
    screen: "metricas",
    icon: "📈",
  },
  {
    label: "Reportes",
    section: "Analytics",
    screen: "reportes",
    icon: "📄",
  },
  {
    label: "Configuración",
    section: "Sistema",
    screen: "configuracion",
    icon: "⚙️",
  },
  {
    label: "Nuevo contrato",
    section: "Contratos",
    screen: "nuevo-contrato",
    icon: "📄",
  },
  {
    label: "Historial de contrato",
    section: "Contratos",
    screen: "historial-contrato",
    icon: "⏳",
  },
  {
    label: "Estado de contrato",
    section: "Contratos",
    screen: "estado-contrato",
    icon: "✔️",
  },
  {
    label: "Gestión de usuarios",
    section: "Contratos",
    screen: "gestion-usuarios",
    icon: "👥",
  },
];

// Función para actualizar el SEARCH_INDEX automáticamente con los nuevos apartados
function updateSearchIndex() {
  const sidebarItems = document.querySelectorAll(".sidebar__nav .nav-item");

  sidebarItems.forEach((item) => {
    const label = item.textContent.trim(); // Obtener el nombre del elemento
    const screen = item.dataset.screen; // Obtener el screen desde el atributo data-screen
    const icon = item.querySelector("svg")
      ? item.querySelector("svg").outerHTML
      : ""; // Obtener el ícono si existe

    // Evitar agregar elementos duplicados
    if (!SEARCH_INDEX.some((entry) => entry.screen === screen)) {
      SEARCH_INDEX.push({ label, section: "Contratos", screen, icon });
    }
  });
}

// Llamar a la función al cargar la página para actualizar el índice
updateSearchIndex();

// Muestra el índice de búsqueda actualizado (opcional)
console.log(SEARCH_INDEX);

document
  .getElementById("search-input")
  .addEventListener("input", function (event) {
    const searchQuery = event.target.value.toLowerCase();
    const filteredItems = SEARCH_INDEX.filter((item) =>
      item.label.toLowerCase().includes(searchQuery),
    );

    const searchDropdown = document.getElementById("search-dropdown");
    searchDropdown.innerHTML = ""; // Limpiar los resultados previos

    if (filteredItems.length > 0) {
      filteredItems.forEach((item) => {
        const resultItem = document.createElement("div");
        resultItem.classList.add("search-result");
        resultItem.innerHTML = `
        <div class="search-result-icon">${item.icon}</div>
        <div class="search-result-info">
          <strong>${item.label}</strong>
          <span>${item.section}</span>
        </div>
      `;
        resultItem.addEventListener("click", () => showScreen(item.screen));
        searchDropdown.appendChild(resultItem);
      });
    } else {
      searchDropdown.innerHTML = `<div class="search-empty">No se encontraron resultados</div>`;
    }

    // Mostrar el dropdown de búsqueda si hay resultados
    searchDropdown.classList.toggle("open", filteredItems.length > 0);
  });

function showScreen(screenId) {
  document.querySelectorAll(".screen").forEach((screen) => {
    screen.classList.remove("active");
  });

  const screenElement = document.getElementById("screen-" + screenId);
  if (screenElement) {
    screenElement.classList.add("active");
  }

  // Actualiza el título del topbar
  document.getElementById("topbar-title").textContent =
    screenId.charAt(0).toUpperCase() + screenId.slice(1);
}

const SCREEN_TITLES = {
  dashboard: "Dashboard",
  proyectos: "Proyectos",
  sprints: "Sprints",
  equipo: "Equipo",
  modulos: "Módulos",
  metricas: "Métricas",
  reportes: "Reportes",
  configuracion: "Configuración",
  "module-detail": "Módulo",
};

function showScreen(id) {
  document
    .querySelectorAll(".screen")
    .forEach((s) => s.classList.remove("active"));
  const s = document.getElementById("screen-" + id);
  if (s) s.classList.add("active");
  document.getElementById("topbar-title").textContent = SCREEN_TITLES[id] || id;
  if (id === "dashboard") setTimeout(animateCounters, 100);
}

document.querySelectorAll(".nav-item").forEach((item) => {
  item.addEventListener("click", () => {
    document
      .querySelectorAll(".nav-item")
      .forEach((n) => n.classList.remove("active"));
    item.classList.add("active");
    if (item.dataset.screen) showScreen(item.dataset.screen);
  });
});

// Notifications
const notifBtn = document.getElementById("notif-btn");
const notifPanel = document.getElementById("notif-panel");
function positionNotif() {
  const rect = notifBtn.getBoundingClientRect();
  notifPanel.style.top = rect.bottom + 10 + "px";
  notifPanel.style.right = window.innerWidth - rect.right + "px";
}
notifBtn.addEventListener("click", (e) => {
  e.stopPropagation();
  positionNotif();
  notifPanel.classList.toggle("open");
});
document.addEventListener("click", (e) => {
  if (!notifPanel.contains(e.target) && e.target !== notifBtn)
    notifPanel.classList.remove("open");
});
document.getElementById("mark-read-btn").addEventListener("click", () => {
  document.querySelectorAll(".notif-dot").forEach((d) => {
    d.className = "notif-dot read";
  });
  document
    .querySelectorAll(".notif-item")
    .forEach((i) => i.classList.remove("unread"));
  document.getElementById("notif-dot").style.display = "none";
});

// Search
const searchInput = document.getElementById("search-input");
const searchDropdown = document.getElementById("search-dropdown");
searchInput.addEventListener("input", () => {
  const q = searchInput.value.trim().toLowerCase();
  if (!q) {
    searchDropdown.classList.remove("open");
    return;
  }
  const results = SEARCH_INDEX.filter((x) =>
    x.label.toLowerCase().includes(q),
  ).slice(0, 8);
  if (!results.length) {
    searchDropdown.innerHTML =
      '<div class="search-empty">Sin resultados para "' +
      searchInput.value +
      '"</div>';
  } else {
    searchDropdown.innerHTML = results
      .map(
        (r) => `
      <div class="search-result" data-screen="${r.screen}" data-modulo="${r.modulo ? r.modulo.id : ""}">
        <div class="search-result-icon" style="background:rgba(79,176,255,.1)">${r.icon}</div>
        <div class="search-result-info"><strong>${r.label}</strong><span>${r.section}</span></div>
        <span class="search-result-tag">${r.section}</span>
      </div>`,
      )
      .join("");
    searchDropdown.querySelectorAll(".search-result").forEach((el) => {
      el.addEventListener("click", () => {
        const mid = el.dataset.modulo;
        searchDropdown.classList.remove("open");
        searchInput.value = "";
        if (mid) {
          const mod = MODULOS.find((m) => m.id === mid);
          if (mod) openModuleDetail(mod);
        } else {
          showScreen(el.dataset.screen);
          document
            .querySelectorAll(".nav-item")
            .forEach((n) =>
              n.classList.toggle(
                "active",
                n.dataset.screen === el.dataset.screen,
              ),
            );
        }
      });
    });
  }
  searchDropdown.classList.add("open");
});
document.addEventListener("click", (e) => {
  if (!searchDropdown.contains(e.target) && e.target !== searchInput)
    searchDropdown.classList.remove("open");
});
searchInput.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    searchDropdown.classList.remove("open");
    searchInput.value = "";
  }
});

// Tipo selector
let selectedTipo = null;
document.querySelectorAll(".tipo-card").forEach((card) => {
  card.addEventListener("click", () => {
    document
      .querySelectorAll(".tipo-card")
      .forEach((c) => c.classList.remove("selected"));
    card.classList.add("selected");
    selectedTipo = card.dataset.tipo;
    const sec = document.getElementById("industrias-section");
    sec.style.display = "block";
    sec.style.animation = "fadeUp .4s ease both";
  });
});

// Build modulos grid
const grid = document.getElementById("modulos-grid");
MODULOS.forEach((m, i) => {
  const card = document.createElement("div");
  card.className = `modulo-card ${m.color}`;
  card.dataset.id = m.id;
  card.dataset.name = m.name.toLowerCase();
  card.style.animationDelay = i * 0.03 + "s";
  card.innerHTML = `<span class="mc-emoji">${m.emoji}</span><div class="mc-name">${m.name}</div><span class="mc-tag">Módulo</span>`;
  card.addEventListener("click", () => openModuleDetail(m));
  grid.appendChild(card);
});

document
  .getElementById("modulos-search-input")
  .addEventListener("input", function () {
    const q = this.value.toLowerCase();
    document.querySelectorAll(".modulo-card").forEach((c) => {
      c.classList.toggle("hidden", q && !c.dataset.name.includes(q));
    });
  });

// Module detail
function openModuleDetail(mod) {
  document.getElementById("detail-icon").textContent = mod.emoji;
  document.getElementById("detail-title").textContent = mod.name;
  document.getElementById("detail-desc").textContent = mod.desc;
  const meta = document.getElementById("detail-meta");
  if (selectedTipo && TIPOS[selectedTipo]) {
    const t = TIPOS[selectedTipo];
    meta.innerHTML = `<span class="meta-badge ${t.badge}">${t.icon} ${t.label}</span>`;
  } else {
    meta.innerHTML = "";
  }
  document.getElementById("maqueta-btn").href = getMaquetaUrl(mod.id, selectedTipo || "web");
  document.getElementById("maqueta-btn").target = "_blank";
  const kpisEl = document.getElementById("detail-kpis");
  kpisEl.innerHTML = "";
  [
    {
      label: "Clientes Activos",
      val: "247",
      sub: "Este mes",
      change: "+18%",
    },
    {
      label: "Facturación",
      val: "$12.4k",
      sub: "Último mes",
      change: "+9%",
    },
    {
      label: "Operaciones",
      val: "1,832",
      sub: "Transacciones",
      change: "+24%",
    },
    {
      label: "Satisfacción",
      val: "4.7★",
      sub: "Promedio clientes",
      change: "+0.3",
    },
  ].forEach((k, i) => {
    const c = document.createElement("div");
    c.className = "mk-card";
    c.style.animationDelay = i * 0.05 + "s";
    c.innerHTML = `<div class="mk-label">${k.label}</div><div class="mk-val">${k.val}</div><div class="mk-sub">${k.sub}</div><span class="mk-change">${k.change}</span>`;
    kpisEl.appendChild(c);
  });
  document.getElementById("detail-table-title").textContent =
    "Últimas Operaciones";
  document.getElementById("detail-table-head").innerHTML = [
    "#",
    "Descripción",
    "Monto",
    "Estado",
  ]
    .map((h) => `<th>${h}</th>`)
    .join("");
  document.getElementById("detail-table-body").innerHTML = [
    ["001", "Venta directa", "$280", "badge-green|Pagado"],
    ["002", "Servicio express", "$150", "badge-orange|Pendiente"],
    ["003", "Compra mayorista", "$1,200", "badge-green|Pagado"],
    ["004", "Devolución", "-$80", "badge-red|Procesado"],
    ["005", "Venta online", "$340", "badge-blue|En camino"],
  ]
    .map(
      (row) =>
        "<tr>" +
        row
          .map((cell, ci) => {
            if (ci === row.length - 1 && cell.includes("|")) {
              const [cls, txt] = cell.split("|");
              return `<td><span class="td-badge ${cls}">${txt}</span></td>`;
            }
            return `<td>${cell}</td>`;
          })
          .join("") +
        "</tr>",
    )
    .join("");
  document.getElementById("detail-quick-list").innerHTML = [
    {
      icon: "➕",
      bg: "rgba(79,176,255,.12)",
      label: "Nueva venta",
      sub: "Registrar transacción",
    },
    {
      icon: "📦",
      bg: "rgba(119,242,200,.12)",
      label: "Actualizar stock",
      sub: "Control de inventario",
    },
    {
      icon: "👤",
      bg: "rgba(123,97,255,.12)",
      label: "Nuevo cliente",
      sub: "Añadir a base de datos",
    },
    {
      icon: "📊",
      bg: "rgba(255,184,107,.12)",
      label: "Ver reportes",
      sub: "Análisis del período",
    },
  ]
    .map(
      (q) =>
        `<div class="ms-quick-item"><div class="ms-qi-icon" style="background:${q.bg}">${q.icon}</div><div class="ms-qi-text"><strong>${q.label}</strong><span>${q.sub}</span></div></div>`,
    )
    .join("");
  document.getElementById("detail-report-grid").innerHTML = [
    {
      icon: "📊",
      name: "Reporte de Ventas",
      sub: "Ventas diarias, semanales y mensuales",
    },
    {
      icon: "📦",
      name: "Reporte de Inventario",
      sub: "Stock actual y movimientos",
    },
    {
      icon: "👤",
      name: "Reporte de Clientes",
      sub: "Base de clientes y fidelización",
    },
    {
      icon: "💰",
      name: "Reporte Financiero",
      sub: "Ingresos, egresos y utilidades",
    },
    {
      icon: "📈",
      name: "Análisis de Tendencias",
      sub: "KPIs y proyecciones",
    },
    {
      icon: "🔄",
      name: "Reporte Operacional",
      sub: "Procesos y eficiencia operativa",
    },
  ]
    .map(
      (r) =>
        `<div class="report-card"><div class="rc-icon">${r.icon}</div><div class="rc-name">${r.name}</div><div class="rc-sub">${r.sub}</div><button class="rc-btn">📥 Descargar</button></div>`,
    )
    .join("");
  document.getElementById("def-desc-text").textContent = mod.desc;
  document.getElementById("def-features").innerHTML = [
    "Gestión completa de inventario en tiempo real",
    "Facturación electrónica integrada",
    "Control de usuarios y permisos por roles",
    "Reportes y estadísticas automatizadas",
    "Integración con sistemas de pago",
    "Soporte multiempresa y multisucursal",
  ]
    .map(
      (f) =>
        `<div class="def-feature"><div class="def-feature-dot"></div>${f}</div>`,
    )
    .join("");
  const techByTipo = {
    web: ["React 18", "Node.js", "PostgreSQL", "REST API", "Docker", "AWS"],
    desktop: [
      "Electron",
      "C#/.NET",
      "SQLite",
      "WinForms",
      "Auto-Update",
      "Offline-First",
    ],
    mobile: [
      "React Native",
      "Flutter",
      "Firebase",
      "Push Notifications",
      "Offline Sync",
      "App Store",
    ],
    enterprise: [
      "Microservices",
      "Kubernetes",
      "Oracle DB",
      "Redis",
      "CI/CD",
      "SOA",
    ],
  };
  document.getElementById("def-tech-stack").innerHTML = (
    techByTipo[selectedTipo] || techByTipo.web
  )
    .map((t) => `<span class="tech-tag">${t}</span>`)
    .join("");
  document.getElementById("def-modules-list").innerHTML = [
    "Ventas & POS",
    "Inventario",
    "Clientes (CRM)",
    "Facturación",
    "Reportes",
    "Configuración",
    "Usuarios & Roles",
    "Dashboard Analytics",
  ]
    .map(
      (m) =>
        `<div class="def-feature"><div class="def-feature-dot"></div>${m}</div>`,
    )
    .join("");
  document
    .querySelectorAll(".module-tab")
    .forEach((t) => t.classList.remove("active"));
  document
    .querySelectorAll(".tab-content")
    .forEach((t) => t.classList.remove("active"));
  document
    .querySelector('.module-tab[data-tab="resumen"]')
    .classList.add("active");
  document.getElementById("tab-resumen").classList.add("active");
  showScreen("module-detail");
  document.getElementById("topbar-title").textContent = mod.name;
}

document.getElementById("back-to-modulos").addEventListener("click", () => {
  showScreen("modulos");
  document
    .querySelectorAll(".nav-item")
    .forEach((n) =>
      n.classList.toggle("active", n.dataset.screen === "modulos"),
    );
});

document.querySelectorAll(".module-tab").forEach((tab) => {
  tab.addEventListener("click", () => {
    document
      .querySelectorAll(".module-tab")
      .forEach((t) => t.classList.remove("active"));
    document
      .querySelectorAll(".tab-content")
      .forEach((t) => t.classList.remove("active"));
    tab.classList.add("active");
    const target = document.getElementById("tab-" + tab.dataset.tab);
    if (target) target.classList.add("active");
  });
});

// Live date
function updateDate() {
  document.getElementById("liveDate").textContent =
    new Date().toLocaleDateString("es-PE", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
}
updateDate();

// Counter animation
function animateCounters() {
  document.querySelectorAll("#screen-dashboard .counter").forEach((el) => {
    const target = parseInt(el.dataset.target);
    let current = 0;
    const step = target / 60;
    const timer = setInterval(() => {
      current = Math.min(current + step, target);
      el.textContent = Math.floor(current);
      if (current >= target) clearInterval(timer);
    }, 16);
  });
}

// Chips
document.querySelectorAll(".chip").forEach((chip) => {
  chip.addEventListener("click", () => {
    chip
      .closest(".chip-row")
      .querySelectorAll(".chip")
      .forEach((c) => c.classList.remove("active"));
    chip.classList.add("active");
  });
});

// Report download demo
document.addEventListener("click", (e) => {
  if (e.target.classList.contains("rc-btn")) {
    e.target.textContent = "✅ Descargado";
    setTimeout(() => {
      e.target.innerHTML = "📥 Descargar";
    }, 2000);
  }
});

// Profile dropdown
const profileBtn = document.getElementById("profile-btn");
const profileDropdown = document.getElementById("profile-dropdown");
profileBtn.addEventListener("click", (e) => {
  e.stopPropagation();
  profileDropdown.classList.toggle("open");
  notifPanel.classList.remove("open");
});
document.addEventListener("click", (e) => {
  if (!profileDropdown.contains(e.target) && e.target !== profileBtn)
    profileDropdown.classList.remove("open");
});

// Logout del perfil (sin JWT — este listener es reemplazado por el del auth guard)
document.getElementById("profile-logout-btn").addEventListener("click", () => {
  profileDropdown.classList.remove("open");
  window.location.href = "/";
});

// Init counters on load
setTimeout(animateCounters, 300);

/* ============================================================
         AUTH GUARD — verifica JWT y carga datos del usuario
         ============================================================ */
(function initAuth() {
  const token = localStorage.getItem("qubira_token");
  if (!token) {
    window.location.href = "/login";
    return;
  }

  /* Mostrar datos del usuario en la UI */
  try {
    const user = JSON.parse(localStorage.getItem("qubira_user") || "{}");
    if (user.nombre) {
      const initials = (
        (user.nombre[0] || "") + (user.apellidos ? user.apellidos[0] : "")
      ).toUpperCase();
      const avatarEl = document.querySelector(".user-avatar");
      const nameEl = document.querySelector(".user-info strong");
      const roleEl = document.querySelector(".user-info span");
      const pdAvatar = document.querySelector(".profile-dropdown__avatar");
      const pdName = document.querySelector(".profile-dropdown__info strong");
      const pdUser = document.querySelector(".profile-dropdown__username");
      const pdNombre = document.querySelector(
        ".profile-dropdown__value:nth-of-type(1)",
      );
      if (avatarEl) avatarEl.textContent = initials;
      if (nameEl)
        nameEl.textContent = user.nombre + " " + (user.apellidos || "");
      if (roleEl) roleEl.textContent = user.rol;
      if (pdAvatar) pdAvatar.textContent = initials;
      if (pdName)
        pdName.textContent = user.nombre + " " + (user.apellidos || "");
      if (pdUser) pdUser.textContent = "@" + user.username;
    }
  } catch (_) {}

  /* Verificar que el token siga válido en el servidor */
  fetch("/api/auth/me", {
    headers: { Authorization: "Bearer " + token },
  })
    .then((r) => {
      if (!r.ok) {
        localStorage.removeItem("qubira_token");
        localStorage.removeItem("qubira_user");
        window.location.href = "/login";
      }
    })
    .catch(() => {
      /* sin conexión al servidor — seguimos offline */
    });

  /* Logout real con la API */
  const logoutBtn = document.getElementById("profile-logout-btn");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", async () => {
      try {
        await fetch("/api/auth/logout", {
          method: "POST",
          headers: {
            Authorization: "Bearer " + localStorage.getItem("qubira_token"),
          },
        });
      } catch (_) {}
      localStorage.removeItem("qubira_token");
      localStorage.removeItem("qubira_user");
      window.location.href = "/login";
    });
  }
})();

/* ============================================================
         MÓDULO GESTIÓN DE USUARIOS
         ============================================================ */
(function GestionUsuarios() {
  /* API base y helpers */
  const API = window.location.origin;
  function token() {
    return localStorage.getItem("qubira_token") || "";
  }
  function authHeaders() {
    return {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token(),
    };
  }
  async function apiFetch(path, opts = {}) {
    const res = await fetch(API + path, {
      headers: authHeaders(),
      ...opts,
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Error " + res.status);
    return data;
  }

  /* ------ ROLES Y COLORES ------ */
  const ROL_CLASS = {
    CEO: "role-ceo",
    ADMIN: "role-admin",
    DEVELOPER: "role-dev",
    DESIGNER: "role-design",
    QA: "role-qa",
    VIEWER: "role-viewer",
  };
  const ROL_ICON = {
    CEO: "👑",
    ADMIN: "🛡",
    DEVELOPER: "💻",
    DESIGNER: "🎨",
    QA: "🧪",
    VIEWER: "👁",
  };
  const AVATAR_COLORS = [
    "linear-gradient(135deg,#1f7ae0,#4fb0ff)",
    "linear-gradient(135deg,#7b61ff,#a78bfa)",
    "linear-gradient(135deg,#77f2c8,#34d399)",
    "linear-gradient(135deg,#ffb86b,#f59e0b)",
    "linear-gradient(135deg,#ff6b9d,#ec4899)",
    "linear-gradient(135deg,#40e0d0,#06b6d4)",
  ];

  let users = [];
  let editingId = null;

  /* Carga usuarios desde la API */
  async function loadUsers() {
    try {
      const data = await apiFetch("/api/usuarios");
      users = data.usuarios;
      renderTable();
      renderStats();
    } catch (err) {
      console.error("[GU] loadUsers:", err.message);
      showTableError("No se pudo cargar la lista de usuarios.");
    }
  }

  function showTableError(msg) {
    tbody.innerHTML = `<tr><td colspan="7" style="text-align:center;padding:40px;color:var(--muted)">${msg}</td></tr>`;
  }
  let securityCallback = null;
  let deleteTargetId = null;
  let securityMode = null; /* 'view' | 'edit-pass' */

  /* ------ ELEMENTOS DOM ------ */
  const tbody = document.getElementById("gu-tbody");
  const emptyState = document.getElementById("gu-empty");
  const searchInput = document.getElementById("gu-search-input");
  const filterRol = document.getElementById("gu-filter-rol");
  const filterStatus = document.getElementById("gu-filter-status");

  /* Modales */
  const modalOverlay = document.getElementById("gu-modal-overlay");
  const modalTitle = document.getElementById("gu-modal-title");
  const modalClose = document.getElementById("gu-modal-close");
  const modalCancel = document.getElementById("gu-modal-cancel");
  const modalSave = document.getElementById("gu-modal-save");
  const addBtn = document.getElementById("gu-add-btn");

  const secOverlay = document.getElementById("gu-security-overlay");
  const secClose = document.getElementById("gu-security-close");
  const secCancel = document.getElementById("gu-security-cancel");
  const secConfirm = document.getElementById("gu-security-confirm");
  const secTitle = document.getElementById("gu-sec-title");
  const secDesc = document.getElementById("gu-sec-desc");
  const masterInput = document.getElementById("gu-master-input");
  const masterError = document.getElementById("gu-master-error");
  const revealValue = document.getElementById("gu-reveal-value");

  const delOverlay = document.getElementById("gu-delete-overlay");
  const delClose = document.getElementById("gu-delete-close");
  const delCancel = document.getElementById("gu-delete-cancel");
  const delConfirm = document.getElementById("gu-delete-confirm");
  const delName = document.getElementById("gu-delete-name");

  /* ------ CAMPOS DEL FORM ------ */
  const fNombre = document.getElementById("f-nombre");
  const fApellidos = document.getElementById("f-apellidos");
  const fDni = document.getElementById("f-dni");
  const fCelular = document.getElementById("f-celular");
  const fCorreo = document.getElementById("f-correo");
  const fUser = document.getElementById("f-user");
  const fPassword = document.getElementById("f-password");
  const fRol = document.getElementById("f-rol");
  const fStatus = document.getElementById("f-status");

  /* ------ RENDER ------ */
  function getFiltered() {
    const q = (searchInput.value || "").toLowerCase().trim();
    const r = filterRol.value;
    const s = filterStatus.value;
    return users.filter((u) => {
      const matchQ =
        !q ||
        u.nombre.toLowerCase().includes(q) ||
        u.apellidos.toLowerCase().includes(q) ||
        u.username.toLowerCase().includes(q) ||
        u.correo.toLowerCase().includes(q);
      const matchR = !r || u.rol === r;
      const matchS = !s || u.estado === s;
      return matchQ && matchR && matchS;
    });
  }

  function renderTable() {
    const list = getFiltered();
    tbody.innerHTML = "";
    emptyState.style.display = list.length ? "none" : "block";
    list.forEach((u, i) => {
      const initials = (
        u.nombre[0] + (u.apellidos ? u.apellidos[0] : "")
      ).toUpperCase();
      const rolClass = ROL_CLASS[u.rol] || "role-viewer";
      const rolIcon = ROL_ICON[u.rol] || "👤";
      const color = AVATAR_COLORS[(u.avatar_color || 0) % AVATAR_COLORS.length];
      const isActivo = u.estado === "activo";
      const tr = document.createElement("tr");
      tr.style.animationDelay = i * 0.04 + "s";
      tr.innerHTML = `
              <td>
                <div class="gu-user-cell">
                  <div class="gu-avatar" style="background:${color}">${initials}</div>
                  <div>
                    <div class="gu-user-name">${u.nombre}</div>
                    <div class="gu-user-email">${u.correo}</div>
                  </div>
                </div>
              </td>
              <td><span class="gu-role-badge ${rolClass}">${rolIcon} ${u.rol}</span></td>
              <td style="font-family:monospace;font-size:.8rem;color:var(--muted)">@${u.username}</td>
              <td style="color:var(--muted);font-size:.82rem">${u.celular || "—"}</td>
              <td><span class="gu-status-badge ${isActivo ? "status-active" : "status-inactive"}">${isActivo ? "Activo" : "Inactivo"}</span></td>
              <td>
                <div style="display:flex;flex-direction:column;gap:5px">
                  <button class="gu-protected" data-uid="${u.id}" data-field="apellidos">
                    <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 17a2 2 0 002-2 2 2 0 00-2-2 2 2 0 00-2 2 2 2 0 002 2m6-9a2 2 0 012 2v10a2 2 0 01-2 2H6a2 2 0 01-2-2V10a2 2 0 012-2h1V6a5 5 0 0110 0v2h1m-6-5a3 3 0 00-3 3v2h6V6a3 3 0 00-3-3z"/></svg>
                    Apellidos
                  </button>
                  <button class="gu-protected" data-uid="${u.id}" data-field="dni">
                    <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 17a2 2 0 002-2 2 2 0 00-2-2 2 2 0 00-2 2 2 2 0 002 2m6-9a2 2 0 012 2v10a2 2 0 01-2 2H6a2 2 0 01-2-2V10a2 2 0 012-2h1V6a5 5 0 0110 0v2h1m-6-5a3 3 0 00-3 3v2h6V6a3 3 0 00-3-3z"/></svg>
                    DNI
                  </button>
                  <button class="gu-protected" data-uid="${u.id}" data-field="password_hash">
                    <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 17a2 2 0 002-2 2 2 0 00-2-2 2 2 0 00-2 2 2 2 0 002 2m6-9a2 2 0 012 2v10a2 2 0 01-2 2H6a2 2 0 01-2-2V10a2 2 0 012-2h1V6a5 5 0 0110 0v2h1m-6-5a3 3 0 00-3 3v2h6V6a3 3 0 00-3-3z"/></svg>
                    Contraseña
                  </button>
                </div>
              </td>
              <td>
                <div class="gu-actions-cell">
                  <button class="gu-action-btn" data-action="edit" data-uid="${u.id}" title="Editar">
                    <svg viewBox="0 0 24 24" fill="currentColor"><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zm17.71-10.21a1 1 0 000-1.41l-2.34-2.34a1 1 0 00-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/></svg>
                  </button>
                  <button class="gu-action-btn" data-action="toggle" data-uid="${u.id}" title="${isActivo ? "Desactivar" : "Activar"}">
                    <svg viewBox="0 0 24 24" fill="currentColor"><path d="M17 7H7c-2.76 0-5 2.24-5 5s2.24 5 5 5h10c2.76 0 5-2.24 5-5s-2.24-5-5-5zm0 8H7c-1.66 0-3-1.34-3-3s1.34-3 3-3h10c1.66 0 3 1.34 3 3s-1.34 3-3 3z"/></svg>
                  </button>
                  <button class="gu-action-btn danger" data-action="delete" data-uid="${u.id}" title="Eliminar">
                    <svg viewBox="0 0 24 24" fill="currentColor"><path d="M6 19c0 1.1.9 2 2 2h8a2 2 0 002-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/></svg>
                  </button>
                </div>
              </td>`;
      tbody.appendChild(tr);
    });
  }

  function renderStats() {
    document.getElementById("stat-total").textContent = users.length;
    document.getElementById("stat-active").textContent = users.filter(
      (u) => u.estado === "activo",
    ).length;
    document.getElementById("stat-admin").textContent = users.filter((u) =>
      ["CEO", "ADMIN"].includes(u.rol),
    ).length;
    document.getElementById("stat-inactive").textContent = users.filter(
      (u) => u.estado === "inactivo",
    ).length;
  }

  /* ------ ABRIR / CERRAR MODAL PRINCIPAL ------ */
  function openModal(user) {
    editingId = user ? user.id : null;
    modalTitle.textContent = user ? "✏️ Editar Usuario" : "➕ Agregar Usuario";
    fNombre.value = user ? user.nombre : "";
    fApellidos.value = user ? user.apellidos : "";
    fDni.value = user ? user.dni : "";
    fCelular.value = user ? user.celular : "";
    fCorreo.value = user ? user.correo : "";
    fUser.value = user ? user.username : "";
    fPassword.value = ""; /* nunca pre-llenar la contraseña */
    fRol.value = user ? user.rol : "ADMIN";
    fStatus.value = user ? user.estado : "activo";
    modalOverlay.classList.add("open");
    setTimeout(() => fNombre.focus(), 200);
  }
  function closeModal() {
    modalOverlay.classList.remove("open");
    editingId = null;
  }

  function saveUser() {
    const nombre = fNombre.value.trim();
    const apellidos = fApellidos.value.trim();
    const dni = fDni.value.trim();
    const celular = fCelular.value.trim();
    const correo = fCorreo.value.trim();
    const username = fUser.value.trim();
    const password = fPassword.value.trim();
    const rol = fRol.value;
    const estado = fStatus.value;

    if (!nombre || !username || !correo) {
      alert("Nombre, username y correo son obligatorios.");
      return;
    }
    if (!editingId && !password) {
      alert("La contraseña es obligatoria al crear un usuario.");
      return;
    }

    /* Si se cambia contraseña al editar → pedir master por API */
    const payload = {
      nombre,
      apellidos,
      dni,
      celular,
      correo,
      username,
      rol,
      estado,
    };
    if (password) payload.password = password;
    doSave(payload);
  }

  async function doSave(data) {
    setBtnLoading(modalSave, true);
    try {
      if (editingId) {
        await apiFetch(`/api/usuarios/${editingId}`, {
          method: "PUT",
          body: JSON.stringify(data),
        });
      } else {
        await apiFetch("/api/usuarios", {
          method: "POST",
          body: JSON.stringify(data),
        });
      }
      closeModal();
      await loadUsers();
    } catch (err) {
      alert("Error: " + err.message);
    } finally {
      setBtnLoading(modalSave, false);
    }
  }

  function setBtnLoading(btn, loading) {
    btn.disabled = loading;
    btn.textContent = loading ? "Guardando..." : "💾 Guardar";
  }

  /* ------ MODAL SEGURIDAD ------ */
  function openSecurity(title, desc, callback) {
    secTitle.textContent = title;
    secDesc.textContent = desc;
    masterInput.value = "";
    masterError.style.display = "none";
    revealValue.textContent = "";
    revealValue.classList.remove("shown");
    securityCallback = callback;
    secOverlay.classList.add("open");
    setTimeout(() => masterInput.focus(), 200);
  }
  function closeSecurity() {
    secOverlay.classList.remove("open");
    securityCallback = null;
  }
  function confirmSecurity() {
    if (securityCallback) securityCallback(masterInput.value);
  }

  /* ------ VER DATO PROTEGIDO (llama a la API) ------ */
  function viewProtected(uid, field) {
    const u = users.find((x) => x.id === uid);
    if (!u) return;
    const LABELS = {
      apellidos: "Apellidos completos",
      dni: "Número de DNI",
      password_hash: "Contraseña",
    };
    openSecurity(
      `🔒 Ver ${LABELS[field] || field}`,
      `Ingresa la contraseña maestra para ver este dato de "${u.nombre}".`,
      async (masterPass) => {
        try {
          const data = await apiFetch(`/api/usuarios/${uid}/campo-protegido`, {
            method: "POST",
            body: JSON.stringify({
              campo: field,
              master_password: masterPass,
            }),
          });
          masterError.style.display = "none";
          revealValue.textContent = data.valor || "(vacío)";
          revealValue.classList.add("shown");
        } catch (err) {
          masterError.style.display = "block";
          masterInput.value = "";
          masterInput.focus();
        }
      },
    );
  }

  /* ------ ELIMINAR ------ */
  function openDelete(uid) {
    const u = users.find((x) => x.id === uid);
    if (!u) return;
    deleteTargetId = uid;
    delName.textContent = `"${u.nombre} ${u.apellidos}"`;
    delOverlay.classList.add("open");
  }
  function closeDelete() {
    delOverlay.classList.remove("open");
    deleteTargetId = null;
  }
  async function confirmDelete() {
    if (!deleteTargetId) return;
    try {
      await apiFetch(`/api/usuarios/${deleteTargetId}`, {
        method: "DELETE",
      });
      closeDelete();
      await loadUsers();
    } catch (err) {
      alert("Error al eliminar: " + err.message);
    }
  }

  /* ------ TOGGLE ESTADO ------ */
  async function toggleStatus(uid) {
    try {
      const data = await apiFetch(`/api/usuarios/${uid}/estado`, {
        method: "PATCH",
      });
      const u = users.find((x) => x.id === uid);
      if (u) {
        u.estado = data.estado;
        renderTable();
        renderStats();
      }
    } catch (err) {
      alert("Error: " + err.message);
    }
  }

  /* ------ VISIBILIDAD PASSWORD ------ */
  document.addEventListener("click", (e) => {
    const btn = e.target.closest(".gu-pass-toggle");
    if (!btn) return;
    const targetId = btn.dataset.target;
    const inp = document.getElementById(targetId);
    if (!inp) return;
    inp.type = inp.type === "password" ? "text" : "password";
    btn.textContent = inp.type === "password" ? "👁" : "🙈";
  });

  /* ------ EXPORTAR CSV ------ */
  document.getElementById("gu-export-btn").addEventListener("click", () => {
    const headers = [
      "ID",
      "Nombre",
      "Username",
      "Correo",
      "Rol",
      "Celular",
      "Estado",
    ];
    const rows = users.map((u) => [
      u.id,
      u.nombre,
      u.user,
      u.correo,
      u.rol,
      u.celular,
      u.status,
    ]);
    const csv = [headers, ...rows].map((r) => r.join(",")).join("\n");
    const a = document.createElement("a");
    a.href = "data:text/csv;charset=utf-8," + encodeURIComponent(csv);
    a.download = "usuarios_qubira.csv";
    a.click();
  });

  /* ------ EVENTOS DELEGADOS (tabla) ------ */
  tbody.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-action]");
    if (btn) {
      const uid = parseInt(btn.dataset.uid);
      const action = btn.dataset.action;
      if (action === "edit") {
        const u = users.find((x) => x.id === uid);
        openModal(u);
      }
      if (action === "delete") openDelete(uid);
      if (action === "toggle") toggleStatus(uid);
    }
    const prot = e.target.closest(".gu-protected");
    if (prot) {
      const uid = parseInt(prot.dataset.uid);
      const field = prot.dataset.field;
      viewProtected(uid, field);
    }
  });

  /* ------ EVENTOS MODAL ------ */
  addBtn.addEventListener("click", () => openModal(null));
  modalClose.addEventListener("click", closeModal);
  modalCancel.addEventListener("click", closeModal);
  modalSave.addEventListener("click", saveUser);
  modalOverlay.addEventListener("click", (e) => {
    if (e.target === modalOverlay) closeModal();
  });

  /* ------ EVENTOS SEGURIDAD ------ */
  secClose.addEventListener("click", closeSecurity);
  secCancel.addEventListener("click", closeSecurity);
  secConfirm.addEventListener("click", confirmSecurity);
  secOverlay.addEventListener("click", (e) => {
    if (e.target === secOverlay) closeSecurity();
  });
  masterInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") confirmSecurity();
  });

  /* ------ EVENTOS ELIMINAR ------ */
  delClose.addEventListener("click", closeDelete);
  delCancel.addEventListener("click", closeDelete);
  delConfirm.addEventListener("click", confirmDelete);
  delOverlay.addEventListener("click", (e) => {
    if (e.target === delOverlay) closeDelete();
  });

  /* ------ FILTROS ------ */
  searchInput.addEventListener("input", renderTable);
  filterRol.addEventListener("change", renderTable);
  filterStatus.addEventListener("change", renderTable);

  /* ------ ENTER EN MODAL ------ */
  [fNombre, fApellidos, fDni, fCelular, fCorreo, fUser, fPassword].forEach(
    (inp) => {
      inp?.addEventListener("keydown", (e) => {
        if (e.key === "Enter") saveUser();
      });
    },
  );

  /* ------ CERRAR CON ESC ------ */
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      closeModal();
      closeSecurity();
      closeDelete();
    }
  });

  /* ------ INIT ------ */
  /* Carga usuarios al entrar a la pantalla */
  document.querySelectorAll(".nav-item[data-screen]").forEach((item) => {
    item.addEventListener("click", () => {
      if (item.dataset.screen === "gestion-usuarios") loadUsers();
    });
  });
})(); /* fin GestionUsuarios */

/* ============================================================
   MÓDULO VIDEOS DE REDES SOCIALES
   ============================================================ */
(function VideosRedes() {
  const API = window.location.origin;
  function token() {
    return localStorage.getItem("qubira_token") || "";
  }
  async function apiFetch(path, opts = {}) {
    const res = await fetch(API + path, {
      ...opts,
      headers: { Authorization: "Bearer " + token(), ...(opts.headers || {}) },
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Error " + res.status);
    return data;
  }

  const RED_META = {
    instagram: { icon: "📸", label: "Instagram" },
    tiktok: { icon: "🎵", label: "TikTok" },
    facebook: { icon: "📘", label: "Facebook" },
    youtube: { icon: "▶️", label: "YouTube" },
    otro: { icon: "🔗", label: "Otro" },
  };

  let videos = [];
  let deleteTargetId = null;

  /* ------ ELEMENTOS DOM ------ */
  const grid = document.getElementById("vr-grid");
  const emptyState = document.getElementById("vr-empty");
  const searchInput = document.getElementById("vr-search-input");
  const filterRed = document.getElementById("vr-filter-red");

  const modalOverlay = document.getElementById("vr-modal-overlay");
  const modalClose = document.getElementById("vr-modal-close");
  const modalCancel = document.getElementById("vr-modal-cancel");
  const modalSave = document.getElementById("vr-modal-save");
  const addBtn = document.getElementById("vr-add-btn");

  const fTitulo = document.getElementById("vr-f-titulo");
  const fRed = document.getElementById("vr-f-red");
  const fFile = document.getElementById("vr-f-file");
  const fLink = document.getElementById("vr-f-link");

  const progressWrap = document.getElementById("vr-progress-wrap");
  const progressFill = document.getElementById("vr-progress-fill");
  const progressText = document.getElementById("vr-progress-text");

  const delOverlay = document.getElementById("vr-delete-overlay");
  const delClose = document.getElementById("vr-delete-close");
  const delCancel = document.getElementById("vr-delete-cancel");
  const delConfirm = document.getElementById("vr-delete-confirm");
  const delName = document.getElementById("vr-delete-name");

  if (!grid) return; /* la pantalla de videos no está presente */

  /* ------ CARGA ------ */
  async function loadVideos() {
    try {
      const data = await apiFetch("/api/videos/admin");
      videos = data.videos;
      renderGrid();
      renderStats();
    } catch (err) {
      console.error("[VIDEOS] loadVideos:", err.message);
      grid.innerHTML = `<div class="gu-empty-state"><div class="gu-es-icon">⚠️</div><p>No se pudieron cargar los videos.</p></div>`;
    }
  }

  function renderStats() {
    document.getElementById("vr-stat-total").textContent = videos.length;
    document.getElementById("vr-stat-published").textContent = videos.filter(
      (v) => v.publicado,
    ).length;
    document.getElementById("vr-stat-hidden").textContent = videos.filter(
      (v) => !v.publicado,
    ).length;
  }

  function getFiltered() {
    const q = (searchInput.value || "").toLowerCase().trim();
    const r = filterRed.value;
    return videos.filter((v) => {
      const matchQ = !q || v.titulo.toLowerCase().includes(q);
      const matchR = !r || v.red === r;
      return matchQ && matchR;
    });
  }

  function renderGrid() {
    const list = getFiltered();
    grid.innerHTML = "";
    emptyState.style.display = list.length ? "none" : "block";

    list.forEach((v) => {
      const meta = RED_META[v.red] || RED_META.otro;
      const card = document.createElement("div");
      card.className = "vr-card";
      card.innerHTML = `
        <div class="vr-card-media">
          <video src="${v.video_url}" ${v.thumbnail_url ? `poster="${v.thumbnail_url}"` : ""} muted loop playsinline preload="metadata"></video>
          <span class="vr-badge">${meta.icon} ${meta.label}</span>
          <span class="vr-status ${v.publicado ? "is-on" : "is-off"}">${v.publicado ? "Publicado" : "Oculto"}</span>
        </div>
        <div class="vr-card-body">
          <strong>${escapeHtml(v.titulo)}</strong>
          <a class="vr-link" href="${v.enlace_red}" target="_blank" rel="noopener noreferrer">${escapeHtml(v.enlace_red)}</a>
          <div class="vr-card-actions">
            <button type="button" class="vr-icon-btn" data-action="toggle" data-id="${v.id}">
              ${v.publicado ? "🙈 Ocultar" : "👁 Publicar"}
            </button>
            <button type="button" class="vr-icon-btn vr-icon-btn--danger" data-action="delete" data-id="${v.id}" data-titulo="${escapeHtml(v.titulo)}">
              🗑 Eliminar
            </button>
          </div>
        </div>
      `;
      const mediaEl = card.querySelector(".vr-card-media");
      const videoEl = card.querySelector("video");
      mediaEl.addEventListener("mouseenter", () => videoEl.play().catch(() => {}));
      mediaEl.addEventListener("mouseleave", () => {
        videoEl.pause();
        videoEl.currentTime = 0;
      });
      grid.appendChild(card);
    });
  }

  function escapeHtml(s) {
    return String(s).replace(
      /[&<>"']/g,
      (c) =>
        ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c],
    );
  }

  /* ------ MODAL SUBIR ------ */
  function openModal() {
    fTitulo.value = "";
    fRed.value = "instagram";
    fFile.value = "";
    fLink.value = "";
    progressWrap.classList.remove("is-active");
    progressFill.style.width = "0%";
    progressText.textContent = "Subiendo… 0%";
    modalSave.disabled = false;
    modalOverlay.classList.add("open");
  }
  function closeModal() {
    modalOverlay.classList.remove("open");
  }

  function uploadVideo() {
    if (!fFile.files.length) {
      alert("Selecciona un archivo de video.");
      return;
    }
    if (!fLink.value.trim()) {
      alert('El link de "Visitar red" es obligatorio.');
      return;
    }

    const form = new FormData();
    form.append("video", fFile.files[0]);
    form.append("titulo", fTitulo.value.trim());
    form.append("red", fRed.value);
    form.append("enlace_red", fLink.value.trim());

    const xhr = new XMLHttpRequest();
    xhr.open("POST", API + "/api/videos");
    xhr.setRequestHeader("Authorization", "Bearer " + token());

    modalSave.disabled = true;
    progressWrap.classList.add("is-active");

    xhr.upload.addEventListener("progress", (e) => {
      if (!e.lengthComputable) return;
      const pct = Math.round((e.loaded / e.total) * 100);
      progressFill.style.width = pct + "%";
      progressText.textContent = "Subiendo… " + pct + "%";
    });

    xhr.onload = () => {
      modalSave.disabled = false;
      let data = {};
      try {
        data = JSON.parse(xhr.responseText);
      } catch (_) {}
      if (xhr.status >= 200 && xhr.status < 300 && data.ok) {
        closeModal();
        loadVideos();
      } else {
        alert("Error: " + (data.error || "No se pudo subir el video"));
        progressWrap.classList.remove("is-active");
      }
    };
    xhr.onerror = () => {
      modalSave.disabled = false;
      progressWrap.classList.remove("is-active");
      alert("Error de conexión al subir el video.");
    };
    xhr.send(form);
  }

  /* ------ TOGGLE / DELETE ------ */
  async function toggleVideo(id) {
    try {
      await apiFetch(`/api/videos/${id}/estado`, { method: "PATCH" });
      await loadVideos();
    } catch (err) {
      alert("Error: " + err.message);
    }
  }

  function openDelete(id, titulo) {
    deleteTargetId = id;
    delName.textContent = titulo || "Video";
    delOverlay.classList.add("open");
  }
  function closeDelete() {
    delOverlay.classList.remove("open");
    deleteTargetId = null;
  }
  async function confirmDelete() {
    if (!deleteTargetId) return;
    try {
      await apiFetch(`/api/videos/${deleteTargetId}`, { method: "DELETE" });
      closeDelete();
      await loadVideos();
    } catch (err) {
      alert("Error al eliminar: " + err.message);
    }
  }

  grid.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-action]");
    if (!btn) return;
    const id = btn.dataset.id;
    if (btn.dataset.action === "toggle") toggleVideo(id);
    if (btn.dataset.action === "delete") openDelete(id, btn.dataset.titulo);
  });

  addBtn?.addEventListener("click", openModal);
  modalClose?.addEventListener("click", closeModal);
  modalCancel?.addEventListener("click", closeModal);
  modalSave?.addEventListener("click", uploadVideo);
  modalOverlay?.addEventListener("click", (e) => {
    if (e.target === modalOverlay) closeModal();
  });

  delClose?.addEventListener("click", closeDelete);
  delCancel?.addEventListener("click", closeDelete);
  delConfirm?.addEventListener("click", confirmDelete);
  delOverlay?.addEventListener("click", (e) => {
    if (e.target === delOverlay) closeDelete();
  });

  searchInput?.addEventListener("input", renderGrid);
  filterRed?.addEventListener("change", renderGrid);

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      closeModal();
      closeDelete();
    }
  });

  document.querySelectorAll(".nav-item[data-screen]").forEach((item) => {
    item.addEventListener("click", () => {
      if (item.dataset.screen === "videos") loadVideos();
    });
  });
})(); /* fin VideosRedes */
