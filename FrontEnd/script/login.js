// ===============================
// Gestion du login
// ===============================

document.addEventListener("DOMContentLoaded", () => {
    const formLogin = document.querySelector("#formLogin");

    // Création d'un conteneur pour afficher les erreurs
    const errorMessage = document.createElement("p");
    errorMessage.classList.add("error-message");
    formLogin.appendChild(errorMessage);

    formLogin.addEventListener("submit", async (e) => {
        e.preventDefault();

        // Nettoie les anciens messages
        errorMessage.textContent = "";

        const email = document.querySelector("#mail").value.trim();
        const password = document.querySelector("#password").value.trim();

        if (!email || !password) {
            errorMessage.textContent = "Veuillez remplir tous les champs.";
            return;
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
                errorMessage.textContent = "Email ou mot de passe incorrect.";
            }
        } catch (error) {
            errorMessage.textContent = "Erreur réseau, veuillez réessayer.";
            console.error(error);
        }
    });
});

