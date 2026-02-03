let nombreEstudiante = "";
let gradoEstudiante = "";

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

    reiniciar();
}



let preguntas = [];   // ahora se llenará desde preguntas.json
let indice = 0;
let puntaje = 0;

let tiempo = 60;          // segundos por pregunta
let tiempoRestante = 10;
let temporizador = null;


const preguntaEl = document.getElementById("pregunta");

const resultadoEl = document.getElementById("resultado");
const contadorEl = document.getElementById("contador");


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


fetch("preguntas.json")
  .then(respuesta => respuesta.json())
  .then(datos => {
    preguntas = datos;
    mostrarPregunta();
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

function mostrarResultadoFinal() {

    preguntaEl.textContent = "Quiz finalizado 🎉";
    contadorEl.textContent = "";

    document.querySelector(".opciones").innerHTML = "";

    resultadoEl.innerHTML = `
        <strong>Estudiante:</strong> ${nombreEstudiante}<br>
        <strong>Grado:</strong> ${gradoEstudiante}<br><br>
        <strong>Puntaje:</strong> ${puntaje} / ${preguntas.length}
    `;
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

<div id="menuTemas">
  <h2>Selecciona el tema</h2>

  <button class="btnTema" data-json="mua.json">
    Movimiento Uniformemente Acelerado (MUA)
  </button>

  <button class="btnTema" data-json="trabajo_energia.json">
    Trabajo y Energía
  </button>
</div>


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


