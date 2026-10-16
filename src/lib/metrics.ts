import { SetRow, WeekDayId, WorkoutExercise, WeightHistoryPoint } from '../types';
import { DAY_TEMPLATES } from '../data/daySessions';

const WEEK_DAYS: WeekDayId[] = ['LUN', 'MAR', 'MIÉ', 'JUE', 'VIE', 'SÁB', 'DOM'];

export function currentWeekDayId(date = new Date()): WeekDayId {
  const name = date.toLocaleDateString('es-ES', { weekday: 'long' }).toLocaleLowerCase('es-ES');
  switch (name) {
    case 'lunes':
      return 'LUN';
    case 'martes':
      return 'MAR';
    case 'miércoles':
      return 'MIÉ';
    case 'jueves':
      return 'JUE';
    case 'viernes':
      return 'VIE';
    case 'sábado':
      return 'SÁB';
    case 'domingo':
      return 'DOM';
    default:
      return 'LUN';
  }
}

export function isWeekDayId(value: string): value is WeekDayId {
  return WEEK_DAYS.some((day) => day === value);
}

export function todayIsoDate(date = new Date()): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function yesterdayIsoDate(date = new Date()): string {
  const copy = new Date(date);
  copy.setDate(copy.getDate() - 1);
  return todayIsoDate(copy);
}

function repsAsNumber(reps: number | string): number {
  if (typeof reps === 'number' && Number.isFinite(reps)) return reps;
  if (typeof reps !== 'string') return 0;
  const parts = reps.split('-').map((part) => parseFloat(part.trim()));
  if (parts.length === 2 && parts.every((part) => Number.isFinite(part))) {
    return (parts[0] + parts[1]) / 2;
  }
  const single = parseFloat(reps);
  return Number.isFinite(single) ? single : 0;
}

export function setVolumeKg(exercise: WorkoutExercise, set: SetRow): number {
  if (!set.completed || set.weight <= 0) return 0;
  const reps = repsAsNumber(set.reps);
  if (reps <= 0) return 0;
  const sides = exercise.bilateral ? 2 : 1;
  return set.weight * sides * reps;
}

export function sessionVolumeKg(exercises: WorkoutExercise[]): number {
  return exercises.reduce(
    (total, exercise) =>
      total + exercise.sets.reduce((setTotal, set) => setTotal + setVolumeKg(exercise, set), 0),
    0
  );
}

export function completedSetCount(exercises: WorkoutExercise[]): number {
  return exercises.reduce(
    (total, exercise) => total + exercise.sets.filter((set) => set.completed).length,
    0
  );
}

export interface StreakState {
  count: number;
  lastWorkoutDate: string | null;
}

export function advanceStreak(current: StreakState, workoutDate = todayIsoDate()): StreakState {
  if (current.lastWorkoutDate === workoutDate) return current;
  if (current.lastWorkoutDate === null || current.lastWorkoutDate === yesterdayIsoDate()) {
    return { count: current.count + 1, lastWorkoutDate: workoutDate };
  }
  return { count: 1, lastWorkoutDate: workoutDate };
}

export function resetDayProgress(day: WeekDayId, current: WorkoutExercise[]): WorkoutExercise[] {
  const template = DAY_TEMPLATES[day];
  return template.map((exercise) => {
    const live = current.find((item) => item.id === exercise.id);
    const sets = exercise.sets.map((set) => {
      const liveSet = live?.sets.find((item) => item.id === set.id);
      return {
        ...set,
        weight: liveSet?.weight ?? set.weight,
        completed: false,
        isCurrent: false,
        isPending: false,
      };
    });
    if (sets[0]) sets[0] = { ...sets[0], isCurrent: true };
    return {
      ...exercise,
      actualRpe: live?.actualRpe ?? exercise.actualRpe,
      sets,
      completedCount: 0,
      isCompleted: false,
    };
  });
}

export function formatSigned(delta: number, digits = 1): string {
  const rounded = Number(delta.toFixed(digits));
  if (rounded > 0) return `+${rounded.toFixed(digits)}`;
  return rounded.toFixed(digits);
}

export function historyDelta(
  history: WeightHistoryPoint[],
  key: 'weight' | 'waist' | 'arm' | 'chest' | 'thigh' | 'forearm' | 'bodyFat',
  current: number
): { text: string; direction: 'up' | 'down' | 'flat' | 'none' } {
  const samples = history.filter((point) => typeof point[key] === 'number');
  if (samples.length < 2) {
    return { text: 'Primer registro', direction: 'none' };
  }
  const baseline = samples[0][key];
  if (typeof baseline !== 'number') {
    return { text: 'Primer registro', direction: 'none' };
  }
  const delta = current - baseline;
  if (Math.abs(delta) < 0.05) return { text: 'Sin cambio', direction: 'flat' };
  return {
    text: formatSigned(delta),
    direction: delta > 0 ? 'up' : 'down',
  };
}
