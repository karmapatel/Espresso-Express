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
import { renderCustomerQueue } from './components/customerQueue.js';
import { renderCounterTop } from './components/counterTop.js';
import { renderWorkstation } from './components/workstation.js';
import { MOCK_SHIFT_RESULTS } from './data/mockData.js';
import { gameState } from './game/gameState.js';
import { gameLoop } from './game/gameLoop.js';
import { audioSystem } from './game/audioSystem.js';

class NavigationController {
  constructor() {
    this.currentScreen = 'main-menu';
    this.activeCategory = 'all';
    this.activeOrder = null;

    this.root = document.getElementById('screens-root');
    this.modalContainer = document.getElementById('modal-container');
    this.devNavButtons = document.querySelectorAll('.dev-btn[data-nav]');

    this.unsubscribeState = null;
    this.unsubscribeLoop = null;
  }

  init() {
    this.setupGlobalEvents();
    this.setupStateSubscriptions();
    this.render();
  }

  setupStateSubscriptions() {
    this.unsubscribeState = gameState.subscribe((event, payload) => {
      if (event === 'shift_end') {
        showToast("SHIFT OVER! TIME FOR PERFORMANCE REVIEW!", "🏁");
        this.navigateTo('results');
      } else if (event === 'workbench_update') {
        this.updateHeldDisplay();
        this.updateSpillDisplay();
        this.updateWorkstation();
      } else if (event === 'order_selected') {
        this.updateCustomerQueueAndRail();
        this.updateWorkstation();
      } else if (event === 'order_spawned') {
        this.updateCustomerQueueAndRail();
        this.updateWorkstation();
      } else if (event === 'order_served') {
        this.updateGameHUD();
        this.updateCustomerQueueAndRail();
        this.updateWorkstation();
      } else if (event === 'order_failed') {
        this.updateGameHUD();
        this.updateCustomerQueueAndRail();
        this.updateWorkstation();
      }
    });

    this.unsubscribeLoop = gameLoop.onTick((shift) => {
      if (this.currentScreen === 'game') {
        this.updateGameHUD();
      }
    });
  }

  navigateTo(screenName, options = {}) {
    // If leaving game screen without pause, handle gameLoop
    if (this.currentScreen === 'game' && screenName !== 'game') {
      if (gameState.shift.active && !gameState.shift.paused && screenName !== 'results') {
        gameState.pauseShift();
      }
      gameLoop.stop();
    }

    this.currentScreen = screenName;
    if (options.category) this.activeCategory = options.category;

    if (screenName === 'game') {
      if (!gameState.shift.active) {
        gameState.startShift();
      } else if (gameState.shift.paused) {
        gameState.resumeShift();
      }
      gameLoop.start();
    }

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
    if (!gameState.shift.active) {
      gameState.shift.isRushActive = !gameState.shift.isRushActive;
    } else {
      gameState.shift.isRushActive = !gameState.shift.isRushActive;
      if (gameState.shift.isRushActive) {
        gameState.shift.rushTimer = 20;
        audioSystem.playRushAlert();
      }
    }

    const isRush = gameState.shift.isRushActive;
    showToast(
      isRush ? "🚨 RUSH HOUR OVERDRIVE ACTIVATED!" : "⏱️ PREP PHASE ACTIVATED", 
      isRush ? "⚡" : "☕"
    );

    if (this.currentScreen === 'game') {
      this.updateRushBanner();
      this.updateGameHUD();
    }
  }

  openOrderModal(orderId) {
    const orders = gameState.shift.activeOrders || [];
    const order = orders.find(o => o.id === Number(orderId)) || orders[0];
    if (!order) return;

    this.activeOrder = order;
    this.modalContainer.innerHTML = renderOrderModal(order);
    this.modalContainer.classList.remove('hidden');

    const closeBtn = document.getElementById('btnCloseOrderModal');
    if (closeBtn) {
      closeBtn.onclick = () => this.closeModal();
    }

    const focusBtn = document.getElementById('btnFocusOrder');
    if (focusBtn) {
      focusBtn.onclick = () => {
        gameState.selectOrder(order.id);
        this.updateCustomerQueueAndRail();
        this.updateWorkstation();
        this.closeModal();
      };
    }
  }

