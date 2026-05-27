CREATE DATABASE catcafe;
USE catcafe;

CREATE TABLE dias (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(20)
);

CREATE TABLE menu (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100),
    precio INT,
    imagen TEXT,
    dia_id INT,
    FOREIGN KEY (dia_id)
    REFERENCES dias(id)
);

CREATE TABLE gatos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(50),
    edad VARCHAR(20),
    personalidad VARCHAR(50),
    imagen TEXT
);

INSERT INTO dias (nombre) VALUES
('lunes'),
('martes'),
('miercoles'),
('jueves'),
('viernes'),
('sabado');

INSERT INTO menu (nombre, precio, imagen, dia_id) VALUES
('Café', 50,
'https://upload.wikimedia.org/wikipedia/commons/4/45/A_small_cup_of_coffee.JPG',
1),
('Pan dulce', 40,
'https://www.munsa.com.mx/images/blog/la_dulce_historia_del_pan_mexicano.png',
1),
('Té', 45,
'https://thumbs.dreamstime.com/b/tazas-de-t%C3%A9-verde-en-la-tabla-61901598.jpg',
2),
('Galletas', 60,
'https://cdn7.kiwilimon.com/recetaimagen/3329/960x640/38990.jpg.jpg',
2),
('Chocolate Caliente', 55,
'https://www.novachef.es/media/images/chocolate-caliente-especias.jpg',
3),
('Cupcakes', 60,
'https://www.allrecipes.com/thmb/i9KCEbxUGQ1Sa4F7Gts7SGBOpoM=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/157877-vanilla-cupcakes-ddmfs-4X3-0397-59653731be1d4769969698e427d7f5bc.jpg',
3),
('Frappé', 80,
'https://www.cocinadelirante.com/sites/default/files/images/2024/07/frappe-de-cafe-y-caramelo-como-el-de-starbucks.jpg',
4),
('Brownies', 35,
'https://www.simplyrecipes.com/thmb/suKsJkGkpJvJyUGG2CoabRCePqw=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/SimplyRecipes_CosmicBrownies_LEAD_11-2f9bf50c944345698b442c0b1940c801.jpg',
4),
('Bubble Tea', 75,
'https://earthtoveg.com/wp-content/uploads/2022/06/taro-bubble-tea-01.jpg',
5),
('Pay de Limón', 55,
'https://www.goodnes.com/sites/g/files/jgfbjl321/files/srh_recipes/2789a84fb196e18212da63faf1995f84.jpg',
5),
('Matcha', 60,
'https://www.recetasnestlecam.com/sites/default/files/srh_recipes/d25b198c592bdad94cf2902ff4e5634d.jpg',
6),
('Cheesecake', 60,
'https://cdn.blog.paulinacocina.net/wp-content/uploads/2025/01/receta-de-cheesecake-1742898428.jpg',
6);

INSERT INTO gatos (nombre, edad, personalidad, imagen) VALUES
('Milo', '2 años', 'Juguetón',
'https://resources.uss.cl/upload/2022/11/supervivencia-gatos-6362b9f553582.jpg'),
('Luna', '3 años', 'Tranquila',
'https://es.mypet.com/wp-content/uploads/sites/23/2021/03/GettyImages-623368750-e1582816063521-1.jpg'),
('Simba', '1 año', 'Curioso',
'https://urgenciesveterinaries.com/wp-content/uploads/2023/09/survet-gato-caida-pelo-01.jpeg'),
('Nala', '4 años', 'Cariñosa',
'https://www.patasencasa.com/sites/default/files/styles/article_detail_1200/public/2025-06/gato-bicolor_0.png.webp?itok=Jsy93Hjc'),
('Tom', '5 años', 'Flojo',
'https://mivet.com/wp-content/uploads/2024/10/shutterstock_1655991508.jpg');

-- Pruebas
USE catcafe;
SELECT * FROM gatos;