# Proguard rules for Candy Blast & Start.io SDK 5.4.0

# Start.io Ads SDK Rules
-keep class com.startapp.** {
    *;
}
-dontwarn com.startapp.**
-keepattributes Exceptions, InnerClasses, Signature, Deprecated, SourceFile, LineNumberTable, *Annotation*, EnclosingMethod

# Keep JavascriptInterface for WebView game bridge
-keepclassmembers class * {
    @android.webkit.JavascriptInterface <methods>;
}

-keep class com.shahabmillizai.candyblast.StartIoBridge {
    *;
}

# AndroidX WebKit
-keep class androidx.webkit.** {
    *;
}
-dontwarn androidx.webkit.**

# Play Services AppSet
-keep class com.google.android.gms.appset.** { *; }
-dontwarn com.google.android.gms.appset.**
