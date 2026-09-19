package com.espressoexpress.arcade.ui.screens

import androidx.compose.animation.core.*
import androidx.compose.foundation.*
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.draw.rotate
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.Path
import androidx.compose.ui.graphics.graphicsLayer
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.espressoexpress.arcade.AppScreen
import com.espressoexpress.arcade.game.GameState
import com.espressoexpress.arcade.game.OrderTicket
import com.espressoexpress.arcade.ui.theme.*
import kotlin.math.sin

@Composable
fun GameScreen(
    gameState: GameState,
    onNavigateTo: (AppScreen) -> Unit
) {
    if (!gameState.isShiftActive) {
        LaunchedEffect(Unit) {
            onNavigateTo(AppScreen.RESULTS)
        }
    }

    // Infinite animations for subway ambiance, vibrating train, and characters
    val infiniteTransition = rememberInfiniteTransition(label = "GameScreenAnims")
    
    val trainWobble by infiniteTransition.animateFloat(
        initialValue = -0.5f,
        targetValue = 0.5f,
        animationSpec = infiniteRepeatable(
            animation = tween(150, easing = LinearEasing),
            repeatMode = RepeatMode.Reverse
        ),
        label = "TrainWobble"
    )

    val neonFlickerAlpha by infiniteTransition.animateFloat(
        initialValue = 0.8f,
        targetValue = 1.0f,
        animationSpec = infiniteRepeatable(
            animation = tween(800, easing = EaseInOutSine),
            repeatMode = RepeatMode.Reverse
        ),
        label = "PosterFlicker"
    )

    val bubbleSize by infiniteTransition.animateFloat(
        initialValue = 10f,
        targetValue = 24f,
        animationSpec = infiniteRepeatable(
            animation = tween(1500, easing = EaseInOutSine),
            repeatMode = RepeatMode.Reverse
        ),
        label = "BubbleSize"
    )

    val waveOffset by infiniteTransition.animateFloat(
        initialValue = 0f,
        targetValue = 360f,
        animationSpec = infiniteRepeatable(
            animation = tween(2000, easing = LinearEasing),
            repeatMode = RepeatMode.Restart
        ),
        label = "WaveOffset"
    )

    Box(
        modifier = Modifier
            .fillMaxSize()
            .background(Color(0xFF0F0C1B))
    ) {
        Column(modifier = Modifier.fillMaxSize()) {
            
            // 1. MINIMAL RETRO HUD BAR (TOP)
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .background(Color(0xFF130E26))
                    .padding(horizontal = 14.dp, vertical = 8.dp),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                // Earnings
                Column {
                    Text(
                        text = "CASH EARNED",
                        fontSize = 8.sp,
                        fontFamily = FontFamily.Monospace,
                        color = Color(0xFF94A3B8),
                        fontWeight = FontWeight.Bold
                    )
                    Text(
                        text = "$${"%.2f".format(gameState.shiftEarnings)}",
                        fontSize = 18.sp,
                        fontWeight = FontWeight.Black,
                        color = Color(0xFF10B981)
                    )
                }

                // Streak Combo
                Box(
                    modifier = Modifier
                        .background(
                            if (gameState.shiftComboStreak > 1) Color(0xFFFBBF24) else Color(0xFF1E1B3A),
                            shape = RoundedCornerShape(8.dp)
                        )
                        .border(
                            2.dp,
                            if (gameState.shiftComboStreak > 1) Color(0xFF1A162B) else Color(0xFF334155),
                            shape = RoundedCornerShape(8.dp)
                        )
                        .padding(horizontal = 10.dp, vertical = 5.dp)
                ) {
                    Text(
                        text = "STREAK x${gameState.shiftComboStreak}",
                        fontSize = 10.5.sp,
                        fontWeight = FontWeight.Black,
                        color = if (gameState.shiftComboStreak > 1) Color.Black else Color(0xFF94A3B8),
                        fontFamily = FontFamily.Monospace
                    )
                }

                // Inbound Train Timer
                Column(horizontalAlignment = Alignment.End) {
                    Text(
                        text = "TRAIN INBOUND",
                        fontSize = 8.sp,
                        fontFamily = FontFamily.Monospace,
                        color = Color(0xFF94A3B8),
                        fontWeight = FontWeight.Bold
                    )
                    Text(
                        text = "0:${if (gameState.trainSecondsLeft < 10) "0" else ""}${gameState.trainSecondsLeft}s",
                        fontSize = 16.sp,
                        fontWeight = FontWeight.Black,
                        color = if (gameState.isRushActive) Color(0xFFEF4444) else Color(0xFFF59E0B),
                        fontFamily = FontFamily.Monospace
                    )
                }
            }
            Box(modifier = Modifier.fillMaxWidth().height(3.dp).background(Color(0xFF1A162B)))

            // CHAOS LEVEL SLIDER
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .background(Color(0xFF0F0C1B))
                    .padding(horizontal = 14.dp, vertical = 4.dp),
                verticalAlignment = Alignment.CenterVertically
            ) {
                Text(
                    text = "CHAOS METER:",
                    fontSize = 8.sp,
                    fontFamily = FontFamily.Monospace,
                    fontWeight = FontWeight.Bold,
                    color = Color(0xFF94A3B8)
                )
                Spacer(modifier = Modifier.width(8.dp))
                Box(
                    modifier = Modifier
                        .weight(1f)
                        .height(10.dp)
                        .background(Color(0xFF1A162B), shape = RoundedCornerShape(999.dp))
                        .border(1.5.dp, Color(0xFF334155), shape = RoundedCornerShape(999.dp))
                ) {
                    Box(
                        modifier = Modifier
                            .fillMaxHeight()
                            .fillMaxWidth(gameState.shiftChaosLevel / 100f)
                            .background(
                                Brush.horizontalGradient(
                                    colors = listOf(
                                        Color(0xFF3B82F6),
                                        Color(0xFFF59E0B),
                                        Color(0xFFEF4444)
                                    )
                                ),
                                shape = RoundedCornerShape(999.dp)
                            )
                    )
                }
                Spacer(modifier = Modifier.width(8.dp))
                Text(
                    text = "${gameState.shiftChaosLevel.toInt()}%",
                    fontSize = 9.sp,
                    fontFamily = FontFamily.Monospace,
                    fontWeight = FontWeight.Black,
                    color = if (gameState.shiftChaosLevel > 70f) Color(0xFFEF4444) else Color(0xFFFBBF24)
                )
            }

            // 2. SUBWAY WORLD BACKDROP (LAYER 1)
            Box(
                modifier = Modifier
                    .fillMaxWidth()
                    .height(145.dp)
                    .background(Color(0xFF17122E))
            ) {
                // Conduit piping background canvas
                Canvas(modifier = Modifier.fillMaxSize()) {
                    // Draw parallel conduit cables
                    drawRect(color = Color(0xFF100B21))
                    drawLine(color = Color(0xFF261F4D), start = androidx.compose.ui.geometry.Offset(0f, 15f), end = androidx.compose.ui.geometry.Offset(size.width, 15f), strokeWidth = 2.dp.toPx())
                    drawLine(color = Color(0xFF261F4D), start = androidx.compose.ui.geometry.Offset(0f, 30f), end = androidx.compose.ui.geometry.Offset(size.width, 30f), strokeWidth = 3.dp.toPx())
                    drawLine(color = Color(0xFF261F4D), start = androidx.compose.ui.geometry.Offset(0f, 40f), end = androidx.compose.ui.geometry.Offset(size.width, 40f), strokeWidth = 1.5.dp.toPx())
                }

                // Hanging pendant lamps with light cones
                Row(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(horizontal = 40.dp),
                    horizontalArrangement = Arrangement.SpaceBetween
                ) {
                    repeat(2) {
                        Column(horizontalAlignment = Alignment.CenterHorizontally) {
                            // Wire
                            Box(modifier = Modifier.size(2.dp, 16.dp).background(Color(0xFF64748B)))
                            // Hood
                            Box(modifier = Modifier.size(16.dp, 8.dp).background(Color(0xFFF59E0B), shape = RoundedCornerShape(topStart = 4.dp, topEnd = 4.dp)))
                            // Soft yellow light cone
                            Canvas(modifier = Modifier.size(60.dp, 80.dp)) {
                                val path = Path().apply {
                                    moveTo(size.width / 2f - 4f, 0f)
                                    lineTo(size.width / 2f + 4f, 0f)
                                    lineTo(size.width, size.height)
                                    lineTo(0f, size.height)
                                    close()
                                }
                                drawPath(
                                    path = path,
                                    brush = Brush.verticalGradient(
                                        colors = listOf(
                                            Color(0x55FEF08A),
                                            Color(0x00FEF08A)
                                        )
                                    )
                                )
                            }
                        }
                    }
                }

                // MTA Direction Signboard plaque
                Row(
                    modifier = Modifier
                        .align(Alignment.TopCenter)
                        .offset(y = 10.dp)
                        .background(Color(0xFF090C16), shape = RoundedCornerShape(4.dp))
                        .border(2.dp, Color(0xFF475569), shape = RoundedCornerShape(4.dp))
                        .padding(horizontal = 8.dp, vertical = 4.dp),
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Box(
                        modifier = Modifier
                            .size(16.dp)
                            .background(Color(0xFFF97316), shape = CircleShape),
                        contentAlignment = Alignment.Center
                    ) {
                        Text(text = "A", fontSize = 10.sp, fontWeight = FontWeight.Black, color = Color.White)
                    }
                    Spacer(modifier = Modifier.width(6.dp))
                    Column {
                        Text(
                            text = "UPTOWN & BRONX",
                            fontSize = 8.sp,
                            fontFamily = FontFamily.Monospace,
                            fontWeight = FontWeight.Bold,
                            color = Color.White
                        )
                        Text(
                            text = "NEXT TRAIN: PLATFORM 9",
                            fontSize = 6.sp,
                            fontFamily = FontFamily.Monospace,
                            color = Color(0xFF38BDF8)
                        )
                    }
                }

                // Flickering Poster billboard
                Box(
                    modifier = Modifier
                        .align(Alignment.TopStart)
                        .offset(x = 12.dp, y = 30.dp)
                        .size(64.dp, 48.dp)
                        .background(Color(0xFF1E1B3A), shape = RoundedCornerShape(3.dp))
                        .border(1.5.dp, Color(0xFF334155), shape = RoundedCornerShape(3.dp))
                        .graphicsLayer { alpha = neonFlickerAlpha }
                        .padding(4.dp),
                    contentAlignment = Alignment.Center
                ) {
                    Text(
                        text = "NEED\nFOCUS?\nDRINK!",
                        fontSize = 8.sp,
                        fontWeight = FontWeight.Black,
                        color = Color(0xFFF59E0B),
                        textAlign = TextAlign.Center,
                        lineHeight = 10.sp,
                        fontFamily = FontFamily.Monospace
                    )
                }

                // THE METALLIC TRAIN CAR (wobbles on rush hour)
                val activeTrainOffset = if (gameState.isRushActive) trainWobble else 0f
                Box(
                    modifier = Modifier
                        .align(Alignment.BottomCenter)
                        .fillMaxWidth(0.92f)
                        .height(72.dp)
                        .offset(y = 4.dp + activeTrainOffset.dp)
                        .background(
                            Brush.verticalGradient(
                                colors = listOf(Color(0xFF64748B), Color(0xFF334155))
                            ),
                            shape = RoundedCornerShape(topStart = 12.dp, topEnd = 12.dp)
                        )
                        .border(3.dp, Color(0xFF1A162B), shape = RoundedCornerShape(topStart = 12.dp, topEnd = 12.dp))
                ) {
                    // Yellow stripe
                    Box(
                        modifier = Modifier
                            .fillMaxWidth()
                            .height(10.dp)
                            .offset(y = 12.dp)
                            .background(Color(0xFF1A162B))
                    ) {
                        Box(
                            modifier = Modifier
                                .fillMaxWidth()
                                .height(7.dp)
                                .align(Alignment.Center)
                                .background(Color(0xFFFBBF24))
                        ) {
                            Text(
                                text = "MTA METRO COMMUTER EXPRESS • CAR #204",
                                fontSize = 6.sp,
                                fontWeight = FontWeight.Bold,
                                color = Color.Black,
                                modifier = Modifier.align(Alignment.Center)
                            )
                        }
                    }

                    // Windows with glass glare & silhouettes
                    Row(
                        modifier = Modifier
                            .fillMaxWidth()
                            .padding(horizontal = 20.dp)
                            .offset(y = 28.dp),
                        horizontalArrangement = Arrangement.SpaceBetween
                    ) {
                        repeat(3) { index ->
                            if (index == 1) {
                                // Passenger Doorway showing commuter silhouette inside
                                Box(
                                    modifier = Modifier
                                        .size(38.dp, 42.dp)
                                        .background(Color(0xFF0F0C1B))
                                        .border(2.dp, Color(0xFF1A162B))
                                ) {
                                    // Yellow Hazard Floor Diagonal stripes
                                    Canvas(modifier = Modifier.fillMaxWidth().height(4.dp).align(Alignment.BottomCenter)) {
                                        drawRect(color = Color(0xFFFBBF24))
                                        drawLine(color = Color.Black, start = androidx.compose.ui.geometry.Offset(0f, 0f), end = androidx.compose.ui.geometry.Offset(size.width, size.height), strokeWidth = 1.5.dp.toPx())
                                    }
                                    // Door Commuter Silhouette
                                    Text(
                                        text = "👤",
                                        fontSize = 20.sp,
                                        modifier = Modifier.align(Alignment.BottomCenter)
                                    )
                                }
                            } else {
                                // Sealed train window
                                Box(
                                    modifier = Modifier
                                        .size(42.dp, 22.dp)
                                        .background(Color(0xFF1E1B3A), shape = RoundedCornerShape(4.dp))
                                        .border(2.dp, Color(0xFF1A162B), shape = RoundedCornerShape(4.dp))
                                ) {
                                    // Slanted translucent white window glare overlay
                                    Canvas(modifier = Modifier.fillMaxSize()) {
                                        val path = Path().apply {
                                            moveTo(size.width * 0.4f, 0f)
                                            lineTo(size.width * 0.6f, 0f)
                                            lineTo(size.width * 0.3f, size.height)
                                            lineTo(size.width * 0.1f, size.height)
                                            close()
                                        }
                                        drawPath(path = path, color = Color(0x33FFFFFF))
                                    }
                                    // Silent Commuter Silhouette
                                    Text(
                                        text = "👤",
                                        fontSize = 12.sp,
                                        modifier = Modifier.align(Alignment.BottomCenter).graphicsLayer { alpha = 0.5f }
                                    )
                                }
                            }
                        }
                    }
                }

                // Platform Yellow tactile bumps edge
                Column(
                    modifier = Modifier
                        .align(Alignment.BottomCenter)
                        .fillMaxWidth()
                ) {
                    Box(modifier = Modifier.fillMaxWidth().height(2.dp).background(Color(0xFF1A162B)))
                    Row(
                        modifier = Modifier
                            .fillMaxWidth()
                            .height(6.dp)
                            .background(Color(0xFFEAB308)),
                        horizontalArrangement = Arrangement.SpaceEvenly,
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        repeat(14) {
                            Box(
                                modifier = Modifier
                                    .size(6.dp, 3.dp)
                                    .background(Color(0xFFB45309), shape = RoundedCornerShape(1.dp))
                            )
                        }
                    }
                }
            }
            Box(modifier = Modifier.fillMaxWidth().height(3.dp).background(Color(0xFF1A162B)))

            // 3. HORIZONTAL CUSTOMERS QUEUE CONTAINER
            Column(
                modifier = Modifier
                    .fillMaxWidth()
                    .background(Color(0xFF0F0C1B))
                    .padding(vertical = 10.dp)
            ) {
                Row(
                    modifier = Modifier
                        .fillMaxWidth()
                        .horizontalScroll(rememberScrollState())
                        .padding(horizontal = 14.dp),
                    horizontalArrangement = Arrangement.spacedBy(16.dp),
                    verticalAlignment = Alignment.Bottom
                ) {
                    if (gameState.activeOrders.isEmpty()) {
                        Box(
                            modifier = Modifier
                                .fillMaxWidth()
                                .height(110.dp),
                            contentAlignment = Alignment.Center
                        ) {
                            Text(
                                text = "☕ NO CUSTOMERS YET. PREP YOUR INGREDIENTS!",
                                fontSize = 10.sp,
                                fontWeight = FontWeight.Bold,
                                color = Color(0xFF64748B),
                                fontFamily = FontFamily.Monospace
                            )
                        }
                    } else {
                        gameState.activeOrders.forEach { order ->
                            val isSelected = gameState.selectedOrderId == order.id
                            
                            Column(
                                horizontalAlignment = Alignment.CenterHorizontally,
                                modifier = Modifier
                                    .clickable { gameState.selectedOrderId = order.id }
                                    .padding(vertical = 4.dp)
                            ) {
                                // 2D Speech Bubble (Pointed Down to Sprite)
                                Box(
                                    modifier = Modifier
                                        .width(155.dp)
                                        .background(Color(0xFFFDFBF7), shape = RoundedCornerShape(10.dp))
                                        .border(
                                            width = if (isSelected) 3.dp else 2.dp,
                                            color = if (isSelected) Color(0xFFF59E0B) else Color(0xFF1A162B),
                                            shape = RoundedCornerShape(10.dp)
                                        )
                                        .padding(8.dp)
                                ) {
                                    Column {
                                        // Selected state label
                                        if (isSelected) {
                                            Text(
                                                text = "🎯 TARGET SELECTED",
                                                fontSize = 7.5.sp,
                                                fontWeight = FontWeight.Black,
                                                color = Color(0xFFF59E0B),
                                                fontFamily = FontFamily.Monospace,
                                                modifier = Modifier.padding(bottom = 2.dp)
                                            )
                                        }

                                        Row(
                                            modifier = Modifier.fillMaxWidth(),
                                            horizontalArrangement = Arrangement.SpaceBetween
                                        ) {
                                            Text(
                                                text = order.customerName.uppercase(),
                                                fontSize = 9.5.sp,
                                                fontWeight = FontWeight.Black,
                                                color = Color(0xFF1A162B)
                                            )
                                            Text(
                                                text = "#${order.id}",
                                                fontSize = 7.5.sp,
                                                fontFamily = FontFamily.Monospace,
                                                color = Color(0xFF64748B),
                                                fontWeight = FontWeight.Bold
                                            )
                                        }

                                        Divider(color = Color(0xFFE2E8F0), thickness = 1.dp, modifier = Modifier.padding(vertical = 3.dp))

                                        // Drink order text
                                        Text(
                                            text = "${order.size.uppercase()} ${order.drinkName.uppercase()}",
                                            fontSize = 11.sp,
                                            fontWeight = FontWeight.Black,
                                            color = Color(0xFF1E1B2E)
                                        )
                                        
                                        // Dynamic prices
                                        val price = when (order.size) {
                                            "Small" -> 3.50
                                            "Medium" -> 4.50
                                            else -> 5.50
                                        }
                                        val patienceTip = order.patience * 1.50
                                        Text(
                                            text = "$${"%.2f".format(price)} (+$${"%.2f".format(patienceTip)} tip)",
                                            fontSize = 8.sp,
                                            color = Color(0xFF047857),
                                            fontWeight = FontWeight.ExtraBold,
                                            fontFamily = FontFamily.Monospace
                                        )
                                    }
                                }

                                // Bubble arrow pointer (Canvas drawing of a small triangle pointing down)
                                Canvas(
                                    modifier = Modifier
                                        .size(12.dp, 6.dp)
                                        .offset(y = (-1).dp)
                                ) {
                                    val path = Path().apply {
                                        moveTo(0f, 0f)
                                        lineTo(size.width, 0f)
                                        lineTo(size.width / 2f, size.height)
                                        close()
                                    }
                                    drawPath(path = path, color = Color(0xFFFDFBF7))
                                    // Border outlines on triangle sides
                                    drawLine(color = Color(0xFF1A162B), start = androidx.compose.ui.geometry.Offset(0f, 0f), end = androidx.compose.ui.geometry.Offset(size.width / 2f, size.height), strokeWidth = 2.dp.toPx())
                                    drawLine(color = Color(0xFF1A162B), start = androidx.compose.ui.geometry.Offset(size.width, 0f), end = androidx.compose.ui.geometry.Offset(size.width / 2f, size.height), strokeWidth = 2.dp.toPx())
                                }

                                Spacer(modifier = Modifier.height(4.dp))

                                // Dynamic 2D cartoon character drawings
                                Box(
                                    modifier = Modifier.size(56.dp, 62.dp),
                                    contentAlignment = Alignment.BottomCenter
                                ) {
                                    CustomerSprite(type = order.customerType, avatar = order.avatar, bubbleSize = bubbleSize)
                                }

                                Spacer(modifier = Modifier.height(6.dp))

                                // Patience progress bar
                                LinearProgressIndicator(
                                    progress = order.patience,
                                    modifier = Modifier
                                        .width(72.dp)
                                        .height(5.dp)
                                        .border(1.dp, Color(0xFF1A162B), shape = RoundedCornerShape(999.dp))
                                        .clip(RoundedCornerShape(999.dp)),
                                    color = if (order.patience > 0.5f) Color(0xFF10B981) else if (order.patience > 0.25f) Color(0xFFFBBF24) else Color(0xFFEF4444),
                                    trackColor = Color(0xFF2E274F)
                                )
                            }
                        }
                    }
                }
            }

            // 4. ACTIVE TARGET ORDER RECIPE BANNER (LIGHTS UP AS YOU BUILD)
            val currentSelectedOrder = gameState.activeOrders.find { it.id == gameState.selectedOrderId }
            if (currentSelectedOrder != null) {
                Column(modifier = Modifier.fillMaxWidth()) {
                    Box(modifier = Modifier.fillMaxWidth().height(2.dp).background(Color(0xFF1A162B)))
                    Row(
                        modifier = Modifier
                            .fillMaxWidth()
                            .background(Color(0xFF1D1735))
                            .padding(horizontal = 14.dp, vertical = 6.dp),
                        horizontalArrangement = Arrangement.spacedBy(6.dp),
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Text(
                            text = "RECIPE CHECKS:",
                            fontSize = 7.5.sp,
                            fontFamily = FontFamily.Monospace,
                            color = Color(0xFF94A3B8),
                            fontWeight = FontWeight.Bold
                        )

                        // Size Badge
                        val cupSizeMatches = gameState.workbench.currentCupSize == currentSelectedOrder.size
                        RecipeChip(
                            label = "SIZE: ${currentSelectedOrder.size.uppercase()}",
                            status = if (cupSizeMatches) RecipeStatus.MATCHED else if (gameState.workbench.currentCupSize == "None") RecipeStatus.PENDING else RecipeStatus.FAILED
                        )

                        // Shots Badge
                        val shotsMatches = gameState.workbench.brewedShots >= currentSelectedOrder.shots
                        RecipeChip(
                            label = "SHOTS: ${gameState.workbench.brewedShots}/${currentSelectedOrder.shots}",
                            status = if (shotsMatches) RecipeStatus.MATCHED else if (gameState.workbench.brewedShots == 0) RecipeStatus.PENDING else RecipeStatus.FAILED
                        )

                        // Milk Badge
                        val milkMatches = (currentSelectedOrder.milk == "None" && gameState.workbench.milkType == "None") ||
                                          (currentSelectedOrder.milk != "None" && gameState.workbench.milkType == currentSelectedOrder.milk)
                        val milkSteamedMatches = currentSelectedOrder.milk == "None" || gameState.workbench.milkSteamed
                        
                        RecipeChip(
                            label = if (currentSelectedOrder.milk == "None") "MILK: NO" else "MILK: ${currentSelectedOrder.milk.substringBefore(" ")}",
                            status = if (milkMatches && milkSteamedMatches) RecipeStatus.MATCHED else if (gameState.workbench.milkType == "None") RecipeStatus.PENDING else RecipeStatus.FAILED
                        )

                        // Syrup Badge
                        val syrupMatches = (currentSelectedOrder.syrup == "None" && gameState.workbench.syrupType == "None") ||
                                           (currentSelectedOrder.syrup != "None" && gameState.workbench.syrupType == currentSelectedOrder.syrupFlavor)
                        RecipeChip(
                            label = if (currentSelectedOrder.syrup == "None") "SYRUP: NO" else "SYRUP: ${currentSelectedOrder.syrup.uppercase()}",
                            status = if (syrupMatches) RecipeStatus.MATCHED else if (gameState.workbench.syrupType == "None") RecipeStatus.PENDING else RecipeStatus.FAILED
                        )

                        // Ice Badge
                        val iceMatches = currentSelectedOrder.hasIce == (gameState.workbench.iceScoops > 0)
                        RecipeChip(
                            label = if (currentSelectedOrder.hasIce) "ICE: YES" else "ICE: NO",
                            status = if (iceMatches) RecipeStatus.MATCHED else RecipeStatus.PENDING
                        )
                    }
                    Box(modifier = Modifier.fillMaxWidth().height(2.dp).background(Color(0xFF1A162B)))
                }
            }

            // 5. THE 5 PHYSICAL COFFEE STATIONS IN A COMPACT CABINET GRID
            Box(
                modifier = Modifier
                    .weight(1f)
                    .fillMaxWidth()
                    .background(Color(0xFF0F0C1B))
                    .padding(horizontal = 14.dp, vertical = 6.dp)
            ) {
                Column(
                    modifier = Modifier
                        .fillMaxSize()
                        .verticalScroll(rememberScrollState()),
                    verticalArrangement = Arrangement.spacedBy(8.dp)
                ) {
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.spacedBy(8.dp)
                    ) {
                        // STATION 1: Cup Grinder
                        Box(modifier = Modifier.weight(1f)) {
                            PhysicalCabinet(title = "1. GRIND & CUP", statusTag = if (gameState.workbench.currentCupSize != "None") "CUP HELD" else "READY") {
                                Row(
                                    modifier = Modifier.fillMaxWidth(),
                                    horizontalArrangement = Arrangement.spacedBy(4.dp)
                                ) {
                                    Column(modifier = Modifier.weight(1.3f), verticalArrangement = Arrangement.spacedBy(4.dp)) {
                                        CabinetBtn(text = "SMALL", color = Color(0xFF64748B)) { gameState.grabCup("Small") }
                                        CabinetBtn(text = "MEDIUM", color = Color(0xFF64748B)) { gameState.grabCup("Medium") }
                                        CabinetBtn(text = "LARGE", color = Color(0xFF64748B)) { gameState.grabCup("Large") }
                                    }
                                    Box(modifier = Modifier.weight(1.1f)) {
                                        Button(
                                            onClick = { gameState.grindBeans() },
                                            modifier = Modifier
                                                .fillMaxHeight()
                                                .fillMaxWidth()
                                                .border(2.5.dp, Color(0xFF1A162B), shape = RoundedCornerShape(8.dp)),
                                            colors = ButtonDefaults.buttonColors(containerColor = Color(0xFF8B5CF6)),
                                            shape = RoundedCornerShape(8.dp),
                                            contentPadding = PaddingValues(0.dp)
                                        ) {
                                            Text(
                                                text = "⚙️\nGRIND\nBEANS",
                                                fontSize = 9.sp,
                                                fontWeight = FontWeight.Black,
                                                textAlign = TextAlign.Center,
                                                fontFamily = FontFamily.Monospace,
                                                lineHeight = 11.sp,
                                                color = Color.White
                                            )
                                        }
                                    }
                                }
                            }
                        }

                        // STATION 2: Espresso Brewer
                        Box(modifier = Modifier.weight(1f)) {
                            PhysicalCabinet(title = "2. BREW ESPRESSO", statusTag = "${gameState.workbench.brewedShots} SHOTS PULL") {
                                Column(
                                    modifier = Modifier.fillMaxWidth(),
                                    verticalArrangement = Arrangement.spacedBy(4.dp)
                                ) {
                                    CabinetBtn(text = "☕ 1X SHOT (SGL)", color = Color(0xFFF59E0B)) { gameState.pullEspressoShot(1) }
                                    CabinetBtn(text = "☕ 2X SHOTS (DBL)", color = Color(0xFFD97706)) { gameState.pullEspressoShot(2) }
                                    
                                    Box(
                                        modifier = Modifier
                                            .fillMaxWidth()
                                            .height(28.dp)
                                            .background(Color(0xFF0F0C1B), shape = RoundedCornerShape(6.dp))
                                            .border(1.5.dp, Color(0xFF334155), shape = RoundedCornerShape(6.dp)),
                                        contentAlignment = Alignment.Center
                                    ) {
                                        Text(
                                            text = if (gameState.workbench.hasGrinds) "✓ GRINDS PACKED" else "⏳ NO GRINDS",
                                            fontSize = 8.sp,
                                            fontWeight = FontWeight.Bold,
                                            color = if (gameState.workbench.hasGrinds) Color(0xFF10B981) else Color(0xFF94A3B8),
                                            fontFamily = FontFamily.Monospace
                                        )
                                    }
                                }
                            }
                        }
                    }

                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.spacedBy(8.dp)
                    ) {
                        // STATION 3: Milk Steamer
                        Box(modifier = Modifier.weight(1f)) {
                            PhysicalCabinet(title = "3. STEAM WAND", statusTag = if (gameState.workbench.milkSteamed) "STEAMED" else "COLD") {
                                Column(
                                    modifier = Modifier.fillMaxWidth(),
                                    verticalArrangement = Arrangement.spacedBy(4.dp)
                                ) {
                                    Row(horizontalArrangement = Arrangement.spacedBy(4.dp)) {
                                        Box(modifier = Modifier.weight(1f)) {
                                            CabinetBtn(text = "WHOLE", color = Color(0xFF475569)) { gameState.selectMilk("Whole Milk") }
                                        }
                                        Box(modifier = Modifier.weight(1f)) {
                                            CabinetBtn(text = "OAT", color = Color(0xFFB45309)) { gameState.selectMilk("Oat Milk") }
                                        }
                                    }
                                    CabinetBtn(text = "💨 STEAM MICROFOAM", color = Color(0xFF0EA5E9)) { gameState.frothMilk() }
                                }
                            }
                        }

                        // STATION 4: Syrups Dispenser
                        Box(modifier = Modifier.weight(1f)) {
                            PhysicalCabinet(title = "4. SYRUPS", statusTag = if (gameState.workbench.syrupPumps > 0) "${gameState.workbench.syrupPumps} PUMPS" else "EMPTY") {
                                Column(
                                    modifier = Modifier.fillMaxWidth(),
                                    verticalArrangement = Arrangement.spacedBy(4.dp)
                                ) {
                                    CabinetBtn(text = "🍯 CARAMEL", color = Color(0xFFD97706)) { gameState.addSyrup("Caramel") }
                                    CabinetBtn(text = "🍦 VANILLA", color = Color(0xFFFCD34D)) { gameState.addSyrup("Vanilla") }
                                    CabinetBtn(text = "🍫 MOCHA SYRUP", color = Color(0xFF451A03)) { gameState.addSyrup("Mocha") }
                                }
                            }
                        }
                    }

                    // STATION 5: Ice Well
                    PhysicalCabinet(title = "5. ICE WELL WELL & WATER DISPENSER", statusTag = "COLD WELL ACTIVE") {
                        Row(
                            modifier = Modifier.fillMaxWidth(),
                            horizontalArrangement = Arrangement.spacedBy(6.dp)
                        ) {
                            Box(modifier = Modifier.weight(1f)) {
                                CabinetBtn(text = "❄️ SCOOP ICE CRYSTAL", color = Color(0xFF38BDF8)) { gameState.addIce() }
                            }
                            Box(modifier = Modifier.weight(1f)) {
                                Button(
                                    onClick = { gameState.workbench.milkType = "Water"; gameState.triggerToast("Added Hot Water", "💧") },
                                    modifier = Modifier
                                        .fillMaxWidth()
                                        .height(30.dp)
                                        .border(2.dp, Color(0xFF1A162B), shape = RoundedCornerShape(8.dp)),
                                    colors = ButtonDefaults.buttonColors(containerColor = Color(0xFF2563EB)),
                                    shape = RoundedCornerShape(8.dp),
                                    contentPadding = PaddingValues(0.dp)
                                ) {
                                    Text(
                                        text = "💧 ADD HOT WATER",
                                        fontSize = 9.sp,
                                        fontWeight = FontWeight.Black,
                                        fontFamily = FontFamily.Monospace,
                                        color = Color.White
                                    )
                                }
                            }
                        }
                    }

                    Spacer(modifier = Modifier.height(24.dp))
                }
            }

            // 6. BOTTOM PINNED BARISTA PLAYER TRAY & GLOBAL CONTROLS
            Column(modifier = Modifier.fillMaxWidth()) {
                Box(modifier = Modifier.fillMaxWidth().height(3.dp).background(Color(0xFF1A162B)))
                Row(
                    modifier = Modifier
                        .fillMaxWidth()
                        .background(Color(0xFF130E26))
                        .padding(horizontal = 14.dp, vertical = 10.dp),
                    horizontalArrangement = Arrangement.spacedBy(8.dp),
                    verticalAlignment = Alignment.CenterVertically
                ) {
                // Barista Avatar badge (with visor)
                Box(
                    modifier = Modifier
                        .size(46.dp)
                        .background(Color(0xFF1E1B3A), shape = CircleShape)
                        .border(2.dp, Color(0xFFFBBF24), shape = CircleShape),
                    contentAlignment = Alignment.Center
                ) {
                    Canvas(modifier = Modifier.fillMaxSize()) {
                        // visor cap
                        drawArc(color = Color(0xFF047857), startAngle = 180f, sweepAngle = 180f, useCenter = true)
                        // face skin
                        drawCircle(color = Color(0xFFFED7AA), radius = size.minDimension * 0.35f, center = center)
                        // visor brim
                        drawLine(color = Color(0xFF10B981), start = androidx.compose.ui.geometry.Offset(5f, size.height / 2f), end = androidx.compose.ui.geometry.Offset(size.width - 5f, size.height / 2f), strokeWidth = 3.dp.toPx())
                    }
                    Text(
                        text = "★",
                        fontSize = 11.sp,
                        fontWeight = FontWeight.Black,
                        color = Color.White,
                        modifier = Modifier.align(Alignment.BottomEnd).offset(x = 2.dp, y = 2.dp)
                    )
                }

                // Barista Active Hands display & controls
                Column(
                    modifier = Modifier.weight(1.1f)
                ) {
                    Text(
                        text = "BARISTA HANDS:",
                        fontSize = 7.sp,
                        fontFamily = FontFamily.Monospace,
                        color = Color(0xFF94A3B8),
                        fontWeight = FontWeight.Bold
                    )
                    Spacer(modifier = Modifier.height(2.dp))
                    Box(
                        modifier = Modifier
                            .fillMaxWidth()
                            .background(Color(0xFF0F0C1B), shape = RoundedCornerShape(6.dp))
                            .border(1.5.dp, Color(0xFF334155), shape = RoundedCornerShape(6.dp))
                            .padding(horizontal = 6.dp, vertical = 3.dp),
                        contentAlignment = Alignment.CenterStart
                    ) {
                        Text(
                            text = gameState.workbench.getHeldItemDisplay().uppercase(),
                            fontSize = 8.sp,
                            fontWeight = FontWeight.Black,
                            fontFamily = FontFamily.Monospace,
                            color = if (gameState.workbench.hasSpill) Color(0xFFEF4444) else Color.White,
                            maxLines = 1
                        )
                    }
                }

                // Action controls: wipe, trash, serve
                Row(
                    modifier = Modifier.weight(1.9f),
                    horizontalArrangement = Arrangement.spacedBy(4.dp)
                ) {
                    // Wipe Sponge (only visible / highlighted when spill is active)
                    Button(
                        onClick = { gameState.cleanCounter() },
                        modifier = Modifier
                            .weight(1f)
                            .height(42.dp)
                            .border(
                                width = 2.dp,
                                color = if (gameState.workbench.hasSpill) Color(0xFFFBBF24) else Color(0xFF1A162B),
                                shape = RoundedCornerShape(8.dp)
                            ),
                        colors = ButtonDefaults.buttonColors(
                            containerColor = if (gameState.workbench.hasSpill) Color(0xFFD97706) else Color(0xFF475569)
                        ),
                        shape = RoundedCornerShape(8.dp),
                        contentPadding = PaddingValues(0.dp)
                    ) {
                        Text(
                            text = "🧽\nWIPE",
                            fontSize = 8.5.sp,
                            fontWeight = FontWeight.Black,
                            fontFamily = FontFamily.Monospace,
                            lineHeight = 10.sp,
                            textAlign = TextAlign.Center,
                            color = Color.White
                        )
                    }

                    // Dump trash
                    Button(
                        onClick = { gameState.dumpDrink() },
                        modifier = Modifier
                            .weight(1f)
                            .height(42.dp)
                            .border(2.dp, Color(0xFF1A162B), shape = RoundedCornerShape(8.dp)),
                        colors = ButtonDefaults.buttonColors(containerColor = Color(0xFF991B1B)),
                        shape = RoundedCornerShape(8.dp),
                        contentPadding = PaddingValues(0.dp)
                    ) {
                        Text(
                            text = "🗑️\nDUMP",
                            fontSize = 8.5.sp,
                            fontWeight = FontWeight.Black,
                            fontFamily = FontFamily.Monospace,
                            lineHeight = 10.sp,
                            textAlign = TextAlign.Center,
                            color = Color.White
                        )
                    }

                    // SERVE BUTTON
                    Button(
                        onClick = { gameState.serveCurrentDrink() },
                        modifier = Modifier
                            .weight(2.2f)
                            .height(42.dp)
                            .border(2.5.dp, Color(0xFF1A162B), shape = RoundedCornerShape(10.dp)),
                        colors = ButtonDefaults.buttonColors(containerColor = Color(0xFF10B981)),
                        shape = RoundedCornerShape(10.dp),
                        contentPadding = PaddingValues(0.dp)
                    ) {
                        Text(
                            text = "✅ SERVE DRINK",
                            fontSize = 9.5.sp,
                            fontWeight = FontWeight.Black,
                            fontFamily = FontFamily.Monospace,
                            color = Color.White
                        )
                    }
                }
                }
            }
        }

        // 7. TOASTS NOTIFICATIONS LAYER OVERLAY
        Column(
            modifier = Modifier
                .align(Alignment.BottomCenter)
                .padding(bottom = 80.dp)
                .fillMaxWidth(),
            horizontalAlignment = Alignment.CenterHorizontally,
            verticalArrangement = Arrangement.spacedBy(6.dp)
        ) {
            gameState.activeToasts.forEach { toast ->
                Row(
                    modifier = Modifier
                        .background(Color(0xE60F0C1B), shape = RoundedCornerShape(8.dp))
                        .border(2.dp, Color(0xFFFBBF24), shape = RoundedCornerShape(8.dp))
                        .padding(horizontal = 12.dp, vertical = 6.dp),
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Text(text = toast.second, fontSize = 14.sp)
                    Spacer(modifier = Modifier.width(6.dp))
                    Text(
                        text = toast.first.uppercase(),
                        fontSize = 10.sp,
                        color = Color.White,
                        fontWeight = FontWeight.Black,
                        fontFamily = FontFamily.Monospace
                    )
                }
            }
        }
    }
}

