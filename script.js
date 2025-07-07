// script.js - version précise avec requestAnimationFrame

let type = "adulte";
let compressions = 0;
let insufflations = 0;
let cycles = 0;
let running = true;
let defibPause = false;
let formé = false;

const select = document.getElementById("typeVictime");
const compteur = document.getElementById("compteurCompression");
const insuff = document.getElementById("insufflations");
const cycleDisplay = document.getElementById("cycles");
const popup = document.getElementById("popup");
const bip = document.getElementById("bip");
const startBtn = document.getElementById("start");
const stopBtn = document.getElementById("stop");
const defibBtn = document.getElementById("defib");

let lastTime = 0;
const compressionInterval = 545; // ms entre compressions (110/min)

let phase = "compressions"; // compressions ou insufflations
let insufflationTimer = 0;

function updateDisplay() {
  compteur.textContent = `Comp : ${compressions}`;
  insuff.textContent = `Insufflations : ${insufflations}`;
  cycleDisplay.textContent = `Cycles : ${cycles}`;
}

function showPopup() {
  popup.hidden = false;
}

function hidePopup() {
  popup.hidden = true;
}

function reset() {
  compressions = 0;
  insufflations = 0;
  cycles = 0;
  phase = "compressions";
  running = true;
  defibPause = false;
  updateDisplay();
  hidePopup();
  lastTime = 0;
  requestAnimationFrame(loop);
}

function loop(timestamp) {
  if (!running) return;

  if (!lastTime) lastTime = timestamp;
  const elapsed = timestamp - lastTime;

  if (defibPause) {
    // Pause active, ne rien faire
    lastTime = timestamp;
    requestAnimationFrame(loop);
    return;
  }

  if (phase === "compressions") {
    if (elapsed >= compressionInterval) {
      compressions++;
      bip.play();
      updateDisplay();

      lastTime = timestamp;

      const maxComp = (type === "adulte") ? 30 : 15;
      if (compressions >= maxComp) {
        phase = "insufflations";
        insufflations = 0;
        showPopup();
        // lancement du timer d'insufflations (2 secondes)
        insufflationTimer = 0;
      }
    }
  } else if (phase === "insufflations") {
    // Durée totale insufflations = 2s
    insufflationTimer += elapsed;
    if (insufflationTimer >= 2000) {
      hidePopup();
      cycles++;
      compressions = 0;
      insufflations = 2;
      phase = "compressions";
      updateDisplay();
      lastTime = timestamp;
    }
  }

  requestAnimationFrame(loop);
}

// Gestion sélection victime
select.onchange = () => {
  type = select.value;
  reset();
};

// Bouton stop
stopBtn.onclick = () => {
  running = false;
  hidePopup();
};

// Bouton défibrillateur (pause 5s)
defibBtn.onclick = () => {
  defibPause = true;
  setTimeout(() => {
    defibPause = false;
    lastTime = performance.now(); // reset chrono après pause
    requestAnimationFrame(loop);
  }, 5000);
};

// Bouton je suis formé
document.getElementById("formee").onclick = () => {
  formé = true;
  alert("Le mode assisté est désactivé.");
  // Ici tu peux aussi cacher les popup ou bips si tu veux
};

reset(); // démarrage initial