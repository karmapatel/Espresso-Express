package com.espressoexpress.arcade.data

import android.content.Context
import androidx.datastore.core.DataStore
import androidx.datastore.preferences.core.*
import androidx.datastore.preferences.preferencesDataStore
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.map

val Context.dataStore: DataStore<Preferences> by preferencesDataStore(name = "espresso_express_save")

class SaveManager(private val context: Context) {

    companion object {
        val TOTAL_EARNINGS = doublePreferencesKey("total_earnings")
        val LEVEL = intPreferencesKey("level")
        val HIGHEST_COMBO = intPreferencesKey("highest_combo")
        val CUSTOMERS_SERVED = intPreferencesKey("customers_served")
        val UNLOCKED_DRINKS = stringSetPreferencesKey("unlocked_drinks")
        val UNLOCKED_EQUIPMENT = stringSetPreferencesKey("unlocked_equipment")
        
        // Settings
        val MASTER_VOLUME = intPreferencesKey("master_volume")
        val MUSIC_VOLUME = intPreferencesKey("music_volume")
        val SFX_VOLUME = intPreferencesKey("sfx_volume")
        val HAPTIC_FEEDBACK = booleanPreferencesKey("haptic_feedback")
        val SCREEN_SHAKE = booleanPreferencesKey("screen_shake")
        val RUSH_FLASHES = booleanPreferencesKey("rush_flashes")
    }

    // Read streams
    val totalEarningsFlow: Flow<Double> = context.dataStore.data.map { preferences ->
        preferences[TOTAL_EARNINGS] ?: 0.0
    }

    val levelFlow: Flow<Int> = context.dataStore.data.map { preferences ->
        preferences[LEVEL] ?: 1
    }

    val highestComboFlow: Flow<Int> = context.dataStore.data.map { preferences ->
        preferences[HIGHEST_COMBO] ?: 0
    }

    val customersServedFlow: Flow<Int> = context.dataStore.data.map { preferences ->
        preferences[CUSTOMERS_SERVED] ?: 0
    }

    val unlockedDrinksFlow: Flow<Set<String>> = context.dataStore.data.map { preferences ->
        preferences[UNLOCKED_DRINKS] ?: setOf("Espresso", "Americano", "Latte")
    }

    val unlockedEquipmentFlow: Flow<Set<String>> = context.dataStore.data.map { preferences ->
        preferences[UNLOCKED_EQUIPMENT] ?: setOf("BasicGrinder", "SingleBrewer")
    }

    val settingsFlow: Flow<GameSettings> = context.dataStore.data.map { preferences ->
        GameSettings(
            masterVolume = preferences[MASTER_VOLUME] ?: 80,
            musicVolume = preferences[MUSIC_VOLUME] ?: 70,
            sfxVolume = preferences[SFX_VOLUME] ?: 90,
            hapticFeedback = preferences[HAPTIC_FEEDBACK] ?: true,
            screenShake = preferences[SCREEN_SHAKE] ?: true,
            rushFlashes = preferences[RUSH_FLASHES] ?: true
        )
    }

    // Write operations
    suspend fun saveProgress(
        earnings: Double,
        lvl: Int,
        highCombo: Int,
        served: Int,
        drinks: Set<String>,
        equipment: Set<String>
    ) {
        context.dataStore.edit { preferences ->
            preferences[TOTAL_EARNINGS] = earnings
            preferences[LEVEL] = lvl
            preferences[HIGHEST_COMBO] = highCombo
            preferences[CUSTOMERS_SERVED] = served
            preferences[UNLOCKED_DRINKS] = drinks
            preferences[UNLOCKED_EQUIPMENT] = equipment
        }
    }

    suspend fun saveSettings(settings: GameSettings) {
        context.dataStore.edit { preferences ->
            preferences[MASTER_VOLUME] = settings.masterVolume
            preferences[MUSIC_VOLUME] = settings.musicVolume
            preferences[SFX_VOLUME] = settings.sfxVolume
            preferences[HAPTIC_FEEDBACK] = settings.hapticFeedback
            preferences[SCREEN_SHAKE] = settings.screenShake
            preferences[RUSH_FLASHES] = settings.rushFlashes
        }
    }
}

data class GameSettings(
    val masterVolume: Int = 80,
    val musicVolume: Int = 70,
    val sfxVolume: Int = 90,
    val hapticFeedback: Boolean = true,
    val screenShake: Boolean = true,
    val rushFlashes: Boolean = true
)
