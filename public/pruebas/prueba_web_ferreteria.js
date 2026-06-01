// ================================================
// FERREMART v2 - script.js
// Con IA simulada, Dashboard por Planes y más
// ================================================

// ===== PRODUCTOS =====
const products = [
  {id:1,brand:"SAPOLIO",name:"Lejía Sapolio Original 4.8 Kg",price:10.9,old:16.9,icon:"🧴",sold:87,cat:"limpieza"},
  {id:2,brand:"SAPOLIO",name:"COMBO Lejía Sapolio 4.8kg + Lavavajilla en pasta",price:11.0,old:16.9,icon:"🧴",sold:65,cat:"limpieza"},
  {id:3,brand:"CLOROX",name:"Lejía Clorox Tradicional 2 Kg",price:6.5,old:8.9,icon:"🧼",sold:72,cat:"limpieza"},
  {id:4,brand:"SOL CLEAN",name:"Lejía 5% Sol Clean 4 Lt",price:24.0,old:29.0,icon:"🧴",sold:41,cat:"limpieza"},
  {id:5,brand:"SIKA",name:"Silicona para vidrios transparente 280ml",price:15.9,old:20.0,icon:"🧪",sold:55,cat:"ferreteria"},
  {id:6,brand:"DIMFER",name:"Puerta Decor 40mm 65x207cm",price:199.9,old:249.0,icon:"🚪",sold:18,cat:"ferreteria"},
  {id:7,brand:"ORANGE",name:"Malla Mosquitera para cama 1.5m x 2m",price:16.9,old:22.0,icon:"🛏️",sold:33,cat:"ferreteria"},
  {id:8,brand:"DIMFER",name:"Cerradura digital inteligente con huella",price:169.0,old:220.0,icon:"🔐",sold:29,cat:"ferreteria"},
  {id:9,brand:"STANLEY",name:"Taladro percutor eléctrico 750W",price:249.0,old:320.0,icon:"🔧",sold:44,cat:"herramientas"},
  {id:10,brand:"TRUPER",name:"Juego de llaves mixtas 12 piezas",price:89.0,old:120.0,icon:"🔩",sold:61,cat:"herramientas"},
  {id:11,brand:"PHILIPS",name:"Foco LED 9W luz cálida E27 pack x4",price:28.9,old:39.0,icon:"💡",sold:95,cat:"iluminacion"},
  {id:12,brand:"3M",name:"Cinta de embalaje transparente 48mm x50m",price:8.5,old:12.0,icon:"📦",sold:110,cat:"ferreteria"}
];

// ===== MEGA MENU DATA =====
const megaData = {
  limpieza:{icon:"🧹",title:"Limpieza",cols:[
    {title:"Productos",items:["Detergentes y jabones","Lavavajillas","Lejías","Desinfectantes","Limpiadores","Limpia vidrios"]},
    {title:"Útiles",items:["Baldes y bateas","Bolsas de basura","Escobas","Trapeadores","Paños multiusos"]}
  ]},
  tecnologia:{icon:"💻",title:"Tecnología",cols:[
    {title:"Computadoras",items:["Laptops","PCs escritorio","Tablets","Monitores"]},
    {title:"Teléfonos",items:["Smartphones","Auriculares","Cargadores","Accesorios"]}
  ]},
  electrohogar:{icon:"🏠",title:"Electrohogar",cols:[
    {title:"Frío",items:["Refrigeradoras","Congeladoras","Frigobar"]},
    {title:"Lavandería",items:["Lavadoras","Secadoras","Lavadora-secadora"]},
    {title:"Cocción",items:["Cocinas","Campanas","Hornos microondas"]}
  ]},
  herramientas:{icon:"🔧",title:"Herramientas",cols:[
    {title:"Eléctricas",items:["Taladros","Sierras","Lijadoras","Rotomartillos"]},
    {title:"Manuales",items:["Llaves","Destornilladores","Martillos","Alicates"]}
  ]},
  construccion:{icon:"🧱",title:"Construcción",cols:[
    {title:"Materiales",items:["Cemento","Arena","Ladrillo","Mallas","Varillas"]},
    {title:"Acabados",items:["Pisos cerámicos","Porcelanato","Mayólicas"]}
  ]},
  iluminacion:{icon:"💡",title:"Iluminación",cols:[
    {title:"Interior",items:["Focos LED","Tubos fluorescentes","Paneles LED"]},
    {title:"Exterior",items:["Reflectores","Focos de jardín","Faroles","Tiras LED"]}
  ]},
  ferreteria:{icon:"🚪",title:"Ferretería y Puertas",cols:[
    {title:"Puertas",items:["Puertas MDF","Puertas de madera","Puertas metálicas"]},
    {title:"Ferretería",items:["Cerraduras","Bisagras","Tornillos","Silicona"]}
  ]},
  jardineria:{icon:"🌿",title:"Jardinería",cols:[
    {title:"Plantas",items:["Plantas ornamentales","Plantas de interior","Semillas"]},
    {title:"Herramientas",items:["Mangueras","Aspersores","Palas","Tijeras de podar"]}
  ]},
  pinturas:{icon:"🎨",title:"Pinturas y acabados",cols:[
    {title:"Pinturas",items:["Pintura látex","Pintura esmalte","Barniz"]},
    {title:"Accesorios",items:["Rodillos","Brochas","Lijas","Masilla"]}
  ]},
  muebles:{icon:"🛋️",title:"Muebles",cols:[
    {title:"Sala",items:["Sofás","Sillas","Mesas de centro","Estantes"]},
    {title:"Dormitorio",items:["Camas","Colchones","Cómodas","Closets"]}
  ]},
  bano:{icon:"🚿",title:"Baño",cols:[
    {title:"Sanitarios",items:["Inodoros","Lavatorios","Duchas","Bañeras"]},
    {title:"Accesorios",items:["Grifería","Espejos","Toalleros"]}
  ]},
  cocina:{icon:"🍳",title:"Cocina",cols:[
    {title:"Electrodomésticos",items:["Licuadoras","Batidoras","Cafeteras"]},
    {title:"Vajilla",items:["Ollas","Sartenes","Cubiertos","Vasos"]}
  ]},
  automotriz:{icon:"🚗",title:"Automotriz",cols:[
    {title:"Mantenimiento",items:["Aceite de motor","Filtros","Bujías"]},
    {title:"Accesorios",items:["Perfumes","Fundas","Limpiadores"]}
  ]},
  mascotas:{icon:"🐾",title:"Mascotas",cols:[
    {title:"Perros",items:["Alimento perros","Juguetes","Correas","Camas"]},
    {title:"Gatos",items:["Alimento gatos","Areneros","Rascadores"]}
  ]}
};

