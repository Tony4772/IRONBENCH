package com.ebyzom.ironbench.ui

import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.darkColorScheme
import androidx.compose.runtime.Composable
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.TextStyle
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.sp

val Canvas = Color(0xFF0A0C0E)
val ContainerLow = Color(0xFF121417)
val Card = Color(0xFF1A1D23)
val Elevated = Color(0xFF232730)
val Highest = Color(0xFF2D323E)
val OnSurface = Color(0xFFF1F3F5)
val Muted = Color(0xFF9CA3AF)
val Lime = Color(0xFFCCFF00)
val OnLime = Color(0xFF0A0C0E)
val Cyan = Color(0xFF00E5FF)
val Crimson = Color(0xFFFF3366)
val Hairline = Color(0x0FFFFFFF)

private val Scheme = darkColorScheme(
    primary = Lime,
    onPrimary = OnLime,
    secondary = Cyan,
    background = Canvas,
    surface = Card,
    onSurface = OnSurface,
    onSurfaceVariant = Muted,
    error = Crimson,
)

val MetricStyle = TextStyle(
    fontFamily = FontFamily.SansSerif,
    fontWeight = FontWeight.Bold,
    fontSize = 28.sp,
    lineHeight = 34.sp,
    fontFeatureSettings = "tnum",
)

@Composable
fun IronBenchTheme(content: @Composable () -> Unit) {
    MaterialTheme(colorScheme = Scheme, content = content)
}
