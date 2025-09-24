// ===============================
// Gestion du login
// ===============================

document.addEventListener("DOMContentLoaded", () => {
    const formLogin = document.querySelector("#formLogin");

    formLogin.addEventListener("submit", async (e) => {
        e.preventDefault();

        const email = document.querySelector("#mail").value.trim();
        const password = document.querySelector("#password").value.trim();

        if (!email || !password) {
            return alert("Veuillez remplir tous les champs.");
        }

        try {
            const response = await fetch("http://localhost:5678/api/users/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password })
            });

            const data = await response.json();

            if (response.ok && data.token) {
                // Stocke le token
                localStorage.setItem("token", data.token);
                // Redirection vers l'accueil
                window.location.href = "index.html";
            } else {
                alert("Email ou mot de passe incorrect.");
            }
        } catch (error) {
            alert("Erreur réseau, veuillez réessayer.");
            console.error(error);
        }
    });
});

