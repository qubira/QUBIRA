const products = [
  { id: 1, brand: "SAPOLIO", name: "Lejía Sapolio Original 4.8 Kg", price: 10.9, old: 16.9, icon: "🧴" },
  { id: 2, brand: "CLOROX", name: "Lejía Clorox Tradicional 2 Kg", price: 6.5, old: 8.9, icon: "🧼" },
  { id: 3, brand: "SIKA", name: "Silicona para vidrios transparente", price: 15.9, old: 20, icon: "🧪" },
  { id: 4, brand: "DIMFER", name: "Puerta Decorativa 65x207cm", price: 199.9, old: 249, icon: "🚪" },
  { id: 5, brand: "STANLEY", name: "Taladro percutor eléctrico 750W", price: 249, old: 320, icon: "🔧" },
  { id: 6, brand: "TRUPER", name: "Juego de llaves mixtas 12 piezas", price: 89, old: 120, icon: "🔩" },
  { id: 7, brand: "PHILIPS", name: "Foco LED 9W luz cálida pack x4", price: 28.9, old: 39, icon: "💡" },
  { id: 8, brand: "GENÉRICO", name: "Cerradura digital inteligente", price: 169, old: 220, icon: "🔐" }
];

let cart = [];

const productGrid = document.getElementById("productGrid");
const featuredGrid = document.getElementById("featuredGrid");
const cartItems = document.getElementById("cartItems");
const cartCount = document.getElementById("cartCount");

function renderProducts(list = products, container = productGrid) {
  container.innerHTML = "";

  list.forEach(product => {
    const card = document.createElement("div");
    card.className = "product-card";

    card.innerHTML = `
      <div class="product-img">${product.icon}</div>
      <p class="brand-name">${product.brand}</p>
      <h3>${product.name}</h3>
      <p>
        <span class="price">S/ ${product.price.toFixed(2)}</span><br>
        <span class="old-price">S/ ${product.old.toFixed(2)}</span>
      </p>
      <button class="add-btn" onclick="addToCart(${product.id})">Agregar al carrito</button>
    `;

    container.appendChild(card);
  });

  const count = document.getElementById("productCount");
  if (count) count.textContent = `${list.length} productos`;
}

function addToCart(id) {
  const product = products.find(p => p.id === id);
  const item = cart.find(p => p.id === id);

  if (item) {
    item.qty++;
  } else {
    cart.push({ ...product, qty: 1 });
  }

  renderCart();
  showPage("carrito");
}

function renderCart() {
  cartItems.innerHTML = "";

  let subtotal = 0;
  let oldTotal = 0;
  let count = 0;

  if (cart.length === 0) {
    cartItems.innerHTML = `<div class="panel">🛒 Tu carrito está vacío.</div>`;
  }

  cart.forEach(item => {
    subtotal += item.price * item.qty;
    oldTotal += item.old * item.qty;
    count += item.qty;

    const div = document.createElement("div");
    div.className = "cart-item";

    div.innerHTML = `
      <div class="cart-icon">${item.icon}</div>
      <div style="flex:1">
        <h3>${item.name}</h3>
        <p>${item.brand}</p>
        <p>S/ ${item.price.toFixed(2)} c/u</p>
        <div class="qty">
          <button onclick="changeQty(${item.id}, -1)">-</button>
          <b>${item.qty}</b>
          <button onclick="changeQty(${item.id}, 1)">+</button>
          <button class="remove" onclick="removeItem(${item.id})">Eliminar</button>
        </div>
      </div>
      <h3>S/ ${(item.price * item.qty).toFixed(2)}</h3>
    `;

    cartItems.appendChild(div);
  });

  const discount = oldTotal - subtotal;

  document.getElementById("subtotal").textContent = `S/ ${oldTotal.toFixed(2)}`;
  document.getElementById("discount").textContent = `S/ ${discount.toFixed(2)}`;
  document.getElementById("total").textContent = `S/ ${subtotal.toFixed(2)}`;
  cartCount.textContent = count;
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

  document.getElementById(pageId).classList.add("active");

  document.querySelectorAll(".nav-btn").forEach(btn => {
    btn.classList.remove("active");
    if (btn.dataset.page === pageId) btn.classList.add("active");
  });

  if (pageId === "catalogo") renderProducts(products, productGrid);
  if (pageId === "carrito") renderCart();
}

document.querySelectorAll("[data-page]").forEach(btn => {
  btn.addEventListener("click", () => {
    showPage(btn.dataset.page);
  });
});

document.getElementById("sortProducts").addEventListener("change", e => {
  let list = [...products];

  if (e.target.value === "low") {
    list.sort((a, b) => a.price - b.price);
  }

  if (e.target.value === "high") {
    list.sort((a, b) => b.price - a.price);
  }

  renderProducts(list, productGrid);
});

document.getElementById("searchInput").addEventListener("input", e => {
  const text = e.target.value.toLowerCase();

  const filtered = products.filter(p =>
    p.name.toLowerCase().includes(text) ||
    p.brand.toLowerCase().includes(text)
  );

  renderProducts(filtered, productGrid);
  showPage("catalogo");
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
    messages.innerHTML += `<p><b>Bot:</b> Gracias. Puedo ayudarte con productos, precios, stock o pedidos.</p>`;
    messages.scrollTop = messages.scrollHeight;
  }, 400);

  input.value = "";
});

document.querySelectorAll("[data-control]").forEach(input => {
  input.addEventListener("change", () => {
    const type = input.dataset.control;

    if (type === "search") {
      document.querySelector(".search").classList.toggle("hidden", !input.checked);
    }

    if (type === "login") {
      document.querySelector(".login-btn").classList.toggle("hidden", !input.checked);
    }

    if (type === "cart") {
      document.querySelector(".cart-top").classList.toggle("hidden", !input.checked);
    }

    if (type === "chat") {
      document.querySelector(".chat-btn").classList.toggle("hidden", !input.checked);
    }
  });
});

renderProducts(products, productGrid);
renderProducts(products.slice(0, 4), featuredGrid);
renderCart();