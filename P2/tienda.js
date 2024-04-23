// Importar módulos
const http = require('http');   //-- Acceso a los elementos del módulo http 
const fs = require('fs');   //-- Módulo fs para acceder con Node.js a los fichero del ordenador
const { url } = require('inspector');


// Puerto que se va a utilizar (9090)
const PORT = 9090;

const pagina_error = fs.readFileSync('./Pages/pagina-error.html', 'utf8');
const FORMULARIO_LOGIN = './Pages/login.html';
const LOGIN_CORRECTO = './Pages/login-correcto.html'
const LOGIN_NO_CORRECTO = './Pages/login-no-correcto.html'
const PAGINA_PRODUCTOS = './Pages/pagina-producto.html'

const tienda_json = fs.readFileSync('./tienda.json', 'utf-8');

// Creo la estructura de la tienda
const tienda = JSON.parse(tienda_json);

// Info de la tienda
let productos = tienda.productos;
let usuarios = tienda.usuarios;
let pedidos = tienda.pedidos;


// Función para leer archivos
function leerFichero(fichero, callback) {
    fs.readFile(fichero, (err, data) => {
        if (err) {
            console.error("ERROR al leer el archivo");
            callback(err, null);
        } else {
            console.log(`Lectura completada`);
            callback(null, data);
        }
    });
}

function code_404 (res) {
    res.statusCode = 404;             // Código de respuesta
    res.statusMessage = "Not Found"; // Mensaje asociado al código
    res.setHeader('Content-Type', 'text/html');
    res.write(pagina_error);
    res.end();
}

function code_200 (res, data) {
    //-- Envía del rescurso procesado
    res.statusCode = 200;         // Código de respuesta
    res.statusMessage = "OK";    // Mensaje asociado al código
    res.setHeader('Content-Type', content_type);
    res.write(data);
    res.end();
}


