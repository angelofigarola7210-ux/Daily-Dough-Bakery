document.addEventListener("DOMContentLoaded", () => {

  const items =
    document.querySelectorAll(".item");

  const modal =
    document.getElementById("modal");

  const closeModal =
    document.getElementById("closeModal");

  const modalTitle =
    document.getElementById("modalTitle");

  const addToCartBtn =
    document.getElementById("addToCart");

  const cart =
    document.getElementById("cart");

  const cartOverlay =
    document.getElementById("cartOverlay");

  const openCartBtn =
    document.getElementById("openCartBtn");

  const closeCart =
    document.getElementById("closeCart");

  const cartItemsDiv =
    document.getElementById("cartItems");

  const cartTotal =
    document.getElementById("cartTotal");

  const searchBar =
    document.getElementById("searchBar");

  let selectedItem = null;

  let cartData =
    JSON.parse(localStorage.getItem("cart")) || [];

  // =====================
  // OPEN ITEM MODAL
  // =====================

  items.forEach(item => {

    item.addEventListener("click", () => {

      selectedItem = {

        name: item.dataset.name,

        price: Number(item.dataset.price)

      };

      modalTitle.textContent =
        selectedItem.name;

      modal.classList.add("show");

    });

  });

  // =====================
  // CLOSE MODAL
  // =====================

  closeModal.addEventListener("click", () => {

    modal.classList.remove("show");

  });

  // =====================
  // ADD TO CART
  // =====================

  addToCartBtn.addEventListener("click", () => {

    if (!selectedItem) return;

    const toppings = [];

    document
      .querySelectorAll(".modal-content input:checked")
      .forEach(box => {

        toppings.push(box.value);

      });

    cartData.push({

      name: selectedItem.name,

      basePrice: selectedItem.price,

      toppings: toppings,

      toppingCost: toppings.length,

      quantity: 1

    });

    saveCart();

    updateCart();

    modal.classList.remove("show");

    document
      .querySelectorAll(".modal-content input")
      .forEach(box => {

        box.checked = false;

      });

  });

  // =====================
  // OPEN CART
  // =====================

  openCartBtn.addEventListener("click", () => {

    cart.classList.add("open");

    cartOverlay.classList.add("show");

  });

  // =====================
  // CLOSE CART
  // =====================

  function closeCartFunc() {

    cart.classList.remove("open");

    cartOverlay.classList.remove("show");

  }

  closeCart.addEventListener(
    "click",
    closeCartFunc
  );

  cartOverlay.addEventListener(
    "click",
    closeCartFunc
  );

  // =====================
  // UPDATE CART
  // =====================

  function updateCart() {

    cartItemsDiv.innerHTML = "";

    let grandQuantity = 0;

    let toppingsTotal = 0;

    cartData.forEach((item, index) => {

      grandQuantity += item.quantity;

      toppingsTotal +=
        item.toppingCost * item.quantity;

      const div =
        document.createElement("div");

      div.classList.add("cart-item");

      div.innerHTML = `

        <p>
          <strong>${item.name}</strong>
        </p>

        <p>
          Toppings:
          ${item.toppings.join(", ") || "None"}
        </p>

        <div class="quantity-controls">

          <button class="minus-btn"
            data-index="${index}">
            -
          </button>

          <span>${item.quantity}</span>

          <button class="plus-btn"
            data-index="${index}">
            +
          </button>

        </div>

      `;

      cartItemsDiv.appendChild(div);

    });

    // BUNDLE DEAL
    const pairs =
      Math.floor(grandQuantity / 2);

    const leftover =
      grandQuantity % 2;

    const breadTotal =
      (pairs * 27) +
      (leftover * 15);

    const finalTotal =
      breadTotal + toppingsTotal;

    cartTotal.textContent =
      "Total: $" + finalTotal;

    // PLUS BUTTONS
    document
      .querySelectorAll(".plus-btn")
      .forEach(button => {

      button.addEventListener("click", () => {

        const index =
          button.dataset.index;

        cartData[index].quantity++;

        saveCart();

        updateCart();

      });

    });

    // MINUS BUTTONS
    document
      .querySelectorAll(".minus-btn")
      .forEach(button => {

      button.addEventListener("click", () => {

        const index =
          button.dataset.index;

        cartData[index].quantity--;

        if (
          cartData[index].quantity <= 0
        ) {

          cartData.splice(index, 1);

        }

        saveCart();

        updateCart();

      });

    });

  }

  // SAVE CART
  function saveCart() {

    localStorage.setItem(
      "cart",
      JSON.stringify(cartData)
    );

  }

  // SEARCH
  searchBar.addEventListener("input", () => {

    const value =
      searchBar.value.toLowerCase();

    items.forEach(item => {

      item.style.display =
        item.innerText
          .toLowerCase()
          .includes(value)
          ? "block"
          : "none";

    });

  });

  updateCart();

});