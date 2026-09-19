/* ========================================================================= */
/* WORKSTATION COMPONENT (5 COFFEE STATIONS & PLAYER BARISTA TRAY)           */
/* ========================================================================= */

import { gameState } from '../game/gameState.js';
import { parseSyrupRequirement } from '../game/recipeSystem.js';

export function renderWorkstation(heldItem = "No Cup (Tap [S], [M], [L])", options = {}) {
  const workbench = options.workbench || gameState.workbench || {};
  const cup = workbench.cup || null;
  const targetOrder = options.activeOrder || gameState.getSelectedOrder() || null;
  const displayItem = typeof heldItem === 'string' ? heldItem : (workbench.heldItemDisplay || "No Cup (Tap [S], [M], [L])");

  // Syrup counts in cup
  const caramelPumps = cup ? (cup.syrups || []).filter(s => s === 'Caramel').length : 0;
  const vanillaPumps = cup ? (cup.syrups || []).filter(s => s === 'Vanilla').length : 0;
  const mochaPumps = cup ? (cup.syrups || []).filter(s => s === 'Mocha').length : 0;

  // Determine matching recipe specs for live checklist badges
  let cupMatches = false;
  let shotsMatch = false;
  let milkMatches = false;
  let frothMatches = false;
  let waterMatches = false;
  let syrupMatches = false;
  let iceMatches = false;
  let isReadyToServe = false;

  let syrupReq = { flavor: 'None', count: 0 };
  let currentSyrupPumps = 0;
  let wrongSyrupPumps = 0;
  let cupHasSyrup = false;
  let currentShots = 0;
  let requiredShots = 1;
  let shotsOver = false;

  let targetIce = 0;
  let currentIce = 0;
  let iceOver = false;

  let targetNeedsMilk = false;
  let cupHasMilk = false;
  let targetNeedsFroth = false;
  let cupHasFroth = false;
  let targetNeedsWater = false;
  let cupHasWater = false;

  if (targetOrder) {
    requiredShots = targetOrder.shots || 1;
    syrupReq = parseSyrupRequirement(targetOrder.syrup);
    targetIce = typeof targetOrder.iceCount === 'number' ? targetOrder.iceCount : (typeof targetOrder.ice === 'number' ? targetOrder.ice : (targetOrder.ice ? 2 : 0));
    targetNeedsMilk = !!(targetOrder.milk && targetOrder.milk !== 'None');
    targetNeedsFroth = !!targetOrder.frothed;
    targetNeedsWater = !!targetOrder.hasWater;

    if (cup) {
      cupMatches = !targetOrder.size || targetOrder.size === 'Any' || cup.size === targetOrder.size;
      
      currentShots = cup.shots || 0;
      // Strict exact shot count validation:
      shotsMatch = currentShots === requiredShots;
      shotsOver = currentShots > requiredShots;
      
      cupHasMilk = !!(cup.milk && cup.milk !== 'None');
      cupHasFroth = !!cup.frothed;
      cupHasWater = !!cup.hasWater;

      // Milk validation
      if (!targetNeedsMilk) {
        milkMatches = !cupHasMilk;
      } else {
        milkMatches = cupHasMilk && cup.milk === targetOrder.milk;
      }

      // Froth / Steaming validation (Strict: if customer didn't demand steamed, steaming is an error)
      if (targetNeedsFroth) {
        frothMatches = cupHasFroth;
      } else {
        // Customer did NOT demand steamed milk: must NOT be frothed!
        frothMatches = !cupHasFroth;
      }

      // Water validation (Strict: if customer didn't demand water, adding water is an error)
      if (targetNeedsWater) {
        waterMatches = cupHasWater;
      } else {
        // Customer did NOT demand water: must NOT have water!
        waterMatches = !cupHasWater;
      }

      const targetNeedsSyrup = targetOrder.syrup && targetOrder.syrup !== 'None';
      cupHasSyrup = !!(cup.syrups && cup.syrups.length > 0);

      if (!targetNeedsSyrup || syrupReq.count === 0) {
        syrupMatches = !cupHasSyrup;
        wrongSyrupPumps = cup.syrups ? cup.syrups.length : 0;
      } else {
        currentSyrupPumps = (cup.syrups || []).filter(s => s.toLowerCase() === syrupReq.flavor.toLowerCase()).length;
        wrongSyrupPumps = (cup.syrups || []).filter(s => s.toLowerCase() !== syrupReq.flavor.toLowerCase()).length;
        // Exact match: must have requested pump count AND zero wrong/unrequested syrups
        syrupMatches = currentSyrupPumps === syrupReq.count && wrongSyrupPumps === 0;
      }

      currentIce = typeof cup.ice === 'number' ? cup.ice : (cup.ice ? 2 : 0);
      iceMatches = currentIce === targetIce;
      iceOver = currentIce > targetIce;
      isReadyToServe = cupMatches && shotsMatch && milkMatches && frothMatches && syrupMatches && iceMatches && waterMatches;
    }
  }

  return `
    <div class="workstation-container">
      <!-- TARGET ORDER LIVE RECIPE BAR (FULL RECIPE ALWAYS 100% VISIBLE) -->
      ${targetOrder ? `
        <div class="active-order-strip" id="activeOrderStrip" title="Target Commuter Order: Follow recipe checklist">
          <div class="active-order-header">
            <div class="active-order-title-group">
              <span class="active-order-icon">${targetOrder.icon || '☕'}</span>
              <span class="active-order-num">#${targetOrder.id}</span>
              <span class="active-order-drink">${targetOrder.drinkName.toUpperCase()}</span>
              <span class="active-order-customer">FOR ${targetOrder.customer.toUpperCase()}</span>
            </div>
            <div class="active-order-bill-tag" title="Drink Bill: $${targetOrder.price.toFixed(2)} | Tip: ${targetOrder.tipBonus > 0 ? '+$' + targetOrder.tipBonus.toFixed(2) : '$0.00 (No Tip)'} | Total: $${(targetOrder.price + (targetOrder.tipBonus || 0)).toFixed(2)}">
              <span class="bill-item">Bill: <strong style="color: #ffffff; font-family: var(--font-numeric);">$${targetOrder.price.toFixed(2)}</strong></span>
              <span style="color: #475569;">•</span>
              <span class="${targetOrder.tipBonus > 0 ? 'bill-tip-positive' : 'bill-tip-none'}">
                Tip: <strong style="font-family: var(--font-numeric);">${targetOrder.tipBonus > 0 ? `+$${targetOrder.tipBonus.toFixed(2)}` : '$0.00'}</strong>
              </span>
              <span style="color: #475569;">•</span>
              <span class="bill-total">Total: <strong>$${(targetOrder.price + (targetOrder.tipBonus || 0)).toFixed(2)}</strong></span>
            </div>
          </div>

          <!-- FULL RECIPE CHECKLIST (WRAPS CLEANLY, NEVER HIDDEN OR SCROLLED) -->
          <div class="active-recipe-checklist">
            <!-- Cup Size Badge -->
            <span class="recipe-chip ${cupMatches ? 'chip-ok' : 'chip-pending'}">
              🥤 SIZE: ${targetOrder.size.toUpperCase()} ${cupMatches ? '✓' : ''}
            </span>

            <!-- Shots Badge (Strict Exact Match) -->
            <span class="recipe-chip ${shotsMatch ? 'chip-ok' : (shotsOver ? 'chip-warning' : 'chip-pending')}">
              ☕ SHOTS: ${currentShots}/${requiredShots} ${shotsMatch ? '✓' : (shotsOver ? '⚠️ TOO MANY' : '')}
            </span>

            <!-- Milk Badge -->
            ${targetNeedsMilk ? `
              <span class="recipe-chip ${milkMatches ? (cupHasMilk ? 'chip-ok' : 'chip-pending') : 'chip-warning'}">
                ${cupHasMilk && cup.milk !== targetOrder.milk ? `⚠️ WRONG MILK (${cup.milk.toUpperCase()})` : `🥛 MILK: ${targetOrder.milk.toUpperCase()} ${milkMatches ? '✓' : ''}`}
              </span>
            ` : `
              <span class="recipe-chip ${milkMatches ? 'chip-ok' : 'chip-warning'}">
                ${cupHasMilk ? `⚠️ UNWANTED MILK (${cup.milk.toUpperCase()})` : '🥛 NO MILK ✓'}
              </span>
            `}

            <!-- Steamed / Froth Badge -->
            ${targetNeedsFroth ? `
              <span class="recipe-chip ${frothMatches ? 'chip-ok' : 'chip-pending'}">
                💨 STEAMED ${frothMatches ? '✓' : ''}
              </span>
            ` : `
              <span class="recipe-chip ${frothMatches ? 'chip-ok' : 'chip-warning'}">
                ${cupHasFroth ? '⚠️ UNWANTED STEAM' : (targetNeedsMilk ? '🥛 COLD/UNSTEAMED ✓' : '💨 NO STEAM ✓')}
              </span>
            `}

            <!-- Hot Water Badge -->
            ${targetNeedsWater ? `
              <span class="recipe-chip ${waterMatches ? 'chip-ok' : 'chip-pending'}">
                💧 HOT WATER ${waterMatches ? '✓' : ''}
              </span>
            ` : `
              <span class="recipe-chip ${waterMatches ? 'chip-ok' : 'chip-warning'}">
                ${cupHasWater ? '⚠️ UNWANTED WATER' : '💧 NO WATER ✓'}
              </span>
            `}

            <!-- Syrups Badge (Strict Exact Flavor & Pump Match) -->
            ${targetOrder.syrup && targetOrder.syrup !== 'None' ? `
              <span class="recipe-chip ${syrupMatches ? 'chip-ok' : (wrongSyrupPumps > 0 || currentSyrupPumps > syrupReq.count ? 'chip-warning' : 'chip-pending')}">
                🍯 ${syrupReq.flavor.toUpperCase()}: ${currentSyrupPumps}/${syrupReq.count} PUMPS ${syrupMatches ? '✓' : (wrongSyrupPumps > 0 ? '⚠️ WRONG SYRUP' : (currentSyrupPumps > syrupReq.count ? '⚠️ TOO SWEET' : ''))}
              </span>
            ` : (cupHasSyrup ? `
              <span class="recipe-chip chip-warning">
                ⚠️ UNWANTED SYRUP ADDED
              </span>
            ` : '')}

            <!-- Ice / Temp Badge (Supports 1, 2, 3 Scoops) -->
            ${targetIce > 0 ? `
              <span class="recipe-chip ${iceMatches ? 'chip-ok' : (iceOver ? 'chip-warning' : 'chip-pending')}">
                🧊 ICE: ${currentIce}/${targetIce} SCOOP${targetIce === 1 ? '' : 'S'} ${iceMatches ? '✓' : (iceOver ? '⚠️ TOO MUCH ICE' : '')}
              </span>
            ` : `
              <span class="recipe-chip ${iceMatches ? 'chip-ok' : 'chip-warning'}">
                ${currentIce === 0 ? '♨️ HOT (NO ICE) ✓' : `⚠️ UNWANTED ICE (${currentIce}x)`}
              </span>
            `}

            ${isReadyToServe ? `
              <span class="recipe-chip chip-ready anim-pulse">
                ✨ READY TO SERVE!
              </span>
            ` : ''}
          </div>
        </div>
      ` : `
        <div class="active-order-strip" style="border-color: #475569; justify-content: center; padding: 6px;">
          <span style="font-size: 11px; color: #94a3b8; font-weight: 800;">PLATFORM CLEAR • WAITING FOR COMMUTERS</span>
        </div>
      `}

      <!-- 5 EQUIPMENT STATIONS GRID (LARGE, UNCLUTTERED, ACCESSIBLE CONTROLS) -->
      <div class="stations-grid">

        <!-- ======================================== -->
        <!-- STATION 1: BURR GRINDER & CUP PICKER     -->
        <!-- ======================================== -->
        <div class="station-cell" id="stationGrind">
          <div class="station-cell-header">
            <span class="station-title" style="color: #fbbf24;">1. GRIND & CUP</span>
            <span class="station-indicator-tag" style="color: ${cup ? '#38bdf8' : (workbench.portafilter === 'ground' ? '#34d399' : '#94a3b8')};">
              ${cup ? `[${cup.size.toUpperCase()}]` : (workbench.portafilter === 'ground' ? 'PACKED' : 'EMPTY')}
            </span>
          </div>

          <div class="station-btn-container" style="flex-direction: column; gap: 4px; justify-content: space-between;">
            <!-- Row 1: Manual Cup Selection Buttons (No Autoselect) -->
            <div class="cup-size-picker-row">
              <button class="cup-size-btn ${cup && cup.size === 'Small' ? 'active' : ''}" id="btnCupSmall" data-size="Small" title="Select Small 8oz Cup">
                <span class="cup-code">S</span>
                <span class="cup-oz">8oz</span>
              </button>
              <button class="cup-size-btn ${cup && cup.size === 'Medium' ? 'active' : ''}" id="btnCupMedium" data-size="Medium" title="Select Medium 12oz Cup">
                <span class="cup-code">M</span>
                <span class="cup-oz">12oz</span>
              </button>
              <button class="cup-size-btn ${cup && cup.size === 'Large' ? 'active' : ''}" id="btnCupLarge" data-size="Large" title="Select Large 16oz Cup">
                <span class="cup-code">L</span>
                <span class="cup-oz">16oz</span>
              </button>
            </div>

            <!-- Row 2: Reduced Size Grind Button -->
            <button class="game-btn ${workbench.portafilter === 'ground' ? 'game-btn-emerald' : 'game-btn-amber'}" id="btnGrindAction" style="width: 100%; min-height: 28px; height: 28px; font-size: 10px; font-weight: 900; padding: 2px 4px;" title="Grind Fresh Beans into Portafilter">
              <span>⚙️ ${workbench.portafilter === 'ground' ? 'GROUNDS PACKED ✓' : 'GRIND BEANS'}</span>
            </button>
          </div>
        </div>

        <!-- ================================================== -->
        <!-- STATION 2: COMMERCIAL ESPRESSO MACHINE             -->
        <!-- ================================================== -->
        <div class="station-cell espresso-machine-cell" id="stationEspresso">
          <div class="station-cell-header">
            <span class="station-title" style="color: #fef08a;">2. ESPRESSO</span>
            <span class="station-indicator-tag" style="color: ${workbench.portafilter === 'ground' ? '#34d399' : (cup && cup.shots > 0 ? '#fde047' : '#94a3b8')};">
              ${workbench.portafilter === 'ground' ? 'READY' : (cup && cup.shots > 0 ? `${cup.shots} SHOT${cup.shots === 1 ? '' : 'S'}` : 'GRIND FIRST')}
            </span>
          </div>

          <div class="station-btn-container" style="flex-direction: column; gap: 4px;">
            <button class="game-btn ${workbench.portafilter === 'ground' ? 'game-btn-amber' : 'game-btn-metal'}" id="btnPullSingle" style="width: 100%; min-height: 32px; font-size: 10.5px; font-weight: 900;" title="${workbench.portafilter === 'ground' ? 'Pull 1x Espresso Shot' : 'Grind beans first at Station 1'}">
              ☕ 1x SHOT
            </button>
            <button class="game-btn ${workbench.portafilter === 'ground' ? 'game-btn-amber' : 'game-btn-metal'}" id="btnPullDouble" style="width: 100%; min-height: 32px; font-size: 10.5px; font-weight: 900;" title="${workbench.portafilter === 'ground' ? 'Pull 2x Double Espresso Shot' : 'Grind beans first at Station 1'}">
              ⚡ 2x SHOTS
            </button>
          </div>
        </div>

        <!-- ============================================== -->
        <!-- STATION 3: MILK STEAMER & HOT WATER            -->
        <!-- ============================================== -->
        <div class="station-cell" id="stationMilk">
          <div class="station-cell-header">
            <span class="station-title" style="color: #38bdf8;">3. MILK & WATER</span>
            <span class="station-indicator-tag" style="color: ${cup && ((cup.milk && cup.milk !== 'None' && (!targetNeedsMilk || (targetOrder && cup.milk !== targetOrder.milk))) || (cup.frothed && !targetNeedsFroth) || (cup.hasWater && !targetNeedsWater)) ? '#f87171' : '#7dd3fc'};">
              ${cup && cup.frothed && !targetNeedsFroth ? '⚠️ UNWANTED STEAM' : (cup && cup.hasWater && !targetNeedsWater ? '⚠️ UNWANTED WATER' : (cup && cup.milk && cup.milk !== 'None' && (!targetNeedsMilk || (targetOrder && cup.milk !== targetOrder.milk)) ? `⚠️ WRONG MILK (${cup.milk.toUpperCase()})` : (cup && cup.frothed ? 'STEAMED' : (cup && cup.milk && cup.milk !== 'None' ? cup.milk : (cup && cup.hasWater ? '+WATER' : 'EMPTY')))))}
            </span>
          </div>

          <div class="station-btn-container" style="flex-direction: column; gap: 4px;">
            <!-- Row 1: Milks (Locked once a milk is poured) -->
            <div style="display: flex; gap: 3px; width: 100%;">
              ${(() => {
                const hasMilk = !!(cup && cup.milk && cup.milk !== 'None');
                const isWhole = cup && cup.milk === 'Whole Milk';
                const isOat = cup && cup.milk === 'Oat Milk';
                const wholeWrong = isWhole && (!targetNeedsMilk || (targetOrder && targetOrder.milk !== 'Whole Milk'));
                const oatWrong = isOat && (!targetNeedsMilk || (targetOrder && targetOrder.milk !== 'Oat Milk'));

                const wholeDisabled = hasMilk && !isWhole;
                const oatDisabled = hasMilk && !isOat;

                return `
                  <button class="game-btn ${isWhole ? (wholeWrong ? 'game-btn-metal' : 'game-btn-sky') : 'game-btn-metal'}" 
                          id="btnSelectWholeMilk" 
                          style="flex: 1; padding: 2px 3px; font-size: 9.5px; min-height: 28px; font-weight: 800; ${wholeWrong ? 'border-color: #ef4444; color: #fca5a5;' : ''} ${wholeDisabled ? 'opacity: 0.4; cursor: not-allowed;' : ''}" 
                          title="${wholeDisabled ? `Cannot select Whole Milk: ${cup.milk} is already poured. Dump drink to restart.` : (isWhole ? (wholeWrong ? '⚠️ Wrong milk selected! Dump drink to restart.' : 'Whole Milk poured ✓') : 'Add Whole Milk')}">
                    ${isWhole ? (wholeWrong ? '⚠️ WHOLE' : '🥛 WHOLE ✓') : '🥛 WHOLE'}
                  </button>
                  <button class="game-btn ${isOat ? (oatWrong ? 'game-btn-metal' : 'game-btn-amber') : 'game-btn-metal'}" 
                          id="btnSelectOatMilk" 
                          style="flex: 1; padding: 2px 3px; font-size: 9.5px; min-height: 28px; font-weight: 800; ${oatWrong ? 'border-color: #ef4444; color: #fca5a5;' : ''} ${oatDisabled ? 'opacity: 0.4; cursor: not-allowed;' : ''}" 
                          title="${oatDisabled ? `Cannot select Oat Milk: ${cup.milk} is already poured. Dump drink to restart.` : (isOat ? (oatWrong ? '⚠️ Wrong milk selected! Dump drink to restart.' : 'Oat Milk poured ✓') : 'Add Barista Oat Milk')}">
                    ${isOat ? (oatWrong ? '⚠️ OAT' : '🌾 OAT ✓') : '🌾 OAT'}
                  </button>
                `;
              })()}
            </div>
            <!-- Row 2: Steam & Hot Water -->
            <div style="display: flex; gap: 3px; width: 100%;">
              <button class="game-btn ${cup && cup.frothed ? (targetNeedsFroth ? 'game-btn-emerald' : 'game-btn-metal') : 'game-btn-sky'}" id="btnSteamMilkAction" style="flex: 1; padding: 2px 3px; font-size: 9px; min-height: 28px; font-weight: 800; ${cup && cup.frothed && !targetNeedsFroth ? 'border-color: #ef4444; color: #fca5a5;' : ''}" title="${targetNeedsFroth ? 'Steam milk into hot microfoam (Required)' : 'Steam milk (Note: Customer wants unsteamed/cold)'}">
                💨 ${cup && cup.frothed ? (targetNeedsFroth ? 'STEAMED ✓' : '⚠️ STEAMED') : 'STEAM'}
              </button>
              <button class="game-btn ${cup && cup.hasWater ? (targetNeedsWater ? 'game-btn-emerald' : 'game-btn-metal') : 'game-btn-metal'}" id="btnHotWaterAction" style="flex: 1; padding: 2px 3px; font-size: 9px; min-height: 28px; font-weight: 800; ${cup && cup.hasWater && !targetNeedsWater ? 'border-color: #ef4444; color: #fca5a5;' : ''}" title="${targetNeedsWater ? 'Add Hot Water (Required for Americano)' : 'Add Hot Water (Note: Customer did NOT order water)'}">
                💧 ${cup && cup.hasWater ? (targetNeedsWater ? 'WATER ✓' : '⚠️ +WATER') : 'WATER'}
              </button>
            </div>
          </div>
        </div>

        <!-- ============================================== -->
        <!-- STATION 4: FLAVOR SYRUPS (LIVE PUMP TRACKER)   -->
        <!-- ============================================== -->
        <div class="station-cell" id="stationSyrup">
          <div class="station-cell-header">
            <span class="station-title" style="color: #c084fc;">4. SYRUPS</span>
            <span class="station-indicator-tag" style="color: #e9d5ff;">
              ${cup && cup.syrups && cup.syrups.length > 0 ? `${cup.syrups.length} PUMP${cup.syrups.length > 1 ? 'S' : ''}` : '0 PUMPS'}
            </span>
          </div>

          <div class="station-btn-container" style="flex-direction: column; gap: 3px;">
            <button class="game-btn ${caramelPumps > 0 ? 'game-btn-amber' : 'game-btn-metal'}" id="btnSyrupCaramel" style="padding: 3px 5px; font-size: 9.5px; min-height: 24px; font-weight: 800; justify-content: space-between;" title="Pump Caramel Syrup (+1)">
              <span>🍯 CARAMEL</span>
              <span class="syrup-count-badge">${caramelPumps > 0 ? `${caramelPumps}x` : '+1'}</span>
            </button>

            <button class="game-btn ${vanillaPumps > 0 ? 'game-btn-amber' : 'game-btn-metal'}" id="btnSyrupVanilla" style="padding: 3px 5px; font-size: 9.5px; min-height: 24px; font-weight: 800; justify-content: space-between;" title="Pump Vanilla Syrup (+1)">
              <span>🌼 VANILLA</span>
              <span class="syrup-count-badge">${vanillaPumps > 0 ? `${vanillaPumps}x` : '+1'}</span>
            </button>

            <button class="game-btn ${mochaPumps > 0 ? 'game-btn-purple' : 'game-btn-metal'}" id="btnSyrupMocha" style="padding: 3px 5px; font-size: 9.5px; min-height: 24px; font-weight: 800; justify-content: space-between;" title="Pump Mocha Syrup (+1)">
              <span>🍫 MOCHA</span>
              <span class="syrup-count-badge">${mochaPumps > 0 ? `${mochaPumps}x` : '+1'}</span>
            </button>
          </div>
        </div>

        <!-- ============================================== -->
        <!-- STATION 5: ICE STATION (1, 2, OR 3 SCOOPS)     -->
        <!-- ============================================== -->
        <div class="station-cell" id="stationCups">
          <div class="station-cell-header">
            <span class="station-title" style="color: #22d3ee;">5. ICE</span>
            <span class="station-indicator-tag" style="color: ${cup && cup.ice > 0 ? '#34d399' : '#94a3b8'};">
              ${cup && cup.ice > 0 ? `${cup.ice} SCOOP${cup.ice === 1 ? '' : 'S'}` : 'NO ICE'}
            </span>
          </div>

          <div class="station-btn-container" style="flex-direction: column; gap: 4px; justify-content: space-between;">
            <!-- Row 1: Exact Ice Scoop Level Buttons (1x Light, 2x Reg, 3x Extra) -->
            <div class="cup-size-picker-row">
              <button class="cup-size-btn ${cup && cup.ice === 1 ? 'active' : ''}" id="btnIce1" data-ice="1" title="1 Scoop - Light Ice">
                <span class="cup-code">1x</span>
                <span class="cup-oz">LIGHT</span>
              </button>
              <button class="cup-size-btn ${cup && cup.ice === 2 ? 'active' : ''}" id="btnIce2" data-ice="2" title="2 Scoops - Regular Ice">
                <span class="cup-code">2x</span>
                <span class="cup-oz">REG</span>
              </button>
              <button class="cup-size-btn ${cup && cup.ice === 3 ? 'active' : ''}" id="btnIce3" data-ice="3" title="3 Scoops - Extra Ice">
                <span class="cup-code">3x</span>
                <span class="cup-oz">EXTRA</span>
              </button>
            </div>

            <!-- Row 2: Add Ice Scoop / Cycle Ice -->
            <button class="game-btn ${cup && cup.ice > 0 ? 'game-btn-sky' : 'game-btn-metal'}" id="btnIceAction" style="width: 100%; min-height: 28px; height: 28px; font-size: 10px; font-weight: 900; padding: 2px 4px;" title="Add or Cycle Ice Scoops">
              <span>🧊 ${cup && cup.ice > 0 ? `+1 SCOOP (${cup.ice}/3)` : '+1 SCOOP ICE'}</span>
            </button>
          </div>
        </div>

      </div>

      <!-- BARISTA PLAYER TRAY (ALWAYS PINNED TO BOTTOM) -->
      <div class="barista-player-tray">
        <!-- Player Avatar & Held Item -->
        <div class="player-avatar-badge">
          <div class="barista-head-icon">
            <div class="barista-visor"></div>
            <div style="display: flex; gap: 3px; margin-top: 3px;">
              <div style="width: 2.5px; height: 2.5px; background: #000; border-radius: 50%;"></div>
              <div style="width: 2.5px; height: 2.5px; background: #000; border-radius: 50%;"></div>
            </div>
            <div style="position: absolute; bottom: -2px; right: -2px; width: 11px; height: 11px; background: #047857; border: 1px solid #fff; border-radius: 50%; color: #fff; font-size: 6px; font-weight: 900; display: flex; align-items: center; justify-content: center;">★</div>
          </div>

          <div class="barista-info-col">
            <span class="barista-name">TRAY STATUS: <span style="color: #38bdf8;">${cup ? `${cup.size.toUpperCase()} CUP` : 'EMPTY TRAY'}</span></span>
            <span class="barista-held-pill"><span class="barista-held-item" id="playerHeldDisplay">${displayItem}</span></span>
          </div>
        </div>

        <!-- Quick Action Buttons -->
        <div class="player-action-buttons">
          ${workbench.hasSpill ? `
            <button class="game-btn game-btn-sky anim-pulse" id="btnCleanSpill" style="padding: 5px 9px; font-size: 11px; min-height: 34px; font-weight: 900; white-space: nowrap; flex-shrink: 0; background: #0284c7; border-color: #38bdf8;" title="Wipe Coffee Spill Mess">
              <span>🧽 WIPE</span>
            </button>
          ` : ''}
          <button class="game-btn game-btn-rose" id="btnDumpDrink" style="padding: 5px 10px; font-size: 11px; min-height: 34px; font-weight: 900; white-space: nowrap; flex-shrink: 0;" title="Discard / Clear Current Prep">
            <span>🗑️ DUMP</span>
          </button>
          <button class="game-btn ${isReadyToServe ? 'game-btn-emerald anim-pulse' : 'game-btn-amber'}" id="btnServeDrink" style="padding: 5px 13px; font-size: 11px; min-height: 34px; font-weight: 900; white-space: nowrap; flex-shrink: 0; ${isReadyToServe ? 'box-shadow: 0 0 12px rgba(16,185,129,0.95);' : ''}" title="Deliver Finished Drink">
            <span>🔔 ${isReadyToServe && targetOrder ? `SERVE #${targetOrder.id}!` : 'SERVE'}</span>
          </button>
        </div>
      </div>
    </div>
  `;
}
