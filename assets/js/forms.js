import { submitParticipants } from "./createGame.js";

export function createParticipantsForm(numParticipants, sessionForm) {
  const form = document.createElement("form");
  form.id = "participantsForm";

  let html = `<p>Veuillez entrer le nom de chaque participant :</p>`;
  for (let i = 1; i <= numParticipants; i++) {
    html += `
      <label for="participant${i}">Participant ${i}</label>
      <input type="text" id="participant${i}" name="participant${i}" placeholder="Nom ${i}" required />`;
  }

  html += `
    <div class="form-actions">
      <button type="button" id="backToSessionForm" class="btn-secondary">Retour</button>
      <button type="submit" class="btn-primary">Démarrer la session</button>
    </div>
  `;

  form.innerHTML = html;

  form.querySelector("#backToSessionForm").addEventListener("click", () => {
    form.replaceWith(sessionForm);
  });

  form.addEventListener("submit", (e) =>
    submitParticipants(e, numParticipants)
  );

  return form;
}
