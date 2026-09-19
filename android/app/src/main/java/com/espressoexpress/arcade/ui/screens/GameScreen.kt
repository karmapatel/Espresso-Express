package com.espressoexpress.arcade.ui.screens

import androidx.compose.foundation.*
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.*
import androidx.compose.runtime.*
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
import com.espressoexpress.arcade.game.OrderTicket
import com.espressoexpress.arcade.ui.theme.*

@Composable
fun GameScreen(
    gameState: GameState,
    onNavigateTo: (AppScreen) -> Unit
) {
    if (!gameState.isShiftActive) {
        // Safe navigation fallback if shift ends
        LaunchedEffect(Unit) {
            onNavigateTo(AppScreen.RESULTS)
        }
    }

    Box(
        modifier = Modifier
            .fillMaxSize()
            .background(DarkBackground)
    ) {
        Column(modifier = Modifier.fillMaxSize()) {
            
            // 1. TOP STATS HEADER / HUD
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .background(DarkSurface)
                    .padding(horizontal = 16.dp, vertical = 12.dp),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                // Cash & Train Timer
                Column {
                    Text(
                        text = "CASH EARNED",
                        fontSize = 9.sp,
                        fontFamily = FontFamily.Monospace,
                        color = TextSecondary
                    )
                    Text(
                        text = "$${"%.2f".format(gameState.shiftEarnings)}",
                        fontSize = 20.sp,
                        fontWeight = FontWeight.Bold,
                        color = EmeraldAccent
                    )
                }

                // Combo indicator
                Box(
                    modifier = Modifier
                        .background(
                            if (gameState.shiftComboStreak > 1) AmberAccent else Color(0xFF26213D),
                            shape = RoundedCornerShape(8.dp)
                        )
                        .padding(horizontal = 12.dp, vertical = 6.dp)
                ) {
                    Text(
                        text = if (gameState.shiftComboStreak > 1) "COMBO x${gameState.shiftComboStreak}" else "STREAK x1",
                        fontSize = 12.sp,
                        fontWeight = FontWeight.Bold,
                        color = if (gameState.shiftComboStreak > 1) Color.Black else TextSecondary,
                        fontFamily = FontFamily.Monospace
                    )
                }

                // Subway Timer (Train incoming!)
                Column(horizontalAlignment = Alignment.End) {
                    Text(
                        text = "TRAIN INBOUND",
                        fontSize = 9.sp,
                        fontFamily = FontFamily.Monospace,
                        color = TextSecondary
                    )
                    Text(
                        text = "0:${if (gameState.trainSecondsLeft < 10) "0" else ""}${gameState.trainSecondsLeft}s",
                        fontSize = 18.sp,
                        fontWeight = FontWeight.Bold,
                        color = if (gameState.isRushActive) Color.Red else SubwayGold,
                        fontFamily = FontFamily.Monospace
                    )
                }
            }

            Divider(color = BorderMetal, thickness = 1.dp)

            // CHAOS LEVEL METER
            Column(modifier = Modifier.fillMaxWidth().background(Color(0xFF0C091A)).padding(horizontal = 16.dp, vertical = 4.dp)) {
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Text(
                        text = "STATION CHAOS LEVEL",
                        fontSize = 9.sp,
                        fontFamily = FontFamily.Monospace,
                        color = TextSecondary
                    )
                    Text(
                        text = "${gameState.shiftChaosLevel.toInt()}%",
                        fontSize = 10.sp,
                        fontFamily = FontFamily.Monospace,
                        color = if (gameState.shiftChaosLevel > 70) Color.Red else AmberAccent
                    )
                }
                Spacer(modifier = Modifier.height(3.dp))
                Box(
                    modifier = Modifier
                        .fillMaxWidth()
                        .height(6.dp)
                        .background(Color(0xFF221A3D), shape = RoundedCornerShape(3.dp))
                ) {
                    Box(
                        modifier = Modifier
                            .fillMaxHeight()
                            .fillMaxWidth(gameState.shiftChaosLevel / 100f)
                            .background(
                                if (gameState.shiftChaosLevel > 70) Color.Red else AmberAccent,
                                shape = RoundedCornerShape(3.dp)
                            )
                    )
                }
            }

            // 2. ACTIVE CUSTOMER QUEUE RAIL
            Column(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(16.dp)
            ) {
                Text(
                    text = "CUSTOMER QUEUE (TAP TICKET TO SELECT)",
                    fontSize = 10.sp,
                    fontFamily = FontFamily.Monospace,
                    fontWeight = FontWeight.Bold,
                    color = TextSecondary,
                    modifier = Modifier.padding(bottom = 6.dp)
                )
                
                Row(
                    modifier = Modifier
                        .fillMaxWidth()
                        .horizontalScroll(rememberScrollState()),
                    horizontalArrangement = Arrangement.spacedBy(8.dp)
                ) {
                    gameState.activeOrders.forEach { order ->
                        CustomerCard(
                            order = order,
                            isSelected = gameState.selectedOrderId == order.id,
                            onClick = { gameState.selectedOrderId = order.id }
                        )
                    }
                }
            }

            // 3. WORKBENCH TRAY DISPLAY (Current Hands / Held Items)
            Column(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(horizontal = 16.dp)
                    .background(Color(0xFF231E3D), shape = RoundedCornerShape(12.dp))
                    .border(1.dp, BorderMetal, shape = RoundedCornerShape(12.dp))
                    .padding(12.dp)
            ) {
                Text(
                    text = "MY COUNTERTOP TRAY",
                    fontSize = 10.sp,
                    fontFamily = FontFamily.Monospace,
                    color = TextSecondary
                )
                Spacer(modifier = Modifier.height(4.dp))
                Text(
                    text = gameState.workbench.getHeldItemDisplay(),
                    fontSize = 14.sp,
                    fontWeight = FontWeight.Bold,
                    color = if (gameState.workbench.hasSpill) Color.Red else Color.White
                )
            }

            // 4. THE 5-STATION BAR - TOUCH CONTROLS
            Box(
                modifier = Modifier
                    .weight(1f)
                    .padding(16.dp)
            ) {
                Column(
                    modifier = Modifier
                        .fillMaxSize()
                        .verticalScroll(rememberScrollState()),
                    verticalArrangement = Arrangement.spacedBy(12.dp)
                ) {
                    // ST 1: Cup Selector & Grinder
                    StationGroup(title = "1. CUP SIZE & GRIND BEANS") {
                        Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                            Button(
                                onClick = { gameState.grabCup("Small") },
                                colors = ButtonDefaults.buttonColors(containerColor = SubwayMetal),
                                modifier = Modifier.weight(1f),
                                contentPadding = PaddingValues(4.dp)
                            ) { Text("[S] Cup", fontSize = 11.sp, fontFamily = FontFamily.Monospace) }
                            
                            Button(
                                onClick = { gameState.grabCup("Medium") },
                                colors = ButtonDefaults.buttonColors(containerColor = SubwayMetal),
                                modifier = Modifier.weight(1f),
                                contentPadding = PaddingValues(4.dp)
                            ) { Text("[M] Cup", fontSize = 11.sp, fontFamily = FontFamily.Monospace) }
                            
                            Button(
                                onClick = { gameState.grabCup("Large") },
                                colors = ButtonDefaults.buttonColors(containerColor = SubwayMetal),
                                modifier = Modifier.weight(1f),
                                contentPadding = PaddingValues(4.dp)
                            ) { Text("[L] Cup", fontSize = 11.sp, fontFamily = FontFamily.Monospace) }
                            
                            Button(
                                onClick = { gameState.grindBeans() },
                                colors = ButtonDefaults.buttonColors(containerColor = PurpleAccent),
                                modifier = Modifier.weight(1.2f),
                                contentPadding = PaddingValues(4.dp)
                            ) { Text("⚙️ GRIND", fontSize = 11.sp, fontFamily = FontFamily.Monospace) }
                        }
                    }

                    // ST 2: Espresso Brewer
                    StationGroup(title = "2. DUAL-GROUP ESPRESSO") {
                        Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                            Button(
                                onClick = { gameState.pullEspressoShot(1) },
                                colors = ButtonDefaults.buttonColors(containerColor = AmberAccent),
                                modifier = Modifier.weight(1f)
                            ) { Text("☕ SINGLE SHOT", fontSize = 11.sp, color = Color.Black) }
                            
                            Button(
                                onClick = { gameState.pullEspressoShot(2) },
                                colors = ButtonDefaults.buttonColors(containerColor = AmberAccent),
                                modifier = Modifier.weight(1f)
                            ) { Text("☕ DOUBLE SHOT", fontSize = 11.sp, color = Color.Black) }
                        }
                    }

                    // ST 3: Steamer & Chiller
                    StationGroup(title = "3. STEAM WAND & CHILLER") {
                        Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                            Button(
                                onClick = { gameState.selectMilk("Whole Milk") },
                                colors = ButtonDefaults.buttonColors(containerColor = SubwayMetal),
                                modifier = Modifier.weight(1f)
                            ) { Text("🥛 WHOLE MILK", fontSize = 10.sp) }
                            
                            Button(
                                onClick = { gameState.selectMilk("Oat Milk") },
                                colors = ButtonDefaults.buttonColors(containerColor = SubwayMetal),
                                modifier = Modifier.weight(1f)
                            ) { Text("🥛 OAT MILK", fontSize = 10.sp) }
                            
                            Button(
                                onClick = { gameState.frothMilk() },
                                colors = ButtonDefaults.buttonColors(containerColor = SkyAccent),
                                modifier = Modifier.weight(1f)
                            ) { Text("💨 STEAM", fontSize = 10.sp) }
                        }
                    }

                    // ST 4: Flavor Pumps
                    StationGroup(title = "4. SYRUP DISPENSERS") {
                        Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                            Button(
                                onClick = { gameState.addSyrup("Caramel") },
                                colors = ButtonDefaults.buttonColors(containerColor = Color(0xFFB45309)),
                                modifier = Modifier.weight(1f)
                            ) { Text("🍯 CARAMEL", fontSize = 10.sp) }
                            
                            Button(
                                onClick = { gameState.addSyrup("Vanilla") },
                                colors = ButtonDefaults.buttonColors(containerColor = Color(0xFFFCD34D)),
                                modifier = Modifier.weight(1f)
                            ) { Text("🍦 VANILLA", fontSize = 10.sp) }
                            
                            Button(
                                onClick = { gameState.addSyrup("Mocha") },
                                colors = ButtonDefaults.buttonColors(containerColor = Color(0xFF451A03)),
                                modifier = Modifier.weight(1f)
                            ) { Text("🍫 MOCHA", fontSize = 10.sp) }
                        }
                    }

                    // ST 5: Ice Station
                    StationGroup(title = "5. ICE WELL WELL") {
                        Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                            Button(
                                onClick = { gameState.addIce() },
                                colors = ButtonDefaults.buttonColors(containerColor = SkyAccent),
                                modifier = Modifier.fillMaxWidth()
                            ) { Text("❄️ SCOOP CRYSTAL ICE", fontSize = 12.sp) }
                        }
                    }

                    Spacer(modifier = Modifier.height(20.dp))
                }
            }

            // 5. BOTTOM ACTIONS BAR (SERVE, DUMP, CLEAN)
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .background(DarkSurface)
                    .padding(16.dp),
                horizontalArrangement = Arrangement.spacedBy(10.dp)
            ) {
                // Clean Counter / Sponge
                Button(
                    onClick = { gameState.cleanCounter() },
                    modifier = Modifier
                        .weight(1f)
                        .height(50.dp),
                    colors = ButtonDefaults.buttonColors(containerColor = SubwayMetal),
                    shape = RoundedCornerShape(10.dp)
                ) {
                    Text("🧽 SPONGE", fontSize = 12.sp, fontFamily = FontFamily.Monospace)
                }

                // Dump / Empty hands
                Button(
                    onClick = { gameState.dumpDrink() },
                    modifier = Modifier
                        .weight(1f)
                        .height(50.dp),
                    colors = ButtonDefaults.buttonColors(containerColor = Color(0xFF7F1D1D)),
                    shape = RoundedCornerShape(10.dp)
                ) {
                    Text("🗑️ TRASH", fontSize = 12.sp, fontFamily = FontFamily.Monospace)
                }

                // Serve Current Drink!
                Button(
                    onClick = { gameState.serveCurrentDrink() },
                    modifier = Modifier
                        .weight(2f)
                        .height(50.dp),
                    colors = ButtonDefaults.buttonColors(containerColor = EmeraldAccent),
                    shape = RoundedCornerShape(10.dp)
                ) {
                    Text("✅ SERVE DRINK", fontSize = 14.sp, fontWeight = FontWeight.Bold, fontFamily = FontFamily.Monospace)
                }
            }
        }

        // 6. FLOATING TOASTS OVERLAY
        Column(
            modifier = Modifier
                .align(Alignment.BottomCenter)
                .padding(bottom = 90.dp)
                .fillMaxWidth(),
            horizontalAlignment = Alignment.CenterHorizontally,
            verticalArrangement = Arrangement.spacedBy(6.dp)
        ) {
            gameState.activeToasts.forEach { toast ->
                Row(
                    modifier = Modifier
                        .background(Color(0xEE1E1A3A), shape = RoundedCornerShape(8.dp))
                        .border(1.dp, AmberAccent, shape = RoundedCornerShape(8.dp))
                        .padding(horizontal = 14.dp, vertical = 8.dp),
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Text(text = toast.second, fontSize = 16.sp)
                    Spacer(modifier = Modifier.width(8.dp))
                    Text(text = toast.first, fontSize = 12.sp, color = Color.White, fontWeight = FontWeight.Medium)
                }
            }
        }
    }
}

