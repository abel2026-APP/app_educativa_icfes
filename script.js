let nombreEstudiante = "";
let gradoEstudiante = "";

// global tiempo
let tiempoTotal = 0;           // en segundos
let temporizadorTotal = null;


function iniciarQuiz() {

  const nombreInput = document.getElementById("nombre").value.trim();
  const gradoInput = document.getElementById("grado").value.trim();

  if (nombreInput === "" || gradoInput === "") {
    alert("Por favor, ingresa nombre y grado");
    return;
  }

  nombreEstudiante = nombreInput;
  gradoEstudiante = gradoInput;

  document.getElementById("registro").style.display = "none";
  document.getElementById("quiz").style.display = "block";

  // 🔥 AQUÍ SE INICIA TODO
  indice = 0;
  puntaje = 0;

  // 🔥 CLAVE ABSOLUTA
  const copiaPreguntas = [...preguntas];
  mezclarArray(copiaPreguntas);
  preguntas = copiaPreguntas;

  mostrarPregunta();
}

let preguntas = [];   // ahora se llenará desde preguntas.json

let indice = 0;
let puntaje = 0;

let tiempo = 180;          // segundos por pregunta
let tiempoRestante = 180;
let temporizador = null;


const preguntaEl = document.getElementById("pregunta");

const resultadoEl = document.getElementById("resultado");
const contadorEl = document.getElementById("contador");


// funcion tiempo Total

function iniciarTiempoTotal() {
  clearInterval(temporizadorTotal);
  tiempoTotal = 0;

  temporizadorTotal = setInterval(() => {
    tiempoTotal++;

    const minutos = Math.floor(tiempoTotal / 60);
    const segundos = tiempoTotal % 60;

    document.getElementById("tiempoTotal").textContent =
      `⏰ Tiempo total: ${minutos}:${segundos.toString().padStart(2, "0")}`;
  }, 1000);
}



function mostrarPregunta() {
  resultadoEl.textContent = "";
  contadorEl.textContent = `Pregunta ${indice + 1} de ${preguntas.length}`;
  preguntaEl.textContent = preguntas[indice].texto;

  const img = document.getElementById("grafico");

  if (preguntas[indice].imagen) {
    img.src = preguntas[indice].imagen;
    img.style.display = "block";
  } else {
    img.style.display = "none";
  }

  const botones = document.querySelectorAll(".opciones button");
  botones.forEach((boton, i) => {
    boton.textContent = preguntas[indice].opciones[i];
  });

  iniciarTemporizador();

}

// Mostrar preguntas
// ✔️ BIEN (FUERA de mostrarPregunta)

function mezclarArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}


// nuevo  para refrescar preguntas y mezclarlas

fetch("preguntas.json")
  .then(respuesta => respuesta.json())
  .then(datos => {
    preguntas = datos;
  })
  .catch(error => {
    console.error("Error cargando preguntas:", error);
  });


function responder(opcion) {

    clearInterval(temporizador);

    if (opcion === preguntas[indice].correcta) {
        puntaje++;
        resultadoEl.textContent = "✅ Correcto";
        resultadoEl.style.color = "green";
    } else {
        resultadoEl.textContent = "❌ Incorrecto";
        resultadoEl.style.color = "red";
    }

    setTimeout(() => {
        indice++;
        if (indice < preguntas.length) {
            mostrarPregunta();
        } else {
            mostrarResultadoFinal();
        }
    }, 800);
}
 
// Reiniciar funcion nueva 

function reiniciar() {
  indice = 0;
  puntaje = 0;

  // ⏱️ Reiniciar temporizador por seguridad
  clearInterval(temporizador);
  tiempoRestante = tiempo;

  // 🎲 Mezclar preguntas (orden nuevo)
  const copiaPreguntas = [...preguntas];
  mezclarArray(copiaPreguntas);
  preguntas = copiaPreguntas;

  mostrarPregunta();
}

