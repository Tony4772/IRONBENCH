import React, { useState } from 'react';
import { TechnicalExerciseItem } from '../types';
import { MATRIX_EXERCISES, TECHNICAL_EXERCISES } from '../data/mockData';

interface TechniqueScreenProps {
  onOpenVideoModal: (title: string, muscle: string, tempo: string, imageUrl?: string) => void;
}

export const TechniqueScreen: React.FC<TechniqueScreenProps> = ({ onOpenVideoModal }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('Todos');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const categories = [
    { name: 'Todos', count: 8, color: '#c3f400' },
    { name: 'Pecho', dotColor: '#00daf3' },
    { name: 'Bíceps', dotColor: '#c3f400' },
    { name: 'Tríceps', dotColor: '#00daf3' },
    { name: 'Antebrazo', label: 'Antebrazo (Curl Muñeca)', dotColor: '#ff5708' },
    { name: 'Piernas', label: 'Piernas (Búlgaras/Goblet)', dotColor: '#c3f400' },
    { name: 'Abdomen', label: 'Abdomen (Banco Plano)', dotColor: '#ffffff' },
  ];

  const filteredExercises = TECHNICAL_EXERCISES.filter((ex) => {
    const matchesCategory =
      selectedCategory === 'Todos' ||
      ex.category.toLowerCase() === selectedCategory.toLowerCase();
    const matchesSearch =
      ex.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ex.muscleCategory.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ex.step1Desc.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const filteredMatrix = MATRIX_EXERCISES.filter(
    (m) =>
      m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.targetMuscle.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Header */}
      <section className="space-y-4 border-b border-[#444933]/30 pb-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-[#9cf0ff] font-['Inter'] text-[11px] font-bold tracking-wider uppercase mb-1">
              <span className="material-symbols-outlined text-base">model_training</span>
              <span>LABORATORIO BIOMECÁNICO & EJECUCIÓN</span>
            </div>
            <h1 className="font-['Montserrat'] font-bold text-2xl sm:text-4xl text-[#ffffff] tracking-tight">
              Directorio Técnico: Banco y Mancuernas
            </h1>
            <p className="font-['Inter'] text-sm text-[#c4c9ac] mt-1 max-w-3xl leading-relaxed">
              Protocolos de ejecución de precisión, estabilización angular de banco y gestión respiratoria para máxima tensión mecánica.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs text-[#c4c9ac] self-start md:self-auto bg-[#171f33] px-3 py-1.5 rounded-lg border border-[#444933]/50">
            <span className="material-symbols-outlined text-base text-[#c3f400]">verified</span>
            <span>Biomecánica auditada para entrenamientos de 35-40 min</span>
          </div>
        </div>

        {/* Search & Filter Bar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-2">
          {/* Category Chips */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1">
            {categories.map((cat) => {
              const isSelected = selectedCategory === cat.name;
              return (
                <button
                  key={cat.name}
                  onClick={() => setSelectedCategory(cat.name)}
                  className={`px-3.5 py-1.5 rounded-full font-['Inter'] font-bold text-xs whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer ${
                    isSelected
                      ? 'bg-[#c3f400] text-[#161e00] shadow-sm'
                      : 'bg-[#171f33] border border-[#444933]/60 text-[#dae2fd] hover:border-[#c3f400]'
                  }`}
                >
                  <span>{cat.label || cat.name}</span>
                  {cat.count && <span>({cat.count})</span>}
                  {cat.dotColor && !isSelected && (
                    <span
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: cat.dotColor }}
                    />
                  )}
                </button>
              );
            })}
          </div>

          {/* Quick Search */}
          <div className="relative min-w-[200px]">
            <input
              type="text"
              placeholder="Buscar ejercicio o músculo..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#171f33] border border-[#444933] rounded-lg pl-8 pr-3 py-1.5 text-xs text-[#ffffff] placeholder-[#8e9379] focus:border-[#c3f400] focus:outline-none"
            />
            <span className="material-symbols-outlined absolute left-2.5 top-2 text-xs text-[#8e9379]">
              search
            </span>
          </div>
        </div>
      </section>

      {/* Fichas Interactivas con Diagramas y Pasos */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredExercises.map((item) => (
          <article
            key={item.id}
            id={item.id}
            className="bg-[#171f33] border border-[#444933]/50 rounded-xl overflow-hidden flex flex-col justify-between hover:border-[#8e9379] transition-all shadow-md group"
          >
            <div>
              {/* Header Ficha */}
              <div className="p-4 sm:p-5 border-b border-[#444933]/30 flex items-start justify-between bg-[#222a3d]/40">
                <div>
                  <div className="flex flex-wrap items-center gap-1.5 mb-1.5">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#9cf0ff]/10 text-[#9cf0ff] border border-[#9cf0ff]/30 uppercase">
                      {item.muscleCategory}
                    </span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-[#222a3d] text-[#dae2fd] border border-[#444933]/40 flex items-center gap-1">
                      <span className="material-symbols-outlined text-xs">
                        {item.benchAngleType}
                      </span>
                      {item.benchAngle}
                    </span>
                  </div>
                  <h3 className="font-['Montserrat'] font-bold text-lg sm:text-xl text-[#ffffff]">
                    {item.name}
                  </h3>
                </div>

                <div className="text-right flex-shrink-0">
                  <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-[#ff5708]/15 text-[#ffb59c] border border-[#ff5708]/30">
                    Nivel: {item.level}
                  </span>
                  <p className="text-[11px] font-semibold text-[#8e9379] mt-1">
                    Tempo: {item.tempo}
                  </p>
                </div>
              </div>

              {/* Media + Pasos */}
              <div className="grid grid-cols-1 sm:grid-cols-5 border-b border-[#444933]/30">
                <div className="sm:col-span-2 h-48 sm:h-auto relative bg-[#060e20]">
                  <img
                    src={item.imageUrl}
                    alt={item.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute bottom-2 left-2 bg-[#060e20]/90 px-2 py-0.5 rounded text-[10px] font-bold text-[#c3f400] border border-[#444933]/40">
                    {item.focusTag}
                  </div>
                </div>

                {/* Pasos Numerados de Ejecución */}
                <div className="sm:col-span-3 p-4 sm:p-5 space-y-3 bg-[#131b2e]">
                  <div className="flex gap-2.5 items-start">
                    <span className="w-5 h-5 rounded-full bg-[#c3f400] text-[#161e00] flex items-center justify-center font-bold text-xs flex-shrink-0 mt-0.5">
                      1
                    </span>
                    <div>
                      <h4 className="font-bold text-xs text-[#ffffff]">
                        {item.step1Title}
                      </h4>
                      <p className="text-xs text-[#c4c9ac] mt-0.5 leading-relaxed">
                        {item.step1Desc}
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-2.5 items-start">
                    <span className="w-5 h-5 rounded-full bg-[#c3f400] text-[#161e00] flex items-center justify-center font-bold text-xs flex-shrink-0 mt-0.5">
                      2
                    </span>
                    <div>
                      <h4 className="font-bold text-xs text-[#ffffff]">
                        {item.step2Title}
                      </h4>
                      <p className="text-xs text-[#c4c9ac] mt-0.5 leading-relaxed">
                        {item.step2Desc}
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-2.5 items-start">
                    <span className="w-5 h-5 rounded-full bg-[#ff5708] text-[#ffffff] flex items-center justify-center font-bold text-xs flex-shrink-0 mt-0.5">
                      !
                    </span>
                    <div>
                      <h4 className="font-bold text-xs text-[#ffb59c]">
                        Errores Comunes a Evitar
                      </h4>
                      <p className="text-xs text-[#c4c9ac] mt-0.5 leading-relaxed">
                        {item.commonMistakes}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer Ficha */}
            <div className="p-3 px-4 sm:px-5 bg-[#222a3d]/50 flex flex-wrap items-center justify-between gap-2 text-xs">
              <div className="flex items-center gap-1.5 text-[#c4c9ac] max-w-md">
                <span className="material-symbols-outlined text-[#9cf0ff] text-base">air</span>
                <span className="text-[11px] leading-tight">
                  <b className="text-[#ffffff]">Respiración:</b> {item.breathingTip}
                </span>
              </div>

              <button
                onClick={() =>
                  onOpenVideoModal(item.name, item.muscleCategory, item.tempo, item.imageUrl)
                }
                className="text-[#c3f400] hover:underline font-bold text-xs flex items-center gap-1 cursor-pointer whitespace-nowrap ml-auto"
              >
                <span>Ver Video HD</span>
                <span className="material-symbols-outlined text-sm">play_circle</span>
              </button>
            </div>
          </article>
        ))}
      </section>

      {/* Matriz Rápida de Ejercicios en Banco */}
      <section className="bg-[#131b2e] border border-[#444933]/40 rounded-xl p-5 sm:p-6 shadow-md">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-['Montserrat'] font-bold text-lg text-[#ffffff]">
              Matriz Rápida de Ejercicios en Banco
            </h3>
            <p className="text-xs text-[#c4c9ac]">
              Resumen de ajustes angulares y tiempos recomendados
            </p>
          </div>
          <span className="material-symbols-outlined text-[#8e9379]">tune</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] text-left text-xs">
            <thead>
              <tr className="border-b border-[#444933]/40 text-[#8e9379] font-bold text-[10px] uppercase">
                <th className="py-2.5 px-3">EJERCICIO</th>
                <th className="py-2.5 px-3">MÚSCULO PRINCIPAL</th>
                <th className="py-2.5 px-3">INCLINACIÓN BANCO</th>
                <th className="py-2.5 px-3">CARGA SUGERIDA</th>
                <th className="py-2.5 px-3">TEMPO</th>
                <th className="py-2.5 px-3 text-right">TÉCNICA</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#444933]/20">
              {filteredMatrix.map((row) => (
                <tr key={row.id} className="hover:bg-[#171f33]/60 transition-colors">
                  <td className="py-3 px-3 font-semibold text-[#ffffff]">{row.name}</td>
                  <td className="py-3 px-3 text-[#9cf0ff]">{row.targetMuscle}</td>
                  <td className="py-3 px-3 text-[#c4c9ac]">{row.benchIncline}</td>
                  <td className="py-3 px-3 font-mono text-[#c3f400] font-bold">
                    {row.suggestedLoad}
                  </td>
                  <td className="py-3 px-3 font-mono text-[#c4c9ac]">{row.tempo}</td>
                  <td className="py-3 px-3 text-right">
                    <button
                      onClick={() => {
                        const target = document.getElementById(row.technicalId || '');
                        if (target) {
                          target.scrollIntoView({ behavior: 'smooth' });
                        } else {
                          onOpenVideoModal(
                            row.name,
                            row.targetMuscle,
                            row.tempo
                          );
                        }
                      }}
                      className="text-xs text-[#c3f400] hover:underline font-bold cursor-pointer"
                    >
                      Ver ficha
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};
