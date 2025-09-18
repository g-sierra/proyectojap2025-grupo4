// Variables del DOM
const productName = document.getElementById("product-name");
const productPrice = document.getElementById("product-price");
const productDesc = document.getElementById("product-desc");
const productCat = document.getElementById("product-cat");
const productSoldCount = document.getElementById("product-soldCount");
const imgContainer = document.getElementById("img-container");
const botonCarrito = document.getElementById("botonCarrito");
const mainContainer = document.getElementById("main-container");

// Cargar productID desde localStorage y definir URL de datos
const PRODUCT_ID = localStorage.getItem("productID");
// Si no hay prouctID en localStorage, redirigir a products.html
if(!PRODUCT_ID) {
    console.error("No se encontró productID en localStorage");
    window.location.replace("products.html");
}
const DATA_URL = `https://japceibal.github.io/emercado-api/products/${PRODUCT_ID}.json`;

// Funcion para llamar a la API
async function getProductData() {
    try {
        const response = await fetch(DATA_URL);

        if (!response.ok) {
            throw new Error(`Error HTTP: ${response.status}`);
        }

        const data = await response.json();
        // console.log(data);
        return data;

    } catch (error) {
        console.error("Error al obtener los datos del producto:", error);
    }
}

// Funcion para mostrar los datos en el DOM
function showProductData(data) {
    productName.textContent = data.name;
    productPrice.textContent = `${data.currency} ${data.cost}`;
    productDesc.textContent = data.description;
    productCat.textContent = data.category;
    productSoldCount.textContent = data.soldCount;
}

// Funcion para mostrar las imagenes
function showProductImages(imageArray, productName) {
    imgContainer.innerHTML = "";
    let count = 1;  // Contador para el alt dinamico de las imagenes
    imageArray.forEach(image => {
        const div = document.createElement("div");
        div.classList.add("col-12", "col-lg-6");  // Clases de Bootstrap 5

        const img = document.createElement("img");
        img.src = image;
        img.alt = `Imagen ${count} del producto: ${productName}`;
        img.classList.add("img-fluid", "border", "border-success", "shadow");  // Clases de Bootstrap 5
        
        div.appendChild(img);
        imgContainer.appendChild(div);
        count++;
    });
}

// Funcion de productos relacionados

function showRelatedProducts(relatedArray) {
    const relatedContainer = document.getElementById("related-products");
    relatedContainer.innerHTML = "";

    relatedArray.forEach(product => {
        const div = document.createElement("div");
        div.classList.add("col-6", "col-md-4", "col-lg-3");

        div.innerHTML = `
            <div class="card h-100 shadow-sm border-success">
                <img src="${product.image}" 
                     alt="Imagen del producto relacionado: ${product.name}" 
                     class="card-img-top img-fluid">
                <div class="card-body p-2">
                    <h6 class="card-title text-center">${product.name}</h6>
                </div>
            </div>
        `;

        // Cuando clickeo en un producto relacionado
        div.addEventListener("click", () => {
            localStorage.setItem("productID", product.id); 
            location.reload(); 
        });

        relatedContainer.appendChild(div);
    });
}

// Funcion principal
async function main() {
    // Cargar datos del producto
    const productData = await getProductData();
    if (!productData) {
        mainContainer.innerHTML = `
            <p class="lead text-center p-5">
              Error al cargar los datos del producto.
            </p>
        `;
        return;
    }
    // Mostrar datos en la página
    showProductData(productData);
    // Mostrar imágenes del producto
    showProductImages(productData.images, productData.name);

    showRelatedProducts(productData.relatedProducts);
}

// Manejar click en boton del carrito
botonCarrito.addEventListener("click", () => {
    alert("Funcionalidad en desarrollo");
})

// Ejecutar la funcion principal
main();