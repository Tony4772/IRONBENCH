package com.ebyzom.ironbench.ui

import android.view.View
import android.widget.FrameLayout
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.viewinterop.AndroidView
import com.ebyzom.ironbench.BuildConfig
import com.google.android.gms.ads.AdListener
import com.google.android.gms.ads.AdRequest
import com.google.android.gms.ads.AdSize
import com.google.android.gms.ads.AdView
import com.google.android.gms.ads.LoadAdError

private const val RELEASE_BANNER_ID = "ca-app-pub-7470413991742442/1030086539"
private const val TEST_BANNER_ID = "ca-app-pub-3940256099942544/9214589741"

@Composable
fun BottomBanner(modifier: Modifier = Modifier) {
    val context = LocalContext.current
    AndroidView(
        modifier = modifier.fillMaxWidth(),
        factory = { host ->
            val widthDp = (host.resources.displayMetrics.widthPixels / host.resources.displayMetrics.density).toInt()
            val adView = AdView(host).apply {
                setAdSize(AdSize.getCurrentOrientationAnchoredAdaptiveBannerAdSize(host, widthDp))
                adUnitId = if (BuildConfig.DEBUG) TEST_BANNER_ID else RELEASE_BANNER_ID
                adListener = object : AdListener() {
                    override fun onAdFailedToLoad(error: LoadAdError) {
                        visibility = View.GONE
                    }
                }
                loadAd(AdRequest.Builder().build())
            }
            FrameLayout(host).apply {
                addView(
                    adView,
                    FrameLayout.LayoutParams(
                        FrameLayout.LayoutParams.MATCH_PARENT,
                        FrameLayout.LayoutParams.WRAP_CONTENT,
                    ),
                )
            }
        },
        onRelease = { frame ->
            (frame.getChildAt(0) as? AdView)?.destroy()
        },
    )
}
