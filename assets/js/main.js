import { openModal, closeModal } from "./app.js";
import { setupGame, resumeGame } from "./createGame.js";

function init() {
  document
    .getElementById("openModal")
    .addEventListener("click", () => openModal("setupModal"));
  document
    .getElementById("closeModal")
    .addEventListener("click", () => closeModal("setupModal"));

  document
    .getElementById("resumeBtn")
    .addEventListener("click", () => openModal("resumeModal"));
  document
    .getElementById("closeResumeModal")
    .addEventListener("click", () => closeModal("resumeModal"));

  const sessionForm = document.getElementById("sessionForm");
  setupGame(sessionForm);

  const resumeForm = document.getElementById("resumeForm");
  resumeGame(resumeForm);
}

init();
