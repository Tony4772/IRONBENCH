import React from 'react';

interface MobileRestDockProps {
  seconds: number;
  isRunning: boolean;
  onToggleTimer: () => void;
  onAdd30s: () => void;
  onNextSet: () => void;
}

export const MobileRestDock: React.FC<MobileRestDockProps> = ({
  seconds,
  isRunning,
  onToggleTimer,
  onAdd30s,
  onNextSet,
}) => {
  const formatTimer = (s: number) => {
    const mins = Math.floor(s / 60);
    const secs = s % 60;
    return `${mins < 10 ? '0' : ''}${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <div className="sm:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#222a3d]/95 backdrop-blur-md px-3 py-2.5 border-t border-[#444933]/60 flex items-center justify-between gap-2 overflow-hidden shadow-2xl pb-[max(0.625rem,env(safe-area-inset-bottom))]">
      <div
        onClick={onToggleTimer}
        className="flex items-center gap-2 cursor-pointer select-none min-w-0"
      >
        <span
          className={`material-symbols-outlined text-[#ff5708] ${
            isRunning ? 'animate-pulse' : ''
          }`}
        >
          timer
        </span>
        <div>
          <div className="text-[10px] text-[#8e9379] font-bold uppercase tracking-wider">
            {isRunning ? 'Descanso' : 'En pausa'}
          </div>
          <div className="font-['Montserrat'] font-bold text-lg text-[#ff5708] tabular-nums">
            {formatTimer(seconds)}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={onAdd30s}
          className="px-3 py-1.5 bg-[#171f33] border border-[#444933] text-xs text-[#dae2fd] rounded-lg font-bold active:scale-95 transition-transform"
        >
          +30s
        </button>
        <button
          onClick={onNextSet}
          className="px-3 py-1.5 bg-[#c3f400] text-[#161e00] text-xs font-['Inter'] font-bold rounded-lg shadow-md active:scale-95 transition-transform whitespace-nowrap"
        >
          Siguiente
        </button>
      </div>
    </div>
  );
};
