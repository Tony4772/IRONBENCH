import React, { useState } from 'react';

interface BenchGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const BenchGuideModal: React.FC<BenchGuideModalProps> = ({ isOpen, onClose }) => {
  const [selectedAngle, setSelectedAngle] = useState<'0' | '30' | '45' | '75' | '180'>('30');

  if (!isOpen) return null;

  const angleData = {
    '0': {
      title: 'Banco Plano (0°)',
      target: 'Pectoral Mayor (Porción Esternocostal) + Tríceps',
      bestFor: 'Press plano de fuerza, aperturas con codos desbloqueados, press cerrado.',
      biomechanics:
        'Máxima ventaja de empuje horizontal. Obligatorio retraer y deprimir las escápulas y mantener los pies bien anclados contra el piso ("leg drive").',
      danger: 'Codos abiertos a 90° respecto al cuerpo pinzan los tendones del supraespinoso. Mantén 45°-60°.',
    },
    '30': {
      title: 'Inclinado Clavicular (30°)',
      target: 'Pectoral Superior (Haz Clavicular)',
      bestFor: 'Press inclinado con mancuernas, elevaciones de bíceps sentado inclinado.',
      biomechanics:
        'Es el ángulo con mayor ratio de activación de haz clavicular respecto al deltoides anterior comprobado por electromiografía (EMG).',
      danger: 'Subir el respaldo a más de 45° desvía casi todo el trabajo al hombro anterior en vez del pecho alto.',
    },
    '45': {
      title: 'Inclinado Intermedio (45°)',
      target: 'Pecho Alto y Deltoides Anterior',
      bestFor: 'Press híbrido pecho-hombro, pájaros boca abajo para deltoides posterior.',
      biomechanics:
        'Excelente para remos en apoyo prono en banco (pecho apoyado) para anular trampas de inercia lumbar.',
      danger: 'Evitar hiperextensión del cuello al empujar la carga hacia arriba.',
    },
    '75': {
      title: 'Vertical Asistido (75° - 80°)',
      target: 'Deltoides Medio y Anterior + Tríceps (Copa)',
      bestFor: 'Press militar sentado con mancuernas, extensiones de tríceps copa por detrás de la nuca.',
      biomechanics:
        'Ofrece soporte a la región lumbar evitando el arqueo excesivo propio de estar completamente a 90° vertical.',
      danger: 'No dejar que los codos caigan por debajo del plano de los hombros en press militar si hay molestias articulares.',
    },
    '180': {
      title: 'Uso Funcional / Apoyo Longitudinal (180°)',
      target: 'Piernas (Búlgara), Glúteo, Core y Antebrazos',
      bestFor: 'Sentadilla búlgara (empeine elevado), elevación de piernas, curl de muñeca supino.',
      biomechanics:
        'El banco sirve como punto de apoyo de extremidad o estabilizador pélvico. Aumenta el rango de movimiento articular.',
      danger: 'En sentadilla búlgara, no flexionar la rodilla delantera hacia adentro (evitar colapso en valgo).',
    },
  };

  const current = angleData[selectedAngle];

  return (
    <div className="fixed inset-0 z-50 bg-[#060e20]/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-[#171f33] border border-[#444933] rounded-2xl max-w-2xl w-full p-6 space-y-5 shadow-2xl animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between border-b border-[#444933]/50 pb-3">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#c3f400]">airline_seat_recline_normal</span>
            <h3 className="font-['Montserrat'] font-bold text-lg text-[#ffffff]">
              Guía Técnica: Banco Ajustable y Mancuernas
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded text-[#c4c9ac] hover:text-[#ffffff] hover:bg-[#222a3d] transition-colors"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        {/* Angle Tabs */}
        <div className="grid grid-cols-5 gap-2 p-1 bg-[#131b2e] rounded-xl border border-[#444933]/40">
          {(['0', '30', '45', '75', '180'] as const).map((deg) => (
            <button
              key={deg}
              onClick={() => setSelectedAngle(deg)}
              className={`py-2 px-1 text-center rounded-lg text-xs font-['Montserrat'] font-bold transition-all cursor-pointer ${
                selectedAngle === deg
                  ? 'bg-[#c3f400] text-[#161e00] shadow-md'
                  : 'text-[#c4c9ac] hover:text-[#ffffff] hover:bg-[#222a3d]'
              }`}
            >
              {deg === '180' ? 'Plano / Apoyo' : `${deg}°`}
            </button>
          ))}
        </div>

        {/* Angle Detail Card */}
        <div className="bg-[#222a3d] border border-[#444933]/60 rounded-xl p-5 space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="font-['Montserrat'] font-bold text-base text-[#ffffff]">
              {current.title}
            </h4>
            <span className="px-2.5 py-0.5 rounded text-[11px] font-bold bg-[#c3f400]/15 text-[#c3f400] border border-[#c3f400]/30">
              {selectedAngle === '30' ? 'ÁNGULO GOLD STANDARD' : 'CALIBRACIÓN BIOMECÁNICA'}
            </span>
          </div>

          <div className="text-xs text-[#9cf0ff] font-semibold">
            Músculo Diana: <span className="text-[#dae2fd]">{current.target}</span>
          </div>

          <div className="text-xs text-[#c4c9ac] space-y-1.5 pt-1">
            <p>
              <strong className="text-[#ffffff]">Recomendado para:</strong> {current.bestFor}
            </p>
            <p>
              <strong className="text-[#c3f400]">Clave Biomecánica:</strong> {current.biomechanics}
            </p>
            <div className="p-2.5 rounded bg-[#ff5708]/15 border border-[#ff5708]/30 text-[#ffb59c] text-xs flex items-start gap-2 mt-2">
              <span className="material-symbols-outlined text-sm text-[#ff5708] mt-0.5">warning</span>
              <div>
                <strong className="text-[#ffffff]">Error Crítico:</strong> {current.danger}
              </div>
            </div>
          </div>
        </div>

        {/* 3 Golden Dumbbell Rules */}
        <div className="space-y-2">
          <div className="text-[11px] font-bold uppercase tracking-wider text-[#c4c9ac]">
            Protocolo de Entrada y Salida con Mancuernas Pesadas
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
            <div className="p-3 bg-[#131b2e] rounded-lg border border-[#444933]/40">
              <div className="font-bold text-[#c3f400] mb-1">1. Entrada con Rodillas</div>
              <p className="text-[11px] text-[#c4c9ac]">
                Coloca las mancuernas verticales sobre los muslos y patéalas una a una al tumbarte hacia atrás.
              </p>
            </div>
            <div className="p-3 bg-[#131b2e] rounded-lg border border-[#444933]/40">
              <div className="font-bold text-[#c3f400] mb-1">2. Trayectoria Convergente</div>
              <p className="text-[11px] text-[#c4c9ac]">
                Empuja en arco hacia el centro sin chocar las mancuernas; conserva la tensión en el pico contráctil.
              </p>
            </div>
            <div className="p-3 bg-[#131b2e] rounded-lg border border-[#444933]/40">
              <div className="font-bold text-[#c3f400] mb-1">3. Salida Segura</div>
              <p className="text-[11px] text-[#c4c9ac]">
                Lleva las rodillas hacia los codos para devolver las mancuernas a los muslos y sentarte de inmediato.
              </p>
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-lg bg-[#c3f400] text-[#161e00] font-['Inter'] font-bold text-xs tracking-wider uppercase hover:bg-[#abd600] transition-colors cursor-pointer"
          >
            Cerrar Guía
          </button>
        </div>
      </div>
    </div>
  );
};
