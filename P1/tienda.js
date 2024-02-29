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

// Puerto que se va a utilizar (9090)
const PORT = 9090;

// Variables de las páginas a mostrar
let pagina_main;
let pagina_error;

//-- Fichero HTML de la página principal
fs.readFile('index.html', 'utf-8', (err, data) => {
    if (err) {  //-- Ocurre un error
        console.log("ERROR!!")
        console.log(err.message);
    }
    else {  //-- No ha ocurrido ningún error
        console.log("Lectura completada...");

        // Al ser una función asíncrona hay que declarar la variable
        // dentro de la función de callback
        pagina_main = data;
    }
});

//-- Fichero HTML de la página principal
fs.readFile('error.html', 'utf-8', (err, data) => {
    if (err) {  //-- Ocurre un error
        console.log("ERROR!!")
        console.log(err.message);
    }
    else {  //-- No ha ocurrido ningún error
        console.log("Lectura completada...");

        // Al ser una función asíncrona hay que declarar la variable
        // dentro de la fuinción de callback
        pagina_error = data;
    }
});

//-- Se crea el servidor con la función de retrollamada
const server = http.createServer((req, res) => {
    // Cada vez que el cliente quiere acceder al servidor entra aquí
    console.log("Petición recibidad!");

    // --- Valores por defecto ---
    let code = 200;         // Código de respuesta
    let code_msg = "OK";    // Mensaje asociado al código
    let page = pagina_main; // Página asociada
    // ---------------------------

    // Se analiza el recurso
    // Se construye el objeto URL con la url de la solicitud
    const url = new URL(req.url, 'http://' + req.headers['host']);
    
    // --- Recurso NO página principal ---
    if (url.pathname != '/') {
        code = 404;             // Código de respuesta
        code_msg = "Not Found"; // Mensaje asociado al código
        page = pagina_error;    // Página asociada
    }
    // -----------------------------------

    // Generar la respuesta en función de las variables
    // code, code_msg y page
    res.statusCode = code;
    res.statusMessage = code_msg;
    res.setHeader('Content-Type', 'text/html');
    res.write(page);
    res.end();
    
    
});

// SERVIDOR ESCUCHA
server.listen(PORT);
console.log('SERVIDOR INICIADO EN EL PUERTO: ' + PORT);