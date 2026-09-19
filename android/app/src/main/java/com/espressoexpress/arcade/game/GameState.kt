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
import kotlin.random.Random

data class OrderTicket(
    val id: Int,
    val customerName: String,
    val customerType: String, // "Wall Street Exec", "Night-Shift Nurse", "Campus Influencer", "Line Conductor"
    val avatar: String,
    val drinkName: String,
    val size: String, // "Small", "Medium", "Large"
    val shots: Int, // 1 or 2
    val milk: String, // "Whole Milk", "Oat Milk", "None"
    val syrup: String, // "Caramel", "Vanilla", "Mocha", "None"
    val hasIce: Boolean,
    var patience: Float = 1.0f, // 1.0 down to 0.0
    val maxPatienceSec: Int = 30
)

data class Workbench(
    var currentCupSize: String = "None", // "None", "Small", "Medium", "Large"
    var hasGrinds: Boolean = false,
    var brewedShots: Int = 0,
    var milkType: String = "None", // "None", "Whole Milk", "Oat Milk"
    var milkSteamed: Boolean = false,
    var syrupType: String = "None", // "None", "Caramel", "Vanilla", "Mocha"
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
    // Save-backed states
    var totalEarnings by mutableStateOf(0.0)
    var level by mutableStateOf(1)
    var highestCombo by mutableStateOf(0)
    var customersServed by mutableStateOf(0)
    val unlockedDrinks = mutableStateListOf<String>()
    val unlockedEquipment = mutableStateListOf<String>()
    var settings by mutableStateOf(GameSettings())

    // Active shift stats
    var isShiftActive by mutableStateOf(false)
    var isRushActive by mutableStateOf(false)
    var shiftEarnings by mutableStateOf(0.0)
    var shiftComboStreak by mutableStateOf(0)
    var shiftChaosLevel by mutableStateOf(0.0f) // 0f to 100f
    var trainSecondsLeft by mutableStateOf(25)
    var activeOrders = mutableStateListOf<OrderTicket>()
    var selectedOrderId by mutableStateOf<Int?>(null)
    var workbench by mutableStateOf(Workbench())
    var activeToasts = mutableStateListOf<Pair<String, String>>() // Message to Symbol

    // Shift result details for Results Screen
    var lastShiftCompletedOrders by mutableStateOf(0)
    var lastShiftSpills by mutableStateOf(0)
    var lastShiftTips by mutableStateOf(0.0)
    var lastShiftGrade by mutableStateOf("B")

    private var gameLoopRunning = false
    private var orderIdCounter = 1

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
        
        orderIdCounter = 1
        spawnOrder()
        spawnOrder()

        if (!gameLoopRunning) {
            runGameLoop()
        }
        triggerToast("SHIFT STARTED • PLATFORM 9", "🚦")
    }

    fun endShift() {
        isShiftActive = false
        gameLoopRunning = false
        
        // Calculate Shift Grade
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

        // Add to permanent totals
        totalEarnings += shiftEarnings
        customersServed += lastShiftCompletedOrders
        if (shiftComboStreak > highestCombo) {
            highestCombo = shiftComboStreak
        }
        
        // Level progression check
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

                // Countdown train timer
                if (trainSecondsLeft > 1) {
                    trainSecondsLeft--
                } else {
                    trainSecondsLeft = 25
                    triggerTrainRush()
                }

                // Tick patience on all orders
                val iterator = activeOrders.iterator()
                while (iterator.hasNext()) {
                    val order = iterator.next()
                    val pReduction = if (isRushActive) 0.05f else 0.03f
                    order.patience -= pReduction
                    if (order.patience <= 0f) {
                        iterator.remove()
                        handleOrderFailed(order)
                        break
                    }
                }

                // Periodically spawn new customers
                if (activeOrders.size < 4 && Random.nextFloat() < 0.25f) {
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
        val names = listOf("Alex", "Jordan", "Taylor", "Casey", "Morgan", "Robin", "Pat")
        val types = listOf(
            Triple("Wall Street Exec", "💼", 25),
            Triple("Night-Shift Nurse", "🥱", 40),
            Triple("Campus Influencer", "📱", 30),
            Triple("Line Conductor", "🚂", 20)
        )
        val selectedType = types.random()
        val size = listOf("Small", "Medium", "Large").random()
        val drinks = unlockedDrinks.ifEmpty { listOf("Espresso", "Americano", "Latte") }
        val drink = drinks.random()
        val shots = if (size == "Large" || drink == "Double Shot") 2 else 1
        val milk = if (drink == "Latte" || drink == "Flat White") listOf("Whole Milk", "Oat Milk").random() else "None"
        val syrup = if (Random.nextFloat() < 0.5f && drink != "Espresso") listOf("Caramel", "Vanilla", "Mocha").random() else "None"
        val ice = drink.startsWith("Iced") || Random.nextFloat() < 0.3f

        val ticket = OrderTicket(
            id = orderIdCounter++,
            customerName = names.random(),
            customerType = selectedType.first,
            avatar = selectedType.second,
            drinkName = drink,
            size = size,
            shots = shots,
            milk = milk,
            syrup = syrup,
            hasIce = ice,
            maxPatienceSec = selectedType.third
        )
        activeOrders.add(ticket)
        if (selectedOrderId == null) {
            selectedOrderId = ticket.id
        }
        triggerToast("NEW ORDER: ${ticket.customerName} wants ${ticket.drinkName}!", "👥")
    }

    private fun handleOrderFailed(order: OrderTicket) {
        shiftComboStreak = 1
        shiftChaosLevel += 15f
        if (selectedOrderId == order.id) {
            selectedOrderId = activeOrders.firstOrNull()?.id
        }
        triggerToast("ORDER EXPIRED! ${order.customerName} missed their train!", "⚠️")
    }

    // Interactive counter actions
    fun grabCup(size: String) {
        if (workbench.hasSpill) {
            triggerToast("⚠️ Clean the counter spill first!", "🧽")
            return
        }
        workbench.currentCupSize = size
        triggerToast("Grabbed $size Cup", "🥤")
    }

    fun grindBeans() {
        if (workbench.currentCupSize == "None") {
            triggerToast("⚠️ Grab a cup first!", "🥤")
            return
        }
        workbench.hasGrinds = true
        triggerToast("Grinding fresh coffee beans", "⚙️")
    }

    fun pullEspressoShot(count: Int = 1) {
        if (!workbench.hasGrinds) {
            triggerToast("⚠️ Add coffee grinds first!", "⚙️")
            return
        }
        workbench.brewedShots += count
        triggerToast("Pulled $count shot(s) of Espresso", "☕")
    }

    fun selectMilk(milk: String) {
        if (workbench.currentCupSize == "None") {
            triggerToast("⚠️ Grab a cup first!", "🥤")
            return
        }
        workbench.milkType = milk
        triggerToast("Added $milk", "🥛")
    }

    fun frothMilk() {
        if (workbench.milkType == "None") {
            triggerToast("⚠️ Add milk to frothing pitcher first!", "🥛")
            return
        }
        workbench.milkSteamed = true
        triggerToast("Steamed milk to silky microfoam", "💨")
    }

    fun addSyrup(flavor: String) {
        if (workbench.currentCupSize == "None") {
            triggerToast("⚠️ Grab a cup first!", "🥤")
            return
        }
        workbench.syrupType = flavor
        workbench.syrupPumps++
        triggerToast("Added pump of $flavor Syrup", "🍯")
    }

    fun addIce() {
        if (workbench.currentCupSize == "None") {
            triggerToast("⚠️ Grab a cup first!", "🥤")
            return
        }
        workbench.iceScoops++
        triggerToast("Added Ice Scoop", "❄️")
    }

    fun cleanCounter() {
        workbench.hasSpill = false
        shiftChaosLevel = (shiftChaosLevel - 10f).coerceAtLeast(0f)
        triggerToast("Spill cleaned with sponge!", "🧽")
    }

    fun dumpDrink() {
        workbench.clear()
        lastShiftSpills++
        triggerToast("Poured cup contents down the sink!", "🗑️")
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

        // Simple match evaluation
        var scoreMatch = 0
        if (workbench.currentCupSize == order.size) scoreMatch++
        if (workbench.brewedShots >= order.shots) scoreMatch++
        
        // Milk matching
        if (order.milk == "None" && workbench.milkType == "None") scoreMatch++
        if (order.milk != "None" && workbench.milkType == order.milk && workbench.milkSteamed) scoreMatch++

        // Syrup matching
        if (order.syrup == "None" && workbench.syrupType == "None") scoreMatch++
        if (order.syrup != "None" && workbench.syrupType == order.syrup) scoreMatch++

        // Ice matching
        if (order.hasIce == (workbench.iceScoops > 0)) scoreMatch++

        val totalPossible = 5
        val accuracy = scoreMatch.toFloat() / totalPossible

        if (accuracy >= 0.6f) {
            // Successful serve!
            lastShiftCompletedOrders++
            val basePrice = when (order.size) {
                "Small" -> 3.50
                "Medium" -> 4.50
                else -> 5.50
            }
            val patienceBonus = (order.patience * 1.50)
            val comboBonus = if (shiftComboStreak > 1) shiftComboStreak * 0.20 else 0.0
            val profit = basePrice + patienceBonus + comboBonus
            
            shiftEarnings += profit
            shiftComboStreak++
            shiftChaosLevel = (shiftChaosLevel - 15f).coerceAtLeast(0f)
            lastShiftTips += patienceBonus + comboBonus

            activeOrders.remove(order)
            selectedOrderId = activeOrders.firstOrNull()?.id
            workbench.clear()
            triggerToast("PERFECT BREW! Served ${order.customerName} (Earned \$${"%.2f".format(profit)})", "✅")
        } else {
            // Bad drink penalty (counter spill)
            workbench.hasSpill = true
            shiftComboStreak = 1
            lastShiftSpills++
            triggerToast("⚠️ HORRIBLE COMBINATION! Spill on counter!", "❌")
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
