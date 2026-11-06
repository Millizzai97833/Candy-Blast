package com.shahabmillizai.candyblast;

import android.webkit.JavascriptInterface;

/**
 * JavaScript to Android native bridge for Start.io Ads SDK 5.4.0.
 * Injected into WebView under 'window.AndroidStartIo'.
 */
public class StartIoBridge {

    private final MainActivity activity;

    public StartIoBridge(MainActivity activity) {
        this.activity = activity;
    }

    @JavascriptInterface
    public boolean isNativeAvailable() {
        return true;
    }

    @JavascriptInterface
    public String getAppId() {
        return "210945361";
    }

    @JavascriptInterface
    public String getPackageName() {
        return "com.shahabmillizai.candyblast";
    }

    @JavascriptInterface
    public void showBanner() {
        activity.runOnUiThread(activity::showNativeBanner);
    }

    @JavascriptInterface
    public void hideBanner() {
        activity.runOnUiThread(activity::hideNativeBanner);
    }

    @JavascriptInterface
    public void showInterstitial(String reason) {
        activity.runOnUiThread(() -> activity.showNativeInterstitial(reason));
    }

    @JavascriptInterface
    public void showRewarded(String rewardType) {
        activity.runOnUiThread(() -> activity.showNativeRewarded(rewardType));
    }
}
