import React from 'react';
import heroBg from '../../../assets/daftar.jpg';
import PerangkatList from './Components/Daftar';

export default function DaftarPerangkat() {
  return (
    <div className="w-full bg-white overflow-hidden pb-16 md:pb-24">
      {/* ================= HERO BANNER ================= */}
      <div
        className="w-full relative bg-gov-navy bg-cover bg-center py-16 md:py-24 flex items-center overflow-hidden"
        style={{ backgroundImage: `url(${heroBg})` }}
      >
        <div className="absolute inset-0 bg-black/50"></div>

        <div className="relative z-10 w-full max-w-[1728px] mx-auto px-5 md:px-[64px]">
          <h1 className="text-34 md:text-64 font-extrabold text-white tracking-tight drop-shadow-md">
            Daftar Perangkat
          </h1>
        </div>
      </div>

      {/* ================= KONTEN UTAMA ================= */}
      <PerangkatList />
      
    </div>
  );
}