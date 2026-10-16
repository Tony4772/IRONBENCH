package com.ebyzom.ironbench.data

import com.ebyzom.ironbench.R

private val Flat = R.drawable.img_flat_bench
private val Incline = R.drawable.img_incline_bench
private val Curl = R.drawable.img_incline_technique
private val Squat = R.drawable.img_bulgarian
private val Wrist = R.drawable.img_wrist
private val Abs = R.drawable.img_leg_raises

private fun sets(vararg rows: Pair<Double, String>): List<SetTemplate> =
    rows.map { SetTemplate(it.first, it.second) }

private fun exercise(
    id: Int,
    name: String,
    muscle: String,
    objective: String,
    load: String,
    tip: String,
    bilateral: Boolean,
    imageRes: Int,
    rows: List<SetTemplate>,
) = ExerciseTemplate(id, name, muscle, objective, load, tip, bilateral, imageRes, rows)

val WEEK: List<DayTemplate> = listOf(
    DayTemplate(
        id = "LUN",
        name = "Lunes",
        focus = "Pecho & Tríceps",
        title = "Pecho Dominante & Tríceps Asistido",
        minutes = 38,
        exercises = listOf(
            exercise(1, "Press de Banca Plano con Mancuernas", "PECHO", "4 series • Banco plano", "22-26 kg / mancuerna", "Escápulas juntas y pies firmes. Las mancuernas bajan a la altura del pecho.", true, Flat, sets(20.0 to "12", 24.0 to "11", 24.0 to "10-12", 24.0 to "10")),
            exercise(2, "Press Inclinado con Mancuernas", "PECHO SUPERIOR", "3 series • Banco 30°", "18-22 kg", "Banco a 30°. Codos a unos 45° del torso.", true, Incline, sets(20.0 to "12", 20.0 to "12", 22.0 to "10")),
            exercise(3, "Extensiones de Tríceps en Banco", "TRÍCEPS", "3 series • Copa", "14 kg mancuerna única", "Codos quietos apuntando al techo. Baja la copa hacia la frente.", false, Flat, sets(14.0 to "12", 14.0 to "12", 16.0 to "10")),
            exercise(4, "Fondos en Banco con Mancuerna", "TRÍCEPS & PECHO", "3 series", "+16 kg en cadera", "Hombros lejos de las orejas. Recorrido corto si el hombro protesta.", false, Incline, sets(16.0 to "15", 16.0 to "15", 16.0 to "15")),
            exercise(5, "Elevaciones de Piernas en Banco", "CORE", "4 series", "Peso corporal", "Zona lumbar pegada al banco. Acorta el rango si aparece tensión.", false, Abs, sets(0.0 to "20", 0.0 to "18", 0.0 to "16", 0.0 to "15")),
        ),
    ),
    DayTemplate(
        id = "MAR",
        name = "Martes",
        focus = "Piernas & Abs",
        title = "Piernas Unilaterales & Core",
        minutes = 40,
        exercises = listOf(
            exercise(1, "Sentadilla Búlgara con Mancuernas", "CUÁDRICEPS & GLÚTEO", "4 series x 8-10 por pierna", "2x 14-20 kg", "Empeine trasero en el banco. Empuja el talón delantero.", true, Squat, sets(14.0 to "10", 16.0 to "8", 16.0 to "8", 16.0 to "8")),
            exercise(2, "Peso Muerto Rumano con Mancuernas", "ISQUIOS & GLÚTEO", "3 series x 10", "2x 18-24 kg", "Las mancuernas rozan los muslos. Espalda neutra.", true, Flat, sets(18.0 to "10", 20.0 to "10", 20.0 to "10")),
            exercise(3, "Sentadilla Goblet", "CUÁDRICEPS", "3 series x 10", "24-32 kg", "Codos por dentro de las rodillas. Talones clavados.", false, Squat, sets(24.0 to "10", 28.0 to "10", 28.0 to "10")),
            exercise(4, "Puente de Glúteo con Mancuerna", "GLÚTEO", "3 series x 12", "20-28 kg en cadera", "Escápulas en el banco, no el cuello. Aprieta un segundo arriba.", false, Flat, sets(20.0 to "12", 24.0 to "12", 24.0 to "12")),
            exercise(5, "Elevaciones de Piernas en Banco", "ABDOMEN", "3 series", "Peso corporal", "Si aparece tensión lumbar, acorta el rango.", false, Abs, sets(0.0 to "12", 0.0 to "12", 0.0 to "10")),
        ),
    ),
    DayTemplate(
        id = "MIÉ",
        name = "Miércoles",
        focus = "Movilidad & Core",
        title = "Movilidad & Core Ligero",
        minutes = 20,
        exercises = listOf(
            exercise(1, "Rotación Externa en Banco", "MANGUITO ROTADOR", "3 series x 15", "2-4 kg", "Codo pegado al costado. Movimiento lento, sin impulso.", false, Flat, sets(2.0 to "15", 3.0 to "15", 3.0 to "15")),
            exercise(2, "Plancha con Antebrazos en Banco", "CORE", "3 series", "Peso corporal", "Costillas abajo y glúteos activos.", false, Abs, sets(0.0 to "30s", 0.0 to "30s", 0.0 to "30s")),
            exercise(3, "Apertura Isométrica de Pecho", "PECTORAL", "3 series", "2x 6-8 kg", "Codos blandos. Es activación, no una serie al fallo.", true, Incline, sets(6.0 to "20s", 6.0 to "20s", 8.0 to "20s")),
        ),
    ),
    DayTemplate(
        id = "JUE",
        name = "Jueves",
        focus = "Espalda & Bíceps",
        title = "Espalda & Bíceps Hipertrofia",
        minutes = 36,
        exercises = listOf(
            exercise(1, "Remo a Una Mano con Apoyo en Banco", "DORSAL", "4 series x 10 por lado", "22-28 kg", "Rodilla y mano del mismo lado en el banco. Tira el codo hacia la cadera.", false, Flat, sets(22.0 to "10", 24.0 to "10", 26.0 to "10", 26.0 to "8")),
            exercise(2, "Remo Mancuernas en Banco Inclinado", "ESPALDA ALTA", "3 series x 12", "2x 14-18 kg", "Pecho apoyado en el respaldo para quitar impulso lumbar.", true, Incline, sets(14.0 to "12", 16.0 to "12", 16.0 to "10")),
            exercise(3, "Curl Concentrado en Banco", "BÍCEPS", "3 series x 10", "12-16 kg", "Tríceps contra el muslo. Sin balanceo del torso.", false, Curl, sets(12.0 to "10", 14.0 to "10", 14.0 to "8")),
            exercise(4, "Curl de Muñeca Supino", "ANTEBRAZO", "3 series x 15", "2x 8-12 kg", "Antebrazos pegados al banco. Solo se mueven las muñecas.", true, Wrist, sets(8.0 to "15", 10.0 to "15", 10.0 to "12")),
            exercise(5, "Face Pull con Mancuernas en Banco", "DELTOIDES POSTERIOR", "3 series x 15", "2x 6-8 kg", "Codos altos y abiertos. Aprieta escápulas al final.", true, Incline, sets(6.0 to "15", 6.0 to "15", 8.0 to "12")),
        ),
    ),
    DayTemplate(
        id = "VIE",
        name = "Viernes",
        focus = "Piernas & Hombros",
        title = "Piernas & Hombros Potencia",
        minutes = 39,
        exercises = listOf(
            exercise(1, "Zancada Atrás con Mancuernas", "CUÁDRICEPS & GLÚTEO", "4 series x 8 por pierna", "2x 12-18 kg", "Paso atrás largo. Rodilla delantera sigue el pie.", true, Squat, sets(12.0 to "8", 14.0 to "8", 16.0 to "8", 16.0 to "8")),
            exercise(2, "Press Militar Sentado en Banco", "HOMBROS", "4 series x 8", "2x 12-16 kg", "Respaldo casi vertical. Las mancuernas bajan a la altura de las orejas.", true, Incline, sets(12.0 to "8", 14.0 to "8", 14.0 to "8", 16.0 to "6")),
            exercise(3, "Elevaciones Laterales Sentado", "DELTOIDES MEDIO", "3 series x 12", "2x 6-8 kg", "Sentado para no usar las piernas. Para justo debajo del hombro.", true, Incline, sets(6.0 to "12", 6.0 to "12", 8.0 to "12")),
            exercise(4, "Fondos en Banco", "TRÍCEPS", "3 series x 12", "Peso corporal", "Hombros lejos de las orejas. Recorrido corto si el hombro protesta.", false, Flat, sets(0.0 to "12", 0.0 to "12", 0.0 to "10")),
            exercise(5, "Encogimiento en Banco", "ABDOMEN", "3 series x 15", "Peso corporal", "Mentón separado del pecho. Sube las costillas, no el cuello.", false, Abs, sets(0.0 to "15", 0.0 to "15", 0.0 to "12")),
        ),
    ),
    DayTemplate(
        id = "SÁB",
        name = "Sábado",
        focus = "Full-Body HIIT",
        title = "Full-Body HIIT con Mancuerna",
        minutes = 30,
        exercises = listOf(
            exercise(1, "Thruster con Mancuernas", "CUERPO COMPLETO", "4 series x 10", "2x 10-14 kg", "Sentadilla y press en un solo gesto. Exhala en la subida.", true, Incline, sets(10.0 to "10", 12.0 to "10", 12.0 to "10", 14.0 to "8")),
            exercise(2, "Remo + Press en Banco Plano", "ESPALDA & PECHO", "3 series x 8", "2x 12 kg", "Primero el remo, luego el press. Sin rebotes.", true, Flat, sets(12.0 to "8", 12.0 to "8", 12.0 to "8")),
            exercise(3, "Zancada Alterna", "PIERNAS", "3 series x 12", "2x 10 kg", "Torso alto. Cada repetición cuenta una pierna.", true, Squat, sets(10.0 to "12", 10.0 to "12", 10.0 to "12")),
            exercise(4, "Escaladores con Manos en Banco", "CORE", "3 series", "Peso corporal", "Manos en el borde del banco. Cadera quieta.", false, Incline, sets(0.0 to "20", 0.0 to "20", 0.0 to "20")),
        ),
    ),
    DayTemplate(
        id = "DOM",
        name = "Domingo",
        focus = "Sin rutina",
        title = "Recuperación total",
        minutes = 0,
        exercises = emptyList(),
    ),
)