// ===== PLANES - ACUMULATIVOS =====
const PLAN_BASICO = [
  {icon:"📱",name:"Aplicativo Web responsivo",desc:"Sitio web optimizado para todos los dispositivos con enfoque comercial"},
  {icon:"🎨",name:"Identidad digital de marca",desc:"Gestión visual y estratégica de la marca en entorno digital"},
  {icon:"📦",name:"Catálogo dinámico",desc:"Listado de productos/servicios con actualización en tiempo real"},
  {icon:"📝",name:"Formulario inteligente de contacto",desc:"Captura estructurada de leads con validación automática"},
  {icon:"🔐",name:"Autenticación de usuarios (Login)",desc:"Gestión de acceso seguro para clientes o administradores"},
  {icon:"📊",name:"Dashboard operativo básico",desc:"Visualización de métricas esenciales del negocio"},
  {icon:"✏️",name:"Gestión de contenido",desc:"Administración autónoma de contenido digital"},
  {icon:"📅",name:"Agendamiento digital",desc:"Base de reservas con disponibilidad configurable"},
  {icon:"🔔",name:"Sistema de notificaciones básicas",desc:"Alertas automatizadas por eventos simples"},
  {icon:"☁️",name:"Infraestructura cloud (Hosting)",desc:"Despliegue en servidores escalables en la nube"},
  {icon:"🗄️",name:"Base de datos estructurada",desc:"Almacenamiento seguro y organizado de información"},
  {icon:"📲",name:"Integración con redes sociales",desc:"Conexión con plataformas para difusión y tráfico"},
  {icon:"💬",name:"Chat interactivo básico",desc:"Comunicación directa con usuarios"},
  {icon:"📡",name:"Publicador de contenido dinámico",desc:"Actualización de información en tiempo real"},
  {icon:"📐",name:"Optimización responsive avanzada",desc:"Adaptación UI/UX multiplataforma"}
];

const PLAN_PRO_NEW = [
  {icon:"🛒",name:"E-commerce completo",desc:"Plataforma de ventas online con flujo completo"},
  {icon:"💳",name:"Pasarela de pagos multicanal",desc:"Integración con múltiples métodos de pago"},
  {icon:"🧾",name:"Facturación electrónica integrada",desc:"Generación automática de comprobantes legales"},
  {icon:"📉",name:"Gestión inteligente de inventario",desc:"Control en tiempo real con trazabilidad"},
  {icon:"⚡",name:"Sistema de alertas predictivas",desc:"Notificaciones anticipadas de eventos críticos"},
  {icon:"👥",name:"CRM de clientes",desc:"Base de datos avanzada de clientes con historial"},
  {icon:"📋",name:"Historial transaccional completo",desc:"Registro detallado de operaciones"},
  {icon:"🎯",name:"Segmentación avanzada de clientes",desc:"Clasificación por comportamiento y consumo"},
  {icon:"📲",name:"Notificaciones push inteligentes",desc:"Mensajes personalizados automatizados"},
  {icon:"📧",name:"Automatización de correos (Emailing)",desc:"Campañas automatizadas de comunicación"},
  {icon:"🏆",name:"Sistema de fidelización gamificado",desc:"Recompensas y puntos para retención"},
  {icon:"🏷️",name:"Motor de promociones dinámicas",desc:"Creación de descuentos automatizados"},
  {icon:"📈",name:"Dashboard analítico avanzado",desc:"Visualización profunda de KPIs"},
  {icon:"🌐",name:"Arquitectura multiusuario escalable",desc:"Gestión concurrente de usuarios"},
  {icon:"🔑",name:"Sistema de roles y permisos jerárquicos",desc:"Control granular de accesos"},
  {icon:"📊",name:"Generador de reportes automatizados",desc:"Informes en tiempo real exportables"},
  {icon:"🗺️",name:"Tracking logístico en tiempo real",desc:"Seguimiento de pedidos o servicios"},
  {icon:"📍",name:"Geolocalización inteligente",desc:"Identificación geográfica avanzada"},
  {icon:"📅",name:"Agenda automatizada inteligente",desc:"Optimización de citas y disponibilidad"},
  {icon:"💬",name:"Chat en vivo omnicanal",desc:"Comunicación integrada en múltiples canales"},
  {icon:"🔗",name:"Integración API empresarial",desc:"Conexión con sistemas externos"},
  {icon:"💾",name:"Sistema de backup inteligente",desc:"Copias automáticas seguras"},
  {icon:"🔄",name:"Gestión de datos masivos (ETL)",desc:"Importación/exportación estructurada"}
];

const PLAN_PREMIUM_NEW = [
  {icon:"🤖",name:"Motor de Inteligencia Artificial",desc:"Predicción, automatización y aprendizaje continuo"},
  {icon:"🎯",name:"Sistema de recomendaciones predictivas",desc:"Sugerencias personalizadas en tiempo real"},
  {icon:"🧠",name:"Análisis de comportamiento avanzado",desc:"Modelado de patrones de usuario"},
  {icon:"📈",name:"Predicción de ventas con IA",desc:"Estimación de ingresos futuros"},
  {icon:"⚙️",name:"Automatización total de procesos (RPA)",desc:"Ejecución autónoma de tareas repetitivas"},
  {icon:"🔄",name:"Workflows inteligentes configurables",desc:"Flujos automatizados adaptables"},
  {icon:"🤖",name:"Asistente virtual cognitivo",desc:"Chatbot con IA contextual"},
  {icon:"👤",name:"Reconocimiento facial biométrico",desc:"Identificación avanzada de usuarios"},
  {icon:"🎙️",name:"Interacción por voz (Voice AI)",desc:"Control mediante comandos de voz"},
  {icon:"✍️",name:"Firma digital biométrica avanzada",desc:"Validación legal con biometría"},
  {icon:"📡",name:"Integración IoT empresarial",desc:"Conexión con dispositivos físicos"},
  {icon:"🛰️",name:"Monitoreo en tiempo real 24/7",desc:"Seguimiento continuo del sistema"},
  {icon:"📊",name:"KPIs dinámicos personalizados",desc:"Métricas adaptadas al negocio"},
  {icon:"🗺️",name:"Heatmaps de comportamiento",desc:"Mapas de interacción del usuario"},
  {icon:"🔻",name:"Embudo de conversión automatizado",desc:"Optimización del proceso de venta"},
  {icon:"🎮",name:"Gamificación avanzada",desc:"Incentivos estratégicos"},
  {icon:"💰",name:"Sistema de suscripciones SaaS",desc:"Gestión de pagos recurrentes"},
  {icon:"🏟️",name:"Gestión inteligente de aforo",desc:"Control de capacidad en tiempo real"},
  {icon:"🚛",name:"Logística optimizada con IA",desc:"Rutas y entregas eficientes"},
  {icon:"🔀",name:"Asignación automática de recursos",desc:"Distribución inteligente"},
  {icon:"🛡️",name:"Seguridad cibernética avanzada",desc:"Protección de alto nivel"},
  {icon:"🔒",name:"Encriptación de datos end-to-end",desc:"Seguridad total de información"},
  {icon:"🔏",name:"Gestión avanzada de sesiones",desc:"Control total de accesos"},
  {icon:"📋",name:"Auditoría digital completa",desc:"Registro detallado del sistema"},
  {icon:"🪙",name:"Sistema de tokens de seguridad",desc:"Autenticación avanzada"},
  {icon:"📴",name:"Modo offline inteligente sincronizado",desc:"Operación sin conexión con sincronización"},
  {icon:"🥽",name:"Realidad aumentada aplicada",desc:"Visualización interactiva"},
  {icon:"🌐",name:"Realidad virtual empresarial",desc:"Simulación inmersiva"},
  {icon:"🌍",name:"Traducción automática en tiempo real",desc:"Soporte multilenguaje"},
  {icon:"✨",name:"Generación de contenido con IA",desc:"Automatización de marketing"}
];

