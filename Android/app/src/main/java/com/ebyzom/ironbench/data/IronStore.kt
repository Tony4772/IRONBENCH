package com.ebyzom.ironbench.data

import android.content.Context
import org.json.JSONArray
import org.json.JSONObject
import java.time.LocalDate

data class Snapshot(
    val restDays: Set<String>,
    val progress: Map<String, List<PersistedExercise>>,
    val metrics: Metrics,
    val history: List<HistoryPoint>,
    val logs: List<WorkoutLog>,
    val streakCount: Int,
    val lastWorkoutDate: String?,
)

class IronStore(context: Context) {
    private val prefs = context.getSharedPreferences("ironbench_state_v1", Context.MODE_PRIVATE)

    fun load(): Snapshot {
        val raw = prefs.getString(KEY, null) ?: return defaults()
        return try {
            decode(JSONObject(raw))
        } catch (_: Exception) {
            defaults()
        }
    }

    fun save(snapshot: Snapshot) {
        prefs.edit().putString(KEY, encode(snapshot).toString()).apply()
    }

    private fun defaults(): Snapshot {
        val history = listOf(
            point("2026-09-16", "16 Sep", 78.5, 85.0, 35.3, 99.0, 56.5, 29.7, 17.6),
            point("2026-09-23", "23 Sep", 77.9, 84.2, 35.6, 99.4, 56.8, 29.9, 17.2),
            point("2026-09-30", "30 Sep", 77.2, 83.5, 35.9, 99.8, 57.2, 30.1, 16.8),
            point("2026-10-07", "07 Oct", 76.8, 82.6, 36.2, 100.4, 57.6, 30.3, 16.5),
            point("2026-10-15", "15 Oct", 76.4, 82.0, 36.5, 101.0, 58.0, 30.5, 16.2),
        )
        return Snapshot(
            restDays = emptySet(),
            progress = emptyMap(),
            metrics = history.last().toMetrics(),
            history = history,
            logs = emptyList(),
            streakCount = 5,
            lastWorkoutDate = null,
        )
    }

    private fun encode(snapshot: Snapshot): JSONObject {
        val root = JSONObject()
        root.put("restDays", JSONArray(snapshot.restDays.toList()))
        root.put("streak", snapshot.streakCount)
        root.put("lastWorkoutDate", snapshot.lastWorkoutDate ?: JSONObject.NULL)
        root.put("metrics", snapshot.metrics.toJson())
        root.put("history", JSONArray(snapshot.history.map { it.toJson() }))
        root.put("logs", JSONArray(snapshot.logs.map { it.toJson() }))
        val days = JSONObject()
        snapshot.progress.forEach { (day, exercises) ->
            days.put(day, JSONArray(exercises.map { exercise ->
                JSONObject()
                    .put("id", exercise.id)
                    .put("sets", JSONArray(exercise.sets.map { set ->
                        JSONObject().put("weight", set.weight).put("completed", set.completed)
                    }))
            }))
        }
        root.put("days", days)
        return root
    }

    private fun decode(root: JSONObject): Snapshot {
        val rest = mutableSetOf<String>()
        val restArray = root.optJSONArray("restDays") ?: JSONArray()
        for (index in 0 until restArray.length()) {
            val id = restArray.optString(index)
            if (WEEK.any { it.id == id }) rest += id
        }
        val progress = mutableMapOf<String, List<PersistedExercise>>()
        val days = root.optJSONObject("days") ?: JSONObject()
        WEEK.forEach { day ->
            val stored = days.optJSONArray(day.id) ?: return@forEach
            val exercises = mutableListOf<PersistedExercise>()
            for (index in 0 until stored.length()) {
                val item = stored.optJSONObject(index) ?: continue
                val setsArray = item.optJSONArray("sets") ?: continue
                val sets = mutableListOf<PersistedSet>()
                for (setIndex in 0 until setsArray.length()) {
                    val set = setsArray.optJSONObject(setIndex) ?: continue
                    sets += PersistedSet(set.optDouble("weight"), set.optBoolean("completed"))
                }
                exercises += PersistedExercise(item.optInt("id"), sets)
            }
            progress[day.id] = exercises
        }
        val historyArray = root.optJSONArray("history") ?: JSONArray()
        val history = mutableListOf<HistoryPoint>()
        for (index in 0 until historyArray.length()) {
            historyArray.optJSONObject(index)?.toPoint()?.let { history += it }
        }
        val logsArray = root.optJSONArray("logs") ?: JSONArray()
        val logs = mutableListOf<WorkoutLog>()
        for (index in 0 until logsArray.length()) {
            logsArray.optJSONObject(index)?.toLog()?.let { logs += it }
        }
        val fallback = defaults()
        val metrics = root.optJSONObject("metrics")?.toMetrics() ?: history.lastOrNull()?.toMetrics() ?: fallback.metrics
        return Snapshot(
            restDays = rest,
            progress = progress,
            metrics = metrics,
            history = if (history.isEmpty()) fallback.history else history,
            logs = logs,
            streakCount = root.optInt("streak", fallback.streakCount),
            lastWorkoutDate = if (root.isNull("lastWorkoutDate")) null else root.optString("lastWorkoutDate").ifBlank { null },
        )
    }

