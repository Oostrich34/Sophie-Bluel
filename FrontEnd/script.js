// Récupération des "projets" dans la mémoire du navigateur (localStorage) s'il y en a
/*let projets = window.localStorage.getItem("projets");

// Si le localStorage est vide, récupération dans l'API
if (projets === null) {

let projets = await fetch("http://localhost:5678/api/works").then(response => response.json());

    // Conversion de l'objet en chaîne JSON
    const valeurProjets = JSON.stringify(projets);

    // Sauvegarde des données dans le localStorage
    window.localStorage.setItem("projets", valeurProjets);

// Sinon, transformation des données en objet JavaScript
    } else {
    projets = JSON.parse(projets);
}*/


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

