package com.ebyzom.ironbench

import android.app.Application
import android.media.AudioManager
import android.media.ToneGenerator
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.setValue
import androidx.lifecycle.AndroidViewModel
import androidx.lifecycle.viewModelScope
import com.ebyzom.ironbench.data.ExerciseTemplate
import com.ebyzom.ironbench.data.HistoryPoint
import com.ebyzom.ironbench.data.IronStore
import com.ebyzom.ironbench.data.Metrics
import com.ebyzom.ironbench.data.PersistedExercise
import com.ebyzom.ironbench.data.PersistedSet
import com.ebyzom.ironbench.data.Snapshot
import com.ebyzom.ironbench.data.WEEK
import com.ebyzom.ironbench.data.WorkoutLog
import com.ebyzom.ironbench.data.dayById
import com.ebyzom.ironbench.data.repsMidpoint
import com.ebyzom.ironbench.data.todayDayId
import com.ebyzom.ironbench.data.todayIso
import kotlinx.coroutines.Job
import kotlinx.coroutines.delay
import kotlinx.coroutines.launch
import java.time.LocalDate
import java.util.UUID

data class SetUi(val weight: Double, val reps: String, val completed: Boolean)

data class ExerciseUi(val template: ExerciseTemplate, val sets: List<SetUi>)

class IronBenchViewModel(app: Application) : AndroidViewModel(app) {
    private val store = IronStore(app)
    private var snapshot = store.load()
    private var timerJob: Job? = null

    var selectedDay by mutableStateOf(todayDayId())
        private set
    var restSeconds by mutableStateOf(60)
        private set
    var restRunning by mutableStateOf(false)
        private set
    var message by mutableStateOf<String?>(null)
        private set
    var privacyOpen by mutableStateOf(false)
    var sessionRevision by mutableStateOf(0)
        private set

    val restDays: Set<String> get() = snapshot.restDays
    val metrics: Metrics get() = snapshot.metrics
    val history: List<HistoryPoint> get() = snapshot.history
    val logs: List<WorkoutLog> get() = snapshot.logs
    val streak: Int get() = snapshot.streakCount

    private var startedAt = System.currentTimeMillis()

    fun exercisesFor(dayId: String): List<ExerciseUi> {
        val day = dayById(dayId)
        val saved = snapshot.progress[dayId].orEmpty()
        return day.exercises.map { template ->
            val match = saved.firstOrNull { it.id == template.id && it.sets.size == template.sets.size }
            val sets = template.sets.mapIndexed { index, templateSet ->
                val stored = match?.sets?.getOrNull(index)
                SetUi(
                    weight = stored?.weight ?: templateSet.weight,
                    reps = templateSet.reps,
                    completed = stored?.completed ?: false,
                )
            }
            ExerciseUi(template, sets)
        }
    }

    fun selectDay(dayId: String) {
        if (!WEEK.any { it.id == dayId } || dayId == selectedDay) return
        selectedDay = dayId
        startedAt = System.currentTimeMillis()
        stopTimer()
        restSeconds = 60
        sessionRevision++
    }

    fun toggleRest() {
        val current = snapshot.restDays
        snapshot = snapshot.copy(
            restDays = if (selectedDay in current) current - selectedDay else current + selectedDay,
        )
        persist()
        sessionRevision++
    }

    fun adjustWeight(exerciseId: Int, setIndex: Int, delta: Double) {
        updateSets(selectedDay) { exercise ->
            if (exercise.template.id != exerciseId) return@updateSets exercise
            exercise.copy(
                sets = exercise.sets.mapIndexed { index, set ->
                    if (index == setIndex) set.copy(weight = (set.weight + delta).coerceAtLeast(0.0)) else set
                },
            )
        }
    }

    fun toggleSet(exerciseId: Int, setIndex: Int) {
        var completedNow = false
        updateSets(selectedDay) { exercise ->
            if (exercise.template.id != exerciseId) return@updateSets exercise
            exercise.copy(
                sets = exercise.sets.mapIndexed { index, set ->
                    if (index != setIndex) set
                    else {
                        val next = !set.completed
                        if (next) completedNow = true
                        set.copy(completed = next)
                    }
                },
            )
        }
        if (completedNow) {
            restSeconds = 60
            startTimer()
        }
    }

    fun toggleTimer() {
        if (restRunning) stopTimer() else startTimer()
    }

    fun skipRest() {
        stopTimer()
        restSeconds = 60
    }

