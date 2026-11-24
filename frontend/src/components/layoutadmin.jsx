import React, { useEffect } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  Home,
  Network,
  Database,
  List,
  LogOut,
  ShieldCheck,
} from 'lucide-react';

export default function AdminLayout() {
  const navigate = useNavigate();
  const location = useLocation();

  // Ambil role dari adminUser atau decode payload JWT
  const getAdminInfo = () => {
    try {
      const saved = JSON.parse(localStorage.getItem('adminUser') || 'null');
      if (saved?.role) return saved;
    } catch {}

    try {
      const token = localStorage.getItem('token');
      if (token) {
        const payload = JSON.parse(atob(token.split('.')[1]));
        return { email: payload.email, role: payload.role || 'ADMIN' };
      }
    } catch {}

    return { name: 'Admin', role: 'ADMIN' };
  };

  const adminInfo = getAdminInfo();
  const isSuperAdmin = adminInfo.role === 'SUPER_ADMIN';

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/admin/login');
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
    navigate('/admin/login');
  };

  const menuItems = [
    { name: 'Dashboard', icon: <LayoutDashboard size={20} />, path: '/admin/dashboard' },
    { name: 'Pimpinan', icon: <Users size={20} />, path: '/admin/Pimpinan' },
    { name: 'Kecamatan', icon: <Home size={20} />, path: '/admin/kecamatan' },
    { name: 'Struktur', icon: <Network size={20} />, path: '/admin/struktur' },
    { name: 'Daftar Perangkat', icon: <List size={20} />, path: '/admin/Daftar' },
    { name: 'Realisasi Anggaran', icon: <Database size={20} />, path: '/admin/realisasi' },
    ...(isSuperAdmin
      ? [{ name: 'Kelola Admin', icon: <ShieldCheck size={20} />, path: '/admin/users' }]
      : []),
  ];

  return (
    <div className="flex h-screen bg-off-white text-charcoal font-sans">
      {/* SIDEBAR (Forest Green) */}
      <aside className="w-64 bg-forest-green text-off-white flex flex-col shadow-xl">
        <div className="p-6 border-b border-sage-green/50">
          <h2 className="text-20 font-bold tracking-wide text-off-white">
            Admin Panel
          </h2>
          <p className="text-12 text-mint-gray mt-1">Kabupaten Bekasi</p>
          <span
            className={`inline-block mt-3 px-2.5 py-0.5 rounded text-11 font-bold uppercase tracking-wider ${
              isSuperAdmin
                ? 'bg-mint-gray text-forest-green'
                : 'bg-sage-green text-off-white'
            }`}
          >
            {isSuperAdmin ? 'Super Admin' : 'Admin'}
          </span>
        </div>

        <nav className="flex-1 py-6 flex flex-col gap-2 px-4 overflow-y-auto">
          {menuItems.map((item) => {
            const isActive =
              location.pathname.toLowerCase() === item.path.toLowerCase();
            return (
              <Link
                key={item.name}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${
                  isActive
                    ? 'bg-off-white text-forest-green font-bold shadow-md'
                    : 'hover:bg-sage-green text-off-white/90 hover:text-off-white'
                }`}
              >
                {item.icon}
                <span className="text-15">{item.name}</span>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-sage-green/50">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-4 py-3 text-red-200 hover:bg-red-500/20 hover:text-white rounded-xl transition-colors"
          >
            <LogOut size={20} />
            <span className="font-semibold">Keluar</span>
          </button>
        </div>
      </aside>

      {/* KONTEN UTAMA (Kanan) */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Header Atas (Mint Gray sebagai section alternatif) */}
        <header className="bg-mint-gray h-16 border-b border-sage-green/30 flex items-center justify-between px-8 shadow-sm">
          <h1 className="text-18 font-bold text-forest-green capitalize">
            {location.pathname.split('/').pop() || 'Dashboard'}
          </h1>
          <span className="text-13 font-medium text-charcoal">
            {adminInfo.name || adminInfo.email}
          </span>
        </header>

        {/* Area Konten Dinamis (Off White sebagai background utama) */}
        <div className="flex-1 overflow-auto p-8 bg-off-white text-charcoal">
          <Outlet />
        </div>
      </main>
    </div>
  );
}