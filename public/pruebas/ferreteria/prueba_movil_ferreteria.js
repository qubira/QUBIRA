const products = [
  { id: 1, brand: "SAPOLIO", name: "Lejía Sapolio Original 4.8 Kg", price: 10.9, old: 16.9, icon: "🧴", cat: "limpieza" },
  { id: 2, brand: "CLOROX", name: "Lejía Clorox Tradicional 2 Kg", price: 6.5, old: 8.9, icon: "🧼", cat: "limpieza" },
  { id: 3, brand: "SIKA", name: "Silicona para vidrios transparente", price: 15.9, old: 20, icon: "🧪", cat: "ferreteria" },
  { id: 4, brand: "DIMFER", name: "Puerta Decorativa 65x207cm", price: 199.9, old: 249, icon: "🚪", cat: "ferreteria" },
  { id: 5, brand: "STANLEY", name: "Taladro percutor eléctrico 750W", price: 249, old: 320, icon: "🛠️", cat: "herramientas" },
  { id: 6, brand: "TRUPER", name: "Juego de llaves mixtas 12 piezas", price: 89, old: 120, icon: "🔩", cat: "herramientas" },
  { id: 7, brand: "PHILIPS", name: "Foco LED 9W luz cálida pack x4", price: 28.9, old: 39, icon: "💡", cat: "ferreteria" },
  { id: 8, brand: "GENÉRICO", name: "Cerradura digital inteligente", price: 169, old: 220, icon: "🔐", cat: "ferreteria" }
];

let cart = [];
let currentProduct = null;
let detailQty = 1;
let currentFilter = "all";

const productList = document.getElementById("productList");
const featuredList = document.getElementById("featuredList");

function renderProducts(list = products, container = productList) {
  container.innerHTML = "";

  list.forEach(product => {
    const card = document.createElement("div");
    card.className = "product-card";

    card.innerHTML = `
      <div class="product-img">${product.icon}</div>

      <div class="product-info">
        <p class="brand">${product.brand}</p>
        <h3>${product.name}</h3>

        <p>
          <span class="price">S/ ${product.price.toFixed(2)}</span>
        </p>

        <p class="old">S/ ${product.old.toFixed(2)}</p>

        <div class="actions">
          <button class="view" onclick="openDetail(${product.id})">Ver</button>
          <button class="add" onclick="addToCart(${product.id})">Agregar</button>
        </div>
      </div>
    `;

    container.appendChild(card);
  });
}

function openDetail(id) {
  const product = products.find(p => p.id === id);
  currentProduct = product;
  detailQty = 1;

  document.getElementById("detailImg").textContent = product.icon;
  document.getElementById("detailBrand").textContent = product.brand;
  document.getElementById("detailName").textContent = product.name;
  document.getElementById("detailPrice").textContent = `S/ ${product.price.toFixed(2)}`;
  document.getElementById("detailOld").textContent = `S/ ${product.old.toFixed(2)}`;
  document.getElementById("detailQty").textContent = detailQty;

  showPage("detail");
}

document.getElementById("plusQty").addEventListener("click", () => {
  detailQty++;
  document.getElementById("detailQty").textContent = detailQty;
});

document.getElementById("minusQty").addEventListener("click", () => {
  if (detailQty > 1) {
    detailQty--;
  }

  document.getElementById("detailQty").textContent = detailQty;
});

document.getElementById("addDetailBtn").addEventListener("click", () => {
  if (!currentProduct) return;

  for (let i = 0; i < detailQty; i++) {
    addToCart(currentProduct.id, false);
  }

  showPage("cart");
});

function addToCart(id, goCart = true) {
  const product = products.find(p => p.id === id);
  const item = cart.find(p => p.id === id);

  if (item) {
    item.qty++;
  } else {
    cart.push({ ...product, qty: 1 });
  }

  renderCart();

  if (goCart) {
    showPage("cart");
  }
}

