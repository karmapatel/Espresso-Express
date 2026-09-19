/* ========================================================================= */
/* ESPRESSO EXPRESS - LANDING PAGE INTERACTIVITY (APK DISTRIBUTION)          */
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
  fetchLatestRelease();
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
/* 3. DOWNLOAD APK BUTTONS & TOAST NOTIFICATION                              */
/* ------------------------------------------------------------------------- */
function initDownloadButtons() {
  const downloadButtons = [
    document.getElementById('heroDownloadBtn'),
    document.getElementById('mainDownloadApkBtn'),
    document.getElementById('headerDownloadBtn')
  ].filter(Boolean);

  downloadButtons.forEach(btn => {
    btn.addEventListener('click', async (e) => {
      const href = btn.getAttribute('href');
      // If it is a local relative URL, handle it via Blob downloading to guarantee security cookies are sent!
      if (href && (href.startsWith('/') || href.includes(window.location.hostname)) && href.endsWith('.apk')) {
        e.preventDefault();
        showToast('Initiating secure session download...', '🔒');
        
        try {
          const response = await fetch(href);
          if (!response.ok) throw new Error(`HTTP status ${response.status}`);
          
          showToast('Downloading APK binary...', '📶');
          const blob = await response.blob();
          const blobUrl = window.URL.createObjectURL(blob);
          
          const a = document.createElement('a');
          a.style.display = 'none';
          a.href = blobUrl;
          a.download = href.split('/').pop() || 'EspressoExpress.apk';
          document.body.appendChild(a);
          a.click();
          
          setTimeout(() => {
            document.body.removeChild(a);
            window.URL.revokeObjectURL(blobUrl);
            showToast('Download complete!', '✅');
          }, 100);
        } catch (error) {
          console.error("Secure fetch download failed, falling back to direct anchor stream.", error);
          showToast('Direct stream fallback initiated...', '⚠️');
          // Fallback to letting the browser handle the navigation directly
          window.location.href = href;
        }
      } else {
        showToast('Initiating update download...', '📦');
      }
    });
  });
}

function showToast(message, icon = '📦') {
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
  }, 4500);
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

/* ------------------------------------------------------------------------- */
/* 5. GITHUB RELEASE SYNCHRONIZER                                            */
/* ------------------------------------------------------------------------- */
function isVersionNewer(newVer, currentVer) {
  if (!newVer) return false;
  if (!currentVer) return true;
  const parse = (v) => v.replace(/^v/, '').split('.').map(x => parseInt(x, 10) || 0);
  const a = parse(newVer);
  const b = parse(currentVer);
  for (let i = 0; i < Math.max(a.length, b.length); i++) {
    const valA = a[i] || 0;
    const valB = b[i] || 0;
    if (valA > valB) return true;
    if (valA < valB) return false;
  }
  return false;
}

async function fetchLatestRelease() {
  let downloadUrl = "/downloads/EspressoExpress.apk";
  let version = "1.1.3";

  // Try to find the local version.json first to be accurate to local deployments
  try {
    const localRes = await fetch('/version.json');
    if (localRes.ok) {
      const localData = await localRes.json();
      if (localData.versionName) {
        version = localData.versionName;
      }
    }
  } catch (e) {
    console.warn("Failed to fetch local version.json", e);
  }

  // Try to find the GitHub repository path dynamically from the page
  const githubLinkEl = document.querySelector('a[href*="github.com"]');
  if (githubLinkEl) {
    let repoPath = "";
    try {
      const href = githubLinkEl.getAttribute('href');
      const url = new URL(href);
      const paths = url.pathname.split('/').filter(Boolean);
      if (paths.length >= 2) {
        repoPath = `${paths[0]}/${paths[1]}`;
      }
    } catch (e) {
      console.warn("Failed to parse repo path from link", e);
    }

    if (repoPath) {
      try {
        const res = await fetch(`https://api.github.com/repos/${repoPath}/releases/latest`);
        if (res.ok) {
          const data = await res.json();
          let rawVersion = data.tag_name ? data.tag_name.replace(/^v/, '') : "";
          if (rawVersion && rawVersion !== "latest" && isVersionNewer(rawVersion, version)) {
            version = rawVersion;
          }
          
          // Look for any asset ending with .apk
          const apkAsset = data.assets?.find(asset => asset.name.endsWith('.apk'));
          if (apkAsset) {
            downloadUrl = apkAsset.browser_download_url;
          } else {
            downloadUrl = `https://github.com/${repoPath}/releases/download/${data.tag_name || 'latest'}/espresso-express.apk`;
          }
        }
      } catch (error) {
        console.error("Failed to fetch latest GitHub release, keeping local build.", error);
      }
    }
  }

  // Update all download buttons and anchor links
  const downloadLinks = document.querySelectorAll('a[href*="downloads/EspressoExpress.apk"], a[href*="EspressoExpress.apk"]');
  downloadLinks.forEach(link => {
    link.href = downloadUrl;
    // Keep/ensure download attribute is present to bypass PWA Service Worker navigation interceptor
    link.setAttribute('download', 'espresso-express.apk');
    // Set external relationship to instruct browsers/PWA to handle natively
    link.setAttribute('rel', 'external');
    
    // Update label versions on anchors if needed
    if (link.textContent.includes('v1.0.0')) {
      link.innerHTML = link.innerHTML.replace('v1.0.0', `v${version}`);
    }
  });

  // Update text representations of version
  const versionPill = document.querySelector('.version-pill');
  if (versionPill) versionPill.textContent = `v${version} APK`;

  const ctaSub = document.querySelector('.cta-subtitle');
  if (ctaSub) ctaSub.textContent = `Android 8.0+ • Version ${version} (Direct Package)`;

  const mainSub = document.querySelector('.download-action-wrap .sub-label');
  if (mainSub) mainSub.textContent = `Android 8.0+ • Version ${version} (Direct APK Package)`;

  const specVersion = document.querySelector('.specs-grid .spec-card:nth-child(2) .spec-value');
  if (specVersion) specVersion.textContent = `${version} Release`;

  const footerVersion = document.querySelector('.version-tag');
  if (footerVersion) footerVersion.textContent = `Espresso Express APK • Version ${version}`;

  const mobileNavLink = document.querySelector('a[href="#download"].mobile-nav-link');
  if (mobileNavLink) mobileNavLink.textContent = `Download APK (v${version})`;

  console.log(`[APK Downloader] Successfully configured links to: ${downloadUrl} (Version ${version})`);
}
