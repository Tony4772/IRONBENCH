import React from 'react';

interface FooterProps {
  onOpenGuide: () => void;
  onOpen1RM: () => void;
  onOpenSupport: () => void;
  onOpenTerms: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onOpenGuide,
  onOpen1RM,
  onOpenSupport,
  onOpenTerms,
}) => {
  return (
    <footer className="w-full py-8 px-4 sm:px-8 border-t border-[#444933]/40 flex flex-col md:flex-row items-center justify-between gap-4 bg-[#060e20] text-[#c4c9ac] mt-12">
      <div className="flex flex-col sm:flex-row items-center gap-3 text-center sm:text-left">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-[#c3f400] text-xl">fitness_center</span>
          <span className="font-['Montserrat'] font-bold text-base text-[#ffffff] tracking-tight">IRONBENCH</span>
        </div>
        <p className="font-['Inter'] text-xs text-[#8e9379] max-w-md">
          © 2025 IRONBENCH High-Performance Conditioning. Mancuernas y banco sin excusas.
        </p>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 text-xs font-['Inter'] font-semibold">
        <button
          onClick={onOpenSupport}
          className="text-[#c4c9ac] hover:text-[#c3f400] transition-colors cursor-pointer"
        >
          Soporte
        </button>
        <button
          onClick={onOpenGuide}
          className="text-[#c4c9ac] hover:text-[#c3f400] transition-colors cursor-pointer"
        >
          Guía de Mancuernas
        </button>
        <button
          onClick={onOpen1RM}
          className="text-[#c4c9ac] hover:text-[#c3f400] transition-colors cursor-pointer"
        >
          Calculadora 1RM
        </button>
        <button
          onClick={onOpenTerms}
          className="text-[#c4c9ac] hover:text-[#c3f400] transition-colors cursor-pointer"
        >
          Términos y Privacidad
        </button>
      </div>
    </footer>
  );
};
