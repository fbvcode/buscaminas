//Variables globales que vamos a necesitar a lo largo del script
let celdasTotales = 0; // Declaramos la variable para el número total de celdas del tablero, que se calculará en la función pintarTablero una vez se hayan validado el tamaño del tablero
let minas = 0;
let minasEncontradas = 0;
let intentosRedondeado;

// Referenciamos los objetos del DOM que nos hacen falta para pintar el tablero, que son el botón y los inputs de ancho y alto
let botonPintar = document.getElementById("pintar");
let inputAncho = document.getElementById("ancho");
let inputAlto = document.getElementById("alto");

//Asignamos el eventro click al botón
botonPintar.addEventListener("click", function () {
  //Convertimos a numero los valores de los inputs, ya que por defecto son string
  let ancho = parseInt(inputAncho.value);
  let alto = parseInt(inputAlto.value);

  celdasTotales = ancho * alto;

  // Llamamos a la función para pintar el tablero, pasándole el alto y el ancho que el usuario ha introducido
  pintarTablero(alto, ancho);

  //Lamamos a la función para determinar los intentos que tiene el jugador y colocarlo en su input
  determinarIntentos();

  //Lamamos a la función para determinar el número de minas que habrá en el tablero
  determinarMinas();

  jugar();
});

function pintarTablero(filas, columnas) {
  //Validamos el tamaño del tablero
  let tamanoValido = false;
  if (isNaN(filas) || isNaN(columnas)) {
    alert(
      "Uno (o ambos) de los valores no ha sido introducido/s correctamente.",
    );
  } else if (filas < 2 || columnas < 2) {
    alert(
      "Has introducido un tamaño de " +
        columnas +
        "x" +
        filas +
        ". " +
        "\n" +
        "El tamaño mínimo del tablero es de 2x2",
    );
  } else {
    tamanoValido = true;
  }

  //Si pasamos todas las validaciones, entonces se pinta el tablero
  if (tamanoValido) {
    // Seleccionamos donde vamos a dibujar el tablero, que es el div con id "tablero"
    let contenedorTablero = document.getElementById("tablero");

    // Limpiamos por si había un juego anterior
    contenedorTablero.innerHTML = "";

    // Creamos el elemento tabla
    let tabla = document.createElement("table");
    tabla.classList.add("tablerojuego"); // Le ponemos el estilo del CSS

    // Creamos las filas
    for (let f = 0; f < filas; f++) {
      let filaHTML = document.createElement("tr"); // Creamos fila
      //Dentro de cada fila, creamos las celdas
      for (let c = 0; c < columnas; c++) {
        let celda = document.createElement("td"); // Creamos celda

        // Le ponemos un ID único a cada celda, con el formato "c-fila-columna"
        celda.id = "c-" + f + "-" + c;

        // Metemos la celda en la fila
        filaHTML.appendChild(celda);
      }
      // Metemos la fila en la tabla
      tabla.appendChild(filaHTML);
    }
    // Ponemos la tabla dentro del contenedor del tablero
    contenedorTablero.appendChild(tabla);
  }
}

function determinarIntentos() {
  //Declaramos la variable para el número de intentos
  let intentos = celdasTotales / 1.5;

  intentosRedondeado = Math.ceil(intentos); // Redondeamos hacia arriba el número de intentos

  //Colocamos el número de intentos en el campo del input de intentos
  let campoIntentos = document.getElementById("intentos");
  campoIntentos.value = intentosRedondeado;
}

function determinarMinas() {
  let minasValidas = false;

  while (!minasValidas) {
    //Pedimos el numero de minas al usuario y lo convertimos directamente a número y también de paso lo guardamos en una variable
    minas = parseInt(
      prompt(
        "Antes de comenzar, introduce el número de minas que quieres en el tablero.\n" +
          "En este caso debe estar entre 1 y " +
          (celdasTotales - 1) +
          " (ambos incluidos).\nIntentos: "+ intentosRedondeado + "."
      ),
    );

    if (minas >= celdasTotales) {
      //Si el número de minas es mayor o igual al de celdas totales, alertamos de error, pues debe ser menor
      alert(
        "El número de minas introducido no es válido." +
          "\n" +
          "Recuerda que el número de minas debe ser menor que el número de celdas del tablero, es decir, menor que " +
          celdasTotales +
          ".",
      );
    } else if (minas < 1) {
      //Si el número de minas es menor que 1, también alertamos de error, pues no puede haber 0 minas o minas negativas
      alert(
        "El número de minas introducido no es válido." +
          "\n" +
          "El número de minas debe ser al menos 1.",
      );
      /*Al principio, no iba a poner el if(minas>=celdasTotales) ya que, el valor de los intentos siempre será menor que el de las celdas totales. 
      Si el jugador introduce un número mayor que los intentos, puede saltar el error ahí y nunca llegaría a saltar el error "El número de minas debe ser menor
      que el número de celdas del tablero...". Pero he decidido que, si el jugador quiere poner un número de minas mayor a los intentos que tiene, aunque 
      sea un poco absurdo, se lo vamos a permitir, al fin y al cabo, es el jugador el que decide. Le lanzaremos una advertencia para que sepa que no tiene 
      posibilidades, pero le permitiremos seguir o mejor, le pediremos confirmación. */
    } else if (minas > intentosRedondeado) {
      let seguirMinas = confirm(
        "Has introducido un número de minas mayor al número de intentos de los que dispones, no tienes posibilidad de ganar.\n"+
        "Pulsa Cancelar para rectificar el número de minas o Aceptar para seguir adelante."
      );
      if (seguirMinas) {
        minasValidas = true;
      }
    } else {
      //Si no ocurre ninguno de los errores anteriores, colocamos en true la condición para salir del bucle y no pedir de nuevo el número de minas
      minasValidas = true;
    }
  }
}

//Como tenemos que mandar muchos mensajes al usuario durante el juego, creamos una función para ello que nos lo facilitará mucho
function escribirMensaje(mensaje) {
    //Metemos el área de mensajes en una variable
    let areaMensajes = document.getElementById("mensaje");

    //Creamos otra variable que crea un elemento párrafo
    let nuevoParrafo = document.createElement("p");

    //Le damos un valor al texto del párrafo creado
    nuevoParrafo.innerHTML = mensaje;

    //añadimos el nuevo párrafo en el área de mensajes
    areaMensajes.appendChild(nuevoParrafo);
}

function jugar() {
    //Limpiamos el área de mensajes por si hay mensajes de un juego anterior
    document.getElementById("mensaje").innerHTML="";

    //Mostramos mensaje de que comienza el juego e informamos del número de minas que hay
    escribirMensaje("Comienza el juego.");

    escribirMensaje("Hay <strong>"+ minas + "</strong> minas escondidas.");

    let posicionesMinas = [];

    //for (m =0;m<minas;m++ ){
     //   --
    //}




}

/*Las dos cosas que más dificultad me han representado de la tarea han sido, por un lado, crear la tabla en sí (los bucles for que la crean) y  */