@Composable
fun CustomerCard(
    order: OrderTicket,
    isSelected: Boolean,
    onClick: () -> Unit
) {
    Card(
        modifier = Modifier
            .width(180.dp)
            .clickable { onClick() }
            .border(
                width = if (isSelected) 2.dp else 1.dp,
                color = if (isSelected) AmberAccent else BorderMetal,
                shape = RoundedCornerShape(12.dp)
            ),
        colors = CardDefaults.cardColors(
            containerColor = if (isSelected) Color(0xFF1E193C) else DarkSurface
        ),
        shape = RoundedCornerShape(12.dp)
    ) {
        Column(modifier = Modifier.padding(10.dp)) {
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Text(
                    text = "${order.avatar} ${order.customerName}",
                    fontSize = 13.sp,
                    fontWeight = FontWeight.Bold,
                    color = Color.White
                )
                Text(
                    text = "#${order.id}",
                    fontSize = 10.sp,
                    fontFamily = FontFamily.Monospace,
                    color = TextSecondary
                )
            }
            Text(
                text = order.customerType,
                fontSize = 10.sp,
                color = AmberAccent,
                fontWeight = FontWeight.SemiBold
            )
            Spacer(modifier = Modifier.height(4.dp))
            
            // Drink Recipe Info
            Text(
                text = "${order.size} ${order.drinkName}",
                fontSize = 12.sp,
                fontWeight = FontWeight.Bold,
                color = Color.White
            )
            val recipeParts = mutableListOf<String>()
            recipeParts.add("${order.shots}x Shot(s)")
            if (order.milk != "None") recipeParts.add(order.milk)
            if (order.syrup != "None") recipeParts.add(order.syrup)
            if (order.hasIce) recipeParts.add("Ice")
            Text(
                text = recipeParts.joinToString(", "),
                fontSize = 9.sp,
                color = TextSecondary,
                lineHeight = 11.sp
            )

            Spacer(modifier = Modifier.height(8.dp))

            // Patience meter
            LinearProgressIndicator(
                progress = order.patience,
                modifier = Modifier
                    .fillMaxWidth()
                    .height(4.dp),
                color = if (order.patience > 0.5f) EmeraldAccent else if (order.patience > 0.25f) AmberAccent else Color.Red,
                trackColor = Color(0xFF2E274F)
            )
        }
    }
}

@Composable
fun StationGroup(
    title: String,
    content: @Composable () -> Unit
) {
    Column(
        modifier = Modifier
            .fillMaxWidth()
            .background(DarkSurface, shape = RoundedCornerShape(10.dp))
            .border(1.dp, BorderMetal, shape = RoundedCornerShape(10.dp))
            .padding(10.dp)
    ) {
        Text(
            text = title,
            fontSize = 9.sp,
            fontFamily = FontFamily.Monospace,
            fontWeight = FontWeight.Bold,
            color = TextSecondary,
            modifier = Modifier.padding(bottom = 6.dp)
        )
        content()
    }
}
