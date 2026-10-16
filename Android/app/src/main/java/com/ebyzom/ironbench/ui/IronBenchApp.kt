package com.ebyzom.ironbench.ui

import androidx.compose.foundation.Canvas
import androidx.compose.foundation.Image
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.horizontalScroll
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.navigationBarsPadding
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.statusBarsPadding
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Check
import androidx.compose.material.icons.filled.DateRange
import androidx.compose.material.icons.filled.Info
import androidx.compose.material.icons.filled.Lock
import androidx.compose.material.icons.filled.PlayArrow
import androidx.compose.material.icons.filled.Star
import androidx.compose.material3.Icon
import androidx.compose.material3.Scaffold
import androidx.compose.material3.SnackbarHost
import androidx.compose.material3.SnackbarHostState
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.res.painterResource
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.graphics.Path
import androidx.compose.ui.graphics.drawscope.Stroke
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.ebyzom.ironbench.ExerciseUi
import com.ebyzom.ironbench.IronBenchViewModel
import com.ebyzom.ironbench.data.Metrics
import com.ebyzom.ironbench.data.TECHNIQUE
import com.ebyzom.ironbench.data.imageForTechnique
import com.ebyzom.ironbench.data.WEEK
import com.ebyzom.ironbench.data.dayById
import kotlin.math.roundToInt

private enum class Section { Rutinas, Tecnica, Progreso, Historial }

@Composable
fun IronBenchApp(model: IronBenchViewModel) {
    val revision = model.sessionRevision
    var section by remember { mutableStateOf(Section.Rutinas) }
    val snackbar = remember { SnackbarHostState() }
    LaunchedEffect(model.message) {
        val text = model.message ?: return@LaunchedEffect
        snackbar.showSnackbar(text)
        model.consumeMessage()
    }
    if (model.privacyOpen) {
        PrivacyScreen(onClose = { model.privacyOpen = false })
        return
    }
    Scaffold(
        containerColor = Canvas,
        snackbarHost = { SnackbarHost(snackbar) },
        topBar = { TopBar(model.streak, onPrivacy = { model.privacyOpen = true }) },
        bottomBar = {
            Column(Modifier.navigationBarsPadding()) {
                if (section == Section.Rutinas && model.selectedDay !in model.restDays && dayById(model.selectedDay).exercises.isNotEmpty()) {
                    RestDock(model)
                }
                Row(Modifier.fillMaxWidth().background(Highest)) {
                    NavItem(Section.Rutinas, section, Icons.Filled.PlayArrow, "Rutinas", Modifier.weight(1f)) { section = it }
                    NavItem(Section.Tecnica, section, Icons.Filled.Info, "Técnica", Modifier.weight(1f)) { section = it }
                    NavItem(Section.Progreso, section, Icons.Filled.Star, "Progreso", Modifier.weight(1f)) { section = it }
                    NavItem(Section.Historial, section, Icons.Filled.DateRange, "Historial", Modifier.weight(1f)) { section = it }
                }
            }
        },
    ) { padding ->
        Box(Modifier.fillMaxSize().padding(padding).background(Canvas)) {
            when (section) {
                Section.Rutinas -> WorkoutScreen(model, revision)
                Section.Tecnica -> TechniqueScreen()
                Section.Progreso -> ProgressScreen(model, revision)
                Section.Historial -> HistoryScreen(model, revision)
            }
        }
    }
}

@Composable
private fun NavItem(
    target: Section,
    current: Section,
    icon: androidx.compose.ui.graphics.vector.ImageVector,
    label: String,
    modifier: Modifier = Modifier,
    onSelect: (Section) -> Unit,
) {
    Column(
        modifier
            .height(64.dp)
            .clickable { onSelect(target) }
            .padding(vertical = 8.dp),
        horizontalAlignment = Alignment.CenterHorizontally,
    ) {
        Icon(icon, contentDescription = label, tint = if (current == target) Lime else Muted)
        Text(label, color = if (current == target) Lime else Muted, fontSize = 11.sp, fontWeight = FontWeight.SemiBold)
    }
}

