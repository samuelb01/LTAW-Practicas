// Servidor de la tineda de Funko POPS - Samuel Bellón Elipe

// Importar módulos
const http = require('http');   //-- Acceso a los elementos del módulo http 
const fs = require('fs');   //-- Módulo fs para acceder con Node.js a los ficehro del ordenador

// Puerto que se va a utilizar (9090)
const PORT = 9090;


// CAMBIAR POR ARCHIVOS DEL ORDENADOR
//-- Texto HTML de la página principal
const pagina_main = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Mi tienda</title>
</head>
<body style="background-color: lightblue">
    <h1 style="color: green">MI TIENDA</h1>
</body>
</html>
`

//-- Texto HTML de la página de error
const pagina_error = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Mi tienda</title>
</head>
<body style="background-color: red">
    <h1 style="color: white">ERROR!!!!</h1>
</body>
</html>
`

//-- Se crea el servidor con la función de retrollamada
const server = http.createServer((req, res) => {
    console.log("Petición recibidad!");

    // --- Valores por defecto ---
    let code = 200;         // Código de respuesta
    let code_msg = "OK";    // Mensaje asociado al código
    let page = pagina_main; // Página asociada
    // ---------------------------

    // Se analiza el recurso
    // Se construye el objeto URL con la url de la solicitud
    
});