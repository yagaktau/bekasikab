import React, { useEffect, useRef } from 'react';
import kabbekasi from '../../../../assets/logo-bekasi.png';
import { leftItems, rightItems, gelombangTags } from '../../../../data/lambangData';

export default function LambangGrid() {
  const revealRefs = useRef([]);
  revealRefs.current = [];

  const addToRefs = (el) => {
    if (el && !revealRefs.current.includes(el)) {
      revealRefs.current.push(el);
    }
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('opacity-100', 'translate-y-0');
            entry.target.classList.remove('opacity-0', 'translate-y-24');
          }
        });
      },
      { threshold: 0.15 }
    );

    revealRefs.current.forEach((ref) => {
      observer.observe(ref);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <>
      <div className="mt-12 md:mt-16 mb-8">
        <h2 className="text-32 md:text-48 font-bold text-gov-navy border-b-2 border-bekasi-green pb-2 inline-block">
          Lambang Kabupaten Bekasi
        </h2>
      </div>

      {/* GRID LAYOUT (Kiri - Tengah - Kanan) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12 items-center relative">
        
        {/* KOLOM KIRI */}
        <div className="flex flex-col gap-6 order-2 lg:order-1">
          {leftItems.map((item, index) => (
            <div
              key={`left-${index}`}
              ref={addToRefs}
              className="group opacity-0 translate-y-24 transition-all duration-700 ease-out bg-[#D8C7C6]/60 rounded-xl p-6 md:p-8 cursor-default hover:bg-[#0B5D34] hover:shadow-xl border border-transparent hover:border-[#0B5D34]"
            >
              <h3 className="text-24 md:text-28 font-bold text-slate-900 group-hover:text-white transition-colors duration-300 mb-3 text-justify lg:text-right">
                {item.title}
              </h3>
              <p className="text-14 md:text-16 text-slate-700 group-hover:text-slate-100 transition-colors duration-300 text-justify lg:text-right">
                {item.desc}
              </p>
            </div>
          ))}
        </div>

        {/* KOLOM TENGAH (LAMBANG) */}
        <div 
          ref={addToRefs}
          className="flex justify-center items-center order-1 lg:order-2 opacity-0 translate-y-24 transition-all duration-1000 ease-out"
        >
          <img 
            src={kabbekasi} 
            alt="Lambang Kabupaten Bekasi" 
            className="w-48 md:w-64 lg:w-80 h-auto max-h-[250px] lg:max-h-[350px] object-contain drop-shadow-2xl hover:scale-105 transition-transform duration-500"
          />
        </div>

        {/* KOLOM KANAN */}
        <div className="flex flex-col gap-6 order-3 lg:order-3">
          {rightItems.map((item, index) => (
            <div
              key={`right-${index}`}
              ref={addToRefs}
              className="group opacity-0 translate-y-24 transition-all duration-700 ease-out bg-[#D8C7C6]/60 rounded-xl p-6 md:p-8 cursor-default hover:bg-[#0B5D34] hover:shadow-xl border border-transparent hover:border-[#0B5D34]"
            >
              <h3 className="text-24 md:text-28 font-bold text-slate-900 group-hover:text-white transition-colors duration-300 mb-3 text-justify lg:text-left">
                {item.title}
              </h3>
              <p className="text-14 md:text-16 text-slate-700 group-hover:text-slate-100 transition-colors duration-300 text-justify lg:text-left">
                {item.desc}
              </p>
            </div>
          ))}
        </div>

      </div>

      {/* KOLOM BAWAH (GELOMBANG AIR) */}
      <div className="mt-8 lg:mt-12 w-full flex justify-center">
        <div 
          ref={addToRefs}
          className="group opacity-0 translate-y-24 transition-all duration-700 ease-out bg-[#D8C7C6]/60 rounded-xl p-6 md:p-10 w-full lg:w-2/3 cursor-default hover:bg-[#0B5D34] hover:shadow-xl border border-transparent hover:border-[#0B5D34]"
        >
          <h3 className="text-24 md:text-28 font-bold text-slate-900 group-hover:text-white transition-colors duration-300 mb-4 text-center">
            Gelombang Air
          </h3>
          <p className="text-14 md:text-16 text-slate-700 group-hover:text-slate-100 transition-colors duration-300 text-center mb-6">
            Terdiri dari 6 gelombang yang melambangkan semangat perjuangan tiada henti dan melambangkan 6 zaman yang dialami Kabupaten Bekasi, yaitu:
          </p>
          
          <div className="flex flex-wrap justify-center gap-3">
            {gelombangTags.map((tag, index) => (
              <span 
                key={index}
                className="bg-[#A48887]/30 text-slate-800 font-medium px-4 py-2 rounded-full text-14 md:text-16 group-hover:bg-white/20 group-hover:text-white transition-colors duration-300"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}