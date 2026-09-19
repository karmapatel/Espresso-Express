/* ========================================================================= */
/* WORKSTATION COMPONENT (5 COFFEE STATIONS & PLAYER BARISTA TRAY)           */
/* ========================================================================= */

export function renderWorkstation(heldItem = "Double Shot Portafilter") {
  return `
    <div class="workstation-container">
      <!-- 5 Equipment Stations Grid -->
      <div class="stations-grid">

        <!-- ======================================== -->
        <!-- STATION 1: BEAN HOPPER & BURR GRINDER    -->
        <!-- ======================================== -->
        <div class="station-cell" id="stationGrind">
          <span class="station-title" style="color: #fbbf24;">1. GRIND</span>

          <!-- Hopper with Beans -->
          <div class="grinder-hopper">
            <span class="coffee-bean-seed" style="transform: rotate(15deg);"></span>
            <span class="coffee-bean-seed" style="transform: rotate(-30deg);"></span>
            <span class="coffee-bean-seed" style="transform: rotate(45deg);"></span>
            <span class="coffee-bean-seed" style="transform: rotate(85deg);"></span>
            <span class="coffee-bean-seed" style="transform: rotate(-15deg);"></span>
            <span class="coffee-bean-seed" style="transform: rotate(60deg);"></span>
          </div>

          <!-- Base & Portafilter -->
          <div class="grinder-base-unit">
            <button class="game-btn game-btn-rose" id="btnGrindAction" style="padding: 2px 4px; font-size: 7px; min-height: 20px; width: 100%;">
              PUSH
            </button>
            <div class="portafilter-prop">
              <div style="width: 10px; height: 4px; background: #451a03; border-radius: 2px;"></div>
              <div class="portafilter-handle"></div>
            </div>
          </div>

          <span style="font-size: 6px; color: rgba(254, 243, 199, 0.6); font-weight: 800;">BURR</span>
        </div>

        <!-- ================================================== -->
        <!-- STATION 2: 2-GROUP COMMERCIAL ESPRESSO MACHINE     -->
        <!-- ================================================== -->
        <div class="station-cell espresso-machine-cell" id="stationEspresso">
          <!-- Active Steam Effects -->
          <div style="position: absolute; top: 1px; right: 4px; width: 14px; height: 14px; background: rgba(255,255,255,0.6); border-radius: 50%; pointer-events: none;" class="anim-steam-1"></div>
          <div style="position: absolute; top: 3px; left: 4px; width: 12px; height: 12px; background: rgba(255,255,255,0.5); border-radius: 50%; pointer-events: none;" class="anim-steam-2"></div>

          <div style="width: 100%; display: flex; align-items: center; justify-content: space-between; padding: 0 2px;">
            <span class="station-title" style="color: #fef08a;">2. BREW</span>
            <!-- Pressure Gauge -->
            <div class="pressure-gauge-dial" title="Pump Pressure: 9.2 Bar">
              <div class="gauge-pointer anim-needle"></div>
              <div style="width: 3px; height: 3px; background: #000; border-radius: 50%; position: absolute;"></div>
            </div>
          </div>

          <!-- Chrome Panel, Groups & Drip Tray -->
          <div style="width: 100%; background: linear-gradient(180deg, #94a3b8 0%, #475569 100%); border: 1.5px solid #0f172a; border-radius: 5px; padding: 2px; display: flex; flex-direction: column; align-items: center; gap: 2px;">
            <!-- LED Indicators -->
            <div style="display: flex; gap: 4px;">
              <span style="width: 4px; height: 4px; border-radius: 50%; background: #34d399; box-shadow: 0 0 3px #34d399;"></span>
              <span style="width: 4px; height: 4px; border-radius: 50%; background: #facc15;" class="animate-pulse"></span>
              <span style="width: 4px; height: 4px; border-radius: 50%; background: #ef4444;"></span>
            </div>

            <div class="machine-group-heads">
              <!-- Group 1 Pouring -->
              <div style="display: flex; flex-direction: column; align-items: center;">
                <div style="width: 10px; height: 6px; background: #1e293b; border-radius: 2px 2px 0 0;"></div>
                <div class="espresso-stream animate-pulse"></div>
                <div class="shot-glass">
                  <div class="shot-liquid"></div>
                </div>
              </div>
              <!-- Group 2 Steam Wand -->
              <div style="display: flex; flex-direction: column; align-items: center;">
                <div style="width: 10px; height: 6px; background: #1e293b; border-radius: 2px 2px 0 0;"></div>
                <div style="width: 2px; height: 8px; background: #cbd5e1; transform: rotate(15deg);"></div>
                <div style="width: 10px; height: 10px; background: #cbd5e1; border: 1px solid #475569; border-radius: 0 0 3px 3px;"></div>
              </div>
            </div>

            <!-- Drip Tray Grate -->
            <div style="width: 100%; height: 3px; background: #1e293b; border-radius: 1px; display: flex; justify-content: space-around;">
              <span style="width: 1px; height: 2px; background: #000;"></span>
              <span style="width: 1px; height: 2px; background: #000;"></span>
              <span style="width: 1px; height: 2px; background: #000;"></span>
            </div>
          </div>

          <button class="game-btn game-btn-amber" id="btnPullShotAction" style="padding: 2px 4px; font-size: 7px; min-height: 20px; width: 100%;">
            ⚡ PULL
          </button>
        </div>

        <!-- ============================================== -->
        <!-- STATION 3: MILK FRIDGE & STEAMING WAND         -->
        <!-- ============================================== -->
        <div class="station-cell" id="stationMilk">
          <span class="station-title" style="color: #38bdf8;">3. MILK</span>

          <!-- Frosted Chamber -->
          <div class="milk-fridge-box">
            <div class="milk-carton carton-whole" id="btnSelectWholeMilk" title="Whole Milk">
              <span>W</span>
              <div style="width: 6px; height: 6px; background: #fff; border-radius: 50%;"></div>
            </div>
            <div class="milk-carton carton-oat" id="btnSelectOatMilk" title="Barista Oat Milk">
              <span>OAT</span>
              <div style="width: 6px; height: 6px; background: #b45309; border-radius: 50%; color: #fff; font-size: 4px; display: flex; align-items: center; justify-content: center;">🌾</div>
            </div>
          </div>

          <!-- Metal Pitcher & Froth Action -->
          <div style="width: 100%; display: flex; align-items: center; justify-content: space-between; gap: 2px;">
            <div style="width: 12px; height: 14px; background: #cbd5e1; border: 1px solid #475569; border-radius: 0 0 3px 3px; position: relative;">
              <div style="width: 6px; height: 4px; background: #fff; border-radius: 50%; margin: 1px auto 0;"></div>
            </div>
            <button class="game-btn game-btn-sky" id="btnSteamMilkAction" style="background: #0284c7; color: #fff; padding: 2px 4px; font-size: 7px; min-height: 20px; flex: 1;">
              FROTH
            </button>
          </div>

          <span style="font-size: 6px; color: rgba(186, 230, 253, 0.7); font-weight: 800;">145°F</span>
        </div>

        <!-- ============================================== -->
        <!-- STATION 4: FLAVOR SYRUP DISPENSERS             -->
        <!-- ============================================== -->
        <div class="station-cell" id="stationSyrup">
          <span class="station-title" style="color: #c084fc;">4. SYRUP</span>

          <!-- Syrup Bottles Rack -->
          <div class="syrup-bottles-rack">
            <!-- Caramel -->
            <div class="syrup-bottle syrup-caramel" id="btnSyrupCaramel" title="Caramel Syrup">
              <div class="syrup-pump-head"></div>
              <span style="font-size: 4.5px; font-weight: 900; color: #fff; margin-bottom: 2px;">CARM</span>
            </div>
            <!-- Vanilla -->
            <div class="syrup-bottle syrup-vanilla" id="btnSyrupVanilla" title="Vanilla Syrup">
              <div class="syrup-pump-head"></div>
              <span style="font-size: 4.5px; font-weight: 900; color: #78350f; margin-bottom: 2px;">VAN</span>
            </div>
            <!-- Mocha -->
            <div class="syrup-bottle syrup-mocha" id="btnSyrupMocha" title="Dark Mocha">
              <div class="syrup-pump-head"></div>
              <span style="font-size: 4.5px; font-weight: 900; color: #fef08a; margin-bottom: 2px;">MOC</span>
            </div>
          </div>

          <button class="game-btn game-btn-purple" id="btnPumpSyrupAction" style="padding: 2px 4px; font-size: 7px; min-height: 20px; width: 100%;">
            + PUMP
          </button>

          <span style="font-size: 6px; color: rgba(233, 213, 255, 0.7); font-weight: 800;">DISPENSER</span>
        </div>

        <!-- ============================================== -->
        <!-- STATION 5: CUPS & ICE WELL                     -->
        <!-- ============================================== -->
        <div class="station-cell" id="stationCups">
          <span class="station-title" style="color: #22d3ee;">5. CUP/ICE</span>

          <!-- Cups Stack & Ice Bin -->
          <div style="width: 100%; display: flex; align-items: center; justify-content: space-around;">
            <!-- Cup Stack -->
            <div class="cups-stack-col" id="btnSelectCup" title="Grab To-Go Cup">
              <div class="cup-rim"></div>
              <div class="cup-body">
                <span>☕</span>
              </div>
            </div>

            <!-- Ice Bin with Ice Cubes -->
            <div class="ice-bin-box" id="btnScoopIce" title="Add Fresh Ice">
              <span class="ice-cube"></span>
              <span class="ice-cube"></span>
              <span class="ice-cube"></span>
              <div style="position: absolute; top: -3px; right: -2px; width: 4px; height: 10px; background: #94a3b8; border-radius: 1px; transform: rotate(45deg);"></div>
            </div>
          </div>

          <button class="game-btn" id="btnIceAction" style="background: #0891b2; color: #fff; padding: 2px 4px; font-size: 7px; min-height: 20px; width: 100%;">
            + ICE
          </button>

          <span style="font-size: 6px; color: rgba(165, 243, 252, 0.7); font-weight: 800;">CHILL</span>
        </div>

      </div>

      <!-- Barista Player Tray (Bottom Row) -->
      <div class="barista-player-tray">
        <!-- Player Avatar & Held Item -->
        <div class="player-avatar-badge">
          <div class="barista-head-icon">
            <div class="barista-visor"></div>
            <!-- Face -->
            <div style="display: flex; gap: 3px; margin-top: 3px;">
              <div style="width: 2.5px; height: 2.5px; background: #000; border-radius: 50%;"></div>
              <div style="width: 2.5px; height: 2.5px; background: #000; border-radius: 50%;"></div>
            </div>
            <!-- Green Apron Pin -->
            <div style="position: absolute; bottom: -2px; right: -2px; width: 10px; height: 10px; background: #047857; border: 1px solid #fff; border-radius: 50%; color: #fff; font-size: 5px; font-weight: 900; display: flex; align-items: center; justify-content: center;">★</div>
          </div>

          <div class="barista-info-col">
            <span class="barista-name">BARISTA: YOU</span>
            <span class="barista-held-pill">HELD: <span class="barista-held-item" id="playerHeldDisplay">${heldItem}</span></span>
          </div>
        </div>

        <!-- Quick Action Buttons -->
        <div class="player-action-buttons">
          <button class="game-btn game-btn-rose" id="btnDumpDrink" style="padding: 4px 8px; font-size: 8px; min-height: 28px;" title="Discard / Clear Current Prep">
            <span>🗑️</span>
            <span>DUMP</span>
          </button>
          <button class="game-btn game-btn-amber anim-pulse" id="btnServeDrink" style="padding: 4px 10px; font-size: 8.5px; min-height: 28px;" title="Expedite Drink to Customer">
            <span>🔔</span>
            <span>SERVE!</span>
          </button>
        </div>
      </div>
    </div>
  `;
}
