import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Search, List, LayoutGrid, ExternalLink, ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';
import API from '../../../../services/api'; // Sesuaikan path ini dengan pengaturan axios/fetch kamu

export default function PerangkatList() {
  // --- STATE DATA API ---
  const [dataPerangkat, setDataPerangkat] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // --- STATE UI & PAGINATION ---
  const [viewMode, setViewMode] = useState('list');
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');

  // 1. Fetch Data dari API
  useEffect(() => {
    // GANTI baris API.get ini, gunakan backtick (`)
    API.get(`http://${window.location.hostname}:5000/api/perangkat`) 
      .then((res) => {
        setDataPerangkat(res.data);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error("Gagal mengambil data perangkat:", err);
        setIsLoading(false);
      });
  }, []);

  // 2. Logika Pencarian (Search)
  const filteredData = useMemo(() => {
    return dataPerangkat.filter(item => 
      item.name?.toLowerCase().includes(searchQuery.toLowerCase()) || 
      item.email?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [dataPerangkat, searchQuery]);

  // 3. Logika Pagination
  const totalPerangkat = filteredData.length;
  const totalPages = Math.ceil(totalPerangkat / itemsPerPage) || 1;
  
  // Reset page ke 1 kalau hasil pencarian berubah
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, itemsPerPage]);

  const paginatedData = filteredData.slice(
    (currentPage - 1) * itemsPerPage, 
    currentPage * itemsPerPage
  );

  const handleItemsPerPageChange = (e) => {
    setItemsPerPage(Number(e.target.value));
  };

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  // 4. Logika Efek Reveal Animasi
  const revealRefs = useRef([]);
  revealRefs.current = []; 

  const addToRefs = (el) => {
    if (el && !revealRefs.current.includes(el)) {
      revealRefs.current.push(el);
    }
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('opacity-100', 'translate-y-0');
            entry.target.classList.remove('opacity-0', 'translate-y-12');
          }
        });
      },
      { threshold: 0.1 } 
    );

    revealRefs.current.forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => observer.disconnect();
  }, [viewMode, paginatedData, itemsPerPage, currentPage]);

  return (
    <div className="max-w-[1400px] mx-auto px-5 md:px-[64px] mt-8 md:mt-16">
      <h2 
        ref={addToRefs} 
        className="opacity-0 translate-y-12 transition-all duration-700 ease-out text-24 md:text-32 font-bold text-slate-900 mb-6 md:mb-8"
      >
        Daftar Perangkat Daerah
      </h2>

      <div 
        ref={addToRefs} 
        className="opacity-0 translate-y-12 transition-all duration-700 ease-out bg-[#CBBAB8] p-4 md:p-8 rounded-2xl md:rounded-xl shadow-inner flex flex-col gap-4 md:gap-6"
      >
        
        {/* ================= BARIS PENCARIAN & KONTROL ================= */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 border-b border-[#A38A88]/60 md:border-[#A38A88] pb-4 md:pb-6">
          
          <div className="flex w-full md:w-auto gap-2">
            <div className="relative flex-1 md:w-[350px]">
              <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
              <input 
                type="text" 
                placeholder="Cari Badan, Institusi, dan Dinas" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#EADFDE] text-14 md:text-16 text-slate-800 placeholder-slate-500 pl-10 pr-3 py-2.5 md:py-2 rounded-xl md:rounded-md focus:outline-none focus:ring-2 focus:ring-[#8D7674]"
              />
            </div>
            <button className="bg-[#8D7674] hover:bg-[#7A6462] text-white px-5 py-2.5 md:py-2 rounded-xl md:rounded-md font-semibold text-14 md:text-16 transition-colors duration-300">
              Cari
            </button>
          </div>

          <div className="hidden md:flex items-center gap-3 text-slate-800 font-medium">
            <span className="text-15">Tipe Tampilan</span>
            <button 
              onClick={() => setViewMode('list')}
              className={`p-1.5 rounded transition-colors duration-300 ${viewMode === 'list' ? 'bg-[#333333] text-white' : 'hover:bg-[#EADFDE]'}`}
              title="Tampilan Daftar"
            >
              <List size={20} />
            </button>
            <button 
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded transition-colors duration-300 ${viewMode === 'grid' ? 'bg-[#333333] text-white' : 'hover:bg-[#EADFDE]'}`}
              title="Tampilan Bento/Grid"
            >
              <LayoutGrid size={20} />
            </button>
          </div>

        </div>

        {/* ================= DAFTAR KARTU PERANGKAT ================= */}
        {isLoading ? (
          <div className="py-10 text-center text-slate-700 font-semibold">Memuat daftar perangkat daerah...</div>
        ) : dataPerangkat.length === 0 ? (
          <div className="py-12 text-center bg-white/40 rounded-xl border border-white/50">
            <h3 className="text-xl font-bold text-slate-800 mb-2">Belum Ada Data</h3>
            <p className="text-slate-600">Daftar perangkat belum ditambahkan dari Dashboard Admin.</p>
          </div>
        ) : filteredData.length === 0 ? (
          <div className="py-10 text-center text-slate-700">Tidak ada perangkat yang cocok dengan pencarian "{searchQuery}".</div>
        ) : (
          <div className={`
            grid gap-4
            ${viewMode === 'list' ? 'grid-cols-1' : 'grid-cols-1 md:grid-cols-2'}
          `}>
            {paginatedData.map((item) => (
              <div 
                key={item.id}
                ref={addToRefs}
                className="opacity-0 translate-y-12 transition-all duration-700 ease-out flex bg-[#EADFDE] p-4 md:p-5 rounded-2xl md:rounded-xl shadow-sm hover:shadow-md border border-transparent hover:border-[#8D7674]"
              >
                
                {/* Bagian Kiri: Kotak Logo di Daftar.jsx */}
                <div className="w-[70px] h-[70px] md:w-[90px] md:h-[90px] bg-[#9F8A88] rounded-xl shrink-0 flex items-center justify-center overflow-hidden">
                  {item.logo ? (
                      <img 
                        // GANTI baris src ini, gunakan backtick (`)
                        src={item.logo.startsWith('http') ? item.logo : `http://${window.location.hostname}:5000${item.logo}`} 
                        alt={`Logo ${item.name}`} 
                        className="w-full h-full object-cover" 
                      />
                  ) : (
                    <span className="text-white/40 text-xs font-bold px-2 text-center leading-tight">Tidak Ada Logo</span>
                  )}
                </div>
                
                {/* Bagian Kanan: Konten Teks & Tombol */}
                <div className="ml-4 flex flex-col justify-start flex-1 min-w-0">
                  <h3 className="font-bold text-15 md:text-17 text-slate-900 leading-tight mb-1">
                    {item.name || "Nama Badan, Institusi, atau Dinas"}
                  </h3>
                  
                  {/* TAMBAHKAN break-all di class ini agar teks yang kepanjangan otomatis turun ke baris baru */}
                  <p className="text-13 md:text-14 text-slate-600 mb-3 break-all">
                    {item.email || "Alamat email"}
                  </p>
                  
                  <button 
                    onClick={() => window.open(item.website || '#', '_blank')}
                    className="flex items-center justify-center md:justify-start gap-2 bg-[#9F8A88] text-white text-12 md:text-13 font-semibold px-4 py-2 md:py-1.5 rounded-lg md:rounded hover:bg-[#7A6462] transition-colors duration-300 w-fit"
                  >
                    <span>Kunjungi Website</span> 
                    <ExternalLink size={14} />
                  </button>
                </div>

              </div>
            ))}
          </div>
        )}

        {/* ================= PAGINATION ================= */}
        {filteredData.length > 0 && (
          <>
            {/* PAGINATION (MOBILE) */}
            <div className="flex md:hidden justify-between items-center border-t border-[#A38A88]/60 pt-4 mt-1 text-14 text-slate-800 font-medium">
              <button 
                onClick={handlePrevPage}
                disabled={currentPage === 1}
                className={`p-1.5 rounded-lg transition-colors ${currentPage === 1 ? 'text-slate-400 cursor-not-allowed' : 'hover:bg-[#A38A88] hover:text-white'}`}
              >
                <ChevronLeft size={20} />
              </button>

              <div className="flex items-center gap-2">
                <span>Halaman</span>
                <div className="relative">
                  <select 
                    value={currentPage}
                    onChange={(e) => setCurrentPage(Number(e.target.value))}
                    className="appearance-none bg-transparent font-bold pl-2 pr-6 py-0.5 text-center focus:outline-none cursor-pointer"
                  >
                    {Array.from({ length: totalPages }, (_, i) => (
                      <option key={i + 1} value={i + 1}>{i + 1}</option>
                    ))}
                  </select>
                  <ChevronDown size={16} className="absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none text-slate-700" />
                </div>
                <span>Dari <strong>{totalPages}</strong></span>
              </div>

              <button 
                onClick={handleNextPage}
                disabled={currentPage === totalPages}
                className={`p-1.5 rounded-lg transition-colors ${currentPage === totalPages ? 'text-slate-400 cursor-not-allowed' : 'hover:bg-[#A38A88] hover:text-white'}`}
              >
                <ChevronRight size={20} />
              </button>
            </div>

            {/* PAGINATION (DESKTOP) */}
            <div className="hidden md:flex justify-between items-center border-t border-[#A38A88] pt-6 mt-2 text-14 text-slate-800 font-medium">
              <div className="flex items-center gap-2">
                <span>Tampilkan</span>
                <div className="relative">
                  <select 
                    value={itemsPerPage}
                    onChange={handleItemsPerPageChange}
                    className="appearance-none bg-[#EADFDE] pl-3 pr-8 py-1 rounded cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#8D7674] hover:bg-[#D8C7C6]"
                  >
                    <option value={5}>5</option>
                    <option value={10}>10</option>
                    <option value={20}>20</option>
                    <option value={totalPerangkat}>Semua ({totalPerangkat})</option>
                  </select>
                  <ChevronDown size={14} className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
                <span>item Dari total {totalPerangkat}</span>
              </div>

              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <span>Halaman</span>
                  <div className="relative">
                    <select 
                      value={currentPage}
                      onChange={(e) => setCurrentPage(Number(e.target.value))}
                      className="appearance-none bg-[#EADFDE] pl-3 pr-8 py-1 rounded cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#8D7674] hover:bg-[#D8C7C6]"
                    >
                      {Array.from({ length: totalPages }, (_, i) => (
                        <option key={i + 1} value={i + 1}>{i + 1}</option>
                      ))}
                    </select>
                    <ChevronDown size={14} className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                  <span>Dari {totalPages}</span>
                </div>
                <div className="flex gap-1">
                  <button 
                    onClick={handlePrevPage}
                    disabled={currentPage === 1}
                    className={`p-1 rounded transition-colors ${currentPage === 1 ? 'text-gray-400 cursor-not-allowed' : 'hover:bg-[#8D7674] hover:text-white'}`}
                  >
                    <ChevronLeft size={18} />
                  </button>
                  <button 
                    onClick={handleNextPage}
                    disabled={currentPage === totalPages}
                    className={`p-1 rounded transition-colors ${currentPage === totalPages ? 'text-gray-400 cursor-not-allowed' : 'hover:bg-[#8D7674] hover:text-white'}`}
                  >
                    <ChevronRight size={18} />
                  </button>
                </div>
              </div>
            </div>
          </>
        )}

      </div>
    </div>
  );
}