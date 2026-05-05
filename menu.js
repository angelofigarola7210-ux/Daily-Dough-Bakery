document.addEventListener("DOMContentLoaded", () => {

  // =========================
  // ELEMENTS
  // =========================

  const items = document.querySelectorAll(".item");

  const modal = document.getElementById("modal");
  const closeModal = document.getElementById("closeModal");
  const modalTitle = document.getElementById("modalTitle");
  const addToCartBtn = document.getElementById("addToCart");

  const cart = document.getElementById("cart");
  const cartOverlay = document.getElementById("cartOverlay");
  const openCartBtn = document.getElementById("openCartBtn");
  const closeCart = document.getElementById("closeCart");

  const cartItemsDiv = document.getElementById("cartItems");
  const cartTotal = document.getElementById("cartTotal");

  const searchBar = document.getElementById("searchBar");

  const toast = document.getElementById("toast");
  const cartCount = document.getElementById("cartCount");

  // =========================
  // DATA
  // =========================

  let selectedItem = null;

  let cartData =
    JSON.parse(localStorage.getItem("cart")) || [];

  // =========================
  // SAFETY CHECK
  // =========================

  if (!modal || !addToCartBtn || !closeModal || !cart || !searchBar) {
    console.error("Missing HTML elements");
    return;
  }

  // =========================
  // TOAST
  // =========================

  function showToast(message) {
    if (!toast) return;

    toast.textContent = message;
    toast.classList.add("show");

    setTimeout(() => {
      toast.classList.remove("show");
    }, 1500);
  }

  // =========================
  // OPEN MODAL
  // =========================

  items.forEach(item => {
    item.addEventListener("click", () => {

      selectedItem = {
        name: item.dataset.name,
        price: Number(item.dataset.price)
      };

      modalTitle.textContent = selectedItem.name;
      modal.classList.remove("hidden");

    });
  });

  // =========================
  // CLOSE MODAL
  // =========================

  closeModal.addEventListener("click", () => {
    modal.classList.add("hidden");
  });

  // =========================
  // ADD TO CART
  // =========================

  addToCartBtn.addEventListener("click", () => {

    if (!selectedItem) return;

    const toppings = [];

    document.querySelectorAll(".modal-content input:checked")
      .forEach(box => {
        toppings.push(box.value);
      });

    cartData.push({
      name: selectedItem.name,
      basePrice: selectedItem.price,
      toppings,
      toppingCost: toppings.length,
      quantity: 1
    });

    saveCart();
    updateCart();

    showToast(selectedItem.name + " added to cart");

    modal.classList.add("hidden");

    document.querySelectorAll(".modal-content input")
      .forEach(box => box.checked = false);

  });

  // =========================
  // OPEN CART
  // =========================

  openCartBtn.addEventListener("click", () => {
    cart.classList.add("open");
    cartOverlay.classList.remove("hidden");
  });

  // =========================
  // CLOSE CART
  // =========================

  function closeCartFunc() {
    cart.classList.remove("open");
    cartOverlay.classList.add("hidden");
  }

  closeCart.addEventListener("click", closeCartFunc);
  cartOverlay.addEventListener("click", closeCartFunc);

  // =========================
  // UPDATE CART
  // =========================

  function updateCart() {

    cartItemsDiv.innerHTML = "";

    let total = 0;
    let count = 0;

    cartData.forEach((item, index) => {

      const itemTotal =
        (item.basePrice + item.toppingCost) * item.quantity;

      total += itemTotal;
      count += item.quantity;

      const div = document.createElement("div");
      div.classList.add("cart-item");

      div.innerHTML = `
        <p><strong>${item.name}</strong></p>

        <p>Toppings: ${item.toppings.join(", ") || "None"}</p>

        <div class="quantity-controls">

          <button class="minus-btn" data-index="${index}">-</button>

          <span>${item.quantity}</span>

          <button class="plus-btn" data-index="${index}">+</button>

        </div>

        <button class="remove-btn" data-index="${index}">
          Remove
        </button>

        <p>$${itemTotal}</p>
      `;

      cartItemsDiv.appendChild(div);

    });

    cartTotal.textContent = "Total: $" + total;

    if (cartCount) {
      cartCount.textContent = count;
    }

    // =========================
    // PLUS BUTTONS
    // =========================

    document.querySelectorAll(".plus-btn").forEach(button => {

      button.addEventListener("click", () => {

        const index = button.dataset.index;

        cartData[index].quantity++;

        saveCart();
        updateCart();

      });

    });

    // =========================
    // MINUS BUTTONS
    // =========================

    document.querySelectorAll(".minus-btn").forEach(button => {

      button.addEventListener("click", () => {

        const index = button.dataset.index;

        cartData[index].quantity--;

        if (cartData[index].quantity <= 0) {
          cartData.splice(index, 1);
        }

        saveCart();
        updateCart();

      });

    });

    // =========================
    // REMOVE BUTTONS
    // =========================

    document.querySelectorAll(".remove-btn").forEach(button => {

      button.addEventListener("click", () => {

        const index = button.dataset.index;

        cartData.splice(index, 1);

        saveCart();
        updateCart();

      });

    });

  }

  // =========================
  // SAVE CART
  // =========================

  function saveCart() {
    localStorage.setItem("cart", JSON.stringify(cartData));
  }

  // =========================
  // SEARCH
  // =========================

  searchBar.addEventListener("input", () => {

    const value = searchBar.value.toLowerCase();

    items.forEach(item => {
      item.style.display =
        item.innerText.toLowerCase().includes(value)
          ? "block"
          : "none";
    });

  });

  // =========================
  // INIT
  // =========================

  updateCart();

});