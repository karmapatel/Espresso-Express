/* ========================================================================= */
/* HUD COMPONENT (HEADS-UP DISPLAY)                                          */
/* ========================================================================= */

export function renderHUD(state = {}) {
  const cashStr = state.cash !== undefined 
    ? (typeof state.cash === 'number' ? `$${state.cash.toFixed(2)}` : state.cash) 
    : "$142.00";
  const chaos = state.chaosLevel !== undefined ? Math.min(100, Math.max(0, state.chaosLevel)) : 10;
  const combo = state.comboStreak || 0;

  return `
    <div class="game-hud-bar" id="gameHudBar">
      <!-- Left: Station Service Indicator (Permanent, Non-Lagging) -->
      <div class="hud-train-alert" id="hudTrainAlert" title="Platform Open - Commuters wait permanently">
        <span class="relative flex h-2 w-2 items-center justify-center">
          <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span class="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
        </span>
        <span class="hud-platform-tag pixel-font">PLATFORM 4</span>
        <span class="hud-status-badge">OPEN SERVICE</span>
      </div>

      <!-- Right Group: Cash, Calm/Vibe Meter, Pause Button -->
      <div class="hud-right-group">
        <!-- Cash Counter -->
        <div class="game-pill pill-coin" style="padding: 3px 8px; font-size: 11px; font-weight: 900;">
          <div class="pill-coin-icon">¢</div>
          <span id="hudCashAmount" style="font-family: var(--font-numeric);">${cashStr}</span>
        </div>

        <!-- Chaos / Calm Meter -->
        <div class="hud-chaos-box" title="Station Calmness: ${100 - chaos}%">
          <span class="hud-vibe-label pixel-font">${chaos > 50 ? 'CHAOS' : 'CALM'}</span>
          <div class="hud-chaos-track">
            <div class="hud-chaos-fill ${chaos > 50 ? 'bg-rose-500' : 'bg-emerald-400'}" id="hudChaosFill" style="width: ${chaos}%;"></div>
          </div>
        </div>

        <!-- Pause / Menu Button (Always fully visible with generous margins) -->
        <button class="hud-pause-btn" id="hudPauseBtn" title="Pause Shift / Menu" aria-label="Pause Menu">
          ❚❚
        </button>
      </div>
    </div>
  `;
}