@Composable
private fun TopBar(streak: Int, onPrivacy: () -> Unit) {
    Row(
        Modifier
            .fillMaxWidth()
            .statusBarsPadding()
            .padding(horizontal = 16.dp, vertical = 12.dp),
        verticalAlignment = Alignment.CenterVertically,
    ) {
        Column(Modifier.weight(1f)) {
            Text("IRONBENCH", color = OnSurface, fontWeight = FontWeight.Bold, fontSize = 20.sp, letterSpacing = 1.sp)
            Text("Diseño y creación de EBYZOM E.I.R.L.", color = Muted, fontSize = 11.sp)
        }
        Text(
            "$streak días",
            color = OnLime,
            fontWeight = FontWeight.Bold,
            fontSize = 12.sp,
            modifier = Modifier
                .clip(RoundedCornerShape(999.dp))
                .background(Lime)
                .padding(horizontal = 12.dp, vertical = 8.dp),
        )
        Spacer(Modifier.width(8.dp))
        Box(
            Modifier
                .size(48.dp)
                .clip(CircleShape)
                .clickable(onClick = onPrivacy),
            contentAlignment = Alignment.Center,
        ) {
            Icon(Icons.Filled.Lock, contentDescription = "Política de privacidad", tint = Muted)
        }
    }
}

@Composable
private fun WorkoutScreen(model: IronBenchViewModel, revision: Int) {
    val day = dayById(model.selectedDay)
    val isRest = model.selectedDay in model.restDays
    val exercises = model.exercisesFor(model.selectedDay)
    Column(
        Modifier
            .fillMaxSize()
            .verticalScroll(rememberScrollState())
            .padding(horizontal = 16.dp),
    ) {
        Text("Semana", color = Muted, fontSize = 11.sp, fontWeight = FontWeight.Bold, letterSpacing = 1.2.sp)
        Spacer(Modifier.height(8.dp))
        Row(Modifier.horizontalScroll(rememberScrollState()), horizontalArrangement = Arrangement.spacedBy(8.dp)) {
            WEEK.forEach { item ->
                val selected = item.id == model.selectedDay
                val rest = item.id in model.restDays
                Column(
                    Modifier
                        .width(108.dp)
                        .clip(RoundedCornerShape(16.dp))
                        .background(if (selected) Elevated else Card)
                        .border(1.dp, if (selected) Lime else Hairline, RoundedCornerShape(16.dp))
                        .clickable { model.selectDay(item.id) }
                        .padding(12.dp),
                ) {
                    Text(item.id, color = if (selected) Lime else Muted, fontSize = 11.sp, fontWeight = FontWeight.Bold)
                    Text(item.focus, color = OnSurface, fontSize = 13.sp, fontWeight = FontWeight.SemiBold, maxLines = 2, overflow = TextOverflow.Ellipsis)
                    Spacer(Modifier.height(8.dp))
                    Text(
                        when {
                            rest -> "Descanso"
                            item.exercises.isEmpty() -> "Sin rutina"
                            else -> "${item.exercises.size} ejercicios"
                        },
                        color = Muted,
                        fontSize = 11.sp,
                    )
                }
            }
        }
        Spacer(Modifier.height(16.dp))
        Text(day.title, color = OnSurface, fontSize = 26.sp, fontWeight = FontWeight.SemiBold)
        Text("${day.minutes} min · ${day.focus}", color = Cyan, fontSize = 14.sp)
        Spacer(Modifier.height(12.dp))
        KineticButton(
            text = if (isRest) "Entrenar el ${day.name}" else "Descansar el ${day.name}",
            primary = false,
            onClick = model::toggleRest,
        )
        Spacer(Modifier.height(8.dp))
        Text(
            if (isRest) "La rutina se conserva. Puedes volver a entrenar cuando quieras."
            else "El descanso es el día que elijas, el día que lo decidas.",
            color = Muted,
            fontSize = 13.sp,
        )
        Spacer(Modifier.height(16.dp))
        when {
            isRest -> RestPanel(day.name) { model.finishSession() }
            exercises.isEmpty() -> EmptyDay()
            else -> exercises.forEach { exercise ->
                ExerciseCard(exercise, onWeight = { index, delta -> model.adjustWeight(exercise.template.id, index, delta) }) { index ->
                    model.toggleSet(exercise.template.id, index)
                }
                Spacer(Modifier.height(12.dp))
            }
        }
        if (!isRest && exercises.isNotEmpty()) {
            Spacer(Modifier.height(8.dp))
            KineticButton("Guardar sesión", primary = true) { model.finishSession() }
        }
        Spacer(Modifier.height(24.dp))
        Text("Revisión $revision", color = Canvas, fontSize = 1.sp)
    }
}

