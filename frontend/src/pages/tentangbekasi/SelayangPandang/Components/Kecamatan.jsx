import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import heroBg from '../../../../assets/kecamatan.jpg';

const IconDaftar = () => (
  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
    <path d="M4 4h3.5v16H4zm6.25 0h3.5v16h-3.5zm6.25 0h3.5v16h-3.5z" />
  </svg>
);

const IconBento = () => (
  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
    <path d="M4 4h6v6H4V4zm10 0h6v6h-6V4zM4 14h6v6H4v-6zm10 0h6v6h-6v-6z" />
  </svg>
);

const ChevronLeftIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
  </svg>
);
const ChevronRightIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
  </svg>
);

export default function Kecamatan() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [semuaKecamatan, setSemuaKecamatan] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const [searchQuery, setSearchQuery] = useState('');
  const [viewType, setViewType] = useState('grid');
  const [sortOrder, setSortOrder] = useState('asc');
  const [itemsPerPage, setItemsPerPage] = useState(4);
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
        console.error('Gagal mengambil data:', err);
        setIsLoading(false);
      });

    return () => clearTimeout(timer);
  }, []);

  const filteredKecamatan = semuaKecamatan.filter((item) => {
    const q = searchQuery.toLowerCase();
    const namaKec = (item.namaKecamatan || item.title || '').toLowerCase();
    const kelurahanMatch = Array.isArray(item.namaKelurahan)
      ? item.namaKelurahan.some((k) => k.toLowerCase().includes(q))
      : false;
    const desaMatch = Array.isArray(item.namaDesa)
      ? item.namaDesa.some((d) => d.toLowerCase().includes(q))
      : false;
    return namaKec.includes(q) || kelurahanMatch || desaMatch;
  });

  const sortedKecamatan = [...filteredKecamatan].sort((a, b) => {
    const namaA = (a.namaKecamatan || a.title || '').toLowerCase();
    const namaB = (b.namaKecamatan || b.title || '').toLowerCase();
    return sortOrder === 'asc'
      ? namaA.localeCompare(namaB)
      : namaB.localeCompare(namaA);
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
    <div className="w-full bg-off-white text-charcoal pb-16 md:pb-24">
      {/* ================= HERO BANNER ================= */}
      <div
        className="w-full relative bg-charcoal bg-cover bg-center py-16 md:py-24 flex items-center overflow-hidden"
        style={{ backgroundImage: `url(${heroBg})` }}
      >
        <div className="absolute inset-0 bg-charcoal/70"></div>
        <div className="relative z-10 w-full max-w-[1728px] mx-auto px-5 md:px-[64px]">
          <Link
            to="/tentangbekasi/SelayangPandang"
            className="inline-flex items-center gap-2 text-13 md:text-14 text-off-white hover:text-off-white transition-colors mb-4 font-medium bg-charcoal/60 px-3.5 py-1.5 rounded-lg border border-off-white/25 hover:bg-sage-green hover:border-sage-green backdrop-blur-sm w-fit"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2.5}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            Kembali ke Selayang Pandang
          </Link>
          <h1 className="text-28 md:text-48 font-extrabold text-off-white tracking-tight drop-shadow-md">
            Daftar Kecamatan di Kabupaten Bekasi
          </h1>
          <p className="text-14 md:text-16 text-mint-gray mt-3 max-w-3xl leading-relaxed">
            Kabupaten Bekasi terbagi ke dalam 23 Kecamatan yang membawahi total 8 Kelurahan dan 179 Desa. Berikut adalah daftar lengkapnya.
          </p>
        </div>
      </div>

      {/* ================= KONTEN UTAMA ================= */}
      <div
        className={`w-full max-w-[1728px] mx-auto px-5 md:px-[64px] mt-8 md:mt-12 transition-all duration-700 delay-300 ease-out ${
          isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'
        }`}
      >
        <h2 className="text-24 md:text-34 font-bold text-forest-green mb-4 hidden md:block">
          Daftar Kecamatan
        </h2>

        <div className="md:bg-mint-gray md:border md:border-sage-green/20 md:p-8 rounded-2xl md:shadow-sm">
          {/* Top Bar Filter */}
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6 bg-mint-gray border border-sage-green/20 p-4 rounded-xl md:bg-transparent md:border-none md:p-0">
            <div className="w-full md:w-auto bg-off-white rounded-xl flex items-center p-1.5 flex-1 max-w-md shadow-sm border border-sage-green/30">
              <svg
                className="w-5 h-5 text-sage-green ml-3 mr-2 shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              <input
                type="text"
                placeholder="Cari Kecamatan, Kelurahan, Desa..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                className="bg-transparent border-none outline-none w-full text-charcoal placeholder-charcoal/50 text-14 py-1"
                disabled={isLoading}
              />
            </div>

            <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end">
              <div className="bg-off-white rounded-lg border border-sage-green/30 shadow-sm px-2 py-1.5 md:py-1 flex-1 md:flex-none">
                <select
                  value={sortOrder}
                  onChange={(e) => setSortOrder(e.target.value)}
                  className="bg-transparent outline-none text-14 cursor-pointer text-charcoal font-medium w-full"
                >
                  <option value="asc">A - Z</option>
                  <option value="desc">Z - A</option>
                </select>
              </div>

              <div className="hidden md:flex items-center gap-4 text-charcoal">
                <div className="flex gap-2 bg-off-white p-1 rounded-lg border border-sage-green/30 shadow-sm">
                  {/* Tombol Daftar (List) */}
                  <button
                    onClick={() => setViewType('list')}
                    className={`p-1 rounded-md transition-colors ${
                      viewType === 'list'
                        ? 'bg-forest-green text-off-white shadow-sm'
                        : 'text-charcoal/70 hover:text-sage-green'
                    }`}
                  >
                    <IconDaftar />
                  </button>

                  {/* Tombol Bento (Grid) */}
                  <button
                    onClick={() => setViewType('grid')}
                    className={`p-1.5 rounded-md transition-colors ${
                      viewType === 'grid'
                        ? 'bg-forest-green text-off-white shadow-sm'
                        : 'text-charcoal/70 hover:text-sage-green'
                    }`}
                  >
                    <IconBento />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* List Kartu */}
          {isLoading ? (
            <div className="py-20 text-center text-16 md:text-18 font-semibold text-forest-green">
              Memuat daftar kecamatan...
            </div>
          ) : paginatedData.length === 0 ? (
            <div className="py-20 text-center bg-off-white rounded-xl border border-sage-green/20">
              <h3 className="text-18 md:text-20 font-bold text-forest-green mb-1">
                Pencarian tidak ditemukan
              </h3>
              <p className="text-charcoal text-14">
                Tidak ada data yang cocok dengan kata kunci tersebut.
              </p>
            </div>
          ) : (
            <div
              className={`grid gap-4 md:gap-6 pt-2 pb-6 ${
                viewType === 'list'
                  ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
                  : 'grid-cols-1 md:grid-cols-2'
              }`}
            >
              {paginatedData.map((item) => {
                const rawImg = item.foto || item.gambar || item.image || item.photo;
                let imgUrl = '';

                if (rawImg) {
                  if (rawImg.startsWith('data:')) {
                    imgUrl = rawImg;
                  } else {
                    const cleanPath = rawImg.replace(/\\/g, '/');
                    if (cleanPath.startsWith('http')) {
                      try {
                        const parsed = new URL(cleanPath);
                        imgUrl = `http://${window.location.hostname}:5000${parsed.pathname}`;
                      } catch {
                        imgUrl = cleanPath;
                      }
                    } else {
                      imgUrl = `http://${window.location.hostname}:5000${
                        cleanPath.startsWith('/') ? '' : '/'
                      }${cleanPath}`;
                    }
                  }
                }

                return (
                  <div key={item.id} className="h-full">
                    {/* 1. TAMPILAN KHUSUS MOBILE */}
                    <div className="md:hidden flex flex-col bg-off-white border border-sage-green/25 rounded-xl shadow-sm overflow-hidden h-full">
                      <div className="flex items-center gap-3 p-3 border-b border-sage-green/20 bg-off-white">
                        <img
                          src={imgUrl}
                          alt={item.title || item.namaKecamatan}
                          className="w-14 h-14 rounded-lg object-cover shrink-0 border border-sage-green/20 shadow-sm"
                        />
                        <h3 className="text-16 font-bold text-forest-green uppercase tracking-wide leading-tight">
                          {item.namaKecamatan || item.title}
                        </h3>
                      </div>
                      <div className="p-3 bg-mint-gray/40 flex-1 space-y-2 text-14 text-charcoal">
                        {Array.isArray(item.namaKelurahan) &&
                          item.namaKelurahan.length > 0 && (
                            <div>
                              <span className="font-semibold text-forest-green">
                                Kelurahan ({item.namaKelurahan.length}):{' '}
                              </span>
                              <span className="leading-relaxed">
                                {item.namaKelurahan.join(', ')}
                              </span>
                            </div>
                          )}
                        {Array.isArray(item.namaDesa) && item.namaDesa.length > 0 && (
                          <div>
                            <span className="font-semibold text-sage-green">
                              Desa ({item.namaDesa.length}):{' '}
                            </span>
                            <span className="leading-relaxed">
                              {item.namaDesa.join(', ')}
                            </span>
                          </div>
                        )}
                        {(!item.namaKelurahan || item.namaKelurahan.length === 0) &&
                          (!item.namaDesa || item.namaDesa.length === 0) && (
                            <p className="text-charcoal/60 italic text-13">
                              Belum ada data kelurahan/desa.
                            </p>
                          )}
                      </div>
                    </div>

                    {/* 2. TAMPILAN KHUSUS DESKTOP */}
                    <div className="hidden md:flex w-full h-full">
                      {viewType === 'list' ? (
                        /* --- KARTU ANIMASI (GRID DESKTOP) --- */
                        <div className="group relative w-full bg-charcoal rounded-xl overflow-hidden flex flex-col shrink-0 hover:-translate-y-2 transition-all duration-500 shadow-md hover:shadow-2xl h-[400px] border-l-4 border-sage-green cursor-pointer">
                          <img
                            src={imgUrl}
                            alt={item.title || item.namaKecamatan}
                            className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110 z-0"
                          />

                          <div className="absolute top-0 inset-x-0 h-[180px] bg-gradient-to-t from-charcoal/90 via-transparent to-transparent z-10 pointer-events-none transition-opacity duration-500 group-hover:opacity-0"></div>

                          <div className="absolute top-[250px] bottom-0 inset-x-0 bg-charcoal z-10 pointer-events-none"></div>

                          <div className="absolute top-[180px] h-[70px] inset-x-0 bg-charcoal transition-opacity duration-500 group-hover:opacity-0 z-10 pointer-events-none"></div>

                          <div className="absolute top-[130px] h-[120px] inset-x-0 bg-gradient-to-t from-charcoal to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100 z-10 pointer-events-none"></div>

                          <div className="absolute top-[180px] inset-x-0 border-t border-off-white/20 transition-opacity duration-500 group-hover:opacity-0 z-20 pointer-events-none"></div>

                          <div className="relative z-30 flex flex-col w-full h-full">
                            <div className="h-[180px] flex flex-col justify-end px-4 pb-3 shrink-0 pointer-events-none">
                              <h3 className="text-18 md:text-20 font-extrabold text-off-white uppercase tracking-wide drop-shadow-md">
                                {item.namaKecamatan || item.title}
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
                                  <p className="text-14 text-off-white/90 whitespace-pre-line leading-relaxed drop-shadow-md">
                                    {item.isi}
                                  </p>
                                )}

                                {Array.isArray(item.namaKelurahan) &&
                                  item.namaKelurahan.length > 0 && (
                                    <div>
                                      <span className="font-bold text-mint-gray text-14 drop-shadow-md">
                                        Kelurahan ({item.namaKelurahan.length}):{' '}
                                      </span>
                                      <span className="text-off-white/90 text-14 leading-relaxed drop-shadow-md">
                                        {item.namaKelurahan.join(', ')}
                                      </span>
                                    </div>
                                  )}

                                {Array.isArray(item.namaDesa) &&
                                  item.namaDesa.length > 0 && (
                                    <div>
                                      <span className="font-bold text-mint-gray text-14 drop-shadow-md">
                                        Desa ({item.namaDesa.length}):{' '}
                                      </span>
                                      <span className="text-off-white/90 text-14 leading-relaxed drop-shadow-md">
                                        {item.namaDesa.join(', ')}
                                      </span>
                                    </div>
                                  )}

                                {(!item.namaKelurahan ||
                                  item.namaKelurahan.length === 0) &&
                                  (!item.namaDesa || item.namaDesa.length === 0) &&
                                  !item.isi && (
                                    <p className="text-mint-gray/70 italic text-14 drop-shadow-md">
                                      Belum ada data detail wilayah.
                                    </p>
                                  )}
                              </div>
                            </div>
                          </div>
                        </div>
                      ) : (
                        /* --- KARTU LIST (LIST DESKTOP) --- */
                        <div className="group w-full flex bg-charcoal border-l-4 border-sage-green rounded-xl overflow-hidden shadow-md hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 min-h-[200px] cursor-pointer">
                          <div className="w-48 md:w-[280px] shrink-0 relative overflow-hidden bg-forest-green">
                            <img
                              src={imgUrl}
                              className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                              alt={item.title}
                            />

                            <div className="absolute inset-y-0 right-0 w-32 md:w-40 bg-gradient-to-l from-charcoal via-charcoal/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
                          </div>

                          <div className="p-5 flex flex-col flex-1">
                            <h3 className="text-18 md:text-20 font-extrabold text-off-white uppercase transition-colors duration-300">
                              {item.namaKecamatan || item.title}
                            </h3>
                            <hr className="border-off-white/15 my-3" />
                            <div className="space-y-2.5">
                              {Array.isArray(item.namaKelurahan) &&
                                item.namaKelurahan.length > 0 && (
                                  <div>
                                    <p className="font-semibold text-mint-gray uppercase tracking-wider text-13 mb-1">
                                      Kelurahan ({item.namaKelurahan.length})
                                    </p>
                                    <p className="leading-relaxed text-off-white/90 text-14">
                                      {item.namaKelurahan.join(', ')}
                                    </p>
                                  </div>
                                )}
                              {Array.isArray(item.namaDesa) &&
                                item.namaDesa.length > 0 && (
                                  <div>
                                    <p className="font-semibold text-mint-gray uppercase tracking-wider text-13 mb-1">
                                      Desa ({item.namaDesa.length})
                                    </p>
                                    <p className="leading-relaxed text-off-white/90 text-14">
                                      {item.namaDesa.join(', ')}
                                    </p>
                                  </div>
                                )}
                              {(!item.namaKelurahan ||
                                item.namaKelurahan.length === 0) &&
                                (!item.namaDesa || item.namaDesa.length === 0) && (
                                  <p className="text-mint-gray/70 italic text-14">
                                    Belum ada data kelurahan/desa.
                                  </p>
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
            <div className="mt-8 pt-6 md:pt-4 border-t border-sage-green/30 flex flex-col md:flex-row justify-between items-center gap-4 text-14 text-charcoal font-medium">
              <div className="hidden md:flex items-center gap-1">
                Tampilkan
                <div className="bg-off-white rounded px-1 py-0.5 border border-sage-green/30 mx-1">
                  <select
                    value={itemsPerPage}
                    onChange={(e) => {
                      setItemsPerPage(Number(e.target.value));
                      setCurrentPage(1);
                    }}
                    className="bg-transparent outline-none cursor-pointer text-charcoal"
                  >
                    <option value={4}>4</option>
                    <option value={8}>8</option>
                    <option value={12}>12</option>
                    <option value={16}>16</option>
                    <option value={20}>20</option>
                  </select>
                </div>
                Item Dari total {totalItems}
              </div>

              <div className="flex items-center gap-3 w-full md:w-auto justify-center md:justify-end bg-mint-gray md:bg-transparent p-2 rounded-xl md:p-0 border border-sage-green/20 md:border-none">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="p-1.5 disabled:opacity-30 hover:bg-sage-green/20 text-forest-green rounded transition-colors cursor-pointer disabled:cursor-not-allowed bg-off-white md:bg-transparent shadow-sm md:shadow-none"
                >
                  <ChevronLeftIcon />
                </button>
                <div className="flex items-center gap-1">
                  Halaman
                  <div className="bg-off-white rounded px-1 py-0.5 border border-sage-green/30 mx-1 shadow-sm md:shadow-none">
                    <select
                      value={currentPage}
                      onChange={(e) => setCurrentPage(Number(e.target.value))}
                      className="bg-transparent outline-none cursor-pointer text-charcoal"
                    >
                      {[...Array(totalPages)].map((_, i) => (
                        <option key={i + 1} value={i + 1}>
                          {i + 1}
                        </option>
                      ))}
                    </select>
                  </div>
                  Dari {totalPages}
                </div>
                <button
                  onClick={() =>
                    setCurrentPage((p) => Math.min(totalPages, p + 1))
                  }
                  disabled={currentPage === totalPages}
                  className="p-1.5 disabled:opacity-30 hover:bg-sage-green/20 text-forest-green rounded transition-colors cursor-pointer disabled:cursor-not-allowed bg-off-white md:bg-transparent shadow-sm md:shadow-none"
                >
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