package com.espressoexpress.arcade.ui.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.espressoexpress.arcade.AppScreen
import com.espressoexpress.arcade.game.GameState
import com.espressoexpress.arcade.ui.theme.*

@Composable
fun MainMenuScreen(
    gameState: GameState,
    onNavigateTo: (AppScreen) -> Unit
) {
    Box(
        modifier = Modifier
            .fillMaxSize()
            .background(DarkBackground)
            .padding(24.dp)
    ) {
        // Subtle Subway Grid lines
        Column(
            modifier = Modifier.fillMaxSize(),
            verticalArrangement = Arrangement.SpaceBetween,
            horizontalAlignment = Alignment.CenterHorizontally
        ) {
            // Subway Route Badge / Banner
            Row(
                modifier = Modifier
                    .background(Color(0xFF1F1A3A), shape = RoundedCornerShape(8.dp))
                    .padding(horizontal = 12.dp, vertical = 6.dp)
                    .border(1.dp, AmberAccent, shape = RoundedCornerShape(8.dp)),
                verticalAlignment = Alignment.CenterVertically
            ) {
                Box(
                    modifier = Modifier
                        .size(8.dp)
                        .background(Color.Red, shape = RoundedCornerShape(4.dp))
                )
                Spacer(modifier = Modifier.width(8.dp))
                Text(
                    text = "PLATFORM 9 • GRAND CENTRAL LINE",
                    fontFamily = FontFamily.Monospace,
                    fontSize = 11.sp,
                    color = Color.White,
                    fontWeight = FontWeight.Bold
                )
            }

            Spacer(modifier = Modifier.height(24.dp))

            // Main Logo Title
            Column(horizontalAlignment = Alignment.CenterHorizontally) {
                Text(
                    text = "ESPRESSO",
                    fontSize = 42.sp,
                    fontFamily = FontFamily.Monospace,
                    fontWeight = FontWeight.ExtraBold,
                    color = Color.White,
                    letterSpacing = 2.sp,
                    textAlign = TextAlign.Center
                )
                Text(
                    text = "EXPRESS",
                    fontSize = 48.sp,
                    fontFamily = FontFamily.Monospace,
                    fontWeight = FontWeight.ExtraBold,
                    color = AmberAccent,
                    letterSpacing = 4.sp,
                    textAlign = TextAlign.Center
                )
                Spacer(modifier = Modifier.height(12.dp))
                Text(
                    text = "Serve Speed. Master Steam. Beat the Train!",
                    fontSize = 13.sp,
                    color = TextSecondary,
                    textAlign = TextAlign.Center
                )
            }

            Spacer(modifier = Modifier.weight(1f))

            // Stats Quick View Box
            Column(
                modifier = Modifier
                    .fillMaxWidth()
                    .background(DarkSurface, shape = RoundedCornerShape(12.dp))
                    .border(1.dp, BorderMetal, shape = RoundedCornerShape(12.dp))
                    .padding(16.dp),
                horizontalAlignment = Alignment.CenterHorizontally
            ) {
                Text(
                    text = "STATS & PROGRESS",
                    fontSize = 10.sp,
                    fontFamily = FontFamily.Monospace,
                    fontWeight = FontWeight.Bold,
                    color = TextSecondary
                )
                Spacer(modifier = Modifier.height(8.dp))
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceAround
                ) {
                    Column(horizontalAlignment = Alignment.CenterHorizontally) {
                        Text(text = "LEVEL", fontSize = 11.sp, color = TextSecondary)
                        Text(text = "${gameState.level}", fontSize = 18.sp, fontWeight = FontWeight.Bold, color = AmberAccent)
                    }
                    Column(horizontalAlignment = Alignment.CenterHorizontally) {
                        Text(text = "EARNINGS", fontSize = 11.sp, color = TextSecondary)
                        Text(text = "$${"%.2f".format(gameState.totalEarnings)}", fontSize = 18.sp, fontWeight = FontWeight.Bold, color = EmeraldAccent)
                    }
                    Column(horizontalAlignment = Alignment.CenterHorizontally) {
                        Text(text = "COMBO", fontSize = 11.sp, color = TextSecondary)
                        Text(text = "x${gameState.highestCombo}", fontSize = 18.sp, fontWeight = FontWeight.Bold, color = SkyAccent)
                    }
                }
            }

            Spacer(modifier = Modifier.height(24.dp))

            // Arcade Buttons Menu Block
            Column(
                modifier = Modifier.fillMaxWidth(),
                verticalArrangement = Arrangement.spacedBy(12.dp)
            ) {
                Button(
                    onClick = {
                        gameState.startShift()
                        onNavigateTo(AppScreen.GAME)
                    },
                    modifier = Modifier
                        .fillMaxWidth()
                        .height(56.dp),
                    colors = ButtonDefaults.buttonColors(containerColor = AmberAccent),
                    shape = RoundedCornerShape(14.dp)
                ) {
                    Text(
                        text = "⚡ START SHIFT ⚡",
                        fontFamily = FontFamily.Monospace,
                        fontWeight = FontWeight.Bold,
                        fontSize = 16.sp,
                        color = Color.Black
                    )
                }

                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.spacedBy(12.dp)
                ) {
                    Button(
                        onClick = { onNavigateTo(AppScreen.UPGRADES) },
                        modifier = Modifier
                            .weight(1f)
                            .height(50.dp),
                        colors = ButtonDefaults.buttonColors(containerColor = PurpleAccent),
                        shape = RoundedCornerShape(12.dp)
                    ) {
                        Text(
                            text = "🛒 SHOP",
                            fontFamily = FontFamily.Monospace,
                            fontWeight = FontWeight.Bold,
                            fontSize = 13.sp,
                            color = Color.White
                        )
                    }

                    Button(
                        onClick = { onNavigateTo(AppScreen.SETTINGS) },
                        modifier = Modifier
                            .weight(1f)
                            .height(50.dp),
                        colors = ButtonDefaults.buttonColors(containerColor = SubwayMetal),
                        shape = RoundedCornerShape(12.dp)
                    ) {
                        Text(
                            text = "⚙️ OPTIONS",
                            fontFamily = FontFamily.Monospace,
                            fontWeight = FontWeight.Bold,
                            fontSize = 13.sp,
                            color = Color.White
                        )
                    }
                }
            }

            Spacer(modifier = Modifier.height(24.dp))

            // Footer branding
            Text(
                text = "ESPRESSO EXPRESS v1.0.0 • MADE IN KOTLIN",
                fontSize = 9.sp,
                fontFamily = FontFamily.Monospace,
                color = TextSecondary
            )
        }
    }
}
