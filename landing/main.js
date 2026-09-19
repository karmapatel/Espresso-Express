/* ========================================================================= */
/* ESPRESSO EXPRESS - LANDING PAGE INTERACTIVITY                             */
/* ========================================================================= */

// Data for the 5 Workstations
const STATIONS_DATA = {
  grind: {
    emoji: '⚙️',
    pill: 'STATION 01 • HOPPER & BURRS',
    name: 'Titanium Burr Grinder',
    desc: 'The foundation of every great cup. Adjust grind fineness on the fly from silky espresso powder to coarse French press beans. Upgrades unlock high-RPM quiet grinding and anti-static chutes!',
    perks: ['⚡ 2.4s Rapid Dosing', '🔩 64mm Flat Burrs', '🎯 Zero Bean Waste', '⚙️ Micro-Stepped Calibration']
  },
  brew: {
    emoji: '☕',
    pill: 'STATION 02 • EXTRACTION ZONE',
    name: 'Dual-Group Commercial Espresso',
    desc: 'The beating heart of Platform 9. Features 9-bar rotary pump pressure, saturated groupheads, and live extraction flow meters. Keep your portafilter locked tight when rush hour hits!',
    perks: ['🔥 Dual PID Boilers', '⏱️ Volumetric Shot Timers', '🌊 Pre-Infusion Chamber', '☕ Rich Crema Output']
  },
  steam: {
    emoji: '🥛',
    pill: 'STATION 03 • MICROFOAM FRIDGE',
    name: 'High-Pressure Steam Wand & Chiller',
    desc: 'Chilled whole milk and barista-grade oat milk straight from the under-counter fridge. Whip up velvety microfoam for sleepy commuters craving lattes, cappuccinos, and flat whites.',
    perks: ['💨 1.8 Bar Dry Steam Wand', '🧊 4°C Milk Chiller Vault', '🥛 Whole & Barista Oat Dairy', '✨ Latte Art Temp Sensors']
  },
  syrup: {
    emoji: '🍯',
    pill: 'STATION 04 • FLAVOR DISPENSERS',
    name: 'Rapid-Pump Syrup Carousel',
    desc: 'Triple flavor rack featuring Golden Caramel, French Vanilla, and Dark Mocha syrups. Commuters will request exact pumps—deliver with precision to trigger the Sweet Tooth gratuity multiplier!',
    perks: ['🍯 Rich Golden Caramel', '🍦 French Vanilla Bean', '🍫 Swiss Dark Mocha', '🎯 1oz Precision Pumps']
  },
  cup: {
    emoji: '🧊',
    pill: 'STATION 05 • DISPENSER & ICE WELL',
    name: 'Rapid Cup Dispenser & Ice Well',
    desc: 'Grab 12oz and 16oz insulated to-go cups with one tap. Drop pristine crystal ice cubes into summer iced coffees to chill drinks instantly before the commuter reaches the turnstile.',
    perks: ['🥤 12oz & 16oz To-Go Cups', '❄️ Rapid-Chilled Ice Well', '⚡ Spring-Loaded Sleeves', '📦 Auto-Lid Snap Station']
  }
};

document.addEventListener('DOMContentLoaded', () => {
  initStationTabs();
  initMobileMenu();
  initDownloadButtons();
  initScrollHeader();
});

/* ------------------------------------------------------------------------- */
/* 1. WORKSTATION TABS LOGIC                                                 */
/* ------------------------------------------------------------------------- */
function initStationTabs() {
  const tabs = document.querySelectorAll('.station-tab');
  const contentContainer = document.getElementById('stationContent');

  if (!tabs.length || !contentContainer) return;

  // Render initial station (grind)
  renderStationContent('grind');

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const stationKey = tab.getAttribute('data-station');
      if (!stationKey || !STATIONS_DATA[stationKey]) return;

      tabs.forEach(t => {
        t.classList.remove('active');
        t.setAttribute('aria-selected', 'false');
      });

      tab.classList.add('active');
      tab.setAttribute('aria-selected', 'true');

      // Animate transition
      contentContainer.style.opacity = '0';
      contentContainer.style.transform = 'translateY(8px)';
      
      setTimeout(() => {
        renderStationContent(stationKey);
        contentContainer.style.transition = 'all 0.25s ease';
        contentContainer.style.opacity = '1';
        contentContainer.style.transform = 'translateY(0)';
      }, 150);
    });
  });

  function renderStationContent(key) {
    const data = STATIONS_DATA[key];
    contentContainer.innerHTML = `
      <div class="station-icon-col">
        <span>${data.emoji}</span>
      </div>
      <div class="station-text-col">
        <div class="station-badge-row">
          <span class="station-pill">${data.pill}</span>
        </div>
        <h3 class="station-name">${data.name}</h3>
        <p class="station-desc">${data.desc}</p>
        <div class="station-perks">
          ${data.perks.map(p => `<span class="station-perk-item">${p}</span>`).join('')}
        </div>
      </div>
    `;
  }
}

/* ------------------------------------------------------------------------- */
/* 2. MOBILE NAVIGATION MENU                                                 */
/* ------------------------------------------------------------------------- */
function initMobileMenu() {
  const toggleBtn = document.getElementById('mobileMenuToggle');
  const drawer = document.getElementById('mobileNavDrawer');

  if (!toggleBtn || !drawer) return;

  toggleBtn.addEventListener('click', () => {
    const isOpen = drawer.classList.toggle('open');
    toggleBtn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    drawer.setAttribute('aria-hidden', isOpen ? 'false' : 'true');
  });

  // Close when clicking any nav link
  const links = drawer.querySelectorAll('a');
  links.forEach(link => {
    link.addEventListener('click', () => {
      drawer.classList.remove('open');
      toggleBtn.setAttribute('aria-expanded', 'false');
      drawer.setAttribute('aria-hidden', 'true');
    });
  });
}

/* ------------------------------------------------------------------------- */
/* 3. DOWNLOAD BUTTONS INTERACTION & TOAST                                   */
/* ------------------------------------------------------------------------- */
function initDownloadButtons() {
  const downloadButtons = [
    document.getElementById('heroDownloadBtn'),
    document.getElementById('mainDownloadApkBtn'),
    document.getElementById('headerDownloadBtn')
  ].filter(Boolean);

  downloadButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      showToast('⚡ Starting download: EspressoExpress.apk (v1.0.0)... See you on Platform 9!', '☕');
    });
  });
}

function showToast(message, icon = '☕') {
  const container = document.getElementById('toastOverlay');
  if (!container) return;

  const card = document.createElement('div');
  card.className = 'toast-card';
  card.innerHTML = `
    <span style="font-size: 20px;">${icon}</span>
    <span>${message}</span>
  `;

  container.appendChild(card);

  setTimeout(() => {
    card.style.animation = 'toastSlideOut 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards';
    setTimeout(() => {
      if (card.parentNode) {
        card.parentNode.removeChild(card);
      }
    }, 300);
  }, 4000);
}

/* ------------------------------------------------------------------------- */
/* 4. SCROLL SHADOW EFFECT                                                   */
/* ------------------------------------------------------------------------- */
function initScrollHeader() {
  const header = document.getElementById('siteHeader');
  if (!header) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 20) {
      header.style.boxShadow = '0 8px 24px rgba(0, 0, 0, 0.6)';
    } else {
      header.style.boxShadow = 'none';
    }
  }, { passive: true });
}
