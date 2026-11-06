package com.shahabmillizai.candyblast;

import android.annotation.SuppressLint;
import android.os.Bundle;
import android.view.View;
import android.view.ViewGroup;
import android.webkit.WebChromeClient;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.widget.FrameLayout;
import android.widget.RelativeLayout;
import androidx.appcompat.app.AppCompatActivity;

import com.startapp.sdk.adsbase.StartAppAd;
import com.startapp.sdk.adsbase.StartAppSDK;
import com.startapp.sdk.adsbase.adlisteners.VideoListener;
import com.startapp.sdk.ads.banner.Banner;

public class MainActivity extends AppCompatActivity {

    public static final String STARTIO_APP_ID = "210945361";

    private WebView webView;
    private RelativeLayout rootLayout;
    private FrameLayout bannerContainer;
    private Banner startIoBanner;

    private StartAppAd interstitialAd;
    private StartAppAd rewardedAd;
    private String pendingRewardType = "moves";

    @SuppressLint("SetJavaScriptEnabled")
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        // 1. Initialize Start.io Ads SDK 5.4.0 with App ID 210945361
        StartAppSDK.init(this, STARTIO_APP_ID, false);
        StartAppAd.disableSplash();

        // 2. Preload Interstitial and Rewarded Ads
        interstitialAd = new StartAppAd(this);
        interstitialAd.loadAd(StartAppAd.AdMode.AUTOMATIC);

        rewardedAd = new StartAppAd(this);
        preloadRewardedAd();

        // 3. Create Root Layout
        rootLayout = new RelativeLayout(this);
        rootLayout.setLayoutParams(new ViewGroup.LayoutParams(
                ViewGroup.LayoutParams.MATCH_PARENT,
                ViewGroup.LayoutParams.MATCH_PARENT
        ));

        // 4. Configure High-Performance WebView
        webView = new WebView(this);
        RelativeLayout.LayoutParams webViewParams = new RelativeLayout.LayoutParams(
                ViewGroup.LayoutParams.MATCH_PARENT,
                ViewGroup.LayoutParams.MATCH_PARENT
        );
        webView.setLayoutParams(webViewParams);

        WebSettings settings = webView.getSettings();
        settings.setJavaScriptEnabled(true);
        settings.setDomStorageEnabled(true);
        settings.setDatabaseEnabled(true);
        settings.setMediaPlaybackRequiresUserGesture(false);
        settings.setAllowFileAccess(true);
        settings.setAllowContentAccess(true);
        settings.setLoadWithOverviewMode(true);
        settings.setUseWideViewPort(true);

        // Add JavaScript bridge for Start.io ads
        webView.addJavascriptInterface(new StartIoBridge(this), "AndroidStartIo");

        webView.setWebViewClient(new WebViewClient());
        webView.setWebChromeClient(new WebChromeClient());

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

        // Load local bundled web game
        webView.loadUrl("file:///android_asset/public/index.html");

        // Attach Banner
        showNativeBanner();
    }

    private void preloadRewardedAd() {
        rewardedAd.setVideoListener(new VideoListener() {
            @Override
            public void onVideoCompleted() {
                // Reward player in game!
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
        if (startIoBanner == null) {
            startIoBanner = new Banner(this);
            bannerContainer.removeAllViews();
            bannerContainer.addView(startIoBanner);
        }
        bannerContainer.setVisibility(View.VISIBLE);
    }

    public void hideNativeBanner() {
        if (bannerContainer != null) {
            bannerContainer.setVisibility(View.GONE);
        }
    }

    public void showNativeInterstitial(String reason) {
        if (interstitialAd != null) {
            interstitialAd.showAd();
            interstitialAd.loadAd(StartAppAd.AdMode.AUTOMATIC);
        }
    }

    public void showNativeRewarded(String rewardType) {
        this.pendingRewardType = rewardType;
        if (rewardedAd != null && rewardedAd.isReady()) {
            rewardedAd.showAd();
        } else {
            // Load and attempt show
            preloadRewardedAd();
            if (rewardedAd != null) {
                rewardedAd.showAd();
            }
        }
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
