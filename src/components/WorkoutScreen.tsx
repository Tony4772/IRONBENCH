import React, { useState, useEffect } from 'react';
import { WeekDayId, WorkoutExercise } from '../types';
import { WEEK_PLANS } from '../data/mockData';

interface WorkoutScreenProps {
  exercises: WorkoutExercise[];
  onToggleSet: (exerciseId: number, setId: string) => void;
  onUpdateWeight: (exerciseId: number, setId: string, delta: number) => void;
  onOpenTechniqueModal: (exerciseName: string, category: string, tempo: string, imageUrl?: string) => void;
  onFinishWorkout: (rpe: number, notes: string) => void;
  onUpdateExerciseRpe: (exerciseId: number, rpe: number) => void;
  restTimerSeconds: number;
  isTimerRunning: boolean;
  onToggleTimer: () => void;
  onAdd30s: () => void;
  onSkipTimer: () => void;
  isWorkoutActive: boolean;
  onStartSession: () => void;
}

interface ExerciseRpeTrackerProps {
  exerciseId: number;
  targetRpe?: number;
  actualRpe?: number;
  onUpdateRpe: (exerciseId: number, rpe: number) => void;
}

const ExerciseRpeTracker: React.FC<ExerciseRpeTrackerProps> = ({
  exerciseId,
  targetRpe = 8.5,
  actualRpe = 8.5,
  onUpdateRpe,
}) => {
  const rpeOptions = [7.0, 7.5, 8.0, 8.5, 9.0, 9.5, 10.0];

  const getRirDescription = (val: number) => {
    if (val >= 10) return 'RIR 0 · Fallo concéntrico máximo alcanzado';
    if (val >= 9.5) return 'RIR 0.5 · Fallo técnico inminente';
    if (val >= 9.0) return 'RIR 1 · Una repetición en reserva';
    if (val >= 8.5) return 'RIR 1-2 · Zona diana de hipertrofia IronBench';
    if (val >= 8.0) return 'RIR 2 · Dos repeticiones en reserva';
    if (val >= 7.5) return 'RIR 2-3 · Esfuerzo submáximo con buena aceleración';
    return 'RIR 3+ · Carga controlada o serie de aproximación';
  };

  const getRpeBadgeStyle = (val: number) => {
    if (val >= 9.5) return 'text-[#ff5708] border-[#ff5708]/50 bg-[#ff5708]/15';
    if (val >= 8.0) return 'text-[#c3f400] border-[#c3f400]/50 bg-[#c3f400]/15';
    return 'text-[#00daf3] border-[#00daf3]/50 bg-[#00daf3]/15';
  };

  return (
    <div className="pt-3 border-t border-[#444933]/30">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#131b2e] p-3 rounded-xl border border-[#444933]/50">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-[#222a3d] border border-[#444933] flex items-center justify-center text-[#c3f400] flex-shrink-0">
            <span className="material-symbols-outlined text-base">speed</span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold text-[#ffffff] uppercase tracking-wider">
                RPE del Movimiento:
              </span>
              <span
                className={`px-2 py-0.5 rounded text-xs font-['Montserrat'] font-bold border tabular-nums ${getRpeBadgeStyle(
                  actualRpe
                )}`}
              >
                {actualRpe.toFixed(1)}
              </span>
              {targetRpe && (
                <span className="text-[10px] text-[#8e9379]">
                  (Target: {targetRpe.toFixed(1)})
                </span>
              )}
            </div>
            <div className="text-[10px] text-[#c4c9ac] mt-0.5">
              {getRirDescription(actualRpe)}
            </div>
          </div>
        </div>

        {/* Interactive RPE Step / Chips */}
        <div className="flex items-center gap-2 self-start sm:self-auto overflow-x-auto max-w-full pb-0.5">
          {/* Stepper buttons */}
          <div className="flex items-center gap-1 bg-[#171f33] p-1 rounded-lg border border-[#444933]">
            <button
              onClick={() =>
                onUpdateRpe(
                  exerciseId,
                  Math.max(5.0, parseFloat((actualRpe - 0.5).toFixed(1)))
                )
              }
              className="w-6 h-6 rounded bg-[#222a3d] hover:bg-[#2d3449] text-[#dae2fd] hover:text-[#c3f400] font-bold text-xs flex items-center justify-center transition-colors cursor-pointer"
              title="Reducir RPE en 0.5"
            >
              -
            </button>
            <input
              type="number"
              step="0.5"
              min="1"
              max="10"
              value={actualRpe}
              onChange={(e) => {
                const val = parseFloat(e.target.value);
                if (!isNaN(val)) {
                  onUpdateRpe(exerciseId, Math.min(10, Math.max(1, val)));
                }
              }}
              className="w-12 bg-transparent text-center font-['Montserrat'] font-bold text-xs text-[#ffffff] focus:outline-none"
            />
            <button
              onClick={() =>
                onUpdateRpe(
                  exerciseId,
                  Math.min(10.0, parseFloat((actualRpe + 0.5).toFixed(1)))
                )
              }
              className="w-6 h-6 rounded bg-[#222a3d] hover:bg-[#2d3449] text-[#dae2fd] hover:text-[#c3f400] font-bold text-xs flex items-center justify-center transition-colors cursor-pointer"
              title="Aumentar RPE en 0.5"
            >
              +
            </button>
          </div>

          {/* Quick preset chips */}
          <div className="hidden sm:flex items-center gap-1">
            {rpeOptions.map((opt) => {
              const isSelected = Math.abs(actualRpe - opt) < 0.1;
              return (
                <button
                  key={opt}
                  onClick={() => onUpdateRpe(exerciseId, opt)}
                  className={`px-2 py-1 rounded text-[10px] font-['Montserrat'] font-bold transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-[#c3f400] text-[#161e00] shadow-sm'
                      : 'bg-[#171f33] text-[#8e9379] hover:text-[#ffffff] border border-[#444933]/40'
                  }`}
                >
                  {opt}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export const WorkoutScreen: React.FC<WorkoutScreenProps> = ({
  exercises,
  onToggleSet,
  onUpdateWeight,
  onOpenTechniqueModal,
  onFinishWorkout,
  onUpdateExerciseRpe,
  restTimerSeconds,
  isTimerRunning,
  onToggleTimer,
  onAdd30s,
  onSkipTimer,
  isWorkoutActive,
  onStartSession,
}) => {
  const [selectedDay, setSelectedDay] = useState<WeekDayId>('LUN');
  const [warmupCompleted, setWarmupCompleted] = useState<boolean>(false);
  const [selectedRpe, setSelectedRpe] = useState<number>(8);
  const [sessionNotes, setSessionNotes] = useState<string>('Excelente agarre con 24kg, codos sin molestias...');
  const [showSaveAlert, setShowSaveAlert] = useState<boolean>(false);

  // Calculate dynamic progress
  const totalSets = exercises.reduce((acc, ex) => acc + ex.sets.length, 0);
  const completedSets = exercises.reduce(
    (acc, ex) => acc + ex.sets.filter((s) => s.completed).length,
    0
  );
  const completedExercises = exercises.filter(
    (ex) => ex.sets.length > 0 && ex.sets.every((s) => s.completed)
  ).length;
  const progressPercent = totalSets > 0 ? Math.round((completedSets / totalSets) * 100) : 0;

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins < 10 ? '0' : ''}${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const handleSaveSession = () => {
    onFinishWorkout(selectedRpe, sessionNotes);
    setShowSaveAlert(true);
    setTimeout(() => setShowSaveAlert(false), 3500);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Toast alert on save */}
      {showSaveAlert && (
        <div className="fixed top-20 right-6 z-50 bg-[#171f33] border-2 border-[#c3f400] text-[#ffffff] px-5 py-3 rounded-xl shadow-2xl flex items-center gap-3 animate-in slide-in-from-top-4">
          <span className="material-symbols-outlined text-[#c3f400]">check_circle</span>
          <div>
            <div className="font-bold text-xs">¡Sesión Guardada con Éxito!</div>
            <div className="text-[11px] text-[#c4c9ac]">
              Registrado RPE {selectedRpe} y {completedSets} series en tu Historial.
            </div>
          </div>
        </div>
      )}

      {/* HERO SECTION: Plan Semanal & Selector de Días */}
      <section className="space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 border-b border-[#444933]/40 pb-6">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="font-['Inter'] text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-[#c3f400]/15 text-[#c3f400] border border-[#c3f400]/30 tracking-wider uppercase">
                SESIÓN DIARIA DE ALTO RENDIMIENTO
              </span>
              <span className="font-['Inter'] text-[11px] font-semibold text-[#c4c9ac] tracking-wide">
                BANCO AJUSTABLE + MANCUERNAS
              </span>
            </div>
            <h1 className="font-['Montserrat'] font-extrabold text-3xl sm:text-5xl lg:text-6xl text-[#ffffff] tracking-tight leading-tight">
              POTENCIA & CONTROL
            </h1>
            <p className="font-['Inter'] text-sm sm:text-base text-[#c4c9ac] max-w-2xl mt-1 leading-relaxed">
              Rutina concentrada de 35 a 40 minutos con sobrecarga progresiva calibrada. Cero distracciones, ejecución biomecánica impecable.
            </p>
          </div>

          {/* Quick Live Stat Metric Card */}
          <div className="flex items-center gap-4 bg-[#131b2e] border border-[#444933]/60 rounded-xl p-4 self-start lg:self-auto min-w-[240px]">
            <div>
              <div className="text-[10px] font-bold tracking-wider text-[#8e9379] uppercase">
                ESTADO DE HOY
              </div>
              <div className="font-['Montserrat'] font-bold text-xl text-[#c3f400]">
                {selectedDay === 'LUN' ? 'LUNES ACTIVO' : `${selectedDay} PROGRAMADO`}
              </div>
              <div className="text-xs text-[#c4c9ac]">Pecho & Tríceps • 38 min</div>
            </div>
            <div className="w-12 h-12 rounded-lg bg-[#222a3d] border border-[#444933] flex items-center justify-center text-[#c3f400] flex-shrink-0">
              <span className="material-symbols-outlined text-2xl">fitness_center</span>
            </div>
          </div>
        </div>

        {/* Weekly Selector Rail */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2.5 overflow-x-auto pb-1 custom-scrollbar">
          {WEEK_PLANS.map((day) => {
            const isSelected = selectedDay === day.id;
            return (
              <button
                key={day.id}
                onClick={() => setSelectedDay(day.id)}
                className={`text-left p-4 rounded-xl flex flex-col justify-between h-36 transition-all cursor-pointer relative ${
                  isSelected
                    ? 'bg-[#222a3d] border-2 border-[#c3f400] shadow-[0_0_20px_-4px_rgba(195,244,0,0.35)] scale-[1.01]'
                    : day.isRest
                    ? 'bg-[#060e20] border border-[#444933]/30 opacity-70 hover:opacity-100 hover:border-[#444933]'
                    : 'bg-[#171f33] border border-[#444933]/40 hover:border-[#8e9379]'
                }`}
              >
                <div className="flex items-center justify-between w-full">
                  <span
                    className={`font-['Inter'] text-xs font-bold ${
                      isSelected ? 'text-[#c3f400]' : 'text-[#c4c9ac]'
                    }`}
                  >
                    {day.id}
                  </span>
                  {day.isToday && (
                    <span className="w-2 h-2 rounded-full bg-[#c3f400] animate-ping" />
                  )}
                  {day.isRest && (
                    <span className="material-symbols-outlined text-xs text-[#8e9379]">
                      bedtime
                    </span>
                  )}
                </div>

                <div>
                  <div className="font-['Montserrat'] font-bold text-sm text-[#ffffff] leading-tight line-clamp-1">
                    {day.focus}
                  </div>
                  <div
                    className={`text-[11px] font-semibold mt-1 ${
                      isSelected ? 'text-[#c3f400]' : 'text-[#8e9379]'
                    }`}
                  >
                    {day.subtitle}
                  </div>
                </div>

                <div className="text-[10px] text-[#9cf0ff] font-semibold">
                  {day.exerciseCount > 0 ? `${day.exerciseCount} Ejercicios` : 'Recuperación'}
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* WORKOUT CONTROL HUB & PROGRESSION HEADER */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Main Status Card (8 cols) */}
        <div className="lg:col-span-8 bg-[#171f33] border border-[#444933]/60 rounded-xl p-5 sm:p-6 relative overflow-hidden flex flex-col justify-between">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#444933]/40">
            <div>
              <div className="flex items-center gap-1.5 text-xs font-['Inter'] font-bold text-[#c3f400] mb-1">
                <span className="material-symbols-outlined text-base">fitness_center</span>
                <span>SESIÓN EN CURSO • PROTOCOLO HIPERTROFIA RÁPIDA</span>
              </div>
              <h2 className="font-['Montserrat'] font-bold text-xl sm:text-2xl text-[#ffffff]">
                Pecho Dominante & Tríceps Asistido
              </h2>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <div className="text-[10px] uppercase font-bold text-[#8e9379]">DURACIÓN ESTIMADA</div>
                <div className="font-['Montserrat'] font-extrabold text-2xl text-[#c3f400]">
                  38 <span className="text-xs font-normal text-[#c4c9ac]">min</span>
                </div>
              </div>
              <div className="h-8 w-[1px] bg-[#444933]" />
              <div className="text-right">
                <div className="text-[10px] uppercase font-bold text-[#8e9379]">EQUIPAMIENTO</div>
                <div className="font-['Montserrat'] font-bold text-sm text-[#ffffff]">
                  Mancuernas + Banco
                </div>
              </div>
            </div>
          </div>

          {/* Progress Tracker Bar */}
          <div className="mt-4">
            <div className="flex justify-between items-center mb-1.5 text-xs">
              <span className="font-['Inter'] font-semibold text-[#ffffff]">
                Progreso de la sesión:{' '}
                <span className="text-[#c3f400] font-bold">
                  {completedExercises} de {exercises.length} completados ({completedSets}/{totalSets} series)
                </span>
              </span>
              <span className="font-['Montserrat'] font-bold text-[#c3f400]">
                {progressPercent}% Completado
              </span>
            </div>
            <div className="w-full h-3 bg-[#060e20] rounded-full overflow-hidden p-0.5 border border-[#444933]/50">
              <div
                className="bg-[#c3f400] h-full rounded-full transition-all duration-300 ease-out shadow-[0_0_12px_rgba(195,244,0,0.6)]"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {/* Muscle Inset Badges */}
          <div className="flex flex-wrap items-center gap-1.5 mt-4 pt-1">
            <span className="px-2.5 py-1 rounded bg-[#9cf0ff]/10 text-[#9cf0ff] border border-[#9cf0ff]/30 text-[10px] font-bold uppercase">
              PECTORAL MAYOR
            </span>
            <span className="px-2.5 py-1 rounded bg-[#9cf0ff]/10 text-[#9cf0ff] border border-[#9cf0ff]/30 text-[10px] font-bold uppercase">
              FASCÍCULO CLAVICULAR
            </span>
            <span className="px-2.5 py-1 rounded bg-[#c3f400]/10 text-[#c3f400] border border-[#c3f400]/30 text-[10px] font-bold uppercase">
              TRÍCEPS BRAQUIAL
            </span>
            <span className="px-2.5 py-1 rounded bg-[#222a3d] text-[#c4c9ac] border border-[#444933]/40 text-[10px] font-medium uppercase">
              BANCO: PLANO & 30°
            </span>
          </div>
        </div>

        {/* Quick Session Timer Dock (4 cols) */}
        <div className="lg:col-span-4 bg-[#222a3d] border border-[#444933] rounded-xl p-5 flex flex-col justify-between shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-xs font-['Inter'] font-bold text-[#ff5708] flex items-center gap-1.5">
              <span className="material-symbols-outlined text-base animate-pulse">timer</span>
              CRONÓMETRO DE RECUPERACIÓN
            </span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#060e20] text-[#ffb59c] border border-[#ff5708]/40">
              60s INTERVALO
            </span>
          </div>

          <div className="my-3 text-center">
            <div className="font-['Montserrat'] font-extrabold text-5xl sm:text-6xl text-[#ff5708] tracking-tighter tabular-nums">
              {formatTimer(restTimerSeconds)}
            </div>
            <div className="text-xs text-[#c4c9ac] mt-1">
              Descanso sugerido entre series de fuerza
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onToggleTimer}
              className={`flex-1 py-2 font-['Inter'] font-bold text-xs rounded-lg transition-transform active:scale-95 flex items-center justify-center gap-1 cursor-pointer ${
                isTimerRunning
                  ? 'bg-[#ff5708] text-[#ffffff] hover:bg-[#ff5708]/90'
                  : 'bg-[#c3f400] text-[#161e00] hover:bg-[#abd600]'
              }`}
            >
              <span className="material-symbols-outlined text-sm">
                {isTimerRunning ? 'pause' : 'play_arrow'}
              </span>
              <span>{isTimerRunning ? 'Pausar' : 'Reanudar'}</span>
            </button>
            <button
              onClick={onAdd30s}
              className="px-3.5 py-2 bg-[#171f33] border border-[#444933] hover:border-[#8e9379] text-[#dae2fd] text-xs font-bold rounded-lg transition-colors cursor-pointer"
            >
              +30s
            </button>
            <button
              onClick={onSkipTimer}
              className="px-3.5 py-2 bg-[#171f33] border border-[#444933] hover:border-[#8e9379] text-[#dae2fd] text-xs font-bold rounded-lg transition-colors cursor-pointer"
            >
              Saltar
            </button>
          </div>
        </div>
      </div>

      {/* MAIN TWO-COLUMN WORKOUT WORKSPACE */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* EXERCISES LIST (8 Columns) */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <h2 className="font-['Montserrat'] font-bold text-xl text-[#ffffff] flex items-center gap-2">
              <span>Ejercicios Programados</span>
              <span className="text-[11px] font-bold px-2.5 py-0.5 bg-[#171f33] text-[#c3f400] border border-[#c3f400]/30 rounded-full">
                5 BLOQUES
              </span>
            </h2>
            <button
              onClick={onAdd30s}
              className="text-xs font-['Inter'] font-bold text-[#c3f400] hover:underline flex items-center gap-1 cursor-pointer"
            >
              <span className="material-symbols-outlined text-sm">timer</span>
              Ajustar Descansos
            </button>
          </div>

          {/* EJERCICIO 1: Press de Banca Plano con Mancuernas */}
          {exercises[0] && (
            <article className="bg-[#171f33] border border-[#444933]/60 rounded-xl overflow-hidden transition-all duration-200 hover:border-[#8e9379]">
              <div className="p-5 flex flex-col gap-4">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                  <div className="flex items-start gap-3.5">
                    <div className="w-9 h-9 rounded-lg bg-[#c3f400] text-[#161e00] flex items-center justify-center font-['Montserrat'] font-extrabold text-base flex-shrink-0 shadow-md">
                      1
                    </div>
                    <div>
                      <div className="flex flex-wrap items-center gap-1.5 mb-1">
                        <span className="px-2 py-0.5 rounded bg-[#9cf0ff]/10 border border-[#9cf0ff]/30 text-[#9cf0ff] text-[10px] font-bold uppercase">
                          {exercises[0].targetMuscle}
                        </span>
                        <span className="px-2 py-0.5 rounded bg-[#222a3d] border border-[#444933]/40 text-[#c4c9ac] text-[10px] font-semibold">
                          {exercises[0].benchAngle}
                        </span>
                        <span className="px-2 py-0.5 rounded bg-[#222a3d] border border-[#444933]/40 text-[#c3f400] text-[10px] font-bold">
                          {exercises[0].tempo}
                        </span>
                      </div>
                      <h3 className="font-['Montserrat'] font-bold text-lg text-[#ffffff]">
                        {exercises[0].name}
                      </h3>
                      <p className="text-xs text-[#c4c9ac] mt-0.5">{exercises[0].objective}</p>
                    </div>
                  </div>

                  <button
                    onClick={() =>
                      onOpenTechniqueModal(
                        exercises[0].name,
                        exercises[0].targetMuscle,
                        exercises[0].tempo,
                        exercises[0].imageUrl
                      )
                    }
                    className="px-3 py-1.5 bg-[#222a3d] hover:border-[#9cf0ff] border border-[#444933] rounded-lg text-xs font-bold text-[#dae2fd] flex items-center gap-1.5 transition-colors self-start cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[#9cf0ff] text-base">
                      fitness_center
                    </span>
                    <span>Ver Técnica</span>
                  </button>
                </div>

                {/* Technique banner */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-4 bg-[#131b2e] rounded-xl p-4 border border-[#444933]/40">
                  <div className="md:col-span-4 h-32 rounded-lg overflow-hidden relative border border-[#444933]/50">
                    <img
                      src={exercises[0].imageUrl}
                      alt={exercises[0].name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute bottom-1 right-1 bg-[#060e20]/90 px-1.5 py-0.5 rounded text-[10px] text-[#c3f400] font-bold">
                      {exercises[0].angleBadge}
                    </div>
                  </div>
                  <div className="md:col-span-8 flex flex-col justify-between">
                    <div>
                      <div className="text-[11px] font-['Inter'] font-bold text-[#c3f400] uppercase tracking-wider mb-1 flex items-center gap-1">
                        <span className="material-symbols-outlined text-sm">fitness_center</span>
                        PUNTOS BIOMECÁNICOS CLAVE
                      </div>
                      <ul className="text-xs text-[#c4c9ac] space-y-1">
                        {exercises[0].biomechanicPoints?.map((pt, i) => (
                          <li key={i} className="flex items-start gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#c3f400] mt-1.5 flex-shrink-0" />
                            <span>{pt}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="flex items-center gap-4 text-xs text-[#c4c9ac] border-t border-[#444933]/30 pt-1.5 mt-2">
                      <span>
                        Carga sugerida: <strong className="text-[#ffffff]">{exercises[0].suggestedLoad}</strong>
                      </span>
                      <span>
                        RPE objetivo: <strong className="text-[#c3f400]">{exercises[0].targetRpe}</strong>
                      </span>
                    </div>
                  </div>
                </div>

                {/* Set Rows Table */}
                <div className="space-y-2">
                  <div className="grid grid-cols-12 text-[10px] font-bold uppercase tracking-wider text-[#8e9379] px-4 py-1">
                    <span className="col-span-2">SERIE</span>
                    <span className="col-span-4">PESO (POR MANCUERNA)</span>
                    <span className="col-span-3">REPETICIONES</span>
                    <span className="col-span-3 text-right">COMPLETADA</span>
                  </div>

                  {exercises[0].sets.map((set) => {
                    const isLive = set.isCurrent;
                    return (
                      <div
                        key={set.id}
                        className={`grid grid-cols-12 items-center px-4 py-2.5 rounded-lg border transition-all ${
                          set.completed
                            ? 'bg-[#131b2e] border-[#444933]/40'
                            : isLive
                            ? 'bg-[#222a3d] border-l-4 border-l-[#c3f400] border-[#c3f400]/60 shadow-[0_0_15px_rgba(195,244,0,0.15)]'
                            : 'bg-[#060e20]/60 border-[#444933]/30 opacity-75'
                        }`}
                      >
                        <span
                          className={`col-span-2 text-xs font-bold ${
                            isLive ? 'text-[#c3f400] flex items-center gap-1' : 'text-[#c4c9ac]'
                          }`}
                        >
                          {isLive && <span className="w-2 h-2 rounded-full bg-[#c3f400] animate-ping" />}
                          {set.label}
                        </span>

                        <div className="col-span-4 flex items-center gap-2">
                          {isLive ? (
                            <>
                              <button
                                onClick={() => onUpdateWeight(exercises[0].id, set.id, -2)}
                                className="w-7 h-7 bg-[#171f33] rounded border border-[#444933] text-[#dae2fd] hover:text-[#c3f400] font-bold flex items-center justify-center cursor-pointer"
                              >
                                -
                              </button>
                              <span className="font-['Montserrat'] font-bold text-lg text-[#c3f400]">
                                {set.weight.toFixed(1)}
                              </span>
                              <button
                                onClick={() => onUpdateWeight(exercises[0].id, set.id, 2)}
                                className="w-7 h-7 bg-[#171f33] rounded border border-[#444933] text-[#dae2fd] hover:text-[#c3f400] font-bold flex items-center justify-center cursor-pointer"
                              >
                                +
                              </button>
                            </>
                          ) : (
                            <div className="text-sm font-bold text-[#ffffff]">
                              {set.weight.toFixed(1)} <span className="text-xs font-normal text-[#c4c9ac]">kg</span>
                            </div>
                          )}
                        </div>

                        <span className="col-span-3 text-xs font-semibold text-[#ffffff]">
                          {set.reps} reps
                        </span>

                        <div className="col-span-3 flex justify-end">
                          <button
                            onClick={() => onToggleSet(exercises[0].id, set.id)}
                            className={`w-7 h-7 rounded-md flex items-center justify-center transition-all cursor-pointer ${
                              set.completed
                                ? 'bg-[#c3f400] text-[#161e00] font-bold'
                                : isLive
                                ? 'border-2 border-[#c3f400] hover:bg-[#c3f400]/20 text-transparent hover:text-[#c3f400]'
                                : 'border border-[#444933] hover:border-[#8e9379]'
                            }`}
                          >
                            <span className="material-symbols-outlined text-base">
                              {set.completed ? 'check' : 'check'}
                            </span>
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Per-Exercise RPE Tracker */}
                <ExerciseRpeTracker
                  exerciseId={exercises[0].id}
                  targetRpe={exercises[0].targetRpe}
                  actualRpe={exercises[0].actualRpe}
                  onUpdateRpe={onUpdateExerciseRpe}
                />
              </div>
            </article>
          )}

          {/* EJERCICIO 2: Press Inclinado con Mancuernas */}
          {exercises[1] && (
            <article className="bg-[#171f33] border border-[#444933]/60 rounded-xl overflow-hidden transition-all duration-200 hover:border-[#8e9379]">
              <div className="p-5 flex flex-col gap-4">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                  <div className="flex items-start gap-3.5">
                    <div className="w-9 h-9 rounded-lg bg-[#222a3d] border border-[#444933] text-[#c3f400] flex items-center justify-center font-['Montserrat'] font-extrabold text-base flex-shrink-0">
                      2
                    </div>
                    <div>
                      <div className="flex flex-wrap items-center gap-1.5 mb-1">
                        <span className="px-2 py-0.5 rounded bg-[#9cf0ff]/10 border border-[#9cf0ff]/30 text-[#9cf0ff] text-[10px] font-bold uppercase">
                          {exercises[1].targetMuscle}
                        </span>
                        <span className="px-2 py-0.5 rounded bg-[#222a3d] border border-[#444933]/40 text-[#c4c9ac] text-[10px] font-semibold">
                          {exercises[1].benchAngle}
                        </span>
                        <span className="px-2 py-0.5 rounded bg-[#222a3d] border border-[#444933]/40 text-[#c4c9ac] text-[10px] font-semibold">
                          {exercises[1].tempo}
                        </span>
                      </div>
                      <h3 className="font-['Montserrat'] font-bold text-lg text-[#ffffff]">
                        {exercises[1].name}
                      </h3>
                      <p className="text-xs text-[#c4c9ac] mt-0.5">{exercises[1].objective}</p>
                    </div>
                  </div>

                  <button
                    onClick={() =>
                      onOpenTechniqueModal(
                        exercises[1].name,
                        exercises[1].targetMuscle,
                        exercises[1].tempo,
                        exercises[1].imageUrl
                      )
                    }
                    className="px-3 py-1.5 bg-[#222a3d] hover:border-[#9cf0ff] border border-[#444933] rounded-lg text-xs font-bold text-[#dae2fd] flex items-center gap-1.5 transition-colors self-start cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[#9cf0ff] text-base">
                      fitness_center
                    </span>
                    <span>Ver Técnica</span>
                  </button>
                </div>

                {/* Visual Banner */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-4 bg-[#131b2e] rounded-xl p-4 border border-[#444933]/40">
                  <div className="md:col-span-4 h-28 rounded-lg overflow-hidden relative border border-[#444933]/50">
                    <img
                      src={exercises[1].imageUrl}
                      alt={exercises[1].name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute bottom-1 right-1 bg-[#060e20]/90 px-1.5 py-0.5 rounded text-[10px] text-[#9cf0ff] font-bold">
                      {exercises[1].angleBadge}
                    </div>
                  </div>
                  <div className="md:col-span-8 flex flex-col justify-center">
                    <div className="text-[10px] font-bold text-[#9cf0ff] uppercase tracking-wider mb-1">
                      ALINEACIÓN DEL BANCO
                    </div>
                    <p className="text-xs text-[#c4c9ac] leading-relaxed">
                      {exercises[1].coachTip}
                    </p>
                    <div className="flex items-center gap-3 mt-2 text-xs text-[#c3f400]">
                      <span className="flex items-center gap-1">
                        <span className="material-symbols-outlined text-sm">timer</span> 60s entre series
                      </span>
                      <span>• Carga recomendada: {exercises[1].suggestedLoad}</span>
                    </div>
                  </div>
                </div>

                {/* Compact Set Controls */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {exercises[1].sets.map((set) => (
                    <div
                      key={set.id}
                      onClick={() => onToggleSet(exercises[1].id, set.id)}
                      className={`p-3 rounded-lg border flex items-center justify-between cursor-pointer transition-all ${
                        set.completed
                          ? 'bg-[#131b2e] border-[#c3f400]/60'
                          : 'bg-[#131b2e]/60 border-[#444933]/40 hover:border-[#8e9379]'
                      }`}
                    >
                      <div>
                        <div className="text-[10px] text-[#8e9379] font-bold uppercase">{set.label}</div>
                        <div className="font-['Montserrat'] font-bold text-base text-[#ffffff]">
                          {set.weight} kg x {set.reps}
                        </div>
                      </div>
                      <div
                        className={`w-6 h-6 rounded flex items-center justify-center ${
                          set.completed
                            ? 'bg-[#c3f400] text-[#161e00]'
                            : 'border border-[#444933]'
                        }`}
                      >
                        {set.completed && (
                          <span className="material-symbols-outlined text-sm font-bold">check</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Per-Exercise RPE Tracker */}
                <ExerciseRpeTracker
                  exerciseId={exercises[1].id}
                  targetRpe={exercises[1].targetRpe}
                  actualRpe={exercises[1].actualRpe}
                  onUpdateRpe={onUpdateExerciseRpe}
                />
              </div>
            </article>
          )}

          {/* EJERCICIOS 3, 4, 5: Extensiones, Fondos y Crunch */}
          {exercises.slice(2).map((ex) => (
            <article
              key={ex.id}
              className="bg-[#171f33] border border-[#444933]/60 rounded-xl overflow-hidden transition-all duration-200 hover:border-[#8e9379]"
            >
              <div className="p-5 flex flex-col gap-3.5">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                  <div className="flex items-start gap-3.5">
                    <div className="w-9 h-9 rounded-lg bg-[#222a3d] border border-[#444933] text-[#c3f400] flex items-center justify-center font-['Montserrat'] font-extrabold text-base flex-shrink-0">
                      {ex.id}
                    </div>
                    <div>
                      <div className="flex flex-wrap items-center gap-1.5 mb-1">
                        <span className="px-2 py-0.5 rounded bg-[#c3f400]/10 border border-[#c3f400]/30 text-[#c3f400] text-[10px] font-bold uppercase">
                          {ex.targetMuscle}
                        </span>
                        <span className="px-2 py-0.5 rounded bg-[#222a3d] border border-[#444933]/40 text-[#c4c9ac] text-[10px] font-semibold">
                          {ex.benchAngle}
                        </span>
                      </div>
                      <h3 className="font-['Montserrat'] font-bold text-base sm:text-lg text-[#ffffff]">
                        {ex.name}
                      </h3>
                      <p className="text-xs text-[#c4c9ac] mt-0.5">{ex.objective}</p>
                    </div>
                  </div>

                  <button
                    onClick={() =>
                      onOpenTechniqueModal(ex.name, ex.targetMuscle, ex.tempo, ex.imageUrl)
                    }
                    className="px-3 py-1.5 bg-[#222a3d] hover:border-[#9cf0ff] border border-[#444933] rounded-lg text-xs font-bold text-[#dae2fd] flex items-center gap-1.5 transition-colors self-start cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[#9cf0ff] text-base">
                      fitness_center
                    </span>
                    <span>Guía</span>
                  </button>
                </div>

                {ex.coachTip && (
                  <div className="flex items-center gap-2 bg-[#060e20] p-2.5 rounded-lg border border-[#444933]/30 text-xs text-[#c4c9ac]">
                    <span className="material-symbols-outlined text-[#c3f400] text-sm">lightbulb</span>
                    <span>
                      <strong className="text-[#ffffff]">Clave de aislamiento:</strong> {ex.coachTip}
                    </span>
                  </div>
                )}

                {/* Set Row Compact */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#131b2e] p-3.5 rounded-lg border border-[#444933]/40">
                  <div className="flex items-center gap-6">
                    <div>
                      <span className="text-[10px] font-bold uppercase text-[#8e9379]">SERIES</span>
                      <div className="text-xs font-bold text-[#ffffff]">
                        {ex.sets.length} x {ex.sets[0]?.reps || 12} reps
                      </div>
                    </div>
                    <div>
                      <span className="text-[10px] font-bold uppercase text-[#8e9379]">SOBRECARGA</span>
                      <div className="text-xs font-bold text-[#c3f400]">{ex.suggestedLoad}</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-xs text-[#8e9379]">
                      {ex.sets.filter((s) => s.completed).length} / {ex.sets.length} Listas
                    </span>
                    <button
                      onClick={() => {
                        // Complete next incomplete set or reset all
                        const nextIncomplete = ex.sets.find((s) => !s.completed);
                        if (nextIncomplete) {
                          onToggleSet(ex.id, nextIncomplete.id);
                        } else {
                          ex.sets.forEach((s) => onToggleSet(ex.id, s.id));
                        }
                      }}
                      className="px-3.5 py-1.5 bg-[#222a3d] border border-[#444933] hover:border-[#c3f400] rounded-md text-xs font-bold text-[#dae2fd] hover:text-[#c3f400] transition-colors cursor-pointer"
                    >
                      {ex.sets.every((s) => s.completed) ? 'Reiniciar' : 'Marcar Serie'}
                    </button>
                  </div>
                </div>

                {/* Per-Exercise RPE Tracker */}
                <ExerciseRpeTracker
                  exerciseId={ex.id}
                  targetRpe={ex.targetRpe}
                  actualRpe={ex.actualRpe}
                  onUpdateRpe={onUpdateExerciseRpe}
                />
              </div>
            </article>
          ))}
        </div>

        {/* TACTICAL SIDEBAR (4 Columns) */}
        <aside className="lg:col-span-4 flex flex-col gap-6">
          {/* Calentamiento Express (5 min) */}
          <div className="bg-[#171f33] border border-[#444933]/60 rounded-xl p-5 relative overflow-hidden shadow-md">
            <div className="flex items-center gap-2 mb-2">
              <span className="material-symbols-outlined text-[#ff5708]">timer</span>
              <h3 className="font-['Montserrat'] font-bold text-base text-[#ffffff]">
                Calentamiento Express (5 min)
              </h3>
            </div>
            <p className="text-xs text-[#c4c9ac] mb-3 leading-relaxed">
              Optimiza la lubricación sinovial de los manguitos rotadores y codos antes de cargar peso pesado en el banco.
            </p>

            <div className="space-y-2.5">
              <div className="flex items-start gap-2.5 p-2.5 bg-[#131b2e] rounded-lg border border-[#444933]/40">
                <span className="w-5 h-5 rounded-full bg-[#222a3d] text-[#c3f400] flex items-center justify-center text-[10px] font-bold flex-shrink-0 mt-0.5">
                  1
                </span>
                <div>
                  <div className="font-bold text-xs text-[#ffffff]">Rotaciones de Hombros y Círculos</div>
                  <div className="text-[11px] text-[#c4c9ac]">60 segundos dinámicos adelante y atrás.</div>
                </div>
              </div>

              <div className="flex items-start gap-2.5 p-2.5 bg-[#131b2e] rounded-lg border border-[#444933]/40">
                <span className="w-5 h-5 rounded-full bg-[#222a3d] text-[#c3f400] flex items-center justify-center text-[10px] font-bold flex-shrink-0 mt-0.5">
                  2
                </span>
                <div>
                  <div className="font-bold text-xs text-[#ffffff]">Rotación Externa c/ Mancuerna Ligera (2-4kg)</div>
                  <div className="text-[11px] text-[#c4c9ac]">2 series x 15 reps acostado lateral en banco.</div>
                </div>
              </div>

              <div className="flex items-start gap-2.5 p-2.5 bg-[#131b2e] rounded-lg border border-[#444933]/40">
                <span className="w-5 h-5 rounded-full bg-[#222a3d] text-[#c3f400] flex items-center justify-center text-[10px] font-bold flex-shrink-0 mt-0.5">
                  3
                </span>
                <div>
                  <div className="font-bold text-xs text-[#ffffff]">Flexiones Apoyado en Banco Inclinado</div>
                  <div className="text-[11px] text-[#c4c9ac]">15 reps de activación neuromuscular sin llegar al fallo.</div>
                </div>
              </div>
            </div>

            <button
              onClick={() => setWarmupCompleted(!warmupCompleted)}
              className={`w-full mt-4 py-2 font-['Inter'] font-bold text-xs rounded-lg transition-all text-center cursor-pointer ${
                warmupCompleted
                  ? 'bg-[#c3f400]/20 text-[#c3f400] border border-[#c3f400]'
                  : 'bg-[#222a3d] hover:bg-[#2d3449] text-[#c3f400] border border-[#c3f400]/30'
              }`}
            >
              {warmupCompleted ? 'Calentamiento Listo ✓' : 'Marcar Calentamiento Listo ✓'}
            </button>
          </div>

          {/* Monitor de Fatiga & RPE */}
          <div className="bg-[#171f33] border border-[#444933]/60 rounded-xl p-5 shadow-md">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-['Montserrat'] font-bold text-base text-[#ffffff]">
                Monitor de Fatiga & RPE
              </h3>
              <span className="text-[10px] font-bold text-[#ffb59c] bg-[#ff5708]/15 px-2 py-0.5 rounded border border-[#ff5708]/30">
                LIVE LOG
              </span>
            </div>
            <p className="text-xs text-[#c4c9ac] mb-3 leading-relaxed">
              Indica tu esfuerzo percibido para calibrar las cargas de la próxima sesión de pecho.
            </p>

            {/* RPE Gauge Dial Selector */}
            <div className="grid grid-cols-5 gap-1.5 mb-4 text-center">
              {[
                { rpe: 6, label: 'Fácil' },
                { rpe: 7, label: '3 RIR' },
                { rpe: 8, label: '2 RIR' },
                { rpe: 9, label: '1 RIR' },
                { rpe: 10, label: 'Fallo' },
              ].map((item) => {
                const isSelected = selectedRpe === item.rpe;
                return (
                  <button
                    key={item.rpe}
                    onClick={() => setSelectedRpe(item.rpe)}
                    className={`p-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-[#222a3d] border-2 border-[#c3f400] text-[#c3f400] shadow-[0_0_10px_rgba(195,244,0,0.25)]'
                        : 'bg-[#131b2e] border border-[#444933]/40 hover:border-[#8e9379] text-[#dae2fd]'
                    }`}
                  >
                    {item.rpe}
                    <span className="block text-[9px] font-normal text-[#8e9379] mt-0.5">
                      {item.label}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Per-exercise RPE breakdown overview */}
            <div className="mb-3.5 p-2.5 bg-[#131b2e] rounded-lg border border-[#444933]/40 space-y-1.5">
              <div className="flex items-center justify-between text-[11px] font-bold text-[#c4c9ac]">
                <span>RPE por Movimiento:</span>
                <span className="text-[#c3f400] font-mono">
                  Promedio: {(exercises.reduce((a, b) => a + (b.actualRpe || b.targetRpe || 8), 0) / exercises.length).toFixed(1)}
                </span>
              </div>
              <div className="space-y-1">
                {exercises.map((ex) => (
                  <div key={ex.id} className="flex items-center justify-between text-[11px]">
                    <span className="text-[#8e9379] truncate max-w-[190px]">
                      {ex.id}. {ex.name}
                    </span>
                    <span className="font-mono font-bold text-[#c3f400] bg-[#222a3d] px-1.5 py-0.5 rounded border border-[#444933]/40">
                      RPE {(ex.actualRpe ?? ex.targetRpe ?? 8.0).toFixed(1)}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick notes field */}
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-[#c4c9ac]">
                Sensación articular y bombeo
              </label>
              <textarea
                value={sessionNotes}
                onChange={(e) => setSessionNotes(e.target.value)}
                className="w-full bg-[#060e20] border border-[#444933]/60 rounded-lg p-3 text-xs text-[#ffffff] placeholder-[#8e9379] focus:border-[#c3f400] focus:outline-none resize-none"
                rows={2}
                placeholder="Ej. Excelente agarre con 24kg, codos sin molestias..."
              />
            </div>

            <button
              onClick={handleSaveSession}
              className="w-full mt-4 py-2.5 bg-[#c3f400] hover:bg-[#abd600] text-[#161e00] font-['Inter'] font-bold text-xs uppercase tracking-wider rounded-lg transition-transform active:scale-[0.98] shadow-md cursor-pointer"
            >
              Guardar & Finalizar Sesión
            </button>
          </div>

          {/* Banner: Banco Ajustable Configuración Tips */}
          <div className="bg-[#131b2e] border border-[#444933]/40 rounded-xl p-4 flex items-start gap-3">
            <span className="material-symbols-outlined text-[#9cf0ff] text-2xl flex-shrink-0 mt-0.5">
              fitness_center
            </span>
            <div>
              <div className="font-bold text-xs text-[#ffffff]">Mancuernas & Banco: Máxima Eficiencia</div>
              <p className="text-[11px] text-[#c4c9ac] mt-0.5 leading-relaxed">
                Al terminar la serie 2, ajusta la clavija del banco a 30° sin perder tiempo para mantener la densidad del entrenamiento bajo los 40 minutos.
              </p>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};
