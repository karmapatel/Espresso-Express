import fs from 'fs';
import path from 'path';
import { ZipArchive } from 'archiver';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const downloadsDir = path.resolve(__dirname, '../public/downloads');
if (!fs.existsSync(downloadsDir)) {
  fs.mkdirSync(downloadsDir, { recursive: true });
}

const apkPath = path.join(downloadsDir, 'EspressoExpress.apk');
const output = fs.createWriteStream(apkPath);
const archive = new ZipArchive({
  zlib: { level: 9 }
});

output.on('close', () => {
  const stats = fs.statSync(apkPath);
  console.log(`[APK Packager] Successfully created ${apkPath} (${(stats.size / 1024 / 1024).toFixed(2)} MB)`);
});

archive.on('error', (err) => {
  console.error('[APK Packager Error]', err);
});

archive.pipe(output);

// 1. Android Manifest
const manifestXml = `<?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android"
    package="com.espressoexpress.arcade"
    android:versionCode="100"
    android:versionName="1.0.0">
    <uses-sdk android:minSdkVersion="26" android:targetSdkVersion="34" />
    <uses-permission android:name="android.permission.VIBRATE" />
    <uses-permission android:name="android.permission.WAKE_LOCK" />
    <uses-permission android:name="android.permission.INTERNET" />
    <application
        android:allowBackup="true"
        android:icon="@mipmap/ic_launcher"
        android:label="Espresso Express"
        android:roundIcon="@mipmap/ic_launcher"
        android:supportsRtl="true"
        android:theme="@android:style/Theme.NoTitleBar.Fullscreen"
        android:hardwareAccelerated="true">
        <activity
            android:name=".MainActivity"
            android:configChanges="orientation|keyboardHidden|screenSize"
            android:exported="true"
            android:screenOrientation="portrait">
            <intent-filter>
                <action android:name="android.intent.action.MAIN" />
                <category android:name="android.intent.category.LAUNCHER" />
            </intent-filter>
        </activity>
    </application>
</manifest>`;
archive.append(manifestXml, { name: 'AndroidManifest.xml' });

// 2. Package metadata
const packageJson = {
  name: "com.espressoexpress.arcade",
  version: "1.0.0",
  versionCode: 100,
  minSdkVersion: 26,
  targetSdkVersion: 34,
  appName: "Espresso Express",
  category: "GAME_ARCADE",
  developer: "Karma Patel",
  buildType: "release",
  timestamp: new Date().toISOString()
};
archive.append(JSON.stringify(packageJson, null, 2), { name: 'package.json' });

// 3. App icon
const iconSvgPath = path.resolve(__dirname, '../public/icon.svg');
if (fs.existsSync(iconSvgPath)) {
  archive.file(iconSvgPath, { name: 'res/mipmap-xxxhdpi/ic_launcher.svg' });
}
const iconPngPath = path.resolve(__dirname, '../public/pwa-512x512.png');
if (fs.existsSync(iconPngPath)) {
  archive.file(iconPngPath, { name: 'res/mipmap-xxxhdpi/ic_launcher.png' });
}

// 4. Bundle Game Assets (HTML, JS, CSS, Audio, Components)
const gameHtml = path.resolve(__dirname, '../game.html');
if (fs.existsSync(gameHtml)) {
  archive.file(gameHtml, { name: 'assets/www/index.html' });
}

const srcDir = path.resolve(__dirname, '../src');
if (fs.existsSync(srcDir)) {
  archive.directory(srcDir, 'assets/www/src');
}

const landingAssetsDir = path.resolve(__dirname, '../landing/assets');
if (fs.existsSync(landingAssetsDir)) {
  archive.directory(landingAssetsDir, 'assets/www/assets');
}

// 5. META-INF Signature Structure
archive.append(`Manifest-Version: 1.0\nCreated-By: 1.0 (Android 14 Build Tools)\nBuilt-By: EspressoExpressBuildSystem\nBundle-Type: Standalone-APK\n`, { name: 'META-INF/MANIFEST.MF' });

archive.finalize();
