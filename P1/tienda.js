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
// ¿ Crear objeto o diccionario que las guarde todas?
let pagina_main;
let pagina_error;
let producto1;
let producto2;
let producto3;

// Lee archivos:
// fichero -> Fichero a leer
// pagina -> variabl donde se guarda la página
function leerFicheros(fichero, pagina) {
    //-- Fichero HTML de la página principal
    fs.readFile(fichero, 'utf-8', (err, data) => {
        if (err) {  //-- Ocurre un error
            console.log("ERROR!!")
            console.log(err.message);
        }
        else {  //-- No ha ocurrido ningún error
            console.log("Lectura completada...");

            // Al ser una función asíncrona hay que declarar la variable
            // dentro de la función de callback
            pagina = data;
        }
    });
};

leerFicheros('index.html', pagina_main);
leerFicheros('error.html', pagina_error);
leerFicheros('producto1.html', producto1);
leerFicheros('producto2.html', producto2);
leerFicheros('producto3.html', producto3);

console.log('hola ' + pagina_main);

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
    if (url.pathname == '/producto1') {
        page = producto1;

    } if (url.pathname == '/producto2') {
        page = producto2;

    } if (url.pathname == '/producto3') {
        page = producto3;

    } else if (url.pathname != '/') {
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