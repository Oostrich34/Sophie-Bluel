// Récupération des projets depuis l'API
let projets = await fetch("http://localhost:5678/api/works")
    .then(response => response.json());

// Fonction pour générer la galerie
function genererProjets(projetsAAfficher) {
    const sectionGallery = document.querySelector(".gallery");
    // Vider la galerie avant d’ajouter les projets
    sectionGallery.innerHTML = "";

    // Boucle pour parcourir les projets
    for (let i = 0; i < projetsAAfficher.length; i++) {
        const figure = projetsAAfficher[i];

        // Création d'une balise HTML pour chaque projet, d'une class "projets" et d'un attribut data-category du nom de catégorie de chaque projet
        const pieceElement = document.createElement("figure");
        pieceElement.classList.add("projets");
        pieceElement.setAttribute("data-category", figure.category.name);

        // Création d'une balise img et récupération de la source de l'image dans l'API
        const imageElement = document.createElement("img");
        imageElement.src = figure.imageUrl;

        // Création d'une balise figcaption et récupération du titre du projet dans l'API
        const titleElement = document.createElement("figcaption");
        titleElement.innerText = figure.title;

        // Rattachement des éléments enfants à leur élément parent
        pieceElement.appendChild(imageElement);
        pieceElement.appendChild(titleElement);
        sectionGallery.appendChild(pieceElement);
    }
}

// Fonction pour filtrer les projets
function filtrerGalerie(categorie) {
    let projetsFiltres;

    if (categorie === "Tous") {
        projetsFiltres = projets; // Tous les projets de l'API
    } else {
        // Filtre pour ne garder que les projets correspondant à la catégorie souhaitée
        projetsFiltres = projets.filter(projet => projet.category.name === categorie); 
    }

    genererProjets(projetsFiltres);
}

// Fonction pour générer les boutons de catégories
function genererCategories(projets) {
    // Création d'un tableau contenant les catégories des projets dans l'API
    const categoryNames = projets.map(p => p.category.name);
    // Suppression des doublons avec l'objet "Set"
    const categorySet = new Set(categoryNames);
    // Création d'un nouveau tableau contenant d'abord l'élément "Tous" puis les les éléments de categorySet 
    const categoriesUniques = ["Tous", ...categorySet]; // "Tous" à gauche

    // Création d'une balise div avec la class "filters" pour contenir les boutons de filtre
    const sectionGallery = document.querySelector(".gallery");
    const btnFilter = document.createElement("div");
    btnFilter.classList.add("filters");

    // Boucle pour parcourir les catégories et créer une balise "button" avec une class "filter-btn" et un attribut "data-category" du nom de chaque catégorie
    for (let i = 0; i < categoriesUniques.length; i++) {
        const cat = categoriesUniques[i];
        const btnElement = document.createElement("button");
        btnElement.classList.add("filter-btn");
        btnElement.setAttribute("data-category", cat);
        btnElement.innerText = cat;

        // Clic sur le bouton pour filtrer et changer l'apparence du bouton cliqué
        btnElement.addEventListener("click", (e) => {
            filtrerGalerie(cat);

            // Supprimer active sur tous les boutons
            document.querySelectorAll(".filter-btn").forEach(btn => btn.classList.remove("active"));

            // Ajouter active sur le bouton cliqué
            e.target.classList.add("active");
        });

        // "Tous" actif par défaut
        if (cat === "Tous") {
            btnElement.classList.add("active");
        }

        btnFilter.appendChild(btnElement);
    }

    sectionGallery.parentNode.insertBefore(btnFilter, sectionGallery);
}

genererProjets(projets);
genererCategories(projets);



// Retour à l'accueil

// Récupération du logo dans la balise header
const logo = document.querySelector("header h1");
logo.style = "cursor: pointer;";
// Clic sur le logo pour recharger la page
logo.addEventListener("click", () => {
    window.location.reload();
});



// Page de login

// Récupération des balises li dans la balise nav
const navItems = document.querySelectorAll("nav li");
navItems.forEach(item => item.style = "cursor: pointer;");
// Récupération de la balise main
const main = document.querySelector("main");

// Clic sur le 3ème élément li (login)
navItems[2].addEventListener("click", () => {
    navItems[2].style = "font-weight: bold;"
    // Remplacement du contenu de la balise main par le formulaire de connexion
    main.innerHTML = "";
    const sectionForm = document.createElement("section");
    sectionForm.setAttribute("id", "login");
    const sectionTitle = document.createElement("h2");
    sectionTitle.textContent = "Log In";
    const formLogin = document.createElement("form");
    formLogin.setAttribute("id", "formLogin");
    formLogin.setAttribute("action", "#");
    formLogin.setAttribute("method", "post");
    const labelEmail = document.createElement("label");
    labelEmail.setAttribute("for", "mail");
    labelEmail.textContent = "E-mail";
    const inputEmail = document.createElement("input");
    inputEmail.setAttribute("type", "text");
    inputEmail.setAttribute("name", "mail");
    inputEmail.setAttribute("id", "mail");
    const labelPassword = document.createElement("label");
    labelPassword.setAttribute("for", "password");
    labelPassword.textContent = "Mot de passe";
    const inputPassword = document.createElement("input");
    inputPassword.setAttribute("type", "password");
    inputPassword.setAttribute("name", "password");
    inputPassword.setAttribute("id", "password");
    const inputSubmit = document.createElement("input");
    inputSubmit.setAttribute("id", "loginSubmit");
    inputSubmit.setAttribute("type", "submit");
    inputSubmit.setAttribute("value", "Se connecter");
    const linkForgot = document.createElement("a");
    linkForgot.setAttribute("href", "#");
    linkForgot.textContent = "Mot de passe oublié";
    formLogin.appendChild(labelEmail);
    formLogin.appendChild(inputEmail);
    formLogin.appendChild(labelPassword);
    formLogin.appendChild(inputPassword);
    formLogin.appendChild(inputSubmit);
    formLogin.appendChild(linkForgot);
    sectionForm.appendChild(sectionTitle);
    sectionForm.appendChild(formLogin);
    main.appendChild(sectionForm);

    // Clic sur le bouton de connexion
    inputSubmit.addEventListener("click", (e) => {
        e.preventDefault();
        const email = document.getElementById("mail").value;
        const password = document.getElementById("password").value;
        console.log(`Email: ${email}, Password: ${password}`);
        // Vérification que les champs ne sont pas vides
        if (email === "" || password === "") {
            alert("Veuillez remplir tous les champs.");
            return;
        }
    });
});




