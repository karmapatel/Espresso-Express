# ☕ Espresso Express — 2D Mobile Arcade Game

<p align="center">
  <img src="public/assets/hero-banner-x9Xoeutx.jpg" alt="Espresso Express Hero Banner" width="100%" style="border-radius: 12px; max-width: 800px;" />
</p>

<p align="center">
  <a href="https://github.com/karmapatel/Espresso-Express/releases"><img src="https://img.shields.io/badge/Release-v1.1.9-brightgreen?style=for-the-badge&logo=github" alt="Current Release" /></a>
  <img src="https://img.shields.io/badge/Platform-Android%20%7C%20Web-blue?style=for-the-badge&logo=android" alt="Supported Platforms" />
  <img src="https://img.shields.io/badge/Build-Passing-success?style=for-the-badge&logo=github-actions" alt="Build Status" />
  <img src="https://img.shields.io/badge/License-MIT-orange?style=for-the-badge" alt="License" />
</p>

---

### 📢 What's New in v1.1.9
* **⚡ Instant In-App Automatic Downloads**: No more hunting on releases list pages! The update engine triggers background downloads immediately to retrieve the latest version cleanly.
* **🔒 Secure & Seamless Upgrades**: Integrates a client-side update framework that auto-detects the active repository structure to prevent installation downgrades.
* **📱 High-Fidelity Mobile Simulation**: Custom touch controls optimized for native Android devices alongside a visual status bar and navigation indicators.

---

## 🎯 About The Game

An adrenaline-pumping, 2D mobile arcade coffee-shop simulator set on a bustling subway platform (**Platform 9 / Grand Central Depot**). Brew fast, manage rush-hour queues, steam milk, dispense syrups, and deliver caffeinated perfection to impatient commuters before their trains depart!

---

## 🎮 Immersive Gameplay Features

### ☕ 5-Station Interactive Workstation
1. 🎛️ **Grind Station**: Manage the bean hopper level and trigger the high-speed titanium burr grinder.
2. 🚰 **Brew Station**: Extract rich espresso shots using a commercial 2-Group machine, keeping an eye on active pressure meters.
3. 🥛 **Milk Station**: Steam organic whole and barista-grade oat milk using the high-pressure steaming wand to perfect froth levels.
4. 🍯 **Syrup Station**: Dispense custom flavor profiles featuring Caramel, French Vanilla, and Dark Mocha pumps.
5. 🧊 **Cup & Ice Station**: Dispense size-accurate cups (12oz / 16oz) and instantly cool special iced formulations.

### 👥 Dynamic Commuter Queue
Meet unique passenger types rushing for their train:
* **Business Execs**: Highly impatient, heavy tip potential, short patience thresholds.
* **Night-Shift Workers**: Sleepy, requesting extra espresso shots.
* **Student Influencers**: Demanding intricate flavor syrup and oat milk modifications.

### ⚙️ Upgrades & Perks Shop
Spend earned Golden Coffee Beans on:
* **Automatic Grind & Steaming Accessories**
* **Call Bells** to summon additional customers
* **Gourmet Syrups** & custom barista aprons to maximize tip multipliers

---

## 🛠️ Technology Stack

```
┌────────────────────────────────────────────────────────┐
│                      FRONTEND ENGINE                   │
│  Vite (v6) + ES Modules + Tailwind CSS + Vanilla JS    │
└───────────────────────────┬────────────────────────────┘
                            ▼
┌────────────────────────────────────────────────────────┐
│                   NATIVE ANDROID CONTAINER             │
│   Jetpack Compose + WebKit WebView + Kotlin Coroutines  │
└────────────────────────────────────────────────────────┘
```

* **Frontend Build System**: Vite 6, JavaScript (ES Modules)
* **Styling & Presentation**: Responsive utility layout with glassmorphism, animated keyframes, and full screen-width mobile encapsulation.
* **Native Android Core**: Android SDK (API 26-34), Jetpack Compose, Kotlin Coroutines, Kotlin Serialization, and custom In-App Update intent APIs.

---

## 🚀 Getting Started

### Prerequisites
* **Node.js** (v18.0.0 or higher)
* **Android Studio** (for native client builds)

### Quick Start (Web)

```bash
# Clone the repository
git clone https://github.com/karmapatel/Espresso-Express.git

# Navigate into directory
cd Espresso-Express

# Install dependencies
npm install

# Start local server
npm run dev
```

Visit **`http://localhost:3000/`** to experience the game directly in your browser.

### APK Compilation
To package the app's hybrid build into a ready-to-run `.apk`:
```bash
npm run build
```

---

## 📄 License
Distributed under the **MIT License**. See `LICENSE` for more information.
