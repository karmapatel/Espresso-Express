package com.espressoexpress.arcade.game

import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateListOf
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.setValue
import com.espressoexpress.arcade.AppScreen
import com.espressoexpress.arcade.data.GameSettings
import com.espressoexpress.arcade.data.SaveManager
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.delay
import kotlinx.coroutines.flow.first
import kotlinx.coroutines.launch
import kotlin.math.abs
import kotlin.random.Random

data class DrinkRecipe(
    val id: String,
    val name: String,
    val size: String,
    val shots: Int,
    val milk: String, // "None", "Whole Milk", "Oat Milk"
    val frothed: Boolean,
    val syrupFlavor: String, // "None", "Caramel", "Vanilla", "Mocha"
    val syrupPumps: Int,
    val iceCount: Int, // 0, 1, 2, 3
    val hasWater: Boolean,
    val basePrice: Double,
    val prepDescription: String
)

val DRINK_RECIPES = listOf(
    DrinkRecipe("espresso", "Single Espresso", "Small", 1, "None", false, "None", 0, 0, false, 3.50, "1x Espresso shot in Small cup"),
    DrinkRecipe("double_espresso", "Double Espresso", "Small", 2, "None", false, "None", 0, 0, false, 4.75, "Double shot espresso in Small cup"),
    DrinkRecipe("triple_espresso", "Triple Espresso", "Small", 3, "None", false, "None", 0, 0, false, 5.75, "3x Espresso shots in Small cup"),
    DrinkRecipe("quad_shot", "Quad Overdrive", "Medium", 4, "None", false, "None", 0, 0, false, 6.50, "4x Espresso shots in Medium cup"),
    DrinkRecipe("americano", "Americano", "Medium", 2, "None", false, "None", 0, 0, true, 4.50, "Double espresso + Hot Water in Medium cup"),
    DrinkRecipe("large_americano", "Large Americano", "Large", 3, "None", false, "None", 0, 0, true, 5.50, "3x Espresso shots + Hot Water in Large cup"),
    DrinkRecipe("iced_americano", "Iced Americano", "Medium", 2, "None", false, "None", 0, 2, true, 4.75, "Ice + Double espresso + Water in Medium cup"),
    DrinkRecipe("latte", "Whole Milk Latte", "Large", 2, "Whole Milk", true, "None", 0, 0, false, 5.75, "Double espresso + Steamed Whole Milk"),
    DrinkRecipe("small_latte", "Small Latte", "Small", 1, "Whole Milk", true, "None", 0, 0, false, 4.75, "Single espresso + Steamed Whole Milk"),
    DrinkRecipe("iced_latte", "Iced Latte", "Medium", 2, "Whole Milk", false, "None", 0, 2, false, 5.50, "Ice + Whole Milk + 2 Shots in Medium cup"),
    DrinkRecipe("oat_latte", "Oat Milk Latte", "Large", 2, "Oat Milk", true, "None", 0, 0, false, 6.25, "Double espresso + Steamed Oat Milk"),
    DrinkRecipe("small_oat_latte", "Small Oat Latte", "Small", 1, "Oat Milk", true, "None", 0, 0, false, 5.25, "1 Shot + Steamed Oat Milk in Small cup"),
    DrinkRecipe("iced_oat_latte", "Iced Oat Latte", "Medium", 2, "Oat Milk", false, "None", 0, 2, false, 6.25, "Ice + Oat Milk + 2 Shots in Medium cup"),
    DrinkRecipe("caramel_latte", "Caramel Latte", "Medium", 1, "Whole Milk", true, "Caramel", 1, 0, false, 6.00, "1x Caramel + 1 Shot + Steamed Whole Milk"),
    DrinkRecipe("caramel_macchiato", "Caramel Macchiato", "Large", 2, "Whole Milk", true, "Caramel", 2, 0, false, 6.75, "2x Caramel pumps + Steamed Whole Milk + 2 Shots"),
    DrinkRecipe("iced_caramel_macchiato", "Iced Caramel Macchiato", "Large", 2, "Whole Milk", false, "Caramel", 2, 2, false, 7.25, "Ice + 2x Caramel + Whole Milk + 2 Shots"),
    DrinkRecipe("vanilla_latte", "Vanilla Latte", "Medium", 2, "Whole Milk", true, "Vanilla", 1, 0, false, 6.25, "1x Vanilla + 2 Shots + Steamed Whole Milk"),
    DrinkRecipe("iced_vanilla_oat", "Iced Vanilla Oat Latte", "Large", 2, "Oat Milk", false, "Vanilla", 2, 2, false, 7.25, "Ice + 2x Vanilla + Oat Milk + 2 Shots"),
    DrinkRecipe("dark_mocha", "Dark Mocha", "Large", 2, "Whole Milk", true, "Mocha", 2, 0, false, 6.50, "2x Mocha + 2 Shots + Steamed Whole Milk"),
    DrinkRecipe("sweet_mocha", "Sweet Mocha", "Medium", 1, "Whole Milk", true, "Mocha", 1, 0, false, 6.00, "1x Mocha + 1 Shot + Steamed Whole Milk"),
    DrinkRecipe("iced_mocha", "Iced Mocha", "Medium", 2, "Whole Milk", false, "Mocha", 1, 2, false, 6.50, "Ice + 1x Mocha + Whole Milk + 2 Shots"),
    DrinkRecipe("triple_oat_mocha", "Triple Oat Mocha", "Large", 3, "Oat Milk", true, "Mocha", 2, 0, false, 7.50, "2x Mocha + 3 Shots + Steamed Oat Milk"),
    DrinkRecipe("iced_vanilla_shot", "Iced Vanilla Espresso", "Small", 2, "None", false, "Vanilla", 1, 2, false, 5.00, "Ice + 1x Vanilla + 2 Shots in Small cup"),
    DrinkRecipe("caramel_espresso", "Caramel Espresso", "Small", 1, "None", false, "Caramel", 1, 0, false, 4.25, "1x Caramel + 1 Shot in Small cup")
)

