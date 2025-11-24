const BASE_URL = "http://localhost:3001/api";

const CATEGORIES_URL = `${BASE_URL}/cats/cat.json`;
const PUBLISH_PRODUCT_URL = `${BASE_URL}/sell/publish.json`;
const PRODUCTS_URL = `${BASE_URL}/cats_products/`;
const PRODUCT_INFO_URL = `${BASE_URL}/products/`;
const PRODUCT_INFO_COMMENTS_URL = `${BASE_URL}/products_comments/`;
const CART_INFO_URL = `${BASE_URL}/user_cart/`;
const CART_BUY_URL = `${BASE_URL}/cart/buy.json`;
const EXT_TYPE = ".json";

let showSpinner = function(){
  document.getElementById("spinner-wrapper").style.display = "block";
}

let hideSpinner = function(){
  document.getElementById("spinner-wrapper").style.display = "none";
}

let getJSONData = function(url){
    let result = {};
    showSpinner();
    return fetch(url)
    .then(response => {
      if (response.ok) {
        return response.json();
      }else{
        throw Error(response.statusText);
      }
    })
    .then(function(response) {
          result.status = 'ok';
          result.data = response;
          hideSpinner();
          return result;
    })
    .catch(function(error) {
        result.status = 'error';
        result.data = error;
        hideSpinner();
        return result;
    });
}


// Redireccionar al login si la sesión no está iniciada (Desafiate Entrega 1)
// Función para actualizar el contador del carrito
function updateCartBadge() {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const cartBadge = document.getElementById("cart-count");
    if (cartBadge) {
        let totalItems = 0;
        cart.forEach(item => {
            totalItems += item.count;
        });
        cartBadge.textContent = totalItems;
        cartBadge.style.display = totalItems > 0 ? "inline" : "none";
    }
}

document.addEventListener("DOMContentLoaded", () => {
    let usuario = localStorage.getItem("usuario");
    if (!usuario){
        window.location.href = "login.html";
    }

    // Agregar el nombre de usuario a la barra de navegación (Desafiate Entrega 2)
    let navbarList = document.querySelector("#navbarNav>ul");
    let isProfile = window.location.pathname.endsWith("my-profile.html");
    navbarList.innerHTML += `
    <li class="nav-item">
      <a class="nav-link${isProfile ? " active" : ""}" href="my-profile.html">${usuario}</a>
    </li>
    `;

    // Actualizar el contador del carrito al cargar la página
    updateCartBadge();
});