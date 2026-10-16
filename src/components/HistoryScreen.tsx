import React, { useState } from 'react';
import { CompletedWorkoutLog } from '../types';

interface HistoryScreenProps {
  logs: CompletedWorkoutLog[];
  streakDays: number;
}

export const HistoryScreen: React.FC<HistoryScreenProps> = ({ logs, streakDays }) => {
  const [filterQuery, setFilterQuery] = useState<string>('');

  const totalVolume = logs.reduce((acc, log) => acc + log.totalVolumeKg, 0);
  const totalMinutes = logs.reduce((acc, log) => acc + log.durationMinutes, 0);
  const averageMinutes = logs.length > 0 ? Math.round(totalMinutes / logs.length) : 0;
  const averageRpe = (logs.reduce((acc, log) => acc + log.rpe, 0) / (logs.length || 1)).toFixed(1);

  const filteredLogs = logs.filter(
    (log) =>
      log.title.toLowerCase().includes(filterQuery.toLowerCase()) ||
      log.date.toLowerCase().includes(filterQuery.toLowerCase()) ||
      log.notes.toLowerCase().includes(filterQuery.toLowerCase())
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Header */}
      <section className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-[#444933]/30 pb-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#222a3d] border border-[#444933]/50 mb-2">
            <span className="material-symbols-outlined text-[#c3f400] text-sm">history</span>
            <span className="font-['Inter'] text-[11px] font-bold text-[#c3f400] uppercase tracking-wider">
              REGISTRO DE SESIONES & RENDIMIENTO
            </span>
          </div>
          <h1 className="font-['Montserrat'] font-bold text-2xl sm:text-4xl text-[#ffffff] tracking-tight">
            Historial de Sobrecarga Progresiva
          </h1>
          <p className="font-['Inter'] text-sm text-[#c4c9ac] mt-1">
            Registro continuo de tonelaje levantado, percepción de esfuerzo (RPE) y duración de entrenamientos.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start md:self-auto">
          <div className="px-3.5 py-1.5 bg-[#222a3d] border border-[#444933] rounded-lg text-xs font-bold text-[#dae2fd] flex items-center gap-2">
            <span className="material-symbols-outlined text-[#ff5708] text-base">local_fire_department</span>
            <span>Racha Actual: <strong className="text-[#c3f400]">{streakDays} Días</strong></span>
          </div>
        </div>
      </section>

      {/* KPI Ribbon */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-[#171f33] border border-[#444933]/50 rounded-xl p-4">
          <span className="text-[10px] font-bold uppercase text-[#8e9379]">Sesiones Registradas</span>
          <div className="font-['Montserrat'] font-extrabold text-3xl text-[#ffffff] mt-1">
            {logs.length}
          </div>
          <span className="text-[11px] text-[#c3f400]">{logs.length === 0 ? 'Sin sesiones' : 'Sesiones guardadas'}</span>
        </div>

        <div className="bg-[#171f33] border border-[#444933]/50 rounded-xl p-4">
          <span className="text-[10px] font-bold uppercase text-[#8e9379]">Tonelaje Acumulado</span>
          <div className="font-['Montserrat'] font-extrabold text-3xl text-[#c3f400] mt-1">
            {(totalVolume / 1000).toFixed(1)} <span className="text-sm font-normal text-[#c4c9ac]">ton</span>
          </div>
          <span className="text-[11px] text-[#9cf0ff]">{totalVolume.toLocaleString()} kg total</span>
        </div>

        <div className="bg-[#171f33] border border-[#444933]/50 rounded-xl p-4">
          <span className="text-[10px] font-bold uppercase text-[#8e9379]">Tiempo Bajo Tensión</span>
          <div className="font-['Montserrat'] font-extrabold text-3xl text-[#ffffff] mt-1">
            {totalMinutes} <span className="text-sm font-normal text-[#c4c9ac]">min</span>
          </div>
          <span className="text-[11px] text-[#8e9379]">Promedio {averageMinutes} min/sesión</span>
        </div>

        <div className="bg-[#171f33] border border-[#444933]/50 rounded-xl p-4">
          <span className="text-[10px] font-bold uppercase text-[#8e9379]">RPE Promedio</span>
          <div className="font-['Montserrat'] font-extrabold text-3xl text-[#ff5708] mt-1">
            {averageRpe}
          </div>
          <span className="text-[11px] text-[#ffb59c]">Zona óptima de hipertrofia</span>
        </div>
      </div>

      {/* Search Filter */}
      <div className="flex items-center justify-between gap-4">
        <div className="relative flex-1 max-w-sm">
          <input
            type="text"
            placeholder="Filtrar por sesión, fecha o notas..."
            value={filterQuery}
            onChange={(e) => setFilterQuery(e.target.value)}
            className="w-full bg-[#171f33] border border-[#444933] rounded-lg pl-9 pr-3 py-2 text-xs text-[#ffffff] placeholder-[#8e9379] focus:border-[#c3f400] focus:outline-none"
          />
          <span className="material-symbols-outlined absolute left-2.5 top-2.5 text-xs text-[#8e9379]">
            search
          </span>
        </div>
      </div>

      {/* Logs Table / Cards */}
      <div className="space-y-4">
        {filteredLogs.map((log) => (
          <div
            key={log.id}
            className="bg-[#171f33] border border-[#444933]/50 rounded-xl p-5 hover:border-[#8e9379] transition-all space-y-3"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#444933]/30 pb-3">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-bold text-[#c3f400]">{log.dayName}</span>
                  <span className="text-xs text-[#8e9379]">·</span>
                  <span className="text-xs text-[#8e9379]">{log.date}</span>
                </div>
                <h3 className="font-['Montserrat'] font-bold text-lg text-[#ffffff]">
                  {log.title}
                </h3>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
                <div className="text-right">
                  <div className="text-[10px] uppercase font-bold text-[#8e9379]">Volumen Total</div>
                  <div className="font-mono font-bold text-sm text-[#c3f400]">
                    {log.totalVolumeKg.toLocaleString()} kg
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-[10px] uppercase font-bold text-[#8e9379]">Duración</div>
                  <div className="font-bold text-sm text-[#ffffff]">{log.durationMinutes} min</div>
                </div>
                <div className="text-right">
                  <div className="text-[10px] uppercase font-bold text-[#8e9379]">RPE</div>
                  <span className="px-2 py-0.5 rounded font-bold text-xs bg-[#ff5708]/15 text-[#ffb59c] border border-[#ff5708]/30">
                    {log.rpe}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
              <div className="text-[#c4c9ac] flex items-center gap-2">
                <span className="material-symbols-outlined text-[#9cf0ff] text-sm">description</span>
                <span>{log.notes}</span>
              </div>

              <div className="text-[11px] font-semibold text-[#8e9379] whitespace-nowrap">
                {log.exercisesCompleted} de {log.totalExercises} ejercicios completados
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
