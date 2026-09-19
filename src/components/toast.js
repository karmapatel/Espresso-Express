/* ========================================================================= */
/* IN-GAME FLOATING TOAST SYSTEM                                             */
/* ========================================================================= */

export function showToast(message, icon = '☕') {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = 'game-toast';
  toast.innerHTML = `
    <span style="font-size: 14px;">${icon}</span>
    <span>${message}</span>
  `;

  container.appendChild(toast);

  // Auto clean up after animation finishes
  setTimeout(() => {
    if (toast.parentNode) {
      toast.parentNode.removeChild(toast);
    }
  }, 1600);
}