@Composable
private fun RestPanel(dayName: String, onSave: () -> Unit) {
    Column(
        Modifier
            .fillMaxWidth()
            .clip(RoundedCornerShape(16.dp))
            .background(Card)
            .border(1.dp, Hairline, RoundedCornerShape(16.dp))
            .padding(16.dp),
    ) {
        Text("Descanso · $dayName", color = OnSurface, fontSize = 18.sp, fontWeight = FontWeight.SemiBold)
        Spacer(Modifier.height(8.dp))
        Text("Sin volumen ni series. La racha cuenta este día como registrado.", color = Muted, fontSize = 14.sp)
        Spacer(Modifier.height(16.dp))
        KineticButton("Registrar día de descanso", primary = true, onClick = onSave)
    }
}

@Composable
private fun EmptyDay() {
    Column(
        Modifier
            .fillMaxWidth()
            .clip(RoundedCornerShape(16.dp))
            .background(Card)
            .padding(16.dp),
    ) {
        Text("Sin rutina", color = OnSurface, fontSize = 18.sp, fontWeight = FontWeight.SemiBold)
        Text("Este día no tiene ejercicios. Márcalo como descanso o elige otro día.", color = Muted, fontSize = 14.sp)
    }
}

@Composable
private fun ExerciseCard(exercise: ExerciseUi, onWeight: (Int, Double) -> Unit, onToggle: (Int) -> Unit) {
    Column(
        Modifier
            .fillMaxWidth()
            .clip(RoundedCornerShape(16.dp))
            .background(Card)
            .border(1.dp, Hairline, RoundedCornerShape(16.dp))
            .padding(16.dp),
    ) {
        Image(
            painter = painterResource(exercise.template.imageRes),
            contentDescription = exercise.template.name,
            contentScale = ContentScale.Crop,
            modifier = Modifier
                .fillMaxWidth()
                .height(148.dp)
                .clip(RoundedCornerShape(12.dp)),
        )
        Spacer(Modifier.height(12.dp))
        Text(exercise.template.muscle, color = Lime, fontSize = 10.sp, fontWeight = FontWeight.Bold, letterSpacing = 1.sp)
        Text(exercise.template.name, color = OnSurface, fontSize = 18.sp, fontWeight = FontWeight.SemiBold)
        Text(exercise.template.objective, color = Muted, fontSize = 13.sp)
        Text(exercise.template.load, color = Cyan, fontSize = 13.sp)
        if (exercise.template.tip.isNotBlank()) {
            Spacer(Modifier.height(8.dp))
            Text(exercise.template.tip, color = Muted, fontSize = 13.sp)
        }
        Spacer(Modifier.height(12.dp))
        exercise.sets.forEachIndexed { index, set ->
            val shape = RoundedCornerShape(8.dp)
            Row(
                Modifier
                    .fillMaxWidth()
                    .padding(vertical = 4.dp)
                    .clip(shape)
                    .background(if (set.completed) Lime.copy(alpha = 0.08f) else ContainerLow)
                    .border(
                        width = if (set.completed) 2.dp else 1.dp,
                        color = if (set.completed) Lime else Hairline,
                        shape = shape,
                    )
                    .padding(horizontal = 8.dp, vertical = 4.dp),
                verticalAlignment = Alignment.CenterVertically,
            ) {
                Text("S${index + 1}", color = Muted, fontSize = 12.sp, fontWeight = FontWeight.Bold, modifier = Modifier.width(28.dp))
                StepButton("-") { onWeight(index, -1.0) }
                Text(
                    formatKg(set.weight),
                    color = OnSurface,
                    style = MetricStyle.copy(fontSize = 18.sp),
                    modifier = Modifier.width(64.dp),
                )
                StepButton("+") { onWeight(index, 1.0) }
                Text(set.reps, color = Muted, fontSize = 13.sp, modifier = Modifier.weight(1f))
                Box(
                    Modifier
                        .size(48.dp)
                        .clip(CircleShape)
                        .background(if (set.completed) Lime else androidx.compose.ui.graphics.Color.Transparent)
                        .border(2.dp, if (set.completed) Lime else Highest, CircleShape)
                        .clickable { onToggle(index) },
                    contentAlignment = Alignment.Center,
                ) {
                    if (set.completed) Icon(Icons.Filled.Check, contentDescription = "Serie hecha", tint = OnLime)
                }
            }
        }
    }
}

