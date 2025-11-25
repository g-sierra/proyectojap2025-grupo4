let button = document.getElementById("logBtn");

async function validarLogin() {
    let username = document.getElementById("usuario").value.trim();
    let password = document.getElementById("password").value.trim();

    if (!username || !password) {
        alert("Por favor, complete ambos campos.");
        return;
    }

    try {
        const response = await fetch("http://localhost:3001/api/auth/login", {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({ username, password })
        });

        const data = await response.json();

        if (data.success) {
            const token = data.token;
            const usernameToStore = (data.user && data.user.username) || data.username || username;

            localStorage.setItem("token", token);
            localStorage.setItem("usuario", usernameToStore);
            window.location.href = "index.html";
        } else {
            alert(data.message || "Error de autenticación.");
        }
    } catch (err) {
        console.error("Error al iniciar sesión", err);
        alert("Error en el servidor");
    } finally {
        button.disabled = false;
        button.textContent = "Confirmar";
    }
}

button.addEventListener("click", (e) => {
    e.preventDefault();
    validarLogin();
});