package com.ebyzom.ironbench.data

data class SetTemplate(val weight: Double, val reps: String)

data class ExerciseTemplate(
    val id: Int,
    val name: String,
    val muscle: String,
    val objective: String,
    val load: String,
    val tip: String,
    val bilateral: Boolean,
    val imageRes: Int,
    val sets: List<SetTemplate>,
)

data class DayTemplate(
    val id: String,
    val name: String,
    val focus: String,
    val title: String,
    val minutes: Int,
    val exercises: List<ExerciseTemplate>,
)

data class Metrics(
    val weight: Double,
    val waist: Double,
    val arm: Double,
    val chest: Double,
    val thigh: Double,
    val forearm: Double,
    val bodyFat: Double,
)

data class HistoryPoint(
    val isoDate: String,
    val label: String,
    val weight: Double,
    val waist: Double,
    val arm: Double,
    val chest: Double,
    val thigh: Double,
    val forearm: Double,
    val bodyFat: Double,
)

data class WorkoutLog(
    val id: String,
    val title: String,
    val dayId: String,
    val dayName: String,
    val isoDate: String,
    val minutes: Int,
    val volumeKg: Double,
    val completedSets: Int,
    val totalSets: Int,
    val rest: Boolean,
)

data class PersistedSet(val weight: Double, val completed: Boolean)

data class PersistedExercise(val id: Int, val sets: List<PersistedSet>)
