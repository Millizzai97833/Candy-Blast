# 🍬 Candy Blast - Native Android APK Project

A complete Candy Crush Saga-style puzzle game with juicy cascades, special candies, level progression, and **Start.io Ads SDK 5.4.0** integration for monetization.

- **App Name**: Candy Blast
- **Package Name**: `com.shahabmillizai.candyblast`
- **Developer**: Shahab Millizai
- **Start.io App ID**: `210945361`
- **Start.io SDK Version**: `5.4.0` (`com.startapp:inapp-sdk:5.4.0`)
- **Direct Publisher ID**: `116353420` (in `public/app-ads.txt`)
- **Compile SDK**: `36`
- **Target SDK**: `35`
- **Minimum SDK**: `24` (Android 7.0+)
- **Java**: `17`

---

## 🛠️ The Blank-Screen Problem & How It Was Solved

In prior Android attempts, opening the app resulted in a blank/white screen. This was caused by two critical issues:

1. **Relative Asset Paths**: By default, web bundlers generate absolute asset paths (`/assets/index.js`), which in Android's filesystem attempts to load from the device root (`/assets/`) rather than the app's internal assets.  
   *Fix*: Configured `base: './'` in `vite.config.ts`, ensuring all scripts, styles, sounds, and icons resolve relatively.
2. **ES Module & CORS Block on `file:///`**: Modern Chromium/Android WebViews restrict `<script type="module">` and local storage over `file://` scheme due to cross-origin security rules, silently failing with a blank screen.  
   *Fix*: Implemented AndroidX **`WebViewAssetLoader`** in `MainActivity.java`. It serves the game locally under a secure virtual origin (`https://appassets.androidplatform.net/assets/public/index.html`) directly from internal APK assets without network dependence. This enables full ES module execution, Web Audio API, LocalStorage, and hardware-accelerated animations completely offline.

---

## 🚀 How to Build Both Debug and Signed Release APKs on GitHub

This repository includes a production-ready **GitHub Actions CI/CD pipeline** at `.github/workflows/build-apk.yml`.

### 1. Push Code to GitHub
```bash
git add .
git commit -m "Candy Blast native Android release"
git push origin main
```

### 2. Automatic Build Process
GitHub Actions will:
1. Compile and bundle web assets (`npm run build`).
2. Package all assets inside `android/app/src/main/assets/public/`.
3. Set up JDK 17 and Android SDK 36.
4. Run:
   ```bash
   ./gradlew assembleDebug assembleRelease bundleRelease --stacktrace
   ```
5. Sign the release APK using the keystore.

### 3. Download APKs & AAB
In your GitHub repo:
1. Go to the **Actions** tab.
2. Click the latest run: **Build Candy Blast Release APK & AAB**.
3. Under **Artifacts**, download:
   - 📱 **`Candy-Blast-Debug-APK`**: Instant testing APK (installs on any phone without signature verification).
   - 🔒 **`Candy-Blast-Release-APK`**: Signed production APK with ProGuard obfuscation & optimizations.
   - 📦 **`Candy-Blast-GooglePlay-AAB`**: Android App Bundle ready for Google Play Store upload.

---

## 📱 How to Install the APK on Your Android Device

1. **Transfer the APK**: Download `Candy-Blast-Release-APK.apk` (or `Candy-Blast-Debug-APK.apk`) to your Android phone (via USB, Google Drive, WhatsApp, or browser).
2. **Allow Installation**:
   - Tap the downloaded `.apk` file.
   - If prompted with *"For your security, your phone is not allowed to install unknown apps from this source"*, tap **Settings** and toggle **Allow from this source** ON.
3. **Install & Play**: Tap **Install**. Tap **Open** — Candy Blast will launch immediately with full audio, touch controls, and Start.io ads!

---

## 💻 Local Build via Terminal / Android Studio

```bash
# 1. Build web bundle
npm install
npm run build

# 2. Sync into Android assets
mkdir -p android/app/src/main/assets/public
cp -r dist/* android/app/src/main/assets/public/

# 3. Build APKs with Gradle
cd android
./gradlew assembleDebug assembleRelease
```

Generated APKs:
- **Debug APK**: `android/app/build/outputs/apk/debug/app-debug.apk`
- **Release APK**: `android/app/build/outputs/apk/release/app-release.apk`

---

## 🛡️ Start.io Ad Units Configured

| Ad Unit | Placement | Implementation |
|---|---|---|
| **Banner Ad** | Bottom of game screen | `com.startapp.sdk.ads.banner.Banner` |
| **Interstitial Ad** | Level completion & game over | `StartAppAd.showAd(this)` |
| **Rewarded Video** | Watch for +5 Moves & Boosters | `StartAppAd.AdMode.REWARDED_VIDEO` |
| **Authorized Sellers** | Domain root | `public/app-ads.txt` (Start.io ID: 116353420) |

---

## 📄 License
Apache-2.0
