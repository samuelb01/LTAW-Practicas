//-- JS para hacer la búsqueda

//-- Elementos HTML para mostrar la información
const display = document.getElementById("resultado-busqueda");

//-- Caja de búsquedas
const caja_busqueda = document.getElementById("caja-busqueda");

//-- Retrollamada del botón Ver Productos
caja_busqueda.oninput = () => {

    //-- Crear objeto para hacer las peticiones AJAX
    const m = new XMLHttpRequest();

    //-- Función de callback que se invoca cuando hay  
    //-- cambios en el estado de la petición
    m.onreadystatechange = () => {

        //-- Petición enviada y recibida. Todo nice!
        if (m.readyState == 4) {

            //-- Solo se procesa si la respuesta es correcta
            if (m.status == 200) {

                //-- Respuesta es un objeto JSON
                let productos = JSON.parse(m.responseText);

                //-- Borrar el resultado anterior
                display.innerHTML = "";

                if (productos.length == 0) { //-- No hay resultados

                    //-- Muestro los resultados de busqueda
                    display.style.display = "block";

                    //-- No hay resultados
                    display.innerHTML += "<p>No se encuentran resultados</p>";

                } else {
                    
                    //-- Muestro los resultados de busqueda
                    display.style.display = "block";

                    //-- Recorrer todos los productos del objeto JSON
                    for (let prod of productos) {
                        display.innerHTML += '<a href="/producto?nombre_producto=' + prod.nombre + '">' + prod.nombre + '</a> <br>';
                    }

                }

            } else {

                //-- Error en la petición -> Notificar en la consola
                console.log("Error en la petición: " + m.status + " " + m.statusText);

            }

        }

    }

    //-- La petición se realiza solo si hay al menos un carácter
    if (caja_busqueda.value.length >= 1) {

        //-- Configurar la petición
        m.open("GET", "/productos?param1=" + caja_busqueda.value, true);

        //-- Enviar la petición
        m.send()

    } else {
        display.style.display = "none";
        display.innerHTML = "";
    }
}