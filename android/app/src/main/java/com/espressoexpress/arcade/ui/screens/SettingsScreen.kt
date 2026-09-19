package com.espressoexpress.arcade.ui.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
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
import com.espressoexpress.arcade.ui.theme.*
import android.content.Intent
import android.net.Uri
import androidx.compose.ui.platform.LocalContext
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch
import kotlinx.coroutines.withContext
import org.json.JSONObject
import java.net.URL

enum class UpdateState {
    IDLE,
    CHECKING,
    UP_TO_DATE,
    UPDATE_AVAILABLE,
    FAILED
}

fun compareVersions(v1: String, v2: String): Int {
    val clean1 = v1.removePrefix("v").trim()
    val clean2 = v2.removePrefix("v").trim()
    val parts1 = clean1.split(".").map { it.toIntOrNull() ?: 0 }
    val parts2 = clean2.split(".").map { it.toIntOrNull() ?: 0 }
    val maxLen = maxOf(parts1.size, parts2.size)
    for (i in 0 until maxLen) {
        val p1 = parts1.getOrElse(i) { 0 }
        val p2 = parts2.getOrElse(i) { 0 }
        if (p1 != p2) {
            return p1.compareTo(p2)
        }
    }
    return 0
}

@Composable
fun SettingsScreen(
    gameState: GameState,
    onNavigateTo: (AppScreen) -> Unit
) {
    val context = LocalContext.current
    val scope = rememberCoroutineScope()
    val currentVersionName = remember {
        try {
            val pInfo = if (android.os.Build.VERSION.SDK_INT >= android.os.Build.VERSION_CODES.TIRAMISU) {
                context.packageManager.getPackageInfo(context.packageName, android.content.pm.PackageManager.PackageInfoFlags.of(0))
            } else {
                @Suppress("DEPRECATION")
                context.packageManager.getPackageInfo(context.packageName, 0)
            }
            pInfo.versionName ?: "1.0.7"
        } catch (e: Exception) {
            "1.0.7"
        }
    }
    var updateState by remember { mutableStateOf(UpdateState.IDLE) }
    var latestVersionName by remember { mutableStateOf("") }
    var latestApkUrl by remember { mutableStateOf("") }

    Box(
        modifier = Modifier
            .fillMaxSize()
            .background(DarkBackground)
            .padding(16.dp)
    ) {
        Column(
            modifier = Modifier
                .fillMaxSize()
                .verticalScroll(rememberScrollState())
        ) {
            
            // Header back row
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

                Text(
                    text = "SETTINGS & SYSTEM",
                    fontSize = 14.sp,
                    fontFamily = FontFamily.Monospace,
                    fontWeight = FontWeight.Bold,
                    color = TextSecondary
                )
            }

            Spacer(modifier = Modifier.height(20.dp))

            Text(
                text = "GAME PREFERENCES",
                fontSize = 20.sp,
                fontWeight = FontWeight.Bold,
                fontFamily = FontFamily.Monospace,
                color = Color.White
            )

            Spacer(modifier = Modifier.height(16.dp))

            // Audio sliders group
            Column(
                modifier = Modifier
                    .fillMaxWidth()
                    .background(DarkSurface, shape = RoundedCornerShape(12.dp))
                    .border(1.dp, BorderMetal, shape = RoundedCornerShape(12.dp))
                    .padding(16.dp),
                verticalArrangement = Arrangement.spacedBy(16.dp)
            ) {
                Text(
                    text = "AUDIO CONTROLS",
                    fontSize = 10.sp,
                    fontFamily = FontFamily.Monospace,
                    fontWeight = FontWeight.Bold,
                    color = TextSecondary
                )

                // Master Volume
                VolumeSliderItem(
                    label = "Master Volume",
                    value = gameState.settings.masterVolume,
                    onValueChange = { gameState.updateVolume("master", it) }
                )

                // Music Volume
                VolumeSliderItem(
                    label = "BGM Music",
                    value = gameState.settings.musicVolume,
                    onValueChange = { gameState.updateVolume("music", it) }
                )

                // SFX Volume
                VolumeSliderItem(
                    label = "SFX Sounds",
                    value = gameState.settings.sfxVolume,
                    onValueChange = { gameState.updateVolume("sfx", it) }
                )
            }

            Spacer(modifier = Modifier.height(16.dp))

            // Game mechanics toggles
            Column(
                modifier = Modifier
                    .fillMaxWidth()
                    .background(DarkSurface, shape = RoundedCornerShape(12.dp))
                    .border(1.dp, BorderMetal, shape = RoundedCornerShape(12.dp))
                    .padding(16.dp),
                verticalArrangement = Arrangement.spacedBy(14.dp)
            ) {
                Text(
                    text = "HAPTICS & SPECIAL EFFECTS",
                    fontSize = 10.sp,
                    fontFamily = FontFamily.Monospace,
                    fontWeight = FontWeight.Bold,
                    color = TextSecondary
                )

                ToggleItem(
                    label = "Haptic Feedback",
                    desc = "Vibrates device on espresso pull or counter spill",
                    checked = gameState.settings.hapticFeedback,
                    onToggle = { gameState.toggleSetting("haptic") }
                )

                ToggleItem(
                    label = "Screen Shake",
                    desc = "Shakes camera when incoming trains roll in",
                    checked = gameState.settings.screenShake,
                    onToggle = { gameState.toggleSetting("shake") }
                )

                ToggleItem(
                    label = "Rush Red Flashes",
                    desc = "Flashes warning bezel when in rush hour",
                    checked = gameState.settings.rushFlashes,
                    onToggle = { gameState.toggleSetting("rush") }
                )
            }

            Spacer(modifier = Modifier.height(16.dp))

            // FUTURE UPDATE ARCHITECTURE BLOCK
            Column(
                modifier = Modifier
                    .fillMaxWidth()
                    .background(Color(0xFF1E1A3D), shape = RoundedCornerShape(12.dp))
                    .border(1.dp, PurpleAccent, shape = RoundedCornerShape(12.dp))
                    .padding(16.dp),
                verticalArrangement = Arrangement.spacedBy(10.dp),
                horizontalAlignment = Alignment.CenterHorizontally
            ) {
                Text(
                    text = "📶 APK DISTRIBUTION SYSTEM",
                    fontSize = 11.sp,
                    fontFamily = FontFamily.Monospace,
                    fontWeight = FontWeight.Bold,
                    color = AmberAccent,
                    modifier = Modifier.fillMaxWidth(),
                    textAlign = TextAlign.Start
                )

                Text(
                    text = "This application is connected to the live Espresso Express build network. Tapping below queries the version registry, compares your local package signatures, and triggers native browser updates.",
                    fontSize = 11.sp,
                    color = TextPrimary,
                    lineHeight = 16.sp,
                    modifier = Modifier.fillMaxWidth(),
                    textAlign = TextAlign.Start
                )

                Spacer(modifier = Modifier.height(6.dp))

                Text(
                    text = "Current Version",
                    fontSize = 11.sp,
                    fontFamily = FontFamily.Monospace,
                    color = TextSecondary,
                    textAlign = TextAlign.Center
                )
                Text(
                    text = "v$currentVersionName",
                    fontSize = 18.sp,
                    fontFamily = FontFamily.Monospace,
                    fontWeight = FontWeight.Bold,
                    color = TextPrimary,
                    textAlign = TextAlign.Center
                )

                Spacer(modifier = Modifier.height(10.dp))

                when (updateState) {
                    UpdateState.IDLE -> {
                        Button(
                            onClick = {
                                scope.launch {
                                    updateState = UpdateState.CHECKING
                                    try {
                                        val urls = listOf(
                                            "https://raw.githubusercontent.com/karmapatel/Espresso-Express/main/public/version.json",
                                            "https://raw.githubusercontent.com/karmapatel/Espresso-Express/master/public/version.json",
                                            "https://api.github.com/repos/karmapatel/Espresso-Express/releases/latest",
                                            "https://api.github.com/repos/karmapatel4/Espresso-Express/releases/latest"
                                        )
                                        var foundVersion: String? = null
                                        var foundApkUrl: String? = null
                                        var lastEx: Exception? = null

                                        withContext(Dispatchers.IO) {
                                            for (urlStr in urls) {
                                                try {
                                                    val url = URL(urlStr)
                                                    val connection = url.openConnection() as java.net.HttpURLConnection
                                                    connection.requestMethod = "GET"
                                                    connection.setRequestProperty("User-Agent", "EspressoExpressUpdater/1.0.7")
                                                    connection.connectTimeout = 6000
                                                    connection.readTimeout = 6000
                                                    connection.doInput = true

                                                    val responseCode = connection.responseCode
                                                    if (responseCode == java.net.HttpURLConnection.HTTP_OK) {
                                                        val content = connection.inputStream.bufferedReader().use { it.readText() }.trim()
                                                        if (urlStr.contains("releases/latest")) {
                                                            val json = JSONObject(content)
                                                            val tag = json.optString("tag_name", "").trim()
                                                            if (tag.isNotEmpty()) {
                                                                foundVersion = tag.removePrefix("v")
                                                                val assets = json.optJSONArray("assets")
                                                                if (assets != null && assets.length() > 0) {
                                                                    for (i in 0 until assets.length()) {
                                                                        val asset = assets.optJSONObject(i)
                                                                        val name = asset.optString("name", "")
                                                                        if (name.endsWith(".apk")) {
                                                                            foundApkUrl = asset.optString("browser_download_url", "")
                                                                            break
                                                                        }
                                                                    }
                                                                }
                                                                if (foundApkUrl == null) {
                                                                    foundApkUrl = "https://github.com/karmapatel/Espresso-Express/releases/download/$tag/espresso-express.apk"
                                                                }
                                                                break
                                                            }
                                                        } else {
                                                            val json = JSONObject(content)
                                                            val vName = json.optString("versionName", "").trim()
                                                            if (vName.isNotEmpty()) {
                                                                foundVersion = vName
                                                                foundApkUrl = json.optString("apkUrl", "")
                                                                break
                                                            }
                                                        }
                                                    } else {
                                                        lastEx = Exception("HTTP $responseCode")
                                                    }
                                                } catch (e: Exception) {
                                                    lastEx = e
                                                }
                                            }
                                        }

                                        if (foundVersion == null) {
                                            throw lastEx ?: Exception("Connection timed out")
                                        }

                                        latestVersionName = foundVersion!!
                                        latestApkUrl = foundApkUrl ?: "https://ais-pre-472yxwq4z56wuftegmr7lu-324319867172.asia-southeast1.run.app/downloads/EspressoExpress.apk"

                                        if (compareVersions(latestVersionName, currentVersionName) > 0) {
                                            updateState = UpdateState.UPDATE_AVAILABLE
                                        } else {
                                            updateState = UpdateState.UP_TO_DATE
                                        }
                                    } catch (e: Exception) {
                                        updateState = UpdateState.FAILED
                                    }
                                }
                            },
                            modifier = Modifier.fillMaxWidth(),
                            colors = ButtonDefaults.buttonColors(containerColor = PurpleAccent),
                            shape = RoundedCornerShape(10.dp)
                        ) {
                            Text(
                                text = "CHECK FOR UPDATES",
                                fontFamily = FontFamily.Monospace,
                                fontSize = 11.sp,
                                fontWeight = FontWeight.Bold
                            )
                        }
                    }
                    UpdateState.CHECKING -> {
                        CircularProgressIndicator(color = PurpleAccent, modifier = Modifier.size(24.dp))
                        Spacer(modifier = Modifier.height(8.dp))
                        Text(
                            text = "Checking for updates...",
                            fontSize = 11.sp,
                            fontFamily = FontFamily.Monospace,
                            color = TextSecondary,
                            textAlign = TextAlign.Center
                        )
                    }
                    UpdateState.UP_TO_DATE -> {
                        Text(
                            text = "You're up to date.",
                            fontSize = 12.sp,
                            fontFamily = FontFamily.Monospace,
                            fontWeight = FontWeight.Bold,
                            color = Color(0xFF10B981),
                            textAlign = TextAlign.Center
                        )
                    }
                    UpdateState.UPDATE_AVAILABLE -> {
                        Column(
                            horizontalAlignment = Alignment.CenterHorizontally,
                            modifier = Modifier.fillMaxWidth()
                        ) {
                            Text(
                                text = "New Version Available",
                                fontSize = 11.sp,
                                fontFamily = FontFamily.Monospace,
                                color = AmberAccent,
                                textAlign = TextAlign.Center
                            )
                            Text(
                                text = "v$latestVersionName",
                                fontSize = 18.sp,
                                fontFamily = FontFamily.Monospace,
                                fontWeight = FontWeight.Bold,
                                color = Color(0xFF10B981),
                                textAlign = TextAlign.Center,
                                modifier = Modifier.padding(bottom = 12.dp)
                            )
                            Button(
                                onClick = {
                                    gameState.triggerToast("Downloading Update APK...", "📶")
                                    val browserIntent = Intent(Intent.ACTION_VIEW, Uri.parse(latestApkUrl))
                                    context.startActivity(browserIntent)
                                },
                                modifier = Modifier.fillMaxWidth(),
                                colors = ButtonDefaults.buttonColors(containerColor = Color(0xFF10B981)),
                                shape = RoundedCornerShape(10.dp)
                            ) {
                                Text(
                                    text = "DOWNLOAD UPDATE",
                                    fontFamily = FontFamily.Monospace,
                                    fontSize = 11.sp,
                                    fontWeight = FontWeight.Bold,
                                    color = Color.Black
                                )
                            }
                        }
                    }
                    UpdateState.FAILED -> {
                        Column(
                            horizontalAlignment = Alignment.CenterHorizontally,
                            modifier = Modifier.fillMaxWidth()
                        ) {
                            Text(
                                text = "Unable to check for updates.",
                                fontSize = 12.sp,
                                fontFamily = FontFamily.Monospace,
                                fontWeight = FontWeight.Bold,
                                color = Color(0xFFEF4444),
                                textAlign = TextAlign.Center,
                                modifier = Modifier.padding(bottom = 12.dp)
                            )
                            Button(
                                onClick = {
                                    scope.launch {
                                        updateState = UpdateState.CHECKING
                                        try {
                                            val urls = listOf(
                                                "https://raw.githubusercontent.com/karmapatel/Espresso-Express/main/public/version.json",
                                                "https://raw.githubusercontent.com/karmapatel/Espresso-Express/master/public/version.json",
                                                "https://api.github.com/repos/karmapatel/Espresso-Express/releases/latest",
                                                "https://api.github.com/repos/karmapatel4/Espresso-Express/releases/latest"
                                            )
                                            var foundVersion: String? = null
                                            var foundApkUrl: String? = null
                                            var lastEx: Exception? = null

                                            withContext(Dispatchers.IO) {
                                                for (urlStr in urls) {
                                                    try {
                                                        val url = URL(urlStr)
                                                        val connection = url.openConnection() as java.net.HttpURLConnection
                                                        connection.requestMethod = "GET"
                                                        connection.setRequestProperty("User-Agent", "EspressoExpressUpdater/1.0.7")
                                                        connection.connectTimeout = 6000
                                                        connection.readTimeout = 6000
                                                        connection.doInput = true

                                                        val responseCode = connection.responseCode
                                                        if (responseCode == java.net.HttpURLConnection.HTTP_OK) {
                                                            val content = connection.inputStream.bufferedReader().use { it.readText() }.trim()
                                                            if (urlStr.contains("releases/latest")) {
                                                                val json = JSONObject(content)
                                                                val tag = json.optString("tag_name", "").trim()
                                                                if (tag.isNotEmpty()) {
                                                                    foundVersion = tag.removePrefix("v")
                                                                    val assets = json.optJSONArray("assets")
                                                                    if (assets != null && assets.length() > 0) {
                                                                        for (i in 0 until assets.length()) {
                                                                            val asset = assets.optJSONObject(i)
                                                                            val name = asset.optString("name", "")
                                                                            if (name.endsWith(".apk")) {
                                                                                foundApkUrl = asset.optString("browser_download_url", "")
                                                                                break
                                                                            }
                                                                        }
                                                                    }
                                                                    if (foundApkUrl == null) {
                                                                        foundApkUrl = "https://github.com/karmapatel/Espresso-Express/releases/download/$tag/espresso-express.apk"
                                                                    }
                                                                    break
                                                                }
                                                            } else {
                                                                val json = JSONObject(content)
                                                                val vName = json.optString("versionName", "").trim()
                                                                if (vName.isNotEmpty()) {
                                                                    foundVersion = vName
                                                                    foundApkUrl = json.optString("apkUrl", "")
                                                                    break
                                                                }
                                                            }
                                                        } else {
                                                            lastEx = Exception("HTTP $responseCode")
                                                        }
                                                    } catch (e: Exception) {
                                                        lastEx = e
                                                    }
                                                }
                                            }

                                            if (foundVersion == null) {
                                                throw lastEx ?: Exception("Connection timed out")
                                            }

                                            latestVersionName = foundVersion!!
                                            latestApkUrl = foundApkUrl ?: "https://ais-pre-472yxwq4z56wuftegmr7lu-324319867172.asia-southeast1.run.app/downloads/EspressoExpress.apk"

                                            if (compareVersions(latestVersionName, currentVersionName) > 0) {
                                                updateState = UpdateState.UPDATE_AVAILABLE
                                            } else {
                                                updateState = UpdateState.UP_TO_DATE
                                            }
                                        } catch (e: Exception) {
                                            updateState = UpdateState.FAILED
                                        }
                                    }
                                },
                                modifier = Modifier.fillMaxWidth(),
                                colors = ButtonDefaults.buttonColors(containerColor = Color(0xFFEF4444)),
                                shape = RoundedCornerShape(10.dp)
                            ) {
                                Text(
                                    text = "TRY AGAIN",
                                    fontFamily = FontFamily.Monospace,
                                    fontSize = 11.sp,
                                    fontWeight = FontWeight.Bold
                                )
                            }
                        }
                    }
                }
            }

            Spacer(modifier = Modifier.height(30.dp))
        }
    }
}

