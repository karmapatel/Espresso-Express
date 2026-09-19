package com.espressoexpress.arcade.ui.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.espressoexpress.arcade.AppScreen
import com.espressoexpress.arcade.game.GameState
import com.espressoexpress.arcade.ui.theme.*

@Composable
fun SettingsScreen(
    gameState: GameState,
    onNavigateTo: (AppScreen) -> Unit
) {
    var checkUpdateStatus by remember { mutableStateOf("Ready to Check") }

    Box(
        modifier = Modifier
            .fillMaxSize()
            .background(DarkBackground)
            .padding(16.dp)
    ) {
        Column(
            modifier = Modifier
                .fillMaxSize()
                .verticalScroll(rememberScrollState())
        ) {
            
            // Header back row
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Button(
                    onClick = { onNavigateTo(AppScreen.MAIN_MENU) },
                    colors = ButtonDefaults.buttonColors(containerColor = SubwayMetal),
                    shape = RoundedCornerShape(10.dp)
                ) {
                    Text("◀ BACK", fontSize = 11.sp, fontFamily = FontFamily.Monospace)
                }

                Text(
                    text = "SETTINGS & SYSTEM",
                    fontSize = 14.sp,
                    fontFamily = FontFamily.Monospace,
                    fontWeight = FontWeight.Bold,
                    color = TextSecondary
                )
            }

            Spacer(modifier = Modifier.height(20.dp))

            Text(
                text = "GAME PREFERENCES",
                fontSize = 20.sp,
                fontWeight = FontWeight.Bold,
                fontFamily = FontFamily.Monospace,
                color = Color.White
            )

            Spacer(modifier = Modifier.height(16.dp))

            // Audio sliders group
            Column(
                modifier = Modifier
                    .fillMaxWidth()
                    .background(DarkSurface, shape = RoundedCornerShape(12.dp))
                    .border(1.dp, BorderMetal, shape = RoundedCornerShape(12.dp))
                    .padding(16.dp),
                verticalArrangement = Arrangement.spacedBy(16.dp)
            ) {
                Text(
                    text = "AUDIO CONTROLS",
                    fontSize = 10.sp,
                    fontFamily = FontFamily.Monospace,
                    fontWeight = FontWeight.Bold,
                    color = TextSecondary
                )

                // Master Volume
                VolumeSliderItem(
                    label = "Master Volume",
                    value = gameState.settings.masterVolume,
                    onValueChange = { gameState.updateVolume("master", it) }
                )

                // Music Volume
                VolumeSliderItem(
                    label = "BGM Music",
                    value = gameState.settings.musicVolume,
                    onValueChange = { gameState.updateVolume("music", it) }
                )

                // SFX Volume
                VolumeSliderItem(
                    label = "SFX Sounds",
                    value = gameState.settings.sfxVolume,
                    onValueChange = { gameState.updateVolume("sfx", it) }
                )
            }

            Spacer(modifier = Modifier.height(16.dp))

            // Game mechanics toggles
            Column(
                modifier = Modifier
                    .fillMaxWidth()
                    .background(DarkSurface, shape = RoundedCornerShape(12.dp))
                    .border(1.dp, BorderMetal, shape = RoundedCornerShape(12.dp))
                    .padding(16.dp),
                verticalArrangement = Arrangement.spacedBy(14.dp)
            ) {
                Text(
                    text = "HAPTICS & SPECIAL EFFECTS",
                    fontSize = 10.sp,
                    fontFamily = FontFamily.Monospace,
                    fontWeight = FontWeight.Bold,
                    color = TextSecondary
                )

                ToggleItem(
                    label = "Haptic Feedback",
                    desc = "Vibrates device on espresso pull or counter spill",
                    checked = gameState.settings.hapticFeedback,
                    onToggle = { gameState.toggleSetting("haptic") }
                )

                ToggleItem(
                    label = "Screen Shake",
                    desc = "Shakes camera when incoming trains roll in",
                    checked = gameState.settings.screenShake,
                    onToggle = { gameState.toggleSetting("shake") }
                )

                ToggleItem(
                    label = "Rush Red Flashes",
                    desc = "Flashes warning bezel when in rush hour",
                    checked = gameState.settings.rushFlashes,
                    onToggle = { gameState.toggleSetting("rush") }
                )
            }

            Spacer(modifier = Modifier.height(16.dp))

            // FUTURE UPDATE ARCHITECTURE BLOCK
            Column(
                modifier = Modifier
                    .fillMaxWidth()
                    .background(Color(0xFF1E1A3D), shape = RoundedCornerShape(12.dp))
                    .border(1.dp, PurpleAccent, shape = RoundedCornerShape(12.dp))
                    .padding(16.dp),
                verticalArrangement = Arrangement.spacedBy(10.dp)
            ) {
                Text(
                    text = "📶 APK DISTRIBUTION SYSTEM",
                    fontSize = 11.sp,
                    fontFamily = FontFamily.Monospace,
                    fontWeight = FontWeight.Bold,
                    color = AmberAccent
                )

                Text(
                    text = "This application is ready for self-hosted updates. In the future, tapping below will query GitHub releases, fetch the signed APK payload, and launch the native Android package installer.",
                    fontSize = 11.sp,
                    color = TextPrimary,
                    lineHeight = 16.sp
                )

                Spacer(modifier = Modifier.height(6.dp))

                Button(
                    onClick = {
                        checkUpdateStatus = "Connecting to GitHub..."
                        // Simulate update check
                        gameState.triggerToast("Update Checker: Already running latest build v1.0.0", "📶")
                        checkUpdateStatus = "v1.0.0 (Up to Date)"
                    },
                    modifier = Modifier.fillMaxWidth(),
                    colors = ButtonDefaults.buttonColors(containerColor = PurpleAccent),
                    shape = RoundedCornerShape(10.dp)
                ) {
                    Text(
                        text = "CHECK FOR SYSTEM UPDATES",
                        fontFamily = FontFamily.Monospace,
                        fontSize = 11.sp,
                        fontWeight = FontWeight.Bold
                    )
                }

                Text(
                    text = "Current Status: $checkUpdateStatus",
                    fontSize = 10.sp,
                    fontFamily = FontFamily.Monospace,
                    color = TextSecondary,
                    modifier = Modifier.fillMaxWidth(),
                    textAlign = TextAlign.Center
                )
            }

            Spacer(modifier = Modifier.height(30.dp))
        }
    }
}

