// Sacar del .json el nº de usuarios registrados
// Lista con nombres de users
// nº de productos en la tienda
// Lista de los productos de la tienda
// Números de pedidos pendientes y los detalles

// Importo módulo fs
const fs = require('fs');

// Archivo json a leer
const FICHERO_JSON = "tienda.json"

// Leero fichero json
const tienda_json = fs.readFileSync(FICHERO_JSON);

// Creo la estructura de la tienda
const tienda = JSON.parse(tienda_json);

// Info de la tienda
let productos = tienda.productos;
let usuarios = tienda.usuarios;
let pedidos = tienda.pedidos;

// Nº de usuarios registrados
console.log("Número de usuarios registrados: " + usuarios.length);

// Lista con los nombres de los users registrados
usuarios.forEach((element, index) => {
    console.log("Usuario" + (index + 1) + ": " + element.nombre_usuario);
});

// Nº de productos en la tienda
console.log("Número de productos de la tienda: " +productos.length);

// Lista de los productos de la tienda
productos.forEach((element, index) => {
    console.log("Producto" + (index + 1) + ": " + element.nombre)
});

// Número de pedidos pendientes y detalles
pedidos.forEach((element, index) => {
    console.log("Pedido" + (index + 1) + ": " + "pedido para " + element.nombre_usuario);
    console.log("   Artículo: " + element.lista_productos);
    console.log("   calle: " + element.address.calle);
    console.log("   numero: " + element.address.numero);
    console.log("   piso: " + element.address.piso);
    console.log("   puerta: " + element.address.puerta);

});