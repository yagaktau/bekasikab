import logoBekasi from '../assets/logo-bekasi.png';

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <footer className="w-full bg-bekasi-gold-light text-slate-800 py-10 md:py-12">
      <div className="max-w-[1728px] mx-auto px-5 md:px-[64px]">
        
        {/* === BARIS ATAS: Logo & Judul === */}
        <div className="flex items-center gap-4 mb-6">
          <img 
            src={logoBekasi} 
            alt="Logo Kabupaten Bekasi" 
            className="h-14 md:h-16 w-auto object-contain" 
          />
          <div className="flex flex-col">
            <h2 className="text-20 md:text-24 font-bold leading-tight">BekasiKab</h2>
            <p className="text-14 md:text-16 text-slate-600">Pemerintah Daerah Kabupaten Bekasi</p>
          </div>
        </div>

        {/* Garis Horizontal */}
        <hr className="border-slate-300 mb-8" />

        {/* === BARIS BAWAH: Grid 12 Kolom === */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-0">
          
          {/* KOLOM 1: Lokasi (Lebar ~5 kolom) */}
          <div className="md:col-span-5 flex items-start gap-3 md:pr-8 border-b border-slate-300 md:border-b-0 pb-6 md:pb-0">
            {/* Ikon Marker */}
            <svg className="w-6 h-6 mt-1 shrink-0" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
            </svg>
            <div>
              <h3 className="text-20 font-semibold mb-2">Lokasi</h3>
              <p className="text-16 leading-relaxed text-slate-600">
                Jl. Wibawa Mukti, Sukamahi, Kec. Cikarang Pusat, Kabupaten Bekasi, Jawa Barat 17530
              </p>
            </div>
          </div>

          {/* KOLOM 2: Media Sosial (Lebar ~4 kolom, dengan border kiri) */}
          <div className="md:col-span-4 flex items-start gap-3 md:border-l md:border-slate-300 md:px-8 border-b border-slate-300 md:border-b-0 pb-6 md:pb-0">
            {/* Ikon Globe */}
            <svg className="w-6 h-6 mt-1 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.6 9h16.8M3.6 15h16.8" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M11.5 3a17 17 0 000 18M12.5 3a17 17 0 000-18" />
            </svg>
            <div className="w-full">
              <h3 className="text-20 font-semibold mb-3">Media Sosial</h3>
              {/* Ikon Medsos */}
              <div className="flex items-center gap-4 text-slate-800">
                {/* Facebook */}
                <a href="#" className="hover:text-blue-600 transition-colors" aria-label="Facebook">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c5.05-.5 9-4.76 9-9.95z"/></svg>
                </a>
                {/* Instagram */}
                <a href="#" className="hover:text-pink-600 transition-colors" aria-label="Instagram">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect width="16" height="16" x="4" y="4" rx="4" strokeLinecap="round" strokeLinejoin="round"/><circle cx="12" cy="12" r="3" strokeLinecap="round" strokeLinejoin="round"/><path d="M16.5 7.5h.01" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </a>
                {/* X / Twitter */}
                <a href="#" className="hover:text-black transition-colors" aria-label="X (Twitter)">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                </a>
                {/* YouTube */}
                <a href="#" className="hover:text-red-600 transition-colors" aria-label="YouTube">
                  <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24"><path d="M21.582 6.186a2.686 2.686 0 00-1.884-1.898C18.04 3.84 12 3.84 12 3.84s-6.04 0-7.698.448a2.686 2.686 0 00-1.884 1.898C2 7.854 2 12.04 2 12.04s0 4.186.418 5.854a2.686 2.686 0 001.884 1.898C5.96 20.24 12 20.24 12 20.24s6.04 0 7.698-.448a2.686 2.686 0 001.884-1.898c.418-1.668.418-5.854.418-5.854s0-4.186-.418-5.854zM9.99 15.44v-6.8l6.02 3.4-6.02 3.4z"/></svg>
                </a>
              </div>
            </div>
          </div>

          {/* KOLOM 3: Kembali ke Atas (Lebar ~3 kolom, dengan border kiri) */}
          <div className="md:col-span-3 flex items-center justify-center md:border-l md:border-slate-300 md:pl-8 pt-4 md:pt-0">
            <button 
              onClick={scrollToTop}
              className="flex items-center justify-center gap-3 text-18 md:text-20 font-medium hover:text-bekasi-gold transition-colors group bg-white/50 md:bg-transparent px-6 py-3 md:p-0 rounded-full w-full md:w-auto"
            >
              <span className="text-left leading-tight">Kembali ke atas</span>
              <svg 
                className="w-6 h-6 md:w-8 md:h-8 group-hover:-translate-y-1 transition-transform duration-300" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2.5" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}