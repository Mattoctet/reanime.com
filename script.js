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

const accueilDiv = document.getElementById("accueil");
const simulationDiv = document.getElementById("simulation");

let lastTime = 0;
const compressionInterval = 545;
let phase = "compressions";
let insufflationTimer = 0;

function updateDisplay() {
  compteur.textContent = `Comp : ${compressions}`;
  insuff.textContent = `Insufflations : ${insufflations}`;
  cycleDisplay.textContent = `Cycles : ${cycles}`;
}

function showInsufflations() {
  insufflations.hidden = false;
}

function hideInsufflations() {
  insufflations.hidden = true;
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
  reset();
};

stopBtn.onclick = () => {
  running = false;
  hideInsufflations();
};

defibBtn.onclick = () => {
  defibPause = true;
  setTimeout(() => {
    defibPause = false;
    lastTime = performance.now();
    requestAnimationFrame(loop);
  }, 5000);
};

document.getElementById("formee").onclick = () => {
  formé = true;
  accueilDiv.hidden = true;
  simulationDiv.hidden = false;
  reset();
};

document.getElementById("nonFormee").onclick = () => {
  alert("Veuillez alerter les secours ou chercher une assistance.");
};
