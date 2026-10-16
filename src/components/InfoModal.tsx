import React from 'react';

interface InfoModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: 'support' | 'terms';
}

export const InfoModal: React.FC<InfoModalProps> = ({ isOpen, onClose, type }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-[#060e20]/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-[#171f33] border border-[#444933] rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between border-b border-[#444933]/50 pb-3">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#c3f400]">
              {type === 'support' ? 'support_agent' : 'policy'}
            </span>
            <h3 className="font-['Montserrat'] font-bold text-base text-[#ffffff]">
              {type === 'support' ? 'Soporte y Asistencia IRONBENCH' : 'Términos y Privacidad de Datos'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded text-[#c4c9ac] hover:text-[#ffffff] hover:bg-[#222a3d] transition-colors"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        {type === 'support' ? (
          <div className="space-y-3 text-xs text-[#c4c9ac] leading-relaxed">
            <p>
              IRONBENCH está diseñado para optimizar entrenamientos de alta densidad en casa o en gimnasio comercial utilizando exclusivamente mancuernas y banco regulable.
            </p>
            <div className="p-3 bg-[#131b2e] rounded-xl border border-[#444933]/40 space-y-2">
              <div className="font-bold text-[#ffffff]">Preguntas Frecuentes:</div>
              <div>
                <strong className="text-[#c3f400] block">¿Cómo calibrar la sobrecarga progresiva?</strong>
                Anota el peso y las repeticiones de cada serie efectiva. Cuando alcances el límite superior del rango (ej. 12 reps con RPE &le; 8), incrementa la carga en 2 kg en la siguiente sesión.
              </div>
              <div>
                <strong className="text-[#c3f400] block">¿Cómo usar el cronómetro de descanso?</strong>
                El cronómetro automático de 60 segundos previene tiempos muertos, garantizando que el entrenamiento completo se ejecute en 35 a 40 minutos.
              </div>
            </div>
            <p className="text-[11px] text-[#8e9379]">
              Contacto técnico: <strong className="text-[#dae2fd]">conditioning@ironbench.app</strong>
            </p>
          </div>
        ) : (
          <div className="space-y-3 text-xs text-[#c4c9ac] leading-relaxed">
            <p>
              <strong>Privacidad 100% Local:</strong> Tus métricas corporales (peso, grasa, perímetros de cintura y brazos) y tus registros de series se almacenan localmente en tu dispositivo. Ningún dato biométrico personal es transmitido a servidores externos sin tu consentimiento expreso.
            </p>
            <div className="p-3 bg-[#131b2e] rounded-xl border border-[#444933]/40 space-y-1">
              <div className="font-bold text-[#ffffff]">Seguridad y Descargo de Responsabilidad:</div>
              <p className="text-[11px]">
                Antes de iniciar programas de levantamiento de cargas pesadas o sobrecarga progresiva, consulta con un profesional de la salud. Ejecuta siempre el protocolo de calentamiento y estabilización articular previo a la carga.
              </p>
            </div>
          </div>
        )}

        <div className="flex justify-end pt-2">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-lg bg-[#c3f400] text-[#161e00] font-['Inter'] font-bold text-xs uppercase tracking-wider hover:bg-[#abd600] transition-colors cursor-pointer"
          >
            Entendido
          </button>
        </div>
      </div>
    </div>
  );
};
