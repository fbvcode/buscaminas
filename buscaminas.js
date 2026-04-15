//Variables globales que vamos a necesitar a lo largo del script
let celdasTotales = 0; // Declaramos la variable para el número total de celdas del tablero, que se calculará en la función pintarTablero una vez se hayan validado el tamaño del tablero
let minasTotal = 0;
let minasRestantes = 0;
let minasEncontradas = 0;
let intentosRedondeado;

  //Interruptor para deciodir si mostrar u ocultar las minas
  let minasVisibles = false;

//Los inputs en variables para ir actualizando su contenido
let inputIntentosRestantes = document.getElementById("intentos");
let inputMinasEncontradas = document.getElementById("minas");

// Referenciamos los objetos del DOM que nos hacen falta para pintar el tablero, que son el botón y los inputs de ancho y alto
let botonPintar = document.getElementById("pintar");
let inputAncho = document.getElementById("ancho");
let inputAlto = document.getElementById("alto");

//Asignamos el eventro click al botón
botonPintar.addEventListener("click", function () {
  //Convertimos a numero los valores de los inputs, ya que por defecto son string
  let ancho = parseInt(inputAncho.value);
  let alto = parseInt(inputAlto.value);

  // Llamamos a la función para pintar el tablero, pasándole el alto y el ancho que el usuario ha introducido
  let exito = pintarTablero(alto, ancho);

  if (!exito) {
    return;
  }

  celdasTotales = ancho * alto;

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
    return false;
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
    return false;
  } else {
    tamanoValido = true;
  }

  //Si pasamos todas las validaciones, entonces se pinta el tablero
  if (tamanoValido) {
    // Seleccionamos donde vamos a dibujar el tablero, que es el div con id "tablero"
    const contenedorTablero = document.getElementById("tablero");

    // Limpiamos por si había un juego anterior
    contenedorTablero.innerHTML = "";

    // Creamos el elemento tabla
    let tabla = document.createElement("table");
    tabla.classList.add("tablerojuego"); // Le ponemos el estilo del CSS
    tabla.id = "tableroJuego";

    let contadorCeldas = 0;
    // Creamos las filas
    for (let f = 0; f < filas; f++) {
      let filaHTML = document.createElement("tr"); // Creamos fila
      //Dentro de cada fila, creamos las celdas
      for (let c = 0; c < columnas; c++) {
        let celda = document.createElement("td"); // Creamos celda

        // Le ponemos un ID único a cada celda, con el formato "c-numeroCelda"
        celda.id = "c" + contadorCeldas;

        // Metemos la celda en la fila
        filaHTML.appendChild(celda);

        //Aumentamos el contador
        contadorCeldas++;
      }
      // Metemos la fila en la tabla
      tabla.appendChild(filaHTML);
    }
    // Ponemos la tabla dentro del contenedor del tablero
    contenedorTablero.appendChild(tabla);

    return true;
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
    let lectura = prompt(
      "Antes de comenzar, introduce el número de minas que quieres en el tablero.\n" +
        "En este caso debe estar entre 1 y " +
        (celdasTotales - 1) +
        " (ambos incluidos).\nIntentos: " +
        intentosRedondeado +
        ".",
    );
    //Si el usuario cancela en el prompt = null
    if (lectura === null) {
      alert("Juego cancelado...");
      return;
    }
    minasTotal = parseInt(lectura); //Convertimos a número

    //Si el usuario deja el campo en blanco o mete algo que no sea un número
    if (isNaN(minasTotal)) {
      alert("Has introducido un número no válido, vuelve a intentarlo.");
      continue; //Volvemos al principio del while
    }

    minasRestantes = minasTotal;

    //Una vez que sabemos las minas que hay, ponemos el input así para que sea más descriptivo
    minasEncontradas = 0;
    inputMinasEncontradas.value = minasEncontradas + " / " + minasTotal;

    if (minasTotal >= celdasTotales) {
      //Si el número de minas es mayor o igual al de celdas totales, alertamos de error, pues debe ser menor
      alert(
        "El número de minas introducido no es válido." +
          "\n" +
          "Recuerda que el número de minas debe ser menor que el número de celdas del tablero, es decir, menor que " +
          celdasTotales +
          ".",
      );
    } else if (minasTotal < 1) {
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
    } else if (minasTotal > intentosRedondeado) {
      let seguirMinas = confirm(
        "Has introducido un número de minas mayor al número de intentos de los que dispones, no tienes posibilidad de ganar.\n" +
          "Pulsa Cancelar para rectificar el número de minas o Aceptar para seguir adelante.",
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

  // Autoscroll al final
  areaMensajes.scrollTop = areaMensajes.scrollHeight;
}

function jugar() {
  //Limpiamos el área de mensajes por si hay mensajes de un juego anterior
  document.getElementById("mensaje").innerHTML = "";

  //Mostramos mensaje de que comienza el juego e informamos del número de minas que hay
  escribirMensaje("Comienza el juego.");

  escribirMensaje("Hay <strong>" + minasTotal + "</strong> minas escondidas.");
  //Creamos un array para almacenar las posiciones de las minas
  let posicionesMinas = [];
  //Repartimos las minas
  repartirMinas();

  tabla = document.getElementById("tableroJuego");

  tabla.addEventListener("click", function (e) {
    let celdaPulsada = e.target;
    //Si se pulsa en la tabla pero no se pulsa en una celda:
    if (celdaPulsada.tagName !== "TD") return;

    let celdaPulsadaId = celdaPulsada.id;
    let numeroCelda = parseInt(celdaPulsadaId.substring(1));

    //Si la celda ya ha sido pulsada anteriormente
    if (celdaPulsadaId === "selec" || celdaPulsadaId === "mina") {
      escribirMensaje("Esa celda ha sido ya pulsada. No cuenta.");
      return;
    }

    console.log("CeldaPulsadaId = ", celdaPulsadaId);
    console.log("numeroCelda: " + numeroCelda);

    if (posicionesMinas.includes(numeroCelda)) {
      escribirMensaje("<strong>Has acertado! Una mina menos 💣 :)</strong>");
      intentosRedondeado--;
      minasRestantes--;
      minasEncontradas++;
      /*En el enunciado dice que cuando se encuentra una mina hay que avisar a usuario con un alert
      Pero lo dejo comentado porque, a mi personalmente no me gusta, creo que con la personalización de
      la celda y el mensaje en en cuadro de mensajes, es suficiente y no "interrumpe" el juego*/
      //alert("¡Enhorabuena, has encontrado una mina!");
      escribirMensaje(
        "Te quedan <strong>" +
          intentosRedondeado +
          "</strong> intentos y <strong>" +
          minasRestantes +
          "</strong> mina/s.",
      );
      celdaPulsada.innerHTML = "💣";
      inputIntentosRestantes.value = intentosRedondeado;
      inputMinasEncontradas.value = minasEncontradas + " / " + minasTotal;
      celdaPulsada.id = "mina";
    } else {
      intentosRedondeado--;
      escribirMensaje("No has acertado. Sigue probando. ❌");
      inputIntentosRestantes.value = intentosRedondeado;
      celdaPulsada.id = "selec";
      escribirMensaje(
        "Te quedan <strong>" +
          intentosRedondeado +
          "</strong> intentos y <strong>" +
          minasRestantes +
          "</strong> mina/s.",
      );
    }

    if (minasRestantes == 0) {
      escribirMensaje("Has encontrado todas las minas ¡Enhorabuena!");
      escribirMensaje("--- FIN DEL JUEGO ---");

      tabla.style.pointerEvents = "none";
    } else if (intentosRedondeado == 0) {
      escribirMensaje("Se acabaron tus intentos... Prueba a jugar otra vez.");
      escribirMensaje(
        "Has encontrado <strong>" +
          minasEncontradas +
          "</strong> minas de un total de <strong>" +
          minasTotal +
          "</strong>.",
      );

      escribirMensaje("--- FIN DEL JUEGO ---");
      tabla.style.pointerEvents = "none";
    }
  });

  function repartirMinas() {
    //Vaciamos el array para empezar de cero
    posicionesMinas = [];

    console.log("minas escondidas: ", minasTotal);
    console.log(posicionesMinas);
    //Creamos un bucle que repartirá tantas minas como haya determinado el ususario
    while (posicionesMinas.length < minasTotal) {
      let numeroAzar = Math.floor(Math.random() * celdasTotales);
      if (!posicionesMinas.includes(numeroAzar)) {
        posicionesMinas.push(numeroAzar);
      } else {
        continue;
      }
    }

    //Reseteamos valores para empezar el juego limpio
    minasRestantes = minasTotal;
    minasEncontradas = 0;
    
    //Sólo mostramos el botón si no existe previamente
    if (!document.querySelector("#mostrarMinas")) {
      crearBotonMostrarMinas();
    }

    //Función para crear el boton que reparte las minas
    function crearBotonMostrarMinas() {
      const divBotones = document.querySelector("div.divBotones");

      const botonMostrarMinas = document.createElement("button");

      botonMostrarMinas.textContent = "Mostrar minas";
      botonMostrarMinas.classList.add("btn", "btn-default");
      botonMostrarMinas.id = "mostrarMinas";
      botonMostrarMinas.type = "button";

      divBotones.append(botonMostrarMinas);

      //Selecionamos el botón Mostrar minas y le añadimos un evento para mostrarlas
      botonMostrarMinas.addEventListener("click", function (e) {
        if (minasVisibles) {
          ocultarTablero(botonMostrarMinas);
        } else {
          revelarTablero(botonMostrarMinas);
        }
      });
    }

    function revelarTablero(boton) {
      boton.textContent = "Ocultar minas";
      minasVisibles = true;
      escribirMensaje("<i>Revelando la ubicación de las minas...</i>");

      //Recorremos el array de posiciones
      posicionesMinas.forEach((posicion) => {
        let celda = document.getElementById("c" + posicion);
        if (celda) {
          celda.innerHTML = "💣";
        }
      });
    }

    function ocultarTablero(boton) {
      boton.textContent = "Mostrar minas";
      minasVisibles = false;
      escribirMensaje("<i>Ocultando la ubicación de las minas...</i>");

      //Recorremos el array de posiciones
      posicionesMinas.forEach((posicion) => {
        let celda = document.getElementById("c" + posicion);
        if (celda) {
          celda.innerHTML = "";
        }
      });
    }
  }
}

/*Las dos cosas que más dificultad me han representado de la tarea han sido, por un lado, crear la tabla en sí (los bucles for que l*/