// PLAN ACUMULATIVO: PRO = BASICO + PRO_NEW, PREMIUM = BASICO + PRO_NEW + PREMIUM_NEW
const PLANS = {
  basico: { modules: PLAN_BASICO, color:'#27ae60', label:'BÁSICO', icon:'📱', count: PLAN_BASICO.length },
  pro: { modules: [...PLAN_BASICO,...PLAN_PRO_NEW], newModules: PLAN_PRO_NEW, color:'#ff6900', label:'PRO', icon:'⚡', count: PLAN_BASICO.length + PLAN_PRO_NEW.length },
  premium: { modules: [...PLAN_BASICO,...PLAN_PRO_NEW,...PLAN_PREMIUM_NEW], newModules: PLAN_PREMIUM_NEW, color:'#7b2ff7', label:'PREMIUM', icon:'👑', count: PLAN_BASICO.length + PLAN_PRO_NEW.length + PLAN_PREMIUM_NEW.length }
};

// ===== ESTADO =====
let cart = [];
let currentBanner = 0;
const totalBanners = 3;
let currentDetailQty = 1;
let currentDetailProduct = null;
let currentDashboardPlan = 'basico';
let currentPlanTab = 'basico';

// ===== RENDER PRODUCTOS =====
function renderProducts(list = products, containerId = 'productGrid') {
  const grid = document.getElementById(containerId);
  if (!grid) return;
  grid.innerHTML = '';
  list.forEach(p => {
    const disc = Math.round(((p.old - p.price) / p.old) * 100);
    const card = document.createElement('div');
    card.className = 'product-card';
    card.innerHTML = `
      <div class="card-badge">-${disc}%</div>
      ${Math.random() > 0.5 ? '<div class="ai-badge-card">🤖 IA Top</div>' : ''}
      <div class="product-img">${p.icon}</div>
      <p class="prod-brand">${p.brand}</p>
      <h3>${p.name}</h3>
      <div class="price-row">
        <span class="price">S/ ${p.price.toFixed(2)}</span>
        <span class="old-price">S/ ${p.old.toFixed(2)}</span>
        <span class="discount-badge">-${disc}%</span>
      </div>
      <div class="prod-tags">
        <span class="prod-tag green">Llega mañana</span>
        <span class="prod-tag">Retira mañana</span>
      </div>
      <button class="add-btn" onclick="addToCart(${p.id});event.stopPropagation()">+ Agregar</button>`;
    card.addEventListener('click', () => showDetail(p.id));
    grid.appendChild(card);
  });
  const el = document.getElementById('productCount');
  if (el) el.textContent = list.length;
}

function renderFeatured() { renderProducts(products.slice(0, 8), 'featuredGrid'); }
function renderRelated(excludeId) { renderProducts(products.filter(p => p.id !== excludeId).slice(0, 4), 'relatedGrid'); }

// ===== CARRITO =====
function addToCart(id) {
  const p = products.find(x => x.id === id);
  if (!p) return;
  const ex = cart.find(x => x.id === id);
  if (ex) ex.qty++; else cart.push({...p, qty:1});
  renderCart(); renderCartPage(); updateCartCount();
  showToast(`🛒 ${p.name.slice(0,30)}... añadido`);
  openCartDrawer();
}
function changeQty(id, d) {
  const it = cart.find(p => p.id === id);
  if (!it) return;
  it.qty += d;
  if (it.qty <= 0) cart = cart.filter(p => p.id !== id);
  renderCart(); renderCartPage(); updateCartCount();
}
function removeItem(id) {
  cart = cart.filter(p => p.id !== id);
  renderCart(); renderCartPage(); updateCartCount();
}
function updateCartCount() {
  const t = cart.reduce((s, i) => s + i.qty, 0);
  document.getElementById('cartCount').textContent = t;
  document.getElementById('cartDrawerCount').textContent = `(${t} items)`;
}
function renderCart() {
  const c = document.getElementById('cartItems');
  if (!c) return;
  c.innerHTML = '';
  if (!cart.length) {
    c.innerHTML = '<div style="text-align:center;padding:40px;color:#aaa"><div style="font-size:52px">🛒</div><p style="margin-top:12px">Tu carrito está vacío</p></div>';
    document.getElementById('cartTotal').textContent = 'S/ 0.00';
    return;
  }
  let total = 0;
  cart.forEach(it => {
    total += it.price * it.qty;
    const d = document.createElement('div');
    d.className = 'drawer-item';
    d.innerHTML = `
      <div class="drawer-item-icon">${it.icon}</div>
      <div class="drawer-item-info">
        <div class="drawer-item-name">${it.name.slice(0,38)}${it.name.length>38?'...':''}</div>
        <div class="drawer-item-brand">${it.brand}</div>
        <div class="drawer-item-price">S/ ${(it.price*it.qty).toFixed(2)}</div>
        <div class="drawer-item-controls">
          <button class="dqb" onclick="changeQty(${it.id},-1)">-</button>
          <span style="font-weight:700;font-size:13px">${it.qty}</span>
          <button class="dqb" onclick="changeQty(${it.id},1)">+</button>
          <button class="drm" onclick="removeItem(${it.id})">🗑️</button>
        </div>
      </div>`;
    c.appendChild(d);
  });
  document.getElementById('cartTotal').textContent = `S/ ${total.toFixed(2)}`;
}
function renderCartPage() {
  const c = document.getElementById('cartPageItems');
  if (!c) return;
  c.innerHTML = '';
  if (!cart.length) {
    c.innerHTML = '<div style="text-align:center;padding:60px;color:#aaa"><div style="font-size:72px">🛒</div><p style="margin-top:16px;font-size:18px">Tu carrito está vacío</p><button class="btn-primary" style="margin-top:18px" onclick="showPage(\'catalog\')">Ver productos</button></div>';
    ['summarySubtotal','summaryDiscount','summaryTotal'].forEach(id => { const e = document.getElementById(id); if(e) e.textContent = id==='summaryDiscount'?'-S/ 0.00':'S/ 0.00'; });
    renderAIUpsell();
    return;
  }
  let sub = 0, orig = 0;
  cart.forEach(it => {
    sub += it.price * it.qty; orig += it.old * it.qty;
    const d = document.createElement('div');
    d.className = 'cart-page-item';
    d.innerHTML = `
      <div class="item-icon">${it.icon}</div>
      <div class="item-info">
        <div class="item-brand">${it.brand}</div>
        <div class="item-name">${it.name}</div>
        <div style="color:#aaa;font-size:12px">S/ ${it.price.toFixed(2)} c/u</div>
      </div>
      <div class="item-actions">
        <button class="item-qty-btn" onclick="changeQty(${it.id},-1)">-</button>
        <span class="item-qty">${it.qty}</span>
        <button class="item-qty-btn" onclick="changeQty(${it.id},1)">+</button>
        <button class="item-remove" onclick="removeItem(${it.id})">🗑️</button>
        <span class="item-subtotal">S/ ${(it.price*it.qty).toFixed(2)}</span>
      </div>`;
    c.appendChild(d);
  });
  const sav = orig - sub;
  document.getElementById('summarySubtotal').textContent = `S/ ${orig.toFixed(2)}`;
  document.getElementById('summaryDiscount').textContent = `-S/ ${sav.toFixed(2)}`;
  document.getElementById('summaryTotal').textContent = `S/ ${sub.toFixed(2)}`;
  renderAIUpsell();
}
function renderAIUpsell() {
  const c = document.getElementById('aiUpsellItems');
  if (!c) return;
  const notInCart = products.filter(p => !cart.find(i => i.id === p.id)).slice(0, 3);
  c.innerHTML = notInCart.map(p => `
    <div class="upsell-item" onclick="addToCart(${p.id})">
      <div class="upsell-item-icon">${p.icon}</div>
      <div class="upsell-item-info">
        <div class="upsell-item-name">${p.name.slice(0,30)}...</div>
        <div class="upsell-item-price">S/ ${p.price.toFixed(2)}</div>
      </div>
      <button class="upsell-add" onclick="addToCart(${p.id});event.stopPropagation()">+ Agregar</button>
    </div>`).join('');
}