@Composable
private fun StepButton(label: String, onClick: () -> Unit) {
    Box(
        Modifier
            .size(48.dp)
            .clip(CircleShape)
            .clickable(onClick = onClick),
        contentAlignment = Alignment.Center,
    ) {
        Text(label, color = OnSurface, fontSize = 22.sp, fontWeight = FontWeight.Bold)
    }
}

@Composable
private fun KineticButton(text: String, primary: Boolean, onClick: () -> Unit) {
    Box(
        Modifier
            .fillMaxWidth()
            .height(52.dp)
            .clip(RoundedCornerShape(999.dp))
            .background(if (primary) Lime else Elevated)
            .border(1.dp, if (primary) Lime else Hairline, RoundedCornerShape(999.dp))
            .clickable(onClick = onClick),
        contentAlignment = Alignment.Center,
    ) {
        Text(text, color = if (primary) OnLime else OnSurface, fontWeight = FontWeight.Bold, fontSize = 14.sp)
    }
}

@Composable
private fun RestDock(model: IronBenchViewModel) {
    Row(
        Modifier
            .fillMaxWidth()
            .background(Highest)
            .padding(horizontal = 16.dp, vertical = 8.dp),
        verticalAlignment = Alignment.CenterVertically,
    ) {
        Column(Modifier.weight(1f)) {
            Text(if (model.restRunning) "DESCANSO" else "EN PAUSA", color = Muted, fontSize = 10.sp, fontWeight = FontWeight.Bold, letterSpacing = 1.sp)
            Text(
                "%02d:%02d".format(model.restSeconds / 60, model.restSeconds % 60),
                color = Lime,
                style = MetricStyle.copy(fontSize = 32.sp),
            )
        }
        DockAction(if (model.restRunning) "Pausa" else "Seguir") { model.toggleTimer() }
        Spacer(Modifier.width(8.dp))
        DockAction("Saltar") { model.skipRest() }
    }
}

@Composable
private fun DockAction(label: String, onClick: () -> Unit) {
    Box(
        Modifier
            .height(48.dp)
            .clip(RoundedCornerShape(999.dp))
            .background(Elevated)
            .clickable(onClick = onClick)
            .padding(horizontal = 16.dp),
        contentAlignment = Alignment.Center,
    ) {
        Text(label, color = OnSurface, fontWeight = FontWeight.SemiBold)
    }
}

@Composable
private fun TechniqueScreen() {
    Column(
        Modifier
            .fillMaxSize()
            .verticalScroll(rememberScrollState())
            .padding(16.dp),
        verticalArrangement = Arrangement.spacedBy(12.dp),
    ) {
        Text("Técnica", color = OnSurface, fontSize = 32.sp, fontWeight = FontWeight.SemiBold)
        Text("Mancuernas y banco. Puntos para ejecutar sin inventar recorrido.", color = Muted, fontSize = 14.sp)
        TECHNIQUE.forEach { (name, steps) ->
            Column(
                Modifier
                    .fillMaxWidth()
                    .clip(RoundedCornerShape(16.dp))
                    .background(Card)
                    .border(1.dp, Hairline, RoundedCornerShape(16.dp))
                    .padding(16.dp),
            ) {
                Image(
                    painter = painterResource(imageForTechnique(name)),
                    contentDescription = name,
                    contentScale = ContentScale.Crop,
                    modifier = Modifier
                        .fillMaxWidth()
                        .height(120.dp)
                        .clip(RoundedCornerShape(12.dp)),
                )
                Spacer(Modifier.height(10.dp))
                Text(name, color = OnSurface, fontSize = 18.sp, fontWeight = FontWeight.SemiBold)
                Spacer(Modifier.height(8.dp))
                steps.forEachIndexed { index, step ->
                    Text("${index + 1}. $step", color = Muted, fontSize = 14.sp, modifier = Modifier.padding(bottom = 6.dp))
                }
            }
        }
    }
}

