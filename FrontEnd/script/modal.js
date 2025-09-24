//==============================
// Gestion de la modale d'édition
//==============================

import { projets, genererProjets } from "./gallery.js";

export function activerModeEdition() {
    const title = document.querySelector("#portfolio h2");
    if (!title) return;

    // Supprimer les filtres
    const filters = document.querySelector(".filters");
    if (filters) filters.remove();

    // Lien modifier + icône
    if (!document.querySelector(".edit-link")) {
        const editLink = document.createElement("a");
        editLink.href = "#";
        editLink.classList.add("edit-link");

        const icon = document.createElement("i");
        icon.classList.add("fa-regular", "fa-pen-to-square");

        editLink.appendChild(icon);
        editLink.appendChild(document.createTextNode("modifier"));
        title.appendChild(editLink);

        editLink.addEventListener("click", e => {
            e.preventDefault();
            ouvrirModaleEdition();
        });
    }
}

export function ouvrirModaleEdition() {
    // Overlay
    const overlay = document.createElement("div");
    overlay.classList.add("overlay");

    // Modale
    const modal = document.createElement("div");
    modal.classList.add("modal");

    // Titre
    const modalTitle = document.createElement("h3");
    modalTitle.textContent = "Galerie photo";

    // Bouton fermer
    const btnClose = document.createElement("button");
    btnClose.textContent = "✖";
    btnClose.classList.add("btn-close");
    btnClose.addEventListener("click", () => overlay.remove());

    // Container images
    const container = document.createElement("div");
    container.classList.add("modal-gallery");

    projets.forEach(projet => {
        const figure = document.createElement("figure");

        const img = document.createElement("img");
        img.src = projet.imageUrl;

        const btnDelete = document.createElement("button");
        btnDelete.classList.add("btn-delete");
        const iconDelete = document.createElement("i");
        iconDelete.classList.add("fa-solid", "fa-trash-can");
        btnDelete.appendChild(iconDelete);

        btnDelete.addEventListener("click", () => {
            if (confirm("Supprimer ce projet ?")) {
                figure.remove();
                const index = projets.indexOf(projet);
                if(index !== -1) projets.splice(index, 1);
                genererProjets(projets);
            }
        });

        figure.appendChild(img);
        figure.appendChild(btnDelete);
        container.appendChild(figure);
    });

    // Ligne de séparation
    const separator = document.createElement("hr");
    separator.classList.add("separator");

    // Bouton ajouter une photo
    const addPhotoBtn = document.createElement("input");
    addPhotoBtn.type = "button";
    addPhotoBtn.value = "Ajouter une photo";
    addPhotoBtn.classList.add("btn-add-photo");

    // Assemblage
    modal.appendChild(modalTitle);
    modal.appendChild(btnClose);
    modal.appendChild(container);
    modal.appendChild(separator);
    modal.appendChild(addPhotoBtn);
    overlay.appendChild(modal);
    document.body.appendChild(overlay);

    // Fermer en cliquant en dehors de la modale
    overlay.addEventListener("click", e => {
        if (e.target === overlay) overlay.remove();
    });
}
