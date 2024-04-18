// Vmaos  aincrementar en 1 el stock de los productos cada vez que se ejecute este js

// Importar el módulo fs
const fs = require('fs');

// Fichero JSON a leer y modificar
const FICHERO_JSON = "tienda.json"

// Leemos el ficero json
const tienda_json = fs.readFileSync(FICHERO_JSON);

// Creamos la estructura tienda
const tienda = JSON.parse(tienda_json);

// Modificamos el stock de cada producto
tienda.productos.forEach((element, index) => {
    element.stock = (parseInt(element.stock) + 1).toString();
});

// Se modifica el archivo json
fs.writeFileSync(FICHERO_JSON, JSON.stringify(tienda, null, 4));
