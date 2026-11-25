import { useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import heroBg from '../../../assets/pimpinan.jpg';
import PosterCarousel from './Components/PosterCarousel';
import ProfileModal from './Components/ProfileModal';
import DesktopPimpinanList from './Components/DesktopPimpinan';

export default function Pimpinan() {
  const [selectedLeader, setSelectedLeader] = useState(null);
  const [dataPimpinan, setDataPimpinan] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);

    const currentIP = window.location.hostname;
    const apiUrl = `http://${currentIP}:5000/api/pimpinan`;

    fetch(apiUrl)
      .then((res) => res.json())
      .then((data) => {
        const dataFotoValid = data.map((item) => {
          if (!item.fotoUrl) return item;
          const namaFile = item.fotoUrl.substring(item.fotoUrl.lastIndexOf('/') + 1);
          return {
            ...item,
            fotoUrl: `http://${currentIP}:5000/uploads/${namaFile}`,
          };
        });

        setDataPimpinan(dataFotoValid);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error('Gagal mengambil data pimpinan:', err);
        setIsLoading(false);
      });
  }, []);

  return (
    <div className="w-full min-h-screen bg-off-white text-charcoal pb-16 md:pb-24 overflow-x-hidden">
      {/* 1. HERO BANNER (Charcoal tanpa garis bawah) */}
      <div
        className="w-full relative bg-charcoal bg-cover bg-center py-16 md:py-24 flex items-center overflow-hidden"
        style={{ backgroundImage: `url(${heroBg})` }}
      >
        <div className="absolute inset-0 bg-charcoal/70"></div>
        <div className="relative z-10 w-full max-w-[1728px] mx-auto px-5 md:px-[64px]">
          <h1 className="text-34 md:text-64 font-extrabold text-off-white tracking-tight drop-shadow-md">
            Pimpinan
          </h1>
        </div>
      </div>

      {/* 2. KONTEN UTAMA */}
      {isLoading ? (
        <div className="text-forest-green font-semibold text-center py-20 text-xl">
          Memuat data pimpinan...
        </div>
      ) : (
        <>
          {/* TAMPILAN MOBILE: Tetap pakai PosterCarousel */}
          <div className="block md:hidden">
            <PosterCarousel
              dataPimpinan={dataPimpinan}
              onSelectLeader={(leader) => setSelectedLeader(leader)}
            />
          </div>

          {/* TAMPILAN DESKTOP: Layout 2 kolom (tanpa modal) */}
          <div className="hidden md:block">
            <DesktopPimpinanList dataPimpinan={dataPimpinan} />
          </div>
        </>
      )}

      {/* 3. MODAL POPUP DETAIL (Hanya aktif untuk Mobile) */}
      <div className="md:hidden">
        <AnimatePresence>
          {selectedLeader && (
            <ProfileModal
              leader={selectedLeader}
              onClose={() => setSelectedLeader(null)}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}