import { checkRule, calculateFinalValue } from "./rules.js";

/**
 * Objet global gérant l'état actuel de la partie de Planning Poker
 *
 * @type {Object}
 * @property {Array<Object>} backlog - La liste des User Stories à estimer
 * @property {Array<string>} participants - La liste des noms des participants
 * @property {string} rule - La règle de consensus sélectionnée pour la session
 * @property {number} currentStoryIndex - L'index de l'User Story en cours de vote
 * @property {number} currentIndex - L'index du participant qui doit voter ensuite
 * @property {Array<Object>} votes - Les votes collectés pour l'User Story actuelle
 * @property {boolean} votingOver - Indique si tous les participants ont voté pour le tour actuel
 * @property {number} nbrTour - Le numéro du tour de vote pour l'User Story actuelle
 * @property {Array<Object>} results - Les résultats des User Stories déjà estimées
 */
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

/**
 * Liste des noms de fichiers des cartes de vote disponibles
 * @type {Array<string>}
 */
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

/**
 * Met à jour l'affichage de l'User Story actuelle
 *
 * @param {Object} story - L'objet User Story à afficher
 * @returns {void}
 */
function displayStory(story) {
  document.getElementById("storyTitle").textContent = story.titre;
  document.getElementById("storyDescription").textContent = story.description;
  document.getElementById("storyPriority").textContent = story.priorite;
}

/**
 * Affiche le nom du participant qui doit voter actuellement
 *
 * @param {number} index - L'index du participant dans la liste des participants
 * @returns {void}
 */
function showParticipant(index) {
  document.getElementById("currentParticipant").textContent =
    state.participants[index];
}

/**
 * Crée un élément représentant une carte de vote
 *
 * @param {string} cardFile - Le nom du fichier SVG de la carte
 * @returns {HTMLDivElement} L'élément DOM de la carte
 */
function createCard(cardFile) {
  const div = document.createElement("div");
  div.classList.add("card");
  div.dataset.value = cardFile.replace(".svg", "");
  div.innerHTML = `<img src="../assets/images/cartes/${cardFile}" alt="Carte ${div.dataset.value}">`;

  div.addEventListener("click", () => handleCardClick(div.dataset.value));

  return div;
}

/**
 * Rend toutes les cartes de vote disponibles dans le wrapper du DOM
 * @returns {void}
 */
function renderCards() {
  const wrapper = document.getElementById("cardsWrapper");
  wrapper.innerHTML = "";
  CARDS.forEach((cardFile) => wrapper.appendChild(createCard(cardFile)));
}

/**
 * Gère le clic d'une carte par un participant. Enregistre le vote et passe au participant suivant.
 * Si tous ont voté, affiche le bouton de résultats.
 *
 * @param {string} cardValue - La valeur de la carte cliquée
 * @returns {void}
 */
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

/**
 * Réinitialise l'état de vote pour permettre un nouveau tour de vote sur la même User Story
 * @returns {void}
 */
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

/**
 * Exporte l'état actuel du backlog (estimé et non estimé) dans un fichier JSON,
 * puis efface le localStorage et redirige vers la page d'accueil pour prendre une pause
 *
 * @returns {void}
 */
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

/**
 * Enregistre le résultat final du vote pour l'User Story actuelle et passe à la User Story suivante
 * ou redirige vers la page de résultats finaux
 *
 * @returns {void}
 */
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

/**
 * Crée l'élément DOM affichant le vote d'un participant après la révélation
 *
 * @param {Object} vote - L'objet vote contenant le nom du participant et sa carte votée
 * @returns {HTMLDivElement} L'élément DOM affichant le nom et la carte votée
 */
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

/**
 * Crée l'élément DOM affichant la règle de vote et le tour actuel
 *
 * @returns {HTMLParagraphElement} L'élément DOM d'information sur la règle
 */
function createRuleInfo() {
  const ruleInfo = document.createElement("p");
  const currentRule =
    state.nbrTour === 1 ? "Unanimité obligatoire (1er tour)" : state.rule;
  ruleInfo.innerHTML = `Règle actuelle : ${currentRule}<br><p>Tour actuel : ${state.nbrTour}</p>`;
  return ruleInfo;
}

/**
 * Crée l'élément DOM affichant si la règle a été atteinte
 *
 * @param {boolean} ruleReached - Vrai si la règle est atteinte, Faux sinon
 * @returns {HTMLParagraphElement} L'élément DOM de statut de la règle
 */
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

/**
 * Crée le bouton d'action en fonction du résultat et de la règle
 *
 * @param {boolean} ruleReached - Vrai si la règle est atteinte
 * @param {string} finalValue - La valeur d'estimation finale
 * @returns {HTMLButtonElement} Le bouton d'action approprié
 */
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

/**
 * Affiche les résultats après la fin du vote, montrant les votes et l'action suivante
 * @returns {void}
 */
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

/**
 * Crée et insère le bouton pour afficher les résultats une fois que tous les votes sont enregistrés
 * @returns {void}
 */
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

/**
 * Fonction d'initialisation appelée au chargement de la page de jeu
 * @returns {void}
 */
function init() {
  displayStory(state.backlog[state.currentStoryIndex]);
  showParticipant(0);
  renderCards();
  createResultsButton();
}

/**
 * Écouteur d'événement pour démarrer l'initialisation après le chargement complet du DOM
 * @event DOMContentLoaded
 */
window.addEventListener("DOMContentLoaded", init);
