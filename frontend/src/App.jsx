import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// Import dari Subfolder Tentang
import SelayangPandang from './pages/tentangbekasi/SelayangPandang/SelayangPandang';
import VisiMisi from './pages/tentangbekasi/VisiMisi/VisiMisi';
import Lambang from './pages/tentangbekasi/Lambang/Lambang';
import Sejarah from './pages/tentangbekasi/Sejarah/Sejarah';

// Import dari Subfolder Kecamatan
import Kecamatan from './pages/tentangbekasi/SelayangPandang/Components/Kecamatan';

// Import dari Subfolder Pemerintahan
import Pimpinan from './pages/pemerintahan/Pimpinan/Pimpinan';
import Struktur from './pages/pemerintahan/Struktur/Struktur';
import DaftarPerangkat from './pages/pemerintahan/Daftar/DaftarPerangkat';

export default function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <Navbar />
        
        <main className="flex-grow">
          <Routes>
            {/* 1. TAMBAHKAN RUTE DEFAULT (BERANDA) AGAR TIDAK KOSONG SAAT WEB DIBUKA */}
            <Route path="/" element={<div className="p-20 text-center text-xl font-bold">Halaman Beranda (Belum Dibuat)</div>} />

            {/* 2. SESUAIKAN PATH AGAR SAMA PERSIS DENGAN LINK (to="...") DI NAVBAR */}
            {/* Submenu Tentang Bekasi */}
            <Route path="/tentangbekasi/SelayangPandang" element={<SelayangPandang />} />
            <Route path="/tentangbekasi/VisiMisi" element={<VisiMisi />} />
            <Route path="/tentangbekasi/Lambang" element={<Lambang />} />
            <Route path="/tentangbekasi/Sejarah" element={<Sejarah />} />

            {/* Submenu Kecamatan */}
            <Route path="/kecamatan" element={<Kecamatan />} /> {/* Contoh halaman default kecamatan */}

            {/* Submenu Pemerintahan */}
            <Route path="/pemerintahan/Pimpinan" element={<Pimpinan />} /> {/* Contoh halaman default pemerintahan */}
            <Route path="/pemerintahan/Struktur" element={<Struktur />} />
            <Route path="/pemerintahan/DaftarPerangkat" element={<DaftarPerangkat />} />
          </Routes>
        </main>

        <Footer />
      </div>
    </Router>
  );
}