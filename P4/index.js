//-- Importar módulo Electron
const electron = require('electron');

//-- Elementos de la interfaz
const node_version = document.getElementById("node_version");
const electron_version = document.getElementById("electron_version");
const chrome_version = document.getElementById("chrome_version");
const numero_usuarios = document.getElementById("numero_usuarios");
const direccion_IP = document.getElementById("direccion_IP");

//-- Acceder a la API de node para obtener la info
node_version.textContent = process.versions.node;
electron_version.textContent = process.versions.electron;
chrome_version.textContent = process.versions.chrome;