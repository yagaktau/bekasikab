import React from 'react';
import heroBg from '../../../assets/struktur.jpg';
import StrukturContent from './Components/KontenStruktur';

export default function Struktur() {
  return (
    <div className="w-full bg-off-white text-charcoal pb-16 md:pb-24">
      {/* ================= HEADER PAGE ================= */}
      <div
        className="w-full relative bg-charcoal bg-cover bg-center py-16 md:py-24 flex items-center overflow-hidden"
        style={{ backgroundImage: `url(${heroBg})` }}
      >
        <div className="absolute inset-0 bg-charcoal/70"></div>

        <div className="relative z-10 w-full max-w-[1728px] mx-auto px-5 md:px-[64px]">
          <h1 className="text-34 md:text-64 font-extrabold text-off-white tracking-tight drop-shadow-md">
            Struktur
          </h1>
        </div>
      </div>

      <StrukturContent />
    </div>
  );
}