// ===== NAVEGACIÓN =====
function showPage(id) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  const page = document.getElementById(`page-${id}`);
  if (page) page.classList.add('active');
  window.scrollTo(0, 0);
  if (id === 'catalog') renderProducts();
  if (id === 'cart') renderCartPage();
}

// ===== DETALLE =====
function showDetail(id) {
  const p = products.find(x => x.id === id);
  if (!p) return;
  currentDetailProduct = p;
  currentDetailQty = 1;
  const disc = Math.round(((p.old - p.price) / p.old) * 100);
  document.getElementById('detailBrand').textContent = p.brand;
  document.getElementById('detailName').textContent = p.name;
  document.getElementById('detailSku').textContent = `FRR-${String(p.id).padStart(5,'0')}`;
  document.getElementById('detailPrice').textContent = `S/ ${p.price.toFixed(2)}`;
  document.getElementById('detailOld').textContent = `S/ ${p.old.toFixed(2)}`;
  document.getElementById('detailDisc').textContent = `-${disc}%`;
  document.getElementById('detailQty').textContent = 1;
  document.getElementById('detailMainImg').innerHTML = `<span style="font-size:110px">${p.icon}</span>`;
  document.getElementById('detailDesc').textContent = `${p.name} es un producto de alta calidad de la marca ${p.brand}. Ideal para uso doméstico y profesional. Garantía de satisfacción completa.`;
  document.getElementById('btnAddDetail').onclick = () => addToCart(p.id);
  // AI Review
  generateAIReview(p);
  // Thumbs
  const thumbs = document.getElementById('detailThumbs');
  thumbs.innerHTML = '';
  for(let i=0;i<4;i++){
    const d = document.createElement('div');
    d.className = `thumb-img ${i===0?'active':''}`;
    d.innerHTML = p.icon;
    d.onclick = () => { thumbs.querySelectorAll('.thumb-img').forEach(x=>x.classList.remove('active')); d.classList.add('active'); };
    thumbs.appendChild(d);
  }
  renderRelated(id);
  showPage('detail');
}
function changeDetailQty(d) {
  currentDetailQty = Math.max(1, currentDetailQty + d);
  document.getElementById('detailQty').textContent = currentDetailQty;
}

// ===== DASHBOARD =====
function openDashboard() {
  document.getElementById('dashboardModal').classList.add('show');
  renderDashboard(currentDashboardPlan);
}

function switchDashboardPlan(plan) {
  currentDashboardPlan = plan;
  // Update buttons
  ['basico','pro','premium'].forEach(p => {
    const btn = document.getElementById(`planBtn${p.charAt(0).toUpperCase()+p.slice(1)}`);
    if (btn) btn.classList.toggle('active', p === plan);
  });
  renderDashboard(plan);
}

