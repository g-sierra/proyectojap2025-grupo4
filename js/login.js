let button = document.getElementById("logBtn");

function validarLogin() {
    let username = document.getElementById("usuario").value.trim();
    let password = document.getElementById("password").value.trim();

    if (username && password) {
        window.location.href = "index.html";
    } else {
        alert("Debes ingresar un usuario y contraseña");
    }
}

button.addEventListener("click", (e) => {
    e.preventDefault();
    validarLogin();
});
