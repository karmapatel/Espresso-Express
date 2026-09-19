/* ========================================================================= */
/* ESPRESSO EXPRESS UI ROUTER & STATE NAVIGATION                            */
/* ========================================================================= */

import { renderMainMenu } from './screens/mainMenu.js';
import { renderGameScreen } from './screens/gameScreen.js';
import { renderResultsScreen } from './screens/resultsScreen.js';
import { renderUpgradeScreen } from './screens/upgradeScreen.js';
import { renderSettingsScreen } from './screens/settingsScreen.js';
import { renderOrderModal } from './components/orderModal.js';
import { showToast } from './components/toast.js';
import { MOCK_ORDERS } from './data/mockData.js';

class NavigationController {
  constructor() {
    this.currentScreen = 'main-menu';
    this.activeCategory = 'all';
    this.isRushActive = false;
    this.heldItem = "Double Shot Portafilter";
    this.cash = 142;
    this.activeOrder = null;

    this.root = document.getElementById('screens-root');
    this.modalContainer = document.getElementById('modal-container');
    this.devNavButtons = document.querySelectorAll('.dev-btn[data-nav]');
  }

  init() {
    this.render();
    this.setupGlobalEvents();
  }

  navigateTo(screenName, options = {}) {
    this.currentScreen = screenName;
    if (options.category) this.activeCategory = options.category;
    this.render();
    this.updateDevNavHighlights();
    this.closeModal();
  }

  updateDevNavHighlights() {
    this.devNavButtons.forEach(btn => {
      const target = btn.getAttribute('data-nav');
      if (target === this.currentScreen) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });
  }

  toggleRushState() {
    this.isRushActive = !this.isRushActive;
    showToast(
      this.isRushActive ? "🚨 RUSH HOUR OVERDRIVE ACTIVATED!" : "⏱️ PREP PHASE ACTIVATED", 
      this.isRushActive ? "⚡" : "☕"
    );
    if (this.currentScreen === 'game') {
      this.render();
    }
  }

  openOrderModal(orderId) {
    const order = MOCK_ORDERS.find(o => o.id === orderId) || MOCK_ORDERS[0];
    this.activeOrder = order;
    this.modalContainer.innerHTML = renderOrderModal(order);
    this.modalContainer.classList.remove('hidden');

    // Attach modal close & accept buttons
    const closeBtn = document.getElementById('btnCloseOrderModal');
    if (closeBtn) {
      closeBtn.onclick = () => this.closeModal();
    }

    const focusBtn = document.getElementById('btnFocusOrder');
    if (focusBtn) {
      focusBtn.onclick = () => {
        showToast(`PREPARING ${order.drinkName.toUpperCase()}!`, order.icon);
        this.closeModal();
      };
    }
  }

  openPauseModal() {
    this.modalContainer.innerHTML = `
      <div class="game-modal-card modal-animate-in">
        <div class="modal-header">
          <div class="modal-title">
            <span>⏸️</span>
            <span>GAME PAUSED</span>
          </div>
          <button class="modal-close-btn" id="btnClosePauseModal">✕</button>
        </div>
        <div class="modal-body" style="display: flex; flex-direction: column; gap: 10px; padding: 16px;">
          <button class="game-btn game-btn-amber" id="btnResumeGame" style="padding: 12px; font-size: 11px;">
            <span>▶</span>
            <span>RESUME SHIFT</span>
          </button>
          <button class="game-btn game-btn-purple" id="btnPauseUpgrades" style="padding: 10px; font-size: 10px;">
            <span>🛒</span>
            <span>STATION UPGRADES</span>
          </button>
          <button class="game-btn game-btn-emerald" id="btnPauseFinishShift" style="padding: 10px; font-size: 10px;">
            <span>📊</span>
            <span>FINISH SHIFT (RESULTS)</span>
          </button>
          <button class="game-btn game-btn-metal" id="btnPauseMainMenu" style="padding: 10px; font-size: 10px;">
            <span>🏠</span>
            <span>QUIT TO MAIN MENU</span>
          </button>
        </div>
      </div>
    `;
    this.modalContainer.classList.remove('hidden');

    document.getElementById('btnClosePauseModal').onclick = () => this.closeModal();
    document.getElementById('btnResumeGame').onclick = () => this.closeModal();
    document.getElementById('btnPauseUpgrades').onclick = () => this.navigateTo('upgrades');
    document.getElementById('btnPauseFinishShift').onclick = () => this.navigateTo('results');
    document.getElementById('btnPauseMainMenu').onclick = () => this.navigateTo('main-menu');
  }

