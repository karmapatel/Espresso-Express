/* ========================================================================= */
/* MAIN GAMEPLAY SCREEN                                                      */
/* ========================================================================= */

import { renderHUD } from '../components/hud.js';
import { renderSubwayWorld } from '../components/subwayWorld.js';
import { renderCustomerQueue } from '../components/customerQueue.js';
import { renderWorkstation } from '../components/workstation.js';
import { MOCK_ORDERS } from '../data/mockData.js';

export function renderGameScreen(gameState = {}) {
  const heldItem = gameState.heldItem || "No Cup (Tap [S], [M], [L])";
  const orders = gameState.orders || MOCK_ORDERS;
  const selectedOrderId = gameState.selectedOrderId || (orders[0]?.id || null);
  const activeOrder = orders.find(o => o.id === Number(selectedOrderId)) || orders[0] || null;

  return `
    <div class="game-scene-container screen-animate-in" id="gameScene">
      <!-- LAYER 0: MINIMAL IN-GAME HUD -->
      ${renderHUD(gameState)}

      <!-- LAYER 1: DEEP SUBWAY PLATFORM & ROLLING COMMUTER TRAIN -->
      ${renderSubwayWorld()}

      <!-- MIDDLE CONTENT CONTAINER: WAITING COMMUTER CHARACTERS -->
      <div class="middle-game-container">
        <div id="customerQueueContainer">
          ${renderCustomerQueue(orders, selectedOrderId)}
        </div>
      </div>

      <!-- LAYER 2: INTERACTIVE WORKSTATION (5 STATIONS & PLAYER BARISTA TRAY) -->
      <div id="workstationContainer">
        ${renderWorkstation(heldItem, { activeOrder })}
      </div>
    </div>
  `;
}

