// URL de la categoría 101 (Autos)
const CAT_ID = localStorage.getItem("catID");
const URL = `https://japceibal.github.io/emercado-api/cats_products/${CAT_ID}.json`;
const galeria = document.getElementById("galeria");

let productos = [];

fetch(URL)
    .then((response) => response.json())
    .then((data) => {
        galeria.innerHTML = ""; // Limpiar galería
        galeria.innerHTML += `
        <div class="categoria">
          <h1>${data.catName}</h1>
        </div>
        `
<<<<<<< HEAD
        productos = data.products;
        mostrarProductos(productos);
=======
        // Si no hay productos mostrar un aviso
        if (data.products.length === 0) {
            galeria.innerHTML += `
            <p class="lead">No se encontraron productos en esta categoría</p> 
            `
        }

>>>>>>> 90ddbdb50965ffc10cbeba4e28ab62bc6b67c446
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
<<<<<<< HEAD

function mostrarProductos(lista) {
  galeria.innerHTML = ""; 
  galeria.innerHTML += `
    <div class="categoria">
      <div><strong>${lista.length > 0 ? lista[0].categoryName || "" : ""}</strong></div>
    </div>
  `;
  lista.forEach((producto) => {
    galeria.innerHTML += `
      <div class="producto">
        <img src="${producto.image}" alt="${producto.name}">
        <div class="info">
          <div><strong>${producto.name}</strong></div>
          <div>${producto.description}</div>
          <div><strong>${producto.currency} ${producto.cost}</strong></div>
          <div><strong>Cant. vendidos:</strong> ${producto.soldCount}</div>
        </div>
      </div>
    `;
  });
}
// Ordena los productos por precio ascendente
function ordenarPorPrecioAsc() {
  const ordenados = [...productos].sort((a, b) => a.cost - b.cost);
  mostrarProductos(ordenados);
}

// Ordena los productos por precio descendente
function ordenarPorPrecioDesc() {
  const ordenados = [...productos].sort((a, b) => b.cost - a.cost);
  mostrarProductos(ordenados);
}

// Ordena los productos por cantidad de vendidos (descendente)
function ordenarPorVendidos() {
  const ordenados = [...productos].sort((a, b) => b.soldCount - a.soldCount);
  mostrarProductos(ordenados);
}
// Filtra los productos que están dentro de un rango de precio definido
function filtrarPorRango(precioMin, precioMax) {
  const filtrados = productos.filter(producto => {
    return producto.cost >= precioMin && producto.cost <= precioMax;
  });
  mostrarProductos(filtrados);
}

document.getElementById("aplicarFiltro").addEventListener("click", () => {
  const min = parseFloat(document.getElementById("precioMin").value) || 0;
  const max = parseFloat(document.getElementById("precioMax").value) || Infinity;
  filtrarPorRango(min, max);
=======
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
>>>>>>> 90ddbdb50965ffc10cbeba4e28ab62bc6b67c446
});
