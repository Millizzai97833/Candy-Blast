package com.shahabmillizai.candyblast;

import android.annotation.SuppressLint;
import android.net.Uri;
import android.os.Bundle;
import android.util.Log;
import android.view.View;
import android.view.ViewGroup;
import android.webkit.ConsoleMessage;
import android.webkit.WebChromeClient;
import android.webkit.WebResourceError;
import android.webkit.WebResourceRequest;
import android.webkit.WebResourceResponse;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.widget.FrameLayout;
import android.widget.RelativeLayout;
import androidx.annotation.NonNull;
import androidx.appcompat.app.AppCompatActivity;
import androidx.webkit.WebViewAssetLoader;

import com.startapp.sdk.adsbase.StartAppAd;
import com.startapp.sdk.adsbase.StartAppSDK;
import com.startapp.sdk.adsbase.adlisteners.VideoListener;
import com.startapp.sdk.ads.banner.Banner;

/**
 * Candy Blast Main Activity
 * Developer: Shahab Millizai
 * Package: com.shahabmillizai.candyblast
 * Start.io App ID: 210945361
 */
public class MainActivity extends AppCompatActivity {

    public static final String TAG = "CandyBlast";
    public static final String STARTIO_APP_ID = "210945361";

    private WebView webView;
    private RelativeLayout rootLayout;
    private FrameLayout bannerContainer;
    private Banner startIoBanner;

    private StartAppAd interstitialAd;
    private StartAppAd rewardedAd;
    private String pendingRewardType = "moves";

    @SuppressLint({"SetJavaScriptEnabled", "ClickableViewAccessibility"})
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        // 1. Initialize Start.io Ads SDK 5.4.0 with App ID 210945361
        try {
            StartAppSDK.init(this, STARTIO_APP_ID, false);
            StartAppAd.disableSplash();
            StartAppSDK.setTestAdsEnabled(false);
            Log.d(TAG, "Start.io SDK initialized with App ID: " + STARTIO_APP_ID);
        } catch (Exception e) {
            Log.e(TAG, "Error initializing Start.io SDK", e);
        }

        // 2. Preload Interstitial and Rewarded Ads
        interstitialAd = new StartAppAd(this);
        interstitialAd.loadAd(StartAppAd.AdMode.AUTOMATIC);

        rewardedAd = new StartAppAd(this);
        preloadRewardedAd();

        // 3. Create Root Layout with Candy Theme Background
        rootLayout = new RelativeLayout(this);
        rootLayout.setLayoutParams(new ViewGroup.LayoutParams(
                ViewGroup.LayoutParams.MATCH_PARENT,
                ViewGroup.LayoutParams.MATCH_PARENT
        ));
        rootLayout.setBackgroundColor(0xFF2B083C); // Deep candy purple to prevent white flash

        // 4. Configure Modern WebViewAssetLoader (Fixes Blank Screen Problem)
        // Eliminates file:// CORS restrictions and allows seamless ES Module / Web Audio loading offline
        final WebViewAssetLoader assetLoader = new WebViewAssetLoader.Builder()
                .addPathHandler("/assets/", new WebViewAssetLoader.AssetsPathHandler(this))
                .build();

        webView = new WebView(this);
        RelativeLayout.LayoutParams webViewParams = new RelativeLayout.LayoutParams(
                ViewGroup.LayoutParams.MATCH_PARENT,
                ViewGroup.LayoutParams.MATCH_PARENT
        );
        webView.setLayoutParams(webViewParams);
        webView.setBackgroundColor(0xFF2B083C);

        WebSettings settings = webView.getSettings();
        settings.setJavaScriptEnabled(true);
        settings.setDomStorageEnabled(true);
        settings.setDatabaseEnabled(true);
        settings.setMediaPlaybackRequiresUserGesture(false);
        settings.setAllowFileAccess(true);
        settings.setAllowContentAccess(true);
        settings.setAllowFileAccessFromFileURLs(true);
        settings.setAllowUniversalAccessFromFileURLs(true);
        settings.setLoadWithOverviewMode(true);
        settings.setUseWideViewPort(true);
        settings.setCacheMode(WebSettings.LOAD_DEFAULT);

        // Hardware acceleration support
        webView.setLayerType(View.LAYER_TYPE_HARDWARE, null);

        // Add JavaScript bridge for Start.io ads
        webView.addJavascriptInterface(new StartIoBridge(this), "AndroidStartIo");