@Composable
private fun ProgressScreen(model: IronBenchViewModel, revision: Int) {
    val metrics = model.metrics
    val history = model.history
    var editing by remember(revision) { mutableStateOf(false) }
    Column(
        Modifier
            .fillMaxSize()
            .verticalScroll(rememberScrollState())
            .padding(16.dp),
    ) {
        Text("Progreso", color = OnSurface, fontSize = 32.sp, fontWeight = FontWeight.SemiBold)
        Text("Las medidas viven en este teléfono.", color = Muted, fontSize = 14.sp)
        Spacer(Modifier.height(16.dp))
        WeightChart(history.map { it.weight })
        Spacer(Modifier.height(16.dp))
        MetricGrid(history, metrics)
        Spacer(Modifier.height(16.dp))
        if (editing) {
            MetricsForm(metrics, onCancel = { editing = false }) { model.saveMetrics(it); editing = false }
        } else {
            KineticButton("Actualizar medidas", primary = true) { editing = true }
        }
    }
}

@Composable
private fun WeightChart(values: List<Double>) {
    Column(
        Modifier
            .fillMaxWidth()
            .clip(RoundedCornerShape(24.dp))
            .background(Card)
            .border(1.dp, Hairline, RoundedCornerShape(24.dp))
            .padding(16.dp),
    ) {
        Text("PESO", color = Muted, fontSize = 10.sp, fontWeight = FontWeight.Bold, letterSpacing = 1.sp)
        Text("${formatKg(values.lastOrNull() ?: 0.0)} kg", color = OnSurface, style = MetricStyle)
        Canvas(Modifier.fillMaxWidth().height(120.dp).padding(top = 12.dp)) {
            if (values.size < 2) return@Canvas
            val min = values.min()
            val max = values.max().coerceAtLeast(min + 0.1)
            val path = Path()
            values.forEachIndexed { index, value ->
                val x = size.width * index / (values.size - 1)
                val y = size.height - ((value - min) / (max - min) * size.height).toFloat()
                if (index == 0) path.moveTo(x, y) else path.lineTo(x, y)
            }
            drawPath(path, Cyan, style = Stroke(width = 4f))
            val lastX = size.width
            val lastY = size.height - ((values.last() - min) / (max - min) * size.height).toFloat()
            drawCircle(Lime, radius = 8f, center = Offset(lastX, lastY))
        }
    }
}

@Composable
private fun MetricGrid(history: List<com.ebyzom.ironbench.data.HistoryPoint>, metrics: Metrics) {
    val first = history.firstOrNull()
    val last = history.lastOrNull()
    val items = listOf(
        "Peso" to Pair(metrics.weight, (last?.weight ?: 0.0) - (first?.weight ?: 0.0)),
        "Grasa" to Pair(metrics.bodyFat, (last?.bodyFat ?: 0.0) - (first?.bodyFat ?: 0.0)),
        "Cintura" to Pair(metrics.waist, (last?.waist ?: 0.0) - (first?.waist ?: 0.0)),
        "Pecho" to Pair(metrics.chest, (last?.chest ?: 0.0) - (first?.chest ?: 0.0)),
        "Brazo" to Pair(metrics.arm, (last?.arm ?: 0.0) - (first?.arm ?: 0.0)),
        "Antebrazo" to Pair(metrics.forearm, (last?.forearm ?: 0.0) - (first?.forearm ?: 0.0)),
    )
    Column(verticalArrangement = Arrangement.spacedBy(8.dp)) {
        items.chunked(2).forEach { row ->
            Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                row.forEach { (label, value) ->
                    Column(
                        Modifier
                            .weight(1f)
                            .clip(RoundedCornerShape(16.dp))
                            .background(Card)
                            .border(1.dp, Hairline, RoundedCornerShape(16.dp))
                            .padding(12.dp),
                    ) {
                        Text(label.uppercase(), color = Muted, fontSize = 10.sp, fontWeight = FontWeight.Bold, letterSpacing = 1.sp)
                        Text(formatKg(value.first), color = OnSurface, style = MetricStyle.copy(fontSize = 22.sp))
                        Text(signed(value.second), color = if (value.second <= 0 && label != "Pecho" && label != "Brazo" && label != "Antebrazo") Cyan else Lime, fontSize = 12.sp)
                    }
                }
            }
        }
    }
}