// 2D NATIVE CARTOON SPRITES DRAWER IN COMPOSE
@Composable
fun CustomerSprite(type: String, avatar: String, bubbleSize: Float) {
    Canvas(modifier = Modifier.fillMaxSize()) {
        val w = size.width
        val h = size.height

        when (type) {
            "Wall Street Exec" -> {
                // Orange peach skin head box
                drawRect(color = Color(0xFFFED7AA), size = androidx.compose.ui.geometry.Size(w * 0.5f, h * 0.45f), topLeft = androidx.compose.ui.geometry.Offset(w * 0.25f, h * 0.15f))
                // Dark hair box on top
                drawRect(color = Color(0xFF451A03), size = androidx.compose.ui.geometry.Size(w * 0.5f, h * 0.12f), topLeft = androidx.compose.ui.geometry.Offset(w * 0.25f, h * 0.1f))
                // Angry red pupil cartoon eyes
                drawCircle(color = Color.White, radius = 4f, center = androidx.compose.ui.geometry.Offset(w * 0.38f, h * 0.28f))
                drawCircle(color = Color.White, radius = 4f, center = androidx.compose.ui.geometry.Offset(w * 0.62f, h * 0.28f))
                drawCircle(color = Color.Red, radius = 2f, center = androidx.compose.ui.geometry.Offset(w * 0.38f, h * 0.28f))
                drawCircle(color = Color.Red, radius = 2f, center = androidx.compose.ui.geometry.Offset(w * 0.62f, h * 0.28f))
                // Slanted angry eyebrows
                drawLine(color = Color(0xFF1A162B), start = androidx.compose.ui.geometry.Offset(w * 0.3f, h * 0.22f), end = androidx.compose.ui.geometry.Offset(w * 0.46f, h * 0.26f), strokeWidth = 3f)
                drawLine(color = Color(0xFF1A162B), start = androidx.compose.ui.geometry.Offset(w * 0.7f, h * 0.22f), end = androidx.compose.ui.geometry.Offset(w * 0.54f, h * 0.26f), strokeWidth = 3f)
                // Shouting mouth
                drawRect(color = Color(0xFF881337), size = androidx.compose.ui.geometry.Size(w * 0.16f, h * 0.08f), topLeft = androidx.compose.ui.geometry.Offset(w * 0.42f, h * 0.38f))

                // Blue Suit Torso
                val suitPath = Path().apply {
                    moveTo(w * 0.15f, h)
                    lineTo(w * 0.85f, h)
                    lineTo(w * 0.7f, h * 0.6f)
                    lineTo(w * 0.3f, h * 0.6f)
                    close()
                }
                drawPath(path = suitPath, color = Color(0xFF1E3A8A))
                // Crooked red necktie
                val tiePath = Path().apply {
                    moveTo(w * 0.46f, h * 0.6f)
                    lineTo(w * 0.54f, h * 0.6f)
                    lineTo(w * 0.58f, h * 0.85f)
                    lineTo(w * 0.5f, h * 0.92f)
                    lineTo(w * 0.42f, h * 0.85f)
                    close()
                }
                drawPath(path = tiePath, color = Color(0xFFDC2626))
                
                // Brown briefcase arm
                drawRect(color = Color(0xFF78350F), size = androidx.compose.ui.geometry.Size(w * 0.16f, h * 0.25f), topLeft = androidx.compose.ui.geometry.Offset(w * 0.08f, h * 0.75f))
                drawRect(color = Color(0xFF451A03), size = androidx.compose.ui.geometry.Size(w * 0.08f, h * 0.04f), topLeft = androidx.compose.ui.geometry.Offset(w * 0.12f, h * 0.71f))
            }
            "Night-Shift Nurse" -> {
                // Skin
                drawRect(color = Color(0xFFFED7AA), size = androidx.compose.ui.geometry.Size(w * 0.5f, h * 0.45f), topLeft = androidx.compose.ui.geometry.Offset(w * 0.25f, h * 0.2f))
                // Large green slouchy beanie
                drawRoundRect(
                    color = Color(0xFF047857),
                    size = androidx.compose.ui.geometry.Size(w * 0.58f, h * 0.22f),
                    topLeft = androidx.compose.ui.geometry.Offset(w * 0.21f, h * 0.08f),
                    cornerRadius = androidx.compose.ui.geometry.CornerRadius(10f, 10f)
                )
                // Sleepy eyes with grey eye bags
                drawCircle(color = Color(0xFF94A3B8), radius = 6f, center = androidx.compose.ui.geometry.Offset(w * 0.38f, h * 0.35f))
                drawCircle(color = Color(0xFF94A3B8), radius = 6f, center = androidx.compose.ui.geometry.Offset(w * 0.62f, h * 0.35f))
                drawLine(color = Color(0xFF1E1B2E), start = androidx.compose.ui.geometry.Offset(w * 0.32f, h * 0.34f), end = androidx.compose.ui.geometry.Offset(w * 0.44f, h * 0.34f), strokeWidth = 3f)
                drawLine(color = Color(0xFF1E1B2E), start = androidx.compose.ui.geometry.Offset(w * 0.56f, h * 0.34f), end = androidx.compose.ui.geometry.Offset(w * 0.68f, h * 0.34f), strokeWidth = 3f)
                
                // Drool mouth & drip
                drawCircle(color = Color(0xFF881337), radius = 3.5f, center = androidx.compose.ui.geometry.Offset(w * 0.5f, h * 0.46f))
                drawCircle(color = Color(0xFF38BDF8), radius = 2.5f, center = androidx.compose.ui.geometry.Offset(w * 0.53f, h * 0.53f))

                // Grey slouchy hoodie
                val nursePath = Path().apply {
                    moveTo(w * 0.15f, h)
                    lineTo(w * 0.85f, h)
                    lineTo(w * 0.72f, h * 0.65f)
                    lineTo(w * 0.28f, h * 0.65f)
                    close()
                }
                drawPath(path = nursePath, color = Color(0xFF475569))
            }
            "Campus Influencer" -> {
                // Skin
                drawRect(color = Color(0xFFFED7AA), size = androidx.compose.ui.geometry.Size(w * 0.5f, h * 0.42f), topLeft = androidx.compose.ui.geometry.Offset(w * 0.25f, h * 0.2f))
                // Bright yellow neon headphone band on top
                drawArc(color = Color(0xFFFACC15), startAngle = 180f, sweepAngle = 180f, useCenter = false, topLeft = androidx.compose.ui.geometry.Offset(w * 0.2f, h * 0.08f), size = androidx.compose.ui.geometry.Size(w * 0.6f, h * 0.3f), style = androidx.compose.ui.graphics.drawscope.Stroke(width = 6f))
                // Large ear cushions
                drawCircle(color = Color(0xFFEAB308), radius = 8f, center = androidx.compose.ui.geometry.Offset(w * 0.22f, h * 0.35f))
                drawCircle(color = Color(0xFFEAB308), radius = 8f, center = androidx.compose.ui.geometry.Offset(w * 0.78f, h * 0.35f))

                // Big dark round sunglasses
                drawCircle(color = Color(0xFF1E1B2E), radius = 7.5f, center = androidx.compose.ui.geometry.Offset(w * 0.38f, h * 0.32f))
                drawCircle(color = Color(0xFF1E1B2E), radius = 7.5f, center = androidx.compose.ui.geometry.Offset(w * 0.62f, h * 0.32f))
                drawLine(color = Color(0xFF1E1B2E), start = androidx.compose.ui.geometry.Offset(w * 0.38f, h * 0.32f), end = androidx.compose.ui.geometry.Offset(w * 0.62f, h * 0.32f), strokeWidth = 3f)

                // Torso with pink bubblegum jacket
                val influencerPath = Path().apply {
                    moveTo(w * 0.15f, h)
                    lineTo(w * 0.85f, h)
                    lineTo(w * 0.7f, h * 0.62f)
                    lineTo(w * 0.3f, h * 0.62f)
                    close()
                }
                drawPath(path = influencerPath, color = Color(0xFFEC4899))

                // Expanding Pink Bubblegum Bubble (animated sizing)
                drawCircle(color = Color(0xCCF472B6), radius = bubbleSize, center = androidx.compose.ui.geometry.Offset(w * 0.5f, h * 0.52f))
            }
            else -> { // Line Conductor / standard
                // Skin
                drawRect(color = Color(0xFFFED7AA), size = androidx.compose.ui.geometry.Size(w * 0.5f, h * 0.45f), topLeft = androidx.compose.ui.geometry.Offset(w * 0.25f, h * 0.2f))
                // Blue Conductor Hat
                drawRect(color = Color(0xFF1E1B2E), size = androidx.compose.ui.geometry.Size(w * 0.54f, h * 0.18f), topLeft = androidx.compose.ui.geometry.Offset(w * 0.23f, h * 0.1f))
                drawRect(color = Color(0xFFFBBF24), size = androidx.compose.ui.geometry.Size(w * 0.54f, h * 0.04f), topLeft = androidx.compose.ui.geometry.Offset(w * 0.23f, h * 0.24f))
                
                // Spectacles
                drawCircle(color = Color(0x3338BDF8), radius = 6.5f, center = androidx.compose.ui.geometry.Offset(w * 0.38f, h * 0.35f), style = androidx.compose.ui.graphics.drawscope.Stroke(width = 2f))
                drawCircle(color = Color(0x3338BDF8), radius = 6.5f, center = androidx.compose.ui.geometry.Offset(w * 0.62f, h * 0.35f), style = androidx.compose.ui.graphics.drawscope.Stroke(width = 2f))
                drawLine(color = Color(0xFF1E1B2E), start = androidx.compose.ui.geometry.Offset(w * 0.44f, h * 0.35f), end = androidx.compose.ui.geometry.Offset(w * 0.56f, h * 0.35f), strokeWidth = 2f)

                // Conductors bushy brown mustache
                drawRoundRect(color = Color(0xFF78350F), topLeft = androidx.compose.ui.geometry.Offset(w * 0.32f, h * 0.46f), size = androidx.compose.ui.geometry.Size(w * 0.36f, h * 0.08f), cornerRadius = androidx.compose.ui.geometry.CornerRadius(4f, 4f))

                // Dark Uniform torso with gold brass buttons
                val uniformPath = Path().apply {
                    moveTo(w * 0.15f, h)
                    lineTo(w * 0.85f, h)
                    lineTo(w * 0.72f, h * 0.65f)
                    lineTo(w * 0.28f, h * 0.65f)
                    close()
                }
                drawPath(path = uniformPath, color = Color(0xFF111827))
                
                // Brass buttons
                drawCircle(color = Color(0xFFF59E0B), radius = 3f, center = androidx.compose.ui.geometry.Offset(w * 0.5f, h * 0.75f))
                drawCircle(color = Color(0xFFF59E0B), radius = 3f, center = androidx.compose.ui.geometry.Offset(w * 0.5f, h * 0.88f))
            }
        }
        
        // Solid black outline on overall silhouette
        drawRect(color = Color(0xFF1A162B), size = size, style = androidx.compose.ui.graphics.drawscope.Stroke(width = 2.5.dp.toPx()))
    }
}