  closeModal() {
    this.modalContainer.classList.add('hidden');
    this.modalContainer.innerHTML = '';
    this.activeOrder = null;
  }

  render() {
    switch (this.currentScreen) {
      case 'main-menu':
        this.root.innerHTML = renderMainMenu();
        this.bindMainMenuEvents();
        break;

      case 'game':
        this.root.innerHTML = renderGameScreen({
          isRushActive: this.isRushActive,
          heldItem: this.heldItem,
          cash: this.cash
        });
        this.bindGameScreenEvents();
        break;

      case 'results':
        this.root.innerHTML = renderResultsScreen();
        this.bindResultsScreenEvents();
        break;

      case 'upgrades':
        this.root.innerHTML = renderUpgradeScreen(this.activeCategory);
        this.bindUpgradeScreenEvents();
        break;

      case 'settings':
        this.root.innerHTML = renderSettingsScreen();
        this.bindSettingsScreenEvents();
        break;

      default:
        this.root.innerHTML = renderMainMenu();
        this.bindMainMenuEvents();
    }
  }

  /* Screen Event Binders */
  bindMainMenuEvents() {
    const playBtn = document.getElementById('btnMenuPlay');
    if (playBtn) playBtn.onclick = () => this.navigateTo('game');

    const upgradesBtn = document.getElementById('btnMenuUpgrades');
    if (upgradesBtn) upgradesBtn.onclick = () => this.navigateTo('upgrades');

    const resultsBtn = document.getElementById('btnMenuResults');
    if (resultsBtn) resultsBtn.onclick = () => this.navigateTo('results');

    const settingsBtn = document.getElementById('btnMenuSettings');
    if (settingsBtn) settingsBtn.onclick = () => this.navigateTo('settings');
  }

