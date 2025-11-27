import { closeModal } from "./app.js";
import { createParticipantsForm } from "./forms.js";

export function setupGame(sessionForm) {
  sessionForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const jsonInput = document.getElementById("jsonFile");
    const error = document.getElementById("jsonError");

    error.textContent = "";
    error.classList.remove("visible");

    const file = jsonInput.files[0];

    if (!file) {
      error.textContent = "Veuillez renseigner un fichier JSON.";
      error.classList.add("visible");
      return;
    }

    let data;
    try {
      const text = await file.text();
      data = JSON.parse(text);

      if (!data.backlog) {
        error.textContent = "Le JSON ne contient pas le champ 'backlog'.";
        error.classList.add("visible");
        return;
      }

      console.log("JSON importé :", data);
      localStorage.setItem("backlog", JSON.stringify(data.backlog));
    } catch (err) {
      error.textContent = "JSON invalide : " + err.message;
      error.classList.add("visible");
      return;
    }

    const num = parseInt(document.getElementById("participants").value);
    const participantsForm = createParticipantsForm(num, sessionForm);
    const sessionName = document.getElementById("sessionName").value;
    const rule = document.getElementById("rule").value;
    localStorage.setItem("sessionName", sessionName);
    localStorage.setItem("rule", rule);

    sessionForm.replaceWith(participantsForm);
  });
}

export function submitParticipants(e, numParticipants) {
  e.preventDefault();

  const participants = [];
  for (let i = 1; i <= numParticipants; i++) {
    participants.push(document.getElementById(`participant${i}`).value.trim());
  }

  console.log("Participants :", participants);

  localStorage.setItem("participants", JSON.stringify(participants));

  closeModal();

  document.location.href = "./views/game.html";
}
