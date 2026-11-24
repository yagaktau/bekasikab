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
        console.error('Gagal mengambil data wilayah:', err);
        setIsLoading(false);
      });
  }, []);

  return (
    <>
      <div className="mt-8 md:mt-12 flex items-center gap-2">
        <h2 className="text-32 md:text-48 font-bold text-forest-green border-b-2 border-sage-green pb-2 inline-block">
          Wilayah Administrasi Kabupaten Bekasi
        </h2>
      </div>

      <p className="text-20 md:text-24 text-charcoal mb-6">
        Wilayah Kabupaten Bekasi terbagi ke dalam 23 kecamatan yang terdiri dari 8 kelurahan dan 179 desa.
      </p>

      <div className="flex justify-between items-end mb-4">
        <p className="text-20 md:text-24 text-forest-green font-bold">
          Daftar Kecamatan:
        </p>
        <Link
          to="/kecamatan"
          className="hidden md:flex items-center gap-2 text-16 font-bold text-forest-green hover:text-sage-green transition-colors group"
        >
          Lihat Semua Kecamatan{' '}
          <span className="group-hover:translate-x-1 transition-transform">❯❯❯</span>
        </Link>
      </div>

      {isLoading ? (
        <div className="text-forest-green font-semibold py-10">
          Memuat data kecamatan...
        </div>
      ) : daftarKecamatan.length === 0 ? (
        <div className="bg-mint-gray border border-sage-green/20 rounded-xl p-8 text-center text-charcoal">
          Belum ada data kecamatan yang ditambahkan dari Dashboard Admin.
        </div>
      ) : (
        <div className="flex overflow-x-auto md:grid md:grid-cols-4 gap-4 md:gap-6 pt-4 pb-8 snap-x snap-mandatory [scrollbar-width:none] [&::-webkit-scrollbar]:hidden -mt-4">
          {daftarKecamatan.slice(0, 4).map((item) => {
            const imgUrl =
              item.foto || item.gambar
                ? (item.foto || item.gambar).startsWith('http')
                  ? item.foto || item.gambar
                  : `http://${window.location.hostname}:5000${item.foto || item.gambar}`
                : 'https://via.placeholder.com/400x300?text=Foto+Kecamatan';

            return (
              <div
                key={item.id}
                className="group relative w-[85vw] max-w-[280px] md:max-w-none md:w-auto bg-charcoal rounded-xl overflow-hidden flex flex-col snap-start shrink-0 hover:-translate-y-2 transition-all duration-500 shadow-lg hover:shadow-2xl h-[380px] md:h-[400px] border-l-4 border-sage-green cursor-pointer"
              >
                {/* 1. BACKGROUND FOTO FULL KARTU */}
                <img
                  src={imgUrl}
                  alt={item.title || item.namaKecamatan}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110 z-0"
                />

                {/* 2. GRADASI BAWAAN */}
                <div className="absolute top-0 inset-x-0 h-[180px] bg-gradient-to-t from-charcoal/90 via-transparent to-transparent z-10 pointer-events-none transition-opacity duration-500 group-hover:opacity-0"></div>

                {/* 3. KOTAK SOLID BAWAH PERMANEN (Charcoal) */}
                <div className="absolute top-[250px] bottom-0 inset-x-0 bg-charcoal z-10 pointer-events-none"></div>

                {/* 4. KOTAK SOLID TENGAH (Charcoal) */}
                <div className="absolute top-[180px] h-[70px] inset-x-0 bg-charcoal transition-opacity duration-500 group-hover:opacity-0 z-10 pointer-events-none"></div>

                {/* 5. EFEK GRADASI HOVER */}
                <div className="absolute top-[130px] h-[120px] inset-x-0 bg-gradient-to-t from-charcoal to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100 z-10 pointer-events-none"></div>

                {/* 6. GARIS PEMBATAS TEGAS */}
                <div className="absolute top-[180px] inset-x-0 border-t border-off-white/20 transition-opacity duration-500 group-hover:opacity-0 z-20 pointer-events-none"></div>

                {/* 7. KONTEN TEKS UTAMA */}
                <div className="relative z-30 flex flex-col w-full h-full">
                  <div className="h-[180px] flex flex-col justify-end px-4 pb-3 shrink-0 pointer-events-none">
                    <h3 className="text-16 md:text-18 font-extrabold text-off-white uppercase tracking-wide drop-shadow-md">
                      {item.title || item.namaKecamatan}
                    </h3>
                  </div>

                  <div
                    className="flex-1 p-4 overflow-y-auto flex flex-col"
                    style={{
                      scrollbarWidth: 'thin',
                      scrollbarColor: '#397A57 transparent',
                    }}
                  >
                    <div className="space-y-3 mt-auto">
                      {item.isi && (
                        <p className="text-[14px] md:text-[15px] text-off-white/90 whitespace-pre-line leading-relaxed drop-shadow-md">
                          {item.isi}
                        </p>
                      )}

                      {Array.isArray(item.namaKelurahan) &&
                        item.namaKelurahan.length > 0 && (
                          <div>
                            <span className="font-bold text-mint-gray text-[14px] md:text-[15px] drop-shadow-md">
                              Kelurahan ({item.namaKelurahan.length}):{' '}
                            </span>
                            <span className="text-off-white/90 text-[14px] md:text-[15px] leading-relaxed drop-shadow-md">
                              {item.namaKelurahan.join(', ')}
                            </span>
                          </div>
                        )}

                      {Array.isArray(item.namaDesa) && item.namaDesa.length > 0 && (
                        <div>
                          <span className="font-bold text-mint-gray text-[14px] md:text-[15px] drop-shadow-md">
                            Desa ({item.namaDesa.length}):{' '}
                          </span>
                          <span className="text-off-white/90 text-[14px] md:text-[15px] leading-relaxed drop-shadow-md">
                            {item.namaDesa.join(', ')}
                          </span>
                        </div>
                      )}

                      {(!item.namaKelurahan || item.namaKelurahan.length === 0) &&
                        (!item.namaDesa || item.namaDesa.length === 0) &&
                        !item.isi && (
                          <p className="text-mint-gray/70 italic text-sm drop-shadow-md">
                            Belum ada data detail wilayah.
                          </p>
                        )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Tombol Utama Menuju Halaman /kecamatan (Mobile) */}
      <div className="mb-8 md:hidden">
        <Link
          to="/kecamatan"
          className="w-full flex items-center justify-center gap-2 bg-forest-green text-off-white py-3 px-5 rounded-xl text-15 font-bold hover:bg-sage-green transition-colors shadow-md group"
        >
          Lihat Semua Kecamatan{' '}
          <span className="group-hover:translate-x-1 transition-transform">❯❯❯</span>
        </Link>
      </div>
    </>
  );
}