@Composable
private fun MetricsForm(current: Metrics, onCancel: () -> Unit, onSave: (Metrics) -> Unit) {
    var weight by remember { mutableStateOf(current.weight.toString()) }
    var waist by remember { mutableStateOf(current.waist.toString()) }
    var arm by remember { mutableStateOf(current.arm.toString()) }
    var chest by remember { mutableStateOf(current.chest.toString()) }
    var thigh by remember { mutableStateOf(current.thigh.toString()) }
    var forearm by remember { mutableStateOf(current.forearm.toString()) }
    var fat by remember { mutableStateOf(current.bodyFat.toString()) }
    Column(verticalArrangement = Arrangement.spacedBy(8.dp)) {
        NumberField("Peso kg", weight) { weight = it }
        NumberField("Cintura cm", waist) { waist = it }
        NumberField("Brazo cm", arm) { arm = it }
        NumberField("Pecho cm", chest) { chest = it }
        NumberField("Muslo cm", thigh) { thigh = it }
        NumberField("Antebrazo cm", forearm) { forearm = it }
        NumberField("Grasa %", fat) { fat = it }
        KineticButton("Guardar medidas", primary = true) {
            val next = Metrics(
                weight.toDoubleOrNull() ?: current.weight,
                waist.toDoubleOrNull() ?: current.waist,
                arm.toDoubleOrNull() ?: current.arm,
                chest.toDoubleOrNull() ?: current.chest,
                thigh.toDoubleOrNull() ?: current.thigh,
                forearm.toDoubleOrNull() ?: current.forearm,
                fat.toDoubleOrNull() ?: current.bodyFat,
            )
            onSave(next)
        }
        KineticButton("Cancelar", primary = false, onClick = onCancel)
    }
}

@Composable
private fun NumberField(label: String, value: String, onChange: (String) -> Unit) {
    Column {
        Text(label.uppercase(), color = Muted, fontSize = 10.sp, fontWeight = FontWeight.Bold, letterSpacing = 1.sp)
        androidx.compose.foundation.text.BasicTextField(
            value = value,
            onValueChange = onChange,
            textStyle = MetricStyle.copy(color = OnSurface, fontSize = 20.sp),
            singleLine = true,
            modifier = Modifier
                .fillMaxWidth()
                .clip(RoundedCornerShape(8.dp))
                .background(ContainerLow)
                .border(1.dp, Hairline, RoundedCornerShape(8.dp))
                .padding(horizontal = 12.dp, vertical = 14.dp),
        )
    }
}

