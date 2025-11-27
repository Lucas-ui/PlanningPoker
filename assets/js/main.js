import { openModal, closeModal } from "./app.js";
import { setupGame } from "./createGame.js";

function init() {
  document.getElementById("openModal").addEventListener("click", openModal);
  document.getElementById("closeModal").addEventListener("click", closeModal);

  const sessionForm = document.getElementById("sessionForm");
  setupGame(sessionForm);
}

init();
