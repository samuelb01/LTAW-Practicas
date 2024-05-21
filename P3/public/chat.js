//-- Elementos del interfaz
const display = document.getElementById("display");
const msg_entry = document.getElementById("msg_entry");
const disconnect_btn = document.getElementById("boton_desconectar");

//-- Archivo de audio para cunado se envíen mensajes
const audioMensaje = document.getElementById("miAudio")

//-- Crear un websocket. Se establece la conexión con el servidor
const socket = io();

const urlParams = new URLSearchParams(window.location.search);
const username = urlParams.get('username');


socket.on("connect", () => {
    //-- Enviar mensaje inicial
    socket.send([username, "BIENVENIDO AL CHAT"]);
});         

socket.on("disconnect", ()=> {
    display.innerHTML="¡¡DESCONECTADO!!"
})

socket.on("message", (msg)=>{
    display.innerHTML += '<p style="color:blue">' + msg + '</p>';
    audioMensaje.play();
});

socket.on("comando", (msg)=>{
    display.innerHTML += '<p style="color:red">' + msg + '</p>';
});

socket.on("rest-of-users", (msg)=>{
    display.innerHTML += '<p style="color:blue">' + msg + '</p>';
});

//-- Al apretar el botón se envía un mensaje al servidor
msg_entry.onchange = () => {

    if (msg_entry.value) {
        socket.send([username, msg_entry.value]);

        //-- Borrar el mensaje actual
        msg_entry.value = "";
    }
    
}

disconnect_btn.addEventListener('click', () => {
    display.innerHTML += '<p style="color:blue">HOLA CARACOLA</p>';
    socket.emit('disconnect', 'hola');
});

