/* ========================================================================= */
/* MAIN MENU SCREEN                                                          */
/* ========================================================================= */

export function renderMainMenu() {
  return `
    <div class="main-menu-container screen-animate-in" style="position: relative; width: 100%; height: 100%; display: flex; flex-direction: column; justify-content: space-between; padding: 20px 16px; background: radial-gradient(circle at 50% 25%, #2a1f47 0%, #17122b 55%, #0d0a19 100%); overflow-y: auto;">

      <!-- Subway Ambient Lights & Overhead Rails in Menu -->
      <div style="position: absolute; top: 0; left: 0; right: 0; height: 120px; background: linear-gradient(180deg, rgba(245, 158, 11, 0.08) 0%, transparent 100%); pointer-events: none;"></div>

      <!-- Top Player Profile & Currency Bar -->
      <div style="display: flex; align-items: center; justify-content: space-between; z-index: 10;">
        <!-- Player Level Badge -->
        <div style="display: flex; align-items: center; gap: 8px; background: rgba(25, 20, 42, 0.9); border: 2px solid #4a3a78; border-radius: 999px; padding: 3px 10px;">
          <div style="width: 22px; height: 22px; background: #047857; border: 1.5px solid #34d399; border-radius: 50%; color: #fff; font-size: 9px; font-weight: 900; display: flex; align-items: center; justify-content: center;">
            ★
          </div>
          <div style="display: flex; flex-direction: column;">
            <span class="pixel-font" style="font-size: 8px; color: #fef08a;">LVL 4 BARISTA</span>
            <span style="font-size: 7px; color: #94a3b8; font-weight: 800;">PLATFORM 9 KIOSK</span>
          </div>
        </div>

        <!-- Coins & Subway Tokens -->
        <div style="display: flex; align-items: center; gap: 6px;">
          <div class="game-pill pill-coin">
            <div class="pill-coin-icon">¢</div>
            <span>$437</span>
          </div>
          <div class="game-pill pill-token">
            <div class="pill-token-icon">T</div>
            <span>12</span>
          </div>
        </div>
      </div>

      <!-- Game Title Branding & Visual Centerpiece -->
      <div style="display: flex; flex-direction: column; align-items: center; text-align: center; margin: 15px 0; z-index: 10;">
        <!-- Neon Subway Pill -->
        <div style="display: flex; align-items: center; gap: 6px; background: #090c16; border: 2px solid #38bdf8; border-radius: 999px; padding: 3px 12px; margin-bottom: 8px; box-shadow: 0 0 15px rgba(56, 189, 248, 0.4);">
          <span style="width: 7px; height: 7px; background: #38bdf8; border-radius: 50%;" class="anim-pulse"></span>
          <span class="pixel-font" style="font-size: 8.5px; color: #bae6fd; letter-spacing: 1px;">MTA GRAND CENTRAL LINE</span>
        </div>

        <!-- Animated Logo Emblem -->
        <div style="position: relative; margin-bottom: 8px;">
          <!-- Steaming Cup Graphic -->
          <div style="width: 68px; height: 56px; background: linear-gradient(180deg, #fcd34d 0%, #f59e0b 50%, #b45309 100%); border: 3.5px solid #1a162b; border-radius: 0 0 20px 20px; box-shadow: 0 6px 0 #100d1c, 0 10px 20px rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; position: relative;" class="anim-bounce">
            <!-- Cup Handle -->
            <div style="position: absolute; right: -16px; top: 10px; width: 18px; height: 26px; border: 3.5px solid #1a162b; border-left: none; border-radius: 0 12px 12px 0; background: #f59e0b;"></div>
            <!-- Logo Icon Inside -->
            <span style="font-size: 26px;">☕</span>
            <!-- Rising Steam -->
            <div style="position: absolute; top: -14px; left: 16px; width: 8px; height: 14px; background: rgba(255,255,255,0.7); border-radius: 50%; pointer-events: none;" class="anim-steam-1"></div>
            <div style="position: absolute; top: -16px; right: 18px; width: 7px; height: 12px; background: rgba(255,255,255,0.6); border-radius: 50%; pointer-events: none;" class="anim-steam-2"></div>
          </div>
        </div>

        <!-- Big Bold Title Typography -->
        <h1 class="pixel-font" style="font-size: 28px; line-height: 1; margin: 4px 0 2px 0; color: #fef08a; text-shadow: 0 4px 0 #78350f, 0 6px 12px rgba(0,0,0,0.6); letter-spacing: 1px;">
          ESPRESSO
        </h1>
        <div class="pixel-font" style="font-size: 22px; line-height: 1; color: #38bdf8; text-shadow: 0 3px 0 #0369a1, 0 6px 12px rgba(0,0,0,0.6); letter-spacing: 2px;">
          EXPRESS
        </div>
        <p style="font-size: 10px; font-weight: 800; color: #cbd5e1; margin-top: 6px; letter-spacing: 0.5px;">
          THE SUBWAY RUSH HOUR BARISTA ARCADE
        </p>
      </div>

      <!-- Menu Action Navigation Buttons -->
      <div style="display: flex; flex-direction: column; gap: 10px; width: 100%; max-width: 280px; margin: 0 auto; z-index: 10;">
        <!-- Primary Action: Start Shift / Play -->
        <button class="game-btn game-btn-amber anim-pulse" id="btnMenuPlay" style="width: 100%; font-size: 14px; padding: 12px; border-radius: 14px;">
          <span style="font-size: 16px;">⚡</span>
          <span>START SHIFT (PLAY)</span>
        </button>

        <!-- Upgrades & Shop -->
        <button class="game-btn game-btn-purple" id="btnMenuUpgrades" style="width: 100%; font-size: 11px; padding: 10px;">
          <span style="font-size: 14px;">⚙️</span>
          <span>STATION UPGRADES</span>
        </button>

        <!-- Shift Results -->
        <button class="game-btn game-btn-emerald" id="btnMenuResults" style="width: 100%; font-size: 11px; padding: 10px;">
          <span style="font-size: 14px;">📊</span>
          <span>LAST SHIFT RESULTS</span>
        </button>

        <!-- Settings & Audio -->
        <button class="game-btn game-btn-metal" id="btnMenuSettings" style="width: 100%; font-size: 11px; padding: 10px;">
          <span style="font-size: 14px;">⚙</span>
          <span>SETTINGS & AUDIO</span>
        </button>
      </div>

      <!-- Footer Badge -->
      <div style="text-align: center; margin-top: 15px; font-size: 8px; color: #64748b; font-weight: 700; z-index: 10;">
        STAGE 1 VISUAL UI BUILD • ESPRESSO EXPRESS
      </div>
    </div>
  `;
}
