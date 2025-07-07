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
  let elapsed = timestamp - lastTime;

  if (defibPause) {
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
        insufflationTimer = 0;
        showPopup();
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
      hidePopup();
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
  hidePopup();
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
  alert("Le mode assisté est désactivé.");
};

reset();