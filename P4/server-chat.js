//-- Cargar las dependencias
const socket = require('socket.io');
const http = require('http');
const express = require('express');
const colors = require('colors');
const { Socket } = require('dgram');
const electron = require('electron');
const ip = require('ip');  //- Módulo para obtener la dirección IP

//-- Variable para acceder a la ventana principal
let win = null;

//-- Puerto de conexión
const PUERTO = 9090;
const direccion_conexion = `${ip.address()}:${PUERTO}`;

//-- Crear una nueva aplciacion web
const app = express();

//-- Crear un servidor, asosiaco a la App de express
const server = http.Server(app);

//-- Crear el servidor de websockets, asociado al servidor http
const io = socket(server);

//---------- Variables ----------
all_users = [];
comandos_disponibes = ['help', 'hello', 'date', 'list'];

//-------- PUNTOS DE ENTRADA DE LA APLICACION WEB
//-- Definir el punto de entrada principal de mi aplicación web
app.get('/', (req, res) => {
    //-- Envío el archivo login.html de la carpeta public
    res.sendFile(__dirname + '/public/login.html');
});

//-- Habilitar el análisis de datos de formularios codificados
app.use(express.urlencoded({ extended: true }));

//-- Esto es necesario para que el servidor le envíe al cliente la
//-- biblioteca socket.io para el cliente
app.use('/', express.static(__dirname +'/'));

//-- El directorio publico contiene ficheros estáticos
app.use(express.static('public'));

// Manejo la solicitud de inicio de sesión
app.post('/login', (req, res) => {
    const { username } = req.body;
    if (username.trim() !== '') {
        
        if (!all_users.includes(username)) {
            all_users.push(username);
            res.redirect(`/chat?username=${username}`);

            //-- Cada vez que se registre un nuevo usuario, ctualizamos la interfaz gráfica
            win.webContents.send('numero-usuarios', all_users.length);

        } else {
            res.redirect('/public/login_error.html');
        }

    } else {
        res.redirect('/');
    }
});

// Manejar la solicitud de la página de chat
app.get('/chat', (req, res) => {
    res.sendFile(__dirname + '/public/chat.html');
});

function getDate() {
    //-- padStart asegura que tenga dos dígitos, añadiendo 0 delante si fuese necesario
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');  //-- Se le suma 1 porque da los meses del 0 al 11
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');

    //-- Formato para sacar la fecha YYYY-MM-DD hh:mm:ss
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

//------------------- GESTION SOCKETS IO
//-- Evento: Nueva conexion recibida
io.on('connect', (socket) => {

    console.log('** NUEVA CONEXIÓN **'.yellow);

    //-- Mensaje recibido: Reenviarlo a todos los clientes conectados
    socket.on('message', ( [username, message] ) => {
        
        console.log(`Mensaje recibido de ${username}: ${message}`);

        //----- Gestionar tipo de mensajes y dónde mostrarlos -----
        if (message.includes("BIENVENIDO")) {  //-- MENSAJE BIENVENIDA

            //-- Solo se envía al cliente
            socket.send(message);

            socket.broadcast.emit("rest-of-users", `${username} SE HA UNIDO AL CHAT`);

        } else if (message.startsWith('/')) {  //-- COMANDOS

            comando = message.split('/')[1];

            //-- Gestionar comandos
            switch (comando) {
                case 'help':
                    socket.emit("comando", `Los comandos disponibles son: /${comandos_disponibes.join(", /")}`);
                    break;

                case 'list':
                    socket.emit("comando", `Los usuarios conectados son: ${all_users.join(", ")}`);
                    break;

                case 'hello':
                    socket.emit("comando", 'Bienvenido al chat, espero que disfrute de la experiencia :)');
                    break;

                case 'date':
                    socket.emit("comando", `La fecha actual es: ${getDate()}`);
                    break;

                default:
                    socket.emit("comando", 'Comando no encontrado, use "/help" para obtener una lista con todos los comandos disponibles.');
                    break;
            }
            
            
        } else {  //-- MENSAJE NORMAL

            //-- Reenviarlo a todos los clientes conectados
            io.send(`${username}: ${message}`);

            //-- Mandarlo a la aplicación del servidor
            win.webContents.send('mensaje', `${username}: ${message}`)

        }
    });

    //-- Evento de desconexión
    socket.on('disconnect', () => {
        if (socket.username) {
            io.send('message', { username: 'Servidor', message: `${socket.username} se ha desconectado` });
        }
    });

});


//////////////---- ELECTRON ----//////////////
//-- Punto de entrada
//-- Cuando electron está listo ejecuta esta función
electron.app.on('ready', () => {
    console.log("Evento ready!");

    //-- Crear la ventana principal de la aplicación
    win = new electron.BrowserWindow({
        width: 1000,     //-- Anchura
        height: 700,     //-- Altura

        //-- Permitir acceso al sistema
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false
        }

    })

    //-- Si se quiere eliminar el menú por defecto hay que añadir:
    //win.setMenuBarVisibility(false);

    //-- Cargar interfaz gráfica
    win.loadFile("public/index.html")

    //-- Se espera a que cargue y se muestre la página
    //-- Se envían varios datos iniciales para mostrar en el proceso de renderizado
    win.on('ready-to-show', () => {
        win.webContents.send('numero-usuarios', all_users.length);
        win.webContents.send('direccion-ip', direccion_conexion);
    })

});

electron.ipcMain.handle('test', (event, message) => {
    console.log(message);
    io.send(message);
})




//-- Lanzar el servidor HTTP
//-- ¡Que empiecen los juegos de los WebSockets!
server.listen(PUERTO);
console.log("Escuchando en puerto: " + PUERTO);