  bindGameScreenEvents() {
    // Pause button
    const pauseBtn = document.getElementById('hudPauseBtn');
    if (pauseBtn) pauseBtn.onclick = () => this.openPauseModal();

    // Customer cards click -> Order details modal
    document.querySelectorAll('.customer-card, .order-rail-ticket').forEach(el => {
      el.onclick = () => {
        const orderId = el.getAttribute('data-order-id');
        this.openOrderModal(orderId);
      };
    });

    // Station 1: Grinder
    const grindBtn = document.getElementById('btnGrindAction');
    const grindStation = document.getElementById('stationGrind');
    const triggerGrind = () => {
      this.heldItem = "Portafilter (Fresh Grounds)";
      this.updateHeldDisplay();
      showToast("GRINDING BEANS! [FINE ESPRESSO MESH]", "⚙️");
    };
    if (grindBtn) grindBtn.onclick = (e) => { e.stopPropagation(); triggerGrind(); };
    if (grindStation) grindStation.onclick = triggerGrind;

    // Station 2: Espresso Pull
    const pullBtn = document.getElementById('btnPullShotAction');
    const espressoStation = document.getElementById('stationEspresso');
    const triggerPull = () => {
      this.heldItem = "Steaming Double Shot Extract";
      this.updateHeldDisplay();
      showToast("PULLED ESPRESSO! 9.2 BARS EXTRACT", "☕");
    };
    if (pullBtn) pullBtn.onclick = (e) => { e.stopPropagation(); triggerPull(); };
    if (espressoStation) espressoStation.onclick = triggerPull;

    // Station 3: Milk
    const wholeMilk = document.getElementById('btnSelectWholeMilk');
    const oatMilk = document.getElementById('btnSelectOatMilk');
    const frothBtn = document.getElementById('btnSteamMilkAction');
    if (wholeMilk) wholeMilk.onclick = (e) => {
      e.stopPropagation();
      this.heldItem = "Whole Milk Steaming Pitcher";
      this.updateHeldDisplay();
      showToast("SELECTED WHOLE MILK!", "🥛");
    };
    if (oatMilk) oatMilk.onclick = (e) => {
      e.stopPropagation();
      this.heldItem = "Barista Oat Milk Pitcher";
      this.updateHeldDisplay();
      showToast("SELECTED BARISTA OAT MILK!", "🌾");
    };
    if (frothBtn) frothBtn.onclick = (e) => {
      e.stopPropagation();
      showToast("STEAMING: VELVETY MICROFOAM CREATED!", "💨");
    };

    // Station 4: Syrups
    const syrupCaramel = document.getElementById('btnSyrupCaramel');
    const syrupVanilla = document.getElementById('btnSyrupVanilla');
    const syrupMocha = document.getElementById('btnSyrupMocha');
    const syrupPumpBtn = document.getElementById('btnPumpSyrupAction');
    if (syrupCaramel) syrupCaramel.onclick = (e) => { e.stopPropagation(); showToast("+1 PUMP CARAMEL SYRUP!", "🍯"); };
    if (syrupVanilla) syrupVanilla.onclick = (e) => { e.stopPropagation(); showToast("+1 PUMP FRENCH VANILLA!", "✨"); };
    if (syrupMocha) syrupMocha.onclick = (e) => { e.stopPropagation(); showToast("+1 PUMP DARK MOCHA!", "🍫"); };
    if (syrupPumpBtn) syrupPumpBtn.onclick = () => showToast("+1 SYRUP PUMP ADDED!", "🍯");

    // Station 5: Cup & Ice
    const cupStack = document.getElementById('btnSelectCup');
    const iceBin = document.getElementById('btnScoopIce');
    const iceBtn = document.getElementById('btnIceAction');
    if (cupStack) cupStack.onclick = (e) => {
      e.stopPropagation();
      this.heldItem = "Large To-Go Cup (Lidded)";
      this.updateHeldDisplay();
      showToast("GRABBED 16oz TO-GO CUP!", "🥤");
    };
    if (iceBin) iceBin.onclick = (e) => { e.stopPropagation(); showToast("ICE CUBES ADDED TO CUP!", "🧊"); };
    if (iceBtn) iceBtn.onclick = () => showToast("ICE CUBES ADDED TO CUP!", "🧊");

    // Counter Top Props
    const serveZone = document.getElementById('serveZoneBtn');
    const spongeBtn = document.getElementById('cleanSpongeBtn');
    const registerBtn = document.getElementById('cashRegisterBtn');
    const serveDrinkBtn = document.getElementById('btnServeDrink');
    const dumpDrinkBtn = document.getElementById('btnDumpDrink');

    const handleServe = () => {
      this.cash += 6.50;
      const cashEl = document.getElementById('hudCashAmount');
      if (cashEl) cashEl.innerText = `$${this.cash.toFixed(2)}`;
      this.heldItem = "Empty Hands (Ready)";
      this.updateHeldDisplay();
      showToast("ORDER DELIVERED! COMMUTER CAFFEINATED! +$6.50", "🎉");
    };

    if (serveZone) serveZone.onclick = handleServe;
    if (serveDrinkBtn) serveDrinkBtn.onclick = handleServe;

    if (dumpDrinkBtn) dumpDrinkBtn.onclick = () => {
      this.heldItem = "Empty Hands (Cleared)";
      this.updateHeldDisplay();
      showToast("CLEARED WORKBENCH!", "🗑️");
    };

    if (spongeBtn) spongeBtn.onclick = () => showToast("COUNTER CLEANED & SPARKLING!", "✨");
    if (registerBtn) registerBtn.onclick = () => showToast(`CASH TILL TOTAL: $${this.cash.toFixed(2)}`, "💵");
  }

  updateHeldDisplay() {
    const heldEl = document.getElementById('playerHeldDisplay');
    if (heldEl) heldEl.innerText = this.heldItem;
  }