function renderDashboard(plan) {
  const planData = PLANS[plan];
  const body = document.getElementById('dashboardBody');
  const infoBar = document.getElementById('planInfoBar');
  
  // Update info bar
  infoBar.innerHTML = `
    <span class="plan-info-badge ${plan}">${planData.label}</span>
    <span class="plan-info-text">Este plan incluye</span>
    <span class="plan-info-modules">${planData.count} módulos activos</span>
    ${plan==='pro'?`<span class="plan-info-text">· +${PLAN_PRO_NEW.length} módulos Pro sobre el Básico</span>`:''}
    ${plan==='premium'?`<span class="plan-info-text">· +${PLAN_PREMIUM_NEW.length} módulos Premium sobre Pro</span>`:''}
  `;

  // KPIs always visible (BÁSICO)
  const kpis = [
    {icon:'💰',label:'Ventas del día',value:'S/ 4,580',trend:'+12%',type:'up',bar:72},
    {icon:'📦',label:'Pedidos pendientes',value:'24',trend:'Revisar',type:'warn',bar:45},
    {icon:'🗄️',label:'Productos en stock',value:'1,240',trend:'Activos',type:'up',bar:88},
    {icon:'👥',label:'Clientes registrados',value:'320',trend:'+8 hoy',type:'up',bar:60},
  ];
  const proKpis = [
    {icon:'📈',label:'Conversión',value:'4.8%',trend:'+0.3%',type:'up',bar:48},
    {icon:'🏆',label:'Ticket promedio',value:'S/ 89',trend:'+S/5',type:'up',bar:65},
  ];
  const premiumKpis = [
    {icon:'🤖',label:'IA Predicción',value:'92%',trend:'Óptimo',type:'up',bar:92},
    {icon:'🛡️',label:'Seguridad',value:'AAA',trend:'Seguro',type:'up',bar:100},
  ];

  let allKpis = [...kpis];
  let cols = 4;
  if (plan === 'pro' || plan === 'premium') { allKpis = [...kpis,...proKpis]; cols = 6; }
  if (plan === 'premium') { allKpis = [...allKpis,...premiumKpis]; cols = 8; }

  const kpiCols = Math.min(cols, allKpis.length);

  let html = `
    <div class="db-kpis" style="grid-template-columns:repeat(${kpiCols},1fr)">
      ${allKpis.map(k => `
        <div class="db-kpi-card">
          <div class="db-kpi-header">
            <span class="db-kpi-icon">${k.icon}</span>
            <span class="db-kpi-trend ${k.type}">${k.trend}</span>
          </div>
          <div class="db-kpi-value">${k.value}</div>
          <div class="db-kpi-label">${k.label}</div>
          <div class="db-kpi-bar"><div class="db-kpi-bar-fill" style="width:${k.bar}%"></div></div>
        </div>`).join('')}
    </div>`;

  // Ventas chart (BÁSICO+)
  const meses = ['Ene','Feb','Mar','Abr','May','Jun','Jul'];
  const valores = [3200,4100,3800,5200,4580,6100,5800];
  html += `
    <div class="db-two-col">
      <div class="db-card">
        <div class="db-section-title">📊 Ventas por mes <span class="db-badge">BÁSICO</span></div>
        <div class="db-chart-bars">
          ${meses.map((m,i)=>`
            <div class="db-bar-group">
              <div class="db-bar-val">S/${Math.round(valores[i]/100)}00</div>
              <div class="db-bar" style="height:${Math.round((valores[i]/6100)*100)}%"></div>
              <div class="db-bar-label">${m}</div>
            </div>`).join('')}
        </div>
      </div>
      <div class="db-card">
        <div class="db-section-title">📦 Pedidos recientes <span class="db-badge">BÁSICO</span></div>
        <table class="db-table">
          <thead><tr><th>ID</th><th>Cliente</th><th>Total</th><th>Estado</th></tr></thead>
          <tbody>
            <tr><td>#2341</td><td>María R.</td><td>S/ 89.90</td><td><span class="db-status active">Entregado</span></td></tr>
            <tr><td>#2340</td><td>Carlos M.</td><td>S/ 249.00</td><td><span class="db-status process">En camino</span></td></tr>
            <tr><td>#2339</td><td>Ana G.</td><td>S/ 45.50</td><td><span class="db-status pending">Pendiente</span></td></tr>
            <tr><td>#2338</td><td>Luis T.</td><td>S/ 169.00</td><td><span class="db-status active">Entregado</span></td></tr>
            <tr><td>#2337</td><td>Rosa P.</td><td>S/ 320.00</td><td><span class="db-status process">En camino</span></td></tr>
          </tbody>
        </table>
      </div>
    </div>`;

  // PRO: CRM, Inventario, Reportes
  if (plan === 'pro' || plan === 'premium') {
    html += `
      <div class="db-two-col">
        <div class="db-card">
          <div class="db-section-title">👥 CRM - Mejores clientes <span class="db-badge" style="background:rgba(255,105,0,.2);color:#ff6900">PRO</span></div>
          <table class="db-table">
            <thead><tr><th>Cliente</th><th>Compras</th><th>Total</th><th>Segmento</th></tr></thead>
            <tbody>
              <tr><td>María R.</td><td>12</td><td>S/ 1,890</td><td><span class="db-status active">VIP</span></td></tr>
              <tr><td>Carlos M.</td><td>8</td><td>S/ 1,240</td><td><span class="db-status active">Gold</span></td></tr>
              <tr><td>Ana García</td><td>5</td><td>S/ 780</td><td><span class="db-status process">Silver</span></td></tr>
              <tr><td>Luis T.</td><td>3</td><td>S/ 420</td><td><span class="db-status pending">Regular</span></td></tr>
            </tbody>
          </table>
        </div>
        <div class="db-card">
          <div class="db-section-title">📉 Inventario crítico <span class="db-badge" style="background:rgba(255,105,0,.2);color:#ff6900">PRO</span></div>
          <table class="db-table">
            <thead><tr><th>Producto</th><th>Stock</th><th>Estado</th></tr></thead>
            <tbody>
              <tr><td>Lejía Sapolio 4.8kg</td><td>12 uds</td><td><span class="db-status pending">⚠️ Bajo</span></td></tr>
              <tr><td>Foco LED Philips x4</td><td>3 uds</td><td><span class="db-status down" style="background:rgba(204,0,0,.2);color:#cc0000">🔴 Crítico</span></td></tr>
              <tr><td>Taladro Stanley</td><td>28 uds</td><td><span class="db-status active">✅ OK</span></td></tr>
              <tr><td>Cinta 3M 48mm</td><td>56 uds</td><td><span class="db-status active">✅ OK</span></td></tr>
            </tbody>
          </table>
        </div>
      </div>
      <div class="db-card">
        <div class="db-section-title">🗺️ Tracking logístico en tiempo real <span class="db-badge" style="background:rgba(255,105,0,.2);color:#ff6900">PRO</span></div>
        <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:12px;margin-top:10px">
          ${['Lima Centro','Miraflores','San Isidro','Surco'].map((z,i)=>`
            <div style="background:#21262d;border-radius:10px;padding:14px;text-align:center;border:1px solid #30363d">
              <div style="font-size:24px">📍</div>
              <div style="color:white;font-size:12px;font-weight:700;margin:6px 0">${z}</div>
              <div style="color:#ff6900;font-size:18px;font-family:var(--font-head);font-weight:800">${[8,14,6,11][i]} pedidos</div>
              <div style="color:#8b949e;font-size:10px">en ruta</div>
            </div>`).join('')}
        </div>
      </div>`;
  }

  // PREMIUM: IA sections
  if (plan === 'premium') {
    html += `
      <div class="db-ai-section">
        <div class="db-ai-title">🤖 Motor de Inteligencia Artificial <span>PREMIUM</span></div>
        <div class="db-ai-grid">
          <div class="db-ai-card">
            <div class="db-ai-card-icon">🧠</div>
            <div class="db-ai-card-title">Predicción de ventas</div>
            <div class="db-ai-card-val">S/ 6,240</div>
            <div style="color:#8b949e;font-size:10px;margin-top:4px">Próximos 7 días (92% confianza)</div>
          </div>
          <div class="db-ai-card">
            <div class="db-ai-card-icon">🎯</div>
            <div class="db-ai-card-title">Tasa de conversión IA</div>
            <div class="db-ai-card-val">6.8%</div>
            <div style="color:#8b949e;font-size:10px;margin-top:4px">+2% sobre promedio</div>
          </div>
          <div class="db-ai-card">
            <div class="db-ai-card-icon">👤</div>
            <div class="db-ai-card-title">Clientes en riesgo</div>
            <div class="db-ai-card-val">7</div>
            <div style="color:#8b949e;font-size:10px;margin-top:4px">IA identificó posible churn</div>
          </div>
        </div>
      </div>
      <div class="db-two-col">
        <div class="db-card">
          <div class="db-section-title">🗺️ Heatmap de actividad <span class="db-badge" style="background:rgba(123,47,247,.2);color:#7b2ff7">PREMIUM</span></div>
          <div style="color:#8b949e;font-size:11px;margin-bottom:10px">Actividad por hora del día (últimos 7 días)</div>
          <div class="db-heatmap">
            ${['L','M','M','J','V','S','D'].map(d=>`<div style="color:#8b949e;font-size:9px;text-align:center">${d}</div>`).join('')}
            ${Array.from({length:49},(_, i)=>{
              const v = Math.random();
              const alpha = (0.1 + v * 0.9).toFixed(2);
              return `<div class="hm-cell" style="background:rgba(123,47,247,${alpha})">${v>0.8?'🔥':''}</div>`;
            }).join('')}
          </div>
        </div>
        <div class="db-card">
          <div class="db-section-title">⚙️ Automatización RPA <span class="db-badge" style="background:rgba(123,47,247,.2);color:#7b2ff7">PREMIUM</span></div>
          ${[
            {name:'Actualización de precios',runs:'1,240 veces',status:'active'},
            {name:'Notificaciones de stock',runs:'340 veces',status:'active'},
            {name:'Reportes automáticos',runs:'28 veces',status:'active'},
            {name:'Sincronización API',runs:'8,900 veces',status:'process'},
          ].map(r=>`
            <div style="display:flex;align-items:center;gap:10px;padding:9px 0;border-bottom:1px solid #21262d">
              <span style="font-size:18px">🤖</span>
              <div style="flex:1">
                <div style="color:#e6edf3;font-size:12px;font-weight:600">${r.name}</div>
                <div style="color:#8b949e;font-size:10px">${r.runs} ejecutado</div>
              </div>
              <span class="db-status ${r.status}">Activo</span>
            </div>`).join('')}
        </div>
      </div>`;
  }

  // Módulos activos del plan
  html += `
    <div class="db-card">
      <div class="db-section-title">🔧 Módulos activos en este plan (${planData.count}) <span class="db-badge">${planData.label}</span></div>
      <div class="db-modules-grid" style="grid-template-columns:repeat(${plan==='basico'?2:3},1fr)">
        ${planData.modules.map(m => {
          const isNew = plan==='pro' && PLAN_PRO_NEW.includes(m);
          const isPremNew = plan==='premium' && PLAN_PREMIUM_NEW.includes(m);
          const badgeTier = isPremNew ? 'premium' : (isNew ? 'pro' : 'basic');
          const badgeLabel = isPremNew ? 'PREMIUM' : (isNew ? 'PRO' : 'BÁSICO');
          return `
            <div class="db-module-item">
              <div class="db-module-icon">${m.icon}</div>
              <div class="db-module-info">
                <div class="db-module-name">${m.name}</div>
                <div class="db-module-desc">${m.desc.slice(0,50)}${m.desc.length>50?'...':''}</div>
              </div>
              <span class="db-module-badge ${badgeTier}">${badgeLabel}</span>
              <div class="db-module-status"></div>
            </div>`; }).join('')}
      </div>
    </div>`;

  body.innerHTML = html;
}

