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

//-- Creación del servidor
const server = http.createServer();

//-- Función de atender
function atender(req, res) {
    console.log('CONECTADO');
}

server.on('request', atender);
server.listen(PORT);

