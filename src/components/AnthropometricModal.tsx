import React, { useState } from 'react';
import { AnthropometricData } from '../types';

interface AnthropometricModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentData: AnthropometricData;
  onSave: (newData: AnthropometricData) => void;
}

export const AnthropometricModal: React.FC<AnthropometricModalProps> = ({
  isOpen,
  onClose,
  currentData,
  onSave,
}) => {
  const [peso, setPeso] = useState<number>(currentData.peso);
  const [cintura, setCintura] = useState<number>(currentData.cintura);
  const [biceps, setBiceps] = useState<number>(currentData.biceps);
  const [antebrazo, setAntebrazo] = useState<number>(currentData.antebrazo);
  const [pecho, setPecho] = useState<number>(currentData.pecho);
  const [muslo, setMuslo] = useState<number>(currentData.muslo);

  if (!isOpen) return null;

  // Navy method approximation based on waist and weight
  // If waist decreases and weight is stable/down, estimated body fat drops
  const estimatedFat = Math.max(8, Math.min(35, parseFloat((16.2 + (cintura - 82) * 0.45 + (peso - 76.4) * 0.3).toFixed(1))));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const updated: AnthropometricData = {
      peso,
      cintura,
      biceps,
      antebrazo,
      pecho,
      muslo,
      grasaPct: estimatedFat,
      fechaUltimoPesaje: 'Hoy ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    onSave(updated);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#060e20]/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-[#171f33] border border-[#444933] rounded-2xl max-w-lg w-full p-6 space-y-5 shadow-2xl animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between border-b border-[#444933]/50 pb-3">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#c3f400]">edit_calendar</span>
            <h3 className="font-['Montserrat'] font-bold text-lg text-[#ffffff]">
              Registrar Datos Antropométricos
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
          Introduce los perímetros tomados en ayunas con cinta métrica no elástica para el cálculo de masa libre de grasa.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-bold text-[#c4c9ac] mb-1 uppercase">
                Peso Corporal (kg)
              </label>
              <input
                type="number"
                step="0.1"
                value={peso}
                onChange={(e) => setPeso(parseFloat(e.target.value) || 0)}
                className="w-full bg-[#131b2e] border border-[#444933] rounded-lg p-2.5 text-[#ffffff] font-['Montserrat'] font-bold text-base focus:border-[#c3f400] focus:outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-[#c4c9ac] mb-1 uppercase">
                Cintura Umbilical (cm)
              </label>
              <input
                type="number"
                step="0.5"
                value={cintura}
                onChange={(e) => setCintura(parseFloat(e.target.value) || 0)}
                className="w-full bg-[#131b2e] border border-[#444933] rounded-lg p-2.5 text-[#ffffff] font-['Montserrat'] font-bold text-base focus:border-[#c3f400] focus:outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-[#c4c9ac] mb-1 uppercase">
                Brazo Contraído (cm)
              </label>
              <input
                type="number"
                step="0.5"
                value={biceps}
                onChange={(e) => setBiceps(parseFloat(e.target.value) || 0)}
                className="w-full bg-[#131b2e] border border-[#444933] rounded-lg p-2.5 text-[#ffffff] font-['Montserrat'] font-bold text-base focus:border-[#c3f400] focus:outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-[#c4c9ac] mb-1 uppercase">
                Antebrazo (cm)
              </label>
              <input
                type="number"
                step="0.5"
                value={antebrazo}
                onChange={(e) => setAntebrazo(parseFloat(e.target.value) || 0)}
                className="w-full bg-[#131b2e] border border-[#444933] rounded-lg p-2.5 text-[#ffffff] font-['Montserrat'] font-bold text-base focus:border-[#c3f400] focus:outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-[#c4c9ac] mb-1 uppercase">
                Pecho (cm)
              </label>
              <input
                type="number"
                step="0.5"
                value={pecho}
                onChange={(e) => setPecho(parseFloat(e.target.value) || 0)}
                className="w-full bg-[#131b2e] border border-[#444933] rounded-lg p-2.5 text-[#ffffff] font-['Montserrat'] font-bold text-base focus:border-[#c3f400] focus:outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-[#c4c9ac] mb-1 uppercase">
                Muslos (cm)
              </label>
              <input
                type="number"
                step="0.5"
                value={muslo}
                onChange={(e) => setMuslo(parseFloat(e.target.value) || 0)}
                className="w-full bg-[#131b2e] border border-[#444933] rounded-lg p-2.5 text-[#ffffff] font-['Montserrat'] font-bold text-base focus:border-[#c3f400] focus:outline-none"
                required
              />
            </div>
          </div>

          {/* Real-time preview */}
          <div className="p-3 bg-[#222a3d] rounded-lg border border-[#c3f400]/30 flex items-center justify-between text-xs">
            <div>
              <span className="text-[#c4c9ac]">Grasa Estimada Automática:</span>
              <div className="font-['Montserrat'] font-bold text-base text-[#c3f400]">
                {estimatedFat}%
              </div>
            </div>
            <div className="text-right text-[11px] text-[#8e9379]">
              Algoritmo Antropométrico IronBench
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg text-[#c4c9ac] hover:text-[#ffffff] text-xs font-['Inter'] font-semibold transition-colors cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-lg bg-[#c3f400] text-[#161e00] text-xs font-['Inter'] font-bold tracking-wider uppercase hover:bg-[#abd600] transition-colors cursor-pointer shadow-md"
            >
              Confirmar Registro
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
