/**
 * Extrait toutes les valeurs de vote d'un tableau de votes
 *
 * @param {Array<Object>} votes - Liste des votes, chaque vote contient une propriété 'vote'
 * @returns {Array<string>} Liste des valeurs de vote nettoyées
 */
function getAllVoteValues(votes) {
  return votes.map(v => v.vote.replace("cartes_", ""));
}

/**
 * Extrait uniquement les valeurs de vote numériques d'un tableau de votes et les retourne sous forme de nombres
 * Les votes spéciaux ('cafe', 'interro') sont exclus
 *
 * @param {Array<Object>} votes - Liste des votes
 * @returns {Array<number>} Liste des valeurs de vote numériques
 */
function getNumericValuesFromVotes(votes) {
  return getAllVoteValues(votes)
    .filter(v => !isNaN(Number(v)))
    .map(Number);
}

/**
 * Compte la fréquence de chaque valeur de vote dans un tableau de valeurs
 *
 * @param {Array<string>} voteValues - Liste des valeurs de vote
 * @returns {Object<string, number>} Un objet où la clé est la valeur du vote et la valeur est le nombre d'occurrences
 */
function countVotes(voteValues) {
  const counts = {};
  voteValues.forEach(v => counts[v] = (counts[v] || 0) + 1);
  return counts;
}

/**
 * Calcule la valeur finale d'estimation basée sur la règle sélectionnée
 *
 * @param {Array<Object>} votes - Liste des votes enregistrés
 * @param {string} rule - La règle d'estimation à appliquer
 * @param {boolean} firstRound - Indique s'il s'agit du premier tour (où l'unanimité est forcée)
 * @returns {(number|string|null)} La valeur d'estimation finale
 */
export function calculateFinalValue(votes, rule, firstRound) {
  const allVoteValues = getAllVoteValues(votes);
  const numericVotes = getNumericValuesFromVotes(votes);

  if (allVoteValues.length === 0) return null;

   if (firstRound || rule === "unanimite") {
    return allVoteValues[0]; 
  }

  if (numericVotes.length === 0) {
      const allCounts = countVotes(allVoteValues);
      const mostVoted = Object.entries(allCounts).sort((a, b) => b[1] - a[1])[0];
      return mostVoted[0]; 
  }
  
  switch (rule) {
    case "moyenne":
      const avg = numericVotes.reduce((a, b) => a + b, 0) / numericVotes.length;
      return Math.round(avg);

    case "mediane":
      const sorted = [...numericVotes].sort((a, b) => a - b);
      const mid = Math.floor(sorted.length / 2);
      const median = sorted.length % 2 
        ? sorted[mid] 
        : (sorted[mid - 1] + sorted[mid]) / 2;
      return Math.round(median);

    case "majoriteAbsolue":
    case "majoriteRelative":
      const allCounts = countVotes(allVoteValues);
      const mostVoted = Object.entries(allCounts).sort((a, b) => b[1] - a[1])[0];
      return mostVoted[0];

    default:
      return allVoteValues[0];
  }
}

/**
 * Vérifie si la règle sélectionnée est atteinte par le set de votes
 *
 * @param {Array<Object>} votes - Liste des votes enregistrés
 * @param {string} rule - La règle d'estimation à vérifier
 * @param {boolean} firstRound - Indique s'il s'agit du premier tour (où l'unanimité est forcée)
 * @returns {boolean} Vrai si la règle est atteinte, Faux sinon
 */
export function checkRule(votes, rule, firstRound) {
  const allVoteValues = getAllVoteValues(votes);

  if (allVoteValues.length === 0) return false;

  const firstVote = allVoteValues[0];

  if (firstRound || rule === "unanimite") {
    return allVoteValues.every(v => v === firstVote);
  }

  switch (rule) {
    case "moyenne":
    case "mediane":
      return true;

    case "majoriteAbsolue":
      const allCounts = countVotes(allVoteValues);
      const maxCount = Math.max(...Object.values(allCounts));
      return maxCount > allVoteValues.length / 2;

    case "majoriteRelative":
      return true;

    default:
      return false;
  }
}