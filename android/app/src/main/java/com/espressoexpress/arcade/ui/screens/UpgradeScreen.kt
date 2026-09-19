package com.espressoexpress.arcade.ui.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.RoundedCornerShape
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

data class UpgradeItem(
    val id: String,
    val name: String,
    val desc: String,
    val price: Double,
    val category: String, // "Equipment", "Ingredients", "Cosmetics"
    val icon: String
)

@Composable
fun UpgradeScreen(
    gameState: GameState,
    onNavigateTo: (AppScreen) -> Unit
) {
    var selectedCategory by remember { mutableStateOf("All") }

    val upgrades = listOf(
        UpgradeItem("TitaniumBurrs", "Titanium Grinder Burrs", "Reduces grinding time from 2.4s to 1.2s", 15.00, "Equipment", "⚙️"),
        UpgradeItem("RapidBoiler", "Rapid-Recovery Steam Wand", "Increases steam pressure to 2.4 bar", 25.00, "Equipment", "💨"),
        UpgradeItem("OatMilk", "Barista Oat Milk", "Allows serving oat milk specialty coffees", 10.00, "Ingredients", "🥛"),
        UpgradeItem("VanillaSyrup", "French Vanilla Syrup", "Unlocks delicious vanilla flavor pumps", 8.00, "Ingredients", "🍦"),
        UpgradeItem("MochaSyrup", "Swiss Dark Mocha Syrup", "Unlocks premium mocha espresso drinks", 12.00, "Ingredients", "🍫"),
        UpgradeItem("NeonApron", "Cyber Neon Apron", "Standout barista wear, boosts tips by +15%", 35.00, "Cosmetics", "🥋")
    )

    val filteredUpgrades = if (selectedCategory == "All") upgrades else upgrades.filter { it.category == selectedCategory }

    Box(
        modifier = Modifier
            .fillMaxSize()
            .background(DarkBackground)
            .padding(16.dp)
    ) {
        Column(modifier = Modifier.fillMaxSize()) {
            
            // Back Button & Cash Title Row
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

                Column(horizontalAlignment = Alignment.End) {
                    Text(text = "CURRENT BANK", fontSize = 9.sp, fontFamily = FontFamily.Monospace, color = TextSecondary)
                    Text(text = "$${"%.2f".format(gameState.totalEarnings)}", fontSize = 18.sp, fontWeight = FontWeight.Bold, color = EmeraldAccent)
                }
            }

            Spacer(modifier = Modifier.height(16.dp))

            Text(
                text = "STATION UPGRADES & SHOP",
                fontSize = 20.sp,
                fontWeight = FontWeight.Bold,
                fontFamily = FontFamily.Monospace,
                color = Color.White
            )

            Spacer(modifier = Modifier.height(12.dp))

            // Categories Row tabs
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.spacedBy(8.dp)
            ) {
                listOf("All", "Equipment", "Ingredients", "Cosmetics").forEach { category ->
                    val isSelected = selectedCategory == category
                    Box(
                        modifier = Modifier
                            .weight(1f)
                            .background(
                                if (isSelected) PurpleAccent else Color(0xFF221E3B),
                                shape = RoundedCornerShape(8.dp)
                            )
                            .clickable { selectedCategory = category }
                            .border(1.dp, if (isSelected) AmberAccent else BorderMetal, shape = RoundedCornerShape(8.dp))
                            .padding(vertical = 8.dp),
                        contentAlignment = Alignment.Center
                    ) {
                        Text(
                            text = category,
                            fontSize = 11.sp,
                            fontWeight = FontWeight.Bold,
                            color = if (isSelected) Color.White else TextSecondary,
                            fontFamily = FontFamily.Monospace
                        )
                    }
                }
            }

            Spacer(modifier = Modifier.height(16.dp))

            // Shop List view
            LazyColumn(
                modifier = Modifier.weight(1f),
                verticalArrangement = Arrangement.spacedBy(10.dp)
            ) {
                items(filteredUpgrades) { item ->
                    val isUnlocked = gameState.unlockedEquipment.contains(item.id)
                    
                    Row(
                        modifier = Modifier
                            .fillMaxWidth()
                            .background(DarkSurface, shape = RoundedCornerShape(12.dp))
                            .border(1.dp, BorderMetal, shape = RoundedCornerShape(12.dp))
                            .padding(14.dp),
                        verticalAlignment = Alignment.CenterVertically,
                        horizontalArrangement = Arrangement.SpaceBetween
                    ) {
                        Row(
                            modifier = Modifier.weight(1f),
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            // Large circle icon
                            Box(
                                modifier = Modifier
                                    .size(46.dp)
                                    .background(Color(0xFF241D3B), shape = RoundedCornerShape(23.dp)),
                                contentAlignment = Alignment.Center
                            ) {
                                Text(text = item.icon, fontSize = 20.sp)
                            }
                            Spacer(modifier = Modifier.width(12.dp))
                            Column {
                                Text(text = item.name, fontSize = 14.sp, fontWeight = FontWeight.Bold, color = Color.White)
                                Text(text = item.desc, fontSize = 11.sp, color = TextSecondary)
                            }
                        }

                        // Buy/Unlocked Button
                        Button(
                            onClick = {
                                if (!isUnlocked) {
                                    gameState.buyUpgrade(item.price, item.id)
                                }
                            },
                            colors = ButtonDefaults.buttonColors(
                                containerColor = if (isUnlocked) SubwayMetal else AmberAccent
                            ),
                            enabled = !isUnlocked,
                            shape = RoundedCornerShape(10.dp)
                        ) {
                            Text(
                                text = if (isUnlocked) "UNLOCKED" else "$${"%.2f".format(item.price)}",
                                fontSize = 11.sp,
                                fontWeight = FontWeight.Bold,
                                color = if (isUnlocked) TextSecondary else Color.Black,
                                fontFamily = FontFamily.Monospace
                            )
                        }
                    }
                }
            }
        }
    }
}
