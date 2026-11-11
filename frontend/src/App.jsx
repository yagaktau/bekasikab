import { BrowserRouter as Router, Routes, Route, Outlet } from 'react-router-dom';
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

// Import Login Admin
import AdminLogin from './pages/admin/Login'; 
import AdminLayout from './components/layoutadmin'; // Layout khusus untuk halaman admin

// =======================================================
// 1. LAYOUT PUBLIK (Untuk Pengunjung Web)
// =======================================================
function PublicLayout() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">
        {/* <Outlet /> adalah tempat komponen halaman dirender */}
        <Outlet /> 
      </main>
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <Routes>
        
        {/* === GRUP RUTE PUBLIK (Pakai Navbar & Footer) === */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<div className="p-20 text-center text-xl font-bold">Halaman Beranda (Belum Dibuat)</div>} />

          {/* Submenu Tentang Bekasi */}
          <Route path="/tentangbekasi/SelayangPandang" element={<SelayangPandang />} />
          <Route path="/tentangbekasi/VisiMisi" element={<VisiMisi />} />
          <Route path="/tentangbekasi/Lambang" element={<Lambang />} />
          <Route path="/tentangbekasi/Sejarah" element={<Sejarah />} />

          {/* Submenu Kecamatan */}
          <Route path="/kecamatan" element={<Kecamatan />} />

          {/* Submenu Pemerintahan */}
          <Route path="/pemerintahan/Pimpinan" element={<Pimpinan />} />
          <Route path="/pemerintahan/Struktur" element={<Struktur />} />
          <Route path="/pemerintahan/DaftarPerangkat" element={<DaftarPerangkat />} />
        </Route>

        {/* === GRUP RUTE ADMIN === */}
        <Route path="/admin/login" element={<AdminLogin />} />

        <Route element={<AdminLayout />}>
          <Route path="/admin/dashboard" element={<div className="bg-white p-6 rounded-xl shadow-sm">Selamat Datang di Dashboard Admin!</div>} />
          {/* Nanti rute CRUD pimpinan dll masuk ke sini */}
        </Route>

      </Routes>
    </Router>
  );
}