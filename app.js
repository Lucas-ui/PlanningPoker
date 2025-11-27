const openBtn = document.getElementById("openModal");
const closeBtn = document.getElementById("closeModal");
const modal = document.getElementById("setupModal");
const sessionForm = document.getElementById("sessionForm");

function openModal() {
  modal.style.display = "flex";
}

function closeModal() {
  modal.style.display = "none";
}

function createParticipantsForm(numParticipants) {
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

function submitParticipants(e, numParticipants) {
  e.preventDefault();

  const participants = [];
  for (let i = 1; i <= numParticipants; i++) {
    participants.push(document.getElementById(`participant${i}`).value.trim());
  }

  console.log("Participants :", participants);

  //stocker les participants dans la session ?
  //rediriger l'utilisateur vers la page html écran de vote

  closeModal();
}

openBtn.addEventListener("click", openModal);
closeBtn.addEventListener("click", closeModal);

window.addEventListener("click", (e) => {
  if (e.target === modal) closeModal();
});

sessionForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const numParticipants = parseInt(
    document.getElementById("participants").value
  );
  const participantsForm = createParticipantsForm(numParticipants);
  sessionForm.replaceWith(participantsForm);
});
