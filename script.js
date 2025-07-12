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
const stopBtn = document.getElementById("stop");
const defibBtn = document.getElementById("defib");
const reprendreBtn = document.getElementById("reprendre");

const accueilDiv = document.getElementById("accueil");
const simulationDiv = document.getElementById("simulation");

let lastTime = 0;
const compressionInterval = 545;
let phase = "compressions";
let insufflationTimer = 0;

reprendreBtn.hidden = true;

function updateDisplay() {
  compteur.textContent = `Comp : ${compressions}`;
  insuff.textContent = `Insufflations : ${insufflations}`;
  cycleDisplay.textContent = `Cycles : ${cycles}`;
}

function showInsufflations() {
  insuff.hidden = false;
}

function hideInsufflations() {
  insuff.hidden = true;
}

function reset() {
  compressions = 0;
  insufflations = 0;
  cycles = 0;
  phase = "compressions";
  running = true;
  defibPause = false;
  updateDisplay();
  hideInsufflations();
  lastTime = 0;
  requestAnimationFrame(loop);
}

function loop(timestamp) {
  if (!running) return;

  if (!lastTime) lastTime = timestamp;
  let elapsed = timestamp - lastTime;

  if (defibPause) {
    lastTime = timestamp;
    requestAnimationFrame(loop);
    return;
  }

  if (phase === "compressions") {
    if (elapsed >= compressionInterval) {
      compressions++;
      bip.currentTime = 0;
      bip.play();
      updateDisplay();

      lastTime = timestamp;

      const maxComp = (type === "adulte") ? 30 : 15;
      if (compressions >= maxComp) {
        phase = "insufflations";
        insufflations = 0;
        insufflationTimer = 0;
        showInsufflations();
      }
    }
  } else if (phase === "insufflations") {
    insufflationTimer += elapsed;
    lastTime = timestamp;

    if (insufflationTimer >= 4000 && insufflations < 1) {
      insufflations = 1;
      updateDisplay();
    }
    if (insufflationTimer >= 8000) {
      insufflations = 2;
      updateDisplay();
      hideInsufflations();
      cycles++;
      compressions = 0;
      insufflations = 0;
      phase = "compressions";
      updateDisplay();
    }
  }

  requestAnimationFrame(loop);
}

select.onchange = () => {
  type = select.value;
  console.log(`Changement de type de victime : ${type}`);
  reset();
};

stopBtn.onclick = () => {
  console.log("Bouton STOP cliqué");
  running = false;
  hideInsufflations();
  reprendreBtn.hidden = false;
};

reprendreBtn.onclick = () => {
  console.log("Bouton REPRENDRE cliqué");
  running = true;
  stopBtn.hidden = false;
  reprendreBtn.hidden = true;
  requestAnimationFrame(loop);
};

defibBtn.onclick = () => {
  console.log("Bouton DÉFIBRILLATEUR cliqué");
  defibPause = true;
  setTimeout(() => {
    defibPause = false;
    lastTime = performance.now();
    requestAnimationFrame(loop);
  }, 5000);
};

document.getElementById("formee").onclick = () => {
  console.log("Bouton FORMÉ cliqué");
  formé = true;
  accueilDiv.hidden = true;
  simulationDiv.hidden = false;
  reset();
};

document.getElementById("nonFormee").onclick = () => {
  console.log("Bouton NON FORMÉ cliqué");
  alert("Veuillez alerter les secours ou chercher une assistance.");
};
