/* ========================================================================= */
/* CUSTOMER QUEUE COMPONENT                                                  */
/* ========================================================================= */

import { MOCK_ORDERS } from '../data/mockData.js';

export function renderCustomerQueue(orders = MOCK_ORDERS, selectedOrderId = null) {
  const activeList = (orders && orders.length > 0) ? orders : [];

  if (activeList.length === 0) {
    return `
      <div class="customer-queue-row" style="display: flex; align-items: center; justify-content: center; min-height: 120px;">
        <div style="background: rgba(26, 21, 44, 0.85); border: 2px dashed #4a3a78; border-radius: 12px; padding: 10px 16px; text-align: center;">
          <span style="font-size: 16px;">⏱️</span>
          <div class="pixel-font" style="font-size: 8.5px; color: #7dd3fc; margin-top: 4px;">NO COMMUTERS IN LINE</div>
          <div style="font-size: 7px; color: #94a3b8; font-weight: 700;">Platform quiet... next train inbound soon!</div>
        </div>
      </div>
    `;
  }

  return `
    <div class="customer-queue-row">
      ${activeList.map((order, idx) => {
        const isSelected = selectedOrderId ? order.id === Number(selectedOrderId) : idx === 0;
        const selectedClass = isSelected ? ' customer-card-selected' : '';
        const targetBadge = isSelected ? `<div style="position: absolute; top: -6px; right: 0; background: #f59e0b; color: #1e1b2e; font-size: 6px; font-weight: 900; padding: 1px 4px; border-radius: 3px; z-index: 10; box-shadow: 0 0 5px rgba(245,158,11,0.8);">🎯 TARGET</div>` : '';
        const archetype = order.avatar || (idx % 3 === 0 ? 'business' : idx % 3 === 1 ? 'sleepy' : 'student');
        const tipText = order.tipBonus > 0 ? `+$${order.tipBonus.toFixed(2)} tip` : 'no tip';
        const billText = `$${order.price.toFixed(2)} (${tipText})`;

        if (archetype === 'business') {
          return `
            <!-- CHARACTER: Business Commuter -->
            <div class="customer-card${selectedClass}" data-order-id="${order.id}" style="position: relative;" title="Tap to target this commuter's order">
              ${targetBadge}
              <!-- Speech Bubble Order Demand -->
              <div class="customer-speech-bubble anim-bounce">
                <div class="bubble-drink-icon">${order.icon || '☕'}</div>
                <div class="bubble-text-col">
                  <span class="bubble-title" style="color: #ea580c;">${(order.drinkName || 'COFFEE').toUpperCase()}</span>
                  <span class="bubble-subtitle" style="font-weight: 800;">${billText}</span>
                </div>
              </div>

              <!-- 2D Character Body Artwork -->
              <div style="display: flex; flex-direction: column; align-items: center; position: relative;">
                <!-- Sweat Drop -->
                <div style="position: absolute; top: -6px; right: -2px; width: 5px; height: 7px; background: #7dd3fc; border-radius: 50%; border: 1px solid #0284c7;" class="anim-sweat"></div>

                <!-- Head -->
                <div style="position: relative; width: 34px; height: 34px; background: #fed7aa; border: 2.5px solid #1e1b2e; border-radius: 12px; display: flex; flex-direction: column; align-items: center; justify-content: center;">
                  <!-- Hair -->
                  <div style="position: absolute; top: -7px; width: 38px; height: 12px; background: #451a03; border: 1.5px solid #1e1b2e; border-top-left-radius: 14px; border-top-right-radius: 14px;"></div>
                  <!-- Slanted Angry Brows -->
                  <div style="display: flex; gap: 4px; margin-top: -2px;">
                    <div style="width: 7px; height: 2px; background: #1e1b2e; transform: rotate(12deg); border-radius: 1px;"></div>
                    <div style="width: 7px; height: 2px; background: #1e1b2e; transform: rotate(-12deg); border-radius: 1px;"></div>
                  </div>
                  <!-- Cartoon Eyes -->
                  <div style="display: flex; gap: 4px; margin-top: 2px;">
                    <div style="width: 7px; height: 7px; background: #fff; border: 1px solid #1e1b2e; border-radius: 50%; display: flex; align-items: center; justify-content: center;">
                      <div style="width: 3px; height: 3px; background: #dc2626; border-radius: 50%;"></div>
                    </div>
                    <div style="width: 7px; height: 7px; background: #fff; border: 1px solid #1e1b2e; border-radius: 50%; display: flex; align-items: center; justify-content: center;">
                      <div style="width: 3px; height: 3px; background: #dc2626; border-radius: 50%;"></div>
                    </div>
                  </div>
                  <!-- Open Shouting Mouth -->
                  <div style="width: 8px; height: 5px; background: #881337; border-bottom-left-radius: 4px; border-bottom-right-radius: 4px; border: 1px solid #1e1b2e; margin-top: 2px;"></div>
                </div>

                <!-- Suit Torso & Crooked Tie -->
                <div style="position: relative; width: 38px; height: 32px; background: #1e3a8a; border: 2.5px solid #1e1b2e; border-top-left-radius: 8px; border-top-right-radius: 8px; display: flex; flex-direction: column; align-items: center; margin-top: -2px;">
                  <div style="width: 8px; height: 4px; background: #ffffff;"></div>
                  <div style="width: 5px; height: 14px; background: #dc2626; transform: rotate(-6deg); border: 1px solid #1e1b2e;"></div>
                  <!-- Briefcase Arm -->
                  <div style="position: absolute; left: -6px; top: 6px; width: 8px; height: 16px; background: #1e3a8a; border: 1.5px solid #1e1b2e; border-radius: 4px;">
                    <div style="position: absolute; bottom: -4px; left: -2px; width: 10px; height: 12px; background: #78350f; border: 1px solid #000; border-radius: 2px;"></div>
                  </div>
                </div>

                <!-- Furious Tapping Feet -->
                <div style="display: flex; gap: 4px; margin-top: -2px;" class="anim-foot">
                  <div style="width: 10px; height: 6px; background: #172554; border: 1px solid #1e1b2e; border-radius: 0 0 3px 3px;"></div>
                  <div style="width: 10px; height: 6px; background: #172554; border: 1px solid #1e1b2e; border-radius: 0 0 3px 3px;"></div>
                </div>
              </div>
            </div>
          `;
        } else if (archetype === 'sleepy') {
          return `
            <!-- CHARACTER: Sleepy Night-Shift Worker -->
            <div class="customer-card anim-sleepy${selectedClass}" data-order-id="${order.id}" style="position: relative;" title="Tap to target this commuter's order">
              ${targetBadge}
              <div class="customer-speech-bubble">
                <div class="bubble-drink-icon" style="background: #e0f2fe; border-color: #0284c7;">${order.icon || '🥛'}</div>
                <div class="bubble-text-col">
                  <span class="bubble-title" style="color: #78350f;">${(order.drinkName || 'LATTE').toUpperCase()}</span>
                  <span class="bubble-subtitle" style="font-weight: 800;">${billText}</span>
                </div>
                <span style="font-size: 9px;">💤</span>
              </div>

              <div style="display: flex; flex-direction: column; align-items: center;">
                <!-- Head with Oversized Beanie -->
                <div style="position: relative; width: 34px; height: 34px; background: #fed7aa; border: 2.5px solid #1e1b2e; border-radius: 12px; display: flex; flex-direction: column; align-items: center; justify-content: center;">
                  <div style="position: absolute; top: -10px; width: 38px; height: 16px; background: #047857; border: 1.5px solid #1e1b2e; border-radius: 12px 12px 2px 2px;">
                    <div style="width: 100%; height: 4px; background: #065f46; margin-top: 7px; border-top: 1px solid #1e1b2e;"></div>
                  </div>
                  <!-- Half-Closed Sleepy Eyes with Dark Bags -->
                  <div style="display: flex; gap: 6px; margin-top: 4px;">
                    <div style="width: 6px; height: 3px; background: #475569; border-radius: 0 0 4px 4px;"></div>
                    <div style="width: 6px; height: 3px; background: #475569; border-radius: 0 0 4px 4px;"></div>
                  </div>
                  <!-- Drooling Mouth -->
                  <div style="position: relative; width: 6px; height: 3px; background: #991b1b; border-radius: 50%; margin-top: 3px;">
                    <div style="position: absolute; right: -2px; top: 0; width: 3px; height: 6px; background: #7dd3fc; border-radius: 0 0 3px 3px;"></div>
                  </div>
                </div>

                <!-- Oversized Slouchy Hoodie -->
                <div style="width: 40px; height: 32px; background: #334155; border: 2.5px solid #1e1b2e; border-radius: 10px 10px 0 0; display: flex; flex-direction: column; align-items: center; justify-content: center; margin-top: -2px;">
                  <div style="width: 20px; height: 10px; background: #1e293b; border: 1.5px solid #1e1b2e; border-radius: 6px 6px 0 0;"></div>
                </div>
                <div style="display: flex; gap: 3px; margin-top: -2px;">
                  <div style="width: 10px; height: 6px; background: #475569; border: 1px solid #1e1b2e;"></div>
                  <div style="width: 10px; height: 6px; background: #475569; border: 1px solid #1e1b2e;"></div>
                </div>
              </div>
            </div>
          `;
        } else {
          return `
            <!-- CHARACTER: Gen-Z Bubblegum Student -->
            <div class="customer-card${selectedClass}" data-order-id="${order.id}" style="position: relative;" title="Tap to target this commuter's order">
              ${targetBadge}
              <div class="customer-speech-bubble anim-bounce">
                <div class="bubble-drink-icon" style="background: #f3e8ff; border-color: #8b5cf6;">${order.icon || '🧊'}</div>
                <div class="bubble-text-col">
                  <span class="bubble-title" style="color: #6d28d9;">${(order.drinkName || 'ICED').toUpperCase()}</span>
                  <span class="bubble-subtitle" style="font-weight: 800;">${billText}</span>
                </div>
                <span style="font-size: 8px;">✨</span>
              </div>

              <div style="display: flex; flex-direction: column; align-items: center; position: relative;">
                <!-- Giant Neon Headphone Band -->
                <div style="position: absolute; top: -10px; width: 44px; height: 16px; border-top: 3px solid #facc15; border-left: 3px solid #facc15; border-right: 3px solid #facc15; border-radius: 20px 20px 0 0; pointer-events: none; z-index: 10;"></div>

                <!-- Head -->
                <div style="position: relative; width: 34px; height: 34px; background: #fde047; border: 2.5px solid #1e1b2e; border-radius: 12px; display: flex; flex-direction: column; align-items: center; justify-content: center;">
                  <!-- Ear Pads -->
                  <div style="position: absolute; left: -5px; top: 6px; width: 6px; height: 16px; background: #8b5cf6; border: 1.5px solid #1e1b2e; border-radius: 6px;"></div>
                  <div style="position: absolute; right: -5px; top: 6px; width: 6px; height: 16px; background: #8b5cf6; border: 1.5px solid #1e1b2e; border-radius: 6px;"></div>
                  <!-- Teal Curly Hair -->
                  <div style="position: absolute; top: -8px; width: 38px; height: 12px; background: #0d9488; border: 1.5px solid #1e1b2e; border-radius: 10px;"></div>
                  <!-- Eyes Looking Down at Phone -->
                  <div style="display: flex; gap: 4px; margin-top: 4px;">
                    <div style="width: 5px; height: 5px; background: #1e1b2e; border-radius: 50%;"></div>
                    <div style="width: 5px; height: 5px; background: #1e1b2e; border-radius: 50%;"></div>
                  </div>
                  <!-- Bubblegum Bubble -->
                  <div style="width: 10px; height: 10px; background: #f472b6; border: 1.5px solid #db2777; border-radius: 50%; margin-top: 1px;" class="anim-pulse"></div>
                </div>

                <!-- Puffer Jacket & Glowing Smartphone -->
                <div style="position: relative; width: 38px; height: 32px; background: #ec4899; border: 2.5px solid #1e1b2e; border-radius: 10px 10px 0 0; display: flex; flex-direction: column; align-items: center; margin-top: -2px; padding-top: 2px;">
                  <div style="width: 12px; height: 18px; background: #020617; border: 1.5px solid #fff; border-radius: 3px; display: flex; align-items: center; justify-content: center; box-shadow: 0 0 6px #38bdf8;">
                    <div style="width: 8px; height: 12px; background: #38bdf8; border-radius: 1px;"></div>
                  </div>
                </div>
                <div style="display: flex; gap: 3px; margin-top: -2px;">
                  <div style="width: 9px; height: 6px; background: #1e3a8a; border: 1px solid #1e1b2e;"></div>
                  <div style="width: 9px; height: 6px; background: #1e3a8a; border: 1px solid #1e1b2e;"></div>
                </div>
              </div>
            </div>
          `;
        }
      }).join('')}
    </div>
  `;
}
