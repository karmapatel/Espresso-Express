/* ========================================================================= */
/* ESPRESSO EXPRESS CENTRAL GAME STATE MANAGEMENT                            */
/* ========================================================================= */

import { MOCK_UPGRADES, MOCK_SETTINGS } from '../data/mockData.js';
import { generateCustomerOrder, evaluateDrink, parseSyrupRequirement } from './recipeSystem.js';
import { audioSystem } from './audioSystem.js';

const STORAGE_KEY = 'espresso_express_save_v1';

class GameStateManager {
  constructor() {
    this.listeners = new Set();
    this.loadPersistedState();
    this.resetShiftState();
  }

  loadPersistedState() {
    let saved = null;
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) saved = JSON.parse(raw);
    } catch (_) {}

    this.player = {
      cash: saved?.player?.cash ?? 142.00,
      tokens: saved?.player?.tokens ?? 12,
      level: saved?.player?.level ?? 4,
      xp: saved?.player?.xp ?? 320,
      xpToNext: 500,
      shiftCount: saved?.player?.shiftCount ?? 12,
      totalServed: saved?.player?.totalServed ?? 84
    };

    // Upgrades mapping
    const baseUpgrades = JSON.parse(JSON.stringify(MOCK_UPGRADES));
    if (saved?.upgrades) {
      baseUpgrades.forEach(u => {
        const found = saved.upgrades.find(su => su.id === u.id);
        if (found) {
          u.level = found.level;
          u.status = found.status;
          u.price = found.price;
        }
      });
    }
    this.upgrades = baseUpgrades;

    this.settings = saved?.settings ? { ...MOCK_SETTINGS, ...saved.settings } : { ...MOCK_SETTINGS };
    audioSystem.updateVolumes(this.settings);
  }

  save() {
    try {
      const data = {
        player: this.player,
        upgrades: this.upgrades,
        settings: this.settings
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (_) {}
  }

  resetShiftState() {
    this.shift = {
      active: false,
      paused: false,
      shiftNumber: (this.player.shiftCount || 0) + 1,
      totalDuration: null,
      remainingTime: null,
      trainTimer: null,
      trainState: 'ready',
      isRushActive: false,
      rushTimer: 0,
      chaosLevel: 10,
      comboStreak: 0,
      maxCombo: 0,
      customersServed: 0,
      totalCustomers: 0,
      perfectServes: 0,
      missedTrains: 0,
      basePay: 45.00,
      tipsEarned: 0,
      rushBonus: 0,
      totalEarned: 0,
      tokensAwarded: 0,
      activeOrders: [],
      selectedOrderId: null
    };

    // Workbench / Tray state
    this.workbench = {
      heldItemDisplay: "No Cup (Tap [S], [M], [L])",
      cup: null, // { size: 'Large', cupSize: 'Large', shots: 0, milk: 'None', frothed: false, syrups: [], ice: false, hasWater: false }
      portafilter: 'empty', // 'empty' | 'ground'
      milkPitcher: { type: 'None', frothed: false },
      hasSpill: false
    };

    this.lastShiftResults = null;
  }

  subscribe(callback) {
    this.listeners.add(callback);
    return () => this.listeners.delete(callback);
  }

  notify(event, payload) {
    this.listeners.forEach(cb => {
      try {
        cb(event, payload, this);
      } catch (err) {
        console.error("State listener error:", err);
      }
    });
  }

  /* Upgrade Perks Calculations */
  getPerks() {
    const perks = {
      grindSpeedMultiplier: 1.0,
      brewSpeedMultiplier: 1.0,
      autoFroth: false,
      tipMultiplier: 1.0,
      spillResistance: 0.1,
      patienceBonusSec: 0
    };

    this.upgrades.forEach(u => {
      if (u.level > 0) {
        if (u.id === 'grinder_burr') perks.grindSpeedMultiplier += (u.level * 0.25);
        if (u.id === 'espresso_pump') perks.brewSpeedMultiplier += (u.level * 0.25);
        if (u.id === 'steam_wand' && u.level >= 2) perks.autoFroth = true;
        if (u.id === 'syrup_carousel') perks.tipMultiplier += (u.level * 0.1);
        if (u.id === 'music_speaker') perks.patienceBonusSec += (u.level * 3);
        if (u.id === 'counter_mat') perks.spillResistance += (u.level * 0.2);
      }
    });

    return perks;
  }

  getRequiredCupSize() {
    const target = this.getSelectedOrder();
    return (target && target.size && target.size !== 'Any') ? target.size : 'Medium';
  }

  /* Start Shift */
  startShift() {
    this.resetShiftState();
    this.shift.active = true;
    this.shift.paused = false;

    // Seed initial queue with 3 unique commuters
    const initialOrders = [];
    for (let i = 0; i < 3; i++) {
      initialOrders.push(generateCustomerOrder({ isRush: false, existingOrders: initialOrders }));
    }
    this.shift.activeOrders = initialOrders;
    this.shift.totalCustomers = this.shift.activeOrders.length;
    this.shift.selectedOrderId = this.shift.activeOrders[0]?.id || null;

    // Start shift with clean workbench (player chooses cup manually at Station 1)
    this.workbench.cup = null;
    this.workbench.portafilter = 'empty';
    this.workbench.milkPitcher = { type: 'None', frothed: false };

    this.updateHeldDisplay();
    this.notify('shift_start', this.shift);
  }

  selectOrder(orderId) {
    const numId = Number(orderId);
    const order = this.shift.activeOrders.find(o => o.id === numId);
    if (order) {
      this.shift.selectedOrderId = order.id;
      this.notify('order_selected', order);
      return order;
    }
    return null;
  }

  getSelectedOrder() {
    if (!this.shift.activeOrders || this.shift.activeOrders.length === 0) return null;
    if (this.shift.selectedOrderId) {
      const found = this.shift.activeOrders.find(o => o.id === this.shift.selectedOrderId);
      if (found) return found;
    }
    return this.shift.activeOrders[0] || null;
  }

  pauseShift() {
    this.shift.paused = true;
    this.notify('shift_pause');
  }

  resumeShift() {
    this.shift.paused = false;
    this.notify('shift_resume');
  }

  endShift() {
    this.shift.active = false;

    // Calculate final grade
    const total = this.shift.customersServed + this.shift.missedTrains;
    const accuracy = total > 0 ? Math.round((this.shift.perfectServes / total) * 100) : 100;
    let grade = 'S';
    let beans = 3;

    if (accuracy >= 90 && this.shift.missedTrains <= 1) {
      grade = 'S+';
      beans = 3;
    } else if (accuracy >= 75 && this.shift.missedTrains <= 2) {
      grade = 'A';
      beans = 3;
    } else if (accuracy >= 55) {
      grade = 'B';
      beans = 2;
    } else {
      grade = 'C';
      beans = 1;
    }

    const totalEarned = Number((this.shift.basePay + this.shift.tipsEarned + this.shift.rushBonus).toFixed(2));
    const tokensAwarded = grade === 'S+' ? 15 : grade === 'A' ? 12 : grade === 'B' ? 8 : 4;

    this.lastShiftResults = {
      shiftNumber: this.shift.shiftNumber,
      shiftTitle: `Peak Morning Rush Hour • Platform 9`,
      beans,
      grade,
      customersServed: this.shift.customersServed,
      totalCustomers: total || this.shift.customersServed,
      perfectPercentage: `${accuracy}%`,
      longestCombo: this.shift.maxCombo,
      missedTrains: this.shift.missedTrains,
      basePay: this.shift.basePay,
      tipsEarned: this.shift.tipsEarned,
      rushBonus: this.shift.rushBonus,
      totalEarned,
      tokensAwarded
    };

    // Apply currency and XP
    this.player.cash = Number((this.player.cash + totalEarned).toFixed(2));
    this.player.tokens += tokensAwarded;
    this.player.shiftCount = (this.player.shiftCount || 0) + 1;
    this.player.totalServed += this.shift.customersServed;
    this.player.xp += (this.shift.customersServed * 25) + (tokensAwarded * 10);

    if (this.player.xp >= this.player.xpToNext) {
      this.player.level += 1;
      this.player.xp -= this.player.xpToNext;
      this.player.xpToNext = Math.round(this.player.xpToNext * 1.35);
    }

    this.save();
    this.notify('shift_end', this.lastShiftResults);
    return this.lastShiftResults;
  }

  /* Barista Workbench Actions */
  grabCup(size = 'Medium') {
    audioSystem.playCupPickup();
    if (!this.workbench.cup) {
      this.workbench.cup = {
        cup: true,
        size,
        cupSize: size,
        shots: 0,
        milk: 'None',
        frothed: false,
        syrups: [],
        ice: 0,
        hasWater: false
      };
    } else {
      this.workbench.cup.size = size;
      this.workbench.cup.cupSize = size;
    }
    this.updateHeldDisplay();
    this.notify('workbench_update', this.workbench);

    const target = this.getSelectedOrder();
    if (target && target.size && target.size !== 'Any' && target.size !== size) {
      return `⚠️ Wrong cup size! Customer ordered ${target.size} cup (selected ${size}).`;
    }
    return null;
  }

  grindBeans() {
    audioSystem.playGrind();
    this.workbench.portafilter = 'ground';
    this.updateHeldDisplay();
    this.notify('workbench_update', this.workbench);
    return null;
  }

  pullEspressoShot(shotsCount = null) {
    if (!this.workbench.cup) {
      if (typeof audioSystem.playDryClick === 'function') {
        audioSystem.playDryClick();
      } else {
        audioSystem.playClick();
      }
      return "⚠️ Select a cup first! Tap [S], [M], or [L] at Station 1.";
    }

    // Option A Enforced: Must grind beans first before pulling espresso
    if (this.workbench.portafilter !== 'ground') {
      if (typeof audioSystem.playDryClick === 'function') {
        audioSystem.playDryClick();
      } else {
        audioSystem.playClick();
      }
      return "⚠️ Grind beans first! Tap Station 1 to dose fresh grounds.";
    }

    audioSystem.playEspressoPull();
    // Add shots (1 or 2 as requested)
    const shotsToAdd = typeof shotsCount === 'number' ? shotsCount : 1;
    this.workbench.cup.shots = Math.min(4, (this.workbench.cup.shots || 0) + shotsToAdd);
    // Portafilter grounds emptied after pull
    this.workbench.portafilter = 'empty';

    // Chance of spill if in rush mode
    if (this.shift.isRushActive && Math.random() > (0.6 + this.getPerks().spillResistance)) {
      this.workbench.hasSpill = true;
      this.shift.chaosLevel = Math.min(100, this.shift.chaosLevel + 10);
    }

    this.updateHeldDisplay();
    this.notify('workbench_update', this.workbench);

    const target = this.getSelectedOrder();
    if (target && typeof target.shots === 'number' && this.workbench.cup.shots > target.shots) {
      return `⚠️ Too many espresso shots! Customer ordered ${target.shots} shot(s) (cup has ${this.workbench.cup.shots}).`;
    }

    return null;
  }

  selectMilk(type = 'Whole Milk') {
    if (!this.workbench.cup) {
      return "⚠️ Select a cup first! Tap [S], [M], or [L] at Station 1.";
    }

    const currentMilk = this.workbench.cup.milk;
    if (currentMilk && currentMilk !== 'None') {
      if (currentMilk === type) {
        return null;
      }
      const target = this.getSelectedOrder();
      const isWrong = target && (target.milk !== currentMilk || !target.milk || target.milk === 'None');
      if (isWrong) {
        return `⚠️ Wrong milk (${currentMilk}) is already in cup! Cannot select ${type} — dump drink [🗑️ DUMP] to restart.`;
      }
      return `⚠️ ${currentMilk} is already in cup! Cannot select ${type} — dump drink [🗑️ DUMP] to switch milk.`;
    }

    audioSystem.playCupPickup();
    this.workbench.cup.milk = type;
    this.updateHeldDisplay();
    this.notify('workbench_update', this.workbench);

    const target = this.getSelectedOrder();
    if (target) {
      if (!target.milk || target.milk === 'None') {
        return `⚠️ Unwanted milk! Customer ordered black coffee (no milk).`;
      }
      if (target.milk !== type) {
        return `⚠️ Wrong milk! Customer ordered ${target.milk} (selected ${type}).`;
      }
    }
    return null;
  }

  frothMilk() {
    if (!this.workbench.cup) {
      return "⚠️ Select a cup first! Tap [S], [M], or [L] at Station 1.";
    }
    if (!this.workbench.cup.milk || this.workbench.cup.milk === 'None') {
      return "⚠️ Add milk first before steaming!";
    }
    audioSystem.playMilkFroth();
    this.workbench.cup.frothed = true;
    this.updateHeldDisplay();
    this.notify('workbench_update', this.workbench);

    const target = this.getSelectedOrder();
    if (target && !target.frothed) {
      return "⚠️ Unwanted steam! Customer did NOT request steamed milk!";
    }
    return null;
  }

  addHotWater() {
    if (!this.workbench.cup) {
      return "⚠️ Select a cup first! Tap [S], [M], or [L] at Station 1.";
    }
    audioSystem.playHiss(0.12, 400);
    this.workbench.cup.hasWater = true;
    this.updateHeldDisplay();
    this.notify('workbench_update', this.workbench);

    const target = this.getSelectedOrder();
    if (target && !target.hasWater) {
      return "⚠️ Unwanted hot water! Customer did NOT order an Americano / hot water!";
    }
    return null;
  }

  addSyrup(flavor = 'Caramel') {
    if (!this.workbench.cup) {
      return "⚠️ Select a cup first! Tap [S], [M], or [L] at Station 1.";
    }
    audioSystem.playSyrupPump();
    if (!this.workbench.cup.syrups) this.workbench.cup.syrups = [];
    this.workbench.cup.syrups.push(flavor);
    this.updateHeldDisplay();
    this.notify('workbench_update', this.workbench);

    const target = this.getSelectedOrder();
    if (target) {
      const syrupReq = parseSyrupRequirement(target.syrup);
      if (syrupReq.count === 0 || syrupReq.flavor === 'None') {
        return `⚠️ Unwanted syrup! Customer did NOT order syrup.`;
      }
      if (syrupReq.flavor.toLowerCase() !== flavor.toLowerCase()) {
        return `⚠️ Wrong syrup! Customer requested ${syrupReq.flavor} (selected ${flavor}).`;
      }
      const count = this.workbench.cup.syrups.filter(s => s.toLowerCase() === flavor.toLowerCase()).length;
      if (count > syrupReq.count) {
        return `⚠️ Too many syrup pumps! Customer ordered ${syrupReq.count}x pump(s) (cup has ${count}x).`;
      }
    }
    return null;
  }

  setIce(amount) {
    if (!this.workbench.cup) {
      return "⚠️ Select a cup first! Tap [S], [M], or [L] at Station 1.";
    }
    audioSystem.playIceDrop();
    const count = Math.max(0, Math.min(3, parseInt(amount, 10) || 0));
    this.workbench.cup.ice = count;
    this.updateHeldDisplay();
    this.notify('workbench_update', this.workbench);

    const target = this.getSelectedOrder();
    if (target) {
      const targetIce = typeof target.iceCount === 'number' ? target.iceCount : (typeof target.ice === 'number' ? target.ice : (target.ice ? 2 : 0));
      if (targetIce === 0 && count > 0) {
        return "⚠️ Unwanted ice! Customer ordered a hot drink (no ice).";
      }
      if (count > targetIce) {
        return `⚠️ Too much ice! Customer requested ${targetIce === 0 ? 'no' : targetIce + 'x'} scoop(s) of ice.`;
      }
    }
    return null;
  }

  addIce() {
    if (!this.workbench.cup) {
      return "⚠️ Select a cup first! Tap [S], [M], or [L] at Station 1.";
    }
    audioSystem.playIceDrop();
    const current = typeof this.workbench.cup.ice === 'number' ? this.workbench.cup.ice : (this.workbench.cup.ice ? 2 : 0);
    const next = (current + 1) % 4; // Cycles: 0 -> 1 -> 2 -> 3 -> 0
    this.workbench.cup.ice = next;
    this.updateHeldDisplay();
    this.notify('workbench_update', this.workbench);

    const target = this.getSelectedOrder();
    if (target) {
      const targetIce = typeof target.iceCount === 'number' ? target.iceCount : (typeof target.ice === 'number' ? target.ice : (target.ice ? 2 : 0));
      if (targetIce === 0 && next > 0) {
        return "⚠️ Unwanted ice! Customer ordered a hot drink (no ice).";
      }
      if (next > targetIce) {
        return `⚠️ Too much ice! Customer requested ${targetIce === 0 ? 'no' : targetIce + 'x'} scoop(s) of ice.`;
      }
    }
    return null;
  }

  cleanCounter() {
    audioSystem.playCleanSponge();
    this.workbench.hasSpill = false;
    this.shift.chaosLevel = Math.max(0, this.shift.chaosLevel - 15);
    this.notify('workbench_update', this.workbench);
    return null;
  }

  dumpDrink() {
    audioSystem.playHiss(0.15, 800);
    this.workbench.cup = null;
    this.workbench.portafilter = 'empty';
    this.workbench.milkPitcher = { type: 'None', frothed: false };
    this.updateHeldDisplay();
    this.notify('workbench_update', this.workbench);
    return null;
  }

  serveCurrentDrink(targetOrderId = null) {
    if (!this.workbench.cup) {
      audioSystem.playOrderWrong();
      return { success: false, message: "No cup ready to serve! Grab a cup and brew first." };
    }

    if (!this.shift.activeOrders || this.shift.activeOrders.length === 0) {
      audioSystem.playOrderWrong();
      return { success: false, message: "No waiting commuters in line!" };
    }

    // Find matching order or target order
    let targetOrderIndex = -1;
    const requestedId = targetOrderId || this.shift.selectedOrderId;
    if (requestedId) {
      targetOrderIndex = this.shift.activeOrders.findIndex(o => o.id === Number(requestedId));
    }
    if (targetOrderIndex === -1) {
      // Find the order that best matches current cup
      let bestMatchIdx = 0;
      let highestScore = -1;
      this.shift.activeOrders.forEach((ord, idx) => {
        const evalRes = evaluateDrink(this.workbench.cup, ord);
        if (evalRes.score > highestScore) {
          highestScore = evalRes.score;
          bestMatchIdx = idx;
        }
      });
      targetOrderIndex = bestMatchIdx;
    }

    const order = this.shift.activeOrders[targetOrderIndex];
    const evaluation = evaluateDrink(this.workbench.cup, order);

    if (evaluation.success) {
      // Successful delivery
      const isPerfect = evaluation.accuracy >= 90;
      audioSystem.playServeSuccess(isPerfect);

      // Multipliers
      const perks = this.getPerks();
      const finalTip = Number((evaluation.earnedTip * perks.tipMultiplier).toFixed(2));
      const rushBonus = this.shift.isRushActive ? Number((order.price * 0.5).toFixed(2)) : 0;
      const totalDrinkIncome = Number((order.price + finalTip + rushBonus).toFixed(2));

      this.shift.customersServed += 1;
      if (isPerfect) this.shift.perfectServes += 1;
      this.shift.comboStreak += 1;
      if (this.shift.comboStreak > this.shift.maxCombo) {
        this.shift.maxCombo = this.shift.comboStreak;
      }

      this.shift.tipsEarned = Number((this.shift.tipsEarned + finalTip).toFixed(2));
      this.shift.rushBonus = Number((this.shift.rushBonus + rushBonus).toFixed(2));
      this.shift.totalEarned = Number((this.shift.totalEarned + totalDrinkIncome).toFixed(2));
      this.shift.chaosLevel = Math.max(0, this.shift.chaosLevel - 12);

      // Remove served order
      this.shift.activeOrders.splice(targetOrderIndex, 1);

      // Advance selected target to next commuter
      this.shift.selectedOrderId = this.shift.activeOrders[0]?.id || null;

      // Replenish order to maintain a steady line of waiting commuters (anti-repetition)
      if (this.shift.activeOrders.length < 3) {
        this.shift.activeOrders.push(generateCustomerOrder({ isRush: false, existingOrders: this.shift.activeOrders }));
        this.shift.totalCustomers += 1;
        if (!this.shift.selectedOrderId) {
          this.shift.selectedOrderId = this.shift.activeOrders[0].id;
        }
      }

      // Reset tray
      this.dumpDrink();
      this.notify('order_served', { order, evaluation, earned: totalDrinkIncome });

      return {
        success: true,
        message: `${order.customer} served: ${evaluation.feedback} (+$${totalDrinkIncome.toFixed(2)})`,
        earned: totalDrinkIncome,
        isPerfect
      };
    } else {
      audioSystem.playOrderWrong();
      this.shift.comboStreak = 0;
      this.shift.chaosLevel = Math.min(100, this.shift.chaosLevel + 12);
      this.notify('order_failed', { order, evaluation });
      return {
        success: false,
        message: `Order rejected! ${evaluation.feedback}`
      };
    }
  }

  updateHeldDisplay() {
    if (!this.workbench.cup) {
      if (this.workbench.portafilter === 'ground') {
        this.workbench.heldItemDisplay = "Portafilter (Fresh Grounds) • Select Cup [S/M/L]";
      } else {
        this.workbench.heldItemDisplay = "Empty Tray • Select Cup [S/M/L] at Station 1";
      }
      return;
    }

    const c = this.workbench.cup;
    const parts = [];
    if (c.ice && c.ice > 0) {
      const iceCount = typeof c.ice === 'number' ? c.ice : 2;
      parts.push(`🧊 ${iceCount}x Ice`);
    }
    if (c.shots > 0) parts.push(`☕ ${c.shots}x Shot`);
    if (c.hasWater) parts.push("💧 Hot Water");
    if (c.milk && c.milk !== 'None') parts.push(c.frothed ? `💨 Steamed ${c.milk}` : `🥛 ${c.milk}`);
    if (c.syrups && c.syrups.length > 0) parts.push(`✨ ${c.syrups.join('+')}`);

    const sizeTag = `[${(c.size || 'M').toUpperCase()}]`;
    const summary = parts.length > 0 ? `${sizeTag} ${parts.join(' • ')}` : `${sizeTag} Empty Cup`;
    this.workbench.heldItemDisplay = summary;
  }

  buyUpgrade(upgradeId) {
    const upgrade = this.upgrades.find(u => u.id === upgradeId);
    if (!upgrade) return { success: false, message: "Upgrade not found" };

    if (upgrade.status === 'locked') {
      return { success: false, message: `Locked: ${upgrade.unlockRequirement}` };
    }
    if (upgrade.status === 'maxed' || upgrade.level >= upgrade.maxLevel) {
      return { success: false, message: "Upgrade already maxed!" };
    }

    if (this.player.cash < upgrade.price) {
      audioSystem.playOrderWrong();
      return { success: false, message: `Not enough cash! Needs $${upgrade.price}` };
    }

    audioSystem.playCoinClink();
    this.player.cash = Number((this.player.cash - upgrade.price).toFixed(2));
    upgrade.level += 1;
    upgrade.price = Math.round(upgrade.price * 1.5);

    if (upgrade.level >= upgrade.maxLevel) {
      upgrade.status = 'maxed';
    }

    this.save();
    this.notify('upgrade_purchased', upgrade);
    return { success: true, message: `${upgrade.name} upgraded to Level ${upgrade.level}!`, upgrade };
  }
}

export const gameState = new GameStateManager();
