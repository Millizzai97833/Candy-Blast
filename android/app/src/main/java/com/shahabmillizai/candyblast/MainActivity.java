package com.shahabmillizai.candyblast;

import android.annotation.SuppressLint;
import android.content.res.AssetManager;
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
import androidx.annotation.Nullable;
import androidx.appcompat.app.AppCompatActivity;
import androidx.webkit.WebViewAssetLoader;

import com.startapp.sdk.adsbase.StartAppAd;
import com.startapp.sdk.adsbase.StartAppSDK;
import com.startapp.sdk.adsbase.adlisteners.VideoListener;
import com.startapp.sdk.ads.banner.Banner;

import java.io.IOException;
import java.io.InputStream;
import java.util.HashMap;
import java.util.Map;

/**
 * Candy Blast Main Activity
 * Developer: Shahab Millizai
 * Package: com.shahabmillizai.candyblast
 * Start.io App ID: 210945361
 */
public class MainActivity extends AppCompatActivity {

    public static final String TAG = "CandyBlast";
    public static final String STARTIO_APP_ID = "210945361";
    public static final String VIRTUAL_HOST = "appassets.androidplatform.net";
    public static final String PRIMARY_URL = "https://appassets.androidplatform.net/assets/public/index.html";
    public static final String FALLBACK_URL = "file:///android_asset/public/index.html";

    private WebView webView;
    private RelativeLayout rootLayout;
    private FrameLayout bannerContainer;
    private Banner startIoBanner;

    private StartAppAd interstitialAd;
    private StartAppAd rewardedAd;
    private String pendingRewardType = "moves";

    private WebViewAssetLoader fallbackAssetLoader;
    private boolean hasFallbackTriggered = false;

    @SuppressLint({"SetJavaScriptEnabled", "ClickableViewAccessibility"})
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        // 1. Initialize Start.io Ads SDK 5.4.0 with App ID 210945361 safely
        try {
            StartAppSDK.init(this, STARTIO_APP_ID, false);
            StartAppAd.disableSplash();
            StartAppSDK.setTestAdsEnabled(false);
            Log.d(TAG, "Start.io SDK initialized with App ID: " + STARTIO_APP_ID);
        } catch (Exception e) {
            Log.e(TAG, "Error initializing Start.io SDK", e);
        }

        // 2. Preload Interstitial and Rewarded Ads
        try {
            interstitialAd = new StartAppAd(this);
            interstitialAd.loadAd(StartAppAd.AdMode.AUTOMATIC);

            rewardedAd = new StartAppAd(this);
            preloadRewardedAd();
        } catch (Exception e) {
            Log.e(TAG, "Error configuring Start.io ads", e);
        }

        // 3. Create Root Layout with Candy Theme Background (#2B083C) to prevent white flash
        rootLayout = new RelativeLayout(this);
        rootLayout.setLayoutParams(new ViewGroup.LayoutParams(
                ViewGroup.LayoutParams.MATCH_PARENT,
                ViewGroup.LayoutParams.MATCH_PARENT
        ));
        rootLayout.setBackgroundColor(0xFF2B083C);

        // 4. Initialize fallback WebViewAssetLoader
        try {
            fallbackAssetLoader = new WebViewAssetLoader.Builder()
                    .addPathHandler("/assets/", new WebViewAssetLoader.AssetsPathHandler(this))
                    .build();
        } catch (Exception e) {
            Log.w(TAG, "WebViewAssetLoader initialization note", e);
        }

        // 5. Initialize & Configure High-Performance WebView
        webView = new WebView(this);
        RelativeLayout.LayoutParams webViewParams = new RelativeLayout.LayoutParams(
                ViewGroup.LayoutParams.MATCH_PARENT,
                ViewGroup.LayoutParams.MATCH_PARENT
        );
        webView.setLayoutParams(webViewParams);
        webView.setBackgroundColor(0xFF2B083C);
        webView.setOverScrollMode(View.OVER_SCROLL_NEVER);

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
        settings.setMixedContentMode(WebSettings.MIXED_CONTENT_ALWAYS_ALLOW);

        // Hardware acceleration
        webView.setLayerType(View.LAYER_TYPE_HARDWARE, null);

        // Add JavaScript bridge for Start.io ads
        webView.addJavascriptInterface(new StartIoBridge(this), "AndroidStartIo");

        webView.setWebViewClient(new WebViewClient() {
            @Nullable
            @Override
            public WebResourceResponse shouldInterceptRequest(WebView view, WebResourceRequest request) {
                if (request != null && request.getUrl() != null) {
                    WebResourceResponse response = interceptAsset(request.getUrl());
                    if (response != null) return response;
                }
                return super.shouldInterceptRequest(view, request);
            }

            @Nullable
            @Override
            public WebResourceResponse shouldInterceptRequest(WebView view, String url) {
                if (url != null) {
                    WebResourceResponse response = interceptAsset(Uri.parse(url));
                    if (response != null) return response;
                }
                return super.shouldInterceptRequest(view, url);
            }

            @Override
            public void onReceivedError(WebView view, WebResourceRequest request, WebResourceError error) {
                super.onReceivedError(view, request, error);
                Log.e(TAG, "WebView request error: " + error.getDescription() + " on " + request.getUrl());

                // Fallback to direct android_asset file loading if virtual domain fails
                if (request.isForMainFrame() && !hasFallbackTriggered) {
                    hasFallbackTriggered = true;
                    Log.w(TAG, "Activating fallback asset URL: " + FALLBACK_URL);
                    view.post(() -> view.loadUrl(FALLBACK_URL));
                }
            }

            @Override
            public void onPageFinished(WebView view, String url) {
                super.onPageFinished(view, url);
                Log.d(TAG, "Candy Blast page finished loading: " + url);
            }
        });

