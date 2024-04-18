// Importar módulos
const http = require('http');   //-- Acceso a los elementos del módulo http 
const fs = require('fs');   //-- Módulo fs para acceder con Node.js a los fichero del ordenador
const { url } = require('inspector');


// Puerto que se va a utilizar (9090)
const PORT = 9090;

const pagina_error = fs.readFileSync('./Pages/pagina-error.html', 'utf8');


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
    
    // Declarar el Content-Type y recurso
    if (req.url.endsWith('.png')) {  //--PNG
        content_type = 'image/png';
        recurso = './Images/' + req.url.split('/').pop();

    } else if (req.url.endsWith('.html')) {  //-- HTML
        content_type = 'text/html'
        recurso = './Pages/' + req.url.split('/').pop();

    } else if (req.url.endsWith('.css')) {  //--CSS
        content_type = 'text/css';
        recurso = './Style/' + req.url.split('/').pop();

    } else if (req.url.endsWith('.js')) {  //--JS
        content_type = 'application/javascript';
        recurso = './JS/' + req.url.split('/').pop();

    } else if (req.url.endsWith('.jpeg')) {  //--JPEG
        content_type = 'image/jpeg';
        recurso = './Images/' + req.url.split('/').pop();

    } else if (req.url == '/') {
        content_type = 'text/html'
        recurso = './Pages/tienda.html'

    } else {  // Valor por defecto -> HTML - error.html
        content_type = 'text/html'
        recurso = pagina_error
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