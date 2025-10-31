 document.addEventListener("DOMContentLoaded", function() {
      // Obtener el carrito del localStorage
      const cart = JSON.parse(localStorage.getItem("cart")) || [];
      const emptyCartMessage = document.getElementById("empty-cart-message");
      const cartContent = document.getElementById("cart-content");
      const cartItems = document.getElementById("cart-items");
      const subtotalSummary = document.getElementById("subtotal-summary");
      const totalSummary = document.getElementById("total-summary");
      
      // Verificar si hay productos en el carrito
      if (cart.length === 0) {
        emptyCartMessage.classList.remove("d-none");
        cartContent.classList.add("d-none");
      } else {
        emptyCartMessage.classList.add("d-none");
        cartContent.classList.remove("d-none");
        
        // Mostrar los productos en la tabla
        let subtotal = 0;
        cart.forEach(product => {
          const productSubtotal = product.unitCost * product.count;
          subtotal += productSubtotal;
          
          const row = document.createElement("tr");
          row.innerHTML = `
            <td class="d-none d-sm-table-cell">
              <img src="${product.image}" alt="${product.name}" class="img-thumbnail product-image">
            </td>
            <td>
              <div class="d-block d-sm-none mobile-product-info">
                <img src="${product.image}" alt="${product.name}" class="img-thumbnail product-image-mobile">
              </div>
              <div class="d-flex flex-column">
                <strong>${product.name}</strong>
                <small class="text-muted d-sm-none">${formatCurrency(product.unitCost, product.currency)} c/u</small>
              </div>
            </td>
            <td class="d-none d-sm-table-cell">${formatCurrency(product.unitCost, product.currency)}</td>
            <td>
              <input type="number" class="form-control quantity-input" value="${product.count}" min="1" 
                     data-id="${product.id}">
            </td>
            <td class="subtotal fw-bold">${formatCurrency(productSubtotal, product.currency)}</td>
            <td>
              <button class="btn btn-sm btn-outline-danger remove-btn" data-id="${product.id}" title="Eliminar producto">
                <i class="fa fa-trash"></i>
                <span class="d-none d-sm-inline"> Eliminar</span>
              </button>
            </td>
          `;
          cartItems.appendChild(row);
        });
        
        // Calcular total (subtotal + envío)
        const total = subtotal;
        
        // Mostrar los totales
        subtotalSummary.textContent = formatCurrency(subtotal, cart[0].currency);
        totalSummary.textContent = formatCurrency(total, cart[0].currency);
        
        // Agregar event listeners para los cambios en la cantidad
        document.querySelectorAll('.quantity-input').forEach(input => {
          input.addEventListener('change', updateQuantity);
        });
        
        // Agregar event listeners para los botones de eliminar
        document.querySelectorAll('.remove-btn').forEach(button => {
          button.addEventListener('click', removeItem);
        });
      }
      
      // Función para formatear la moneda
      function formatCurrency(amount, currency) {
        if (currency === "USD") {
          return `$${amount.toLocaleString('en-US')}`;
        } else if (currency === "UYU") {
          return `U$${amount.toLocaleString('es-UY')}`;
        }
        return `${amount} ${currency}`;
      }
      
      // Función para actualizar la cantidad y recalcular subtotales
      function updateQuantity(event) {
        const productId = event.target.dataset.id;
        const newQuantity = parseInt(event.target.value);
        
        if (newQuantity < 1) {
          event.target.value = 1;
          return;
        }
        
        // Actualizar el carrito en localStorage
        const cart = JSON.parse(localStorage.getItem("cart")) || [];
        const productIndex = cart.findIndex(item => item.id === productId);
        
        if (productIndex !== -1) {
          cart[productIndex].count = newQuantity;
          localStorage.setItem("cart", JSON.stringify(cart));
          
          // Actualizar el subtotal en la tabla
          const row = event.target.closest('tr');
          const subtotalCell = row.querySelector('.subtotal');
          const unitCost = cart[productIndex].unitCost;
          const currency = cart[productIndex].currency;
          const newSubtotal = unitCost * newQuantity;
          subtotalCell.textContent = formatCurrency(newSubtotal, currency);
          
          // Recalcular y actualizar el total
          let newSubtotalSum = 0;
          cart.forEach(product => {
            newSubtotalSum += product.unitCost * product.count;
          });
          
          subtotalSummary.textContent = formatCurrency(newSubtotalSum, currency);
          totalSummary.textContent = formatCurrency(newSubtotalSum, currency);
        }
      }
      
      // Función para eliminar un producto del carrito
      function removeItem(event) {
        const productId = event.target.closest('.remove-btn').dataset.id;
        const cart = JSON.parse(localStorage.getItem("cart")) || [];
        const productIndex = cart.findIndex(item => item.id === productId);
        
        if (productIndex !== -1) {
          cart.splice(productIndex, 1);
          localStorage.setItem("cart", JSON.stringify(cart));
          
          // Actualizar la interfaz
          event.target.closest('tr').remove();
          
          // Recalcular totales
          let newSubtotalSum = 0;
          cart.forEach(product => {
            newSubtotalSum += product.unitCost * product.count;
          });
          
          if (cart.length > 0) {
            const currency = cart[0].currency;
            subtotalSummary.textContent = formatCurrency(newSubtotalSum, currency);
            totalSummary.textContent = formatCurrency(newSubtotalSum, currency);
          } else {
            // Si no quedan productos, mostrar mensaje de carrito vacío
            emptyCartMessage.classList.remove("d-none");
            cartContent.classList.add("d-none");
          }
        }
      }
    });