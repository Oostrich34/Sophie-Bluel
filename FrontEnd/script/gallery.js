// ===============================
// Gestion de la galerie
// ===============================

export let projets = [];

// Récupération des projets depuis l'API
export async function fetchProjets() {
    try {
        const response = await fetch("http://localhost:5678/api/works");
        projets = await response.json();
        genererProjets(projets);
        genererCategories(projets);
    } catch (error) {
        console.error("Erreur récupération projets:", error);
    }
}

// Génération de la galerie
export function genererProjets(projetsAAfficher) {
    const sectionGallery = document.querySelector(".gallery");
    sectionGallery.innerHTML = "";
    projetsAAfficher.forEach(p => {
        const figure = document.createElement("figure");
        const img = document.createElement("img");
        img.src = p.imageUrl;
        const title = document.createElement("figcaption");
        title.innerText = p.title;
        figure.appendChild(img);
        figure.appendChild(title);
        sectionGallery.appendChild(figure);
    });
}

// Filtrer galerie
export function filtrerGalerie(categorie) {
    if (categorie === "Tous") {
        genererProjets(projets);
    } else {
        genererProjets(projets.filter(p => p.category.name === categorie));
    }
}

// Génération des boutons de catégorie
export function genererCategories(projets) {
    const categoryNames = [...new Set(projets.map(p => p.category.name))];
    const categoriesUniques = ["Tous", ...categoryNames];

    const sectionGallery = document.querySelector(".gallery");
    const btnFilter = document.createElement("div");
    btnFilter.classList.add("filters");

    categoriesUniques.forEach(cat => {
        const btn = document.createElement("button");
        btn.classList.add("filter-btn");
        btn.dataset.category = cat;
        btn.innerText = cat;

        btn.addEventListener("click", () => {
            filtrerGalerie(cat);
            document.querySelectorAll(".filter-btn").forEach(b => b.classList.remove("active"));
            btn.classList.add("active");
        });

        if(cat==="Tous") btn.classList.add("active");
        btnFilter.appendChild(btn);
    });

    sectionGallery.parentNode.insertBefore(btnFilter, sectionGallery);
}
