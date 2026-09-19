package com.espressoexpress.arcade.ui.screens

import androidx.compose.animation.core.*
import androidx.compose.foundation.Canvas
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.graphicsLayer
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
    // Infinite animation for rising steam and bouncing cup emblem
    val infiniteTransition = rememberInfiniteTransition(label = "MainMenuAnims")
    
    val bounceY by infiniteTransition.animateFloat(
        initialValue = 0f,
        targetValue = -6f,
        animationSpec = infiniteRepeatable(
            animation = tween(1200, easing = FastOutSlowInEasing),
            repeatMode = RepeatMode.Reverse
        ),
        label = "CupBounce"
    )

    val steam1Alpha by infiniteTransition.animateFloat(
        initialValue = 0.2f,
        targetValue = 0.9f,
        animationSpec = infiniteRepeatable(
            animation = tween(1400, easing = FastOutSlowInEasing),
            repeatMode = RepeatMode.Reverse
        ),
        label = "Steam1Alpha"
    )
    
    val steam2Y by infiniteTransition.animateFloat(
        initialValue = 4f,
        targetValue = -12f,
        animationSpec = infiniteRepeatable(
            animation = tween(1800, easing = LinearEasing),
            repeatMode = RepeatMode.Restart
        ),
        label = "Steam2Y"
    )

    Box(
        modifier = Modifier
            .fillMaxSize()
            .background(
                Brush.radialGradient(
                    colors = listOf(
                        Color(0xFF2A1F47),
                        Color(0xFF17122B),
                        Color(0xFF0D0A19)
                    ),
                    radius = 1200f
                )
            )
            .padding(20.dp)
    ) {
        // Subway Ambient Top Glow overlay
        Box(
            modifier = Modifier
                .fillMaxWidth()
                .height(140.dp)
                .background(
                    Brush.verticalGradient(
                        colors = listOf(
                            Color(0x1BFA8F0C),
                            Color.Transparent
                        )
                    )
                )
                .align(Alignment.TopCenter)
        )

        Column(
            modifier = Modifier.fillMaxSize(),
            verticalArrangement = Arrangement.SpaceBetween,
            horizontalAlignment = Alignment.CenterHorizontally
        ) {
            // 1. TOP BAR: LEVEL BADGE & CURRENCY
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(top = 10.dp),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                // Level Badge
                Row(
                    modifier = Modifier
                        .background(Color(0xE619142A), shape = RoundedCornerShape(999.dp))
                        .border(2.dp, Color(0xFF4A3A78), shape = RoundedCornerShape(999.dp))
                        .padding(horizontal = 10.dp, vertical = 4.dp),
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Box(
                        modifier = Modifier
                            .size(22.dp)
                            .background(Color(0xFF047857), shape = CircleShape)
                            .border(1.5.dp, Color(0xFF34D399), shape = CircleShape),
                        contentAlignment = Alignment.Center
                    ) {
                        Text(
                            text = "★",
                            fontSize = 11.sp,
                            fontWeight = FontWeight.Black,
                            color = Color.White
                        )
                    }
                    Spacer(modifier = Modifier.width(6.dp))
                    Column {
                        Text(
                            text = "LVL ${gameState.level} BARISTA",
                            fontSize = 8.5.sp,
                            fontFamily = FontFamily.Monospace,
                            fontWeight = FontWeight.Bold,
                            color = Color(0xFFFEF08A)
                        )
                        Text(
                            text = "PLATFORM 9 KIOSK",
                            fontSize = 7.sp,
                            fontWeight = FontWeight.ExtraBold,
                            color = Color(0xFF94A3B8)
                        )
                    }
                }

                // Coin & Token Progress Pills
                Row(horizontalArrangement = Arrangement.spacedBy(6.dp)) {
                    // Cash pill
                    Row(
                        modifier = Modifier
                            .background(Color(0xFF1E1B2E), shape = RoundedCornerShape(999.dp))
                            .border(2.dp, Color(0xFF1A162B), shape = RoundedCornerShape(999.dp))
                            .padding(horizontal = 10.dp, vertical = 4.dp),
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Box(
                            modifier = Modifier
                                .size(16.dp)
                                .background(Color(0xFFEAB308), shape = CircleShape),
                            contentAlignment = Alignment.Center
                        ) {
                            Text(
                                text = "$",
                                fontSize = 10.sp,
                                fontWeight = FontWeight.Bold,
                                color = Color(0xFF451A03)
                            )
                        }
                        Spacer(modifier = Modifier.width(4.dp))
                        Text(
                            text = "$${gameState.totalEarnings.toInt()}",
                            fontSize = 11.sp,
                            fontFamily = FontFamily.Monospace,
                            fontWeight = FontWeight.Bold,
                            color = Color.White
                        )
                    }

                    // Tokens Pill
                    Row(
                        modifier = Modifier
                            .background(Color(0xFF1E1B2E), shape = RoundedCornerShape(999.dp))
                            .border(2.dp, Color(0xFF1A162B), shape = RoundedCornerShape(999.dp))
                            .padding(horizontal = 10.dp, vertical = 4.dp),
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Box(
                            modifier = Modifier
                                .size(16.dp)
                                .background(Color(0xFF0EA5E9), shape = CircleShape),
                            contentAlignment = Alignment.Center
                        ) {
                            Text(
                                text = "T",
                                fontSize = 10.sp,
                                fontWeight = FontWeight.Bold,
                                color = Color.White
                            )
                        }
                        Spacer(modifier = Modifier.width(4.dp))
                        Text(
                            text = "12",
                            fontSize = 11.sp,
                            fontFamily = FontFamily.Monospace,
                            fontWeight = FontWeight.Bold,
                            color = Color.White
                        )
                    }
                }
            }

            // 2. BRANDING EMBLEM & MAIN TITLE LOGO
            Column(
                horizontalAlignment = Alignment.CenterHorizontally,
                modifier = Modifier.padding(vertical = 15.dp)
            ) {
                // Neon Subway Pill tag
                Row(
                    modifier = Modifier
                        .background(Color(0xFF090C16), shape = RoundedCornerShape(999.dp))
                        .border(2.dp, Color(0xFF38BDF8), shape = RoundedCornerShape(999.dp))
                        .padding(horizontal = 12.dp, vertical = 4.dp),
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Box(
                        modifier = Modifier
                            .size(7.dp)
                            .background(Color(0xFF38BDF8), shape = CircleShape)
                    )
                    Spacer(modifier = Modifier.width(6.dp))
                    Text(
                        text = "MTA GRAND CENTRAL LINE",
                        fontSize = 8.5.sp,
                        fontFamily = FontFamily.Monospace,
                        fontWeight = FontWeight.Bold,
                        color = Color(0xFFBAE6FD),
                        letterSpacing = 0.5.sp
                    )
                }

                Spacer(modifier = Modifier.height(18.dp))

                // Custom Bouncing Steaming Mug Emblem
                Box(
                    modifier = Modifier
                        .size(90.dp)
                        .graphicsLayer { translationY = bounceY },
                    contentAlignment = Alignment.Center
                ) {
                    // Rising steam (two dynamic vectors)
                    Box(
                        modifier = Modifier
                            .size(6.dp, 12.dp)
                            .align(Alignment.TopCenter)
                            .offset(x = (-12).dp, y = (-8).dp + steam2Y.dp)
                            .background(Color(0x99FFFFFF), shape = CircleShape)
                            .graphicsLayer { alpha = steam1Alpha }
                    )
                    Box(
                        modifier = Modifier
                            .size(5.dp, 10.dp)
                            .align(Alignment.TopCenter)
                            .offset(x = 10.dp, y = (-12).dp + bounceY.dp)
                            .background(Color(0x77FFFFFF), shape = CircleShape)
                    )

                    // Cup Handle
                    Box(
                        modifier = Modifier
                            .size(24.dp, 30.dp)
                            .offset(x = 32.dp, y = 4.dp)
                            .background(Color(0xFF1A162B), shape = RoundedCornerShape(12.dp))
                            .border(3.dp, Color(0xFF1A162B), shape = RoundedCornerShape(12.dp))
                    ) {
                        Box(
                            modifier = Modifier
                                .fillMaxSize()
                                .padding(3.dp)
                                .background(Color(0xFFF59E0B), shape = RoundedCornerShape(10.dp))
                        )
                    }

                    // Cup Body
                    Box(
                        modifier = Modifier
                            .size(72.dp, 58.dp)
                            .background(
                                Brush.verticalGradient(
                                    colors = listOf(
                                        Color(0xFFFCD34D),
                                        Color(0xFFF59E0B),
                                        Color(0xFFB45309)
                                    )
                                ),
                                shape = RoundedCornerShape(
                                    bottomStart = 20.dp,
                                    bottomEnd = 20.dp,
                                    topStart = 0.dp,
                                    topEnd = 0.dp
                                )
                            )
                            .border(
                                3.5.dp,
                                Color(0xFF1A162B),
                                shape = RoundedCornerShape(
                                    bottomStart = 20.dp,
                                    bottomEnd = 20.dp,
                                    topStart = 0.dp,
                                    topEnd = 0.dp
                                )
                            ),
                        contentAlignment = Alignment.Center
                    ) {
                        Text(
                            text = "☕",
                            fontSize = 28.sp
                        )
                    }
                }

                Spacer(modifier = Modifier.height(16.dp))

                // Big Bold Comic Retro Titles
                Text(
                    text = "ESPRESSO",
                    fontSize = 38.sp,
                    fontFamily = FontFamily.Monospace,
                    fontWeight = FontWeight.ExtraBold,
                    color = Color(0xFFFEF08A),
                    letterSpacing = 1.sp,
                    textAlign = TextAlign.Center,
                    modifier = Modifier.offset(y = 4.dp)
                )
                Text(
                    text = "EXPRESS",
                    fontSize = 30.sp,
                    fontFamily = FontFamily.Monospace,
                    fontWeight = FontWeight.ExtraBold,
                    color = Color(0xFF38BDF8),
                    letterSpacing = 2.sp,
                    textAlign = TextAlign.Center
                )
                
                Spacer(modifier = Modifier.height(6.dp))
                
                Text(
                    text = "THE SUBWAY RUSH HOUR BARISTA ARCADE",
                    fontSize = 9.sp,
                    fontWeight = FontWeight.ExtraBold,
                    color = Color(0xFFCBD5E1),
                    textAlign = TextAlign.Center,
                    letterSpacing = 0.5.sp
                )
            }

            // 3. STATS QUICK VIEW CARD
            Column(
                modifier = Modifier
                    .fillMaxWidth()
                    .background(Color(0xFF17122B), shape = RoundedCornerShape(12.dp))
                    .border(3.dp, Color(0xFF1A162B), shape = RoundedCornerShape(12.dp))
                    .padding(14.dp),
                horizontalAlignment = Alignment.CenterHorizontally
            ) {
                Text(
                    text = "STATS & PROGRESS",
                    fontSize = 10.sp,
                    fontFamily = FontFamily.Monospace,
                    fontWeight = FontWeight.Bold,
                    color = Color(0xFF94A3B8)
                )
                Spacer(modifier = Modifier.height(8.dp))
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceAround
                ) {
                    Column(horizontalAlignment = Alignment.CenterHorizontally) {
                        Text(text = "LEVEL", fontSize = 10.sp, color = Color(0xFF94A3B8))
                        Text(text = "${gameState.level}", fontSize = 16.sp, fontWeight = FontWeight.Bold, color = Color(0xFFFEF08A))
                    }
                    Column(horizontalAlignment = Alignment.CenterHorizontally) {
                        Text(text = "EARNINGS", fontSize = 10.sp, color = Color(0xFF94A3B8))
                        Text(text = "$${"%.2f".format(gameState.totalEarnings)}", fontSize = 16.sp, fontWeight = FontWeight.Bold, color = Color(0xFF10B981))
                    }
                    Column(horizontalAlignment = Alignment.CenterHorizontally) {
                        Text(text = "COMBO", fontSize = 10.sp, color = Color(0xFF94A3B8))
                        Text(text = "x${gameState.highestCombo}", fontSize = 16.sp, fontWeight = FontWeight.Bold, color = Color(0xFF0EA5E9))
                    }
                }
            }

            Spacer(modifier = Modifier.height(16.dp))

            // 4. ARCADE NAVIGATION BUTTONS
            Column(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(bottom = 10.dp),
                verticalArrangement = Arrangement.spacedBy(10.dp)
            ) {
                if (gameState.isShiftPaused) {
                    // Resume Shift Button
                    Button(
                        onClick = {
                            gameState.resumeShift()
                            onNavigateTo(AppScreen.GAME)
                        },
                        modifier = Modifier
                            .fillMaxWidth()
                            .height(52.dp)
                            .border(3.5.dp, Color(0xFF1A162B), shape = RoundedCornerShape(14.dp)),
                        colors = ButtonDefaults.buttonColors(containerColor = Color(0xFF10B981)),
                        shape = RoundedCornerShape(14.dp)
                    ) {
                        Row(
                            verticalAlignment = Alignment.CenterVertically,
                            horizontalArrangement = Arrangement.Center
                        ) {
                            Text(text = "▶", fontSize = 16.sp, color = Color.White)
                            Spacer(modifier = Modifier.width(6.dp))
                            Text(
                                text = "RESUME PAUSED SHIFT",
                                fontFamily = FontFamily.Monospace,
                                fontWeight = FontWeight.Black,
                                fontSize = 14.sp,
                                color = Color.White
                            )
                        }
                    }
                }

                // Start Shift / Play Button
                Button(
                    onClick = {
                        gameState.startShift()
                        onNavigateTo(AppScreen.GAME)
                    },
                    modifier = Modifier
                        .fillMaxWidth()
                        .height(52.dp)
                        .border(3.5.dp, Color(0xFF1A162B), shape = RoundedCornerShape(14.dp)),
                    colors = ButtonDefaults.buttonColors(containerColor = Color(0xFFFBBF24)),
                    shape = RoundedCornerShape(14.dp)
                ) {
                    Row(
                        verticalAlignment = Alignment.CenterVertically,
                        horizontalArrangement = Arrangement.Center
                    ) {
                        Text(text = "⚡", fontSize = 18.sp)
                        Spacer(modifier = Modifier.width(6.dp))
                        Text(
                            text = if (gameState.isShiftPaused) "START NEW FRESH SHIFT" else "START SHIFT (PLAY)",
                            fontFamily = FontFamily.Monospace,
                            fontWeight = FontWeight.Black,
                            fontSize = 14.sp,
                            color = Color.Black
                        )
                    }
                }

                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.spacedBy(10.dp)
                ) {
                    // Upgrades Button
                    Button(
                        onClick = { onNavigateTo(AppScreen.UPGRADES) },
                        modifier = Modifier
                            .weight(1f)
                            .height(44.dp)
                            .border(2.5.dp, Color(0xFF1A162B), shape = RoundedCornerShape(12.dp)),
                        colors = ButtonDefaults.buttonColors(containerColor = Color(0xFF8B5CF6)),
                        shape = RoundedCornerShape(12.dp)
                    ) {
                        Text(
                            text = "⚙️ UPGRADES",
                            fontFamily = FontFamily.Monospace,
                            fontWeight = FontWeight.Bold,
                            fontSize = 11.sp,
                            color = Color.White
                        )
                    }

                    // Results Button
                    Button(
                        onClick = { onNavigateTo(AppScreen.SETTINGS) },
                        modifier = Modifier
                            .weight(1f)
                            .height(44.dp)
                            .border(2.5.dp, Color(0xFF1A162B), shape = RoundedCornerShape(12.dp)),
                        colors = ButtonDefaults.buttonColors(containerColor = Color(0xFF334155)),
                        shape = RoundedCornerShape(12.dp)
                    ) {
                        Text(
                            text = "⚙ OPTIONS",
                            fontFamily = FontFamily.Monospace,
                            fontWeight = FontWeight.Bold,
                            fontSize = 11.sp,
                            color = Color.White
                        )
                    }
                }
            }

            // Footer
            Text(
                text = "STAGE 1 VISUAL UI BUILD • ESPRESSO EXPRESS",
                fontSize = 8.sp,
                fontFamily = FontFamily.Monospace,
                color = Color(0xFF64748B),
                fontWeight = FontWeight.Bold,
                modifier = Modifier.padding(bottom = 5.dp)
            )
        }
    }
}