        webView.setWebChromeClient(new WebChromeClient() {
            @Override
            public boolean onConsoleMessage(ConsoleMessage consoleMessage) {
                Log.d(TAG, "[CandyBlastJS] " + consoleMessage.message() + " (Line "
                        + consoleMessage.lineNumber() + " of " + consoleMessage.sourceId() + ")");
                return true;
            }
        });

        rootLayout.addView(webView);

        // 6. Native Start.io Banner Container at Bottom
        bannerContainer = new FrameLayout(this);
        RelativeLayout.LayoutParams bannerParams = new RelativeLayout.LayoutParams(
                ViewGroup.LayoutParams.MATCH_PARENT,
                ViewGroup.LayoutParams.WRAP_CONTENT
        );
        bannerParams.addRule(RelativeLayout.ALIGN_PARENT_BOTTOM);
        bannerContainer.setLayoutParams(bannerParams);
        rootLayout.addView(bannerContainer);

        setContentView(rootLayout);

        // 7. Launch Game immediately
        Log.d(TAG, "Launching Candy Blast at: " + PRIMARY_URL);
        webView.loadUrl(PRIMARY_URL);

        // 8. Attach Banner Ad
        showNativeBanner();
    }

    /**
     * Intercepts and serves local APK assets with strict, correct MIME types
     * and CORS headers. This eliminates the Chromium "Strict MIME type checking"
     * error for ES modules and prevents black/white blank stuck screens.
     */
    @Nullable
    private WebResourceResponse interceptAsset(@NonNull Uri uri) {
        String host = uri.getHost();
        String path = uri.getPath();

        if (path == null) return null;

        // Strip leading slash
        if (path.startsWith("/")) {
            path = path.substring(1);
        }

        // Only intercept requests directed to our app assets host or file:///android_asset/
        boolean isAppAssetHost = VIRTUAL_HOST.equalsIgnoreCase(host) || "localhost".equalsIgnoreCase(host);
        boolean isAssetScheme = "file".equalsIgnoreCase(uri.getScheme()) && uri.toString().contains("android_asset");

        if (!isAppAssetHost && !isAssetScheme) {
            return null;
        }

        // Candidate paths to search inside Android assets
        String[] candidatePaths;
        if (path.startsWith("assets/public/")) {
            candidatePaths = new String[]{
                    path.substring(7), // public/...
                    path,
                    path.substring(14) // without assets/public/
            };
        } else if (path.startsWith("assets/")) {
            candidatePaths = new String[]{
                    "public/" + path.substring(7),
                    path.substring(7),
                    path,
                    "public/" + path
            };
        } else if (path.startsWith("public/")) {
            candidatePaths = new String[]{
                    path,
                    path.substring(7)
            };
        } else {
            candidatePaths = new String[]{
                    "public/" + path,
                    path,
                    "public/assets/" + path
            };
        }

        AssetManager assetManager = getAssets();
        for (String candidate : candidatePaths) {
            try {
                InputStream is = assetManager.open(candidate);
                String mimeType = getMimeTypeForPath(candidate);

                Map<String, String> headers = new HashMap<>();
                headers.put("Access-Control-Allow-Origin", "*");
                headers.put("Access-Control-Allow-Methods", "GET, OPTIONS");
                headers.put("Cache-Control", "no-cache, no-store, must-revalidate");

                return new WebResourceResponse(mimeType, "utf-8", 200, "OK", headers, is);
            } catch (IOException ignored) {
                // Try next candidate path
            }
        }

        // Fallback to AndroidX WebViewAssetLoader if available
        if (fallbackAssetLoader != null) {
            try {
                return fallbackAssetLoader.shouldInterceptRequest(uri);
            } catch (Exception ignored) {}
        }

        return null;
    }

    /**
     * Resolves precise standard MIME types to satisfy Chromium strict module checking.
     */
    @NonNull
    private String getMimeTypeForPath(@NonNull String path) {
        String lower = path.toLowerCase();
        if (lower.endsWith(".html") || lower.endsWith(".htm")) {
            return "text/html";
        } else if (lower.endsWith(".js") || lower.endsWith(".mjs")) {
            return "application/javascript";
        } else if (lower.endsWith(".css")) {
            return "text/css";
        } else if (lower.endsWith(".json")) {
            return "application/json";
        } else if (lower.endsWith(".png")) {
            return "image/png";
        } else if (lower.endsWith(".jpg") || lower.endsWith(".jpeg")) {
            return "image/jpeg";
        } else if (lower.endsWith(".svg")) {
            return "image/svg+xml";
        } else if (lower.endsWith(".ico")) {
            return "image/x-icon";
        } else if (lower.endsWith(".woff2")) {
            return "font/woff2";
        } else if (lower.endsWith(".woff")) {
            return "font/woff";
        } else if (lower.endsWith(".ttf")) {
            return "font/ttf";
        } else if (lower.endsWith(".txt")) {
            return "text/plain";
        }
        return "application/octet-stream";
    }

    private void preloadRewardedAd() {
        try {
            if (rewardedAd == null) {
                rewardedAd = new StartAppAd(this);
            }
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
        } catch (Exception e) {
            Log.e(TAG, "Error preloading Rewarded Ad", e);
        }
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
                    Log.d(TAG, "Start.io Interstitial not ready, triggering load...");
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
                    Log.d(TAG, "Start.io Rewarded Ad not ready, loading...");
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
