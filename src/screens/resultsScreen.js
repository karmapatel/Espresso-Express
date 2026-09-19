/* ========================================================================= */
/* RESULTS / SHIFT COMPLETE SCREEN                                           */
/* ========================================================================= */

import { MOCK_SHIFT_RESULTS } from '../data/mockData.js';

export function renderResultsScreen(results = MOCK_SHIFT_RESULTS) {
  return `
    <div class="results-screen-container screen-animate-in" style="position: relative; width: 100%; height: 100%; display: flex; flex-direction: column; background: radial-gradient(circle at 50% 20%, #2a1f47 0%, #151026 60%, #0c0916 100%); overflow-y: auto; padding: 14px;">

      <!-- Top Navigation Header -->
      <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 10px;">
        <button class="screen-back-btn" id="btnResultsBack" title="Back to Main Menu">←</button>
        <div class="pixel-font" style="font-size: 13px; color: #fef08a;">SHIFT #${results.shiftNumber} SUMMARY</div>
        <div style="width: 36px;"></div> <!-- Spacer -->
      </div>

      <!-- Title & 3 Golden Coffee Bean Rating -->
      <div style="display: flex; flex-direction: column; align-items: center; text-align: center; margin-bottom: 12px;">
        <h2 class="pixel-font" style="font-size: 20px; color: #fef08a; text-shadow: 0 3px 0 #78350f; margin: 0 0 4px 0;">
          SHIFT COMPLETE! 🚆
        </h2>
        <span style="font-size: 9px; color: #94a3b8; font-weight: 700;">${results.shiftTitle}</span>

        <!-- 3 Golden Coffee Beans Rating -->
        <div style="display: flex; gap: 10px; margin: 10px 0;">
          <div style="width: 36px; height: 36px; background: #f59e0b; border: 3px solid #78350f; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 18px; box-shadow: 0 4px 0 #3b1803, 0 0 15px #f59e0b; animation: starReveal 0.4s ease forwards;">
            ☕
          </div>
          <div style="width: 36px; height: 36px; background: #f59e0b; border: 3px solid #78350f; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 18px; box-shadow: 0 4px 0 #3b1803, 0 0 15px #f59e0b; animation: starReveal 0.4s ease 0.15s forwards;">
            ☕
          </div>
          <div style="width: 36px; height: 36px; background: #f59e0b; border: 3px solid #78350f; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 18px; box-shadow: 0 4px 0 #3b1803, 0 0 15px #f59e0b; animation: starReveal 0.4s ease 0.3s forwards;">
            ☕
          </div>
        </div>

        <!-- Grade Badge -->
        <div style="display: inline-flex; align-items: center; gap: 6px; background: #1b152e; border: 2px solid #eab308; border-radius: 999px; padding: 2px 12px; box-shadow: 0 0 10px rgba(234, 179, 8, 0.4);">
          <span class="pixel-font" style="font-size: 11px; color: #fef08a;">PERFORMANCE: GRADE ${results.grade}</span>
        </div>
      </div>

      <!-- Performance Stats Grid -->
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 6px; margin-bottom: 10px;">
        <div style="background: #1e1933; border: 2px solid #332857; border-radius: 10px; padding: 8px 10px;">
          <div style="font-size: 7.5px; color: #94a3b8; font-weight: 800; text-transform: uppercase;">Served Commuters</div>
          <div style="font-size: 14px; font-weight: 900; color: #38bdf8; font-family: var(--font-numeric);">${results.customersServed} / ${results.totalCustomers}</div>
        </div>

        <div style="background: #1e1933; border: 2px solid #332857; border-radius: 10px; padding: 8px 10px;">
          <div style="font-size: 7.5px; color: #94a3b8; font-weight: 800; text-transform: uppercase;">Accuracy Score</div>
          <div style="font-size: 14px; font-weight: 900; color: #34d399; font-family: var(--font-numeric);">${results.perfectPercentage} Perfect</div>
        </div>

        <div style="background: #1e1933; border: 2px solid #332857; border-radius: 10px; padding: 8px 10px;">
          <div style="font-size: 7.5px; color: #94a3b8; font-weight: 800; text-transform: uppercase;">Max Combo</div>
          <div style="font-size: 14px; font-weight: 900; color: #f59e0b; font-family: var(--font-numeric);">${results.longestCombo}x Rush Streak</div>
        </div>

        <div style="background: #1e1933; border: 2px solid #332857; border-radius: 10px; padding: 8px 10px;">
          <div style="font-size: 7.5px; color: #94a3b8; font-weight: 800; text-transform: uppercase;">Missed Trains</div>
          <div style="font-size: 14px; font-weight: 900; color: #f43f5e; font-family: var(--font-numeric);">${results.missedTrains} Late Cups</div>
        </div>
      </div>

      <!-- Financial Breakdown Card -->
      <div style="background: #1a142c; border: 2.5px solid #2f2352; border-radius: 12px; padding: 10px 12px; margin-bottom: 12px; box-shadow: var(--game-shadow-sm);">
        <div style="font-size: 8px; font-weight: 900; color: #cbd5e1; text-transform: uppercase; margin-bottom: 8px; letter-spacing: 0.5px;">
          💰 Shift Earnings Statement:
        </div>

        <div style="display: flex; flex-direction: column; gap: 5px; font-size: 10px; font-weight: 700;">
          <div style="display: flex; justify-content: space-between; color: #cbd5e1;">
            <span>MTA Kiosk Base Shift Pay:</span>
            <span style="font-family: var(--font-numeric); font-weight: 900; color: #f8fafc;">$${results.basePay.toFixed(2)}</span>
          </div>
          <div style="display: flex; justify-content: space-between; color: #cbd5e1;">
            <span>Commuter Tips & Rush Gratuity:</span>
            <span style="font-family: var(--font-numeric); font-weight: 900; color: #34d399;">+$${results.tipsEarned.toFixed(2)}</span>
          </div>
          <div style="display: flex; justify-content: space-between; color: #cbd5e1;">
            <span>Rush Hour Streak Bonus:</span>
            <span style="font-family: var(--font-numeric); font-weight: 900; color: #fbbf24;">+$${results.rushBonus.toFixed(2)}</span>
          </div>

          <div style="border-top: 1.5px dashed #473a70; margin-top: 4px; padding-top: 6px; display: flex; justify-content: space-between; align-items: center;">
            <span class="pixel-font" style="font-size: 11px; color: #fef08a;">TOTAL EARNED:</span>
            <div style="display: flex; align-items: center; gap: 8px;">
              <span class="pixel-font" style="font-size: 16px; color: #facc15;">$${results.totalEarned.toFixed(2)}</span>
              <span class="game-pill pill-token" style="padding: 1px 6px; font-size: 8.5px;">+${results.tokensAwarded} T</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Action Navigation Buttons -->
      <div style="display: flex; flex-direction: column; gap: 8px; margin-top: auto;">
        <button class="game-btn game-btn-amber" id="btnResultsClaimNext" style="width: 100%; font-size: 12px; padding: 11px;">
          <span>⚡</span>
          <span>CLAIM & NEXT SHIFT</span>
        </button>

        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px;">
          <button class="game-btn game-btn-purple" id="btnResultsUpgrades" style="padding: 8px; font-size: 9.5px;">
            <span>🛒</span>
            <span>UPGRADES</span>
          </button>
          <button class="game-btn game-btn-metal" id="btnResultsMenu" style="padding: 8px; font-size: 9.5px;">
            <span>🏠</span>
            <span>MAIN MENU</span>
          </button>
        </div>
      </div>

    </div>
  `;
}