function renderCart() {
  const cartItems = document.getElementById("cartItems");
  cartItems.innerHTML = "";

  let subtotal = 0;
  let oldTotal = 0;
  let count = 0;

  if (cart.length === 0) {
    cartItems.innerHTML = `
      <div class="module-card">
        <p>🛒 Tu carrito está vacío.</p>
      </div>
    `;
  }

  cart.forEach(item => {
    subtotal += item.price * item.qty;
    oldTotal += item.old * item.qty;
    count += item.qty;

    const div = document.createElement("div");
    div.className = "cart-item";

    div.innerHTML = `
      <div class="cart-icon">${item.icon}</div>

      <div class="cart-data">
        <h3>${item.name}</h3>
        <p>${item.brand}</p>
        <p>S/ ${item.price.toFixed(2)} c/u</p>

        <div class="cart-controls">
          <button onclick="changeQty(${item.id}, -1)">-</button>
          <b>${item.qty}</b>
          <button onclick="changeQty(${item.id}, 1)">+</button>
          <button class="remove" onclick="removeItem(${item.id})">Eliminar</button>
        </div>
      </div>
    `;

    cartItems.appendChild(div);
  });

  const discount = oldTotal - subtotal;

  document.getElementById("subtotal").textContent = `S/ ${oldTotal.toFixed(2)}`;
  document.getElementById("discount").textContent = `S/ ${discount.toFixed(2)}`;
  document.getElementById("total").textContent = `S/ ${subtotal.toFixed(2)}`;
  document.getElementById("cartCount").textContent = count;
}

function changeQty(id, value) {
  const item = cart.find(p => p.id === id);

  if (!item) return;

  item.qty += value;

  if (item.qty <= 0) {
    cart = cart.filter(p => p.id !== id);
  }

  renderCart();
}

function removeItem(id) {
  cart = cart.filter(p => p.id !== id);
  renderCart();
}

function showPage(pageId) {
  document.querySelectorAll(".page").forEach(page => {
    page.classList.remove("active");
  });

  const selectedPage = document.getElementById(pageId);

  if (selectedPage) {
    selectedPage.classList.add("active");
  }

  document.querySelectorAll("[data-page]").forEach(btn => {
    btn.classList.remove("active");

    if (btn.dataset.page === pageId) {
      btn.classList.add("active");
    }
  });
}

document.querySelectorAll("[data-page]").forEach(btn => {
  btn.addEventListener("click", () => {
    showPage(btn.dataset.page);
  });
});

document.querySelectorAll(".chip").forEach(chip => {
  chip.addEventListener("click", () => {
    document.querySelectorAll(".chip").forEach(c => {
      c.classList.remove("active");
    });

    chip.classList.add("active");

    currentFilter = chip.dataset.filter;

    let filtered = products;

    if (currentFilter !== "all") {
      filtered = products.filter(p => p.cat === currentFilter);
    }

    renderProducts(filtered, productList);
  });
});

document.getElementById("sortProducts").addEventListener("change", e => {
  let list = [...products];

  if (currentFilter !== "all") {
    list = list.filter(p => p.cat === currentFilter);
  }

  if (e.target.value === "low") {
    list.sort((a, b) => a.price - b.price);
  }

  if (e.target.value === "high") {
    list.sort((a, b) => b.price - a.price);
  }

  renderProducts(list, productList);
});

document.getElementById("searchInput").addEventListener("input", e => {
  const text = e.target.value.toLowerCase();

  const filtered = products.filter(p =>
    p.name.toLowerCase().includes(text) ||
    p.brand.toLowerCase().includes(text)
  );

  renderProducts(filtered, productList);
  showPage("catalog");
});

document.getElementById("openLogin").addEventListener("click", () => {
  document.getElementById("loginModal").classList.add("show");
});

document.getElementById("closeLogin").addEventListener("click", () => {
  document.getElementById("loginModal").classList.remove("show");
});

document.getElementById("chatBtn").addEventListener("click", () => {
  document.getElementById("chatBox").classList.toggle("show");
});

document.getElementById("sendChat").addEventListener("click", () => {
  const input = document.getElementById("chatInput");
  const text = input.value.trim();

  if (!text) return;

  const messages = document.getElementById("chatMessages");

  messages.innerHTML += `<p><b>Tú:</b> ${text}</p>`;

  setTimeout(() => {
    messages.innerHTML += `<p><b>Bot:</b> Gracias. Puedo ayudarte con precios, stock o entregas.</p>`;
    messages.scrollTop = messages.scrollHeight;
  }, 400);

  input.value = "";
});

/* MODIFICAR INTERFAZ EN TIEMPO REAL */
document.querySelectorAll("[data-control]").forEach(control => {
  control.addEventListener("change", () => {
    const target = control.dataset.control;
    const elements = document.querySelectorAll(`[data-ui="${target}"]`);

    elements.forEach(element => {
      element.classList.toggle("hidden-ui", !control.checked);
    });

    if (target === "modo-oscuro") {
      document.querySelector(".phone").classList.toggle("dark-mode", !control.checked);
    }

    if (target === "chat" && !control.checked) {
      document.getElementById("chatBox").classList.remove("show");
    }

    if ((target === "dashboard" || target === "cart") && !control.checked) {
      showPage("home");
    }
  });
});

renderProducts(products, productList);
renderProducts(products.slice(0, 4), featuredList);
renderCart();