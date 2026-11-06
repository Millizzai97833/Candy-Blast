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

import com.startapp.sdk.adsbase.Ad;
import com.startapp.sdk.adsbase.StartAppAd;
import com.startapp.sdk.adsbase.StartAppSDK;
import com.startapp.sdk.adsbase.adlisteners.AdEventListener;
import com.startapp.sdk.adsbase.adlisteners.VideoListener;
import com.startapp.sdk.ads.banner.Banner;

public class MainActivity extends AppCompatActivity {

    public static final String STARTIO_APP_ID = "210945361";

    private WebView webView;
    private FrameLayout bannerContainer;
    private Banner startIoBanner;

    private boolean sdkReady = false;

    private StartAppAd interstitialAd;
    private StartAppAd rewardedAd;

    private boolean interstitialReady = false;
    private boolean rewardedReady = false;

    private boolean pendingInterstitial = false;
    private String pendingRewardType = null;

    @SuppressLint("SetJavaScriptEnabled")
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        createGameView();
        initializeStartIo();
    }

    private void createGameView() {

        RelativeLayout root = new RelativeLayout(this);

        webView = new WebView(this);

        RelativeLayout.LayoutParams webParams =
                new RelativeLayout.LayoutParams(
                        ViewGroup.LayoutParams.MATCH_PARENT,
                        ViewGroup.LayoutParams.MATCH_PARENT
                );

        webView.setLayoutParams(webParams);

        WebSettings settings = webView.getSettings();

        settings.setJavaScriptEnabled(true);
        settings.setDomStorageEnabled(true);
        settings.setDatabaseEnabled(true);
        settings.setAllowFileAccess(true);
        settings.setAllowContentAccess(true);
        settings.setMediaPlaybackRequiresUserGesture(false);
        settings.setLoadWithOverviewMode(true);
        settings.setUseWideViewPort(true);

        webView.addJavascriptInterface(
                new StartIoBridge(this),
                "AndroidStartIo"
        );

        webView.setWebViewClient(new WebViewClient());
        webView.setWebChromeClient(new WebChromeClient());

        root.addView(webView);

        bannerContainer = new FrameLayout(this);

        RelativeLayout.LayoutParams bannerParams =
                new RelativeLayout.LayoutParams(
                        ViewGroup.LayoutParams.MATCH_PARENT,
                        ViewGroup.LayoutParams.WRAP_CONTENT
                );

        bannerParams.addRule(RelativeLayout.ALIGN_PARENT_BOTTOM);

        bannerContainer.setLayoutParams(bannerParams);

        root.addView(bannerContainer);

        setContentView(root);

        webView.loadUrl("file:///android_asset/public/index.html");
    }

    private void initializeStartIo() {

        StartAppSDK.initParams(this, STARTIO_APP_ID)
                .setReturnAdsEnabled(false)
                .setCallback(new Runnable() {
                    @Override
                    public void run() {

                        runOnUiThread(() -> {

                            sdkReady = true;

                            showNativeBanner();

                            loadInterstitialAd();
                            loadRewardedAd();

                        });
                    }
                })
                .init();
    }

    // ---------------- BANNER ----------------

    public void showNativeBanner() {

        if (!sdkReady || bannerContainer == null) {
            return;
        }

        if (startIoBanner == null) {

            startIoBanner = new Banner(this);

            bannerContainer.removeAllViews();

            bannerContainer.addView(
                    startIoBanner,
                    new FrameLayout.LayoutParams(
                            ViewGroup.LayoutParams.MATCH_PARENT,
                            ViewGroup.LayoutParams.WRAP_CONTENT
                    )
            );
        }

        bannerContainer.setVisibility(View.VISIBLE);
    }

    public void hideNativeBanner() {

        if (bannerContainer != null) {
            bannerContainer.setVisibility(View.GONE);
        }
    }

    // ---------------- INTERSTITIAL ----------------

    private void loadInterstitialAd() {

        if (!sdkReady) {
            return;
        }

        interstitialReady = false;

        interstitialAd = new StartAppAd(this);

        interstitialAd.loadAd(new AdEventListener() {

            @Override
            public void onReceiveAd(Ad ad) {

                runOnUiThread(() -> {

                    interstitialReady = true;

                    if (pendingInterstitial) {
                        pendingInterstitial = false;
                        showLoadedInterstitial();
                    }
                });
            }

            @Override
            public void onFailedToReceiveAd(Ad ad) {

                interstitialReady = false;
                pendingInterstitial = false;
            }
        });
    }

    private void showLoadedInterstitial() {

        if (interstitialAd == null || !interstitialReady) {
            return;
        }

        interstitialReady = false;

        interstitialAd.showAd();

        loadInterstitialAd();
    }

    public void showNativeInterstitial(String reason) {

        runOnUiThread(() -> {

            if (!sdkReady) {
                return;
            }

            if (interstitialReady) {
                showLoadedInterstitial();
            } else {
                pendingInterstitial = true;
                loadInterstitialAd();
            }
        });
    }

    // ---------------- REWARDED VIDEO ----------------

    private void loadRewardedAd() {

        if (!sdkReady) {
            return;
        }

        rewardedReady = false;

        rewardedAd = new StartAppAd(this);

        rewardedAd.loadAd(
                StartAppAd.AdMode.REWARDED_VIDEO,
                new AdEventListener() {

                    @Override
                    public void onReceiveAd(Ad ad) {

                        runOnUiThread(() -> {

                            rewardedReady = true;

                            if (pendingRewardType != null) {
                                showLoadedRewarded();
                            }
                        });
                    }

                    @Override
                    public void onFailedToReceiveAd(Ad ad) {

                        rewardedReady = false;
                        pendingRewardType = null;
                    }
                }
        );
    }

    public void showNativeRewarded(String rewardType) {

        runOnUiThread(() -> {

            if (!sdkReady) {
                return;
            }

            pendingRewardType = rewardType;

            if (rewardedReady) {
                showLoadedRewarded();
            } else {
                loadRewardedAd();
            }
        });
    }

    private void showLoadedRewarded() {

        if (rewardedAd == null || !rewardedReady) {
            return;
        }

        final String reward = pendingRewardType;

        pendingRewardType = null;
        rewardedReady = false;

        rewardedAd.setVideoListener(new VideoListener() {

            @Override
            public void onVideoCompleted() {

                runOnUiThread(() -> {

                    if (webView != null) {

                        String javascript =
                                "window.onStartIoRewardedCompleted && " +
                                "window.onStartIoRewardedCompleted('" +
                                reward + "');";

                        webView.evaluateJavascript(javascript, null);
                    }

                    loadRewardedAd();
                });
            }
        });

        rewardedAd.showAd();
    }

    // ---------------- LIFECYCLE ----------------

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

        if (webView != null) {
            webView.onResume();
        }
    }

    @Override
    protected void onPause() {
        if (webView != null) {
            webView.onPause();
        }

        super.onPause();
    }

    @Override
    protected void onDestroy() {

        if (webView != null) {
            webView.removeJavascriptInterface("AndroidStartIo");
            webView.destroy();
            webView = null;
        }

        if (bannerContainer != null) {
            bannerContainer.removeAllViews();
        }

        super.onDestroy();
    }
}
