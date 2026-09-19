package com.espressoexpress.arcade

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Surface
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import com.espressoexpress.arcade.ui.theme.EspressoExpressTheme
import com.espressoexpress.arcade.ui.screens.*
import com.espressoexpress.arcade.data.SaveManager
import com.espressoexpress.arcade.game.GameState

enum class AppScreen {
    MAIN_MENU,
    GAME,
    RESULTS,
    UPGRADES,
    SETTINGS
}

class MainActivity : ComponentActivity() {
    private lateinit var saveManager: SaveManager

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        saveManager = SaveManager(applicationContext)

        setContent {
            EspressoExpressTheme {
                Surface(
                    modifier = Modifier.fillMaxSize(),
                    color = MaterialTheme.colorScheme.background
                ) {
                    var currentScreen by remember { mutableStateOf(AppScreen.MAIN_MENU) }
                    val coroutineScope = rememberCoroutineScope()
                    
                    // GameState instance tied to context
                    val gameState = remember { GameState(saveManager, coroutineScope) }

                    // Load saved data initially
                    LaunchedEffect(Unit) {
                        gameState.loadSavedData()
                    }

                    when (currentScreen) {
                        AppScreen.MAIN_MENU -> {
                            MainMenuScreen(
                                gameState = gameState,
                                onNavigateTo = { screen -> currentScreen = screen }
                            )
                        }
                        AppScreen.GAME -> {
                            GameScreen(
                                gameState = gameState,
                                onNavigateTo = { screen -> currentScreen = screen }
                            )
                        }
                        AppScreen.RESULTS -> {
                            ResultsScreen(
                                gameState = gameState,
                                onNavigateTo = { screen -> currentScreen = screen }
                            )
                        }
                        AppScreen.UPGRADES -> {
                            UpgradeScreen(
                                gameState = gameState,
                                onNavigateTo = { screen -> currentScreen = screen }
                            )
                        }
                        AppScreen.SETTINGS -> {
                            SettingsScreen(
                                gameState = gameState,
                                onNavigateTo = { screen -> currentScreen = screen }
                            )
                        }
                    }
                }
            }
        }
    }
}
