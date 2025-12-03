/**
 * Ouvre une modale en changeant son style d'affichage.
 *
 * @param {string} modalId L'id HTML de la modale à ouvrir
 * @returns {void}
 */
export function openModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.style.display = "flex";
  }
}

/**
 * Ferme une modale en masquant son style d'affichage.
 *
 * @param {string} modalId L'id HTML de la modale à fermer
 * @returns {void}
 */
export function closeModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.style.display = "none";
  }
}

/**
 * Ajoute un écouteur d'événement au clic sur la fenêtre.
 * Cette fonction permet de fermer les modals si l'utilisateur clique en dehors de la boîte de dialogue
 *
 * @event click
 * @param {Event} e L'objet événement du clic
 * @returns {void}
 */
window.addEventListener("click", (e) => {
  const setupModal = document.getElementById("setupModal");
  const resumeModal = document.getElementById("resumeModal");

  if (e.target === setupModal) closeModal("setupModal");
  if (e.target === resumeModal) closeModal("resumeModal");
});