// RECIPE BADGE CHIP RENDERER
@Composable
fun RecipeChip(label: String, status: RecipeStatus) {
    val containerColor = when (status) {
        RecipeStatus.MATCHED -> Color(0xFF047857)
        RecipeStatus.FAILED -> Color(0xFF7F1D1D)
        RecipeStatus.PENDING -> Color(0xFF312E81)
    }
    
    val textColor = when (status) {
        RecipeStatus.MATCHED -> Color(0xFFD1FAE5)
        RecipeStatus.FAILED -> Color(0xFFFEE2E2)
        RecipeStatus.PENDING -> Color(0xFFE0E7FF)
    }

    Box(
        modifier = Modifier
            .background(containerColor, shape = RoundedCornerShape(4.dp))
            .border(1.dp, Color(0xFF1A162B), shape = RoundedCornerShape(4.dp))
            .padding(horizontal = 6.dp, vertical = 2.dp)
    ) {
        Text(
            text = label,
            fontSize = 7.sp,
            fontWeight = FontWeight.Black,
            fontFamily = FontFamily.Monospace,
            color = textColor
        )
    }
}

enum class RecipeStatus {
    MATCHED, FAILED, PENDING
}

// PHYSICAL RETRO MACHINE CABINET CELL RENDERER
@Composable
fun PhysicalCabinet(
    title: String,
    statusTag: String,
    content: @Composable () -> Unit
) {
    Column(
        modifier = Modifier
            .fillMaxWidth()
            .background(Color(0xFF18142C), shape = RoundedCornerShape(10.dp))
            .border(3.dp, Color(0xFF1A162B), shape = RoundedCornerShape(10.dp))
            .padding(8.dp)
    ) {
        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.SpaceBetween,
            verticalAlignment = Alignment.CenterVertically
        ) {
            Text(
                text = title,
                fontSize = 8.5.sp,
                fontFamily = FontFamily.Monospace,
                fontWeight = FontWeight.Black,
                color = Color(0xFFFBBF24)
            )
            Box(
                modifier = Modifier
                    .background(Color(0xFF0F0C1B), shape = RoundedCornerShape(4.dp))
                    .padding(horizontal = 4.dp, vertical = 1.5.dp)
            ) {
                Text(
                    text = statusTag.uppercase(),
                    fontSize = 6.5.sp,
                    fontFamily = FontFamily.Monospace,
                    fontWeight = FontWeight.Black,
                    color = Color(0xFF34D399)
                )
            }
        }
        
        Divider(color = Color(0xFF1A162B), thickness = 2.dp, modifier = Modifier.padding(vertical = 5.dp))
        
        content()
    }
}

// HEAVY RETRO OUTLINED BUTTON
@Composable
fun CabinetBtn(text: String, color: Color, onClick: () -> Unit) {
    Button(
        onClick = onClick,
        modifier = Modifier
            .fillMaxWidth()
            .height(30.dp)
            .border(2.dp, Color(0xFF1A162B), shape = RoundedCornerShape(8.dp)),
        colors = ButtonDefaults.buttonColors(containerColor = color),
        shape = RoundedCornerShape(8.dp),
        contentPadding = PaddingValues(0.dp)
    ) {
        Text(
            text = text,
            fontSize = 9.sp,
            fontWeight = FontWeight.Black,
            fontFamily = FontFamily.Monospace,
            color = Color.White
        )
    }
}

