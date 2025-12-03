import { openModal, closeModal } from "./app.js";
import { setupGame, resumeGame } from "./createGame.js";

/**
 * Initialise l'application : configure les écouteurs d'événements
 * pour l'ouverture/fermeture des modals de configuration et de reprise de session
 *
 * @returns {void}
 */
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

/**
 * Lance la fonction d'initialisation au chargement du script
 * @returns {void}
 */
init();
