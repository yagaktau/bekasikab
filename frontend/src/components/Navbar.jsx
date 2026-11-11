import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronDown, ExternalLink, Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import logoBekasi from '../assets/logo-bekasi.png';

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [mobileExpandedMenu, setMobileExpandedMenu] = useState(null);
  const location = useLocation();
  const [activeMenu, setActiveMenu] = useState('tentang');
  
  // State baru untuk mendeteksi apakah layar sedang di-scroll
  const [isScrolled, setIsScrolled] = useState(false);

  // Memantau pergerakan scroll
  useEffect(() => {
    const handleScroll = () => {
      // Jika scroll lebih dari 20px dari atas, set isScrolled ke true
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Menyesuaikan menu utama yang aktif berdasarkan URL & Scroll ke atas
  useEffect(() => {
    window.scrollTo(0, 0);

    const path = location.pathname.toLowerCase();
    if (path.includes('tentang')) {
      setActiveMenu('tentang');
    } else if (path.includes('pemerintahan') || path.includes('pimpinan') || path.includes('struktur') || path.includes('perangkat')) {
      setActiveMenu('pemerintahan');
    } else {
      setActiveMenu(null);
    }
  }, [location.pathname]);

  const toggleMenu = (menu) => {
    setActiveMenu(activeMenu === menu ? null : menu);
  };

  // Kunci scroll saat hamburger menu terbuka
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
      setMobileExpandedMenu(null);
    }
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMobileMenuOpen]);

  const toggleMobileAccordion = (menu) => {
    setMobileExpandedMenu(mobileExpandedMenu === menu ? null : menu);
  };

  const subMenuTentang = [
    { title: 'Selayang Pandang', path: '/tentangbekasi/SelayangPandang' },
    { title: 'Visi Misi', path: '/tentangbekasi/VisiMisi' },
    { title: 'Lambang', path: '/tentangbekasi/Lambang' },
    { title: 'Sejarah', path: '/tentangbekasi/Sejarah' },
  ];

  const subMenuPemerintahan = [
    { title: 'Pimpinan', path: '/pemerintahan/Pimpinan' },
    { title: 'Struktur', path: '/pemerintahan/Struktur' },
    { title: 'Daftar Perangkat', path: '/pemerintahan/DaftarPerangkat' },
  ];

  const activeSubMenuList = activeMenu === 'tentang' ? subMenuTentang 
                          : activeMenu === 'pemerintahan' ? subMenuPemerintahan 
                          : [];

  return (
    <header 
      // Background berubah dinamis berdasarkan state isScrolled
      className={`w-full text-white sticky top-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-bekasi-green/90 backdrop-blur-md shadow-md' 
          : 'bg-bekasi-green shadow-none'
      }`}
    >
      {/* ================= BARIS UTAMA (TOP NAV) ================= */}
      <div className="max-w-[1728px] mx-auto px-5 md:px-[64px] h-20 flex items-center justify-between">
        
        {/* LOGO & IDENTITAS */}
        <Link to="/" className="flex items-center gap-3 shrink-0 group">
          <img 
            src={logoBekasi} 
            alt="Logo Kabupaten Bekasi" 
            className="h-12 w-auto object-contain group-hover:scale-105 transition-transform duration-300" 
          />
          <div className="flex flex-col">
            <span className="font-bold text-18 md:text-20 leading-tight transition-colors group-hover:text-bekasi-gold">
              BekasiKab
            </span>
            <span className="hidden md:block text-12 text-white/80 leading-tight">
              Pemerintah Daerah Kabupaten Bekasi
            </span>
          </div>
        </Link>

        {/* MENU UTAMA DESKTOP */}
        <nav className="hidden md:flex items-center gap-8 text-16">
          
          <button 
            onClick={() => toggleMenu('tentang')}
            className={`flex items-center gap-1.5 transition-colors duration-300 hover:text-bekasi-gold ${
              activeMenu === 'tentang' ? 'font-bold text-bekasi-gold' : 'font-medium'
            }`}
          >
            Tentang Bekasi
            <motion.div
              animate={{ rotate: activeMenu === 'tentang' ? -180 : 0 }}
              transition={{ duration: 0.3 }}
            >
              <ChevronDown size={18} />
            </motion.div>
          </button>

          <button 
            onClick={() => toggleMenu('pemerintahan')}
            className={`flex items-center gap-1.5 transition-colors duration-300 hover:text-bekasi-gold ${
              activeMenu === 'pemerintahan' ? 'font-bold text-bekasi-gold' : 'font-medium'
            }`}
          >
            Pemerintahan
            <motion.div
              animate={{ rotate: activeMenu === 'pemerintahan' ? -180 : 0 }}
              transition={{ duration: 0.3 }}
            >
              <ChevronDown size={18} />
            </motion.div>
          </button>

          <a 
            href="https://lhkpn.kpk.go.id" 
            target="_blank" 
            rel="noreferrer" 
            className="flex items-center gap-1.5 font-medium transition-colors duration-300 hover:text-bekasi-gold hover:font-bold"
          >
            LHKPN <ExternalLink size={16} />
          </a>
        </nav>

        {/* TOMBOL HAMBURGER (KHUSUS MOBILE) */}
        <button
          type="button"
          aria-label="Toggle navigasi menu"
          aria-expanded={isMobileMenuOpen}
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="block md:hidden p-2 rounded-lg text-white hover:bg-black/10 focus:outline-none transition-colors"
        >
          {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* ================= BARIS KEDUA: SUB-MENU DESKTOP ================= */}
      <AnimatePresence>
        {activeMenu && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 48, opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            // Tambahkan transparansi juga pada sub-menu jika sedang di-scroll
            className={`hidden md:block overflow-hidden shadow-inner transition-colors duration-300 ${
              isScrolled ? 'bg-bekasi-gold/90 backdrop-blur-md' : 'bg-bekasi-gold'
            }`}
          >
            <div className="max-w-[1728px] mx-auto px-[64px] h-full flex items-center justify-center gap-12">
              {activeSubMenuList.map((item) => {
                const isActiveSub = location.pathname.toLowerCase() === item.path.toLowerCase();

                return (
                  <Link 
                    key={item.path}
                    to={item.path} 
                    className={`relative h-full flex items-center px-2 transition-colors duration-300 text-14 ${
                      isActiveSub ? 'font-extrabold text-gov-navy' : 'font-semibold text-gov-navy/70 hover:text-gov-navy hover:font-extrabold'
                    }`}
                  >
                    {item.title}
                    
                    {isActiveSub && (
                      <motion.div
                        layoutId="activeSubmenuUnderline"
                        className="absolute bottom-1 left-0 right-0 h-[3px] bg-gov-navy rounded-full"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                      />
                    )}
                  </Link>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ================= HAMBURGER DROPDOWN (KHUSUS MOBILE) ================= */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            // Sidebar HP juga diberikan sedikit transparansi & blur jika menu dibuka saat sedang scroll
            className={`block md:hidden border-t border-white/10 px-5 py-4 overflow-hidden transition-colors duration-300 ${
              isScrolled ? 'bg-[#0A4D2C]/95 backdrop-blur-md' : 'bg-[#0A4D2C]'
            }`}
          >
            {/* Dropdown Tentang Bekasi */}
            <div className="mb-4">
              <button 
                onClick={() => toggleMobileAccordion('tentang')}
                className="flex items-center justify-between w-full text-left focus:outline-none py-2"
              >
                <span className="text-14 text-bekasi-gold font-bold uppercase tracking-wider">
                  Tentang Bekasi
                </span>
                <motion.div animate={{ rotate: mobileExpandedMenu === 'tentang' ? -180 : 0 }} transition={{ duration: 0.3 }}>
                  <ChevronDown size={18} className="text-bekasi-gold" />
                </motion.div>
              </button>
              
              <AnimatePresence>
                {mobileExpandedMenu === 'tentang' && (
                  <motion.div 
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden space-y-1 pl-2 border-l-2 border-bekasi-gold/50 mt-1"
                  >
                    {subMenuTentang.map((item) => (
                      <Link 
                        key={item.path}
                        to={item.path} 
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="block py-1.5 text-14 text-white/80 hover:text-white hover:font-bold transition-all"
                      >
                        • {item.title}
                      </Link>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Dropdown Pemerintahan */}
            <div className="mb-4">
              <button 
                onClick={() => toggleMobileAccordion('pemerintahan')}
                className="flex items-center justify-between w-full text-left focus:outline-none py-2"
              >
                <span className="text-14 text-bekasi-gold font-bold uppercase tracking-wider">
                  Pemerintahan
                </span>
                <motion.div animate={{ rotate: mobileExpandedMenu === 'pemerintahan' ? -180 : 0 }} transition={{ duration: 0.3 }}>
                  <ChevronDown size={18} className="text-bekasi-gold" />
                </motion.div>
              </button>
              
              <AnimatePresence>
                {mobileExpandedMenu === 'pemerintahan' && (
                  <motion.div 
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden space-y-1 pl-2 border-l-2 border-bekasi-gold/50 mt-1"
                  >
                    {subMenuPemerintahan.map((item) => (
                      <Link 
                        key={item.path}
                        to={item.path} 
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="block py-1.5 text-14 text-white/80 hover:text-white hover:font-bold transition-all"
                      >
                        • {item.title}
                      </Link>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            
            <div className="pt-2 border-t border-white/10 mt-2">
              <a 
                href="https://lhkpn.kpk.go.id" 
                target="_blank" 
                rel="noreferrer" 
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center gap-2 py-2 text-white hover:text-bekasi-gold hover:font-bold transition-all"
              >
                LHKPN <ExternalLink size={16} />
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}