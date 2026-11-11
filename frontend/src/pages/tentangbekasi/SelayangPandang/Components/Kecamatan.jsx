import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import heroBg from '../../../../assets/kecamatan.jpg';
// Pastikan kamu import instance API kamu jika menggunakan axios/fetch terpusat
// import API from '../../../../services/api'; 

export default function Kecamatan() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  const [semuaKecamatan, setSemuaKecamatan] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
    const timer = setTimeout(() => setIsLoaded(true), 100);
    
    // Fetch API
    fetch('http://localhost:5000/api/kecamatan')
      .then((res) => res.json())
      .then((data) => {
        setSemuaKecamatan(data);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error("Gagal mengambil data:", err);
        setIsLoading(false);
      });

    return () => clearTimeout(timer);
  }, []);

  // Logika Filter
  const filteredKecamatan = semuaKecamatan.filter((item) => {
    const titleMatch = item.title?.toLowerCase().includes(searchQuery.toLowerCase());
    const isiMatch = item.isi?.toLowerCase().includes(searchQuery.toLowerCase());
    return titleMatch || isiMatch;
  });

  return (
    <div className="w-full pb-16 md:pb-24">
      {/* Header Halaman (Tidak Berubah) */}
      <div 
        className="w-full relative bg-gov-navy bg-cover bg-center py-16 md:py-24 flex items-center overflow-hidden"
        style={{ backgroundImage: `url(${heroBg})`}}
      >
        <div className="absolute inset-0 bg-black/50"></div>
        <div className="relative z-10 w-full max-w-[1728px] mx-auto px-5 md:px-[64px]">
          <Link 
            to="/tentangbekasi/SelayangPandang" 
            className="inline-flex items-center gap-2 text-white/90 hover:text-bekasi-gold transition-colors mb-6 font-medium bg-black/30 px-4 py-2 rounded-lg border border-white/20 hover:bg-black/60 backdrop-blur-sm w-fit"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Kembali ke Selayang Pandang
          </Link>
          <h1 className="text-32 md:text-56 font-extrabold text-white tracking-tight">
            Daftar Kecamatan di Kabupaten Bekasi
          </h1>
          <p className="text-16 md:text-20 text-white/80 mt-4 max-w-3xl leading-relaxed">
            Kabupaten Bekasi terbagi ke dalam 23 Kecamatan yang membawahi total 8 Kelurahan dan 179 Desa. Berikut adalah daftar lengkapnya.
          </p>
        </div>
      </div>

      <div className="w-full max-w-[1728px] mx-auto px-5 md:px-[64px] mt-8 md:mt-12">
        {/* Kolom Pencarian */}
        <div className={`mb-8 transition-all duration-700 delay-300 ease-out ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`}>
          <div className="relative max-w-md">
            <input 
              type="text" 
              placeholder="Cari Kecamatan, Kelurahan atau Desa..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 md:py-4 rounded-xl border-2 border-gray-200 bg-white text-gray-700 focus:outline-none focus:border-bekasi-green focus:ring-4 focus:ring-bekasi-green/20 transition-all shadow-sm font-medium"
              disabled={isLoading || semuaKecamatan.length === 0}
            />
            <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>

        {/* Grid Hasil Pencarian / Empty State */}
        {isLoading ? (
          <div className="py-20 text-center text-xl font-semibold text-gray-500">Memuat daftar kecamatan...</div>
        ) : semuaKecamatan.length === 0 ? (
          <div className="py-20 text-center bg-gray-50 rounded-2xl border border-gray-200">
            <h3 className="text-24 font-bold text-gray-700 mb-2">Belum Ada Data</h3>
            <p className="text-gray-500">Data kecamatan masih kosong dan akan diisi melalui Dashboard Admin.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredKecamatan.length > 0 ? (
              filteredKecamatan.map((item, index) => (
                <div 
                  key={item.id} 
                  className={`relative w-full bg-[#333333] rounded-xl overflow-hidden flex flex-col hover:-translate-y-2 transition-all duration-700 ease-out shadow-lg h-[380px] md:h-[400px] ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}
                  style={{ transitionDelay: `${index * 50}ms` }}
                >
                  <div className="absolute inset-0 w-full h-full">
                    <img 
                      src={item.gambar || `https://via.placeholder.com/400x300?text=Kecamatan+${item.title?.replace(' ', '+')}`} 
                      alt={`Kecamatan ${item.title}`}
                      className="w-full h-full object-cover object-center"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#333333] from-35% via-[#333333]/90 to-transparent"></div>
                  </div>

                  <div className="relative z-10 border-l-4 border-bekasi-green p-5 flex flex-col justify-end h-full">
                    <h2 className="text-18 md:text-20 font-bold text-white mb-3 uppercase leading-tight border-b border-white/10 pb-2">
                      Kecamatan {item.title}
                    </h2>
                    <div className="h-[120px] md:h-[130px] flex flex-col justify-start overflow-hidden">
                      <p className="text-14 md:text-15 text-white/90 whitespace-pre-line leading-relaxed drop-shadow-md">
                        {item.isi}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full py-12 flex flex-col items-center justify-center text-center">
                <svg className="w-16 h-16 text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h3 className="text-20 font-bold text-gray-700">Pencarian tidak ditemukan</h3>
                <p className="text-gray-500 mt-2">Tidak ada kecamatan atau desa yang cocok dengan kata kunci "{searchQuery}".</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}