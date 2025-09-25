//==============================
// Gestion de la modale d'édition
//==============================

import { projets, fetchProjets, genererProjets } from "./gallery.js";

export function activerModeEdition() {
    // Barre Mode édition
    if (!document.querySelector(".edit-bar")) {
        const editBar = document.createElement("div");
        editBar.classList.add("edit-bar");
        editBar.innerHTML = 
        `<i class="fa-regular fa-pen-to-square"></i>
        <span>Mode édition</span>
        `;
        document.body.insertBefore(editBar, document.body.firstChild);
    }

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
    addPhotoBtn.type = "submit";
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


    // Ajouter une photo
    addPhotoBtn.addEventListener("click", () => {
        // Bouton retour
        const returnBtn = document.createElement("i");
        returnBtn.classList.add("fa-solid", "fa-arrow-left", "return-btn");

        // Changement du contenu de la modale pour le formulaire d'ajout
        const modalGallery = document.querySelector(".modal-gallery");
        modalGallery.innerHTML = "";
        container.classList.add("modal-add-photo");
        modalTitle.textContent = "Ajout photo";
        const formAddPhoto = document.createElement("form");
        formAddPhoto.setAttribute("id", "addPhoto");

        // Création des éléments du formulaire d'ajout de photo

        // Prévisualisation image + input file
        const addImagePreview = document.createElement("div");
        addImagePreview.classList.add("add-image-preview");

        const imgPreview = document.createElement("i");
        imgPreview.classList.add("fa-regular", "fa-image", "image-preview");

        const addImageBtn = document.createElement("input");
        addImageBtn.type = "submit";
        addImageBtn.classList.add("btn-add-image");
        addImageBtn.name = "image";
        addImageBtn.value = "+ Ajouter photo";
        addImageBtn.accept = "image/png, image/jpeg";
        addImageBtn.required = true;

        const addImageLabel = document.createElement("label");
        addImageLabel.htmlFor = "image";

        const imgText = document.createElement("p");
        imgText.textContent = "jpg, png : 4mo max";
        
        addImagePreview.appendChild(imgPreview);
        addImagePreview.appendChild(imgText);
        addImagePreview.appendChild(addImageBtn);

        // Ajout du titre
        const titleLabel = document.createElement("label");
        titleLabel.textContent = "Titre";
        titleLabel.setAttribute("for", "title");
        const titleInput = document.createElement("input");
        titleInput.type = "text";
        titleInput.id = "title";
        titleInput.name = "title";
        titleInput.required = true;
        
        titleLabel.appendChild(titleInput);

        // Sélecteur de catégorie
        const categorySelect = document.createElement("select");
        categorySelect.id = "category";
        categorySelect.name = "category";
        categorySelect.required = true;
        const defaultOption = document.createElement("option");
        defaultOption.value = "";
        defaultOption.selected = true;
        const categoryLabel = document.createElement("label");
        categoryLabel.textContent = "Catégorie";
        categoryLabel.setAttribute("for", "category");
        categoryLabel.appendChild(categorySelect);
        const categories = ["Objets", "Appartements", "Hôtels & restaurants"];
        categories.forEach(cat => {
            const option = document.createElement("option");
            option.value = cat;
            option.textContent = cat;
            categorySelect.appendChild(option);
        });
        
        // Bouton valider
        const addPhotoBtn = document.createElement("input");
        addPhotoBtn.value = "Valider";
        addPhotoBtn.type = "button";
        addPhotoBtn.classList.add("btn-validate");


        formAddPhoto.appendChild(addImagePreview);
        addImagePreview.appendChild(addImageLabel);
        addImagePreview.appendChild(addImageBtn)
        formAddPhoto.appendChild(titleLabel);
        formAddPhoto.appendChild(categoryLabel);
        categorySelect.appendChild(defaultOption);
        formAddPhoto.appendChild(addPhotoBtn);
        modalTitle.prepend(returnBtn);
        container.appendChild(formAddPhoto);
        container.appendChild(addPhotoBtn);

    });

    // Fermer en cliquant en dehors de la modale
    overlay.addEventListener("click", e => {
        if (e.target === overlay) overlay.remove();
    });
}
