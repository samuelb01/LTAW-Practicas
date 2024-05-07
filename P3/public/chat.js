//-- Crear un websocket. Se establece la conexión con el servidor
// const socket = io();//-- Elementos del interfaz
const button = document.getElementById("button");
const display = document.getElementById("display");

//-- Crear un websocket. Se establece la conexión con el servidor
const socket = io();

const urlParams = new URLSearchParams(window.location.search);
const username = urlParams.get('username');

let contador = 1;

socket.on("connect", () => {
  //-- Enviar mensaje inicial
  socket.send("Mensaje inicial del Cliente!!!");
});  

socket.on("disconnect", ()=> {
  display.innerHTML="¡¡DESCONECTADO!!"
})

socket.on("message", (msg)=>{
  display.innerHTML += '<p style="color:blue">' + msg + '</p>';
});

//-- Al apretar el botón se envía un mensaje al servidor
msg_entry.onchange = () => {
  if (msg_entry.value)
    socket.send(msg_entry.value);
  
  //-- Borrar el mensaje actual
  msg_entry.value = "";
}