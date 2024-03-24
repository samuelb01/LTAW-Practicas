// Importar módulos
const http = require('http');   //-- Acceso a los elementos del módulo http 
const fs = require('fs');   //-- Módulo fs para acceder con Node.js a los ficehro del ordenador
const { url } = require('inspector');

// Puerto que se va a utilizar (9090)
const PORT = 9090;

const server = http.createServer((req, res) => {
    console.log("Petición recibida:", req.url);

    // Analizar recurso
    if (req.url == '/') {
        recurso = './Pages/hola.html';
    } else {
        recurso = '.' + req.url;
    }
    console.log(recurso);

    
    // Declarar el Content-Type
    if (req.url.endsWith('.png')) {
        content_type = 'image/png';
    } else {  // Valor por defecto -> HTML
        content_type = 'text/html'
    }

    fs.readFile(recurso, (err, data) => {

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

server.listen(PORT, () => {
    console.log("Escuchando en puerto: " + PORT);
})