// ===== MODAL PLANES =====
function openPlansModal(tab = 'basico') {
  document.getElementById('plansModal').classList.add('show');
  switchPlanTab(tab);
}

function switchPlanTab(tab) {
  currentPlanTab = tab;
  ['basico','pro','premium'].forEach(p => {
    document.getElementById(`ptab-${p}`)?.classList.toggle('active', p === tab);
  });
  renderPlanDetail(tab);
}

function renderPlanDetail(plan) {
  const data = PLANS[plan];
  const c = document.getElementById('planDetailContent');
  const colors = {basico:'#27ae60',pro:'#ff6900',premium:'#7b2ff7'};

  let html = `
    <div class="plan-detail-header">
      <span class="plan-detail-icon">${data.icon}</span>
      <div>
        <div class="plan-detail-title" style="color:${colors[plan]}">${data.label}</div>
        <div class="plan-detail-desc">${data.count} módulos activos · ${plan==='basico'?'Ideal para iniciar':''}${plan==='pro'?'Incluye todo el plan Básico + módulos avanzados':''}${plan==='premium'?'Todo lo anterior + tecnología de IA y seguridad avanzada':''}</div>
      </div>
    </div>`;

  // Para PRO y PREMIUM mostramos los inherited primero con label
  if (plan === 'pro') {
    html += `<div class="plan-includes-label">✅ Incluye todo el plan BÁSICO (${PLAN_BASICO.length} módulos)</div>`;
    html += `<div class="plan-modules-grid">`;
    PLAN_BASICO.forEach(m => {
      html += `<div class="plan-module-item"><div class="plan-module-icon">${m.icon}</div><div class="plan-module-text"><h4>${m.name}</h4><p>${m.desc}</p></div></div>`;
    });
    html += `</div>`;
    html += `<div class="plan-includes-label">⚡ Nuevos en plan PRO (${PLAN_PRO_NEW.length} módulos)</div>`;
    html += `<div class="plan-modules-grid">`;
    PLAN_PRO_NEW.forEach(m => {
      html += `<div class="plan-module-item is-new"><div class="plan-module-icon">${m.icon}</div><div class="plan-module-text"><h4>${m.name} <span class="plan-new-tag">NUEVO</span></h4><p>${m.desc}</p></div></div>`;
    });
    html += `</div>`;
  } else if (plan === 'premium') {
    html += `<div class="plan-includes-label">✅ Incluye todo BÁSICO + PRO (${PLAN_BASICO.length + PLAN_PRO_NEW.length} módulos)</div>`;
    html += `<div class="plan-modules-grid">`;
    [...PLAN_BASICO,...PLAN_PRO_NEW].forEach(m => {
      html += `<div class="plan-module-item"><div class="plan-module-icon">${m.icon}</div><div class="plan-module-text"><h4>${m.name}</h4><p>${m.desc}</p></div></div>`;
    });
    html += `</div>`;
    html += `<div class="plan-includes-label">👑 Nuevos en plan PREMIUM (${PLAN_PREMIUM_NEW.length} módulos)</div>`;
    html += `<div class="plan-modules-grid">`;
    PLAN_PREMIUM_NEW.forEach(m => {
      html += `<div class="plan-module-item is-premium-new"><div class="plan-module-icon">${m.icon}</div><div class="plan-module-text"><h4>${m.name} <span class="plan-new-tag prem">PREMIUM</span></h4><p>${m.desc}</p></div></div>`;
    });
    html += `</div>`;
  } else {
    html += `<div class="plan-modules-grid">`;
    PLAN_BASICO.forEach(m => {
      html += `<div class="plan-module-item"><div class="plan-module-icon">${m.icon}</div><div class="plan-module-text"><h4>${m.name}</h4><p>${m.desc}</p></div></div>`;
    });
    html += `</div>`;
  }

  c.innerHTML = html;
}

// Render plan previews en HOME
function renderPlanPreviews() {
  const previews = {
    basicPreview: PLAN_BASICO.slice(0,5),
    proPreview: PLAN_PRO_NEW.slice(0,5),
    premiumPreview: PLAN_PREMIUM_NEW.slice(0,5)
  };
  Object.entries(previews).forEach(([id, list]) => {
    const el = document.getElementById(id);
    if (el) el.innerHTML = list.map(m => `<li>${m.icon} ${m.name}</li>`).join('');
  });
}

// ===== AI FEATURES =====
const aiReviews = [
  "⭐ Excelente calidad-precio. La IA detectó alta satisfacción en clientes similares a tu perfil.",
  "🔥 Producto trending. 87% de compradores lo recomiendan según análisis de reseñas.",
  "💡 Ideal para tu historial de compras. Complementa perfectamente productos que ya tienes.",
  "🏆 Mejor vendido de su categoría. IA predice stock limitado, te sugerimos comprar pronto.",
  "✅ Precio óptimo detectado. La IA monitorea precios en tiempo real: este es el mejor momento para comprar."
];

function generateAIReview(product) {
  const el = document.getElementById('aiReviewText');
  if (!el) return;
  el.textContent = 'Analizando producto...';
  setTimeout(() => {
    el.textContent = aiReviews[Math.floor(Math.random() * aiReviews.length)];
  }, 800);
}

function refreshAIRecs() {
  const container = document.getElementById('aiRecsHome');
  if (!container) return;
  const shuffled = [...products].sort(() => Math.random() - 0.5).slice(0, 5);
  container.innerHTML = shuffled.map(p => `
    <div class="ai-rec-card" onclick="showDetail(${p.id})">
      <div class="ai-rec-icon">${p.icon}</div>
      <div class="ai-rec-name">${p.name.slice(0,22)}...</div>
      <div class="ai-rec-price">S/ ${p.price.toFixed(2)}</div>
    </div>`).join('');
}

