// URL de la categoría 101 (Autos)
const URL = "https://japceibal.github.io/emercado-api/cats_products/101.json";
const galeria = document.getElementById("galeria");

fetch(URL)
    .then((response) => response.json())
    .then((data) => {
        galeria.innerHTML = ""; // Limpiar galería
        data.products.forEach((producto) => {
            galeria.innerHTML += `
            <div class="producto">
              <img src="${producto.image}" alt="${producto.name}">
              <div class="info">
                <div><strong>Nombre:</strong> ${producto.name}</div>
                <div><strong>Descripción:</strong> ${producto.description}</div>
                <div><strong>Precio:</strong> ${producto.currency} ${producto.cost}</div>
                <div><strong>Cant. vendidos:</strong> ${producto.soldCount}</div>
              </div>
            </div>
          `;
        });
    })
    .catch((error) => {
        galeria.innerHTML = "<p>Error al cargar los productos.</p>";
        console.error(error);
    });
