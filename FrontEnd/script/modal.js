//==============================
// Gestion de la modale d'édition
//==============================

// modal.js
import { projets, fetchProjets, genererProjets } from "./gallery.js";

export function activerModeEdition() {
    if (!document.querySelector(".edit-bar")) {
        const editBar = document.createElement("div");
        editBar.classList.add("edit-bar");
        editBar.innerHTML = `<i class="fa-regular fa-pen-to-square"></i><span>Mode édition</span>`;
        document.body.insertBefore(editBar, document.body.firstChild);
    }

    const title = document.querySelector("#portfolio h2");
    if (!title) return;

    const filters = document.querySelector(".filters");
    if (filters) filters.remove();

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
    // overlay + modal
    const overlay = document.createElement("div");
    overlay.classList.add("overlay");

    const modal = document.createElement("div");
    modal.classList.add("modal");

    // titre + close
    const modalTitle = document.createElement("h3");
    modalTitle.textContent = "Galerie photo";

    const btnClose = document.createElement("button");
    btnClose.type = "button";
    btnClose.textContent = "✖";
    btnClose.classList.add("btn-close");
    btnClose.addEventListener("click", () => overlay.remove());

    // container et footerBtn (bouton en bas qui change de rôle)
    const container = document.createElement("div");
    container.classList.add("modal-gallery");

    const footerBtn = document.createElement("button");
    footerBtn.type = "button"; // important ! évite soumission involontaire
    footerBtn.classList.add("btn-footer");
    footerBtn.textContent = "Ajouter une photo";

    // renderGallery (remplit container et remet le footer en mode "Ajouter...")
    function renderGallery() {
        modalTitle.textContent = "Galerie photo";
        footerBtn.textContent = "Ajouter une photo";
        footerBtn.disabled = false;
        footerBtn.onclick = () => openFormView();

        container.classList.remove("modal-add-photo");
        container.innerHTML = "";

        projets.forEach(projet => {
            const figure = document.createElement("figure");

            const img = document.createElement("img");
            img.src = projet.imageUrl;

            const btnDelete = document.createElement("button");
            btnDelete.type = "button";
            btnDelete.classList.add("btn-delete");
            btnDelete.innerHTML = `<i class="fa-solid fa-trash-can"></i>`;

            btnDelete.addEventListener("click", async () => {
                if (!confirm("Supprimer ce projet ?")) return;
                try {
                    const res = await fetch(`http://localhost:5678/api/works/${projet.id}`, {
                        method: "DELETE",
                        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
                    });
                    if (res.ok) {
                        // retirer du DOM et du tableau
                        const idx = projets.findIndex(p => p.id === projet.id);
                        if (idx !== -1) projets.splice(idx, 1);
                        genererProjets(projets);
                        renderGallery(); // mise à jour modale
                    } else {
                        alert("Erreur lors de la suppression");
                    }
                } catch (err) {
                    console.error(err);
                    alert("Erreur réseau lors de la suppression.");
                }
            });

            figure.appendChild(img);
            figure.appendChild(btnDelete);
            container.appendChild(figure);
        });
    }

    // initial render
    renderGallery();

    // assemblage
    modal.appendChild(modalTitle);
    modal.appendChild(btnClose);
    modal.appendChild(container);
    modal.appendChild(footerBtn);
    overlay.appendChild(modal);
    document.body.appendChild(overlay);

    // clic en dehors ferme
    overlay.addEventListener("click", e => {
        if (e.target === overlay) overlay.remove();
    });

    // ---- VIEW : formulaire d'ajout ----
    function openFormView() {
        // Préparer la vue formulaire dans le même container (sans recréer la modale)
        container.classList.add("modal-add-photo");
        container.innerHTML = "";
        modalTitle.textContent = "Ajout photo";

        // bouton retour (flèche) : il remet la galerie (sans fermer la modale)
        const returnBtn = document.createElement("i");
        returnBtn.classList.add("fa-solid", "fa-arrow-left", "return-btn");
        returnBtn.style.cursor = "pointer";
        returnBtn.addEventListener("click", () => {
            renderGallery();
        });
        // positionner le bouton de retour (on l'insère avant le titre pour que le CSS puisse le placer)
        if (!modal.querySelector(".return-btn")) modal.insertBefore(returnBtn, modalTitle);

        // Formulaire
        const form = document.createElement("form");
        form.classList.add("form-add-photo");

        // Preview container : label (cliquable) + file input caché + preview img + helper text
        const previewContainer = document.createElement("div");
        previewContainer.classList.add("add-image-preview");

        const previewIcon = document.createElement("i");
        previewIcon.classList.add("fa-regular", "fa-image");

        const previewImg = document.createElement("img");
        previewImg.style.display = "none";

        const fileInput = document.createElement("input");
        fileInput.type = "file";
        fileInput.accept = "image/png, image/jpeg";
        fileInput.id = "fileUpload";       // ID unique
        fileInput.style.display = "none";  // caché

        // Label cliquable qui remplace le "+ Ajouter photo" visible
        const fileLabel = document.createElement("label");
        fileLabel.setAttribute("for", "fileUpload"); // relie le label à l'input
        fileLabel.classList.add("add-image-label");
        fileLabel.textContent = "+ Ajouter photo";

        const helper = document.createElement("p");
        helper.classList.add("helper-text");
        helper.textContent = "jpg, png : 4mo max";

        // onclick du label -> déclenche le fileInput (le navigateur le fait automatiquement grâce au for)
        // Preview : afficher l'image choisie
        fileInput.addEventListener("change", () => {
        if (fileInput.files.length > 0) {
            const reader = new FileReader();
            reader.onload = e => {
                previewImg.src = e.target.result;
                previewImg.style.display = "block";
                previewIcon.style.display = "none";
                fileLabel.style.display = "none";
                helper.style.display = "none";
            };
            reader.readAsDataURL(fileInput.files[0]);
            updateFooterButtonState();
        }
    });

        previewContainer.appendChild(previewIcon);
        previewContainer.appendChild(previewImg);
        previewContainer.appendChild(fileInput);
        previewContainer.appendChild(fileLabel);
        previewContainer.appendChild(helper);

        // titre + select catégorie
        const inputTitle = document.createElement("input");
        inputTitle.type = "text";
        inputTitle.id = "title";
        inputTitle.placeholder = "Titre";
        inputTitle.required = true;

        const selectCategory = document.createElement("select");
        selectCategory.id = "category";
        selectCategory.required = true;
        // on charge les catégories réelles depuis l'API (si dispo)
        fetch("http://localhost:5678/api/categories")
            .then(r => r.json())
            .then(cats => {
                selectCategory.innerHTML = `<option value="">-- Sélectionner une catégorie --</option>`;
                cats.forEach(cat => {
                    const o = document.createElement("option");
                    o.value = cat.id;
                    o.textContent = cat.name;
                    selectCategory.appendChild(o);
                });
            })
            .catch(err => {
                // fallback si l'API categories indispo
                selectCategory.innerHTML = `
                    <option value="">-- Sélectionner une catégorie --</option>
                    <option value="1">Objets</option>
                    <option value="2">Appartements</option>
                    <option value="3">Hôtels & restaurants</option>
                `;
                console.warn("Impossible de charger catégories:", err);
            });

        // message d'erreur
        const errorMessage = document.createElement("p");
        errorMessage.classList.add("error-message");
        errorMessage.style.display = "none";

        // insérer le formulaire
        form.appendChild(previewContainer);
        form.appendChild(inputTitle);
        form.appendChild(selectCategory);
        form.appendChild(errorMessage);
        container.appendChild(form);

        // frontend : footerBtn devient "Valider" et déclenche submit
        footerBtn.textContent = "Valider";
        footerBtn.disabled = true; // tant que non complet
        footerBtn.style.backgroundColor = "#A7A7A7";

        // helper for enabling footer button
        function updateFooterButtonState() {
            const ok = fileInput.files.length > 0 && inputTitle.value.trim() !== "" && selectCategory.value !== "";
            footerBtn.disabled = !ok;
            if (ok) footerBtn.classList.add("enabled"); else footerBtn.classList.remove("enabled");
            if (errorMessage.style.display === "block" && ok) {
                errorMessage.style.display = "none";
            }
        }

        // surveiller changements
        inputTitle.addEventListener("input", updateFooterButtonState);
        selectCategory.addEventListener("change", updateFooterButtonState);

        // footer click: validation + envoi
        footerBtn.onclick = async () => {
            // validation
            if (footerBtn.disabled) {
                errorMessage.textContent = "Veuillez remplir tous les champs.";
                errorMessage.style.display = "block";
                return;
            }

            // envoyer
            const fd = new FormData();
            fd.append("image", fileInput.files[0]);
            fd.append("title", inputTitle.value.trim());
            fd.append("category", selectCategory.value);

            try {
                footerBtn.disabled = true;
                footerBtn.textContent = "Envoi...";
                const res = await fetch("http://localhost:5678/api/works", {
                    method: "POST",
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`
                    },
                    body: fd
                });

                if (!res.ok) {
                    const txt = await res.text().catch(()=>null);
                    console.error("Erreur API:", res.status, txt);
                    alert("Erreur lors de l'envoi (voir console).");
                    footerBtn.disabled = false;
                    footerBtn.textContent = "Valider";
                    return;
                }

                const newProjet = await res.json();

                // update local array + DOM principal + modale
                projets.push(newProjet);
                genererProjets(projets);
                renderGallery(); // remet la modale en mode galerie et y insère la nouvelle image
                errorMessage.style.display = "none";
            } catch (err) {
                console.error(err);
                alert("Erreur réseau lors de l'envoi.");
                footerBtn.disabled = false;
                footerBtn.textContent = "Valider";
            }
        };
    } // end openFormView
}



