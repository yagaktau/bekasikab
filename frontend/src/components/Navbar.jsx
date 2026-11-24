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
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);

    const path = location.pathname.toLowerCase();
    if (path.includes('tentang')) {
      setActiveMenu('tentang');
    } else if (
      path.includes('pemerintahan') ||
      path.includes('pimpinan') ||
      path.includes('struktur') ||
      path.includes('perangkat')
    ) {
      setActiveMenu('pemerintahan');
    } else {
      setActiveMenu(null);
    }
  }, [location.pathname]);

  const toggleMenu = (menu) => {
    setActiveMenu(activeMenu === menu ? null : menu);
  };

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

  const activeSubMenuList =
    activeMenu === 'tentang'
      ? subMenuTentang
      : activeMenu === 'pemerintahan'
      ? subMenuPemerintahan
      : [];

  return (
    <header
      className={`w-full text-off-white sticky top-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-forest-green/95 backdrop-blur-md shadow-md'
          : 'bg-forest-green shadow-none'
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
            <span className="font-bold text-18 md:text-20 leading-tight text-off-white transition-colors group-hover:text-mint-gray">
              BekasiKab
            </span>
            <span className="hidden md:block text-12 text-mint-gray/85 leading-tight">
              Pemerintah Daerah Kabupaten Bekasi
            </span>
          </div>
        </Link>

        {/* MENU UTAMA DESKTOP */}
        <nav className="hidden md:flex items-center gap-4 text-16">
          <button
            onClick={() => toggleMenu('tentang')}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg transition-colors duration-300 ${
              activeMenu === 'tentang'
                ? 'font-bold bg-sage-green text-off-white'
                : 'font-medium text-off-white/90 hover:bg-sage-green/70 hover:text-off-white'
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
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg transition-colors duration-300 ${
              activeMenu === 'pemerintahan'
                ? 'font-bold bg-sage-green text-off-white'
                : 'font-medium text-off-white/90 hover:bg-sage-green/70 hover:text-off-white'
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
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg font-medium text-off-white/90 transition-colors duration-300 hover:bg-sage-green/70 hover:text-off-white"
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
          className="block md:hidden p-2 rounded-lg text-off-white hover:bg-sage-green focus:outline-none transition-colors"
        >
          {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* ================= BARIS KEDUA: SUB-MENU DESKTOP (MINT GRAY) ================= */}
      <AnimatePresence>
        {activeMenu && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 48, opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className={`hidden md:block overflow-hidden border-b border-sage-green/20 transition-colors duration-300 ${
              isScrolled ? 'bg-mint-gray/95 backdrop-blur-md' : 'bg-mint-gray'
            }`}
          >
            <div className="max-w-[1728px] mx-auto px-[64px] h-full flex items-center justify-center gap-12">
              {activeSubMenuList.map((item) => {
                const isActiveSub =
                  location.pathname.toLowerCase() === item.path.toLowerCase();

                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`relative h-full flex items-center px-2 transition-colors duration-300 text-14 ${
                      isActiveSub
                        ? 'font-extrabold text-forest-green'
                        : 'font-semibold text-charcoal/80 hover:text-sage-green hover:font-extrabold'
                    }`}
                  >
                    {item.title}

                    {isActiveSub && (
                      <motion.div
                        layoutId="activeSubmenuUnderline"
                        className="absolute bottom-1 left-0 right-0 h-[3px] bg-forest-green rounded-full"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
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
            className={`block md:hidden border-t border-sage-green/50 px-5 py-4 overflow-hidden transition-colors duration-300 ${
              isScrolled ? 'bg-forest-green/95 backdrop-blur-md' : 'bg-forest-green'
            }`}
          >
            {/* Dropdown Tentang Bekasi */}
            <div className="mb-4">
              <button
                onClick={() => toggleMobileAccordion('tentang')}
                className="flex items-center justify-between w-full text-left focus:outline-none py-2"
              >
                <span className="text-14 text-mint-gray font-bold uppercase tracking-wider">
                  Tentang Bekasi
                </span>
                <motion.div
                  animate={{ rotate: mobileExpandedMenu === 'tentang' ? -180 : 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <ChevronDown size={18} className="text-mint-gray" />
                </motion.div>
              </button>

              <AnimatePresence>
                {mobileExpandedMenu === 'tentang' && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden space-y-1 pl-2 border-l-2 border-sage-green mt-1"
                  >
                    {subMenuTentang.map((item) => (
                      <Link
                        key={item.path}
                        to={item.path}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="block py-1.5 px-2 rounded-md text-14 text-off-white/85 hover:text-off-white hover:bg-sage-green/60 hover:font-bold transition-all"
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
                <span className="text-14 text-mint-gray font-bold uppercase tracking-wider">
                  Pemerintahan
                </span>
                <motion.div
                  animate={{
                    rotate: mobileExpandedMenu === 'pemerintahan' ? -180 : 0,
                  }}
                  transition={{ duration: 0.3 }}
                >
                  <ChevronDown size={18} className="text-mint-gray" />
                </motion.div>
              </button>

              <AnimatePresence>
                {mobileExpandedMenu === 'pemerintahan' && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden space-y-1 pl-2 border-l-2 border-sage-green mt-1"
                  >
                    {subMenuPemerintahan.map((item) => (
                      <Link
                        key={item.path}
                        to={item.path}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="block py-1.5 px-2 rounded-md text-14 text-off-white/85 hover:text-off-white hover:bg-sage-green/60 hover:font-bold transition-all"
                      >
                        • {item.title}
                      </Link>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="pt-2 border-t border-sage-green/50 mt-2">
              <a
                href="https://lhkpn.kpk.go.id"
                target="_blank"
                rel="noreferrer"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center gap-2 py-2 px-2 rounded-md text-off-white hover:bg-sage-green/60 hover:font-bold transition-all"
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