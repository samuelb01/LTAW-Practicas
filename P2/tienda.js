//-- Importar módulos
const http = require('http');   //-- Acceso a los elementos del módulo http 
const fs = require('fs');   //-- Módulo fs para acceder con Node.js a los fichero del ordenador
const { url } = require('inspector');


//-- Puerto que se va a utilizar (9090)
const PORT = 9090;

//-- Nombre de las paginas a leer y enviar
const pagina_error = fs.readFileSync('./Pages/pagina-error.html', 'utf8');
const FORMULARIO_LOGIN = './Pages/login.html';
const LOGIN_CORRECTO = './Pages/login-correcto.html';
const LOGIN_NO_CORRECTO = './Pages/login-no-correcto.html';
const PAGINA_PRODUCTOS = './Pages/pagina-producto.html';
const PAGINA_LOGOUT = './pages/logout.html';


//-- Cargo el archivo .json y creo la estructura de la tienda
const tienda_json = fs.readFileSync('./tienda.json', 'utf-8');
const tienda = JSON.parse(tienda_json);

//-- Info de la tienda
let productos = tienda.productos;
let usuarios = tienda.usuarios;
let pedidos = tienda.pedidos;


//-- Función para leer archivos
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

//-- función para mandar 404 Not Found
function code_404 (res) {
    res.statusCode = 404;             // Código de respuesta
    res.statusMessage = "Not Found"; // Mensaje asociado al código
    res.setHeader('Content-Type', 'text/html');
    res.write(pagina_error);
    res.end();
}

//-- Función para mandar 200 OK
function code_200 (res, data, content_type, user) {
    data = writeUser(data, user)
    res.statusCode = 200;         // Código de respuesta
    res.statusMessage = "OK";    // Mensaje asociado al código
    res.setHeader('Content-Type', content_type);
    res.write(data);
    res.end();
}

//-- Analizar la cookie y devolver el nombre de usuario si existe, si no, será null
function getUsuario(req) {

    //-- Leer cookie recibida
    const cookie = req.headers.cookie;

    // Si hay cookie se busca si existe el usuario
    if (cookie) {

        //-- Array con todos los pares nombre-valor
        let pares = cookie.split(';')

        //-- Guardar usuario
        let user;

        //-- Recorremos el array pares para ver si existe la cooki user y obtener su valor
        pares.forEach(element => {
            
            //-- Nombres y valores
            let [nombre, valor] = element.split('=');

            //-- Leer el usuario si el nombre de la cookie es 'user'
            if (nombre == 'user') {
                user = valor;
            }

        });

        //-- Se devuelve user si está asignada, si no se devuelve null
        return user || null;

    }
}

//-- Función para escribir el usuario en la cabecera
function writeUser(data, user) {

    // Buscar el índice donde se encuentra el marcador de posición del usuario en el HTML
    const index = data.indexOf("<!-- <p>USUARIO</p> -->");

    // Si se encuentra el marcador de posición del usuario
    if (index !== -1) {

        // Si hay un usuario, reemplazar el marcador de posición con el nombre de usuario
        if (user) {

            const usuarioHTML = `<p>${user}</p>`;
            data = data.slice(0, index) + usuarioHTML + data.slice(index);

            // Si el usuario ha iniciado sesión hay que cambiar la página de login por logout
            data = data.replace("<a href=\"../Pages/login.html\">Login</a>", "<a href=\"../Pages/logout.html\">Logout</a>")

        } else {

            // Si no hay un usuario, eliminar el marcador de posición
            data = data.slice(0, index) + data.slice(index + "<!-- <p>USUARIO</p> -->".length);

            // Si el usuario no ha iniciado sesión hay que cambiar la página de logout por login
            data = data.replace("<a href=\"../Pages/logout.html\">Logout</a>", "<a href=\"../Pages/login.html\">Login</a>")

        }
    }

    return data;
}

