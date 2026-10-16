import React from 'react';

interface NotificationsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NotificationsModal: React.FC<NotificationsModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const notifications = [
    {
      id: 1,
      title: 'Sobrecarga Progresiva Disponible',
      desc: 'En tu última sesión completaste 24kg x 11 reps en Press Plano. Hoy se sugiere probar 24kg x 12 reps o saltar a 26kg.',
      time: 'Hoy 07:30 AM',
      unread: true,
      icon: 'trending_up',
      color: '#c3f400',
    },
    {
      id: 2,
      title: '¡Racha de 5 Días Consolidada!',
      desc: 'Mantén la consistencia hoy para desbloquear el hito de 1 semana ininterrumpida de hipertrofia concentrada.',
      time: 'Ayer 20:15',
      unread: false,
      icon: 'timer',
      color: '#ff5708',
    },
    {
      id: 3,
      title: 'Medición Antropométrica Actualizada',
      desc: 'Tu cintura ha bajado a 82.0 cm (-3 cm acumulados). Tu masa muscular magra en brazos subió +1.2 cm.',
      time: '14 Octubre',
      unread: false,
      icon: 'straighten',
      color: '#9cf0ff',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-[#060e20]/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-[#171f33] border border-[#444933] rounded-2xl max-w-md w-full p-5 space-y-4 shadow-2xl animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between border-b border-[#444933]/50 pb-3">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#c3f400]">notifications</span>
            <h3 className="font-['Montserrat'] font-bold text-base text-[#ffffff]">
              Notificaciones de Rendimiento
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded text-[#c4c9ac] hover:text-[#ffffff] hover:bg-[#222a3d] transition-colors"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <div className="space-y-2.5 max-h-80 overflow-y-auto no-scrollbar">
          {notifications.map((n) => (
            <div
              key={n.id}
              className={`p-3 rounded-xl border transition-colors ${
                n.unread
                  ? 'bg-[#222a3d] border-[#c3f400]/40 shadow-sm'
                  : 'bg-[#131b2e] border-[#444933]/30'
              }`}
            >
              <div className="flex items-start gap-2.5">
                <div
                  className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5"
                  style={{ backgroundColor: `${n.color}20`, color: n.color }}
                >
                  <span className="material-symbols-outlined text-base">{n.icon}</span>
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-[#ffffff]">{n.title}</h4>
                    <span className="text-[10px] text-[#8e9379]">{n.time}</span>
                  </div>
                  <p className="text-xs text-[#c4c9ac] mt-1 leading-relaxed">{n.desc}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-end pt-2">
          <button
            onClick={onClose}
            className="w-full py-2 rounded-lg bg-[#222a3d] hover:bg-[#2d3449] text-xs font-bold text-[#dae2fd] transition-colors cursor-pointer"
          >
            Marcar todas como leídas
          </button>
        </div>
      </div>
    </div>
  );
};
