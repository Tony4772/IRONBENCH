import React, { useEffect, useRef, useState } from 'react';
import { ActiveTab, AnthropometricData, CompletedWorkoutLog, WeekDayId } from './types';
import { WEEK_PLANS } from './data/mockData';
import { AppState, loadAppState, saveAppState } from './lib/storage';
import {
  advanceStreak,
  completedSetCount,
  currentWeekDayId,
  resetDayProgress,
  sessionVolumeKg,
  todayIsoDate,
} from './lib/metrics';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { WorkoutScreen } from './components/WorkoutScreen';
import { ProgressScreen } from './components/ProgressScreen';
import { TechniqueScreen } from './components/TechniqueScreen';
import { HistoryScreen } from './components/HistoryScreen';
import { OneRepMaxModal } from './components/OneRepMaxModal';
import { BenchGuideModal } from './components/BenchGuideModal';
import { VideoModal } from './components/VideoModal';
import { AnthropometricModal } from './components/AnthropometricModal';
import { NotificationsModal } from './components/NotificationsModal';
import { ProfileModal } from './components/ProfileModal';
import { InfoModal } from './components/InfoModal';
import { PrivacyPolicyPage } from './components/PrivacyPolicyPage';
import { MobileRestDock } from './components/MobileRestDock';