function applyAIFilter() {
  const query = document.getElementById('aiFilterInput').value.toLowerCase();
  if (!query.trim()) return;
  const keywords = {limpieza:['limpiar','lejía','detergente','desinfectar','lavar'],herramientas:['taladro','tornillo','llave','martillo','construir'],iluminacion:['luz','foco','led','iluminar','lámpara'],ferreteria:['puerta','cerradura','silicona']};
  let filtered = [...products];
  for(const [cat, words] of Object.entries(keywords)){
    if(words.some(w => query.includes(w))) { filtered = products.filter(p => p.cat === cat); break; }
  }
  if (filtered.length === 0) filtered = products.filter(p => p.name.toLowerCase().includes(query) || p.brand.toLowerCase().includes(query));
  if (filtered.length === 0) filtered = products.slice(0,4);
  renderProducts(filtered);
  showToast(`🤖 IA encontró ${filtered.length} productos para "${query.slice(0,20)}"`);
}

function getAIRecommendations() {
  const shuffled = [...products].sort(() => Math.random() - 0.5).slice(0, 6);
  renderProducts(shuffled);
  showToast('🤖 IA actualizó recomendaciones para ti');
}

function triggerAISearch() {
  const val = document.getElementById('searchInput').value;
  if (!val.trim()) { openAIAssistant(); return; }
  handleSearch(val);
}

function openAIAssistant() {
  document.getElementById('aiAssistantModal').classList.add('show');
  document.getElementById('aiResults').innerHTML = '';
}

function runAISearch() {
  const query = document.getElementById('aiSearchQuery').value;
  if (!query.trim()) return;
  const el = document.getElementById('aiResults');
  el.innerHTML = '<div style="text-align:center;color:#aaa;padding:20px">🤖 Analizando tu consulta...</div>';
  setTimeout(() => {
    const filtered = products.filter(p => 
      p.name.toLowerCase().includes(query.toLowerCase()) || 
      p.brand.toLowerCase().includes(query.toLowerCase())
    );
    const results = filtered.length ? filtered : products.sort(() => Math.random() - 0.5).slice(0,3);
    el.innerHTML = results.slice(0,6).map(p => `
      <div class="product-card" onclick="document.getElementById('aiAssistantModal').classList.remove('show');showDetail(${p.id})">
        <div class="product-img">${p.icon}</div>
        <p class="prod-brand">${p.brand}</p>
        <h3>${p.name}</h3>
        <div class="price-row"><span class="price">S/ ${p.price.toFixed(2)}</span></div>
        <button class="add-btn" onclick="addToCart(${p.id});event.stopPropagation()">+ Agregar</button>
      </div>`).join('');
    if (results.length === 0) el.innerHTML = '<div style="text-align:center;color:#aaa;padding:20px">No encontré productos. Intenta con otras palabras.</div>';
  }, 1200);
}

// ===== BUSCADOR =====
function handleSearch(text) {
  const dd = document.getElementById('searchDropdown');
  if (!text.trim()) { dd.classList.remove('show'); return; }
  const filtered = products.filter(p => p.name.toLowerCase().includes(text.toLowerCase()) || p.brand.toLowerCase().includes(text.toLowerCase()));
  if (!filtered.length) { dd.classList.remove('show'); return; }
  dd.innerHTML = '';
  filtered.slice(0,5).forEach(p => {
    const item = document.createElement('div');
    item.className = 'search-item';
    item.innerHTML = `<span style="font-size:20px">${p.icon}</span><span>${p.name}</span>`;
    item.addEventListener('click', () => { showDetail(p.id); dd.classList.remove('show'); document.getElementById('searchInput').value = ''; });
    dd.appendChild(item);
  });
  const all = document.createElement('div');
  all.className = 'search-item';
  all.innerHTML = `<span>🔍</span><span style="color:#ff6900;font-weight:700">Ver todos para "${text}"</span>`;
  all.addEventListener('click', () => { renderProducts(filtered); showPage('catalog'); dd.classList.remove('show'); });
  dd.appendChild(all);
  dd.classList.add('show');
}

// ===== BANNER =====
function changeBanner(dir) {
  const slides = document.querySelectorAll('.hero-slide');
  const dots = document.querySelectorAll('.dot');
  slides[currentBanner].classList.remove('active');
  dots[currentBanner].classList.remove('active');
  currentBanner = (currentBanner + dir + totalBanners) % totalBanners;
  slides[currentBanner].classList.add('active');
  dots[currentBanner].classList.add('active');
}
setInterval(() => changeBanner(1), 5000);

// ===== TOAST =====
function showToast(msg) {
  const t = document.getElementById('toast');
  t.textContent = msg; t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 3000);
}

// ===== LOGIN =====
function handleLogin() {
  const e = document.getElementById('loginEmail').value;
  const p = document.getElementById('loginPass').value;
  if (!e || !p) { showToast('⚠️ Completa todos los campos'); return; }
  document.getElementById('loginModal').classList.remove('show');
  showToast('✅ ¡Bienvenido a FERREMART!');
  setTimeout(() => openDashboard(), 500);
}

// ===== CHAT IA =====
const chatResponses = {
  default: ['¡Hola! ¿En qué te puedo ayudar?', 'Estoy aquí para asistirte con lo que necesites.', 'Puedo ayudarte con productos, precios y planes.'],
  oferta: ['🔥 Hoy tenemos hasta 80% OFF en lejías y limpieza. ¡Aprovecha!', '💡 Las mejores ofertas del día: Lejía Sapolio a S/10.90 y Foco LED a S/28.90.'],
  pro: ['⚡ El Plan Pro incluye todo el Básico más 23 módulos avanzados: e-commerce, CRM, pagos y más.', '🚀 Con el Plan Pro activas inventario inteligente, reportes automáticos y tracking logístico.'],
  herramienta: ['🔧 Tenemos taladros Stanley desde S/ 249, llaves Truper a S/ 89 y más.', '🔩 Nuestra sección de herramientas tiene todo para construcción y mantenimiento.'],
  envio: ['🚚 Envío gratis en compras mayores a S/ 150. Retiro en tienda disponible el mismo día.', '📦 Los pedidos llegan al día siguiente en Lima Metropolitana.'],
  precio: ['💰 Nuestros precios son los más competitivos del mercado con garantía de calidad.', '🏷️ Usamos IA para mantener precios óptimos en tiempo real.']
};

function getAIResponse(text) {
  const t = text.toLowerCase();
  if (t.includes('oferta') || t.includes('descuento') || t.includes('barato')) return chatResponses.oferta[Math.floor(Math.random()*chatResponses.oferta.length)];
  if (t.includes('pro') || t.includes('plan') || t.includes('premium')) return chatResponses.pro[Math.floor(Math.random()*chatResponses.pro.length)];
  if (t.includes('herramienta') || t.includes('taladro') || t.includes('construc')) return chatResponses.herramienta[Math.floor(Math.random()*chatResponses.herramienta.length)];
  if (t.includes('envío') || t.includes('envio') || t.includes('entrega') || t.includes('deliver')) return chatResponses.envio[Math.floor(Math.random()*chatResponses.envio.length)];
  if (t.includes('precio') || t.includes('costo') || t.includes('cuanto')) return chatResponses.precio[Math.floor(Math.random()*chatResponses.precio.length)];
  return chatResponses.default[Math.floor(Math.random()*chatResponses.default.length)];
}

