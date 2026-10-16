export type ActiveTab = 'rutinas' | 'tecnica' | 'progreso' | 'historial';

export type WeekDayId = 'LUN' | 'MAR' | 'MIÉ' | 'JUE' | 'VIE' | 'SÁB' | 'DOM';

export interface WeekDayPlan {
  id: WeekDayId;
  name: string;
  focus: string;
  duration: number;
  exerciseCount: number;
  subtitle: string;
  tagColor?: string;
  isToday?: boolean;
  isRest?: boolean;
}

export interface SetRow {
  id: string;
  label: string; // e.g. "S1 (Calent)", "S2 (Efectiva)", "S3 (Actual)"
  weight: number; // kg
  reps: number | string; // e.g. 12 or "10-12"
  completed: boolean;
  isCurrent?: boolean;
  isPending?: boolean;
}

export interface WorkoutExercise {
  id: number;
  name: string;
  targetMuscle: string;
  benchAngle: string;
  tempo: string;
  objective: string;
  imageUrl?: string;
  angleBadge?: string;
  biomechanicPoints?: string[];
  suggestedLoad?: string;
  targetRpe?: number;
  actualRpe?: number;
  coachTip?: string;
  notes?: string;
  sets: SetRow[];
  completedCount: number;
  totalSets: number;
  isCompleted?: boolean;
}

export interface AnthropometricData {
  peso: number; // kg
  grasaPct: number; // %
  cintura: number; // cm
  pecho: number; // cm
  biceps: number; // cm
  muslo: number; // cm
  antebrazo: number; // cm
  fechaUltimoPesaje: string;
}

export interface WeightHistoryPoint {
  week: string;
  label: string;
  weight: number;
  waist: number;
  arm: number;
  date?: string;
  day?: string;
}

export interface TechnicalExerciseItem {
  id: string;
  name: string;
  category: 'Pecho' | 'Bíceps' | 'Tríceps' | 'Antebrazo' | 'Piernas' | 'Abdomen';
  muscleCategory: string;
  benchAngle: string;
  benchAngleType: string;
  level: 'Iniciación' | 'Intermedio' | 'Avanzado' | 'Técnico';
  tempo: string;
  focusTag: string;
  imageUrl: string;
  step1Title: string;
  step1Desc: string;
  step2Title: string;
  step2Desc: string;
  commonMistakes: string;
  breathingTip: string;
  suggestedLoad: string;
  videoUrl?: string;
}

export interface MatrixRowItem {
  id: string;
  name: string;
  targetMuscle: string;
  benchIncline: string;
  suggestedLoad: string;
  tempo: string;
  technicalId?: string;
}

export interface CompletedWorkoutLog {
  id: string;
  date: string;
  dayName: string;
  title: string;
  durationMinutes: number;
  exercisesCompleted: number;
  totalExercises: number;
  totalVolumeKg: number;
  rpe: number;
  notes: string;
}
