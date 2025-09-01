
let projets = window.localStorage.getItem("projets");


if (projets === null) {

    projets = await fetch("http://localhost:5678/api/works").then(response => response.json());

    const valeurProjets = JSON.stringify(projets);

    window.localStorage.setItem("projets", valeurProjets);

} else {

    projets = JSON.parse(projets);

}


function genererProjets(projets) {
    for (let i = 0; i < projets.length; i++){

        const figure = projets[i];

        const sectionGallery = document.querySelector(".gallery");

        const pieceElement = document.createElement("figure");

        const imageElement = document.createElement("img");
        imageElement.src = figure.imageUrl;

        const titleElement = document.createElement("figcaption");
        titleElement.innerText = figure.title;

        sectionGallery.appendChild(pieceElement);

        pieceElement.appendChild(imageElement);
        pieceElement.appendChild(titleElement);
    }

    
}

genererProjets(projets);

