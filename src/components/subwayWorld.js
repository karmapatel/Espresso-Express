/* ========================================================================= */
/* SUBWAY WORLD BACKGROUND COMPONENT                                         */
/* ========================================================================= */

export function renderSubwayWorld() {
  return `
    <div class="subway-backdrop">
      <!-- Upper Vaulted Ceiling, Conduits, Direction Signs -->
      <div class="subway-upper-vault">
        <div class="subway-pipe-horiz"></div>
        <div class="subway-conduit"></div>

        <!-- Left Pendant Station Lamp -->
        <div class="subway-lamp" style="left: 28px;">
          <div class="subway-lamp-cord"></div>
          <div class="subway-lamp-hood"></div>
          <div class="subway-lamp-bulb"></div>
          <div class="subway-light-cone"></div>
        </div>

        <!-- Right Pendant Station Lamp -->
        <div class="subway-lamp" style="right: 36px;">
          <div class="subway-lamp-cord" style="height: 20px;"></div>
          <div class="subway-lamp-hood"></div>
          <div class="subway-lamp-bulb"></div>
          <div class="subway-light-cone"></div>
        </div>

        <!-- MTA Direction Signboard -->
        <div class="station-direction-sign">
          <div class="station-line-badge">A</div>
          <div>
            <div class="station-text-title">UPTOWN & BRONX</div>
            <div class="station-text-sub">42ND ST - GRAND SUBWAY DEPOT</div>
          </div>
          <span style="width: 6px; height: 6px; border-radius: 50%; background: #34d399; box-shadow: 0 0 6px #34d399;" class="anim-pulse"></span>
        </div>

        <!-- Flickering Poster Billboard -->
        <div class="subway-billboard anim-flicker">
          <div style="font-size: 6px; font-weight: 900; color: #f472b6; letter-spacing: 0.5px;">NEED FOCUS?</div>
          <div style="font-size: 8.5px; font-weight: 900; color: #fef08a; font-family: var(--font-arcade); line-height: 1;">ESPRESSO!</div>
          <div style="font-size: 5.5px; color: #cbd5e1; margin-top: 1px;">Platform 9 Kiosk</div>
        </div>
      </div>

      <!-- Subway Tracks & Arrived Commuter Train -->
      <div class="subway-track-area">
        <!-- Rails -->
        <div class="subway-rails">
          <div class="subway-rail-line"></div>
          <div class="subway-rail-line"></div>
        </div>

        <!-- Commuter Train (Dominant Background Entity) -->
        <div class="subway-train-car anim-train" id="subwayTrainBody">
          <!-- Top Yellow Belt -->
          <div class="train-yellow-stripe">
            <span class="train-stripe-text">MTA METRO COMMUTER EXPRESS</span>
            <span class="train-stripe-text">CAR #204</span>
          </div>

          <!-- Windows & Open Passenger Doorway -->
          <div class="train-window-row">
            <!-- Window 1 with commuter silhouettes -->
            <div class="train-window">
              <div class="train-window-glare"></div>
              <div class="commuter-silhouette">
                <div class="commuter-silhouette-head"></div>
              </div>
            </div>

            <!-- Active Open Doors with Rush Wave Indicator -->
            <div class="train-open-door">
              <div style="position: absolute; inset: 0; background: linear-gradient(180deg, rgba(251, 191, 36, 0.25) 0%, transparent 80%);"></div>
              <!-- Emerging Commuter Silhouettes -->
              <div style="display: flex; align-items: flex-end; gap: 2px;">
                <div style="width: 14px; height: 36px; background: #020617; border-top-left-radius: 8px; border-top-right-radius: 8px; position: relative;">
                  <div style="position: absolute; top: -8px; left: 50%; transform: translateX(-50%); width: 10px; height: 10px; background: #020617; border-radius: 50%;"></div>
                </div>
                <div style="width: 12px; height: 32px; background: #0f172a; border-top-left-radius: 6px; border-top-right-radius: 6px; position: relative;">
                  <div style="position: absolute; top: -7px; left: 50%; transform: translateX(-50%); width: 9px; height: 9px; background: #0f172a; border-radius: 50%;"></div>
                </div>
              </div>
              <div class="door-hazard-line"></div>
            </div>

            <!-- Window 2 with silhouettes -->
            <div class="train-window">
              <div class="train-window-glare"></div>
              <div class="commuter-silhouette" style="width: 16px; height: 28px;">
                <div class="commuter-silhouette-head" style="width: 12px; height: 12px; top: -7px;"></div>
              </div>
              <div class="commuter-silhouette" style="width: 18px; height: 34px; margin-left: -4px;">
                <div class="commuter-silhouette-head"></div>
              </div>
            </div>

            <!-- Window 3 -->
            <div class="train-window">
              <div class="train-window-glare"></div>
              <div class="commuter-silhouette" style="width: 15px; height: 30px;">
                <div class="commuter-silhouette-head" style="width: 11px; height: 11px; top: -6px;"></div>
              </div>
            </div>
          </div>

          <!-- Train Front Headlight Beam -->
          <div class="train-headlight"></div>
        </div>

        <!-- Platform Edge with Yellow Bumps -->
        <div class="platform-edge">
          <div class="tactile-bumps-strip">
            <span class="tactile-bump"></span>
            <span class="tactile-bump"></span>
            <span class="tactile-bump"></span>
            <span class="tactile-bump"></span>
            <span class="tactile-bump"></span>
            <span class="tactile-bump"></span>
            <span class="tactile-bump"></span>
            <span class="tactile-bump"></span>
            <span class="tactile-bump"></span>
            <span class="tactile-bump"></span>
            <span class="tactile-bump"></span>
            <span class="tactile-bump"></span>
          </div>
        </div>
      </div>
    </div>
  `;
}
