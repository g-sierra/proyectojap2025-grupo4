// Variables del DOM
const productName = document.getElementById("product-name");
const productPrice = document.getElementById("product-price");
const productDesc = document.getElementById("product-desc");
const productCat = document.getElementById("product-cat");
const productSoldCount = document.getElementById("product-soldCount");
const imgContainer = document.getElementById("img-container");
const botonCarrito = document.getElementById("botonCarrito");
const mainContainer = document.getElementById("main-container");
const relatedContainer = document.getElementById("related-products");

// Cargar productID desde localStorage y definir URL de datos
const PRODUCT_ID = localStorage.getItem("productID");
// Si no hay prouctID en localStorage, redirigir a products.html
if (!PRODUCT_ID) {
    console.error("No se encontró productID en localStorage");
    window.location.replace("products.html");
}
const DATA_URL = `http://localhost:3001/api/products/${PRODUCT_ID}.json`;

// Funcion para llamar a la API
async function getProductData() {
    try {
        const token = localStorage.getItem('token');
        const response = await fetch(DATA_URL, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            throw new Error(`Error HTTP: ${response.status}`);
        }

        const data = await response.json();
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
        img.classList.add("product-img", "img-fluid", "border", "border-success", "shadow");  // Clases de Bootstrap 5

        div.appendChild(img);
        imgContainer.appendChild(div);
        count++;
    });
}
/* Sección de comentarios*/
const commentsContainer = document.getElementById("comments-section");

async function getProductComments() {
    const COMMENTS_URL = `http://localhost:3001/api/products_comments/${PRODUCT_ID}.json`;
    try {
        const token = localStorage.getItem('token');
        const response = await fetch(COMMENTS_URL, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        if (!response.ok) throw new Error(`HTTP error: ${response.status}`);
        return await response.json();
    } catch (error) {
        console.error("Error al obtener comentarios:", error);
        return [];
    }
}
/*Se agrega sección de comentarios*/
function showProductComments(comments) {
    let html = "<h3>Calificaciones</h3>";
    if (!comments.length) {
        commentsContainer.innerHTML += html + "<p class='lead'>No hay comentarios para este producto.</p>";
        return;
    }
    comments.forEach(comment => {
        const userImg = "img/img_perfil.png"; // Se aplica la misma imagen para todos los usuarios
        html += `
        <div class="card comment-card mb-2 border-success shadow-sm">
            <div class="card-body">
                <div class="d-flex flex-column flex-md-row align-items-md-center mb-2">
                    <img src="${userImg}" 
                         alt="Avatar" class="me-3 avatar-img d-none d-md-block">
                    <div class="flex-grow-1">
                        <strong>${comment.user}</strong>
                        <span class="text-muted ms-2 comment-date">${comment.dateTime.split(" ")[0] || ""}</span>
                    </div>
                    <div class="ms-md-auto text-success fs-5">
                        ${"★".repeat(comment.score)}${"☆".repeat(5 - comment.score)}
                    </div>
                </div>
                <p class="mb-0">${comment.description}</p>
            </div>
        </div>
        `;
    });
    commentsContainer.innerHTML = html;
}
// Funcion de productos relacionados

function showRelatedProducts(relatedArray) {
    relatedContainer.innerHTML = "";

    relatedArray.forEach(product => {
        const div = document.createElement("div");
        div.classList.add("col-8", "col-md-3");

        div.innerHTML = `
            <div class="card related-card shadow-sm border-success">
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
    // Mostrar comentarios
    const comments = await getProductComments();
    showProductComments(comments);

    // Manejar el envío del formulario de calificación y comentario
    const ratingForm = document.getElementById("rating-form-footer");

    ratingForm.addEventListener("submit", function(e) {
        e.preventDefault(); // Evita que se recargue la página

        // Tomar la calificación seleccionada
        const score = parseInt(document.querySelector('input[name="footer-rating"]:checked')?.value);
        if (!score) {
            alert("Por favor, seleccioná una calificación.");
            return;
        }

        // Tomar el comentario escrito
        const description = this.querySelector("textarea").value.trim();
        if (!description) {
            alert("Por favor, escribí tu comentario.");
            return;
        }

        // Obtener la fecha actual en formato YYYY-MM-DD
        const now = new Date();
        const fecha = now.toISOString().split("T")[0]; // solo fecha, sin hora

        const newComment = {
            user: localStorage.getItem("usuario") || "Usuario",
            score: score,
            description: description,
            dateTime: fecha
        };

        const commentHTML = `
    <div class="card comment-card mb-2 border-success shadow-sm">
        <div class="card-body">
            <div class="d-flex flex-column flex-md-row align-items-md-center mb-2">
                <img src="img/img_perfil.png" 
                     alt="Avatar" class="me-3 avatar-img d-none d-md-block">
                <div class="flex-grow-1">
                    <strong>${newComment.user}</strong>
                    <span class="text-muted ms-2 comment-date">${newComment.dateTime}</span>
                </div>
                <div class="ms-md-auto text-success fs-5">
                    ${"★".repeat(newComment.score)}${"☆".repeat(5 - newComment.score)}
                </div>
            </div>
            <p class="mb-0">${newComment.description}</p>
        </div>
    </div>
`;

        // Insertarlo al final de la sección de comentarios
        commentsContainer.innerHTML += commentHTML;

        // Limpiar el formulario
        this.reset();
    });
}

// Ejecutar la funcion principal al cargar la página
document.addEventListener("DOMContentLoaded", main);

// Funcionalidad del botón "agregar al carrito"
document.addEventListener("DOMContentLoaded", () => {
  const botonCarrito = document.getElementById("botonCarrito");

  botonCarrito.addEventListener("click", () => {
    // Obtener los datos del producto desde el DOM
    const product = {
      id: localStorage.getItem("productID"), 
      name: document.getElementById("product-name").textContent,
      image: document.querySelector("#img-container img")?.src || "", 
      currency: "USD", 
      unitCost: parseInt(document.getElementById("product-price").textContent.replace(/\D/g, "")),
      count: 1
    };

    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    const existing = cart.find(item => item.id === product.id);
    if (!existing) {
      cart.push(product);
    }

    // Guardar en localStorage
    localStorage.setItem("cart", JSON.stringify(cart));

    // Redirigir a cart.html
    window.location.href = "cart.html";
  });
});