@Composable
fun VolumeSliderItem(
    label: String,
    value: Int,
    onValueChange: (Int) -> Unit
) {
    Column {
        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.SpaceBetween
        ) {
            Text(text = label, fontSize = 13.sp, color = TextPrimary)
            Text(text = "$value%", fontSize = 13.sp, fontFamily = FontFamily.Monospace, color = AmberAccent)
        }
        Slider(
            value = value.toFloat(),
            onValueChange = { onValueChange(it.toInt()) },
            valueRange = 0f..100f,
            colors = SliderDefaults.colors(
                thumbColor = AmberAccent,
                activeTrackColor = AmberAccent,
                inactiveTrackColor = Color(0xFF221E3E)
            )
        )
    }
}

@Composable
fun ToggleItem(
    label: String,
    desc: String,
    checked: Boolean,
    onToggle: () -> Unit
) {
    Row(
        modifier = Modifier
            .fillMaxWidth()
            .clickable { onToggle() },
        horizontalArrangement = Arrangement.SpaceBetween,
        verticalAlignment = Alignment.CenterVertically
    ) {
        Column(modifier = Modifier.weight(1f)) {
            Text(text = label, fontSize = 13.sp, fontWeight = FontWeight.Bold, color = TextPrimary)
            Text(text = desc, fontSize = 11.sp, color = TextSecondary)
        }
        Switch(
            checked = checked,
            onCheckedChange = { onToggle() },
            colors = SwitchDefaults.colors(
                checkedThumbColor = AmberAccent,
                checkedTrackColor = Color(0xFF513D8F)
            )
        )
    }
}
