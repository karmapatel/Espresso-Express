/* ========================================================================= */
/* COUNTER TOP & ORDER TICKET RAIL COMPONENT                                 */
/* ========================================================================= */

export function renderCounterTop(orders) {
  return `
    <div class="counter-top-bar">
      <!-- Hanging Ticket Rail -->
      <div class="ticket-rail-bar">
        <div class="ticket-rail-slot">
          <!-- Ticket 1: Urgent -->
          <div class="order-rail-ticket anim-ticket" data-order-id="101" style="border-color: #dc2626; background: #fef2f2;">
            <span style="width: 5px; height: 5px; border-radius: 50%; background: #dc2626;" class="animate-ping"></span>
            <span style="color: #991b1b; font-weight: 900;">#101: 2x ESPRESSO [14s]</span>
          </div>

          <!-- Ticket 2: Hot Latte -->
          <div class="order-rail-ticket anim-ticket" data-order-id="102">
            <span style="color: #78350f;">#102: LG OAT LATTE [HOT]</span>
          </div>

          <!-- Ticket 3: Iced Macchiato -->
          <div class="order-rail-ticket anim-ticket" data-order-id="103">
            <span style="color: #6d28d9;">#103: ICED MACCHIATO</span>
          </div>
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
          <div class="coffee-spill-puddle" id="spillPuddle">
            <span style="font-size: 6px; font-weight: 900; color: rgba(253, 230, 138, 0.6); font-family: var(--font-arcade);">DRIP!</span>
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
