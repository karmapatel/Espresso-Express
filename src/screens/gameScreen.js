/* ========================================================================= */
/* MAIN GAMEPLAY SCREEN                                                      */
/* ========================================================================= */

import { renderHUD } from '../components/hud.js';
import { renderSubwayWorld } from '../components/subwayWorld.js';
import { renderCustomerQueue } from '../components/customerQueue.js';
import { renderCounterTop } from '../components/counterTop.js';
import { renderWorkstation } from '../components/workstation.js';
import { renderRushBanner } from './rushStateOverlay.js';
import { MOCK_ORDERS } from '../data/mockData.js';

export function renderGameScreen(gameState = {}) {
  const isRush = gameState.isRushActive || false;
  const heldItem = gameState.heldItem || "Double Shot Portafilter";

  return `
    <div class="game-scene-container screen-animate-in" id="gameScene">
      <!-- LAYER 0: MINIMAL IN-GAME HUD -->
      ${renderHUD(gameState)}

      <!-- LAYER 0.5: RUSH STATE BANNER -->
      ${renderRushBanner(isRush)}

      <!-- LAYER 1: DEEP SUBWAY PLATFORM & ROLLING COMMUTER TRAIN -->
      ${renderSubwayWorld()}

      <!-- MIDDLE CONTENT CONTAINER -->
      <div style="position: relative; width: 100%; z-index: 20; display: flex; flex-direction: column; justify-content: flex-end; margin-top: 105px;">
        <!-- LAYER 2: WAITING COMMUTER CHARACTERS & TICKETS -->
        ${renderCustomerQueue(MOCK_ORDERS)}

        <!-- LAYER 3: SERVING COUNTER TOP & ORDER TICKET RAILS -->
        ${renderCounterTop(MOCK_ORDERS)}
      </div>

      <!-- LAYER 4: INTERACTIVE WORKSTATION (5 STATIONS & PLAYER BARISTA TRAY) -->
      ${renderWorkstation(heldItem)}
    </div>
  `;
}