function weekdayName(date: Date): string {
  return date.toLocaleDateString('es-ES', { weekday: 'long' });
}

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('rutinas');
  const [selectedDay, setSelectedDay] = useState<WeekDayId>(() => currentWeekDayId());
  const [isWorkoutActive, setIsWorkoutActive] = useState<boolean>(true);
  const [stored] = useState<AppState>(() => loadAppState());
  const [streak, setStreak] = useState(stored.streak);
  const [restDays, setRestDays] = useState<WeekDayId[]>(stored.restDays);

  const [restTimerSeconds, setRestTimerSeconds] = useState<number>(60);
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(false);

  const [exercisesByDay, setExercisesByDay] = useState(stored.exercisesByDay);
  const [anthropometrics, setAnthropometrics] = useState<AnthropometricData>(stored.anthropometrics);
  const [weightHistory, setWeightHistory] = useState(stored.weightHistory);
  const [workoutLogs, setWorkoutLogs] = useState<CompletedWorkoutLog[]>(stored.workoutLogs);
  const sessionStartedAt = useRef(Date.now());
  const exercises = exercisesByDay[selectedDay];
  const activePlan = WEEK_PLANS.find((day) => day.id === selectedDay) ?? WEEK_PLANS[0];

  // Modal Dialog States
  const [is1RMOpen, setIs1RMOpen] = useState<boolean>(false);
  const [isGuideOpen, setIsGuideOpen] = useState<boolean>(false);
  const [isAnthroModalOpen, setIsAnthroModalOpen] = useState<boolean>(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState<boolean>(false);
  const [isProfileOpen, setIsProfileOpen] = useState<boolean>(false);
  const [isPrivacyOpen, setIsPrivacyOpen] = useState(false);
  const [infoModal, setInfoModal] = useState<{ open: boolean; type: 'support' | 'terms' }>({
    open: false,
    type: 'support',
  });

  const [videoModalData, setVideoModalData] = useState<{
    open: boolean;
    title: string;
    muscle: string;
    tempo: string;
    imageUrl?: string;
  }>({
    open: false,
    title: 'Press Inclinado con Mancuernas',
    muscle: 'PECTORAL MAYOR & TRÍCEPS',
    tempo: '3-1-1-0',
  });

  useEffect(() => {
    saveAppState({
      exercisesByDay,
      anthropometrics,
      weightHistory,
      workoutLogs,
      streak,
      restDays,
    });
  }, [exercisesByDay, anthropometrics, weightHistory, workoutLogs, streak, restDays]);

  const playTimerBeep = () => {
    try {
      const AudioContextClass =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const audioCtx = new AudioContextClass();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.type = 'sine';
      osc.frequency.setValueAtTime(880, audioCtx.currentTime);
      gain.gain.setValueAtTime(0.15, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.4);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.4);
      osc.onended = () => {
        void audioCtx.close();
      };
    } catch {
      // Audio not permitted or supported in background
    }
  };

  useEffect(() => {
    if (!isTimerRunning) return;

    const timer = setInterval(() => {
      setRestTimerSeconds((prev) => (prev <= 1 ? 0 : prev - 1));
    }, 1000);

    return () => clearInterval(timer);
  }, [isTimerRunning]);

  useEffect(() => {
    if (restTimerSeconds !== 0 || !isTimerRunning) return;
    setIsTimerRunning(false);
    playTimerBeep();
  }, [restTimerSeconds, isTimerRunning]);

  // Toggle set completion
  const handleToggleSet = (exerciseId: number, setId: string) => {
    setExercisesByDay((days) => ({
      ...days,
      [selectedDay]: days[selectedDay].map((ex) => {
        if (ex.id !== exerciseId) return ex;
        const newSets = ex.sets.map((s) => {
          if (s.id === setId) {
            const nextCompleted = !s.completed;
            // If just completed, start/reset timer for recovery!
            if (nextCompleted) {
              setRestTimerSeconds(60);
              setIsTimerRunning(true);
            }
            return { ...s, completed: nextCompleted };
          }
          return s;
        });
        const completedCount = newSets.filter((s) => s.completed).length;
        return {
          ...ex,
          sets: newSets,
          completedCount,
          isCompleted: completedCount === ex.sets.length,
        };
      }),
    }));
  };

  const handleUpdateWeight = (exerciseId: number, setId: string, delta: number) => {
    setExercisesByDay((days) => ({
      ...days,
      [selectedDay]: days[selectedDay].map((ex) => {
        if (ex.id !== exerciseId) return ex;
        return {
          ...ex,
          sets: ex.sets.map((s) => {
            if (s.id === setId) {
              const newWeight = Math.max(0, parseFloat((s.weight + delta).toFixed(1)));
              return { ...s, weight: newWeight };
            }
            return s;
          }),
        };
      }),
    }));
  };

  const handleUpdateExerciseRpe = (exerciseId: number, rpe: number) => {
    setExercisesByDay((days) => ({
      ...days,
      [selectedDay]: days[selectedDay].map((ex) => {
        if (ex.id !== exerciseId) return ex;
        return { ...ex, actualRpe: rpe };
      }),
    }));
  };

  const handleSelectDay = (day: WeekDayId) => {
    setSelectedDay(day);
    sessionStartedAt.current = Date.now();
    setRestTimerSeconds(60);
    setIsTimerRunning(false);
  };

  // Next set handler for mobile dock
  const handleNextSetFromDock = () => {
    for (const ex of exercises) {
      const nextIncomplete = ex.sets.find((s) => !s.completed);
      if (nextIncomplete) {
        handleToggleSet(ex.id, nextIncomplete.id);
        break;
      }
    }
  };

  // Finish and save workout
  const handleToggleRestDay = (day: WeekDayId) => {
    setRestDays((prev) => (prev.includes(day) ? prev.filter((item) => item !== day) : [...prev, day]));
  };

  const handleFinishWorkout = (rpe: number, notes: string): boolean => {
    const isRestDay = restDays.includes(selectedDay);
    const doneSets = completedSetCount(exercises);
    const today = todayIsoDate();
    if (!isRestDay && doneSets === 0) return false;
    if (
      isRestDay &&
      workoutLogs.some((log) => log.isoDate === today && log.dayName === activePlan.name && log.title.startsWith('Descanso'))
    ) {
      return false;
    }

    const now = new Date();
    const elapsedMinutes = Math.max(1, Math.round((Date.now() - sessionStartedAt.current) / 60000));
    const trimmedNotes = notes.trim();
    const newLog: CompletedWorkoutLog = {
      id: `log-${Date.now()}`,
      date: now.toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' }),
      dayName: activePlan.name,
      title: isRestDay ? `Descanso · ${activePlan.name}` : activePlan.sessionTitle,
      durationMinutes: isRestDay ? 0 : elapsedMinutes,
      exercisesCompleted: isRestDay
        ? 0
        : exercises.filter((ex) => ex.sets.length > 0 && ex.sets.every((s) => s.completed)).length,
      totalExercises: isRestDay ? 0 : exercises.length,
      totalVolumeKg: isRestDay ? 0 : Math.round(sessionVolumeKg(exercises)),
      rpe: isRestDay ? 0 : rpe,
      notes: trimmedNotes || (isRestDay ? 'Día de recuperación.' : 'Sin notas.'),
      isoDate: today,
    };

    setWorkoutLogs((prev) => [newLog, ...prev]);
    setStreak((prev) => advanceStreak(prev, today));
    if (!isRestDay) {
      setExercisesByDay((days) => ({
        ...days,
        [selectedDay]: resetDayProgress(selectedDay, days[selectedDay]),
      }));
    }
    sessionStartedAt.current = Date.now();
    setRestTimerSeconds(60);
    setIsTimerRunning(false);
    return true;
  };

  // Anthropometrics Update
  const handleUpdateAnthropometrics = (newData: Partial<AnthropometricData>) => {
    setAnthropometrics((prev) => {
      const updated = { ...prev, ...newData };
      const now = new Date();
      const isoDate = todayIsoDate(now);
      const point = {
        week: 'Hoy',
        label: now.toLocaleDateString('es-ES', { day: 'numeric', month: 'short' }),
        day: weekdayName(now),
        date: now.toLocaleDateString('es-ES', { day: 'numeric', month: 'short' }),
        isoDate,
        weight: updated.peso,
        waist: updated.cintura,
        arm: updated.biceps,
        chest: updated.pecho,
        thigh: updated.muslo,
        forearm: updated.antebrazo,
        bodyFat: updated.grasaPct,
      };
      setWeightHistory((history) => {
        const last = history[history.length - 1];
        if (last?.isoDate === isoDate) {
          return [...history.slice(0, -1), { ...last, ...point }];
        }
        return [...history, point];
      });
      return updated;
    });
  };

  return (
    <div className="min-h-screen bg-[#0b1326] text-[#dae2fd] flex flex-col font-['Inter'] selection:bg-[#c3f400] selection:text-[#161e00]">
      {/* Top Application Bar */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isWorkoutActive={isWorkoutActive}
        onToggleWorkout={() => {
          setIsWorkoutActive(!isWorkoutActive);
          if (!isWorkoutActive) setActiveTab('rutinas');
        }}
        streakDays={streak.count}
        onOpenTimer={() => {
          setActiveTab('rutinas');
          setIsTimerRunning(true);
        }}
        onOpenNotifications={() => setIsNotificationsOpen(true)}
        onOpenProfile={() => setIsProfileOpen(true)}
      />

      {/* Main Canvas Body */}
      <main className="flex-1 w-full max-w-[1440px] mx-auto px-4 sm:px-8 py-6 sm:py-8 pb-24 sm:pb-8">
        {activeTab === 'rutinas' && (
          <WorkoutScreen
            exercises={exercises}
            selectedDay={selectedDay}
            onSelectDay={handleSelectDay}
            onToggleSet={handleToggleSet}
            onUpdateWeight={handleUpdateWeight}
            onOpenTechniqueModal={(title, muscle, tempo, img) =>
              setVideoModalData({
                open: true,
                title,
                muscle,
                tempo,
                imageUrl: img,
              })
            }
            onFinishWorkout={handleFinishWorkout}
            onUpdateExerciseRpe={handleUpdateExerciseRpe}
            restTimerSeconds={restTimerSeconds}
            isTimerRunning={isTimerRunning}
            onToggleTimer={() => setIsTimerRunning(!isTimerRunning)}
            onAdd30s={() => setRestTimerSeconds((s) => s + 30)}
            onSkipTimer={() => {
              setRestTimerSeconds(60);
              setIsTimerRunning(false);
            }}
            isWorkoutActive={isWorkoutActive}
            onStartSession={() => setIsWorkoutActive(true)}
            restDays={restDays}
            onToggleRestDay={handleToggleRestDay}
          />
        )}

        {activeTab === 'progreso' && (
          <ProgressScreen
            data={anthropometrics}
            history={weightHistory}
            onOpenModal={() => setIsAnthroModalOpen(true)}
            onQuickUpdate={handleUpdateAnthropometrics}
          />
        )}

        {activeTab === 'tecnica' && (
          <TechniqueScreen
            onOpenVideoModal={(title, muscle, tempo, img) =>
              setVideoModalData({
                open: true,
                title,
                muscle,
                tempo,
                imageUrl: img,
              })
            }
          />
        )}

        {activeTab === 'historial' && (
          <HistoryScreen logs={workoutLogs} streakDays={streak.count} />
        )}
      </main>

      {/* Persistent Bottom Timer Bar on Mobile */}
      {isWorkoutActive && (
        <MobileRestDock
          seconds={restTimerSeconds}
          isRunning={isTimerRunning}
          onToggleTimer={() => setIsTimerRunning(!isTimerRunning)}
          onAdd30s={() => setRestTimerSeconds((s) => s + 30)}
          onNextSet={handleNextSetFromDock}
        />
      )}

      {/* Shared Footer */}
      <Footer
        onOpenGuide={() => setIsGuideOpen(true)}
        onOpen1RM={() => setIs1RMOpen(true)}
        onOpenSupport={() => setInfoModal({ open: true, type: 'support' })}
        onOpenPrivacy={() => setIsPrivacyOpen(true)}
      />

      {/* Dialog Modals */}
      <OneRepMaxModal isOpen={is1RMOpen} onClose={() => setIs1RMOpen(false)} />

      <BenchGuideModal isOpen={isGuideOpen} onClose={() => setIsGuideOpen(false)} />

      <VideoModal
        isOpen={videoModalData.open}
        onClose={() => setVideoModalData((prev) => ({ ...prev, open: false }))}
        exerciseTitle={videoModalData.title}
        muscleCategory={videoModalData.muscle}
        tempo={videoModalData.tempo}
        imageUrl={videoModalData.imageUrl}
      />

      <AnthropometricModal
        isOpen={isAnthroModalOpen}
        onClose={() => setIsAnthroModalOpen(false)}
        currentData={anthropometrics}
        onSave={(data) => handleUpdateAnthropometrics(data)}
      />

      <NotificationsModal
        isOpen={isNotificationsOpen}
        onClose={() => setIsNotificationsOpen(false)}
      />

      <ProfileModal
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        data={anthropometrics}
        streakDays={streak.count}
      />

      {isPrivacyOpen && <PrivacyPolicyPage onClose={() => setIsPrivacyOpen(false)} />}

      <InfoModal
        isOpen={infoModal.open}
        onClose={() => setInfoModal((prev) => ({ ...prev, open: false }))}
        type={infoModal.type}
      />
    </div>
  );
}
