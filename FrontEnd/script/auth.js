// ===============================
// Gestion de l'authentification
// ===============================

document.addEventListener("DOMContentLoaded", () => {
    const loginLink = document.querySelector("nav a[href*='login']");
    const token = localStorage.getItem("token");

    if (token) {
        if (loginLink) {
            loginLink.textContent = "logout";
            loginLink.href = "#";
            loginLink.addEventListener("click", e => {
                e.preventDefault();
                localStorage.removeItem("token");
                window.location.reload();
            });
        }
    } else {
        if (loginLink) {
            loginLink.textContent = "login";
            loginLink.href = "login.html";
        }
    }
});
