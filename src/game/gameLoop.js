/* ========================================================================= */
/* ESPRESSO EXPRESS REAL-TIME GAME LOOP & SIMULATION ENGINE                  */
/* ========================================================================= */

import { gameState } from './gameState.js';
import { generateCustomerOrder } from './recipeSystem.js';
import { audioSystem } from './audioSystem.js';

class GameLoop {
  constructor() {
    this.timerInterval = null;
    this.lastTickTime = 0;
    this.onTickCallbacks = new Set();
  }

  start() {
    this.stop();
    this.lastTickTime = Date.now();
    this.timerInterval = setInterval(() => this.tick(), 1000);
  }

  stop() {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
      this.timerInterval = null;
    }
  }

  onTick(cb) {
    this.onTickCallbacks.add(cb);
    return () => this.onTickCallbacks.delete(cb);
  }

  tick() {
    if (!gameState.shift.active || gameState.shift.paused) return;

    const shift = gameState.shift;

    // Shifts and customers are not time-bound
    // Commuters wait permanently until served

    // Chaos meter slow decay/growth based on spills and waiting line
    if (gameState.workbench.hasSpill) {
      shift.chaosLevel = Math.min(100, shift.chaosLevel + 1);
    }

    // Ensure queue always maintains customers (up to 3)
    if (shift.activeOrders.length < 3) {
      shift.activeOrders.push(generateCustomerOrder({ isRush: false }));
      shift.totalCustomers += 1;
      if (!shift.selectedOrderId) {
        shift.selectedOrderId = shift.activeOrders[0]?.id || null;
      }
      gameState.notify('order_spawned', shift);
    }

    // Notify listeners / UI
    gameState.notify('game_tick', {
      remainingTime: null,
      trainTimer: null,
      isRushActive: false,
      chaosLevel: shift.chaosLevel,
      activeOrders: shift.activeOrders
    });

    this.onTickCallbacks.forEach(cb => {
      try {
        cb(shift);
      } catch (e) {
        console.error("onTick error:", e);
      }
    });
  }
}

export const gameLoop = new GameLoop();
