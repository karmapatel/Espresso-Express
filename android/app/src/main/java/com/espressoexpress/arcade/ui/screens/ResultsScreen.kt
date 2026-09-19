package com.espressoexpress.arcade.ui.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.border
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
fun ResultsScreen(
    gameState: GameState,
    onNavigateTo: (AppScreen) -> Unit
) {
    Box(
        modifier = Modifier
            .fillMaxSize()
            .background(DarkBackground)
            .padding(24.dp)
    ) {
        Column(
            modifier = Modifier.fillMaxSize(),
            verticalArrangement = Arrangement.SpaceBetween,
            horizontalAlignment = Alignment.CenterHorizontally
        ) {
            // Screen Header
            Column(horizontalAlignment = Alignment.CenterHorizontally) {
                Text(
                    text = "SHIFT REVIEW",
                    fontSize = 24.sp,
                    fontFamily = FontFamily.Monospace,
                    fontWeight = FontWeight.Bold,
                    color = Color.White
                )
                Text(
                    text = "MTA Platform 9 Espresso Bar",
                    fontSize = 12.sp,
                    fontFamily = FontFamily.Monospace,
                    color = TextSecondary
                )
            }

            // Printed Service Slip Card
            Card(
                modifier = Modifier
                    .fillMaxWidth()
                    .weight(1f)
                    .padding(vertical = 24.dp)
                    .border(1.dp, BorderMetal, shape = RoundedCornerShape(16.dp)),
                colors = CardDefaults.cardColors(containerColor = DarkSurface),
                shape = RoundedCornerShape(16.dp)
            ) {
                Column(
                    modifier = Modifier
                        .fillMaxSize()
                        .padding(20.dp),
                    verticalArrangement = Arrangement.spacedBy(16.dp)
                ) {
                    // Performance Grade Section
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceBetween,
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Column {
                            Text(
                                text = "PERFORMANCE GRADE",
                                fontSize = 10.sp,
                                fontFamily = FontFamily.Monospace,
                                color = TextSecondary
                            )
                            Text(
                                text = "Shift Concluded Successfully",
                                fontSize = 11.sp,
                                color = TextPrimary
                            )
                        }
                        
                        // Grade Badge
                        Box(
                            modifier = Modifier
                                .size(56.dp)
                                .background(
                                    when (gameState.lastShiftGrade) {
                                        "S" -> EmeraldAccent
                                        "A" -> SkyAccent
                                        "B" -> AmberAccent
                                        else -> Color.Red
                                    },
                                    shape = RoundedCornerShape(28.dp)
                                ),
                            contentAlignment = Alignment.Center
                        ) {
                            Text(
                                text = gameState.lastShiftGrade,
                                fontSize = 28.sp,
                                fontWeight = FontWeight.Bold,
                                color = Color.Black,
                                fontFamily = FontFamily.Monospace
                            )
                        }
                    }

                    Divider(color = BorderMetal, thickness = 1.dp)

                    // Line Stats
                    StatLine(label = "Drinks Fulfilled", value = "${gameState.lastShiftCompletedOrders} order(s)")
                    StatLine(label = "Counter Spill Penalties", value = "${gameState.lastShiftSpills} penalty(s)", isAlert = gameState.lastShiftSpills > 0)
                    StatLine(label = "Tip & Gratuity Earnings", value = "$${"%.2f".format(gameState.lastShiftTips)}")
                    StatLine(label = "Maximum Combo Streak", value = "x${gameState.shiftComboStreak}")

                    Divider(color = BorderMetal, thickness = 1.dp)

                    // Shift Total Earnings
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceBetween,
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Text(
                            text = "TOTAL SHIFT PROFIT",
                            fontSize = 13.sp,
                            fontFamily = FontFamily.Monospace,
                            fontWeight = FontWeight.Bold,
                            color = Color.White
                        )
                        Text(
                            text = "$${"%.2f".format(gameState.shiftEarnings)}",
                            fontSize = 22.sp,
                            fontWeight = FontWeight.Bold,
                            color = EmeraldAccent
                        )
                    }
                }
            }

            // Concluding Buttons
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
                        .height(54.dp),
                    colors = ButtonDefaults.buttonColors(containerColor = AmberAccent),
                    shape = RoundedCornerShape(12.dp)
                ) {
                    Text(
                        text = "⚡ START NEXT SHIFT ⚡",
                        fontFamily = FontFamily.Monospace,
                        fontWeight = FontWeight.Bold,
                        fontSize = 14.sp,
                        color = Color.Black
                    )
                }

                Button(
                    onClick = { onNavigateTo(AppScreen.MAIN_MENU) },
                    modifier = Modifier
                        .fillMaxWidth()
                        .height(50.dp),
                    colors = ButtonDefaults.buttonColors(containerColor = SubwayMetal),
                    shape = RoundedCornerShape(12.dp)
                ) {
                    Text(
                        text = "🏠 EXIT TO MAIN MENU",
                        fontFamily = FontFamily.Monospace,
                        fontWeight = FontWeight.Bold,
                        fontSize = 13.sp,
                        color = Color.White
                    )
                }
            }
        }
    }
}

@Composable
fun StatLine(
    label: String,
    value: String,
    isAlert: Boolean = false
) {
    Row(
        modifier = Modifier.fillMaxWidth(),
        horizontalArrangement = Arrangement.SpaceBetween,
        verticalAlignment = Alignment.CenterVertically
    ) {
        Text(
            text = label,
            fontSize = 13.sp,
            color = TextSecondary
        )
        Text(
            text = value,
            fontSize = 14.sp,
            fontWeight = FontWeight.Bold,
            color = if (isAlert) Color.Red else Color.White,
            fontFamily = FontFamily.Monospace
        )
    }
}
