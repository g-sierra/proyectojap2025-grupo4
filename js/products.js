// URL de la categoría 101 (Autos)
const CAT_ID = localStorage.getItem("catID");
const URL = `https://japceibal.github.io/emercado-api/cats_products/${CAT_ID}.json`;
const galeria = document.getElementById("galeria");

fetch(URL)
    .then((response) => response.json())
    .then((data) => {
        galeria.innerHTML = ""; // Limpiar galería
        galeria.innerHTML += `
        <div class="categoria">
          <h1>${data.catName}</h1>
        </div>
        `
        // Si no hay productos mostrar un aviso
        if (data.products.length === 0) {
            galeria.innerHTML += `
            <p class="lead">No se encontraron productos en esta categoría</p> 
            `
        }

        data.products.forEach((producto) => {
            galeria.innerHTML += `
            <div class="producto">
              <img src="${producto.image}" alt="${producto.name}">
              <div class="info">
                <div class="product-name"><strong>${producto.name}</strong></div>
                <div class="product-desc">${producto.description} </div>
                <div class="product-price"><strong>${producto.currency} ${producto.cost}</strong></div>
                <div class="product-sold">Cant. vendidos: ${producto.soldCount}</div>
              </div>
            </div>
          `;
        });
    })
    .catch((error) => {
        galeria.innerHTML = "<p>Error al cargar los productos.</p>";
        console.error(error);
    });
document.addEventListener('DOMContentLoaded', function () {
  // Selecciona todos los elementos de producto
  const productos = document.querySelectorAll('.producto[data-product-id]');
  productos.forEach(function (producto) {
    producto.addEventListener('click', function () {
      const productId = this.getAttribute('data-product-id');
      if (productId) {
        localStorage.setItem('productID', productId);
        window.location.href = 'product-info.html';
      }
    });
  });
});
