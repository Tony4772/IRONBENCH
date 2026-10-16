import { cloneDayTemplates } from '../data/daySessions';
import {
  INITIAL_ANTHROPOMETRICS,
  INITIAL_LOGS,
  WEIGHT_HISTORY,
} from '../data/mockData';
import {
  AnthropometricData,
  CompletedWorkoutLog,
  WeekDayId,
  WeightHistoryPoint,
  WorkoutExercise,
} from '../types';
import { isWeekDayId, StreakState } from './metrics';

const STORAGE_KEY = 'ironbench_state_v1';
const LEGACY_KEYS = {
  exercises: 'ironbench_exercises',
  anthropometrics: 'ironbench_anthropometrics',
  history: 'ironbench_history',
  logs: 'ironbench_logs',
} as const;

export interface AppState {
  exercisesByDay: Record<WeekDayId, WorkoutExercise[]>;
  anthropometrics: AnthropometricData;
  weightHistory: WeightHistoryPoint[];
  workoutLogs: CompletedWorkoutLog[];
  streak: StreakState;
  restDays: WeekDayId[];
}

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function parseJson(raw: string | null): unknown {
  if (!raw) return null;
  try {
    return JSON.parse(raw) as unknown;
  } catch {
    return null;
  }
}

function asExercises(value: unknown): WorkoutExercise[] | null {
  if (!Array.isArray(value)) return null;
  const exercises = value.filter(
    (item): item is WorkoutExercise =>
      isObject(item) &&
      typeof item.id === 'number' &&
      typeof item.name === 'string' &&
      Array.isArray(item.sets)
  );
  return exercises.length === value.length ? exercises : null;
}

function asAnthropometrics(value: unknown): AnthropometricData | null {
  if (!isObject(value)) return null;
  const peso = value.peso;
  const grasaPct = value.grasaPct;
  const cintura = value.cintura;
  const pecho = value.pecho;
  const biceps = value.biceps;
  const muslo = value.muslo;
  const antebrazo = value.antebrazo;
  const fechaUltimoPesaje = value.fechaUltimoPesaje;
  if (
    typeof peso !== 'number' ||
    typeof grasaPct !== 'number' ||
    typeof cintura !== 'number' ||
    typeof pecho !== 'number' ||
    typeof biceps !== 'number' ||
    typeof muslo !== 'number' ||
    typeof antebrazo !== 'number' ||
    typeof fechaUltimoPesaje !== 'string'
  ) {
    return null;
  }
  return { peso, grasaPct, cintura, pecho, biceps, muslo, antebrazo, fechaUltimoPesaje };
}

function asHistory(value: unknown): WeightHistoryPoint[] | null {
  if (!Array.isArray(value) || value.length === 0) return null;
  const points = value.filter(
    (item): item is WeightHistoryPoint =>
      isObject(item) && typeof item.weight === 'number' && typeof item.waist === 'number'
  );
  return points.length === value.length ? points : null;
}

function asLogs(value: unknown): CompletedWorkoutLog[] | null {
  if (!Array.isArray(value)) return null;
  const logs = value.filter(
    (item): item is CompletedWorkoutLog =>
      isObject(item) && typeof item.id === 'string' && typeof item.title === 'string'
  );
  return logs.length === value.length ? logs : null;
}

function asRestDays(value: unknown): WeekDayId[] | null {
  if (!Array.isArray(value)) return null;
  const days = value.filter((item): item is WeekDayId => typeof item === 'string' && isWeekDayId(item));
  if (days.length !== value.length) return null;
  return [...new Set(days)];
}

function asStreak(value: unknown): StreakState | null {
  if (!isObject(value) || typeof value.count !== 'number') return null;
  const last = value.lastWorkoutDate;
  if (last !== null && typeof last !== 'string') return null;
  return { count: value.count, lastWorkoutDate: last ?? null };
}

function mergeTemplate(template: WorkoutExercise[], saved: WorkoutExercise[]): WorkoutExercise[] {
  return template.map((exercise) => {
    const previous = saved.find((item) => item.name === exercise.name);
    if (!previous) return exercise;
    return {
      ...exercise,
      actualRpe: typeof previous.actualRpe === 'number' ? previous.actualRpe : exercise.actualRpe,
      sets: exercise.sets.map((set, index) => {
        const old = previous.sets[index];
        if (!old || typeof old.weight !== 'number') return set;
        return { ...set, weight: old.weight, completed: old.completed === true };
      }),
    };
  });
}

function readLegacy(): Partial<AppState> {
  if (typeof localStorage === 'undefined') return {};
  const exercises = asExercises(parseJson(localStorage.getItem(LEGACY_KEYS.exercises)));
  const base = cloneDayTemplates();
  return {
    exercisesByDay: exercises ? { ...base, LUN: exercises } : undefined,
    anthropometrics: asAnthropometrics(parseJson(localStorage.getItem(LEGACY_KEYS.anthropometrics))) ?? undefined,
    weightHistory: asHistory(parseJson(localStorage.getItem(LEGACY_KEYS.history))) ?? undefined,
    workoutLogs: asLogs(parseJson(localStorage.getItem(LEGACY_KEYS.logs))) ?? undefined,
  };
}

export function defaultAppState(): AppState {
  return {
    exercisesByDay: cloneDayTemplates(),
    anthropometrics: INITIAL_ANTHROPOMETRICS,
    weightHistory: WEIGHT_HISTORY,
    workoutLogs: INITIAL_LOGS,
    streak: { count: 5, lastWorkoutDate: null },
    restDays: [],
  };
}

export function loadAppState(): AppState {
  const fallback = defaultAppState();
  if (typeof localStorage === 'undefined') return fallback;

  const saved = parseJson(localStorage.getItem(STORAGE_KEY));
  const legacy = readLegacy();
  const source = isObject(saved) && (saved.version === 1 || saved.version === 2 || saved.version === 3) ? saved : null;
  const exercisesByDay = { ...fallback.exercisesByDay };

  const savedDays = source && isObject(source.exercisesByDay) ? source.exercisesByDay : null;
  if (savedDays) {
    for (const [day, value] of Object.entries(savedDays)) {
      if (!isWeekDayId(day)) continue;
      const exercises = asExercises(value);
      if (exercises) exercisesByDay[day] = mergeTemplate(fallback.exercisesByDay[day], exercises);
    }
  }

  return {
    exercisesByDay,
    anthropometrics:
      (source && asAnthropometrics(source.anthropometrics)) ||
      legacy.anthropometrics ||
      fallback.anthropometrics,
    weightHistory:
      (source && asHistory(source.weightHistory)) || legacy.weightHistory || fallback.weightHistory,
    workoutLogs: (source && asLogs(source.workoutLogs)) || legacy.workoutLogs || fallback.workoutLogs,
    streak: (source && asStreak(source.streak)) || fallback.streak,
    restDays: (source && asRestDays(source.restDays)) || fallback.restDays,
  };
}

export function saveAppState(state: AppState): void {
  if (typeof localStorage === 'undefined') return;
  const payload = {
    version: 3 as const,
    exercisesByDay: state.exercisesByDay,
    anthropometrics: state.anthropometrics,
    weightHistory: state.weightHistory,
    workoutLogs: state.workoutLogs,
    streak: state.streak,
    restDays: state.restDays,
  };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
}
