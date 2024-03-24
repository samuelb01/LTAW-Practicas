// Servidor de la tineda de Funko POPS - Samuel Bellón Elipe

/*
tienda on-line
crear back-end y front-end
Documentación técnica y manual de usuario en markdown en la wiki de la P1
Si se implementan mejoras indicarlo
*/

/*
BACK-END
- Implementar con node.js
- usar módulos http y fs
- Nombre del servidor en la carpeta P1 con nombre tienda.js
- Servidor debe escuchar en el puerto 9090
- Tiene que poder servir archivos html, css, javascript e imágenes
- Si se pide un recurso no disponible tiene que generar un mensaje de error
*/

// Importar módulos
const http = require('http');   //-- Acceso a los elementos del módulo http 
const fs = require('fs');   //-- Módulo fs para acceder con Node.js a los ficehro del ordenador
const { url } = require('inspector');

// Puerto que se va a utilizar (9090)
const PORT = 9090;


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
</html>`

// Función para leer archivos
function leerFichero(fichero, callback) {
    fs.readFile(fichero, 'utf-8', (err, data) => {
        if (err) {
            console.error("ERROR al leer el archivo:", fichero, err);
            callback(err, null);
        } else {
            console.log(`Lectura completada de ${fichero}`);
            callback(null, data);
        }
    });
}

// Crear el servidor HTTP
const server = http.createServer((req, res) => {
    console.log("Petición recibida:", req.url);


    // Construir la ruta completa al archivo solicitado
    let recurso;

    if (req.url == '/') {
        recurso = './Pages/hola.html';
    } else if (req.url.startsWith('/Images/')) {
        recurso = '.' + req.url;
        //recurso = req.url.substring(1); // Eliminar la barra inicial
    } else {
        recurso = 'Pages' + req.url;
    }
    

    // Leer el archivo correspondiente al recurso solicitado
    leerFichero(recurso, (err, data) => {



    let content_type = 'text/html'; // Valor predeterminado

    // Distintos Content-Type para distintos archivos
    if (req.url.endsWith('.html')) {
        content_type = 'text/html';
    } else if (req.url.endsWith('.css')) {
        content_type = 'text/css';
    } else if (req.url.endsWith('.js')) {
        content_type = 'application/javascript';
    } else if (req.url.endsWith('.png')) {
        content_type = 'image/png';
    } else if (req.url.endsWith('.jpeg')) {
        content_type = 'image/jpeg';
    }

    console.log('RECURSO -> ' + recurso);


        if (err) {
            res.statusCode = 404;             // Código de respuesta
            res.statusMessage = "Not Found"; // Mensaje asociado al código
            res.setHeader('Content-Type', 'text/html');
            res.write(pagina_error);
            res.end();
        } else {
            res.statusCode = 200;         // Código de respuesta
            res.statusMessage = "OK";    // Mensaje asociado al código
            res.setHeader('Content-Type', content_type);
            res.write(data);
            res.end();

            console.log('Has enviaddo algo');
        }
    });
});


// SERVIDOR ESCUCHA
server.listen(PORT);
console.log('SERVIDOR INICIADO EN EL PUERTO: ' + PORT);





