const products = [
  {
    id: "mug",
    name: "Stoneware mug",
    category: "Kitchen",
    price: 18,
    color: "#c4a484",
    description: "A heavy everyday mug. Holds about 300 ml and stacks in the cupboard."
  },
  {
    id: "notebook",
    name: "Plain notebook",
    category: "Stationery",
    price: 12,
    color: "#d8c7a1",
    description: "96 blank pages. Soft cover, thread-bound, fits in a bag."
  },
  {
    id: "tote",
    name: "Canvas tote",
    category: "Bags",
    price: 24,
    color: "#8f9e8a",
    description: "Unlined cotton canvas with two long handles. Washes cold."
  },
  {
    id: "lamp",
    name: "Desk lamp",
    category: "Lighting",
    price: 46,
    color: "#e7d7c1",
    description: "A small lamp with a warm bulb. The arm bends and stays put."
  }
];

const cart = new Map();

const grid = document.querySelector("#product-grid");
const productsView = document.querySelector("#products");
const detailView = document.querySelector("#detail");
const detail = document.querySelector("#product-detail");
const categoryFilter = document.querySelector("#category-filter");
const cartPanel = document.querySelector("#cart");
const cartItems = document.querySelector("#cart-items");
const cartCount = document.querySelector("#cart-count");
const cartTotal = document.querySelector("#cart-total");
const cartToggle = document.querySelector("#cart-toggle");
const closeCart = document.querySelector("#close-cart");
const checkout = document.querySelector("#checkout");
const checkoutNote = document.querySelector("#checkout-note");

function money(amount) {
  return "$" + amount.toFixed(2);
}

function renderCategoryFilter() {
  const categories = [...new Set(products.map((product) => product.category))];
  categoryFilter.innerHTML =
    '<option value="all">All categories</option>' +
    categories
      .map((category) => '<option value="' + category + '">' + category + "</option>")
      .join("");
}

function renderGrid() {
  grid.innerHTML = "";
  const selectedCategory = categoryFilter.value;
  const visibleProducts =
    selectedCategory === "all"
      ? products
      : products.filter((product) => product.category === selectedCategory);

  visibleProducts.forEach((product) => {
    const item = document.createElement("li");
    const button = document.createElement("button");
    button.className = "card";
    button.type = "button";
    button.innerHTML =
      '<div class="swatch" style="background:' + product.color + '"></div>' +
      "<strong>" + product.name + "</strong>" +
      '<p class="price">' + money(product.price) + "</p>";
    button.addEventListener("click", () => showProduct(product.id));
    item.appendChild(button);
    grid.appendChild(item);
  });

  if (visibleProducts.length === 0) {
    grid.innerHTML = '<li class="muted">No products in this category.</li>';
  }
}

function showProduct(id) {
  const product = products.find((item) => item.id === id);
  if (!product) return;

  productsView.hidden = true;
  detailView.hidden = false;
  checkoutNote.hidden = true;

  detail.innerHTML =
    '<div class="detail-swatch" style="background:' + product.color + '"></div>' +
    "<div>" +
      "<h1>" + product.name + "</h1>" +
      '<p class="price">' + money(product.price) + "</p>" +
      "<p>" + product.description + "</p>" +
      '<form class="qty-row" id="add-form">' +
        '<label>Qty <input type="number" id="qty" min="1" max="9" value="1"></label>' +
        '<button class="primary" type="submit">Add to cart</button>' +
      "</form>" +
    "</div>";

  document.querySelector("#add-form").addEventListener("submit", (event) => {
    event.preventDefault();
    const qty = Number(document.querySelector("#qty").value);
    if (!Number.isInteger(qty) || qty < 1) return;
    cart.set(product.id, (cart.get(product.id) || 0) + qty);
    renderCart();
    openCart();
  });
}

function showList() {
  detailView.hidden = true;
  productsView.hidden = false;
}

function renderCart() {
  cartItems.innerHTML = "";
  let count = 0;
  let total = 0;

  cart.forEach((qty, id) => {
    const product = products.find((item) => item.id === id);
    count += qty;
    total += product.price * qty;

    const line = document.createElement("li");
    line.className = "cart-line";
    line.innerHTML =
      "<span>" + product.name + " × " + qty + "</span>" +
      "<span>" + money(product.price * qty) + "</span>";

    const remove = document.createElement("button");
    remove.type = "button";
    remove.className = "text-button";
    remove.textContent = "Remove";
    remove.addEventListener("click", () => {
      cart.delete(id);
      renderCart();
    });
    line.appendChild(remove);
    cartItems.appendChild(line);
  });

  if (count === 0) {
    cartItems.innerHTML = '<li class="muted">Your cart is empty.</li>';
  }

  cartCount.textContent = String(count);
  cartTotal.textContent = count === 0 ? "" : "Total " + money(total);
  checkout.disabled = count === 0;
}

function openCart() {
  cartPanel.hidden = false;
  cartToggle.setAttribute("aria-expanded", "true");
}

function hideCart() {
  cartPanel.hidden = true;
  cartToggle.setAttribute("aria-expanded", "false");
}

cartToggle.addEventListener("click", () => {
  if (cartPanel.hidden) openCart();
  else hideCart();
});

closeCart.addEventListener("click", hideCart);
categoryFilter.addEventListener("change", renderGrid);

document.querySelector("#back-button").addEventListener("click", showList);
document.querySelector("#home-link").addEventListener("click", (event) => {
  event.preventDefault();
  showList();
});

checkout.addEventListener("click", () => {
  cart.clear();
  renderCart();
  checkoutNote.hidden = false;
});

renderCategoryFilter();
renderGrid();
renderCart();
