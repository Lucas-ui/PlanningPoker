window.addEventListener("DOMContentLoaded", () => {
  const backlog = JSON.parse(localStorage.getItem("backlog"));
  const participants = JSON.parse(localStorage.getItem("participants"));

  const firstStory = backlog[0];
  document.getElementById("storyTitle").textContent = firstStory.titre;
  document.getElementById("storyDescription").textContent =
    firstStory.description;
  document.getElementById("storyPriority").textContent = firstStory.priorite;

  const participantDisplay = document.getElementById("currentParticipant");
  const wrapper = document.getElementById("cardsWrapper");
  let currentIndex = 0;
  const votes = [];
  let votingOver = false;

  function showParticipant(index) {
    participantDisplay.textContent = participants[index];
  }
  showParticipant(currentIndex);

  const resultsBtn = document.createElement("button");
  resultsBtn.textContent = "Afficher les résultats";
  resultsBtn.classList.add("btn-primary");
  resultsBtn.style.display = "none";
  resultsBtn.style.marginTop = "20px";
  wrapper.parentNode.appendChild(resultsBtn);

  resultsBtn.addEventListener("click", () => {
    wrapper.style.display = "none";
    participantDisplay.parentNode.style.display = "none";

    const resultsContainer = document.createElement("div");
    resultsContainer.classList.add("story-card");
    resultsContainer.style.flexDirection = "column";
    resultsContainer.innerHTML = `<h2>Résultats des votes</h2>`;

    votes.forEach((v) => {
      const voteDiv = document.createElement("div");
      voteDiv.style.display = "flex";
      voteDiv.style.alignItems = "center";
      voteDiv.style.gap = "10px";
      voteDiv.style.marginBottom = "10px";

      const cardDiv = document.createElement("div");
      cardDiv.classList.add("results-card");
      cardDiv.innerHTML = `<img src="../assets/images/cartes/${v.vote}.svg" alt="Carte ${v.vote}">`;

      voteDiv.innerHTML = `<span style="flex:1">${v.participant}</span>`;
      voteDiv.appendChild(cardDiv);

      resultsContainer.appendChild(voteDiv);
    });

    document.querySelector("main").appendChild(resultsContainer);
    resultsBtn.style.display = "none";
  });

  const cards = [
    "cartes_0.svg",
    "cartes_1.svg",
    "cartes_2.svg",
    "cartes_3.svg",
    "cartes_5.svg",
    "cartes_8.svg",
    "cartes_13.svg",
    "cartes_20.svg",
    "cartes_40.svg",
    "cartes_100.svg",
    "cartes_interro.svg",
    "cartes_cafe.svg",
  ];

  wrapper.innerHTML = "";

  cards.forEach((cardFile) => {
    const div = document.createElement("div");
    div.classList.add("card");
    div.dataset.value = cardFile.replace(".svg", "");

    div.innerHTML = `<img src="../assets/images/cartes/${cardFile}" alt="Carte ${div.dataset.value}">`;

    div.addEventListener("click", () => {
      if (votingOver) return;

      votes.push({
        participant: participants[currentIndex],
        vote: div.dataset.value,
      });

      currentIndex++;
      if (currentIndex < participants.length) {
        showParticipant(currentIndex);
      } else {
        votingOver = true;
        resultsBtn.style.display = "inline-block";
      }
    });

    wrapper.appendChild(div);
  });
});
