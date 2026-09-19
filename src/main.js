/* ========================================================================= */
/* ESPRESSO EXPRESS APP BOOTSTRAP                                            */
/* ========================================================================= */

import { navigation } from './navigation.js';

// Initialize the screen router on DOM Ready
document.addEventListener('DOMContentLoaded', () => {
  navigation.init();

  // Android Status Bar Clock Loop
  const clockEl = document.getElementById('statusClock');
  const updateClock = () => {
    const now = new Date();
    const hours = now.getHours();
    const mins = now.getMinutes();
    if (clockEl) {
      clockEl.innerText = `${hours % 12 || 12}:${mins < 10 ? '0' : ''}${mins}`;
    }
  };
  updateClock();
  setInterval(updateClock, 10000);

  // Train countdown simulation loop for Game Screen HUD
  let trainSeconds = 14;
  setInterval(() => {
    const timerEl = document.getElementById('hudTrainTimer');
    if (timerEl) {
      if (trainSeconds > 0) {
        trainSeconds--;
      } else {
        trainSeconds = 25; // Loop next commuter train
      }
      timerEl.innerText = `0:${trainSeconds < 10 ? '0' : ''}${trainSeconds}s`;
    }
  }, 1000);
});
