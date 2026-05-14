function updateCart() {

  cartItemsDiv.innerHTML = "";

  let grandQuantity = 0;
  let toppingsTotal = 0;

  // CREATE CART ITEMS
  cartData.forEach((item, index) => {

    grandQuantity += item.quantity;

    toppingsTotal +=
      item.toppingCost * item.quantity;

    const div = document.createElement("div");

    div.classList.add("cart-item");

    div.innerHTML = `
      <p><strong>${item.name}</strong></p>

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

  // =====================
  // BUNDLE DEAL LOGIC
  // =====================

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

  // =====================
  // PLUS BUTTONS
  // =====================

  document.querySelectorAll(".plus-btn")
    .forEach(button => {

    button.addEventListener("click", () => {

      const index =
        button.dataset.index;

      cartData[index].quantity++;

      saveCart();
      updateCart();

    });

  });

  // =====================
  // MINUS BUTTONS
  // =====================

  document.querySelectorAll(".minus-btn")
    .forEach(button => {

    button.addEventListener("click", () => {

      const index =
        button.dataset.index;

      cartData[index].quantity--;

      if (cartData[index].quantity <= 0) {
        cartData.splice(index, 1);
      }

      saveCart();
      updateCart();

    });

  });

}