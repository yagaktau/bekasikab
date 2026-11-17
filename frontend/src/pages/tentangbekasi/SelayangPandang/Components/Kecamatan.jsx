import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import heroBg from '../../../../assets/kecamatan.jpg';

// --- Ikon SVG ---
const ListIcon = () => (
  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M3 5h18v2H3V5zm0 6h18v2H3v-2zm0 6h18v2H3v-2z"/></svg>
);
const GridIcon = () => (
  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M4 4h6v6H4V4zm10 0h6v6h-6V4zM4 14h6v6H4v-6zm10 0h6v6h-6v-6z"/></svg>
);
const ChevronLeftIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7"/></svg>
);
const ChevronRightIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7"/></svg>
);

export default function Kecamatan() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [semuaKecamatan, setSemuaKecamatan] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const [searchQuery, setSearchQuery] = useState('');
  const [viewType, setViewType] = useState('grid');
  const [sortOrder, setSortOrder] = useState('asc');
  const [itemsPerPage, setItemsPerPage] = useState(8);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    window.scrollTo(0, 0);
    const timer = setTimeout(() => setIsLoaded(true), 100);

    fetch(`http://${window.location.hostname}:5000/api/kecamatan`)
      .then((res) => res.json())
      .then((data) => {
        setSemuaKecamatan(Array.isArray(data) ? data : []);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error("Gagal mengambil data:", err);
        setIsLoading(false);
      });

    return () => clearTimeout(timer);
  }, []);

  const filteredKecamatan = semuaKecamatan.filter((item) => {
    const q = searchQuery.toLowerCase();
    const namaKec = (item.namaKecamatan || item.title || '').toLowerCase();
    const kelurahanMatch = Array.isArray(item.namaKelurahan)
      ? item.namaKelurahan.some((k) => k.toLowerCase().includes(q)) : false;
    const desaMatch = Array.isArray(item.namaDesa)
      ? item.namaDesa.some((d) => d.toLowerCase().includes(q)) : false;
    return namaKec.includes(q) || kelurahanMatch || desaMatch;
  });

  const sortedKecamatan = [...filteredKecamatan].sort((a, b) => {
    const namaA = (a.namaKecamatan || a.title || '').toLowerCase();
    const namaB = (b.namaKecamatan || b.title || '').toLowerCase();
    return sortOrder === 'asc' ? namaA.localeCompare(namaB) : namaB.localeCompare(namaA);
  });

  const totalItems = sortedKecamatan.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;

  useEffect(() => {
    if (currentPage > totalPages) setCurrentPage(1);
  }, [totalPages, currentPage]);

  const paginatedData = sortedKecamatan.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="w-full pb-16 md:pb-24">
      {/* Header Halaman */}
      <div className="w-full relative bg-gov-navy bg-cover bg-center py-16 md:py-24 flex items-center overflow-hidden" style={{ backgroundImage: `url(${heroBg})` }}>
        <div className="absolute inset-0 bg-black/50"></div>
        <div className="relative z-10 w-full max-w-[1728px] mx-auto px-5 md:px-[64px]">
          <Link to="/tentangbekasi/SelayangPandang" className="inline-flex items-center gap-2 text-white/90 hover:text-bekasi-gold transition-colors mb-6 font-medium bg-black/30 px-4 py-2 rounded-lg border border-white/20 hover:bg-black/60 backdrop-blur-sm w-fit">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
            Kembali ke Selayang Pandang
          </Link>
          <h1 className="text-32 md:text-56 font-extrabold text-white tracking-tight">Daftar Kecamatan di Kabupaten Bekasi</h1>
          <p className="text-16 md:text-20 text-white/80 mt-4 max-w-3xl leading-relaxed">
            Kabupaten Bekasi terbagi ke dalam 23 Kecamatan yang membawahi total 8 Kelurahan dan 179 Desa. Berikut adalah daftar lengkapnya.
          </p>
        </div>
      </div>

      <div className={`w-full max-w-[1728px] mx-auto px-5 md:px-[64px] mt-8 md:mt-12 transition-all duration-700 delay-300 ease-out ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`}>
        <h2 className="text-2xl font-bold text-gray-900 mb-4 hidden md:block">Daftar Kecamatan</h2>

        <div className="md:bg-[#D1C8C6] md:p-8 rounded-2xl md:shadow-sm">

          {/* Top Bar Filter */}
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6 bg-gray-100 border border-gray-200 p-4 rounded-xl md:bg-transparent md:border-none md:p-0">
            <div className="w-full md:w-auto bg-white md:bg-[#E3DBDA] rounded-xl flex items-center p-1.5 flex-1 max-w-md shadow-sm md:shadow-inner border border-gray-200 md:border-white/40">
              <svg className="w-5 h-5 text-gray-500 ml-3 mr-2 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
              <input type="text" placeholder="Cari Kecamatan, Kelurahan, Desa..." value={searchQuery} onChange={(e) => {setSearchQuery(e.target.value); setCurrentPage(1);}} className="bg-transparent border-none outline-none w-full text-gray-800 placeholder-gray-400 text-sm py-1" disabled={isLoading} />
            </div>

            <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end">
              <div className="bg-white md:bg-[#E3DBDA] rounded-lg border border-gray-200 md:border-white/40 shadow-sm md:shadow-inner px-2 py-1.5 md:py-1 flex-1 md:flex-none">
                <select value={sortOrder} onChange={(e) => setSortOrder(e.target.value)} className="bg-transparent outline-none text-sm cursor-pointer text-gray-700 font-medium w-full">
                  <option value="asc">A - Z</option>
                  <option value="desc">Z - A</option>
                </select>
              </div>

              <div className="hidden md:flex items-center gap-4 text-gray-800">
                <div className="flex gap-2 bg-[#E3DBDA] p-1 rounded-lg border border-white/40 shadow-inner">
                  <button onClick={() => setViewType('grid')} className={`p-1.5 rounded-md transition-colors ${viewType === 'grid' ? 'bg-[#A79A98] text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}><GridIcon /></button>
                  <button onClick={() => setViewType('list')} className={`p-1 rounded-md transition-colors ${viewType === 'list' ? 'bg-[#A79A98] text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}><ListIcon /></button>
                </div>
              </div>
            </div>
          </div>

          {/* List Kartu */}
          {isLoading ? (
            <div className="py-20 text-center text-lg font-semibold text-gray-600">Memuat daftar kecamatan...</div>
          ) : paginatedData.length === 0 ? (
            <div className="py-20 text-center bg-gray-50 rounded-xl border border-gray-200">
              <h3 className="text-xl font-bold text-gray-700 mb-1">Pencarian tidak ditemukan</h3>
              <p className="text-gray-500 text-sm">Tidak ada data yang cocok dengan kata kunci tersebut.</p>
            </div>
          ) : (
            <div className={`grid gap-4 md:gap-6 pt-2 pb-6 ${viewType === 'grid' ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' : 'grid-cols-1 md:grid-cols-2'}`}>
              {paginatedData.map((item) => {
                const imgUrl = (item.foto || item.gambar) 
                  ? ((item.foto || item.gambar).startsWith('http') ? (item.foto || item.gambar) : `http://${window.location.hostname}:5000${item.foto || item.gambar}`)
                  : 'https://via.placeholder.com/400x300?text=Foto+Kecamatan';

                return (
                  <div key={item.id} className="h-full">
                    
                    {/* 1. TAMPILAN KHUSUS MOBILE (Mode List Sederhana Terang) */}
                    <div className="md:hidden flex flex-col bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden h-full">
                      <div className="flex items-center gap-3 p-3 border-b border-gray-100 bg-white">
                        <img src={imgUrl} alt={item.title || item.namaKecamatan} className="w-14 h-14 rounded-lg object-cover shrink-0 border border-gray-100 shadow-sm" />
                        <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wide leading-tight">
                          {item.namaKecamatan || item.title}
                        </h3>
                      </div>
                      <div className="p-3 bg-gray-50/50 flex-1 space-y-2 text-[13px] text-gray-600">
                        {Array.isArray(item.namaKelurahan) && item.namaKelurahan.length > 0 && (
                          <div>
                            <span className="font-semibold text-emerald-600">Kelurahan ({item.namaKelurahan.length}): </span>
                            <span className="leading-relaxed">{item.namaKelurahan.join(', ')}</span>
                          </div>
                        )}
                        {Array.isArray(item.namaDesa) && item.namaDesa.length > 0 && (
                          <div>
                            <span className="font-semibold text-amber-600">Desa ({item.namaDesa.length}): </span>
                            <span className="leading-relaxed">{item.namaDesa.join(', ')}</span>
                          </div>
                        )}
                        {(!item.namaKelurahan || item.namaKelurahan.length === 0) && (!item.namaDesa || item.namaDesa.length === 0) && (
                          <p className="text-gray-400 italic text-xs">Belum ada data kelurahan/desa.</p>
                        )}
                      </div>
                    </div>

                    {/* 2. TAMPILAN KHUSUS DESKTOP */}
                    <div className="hidden md:flex w-full h-full">
                      {viewType === 'grid' ? (
                        
                        /* --- KARTU ANIMASI (GRID DESKTOP) --- */
                        /* 100% sama dengan animasi di WilayahAdministrasi.jsx */
                        <div className="group relative w-full bg-[#333333] rounded-xl overflow-hidden flex flex-col shrink-0 hover:-translate-y-2 transition-all duration-500 shadow-md hover:shadow-2xl h-[400px] border-l-4 border-[#006837] cursor-pointer">
                          
                          {/* 1. BACKGROUND FOTO FULL KARTU */}
                          <img src={imgUrl} alt={item.title || item.namaKecamatan} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110 z-0" />

                          {/* 2. GRADASI HITAM BAWAAN (Vignette) - Hilang saat hover */}
                          <div className="absolute top-0 inset-x-0 h-[180px] bg-gradient-to-t from-black/80 via-transparent to-transparent z-10 pointer-events-none transition-opacity duration-500 group-hover:opacity-0"></div>

                          {/* 3. KOTAK SOLID BAWAH PERMANEN */}
                          <div className="absolute top-[250px] bottom-0 inset-x-0 bg-[#333333] z-10 pointer-events-none"></div>

                          {/* 4. KOTAK SOLID TENGAH (Mulai dari 180px sampai 250px. Hilang saat di-hover) */}
                          <div className="absolute top-[180px] h-[70px] inset-x-0 bg-[#333333] transition-opacity duration-500 group-hover:opacity-0 z-10 pointer-events-none"></div>

                          {/* 5. EFEK GRADASI HOVER (Memudar dari 250px ke 130px ke atas) */}
                          <div className="absolute top-[130px] h-[120px] inset-x-0 bg-gradient-to-t from-[#333333] to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100 z-10 pointer-events-none"></div>

                          {/* 6. GARIS PEMBATAS TEGAS (Hilang saat hover) */}
                          <div className="absolute top-[180px] inset-x-0 border-t border-white/20 transition-opacity duration-500 group-hover:opacity-0 z-20 pointer-events-none"></div>

                          {/* 7. KONTEN TEKS UTAMA */}
                          <div className="relative z-30 flex flex-col w-full h-full">
                            <div className="h-[180px] flex flex-col justify-end px-4 pb-3 shrink-0 pointer-events-none">
                              <h3 className="text-[16px] md:text-[18px] font-extrabold text-white uppercase tracking-wide drop-shadow-md">
                                {item.namaKecamatan || item.title}
                              </h3>
                            </div>

                            {/* Kontainer teks yang mendorong isinya ke paling bawah dengan mt-auto */}
                            <div className="flex-1 p-4 overflow-y-auto flex flex-col" style={{ scrollbarWidth: 'thin', scrollbarColor: '#006837 transparent' }}>
                              <div className="space-y-3 mt-auto">
                                {item.isi && (
                                  <p className="text-[14px] md:text-[15px] text-white/90 whitespace-pre-line leading-relaxed drop-shadow-md">
                                    {item.isi}
                                  </p>
                                )}

                                {Array.isArray(item.namaKelurahan) && item.namaKelurahan.length > 0 && (
                                  <div>
                                    <span className="font-semibold text-emerald-400 text-[14px] md:text-[15px] drop-shadow-md">Kelurahan ({item.namaKelurahan.length}): </span>
                                    <span className="text-gray-100 text-[14px] md:text-[15px] leading-relaxed drop-shadow-md">
                                      {item.namaKelurahan.join(', ')}
                                    </span>
                                  </div>
                                )}

                                {Array.isArray(item.namaDesa) && item.namaDesa.length > 0 && (
                                  <div>
                                    <span className="font-semibold text-amber-400 text-[14px] md:text-[15px] drop-shadow-md">Desa ({item.namaDesa.length}): </span>
                                    <span className="text-gray-100 text-[14px] md:text-[15px] leading-relaxed drop-shadow-md">
                                      {item.namaDesa.join(', ')}
                                    </span>
                                  </div>
                                )}

                                {(!item.namaKelurahan || item.namaKelurahan.length === 0) &&
                                 (!item.namaDesa || item.namaDesa.length === 0) && !item.isi && (
                                  <p className="text-gray-400 italic text-[14px] drop-shadow-md">Belum ada data detail wilayah.</p>
                                )}
                              </div>
                            </div>
                          </div>

                        </div>
                      ) : (

                        /* --- KARTU LIST (LIST DESKTOP) --- */
                        /* Tampilan baris horizontal sederhana kalau user klik icon List di desktop */
                        <div className="w-full flex bg-[#333333] border-l-4 border-[#006837] rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow min-h-[200px]">
                          <div className="w-48 shrink-0 relative bg-gray-200">
                            <img src={imgUrl} className="w-full h-full object-cover" alt={item.title} />
                          </div>
                          <div className="p-5 flex flex-col flex-1">
                            <h3 className="text-lg font-extrabold text-white uppercase">{item.namaKecamatan || item.title}</h3>
                            <hr className="border-white/15 my-3" />
                            <div className="space-y-2.5">
                              {Array.isArray(item.namaKelurahan) && item.namaKelurahan.length > 0 && (
                                <div>
                                  <p className="font-semibold text-emerald-400 uppercase tracking-wider text-[11px] mb-1">Kelurahan ({item.namaKelurahan.length})</p>
                                  <p className="leading-relaxed text-gray-300 text-sm">{item.namaKelurahan.join(', ')}</p>
                                </div>
                              )}
                              {Array.isArray(item.namaDesa) && item.namaDesa.length > 0 && (
                                <div>
                                  <p className="font-semibold text-amber-400 uppercase tracking-wider text-[11px] mb-1">Desa ({item.namaDesa.length})</p>
                                  <p className="leading-relaxed text-gray-300 text-sm">{item.namaDesa.join(', ')}</p>
                                </div>
                              )}
                              {(!item.namaKelurahan || item.namaKelurahan.length === 0) && (!item.namaDesa || item.namaDesa.length === 0) && (
                                <p className="text-gray-400 italic text-sm">Belum ada data kelurahan/desa.</p>
                              )}
                            </div>
                          </div>
                        </div>

                      )}
                    </div>

                  </div>
                );
              })}
            </div>
          )}

          {/* Bottom Bar: Paginasi */}
          {!isLoading && semuaKecamatan.length > 0 && (
            <div className="mt-8 pt-6 md:pt-4 border-t border-gray-300 md:border-gray-500/30 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-700 md:text-gray-800 font-medium">
              <div className="hidden md:flex items-center gap-1">
                Tampilkan
                <div className="bg-[#E3DBDA] rounded px-1 py-0.5 border border-gray-400/30 mx-1">
                  <select value={itemsPerPage} onChange={(e) => {setItemsPerPage(Number(e.target.value)); setCurrentPage(1);}} className="bg-transparent outline-none cursor-pointer">
                    <option value={4}>4</option>
                    <option value={8}>8</option>
                    <option value={12}>12</option>
                    <option value={16}>16</option>
                    <option value={20}>20</option>
                  </select>
                </div>
                Item Dari total {totalItems}
              </div>

              <div className="flex items-center gap-3 w-full md:w-auto justify-center md:justify-end bg-gray-100 md:bg-transparent p-2 rounded-xl md:p-0 border border-gray-200 md:border-none">
                <button onClick={() => setCurrentPage((p) => Math.max(1, p - 1))} disabled={currentPage === 1} className="p-1.5 disabled:opacity-30 hover:bg-black/5 rounded transition-colors cursor-pointer disabled:cursor-not-allowed bg-white md:bg-transparent shadow-sm md:shadow-none">
                  <ChevronLeftIcon />
                </button>
                <div className="flex items-center gap-1">
                  Halaman
                  <div className="bg-white md:bg-[#E3DBDA] rounded px-1 py-0.5 border border-gray-300 md:border-gray-400/30 mx-1 shadow-sm md:shadow-none">
                    <select value={currentPage} onChange={(e) => setCurrentPage(Number(e.target.value))} className="bg-transparent outline-none cursor-pointer">
                      {[...Array(totalPages)].map((_, i) => (<option key={i + 1} value={i + 1}>{i + 1}</option>))}
                    </select>
                  </div>
                  Dari {totalPages}
                </div>
                <button onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} className="p-1.5 disabled:opacity-30 hover:bg-black/5 rounded transition-colors cursor-pointer disabled:cursor-not-allowed bg-white md:bg-transparent shadow-sm md:shadow-none">
                  <ChevronRightIcon />
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}