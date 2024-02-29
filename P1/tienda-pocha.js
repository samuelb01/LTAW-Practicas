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

const http = require('http'); //-- Acceso a los elementos del módulo http 
const fs = require('fs'); //-- Módulo fs para acceder con Node.js a los ficehro del ordenador


//-- Definir puerto a utilizar (9090)
const PORT = 9090;

//-- Texto HTML de la página principal
let pagina_main = 'index.html';

//-- Texto HTML de la página de error
const pagina_error = 'error.html';

let index;

fs.readFile(pagina_main, 'utf-8', (err, data) => {
    if (err) {  //-- Ocurre un error
        console.log("ERROR!!")
        console.log(err.message);
    }
    else {  //-- No ha ocurrido ningún error
        console.log("Lectura completada...")
        console.log("Contenido ");
    }

    index = data;

});

fs.readFile(pagina_main, 'utf-8', (err, page) => {
    if (err) {  //-- Ocurre un error
        console.log("ERROR!!")
        console.log(err.message);
    }
    else {  //-- No ha ocurrido ningún error
        console.log("Lectura completada...")
        console.log("Contenido ");
    }

});


//-- Creación del servidor con la función de retrollamada
const server = http.createServer((req, res)=>{
    console.log("Petición recibida!");

    //-- Valores de la respuesta por defecto
    let code = 200;
    let code_msg = "OK";
    let page = pagina_main;

    //-- Analizar el recurso
    //-- Construir el objeto url con la url de la solicitud
    const url = new URL(req.url, 'http://' + req.headers['host']);
    console.log(url.pathname);

    //-- Cualquier recurso que no sea la página principal
    //-- genera un error
    if (url.pathname != '/') {
        code = 404;
        code_msg = "Not Found";
        page = pagina_error;
    }

    //-- Generar la respuesta en función de las variables
    //-- code, code_msg y page
    res.statusCode = code;
    res.statusMessage = code_msg;
    res.setHeader('Content-Type','text/html');
    res.write(index);
    res.end();
});


server.listen(PORT);
console.log('servidor iniciado. Escuchando en el puerto: ' + PORT);

