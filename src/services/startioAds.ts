export interface StartIoConfig {
  appId: string;
  packageName: string;
  sdkVersion: string;
  publisherId: string;
  testMode: boolean;
  initialized: boolean;
}

export interface AdStats {
  bannerImpressions: number;
  interstitialImpressions: number;
  rewardedImpressions: number;
  rewardedCompleted: number;
  adClicks: number;
}

export interface AdCreative {
  title: string;
  tagline: string;
  ctaText: string;
  rating: number;
  category: string;
  iconBg: string;
  badge: string;
  gradient: string;
  sponsor: string;
}

declare global {
  interface Window {
    AndroidStartIo?: {
      isNativeAvailable: () => boolean;
      getAppId: () => string;
      getPackageName: () => string;
      showBanner: () => void;
      hideBanner: () => void;
      showInterstitial: (reason: string) => void;
      showRewarded: (rewardType: string) => void;
    };

    onStartIoRewardedCompleted?: (rewardType: string) => void;
  }
}

class StartIoService {

  public config: StartIoConfig = {
    appId: '210945361',
    packageName: 'com.shahabmillizai.candyblast',
    sdkVersion: '5.4.0',
    publisherId: '116353420',
    testMode: false,
    initialized: false
  };

  public stats: AdStats = {
    bannerImpressions: 0,
    interstitialImpressions: 0,
    rewardedImpressions: 0,
    rewardedCompleted: 0,
    adClicks: 0
  };

  private listeners: (() => void)[] = [];
  private rewardedCallbacks: ((type: string) => void)[] = [];

  constructor() {
    this.initNativeListener();
  }

  private initNativeListener() {

    if (typeof window === 'undefined') return;

    window.onStartIoRewardedCompleted = (rewardType: string) => {

      this.stats.rewardedCompleted++;

      this.notify();

      this.rewardedCallbacks.forEach(callback => {
        callback(rewardType);
      });
    };
  }

  public isNativeAndroid(): boolean {

    return (
      typeof window !== 'undefined' &&
      !!window.AndroidStartIo?.isNativeAvailable()
    );
  }

  public onNativeReward(callback: (type: string) => void) {

    this.rewardedCallbacks.push(callback);

    return () => {
      this.rewardedCallbacks =
        this.rewardedCallbacks.filter(item => item !== callback);
    };
  }

  public subscribe(listener: () => void) {

    this.listeners.push(listener);

    return () => {
      this.listeners = this.listeners.filter(item => item !== listener);
    };
  }

  private notify() {
    this.listeners.forEach(listener => listener());
  }

  public recordBannerImpression() {

    if (this.isNativeAndroid()) {
      window.AndroidStartIo?.showBanner();
    }
  }

  public recordInterstitialImpression(reason = 'Game Event') {

    if (this.isNativeAndroid()) {

      this.stats.interstitialImpressions++;

      this.notify();

      window.AndroidStartIo?.showInterstitial(reason);
    }
  }

  public recordRewardedImpression(rewardType = 'moves') {

    if (this.isNativeAndroid()) {

      this.stats.rewardedImpressions++;

      this.notify();

      window.AndroidStartIo?.showRewarded(rewardType);
    }
  }

  public recordRewardedCompleted() {
    // Reward completion is reported by the native SDK callback.
  }

  public recordAdClick() {
    // Never simulate or generate ad clicks.
  }

  public toggleTestMode(): boolean {
    this.config.testMode = !this.config.testMode;
    this.notify();
    return this.config.testMode;
  }

  public getAd(index = 0): AdCreative {

    return {
      title: 'Advertisement',
      tagline: 'Sponsored content',
      ctaText: 'Learn More',
      rating: 0,
      category: 'Advertisement',
      iconBg: '',
      badge: 'Sponsored',
      gradient: '',
      sponsor: 'Start.io'
    };
  }

  public getMavenDependencySnippet(): string {

    return `implementation 'com.startapp:inapp-sdk:5.4.0'`;
  }

  public getGradleSnippet(): string {

    return `implementation 'com.startapp:inapp-sdk:5.4.0'`;
  }
}

export const startIo = new StartIoService();