        webView.setWebViewClient(new WebViewClient() {
            @Override
            public WebResourceResponse shouldInterceptRequest(WebView view, WebResourceRequest request) {
                return assetLoader.shouldInterceptRequest(request.getUrl());
            }

            @Override
            public void onReceivedError(WebView view, WebResourceRequest request, WebResourceError error) {
                super.onReceivedError(view, request, error);
                Log.e(TAG, "WebView error: " + error.getDescription() + " on " + request.getUrl());
            }

            @Override
            public void onPageFinished(WebView view, String url) {
                super.onPageFinished(view, url);
                Log.d(TAG, "Game loaded successfully: " + url);
            }
        });

        webView.setWebChromeClient(new WebChromeClient() {
            @Override
            public boolean onConsoleMessage(ConsoleMessage consoleMessage) {
                Log.d(TAG, "[Game JS] " + consoleMessage.message() + " -- From line "
                        + consoleMessage.lineNumber() + " of " + consoleMessage.sourceId());
                return true;
            }
        });

        rootLayout.addView(webView);

        // 5. Native Start.io Banner Container at Bottom
        bannerContainer = new FrameLayout(this);
        RelativeLayout.LayoutParams bannerParams = new RelativeLayout.LayoutParams(
                ViewGroup.LayoutParams.MATCH_PARENT,
                ViewGroup.LayoutParams.WRAP_CONTENT
        );
        bannerParams.addRule(RelativeLayout.ALIGN_PARENT_BOTTOM);
        bannerContainer.setLayoutParams(bannerParams);

        rootLayout.addView(bannerContainer);
        setContentView(rootLayout);

        // 6. Launch the Game via AndroidX AssetLoader (Secure Virtual Origin, Zero CORS, Instant Start)
        webView.loadUrl("https://appassets.androidplatform.net/assets/public/index.html");

        // Attach Banner
        showNativeBanner();
    }

    private void preloadRewardedAd() {
        rewardedAd.setVideoListener(new VideoListener() {
            @Override
            public void onVideoCompleted() {
                Log.d(TAG, "Start.io Rewarded Video completed for: " + pendingRewardType);
                runOnUiThread(() -> {
                    String js = String.format("window.onStartIoRewardedCompleted && window.onStartIoRewardedCompleted('%s');", pendingRewardType);
                    webView.evaluateJavascript(js, null);
                });
                preloadRewardedAd();
            }
        });
        rewardedAd.loadAd(StartAppAd.AdMode.REWARDED_VIDEO);
    }

    public void showNativeBanner() {
        runOnUiThread(() -> {
            try {
                if (startIoBanner == null) {
                    startIoBanner = new Banner(this);
                    bannerContainer.removeAllViews();
                    bannerContainer.addView(startIoBanner);
                }
                bannerContainer.setVisibility(View.VISIBLE);
                Log.d(TAG, "Start.io Native Banner displayed");
            } catch (Exception e) {
                Log.e(TAG, "Error displaying Start.io Banner", e);
            }
        });
    }

    public void hideNativeBanner() {
        runOnUiThread(() -> {
            if (bannerContainer != null) {
                bannerContainer.setVisibility(View.GONE);
            }
        });
    }

    public void showNativeInterstitial(String reason) {
        runOnUiThread(() -> {
            try {
                if (interstitialAd != null && interstitialAd.isReady()) {
                    interstitialAd.showAd();
                    Log.d(TAG, "Start.io Interstitial shown for reason: " + reason);
                } else {
                    Log.d(TAG, "Start.io Interstitial not ready, reloading...");
                    if (interstitialAd != null) {
                        interstitialAd.showAd();
                    }
                }
                if (interstitialAd != null) {
                    interstitialAd.loadAd(StartAppAd.AdMode.AUTOMATIC);
                }
            } catch (Exception e) {
                Log.e(TAG, "Error displaying Start.io Interstitial", e);
            }
        });
    }

    public void showNativeRewarded(String rewardType) {
        runOnUiThread(() -> {
            try {
                this.pendingRewardType = rewardType;
                if (rewardedAd != null && rewardedAd.isReady()) {
                    rewardedAd.showAd();
                    Log.d(TAG, "Start.io Rewarded Ad shown for: " + rewardType);
                } else {
                    Log.d(TAG, "Start.io Rewarded Ad not ready, loading and displaying...");
                    preloadRewardedAd();
                    if (rewardedAd != null) {
                        rewardedAd.showAd();
                    }
                }
            } catch (Exception e) {
                Log.e(TAG, "Error displaying Start.io Rewarded Ad", e);
            }
        });
    }

    @Override
    public void onBackPressed() {
        if (webView != null && webView.canGoBack()) {
            webView.goBack();
        } else {
            super.onBackPressed();
        }
    }

    @Override
    protected void onResume() {
        super.onResume();
        if (webView != null) webView.onResume();
    }

    @Override
    protected void onPause() {
        super.onPause();
        if (webView != null) webView.onPause();
    }
}
