function getNumericVotes(votes) {
  return votes
    .map(v => v.vote.replace("cartes_", ""))
    .filter(v => !isNaN(Number(v)))
    .map(Number);
}

function countVotes(votes) {
  const counts = {};
  votes.forEach(v => counts[v] = (counts[v] || 0) + 1);
  return counts;
}

export function calculateFinalValue(votes, rule, firstRound) {
  const numericVotes = getNumericVotes(votes);
  
  if (numericVotes.length === 0) return null;

  const firstVote = numericVotes[0];

  if (firstRound || rule === "unanimite") {
    return firstVote;
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
      const counts = countVotes(numericVotes);
      const mostVoted = Object.entries(counts).sort((a, b) => b[1] - a[1])[0];
      return Number(mostVoted[0]);

    default:
      return firstVote;
  }
}

export function checkRule(votes, rule, firstRound) {
  const numericVotes = getNumericVotes(votes);

  if (numericVotes.length === 0) return false;

  const firstVote = numericVotes[0];

  if (firstRound) {
    return numericVotes.every(v => v === firstVote);
  }

  switch (rule) {
    case "unanimite":
      return numericVotes.every(v => v === firstVote);

    case "moyenne":
    case "mediane":
      return true;

    case "majoriteAbsolue":
      const counts = countVotes(numericVotes);
      const maxCount = Math.max(...Object.values(counts));
      return maxCount > numericVotes.length / 2;

    case "majoriteRelative":
      return true;

    default:
      return false;
  }
}