import React, { useState, useEffect } from 'react';
import { startIo, AdStats } from '../services/startioAds';
import { 
  X, Copy, Check, ShieldCheck, Play, Eye, MousePointer, 
  Code2, ExternalLink, RefreshCw, FileText, Smartphone,
  Download, Terminal, GitBranch, CheckCircle2, AlertTriangle, Layers
} from 'lucide-react';

interface StartIoSdkModalProps {
  isOpen: boolean;
  onClose: () => void;
  onTriggerInterstitial: () => void;
  onTriggerRewarded: () => void;
}

export const StartIoSdkModal: React.FC<StartIoSdkModalProps> = ({
  isOpen,
  onClose,
  onTriggerInterstitial,
  onTriggerRewarded
}) => {
  const [stats, setStats] = useState<AdStats>(startIo.stats);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'github_apk' | 'integration' | 'app_ads'>('github_apk');

  useEffect(() => {
    return startIo.subscribe(() => {
      setStats({ ...startIo.stats });
    });
  }, []);

  if (!isOpen) return null;

  const copyText = (key: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const mavenCode = `<dependency>
    <groupId>com.startapp</groupId>
    <artifactId>inapp-sdk</artifactId>
    <version>5.4.0</version>
</dependency>`;

  const gradleCode = `// android/app/build.gradle
plugins {
    id 'com.android.application'
}

android {
    namespace 'com.shahabmillizai.candyblast'
    compileSdk 34

    defaultConfig {
        applicationId "com.shahabmillizai.candyblast"
        minSdk 24
        targetSdk 34
        versionCode 1
        versionName "1.0.0"
    }

    buildTypes {
        release {
            minifyEnabled true
            shrinkResources true
            proguardFiles getDefaultProguardFile('proguard-android-optimize.txt'), 'proguard-rules.pro'
        }
    }
}

dependencies {
    implementation 'androidx.appcompat:appcompat:1.6.1'
    implementation 'androidx.webkit:webkit:1.9.0'
    implementation 'com.google.android.gms:play-services-appset:16.0.2'
    implementation 'com.startapp:inapp-sdk:5.4.0'
}`;

  const manifestCode = `<!-- android/app/src/main/AndroidManifest.xml -->
<manifest xmlns:android="http://schemas.android.com/apk/res/android"
    package="com.shahabmillizai.candyblast">

    <uses-permission android:name="android.permission.INTERNET" />
    <uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />
    <uses-permission android:name="com.google.android.gms.permission.AD_ID" />

    <application
        android:label="Candy Blast"
        android:theme="@style/Theme.CandyBlast"
        android:hardwareAccelerated="true">

        <!-- Start.io Official Application ID: 210945361 -->
        <meta-data
            android:name="com.startapp.sdk.APPLICATION_ID"
            android:value="210945361" />

        <activity android:name="com.shahabmillizai.candyblast.MainActivity"
            android:exported="true"
            android:screenOrientation="portrait">
            <intent-filter>
                <action android:name="android.intent.action.MAIN" />
                <category android:name="android.intent.category.LAUNCHER" />
            </intent-filter>
        </activity>
    </application>
</manifest>`;

  const buildCliCommand = `npm run build && mkdir -p android/app/src/main/assets/public && cp -r dist/* android/app/src/main/assets/public/ && cd android && ./gradlew assembleRelease`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/85 backdrop-blur-md animate-fadeIn select-none">
      <div className="relative w-full max-w-xl rounded-3xl bg-gradient-to-b from-purple-950 via-slate-900 to-purple-950 border-2 border-pink-500 shadow-2xl overflow-hidden flex flex-col max-h-[94vh]">
        
        {/* Top Header */}
        <div className="px-5 py-3.5 bg-slate-900/90 border-b border-purple-500/30 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-pink-500 to-rose-600 flex items-center justify-center shadow">
              <ShieldCheck className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-white font-black text-sm tracking-wide flex items-center gap-1.5">
                Start.io & Release APK Hub
                <span className="text-[10px] bg-green-500/30 text-green-300 font-bold px-2 py-0.5 rounded-full border border-green-500/40">
                  REAL ADS ACTIVE
                </span>
              </h3>
              <p className="text-purple-300/80 text-[11px]">
                App ID: <span className="font-mono text-yellow-300 font-bold">210945361</span> • Pkg: <span className="font-mono text-pink-300 font-bold">com.shahabmillizai.candyblast</span>
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switcher */}
        <div className="flex items-center bg-black/40 px-3 pt-2 border-b border-purple-500/20 gap-1.5 overflow-x-auto">
          <button
            onClick={() => setActiveTab('github_apk')}
            className={`px-3 py-2 text-xs font-bold rounded-t-xl transition-all border-b-2 whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'github_apk'
                ? 'bg-purple-900/60 text-yellow-300 border-yellow-400'
                : 'text-purple-300/70 hover:text-white border-transparent'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5 text-yellow-300" />
            <span>GitHub Release APK</span>
          </button>
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-3 py-2 text-xs font-bold rounded-t-xl transition-all border-b-2 whitespace-nowrap ${
              activeTab === 'overview'
                ? 'bg-purple-900/60 text-white border-pink-400'
                : 'text-purple-300/70 hover:text-white border-transparent'
            }`}
          >
            📊 Ad Metrics & Test
          </button>
          <button
            onClick={() => setActiveTab('integration')}
            className={`px-3 py-2 text-xs font-bold rounded-t-xl transition-all border-b-2 whitespace-nowrap ${
              activeTab === 'integration'
                ? 'bg-purple-900/60 text-white border-pink-400'
                : 'text-purple-300/70 hover:text-white border-transparent'
            }`}
          >
            ⚙️ Android SDK & POM
          </button>
          <button
            onClick={() => setActiveTab('app_ads')}
            className={`px-3 py-2 text-xs font-bold rounded-t-xl transition-all border-b-2 whitespace-nowrap ${
              activeTab === 'app_ads'
                ? 'bg-purple-900/60 text-white border-pink-400'
                : 'text-purple-300/70 hover:text-white border-transparent'
            }`}
          >
            📄 app-ads.txt
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 overflow-y-auto space-y-4">
          
          {/* TAB: GITHUB RELEASE APK */}
          {activeTab === 'github_apk' && (
            <div className="space-y-4">
              
              {/* Highlight Banner */}
              <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-950/80 via-purple-950/80 to-slate-900 border-2 border-emerald-500/50 shadow-lg">
                <div className="flex items-center gap-2 mb-1.5">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                  <h4 className="font-black text-sm text-white">
                    GitHub Actions Workflow & Android Files Ready!
                  </h4>
                </div>
                <p className="text-xs text-purple-200/90 leading-relaxed">
                  All GitHub CI/CD configuration files and native Android files have been generated in your repository. You can build a signed release <strong className="text-yellow-300">.apk</strong> and Google Play Store <strong className="text-yellow-300">.aab</strong> bundle that displays real live ads from Start.io!
                </p>
              </div>

              {/* 3 Step Guide */}
              <div className="rounded-2xl bg-black/40 border border-purple-500/30 p-4 space-y-3">
                <h5 className="text-xs font-black text-yellow-300 uppercase tracking-wider flex items-center gap-1.5">
                  <GitBranch className="w-4 h-4 text-yellow-300" />
                  How to Build & Download on GitHub
                </h5>

                <div className="space-y-2.5 text-xs">
                  <div className="flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-pink-500 text-white font-black text-xs flex items-center justify-center shrink-0">1</span>
                    <div>
                      <strong className="text-white">Push to GitHub:</strong>
                      <p className="text-purple-300/80 text-[11px]">
                        Push this codebase to your GitHub repository (e.g. <code>main</code> branch).
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-pink-500 text-white font-black text-xs flex items-center justify-center shrink-0">2</span>
                    <div>
                      <strong className="text-white">Automated GitHub Actions Build:</strong>
                      <p className="text-purple-300/80 text-[11px]">
                        The included <code>.github/workflows/build-apk.yml</code> workflow automatically installs dependencies, sets up Java 17 & Android SDK, compiles the Start.io in-app SDK 5.4.0, and signs the release APK.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-pink-500 text-white font-black text-xs flex items-center justify-center shrink-0">3</span>
                    <div>
                      <strong className="text-white">Download Ready-to-Publish APK & AAB:</strong>
                      <p className="text-purple-300/80 text-[11px]">
                        Go to your GitHub repo's <strong className="text-white">Actions</strong> tab &gt; click the latest run &gt; download <strong className="text-yellow-300">Candy-Blast-Release-APK</strong> and <strong className="text-yellow-300">Candy-Blast-GooglePlay-AAB</strong>!
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Generated Android File Tree */}
              <div className="rounded-2xl bg-black/40 border border-purple-500/30 p-4">
                <h5 className="text-xs font-black text-pink-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <Layers className="w-4 h-4 text-pink-400" />
                  Included Android Source Files in Repo:
                </h5>
                <div className="font-mono text-[11px] text-purple-200/90 space-y-1 bg-black/50 p-2.5 rounded-xl border border-white/5">
                  <div>📁 <strong>.github/workflows/build-apk.yml</strong> (CI/CD Pipeline)</div>
                  <div>📁 <strong>android/</strong></div>
                  <div className="pl-3">├── build.gradle &amp; settings.gradle (Top-level)</div>
                  <div className="pl-3">├── gradlew &amp; gradlew.bat (Gradle Wrapper)</div>
                  <div className="pl-3">└── <strong>app/</strong></div>
                  <div className="pl-6">├── build.gradle (Start.io 5.4.0 + Release Signing)</div>
                  <div className="pl-6">├── proguard-rules.pro (Start.io Anti-Obfuscation)</div>
                  <div className="pl-6">└── src/main/</div>
                  <div className="pl-9">├── AndroidManifest.xml (App ID <strong>210945361</strong>)</div>
                  <div className="pl-9">└── java/com/shahabmillizai/candyblast/</div>
                  <div className="pl-12">├── <strong>MainActivity.java</strong> (Real Ad Initializer)</div>
                  <div className="pl-12">└── <strong>StartIoBridge.java</strong> (JS to Native Ad Bridge)</div>
                </div>
              </div>

              {/* Local Build Command snippet */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-bold text-white flex items-center gap-1">
                    <Terminal className="w-3.5 h-3.5 text-pink-400" />
                    CLI Command to Build Locally:
                  </span>
                  <button
                    onClick={() => copyText('cli', buildCliCommand)}
                    className="text-[11px] text-pink-300 hover:text-white flex items-center gap-1 bg-pink-500/20 px-2 py-0.5 rounded border border-pink-500/40"
                  >
                    {copiedKey === 'cli' ? <Check className="w-3 h-3 text-green-400" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedKey === 'cli' ? 'Copied!' : 'Copy'}</span>
                  </button>
                </div>
                <pre className="p-3 rounded-xl bg-black/60 border border-purple-500/30 font-mono text-[11px] text-emerald-300/90 overflow-x-auto whitespace-pre-wrap">
                  {buildCliCommand}
                </pre>
              </div>

            </div>
          )}

          {/* TAB: OVERVIEW & TEST */}
          {activeTab === 'overview' && (
            <div className="space-y-4">
              <div className="p-3 rounded-2xl bg-black/40 border border-purple-500/30 grid grid-cols-2 sm:grid-cols-4 gap-2 text-center">
                <div className="p-2 rounded-xl bg-purple-950/60">
                  <span className="text-[10px] text-purple-300 uppercase block font-bold">App ID</span>
                  <span className="font-mono text-xs font-black text-amber-300">210945361</span>
                </div>
                <div className="p-2 rounded-xl bg-purple-950/60">
                  <span className="text-[10px] text-purple-300 uppercase block font-bold">Package</span>
                  <span className="font-mono text-xs font-black text-pink-300 truncate block">com.shahabmillizai.candyblast</span>
                </div>
                <div className="p-2 rounded-xl bg-purple-950/60">
                  <span className="text-[10px] text-purple-300 uppercase block font-bold">SDK Version</span>
                  <span className="font-mono text-xs font-black text-sky-300">5.4.0 (inapp)</span>
                </div>
                <div className="p-2 rounded-xl bg-purple-950/60">
                  <span className="text-[10px] text-purple-300 uppercase block font-bold">Direct Pub ID</span>
                  <span className="font-mono text-xs font-black text-emerald-300">116353420</span>
                </div>
              </div>

              <div>
                <h4 className="text-xs font-bold text-white mb-2 flex items-center gap-1.5">
                  <Eye className="w-3.5 h-3.5 text-pink-400" />
                  Live Placement Telemetry
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  <div className="p-2.5 rounded-xl bg-slate-900/80 border border-purple-500/20 text-center">
                    <span className="text-[10px] text-purple-300/80 block">Banner Views</span>
                    <span className="text-lg font-black text-white">{stats.bannerImpressions}</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-900/80 border border-purple-500/20 text-center">
                    <span className="text-[10px] text-purple-300/80 block">Interstitials</span>
                    <span className="text-lg font-black text-white">{stats.interstitialImpressions}</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-900/80 border border-purple-500/20 text-center">
                    <span className="text-[10px] text-purple-300/80 block">Rewarded Ads</span>
                    <span className="text-lg font-black text-emerald-300">{stats.rewardedCompleted}</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-900/80 border border-purple-500/20 text-center">
                    <span className="text-[10px] text-purple-300/80 block">Ad Clicks</span>
                    <span className="text-lg font-black text-amber-300">{stats.adClicks}</span>
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-gradient-to-br from-purple-900/50 to-pink-900/30 border border-pink-500/30">
                <h4 className="text-xs font-bold text-pink-300 mb-2.5 uppercase tracking-wider flex items-center gap-1">
                  <Smartphone className="w-4 h-4 text-pink-400" />
                  Interactive Ad Testing
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <button
                    onClick={() => {
                      onClose();
                      onTriggerInterstitial();
                    }}
                    className="p-3 rounded-xl candy-btn font-black text-xs text-white flex items-center justify-center gap-2 hover:brightness-110 active:scale-98 shadow"
                  >
                    <Play className="w-4 h-4" />
                    <span>Test Interstitial Ad</span>
                  </button>

                  <button
                    onClick={() => {
                      onClose();
                      onTriggerRewarded();
                    }}
                    className="p-3 rounded-xl candy-btn-green font-black text-xs text-white flex items-center justify-center gap-2 hover:brightness-110 active:scale-98 shadow"
                  >
                    <Play className="w-4 h-4" />
                    <span>Test Rewarded Video</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB: CODE SNIPPETS */}
          {activeTab === 'integration' && (
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-bold text-white flex items-center gap-1">
                    <Code2 className="w-3.5 h-3.5 text-pink-400" />
                    Apache Maven Dependency
                  </span>
                  <button
                    onClick={() => copyText('maven', mavenCode)}
                    className="text-[11px] text-pink-300 hover:text-white flex items-center gap-1 bg-pink-500/20 px-2 py-0.5 rounded border border-pink-500/40"
                  >
                    {copiedKey === 'maven' ? <Check className="w-3 h-3 text-green-400" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedKey === 'maven' ? 'Copied!' : 'Copy XML'}</span>
                  </button>
                </div>
                <pre className="p-3 rounded-xl bg-black/60 border border-purple-500/30 font-mono text-[11px] text-yellow-300/90 overflow-x-auto">
                  {mavenCode}
                </pre>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-bold text-white flex items-center gap-1">
                    <Smartphone className="w-3.5 h-3.5 text-sky-400" />
                    Android app/build.gradle Configuration
                  </span>
                  <button
                    onClick={() => copyText('gradle', gradleCode)}
                    className="text-[11px] text-sky-300 hover:text-white flex items-center gap-1 bg-sky-500/20 px-2 py-0.5 rounded border border-sky-500/40"
                  >
                    {copiedKey === 'gradle' ? <Check className="w-3 h-3 text-green-400" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedKey === 'gradle' ? 'Copied!' : 'Copy'}</span>
                  </button>
                </div>
                <pre className="p-3 rounded-xl bg-black/60 border border-purple-500/30 font-mono text-[11px] text-sky-300/90 overflow-x-auto max-h-48">
                  {gradleCode}
                </pre>
              </div>
            </div>
          )}

          {/* TAB: APP-ADS.TXT */}
          {activeTab === 'app_ads' && (
            <div className="space-y-3">
              <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-500/40 text-xs text-emerald-200 flex items-center justify-between">
                <div>
                  <span className="font-bold block">✓ Authorized Digital Sellers Active</span>
                  <span className="text-[11px] text-emerald-300/80">Hosted at /app-ads.txt with Direct Start.io publisher ID 116353420</span>
                </div>
                <a
                  href="/app-ads.txt"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1 shadow"
                >
                  <span>Open URL</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>

              <div className="rounded-xl bg-black/60 border border-purple-500/30 p-3 max-h-56 overflow-y-auto font-mono text-[10px] text-purple-200/90 space-y-0.5">
                <div className="text-pink-400 font-bold"># Primary Start.io Direct Entry:</div>
                <div className="text-yellow-300 font-bold bg-yellow-500/10 px-1 rounded">start.io, 116353420, DIRECT</div>
                <div className="text-slate-500 my-1"># Authorized Resellers & Exchanges:</div>
                <div>pubnative.net, 1007349, RESELLER, d641df8625486a7b</div>
                <div>pubmatic.com, 166063, RESELLER, 5d62403b186f2ace</div>
                <div>conversantmedia.com, 100339, RESELLER, 03113cd04947736d</div>
                <div>opera.com, pub5925993551616, RESELLER, 55a0c5fd61378de3</div>
                <div>rubiconproject.com, 24400, DIRECT, 0bfd66d529a55807</div>
                <div className="text-purple-400/60 text-[9px] pt-1">...and 90+ verified partner exchanges</div>
              </div>
            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="px-5 py-3 bg-black/50 border-t border-purple-500/30 flex items-center justify-between">
          <span className="text-[11px] text-purple-300/70">
            Package: <code className="text-pink-300">com.shahabmillizai.candyblast</code>
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-purple-700 hover:bg-purple-600 text-white font-bold text-xs shadow"
          >
            Done
          </button>
        </div>

      </div>
    </div>
  );
};
