package com.ebyzom.ironbench

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.enableEdgeToEdge
import androidx.activity.viewModels
import com.ebyzom.ironbench.ui.IronBenchTheme
import com.ebyzom.ironbench.ui.IronBenchApp

class MainActivity : ComponentActivity() {
    private val model: IronBenchViewModel by viewModels()

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()
        setContent {
            IronBenchTheme {
                IronBenchApp(model)
            }
        }
    }
}