data class CommuterArchetype(
    val type: String,
    val name: String,
    val avatar: String,
    val notes: String
)

val COMMUTER_ARCHETYPES = listOf(
    CommuterArchetype("Wall Street Exec", "Frank Vance", "💼", "Heading to trading desk. Train leaves right now!"),
    CommuterArchetype("Night-Shift Nurse", "Maya Lin", "🥱", "Heading home after a 12h hospital shift... need caffeine."),
    CommuterArchetype("Campus Influencer", "Jax Rivera", "📱", "Keep it iced and sweet! Soundcheck at 8th Ave station."),
    CommuterArchetype("Line Conductor", "Officer Pete", "🚂", "Highballing on Track 3 in 2 minutes! Quick black coffee!"),
    CommuterArchetype("Tech Lead", "Siddharth R.", "💻", "Sprint review at 9:00 AM sharp. Need extra caffeine!"),
    CommuterArchetype("Art Student", "Chloe V.", "🎨", "Rich chocolate mocha please, got a portfolio review."),
    CommuterArchetype("Lead Architect", "Nadia Thorne", "📐", "Blueprints under my arm, client meeting in 15 minutes."),
    CommuterArchetype("Biotech Researcher", "Dr. Elena Rossi", "🔬", "Lab notes due this morning. Extra strong espresso!"),
    CommuterArchetype("Manga Illustrator", "Kenji Sato", "✏️", "Need sweet iced fuel for drawing all day."),
    CommuterArchetype("Broadway Stagehand", "Marcus Brody", "🎭", "Hauling lighting rigs for the matinee show today.")
)

data class OrderTicket(
    val id: Int,
    val customerName: String,
    val customerType: String,
    val avatar: String,
    val drinkId: String,
    val drinkName: String,
    val size: String,
    val shots: Int,
    val milk: String,
    val frothed: Boolean,
    val syrup: String,
    val syrupFlavor: String,
    val syrupPumps: Int,
    val iceCount: Int,
    val hasIce: Boolean,
    val hasWater: Boolean,
    val price: Double,
    val tipBonus: Double,
    var patience: Float = 1.0f,
    val maxPatienceSec: Int = 30,
    val prepDescription: String,
    val notes: String
)

