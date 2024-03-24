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
    fs.readFile(fichero, (err, data) => {
        if (err) {
            console.error("ERROR al leer el archivo:", fichero, err);
            callback(err, null);
        } else {
            console.log(`Lectura completada de ${fichero}`);
            callback(null, data);
        }
    });
}


const server = http.createServer((req, res) => {
    console.log("Petición recibida:", req.url);

    // Analizar recurso
    if (req.url.ends) {
        recurso = './Pages/hola.html';
    } else {
        recurso = '.' + req.url;
    }
    console.log(recurso);  // QUITAR

    
    // Declarar el Content-Type
    if (req.url.endsWith('.png')) {  //--PNG
        content_type = 'image/png';
        recurso = '.' + req.url;
    } else if (req.url.endsWith('.html')) {
        content_type = 'text/html'
        recurso = './Pages/hola.html'
    } else if (req.url.endsWith('.css')) {  //--CSS
        content_type = 'text/css';
        recurso = '.' + req.url;
    } else if (req.url.endsWith('.js')) {  //--JS
        content_type = 'application/javascript';
        recurso = '.' + req.url;
    } else if (req.url.endsWith('.jpeg')) {  //--JPEG
        content_type = 'image/jpeg';
        recurso = '.' + req.url;
    } else {  // Valor por defecto -> HTML
        content_type = 'text/html'
        recurso = './Pages/hola.html'
    }

    leerFichero(recurso, (err, data) => {

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
        }

    });
});

server.listen(PORT, () => {
    console.log("Escuchando en puerto: " + PORT);
})