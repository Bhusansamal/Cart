document.addEventListener("DOMContentLoaded", async () => {
    const cartItemsContainer = document.getElementById("cart-items");
    const subtotalElement = document.getElementById("subtotal");
    const totalElement = document.getElementById("total");
    const checkoutButton = document.getElementById("checkout");

    let cartData = [];

    // Fetch Cart Data
    async function fetchCartData() {
        try {
            const response = await fetch(
                "https://cdn.shopify.com/s/files/1/0883/2188/4479/files/apiCartData.json?v=1728384889"
            );

            const data = await response.json();
            cartData = data.items;
            renderCart();
        } catch (error) {
            console.error("Error fetching cart data:", error);
        }
    }

    // Render Cart Items
    function renderCart() {
        cartItemsContainer.innerHTML = "";
        let subtotal = 0;

        cartData.forEach((item, index) => {
            const itemTotal = (item.price / 100) * item.quantity;
            subtotal += itemTotal;

            const cartItem = document.createElement("div");
            cartItem.classList.add("cart-item");
            cartItem.innerHTML = `
                <div class="cart-item-info">
                    <img src="${item.image}" alt="${item.title}" class="cart-item-img">
                    <span class="cart-item-title">${item.title}</span>
                </div>
                <span>₹${(item.price / 100).toFixed(2)}</span>
                <div class="quantity-container">
                    <button class="decrease-quantity" data-index="${index}">-</button>
                    <input type="text" value="${item.quantity}" class="cart-quantity" data-index="${index}" readonly>
                    <button class="increase-quantity" data-index="${index}">+</button>
                </div>
                <span>₹${itemTotal.toFixed(2)}</span>
                <button class="remove-item" data-index="${index}">🗑️</button>
            `;

            cartItemsContainer.appendChild(cartItem);
        });

        updateTotals(subtotal);
    }

    // Update Totals
    function updateTotals(subtotal) {
        subtotalElement.textContent = `₹${subtotal.toFixed(2)}`;
        totalElement.textContent = `₹${subtotal.toFixed(2)}`;
    }

    // Handle Checkout Click
    checkoutButton.addEventListener("click", () => {
        alert("Order Placed Successfully! 🎉");
    });

    // Handle Quantity Increase, Decrease & Removal with Confirmation
    cartItemsContainer.addEventListener("click", (event) => {
        const index = event.target.dataset.index;

        if (event.target.classList.contains("increase-quantity")) {
            cartData[index].quantity++;
        } else if (event.target.classList.contains("decrease-quantity")) {
            if (cartData[index].quantity > 1) {
                cartData[index].quantity--;
            }
        } else if (event.target.classList.contains("remove-item")) {
            showRemoveConfirmation(index);
        }

        renderCart();
    });

    // Show Remove Confirmation Modal
    function showRemoveConfirmation(index) {
        const confirmation = confirm("Are you sure you want to remove this item?");
        if (confirmation) {
            cartData.splice(index, 1);
            renderCart();
        }
    }

    // Fetch and Display Cart Data
    fetchCartData();
});