data class Workbench(
    var currentCupSize: String = "None",
    var hasGrinds: Boolean = false,
    var brewedShots: Int = 0,
    var milkType: String = "None",
    var milkSteamed: Boolean = false,
    var syrupType: String = "None",
    var syrupPumps: Int = 0,
    var iceScoops: Int = 0,
    var hasSpill: Boolean = false
) {
    fun getHeldItemDisplay(): String {
        if (hasSpill) return "⚠️ COUNTER SPILL! GRAB SPONGE!"
        if (currentCupSize == "None") return "Empty Hands (Grab a Cup to Start)"
        val items = mutableListOf<String>()
        items.add("$currentCupSize Cup")
        if (hasGrinds) items.add("Espresso Grinds")
        if (brewedShots > 0) items.add("${brewedShots}x Shot(s)")
        if (milkType != "None") items.add(if (milkSteamed) "Steamed $milkType" else "Cold $milkType")
        if (syrupType != "None" && syrupPumps > 0) items.add("${syrupPumps}x $syrupType Syrup")
        if (iceScoops > 0) items.add("${iceScoops}x Scoop(s) of Ice")
        return items.joinToString(" + ")
    }

    fun clear() {
        currentCupSize = "None"
        hasGrinds = false
        brewedShots = 0
        milkType = "None"
        milkSteamed = false
        syrupType = "None"
        syrupPumps = 0
        iceScoops = 0
    }
}

