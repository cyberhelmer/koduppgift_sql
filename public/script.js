document.addEventListener("DOMContentLoaded", async () => {
    const productList = document.getElementById("productList");

    // Fetch products from the server
    const response = await fetch("/api/products");
    if (!response.ok) {
        console.error("Failed to load products from server.");
        return;
    }
    const products = await response.json();

    // Populate the form with products
    products.forEach(product => {
        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.name = "product";
        checkbox.value = product.articleNumber;

        const label = document.createElement("label");
        label.innerHTML = `
            <strong>${product.name}</strong><br>
            Article Number: ${product.articleNumber}<br>
            Price: $${product.price.toFixed(2)}<br>
            Description: ${product.description}
        `;

        const productContainer = document.createElement("div");
        productContainer.classList.add("product-item");
        productContainer.appendChild(checkbox);
        productContainer.appendChild(label);

        productList.appendChild(productContainer);
    });
});

    // Handle form submission
    document.getElementById("orderForm").addEventListener("submit", async (event) => {
        event.preventDefault();

        const selectedProducts = Array.from(document.querySelectorAll("input[name=product]:checked"))
            .map(input => input.value);

        const orderData = {
            customerName: document.getElementById("customerName").value,
            products: selectedProducts
        };

        // Send the order to the API
        const orderResponse = await fetch("/api/orders", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(orderData)
        });

        if (orderResponse.ok) {
            alert("Order submitted successfully!");
        } else {
            alert("Error submitting order.");
        }
    });

