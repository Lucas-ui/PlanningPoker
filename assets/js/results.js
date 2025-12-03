const results = JSON.parse(localStorage.getItem("results")) || [];

function createResultsTable() {
  if (results.length === 0) {
    return `
      <div class="empty-state">
        <h2>Aucun résultat disponible</h2>
        <p>Vous n'avez pas encore effectué de vote.</p>
      </div>
    `;
  }

  return `
    <table class="results-table" cellspacing="0" cellpadding="8">
      <thead>
        <tr>
          <th>User Story</th>
          <th>Résultats</th>
          <th>Règle</th>
          <th>Tours</th>
        </tr>
      </thead>
      <tbody>
        ${results.map(result => `
          <tr>
            <td class="story-title">${result.story.titre}</td>
            <td class="vote-value">${result.value}</td>
            <td>${result.rule}</td>
            <td>${result.nbrTours}</td>
          </tr>
        `).join('')}
      </tbody>
    </table>
  `;
}

function exportToJSON() {
  const dataStr = JSON.stringify(results, null, 2);
  const dataBlob = new Blob([dataStr], { type: "application/json" });
  
  const link = document.createElement("a");
  link.href = URL.createObjectURL(dataBlob);
  link.download = `planning-poker-results-${new Date().toISOString().split('T')[0]}.json`;
  link.click();
  
  URL.revokeObjectURL(link.href);
}

function goHome() {  
    localStorage.removeItem("sessionName");
    localStorage.removeItem("results");
    localStorage.removeItem("backlog");
    localStorage.removeItem("participants");
    localStorage.removeItem("rule");
  
  window.location.href = "../index.html";
}

document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("resultsContent").innerHTML = createResultsTable();
    document.getElementById("exportBtn").addEventListener("click", exportToJSON);
  document.getElementById("homeBtn").addEventListener("click", goHome);
});