  bindResultsScreenEvents() {
    const backBtn = document.getElementById('btnResultsBack');
    if (backBtn) backBtn.onclick = () => this.navigateTo('main-menu');

    const claimNextBtn = document.getElementById('btnResultsClaimNext');
    if (claimNextBtn) claimNextBtn.onclick = () => {
      showToast("REWARDS CLAIMED! NEXT SHIFT STARTING!", "🎉");
      this.navigateTo('game');
    };

    const upgradesBtn = document.getElementById('btnResultsUpgrades');
    if (upgradesBtn) upgradesBtn.onclick = () => this.navigateTo('upgrades');

    const menuBtn = document.getElementById('btnResultsMenu');
    if (menuBtn) menuBtn.onclick = () => this.navigateTo('main-menu');
  }

  bindUpgradeScreenEvents() {
    const backBtn = document.getElementById('btnUpgradesBack');
    if (backBtn) backBtn.onclick = () => this.navigateTo('main-menu');

    // Tabs
    document.querySelectorAll('.dev-btn[data-cat]').forEach(tab => {
      tab.onclick = () => {
        const cat = tab.getAttribute('data-cat');
        this.activeCategory = cat;
        this.render();
      };
    });

    // Purchase buttons
    document.querySelectorAll('.btn-upgrade-buy').forEach(btn => {
      btn.onclick = () => {
        const price = btn.getAttribute('data-price');
        showToast(`UPGRADE PURCHASED! (-$${price})`, "⚡");
        btn.innerText = "✓ UPGRADED";
        btn.classList.remove('game-btn-amber');
        btn.classList.add('game-btn-emerald');
      };
    });
  }

  bindSettingsScreenEvents() {
    const backBtn = document.getElementById('btnSettingsBack');
    if (backBtn) backBtn.onclick = () => this.navigateTo('main-menu');

    // Sliders
    const masterSlider = document.getElementById('sliderMasterVol');
    if (masterSlider) {
      masterSlider.oninput = (e) => {
        document.getElementById('labelMasterVol').innerText = `${e.target.value}%`;
      };
    }
    const musicSlider = document.getElementById('sliderMusicVol');
    if (musicSlider) {
      musicSlider.oninput = (e) => {
        document.getElementById('labelMusicVol').innerText = `${e.target.value}%`;
      };
    }
    const sfxSlider = document.getElementById('sliderSfxVol');
    if (sfxSlider) {
      sfxSlider.oninput = (e) => {
        document.getElementById('labelSfxVol').innerText = `${e.target.value}%`;
      };
    }

    // Toggles
    ['toggleHaptics', 'toggleScreenShake', 'toggleRushFlashes'].forEach(id => {
      const toggle = document.getElementById(id);
      if (toggle) {
        toggle.onclick = () => {
          toggle.classList.toggle('active');
          showToast("SETTING UPDATED", "⚙️");
        };
      }
    });
  }

  setupGlobalEvents() {
    // Backdrop click to close modal
    this.modalContainer.addEventListener('click', (e) => {
      if (e.target === this.modalContainer) {
        this.closeModal();
      }
    });

    // Reviewer Navigation Ribbon handlers
    this.devNavButtons.forEach(btn => {
      btn.onclick = () => {
        const target = btn.getAttribute('data-nav');
        this.navigateTo(target);
      };
    });

    const rushToggleBtn = document.querySelector('[data-toggle="rush-state"]');
    if (rushToggleBtn) {
      rushToggleBtn.onclick = () => this.toggleRushState();
    }

    const frameToggleBtn = document.getElementById('toggleFrameViewBtn');
    const deviceContainer = document.getElementById('device-container');
    if (frameToggleBtn && deviceContainer) {
      frameToggleBtn.onclick = () => {
        deviceContainer.classList.toggle('device-fullscreen');
        deviceContainer.classList.toggle('device-phone');
        showToast(
          deviceContainer.classList.contains('device-fullscreen') ? "FULL VIEW ACTIVE" : "PHONE FRAME ACTIVE", 
          "📱"
        );
      };
    }

    const devToggle = document.getElementById('toggleDevNav');
    const devPanel = document.getElementById('devNavPanel');
    if (devToggle && devPanel) {
      devToggle.onclick = () => {
        devPanel.classList.toggle('collapsed');
      };
    }
  }
}

export const navigation = new NavigationController();