class GameState(
    private val saveManager: SaveManager,
    private val scope: CoroutineScope
) {
    var totalEarnings by mutableStateOf(0.0)
    var level by mutableStateOf(1)
    var highestCombo by mutableStateOf(0)
    var customersServed by mutableStateOf(0)
    val unlockedDrinks = mutableStateListOf<String>()
    val unlockedEquipment = mutableStateListOf<String>()
    var settings by mutableStateOf(GameSettings())

    var isShiftActive by mutableStateOf(false)
    var isShiftPaused by mutableStateOf(false)
    var isRushActive by mutableStateOf(false)
    var shiftEarnings by mutableStateOf(0.0)
    var shiftComboStreak by mutableStateOf(0)
    var shiftChaosLevel by mutableStateOf(0.0f)
    var trainSecondsLeft by mutableStateOf(25)
    var activeOrders = mutableStateListOf<OrderTicket>()
    var selectedOrderId by mutableStateOf<Int?>(null)
    var workbench by mutableStateOf(Workbench())
    var activeToasts = mutableStateListOf<Pair<String, String>>()

    var lastShiftCompletedOrders by mutableStateOf(0)
    var lastShiftSpills by mutableStateOf(0)
    var lastShiftTips by mutableStateOf(0.0)
    var lastShiftGrade by mutableStateOf("B")

    private var gameLoopRunning = false
    private var orderIdCounter = 101

    fun loadSavedData() {
        scope.launch {
            totalEarnings = saveManager.totalEarningsFlow.first()
            level = saveManager.levelFlow.first()
            highestCombo = saveManager.highestComboFlow.first()
            customersServed = saveManager.customersServedFlow.first()
            
            unlockedDrinks.clear()
            unlockedDrinks.addAll(saveManager.unlockedDrinksFlow.first())

            unlockedEquipment.clear()
            unlockedEquipment.addAll(saveManager.unlockedEquipmentFlow.first())

            settings = saveManager.settingsFlow.first()
        }
    }

    fun saveGame() {
        scope.launch {
            saveManager.saveProgress(
                totalEarnings,
                level,
                highestCombo,
                customersServed,
                unlockedDrinks.toSet(),
                unlockedEquipment.toSet()
            )
            saveManager.saveSettings(settings)
        }
    }

    fun triggerToast(message: String, symbol: String) {
        scope.launch {
            activeToasts.add(message to symbol)
            delay(3000)
            activeToasts.remove(message to symbol)
        }
    }

    fun startShift() {
        isShiftActive = true
        isShiftPaused = false
        isRushActive = false
        shiftEarnings = 0.0
        shiftComboStreak = 0
        shiftChaosLevel = 0.0f
        trainSecondsLeft = 25
        activeOrders.clear()
        selectedOrderId = null
        workbench.clear()
        
        lastShiftCompletedOrders = 0
        lastShiftSpills = 0
        lastShiftTips = 0.0
        
        orderIdCounter = 101
        spawnOrder()
        spawnOrder()
        spawnOrder()

        if (!gameLoopRunning) {
            runGameLoop()
        }
        triggerToast("SHIFT STARTED • PLATFORM 9", "🚦")
    }

    fun pauseShift() {
        if (isShiftActive) {
            isShiftActive = false
            isShiftPaused = true
            triggerToast("SHIFT PAUSED", "⏸")
        }
    }

    fun resumeShift() {
        if (isShiftPaused) {
            isShiftActive = true
            isShiftPaused = false
            if (!gameLoopRunning) {
                runGameLoop()
            }
            triggerToast("SHIFT RESUMED", "⚡")
        }
    }

    fun endShift() {
        isShiftActive = false
        gameLoopRunning = false
        
        val accuracy = if (lastShiftCompletedOrders + lastShiftSpills > 0) {
            lastShiftCompletedOrders.toFloat() / (lastShiftCompletedOrders + lastShiftSpills)
        } else {
            0.0f
        }
        lastShiftGrade = when {
            lastShiftCompletedOrders >= 5 && accuracy >= 0.8f -> "S"
            lastShiftCompletedOrders >= 3 && accuracy >= 0.6f -> "A"
            lastShiftCompletedOrders >= 2 -> "B"
            else -> "C"
        }

        totalEarnings += shiftEarnings
        customersServed += lastShiftCompletedOrders
        if (shiftComboStreak > highestCombo) {
            highestCombo = shiftComboStreak
        }
        
        if (customersServed >= level * 5) {
            level++
            triggerToast("LEVEL UP! NOW LEVEL $level!", "⭐️")
        }

        saveGame()
    }

    private fun runGameLoop() {
        gameLoopRunning = true
        scope.launch {
            while (gameLoopRunning) {
                delay(1000)
                if (!isShiftActive) break

                if (trainSecondsLeft > 1) {
                    trainSecondsLeft--
                } else {
                    trainSecondsLeft = 25
                    triggerTrainRush()
                }

                val iterator = activeOrders.iterator()
                while (iterator.hasNext()) {
                    val order = iterator.next()
                    // Time bound patience removed - customers are permanent!
                    // val pReduction = if (isRushActive) 0.05f else 0.03f
                    // order.patience -= pReduction
                    // if (order.patience <= 0f) {
                    //     iterator.remove()
                    //     handleOrderFailed(order)
                    //     break
                    // }
                }

                if (activeOrders.size < 3) {
                    spawnOrder()
                } else if (activeOrders.size < 4 && Random.nextFloat() < 0.25f) {
                    spawnOrder()
                }
            }
        }
    }

    private fun triggerTrainRush() {
        isRushActive = !isRushActive
        if (isRushActive) {
            shiftChaosLevel += 20.0f
            triggerToast("🚨 RUSH HOUR! COMMUTERS APPROACHING!", "⚡")
        } else {
            triggerToast("⏱️ PREP PHASE • CALM INTERVAL", "☕")
        }
    }

    private fun spawnOrder() {
        val activeDrinkIds = activeOrders.map { it.drinkId }.toSet()
        val activeCustomerNames = activeOrders.map { it.customerName }.toSet()

        // Filter out archetypes already on the screen to avoid repeating customers
        val availableArchetypes = COMMUTER_ARCHETYPES.filter { !activeCustomerNames.contains(it.name) }
        val archetype = if (availableArchetypes.isNotEmpty()) availableArchetypes.random() else COMMUTER_ARCHETYPES.random()
        
        val availableRecipes = DRINK_RECIPES.filter { recipe ->
            val hasOatUnlock = unlockedEquipment.contains("OatMilk")
            val hasVanillaUnlock = unlockedEquipment.contains("VanillaSyrup")
            val hasMochaUnlock = unlockedEquipment.contains("MochaSyrup")

            val milkOk = recipe.milk != "Oat Milk" || hasOatUnlock
            val syrupOk = (recipe.syrupFlavor != "Vanilla" || hasVanillaUnlock) &&
                          (recipe.syrupFlavor != "Mocha" || hasMochaUnlock)
            milkOk && syrupOk
        }

        // Filter out recipes already active on screen to ensure maximum order variety
        val diverseRecipes = availableRecipes.filter { !activeDrinkIds.contains(it.id) }
        val chosenRecipe = if (diverseRecipes.isNotEmpty()) {
            diverseRecipes.random()
        } else if (availableRecipes.isNotEmpty()) {
            availableRecipes.random()
        } else {
            DRINK_RECIPES.first()
        }

        val syrupLabel = if (chosenRecipe.syrupFlavor == "None") "None" else "${chosenRecipe.syrupFlavor} (${chosenRecipe.syrupPumps}x)"
        
        val hasCustomerTip = Random.nextFloat() < 0.52f
        val customerTip = if (hasCustomerTip) listOf(1.00, 1.25, 1.50, 1.75, 2.00, 2.50).random() else 0.00

        val finalIceCount = if (chosenRecipe.iceCount > 0) {
            Random.nextInt(1, 4) // 1x, 2x, or 3x ice scoops
        } else {
            0
        }

        var note = archetype.notes
        var prepText = chosenRecipe.prepDescription
        if (finalIceCount > 0) {
            val iceText = when (finalIceCount) {
                1 -> "Light Ice (1x Scoop)"
                2 -> "Regular Ice (2x Scoops)"
                else -> "Extra Ice (3x Scoops)"
            }
            note = "$note Please add $iceText!"
            prepText = if (prepText.startsWith("Ice + ")) {
                "$iceText + ${prepText.substring("Ice + ".length)}"
            } else {
                "$iceText + $prepText"
            }
        }

        val ticket = OrderTicket(
            id = orderIdCounter++,
            customerName = archetype.name,
            customerType = archetype.type,
            avatar = archetype.avatar,
            drinkId = chosenRecipe.id,
            drinkName = chosenRecipe.name,
            size = chosenRecipe.size,
            shots = chosenRecipe.shots,
            milk = chosenRecipe.milk,
            frothed = chosenRecipe.frothed,
            syrup = syrupLabel,
            syrupFlavor = chosenRecipe.syrupFlavor,
            syrupPumps = chosenRecipe.syrupPumps,
            iceCount = finalIceCount,
            hasIce = finalIceCount > 0,
            hasWater = chosenRecipe.hasWater,
            price = chosenRecipe.basePrice,
            tipBonus = customerTip,
            prepDescription = prepText,
            notes = note
        )

        activeOrders.add(ticket)
        if (selectedOrderId == null) {
            selectedOrderId = ticket.id
        }
    }

    private fun handleOrderFailed(order: OrderTicket) {
        shiftComboStreak = 1
        shiftChaosLevel += 15f
        if (selectedOrderId == order.id) {
            selectedOrderId = activeOrders.firstOrNull()?.id
        }
        triggerToast("ORDER EXPIRED! ${order.customerName} missed their train!", "⚠️")
    }

    fun grabCup(size: String) {
        if (workbench.hasSpill) {
            triggerToast("⚠️ Clean the counter spill first!", "🧽")
            return
        }
        workbench.currentCupSize = size
    }

    fun grindBeans() {
        if (workbench.currentCupSize == "None") {
            triggerToast("⚠️ Grab a cup first!", "🥤")
            return
        }
        workbench.hasGrinds = true
    }

    fun pullEspressoShot(count: Int = 1) {
        if (!workbench.hasGrinds) {
            triggerToast("⚠️ Add coffee grinds first!", "⚙️")
            return
        }
        workbench.brewedShots += count
    }

    fun selectMilk(milk: String) {
        if (workbench.currentCupSize == "None") {
            triggerToast("⚠️ Grab a cup first!", "🥤")
            return
        }
        if (workbench.milkType != "None") {
            triggerToast("⚠️ A liquid is already added! Dump drink to restart.", "🥛")
            return
        }
        workbench.milkType = milk
    }

    fun addWater() {
        if (workbench.currentCupSize == "None") {
            triggerToast("⚠️ Grab a cup first!", "🥤")
            return
        }
        if (workbench.milkType != "None") {
            triggerToast("⚠️ A liquid is already added! Dump drink to restart.", "🥛")
            return
        }
        workbench.milkType = "Water"
    }

    fun frothMilk() {
        if (workbench.milkType == "None") {
            triggerToast("⚠️ Add milk to frothing pitcher first!", "🥛")
            return
        }
        workbench.milkSteamed = true
    }

    fun addSyrup(flavor: String) {
        if (workbench.currentCupSize == "None") {
            triggerToast("⚠️ Grab a cup first!", "🥤")
            return
        }
        workbench.syrupType = flavor
        workbench.syrupPumps++
    }

    fun addIce() {
        if (workbench.currentCupSize == "None") {
            triggerToast("⚠️ Grab a cup first!", "🥤")
            return
        }
        workbench.iceScoops++
    }

    fun cleanCounter() {
        workbench.hasSpill = false
        shiftChaosLevel = (shiftChaosLevel - 10f).coerceAtLeast(0f)
    }

    fun dumpDrink() {
        workbench.clear()
        lastShiftSpills++
    }

    fun serveCurrentDrink() {
        val selectedId = selectedOrderId
        if (selectedId == null) {
            triggerToast("⚠️ No customer selected to serve!", "👤")
            return
        }
        val order = activeOrders.find { it.id == selectedId }
        if (order == null) {
            triggerToast("⚠️ Customer not found!", "👤")
            return
        }

        var penalty = 0
        val details = mutableListOf<String>()

        // 1. Cup Size
        if (workbench.currentCupSize != order.size) {
            penalty += 15
            details.add("Wrong size cup (${workbench.currentCupSize} vs ${order.size})")
        }

        // 2. Shots
        val shotDiff = abs(workbench.brewedShots - order.shots)
        if (workbench.brewedShots == 0) {
            penalty += 45
            details.add("No espresso shots pulled")
        } else if (shotDiff > 0) {
            penalty += shotDiff * 30
            details.add("Wrong shots (${workbench.brewedShots} vs ${order.shots})")
        }

        // 3. Milk type
        val targetNeedsMilk = order.milk != "None"
        val prepHasMilk = workbench.milkType != "None" && workbench.milkType != "Water"
        if (targetNeedsMilk && !prepHasMilk) {
            penalty += 25
            details.add("Missing milk (${order.milk})")
        } else if (!targetNeedsMilk && prepHasMilk) {
            penalty += 25
            details.add("Unwanted milk added")
        } else if (targetNeedsMilk && prepHasMilk && workbench.milkType != order.milk) {
            penalty += 15
            details.add("Used ${workbench.milkType} instead of ${order.milk}")
        }

        // 4. Froth / Steaming
        val isOrderIced = order.iceCount > 0
        if (order.frothed && !workbench.milkSteamed) {
            penalty += 20
            details.add("Milk not frothed/steamed")
        } else if (!order.frothed && workbench.milkSteamed) {
            if (isOrderIced) {
                penalty += 30
                details.add("Poured hot frothed milk into iced drink (melted!)")
            } else if (targetNeedsMilk) {
                penalty += 20
                details.add("Milk frothed when unsteamed was requested")
            } else {
                penalty += 25
                details.add("Unwanted steamed foam added")
            }
        }

        // 5. Water
        val prepHasWater = workbench.milkType == "Water"
        if (order.hasWater && !prepHasWater) {
            penalty += 35
            details.add("Americano requires hot water")
        } else if (!order.hasWater && prepHasWater) {
            penalty += 35
            details.add("Diluted coffee with unwanted water")
        }

        // 6. Ice Well
        if (order.iceCount == 0 && workbench.iceScoops > 0) {
            penalty += 25
            details.add("Ice added to hot drink")
        } else if (order.iceCount > 0 && workbench.iceScoops == 0) {
            penalty += 25
            details.add("Forgot ice on iced drink")
        } else if (order.iceCount > 0 && workbench.iceScoops != order.iceCount) {
            val iceDiff = abs(workbench.iceScoops - order.iceCount)
            penalty += iceDiff * 15
            details.add("Ice scoops mismatch (${workbench.iceScoops} vs ${order.iceCount})")
        }

        // 7. Syrup
        val targetNeedsSyrup = order.syrupFlavor != "None"
        val prepHasSyrup = workbench.syrupType != "None" && workbench.syrupPumps > 0
        if (targetNeedsSyrup && !prepHasSyrup) {
            penalty += 25
            details.add("Missing ${order.syrupFlavor} syrup")
        } else if (!targetNeedsSyrup && prepHasSyrup) {
            penalty += 30
            details.add("Unwanted syrup added")
        } else if (targetNeedsSyrup && prepHasSyrup) {
            if (workbench.syrupType != order.syrupFlavor) {
                penalty += 25
                details.add("Wrong syrup flavor (${workbench.syrupType} vs ${order.syrupFlavor})")
            } else if (workbench.syrupPumps != order.syrupPumps) {
                val pumpsDiff = abs(workbench.syrupPumps - order.syrupPumps)
                penalty += if (workbench.syrupPumps < order.syrupPumps) {
                    pumpsDiff * 15
                } else {
                    pumpsDiff * 20
                }
                details.add("Syrup pumps mismatch (${workbench.syrupPumps} vs ${order.syrupPumps})")
            }
        }

        val accuracy = (100 - penalty).coerceIn(0, 100)
        val isSuccessful = accuracy >= 50

        if (isSuccessful) {
            lastShiftCompletedOrders++
            
            var gradeLabel = "ACCEPTABLE"
            var tipMult = 0.4
            
            if (accuracy >= 95) {
                gradeLabel = "PERFECT!"
                tipMult = 1.5
            } else if (accuracy >= 80) {
                gradeLabel = "GREAT"
                tipMult = 1.0
            }

            val tipAmount = if (order.tipBonus > 0.0) {
                val baseTip = order.patience * order.tipBonus * tipMult
                val neonApronMultiplier = if (unlockedEquipment.contains("NeonApron")) 1.15 else 1.0
                NumberFormatUtil.round(baseTip * neonApronMultiplier)
            } else {
                0.00
            }

            val comboBonus = if (shiftComboStreak > 1) {
                NumberFormatUtil.round(shiftComboStreak * 0.20)
            } else {
                0.00
            }

            val profit = order.price + tipAmount + comboBonus
            
            shiftEarnings += profit
            shiftComboStreak++
            shiftChaosLevel = (shiftChaosLevel - 15f).coerceAtLeast(0f)
            lastShiftTips += tipAmount + comboBonus

            activeOrders.remove(order)
            selectedOrderId = activeOrders.firstOrNull()?.id
            workbench.clear()

            val feedbackText = if (details.isEmpty()) {
                "Perfect drink! Commuter tipped generously!"
            } else {
                "Good enough coffee! (${details.joinToString(", ")})"
            }

            triggerToast("$gradeLabel Served ${order.customerName} (Earned \$${"%.2f".format(profit)})", "✅")
            triggerToast(feedbackText, "📢")
        } else {
            workbench.hasSpill = true
            shiftComboStreak = 1
            lastShiftSpills++
            val feedbackText = "Drink rejected! (${details.joinToString(", ")})"
            triggerToast("⚠️ SPILL! Rejected drink!", "❌")
            triggerToast(feedbackText, "📢")
        }
    }

    fun buyUpgrade(price: Double, item: String) {
        if (totalEarnings >= price) {
            totalEarnings -= price
            unlockedEquipment.add(item)
            triggerToast("UNLOCKED $item!", "🛒")
            saveGame()
        } else {
            triggerToast("⚠️ Insufficient funds!", "⚠️")
        }
    }

    fun toggleSetting(key: String) {
        settings = when (key) {
            "haptic" -> settings.copy(hapticFeedback = !settings.hapticFeedback)
            "shake" -> settings.copy(screenShake = !settings.screenShake)
            "rush" -> settings.copy(rushFlashes = !settings.rushFlashes)
            else -> settings
        }
        saveGame()
    }

    fun updateVolume(slider: String, value: Int) {
        settings = when (slider) {
            "master" -> settings.copy(masterVolume = value)
            "music" -> settings.copy(musicVolume = value)
            "sfx" -> settings.copy(sfxVolume = value)
            else -> settings
        }
        saveGame()
    }
}

object NumberFormatUtil {
    fun round(value: Double): Double {
        return Math.round(value * 100.0) / 100.0
    }
}
