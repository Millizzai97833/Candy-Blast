/**
 * Start.io Ads SDK Service for Candy Blast
 * App ID: 210945361
 * Package: com.shahabmillizai.candyblast
 * SDK Version: 5.4.0 (com.startapp:inapp-sdk:5.4.0)
 * Publisher ID: 116353420 (start.io, 116353420, DIRECT)
 */

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

export const SAMPLE_STARTIO_ADS: AdCreative[] = [
  {
    title: 'Royal Match Blast',
    tagline: 'Help King Robert restore his castle! Solve sweet puzzles now.',
    ctaText: 'PLAY NOW',
    rating: 4.8,
    category: 'Puzzle',
    iconBg: 'from-amber-400 to-yellow-600',
    badge: 'Trending Game',
    gradient: 'from-purple-900 via-indigo-900 to-pink-900',
    sponsor: 'Dream Games'
  },
  {
    title: 'Sweet Cookie Jam',
    tagline: 'Crunch through 5,000+ delicious cookie bakery levels!',
    ctaText: 'INSTALL FREE',
    rating: 4.7,
    category: 'Casual',
    iconBg: 'from-pink-500 to-rose-600',
    badge: 'Editor’s Choice',
    gradient: 'from-fuchsia-950 via-purple-900 to-pink-950',
    sponsor: 'Jam City'
  },
  {
    title: 'Candy Bubble Pop 3D',
    tagline: 'Aim, shoot, and burst bubbles in vivid candy 3D worlds!',
    ctaText: 'GET APP',
    rating: 4.9,
    category: 'Arcade',
    iconBg: 'from-cyan-400 to-blue-600',
    badge: 'Top Rated',
    gradient: 'from-sky-950 via-blue-900 to-indigo-950',
    sponsor: 'Bubble Studios'
  },
  {
    title: 'Sugar Rush Racing',
    tagline: 'High-speed candy kart racing with powerups and boosts!',
    ctaText: 'RACE FREE',
    rating: 4.6,
    category: 'Action',
    iconBg: 'from-red-500 to-orange-600',
    badge: 'Popular',
    gradient: 'from-rose-950 via-orange-950 to-amber-950',
    sponsor: 'Speedy Fun'
  }
];

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
    initialized: true,
  };

  public stats: AdStats = {
    bannerImpressions: 1,
    interstitialImpressions: 0,
    rewardedImpressions: 0,
    rewardedCompleted: 0,
    adClicks: 0,
  };

  private listeners: (() => void)[] = [];
  private rewardedCallbacks: ((type: string) => void)[] = [];

  constructor() {
    this.loadStats();
    this.initNativeListener();
  }

  public isNativeAndroid(): boolean {
    return typeof window !== 'undefined' && !!window.AndroidStartIo?.isNativeAvailable();
  }

  private initNativeListener() {
    if (typeof window !== 'undefined') {
      window.onStartIoRewardedCompleted = (rewardType: string) => {
        this.recordRewardedCompleted();
        this.rewardedCallbacks.forEach(cb => cb(rewardType));
      };
    }
  }

  public onNativeReward(callback: (type: string) => void) {
    this.rewardedCallbacks.push(callback);
    return () => {
      this.rewardedCallbacks = this.rewardedCallbacks.filter(c => c !== callback);
    };
  }

  private loadStats() {
    try {
      const saved = localStorage.getItem('candy_blast_startio_stats');
      if (saved) {
        this.stats = { ...this.stats, ...JSON.parse(saved) };
      }
    } catch {}
  }

  private saveStats() {
    try {
      localStorage.setItem('candy_blast_startio_stats', JSON.stringify(this.stats));
      this.notify();
    } catch {}
  }

  subscribe(listener: () => void) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  private notify() {
    this.listeners.forEach(fn => fn());
  }

  recordBannerImpression() {
    this.stats.bannerImpressions++;
    this.saveStats();
    if (this.isNativeAndroid()) {
      window.AndroidStartIo?.showBanner();
    }
  }

  recordInterstitialImpression(reason: string = 'Game Event') {
    this.stats.interstitialImpressions++;
    this.saveStats();
    if (this.isNativeAndroid()) {
      window.AndroidStartIo?.showInterstitial(reason);
    }
  }

  recordRewardedImpression(rewardType: string = 'moves') {
    this.stats.rewardedImpressions++;
    this.saveStats();
    if (this.isNativeAndroid()) {
      window.AndroidStartIo?.showRewarded(rewardType);
    }
  }

  recordRewardedCompleted() {
    this.stats.rewardedCompleted++;
    this.saveStats();
  }

  recordAdClick() {
    this.stats.adClicks++;
    this.saveStats();
  }

  toggleTestMode(): boolean {
    this.config.testMode = !this.config.testMode;
    this.notify();
    return this.config.testMode;
  }

  getAd(index?: number): AdCreative {
    if (typeof index === 'number') {
      return SAMPLE_STARTIO_ADS[index % SAMPLE_STARTIO_ADS.length];
    }
    const idx = Math.floor(Math.random() * SAMPLE_STARTIO_ADS.length);
    return SAMPLE_STARTIO_ADS[idx];
  }

  getMavenDependencySnippet(): string {
    return `<dependency>
    <groupId>com.startapp</groupId>
    <artifactId>inapp-sdk</artifactId>
    <version>5.4.0</version>
</dependency>`;
  }

  getGradleSnippet(): string {
    return `dependencies {
    implementation 'com.startapp:inapp-sdk:5.4.0'
}

// AndroidManifest.xml:
// <meta-data
//     android:name="com.startapp.sdk.APPLICATION_ID"
//     android:value="210945361" />`;
  }
}

export const startIo = new StartIoService();
