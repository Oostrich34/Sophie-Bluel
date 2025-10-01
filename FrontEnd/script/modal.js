//==============================
// Gestion de la modale d'édition
//==============================
import { projets, genererProjets } from "./gallery.js";

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
    const overlay = document.createElement("div");
    overlay.classList.add("overlay");

    const modal = document.createElement("div");
    modal.classList.add("modal");

    const modalTitle = document.createElement("h3");
    modalTitle.textContent = "Galerie photo";

    const btnClose = document.createElement("button");
    btnClose.type = "button";
    btnClose.textContent = "✖";
    btnClose.classList.add("btn-close");
    btnClose.addEventListener("click", () => overlay.remove());

    const container = document.createElement("div");
    container.classList.add("modal-gallery");

    const separator = document.createElement("hr");
    separator.classList.add("modal-separator");

    const footerBtn = document.createElement("button");
    footerBtn.type = "button";
    footerBtn.classList.add("btn-footer");
    footerBtn.textContent = "Ajouter une photo";

    // Élément pour afficher les erreurs dans la modale
    const globalError = document.createElement("p");
    globalError.classList.add("error-message");
    globalError.style.display = "none";
    separator.appendChild(globalError);

    function renderGallery() {
        const existingReturnBtn = modal.querySelector(".return-btn");
        if (existingReturnBtn) existingReturnBtn.remove();

        modalTitle.textContent = "Galerie photo";
        footerBtn.textContent = "Ajouter une photo";
        footerBtn.disabled = false;
        footerBtn.style.backgroundColor = "#1D6154";
        footerBtn.style.cursor = "pointer";
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
                        const idx = projets.findIndex(p => p.id === projet.id);
                        if (idx !== -1) projets.splice(idx, 1);
                        genererProjets(projets);
                        renderGallery();
                    } else {
                        globalError.textContent = "Erreur lors de la suppression du projet.";
                        globalError.style.display = "block";
                    }
                } catch (err) {
                    console.error(err);
                    globalError.textContent = "Erreur réseau lors de la suppression.";
                    globalError.style.display = "block";
                }
            });

            figure.appendChild(img);
            figure.appendChild(btnDelete);
            container.appendChild(figure);
        });
    }

    renderGallery();

    modal.appendChild(modalTitle);
    modal.appendChild(btnClose);
    modal.appendChild(container);
    modal.appendChild(separator);
    modal.appendChild(footerBtn);
    overlay.appendChild(modal);
    document.body.appendChild(overlay);

    overlay.addEventListener("click", e => {
        if (e.target === overlay) overlay.remove();
    });

    function openFormView() {
        container.classList.add("modal-add-photo");
        container.innerHTML = "";
        modalTitle.textContent = "Ajout photo";
        globalError.style.display = "none";

        const returnBtn = document.createElement("i");
        returnBtn.classList.add("fa-solid", "fa-arrow-left", "return-btn");
        returnBtn.style.cursor = "pointer";
        returnBtn.addEventListener("click", () => renderGallery());
        if (!modal.querySelector(".return-btn")) modal.insertBefore(returnBtn, modalTitle);

        const form = document.createElement("form");
        form.classList.add("form-add-photo");

        const previewContainer = document.createElement("div");
        previewContainer.classList.add("add-image-preview");

        const previewIcon = document.createElement("i");
        previewIcon.classList.add("fa-regular", "fa-image");

        const previewImg = document.createElement("img");
        previewImg.style.display = "none";

        const fileInput = document.createElement("input");
        fileInput.type = "file";
        fileInput.accept = "image/png, image/jpeg";
        fileInput.id = "fileUpload";
        fileInput.style.display = "none";
        const maxFileSize = 4 * 1024 * 1024;
        fileInput.addEventListener('change', (event) => {
            const file = event.target.files[0];
            if (file.size > maxFileSize) {
                globalError.textContent = 'Le fichier dépasse la limite de taille de 4 Mo.';
                globalError.style.display = "block";
                event.target.value = null; // Réinitialise le champ pour empêcher l'envoi
            }
        });

        const fileLabel = document.createElement("label");
        fileLabel.setAttribute("for", "fileUpload");
        fileLabel.classList.add("add-image-label");
        fileLabel.textContent = "+ Ajouter photo";

        const helper = document.createElement("p");
        helper.classList.add("helper-text");
        helper.textContent = "jpg, png : 4mo max";

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

        const labelTitle = document.createElement("label");
        labelTitle.setAttribute("for", "title");
        labelTitle.textContent = "Titre";

        const inputTitle = document.createElement("input");
        inputTitle.type = "text";
        inputTitle.id = "title";
        inputTitle.required = true;

        // ---- Champ catégorie ----
        const labelCategory = document.createElement("label");
        labelCategory.setAttribute("for", "category");
        labelCategory.textContent = "Catégorie";

        const selectCategory = document.createElement("select");
        selectCategory.id = "category";
        selectCategory.required = true;

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


        form.appendChild(previewContainer);
        form.appendChild(labelTitle);
        form.appendChild(inputTitle);
        form.appendChild(labelCategory);
        form.appendChild(selectCategory);
        container.appendChild(form);

        footerBtn.textContent = "Valider";
        footerBtn.disabled = true;
        footerBtn.style.backgroundColor = "#A7A7A7";

        function updateFooterButtonState() {
            const ok = fileInput.files.length > 0 && inputTitle.value.trim() !== "" && selectCategory.value !== "";
            footerBtn.disabled = !ok;
            footerBtn.style.backgroundColor = ok ? "#1D6154" : "#A7A7A7";
            footerBtn.style.cursor = ok ? "pointer" : "not-allowed";
            if (globalError.style.display === "block" && ok) {
                globalError.style.display = "none";
            }
        }

        inputTitle.addEventListener("input", updateFooterButtonState);
        selectCategory.addEventListener("change", updateFooterButtonState);

        footerBtn.onclick = async () => {
            if (footerBtn.disabled) {
                globalError.textContent = "Veuillez remplir tous les champs.";
                globalError.style.display = "block";
                return;
            }

            const fd = new FormData();
            fd.append("image", fileInput.files[0]);
            fd.append("title", inputTitle.value.trim());
            fd.append("category", selectCategory.value);

            try {
                footerBtn.disabled = true;
                footerBtn.textContent = "Envoi...";
                const res = await fetch("http://localhost:5678/api/works", {
                    method: "POST",
                    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
                    body: fd
                });

                if (!res.ok) {
                    const txt = await res.text().catch(() => null);
                    console.error("Erreur API:", res.status, txt);
                    globalError.textContent = "Erreur lors de l'envoi du projet.";
                    globalError.style.display = "block";
                    footerBtn.disabled = false;
                    footerBtn.textContent = "Valider";
                    return;
                }

                const newProjet = await res.json();
                projets.push(newProjet);
                genererProjets(projets);
                renderGallery();
            } catch (err) {
                console.error(err);
                globalError.textContent = "Erreur réseau, veuillez réessayer.";
                globalError.style.display = "block";
                footerBtn.disabled = false;
                footerBtn.textContent = "Valider";
            }
        };
    }
}




