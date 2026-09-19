/* ========================================================================= */
/* UPGRADES & STATION GEAR SCREEN                                            */
/* ========================================================================= */

import { MOCK_UPGRADES } from '../data/mockData.js';

export function renderUpgradeScreen(activeCategory = 'all') {
  const filteredUpgrades = activeCategory === 'all' 
    ? MOCK_UPGRADES 
    : MOCK_UPGRADES.filter(u => u.category === activeCategory);

  return `
    <div class="upgrades-screen-container screen-animate-in" style="position: relative; width: 100%; height: 100%; display: flex; flex-direction: column; background: radial-gradient(circle at 50% 10%, #291e45 0%, #151124 55%, #0d0a17 100%); overflow: hidden;">

      <!-- Screen Header with Navigation & Currency Balance -->
      <div class="screen-header">
        <button class="screen-back-btn" id="btnUpgradesBack" title="Back to Main Menu">←</button>
        <div class="screen-title">
          <span>⚙️</span>
          <span>UPGRADE SHOP</span>
        </div>
        <!-- Currency -->
        <div style="display: flex; gap: 4px;">
          <div class="game-pill pill-coin" style="padding: 2px 7px; font-size: 10px;">
            <div class="pill-coin-icon" style="width: 14px; height: 14px; font-size: 8px;">¢</div>
            <span>$437</span>
          </div>
          <div class="game-pill pill-token" style="padding: 2px 6px; font-size: 10px;">
            <div class="pill-token-icon" style="width: 14px; height: 14px; font-size: 8px;">T</div>
            <span>12</span>
          </div>
        </div>
      </div>

      <!-- Filter Category Tabs -->
      <div style="display: flex; align-items: center; justify-content: space-around; padding: 8px; background: #1a152d; border-bottom: 2px solid #110d1e; flex-shrink: 0; gap: 4px;">
        <button class="dev-btn ${activeCategory === 'all' ? 'active' : ''}" data-cat="all" style="flex: 1; padding: 6px 2px; font-size: 8.5px;">ALL GEAR</button>
        <button class="dev-btn ${activeCategory === 'equipment' ? 'active' : ''}" data-cat="equipment" style="flex: 1; padding: 6px 2px; font-size: 8.5px;">EQUIPMENT</button>
        <button class="dev-btn ${activeCategory === 'ingredients' ? 'active' : ''}" data-cat="ingredients" style="flex: 1; padding: 6px 2px; font-size: 8.5px;">SUPPLIES</button>
        <button class="dev-btn ${activeCategory === 'gear' ? 'active' : ''}" data-cat="gear" style="flex: 1; padding: 6px 2px; font-size: 8.5px;">PERKS</button>
      </div>

      <!-- Upgrades Scrollable Cards List -->
      <div style="flex: 1; overflow-y: auto; padding: 10px 12px; display: flex; flex-direction: column; gap: 8px;">
        ${filteredUpgrades.map(item => `
          <div class="upgrade-card" style="background: #1c1630; border: 2.5px solid #332857; border-radius: 12px; padding: 10px; box-shadow: var(--game-shadow-sm); display: flex; flex-direction: column; gap: 6px;">
            <!-- Top Row: Icon, Title, Level Pips -->
            <div style="display: flex; align-items: center; justify-content: space-between;">
              <div style="display: flex; align-items: center; gap: 8px;">
                <div style="width: 32px; height: 32px; background: #271f45; border: 2px solid #4a3b7a; border-radius: 8px; display: flex; align-items: center; justify-content: center; font-size: 16px;">
                  ${item.icon}
                </div>
                <div>
                  <div class="pixel-font" style="font-size: 10px; color: #f8fafc;">${item.name}</div>
                  <div style="font-size: 7.5px; color: #38bdf8; font-weight: 800;">${item.statBonus}</div>
                </div>
              </div>

              <!-- Level Pips -->
              <div style="display: flex; flex-direction: column; align-items: flex-end;">
                <span style="font-size: 7.5px; font-weight: 900; color: #fef08a;">LVL ${item.level} / ${item.maxLevel}</span>
                <div style="display: flex; gap: 2px; margin-top: 2px;">
                  ${Array.from({ length: item.maxLevel }).map((_, i) => `
                    <span style="width: 6px; height: 6px; border-radius: 2px; background: ${i < item.level ? '#facc15' : '#332657'}; border: 1px solid #110d1e;"></span>
                  `).join('')}
                </div>
              </div>
            </div>

            <!-- Description -->
            <p style="margin: 0; font-size: 8.5px; color: #94a3b8; font-weight: 600; line-height: 1.3;">
              ${item.description}
            </p>

            <!-- Bottom Row: Price & Action CTA Button -->
            <div style="display: flex; align-items: center; justify-content: space-between; margin-top: 2px; padding-top: 6px; border-top: 1px solid rgba(255,255,255,0.06);">
              ${item.status === 'locked' ? `
                <span style="font-size: 8px; color: #f43f5e; font-weight: 800;">🔒 ${item.unlockRequirement}</span>
                <button class="game-btn disabled" disabled style="padding: 4px 10px; font-size: 8px; min-height: 26px;">
                  LOCKED
                </button>
              ` : item.status === 'maxed' ? `
                <span style="font-size: 8px; color: #34d399; font-weight: 900;" class="pixel-font">MAX LEVEL REACHED</span>
                <button class="game-btn game-btn-emerald disabled" disabled style="padding: 4px 10px; font-size: 8px; min-height: 26px;">
                  ✓ MAXED
                </button>
              ` : `
                <div style="display: flex; align-items: center; gap: 4px;">
                  <span style="font-size: 8px; color: #cbd5e1; font-weight: 800;">UPGRADE COST:</span>
                  <div class="game-pill pill-coin" style="padding: 1px 6px; font-size: 9px;">
                    <div class="pill-coin-icon" style="width: 12px; height: 12px; font-size: 7px;">¢</div>
                    <span>$${item.price}</span>
                  </div>
                </div>
                <button class="game-btn game-btn-amber btn-upgrade-buy" data-upgrade-id="${item.id}" data-price="${item.price}" style="padding: 4px 12px; font-size: 8.5px; min-height: 28px;">
                  <span>⚡</span>
                  <span>UPGRADE</span>
                </button>
              `}
            </div>
          </div>
        `).join('')}
      </div>

    </div>
  `;
}
