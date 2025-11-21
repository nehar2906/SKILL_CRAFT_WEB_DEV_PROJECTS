let timerDisplay = document.getElementById("timer");
let startBtn = document.getElementById("startBtn");
let pauseBtn = document.getElementById("pauseBtn");
let resetBtn = document.getElementById("resetBtn");
let lapBtn = document.getElementById("lapBtn");
let lapsList = document.getElementById("lapsList");

let startTime = 0;
let elapsedTime = 0;
let timerInterval;
let isRunning = false;
let lapCount = 0;
let body = document.body;

// Format time with milliseconds
function formatTime(ms) {
  let totalSeconds = Math.floor(ms / 1000);
  let hours = Math.floor(totalSeconds / 3600);
  let minutes = Math.floor((totalSeconds % 3600) / 60);
  let seconds = totalSeconds % 60;
  let milliseconds = Math.floor((ms % 1000) / 10);

  return (
    String(hours).padStart(2, "0") +
    ":" +
    String(minutes).padStart(2, "0") +
    ":" +
    String(seconds).padStart(2, "0") +
    ":" +
    String(milliseconds).padStart(2, "0")
  );
}

// Start button
startBtn.addEventListener("click", function () {
  if (!isRunning) {
    isRunning = true;
    startTime = Date.now() - elapsedTime;
    timerInterval = setInterval(() => {
      elapsedTime = Date.now() - startTime;
      timerDisplay.textContent = formatTime(elapsedTime);
    }, 10); // update every 10ms for milliseconds

    startBtn.disabled = true;
    pauseBtn.disabled = false;
    resetBtn.disabled = false;
    lapBtn.disabled = false;

    body.className = "green-bg"; // 🌿 Start
  }
});

// Pause button
pauseBtn.addEventListener("click", function () {
  if (isRunning) {
    clearInterval(timerInterval);
    isRunning = false;
    pauseBtn.textContent = "Resume";
    body.className = "blue-bg"; // 💙 Pause
  } else {
    isRunning = true;
    startTime = Date.now() - elapsedTime;
    timerInterval = setInterval(() => {
      elapsedTime = Date.now() - startTime;
      timerDisplay.textContent = formatTime(elapsedTime);
    }, 10);
    pauseBtn.textContent = "Pause";
    body.className = "green-bg"; // Resume
  }
});

// Reset button
resetBtn.addEventListener("click", function () {
  clearInterval(timerInterval);
  isRunning = false;
  elapsedTime = 0;
  lapCount = 0;
  timerDisplay.textContent = "00:00:00:00";
  lapsList.innerHTML = "";
  pauseBtn.textContent = "Pause";

  startBtn.disabled = false;
  pauseBtn.disabled = true;
  resetBtn.disabled = true;
  lapBtn.disabled = true;

  body.className = "orange-bg"; // 🟠 Reset
});

// Lap button
lapBtn.addEventListener("click", function () {
  if (isRunning) {
    lapCount++;
    let li = document.createElement("li");
    li.textContent = `Lap ${lapCount}: ${timerDisplay.textContent}`;
    lapsList.appendChild(li);

    // Background based on lap number 🎨
    switch (lapCount) {
      case 1:
        body.className = "purple-bg"; break;
      case 2:
        body.className = "pink-bg"; break;
      case 3:
        body.className = "red-bg"; break;
      case 4:
        body.className = "yellow-bg"; break;
      case 5:
        body.className = "sea-blue-bg"; break;
      case 6:
        body.className = "turquoise-bg"; break;
      case 7:
        body.className = "deep-red-bg"; break;
      case 8:
        body.className = "golden-bg"; break;
      case 9:
        body.className = "black-grey-bg"; break;
      case 10:
        body.className = "orange-bg"; break; // loop back to start
      default:
        body.className = "orange-bg";
    }
  }
});
