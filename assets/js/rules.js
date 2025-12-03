function getAllVoteValues(votes) {
  return votes.map(v => v.vote.replace("cartes_", ""));
}

function getNumericValuesFromVotes(votes) {
  return getAllVoteValues(votes)
    .filter(v => !isNaN(Number(v)))
    .map(Number);
}

function countVotes(voteValues) {
  const counts = {};
  voteValues.forEach(v => counts[v] = (counts[v] || 0) + 1);
  return counts;
}

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

export function checkRule(votes, rule, firstRound) {
  const allVoteValues = getAllVoteValues(votes);
  const numericVotes = getNumericValuesFromVotes(votes);

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