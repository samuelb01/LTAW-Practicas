//-- Cargar las dependencias
const socket = require('socket.io');
const http = require('http');
const express = require('express');
const colors = require('colors');
const { Socket } = require('dgram');

const PUERTO = 9090;

//-- Crear una nueva aplciacion web
const app = express();

//-- Crear un servidor, asosiaco a la App de express
const server = http.Server(app);

//-- Crear el servidor de websockets, asociado al servidor http
const io = socket(server);

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
        res.redirect(`/chat?username=${username}`);
    } else {
        res.redirect('/');
    }
});

// Manejar la solicitud de la página de chat
app.get('/chat', (req, res) => {
    res.sendFile(__dirname + '/public/chat.html');
});

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
                  

                  break;

                case 'list':

                    break;

                case 'hello':
                  socket.send('HOLA WUAPO');

                  break;

                case 'date':

                    break;

                default:
                    socket.send('Comando no encontrado');
              }
            
            
        } else {  //-- MENSAJE NORMAL

            //-- Reenviarlo a todos los clientes conectados
            io.send(`${username}: ${message}`);

        }

        
    });

    //-- Evento de desconexión
    socket.on('disconnect', () => {
        if (socket.username) {
            io.send('message', { username: 'Servidor', message: `${socket.username} se ha desconectado` });
        }
    });

});

//-- Lanzar el servidor HTTP
//-- ¡Que empiecen los juegos de los WebSockets!
server.listen(PUERTO);
console.log("Escuchando en puerto: " + PUERTO);