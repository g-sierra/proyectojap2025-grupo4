// Variables del DOM
const galeria = document.getElementById("galeria");
const tituloDiv = document.querySelector(".titulo");
const sortAscButton = document.getElementById("sortAsc");
const sortDescButton = document.getElementById("sortDesc");
const sortByCountButton = document.getElementById("sortByCount");
const filterButton = document.getElementById("rangeFilterCount");
const clearFilterButton = document.getElementById("clearRangeFilter");

// Otras variables globales
let titulo;
let productos = [];

// Fetch principal
const CAT_ID = localStorage.getItem("catID");
const URL = `https://japceibal.github.io/emercado-api/cats_products/${CAT_ID}.json`;
fetch(URL)
    .then((response) => response.json())
    .then((data) => {
        // Esto muestra el titulo de la categoría
        titulo = data.catName
        insertarTitulo(titulo);
        
        // Acá se cargan todos los productos y se muestran
        productos = data.products;
        mostrarProductos(productos);
        hacerProductosClickeables();
    })
    .catch((error) => {
        galeria.innerHTML = "<p>Error al cargar los productos.</p>";
        console.error(error);
    });

// Funcion para mostrar titulo
function insertarTitulo(texto) {
    tituloDiv.innerHTML = "";
    tituloDiv.innerHTML += `<h1>${texto}</h1>`;
}

// Funcion para mostrar productos
function mostrarProductos(lista) {
    galeria.innerHTML = "";

    if (lista.length === 0) {
        galeria.innerHTML += `<p class="lead">No hay productos para mostrar</p>`
    }

    lista.forEach(producto => {
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
}

// Funcion para hacer productos clickeables
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
  // Botones de filtrado por rango de precio
  filterButton.addEventListener("click", function() {
      const min = parseFloat(document.getElementById("precioMínimo").value) || 0;
      const max = parseFloat(document.getElementById("precioMáximo").value) || Infinity;
      filtrarPorRango(min, max);
  });

  clearFilterButton.addEventListener("click", function() {
      document.getElementById("precioMínimo").value = "";
      document.getElementById("precioMáximo").value = "";
      mostrarProductos(productos); // Muestra todos otra vez
      hacerProductosClickeables();
  });

  // Botones de ordenamiento
  sortAscButton.addEventListener("click", function() {
      ordenarPorPrecioAsc();
  });

  sortDescButton.addEventListener("click", function() {
      ordenarPorPrecioDesc();
  });

  sortByCountButton.addEventListener("click", function() {
      ordenarPorVendidos();
  });

  // 🔍 Buscador en tiempo real
  const searchInput = document.getElementById("searchInput");
  if (searchInput) {
    searchInput.addEventListener("input", function () {
      const query = searchInput.value.toLowerCase();
      const productosFiltrados = productos.filter(producto => {
        const nombre = producto.name.toLowerCase();
        const descripcion = producto.description.toLowerCase();
        return nombre.includes(query) || descripcion.includes(query);
      });
      mostrarProductos(productosFiltrados);
      hacerProductosClickeables();
    });
  }
});

