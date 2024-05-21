//-- Cargar el módulo electron
const electron = require("electron");

console.log("Arrancando electron...");

//-- Variable para acceder a la ventana principal
let win = null;

//-- Punto de entrada
//-- Cuando electron está listo ejecuta esta función
electron.app.on('ready', () => {
    console.log("Evento ready!");

    //-- Crear la ventana principal de la aplicación
    win = new electron.BrowserWindow({
        width: 600,     //-- Anchura
        height: 400,     //-- Altura

        //-- Permitir acceso al sistema
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false
        }

    })

    

    //-- Si se quiere eliminar el menú por defecto hay que añadir:
    //win.setMenuBarVisibility(false);

    win.loadFile("main.html")
});