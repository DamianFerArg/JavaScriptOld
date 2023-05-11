import { palabras } from "./palabras.js";

const intentos = 6;
let intentosRestantes = intentos;
let intentoActual = [];
let siguienteLetra = 0;
let intentoAcertado = palabras[Math.floor(Math.random() * palabras.length)];

class Personas {
  constructor(nombre, apellido, cargo) {
    this.nombre = nombre;
    this.apellido = apellido;
    this.cargo = cargo;
  }

  nombreCompleto() {
    return this.nombre + " " + this.apellido + " , " + this.cargo
  }
}

let personas = new Personas("Damaris", "Allue", "Alumna");

let personas2 = new Personas("Ariel", "Bachetti", "Profesor");

let personas3 = new Personas("Nano", "Pueblo", "Gatito");

let personas4 = new Personas("Achira", "Allue", "Gatita");

let gracias = document.getElementById("agradecimiento")

gracias.innerHTML = `<h3> ${personas.nombreCompleto()} </h3>
<h3> ${personas2.nombreCompleto()} </h3>
<h3> Tutores </h3>
<h3> ${personas3.nombreCompleto()} </h3>
<h3> ${personas4.nombreCompleto()} </h3>
`;

console.log(intentoAcertado);

function initBoard() {
  let board = document.getElementById("game-board");

  for (let i = 0; i < intentos; i++) {
    let row = document.createElement("div");
    row.className = "letter-row";

    for (let j = 0; j < 5; j++) {
      let box = document.createElement("div");
      box.className = "letter-box";
      row.appendChild(box);
    }

    board.appendChild(row);
  }
}

function shadeKeyBoard(letter, color) {
  for (const elem of document.getElementsByClassName("keyboard-button")) {
    if (elem.textContent === letter) {
      let oldColor = elem.style.backgroundColor;
      if (oldColor === "green") {
        return;
      }

      if (oldColor === "yellow" && color !== "green") {
        return;
      }

      elem.style.backgroundColor = color;
      break;
    }
  }
}

function deleteLetter() {
  let row = document.getElementsByClassName("letter-row")[6 - intentosRestantes];
  let box = row.children[siguienteLetra - 1];
  box.textContent = "";
  box.classList.remove("filled-box");
  intentoActual.pop();
  siguienteLetra -= 1;
}

function checkGuess() {
  let row = document.getElementsByClassName("letter-row")[6 - intentosRestantes];
  let intentoString = "";
  let intentoCierto = Array.from(intentoAcertado);

  for (const val of intentoActual) {
    intentoString += val;
  }

  if (intentoString.length != 5) {
    toastr.error("No hay suficientes letras!");
    return;
  }

  if (!palabras.includes(intentoString)) {
    toastr.error("La palabra no fue enlistada!");
    return;
  }

  let colorLetra = ["white", "white", "white", "white", "white"];


  for (let i = 0; i < 5; i++) {
    if (intentoCierto[i] == intentoActual[i]) {
      colorLetra[i] = "green";
      intentoCierto[i] = "#";
    }
  }

  for (let i = 0; i < 5; i++) {
    if (colorLetra[i] == "green") continue;


    for (let j = 0; j < 5; j++) {
      if (intentoCierto[j] == intentoActual[i]) {
        colorLetra[i] = "yellow";
        intentoCierto[j] = "#";
      }
    }
  }

  for (let i = 0; i < 5; i++) {
    let box = row.children[i];
    let delay = 250 * i;
    setTimeout(() => {

      animateCSS(box, "flipInX");

      box.style.backgroundColor = colorLetra[i];
      shadeKeyBoard(intentoString.charAt(i) + "", colorLetra[i]);
    }, delay);
  }

  if (intentoString === intentoAcertado) {
    toastr.success("La palabra es correcta! Fin del juego!");
    intentosRestantes = 0;
    return;
  } else {
    intentosRestantes -= 1;
    intentoActual = [];
    siguienteLetra = 0;

    if (intentosRestantes === 0) {
      toastr.error("Te quedaste sin intentos!");
      toastr.info(`La palabra correcta era: "${intentoAcertado}"`);
    }
  }
}

function insertLetter(pressedKey) {
  if (siguienteLetra === 5) {
    return;
  }
  pressedKey = pressedKey.toLowerCase();

  let row = document.getElementsByClassName("letter-row")[6 - intentosRestantes];
  let box = row.children[siguienteLetra];
  animateCSS(box, "pulse");
  box.textContent = pressedKey;
  box.classList.add("filled-box");
  intentoActual.push(pressedKey);
  siguienteLetra += 1;
}

const animateCSS = (element, animation, prefix = "animate__") =>

  new Promise((resolve, reject) => {
    const animationName = `${prefix}${animation}`;

    const node = element;
    node.style.setProperty("--animate-duration", "0.3s");

    node.classList.add(`${prefix}animated`, animationName);


    function handleAnimationEnd(event) {
      event.stopPropagation();
      node.classList.remove(`${prefix}animated`, animationName);
      resolve("Animation ended");
    }

    node.addEventListener("animationend", handleAnimationEnd, { once: true });
  });

document.addEventListener("keyup", (e) => {
  if (intentosRestantes === 0) {
    return;
  }

  let pressedKey = String(e.key);
  if (pressedKey === "Backspace" && siguienteLetra !== 0) {
    deleteLetter();
    return;
  }

  if (pressedKey === "✔") {
    checkGuess();
    return;
  }

  let found = pressedKey.match(/[a-z]/gi);
  if (!found || found.length > 1) {
    return;
  } else {
    insertLetter(pressedKey);
  }
});

document.getElementById("keyboard-cont").addEventListener("click", (e) => {
  const target = e.target;

  if (!target.classList.contains("keyboard-button")) {
    return;
  }
  let key = target.textContent;

  if (key === "⌫") {
    key = "Backspace";
  }

  document.dispatchEvent(new KeyboardEvent("keyup", { key: key }));
});


const tabla = document.querySelector('#lista-usuarios tbody');

function cargarUsuarios() {
  fetch('usuarios.json')
    .then(respuesta => respuesta.json())
    .then(usuarios => {
      usuarios.forEach(usuario => {
        const row = document.createElement('tr');
        row.innerHTML += `
                    <td>${usuario.id}</td>
                    <td>${usuario.nombre}</td>
                    <td>${usuario.tiempo}</td>
                    <td>${usuario.nacionalidad}</td>
                `;
        tabla.appendChild(row);
      });
    })

}

cargarUsuarios();


initBoard();

