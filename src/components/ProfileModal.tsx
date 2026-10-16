import React from 'react';
import { AnthropometricData } from '../types';
import { IMAGES } from '../data/mockData';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: AnthropometricData;
  streakDays: number;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({
  isOpen,
  onClose,
  data,
  streakDays,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-[#060e20]/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-[#171f33] border border-[#444933] rounded-2xl max-w-md w-full p-6 space-y-5 shadow-2xl animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between border-b border-[#444933]/50 pb-3">
          <h3 className="font-['Montserrat'] font-bold text-base text-[#ffffff] flex items-center gap-2">
            <span className="material-symbols-outlined text-[#c3f400]">account_circle</span>
            <span>Perfil de Atleta IRONBENCH</span>
          </h3>
          <button
            onClick={onClose}
            className="p-1 rounded text-[#c4c9ac] hover:text-[#ffffff] hover:bg-[#222a3d] transition-colors"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        {/* User Card */}
        <div className="flex items-center gap-4 bg-[#131b2e] p-4 rounded-xl border border-[#444933]/40">
          <div className="relative w-14 h-14 rounded-full overflow-hidden border-2 border-[#c3f400] flex-shrink-0">
            <img
              src={IMAGES.avatar}
              alt="Usuario"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <div className="font-['Montserrat'] font-bold text-base text-[#ffffff]">
              Alex Vance
            </div>
            <div className="text-xs text-[#9cf0ff] font-semibold">
              Nivel: Intermedio Avanzado
            </div>
            <div className="text-[11px] text-[#8e9379] mt-0.5">
              Protocolo: Banco Ajustable & Mancuernas
            </div>
          </div>
        </div>

        {/* Key Stats Grid */}
        <div className="grid grid-cols-2 gap-3 text-xs">
          <div className="p-3 bg-[#222a3d] rounded-xl border border-[#444933]/40">
            <span className="text-[#8e9379] uppercase font-bold text-[10px]">Racha Actual</span>
            <div className="font-['Montserrat'] font-extrabold text-2xl text-[#c3f400] mt-0.5">
              {streakDays} <span className="text-xs font-normal text-[#c4c9ac]">Días</span>
            </div>
            <span className="text-[10px] text-[#ffb59c]">Objetivo: 7 Días Seguidos</span>
          </div>

          <div className="p-3 bg-[#222a3d] rounded-xl border border-[#444933]/40">
            <span className="text-[#8e9379] uppercase font-bold text-[10px]">Peso Actual</span>
            <div className="font-['Montserrat'] font-extrabold text-2xl text-[#ffffff] mt-0.5">
              {data.peso} <span className="text-xs font-normal text-[#c4c9ac]">kg</span>
            </div>
            <span className="text-[10px] text-[#c3f400]">Objetivo: 75.0 kg (-1.4 kg)</span>
          </div>

          <div className="p-3 bg-[#222a3d] rounded-xl border border-[#444933]/40">
            <span className="text-[#8e9379] uppercase font-bold text-[10px]">Cintura Umbilical</span>
            <div className="font-['Montserrat'] font-extrabold text-2xl text-[#9cf0ff] mt-0.5">
              {data.cintura} <span className="text-xs font-normal text-[#c4c9ac]">cm</span>
            </div>
            <span className="text-[10px] text-[#c3f400]">-3.0 cm alcanzados</span>
          </div>

          <div className="p-3 bg-[#222a3d] rounded-xl border border-[#444933]/40">
            <span className="text-[#8e9379] uppercase font-bold text-[10px]">Grasa Estimada</span>
            <div className="font-['Montserrat'] font-extrabold text-2xl text-[#ff5708] mt-0.5">
              {data.grasaPct}%
            </div>
            <span className="text-[10px] text-[#c3f400]">-1.4% vs inicio</span>
          </div>
        </div>

        <div className="p-3 bg-[#131b2e] rounded-xl border border-[#444933]/40 text-xs text-[#c4c9ac] space-y-1">
          <div className="font-bold text-[#ffffff] flex items-center gap-1.5">
            <span className="material-symbols-outlined text-sm text-[#c3f400]">verified</span>
            <span>Plan: 35-40 Minutos de Alta Densidad</span>
          </div>
          <p className="text-[11px] leading-relaxed">
            Optimizado para recuperación rápida del SNC y máxima tensión mecánica en fibras tipo II.
          </p>
        </div>

        <div className="flex justify-end pt-1">
          <button
            onClick={onClose}
            className="w-full py-2.5 rounded-lg bg-[#c3f400] text-[#161e00] font-['Inter'] font-bold text-xs tracking-wider uppercase hover:bg-[#abd600] transition-colors cursor-pointer"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};
