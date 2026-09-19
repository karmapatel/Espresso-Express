/* ========================================================================= */
/* COUNTER TOP & ORDER TICKET RAIL COMPONENT                                 */
/* ========================================================================= */

import { MOCK_ORDERS } from '../data/mockData.js';

export function renderCounterTop(orders = MOCK_ORDERS, options = {}) {
  const activeOrders = (orders && orders.length > 0) ? orders : [];
  const hasSpill = options.hasSpill !== undefined ? options.hasSpill : false;

  return `
    <div class="counter-top-bar">
      <!-- Hanging Ticket Rail -->
      <div class="ticket-rail-bar">
        <div class="ticket-rail-slot">
          ${activeOrders.length === 0 ? `
            <div class="order-rail-ticket anim-ticket" style="background: #f8fafc; border-color: #94a3b8; color: #64748b;">
              <span style="font-size: 8px; font-weight: 800;">RAIL CLEAR • NO ORDERS</span>
            </div>
          ` : activeOrders.map((order, idx) => {
            const isSelected = options.selectedOrderId ? order.id === Number(options.selectedOrderId) : idx === 0;
            const borderStyle = isSelected 
              ? 'border-color: #f59e0b; background: #fffbeb; box-shadow: 0 0 8px rgba(245, 158, 11, 0.6); transform: translateY(-1px);'
              : '';
            return `
              <div class="order-rail-ticket anim-ticket${isSelected ? ' ticket-selected' : ''}" data-order-id="${order.id}" style="${borderStyle} display: flex; flex-direction: column; align-items: flex-start; justify-content: center; gap: 1px; padding: 2px 6px;" title="Tap to select #${order.id} ($${order.price.toFixed(2)}${order.tipBonus > 0 ? ` +$${order.tipBonus.toFixed(2)} tip` : ' no tip'})">
                <div style="display: flex; align-items: center; gap: 3px;">
                  ${isSelected ? `<span style="font-size: 8px;">🎯</span>` : ''}
                  <span style="color: ${isSelected ? '#b45309' : '#78350f'}; font-weight: 900;">
                    #${order.id}: ${order.drinkName.toUpperCase()}
                  </span>
                </div>
                <div style="font-size: 7.5px; font-weight: 800; color: ${order.tipBonus > 0 ? '#047857' : '#64748b'};">
                  $${order.price.toFixed(2)} ${order.tipBonus > 0 ? `(+$${order.tipBonus.toFixed(2)} tip)` : `(no tip)`}
                </div>
              </div>
            `;
          }).join('')}
        </div>
      </div>

      <!-- Counter Top Wooden Surface -->
      <div class="counter-wood-shelf">
        <!-- Serve Zone Mat (Tap to trigger serve visual feedback) -->
        <div class="serve-zone-mat interactive-prop" id="serveZoneBtn" title="Pickup Zone - Deliver Finished Drink">
          <span style="width: 6px; height: 6px; border-radius: 50%; background: #34d399;" class="anim-pulse"></span>
          <span class="pixel-font" style="font-size: 8px; color: #a7f3d0; font-weight: 900;">SERVE ZONE ➔</span>
          <!-- Completed Drink on Mat -->
          <div style="position: relative; display: flex; align-items: center; justify-content: center;">
            <div style="width: 13px; height: 16px; background: #fef3c7; border: 1.5px solid #78350f; border-radius: 0 0 3px 3px; display: flex; align-items: center; justify-content: center; font-size: 7px; box-shadow: 0 2px 4px rgba(0,0,0,0.3);">
              ☕
            </div>
            <!-- Steam -->
            <div style="position: absolute; top: -6px; width: 4px; height: 6px; background: rgba(255,255,255,0.7); border-radius: 50%;" class="anim-bounce"></div>
          </div>
        </div>

        <!-- Coffee Spill Mess & Sponge -->
        <div class="spill-counter-zone">
          <div class="coffee-spill-puddle" id="spillPuddle" style="display: ${hasSpill ? 'flex' : 'none'};">
            <span style="font-size: 6px; font-weight: 900; color: rgba(253, 230, 138, 0.9); font-family: var(--font-arcade);">DRIP!</span>
            <!-- Knocked over cup -->
            <div style="position: absolute; left: -6px; top: -2px; width: 14px; height: 8px; background: #ffffff; border: 1px solid #1e293b; border-radius: 2px; transform: rotate(-45deg);"></div>
          </div>
          <!-- Clean Towel -->
          <button class="wipe-sponge-prop" id="cleanSpongeBtn" title="Quick Clean Counter Mess">
            🧽
          </button>
        </div>

        <!-- Heavy Brass Register -->
        <div class="cash-register-prop" id="cashRegisterBtn" title="Register (Daily Earnings)">
          <div style="width: 10px; height: 8px; background: #0f172a; border: 1px solid #000; border-radius: 2px; color: #4ade80; font-size: 6px; font-family: var(--font-numeric); font-weight: 900; display: flex; align-items: center; justify-content: center;">
            $
          </div>
          <span class="pixel-font" style="font-size: 7.5px; color: #713f12; font-weight: 900;">TILL</span>
        </div>
      </div>
    </div>
  `;
}
