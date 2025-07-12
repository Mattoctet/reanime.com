let type = "adulte";
let compressions = 0;
let insufflations = 0;
let cycles = 0;
let running = true;
let defibPause = false;
let formé = false;
let roleForme = ""; // "civil", "medi", "secu"

const select = document.getElementById("typeVictime");
const compteur = document.getElementById("compteurCompression");
const insuff = document.getElementById("insufflationsCount");
const insuffMsg = document.getElementById("insufflationsMsg");
const cycleDisplay = document.getElementById("cycles");
const bip = document.getElementById("bip");

const stopBtn = document.getElementById("stop");
const defibBtn = document.getElementById("defib");
const reprendreBtn = document.getElementById("reprendre");

const accueilDiv = document.getElementById("accueil");
const simulationDiv = document.getElementById("simulation");

const btnCivil = document.getElementById("civil");
const btnMedi = document.getElementById("medi");
const btnSecu = document.getElementById("secu");
const btnNonFormee = document.getElementById("nonFormee");

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
  insuffMsg.hidden = false;
}

function hideInsufflations() {
  insuffMsg.hidden = true;
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
  console.log("Simulation réinitialisée");
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
      console.log(`Compression ${compressions}`);
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
        console.log("Passage aux insufflations");
      }
    }
  } else if (phase === "insufflations") {
    insufflationTimer += elapsed;
    lastTime = timestamp;

    if (insufflationTimer >= 4000 && insufflations < 1) {
      insufflations = 1;
      console.log("Première insufflation");
      updateDisplay();
    }
    if (insufflationTimer >= 8000) {
      insufflations = 2;
      console.log("Deuxième insufflation");
      updateDisplay();
      hideInsufflations();
      cycles++;
      compressions = 0;
      insufflations = 0;
      phase = "compressions";
      updateDisplay();
      console.log(`Cycle ${cycles} terminé`);
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
  console.log("Bouton STOP (button-rouge) cliqué");
  running = false;
  hideInsufflations();
  reprendreBtn.hidden = false;
};

reprendreBtn.onclick = () => {
  console.log("Bouton REPRENDRE (button-vert) cliqué");
  running = true;
  stopBtn.hidden = false;
  reprendreBtn.hidden = true;
  requestAnimationFrame(loop);
};

defibBtn.onclick = () => {
  console.log("Bouton DÉFIBRILLATEUR (button-gris) cliqué");
  defibPause = true;
  setTimeout(() => {
    defibPause = false;
    lastTime = performance.now();
    requestAnimationFrame(loop);
    console.log("Fin de la pause défibrillateur");
  }, 5000);
};

// Gestion des boutons formés
btnCivil.onclick = () => {
  roleForme = "civil";
  console.log("Bouton Civil (button-vert) cliqué valeur variable : " + roleForme);
  formé = true;
  accueilDiv.hidden = true;
  simulationDiv.hidden = false;
  reset();
};

btnMedi.onclick = () => {
  roleForme = "medi";
  console.log("Bouton Corps Médical (button-gris) cliqué valeur variable : " + roleForme);
  formé = true;
  accueilDiv.hidden = true;
  simulationDiv.hidden = false;
  reset();
};

btnSecu.onclick = () => {
  roleForme = "secu";
  console.log("Bouton Secouriste (button-gris) cliqué valeur variable : " + roleForme);
  formé = true;
  accueilDiv.hidden = true;
  simulationDiv.hidden = false;
  reset();
};

btnNonFormee.onclick = () => {
  roleForme = "civilNonFormee";
  formé = true;
  console.log("Bouton NON FORMÉ (button-rouge) cliqué valeur variable : " + roleForme);
  alert("Veuillez alerter les secours ou chercher une assistance.");
  accueilDiv.hidden = true;
  simulationDiv.hidden = false;
  reset();
};
