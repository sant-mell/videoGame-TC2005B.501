const menus = {
    lunes: [
        {nombre: "Café: $50", img: "https://upload.wikimedia.org/wikipedia/commons/4/45/A_small_cup_of_coffee.JPG"},
        {nombre: "Pan dulce: $40", img: "https://www.munsa.com.mx/images/blog/la_dulce_historia_del_pan_mexicano.png"}
    ],
    martes: [
        {nombre: "Té: $45", img: "https://thumbs.dreamstime.com/b/tazas-de-t%C3%A9-verde-en-la-tabla-61901598.jpg"},
        {nombre: "Galletas: $60", img: "https://cdn7.kiwilimon.com/recetaimagen/3329/960x640/38990.jpg.jpg"}
    ],
    miercoles: [
        {nombre: "Chocolate Caliente: $55", img: "https://www.novachef.es/media/images/chocolate-caliente-especias.jpg"},
        {nombre: "Cupcakes: $60", img: "https://www.allrecipes.com/thmb/i9KCEbxUGQ1Sa4F7Gts7SGBOpoM=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/157877-vanilla-cupcakes-ddmfs-4X3-0397-59653731be1d4769969698e427d7f5bc.jpg"}
    ],
    jueves: [
        {nombre: "Frappé: $80", img: "https://www.cocinadelirante.com/sites/default/files/images/2024/07/frappe-de-cafe-y-caramelo-como-el-de-starbucks.jpg"},
        {nombre: "Brownies: $35", img: "https://www.simplyrecipes.com/thmb/suKsJkGkpJvJyUGG2CoabRCePqw=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/SimplyRecipes_CosmicBrownies_LEAD_11-2f9bf50c944345698b442c0b1940c801.jpg"}
    ],
    viernes: [
        {nombre: "Bubble Tea: $75", img: "https://earthtoveg.com/wp-content/uploads/2022/06/taro-bubble-tea-01.jpg"},
        {nombre: "Pay de Limón: $55", img: "https://www.goodnes.com/sites/g/files/jgfbjl321/files/srh_recipes/2789a84fb196e18212da63faf1995f84.jpg"}
    ],
    sabado: [
        {nombre: "Matcha: $60", img: "https://www.recetasnestlecam.com/sites/default/files/srh_recipes/d25b198c592bdad94cf2902ff4e5634d.jpg"},
        {nombre: "Cheesecake: $60", img: "https://cdn.blog.paulinacocina.net/wp-content/uploads/2025/01/receta-de-cheesecake-1742898428.jpg"}
    ]
};

function cambiarMenu(dia) {
    const menuDiv = document.getElementById("menu");
    const imagen = document.getElementById("imagen");

    menuDiv.innerHTML = "";
    imagen.style.opacity = 0;

    menus[dia].forEach(item => {
        let div = document.createElement("div");
        div.className = "item";
        div.innerText = item.nombre;

        div.onmouseover = () => {
            imagen.src = item.img;
            imagen.style.opacity = 1;
        };

        menuDiv.appendChild(div);
    });
}

cambiarMenu("lunes");