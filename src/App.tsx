import React, { useState, useEffect } from 'react';
import {
  ActiveTab,
  AnthropometricData,
  CompletedWorkoutLog,
  WeightHistoryPoint,
  WorkoutExercise,
} from './types';
import {
  INITIAL_ANTHROPOMETRICS,
  INITIAL_EXERCISES,
  INITIAL_LOGS,
  WEIGHT_HISTORY,
} from './data/mockData';
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
import { MobileRestDock } from './components/MobileRestDock';

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('rutinas');
  const [isWorkoutActive, setIsWorkoutActive] = useState<boolean>(true);
  const [streakDays, setStreakDays] = useState<number>(5);

  // Rest Timer State - initial 42 seconds from Image 3 ("00:42")
  const [restTimerSeconds, setRestTimerSeconds] = useState<number>(42);
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(true);

  // Exercises and Data with LocalStorage fallback
  const [exercises, setExercises] = useState<WorkoutExercise[]>(() => {
    const saved = localStorage.getItem('ironbench_exercises');
    return saved ? JSON.parse(saved) : INITIAL_EXERCISES;
  });

  const [anthropometrics, setAnthropometrics] = useState<AnthropometricData>(() => {
    const saved = localStorage.getItem('ironbench_anthropometrics');
    return saved ? JSON.parse(saved) : INITIAL_ANTHROPOMETRICS;
  });

  const [weightHistory, setWeightHistory] = useState<WeightHistoryPoint[]>(() => {
    const saved = localStorage.getItem('ironbench_history');
    return saved ? JSON.parse(saved) : WEIGHT_HISTORY;
  });

  const [workoutLogs, setWorkoutLogs] = useState<CompletedWorkoutLog[]>(() => {
    const saved = localStorage.getItem('ironbench_logs');
    return saved ? JSON.parse(saved) : INITIAL_LOGS;
  });

  // Modal Dialog States
  const [is1RMOpen, setIs1RMOpen] = useState<boolean>(false);
  const [isGuideOpen, setIsGuideOpen] = useState<boolean>(false);
  const [isAnthroModalOpen, setIsAnthroModalOpen] = useState<boolean>(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState<boolean>(false);
  const [isProfileOpen, setIsProfileOpen] = useState<boolean>(false);
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

  // Persist exercises and metrics
  useEffect(() => {
    localStorage.setItem('ironbench_exercises', JSON.stringify(exercises));
  }, [exercises]);

  useEffect(() => {
    localStorage.setItem('ironbench_anthropometrics', JSON.stringify(anthropometrics));
  }, [anthropometrics]);

  useEffect(() => {
    localStorage.setItem('ironbench_history', JSON.stringify(weightHistory));
  }, [weightHistory]);

  useEffect(() => {
    localStorage.setItem('ironbench_logs', JSON.stringify(workoutLogs));
  }, [workoutLogs]);

  // Audio tone notification helper for timer completion
  const playTimerBeep = () => {
    try {
      const audioCtx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.type = 'sine';
      osc.frequency.setValueAtTime(880, audioCtx.currentTime); // A5 note
      gain.gain.setValueAtTime(0.15, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.4);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.4);
    } catch {
      // Audio not permitted or supported in background
    }
  };

  // Timer Tick Hook
  useEffect(() => {
    if (!isTimerRunning) return;

    const timer = setInterval(() => {
      setRestTimerSeconds((prev) => {
        if (prev <= 1) {
          playTimerBeep();
          return 60; // reset to 60s
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isTimerRunning]);

  // Toggle set completion
  const handleToggleSet = (exerciseId: number, setId: string) => {
    setExercises((prev) =>
      prev.map((ex) => {
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
      })
    );
  };

  // Update set weight
  const handleUpdateWeight = (exerciseId: number, setId: string, delta: number) => {
    setExercises((prev) =>
      prev.map((ex) => {
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
      })
    );
  };

  // Update exercise RPE per movement
  const handleUpdateExerciseRpe = (exerciseId: number, rpe: number) => {
    setExercises((prev) =>
      prev.map((ex) => {
        if (ex.id !== exerciseId) return ex;
        return { ...ex, actualRpe: rpe };
      })
    );
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
  const handleFinishWorkout = (rpe: number, notes: string) => {
    const completedSets = exercises.reduce(
      (acc, ex) => acc + ex.sets.filter((s) => s.completed).length,
      0
    );
    const totalVolume = exercises.reduce((acc, ex) => {
      return (
        acc +
        ex.sets
          .filter((s) => s.completed)
          .reduce((sAcc, s) => {
            const reps = typeof s.reps === 'number' ? s.reps : 10;
            return sAcc + s.weight * 2 * reps;
          }, 0)
      );
    }, 0);

    const newLog: CompletedWorkoutLog = {
      id: `log-${Date.now()}`,
      date: new Date().toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' }),
      dayName: 'Lunes',
      title: 'Pecho Dominante & Tríceps Asistido',
      durationMinutes: 38,
      exercisesCompleted: exercises.filter((ex) => ex.sets.every((s) => s.completed)).length,
      totalExercises: exercises.length,
      totalVolumeKg: totalVolume > 0 ? totalVolume : 4280,
      rpe,
      notes,
    };

    setWorkoutLogs((prev) => [newLog, ...prev]);
    setStreakDays((prev) => prev + 1);
  };

  // Anthropometrics Update
  const handleUpdateAnthropometrics = (newData: Partial<AnthropometricData>) => {
    setAnthropometrics((prev) => {
      const updated = { ...prev, ...newData };
      // Also update latest point in weight history
      setWeightHistory((hPrev) => {
        const copy = [...hPrev];
        if (copy.length > 0) {
          copy[copy.length - 1] = {
            ...copy[copy.length - 1],
            weight: updated.peso,
            waist: updated.cintura,
            arm: updated.biceps,
          };
        }
        return copy;
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
        streakDays={streakDays}
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
          <HistoryScreen logs={workoutLogs} streakDays={streakDays} />
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
        onOpenTerms={() => setInfoModal({ open: true, type: 'terms' })}
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
        streakDays={streakDays}
      />

      <InfoModal
        isOpen={infoModal.open}
        onClose={() => setInfoModal((prev) => ({ ...prev, open: false }))}
        type={infoModal.type}
      />
    </div>
  );
}
