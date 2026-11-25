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

  const dataWilayah = [
    {
      id: 'bekasi',
      name: 'Kabupaten Bekasi',
      arah: 'Wilayah Utama',
      overlayImg: imgBekasi,
      colorLabel: 'bg-emerald-600',
      mobilePos: 'top-[38%] left-[44%]',
    },
    {
      id: 'kotabekasi',
      name: 'Kota Bekasi',
      arah: 'Barat',
      overlayImg: imgKotaBekasi,
      colorLabel: 'bg-amber-500',
      mobilePos: 'top-[53%] left-[18%]',
    },
    {
      id: 'jaktim',
      name: 'Kota Jakarta Timur',
      arah: 'Barat',
      overlayImg: imgJaktim,
      colorLabel: 'bg-blue-600',
      mobilePos: 'top-[47%] left-[2%]',
    },
    {
      id: 'jakut',
      name: 'Kota Jakarta Utara',
      arah: 'Barat',
      overlayImg: imgJakut,
      colorLabel: 'bg-cyan-600',
      mobilePos: 'top-[31%] left-[2%]',
    },
    {
      id: 'kabbogor',
      name: 'Kabupaten Bogor',
      arah: 'Selatan',
      overlayImg: imgKabBogor,
      colorLabel: 'bg-purple-600',
      mobilePos: 'bottom-[6%] left-[10%]',
    },
    {
      id: 'karawang',
      name: 'Kabupaten Karawang',
      arah: 'Timur',
      overlayImg: imgKarawang,
      colorLabel: 'bg-rose-600',
      mobilePos: 'top-[52%] right-[2%]',
    },
  ];

  const dataLautJawa = {
    id: 'laut-jawa',
    name: 'Laut Jawa',
    arah: 'Utara',
    mobilePos: 'top-[4%] left-[22%]',
  };

  const handleSelect = (wilayah) => {
    setHoveredWilayah((prev) => (prev?.id === wilayah.id ? null : wilayah));
  };

  const handleHoverEnter = (e, wilayah) => {
    if (e.pointerType === 'mouse') {
      setHoveredWilayah(wilayah);
    }
  };

  const handleHoverLeave = (e) => {
    if (e.pointerType === 'mouse') {
      setHoveredWilayah(null);
    }
  };

  const renderListButton = (idWilayah) => {
    const wilayah = dataWilayah.find((w) => w.id === idWilayah);
    if (!wilayah) return null;
    const isHovered = hoveredWilayah?.id === wilayah.id;

    return (
      <button
        key={wilayah.id}
        onMouseEnter={() => setHoveredWilayah(wilayah)}
        onMouseLeave={() => setHoveredWilayah(null)}
        className={`flex items-center gap-3 w-full text-left px-4 py-2.5 rounded-lg border transition-all duration-300 ${
          isHovered
            ? 'bg-sage-green border-sage-green shadow-md text-off-white'
            : 'border-sage-green/20 bg-off-white hover:bg-sage-green/15 text-charcoal'
        }`}
      >
        <span
          className={`w-3 h-3 rounded-full transition-transform duration-300 ${
            wilayah.colorLabel
          } ${isHovered ? 'scale-150 ring-2 ring-off-white' : ''}`}
        ></span>
        <span className="font-medium text-14 md:text-16">{wilayah.name}</span>
      </button>
    );
  };

  return (
    <div className="w-full max-w-5xl mx-auto mb-12">
      <div className="mb-6">
        <h2 className="text-24 md:text-34 font-bold text-forest-green border-b-2 border-sage-green pb-2 inline-block">
          Peta Wilayah Administrasi
        </h2>
        <p className="text-charcoal text-14 md:text-16 leading-relaxed mt-2">
          <span className="lg:hidden">
            Ketuk wilayah atau pin pada peta untuk melihat batas administrasi.
          </span>
          <span className="hidden lg:inline">
            Arahkan kursor pada peta atau pilih nama wilayah di samping untuk menyorot batas administrasi.
          </span>
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
        {/* KOLOM KIRI (2/3): CONTAINER PETA UTAMA & OVERLAY */}
        <div className="lg:col-span-2 flex justify-center items-center rounded-xl overflow-hidden border-2 border-sage-green/30 shadow-md bg-mint-gray select-none p-4 relative">
          <div className="w-full flex justify-center items-center lg:absolute lg:inset-0 lg:p-4">
            <div className="relative w-full max-w-[300px] sm:max-w-[340px] lg:max-w-none lg:w-fit lg:h-full">
              {/* IKON MAP PIN LAUT JAWA */}
              <div
                className="absolute top-1 left-3 z-30 cursor-pointer p-2"
                onClick={() => handleSelect(dataLautJawa)}
                onPointerEnter={(e) => handleHoverEnter(e, dataLautJawa)}
                onPointerLeave={handleHoverLeave}
              >
                <svg
                  className={`drop-shadow-md pointer-events-none transition-all duration-300 ease-out origin-bottom ${
                    hoveredWilayah?.id === 'laut-jawa'
                      ? 'scale-[1.5] -translate-y-2 text-sage-green'
                      : 'scale-100 text-forest-green'
                  }`}
                  width="40"
                  height="40"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
                </svg>
              </div>

              {/* 1. GAMBAR INDUK */}
              <img
                src={petaInduk}
                alt="Peta Induk"
                className="w-full h-auto lg:h-full lg:w-auto block rounded-md"
              />

              {/* 2. LAPISAN OVERLAY */}
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

              {/* 3. AREA DETEKSI HOVER & KLIK (SVG) */}
              <svg
                viewBox="0 0 546 798"
                className="absolute inset-0 w-full h-full z-20"
              >
                <polygon
                  points="180,30 330,100 470,220 490,450 380,680 260,620 190,450 130,250"
                  className="fill-transparent cursor-pointer"
                  onClick={() => handleSelect(dataWilayah[0])}
                  onPointerEnter={(e) => handleHoverEnter(e, dataWilayah[0])}
                  onPointerLeave={handleHoverLeave}
                />
                <polygon
                  points="70,380 160,380 180,530 90,560"
                  className="fill-transparent cursor-pointer"
                  onClick={() => handleSelect(dataWilayah[1])}
                  onPointerEnter={(e) => handleHoverEnter(e, dataWilayah[1])}
                  onPointerLeave={handleHoverLeave}
                />
                <polygon
                  points="0,300 70,300 85,540 0,540"
                  className="fill-transparent cursor-pointer"
                  onClick={() => handleSelect(dataWilayah[2])}
                  onPointerEnter={(e) => handleHoverEnter(e, dataWilayah[2])}
                  onPointerLeave={handleHoverLeave}
                />
                <polygon
                  points="0,240 125,240 125,300 0,300"
                  className="fill-transparent cursor-pointer"
                  onClick={() => handleSelect(dataWilayah[3])}
                  onPointerEnter={(e) => handleHoverEnter(e, dataWilayah[3])}
                  onPointerLeave={handleHoverLeave}
                />
                <polygon
                  points="0,560 250,620 350,798 0,798"
                  className="fill-transparent cursor-pointer"
                  onClick={() => handleSelect(dataWilayah[4])}
                  onPointerEnter={(e) => handleHoverEnter(e, dataWilayah[4])}
                  onPointerLeave={handleHoverLeave}
                />
                <polygon
                  points="350,100 546,100 546,798 360,798 480,450"
                  className="fill-transparent cursor-pointer"
                  onClick={() => handleSelect(dataWilayah[5])}
                  onPointerEnter={(e) => handleHoverEnter(e, dataWilayah[5])}
                  onPointerLeave={handleHoverLeave}
                />
              </svg>

              {/* 4. FLOATING LABEL KHUSUS MOBILE */}
              {hoveredWilayah && (
                <div
                  className={`lg:hidden absolute z-40 pointer-events-none ${hoveredWilayah.mobilePos}`}
                >
                  <div className="bg-off-white/95 backdrop-blur-sm border border-sage-green/40 shadow-lg rounded-lg px-2.5 py-1.5 whitespace-nowrap">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-sage-green leading-none mb-0.5">
                      {hoveredWilayah.arah}
                    </p>
                    <p className="text-13 font-bold text-forest-green leading-tight">
                      {hoveredWilayah.name}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* KOLOM KANAN (1/3): LEGENDA KELOMPOK ARAH (Mint Gray) */}
        <div className="hidden lg:block lg:col-span-1 bg-mint-gray rounded-xl border border-sage-green/20 p-5 shadow-sm">
          <h3 className="font-bold text-forest-green mb-4 text-18 md:text-20 border-b border-sage-green/20 pb-3">
            Batas Wilayah Administrasi
          </h3>

          <div className="flex flex-col gap-4">
            {/* KABUPATEN BEKASI (Utama) */}
            <div>{renderListButton('bekasi')}</div>

            {/* UTARA */}
            <div>
              <p className="text-13 font-bold text-forest-green/75 uppercase mb-2">
                Utara
              </p>
              <button
                onMouseEnter={() => setHoveredWilayah(dataLautJawa)}
                onMouseLeave={() => setHoveredWilayah(null)}
                className={`flex items-center gap-3 w-full text-left px-4 py-2.5 rounded-lg border transition-all duration-300 ${
                  hoveredWilayah?.id === 'laut-jawa'
                    ? 'bg-sage-green border-sage-green shadow-md text-off-white'
                    : 'border-sage-green/20 bg-off-white hover:bg-sage-green/15 text-charcoal'
                }`}
              >
                <span
                  className={`w-3 h-3 rounded-full transition-transform duration-300 ${
                    hoveredWilayah?.id === 'laut-jawa'
                      ? 'bg-off-white scale-150'
                      : 'bg-sage-green'
                  }`}
                ></span>
                <span className="font-medium text-14 md:text-16">
                  Laut Jawa
                </span>
              </button>
            </div>

            {/* TIMUR */}
            <div>
              <p className="text-13 font-bold text-forest-green/75 uppercase mb-2">
                Timur
              </p>
              {renderListButton('karawang')}
            </div>

            {/* SELATAN */}
            <div>
              <p className="text-13 font-bold text-forest-green/75 uppercase mb-2">
                Selatan
              </p>
              {renderListButton('kabbogor')}
            </div>

            {/* BARAT */}
            <div>
              <p className="text-13 font-bold text-forest-green/75 uppercase mb-2">
                Barat
              </p>
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