    companion object {
        private const val KEY = "snapshot"
    }
}

fun todayIso(): String = LocalDate.now().toString()

fun todayDayId(): String = when (LocalDate.now().dayOfWeek) {
    java.time.DayOfWeek.MONDAY -> "LUN"
    java.time.DayOfWeek.TUESDAY -> "MAR"
    java.time.DayOfWeek.WEDNESDAY -> "MIÉ"
    java.time.DayOfWeek.THURSDAY -> "JUE"
    java.time.DayOfWeek.FRIDAY -> "VIE"
    java.time.DayOfWeek.SATURDAY -> "SÁB"
    java.time.DayOfWeek.SUNDAY -> "DOM"
}

fun repsMidpoint(reps: String): Double {
    val numbers = Regex("""\d+(?:[.,]\d+)?""").findAll(reps).map { it.value.replace(',', '.').toDouble() }.toList()
    if (numbers.isEmpty()) return 0.0
    return numbers.average()
}

private fun point(
    iso: String,
    label: String,
    weight: Double,
    waist: Double,
    arm: Double,
    chest: Double,
    thigh: Double,
    forearm: Double,
    fat: Double,
) = HistoryPoint(iso, label, weight, waist, arm, chest, thigh, forearm, fat)

private fun HistoryPoint.toMetrics() = Metrics(weight, waist, arm, chest, thigh, forearm, bodyFat)

private fun Metrics.toJson() = JSONObject()
    .put("weight", weight)
    .put("waist", waist)
    .put("arm", arm)
    .put("chest", chest)
    .put("thigh", thigh)
    .put("forearm", forearm)
    .put("bodyFat", bodyFat)

private fun JSONObject.toMetrics() = Metrics(
    optDouble("weight"),
    optDouble("waist"),
    optDouble("arm"),
    optDouble("chest"),
    optDouble("thigh"),
    optDouble("forearm"),
    optDouble("bodyFat"),
)

private fun HistoryPoint.toJson() = JSONObject()
    .put("isoDate", isoDate)
    .put("label", label)
    .put("weight", weight)
    .put("waist", waist)
    .put("arm", arm)
    .put("chest", chest)
    .put("thigh", thigh)
    .put("forearm", forearm)
    .put("bodyFat", bodyFat)

private fun JSONObject.toPoint(): HistoryPoint? {
    val iso = optString("isoDate")
    if (iso.isBlank()) return null
    return HistoryPoint(
        iso,
        optString("label", iso),
        optDouble("weight"),
        optDouble("waist"),
        optDouble("arm"),
        optDouble("chest"),
        optDouble("thigh"),
        optDouble("forearm"),
        optDouble("bodyFat"),
    )
}

private fun WorkoutLog.toJson() = JSONObject()
    .put("id", id)
    .put("title", title)
    .put("dayId", dayId)
    .put("dayName", dayName)
    .put("isoDate", isoDate)
    .put("minutes", minutes)
    .put("volumeKg", volumeKg)
    .put("completedSets", completedSets)
    .put("totalSets", totalSets)
    .put("rest", rest)

private fun JSONObject.toLog(): WorkoutLog? {
    val id = optString("id")
    if (id.isBlank()) return null
    return WorkoutLog(
        id,
        optString("title"),
        optString("dayId"),
        optString("dayName"),
        optString("isoDate"),
        optInt("minutes"),
        optDouble("volumeKg"),
        optInt("completedSets"),
        optInt("totalSets"),
        optBoolean("rest"),
    )
}
