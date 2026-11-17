import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

export default function WilayahAdministrasi() {
  const [daftarKecamatan, setDaftarKecamatan] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch(`http://${window.location.hostname}:5000/api/kecamatan`)
      .then((res) => res.json())
      .then((data) => {
        setDaftarKecamatan(Array.isArray(data) ? data : []);
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
        <Link 
          to="/kecamatan" 
          className="hidden md:flex items-center gap-2 text-16 font-bold text-bekasi-green hover:text-bekasi-gold transition-colors group"
        >
          Lihat Semua Kecamatan <span className="group-hover:translate-x-1 transition-transform">❯❯❯</span>
        </Link>
      </div>

      {isLoading ? (
        <div className="text-gov-navy font-semibold py-10">Memuat data kecamatan...</div>
      ) : daftarKecamatan.length === 0 ? (
        <div className="bg-gray-100 border border-gray-200 rounded-xl p-8 text-center text-gray-500">
          Belum ada data kecamatan yang ditambahkan dari Dashboard Admin.
        </div>
      ) : (
        <div className="flex overflow-x-auto md:grid md:grid-cols-4 gap-4 md:gap-6 pt-4 pb-8 snap-x snap-mandatory [scrollbar-width:none] [&::-webkit-scrollbar]:hidden -mt-4">
          {daftarKecamatan.slice(0, 4).map((item) => {
            const imgUrl = (item.foto || item.gambar)
              ? ((item.foto || item.gambar).startsWith('http')
                  ? (item.foto || item.gambar)
                  : `http://${window.location.hostname}:5000${item.foto || item.gambar}`)
              : 'https://via.placeholder.com/400x300?text=Foto+Kecamatan';

            return (
              /* KARTU UTAMA */
              <div 
                key={item.id} 
                className="group relative w-[85vw] max-w-[280px] md:max-w-none md:w-auto bg-[#333333] rounded-xl overflow-hidden flex flex-col snap-start shrink-0 hover:-translate-y-2 transition-all duration-500 shadow-lg hover:shadow-2xl h-[380px] md:h-[400px] border-l-4 border-bekasi-green cursor-pointer"
              >
                
                {/* 1. BACKGROUND FOTO FULL KARTU */}
                <img 
                  src={imgUrl} 
                  alt={item.title || item.namaKecamatan} 
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110 z-0" 
                />

                {/* 2. GRADASI HITAM BAWAAN (Vignette) - Hilang saat di-hover supaya foto lebih terang */}
                <div className="absolute top-0 inset-x-0 h-[180px] bg-gradient-to-t from-black/80 via-transparent to-transparent z-10 pointer-events-none transition-opacity duration-500 group-hover:opacity-0"></div>

                {/* 3. KOTAK SOLID BAWAH PERMANEN (Mulai dari area bawah teks Kelurahan sampai dasar) */}
                <div className="absolute top-[250px] bottom-0 inset-x-0 bg-[#333333] z-10 pointer-events-none"></div>

                {/* 4. KOTAK SOLID TENGAH (Mulai dari garis pembatas 180px sampai 250px. Hilang saat di-hover) */}
                <div className="absolute top-[180px] h-[70px] inset-x-0 bg-[#333333] transition-opacity duration-500 group-hover:opacity-0 z-10 pointer-events-none"></div>

                {/* 5. EFEK GRADASI HOVER (Muncul saat di-hover, memudar dari titik 250px ke atas sampai 130px) */}
                <div className="absolute top-[130px] h-[120px] inset-x-0 bg-gradient-to-t from-[#333333] to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100 z-10 pointer-events-none"></div>

                {/* 6. GARIS PEMBATAS TEGAS (Hilang saat di-hover agar gradasi menyatu sempurna) */}
                <div className="absolute top-[180px] inset-x-0 border-t border-white/20 transition-opacity duration-500 group-hover:opacity-0 z-20 pointer-events-none"></div>

                {/* 7. KONTEN TEKS UTAMA (Lapisan paling atas / z-30) */}
                <div className="relative z-30 flex flex-col w-full h-full">
                  
                  {/* BAGIAN ATAS: Nama Kecamatan */}
                  <div className="h-[180px] flex flex-col justify-end px-4 pb-3 shrink-0 pointer-events-none">
                    <h3 className="text-16 md:text-18 font-extrabold text-white uppercase tracking-wide drop-shadow-md">
                      {item.title || item.namaKecamatan}
                    </h3>
                  </div>

                  {/* BAGIAN BAWAH: Teks Data Desa & Kelurahan */}
                  <div 
                    className="flex-1 p-4 overflow-y-auto flex flex-col" 
                    style={{ scrollbarWidth: 'thin', scrollbarColor: '#006837 transparent' }}
                  >
                    <div className="space-y-3 mt-auto">
                      {item.isi && (
                        <p className="text-[14px] md:text-[15px] text-white/90 whitespace-pre-line leading-relaxed drop-shadow-md">
                          {item.isi}
                        </p>
                      )}

                      {Array.isArray(item.namaKelurahan) && item.namaKelurahan.length > 0 && (
                        <div>
                          {/* Tambahan jumlah di sini */}
                          <span className="font-semibold text-emerald-400 text-[14px] md:text-[15px] drop-shadow-md">Kelurahan ({item.namaKelurahan.length}): </span>
                          <span className="text-gray-100 text-[14px] md:text-[15px] leading-relaxed drop-shadow-md">
                            {item.namaKelurahan.join(', ')}
                          </span>
                        </div>
                      )}

                      {Array.isArray(item.namaDesa) && item.namaDesa.length > 0 && (
                        <div>
                          {/* Tambahan jumlah di sini */}
                          <span className="font-semibold text-amber-400 text-[14px] md:text-[15px] drop-shadow-md">Desa ({item.namaDesa.length}): </span>
                          <span className="text-gray-100 text-[14px] md:text-[15px] leading-relaxed drop-shadow-md">
                            {item.namaDesa.join(', ')}
                          </span>
                        </div>
                      )}

                      {(!item.namaKelurahan || item.namaKelurahan.length === 0) &&
                       (!item.namaDesa || item.namaDesa.length === 0) && 
                       !item.isi && (
                        <p className="text-gray-400 italic text-sm drop-shadow-md">Belum ada data detail wilayah.</p>
                      )}
                    </div>
                  </div>

                </div>

              </div>
            );
          })}
        </div>
      )}

      {/* Tombol Utama Menuju Halaman /kecamatan (Selalu Tampil di Mobile) */}
      <div className="mt-4 flex justify-center md:hidden">
        <Link 
          to="/kecamatan" 
          className="w-full flex items-center justify-center gap-2 bg-[#006837] text-white py-3 px-5 rounded-xl text-15 font-bold hover:bg-bekasi-gold transition-colors shadow-md group"
        >
          Lihat Semua Kecamatan <span className="group-hover:translate-x-1 transition-transform">❯❯❯</span>
        </Link>
      </div>
    </>
  );
}