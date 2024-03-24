const http = require('http');
const fs = require('fs');


// Definir el puerto a utilizar
const PUERTO = 9090
const pag_principal = 'index.html';
// const pag_kanye = 'kanye.html';
// const pag_motley = 'motley.html';
// const pag_thesmiths = 'thesmiths.html';
// const pag_error = 'pag_error.html';
//const pagina_error = fs.readFileSync(pag_error);
//console.log(PUERTO);

const server = http.createServer((req, res) => {
    // Construir el objeto URL con la URL de la solicitud
    let url = new URL(req.url, 'http://' + req.headers['host']);
    // console.log(url.pathname)

    if (url.pathname == '/') {
        file = pag_principal;
    } else if (url.pathname == '/kanye.html'){
        file = pag_kanye;
    }else if (url.pathname == '/motley.html'){
        file = pag_motley;
    }else if (url.pathname == '/thesmiths.html'){
        file = pag_thesmiths;
    }else {
        file = url.pathname.split('/').pop();
    }

    fs.readFile(file, (error, page) => {

        // Obtener la extensión del archivo
        const recurso = url.pathname.split('.').pop();
        console.log('recurso solicitado -> '+ recurso);


        switch (recurso) {
            case 'css':
                contentType = 'text/css';
                break;
            case 'js':
                contentType = 'text/javascript';
                break;
            case 'png':
                contentType = 'image/png';
                break;
            case 'jpg':
                contentType = 'image/jpg';
                break;
            default:
                contentType = 'text/html';
        }
        // console.log('contenttype -> ' + contentType);


        if (error) {
            // Si hay un error al leer el archivo, muestra un error 404
            res.writeHead(404, { 'Content-Type': 'text/html' });
            res.write(pagina_error);
            res.end();
            return;
        } else {
             console.log('envio correcto');
            // Si el archivo se lee correctamente, envíalo al cliente
            res.writeHead(200, { 'Content-Type': contentType });
            res.write(page);
            res.end();
        }
        
    });
});

server.listen(PUERTO, () => {
    console.log("Escuchando en puerto: " + PUERTO);
});