@Composable
private fun HistoryScreen(model: IronBenchViewModel, revision: Int) {
    val logs = model.logs
    val minutes = logs.filter { !it.rest }.sumOf { it.minutes }
    val sessions = logs.count { !it.rest }
    Column(
        Modifier
            .fillMaxSize()
            .verticalScroll(rememberScrollState())
            .padding(16.dp),
    ) {
        Text("Historial", color = OnSurface, fontSize = 32.sp, fontWeight = FontWeight.SemiBold)
        Text(if (logs.isEmpty()) "Todavía no hay sesiones guardadas." else "Sesiones guardadas", color = Muted, fontSize = 14.sp)
        Spacer(Modifier.height(12.dp))
        Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
            SummaryChip("Sesiones", sessions.toString(), Modifier.weight(1f))
            SummaryChip("Minutos", minutes.toString(), Modifier.weight(1f))
            SummaryChip("Racha", model.streak.toString(), Modifier.weight(1f))
        }
        Spacer(Modifier.height(16.dp))
        if (logs.isEmpty()) {
            Text("Guarda un entrenamiento o un descanso desde Rutinas.", color = Muted, fontSize = 14.sp)
        }
        logs.forEach { log ->
            Column(
                Modifier
                    .fillMaxWidth()
                    .padding(bottom = 8.dp)
                    .clip(RoundedCornerShape(16.dp))
                    .background(Card)
                    .border(1.dp, Hairline, RoundedCornerShape(16.dp))
                    .padding(16.dp),
            ) {
                Text(log.isoDate, color = Muted, fontSize = 11.sp, fontWeight = FontWeight.Bold)
                Text(log.title, color = OnSurface, fontSize = 16.sp, fontWeight = FontWeight.SemiBold)
                Text(
                    if (log.rest) "Descanso" else "${log.minutes} min · ${log.volumeKg.roundToInt()} kg · ${log.completedSets}/${log.totalSets} series",
                    color = Cyan,
                    fontSize = 13.sp,
                )
            }
        }
        Text("$revision", color = Canvas, fontSize = 1.sp)
    }
}

@Composable
private fun SummaryChip(label: String, value: String, modifier: Modifier) {
    Column(
        modifier
            .clip(RoundedCornerShape(16.dp))
            .background(Card)
            .padding(12.dp),
    ) {
        Text(label.uppercase(), color = Muted, fontSize = 10.sp, fontWeight = FontWeight.Bold)
        Text(value, color = OnSurface, style = MetricStyle.copy(fontSize = 22.sp))
    }
}

@Composable
private fun PrivacyScreen(onClose: () -> Unit) {
    Column(
        Modifier
            .fillMaxSize()
            .background(Canvas)
            .statusBarsPadding()
            .navigationBarsPadding()
            .verticalScroll(rememberScrollState())
            .padding(16.dp),
    ) {
        Text("Política de privacidad", color = OnSurface, fontSize = 32.sp, fontWeight = FontWeight.SemiBold)
        Text("15 de octubre de 2026", color = Muted, fontSize = 13.sp)
        Spacer(Modifier.height(16.dp))
        Policy("Responsable", "IRONBENCH es diseño y creación de EBYZOM E.I.R.L. La app no abre una cuenta ni envía tus entrenamientos a un servidor.")
        Policy("Datos en el teléfono", "Se guardan rutinas, series, pesos, días de descanso, racha, medidas corporales y el historial de sesiones. Todo queda en el almacenamiento local de la app.")
        Policy("Para qué", "Para mostrarte la semana, calcular volumen de las series completadas, la duración real de la sesión y la evolución de tus medidas.")
        Policy("Conservación", "Los datos permanecen hasta que borras los datos de la app o la desinstalas.")
        Policy("Salud", "IRONBENCH no es consejo médico. Ajusta cargas y descansos a tu estado y, si hay dolor, para.")
        Policy("Menores", "La app no está dirigida a menores de edad.")
        Spacer(Modifier.height(16.dp))
        KineticButton("Cerrar", primary = true, onClick = onClose)
    }
}

@Composable
private fun Policy(title: String, body: String) {
    Text(title, color = Lime, fontSize = 14.sp, fontWeight = FontWeight.Bold, modifier = Modifier.padding(top = 12.dp))
    Text(body, color = OnSurface, fontSize = 14.sp, modifier = Modifier.padding(top = 4.dp))
}

private fun formatKg(value: Double): String {
    val rounded = (value * 10).roundToInt() / 10.0
    return if (rounded % 1.0 == 0.0) rounded.toInt().toString() else rounded.toString()
}

private fun signed(value: Double): String {
    val text = formatKg(kotlin.math.abs(value))
    return when {
        value > 0 -> "+$text"
        value < 0 -> "-$text"
        else -> "0"
    }
}
