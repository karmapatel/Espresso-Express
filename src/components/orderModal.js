/* ========================================================================= */
/* ORDER DETAIL MODAL COMPONENT                                              */
/* ========================================================================= */

export function renderOrderModal(order) {
  if (!order) return '';

  return `
    <div class="game-modal-card modal-animate-in">
      <!-- Modal Header -->
      <div class="modal-header">
        <div class="modal-title">
          <span style="font-size: 14px;">${order.icon}</span>
          <span style="overflow: hidden; text-overflow: ellipsis; white-space: nowrap; font-size: 11px;">#${order.id}: ${order.drinkName.toUpperCase()}</span>
        </div>
        <button class="modal-close-btn" id="btnCloseOrderModal" aria-label="Close Order Details">✕</button>
      </div>

      <!-- Modal Body -->
      <div class="modal-body">
        <!-- Customer & Urgency Header -->
        <div style="display: flex; align-items: center; justify-content: space-between; background: #251e3d; border-radius: 10px; padding: 8px 12px; margin-bottom: 12px; border: 1.5px solid #3c3061;">
          <div>
            <div style="font-size: 11px; font-weight: 900; color: #fef08a;">${order.customer}</div>
            <div style="font-size: 9px; color: #94a3b8; font-weight: 700;">${order.customerType} • Train: ${order.trainTime}</div>
          </div>
          <div class="game-pill pill-coin">
            <span>$${order.price.toFixed(2)}</span>
            <span style="font-size: 8px; color: #86efac;">(+$${order.tipBonus.toFixed(2)} tip)</span>
          </div>
        </div>

        <!-- Recipe Specification Cards -->
        <div style="font-size: 9px; font-weight: 900; color: #cbd5e1; text-transform: uppercase; margin-bottom: 6px; letter-spacing: 0.5px;">
          📋 Barista Recipe Spec:
        </div>

        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 6px; margin-bottom: 12px;">
          <!-- Spec 1: Size -->
          <div style="background: #151026; border: 1.5px solid #2d244c; border-radius: 8px; padding: 6px 8px;">
            <div style="font-size: 7.5px; color: #94a3b8; font-weight: 800; text-transform: uppercase;">Cup Size</div>
            <div style="font-size: 10px; font-weight: 900; color: #38bdf8;">${order.size}</div>
          </div>

          <!-- Spec 2: Shots -->
          <div style="background: #151026; border: 1.5px solid #2d244c; border-radius: 8px; padding: 6px 8px;">
            <div style="font-size: 7.5px; color: #94a3b8; font-weight: 800; text-transform: uppercase;">Espresso</div>
            <div style="font-size: 10px; font-weight: 900; color: #fbbf24;">${order.shots}x Shots Extract</div>
          </div>

          <!-- Spec 3: Milk -->
          <div style="background: #151026; border: 1.5px solid #2d244c; border-radius: 8px; padding: 6px 8px;">
            <div style="font-size: 7.5px; color: #94a3b8; font-weight: 800; text-transform: uppercase;">Milk / Dairy</div>
            <div style="font-size: 10px; font-weight: 900; color: #6ee7b7;">${order.milk}</div>
          </div>

          <!-- Spec 4: Syrups -->
          <div style="background: #151026; border: 1.5px solid #2d244c; border-radius: 8px; padding: 6px 8px;">
            <div style="font-size: 7.5px; color: #94a3b8; font-weight: 800; text-transform: uppercase;">Flavor Pumps</div>
            <div style="font-size: 10px; font-weight: 900; color: #c084fc;">${order.syrup}</div>
          </div>

          <!-- Spec 5: Ice / Chilled -->
          <div style="background: #151026; border: 1.5px solid #2d244c; border-radius: 8px; padding: 6px 8px;">
            <div style="font-size: 7.5px; color: #94a3b8; font-weight: 800; text-transform: uppercase;">Ice Station</div>
            <div style="font-size: 10px; font-weight: 900; color: #7dd3fc;">${order.ice ? 'Add Chilled Cubes' : 'No Ice (Hot Only)'}</div>
          </div>

          <!-- Spec 6: Temp -->
          <div style="background: #151026; border: 1.5px solid #2d244c; border-radius: 8px; padding: 6px 8px;">
            <div style="font-size: 7.5px; color: #94a3b8; font-weight: 800; text-transform: uppercase;">Target Temp</div>
            <div style="font-size: 10px; font-weight: 900; color: #f472b6;">${order.temp}</div>
          </div>
        </div>

        <!-- Customer Quote / Note -->
        <div style="background: #201838; border-left: 3px solid #f59e0b; padding: 8px 10px; border-radius: 0 8px 8px 0; margin-bottom: 14px;">
          <span style="font-size: 8px; font-weight: 900; color: #fbbf24; text-transform: uppercase;">Commuter Note:</span>
          <p style="margin: 2px 0 0 0; font-size: 9.5px; color: #f1f5f9; font-style: italic; font-weight: 600;">
            "${order.notes}"
          </p>
        </div>

        <!-- Footer Action -->
        <button class="game-btn game-btn-emerald" id="btnFocusOrder" style="width: 100%; font-size: 11px; padding: 10px;">
          <span>☕</span>
          <span>SELECT TICKET & PREPARE</span>
        </button>
      </div>
    </div>
  `;
}
