/* ========================================================================= */
/* ORDER DETAIL MODAL COMPONENT                                              */
/* ========================================================================= */

export function renderOrderModal(order) {
  if (!order) return '';

  const iceCount = typeof order.iceCount === 'number' ? order.iceCount : (typeof order.ice === 'number' ? order.ice : (order.ice ? 2 : 0));
  const iceText = iceCount === 0 ? 'No Ice (Hot Only)' : `${iceCount}x Scoop${iceCount === 1 ? '' : 's'} (${iceCount === 1 ? 'Light' : iceCount === 2 ? 'Regular' : 'Extra'} Ice)`;

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
            <div style="font-size: 9px; color: #94a3b8; font-weight: 700;">${order.customerType} • Waiting Patiently</div>
          </div>
          <div style="text-align: right;">
            <div class="game-pill pill-coin">
              <span>Bill: $${order.price.toFixed(2)}</span>
              <span style="font-size: 8px; color: ${order.tipBonus > 0 ? '#86efac' : '#94a3b8'};">
                (${order.tipBonus > 0 ? `+$${order.tipBonus.toFixed(2)} tip` : 'no tip'})
              </span>
            </div>
            <div style="font-size: 8px; font-weight: 800; color: #facc15; margin-top: 3px; font-family: var(--font-numeric);">
              TOTAL: $${(order.price + (order.tipBonus || 0)).toFixed(2)}
            </div>
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
            <div style="font-size: 7.5px; color: #94a3b8; font-weight: 800; text-transform: uppercase;">Milk & Steaming</div>
            <div style="font-size: 10px; font-weight: 900; color: #6ee7b7;">${order.milk === 'None' ? 'None (No Milk)' : `${order.milk} ${order.frothed ? '(Steamed 💨)' : '(Cold/Unsteamed)'}`}</div>
          </div>

          <!-- Spec 4: Syrups -->
          <div style="background: #151026; border: 1.5px solid #2d244c; border-radius: 8px; padding: 6px 8px;">
            <div style="font-size: 7.5px; color: #94a3b8; font-weight: 800; text-transform: uppercase;">Flavor Pumps</div>
            <div style="font-size: 10px; font-weight: 900; color: #c084fc;">${order.syrup}</div>
          </div>

          <!-- Spec 5: Ice / Chilled -->
          <div style="background: #151026; border: 1.5px solid #2d244c; border-radius: 8px; padding: 6px 8px;">
            <div style="font-size: 7.5px; color: #94a3b8; font-weight: 800; text-transform: uppercase;">Ice Station</div>
            <div style="font-size: 10px; font-weight: 900; color: #7dd3fc;">${iceText}</div>
          </div>

          <!-- Spec 6: Hot Water -->
          <div style="background: #151026; border: 1.5px solid #2d244c; border-radius: 8px; padding: 6px 8px;">
            <div style="font-size: 7.5px; color: #94a3b8; font-weight: 800; text-transform: uppercase;">Hot Water</div>
            <div style="font-size: 10px; font-weight: 900; color: ${order.hasWater ? '#38bdf8' : '#94a3b8'};">${order.hasWater ? '💧 Required (Americano)' : '🚫 No Water'}</div>
          </div>
        </div>

        <!-- Customer Quote / Note -->
        <div style="background: #201838; border-left: 3px solid #f59e0b; padding: 8px 10px; border-radius: 0 8px 8px 0; margin-bottom: 12px;">
          <span style="font-size: 8px; font-weight: 900; color: #fbbf24; text-transform: uppercase;">Commuter Note:</span>
          <p style="margin: 2px 0 0 0; font-size: 9.5px; color: #f1f5f9; font-style: italic; font-weight: 600;">
            "${order.notes}"
          </p>
        </div>

        <!-- Order Bill & Tip Breakdown Box -->
        <div style="background: #181329; border: 1.5px solid #332857; border-radius: 8px; padding: 8px 10px; margin-bottom: 14px;">
          <div style="font-size: 8px; font-weight: 900; color: #cbd5e1; text-transform: uppercase; margin-bottom: 6px; letter-spacing: 0.5px;">
            🧾 Order Bill & Payment Summary:
          </div>
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 3px;">
            <span style="font-size: 8.5px; font-weight: 700; color: #94a3b8;">Beverage Base Price:</span>
            <span style="font-size: 10px; font-weight: 900; color: #f1f5f9; font-family: var(--font-numeric);">$${order.price.toFixed(2)}</span>
          </div>
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px;">
            <span style="font-size: 8.5px; font-weight: 700; color: #94a3b8;">Commuter Gratuity / Tip:</span>
            <span style="font-size: 10px; font-weight: 900; color: ${order.tipBonus > 0 ? '#34d399' : '#94a3b8'}; font-family: var(--font-numeric);">
              ${order.tipBonus > 0 ? `+$${order.tipBonus.toFixed(2)} (Tips generously)` : '$0.00 (No Tip)'}
            </span>
          </div>
          <div style="border-top: 1px dashed #3a2e61; padding-top: 5px; display: flex; justify-content: space-between; align-items: center;">
            <span style="font-size: 9px; font-weight: 900; color: #fef08a; text-transform: uppercase;">Total Expected Payment:</span>
            <span style="font-size: 13px; font-weight: 900; color: #facc15; font-family: var(--font-numeric);">$${(order.price + (order.tipBonus || 0)).toFixed(2)}</span>
          </div>
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
