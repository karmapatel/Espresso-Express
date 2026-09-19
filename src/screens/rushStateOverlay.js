/* ========================================================================= */
/* RUSH STATE OVERLAYS (PREPARATION PHASE & ACTIVE RUSH OVERDRIVE)           */
/* ========================================================================= */

export function renderRushBanner(isRushActive = false) {
  if (isRushActive) {
    return `
      <div id="rushStateBanner" class="rush-banner active" style="position: absolute; top: 38px; left: 8px; right: 8px; z-index: 60; pointer-events: none; animation: screenEnter 0.2s ease;">
        <div style="background: linear-gradient(90deg, #991b1b 0%, #b91c1c 50%, #991b1b 100%); border: 2.5px solid #facc15; border-radius: 10px; padding: 4px 10px; box-shadow: 0 4px 15px rgba(220, 38, 38, 0.7); display: flex; align-items: center; justify-content: space-between;">
          <div style="display: flex; align-items: center; gap: 6px;">
            <span style="font-size: 14px;" class="animate-bounce">🚨</span>
            <div>
              <div class="pixel-font" style="font-size: 8.5px; color: #fef08a; letter-spacing: 0.5px;">RUSH HOUR OVERDRIVE!</div>
              <div style="font-size: 7px; color: #fee2e2; font-weight: 800;">Double Commuter Wave • 1.5x Tips Active</div>
            </div>
          </div>
          <span class="game-pill pill-coin" style="padding: 2px 6px; font-size: 8px;">+50% TIPS</span>
        </div>
      </div>
    `;
  }

  // Relaxed Open Service status banner
  return `
    <div id="rushStateBanner" class="rush-banner prep" style="position: absolute; top: 38px; left: 8px; right: 8px; z-index: 60; pointer-events: none; animation: screenEnter 0.2s ease;">
      <div style="background: rgba(30, 27, 46, 0.95); border: 2px solid #38bdf8; border-radius: 10px; padding: 3px 10px; box-shadow: 0 4px 12px rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: space-between; backdrop-filter: blur(4px);">
        <div style="display: flex; align-items: center; gap: 6px;">
          <span style="font-size: 12px;">☕</span>
          <div>
            <div class="pixel-font" style="font-size: 8px; color: #7dd3fc;">COMMUTER PLATFORM OPEN</div>
            <div style="font-size: 6.5px; color: #cbd5e1; font-weight: 700;">Commuters wait patiently • Tap tickets to target recipes</div>
          </div>
        </div>
        <span style="font-size: 7px; color: #a7f3d0; font-weight: 900;" class="pixel-font">READY TO BREW</span>
      </div>
    </div>
  `;
}
