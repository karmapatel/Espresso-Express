/* ========================================================================= */
/* HUD COMPONENT (HEADS-UP DISPLAY)                                          */
/* ========================================================================= */

export function renderHUD(state) {
  return `
    <div class="game-hud-bar">
      <!-- Next Train Arrival Alert -->
      <div class="hud-train-alert" id="hudTrainAlert">
        <div class="relative flex h-2.5 w-2.5 items-center justify-center">
          <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
          <span class="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
        </div>
        <span class="text-[9px] font-black text-amber-300 tracking-wider pixel-font">EXPRESS #4:</span>
        <span class="hud-train-timer" id="hudTrainTimer">0:14s</span>
        <span class="text-[7.5px] font-extrabold text-amber-200 uppercase tracking-tight hidden sm:inline" id="rushBadge">RUSH</span>
      </div>

      <!-- Center Combo Pill -->
      <div class="game-pill pill-token" id="hudComboPill" style="padding: 2px 7px; font-size: 9.5px;">
        <span class="animate-bounce">🔥</span>
        <span>x3 COMBO</span>
      </div>

      <!-- Right Group: Cash, Chaos Gauge, Pause -->
      <div class="hud-right-group">
        <!-- Cash Counter -->
        <div class="game-pill pill-coin" style="padding: 2px 8px; font-size: 11px;">
          <div class="pill-coin-icon">¢</div>
          <span id="hudCashAmount">$142</span>
        </div>

        <!-- Chaos Meter -->
        <div class="hud-chaos-box">
          <span class="text-[7px] font-black text-orange-400 pixel-font">HEAT</span>
          <div class="hud-chaos-track">
            <div class="hud-chaos-fill"></div>
          </div>
        </div>

        <!-- Pause / Menu Button -->
        <button class="hud-pause-btn" id="hudPauseBtn" title="Pause Game / Menu" aria-label="Pause Menu">
          ❚❚
        </button>
      </div>
    </div>
  `;
}
