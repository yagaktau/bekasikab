import React from 'react';
import heroBg from '../../../assets/lambang.jpg';
import LambangGrid from './Components/GridLambang';

export default function Lambang() {
  return (
    <div className="w-full pb-16 md:pb-24">
      {/* ================= HERO BANNER ================= */}
      <div
        className="w-full relative bg-gov-navy bg-cover bg-center py-16 md:py-24 flex items-center overflow-hidden"
        style={{ backgroundImage: `url(${heroBg})` }}
      >
        <div className="absolute inset-0 bg-black/50"></div>

        <div className="relative z-10 w-full max-w-[1728px] mx-auto px-5 md:px-[64px]">
          <h1 className="text-34 md:text-64 font-extrabold text-white tracking-tight drop-shadow-md">
            Lambang
          </h1>
        </div>
      </div>

      {/* ================= KONTEN UTAMA ================= */}
      <div className="w-full max-w-[1728px] mx-auto px-5 md:px-[64px] py-2">
        <LambangGrid />
      </div>
    </div>
  );
}