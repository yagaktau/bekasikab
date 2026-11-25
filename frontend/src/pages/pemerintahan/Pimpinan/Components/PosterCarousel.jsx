import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

export default function PosterCarousel({ dataPimpinan = [], onSelectLeader }) {
  const containerRef = useRef(null);
  const isJumpingRef = useRef(false);
  const scrollTimeoutRef = useRef(null);

  // Jika database masih kosong
  if (dataPimpinan.length === 0) {
    return (
      <div className="w-full max-w-[1728px] mx-auto px-5 md:px-[64px] py-24 text-center">
        <div className="bg-mint-gray border border-sage-green/25 rounded-2xl p-12 max-w-xl mx-auto shadow-sm">
          <div className="w-16 h-16 bg-forest-green/10 text-forest-green rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
            !
          </div>
          <h3 className="text-2xl font-bold text-forest-green mb-2">
            Belum Ada Data Pimpinan
          </h3>
          <p className="text-charcoal text-sm">
            Data pimpinan akan ditampilkan di sini setelah ditambahkan melalui
            Dashboard Admin.
          </p>
        </div>
      </div>
    );
  }

  // Gandakan menjadi 3 set (Kiri - Tengah - Kanan) agar bisa loop ke dua arah
  const isLoopable = dataPimpinan.length > 1;
  const loopingLeaders = isLoopable
    ? [...dataPimpinan, ...dataPimpinan, ...dataPimpinan]
    : dataPimpinan;

  // Atur posisi awal langsung ke kartu pertama pada set tengah
  useEffect(() => {
    const container = containerRef.current;
    if (!container || !isLoopable) return;

    const setInitialPosition = () => {
      const cards = container.querySelectorAll('[data-carousel-card]');
      const firstMiddleCard = cards[dataPimpinan.length];
      if (firstMiddleCard) {
        const centerOffset =
          (container.clientWidth - firstMiddleCard.offsetWidth) / 2;
        container.style.scrollBehavior = 'auto';
        container.scrollLeft = firstMiddleCard.offsetLeft - centerOffset;
      }
    };

    const rafId = requestAnimationFrame(setInitialPosition);
    window.addEventListener('resize', setInitialPosition);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('resize', setInitialPosition);
      if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);
    };
  }, [dataPimpinan, isLoopable]);

  // Kembalikan posisi scroll secara diam-diam ke set tengah saat melewati batas
  const handleScroll = () => {
    const container = containerRef.current;
    if (!container || isJumpingRef.current || !isLoopable) return;

    const cards = container.querySelectorAll('[data-carousel-card]');
    const n = dataPimpinan.length;
    if (cards.length < n * 3) return;

    const singleSetWidth = cards[n].offsetLeft - cards[0].offsetLeft;
    if (singleSetWidth <= 0) return;

    const teleport = (delta) => {
      isJumpingRef.current = true;
      container.style.scrollBehavior = 'auto';
      container.scrollLeft += delta;
      requestAnimationFrame(() => {
        isJumpingRef.current = false;
      });
    };

    // Antisipasi swipe cepat agar tidak mentok ujung kontainer
    if (container.scrollLeft <= singleSetWidth * 0.25) {
      teleport(singleSetWidth);
      return;
    }
    if (container.scrollLeft >= singleSetWidth * 1.75) {
      teleport(-singleSetWidth);
      return;
    }

    // Setelah snap berhenti, pusatkan kembali posisi ke set tengah
    if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);
    scrollTimeoutRef.current = setTimeout(() => {
      if (!container) return;
      const currentCards = container.querySelectorAll('[data-carousel-card]');
      if (currentCards.length < n * 3) return;

      const setWidth = currentCards[n].offsetLeft - currentCards[0].offsetLeft;
      const centerOffset =
        (container.clientWidth - currentCards[n].offsetWidth) / 2;
      const middleStart = currentCards[n].offsetLeft - centerOffset;
      const middleEnd = middleStart + setWidth;

      if (container.scrollLeft < middleStart - 10) {
        teleport(setWidth);
      } else if (container.scrollLeft >= middleEnd - 10) {
        teleport(-setWidth);
      }
    }, 120);
  };

  return (
    <div className="w-full max-w-[1728px] mx-auto px-0 md:px-[64px] py-12 md:py-16 overflow-hidden">
      <div
        ref={containerRef}
        onScroll={handleScroll}
        className="flex flex-row w-full h-[500px] md:h-[650px] gap-4 md:gap-1 overflow-x-auto md:overflow-visible snap-x snap-mandatory md:snap-none -skew-x-[8deg] md:px-8 px-5 py-4 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
      >
        {loopingLeaders.map((leader, index) => {
          const isMiddleSet =
            !isLoopable ||
            (index >= dataPimpinan.length && index < dataPimpinan.length * 2);

          return (
            <motion.div
              key={`${leader.id}-${index}`}
              data-carousel-card
              initial={{ opacity: 1, y: 0 }}
              animate={{ opacity: 1, y: 0 }}
              className={`group relative flex-none w-[82vw] md:w-auto h-full snap-center bg-charcoal rounded-xl md:rounded-none overflow-hidden cursor-pointer transition-all duration-500 ease-out shadow-xl border border-sage-green/30
                ${
                  isMiddleSet
                    ? 'block md:flex-1 md:first:rounded-l-xl md:last:rounded-r-xl md:hover:flex-[1.2]'
                    : 'block md:hidden'
                }
              `}
              onClick={() => onSelectLeader(leader)}
            >
              {/* Image Un-skew Wrapper */}
              <div className="absolute inset-0 -inset-x-[15%] w-[130%] skew-x-[8deg] bg-charcoal">
                <img
                  src={
                    leader.fotoUrl ||
                    'https://via.placeholder.com/600x900?text=Foto+Pimpinan'
                  }
                  alt={leader.namaLengkap}
                  className="absolute inset-0 w-full h-full pt-20 md:pt-24 object-cover object-top transition-transform duration-700 ease-out group-hover:scale-110"
                  onError={(e) => {
                    e.target.src =
                      'https://via.placeholder.com/600x900?text=Foto+Pimpinan';
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-b from-charcoal/85 via-transparent to-charcoal/95 opacity-85 group-hover:opacity-95 transition-opacity duration-300"></div>
              </div>

              {/* Text Un-skew Wrapper */}
              <div className="absolute inset-0 p-6 md:p-8 flex flex-col justify-between items-center z-10 pointer-events-none skew-x-[8deg]">
                {/* 1. JABATAN DI TENGAH ATAS */}
                <div className="w-full text-center mt-2 transform transition-transform duration-500 group-hover:translate-y-2">
                  <h2 className="text-24 md:text-28 font-black text-mint-gray uppercase tracking-widest drop-shadow-lg">
                    {leader.jabatan}
                  </h2>
                </div>

                {/* 2. NAMA DAN TOMBOL DI TENGAH BAWAH */}
                <div className="w-full flex flex-col items-center text-center mb-2 transform transition-transform duration-500 group-hover:-translate-y-2">
                  <div className="w-12 h-1 bg-sage-green mb-4 rounded-full"></div>
                  <h3 className="text-20 md:text-26 font-bold text-off-white mb-4 drop-shadow-md leading-tight">
                    {leader.namaLengkap}
                  </h3>

                  <div className="opacity-0 translate-y-4 transition-all duration-500 group-hover:opacity-100 group-hover:translate-y-0 pointer-events-auto">
                    <span className="inline-block px-6 py-2.5 border border-sage-green/70 rounded-full text-14 text-off-white font-semibold backdrop-blur-md bg-forest-green/90 hover:bg-sage-green transition-colors shadow-md">
                      Lihat Profil Detail
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}