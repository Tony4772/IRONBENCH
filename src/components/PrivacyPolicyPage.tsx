import React from 'react';

interface PrivacyPolicyPageProps {
  onClose: () => void;
}

export const PrivacyPolicyPage: React.FC<PrivacyPolicyPageProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 z-[60] bg-[#0b1326] text-[#dae2fd] overflow-y-auto">
      <div className="max-w-3xl mx-auto px-4 sm:px-8 py-6 pb-28">
        <div className="flex items-start justify-between gap-4 mb-8">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-wider text-[#c3f400] mb-2">
              EBYZOM E.I.R.L.
            </p>
            <h1 className="font-['Montserrat'] font-bold text-2xl sm:text-4xl text-[#ffffff] tracking-tight">
              Política de privacidad
            </h1>
            <p className="text-sm text-[#c4c9ac] mt-2">IRONBENCH · Vigente desde el 15 de octubre de 2026</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="shrink-0 px-3 py-2 rounded-lg bg-[#171f33] border border-[#444933] text-xs font-bold text-[#ffffff] hover:border-[#c3f400] cursor-pointer"
          >
            Cerrar
          </button>
        </div>

        <div className="space-y-8 text-sm leading-relaxed text-[#c4c9ac]">
          <section className="space-y-2">
            <h2 className="font-['Montserrat'] font-bold text-lg text-[#ffffff]">1. Quién es responsable</h2>
            <p>
              IRONBENCH es una aplicación de diseño y creación de <strong className="text-[#ffffff]">EBYZOM E.I.R.L.</strong> EBYZOM E.I.R.L. es la responsable del tratamiento de los datos personales que esta aplicación guarda en tu dispositivo.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="font-['Montserrat'] font-bold text-lg text-[#ffffff]">2. Qué datos se guardan</h2>
            <p>Solo se almacenan los datos que tú introduces mientras usas la aplicación:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Series, pesos, repeticiones, RPE y notas de entrenamiento.</li>
              <li>Medidas corporales: peso, porcentaje de grasa estimado y perímetros.</li>
              <li>Historial de sesiones, racha y los días que marques como descanso.</li>
            </ul>
            <p>IRONBENCH no te pide cuenta, nombre legal, documento de identidad, correo ni ubicación para funcionar.</p>
          </section>

          <section className="space-y-2">
            <h2 className="font-['Montserrat'] font-bold text-lg text-[#ffffff]">3. Dónde se guardan</h2>
            <p>
              Esos datos permanecen en el almacenamiento local del navegador de este dispositivo (localStorage). No se envían a un servidor de EBYZOM E.I.R.L. para crear un perfil ni para entrenar modelos. Si borras los datos del sitio en el navegador, se eliminan de este dispositivo.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="font-['Montserrat'] font-bold text-lg text-[#ffffff]">4. Para qué se usan</h2>
            <p>
              Sirven para mostrarte tu rutina, tu progreso y tu historial dentro de IRONBENCH. No se venden, no se ceden a anunciantes y no se usan para elaborar publicidad personalizada.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="font-['Montserrat'] font-bold text-lg text-[#ffffff]">5. Terceros que pueden recibir una conexión</h2>
            <p>
              Al abrir la aplicación, el navegador puede solicitar tipografías a Google Fonts. Las fotografías de demostración pueden cargarse desde servidores de Google. Esas peticiones las hace tu navegador para mostrar la interfaz; EBYZOM E.I.R.L. no adjunta a esas peticiones tu peso, tus series ni tus notas.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="font-['Montserrat'] font-bold text-lg text-[#ffffff]">6. Cuánto tiempo se conservan</h2>
            <p>
              Se conservan en este navegador hasta que tú los borres, cambies de navegador o limpies los datos del sitio. No hay una copia en la nube que EBYZOM E.I.R.L. pueda recuperar.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="font-['Montserrat'] font-bold text-lg text-[#ffffff]">7. Tus derechos</h2>
            <p>
              Puedes ver y corregir tus medidas y tus sesiones dentro de la aplicación. Puedes suprimirlos borrando los datos de navegación de este sitio. Si quieres ejercer acceso, rectificación, cancelación u oposición respecto de esta política, usa la sección Soporte de IRONBENCH e indica que la solicitud va dirigida a EBYZOM E.I.R.L.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="font-['Montserrat'] font-bold text-lg text-[#ffffff]">8. Menores de edad</h2>
            <p>
              IRONBENCH no está dirigida a menores de edad. No recopilamos a sabiendas datos de niños.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="font-['Montserrat'] font-bold text-lg text-[#ffffff]">9. Salud y entrenamiento</h2>
            <p>
              Las cifras de la aplicación son un registro personal de entrenamiento. No son un diagnóstico ni una prescripción médica. Antes de cargar peso, consulta a un profesional de la salud si tienes una lesión o una condición que lo requiera.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="font-['Montserrat'] font-bold text-lg text-[#ffffff]">10. Cambios</h2>
            <p>
              Si esta política cambia, la fecha de vigencia de esta página se actualizará. El uso continuado de IRONBENCH después de ese cambio supone que conoces la versión publicada aquí.
            </p>
          </section>

          <p className="text-xs text-[#8e9379] border-t border-[#444933]/40 pt-4">
            Diseño y creación de EBYZOM E.I.R.L. IRONBENCH es una marca de uso de esa aplicación.
          </p>
        </div>
      </div>
    </div>
  );
};
