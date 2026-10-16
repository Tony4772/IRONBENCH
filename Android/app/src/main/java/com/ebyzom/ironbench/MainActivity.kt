package com.ebyzom.ironbench

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.enableEdgeToEdge
import androidx.activity.viewModels
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.res.painterResource
import com.ebyzom.ironbench.ui.EbyzomSplash
import com.ebyzom.ironbench.ui.IronBenchApp
import com.ebyzom.ironbench.ui.IronBenchTheme
import com.google.android.gms.ads.MobileAds

class MainActivity : ComponentActivity() {
    private val model: IronBenchViewModel by viewModels()

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        MobileAds.initialize(this)
        enableEdgeToEdge()
        setContent {
            IronBenchTheme {
                var showSplash by remember { mutableStateOf(true) }
                if (showSplash) {
                    EbyzomSplash(
                        appName = "IRONBENCH",
                        tagline = "Mancuernas y banco.",
                        logo = painterResource(R.drawable.app_logo),
                        paper = Color(0xFFE7EEF2),
                        ink = Color(0xFF123F4D),
                        inkSoft = Color(0xFF5E7580),
                        onFinished = { showSplash = false },
                    )
                } else {
                    IronBenchApp(model)
                }
            }
        }
    }
}
