import { motion } from 'framer-motion';

// 1. Terima props dataPimpinan dari komponen parent (Pimpinan.jsx)
export default function PosterCarousel({ dataPimpinan = [], onSelectLeader }) {
  // Jika database masih kosong
  if (dataPimpinan.length === 0) {
    return (
      <div className="w-full max-w-[1728px] mx-auto px-5 md:px-[64px] py-24 text-center">
        <div className="bg-[#1e1e1e] border border-gray-800 rounded-2xl p-12 max-w-xl mx-auto shadow-xl">
          <div className="w-16 h-16 bg-bekasi-gold/10 text-bekasi-gold rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
            !
          </div>
          <h3 className="text-2xl font-bold text-white mb-2">Belum Ada Data Pimpinan</h3>
          <p className="text-gray-400 text-sm">
            Data pimpinan akan ditampilkan di sini setelah ditambahkan melalui Dashboard Admin.
          </p>
        </div>
      </div>
    );
  }

  // Jika ada data, jalankan carousel seperti biasa
  const loopingLeaders = [...dataPimpinan, ...dataPimpinan];

  return (
    <div className="w-full max-w-[1728px] mx-auto px-0 md:px-[64px] py-12 md:py-16 overflow-hidden">
      <div className="flex flex-row w-full h-[500px] md:h-[650px] gap-4 md:gap-1 overflow-x-auto md:overflow-visible snap-x snap-mandatory md:snap-none -skew-x-[8deg] md:px-8 px-5 py-4 scroll-smooth [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        
        {loopingLeaders.map((leader, index) => {
          // Cek apakah ini data asli atau duplikat (untuk efek hover/lebar di desktop)
          const isOriginal = index < dataPimpinan.length;

          return (
            <motion.div 
              key={`${leader.id}-${index}`}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              // Sedikit penyesuaian delay menggunakan index agar tidak error jika id tidak urut
              transition={{ duration: 0.6, delay: isOriginal ? index * 0.1 : 0 }}
              className={`group relative flex-none w-[82vw] md:w-auto h-full snap-center bg-[#1e1e1e] rounded-xl md:rounded-none overflow-hidden cursor-pointer transition-all duration-500 ease-out shadow-2xl
                ${isOriginal ? 'block md:flex-1 md:first:rounded-l-xl md:last:rounded-r-xl md:hover:flex-[1.2]' : 'block md:hidden'}
              `}
              onClick={() => onSelectLeader(leader)}
            >
              {/* Image Un-skew Wrapper */}
              <div className="absolute inset-0 -inset-x-[15%] w-[130%] skew-x-[8deg]">
                <img 
                  // 3. Gunakan properti 'fotoUrl' dari database
                  src={leader.fotoUrl || 'https://via.placeholder.com/600x900?text=Foto+Pimpinan'} 
                  alt={leader.namaLengkap} 
                  className="absolute inset-0 w-full h-full object-cover object-top transition-transform duration-700 ease-out group-hover:scale-110"
                  onError={(e) => { e.target.src = 'https://via.placeholder.com/600x900?text=Foto+Pimpinan'; }}
                />
                <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-transparent to-black/95 opacity-80 group-hover:opacity-90 transition-opacity duration-300"></div>
              </div>

              {/* Text Un-skew Wrapper */}
              <div className="absolute inset-0 p-6 md:p-8 flex flex-col justify-between z-10 pointer-events-none skew-x-[8deg]">
                <div className="text-center transform transition-transform duration-500 group-hover:translate-y-2 mt-4">
                  <h2 className="text-24 md:text-28 font-black text-transparent bg-clip-text bg-gradient-to-r from-bekasi-gold to-yellow-200 uppercase tracking-widest drop-shadow-lg">
                    {/* 4. Gunakan properti 'jabatan' dari database */}
                    {leader.jabatan}
                  </h2>
                </div>

                <div className="text-center transform transition-transform duration-500 group-hover:-translate-y-2 mb-4">
                  <div className="w-12 h-1 bg-bekasi-gold mx-auto mb-4 rounded-full"></div>
                  <h3 className="text-20 md:text-28 font-bold text-white mb-2 drop-shadow-md">
                    {/* 5. Gunakan properti 'namaLengkap' dari database */}
                    {leader.namaLengkap}
                  </h3>
                  
                  <div className="opacity-0 translate-y-4 transition-all duration-500 group-hover:opacity-100 group-hover:translate-y-0 mt-4 pointer-events-auto">
                    <span className="inline-block px-5 py-2 border border-bekasi-gold/50 rounded-full text-14 text-bekasi-gold font-semibold backdrop-blur-md bg-black/40 hover:bg-bekasi-gold hover:text-black transition-colors shadow-[0_0_15px_rgba(255,215,0,0.3)]">
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