const server = http.createServer((req, res) => {
    const myURL = new URL(req.url, 'http://' + req.headers['host']);

    console.log("Petición recibida:", myURL.pathname);
    
    // Declarar el Content-Type y recurso
    if (myURL.pathname == '/procesar') {  //-- Login
        content_type = 'text/html';
        
        // Quiero comprobar si el usuario está en el json
        // Primero obtengo de la solicitud el valor del nombrey la contraseña
        username = myURL.searchParams.get('username');
        password = myURL.searchParams.get('password');
        console.log('USUARIO: ' + username);
        console.log('PASSWORD: ' + password);

        usuario_existe = false;

        usuarios.forEach(element => { // Itera sobre todos los usuarios para ver si está registrado
            // Si el usuario introducido y la contraseña coinciden, se da como login correcto
            // Si el usuario existe pero la contraseño no es correcto se pide que se vuelva a introducir
            // Si el usuario no xiste se pide que se registre o si prefiere seguir navegando
            if (element.nombre_usuario == username) {
                if (element.password == password) {  //-- Contraseña correcta
                    leerFichero(LOGIN_CORRECTO, (err, data) => {
                        if (err) {
                            code_404(res)
                        } else {
                            data = data.toString();
                            data = data.replace("NOMBRE", username);

                            //-- Envía del rescurso procesado
                            code_200(res, data);
                        }
                    });

                } else {  //-- Contraseña no correcta
                    leerFichero(FORMULARIO_LOGIN, (err, data) => {
                        if (err) {
                            code_404(res);
                        } else {
                            data = data.toString();
                            data = data.replace("Accede al FunkoVerse", "Contraseña incorrecta");

                            //-- Envía del rescurso procesado
                            code_200(res, data);
                        }
                    });
                }

                usuario_existe = true;
            }
        });

        // Si el usuario no exisitia en la base de datos se pregunta por regitro
        if (usuario_existe == false) {
            leerFichero(LOGIN_NO_CORRECTO, (err, data) => {
                if (err) {
                    code_404(res);
                } else {
                    data = data.toString();
                    data = data.replace("AVISO", "USUARIO NO REGISTRADO");
                    data = data.replace("CUERPO-AVISO", "Puede decidir si registrarse o seguir navegando como invitado:"); 
    
                    //-- Envía del rescurso procesado
                    code_200(res, data);
                }
            });
        }
        

    } else if (myURL.pathname == '/pedido') {  //-- Realiza el pedidio
        content_type = "text/html";

        // Elementos para registar
        //username = myURL.searchParams.get('username');
        address = myURL.searchParams.get('address');
        tarjeta = myURL.searchParams.get('tarjeta');
        //lista_productos = myURL.searchParams.get('lista_productos');

        const nuevoPedido = {
            "nombre_usuario": "",
            "address": address,
            "tarjeta": tarjeta,
            "lista productos": ""
        };
          
        // Agregar el nuevo objeto al array de usuarios
        pedidos.push(nuevoPedido);
        
        // Convertir el objeto JavaScript de nuevo a formato JSON
        const nuevoJsonTienda = JSON.stringify(tienda, null, 2);
        
        // Escribir el JSON actualizado de vuelta al archivo
        fs.writeFileSync('tienda.json', nuevoJsonTienda, 'utf8')

        // Página de registro exitoso
        leerFichero(LOGIN_CORRECTO, (err, data) => {
            if (err) {
                code_404(res);
            } else {
                data = data.toString();
                data = data.replace("HAS INICIADO SESIÓN CORRECTAMENTE", "PEDIDO REALIZADO CON ÉXITO");
                data = data.replace("Bienvenido: NOMBRE", "¡Gracias por confiar en nosotros!");
        
                //-- Envía del rescurso procesado
                code_200(res, data);
            }
        });

    } else if (myURL.pathname == '/registrar') {
        content_type = "text/html";

        // Elementos para registar
        username = myURL.searchParams.get('username');
        real_name = myURL.searchParams.get('real_name');
        password = myURL.searchParams.get('password');
        mail = myURL.searchParams.get('mail');

        const nuevoUsuario = {
            "nombre_usuario": username,
            "nombre_real": real_name,
            "mail": mail,
            "password": password
        };

        // Agregar el nuevo objeto al array de usuarios
        usuarios.push(nuevoUsuario);
        
        // Convertir el objeto JavaScript de nuevo a formato JSON
        const nuevoJsonTienda = JSON.stringify(tienda, null, 2);
        
        // Escribir el JSON actualizado de vuelta al archivo
        fs.writeFileSync('tienda.json', nuevoJsonTienda, 'utf8')

        // Página de registro exitoso
        fs.readFile(LOGIN_CORRECTO, (err, data) => {
            if (err) {
                code_404(res);
            } else {
                data = data.toString();
                data = data.replace("NOMBRE", username)
                
                //-- Envía del rescurso procesado
                code_200(res, data);
            }
        });

    } else if (myURL.pathname.endsWith('.png')) {  //--PNG
        content_type = 'image/png';
        recurso = './Images/' + myURL.pathname.split('/').pop();
        enviarFicheros(recurso);

    } else if (myURL.pathname.endsWith('.html')) {  //-- HTML
        content_type = 'text/html'
        recurso = './Pages/' + myURL.pathname.split('/').pop();
        enviarFicheros(recurso);

    } else if (myURL.pathname.endsWith('.css')) {  //--CSS
        content_type = 'text/css';
        recurso = './Style/' + myURL.pathname.split('/').pop();
        enviarFicheros(recurso);

    } else if (myURL.pathname.endsWith('.js')) {  //--JS
        content_type = 'application/javascript';
        recurso = './JS/' + myURL.pathname.split('/').pop();
        enviarFicheros(recurso);v

    } else if (myURL.pathname.endsWith('.jpeg')) {  //--JPEG
        content_type = 'image/jpeg';
        recurso = './Images/' + myURL.pathname.split('/').pop();
        enviarFicheros(recurso);

    } else if (myURL.pathname == '/') {
        content_type = 'text/html';
        recurso = './Pages/tienda.html';
        enviarFicheros(recurso);

    } else {  // Valor por defecto -> HTML - error.html
        content_type = 'text/html';
        recurso = pagina_error;
        enviarFicheros(recurso);
    }

    function enviarFicheros(recurso) {
        leerFichero(recurso, (err, data) => {

            if (err) {
                res.statusCode = 404;             // Código de respuesta
                res.statusMessage = "Not Found"; // Mensaje asociado al código
                res.setHeader('Content-Type', 'text/html');
                res.write(pagina_error);
                res.end();
            } else {
                //-- Envía del rescurso procesado
                res.statusCode = 200;         // Código de respuesta
                res.statusMessage = "OK";    // Mensaje asociado al código
                res.setHeader('Content-Type', content_type);
                res.write(data);
                res.end();
            }

        });
    };
});

server.listen(PORT, () => {
    console.log("Escuchando en puerto: " + PORT);
})