import { useState } from 'react';

import petaInduk from '../../../../assets/petainteraktif/Frame-petabekasi.png';
import imgBekasi from '../../../../assets/petainteraktif/Frame-bekasi.png';
import imgKotaBekasi from '../../../../assets/petainteraktif/Frame-kotabekasi.png';
import imgJaktim from '../../../../assets/petainteraktif/Frame-jaktim.png';
import imgJakut from '../../../../assets/petainteraktif/Frame-jakut.png';
import imgKabBogor from '../../../../assets/petainteraktif/Frame-kabbogor.png';
import imgKarawang from '../../../../assets/petainteraktif/Frame-karawang.png';

export default function BatasWilayah() {
  const [hoveredWilayah, setHoveredWilayah] = useState(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const dataWilayah = [
    {
      id: 'bekasi',
      name: 'Kabupaten Bekasi',
      overlayImg: imgBekasi,
      colorLabel: 'bg-emerald-600',
    },
    {
      id: 'kotabekasi',
      name: 'Kota Bekasi',
      overlayImg: imgKotaBekasi,
      colorLabel: 'bg-amber-500',
    },
    {
      id: 'jaktim',
      name: 'Jakarta Timur',
      overlayImg: imgJaktim,
      colorLabel: 'bg-blue-600',
    },
    {
      id: 'jakut',
      name: 'Jakarta Utara',
      overlayImg: imgJakut,
      colorLabel: 'bg-cyan-600',
    },
    {
      id: 'kabbogor',
      name: 'Kabupaten Bogor',
      overlayImg: imgKabBogor,
      colorLabel: 'bg-purple-600',
    },
    {
      id: 'karawang',
      name: 'Kabupaten Karawang',
      overlayImg: imgKarawang,
      colorLabel: 'bg-rose-600',
    },
  ];

  const handleMouseMove = (e) => {
    setMousePos({ x: e.clientX, y: e.clientY });
  };

  const renderListButton = (idWilayah) => {
    const wilayah = dataWilayah.find(w => w.id === idWilayah);
    if (!wilayah) return null;
    const isHovered = hoveredWilayah?.id === wilayah.id;
    
    return (
      <button
        key={wilayah.id}
        onMouseEnter={() => setHoveredWilayah(wilayah)}
        onMouseLeave={() => setHoveredWilayah(null)}
        className={`flex items-center gap-3 w-full text-left px-4 py-2.5 rounded-lg border transition-all duration-300 ${
          isHovered 
            ? 'bg-amber-50 border-amber-400 shadow-md text-amber-700' 
            : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
        }`}
      >
        <span className={`w-3 h-3 rounded-full transition-transform duration-300 ${wilayah.color} ${isHovered ? 'scale-150' : ''}`}></span>
        <span className="font-medium text-sm sm:text-base">{wilayah.name}</span>
      </button>
    );
  };

  return (
    <div className="w-full max-w-5xl mx-auto mb-12">
      <div className="mb-6">
        <h2 className="text-24 md:text-32 font-bold text-gov-navy">
          Peta Wilayah Administrasi
        </h2>
        <p className="text-slate-600 text-14 md:text-16 mt-1">
          Arahkan kursor pada peta atau pilih nama wilayah di samping untuk menyorot batas administrasi.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
        
        {/* KOLOM KIRI (2/3): CONTAINER PETA UTAMA & OVERLAY */}
        <div 
          className="lg:col-span-2 flex justify-center items-center rounded-xl overflow-hidden border-2 border-slate-300 shadow-md bg-slate-100 select-none py-6 relative h-full"
          onMouseMove={handleMouseMove}
        >
          <div className="relative w-full max-w-[280px] sm:max-w-[320px] lg:max-w-[380px] xl:max-w-[400px]">
            
            {/* IKON MAP PIN LAUT JAWA (Bisa di-hover dari peta) */}
            <div 
              className="absolute top-1 left-3 z-30 cursor-pointer p-2"
              onMouseEnter={() => setHoveredWilayah({ id: 'laut-jawa' })}
              onMouseLeave={() => setHoveredWilayah(null)}
            >
              <svg 
                className={`text-slate-800 drop-shadow-md pointer-events-none transition-all duration-300 ease-out origin-bottom ${
                  hoveredWilayah?.id === 'laut-jawa' ? 'scale-[1.5] -translate-y-2 text-blue-600' : 'scale-100 text-slate-800'
                }`}
                width="40" height="40" viewBox="0 0 24 24" fill="currentColor"
              >
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
              </svg>
            </div>

            {/* 1. GAMBAR INDUK (402x645) */}
            <img
              src={petaInduk}
              alt="Peta Induk"
              className="w-full h-auto block rounded-md"
            />
            
            {/* 2. LAPISAN OVERLAY (Juga 402x645) - Akan otomatis menempel pas 100% */}
            {dataWilayah.map((wilayah) => {
              const isHovered = hoveredWilayah?.id === wilayah.id;
              return (
                <img
                  key={wilayah.id}
                  src={wilayah.overlayImg}
                  alt={wilayah.name}
                  className={`
                    absolute inset-0 w-full h-full pointer-events-none rounded-md
                    transition-opacity duration-300 ease-in-out
                    ${isHovered ? 'opacity-90 z-10' : 'opacity-0 z-0'}
                  `}
                />
              );
            })}

            {/* 3. AREA DETEKSI HOVER (SVG Transparan di atas peta) */}
            <svg
              viewBox="0 0 546 798"
              className="absolute inset-0 w-full h-full z-20"
            >
              <polygon
                points="180,30 330,100 470,220 490,450 380,680 260,620 190,450 130,250"
                className="fill-transparent cursor-pointer"
                onMouseEnter={() => setHoveredWilayah(dataWilayah[0])}
                onMouseLeave={() => setHoveredWilayah(null)}
              />
              <polygon
                points="70,380 160,380 180,530 90,560"
                className="fill-transparent cursor-pointer"
                onMouseEnter={() => setHoveredWilayah(dataWilayah[1])}
                onMouseLeave={() => setHoveredWilayah(null)}
              />
              <polygon
                points="0,300 70,300 85,540 0,540"
                className="fill-transparent cursor-pointer"
                onMouseEnter={() => setHoveredWilayah(dataWilayah[2])}
                onMouseLeave={() => setHoveredWilayah(null)}
              />
              <polygon
                points="0,240 125,240 125,300 0,300"
                className="fill-transparent cursor-pointer"
                onMouseEnter={() => setHoveredWilayah(dataWilayah[3])}
                onMouseLeave={() => setHoveredWilayah(null)}
              />
              <polygon
                points="0,560 250,620 350,798 0,798"
                className="fill-transparent cursor-pointer"
                onMouseEnter={() => setHoveredWilayah(dataWilayah[4])}
                onMouseLeave={() => setHoveredWilayah(null)}
              />
              <polygon
                points="350,100 546,100 546,798 360,798 480,450"
                className="fill-transparent cursor-pointer"
                onMouseEnter={() => setHoveredWilayah(dataWilayah[5])}
                onMouseLeave={() => setHoveredWilayah(null)}
              />
            </svg>
          </div>
        </div>

        {/* KOLOM KANAN (1/3): LEGENDA KELOMPOK ARAH */}
        <div className="lg:col-span-1 bg-white rounded-xl border border-slate-200 p-5 shadow-sm h-full">
          <h3 className="font-bold text-slate-800 mb-4 text-base sm:text-lg border-b pb-3">
            Batas Wilayah Administrasi
          </h3>
          
          <div className="flex flex-col gap-4">
            
            {/* KABUPATEN BEKASI (Utama) */}
            <div>
              {renderListButton('bekasi')}
            </div>

            {/* UTARA */}
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase mb-2">Utara</p>
              <button
                onMouseEnter={() => setHoveredWilayah({ id: 'laut-jawa' })}
                onMouseLeave={() => setHoveredWilayah(null)}
                className={`flex items-center gap-3 w-full text-left px-4 py-2.5 rounded-lg border transition-all duration-300 ${
                  hoveredWilayah?.id === 'laut-jawa'
                    ? 'bg-blue-50 border-blue-400 shadow-md text-blue-700'
                    : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
                }`}
              >
                <span className={`w-3 h-3 rounded-full transition-transform duration-300 ${
                  hoveredWilayah?.id === 'laut-jawa' ? 'bg-blue-500 scale-150' : 'bg-slate-300'
                }`}></span>
                <span className="font-medium text-sm sm:text-base">Laut Jawa</span>
              </button>
            </div>

            {/* TIMUR */}
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase mb-2">Timur</p>
              {renderListButton('karawang')}
            </div>

            {/* SELATAN */}
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase mb-2">Selatan</p>
              {renderListButton('kabbogor')}
            </div>

            {/* BARAT */}
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase mb-2">Barat</p>
              <div className="flex flex-col gap-2">
                {renderListButton('kotabekasi')}
                {renderListButton('jaktim')}
                {renderListButton('jakut')}
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}