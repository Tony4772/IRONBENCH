import React, { useState } from 'react';
import { ActiveTab } from '../types';
import { IMAGES } from '../data/mockData';

interface HeaderProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  isWorkoutActive: boolean;
  onToggleWorkout: () => void;
  streakDays: number;
  onOpenTimer?: () => void;
  onOpenNotifications?: () => void;
  onOpenProfile?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  isWorkoutActive,
  onToggleWorkout,
  streakDays,
  onOpenTimer,
  onOpenNotifications,
  onOpenProfile,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems: { id: ActiveTab; label: string }[] = [
    { id: 'rutinas', label: 'Rutinas' },
    { id: 'tecnica', label: 'Técnica' },
    { id: 'progreso', label: 'Progreso' },
    { id: 'historial', label: 'Historial' },
  ];

  return (
    <header className="sticky top-0 z-50 flex items-center justify-between gap-2 w-full min-w-0 px-3 sm:px-8 h-16 bg-[#171f33]/95 backdrop-blur-md border-b border-[#444933]/50 shadow-lg">
      {/* Brand & Desktop Nav */}
      <div className="flex items-center gap-6 lg:gap-8 min-w-0">
        <button
          onClick={() => setActiveTab('rutinas')}
          className="flex items-center gap-2 cursor-pointer text-left focus:outline-none min-w-0"
        >
          <span className="material-symbols-outlined text-[#c3f400] text-2xl shrink-0" style={{ fontVariationSettings: "'FILL' 1" }}>
            fitness_center
          </span>
          <span className="max-[340px]:hidden font-['Montserrat'] font-extrabold text-lg sm:text-xl tracking-tight text-[#c3f400] uppercase truncate">
            IRONBENCH
          </span>
        </button>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-6">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`font-['Inter'] text-sm tracking-wide transition-all pb-1 whitespace-nowrap cursor-pointer ${
                  isActive
                    ? 'text-[#c3f400] font-bold border-b-2 border-[#c3f400]'
                    : 'text-[#c4c9ac] hover:text-[#dae2fd] font-medium'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Right Cluster Actions */}
      <div className="flex items-center gap-1 sm:gap-4 shrink-0">
        {/* Streak Badge */}
        <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#222a3d] border border-[#444933]/60 shadow-sm">
          <span className="material-symbols-outlined text-[#ff5708] text-base" style={{ fontVariationSettings: "'FILL' 1" }}>
            timer
          </span>
          <span className="font-['Inter'] text-xs font-semibold text-[#ffb59c] whitespace-nowrap">
            Racha: {streakDays} Días
          </span>
        </div>

        {/* Trailing Icon Actions */}
        <div className="flex items-center gap-1 text-[#c4c9ac]">
          {onOpenTimer && (
            <button
              onClick={onOpenTimer}
              className="p-1.5 rounded hover:text-[#c3f400] hover:bg-[#222a3d] transition-colors cursor-pointer"
              title="Cronómetro de Descanso"
            >
              <span className="material-symbols-outlined text-xl">timer</span>
            </button>
          )}

          <button
            onClick={onOpenNotifications}
            className="p-1.5 rounded hover:text-[#c3f400] hover:bg-[#222a3d] transition-colors relative cursor-pointer"
            title="Notificaciones"
          >
            <span className="material-symbols-outlined text-xl">notifications</span>
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#ff5708]"></span>
          </button>
        </div>

        {/* Primary Action CTA Button */}
        <button
          onClick={onToggleWorkout}
          className={`flex items-center gap-1.5 px-2 sm:px-3.5 py-2 rounded-lg font-['Inter'] font-bold text-xs tracking-wider uppercase transition-all duration-150 active:scale-95 shadow-md cursor-pointer whitespace-nowrap ${
            isWorkoutActive
              ? 'bg-[#ff5708] text-[#ffffff] hover:bg-[#ff5708]/90 ring-2 ring-[#ff5708]/40 animate-pulse'
              : 'bg-[#c3f400] text-[#161e00] hover:bg-[#abd600]'
          }`}
          aria-label={isWorkoutActive ? 'Detener sesión' : 'Iniciar sesión'}
        >
          <span className="material-symbols-outlined text-base">
            {isWorkoutActive ? 'stop_circle' : 'fitness_center'}
          </span>
          <span className="hidden sm:inline">{isWorkoutActive ? 'Sesión en Curso' : 'Iniciar Sesión 40m'}</span>
        </button>

        {/* User Profile Avatar */}
        <button
          onClick={onOpenProfile}
          className="relative w-8 h-8 rounded-full overflow-hidden border border-[#c3f400]/50 ring-1 ring-[#171f33] hover:ring-[#c3f400] transition-all cursor-pointer flex-shrink-0"
          title="Ver Perfil y Métricas"
        >
          <img
            src={IMAGES.avatar}
            alt="Atleta IRONBENCH"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover"
          />
        </button>

        {/* Mobile Hamburger Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-1.5 rounded text-[#dae2fd] hover:text-[#c3f400] focus:outline-none"
        >
          <span className="material-symbols-outlined text-2xl">
            {mobileMenuOpen ? 'close' : 'menu'}
          </span>
        </button>
      </div>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute top-16 left-0 right-0 bg-[#171f33] border-b border-[#444933] p-4 flex flex-col gap-3 shadow-2xl z-50">
          <div className="flex items-center justify-between px-2 pb-2 border-b border-[#444933]/50">
            <span className="text-xs text-[#c4c9ac] font-semibold">MENÚ PRINCIPAL</span>
            <span className="text-xs text-[#ffb59c] font-bold">Racha: {streakDays} Días</span>
          </div>
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setMobileMenuOpen(false);
                }}
                className={`flex items-center justify-between p-2 rounded-lg text-sm font-semibold transition-colors ${
                  isActive
                    ? 'bg-[#222a3d] text-[#c3f400] border border-[#c3f400]/40'
                    : 'text-[#dae2fd] hover:bg-[#222a3d]/50'
                }`}
              >
                <span>{item.label}</span>
                {isActive && <span className="material-symbols-outlined text-sm">check</span>}
              </button>
            );
          })}
        </div>
      )}
    </header>
  );
};
