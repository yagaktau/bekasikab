import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../../../../services/api'; // Pastikan path ini sesuai

export default function WilayahAdministrasi() {
  const [daftarKecamatan, setDaftarKecamatan] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    API.get("/kecamatan")
      .then((res) => {
        setDaftarKecamatan(res.data);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error("Gagal mengambil data wilayah:", err);
        setIsLoading(false);
      });
  }, []);

  return (
    <>
      <div className="mt-12 md:mt-16 mb-8">
        <h2 className="text-32 md:text-48 font-bold text-gov-navy border-b-2 border-bekasi-green pb-2 inline-block">
          Wilayah Administrasi Kabupaten Bekasi
        </h2>
      </div>

      <p className="text-20 md:text-24 text-gov-navy mb-6">
        Wilayah Kabupaten Bekasi terbagi ke dalam 23 kecamatan yang terdiri dari 8 kelurahan dan 179 desa.
      </p>

      <div className="flex justify-between items-end mb-4">
        <p className="text-20 md:text-24 text-gov-navy font-bold">Daftar Kecamatan:</p>
        {daftarKecamatan.length > 0 && (
          <Link to="/kecamatan" className="hidden md:flex items-center gap-2 text-16 font-bold text-bekasi-green hover:text-bekasi-gold transition-colors group">
            Lihat Lebih Banyak <span className="group-hover:translate-x-1 transition-transform">❯❯❯</span>
          </Link>
        )}
      </div>

      {isLoading ? (
        <div className="text-gov-navy font-semibold py-10">Memuat data kecamatan...</div>
      ) : daftarKecamatan.length === 0 ? (
        <div className="bg-gray-100 border border-gray-200 rounded-xl p-8 text-center text-gray-500">
          Belum ada data kecamatan yang ditambahkan dari Dashboard Admin.
        </div>
      ) : (
        <div className="flex overflow-x-auto md:grid md:grid-cols-4 gap-4 md:gap-6 pb-6 md:pb-0 snap-x snap-mandatory [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {daftarKecamatan.slice(0, 4).map((item) => (
            <div 
              key={item.id} 
              className="relative w-[85vw] max-w-[280px] md:max-w-none md:w-auto bg-[#333333] rounded-xl overflow-hidden flex flex-col snap-start shrink-0 hover:-translate-y-1 transition-transform duration-300 shadow-lg h-[380px] md:h-[400px]"
            >
              <div className="absolute inset-0 w-full h-full">
                <img 
                  src={item.gambar || 'https://via.placeholder.com/400x300?text=Foto+Kecamatan'} 
                  alt={item.title} 
                  className="w-full h-full object-cover object-top" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#333333] from-35% via-[#333333]/90 to-transparent"></div>
              </div>

              <div className="relative z-10 border-l-4 border-bekasi-green p-4 flex flex-col justify-end h-full">
                <h3 className="text-16 md:text-18 font-bold text-white mb-3 uppercase leading-tight border-b border-white/10 pb-2">
                  {item.title}
                </h3>
                <div className="h-[120px] md:h-[130px] flex flex-col justify-start overflow-hidden">
                  <p className="text-13 md:text-14 text-white/80 whitespace-pre-line leading-relaxed drop-shadow-md">
                    {item.isi}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {daftarKecamatan.length > 0 && (
        <div className="mt-4 flex justify-end md:hidden">
          <Link to="/kecamatan" className="flex items-center gap-2 text-14 font-bold text-bekasi-green hover:text-bekasi-gold transition-colors group">
            Lihat Lebih Banyak <span className="group-hover:translate-x-1 transition-transform">❯❯❯</span>
          </Link>
        </div>
      )}
    </>
  );
}