export function openModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.style.display = "flex";
  }
}

export function closeModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.style.display = "none";
  }
}

window.addEventListener("click", (e) => {
  const setupModal = document.getElementById("setupModal");
  const resumeModal = document.getElementById("resumeModal");

  if (e.target === setupModal) closeModal("setupModal");
  if (e.target === resumeModal) closeModal("resumeModal");
});