@Composable
fun VolumeSliderItem(
    label: String,
    value: Int,
    onValueChange: (Int) -> Unit
) {
    Column {
        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.SpaceBetween
        ) {
            Text(text = label, fontSize = 13.sp, color = TextPrimary)
            Text(text = "$value%", fontSize = 13.sp, fontFamily = FontFamily.Monospace, color = AmberAccent)
        }
        Slider(
            value = value.toFloat(),
            onValueChange = { onValueChange(it.toInt()) },
            valueRange = 0f..100f,
            colors = SliderDefaults.colors(
                thumbColor = AmberAccent,
                activeTrackColor = AmberAccent,
                inactiveTrackColor = Color(0xFF221E3E)
            )
        )
    }
}

@Composable
fun ToggleItem(
    label: String,
    desc: String,
    checked: Boolean,
    onToggle: () -> Unit
) {
    Row(
        modifier = Modifier
            .fillMaxWidth()
            .clickable { onToggle() },
        horizontalArrangement = Arrangement.SpaceBetween,
        verticalAlignment = Alignment.CenterVertically
    ) {
        Column(modifier = Modifier.weight(1f)) {
            Text(text = label, fontSize = 13.sp, fontWeight = FontWeight.Bold, color = TextPrimary)
            Text(text = desc, fontSize = 11.sp, color = TextSecondary)
        }
        Switch(
            checked = checked,
            onCheckedChange = { onToggle() },
            colors = SwitchDefaults.colors(
                checkedThumbColor = AmberAccent,
                checkedTrackColor = Color(0xFF513D8F)
            )
        )
    }
}