    fun finishSession(): Boolean {
        val day = dayById(selectedDay)
        val exercises = exercisesFor(selectedDay)
        val isRest = selectedDay in snapshot.restDays
        val today = todayIso()
        if (isRest) {
            val already = snapshot.logs.any { it.rest && it.isoDate == today }
            if (already) {
                message = "El descanso de hoy ya está registrado."
                return false
            }
            snapshot = snapshot.copy(
                logs = listOf(
                    WorkoutLog(
                        id = UUID.randomUUID().toString(),
                        title = "Descanso · ${day.name}",
                        dayId = day.id,
                        dayName = day.name,
                        isoDate = today,
                        minutes = 0,
                        volumeKg = 0.0,
                        completedSets = 0,
                        totalSets = 0,
                        rest = true,
                    ),
                ) + snapshot.logs,
                streakCount = advanceStreak(snapshot.streakCount, snapshot.lastWorkoutDate, today),
                lastWorkoutDate = today,
            )
            persist()
            message = "Día de descanso guardado."
            sessionRevision++
            return true
        }
        val completed = exercises.sumOf { exercise -> exercise.sets.count { it.completed } }
        if (completed == 0) {
            message = "Marca al menos una serie para guardar la sesión."
            return false
        }
        val volume = exercises.sumOf { exercise ->
            val sides = if (exercise.template.bilateral) 2.0 else 1.0
            exercise.sets.filter { it.completed }.sumOf { set ->
                set.weight * repsMidpoint(set.reps) * sides
            }
        }
        val elapsed = ((System.currentTimeMillis() - startedAt) / 60000L).toInt().coerceAtLeast(1)
        val total = exercises.sumOf { it.sets.size }
        snapshot = snapshot.copy(
            logs = listOf(
                WorkoutLog(
                    id = UUID.randomUUID().toString(),
                    title = day.title,
                    dayId = day.id,
                    dayName = day.name,
                    isoDate = today,
                    minutes = elapsed,
                    volumeKg = volume,
                    completedSets = completed,
                    totalSets = total,
                    rest = false,
                ),
            ) + snapshot.logs,
            progress = snapshot.progress + (selectedDay to exercises.map { exercise ->
                PersistedExercise(
                    exercise.template.id,
                    exercise.sets.map { PersistedSet(it.weight, completed = false) },
                )
            }),
            streakCount = advanceStreak(snapshot.streakCount, snapshot.lastWorkoutDate, today),
            lastWorkoutDate = today,
        )
        startedAt = System.currentTimeMillis()
        persist()
        message = "Sesión guardada · ${elapsed} min · ${volume.toInt()} kg"
        sessionRevision++
        return true
    }

    fun saveMetrics(next: Metrics) {
        val today = todayIso()
        val label = LocalDate.now().dayOfMonth.toString().padStart(2, '0') + " " +
            LocalDate.now().month.getDisplayName(java.time.format.TextStyle.SHORT, java.util.Locale("es", "ES"))
                .replaceFirstChar { it.uppercase() }
        val point = HistoryPoint(today, label, next.weight, next.waist, next.arm, next.chest, next.thigh, next.forearm, next.bodyFat)
        val history = snapshot.history.toMutableList()
        val sameDay = history.indexOfLast { it.isoDate == today }
        if (sameDay >= 0) history[sameDay] = point else history += point
        snapshot = snapshot.copy(metrics = next, history = history)
        persist()
        message = "Medidas actualizadas."
        sessionRevision++
    }

    fun consumeMessage() {
        message = null
    }

    private fun updateSets(dayId: String, transform: (ExerciseUi) -> ExerciseUi) {
        val next = exercisesFor(dayId).map(transform)
        snapshot = snapshot.copy(
            progress = snapshot.progress + (dayId to next.map { exercise ->
                PersistedExercise(exercise.template.id, exercise.sets.map { PersistedSet(it.weight, it.completed) })
            }),
        )
        persist()
        sessionRevision++
    }

    private fun persist() {
        store.save(snapshot)
    }

    private fun startTimer() {
        if (restSeconds <= 0) restSeconds = 60
        restRunning = true
        timerJob?.cancel()
        timerJob = viewModelScope.launch {
            while (restRunning && restSeconds > 0) {
                delay(1000)
                restSeconds -= 1
            }
            if (restSeconds <= 0) {
                restRunning = false
                beep()
            }
        }
    }

    private fun stopTimer() {
        restRunning = false
        timerJob?.cancel()
    }

    private fun beep() {
        try {
            val tone = ToneGenerator(AudioManager.STREAM_NOTIFICATION, 80)
            tone.startTone(ToneGenerator.TONE_PROP_BEEP, 180)
        } catch (_: Exception) {
            // El aviso sonoro es opcional si el dispositivo no tiene stream de notificación.
        }
    }

    override fun onCleared() {
        timerJob?.cancel()
    }
}

private fun advanceStreak(count: Int, last: String?, today: String): Int {
    if (last == today) return count
    val yesterday = LocalDate.parse(today).minusDays(1).toString()
    return if (last == null || last == yesterday) count + 1 else 1
}
