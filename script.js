/* Birthday story interactions — vanilla JavaScript */
const scenes = [...document.querySelectorAll(".scene")];
const currentSceneLabel = document.getElementById("currentScene");
const progressFill = document.getElementById("progressFill");
const gameFeedback = document.getElementById("gameFeedback");
const dateOptions = document.getElementById("dateOptions");
const calendarDays = document.getElementById("calendarDays");
const calendarFeedback = document.getElementById("calendarFeedback");
const calendarNext = document.getElementById("calendarNext");
let activeScene = 0;
let lockUnlocked = false;
let birthdaySelected = false;

function showScene(sceneIndex) {
  if (sceneIndex < 0 || sceneIndex >= scenes.length) return;
  if (sceneIndex > 1 && !lockUnlocked) return;
  scenes.forEach((scene, index) => {
    const isActive = index === sceneIndex;
    scene.hidden = !isActive;
    scene.classList.toggle("active", isActive);
  });
  activeScene = sceneIndex;
  currentSceneLabel.textContent = String(sceneIndex + 1).padStart(2, "0");
  progressFill.style.width = `${((sceneIndex + 1) / scenes.length) * 100}%`;
  window.scrollTo({ top: 0, behavior: "smooth" });
}

document.querySelectorAll("[data-next]").forEach(button => {
  button.addEventListener("click", () => showScene(activeScene + 1));
});
document.querySelectorAll("[data-back]").forEach(button => {
  button.addEventListener("click", () => showScene(activeScene - 1));
});

dateOptions.addEventListener("click", event => {
  const selected = event.target.closest(".date-option");
  if (!selected || lockUnlocked) return;
  dateOptions.querySelectorAll(".date-option").forEach(option => option.classList.remove("wrong", "correct"));
  if (selected.textContent.trim() === "151225") {
    selected.classList.add("correct");
    lockUnlocked = true;
    gameFeedback.textContent = "Kunci terbuka! A little surprise is waiting for you 🤎";
    gameFeedback.style.color = "#6d7655";
    window.setTimeout(() => showScene(2), 1050);
  } else {
    selected.classList.add("wrong");
    gameFeedback.textContent = "Kunci Salah! Coba Lagi 🤎";
    gameFeedback.style.color = "#a65e4d";
  }
});

// November 2001 starts on Thursday (Monday-first calendar).
function buildNovemberCalendar() {
  const daysInMonth = 30;
  const mondayFirstOffset = 3; // Thu: Mon=0, Tue=1, Wed=2, Thu=3
  for (let blank = 0; blank < mondayFirstOffset; blank++) {
    const emptyCell = document.createElement("span");
    emptyCell.className = "calendar-day empty";
    calendarDays.appendChild(emptyCell);
  }
  for (let day = 1; day <= daysInMonth; day++) {
    const dayButton = document.createElement("button");
    dayButton.type = "button";
    dayButton.className = `calendar-day${day === 7 ? " birthday-date" : ""}`;
    dayButton.textContent = day;
    dayButton.style.setProperty("--delay", `${(day - 1) * 24}ms`);
    dayButton.setAttribute("aria-label", `${day} November 2001`);
    if (day === 7) {
      dayButton.addEventListener("click", () => {
        birthdaySelected = true;
        dayButton.classList.add("selected");
        calendarFeedback.textContent = "7 November 2001 — The day my favorite person was born 🤎";
        calendarNext.disabled = false;
      });
    } else {
      dayButton.addEventListener("click", () => {
        calendarFeedback.textContent = "Tanggal yang istimewa ada di dekat sana. Coba lihat lagi 🤎";
      });
    }
    calendarDays.appendChild(dayButton);
  }
}
buildNovemberCalendar();

document.getElementById("restartButton").addEventListener("click", () => {
  birthdaySelected = false;
  calendarNext.disabled = true;
  calendarFeedback.textContent = "Sentuh tanggal yang diberi tanda hati.";
  showScene(0);
});

// Music is optional. Add assets/birthday-music.mp3 to enable this control.
const music = document.getElementById("backgroundMusic");
const musicToggle = document.getElementById("musicToggle");
const musicLabel = document.getElementById("musicLabel");
let musicEnabled = false;
musicToggle.addEventListener("click", async () => {
  if (!musicEnabled) {
    try {
      await music.play();
      musicEnabled = true;
      musicLabel.textContent = "Music on";
      musicToggle.setAttribute("aria-pressed", "true");
    } catch (error) {
      musicLabel.textContent = "Add music file";
      musicToggle.setAttribute("aria-pressed", "false");
    }
  } else {
    music.pause();
    musicEnabled = false;
    musicLabel.textContent = "Music off";
    musicToggle.setAttribute("aria-pressed", "false");
  }
});
music.addEventListener("error", () => {
  if (!musicEnabled) musicLabel.textContent = "Music off";
});

showScene(0);
