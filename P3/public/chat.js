//-- Crear un websocket. Se establece la conexión con el servidor
// const socket = io();//-- Elementos del interfaz
const display = document.getElementById("display");
const msg_entry = document.getElementById("msg_entry");
const disconnect_btn = document.getElementById("boton_desconectar");

//-- Crear un websocket. Se establece la conexión con el servidor
const socket = io();

const urlParams = new URLSearchParams(window.location.search);
const username = urlParams.get('username');

//let contador = 1;

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

socket.on("comando", (msg)=>{

    display.innerHTML += '<p style="color:red">' + msg + '</p>';

    // //-- Los comandos se reciben como: "ComandoValue/mensaje"
    // comandoValue = msg.split('/')[0];   //-- Tipo de comando
    // msg_split = msg.split('/')[1];      //-- Mensaje del comando a mostrar

    // //-- Decidir sobre los tipos de comandos
    // switch (comandoValue) {
    //     case 'list':
    //         display.innerHTML += '<p style="color:red">' + msg_split + '</p>'; 
    //         break;

    //     case 'list':
    //         display.innerHTML += '<p style="color:red">' + msg_split + '</p>'; 
    //         break;

    //     case 'list':
    //         display.innerHTML += '<p style="color:red">' + msg_split + '</p>'; 
    //         break;

    //     case 'hello':
    //         display.innerHTML += '<p style="color:red">' + msg_split + '</p>'; 
    //         break;

    //     case 'error':
    //         display.innerHTML += '<p style="color:red">' + msg_split + '</p>'; 
    //         break;
    
    //     default:
    //         break;
    // }   
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