function sendMessage(text) {
  if (!text?.trim()) return;
  const msgs = document.getElementById('chatMessages');
  const userMsg = document.createElement('div');
  userMsg.className = 'chat-msg user';
  userMsg.innerHTML = `<span>👤</span><div class="msg-bubble">${text}</div>`;
  msgs.appendChild(userMsg);
  // typing indicator
  const typing = document.createElement('div');
  typing.className = 'chat-msg bot typing-indicator';
  typing.innerHTML = `<span>🤖</span><div class="msg-bubble msg-typing"><div class="typing-dot"></div><div class="typing-dot"></div><div class="typing-dot"></div></div>`;
  msgs.appendChild(typing);
  msgs.scrollTop = msgs.scrollHeight;
  setTimeout(() => {
    msgs.removeChild(typing);
    const botMsg = document.createElement('div');
    botMsg.className = 'chat-msg bot';
    botMsg.innerHTML = `<span>🤖</span><div class="msg-bubble">${getAIResponse(text)}</div>`;
    msgs.appendChild(botMsg);
    msgs.scrollTop = msgs.scrollHeight;
  }, 900);
  const input = document.getElementById('chatInput');
  if (input) input.value = '';
}

function sendQuickReply(text) { sendMessage(text); }

// ===== CART DRAWER =====
function openCartDrawer() {
  document.getElementById('cartDrawer').classList.add('open');
  document.getElementById('drawerOverlay').classList.add('show');
}

// ===== MEGA MENU =====
function renderMegaContent(cat) {
  const d = megaData[cat];
  if (!d) return;
  let html = `<h2>${d.icon} ${d.title}</h2><div class="mega-grid">`;
  d.cols.forEach(col => {
    html += `<div class="mega-col"><h3>${col.title}</h3>`;
    col.items.forEach(item => { html += `<p onclick="closeMegaMenu()">${item}</p>`; });
    html += '</div>';
  });
  html += '</div>';
  document.getElementById('megaContent').innerHTML = html;
}
function closeMegaMenu() {
  document.getElementById('megaMenu').classList.remove('show');
  document.getElementById('megaOverlay').classList.remove('show');
}

// ===== TOGGLES =====
function applyToggles() {
  document.querySelectorAll('[data-toggle]').forEach(input => {
    input.addEventListener('change', () => {
      const t = input.dataset.toggle;
      document.querySelectorAll(`[data-control="${t}"]`).forEach(el => el.classList.toggle('hidden', !input.checked));
      if (t === 'footer') document.querySelector('footer')?.classList.toggle('hidden', !input.checked);
      if (t === 'chat') { document.getElementById('chatBtn')?.classList.toggle('hidden', !input.checked); document.getElementById('chatBox')?.classList.toggle('hidden', !input.checked); }
    });
  });
}

// ===== INIT =====
document.addEventListener('DOMContentLoaded', () => {
  renderFeatured();
  renderProducts();
  renderCart();
  renderMegaContent('limpieza');
  renderPlanPreviews();
  refreshAIRecs();

  // CATEGORÍAS
  document.getElementById('btnCategorias').addEventListener('click', () => {
    document.getElementById('megaMenu').classList.toggle('show');
    document.getElementById('megaOverlay').classList.toggle('show');
  });
  document.getElementById('megaOverlay').addEventListener('click', closeMegaMenu);
  document.querySelectorAll('.mega-cat').forEach(cat => {
    cat.addEventListener('click', () => {
      document.querySelectorAll('.mega-cat').forEach(c => c.classList.remove('active'));
      cat.classList.add('active');
      renderMegaContent(cat.dataset.cat);
    });
  });

  // CUENTA
  document.getElementById('btnCuenta').addEventListener('click', e => {
    e.stopPropagation();
    document.getElementById('accountMenu').classList.toggle('show');
  });
  document.addEventListener('click', () => document.getElementById('accountMenu').classList.remove('show'));
  document.getElementById('accountMenu').addEventListener('click', e => e.stopPropagation());

  // CARRITO
  document.getElementById('btnCarrito').addEventListener('click', openCartDrawer);
  document.getElementById('closeCart').addEventListener('click', () => {
    document.getElementById('cartDrawer').classList.remove('open');
    document.getElementById('drawerOverlay').classList.remove('show');
  });
  document.getElementById('drawerOverlay').addEventListener('click', () => {
    document.getElementById('cartDrawer').classList.remove('open');
    document.getElementById('drawerOverlay').classList.remove('show');
  });

  // LOGIN
  document.getElementById('openLogin').addEventListener('click', () => {
    document.getElementById('loginModal').classList.add('show');
    document.getElementById('accountMenu').classList.remove('show');
  });
  document.getElementById('closeLogin').addEventListener('click', () => document.getElementById('loginModal').classList.remove('show'));
  document.getElementById('loginModal').addEventListener('click', e => { if(e.target===document.getElementById('loginModal')) document.getElementById('loginModal').classList.remove('show'); });

  // BUSCADOR
  document.getElementById('searchInput').addEventListener('input', e => handleSearch(e.target.value));
  document.addEventListener('click', e => { if(!e.target.closest('.search-box')) document.getElementById('searchDropdown').classList.remove('show'); });

  // BANNERS
  document.getElementById('nextBanner').addEventListener('click', () => changeBanner(1));
  document.getElementById('prevBanner').addEventListener('click', () => changeBanner(-1));
  document.querySelectorAll('.dot').forEach((dot, i) => {
    dot.addEventListener('click', () => { const d = i - currentBanner; if(d!==0) changeBanner(d<0?-1:1); });
  });

  // SORT
  document.getElementById('sortProducts').addEventListener('change', e => {
    let s = [...products];
    if(e.target.value==='low') s.sort((a,b)=>a.price-b.price);
    if(e.target.value==='high') s.sort((a,b)=>b.price-a.price);
    if(e.target.value==='sold') s.sort((a,b)=>(b.sold||0)-(a.sold||0));
    renderProducts(s);
  });

  // CHAT
  document.getElementById('chatBtn').addEventListener('click', () => {
    document.getElementById('chatBox').classList.toggle('open');
    document.querySelector('.chat-notif').style.display='none';
  });
  document.getElementById('sendChat').addEventListener('click', () => sendMessage(document.getElementById('chatInput').value));
  document.getElementById('chatInput').addEventListener('keypress', e => { if(e.key==='Enter') sendMessage(document.getElementById('chatInput').value); });

  // CONFIG
  document.getElementById('configToggle').addEventListener('click', () => document.querySelector('.config-body').classList.toggle('show'));
  applyToggles();

  // DASHBOARD modal close on overlay
  document.getElementById('dashboardModal').addEventListener('click', e => { if(e.target===document.getElementById('dashboardModal')) document.getElementById('dashboardModal').classList.remove('show'); });
  document.getElementById('plansModal').addEventListener('click', e => { if(e.target===document.getElementById('plansModal')) document.getElementById('plansModal').classList.remove('show'); });
  document.getElementById('aiAssistantModal').addEventListener('click', e => { if(e.target===document.getElementById('aiAssistantModal')) document.getElementById('aiAssistantModal').classList.remove('show'); });
});