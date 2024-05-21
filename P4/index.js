//-- Importar módulo Electron y qrcode-terminal
const electron = require('electron');

//-- Elementos de la interfaz
const node_version = document.getElementById("node_version");
const electron_version = document.getElementById("electron_version");
const chrome_version = document.getElementById("chrome_version");
const numero_usuarios = document.getElementById("numero_usuarios");
const direccion_IP = document.getElementById("direccion_IP");

const display = document.getElementById("display");

//-- Acceder a la API de node para obtener la info
node_version.textContent = process.versions.node;
electron_version.textContent = process.versions.electron;
chrome_version.textContent = process.versions.chrome;

//-- Evento recibido del proceso principal con el nº de usuarios
electron.ipcRenderer.on('numero-usuarios', (event, message) => {
    numero_usuarios.textContent = message;
});

//-- Evento recibido del proceso principal con la ip de conexión
electron.ipcRenderer.on('direccion-ip', (event, message) => {
    direccion_IP.textContent = message;
});

//-- Evento recibido del proceso principal con la ip de conexión
electron.ipcRenderer.on('mensaje', (event, message) => {
    display.innerHTML += '<p style="color:blue">' + message + '</p>';
});