  openPauseModal() {
    gameState.pauseShift();
    this.modalContainer.innerHTML = `
      <div class="game-modal-card modal-animate-in">
        <div class="modal-header">
          <div class="modal-title">
            <span>⏸️</span>
            <span>SHIFT PAUSED</span>
          </div>
          <button class="modal-close-btn" id="btnClosePauseModal">✕</button>
        </div>
        <div class="modal-body" style="display: flex; flex-direction: column; gap: 10px; padding: 16px;">
          <div style="font-size: 8px; color: #94a3b8; text-align: center; font-weight: 700;">
            SHIFT #${gameState.shift.shiftNumber} • RELAXED SERVICE (NO TIME LIMIT)
          </div>
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
            <span>CONCLUDE SHIFT EARLY</span>
          </button>
          <button class="game-btn game-btn-metal" id="btnPauseMainMenu" style="padding: 10px; font-size: 10px;">
            <span>🏠</span>
            <span>QUIT TO MAIN MENU</span>
          </button>
        </div>
      </div>
    `;
    this.modalContainer.classList.remove('hidden');

    const handleResume = () => {
      gameState.resumeShift();
      this.closeModal();
    };

    document.getElementById('btnClosePauseModal').onclick = handleResume;
    document.getElementById('btnResumeGame').onclick = handleResume;
    document.getElementById('btnPauseUpgrades').onclick = () => this.navigateTo('upgrades');
    document.getElementById('btnPauseFinishShift').onclick = () => {
      gameState.endShift();
      this.navigateTo('results');
    };
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
        this.root.innerHTML = renderMainMenu(gameState.player);
        this.bindMainMenuEvents();
        break;

      case 'game':
        this.root.innerHTML = renderGameScreen({
          isRushActive: gameState.shift.isRushActive,
          heldItem: gameState.workbench.heldItemDisplay,
          cash: gameState.shift.totalEarned,
          trainTimer: gameState.shift.trainTimer,
          chaosLevel: gameState.shift.chaosLevel,
          comboStreak: gameState.shift.comboStreak,
          orders: gameState.shift.activeOrders,
          hasSpill: gameState.workbench.hasSpill,
          selectedOrderId: gameState.shift.selectedOrderId
        });
        this.bindGameScreenEvents();
        break;

      case 'results':
        this.root.innerHTML = renderResultsScreen(gameState.lastShiftResults || MOCK_SHIFT_RESULTS);
        this.bindResultsScreenEvents();
        break;

      case 'upgrades':
        this.root.innerHTML = renderUpgradeScreen(this.activeCategory, gameState.upgrades, gameState.player);
        this.bindUpgradeScreenEvents();
        break;

      case 'settings':
        this.root.innerHTML = renderSettingsScreen();
        this.bindSettingsScreenEvents();
        break;

      default:
        this.root.innerHTML = renderMainMenu(gameState.player);
        this.bindMainMenuEvents();
    }
  }

  /* Live HUD and Queue DOM Updaters */
  updateGameHUD() {
    const shift = gameState.shift;

    const cashEl = document.getElementById('hudCashAmount');
    if (cashEl) {
      cashEl.innerText = `$${shift.totalEarned.toFixed(2)}`;
    }

    const fillEl = document.getElementById('hudChaosFill');
    if (fillEl) {
      fillEl.style.width = `${Math.min(100, Math.max(0, shift.chaosLevel))}%`;
    }

    const comboText = document.getElementById('hudComboText');
    const comboPill = document.getElementById('hudComboPill');
    if (comboText && comboPill) {
      comboText.innerText = shift.comboStreak > 1 ? `x${shift.comboStreak} COMBO` : 'STREAK x1';
      comboPill.style.opacity = shift.comboStreak > 1 ? '1' : '0.8';
    }
  }


  updateCustomerQueueAndRail() {
    const queueContainer = document.getElementById('customerQueueContainer');
    if (queueContainer) {
      queueContainer.innerHTML = renderCustomerQueue(gameState.shift.activeOrders, gameState.shift.selectedOrderId);
    }
    // Rebind newly rendered customer cards
    this.bindOrderModalClicks();
  }

  updateWorkstation() {
    const workstationEl = document.getElementById('workstationContainer');
    if (workstationEl && this.currentScreen === 'game') {
      const activeOrder = gameState.getSelectedOrder();
      workstationEl.innerHTML = renderWorkstation(gameState.workbench.heldItemDisplay, {
        workbench: gameState.workbench,
        activeOrder
      });
      this.bindWorkstationEvents();
    } else {
      this.updateHeldDisplay();
    }
  }

  updateHeldDisplay() {
    const heldEl = document.getElementById('playerHeldDisplay');
    if (heldEl) {
      heldEl.innerText = gameState.workbench.heldItemDisplay;
    }
  }

  updateSpillDisplay() {
    const puddle = document.getElementById('spillPuddle');
    if (puddle) {
      puddle.style.display = gameState.workbench.hasSpill ? 'flex' : 'none';
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

    this.bindOrderModalClicks();
    this.bindCounterTopEvents();
    this.bindWorkstationEvents();
  }

  bindOrderModalClicks() {
    document.querySelectorAll('.customer-card, .order-rail-ticket').forEach(el => {
      el.onclick = () => {
        const orderId = el.getAttribute('data-order-id');
        if (orderId) {
          gameState.selectOrder(orderId);
          this.updateCustomerQueueAndRail();
          this.updateWorkstation();
        }
      };
    });
  }

  bindCounterTopEvents() {
    const serveZone = document.getElementById('serveZoneBtn');
    const spongeBtn = document.getElementById('cleanSpongeBtn');
    const registerBtn = document.getElementById('cashRegisterBtn');

    if (serveZone) {
      serveZone.onclick = () => {
        const res = gameState.serveCurrentDrink();
        if (!res.success) {
          showToast(res.message, "⚠️");
        }
      };
    }

    if (spongeBtn) {
      spongeBtn.onclick = () => {
        gameState.cleanCounter();
        this.updateSpillDisplay();
        this.updateGameHUD();
      };
    }

    if (registerBtn) {
      registerBtn.onclick = () => {
        audioSystem.playCoinClink();
      };
    }
  }

  bindWorkstationEvents() {
    // Helper to only trigger toast notifications on incorrect items / warning processes
    const handleStationWarning = (res) => {
      if (!res) return;
      if (typeof res === 'string' && res.startsWith('⚠️')) {
        showToast(res, "⚠️");
      } else if (typeof res === 'object' && (res.warning || !res.success)) {
        showToast(res.message || "⚠️ Incorrect item or process!", "⚠️");
      }
    };

    // Inspect Active Order
    const inspectBtn = document.getElementById('btnInspectActiveOrder');
    if (inspectBtn) {
      inspectBtn.onclick = () => {
        const orderId = inspectBtn.getAttribute('data-order-id');
        this.openOrderModal(orderId);
      };
    }

    // Station 1: Grinder & Cup Picker
    const grindBtn = document.getElementById('btnGrindAction');
    const grindStation = document.getElementById('stationGrind');
    const triggerGrind = () => {
      const msg = gameState.grindBeans();
      handleStationWarning(msg);
    };
    if (grindBtn) grindBtn.onclick = (e) => { e.stopPropagation(); triggerGrind(); };
    if (grindStation) {
      grindStation.onclick = (e) => {
        if (e.target.closest('button')) return;
        triggerGrind();
      };
    }

    // Station 1 Cup Buttons: [S], [M], [L]
    const cupSmall = document.getElementById('btnCupSmall');
    const cupMedium = document.getElementById('btnCupMedium');
    const cupLarge = document.getElementById('btnCupLarge');
    if (cupSmall) {
      cupSmall.onclick = (e) => {
        e.stopPropagation();
        const msg = gameState.grabCup('Small');
        handleStationWarning(msg);
      };
    }
    if (cupMedium) {
      cupMedium.onclick = (e) => {
        e.stopPropagation();
        const msg = gameState.grabCup('Medium');
        handleStationWarning(msg);
      };
    }
    if (cupLarge) {
      cupLarge.onclick = (e) => {
        e.stopPropagation();
        const msg = gameState.grabCup('Large');
        handleStationWarning(msg);
      };
    }

    // Station 2: Espresso Pull (Single / Double)
    const pullSingleBtn = document.getElementById('btnPullSingle');
    const pullDoubleBtn = document.getElementById('btnPullDouble');
    const pullBtn = document.getElementById('btnPullShotAction');
    const espressoStation = document.getElementById('stationEspresso');

    if (pullSingleBtn) {
      pullSingleBtn.onclick = (e) => {
        e.stopPropagation();
        const msg = gameState.pullEspressoShot(1);
        handleStationWarning(msg);
      };
    }
    if (pullDoubleBtn) {
      pullDoubleBtn.onclick = (e) => {
        e.stopPropagation();
        const msg = gameState.pullEspressoShot(2);
        handleStationWarning(msg);
      };
    }
    if (pullBtn) {
      pullBtn.onclick = (e) => {
        e.stopPropagation();
        const msg = gameState.pullEspressoShot();
        handleStationWarning(msg);
      };
    }
    if (espressoStation) {
      espressoStation.onclick = (e) => {
        if (e.target.closest('button')) return;
        const msg = gameState.pullEspressoShot(1);
        handleStationWarning(msg);
      };
    }

    // Station 3: Milk Selection, Steaming & Hot Water
    const wholeMilk = document.getElementById('btnSelectWholeMilk');
    const oatMilk = document.getElementById('btnSelectOatMilk');
    const frothBtn = document.getElementById('btnSteamMilkAction');
    const hotWaterBtn = document.getElementById('btnHotWaterAction');

    if (wholeMilk) {
      wholeMilk.onclick = (e) => {
        e.stopPropagation();
        const msg = gameState.selectMilk('Whole Milk');
        handleStationWarning(msg);
      };
    }
    if (oatMilk) {
      oatMilk.onclick = (e) => {
        e.stopPropagation();
        const msg = gameState.selectMilk('Oat Milk');
        handleStationWarning(msg);
      };
    }
    if (frothBtn) {
      frothBtn.onclick = (e) => {
        e.stopPropagation();
        const msg = gameState.frothMilk();
        handleStationWarning(msg);
      };
    }
    if (hotWaterBtn) {
      hotWaterBtn.onclick = (e) => {
        e.stopPropagation();
        const msg = gameState.addHotWater();
        handleStationWarning(msg);
      };
    }

    // Station 4: Syrups
    const syrupCaramel = document.getElementById('btnSyrupCaramel');
    const syrupVanilla = document.getElementById('btnSyrupVanilla');
    const syrupMocha = document.getElementById('btnSyrupMocha');
    const syrupPumpBtn = document.getElementById('btnPumpSyrupAction');

    if (syrupCaramel) {
      syrupCaramel.onclick = (e) => {
        e.stopPropagation();
        const msg = gameState.addSyrup('Caramel');
        handleStationWarning(msg);
      };
    }
    if (syrupVanilla) {
      syrupVanilla.onclick = (e) => {
        e.stopPropagation();
        const msg = gameState.addSyrup('Vanilla');
        handleStationWarning(msg);
      };
    }
    if (syrupMocha) {
      syrupMocha.onclick = (e) => {
        e.stopPropagation();
        const msg = gameState.addSyrup('Mocha');
        handleStationWarning(msg);
      };
    }
    if (syrupPumpBtn) {
      syrupPumpBtn.onclick = (e) => {
        e.stopPropagation();
        const target = gameState.getSelectedOrder();
        const flavor = (target && target.syrup && target.syrup !== 'None') ? target.syrup : 'Caramel';
        const msg = gameState.addSyrup(flavor);
        handleStationWarning(msg);
      };
    }

    // Station 5: Ice Station (1, 2, or 3 Scoops)
    const iceBtn = document.getElementById('btnIceAction');
    const ice1Btn = document.getElementById('btnIce1');
    const ice2Btn = document.getElementById('btnIce2');
    const ice3Btn = document.getElementById('btnIce3');
    const iceBin = document.getElementById('btnScoopIce');
    const iceStation = document.getElementById('stationCups') || document.getElementById('stationIce');

    if (ice1Btn) {
      ice1Btn.onclick = (e) => {
        e.stopPropagation();
        const msg = gameState.setIce(1);
        handleStationWarning(msg);
      };
    }
    if (ice2Btn) {
      ice2Btn.onclick = (e) => {
        e.stopPropagation();
        const msg = gameState.setIce(2);
        handleStationWarning(msg);
      };
    }
    if (ice3Btn) {
      ice3Btn.onclick = (e) => {
        e.stopPropagation();
        const msg = gameState.setIce(3);
        handleStationWarning(msg);
      };
    }
    if (iceBtn) {
      iceBtn.onclick = (e) => {
        e.stopPropagation();
        const msg = gameState.addIce();
        handleStationWarning(msg);
      };
    }
    if (iceBin) {
      iceBin.onclick = (e) => {
        e.stopPropagation();
        const msg = gameState.addIce();
        handleStationWarning(msg);
      };
    }
    if (iceStation) {
      iceStation.onclick = (e) => {
        if (e.target.closest('button')) return;
        const msg = gameState.addIce();
        handleStationWarning(msg);
      };
    }

    // Tray Bottom Actions
    const cleanSpillBtn = document.getElementById('btnCleanSpill');
    const serveDrinkBtn = document.getElementById('btnServeDrink');
    const dumpDrinkBtn = document.getElementById('btnDumpDrink');

    if (cleanSpillBtn) {
      cleanSpillBtn.onclick = () => {
        gameState.cleanCounter();
        this.updateGameHUD();
        this.updateWorkstation();
      };
    }

    if (serveDrinkBtn) {
      serveDrinkBtn.onclick = () => {
        const res = gameState.serveCurrentDrink();
        if (!res.success) {
          showToast(res.message, "⚠️");
        }
      };
    }

    if (dumpDrinkBtn) {
      dumpDrinkBtn.onclick = () => {
        gameState.dumpDrink();
      };
    }
  }

  bindResultsScreenEvents() {
    const backBtn = document.getElementById('btnResultsBack');
    if (backBtn) backBtn.onclick = () => this.navigateTo('main-menu');

    const claimNextBtn = document.getElementById('btnResultsClaimNext');
    if (claimNextBtn) {
      claimNextBtn.onclick = () => {
        showToast("NEXT SHIFT INCOMING! ALL ABOARD!", "⚡");
        this.navigateTo('game');
      };
    }

    const upgradesBtn = document.getElementById('btnResultsUpgrades');
    if (upgradesBtn) upgradesBtn.onclick = () => this.navigateTo('upgrades');

    const menuBtn = document.getElementById('btnResultsMenu');
    if (menuBtn) menuBtn.onclick = () => this.navigateTo('main-menu');
  }

  bindUpgradeScreenEvents() {
    const backBtn = document.getElementById('btnUpgradesBack');
    if (backBtn) backBtn.onclick = () => this.navigateTo('main-menu');

    // Filter Tabs
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
        const card = btn.closest('.upgrade-card');
        const upgradeId = card?.getAttribute('data-upgrade-id') || btn.getAttribute('data-upgrade-id');
        if (!upgradeId) return;

        const res = gameState.buyUpgrade(upgradeId);
        showToast(res.message, res.success ? "⚡" : "⚠️");
        if (res.success) {
          this.render();
        }
      };
    });
  }

  bindSettingsScreenEvents() {
    const backBtn = document.getElementById('btnSettingsBack');
    if (backBtn) backBtn.onclick = () => this.navigateTo('main-menu');

    const masterSlider = document.getElementById('sliderMasterVol');
    if (masterSlider) {
      masterSlider.value = gameState.settings.masterVolume;
      masterSlider.oninput = (e) => {
        const val = Number(e.target.value);
        document.getElementById('labelMasterVol').innerText = `${val}%`;
        gameState.settings.masterVolume = val;
        audioSystem.updateVolumes({ masterVolume: val });
        gameState.save();
      };
    }

    const musicSlider = document.getElementById('sliderMusicVol');
    if (musicSlider) {
      musicSlider.value = gameState.settings.musicVolume;
      musicSlider.oninput = (e) => {
        const val = Number(e.target.value);
        document.getElementById('labelMusicVol').innerText = `${val}%`;
        gameState.settings.musicVolume = val;
        audioSystem.updateVolumes({ musicVolume: val });
        gameState.save();
      };
    }

    const sfxSlider = document.getElementById('sliderSfxVol');
    if (sfxSlider) {
      sfxSlider.value = gameState.settings.sfxVolume;
      sfxSlider.oninput = (e) => {
        const val = Number(e.target.value);
        document.getElementById('labelSfxVol').innerText = `${val}%`;
        gameState.settings.sfxVolume = val;
        audioSystem.updateVolumes({ sfxVolume: val });
        gameState.save();
      };
    }

    // Toggles
    const toggleMap = {
      toggleHaptics: 'hapticFeedback',
      toggleScreenShake: 'screenShake',
      toggleRushFlashes: 'rushFlashes'
    };

    Object.entries(toggleMap).forEach(([id, settingKey]) => {
      const toggle = document.getElementById(id);
      if (toggle) {
        if (gameState.settings[settingKey]) {
          toggle.classList.add('active');
        } else {
          toggle.classList.remove('active');
        }

        toggle.onclick = () => {
          gameState.settings[settingKey] = !gameState.settings[settingKey];
          toggle.classList.toggle('active', gameState.settings[settingKey]);
          audioSystem.updateVolumes(gameState.settings);
          gameState.save();
          showToast(`${settingKey.toUpperCase()} UPDATED`, "⚙️");
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
