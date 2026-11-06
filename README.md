# 🍬 Candy Blast - Match 3 Puzzle Saga

A complete Candy Crush Saga-style puzzle game with juicy cascades, special candies, level progression, and **Start.io Ads SDK 5.4.0** integration for monetization.

- **App Name**: Candy Blast
- **Package Name**: `com.shahabmillizai.candyblast`
- **Start.io App ID**: `210945361`
- **Publisher ID**: `116353420` (in `app-ads.txt`)
- **Start.io SDK Version**: `5.4.0` (`com.startapp:inapp-sdk:5.4.0`)

---

## 🚀 How to Build the Release APK on GitHub

This repository is already configured with an automated **GitHub Actions CI/CD pipeline** located at `.github/workflows/build-apk.yml`.

### 1. Push Code to GitHub
Push your repository to GitHub:
```bash
git add .
git commit -m "Initial Candy Blast with Start.io SDK"
git push origin main
```

### 2. Automated Build
GitHub Actions will automatically:
1. Compile and bundle the web game assets (`npm run build`).
2. Copy the bundle to the Android assets directory (`android/app/src/main/assets/public/`).
3. Set up JDK 17 & Android SDK.
4. Build the signed release APK (`assembleRelease`) and Google Play Store App Bundle (`bundleRelease`).

### 3. Download Your Release Files
1. Go to your repository on GitHub.
2. Click on the **Actions** tab.
3. Click the latest workflow run: **Build Candy Blast Release APK & AAB**.
4. Scroll to **Artifacts** at the bottom to download:
   - 📱 **Candy-Blast-Release-APK**: Install directly on any Android device.
   - 📦 **Candy-Blast-GooglePlay-AAB**: Upload directly to Google Play Console or other Android app stores.

---

## 💻 Local Build (Optional)

If you have Android Studio or the Android SDK installed locally:

```bash
# 1. Build web assets
npm install
npm run build

# 2. Copy assets into Android project
mkdir -p android/app/src/main/assets/public
cp -r dist/* android/app/src/main/assets/public/

# 3. Assemble Release APK
cd android
./gradlew assembleRelease
```
The output APK will be generated at:
`android/app/build/outputs/apk/release/app-release.apk`

---

## 🛡️ Start.io Ad Units Configured

| Ad Unit | Placement | Implementation |
|---|---|---|
| **Banner Ad** | Bottom of game screen | `com.startapp.sdk.ads.banner.Banner` / `showBanner()` |
| **Interstitial Ad** | Level completion & game over | `StartAppAd.showAd(this)` / `showInterstitial()` |
| **Rewarded Video** | Watch for +5 Moves & Boosters | `StartAppAd.AdMode.REWARDED_VIDEO` |
| **Authorized Sellers** | Domain root | `public/app-ads.txt` (Start.io ID: 116353420) |

---

## 📄 License
Apache-2.0
