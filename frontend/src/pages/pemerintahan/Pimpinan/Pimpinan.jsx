import { useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import heroBg from '../../../assets/pimpinan.jpg';
import PosterCarousel from './Components/PosterCarousel';
import ProfileModal from './Components/ProfileModal';

export default function Pimpinan() {
  const [selectedLeader, setSelectedLeader] = useState(null);
  
  // 1. State untuk menampung data dari backend
  const [dataPimpinan, setDataPimpinan] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);

    const currentIP = window.location.hostname;
    const apiUrl = `http://${currentIP}:5000/api/pimpinan`;

    // 2. Fetch data dari API Express.js
    fetch(apiUrl)
      .then((res) => res.json())
      .then((data) => {
        
        // === JURUS SAPU JAGAT: PAKSA URL FOTO ===
        const dataFotoValid = data.map((item) => {
          if (!item.fotoUrl) return item; // Abaikan jika tidak ada foto
          
          // Ambil HANYA nama file fotonya saja (misal: "173139829.jpg")
          const namaFile = item.fotoUrl.substring(item.fotoUrl.lastIndexOf('/') + 1);
          
          // Rakit ulang URL fotonya menggunakan IP yang sedang dipakai HP/Laptop
          const urlBaru = `http://${currentIP}:5000/uploads/${namaFile}`;
          
          return {
            ...item,
            fotoUrl: urlBaru
          };
        });

        setDataPimpinan(dataFotoValid); // Gunakan data yang sudah dirakit ulang
        // ========================================

        setIsLoading(false);
      })
      .catch((err) => {
        console.error("Gagal mengambil data pimpinan:", err);
        setIsLoading(false);
      });
  }, []);

  return (
    <div className="w-full min-h-screen bg-[#111111] pb-16 md:pb-24 overflow-x-hidden">
      
      {/* 1. HERO BANNER */}
      <div
        className="w-full relative bg-gov-navy bg-cover bg-center py-16 md:py-24 flex items-center overflow-hidden border-b-4 border-bekasi-gold"
        style={{ backgroundImage: `url(${heroBg})` }}
      >
        <div className="absolute inset-0 bg-black/60"></div>
        <div className="relative z-10 w-full max-w-[1728px] mx-auto px-5 md:px-[64px]">
          <h1 className="text-34 md:text-64 font-extrabold text-white tracking-tight drop-shadow-md">
            Pimpinan
          </h1>
        </div>
      </div>

      {/* 2. PEMANGGILAN KONTEN UTAMA */}
      {/* Lempar dataPimpinan ke PosterCarousel, dan beri status loading */}
      {isLoading ? (
        <div className="text-white text-center py-20 text-xl">Memuat data pimpinan...</div>
      ) : (
        <PosterCarousel 
          dataPimpinan={dataPimpinan} // Lempar data dari DB ke sini
          onSelectLeader={(leader) => setSelectedLeader(leader)} 
        />
      )}

      {/* 3. MODAL POPUP DETAIL */}
      <AnimatePresence>
        {selectedLeader && (
          <ProfileModal 
            leader={selectedLeader} 
            onClose={() => setSelectedLeader(null)} 
          />
        )}
      </AnimatePresence>
      
    </div>
  );
}