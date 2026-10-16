import React, { useState } from 'react';

interface OneRepMaxModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const OneRepMaxModal: React.FC<OneRepMaxModalProps> = ({ isOpen, onClose }) => {
  const [weight, setWeight] = useState<number>(24);
  const [reps, setReps] = useState<number>(10);
  const [isDumbbellPair, setIsDumbbellPair] = useState<boolean>(true);

  if (!isOpen) return null;

  // Epley formula: 1RM = weight * (1 + reps / 30)
  // Brzycki formula: 1RM = weight * (36 / (37 - reps))
  const effectiveWeight = isDumbbellPair ? weight * 2 : weight;
  const epley1RM = Math.round(effectiveWeight * (1 + reps / 30));
  const brzycki1RM = reps < 37 ? Math.round(effectiveWeight * (36 / (37 - reps))) : epley1RM;
  const average1RM = Math.round((epley1RM + brzycki1RM) / 2);

  const singleDumbbell1RM = Math.round(average1RM / (isDumbbellPair ? 2 : 1));

  const percentages = [
    { pct: 100, reps: '1 rep', desc: 'Fuerza Máxima (1RM)' },
    { pct: 95, reps: '2 reps', desc: 'Fuerza Extrema' },
    { pct: 90, reps: '3-4 reps', desc: 'Fuerza Neuromuscular' },
    { pct: 85, reps: '5-6 reps', desc: 'Fuerza / Hipertrofia Funcional' },
    { pct: 80, reps: '7-8 reps', desc: 'Hipertrofia Miofibrilar' },
    { pct: 75, reps: '9-10 reps', desc: 'Rango Ideal IronBench (35-40 min)' },
    { pct: 70, reps: '11-12 reps', desc: 'Hipertrofia Sarcoplasmática' },
    { pct: 65, reps: '15+ reps', desc: 'Resistencia Metabólica / Bombeo' },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-[#060e20]/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-[#171f33] border border-[#444933] rounded-2xl max-w-xl w-full p-6 space-y-5 shadow-2xl animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between border-b border-[#444933]/50 pb-3">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#c3f400]">calculate</span>
            <h3 className="font-['Montserrat'] font-bold text-lg text-[#ffffff]">
              Calculadora 1RM (Fuerza Máxima en Mancuernas)
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded text-[#c4c9ac] hover:text-[#ffffff] hover:bg-[#222a3d] transition-colors"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <p className="text-xs text-[#c4c9ac]">
          Calcula tu repetición máxima teórica y las zonas de sobrecarga progresiva calibradas para banco y mancuernas.
        </p>

        {/* Inputs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-[#131b2e] p-4 rounded-xl border border-[#444933]/40">
          <div>
            <label className="block text-xs font-semibold uppercase text-[#c4c9ac] mb-1">
              Peso por Mancuerna (kg)
            </label>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setWeight((w) => Math.max(2, w - 2))}
                className="w-8 h-8 rounded bg-[#222a3d] text-[#dae2fd] hover:text-[#c3f400] font-bold border border-[#444933]"
              >
                -
              </button>
              <input
                type="number"
                value={weight}
                onChange={(e) => setWeight(Math.max(1, parseFloat(e.target.value) || 0))}
                className="w-full bg-[#171f33] border border-[#444933] rounded-lg py-1.5 px-3 text-center font-['Montserrat'] font-bold text-lg text-[#ffffff] focus:border-[#c3f400] focus:outline-none"
              />
              <button
                onClick={() => setWeight((w) => w + 2)}
                className="w-8 h-8 rounded bg-[#222a3d] text-[#dae2fd] hover:text-[#c3f400] font-bold border border-[#444933]"
              >
                +
              </button>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase text-[#c4c9ac] mb-1">
              Repeticiones Logradas
            </label>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setReps((r) => Math.max(1, r - 1))}
                className="w-8 h-8 rounded bg-[#222a3d] text-[#dae2fd] hover:text-[#c3f400] font-bold border border-[#444933]"
              >
                -
              </button>
              <input
                type="number"
                value={reps}
                onChange={(e) => setReps(Math.min(30, Math.max(1, parseInt(e.target.value) || 1)))}
                className="w-full bg-[#171f33] border border-[#444933] rounded-lg py-1.5 px-3 text-center font-['Montserrat'] font-bold text-lg text-[#ffffff] focus:border-[#c3f400] focus:outline-none"
              />
              <button
                onClick={() => setReps((r) => Math.min(30, r + 1))}
                className="w-8 h-8 rounded bg-[#222a3d] text-[#dae2fd] hover:text-[#c3f400] font-bold border border-[#444933]"
              >
                +
              </button>
            </div>
          </div>

          <div className="col-span-1 sm:col-span-2 flex items-center justify-between text-xs pt-1">
            <span className="text-[#c4c9ac]">Formato de levantamiento:</span>
            <div className="flex gap-2">
              <button
                onClick={() => setIsDumbbellPair(true)}
                className={`px-2.5 py-1 rounded text-xs font-semibold cursor-pointer ${
                  isDumbbellPair
                    ? 'bg-[#c3f400] text-[#161e00]'
                    : 'bg-[#222a3d] text-[#c4c9ac] hover:text-[#ffffff]'
                }`}
              >
                2 Mancuernas (Par)
              </button>
              <button
                onClick={() => setIsDumbbellPair(false)}
                className={`px-2.5 py-1 rounded text-xs font-semibold cursor-pointer ${
                  !isDumbbellPair
                    ? 'bg-[#c3f400] text-[#161e00]'
                    : 'bg-[#222a3d] text-[#c4c9ac] hover:text-[#ffffff]'
                }`}
              >
                1 Mancuerna (Bilateral/Unilateral)
              </button>
            </div>
          </div>
        </div>

        {/* 1RM Result Banner */}
        <div className="bg-[#222a3d] border border-[#c3f400]/40 rounded-xl p-4 flex items-center justify-between">
          <div>
            <div className="text-[11px] font-bold uppercase tracking-wider text-[#c3f400]">
              Estimación 1RM Teórico
            </div>
            <div className="font-['Montserrat'] font-extrabold text-3xl text-[#ffffff] flex items-baseline gap-1 mt-0.5">
              {singleDumbbell1RM} <span className="text-sm font-normal text-[#c4c9ac]">kg / mancuerna</span>
            </div>
            {isDumbbellPair && (
              <div className="text-xs text-[#8e9379] mt-0.5">
                Carga combinada total: <strong className="text-[#dae2fd]">{average1RM} kg</strong>
              </div>
            )}
          </div>
          <div className="text-right">
            <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-[#c3f400]/15 text-[#c3f400] border border-[#c3f400]/30">
              Epley + Brzycki
            </span>
          </div>
        </div>

        {/* Percentages Table */}
        <div className="max-h-56 overflow-y-auto no-scrollbar border border-[#444933]/50 rounded-xl">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#131b2e] text-[#c4c9ac] uppercase text-[10px] sticky top-0">
              <tr>
                <th className="py-2 px-3">% 1RM</th>
                <th className="py-2 px-3">Carga / Mancuerna</th>
                <th className="py-2 px-3">Reps Sugeridas</th>
                <th className="py-2 px-3">Enfoque Fisiológico</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#444933]/20">
              {percentages.map((p) => {
                const targetWeight = (singleDumbbell1RM * (p.pct / 100)).toFixed(1);
                const isHighlight = p.pct === 75;
                return (
                  <tr
                    key={p.pct}
                    className={`transition-colors ${
                      isHighlight
                        ? 'bg-[#c3f400]/10 font-bold text-[#c3f400]'
                        : 'hover:bg-[#222a3d]/50 text-[#dae2fd]'
                    }`}
                  >
                    <td className="py-2 px-3">{p.pct}%</td>
                    <td className="py-2 px-3 font-mono">{targetWeight} kg</td>
                    <td className="py-2 px-3">{p.reps}</td>
                    <td className="py-2 px-3 text-[11px] text-[#c4c9ac]">{p.desc}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="flex justify-end pt-2">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-lg bg-[#c3f400] text-[#161e00] font-['Inter'] font-bold text-xs tracking-wider uppercase hover:bg-[#abd600] transition-colors cursor-pointer"
          >
            Entendido
          </button>
        </div>
      </div>
    </div>
  );
};