fun dayById(id: String): DayTemplate = WEEK.first { it.id == id }

fun imageForTechnique(name: String): Int = when {
    name.startsWith("Press Inclinado") -> Incline
    name.startsWith("Sentadilla") -> Squat
    name.startsWith("Curl de Muñeca") -> Wrist
    name.startsWith("Elevaciones de Piernas") -> Abs
    name.startsWith("Curl Concentrado") -> Curl
    else -> Flat
}

val TECHNIQUE: List<Pair<String, List<String>>> = listOf(
    "Press Inclinado con Mancuernas" to listOf(
        "Banco a 30°. Escápulas juntas antes de sacar las mancuernas.",
        "Baja hasta que los codos queden un poco por debajo del pecho y empuja en vertical.",
    ),
    "Sentadilla Búlgara con Mancuernas" to listOf(
        "Pie trasero solo apoya el empeine. El trabajo sale de la pierna delantera.",
        "Rodilla delantera alineada con el pie. No dejes que caiga hacia dentro.",
    ),
    "Curl de Muñeca Supino" to listOf(
        "Antebrazos apoyados en el banco, palmas arriba.",
        "Abre la mano en el descenso y cierra con fuerza arriba, sin mover el codo.",
    ),
    "Elevaciones de Piernas en Banco" to listOf(
        "Manos firmes en el borde. Lumbar pegada.",
        "Sube la pelvis al final si el abdomen ya controla el rango corto.",
    ),
    "Curl Concentrado en Banco" to listOf(
        "Codo apoyado en la cara interna del muslo.",
        "Sube en dos segundos y baja en tres. Sin balanceo.",
    ),
    "Extensiones Tríceps Copa en Banco" to listOf(
        "Una mancuerna sujeta con ambas manos. Codos fijos.",
        "Baja detrás de la cabeza solo si el hombro lo permite sin dolor.",
    ),
)
