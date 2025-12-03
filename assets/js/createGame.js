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

  localStorage.setItem("participants", JSON.stringify(participants));

  closeModal();

  document.location.href = "./views/game.html";
}

export function resumeGame(resumeForm) {
  resumeForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const jsonInput = document.getElementById("resumeJsonFile");
    const error = document.getElementById("resumeJsonError");

    if (error) {
      error.textContent = "";
      error.classList.remove("visible");
    }

    const file = jsonInput.files[0];

    if (!file) {
      if (error) {
        error.textContent = "Veuillez renseigner un fichier JSON de sauvegarde.";
        error.classList.add("visible");
      }
      return;
    }

    let data;
    try {
      const text = await file.text();
      data = JSON.parse(text);

      if (!data.backlog || !data.participants || !data.rule || !data.sessionName) {
        if (error) {
          error.textContent = "Fichier JSON invalide. Il doit contenir 'backlog', 'participants', 'rule' et 'sessionName'.";
          error.classList.add("visible");
        }
        return;
      }
      
      let votedResults = data.backlog
        .filter(story => story.etat === "estimée")
        .map(story => ({
          story: {
            id: story.id,
            titre: story.titre,
            description: story.description,
            priorite: story.priorite,
            etat: story.etat
          },
          value: story.estimation,
          rule: story.ruleUtilisee,
          nbrTours: story.nombreTours
        }));

      const lastResultIndex = votedResults.length - 1;
      if (lastResultIndex >= 0 && votedResults[lastResultIndex].value === "cafe") {
          votedResults.pop();
      }
      
      const startIndex = votedResults.length;

      localStorage.setItem("sessionName", data.sessionName);
      localStorage.setItem("rule", data.rule);
      localStorage.setItem("participants", JSON.stringify(data.participants));
      localStorage.setItem("backlog", JSON.stringify(data.backlog)); 
      localStorage.setItem("results", JSON.stringify(votedResults)); 
      localStorage.setItem("currentStoryIndex", startIndex);

      document.location.href = "./views/game.html";

    } catch (err) {
      if (error) {
        error.textContent = "JSON invalide : " + err.message;
        error.classList.add("visible");
      }
      return;
    }
  });
}