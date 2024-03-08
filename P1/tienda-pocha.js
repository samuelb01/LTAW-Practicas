// MÓDULOS
const http = require('http');
const fs = require('fs');
const { url } = require('inspector');

const path = require('path');


// PUERTO
const PORT = 9090;


// FUNCIÓN PARA LEER FICHEROS
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


// SE CREA EL SERVIDOR
const server = http.createServer((req, res) => {
    console.log("Petición recibida:", req.url);

    let estado = 200;
    let mensaje_estado = "OK"; 

    let recurso;
    let content_type;

    if (req.url === '/') {
        recurso = './Pages/pocha.html'
        content_type = 'text/html'
    } else if (req.url.startsWith('/Images/')) {
        console.log('-direname: ' + __dirname);  // muestra mensaje (quitarlo)
        recurso = path.join(__dirname, req.url)
        content_type = 'image/jpeg'
    }

    leerFichero(recurso, (err, data) => {
        if (err) {
            console.log('ERROR');
        } else {
            res.statusCode = 200;
            res.statusMessage = "OK";
            res.setHeader('Content-Type', content_type);
            res.write(data);
            res.end();
        }
    })
});



// SERVIDOR ESCUCHA
server.listen(PORT);
console.log('SERVIDOR INICIADO EN EL PUERTO: ' + PORT);