function mostrarResultadoFinal() {

// ⏹️ detener tiempo total
  clearInterval(temporizadorTotal);

  // 📏 calcular tiempo total FINAL
  const minutos = Math.floor(tiempoTotal / 60);
  const segundos = tiempoTotal % 60;

  // ⛔ ocultar elementos de pregunta
  document.getElementById("tiempo").style.display = "none";
  document.getElementById("pregunta").style.display = "none";
  document.querySelector(".opciones").style.display = "none";
  document.getElementById("contador").style.display = "none";

  // 🧾 mostrar resultado limpio
  resultadoEl.innerHTML = `
    <h2>📊 Resultado final</h2>
    <strong>Estudiante:</strong> ${nombreEstudiante}<br>
    <strong>Grado:</strong> ${gradoEstudiante}<br>
    <strong>Tiempo total:</strong> ${minutos} min ${segundos} s<br><br>
    <strong>Puntaje:</strong> ${puntaje} / ${preguntas.length}
  `;

     document.getElementById("btnHistorial").style.display = "block";
     document.getElementById("btnHistorial").onclick = mostrarHistorial;

    document.getElementById("btnExportar").style.display = "block";
    document.getElementById("btnExportar").onclick = exportarResultados;


    resultadoEl.style.color = "#1a73e8";
    resultadoEl.innerHTML += `<br><em>Intento finalizado. Consulte al docente.</em>`;


//  // 🔒 DESHABILITAR BOTÓN REINICIAR (AQUÍ VA)
  const btn = document.getElementById("btnReiniciar");
btn.disabled = true;
btn.style.display = "none";

  btn.disabled = true;
  btn.style.opacity = "0.5";
  btn.style.cursor = "not-allowed";

}


// ===== CONEXIÓN DE BOTONES CON JSON =====

document.querySelectorAll(".btnTema").forEach(btn => {
  btn.addEventListener("click", async () => {

    const archivo = btn.getAttribute("data-json");

    const confirmar = confirm("¿Deseas iniciar esta prueba?");
    if (!confirmar) return;

    try {
      const respuesta = await fetch(archivo);
      preguntas = await respuesta.json();

      // 🔒 DESACTIVAR REINICIAR
      const btnReiniciar = document.getElementById("btnReiniciar");
      btnReiniciar.disabled = true;
      btnReiniciar.style.opacity = "0.5";
      btnReiniciar.style.cursor = "not-allowed";

      // Mostrar zona de preguntas

      document.getElementById("menuTemas").style.display = "none";
      document.getElementById("zonaPreguntas").style.display = "block";

      iniciarTiempoTotal();   // ⏰ AQUÍ empieza el conteo total

      reiniciar(); // inicia evaluación

    } catch (error) {
      alert("Error al cargar el archivo de preguntas");
      console.error(error);
    }

  });
});




function iniciarTemporizador() {
  clearInterval(temporizador);
  tiempoRestante = tiempo;

  const tiempoEl = document.getElementById("tiempo");
  tiempoEl.textContent = `⏱️ Tiempo: ${tiempoRestante} s`;

  temporizador = setInterval(() => {
    tiempoRestante--;
    tiempoEl.textContent = `⏱️ Tiempo: ${tiempoRestante} s`;

    if (tiempoRestante <= 0) {
      clearInterval(temporizador);
      pasarSiguientePregunta();
    }
  }, 1000);
}

function pasarSiguientePregunta() {
  indice++;

  if (indice < preguntas.length) {
    mostrarPregunta();
  } else {
    mostrarResultadoFinal();
  }
}

function guardarResultado() {
  const nuevoResultado = {
    nombre: nombreEstudiante,
    grado: gradoEstudiante,
    puntaje: puntaje,
    total: preguntas.length,
    fecha: new Date().toLocaleString()
  };

  let resultados = JSON.parse(localStorage.getItem("resultadosQuiz")) || [];
  resultados.push(nuevoResultado);
  localStorage.setItem("resultadosQuiz", JSON.stringify(resultados));
}

function verResultadosGuardados() {
  const resultados = JSON.parse(localStorage.getItem("resultadosQuiz")) || [];
  console.log(resultados);
}

function mostrarHistorial() {
  const historialDiv = document.getElementById("historial");
  const lista = document.getElementById("listaHistorial");

  const resultados = JSON.parse(localStorage.getItem("resultadosQuiz")) || [];

  lista.innerHTML = "";

  if (resultados.length === 0) {
    lista.innerHTML = "<li>No hay intentos guardados.</li>";
  } else {
    resultados.forEach((res, index) => {
      const item = document.createElement("li");
      item.textContent = `${index + 1}. ${res.fecha} - ${res.nombre} (${res.grado}) → ${res.puntaje}/${res.total}`;
      lista.appendChild(item);
    });
  }

  historialDiv.style.display = "block";

}


function exportarResultados() {
  window.print();
}











