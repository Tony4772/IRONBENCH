import React, { useState, useEffect } from 'react';

interface VideoModalProps {
  isOpen: boolean;
  onClose: () => void;
  exerciseTitle: string;
  muscleCategory: string;
  tempo: string;
  imageUrl?: string;
}

export const VideoModal: React.FC<VideoModalProps> = ({
  isOpen,
  onClose,
  exerciseTitle,
  muscleCategory,
  tempo,
  imageUrl,
}) => {
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [progress, setProgress] = useState<number>(35);
  const [currentPhase, setCurrentPhase] = useState<'Excéntrica (3s)' | 'Isométrica (1s)' | 'Concéntrica (1s)' | 'Transición'>('Excéntrica (3s)');

  useEffect(() => {
    if (!isOpen || !isPlaying) return;
    const interval = setInterval(() => {
      setProgress((prev) => {
        const next = (prev + 1) % 100;
        if (next < 50) setCurrentPhase('Excéntrica (3s)');
        else if (next < 65) setCurrentPhase('Isométrica (1s)');
        else setCurrentPhase('Concéntrica (1s)');
        return next;
      });
    }, 120);

    return () => clearInterval(interval);
  }, [isOpen, isPlaying]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-[#060e20]/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-[#171f33] border border-[#444933] rounded-2xl max-w-3xl w-full overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="p-4 bg-[#222a3d] border-b border-[#444933]/50 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-0.5">
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#c3f400]/20 text-[#c3f400] border border-[#c3f400]/40">
                HD 60FPS BIOMECÁNICA
              </span>
              <span className="text-xs text-[#9cf0ff] font-semibold">{muscleCategory}</span>
            </div>
            <h3 className="font-['Montserrat'] font-bold text-base text-[#ffffff]">
              {exerciseTitle}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#c4c9ac] hover:text-[#ffffff] hover:bg-[#171f33] transition-colors"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        {/* Video Canvas Simulation */}
        <div className="relative w-full h-72 sm:h-96 bg-[#060e20] flex items-center justify-center overflow-hidden">
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={exerciseTitle}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover opacity-85"
            />
          ) : (
            <div className="text-center text-[#c4c9ac]">
              <span className="material-symbols-outlined text-5xl text-[#c3f400] animate-pulse">fitness_center</span>
              <p className="mt-2 text-xs">Simulación de trayectoria 3D</p>
            </div>
          )}

          {/* Grid overlay lines to emphasize biomechanical precision */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#060e20] via-transparent to-transparent pointer-events-none" />
          <div className="absolute inset-0 border border-[#c3f400]/10 pointer-events-none" />

          {/* Real-time angle & Phase HUD HUD */}
          <div className="absolute top-3 left-3 bg-[#060e20]/80 backdrop-blur-md px-3 py-1.5 rounded-lg border border-[#444933]/60 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#c3f400] animate-ping" />
            <span className="text-xs font-['Montserrat'] font-bold text-[#c3f400]">
              FASE: {currentPhase}
            </span>
          </div>

          <div className="absolute top-3 right-3 bg-[#060e20]/80 backdrop-blur-md px-2.5 py-1 rounded text-xs text-[#dae2fd] border border-[#444933]/60 font-mono">
            TEMPO: {tempo}
          </div>

          {/* Center Play/Pause button overlay */}
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="absolute inset-0 m-auto w-14 h-14 rounded-full bg-[#c3f400]/90 text-[#161e00] flex items-center justify-center shadow-xl hover:scale-105 active:scale-95 transition-transform cursor-pointer"
          >
            <span className="material-symbols-outlined text-3xl">
              {isPlaying ? 'pause' : 'play_arrow'}
            </span>
          </button>

          {/* Bottom Video Controls Bar */}
          <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-[#060e20] to-transparent flex flex-col gap-1.5">
            {/* Scrubber */}
            <div className="w-full h-1.5 bg-[#222a3d] rounded-full overflow-hidden cursor-pointer">
              <div
                className="bg-[#c3f400] h-full rounded-full transition-all duration-100"
                style={{ width: `${progress}%` }}
              />
            </div>

            <div className="flex items-center justify-between text-xs text-[#c4c9ac] pt-1">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="hover:text-[#ffffff] flex items-center gap-1"
                >
                  <span className="material-symbols-outlined text-sm">
                    {isPlaying ? 'pause' : 'play_arrow'}
                  </span>
                  <span>{isPlaying ? 'Pausar' : 'Reproducir'}</span>
                </button>
                <span>00:{progress < 10 ? `0${progress}` : progress} / 01:00</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-[11px] text-[#ffb59c] flex items-center gap-1">
                  <span className="material-symbols-outlined text-xs">air</span>
                  Inhalar en bajada · Exhalar en subida
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Video Notes & Biomechanics Breakdown */}
        <div className="p-4 bg-[#171f33] border-t border-[#444933]/40 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div className="p-2.5 bg-[#131b2e] rounded-lg border border-[#444933]/40">
            <div className="font-bold text-[#c3f400] mb-0.5">Ángulo Articular Óptimo</div>
            <p className="text-[11px] text-[#c4c9ac]">
              Codos en ángulo de 45° con el torso. Evita la abducción horizontal forzada a 90°.
            </p>
          </div>
          <div className="p-2.5 bg-[#131b2e] rounded-lg border border-[#444933]/40">
            <div className="font-bold text-[#9cf0ff] mb-0.5">Tensión Mecánica Pico</div>
            <p className="text-[11px] text-[#c4c9ac]">
              Sostén 1 segundo en el punto de estiramiento controlado sin rebotar sobre articulaciones.
            </p>
          </div>
          <div className="p-2.5 bg-[#131b2e] rounded-lg border border-[#444933]/40">
            <div className="font-bold text-[#ffb59c] mb-0.5">Gestión de Presión Intra-Abdominal</div>
            <p className="text-[11px] text-[#c4c9ac]">
              Presuriza el diafragma antes de iniciar la fase excéntrica para estabilizar columna lumbar.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
