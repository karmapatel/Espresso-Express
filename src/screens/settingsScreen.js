/* ========================================================================= */
/* SETTINGS & AUDIO SCREEN                                                   */
/* ========================================================================= */

import { MOCK_SETTINGS } from '../data/mockData.js';

export function renderSettingsScreen(settings = MOCK_SETTINGS) {
  return `
    <div class="settings-screen-container screen-animate-in" style="position: relative; width: 100%; height: 100%; display: flex; flex-direction: column; background: radial-gradient(circle at 50% 10%, #291e45 0%, #151124 55%, #0d0a17 100%); overflow-y: auto;">

      <!-- Header -->
      <div class="screen-header">
        <button class="screen-back-btn" id="btnSettingsBack" title="Back to Main Menu">←</button>
        <div class="screen-title">
          <span>⚙</span>
          <span>SETTINGS & AUDIO</span>
        </div>
        <div style="width: 36px;"></div> <!-- Balance spacer -->
      </div>

      <!-- Settings Content -->
      <div style="flex: 1; overflow-y: auto; padding: 14px; display: flex; flex-direction: column; gap: 14px;">

        <!-- Audio Section -->
        <div style="background: #1c1630; border: 2.5px solid #332857; border-radius: 14px; padding: 12px; box-shadow: var(--game-shadow-sm);">
          <div style="font-size: 9px; font-weight: 900; color: #fef08a; text-transform: uppercase; margin-bottom: 10px; display: flex; align-items: center; gap: 6px;">
            <span>🔊</span>
            <span class="pixel-font">AUDIO CONTROLS</span>
          </div>

          <!-- Master Volume -->
          <div class="game-slider-group">
            <div class="game-slider-label">
              <span>Master Volume</span>
              <span id="labelMasterVol">${settings.masterVolume}%</span>
            </div>
            <input type="range" class="game-slider" id="sliderMasterVol" min="0" max="100" value="${settings.masterVolume}">
          </div>

          <!-- Music Volume -->
          <div class="game-slider-group">
            <div class="game-slider-label">
              <span>Subway Lo-Fi BGM</span>
              <span id="labelMusicVol">${settings.musicVolume}%</span>
            </div>
            <input type="range" class="game-slider" id="sliderMusicVol" min="0" max="100" value="${settings.musicVolume}">
          </div>

          <!-- SFX Volume -->
          <div class="game-slider-group" style="margin-bottom: 0;">
            <div class="game-slider-label">
              <span>Steam & Grinder SFX</span>
              <span id="labelSfxVol">${settings.sfxVolume}%</span>
            </div>
            <input type="range" class="game-slider" id="sliderSfxVol" min="0" max="100" value="${settings.sfxVolume}">
          </div>
        </div>

        <!-- Gameplay & Feedback Toggles -->
        <div style="background: #1c1630; border: 2.5px solid #332857; border-radius: 14px; padding: 12px; box-shadow: var(--game-shadow-sm);">
          <div style="font-size: 9px; font-weight: 900; color: #38bdf8; text-transform: uppercase; margin-bottom: 8px; display: flex; align-items: center; gap: 6px;">
            <span>📱</span>
            <span class="pixel-font">ANDROID USABILITY & TOUCH</span>
          </div>

          <!-- Haptic Vibration -->
          <div class="game-toggle-row">
            <div>
              <div style="font-size: 10px; font-weight: 800; color: #f8fafc;">Haptic Vibration</div>
              <div style="font-size: 7.5px; color: #94a3b8;">Tactile response on button taps & shot pulls</div>
            </div>
            <div class="game-toggle ${settings.hapticFeedback ? 'active' : ''}" id="toggleHaptics">
              <div class="game-toggle-knob"></div>
            </div>
          </div>

          <!-- Screen Shake -->
          <div class="game-toggle-row">
            <div>
              <div style="font-size: 10px; font-weight: 800; color: #f8fafc;">Train Rumble Shake</div>
              <div style="font-size: 7.5px; color: #94a3b8;">Subtle camera vibration when trains pull in</div>
            </div>
            <div class="game-toggle ${settings.screenShake ? 'active' : ''}" id="toggleScreenShake">
              <div class="game-toggle-knob"></div>
            </div>
          </div>

          <!-- Rush Hour Warning Flashes -->
          <div class="game-toggle-row" style="border-bottom: none;">
            <div>
              <div style="font-size: 10px; font-weight: 800; color: #f8fafc;">Rush Overdrive Alerts</div>
              <div style="font-size: 7.5px; color: #94a3b8;">Flashing warning indicators for rush hours</div>
            </div>
            <div class="game-toggle ${settings.rushFlashes ? 'active' : ''}" id="toggleRushFlashes">
              <div class="game-toggle-knob"></div>
            </div>
          </div>
        </div>

        <!-- Game Info & Version -->
        <div style="background: #151024; border: 1.5px solid #281f44; border-radius: 10px; padding: 10px; text-align: center;">
          <div class="pixel-font" style="font-size: 9px; color: #fbbf24;">ESPRESSO EXPRESS • STAGE 1</div>
          <div style="font-size: 7.5px; color: #64748b; margin-top: 2px;">
            Engineered with Vanilla CSS, Modular ES Modules & Web Animations
          </div>
        </div>

      </div>

    </div>
  `;
}
