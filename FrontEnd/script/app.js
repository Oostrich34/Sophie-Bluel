//==============================
// Point d'entrée de l'application
//==============================

import { fetchProjets } from "./gallery.js";
import { activerModeEdition } from "./modal.js";

document.addEventListener("DOMContentLoaded", async () => {
    await fetchProjets();
    if(localStorage.getItem("token")) activerModeEdition();
});