// Variables del DOM
const productName = document.getElementById("product-name");
const productPrice = document.getElementById("product-price");
const productDesc = document.getElementById("product-desc");
const productCat = document.getElementById("product-cat");
const productSoldCount = document.getElementById("product-soldCount");
const imgContainer = document.getElementById("img-container");

// Llamada a la API
const PRODUCT_ID = localStorage.getItem("productID");
const DATA_URL = `https://japceibal.github.io/emercado-api/products/${PRODUCT_ID}.json`;

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

// Funcion principal
async function main() {
    // Cargar datos del producto
    const productData = await getProductData();
    // Mostrar datos en la página
    showProductData(productData);
    // Mostrar imágenes del producto
    showProductImages(productData.images, productData.name);
}

main();