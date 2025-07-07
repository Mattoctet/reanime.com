// script.js

let type = "adulte";
let compressions = 0;
let insufflations = 0;
let cycles = 0;
let running = true;
let defibPause = false;
let interval;
let formé = false;

const select = document.getElementById("typeVictime");
const compteur = document.getElementById("compteurCompression");
const insuff = document.getElementById("insufflations");
const cycleDisplay = document.getElementById("cycles");
const popup = document.getElementById("popup");
const bip = document.getElementById("bip");

document.getElementById("formee").onclick = () => {
  formé = true;
  alert("Le mode assisté est désactivé.");
};

select.onchange = () => {
  type = select.value;
  reset();
};

document.getElementById("stop").onclick = () => {
  running = false;
  clearInterval(interval);
};

document.getElementById("defib").onclick = () => {
  defibPause = true;
  setTimeout(() => defibPause = false, 5000);
};

function reset() {
  compressions = 0;
  insufflations = 0;
  cycles = 0;
  updateDisplay();
  if (interval) clearInterval(interval);
  if (running) start();
}

function updateDisplay() {
  compteur.textContent = `Comp : ${compressions}`;
  insuff.textContent = `Insufflations : ${insufflations}`;
  cycleDisplay.textContent = `Cycles : ${cycles}`;
}

function start() {
  const max = type === "adulte" ? 30 : 15;

  interval = setInterval(() => {
    if (!running || defibPause) return;

    compressions++;
    bip.play();
    updateDisplay();

    if (compressions >= max) {
      showPopup();
      setTimeout(() => {
        hidePopup();
        insufflations += 2;
        compressions = 0;
        cycles++;
        updateDisplay();
      }, 1000);
    }
  }, 1000 / 110);
}

function showPopup() {
  popup.hidden = false;
}

function hidePopup() {
  popup.hidden = true;
}

start();