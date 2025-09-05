// URL de la categoría 101 (Autos)
const CAT_ID = localStorage.getItem("catID");
const URL = `https://japceibal.github.io/emercado-api/cats_products/${CAT_ID}.json`;
const galeria = document.getElementById("galeria");
const tituloDiv = document.querySelector(".titulo");

let productos = [];

fetch(URL)
    .then((response) => response.json())
    .then((data) => {
        // Insertar nombre de la categoria
        const titulo = data.catName
        insertarTitulo(titulo);

        galeria.innerHTML = ""; // Limpiar galería
        
        productos = data.products;
        data.products.forEach((producto) => {
            galeria.innerHTML += `
            <div class="producto" data-product-id="${producto.id}">
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
        hacerProductosClickeables();
    })
    .catch((error) => {
        galeria.innerHTML = "<p>Error al cargar los productos.</p>";
        console.error(error);
    });

// Mostrar titulo
function insertarTitulo(texto) {
    tituloDiv.innerHTML = "";
    tituloDiv.innerHTML += `<h1>${texto}</h1>`;
}

// Mostrar productos
function mostrarProductos(lista) {
  galeria.innerHTML = ""; 

  lista.forEach((producto) => {
    galeria.innerHTML += `
      <div class="producto" data-product-id="${producto.id}">
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

// Hacer productos clickeables
function hacerProductosClickeables() {
    const productosDiv = document.querySelectorAll(".producto[data-product-id]");
    productosDiv.forEach(function (producto) {
        producto.addEventListener("click", function () {
            const productId = this.getAttribute("data-product-id");
            if (productId) {
                localStorage.setItem("productID", productId);
                window.location.href = "product-info.html";
            }
        });
    });
}

// Ordena los productos por precio ascendente
function ordenarPorPrecioAsc() {
  const ordenados = [...productos].sort((a, b) => a.cost - b.cost);
  mostrarProductos(ordenados);
  hacerProductosClickeables();
}

// Ordena los productos por precio descendente
function ordenarPorPrecioDesc() {
  const ordenados = [...productos].sort((a, b) => b.cost - a.cost);
  mostrarProductos(ordenados);
  hacerProductosClickeables();
}

// Ordena los productos por cantidad de vendidos (descendente)
function ordenarPorVendidos() {
  const ordenados = [...productos].sort((a, b) => b.soldCount - a.soldCount);
  mostrarProductos(ordenados);
  hacerProductosClickeables();
}
// Filtra los productos que están dentro de un rango de precio definido
function filtrarPorRango(precioMin, precioMax) {
  const filtrados = productos.filter(producto => {
    return producto.cost >= precioMin && producto.cost <= precioMax;
  });
  mostrarProductos(filtrados);
  hacerProductosClickeables();
}

document.addEventListener("DOMContentLoaded", function(){

  document.getElementById("rangeFilterCount").addEventListener("click", function() {
    const min = parseFloat(document.getElementById("precioMínimo").value) || 0;
    const max = parseFloat(document.getElementById("precioMáximo").value) || Infinity;
    filtrarPorRango(min, max);
  });

  // Botones de filtrado por rango de precio
  document.getElementById("rangeFilterCount").addEventListener("click", function() {
      const min = parseFloat(document.getElementById("precioMínimo").value) || 0;
      const max = parseFloat(document.getElementById("precioMáximo").value) || Infinity;
      filtrarPorRango(min, max);
  });

  document.getElementById("clearRangeFilter").addEventListener("click", function() {
      document.getElementById("precioMínimo").value = "";
      document.getElementById("precioMáximo").value = "";
      mostrarProductos(productos); // Muestra todos otra vez
  });

  // Botones de ordenamiento
  document.getElementById("sortAsc").addEventListener("click", function() {
      ordenarPorPrecioAsc();
  });

  document.getElementById("sortDesc").addEventListener("click", function() {
      ordenarPorPrecioDesc();
  });

  document.getElementById("sortByCount").addEventListener("click", function() {
      ordenarPorVendidos();
  });

});