//-- Se crea el servidor
const server = http.createServer((req, res) => {
    const myURL = new URL(req.url, 'http://' + req.headers['host']);

    console.log("Petición recibida:", myURL.pathname);

    //-- Obtener las cookies
    let user = getUsuario(req);
    
    //-- Declarar el Content-Type y recurso
    if (myURL.pathname.endsWith('/login.html')) {  //-- Se accede a la página login.html
        if (user) {

            leerFichero(LOGIN_CORRECTO, (err, data) => {
                if (err) {
                    code_404(res)
                } else {
                    data = data.toString();
                    data = data.replace("HAS INICIADO SESIÓN CORRECTAMENTE", "YA HAS INICIADO SESIÓN")
                    data = data.replace("Bienvenido:", "Sigue navegando por el FunkoVerse")
                    data = data.replace("NOMBRE", user);

                    //-- Envío del rescurso procesado
                    content_type = 'text/html';
                    code_200(res, data, content_type, user);
                }
            });

        } else {
            content_type = "text/html";
            recurso = './Pages/' + myURL.pathname.split('/').pop();
            enviarFicheros(recurso, content_type);
        }

    } else if (myURL.pathname == '/procesar') {  //-- Se ha usado el input de la página login.html

        //-- Quiero comprobar si el usuario está en el json
        //-- Primero obtengo de la solicitud el valor del nombrey la contraseña
        username = myURL.searchParams.get('username');
        password = myURL.searchParams.get('password');

        usuario_registrado = false; //-- Condición para solicitar o no al usuario que se registre en la tienda

        usuarios.forEach(element => { //-- Itera sobre todos los usuarios para ver si está registrado
            //-- Si el usuario introducido y la contraseña coinciden, se da como login correcto
            //-- Si el usuario existe pero la contraseño no es correcto se pide que se vuelva a introducir
            //-- Si el usuario no xiste se pide que se registre o si prefiere seguir navegando
            if (element.nombre_usuario == username) {
                if (element.password == password) {  //-- Contraseña correcta
                    leerFichero(LOGIN_CORRECTO, (err, data) => {
                        if (err) {
                            code_404(res)
                        } else {
                            data = data.toString();
                            data = data.replace("NOMBRE", username);

                            //-- Se asigna la cookie correpondiente al usuario logeado
                            res.setHeader('Set-cookie', "user=" + username)

                            //-- Se pasa el usuario para poder imprimirlo en la cabecera
                            user = username;

                            //-- Envío del rescurso procesado
                            content_type = 'text/html';
                            code_200(res, data, content_type, user);
                        }
                    });

                } else {  //-- Contraseña no correcta
                    leerFichero(FORMULARIO_LOGIN, (err, data) => {
                        if (err) {
                            code_404(res);
                        } else {
                            data = data.toString();
                            data = data.replace("Accede al FunkoVerse", "Contraseña incorrecta");

                            //-- Envío del rescurso procesado
                            content_type = 'text/html';
                            code_200(res, data, content_type, user);
                        }
                    });
                }

                usuario_registrado = true;  //-- El usuario exiiste en la bse de datos -> No se pregunta por registro
            }
        });

        //-- Si el usuario no exisitia en la base de datos se pregunta por regitro
        if (usuario_registrado == false) {
            leerFichero(LOGIN_NO_CORRECTO, (err, data) => {
                if (err) {
                    code_404(res);
                } else {
                    data = data.toString();
                    data = data.replace("AVISO", "USUARIO NO REGISTRADO");
                    data = data.replace("CUERPO-AVISO", "Puede decidir si registrarse o seguir navegando como invitado:"); 
    
                    //-- Envío del rescurso procesado
                    content_type = 'text/html';
                    code_200(res, data, content_type, user);
                }
            });
        }


    } else if (myURL.pathname.endsWith('/logout.html')) {  //-- LOGOUT

        leerFichero(PAGINA_LOGOUT, (err, data) => {
            if (err) {
                code_404(res);
            } else {
                data = data.toString();

                user = null;

                // Eliminar la cookie de usuario estableciéndola con un valor vacío y un tiempo de expiración pasado
                res.setHeader('Set-Cookie', 'user=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;');

                console.log('EN TOERIA HAS ENTRADO');

                //-- Envío del rescurso procesado
                content_type = 'text/html';
                code_200(res, data, content_type, user);
            }
        });

    } else if (myURL.pathname == '/pedido') {  //-- Realiza el pedidio

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
        
                //-- Envío del rescurso procesado
                content_type = 'text/html';
                code_200(res, data, content_type, user);
            }
        });

    } else if (myURL.pathname == '/registrar') {  //-- REGISTRO NUEVO USUARIO
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
        leerFichero(LOGIN_CORRECTO, (err, data) => {
            if (err) {
                code_404(res);
            } else {
                data = data.toString();
                data = data.replace("NOMBRE", username)

                //-- Se asigna la cookie correpondiente al usuario logeado
                res.setHeader('Set-cookie', "user=" + username)

                //-- En este caso particular declaro el user, ya que si se realiaz un registro exitoso, la cookie con
                //-- el usuario se va a mandar
                user = username;
                
                //-- Envía del rescurso procesado
                content_type = 'text/html';
                code_200(res, data, content_type, user);
            }
        });

    }else if (myURL.pathname == '/producto') { // Crear la página de los productos
        // Crear la página de los productos
        content_type = "text/html"

        // Nombre del producto para buscarlo en la base de datos
        nombre_producto = myURL.searchParams.get('nombre_producto');

        productos.forEach(element => {
            if (element.nombre == nombre_producto) {
                descripcion_producto = element.descripcion;
                precio_producto = element.precio;
            }
        });

        //-- Decidir el css a utilizar de la carpeta "Style"S
        estilo_producto = "../Style/style-" + nombre_producto.split(' - ')[0].replace(/ /g, "") + ".css";

        //-- Decidir las imágenes a utilizar de la carpeta "Images"
        producto_caja = "../Images/" + nombre_producto.split(' - ')[1].replace(/ /g, "") + "-box.png";
        producto_sin_caja = "../Images/" + nombre_producto.split(' - ')[1].replace(/ /g, "") + ".png";

        // Se crea la página de lo productos
        leerFichero(PAGINA_PRODUCTOS, (err, data) => {
            if (err) {
                code_404(res);
            } else {
                data = data.toString();
                data = data.replace("TITULO_PAGINA_PRODUCTO", nombre_producto.split(' - ')[1]);
                data = data.replace("NOMBRE_PRODUCTO", nombre_producto);
                data = data.replace("value=NOMBRE_PRODUCTO", 'value="' + nombre_producto + '"');
                data = data.replace("DESCRIPCION_PRODUCTO", descripcion_producto);
                data = data.replace("PRECIO_PRODUCTO", precio_producto);

                data = data.replace('<!-- HOJA DE ESTILO -->', '<link rel="stylesheet" href="'+estilo_producto+'">');
                data = data.replace('<!-- IMAGEN CODIGO -->', '<div class="imagen" onmouseover="cambiarImagen(this, \'' + producto_sin_caja + '\')" onmouseout="restaurarImagen(this, \'' + producto_caja + '\')">');
                data = data.replace('<!-- IMAGEN -->', '<img src="' + producto_caja + '" alt="' + nombre_producto.split(' - ')[1].replace(/ /g, "") + '-box">');

                //-- Envía del rescurso procesado
                content_type = 'text/html';
                code_200(res, data, content_type, user);
            }
        });

    } else if (myURL.pathname.endsWith('.png')) {  //--PNG
        content_type = 'image/png';
        recurso = './Images/' + myURL.pathname.split('/').pop();
        enviarFicheros(recurso, content_type);

    } else if (myURL.pathname.endsWith('.html') && !myURL.pathname.endsWith('/tienda.html')) {  //-- HTML
        content_type = 'text/html'
        recurso = './Pages/' + myURL.pathname.split('/').pop();
        enviarFicheros(recurso, content_type);

    } else if (myURL.pathname.endsWith('.css')) {  //--CSS
        content_type = 'text/css';
        recurso = './Style/' + myURL.pathname.split('/').pop();
        enviarFicheros(recurso, content_type);

    } else if (myURL.pathname.endsWith('.js')) {  //--JS
        content_type = 'application/javascript';
        recurso = './JS/' + myURL.pathname.split('/').pop();
        enviarFicheros(recurso, content_type);v

    } else if (myURL.pathname.endsWith('.jpeg')) {  //--JPEG
        content_type = 'image/jpeg';
        recurso = './Images/' + myURL.pathname.split('/').pop();
        enviarFicheros(recurso, content_type);

    } else if (myURL.pathname.endsWith('favicon.ico')) {
        content_type = 'image/x-icon';
        recurso = './Images/favicon-FunkoVerse.ico'; 
        enviarFicheros(recurso, content_type);

    } else if (myURL.pathname == '/' || myURL.pathname.endsWith('/tienda.html')) {

        leerFichero('./Pages/tienda.html', (err, data) => {
            if (err) {
                code_404(res);
            } else {

                if (user) {
                    data = data.toString();
                    
                    //-- Envía del rescurso procesado
                    content_type = 'text/html';
                    code_200(res, data, content_type, user);
                } else {
                    //-- Envía del rescurso procesado
                    content_type = 'text/html';
                    code_200(res, data, content_type, user);
                }
               
            }
        });

    } else {  // Valor por defecto -> HTML - error.html
        content_type = 'text/html';
        recurso = pagina_error;
        enviarFicheros(recurso, content_type);
    }

    function enviarFicheros(recurso, content_type) {
        leerFichero(recurso, (err, data) => {
            if (err) {
                code_404(res);
            } else {
                //-- Envía del rescurso procesado
                code_200(res, data, content_type, user);
            }
        });
    };
});

server.listen(PORT, () => {
    console.log("Escuchando en puerto: " + PORT);
})