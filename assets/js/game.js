import { checkRule, calculateFinalValue } from "./rules.js";

const state = {
  backlog: JSON.parse(localStorage.getItem("backlog")),
  participants: JSON.parse(localStorage.getItem("participants")),
  rule: localStorage.getItem("rule"),
  currentStoryIndex: parseInt(localStorage.getItem("currentStoryIndex") || 0),
  currentIndex: 0,
  votes: [],
  votingOver: false,
  nbrTour: 1,
  results: JSON.parse(localStorage.getItem("results")) || [],
};

const CARDS = [
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

function displayStory(story) {
  document.getElementById("storyTitle").textContent = story.titre;
  document.getElementById("storyDescription").textContent = story.description;
  document.getElementById("storyPriority").textContent = story.priorite;
}

function showParticipant(index) {
  document.getElementById("currentParticipant").textContent =
    state.participants[index];
}

function createCard(cardFile) {
  const div = document.createElement("div");
  div.classList.add("card");
  div.dataset.value = cardFile.replace(".svg", "");
  div.innerHTML = `<img src="../assets/images/cartes/${cardFile}" alt="Carte ${div.dataset.value}">`;

  div.addEventListener("click", () => handleCardClick(div.dataset.value));

  return div;
}

function renderCards() {
  const wrapper = document.getElementById("cardsWrapper");
  wrapper.innerHTML = "";
  CARDS.forEach((cardFile) => wrapper.appendChild(createCard(cardFile)));
}

function handleCardClick(cardValue) {
  if (state.votingOver) return;

  state.votes.push({
    participant: state.participants[state.currentIndex],
    vote: cardValue,
  });

  state.currentIndex++;

  if (state.currentIndex < state.participants.length) {
    showParticipant(state.currentIndex);
  } else {
    state.votingOver = true;
    document.getElementById("resultsBtn").style.display = "inline-block";
  }
}

function resetVoting() {
  state.votes = [];
  state.currentIndex = 0;
  state.votingOver = false;
  state.nbrTour++;

  showParticipant(0);
  document.getElementById("resultsBtn").style.display = "none";
  document.getElementById("cardsWrapper").style.display = "flex";
  document.getElementById("currentParticipant").parentNode.style.display =
    "block";
}

function takeBreakAndExport() {
  const storyResults = state.backlog.map((story, index) => {
    const result = state.results.find((r) => r.story.id === story.id);

    if (result) {
      return {
        ...story,
        estimation: result.value,
        ruleUtilisee: result.rule,
        nombreTours: result.nbrTours,
        etat: "estimée",
      };
    }

    return {
      ...story,
      etat: "non_estimée",
      estimation: null,
      ruleUtilisee: null,
      nombreTours: 0,
    };
  });

  const exportData = {
    sessionName: localStorage.getItem("sessionName"),
    participants: state.participants,
    rule: localStorage.getItem("rule"),
    backlog: storyResults,
  };

  const dataStr = JSON.stringify(exportData, null, 2);
  const dataBlob = new Blob([dataStr], { type: "application/json" });

  const link = document.createElement("a");
  link.href = URL.createObjectURL(dataBlob);
  link.download = `planning-poker-break-results-${
    new Date().toISOString().split("T")[0]
  }.json`;
  link.click();

  URL.revokeObjectURL(link.href);

  localStorage.removeItem("sessionName");
  localStorage.removeItem("results");
  localStorage.removeItem("backlog");
  localStorage.removeItem("participants");
  localStorage.removeItem("rule");

  window.location.href = "../index.html";
}

function saveResultAndNext() {
  const currentStory = state.backlog[state.currentStoryIndex];
  const finalValue = calculateFinalValue(
    state.votes,
    state.rule,
    state.nbrTour === 1
  );

  state.results.push({
    story: currentStory,
    value: finalValue,
    rule: state.nbrTour === 1 ? "unanimite" : state.rule,
    nbrTours: state.nbrTour,
  });

  localStorage.setItem("results", JSON.stringify(state.results));

  if (finalValue === "cafe") {
    takeBreakAndExport();
    return;
  }

  state.currentStoryIndex++;

  if (state.currentStoryIndex < state.backlog.length) {
    document.querySelector(".story-card:last-child").remove();
    state.votes = [];
    state.currentIndex = 0;
    state.votingOver = false;
    state.nbrTour = 1;

    displayStory(state.backlog[state.currentStoryIndex]);
    showParticipant(0);
    document.getElementById("resultsBtn").style.display = "none";
    document.getElementById("cardsWrapper").style.display = "flex";
    document.getElementById("currentParticipant").parentNode.style.display =
      "block";
  } else {
    window.location.href = "results.html";
  }
}

function createVoteDisplay(vote) {
  const voteDiv = document.createElement("div");
  voteDiv.style.cssText =
    "display:flex; align-items:center; gap:10px; margin-bottom:10px";

  const cardDiv = document.createElement("div");
  cardDiv.classList.add("results-card");
  cardDiv.innerHTML = `<img src="../assets/images/cartes/${vote.vote}.svg" alt="Carte ${vote.vote}">`;

  voteDiv.innerHTML = `<span style="flex:1">${vote.participant}</span>`;
  voteDiv.appendChild(cardDiv);

  return voteDiv;
}

function createRuleInfo() {
  const ruleInfo = document.createElement("p");
  const currentRule =
    state.nbrTour === 1 ? "Unanimité obligatoire (1er tour)" : state.rule;
  ruleInfo.innerHTML = `Règle actuelle : ${currentRule}<br><p>Tour actuel : ${state.nbrTour}</p>`;
  return ruleInfo;
}

function createRuleStatus(ruleReached) {
  const status = document.createElement("p");
  status.style.marginTop = "20px";
  const color = ruleReached ? "green" : "red";
  const message = ruleReached
    ? "La règle est atteinte !"
    : "La règle n'est pas atteinte !";
  status.innerHTML = `<p style="color:${color}">${message}</p>`;
  return status;
}

function createActionButton(ruleReached, finalValue) {
  const btn = document.createElement("button");
  btn.classList.add("btn-primary");
  btn.style.marginTop = "20px";

  if (ruleReached) {
    if (finalValue === "cafe") {
      btn.textContent = "Prendre une pause (Export & Quitter)";
      btn.addEventListener("click", saveResultAndNext);
    } else {
      btn.textContent = "Suivant";
      btn.addEventListener("click", saveResultAndNext);
    }
  } else {
    btn.textContent = "Refaire un vote";
    btn.addEventListener("click", () => {
      document.querySelector(".story-card:last-child").remove();
      resetVoting();
    });
  }

  return btn;
}

function showResults() {
  document.getElementById("cardsWrapper").style.display = "none";
  document.getElementById("currentParticipant").parentNode.style.display =
    "none";

  const resultsContainer = document.createElement("div");
  resultsContainer.classList.add("story-card");
  resultsContainer.style.flexDirection = "column";
  resultsContainer.innerHTML = `<h2>Résultats des votes</h2>`;

  resultsContainer.appendChild(createRuleInfo());
  state.votes.forEach((vote) =>
    resultsContainer.appendChild(createVoteDisplay(vote))
  );

  const ruleReached = checkRule(state.votes, state.rule, state.nbrTour === 1);
  resultsContainer.appendChild(createRuleStatus(ruleReached));

  let finalValue = null;
  if (ruleReached) {
    finalValue = calculateFinalValue(
      state.votes,
      state.rule,
      state.nbrTour === 1
    );
  }

  resultsContainer.appendChild(createActionButton(ruleReached, finalValue));

  document.querySelector("main").appendChild(resultsContainer);
  document.getElementById("resultsBtn").style.display = "none";
}

function createResultsButton() {
  const btn = document.createElement("button");
  btn.id = "resultsBtn";
  btn.textContent = "Afficher les résultats";
  btn.classList.add("btn-primary");
  btn.style.display = "none";
  btn.style.marginTop = "20px";
  btn.addEventListener("click", showResults);

  document.getElementById("cardsWrapper").parentNode.appendChild(btn);
}

function init() {
  displayStory(state.backlog[state.currentStoryIndex]);
  showParticipant(0);
  renderCards();
  createResultsButton();
}

window.addEventListener("DOMContentLoaded", init);
