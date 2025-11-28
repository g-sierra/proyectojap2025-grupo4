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
        
        // Calcular total (subtotal)
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
          updateCartBadge(); // Actualizar el contador del carrito
          
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

          // Recalcular envío y total final después de cambiar cantidades
          calculateShipping();
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
          updateCartBadge(); // Actualizar el contador del carrito
          
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

            // Recalcular envío y total final después de eliminar un ítem
            calculateShipping();
          } else {
            // Si no quedan productos, mostrar mensaje de carrito vacío
            emptyCartMessage.classList.remove("d-none");
            cartContent.classList.add("d-none");
          }
        }
      }

      // --- Nuevo: manejo de tipo de envío y forma de pago y finalizar compra ---
      const shippingCostEl = document.getElementById('shipping-cost');
      const shippingRadios = document.querySelectorAll('input[name="shippingType"]');
      const paymentRadios = document.querySelectorAll('input[name="paymentMethod"]');
      const cardFields = document.getElementById('card-fields');
      const bankFields = document.getElementById('bank-fields');
  const checkoutMessages = document.getElementById('checkout-messages');
  const globalMessages = document.getElementById('checkout-messages-global');

      // Función para calcular y mostrar costo de envío según selección
      function calculateShipping() {
        const selected = document.querySelector('input[name="shippingType"]:checked');
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        if (!selected || cart.length === 0) return;

        // porcentajes según id
        let pct = 0;
        if (selected.id === 'premiumShipping') pct = 0.15;
        else if (selected.id === 'expressShipping') pct = 0.07;
        else if (selected.id === 'standardShipping') pct = 0.05;

        let subtotal = 0;
        cart.forEach(p => subtotal += p.unitCost * p.count);

        const shippingCost = Math.round(subtotal * pct);
        shippingCostEl.textContent = formatCurrency(shippingCost, cart[0].currency);

        const total = subtotal + shippingCost;
        document.getElementById('total-summary').textContent = formatCurrency(total, cart[0].currency);
        document.getElementById('subtotal-summary').textContent = formatCurrency(subtotal, cart[0].currency);
      }

      // Escuchar cambios en tipo de envío
      shippingRadios.forEach(r => r.addEventListener('change', calculateShipping));

      // Calcular envío
      calculateShipping();

      // Mostrar/ocultar campos de pago según selección
      function togglePaymentFields() {
        const selected = document.querySelector('input[name="paymentMethod"]:checked');
        if (!selected) return;
        if (selected.id === 'creditCard') {
          cardFields.classList.remove('d-none');
          bankFields.classList.add('d-none');
        } else if (selected.id === 'bankTransfer') {
          cardFields.classList.add('d-none');
          bankFields.classList.remove('d-none');
        }
      }
      paymentRadios.forEach(r => r.addEventListener('change', togglePaymentFields));
      // Inicializar visibilidad
      togglePaymentFields();

      // Mostrar mensajes
      function clearMessages() {
        if (checkoutMessages) checkoutMessages.innerHTML = '';
        if (globalMessages) globalMessages.innerHTML = '';
      }

      function showErrors(errors) {
        clearMessages();
        const wrapper = document.createElement('div');
        wrapper.className = 'alert alert-danger';
        const ul = document.createElement('ul');
        errors.forEach(e => {
          const li = document.createElement('li');
          li.textContent = e;
          ul.appendChild(li);
        });
        wrapper.appendChild(ul);
        const target = globalMessages || checkoutMessages;
        if (target) target.appendChild(wrapper);
        wrapper.scrollIntoView({behavior: 'smooth', block: 'center'});
      }

      function showSuccess() {
        clearMessages();
        const wrapper = document.createElement('div');
        wrapper.className = 'alert alert-success';
  wrapper.textContent = 'Compra Exitosa';
  const target = globalMessages || checkoutMessages;
  if (target) target.appendChild(wrapper);
  wrapper.scrollIntoView({behavior: 'smooth', block: 'center'});

        // Simular envío
        localStorage.removeItem('cart');
        // Mostrar carrito vacío
        document.getElementById('empty-cart-message').classList.remove('d-none');
        document.getElementById('cart-content').classList.add('d-none');
        updateCartBadge();
      }

      // Validación y handler de finalizar compra
      const finalizarBtn = document.getElementById('finalizar-compra');
      if (finalizarBtn) {
        finalizarBtn.addEventListener('click', function() {
          const errors = [];
          const cart = JSON.parse(localStorage.getItem('cart')) || [];

          // Validar carrito no vacío
          if (cart.length === 0) {
            errors.push('El carrito está vacío. Agregue productos antes de finalizar la compra.');
            showErrors(errors);
            return;
          }

          // Validar cantidades
          document.querySelectorAll('.quantity-input').forEach(input => {
            const val = parseInt(input.value, 10);
            const name = input.closest('tr')?.querySelector('strong')?.textContent || 'Producto';
            if (!val || val <= 0) {
              errors.push(`La cantidad de "${name}" debe ser mayor a 0.`);
            }
          });

          // Validar dirección
          const department = document.getElementById('department')?.value?.trim();
          const locality = document.getElementById('locality')?.value?.trim();
          const street = document.getElementById('street')?.value?.trim();
          const number = document.getElementById('number')?.value?.trim();
          const corner = document.getElementById('corner')?.value?.trim();

          if (!department) errors.push('El campo "Departamento" no puede estar vacío.');
          if (!locality) errors.push('El campo "Localidad" no puede estar vacío.');
          if (!street) errors.push('El campo "Calle" no puede estar vacío.');
          if (!number) errors.push('El campo "Número" no puede estar vacío.');
          if (!corner) errors.push('El campo "Esquina" no puede estar vacío.');

          // Validar tipo de envío
          const selectedShipping = document.querySelector('input[name="shippingType"]:checked');
          if (!selectedShipping) errors.push('Debe seleccionar un tipo de envío.');

          // Validar forma de pago y sus campos
          const selectedPayment = document.querySelector('input[name="paymentMethod"]:checked');
          if (!selectedPayment) {
            errors.push('Debe seleccionar una forma de pago.');
          } else {
            if (selectedPayment.id === 'creditCard') {
              const cardNumber = document.getElementById('card-number')?.value?.trim();
              const cardHolder = document.getElementById('card-holder')?.value?.trim();
              const cardExpiry = document.getElementById('card-expiry')?.value?.trim();
              const cardCvv = document.getElementById('card-cvv')?.value?.trim();
              if (!cardNumber) errors.push('Ingrese el número de la tarjeta.');
              if (!cardHolder) errors.push('Ingrese el nombre del titular.');
              if (!cardExpiry) errors.push('Ingrese la fecha de vencimiento.');
              if (!cardCvv) errors.push('Ingrese el CVV.');
            } else if (selectedPayment.id === 'bankTransfer') {
              const account = document.getElementById('bank-account')?.value?.trim();
              const accName = document.getElementById('bank-account-name')?.value?.trim();
              if (!account) errors.push('Ingrese el número de cuenta para la transferencia.');
              if (!accName) errors.push('Ingrese el nombre del titular de la cuenta.');
            }
          }

          if (errors.length > 0) {
            showErrors(errors);
            return;
          }

          // Si todo está correcto
          showSuccess();
        });
      }
    });
