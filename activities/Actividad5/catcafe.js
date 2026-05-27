async function cambiarMenu(dia) {
    const menuDiv = document.getElementById("menu");
    const imagen = document.getElementById("imagen");
    menuDiv.innerHTML = "";
    imagen.style.opacity = 0;
    const response = await fetch("http://localhost:3000/menu/" + dia);
    const datos = await response.json();
    datos.forEach(item => {
        let div = document.createElement("div");
        div.className = "item";
        div.innerText = item.nombre + ": $" + item.precio;
        div.onmouseover = () => {
            imagen.src = item.imagen;
            imagen.style.opacity = 1;
        };
        menuDiv.appendChild(div);
    });
}

async function cargarGatos() {
    const gatosDiv = document.getElementById("gatos");
    gatosDiv.innerHTML = "";
    const response = await fetch("http://localhost:3000/gatos");
    const gatos = await response.json();
    gatos.forEach(gato => {
        let div = document.createElement("div");
        div.className = "gato";
        div.innerHTML =
            "<img src='" + gato.imagen + "'>" +
            "<h3><b>" + gato.nombre + "</b></h3>" +
            "<p>" + gato.edad + "</p>" +
            "<p>" + gato.personalidad + "</p>";
        gatosDiv.appendChild(div);
    });
}

cambiarMenu("lunes");

cargarGatos();