//-- Crear un websocket. Se establece la conexión con el servidor
// const socket = io();//-- Elementos del interfaz
const display = document.getElementById("display");
const msg_entry = document.getElementById("msg_entry");

//-- Crear un websocket. Se establece la conexión con el servidor
const socket = io();

const urlParams = new URLSearchParams(window.location.search);
const username = urlParams.get('username');

let contador = 1;

socket.on("connect", () => {
    //-- Enviar mensaje inicial
    socket.send([username, "BIENVENIDO AL CHAT"]);
});         

socket.on("disconnect", ()=> {
    display.innerHTML="¡¡DESCONECTADO!!"
})

socket.on("message", (msg)=>{
    display.innerHTML += '<p style="color:blue">' + msg + '</p>';
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