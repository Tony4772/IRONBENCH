import React, { useState } from 'react';
import { AnthropometricData, WeightHistoryPoint } from '../types';
import { IMAGES } from '../data/mockData';
import { ProgressTrendsChart } from './ProgressTrendsChart';

interface ProgressScreenProps {
  data: AnthropometricData;
  history: WeightHistoryPoint[];
  onOpenModal: () => void;
  onQuickUpdate: (values: Partial<AnthropometricData>) => void;
}

export const ProgressScreen: React.FC<ProgressScreenProps> = ({
  data,
  history,
  onOpenModal,
  onQuickUpdate,
}) => {
  const [sliderPosition, setSliderPosition] = useState<number>(50);
  const [photoView, setPhotoView] = useState<'frontal' | 'perfil'>('frontal');

  // Quick form input states
  const [formWeight, setFormWeight] = useState<number>(data.peso);
  const [formWaist, setFormWaist] = useState<number>(data.cintura);
  const [formArm, setFormArm] = useState<number>(data.biceps);
  const [formChest, setFormChest] = useState<number>(data.pecho);
  const [formThigh, setFormThigh] = useState<number>(data.muslo);
  const [formSavedToast, setFormSavedToast] = useState<boolean>(false);

  const handleQuickSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onQuickUpdate({
      peso: formWeight,
      cintura: formWaist,
      biceps: formArm,
      pecho: formChest,
      muslo: formThigh,
      fechaUltimoPesaje: 'Hoy ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    });
    setFormSavedToast(true);
    setTimeout(() => setFormSavedToast(false), 3000);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Toast Notification */}
      {formSavedToast && (
        <div className="fixed top-20 right-6 z-50 bg-[#171f33] border-2 border-[#c3f400] text-[#ffffff] px-5 py-3 rounded-xl shadow-2xl flex items-center gap-3 animate-in slide-in-from-top-4">
          <span className="material-symbols-outlined text-[#c3f400]">check_circle</span>
          <div>
            <div className="font-bold text-xs">¡Medidas Guardadas Exitosamente!</div>
            <div className="text-[11px] text-[#c4c9ac]">
              Panel antropométrico y curvas actualizados.
            </div>
          </div>
        </div>
      )}

      {/* Hero / Section Title */}
      <section className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-[#444933]/30 pb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#222a3d] border border-[#444933]/50 mb-2">
            <span className="w-2 h-2 rounded-full bg-[#c3f400] animate-pulse" />
            <span className="font-['Inter'] text-[11px] font-bold text-[#c3f400] uppercase tracking-wider">
              ESTADO DE ACONDICIONAMIENTO Y BIOMETRÍA
            </span>
          </div>
          <h1 className="font-['Montserrat'] font-bold text-2xl sm:text-4xl text-[#ffffff] tracking-tight">
            Progreso Físico, Medidas y Técnica
          </h1>
          <p className="font-['Inter'] text-sm text-[#c4c9ac] mt-1">
            Supervisión antropométrica de alta precisión y calibración biomecánica para banco y mancuernas.
          </p>
        </div>

        {/* Quick Action: Registrar Medida */}
        <div className="flex items-center gap-2 self-start md:self-auto">
          <button
            onClick={onOpenModal}
            className="px-4 py-2.5 rounded-lg bg-[#222a3d] border border-[#444933] hover:border-[#c3f400] text-[#ffffff] font-['Inter'] font-bold text-xs flex items-center gap-2 transition-colors shadow-sm cursor-pointer whitespace-nowrap"
          >
            <span className="material-symbols-outlined text-[#c3f400]">edit_note</span>
            <span>Registrar Nueva Medida Hoy</span>
          </button>
        </div>
      </section>

      {/* PARTE 1: PANEL DE MEDIDAS Y CAMBIOS CORPORALES */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="font-['Montserrat'] font-bold text-lg sm:text-xl text-[#ffffff] flex items-center gap-2">
            <span className="material-symbols-outlined text-[#c3f400]">straighten</span>
            <span>Panel Antropométrico & Registro de Composición</span>
          </h2>
          <span className="text-[11px] font-semibold text-[#8e9379]">
            Último pesaje: {data.fechaUltimoPesaje}
          </span>
        </div>

        {/* Tarjetas de Resumen Métrico (Bento Grid) */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
          {/* Peso Actual */}
          <div className="col-span-2 sm:col-span-1 lg:col-span-2 bg-[#171f33] border border-[#444933]/50 rounded-xl p-4 flex flex-col justify-between relative overflow-hidden group hover:border-[#8e9379] transition-all">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-[#8e9379] uppercase tracking-wider">
                PESO ACTUAL
              </span>
              <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-[#c3f400]/10 text-[#c3f400] border border-[#c3f400]/30">
                -2.1 kg (4 sem)
              </span>
            </div>
            <div className="my-2">
              <div className="font-['Montserrat'] font-extrabold text-3xl sm:text-4xl text-[#ffffff] tracking-tight flex items-baseline gap-1">
                {data.peso.toFixed(1)}{' '}
                <span className="text-sm font-normal text-[#c4c9ac]">kg</span>
              </div>
            </div>
            <div className="flex items-center gap-1 text-[11px] text-[#abd600]">
              <span className="material-symbols-outlined text-xs">trending_down</span>
              <span>Ritmo ideal de pérdida grasa</span>
            </div>
          </div>

          {/* Grasa Estimada */}
          <div className="bg-[#171f33] border border-[#444933]/50 rounded-xl p-4 flex flex-col justify-between hover:border-[#8e9379] transition-all">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-[#8e9379] uppercase tracking-wider">
                GRASA EST.
              </span>
              <span className="material-symbols-outlined text-[#8e9379] text-base">percent</span>
            </div>
            <div className="my-2">
              <div className="font-['Montserrat'] font-bold text-2xl text-[#ffffff]">
                {data.grasaPct}
                <span className="text-xs font-semibold text-[#c4c9ac]">%</span>
              </div>
            </div>
            <span className="text-[10px] font-bold text-[#9cf0ff]">-1.4% vs inicio</span>
          </div>

          {/* Cintura */}
          <div className="bg-[#171f33] border border-[#444933]/50 rounded-xl p-4 flex flex-col justify-between hover:border-[#8e9379] transition-all">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-[#8e9379] uppercase tracking-wider">
                CINTURA
              </span>
              <span className="material-symbols-outlined text-[#8e9379] text-base">tune</span>
            </div>
            <div className="my-2">
              <div className="font-['Montserrat'] font-bold text-2xl text-[#ffffff]">
                {data.cintura}{' '}
                <span className="text-xs font-semibold text-[#c4c9ac]">cm</span>
              </div>
            </div>
            <span className="text-[10px] font-bold text-[#c3f400]">-3.0 cm</span>
          </div>

          {/* Pecho */}
          <div className="bg-[#171f33] border border-[#444933]/50 rounded-xl p-4 flex flex-col justify-between hover:border-[#8e9379] transition-all">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-[#8e9379] uppercase tracking-wider">
                PECHO
              </span>
              <span className="material-symbols-outlined text-[#8e9379] text-base">
                sports_gymnastics
              </span>
            </div>
            <div className="my-2">
              <div className="font-['Montserrat'] font-bold text-2xl text-[#ffffff]">
                {data.pecho}{' '}
                <span className="text-xs font-semibold text-[#c4c9ac]">cm</span>
              </div>
            </div>
            <span className="text-[10px] font-bold text-[#9cf0ff]">+2.0 cm hipertrofia</span>
          </div>

          {/* Bíceps / Brazo */}
          <div className="bg-[#171f33] border border-[#444933]/50 rounded-xl p-4 flex flex-col justify-between hover:border-[#8e9379] transition-all">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-[#8e9379] uppercase tracking-wider">
                BÍCEPS
              </span>
              <span className="material-symbols-outlined text-[#8e9379] text-base">
                fitness_center
              </span>
            </div>
            <div className="my-2">
              <div className="font-['Montserrat'] font-bold text-2xl text-[#ffffff]">
                {data.biceps}{' '}
                <span className="text-xs font-semibold text-[#c4c9ac]">cm</span>
              </div>
            </div>
            <span className="text-[10px] font-bold text-[#9cf0ff]">+1.2 cm brazo</span>
          </div>

          {/* Muslo & Antebrazo */}
          <div className="bg-[#171f33] border border-[#444933]/50 rounded-xl p-4 flex flex-col justify-between hover:border-[#8e9379] transition-all">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-[#8e9379] uppercase tracking-wider">
                MUSLO / PIERNA
              </span>
              <span className="material-symbols-outlined text-[#8e9379] text-base">
                directions_walk
              </span>
            </div>
            <div className="my-2">
              <div className="font-['Montserrat'] font-bold text-2xl text-[#ffffff]">
                {data.muslo.toFixed(1)}{' '}
                <span className="text-xs font-semibold text-[#c4c9ac]">cm</span>
              </div>
            </div>
            <div className="text-[10px] text-[#c4c9ac]">
              <span>
                Antebrazo: <b className="text-[#ffffff]">{data.antebrazo} cm</b> (+0.8)
              </span>
            </div>
          </div>
        </div>

        {/* Grid Visual: Gráfico de Evolución + Comparador Antes/Después */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Interactive Evolution Graph (7 Cols) with Recharts */}
          <div className="lg:col-span-7 bg-[#131b2e] border border-[#444933]/50 rounded-xl p-5 sm:p-6 flex flex-col justify-between">
            <ProgressTrendsChart history={history} />

            {/* Milestones Footer */}
            <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="bg-[#171f33] p-3 rounded-lg border border-[#444933]/30 flex items-center gap-3">
                <span className="material-symbols-outlined text-[#c3f400] text-xl">emoji_events</span>
                <div>
                  <p className="text-[10px] font-bold uppercase text-[#8e9379]">Hito Cintura</p>
                  <p className="text-xs font-bold text-[#ffffff]">&lt; 85cm Logrado (-3cm)</p>
                </div>
              </div>

              <div className="bg-[#171f33] p-3 rounded-lg border border-[#444933]/30 flex items-center gap-3">
                <span className="material-symbols-outlined text-[#ff5708] text-xl">
                  local_fire_department
                </span>
                <div>
                  <p className="text-[10px] font-bold uppercase text-[#8e9379]">Quema Activa</p>
                  <p className="text-xs font-bold text-[#ffffff]">1,450 kcal / sem</p>
                </div>
              </div>

              <div className="bg-[#171f33] p-3 rounded-lg border border-[#444933]/30 flex items-center gap-3">
                <span className="material-symbols-outlined text-[#9cf0ff] text-xl">
                  fitness_center
                </span>
                <div>
                  <p className="text-[10px] font-bold uppercase text-[#8e9379]">Fuerza Mancuerna</p>
                  <p className="text-xs font-bold text-[#ffffff]">+4 kg en Press Banca</p>
                </div>
              </div>
            </div>
          </div>

          {/* Comparador Visual Fotos Antes / Después (5 Cols) */}
          <div className="lg:col-span-5 bg-[#131b2e] border border-[#444933]/50 rounded-xl p-5 sm:p-6 flex flex-col justify-between">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="font-['Montserrat'] font-bold text-lg text-[#ffffff]">
                  Comparativa Visual
                </h3>
                <p className="text-xs text-[#c4c9ac]">Frontal & Perfil: Día 1 vs Día 35</p>
              </div>
              <div className="flex gap-1 bg-[#171f33] p-1 rounded-lg border border-[#444933]/40">
                <button
                  onClick={() => setPhotoView('frontal')}
                  className={`px-2.5 py-0.5 text-xs font-['Inter'] font-bold rounded cursor-pointer ${
                    photoView === 'frontal'
                      ? 'bg-[#c3f400] text-[#161e00]'
                      : 'text-[#c4c9ac] hover:text-[#ffffff]'
                  }`}
                >
                  Frontal
                </button>
                <button
                  onClick={() => setPhotoView('perfil')}
                  className={`px-2.5 py-0.5 text-xs font-['Inter'] font-bold rounded cursor-pointer ${
                    photoView === 'perfil'
                      ? 'bg-[#c3f400] text-[#161e00]'
                      : 'text-[#c4c9ac] hover:text-[#ffffff]'
                  }`}
                >
                  Perfil
                </button>
              </div>
            </div>

            {/* Interactive Before / After Slider Canvas */}
            <div
              className="relative w-full h-72 rounded-lg overflow-hidden border border-[#444933]/50 select-none group bg-[#060e20]"
              id="comparison-box"
            >
              {/* "Después" Image (Underneath, full view) */}
              <div className="absolute inset-0 w-full h-full">
                <img
                  src={IMAGES.afterDay35}
                  alt="Día 35 después del acondicionamiento"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
                <span className="absolute top-3 right-3 text-xs font-['Inter'] font-bold px-2 py-1 bg-[#222a3d]/90 text-[#c3f400] border border-[#c3f400]/40 rounded-lg shadow-md">
                  Día 35 (76.4 kg)
                </span>
              </div>

              {/* "Antes" Image Container (Clipped via inline style width) */}
              <div
                className="absolute inset-0 h-full overflow-hidden border-r-2 border-[#c3f400]"
                style={{ width: `${sliderPosition}%` }}
              >
                <div className="w-full h-full min-w-[320px] md:min-w-[420px]">
                  <img
                    src={IMAGES.beforeDay1}
                    alt="Día 1 antes del acondicionamiento"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                </div>
                <span className="absolute top-3 left-3 text-xs font-['Inter'] font-bold px-2 py-1 bg-[#060e20]/90 text-[#ffffff] border border-[#444933] rounded-lg shadow-md">
                  Día 1 (78.5 kg)
                </span>
              </div>

              {/* Slider Line / Central Pill Controller */}
              <div
                className="absolute top-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-[#c3f400] text-[#161e00] flex items-center justify-center slider-handle pointer-events-none z-10 transition-transform group-hover:scale-110"
                style={{ left: `${sliderPosition}%` }}
              >
                <span className="material-symbols-outlined text-sm font-bold">drag_indicator</span>
              </div>

              {/* Native range input overlay for intuitive mobile/desktop scrub */}
              <input
                type="range"
                min="0"
                max="100"
                value={sliderPosition}
                onChange={(e) => setSliderPosition(Number(e.target.value))}
                className="absolute inset-0 w-full h-full opacity-0 cursor-ew-resize z-20"
                aria-label="Arrastra para comparar antes y después"
              />
            </div>

            {/* Slider instructions */}
            <div className="flex items-center justify-between text-xs font-semibold text-[#8e9379] mt-3">
              <span className="flex items-center gap-1 text-[#c4c9ac]">
                <span className="material-symbols-outlined text-xs">arrow_back</span>
                Arrastra para comparar
              </span>
              <span className="text-[#9cf0ff] font-bold">Tono muscular +18%</span>
            </div>
          </div>
        </div>
      </section>

      {/* FORMULARIO DIRECTO O SECCIÓN DE REGISTRO RÁPIDO */}
      <section className="bg-[#171f33] border border-[#444933]/50 rounded-xl p-5 sm:p-6 shadow-md">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#444933]/30 pb-4 mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[#222a3d] border border-[#444933] flex items-center justify-center text-[#c3f400]">
              <span className="material-symbols-outlined">add_circle</span>
            </div>
            <div>
              <h3 className="font-['Montserrat'] font-bold text-base text-[#ffffff]">
                Registrar Medidas de la Sesión Actual
              </h3>
              <p className="text-xs text-[#c4c9ac]">
                Introduce las lecturas de hoy para actualizar tus curvas de sobrecarga y composición.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 text-xs font-semibold text-[#8e9379]">
            <span className="material-symbols-outlined text-sm">calendar_today</span>
            <span>Fecha: 24 Octubre 2025</span>
          </div>
        </div>

        {/* Quick Measurement Form Inputs */}
        <form onSubmit={handleQuickSubmit} className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <div>
            <label className="block text-[10px] font-bold text-[#8e9379] uppercase mb-1">
              PESO (KG)
            </label>
            <div className="relative">
              <input
                type="number"
                step="0.1"
                value={formWeight}
                onChange={(e) => setFormWeight(parseFloat(e.target.value) || 0)}
                className="w-full bg-[#222a3d] border border-[#444933] rounded-lg px-3 py-2 text-[#ffffff] font-['Montserrat'] font-bold text-base focus:border-[#c3f400] focus:outline-none"
              />
              <span className="absolute right-3 top-2.5 text-xs text-[#8e9379] font-bold">kg</span>
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-bold text-[#8e9379] uppercase mb-1">
              CINTURA / ABD (CM)
            </label>
            <div className="relative">
              <input
                type="number"
                step="0.5"
                value={formWaist}
                onChange={(e) => setFormWaist(parseFloat(e.target.value) || 0)}
                className="w-full bg-[#222a3d] border border-[#444933] rounded-lg px-3 py-2 text-[#ffffff] font-['Montserrat'] font-bold text-base focus:border-[#c3f400] focus:outline-none"
              />
              <span className="absolute right-3 top-2.5 text-xs text-[#8e9379] font-bold">cm</span>
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-bold text-[#8e9379] uppercase mb-1">
              BRAZO / BÍCEPS (CM)
            </label>
            <div className="relative">
              <input
                type="number"
                step="0.5"
                value={formArm}
                onChange={(e) => setFormArm(parseFloat(e.target.value) || 0)}
                className="w-full bg-[#222a3d] border border-[#444933] rounded-lg px-3 py-2 text-[#ffffff] font-['Montserrat'] font-bold text-base focus:border-[#c3f400] focus:outline-none"
              />
              <span className="absolute right-3 top-2.5 text-xs text-[#8e9379] font-bold">cm</span>
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-bold text-[#8e9379] uppercase mb-1">
              PECHO (CM)
            </label>
            <div className="relative">
              <input
                type="number"
                step="0.5"
                value={formChest}
                onChange={(e) => setFormChest(parseFloat(e.target.value) || 0)}
                className="w-full bg-[#222a3d] border border-[#444933] rounded-lg px-3 py-2 text-[#ffffff] font-['Montserrat'] font-bold text-base focus:border-[#c3f400] focus:outline-none"
              />
              <span className="absolute right-3 top-2.5 text-xs text-[#8e9379] font-bold">cm</span>
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-bold text-[#8e9379] uppercase mb-1">
              MUSLOS (CM)
            </label>
            <div className="relative">
              <input
                type="number"
                step="0.5"
                value={formThigh}
                onChange={(e) => setFormThigh(parseFloat(e.target.value) || 0)}
                className="w-full bg-[#222a3d] border border-[#444933] rounded-lg px-3 py-2 text-[#ffffff] font-['Montserrat'] font-bold text-base focus:border-[#c3f400] focus:outline-none"
              />
              <span className="absolute right-3 top-2.5 text-xs text-[#8e9379] font-bold">cm</span>
            </div>
          </div>

          <div className="flex items-end col-span-2 md:col-span-1">
            <button
              type="submit"
              className="w-full py-2.5 rounded-lg bg-[#c3f400] text-[#161e00] font-['Inter'] font-bold text-xs uppercase tracking-wider hover:bg-[#abd600] transition-all active:scale-[0.98] flex items-center justify-center gap-1.5 shadow-md cursor-pointer"
            >
              <span className="material-symbols-outlined text-base">save</span>
              <span>Guardar Medida</span>
            </button>
          </div>
        </form>
      </section>
    </div>
  );
};
