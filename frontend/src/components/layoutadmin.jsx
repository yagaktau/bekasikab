import React from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { LayoutDashboard, Users, Map, FileText, Settings, LogOut } from 'lucide-react';

export default function layoutadmin() {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    // Hapus token dan kembalikan ke halaman login
    localStorage.removeItem('adminToken');
    navigate('/admin/login');
  };

  const menuItems = [
    { name: 'Dashboard', icon: <LayoutDashboard size={20} />, path: '/admin/dashboard' },
    { name: 'Pimpinan', icon: <Users size={20} />, path: '/admin/pimpinan' },
    { name: 'Kecamatan', path: '/admin/kecamatan' },
    { name: 'Halaman & Profil', icon: <FileText size={20} />, path: '/admin/pages' },
    { name: 'Pengaturan', icon: <Settings size={20} />, path: '/admin/settings' },
  ];

  return (
    <div className="flex h-screen bg-slate-100 font-sans">
      
      {/* SIDEBAR */}
      <aside className="w-64 bg-[#0B5D34] text-white flex flex-col shadow-xl">
        <div className="p-6 border-b border-white/20">
          <h2 className="text-20 font-bold tracking-wide">Admin Panel</h2>
          <p className="text-12 text-[#CBBAB8] mt-1">Kabupaten Bekasi</p>
        </div>

        <nav className="flex-1 py-6 flex flex-col gap-2 px-4">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.name}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${
                  isActive 
                    ? 'bg-white text-[#0B5D34] font-bold shadow-md' 
                    : 'hover:bg-white/10 text-white/90'
                }`}
              >
                {item.icon}
                <span className="text-15">{item.name}</span>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-white/20">
          <button 
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-4 py-3 text-red-300 hover:bg-red-500/20 hover:text-red-200 rounded-xl transition-colors"
          >
            <LogOut size={20} />
            <span className="font-semibold">Keluar</span>
          </button>
        </div>
      </aside>

      {/* KONTEN UTAMA (Kanan) */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Header Atas */}
        <header className="bg-white h-16 border-b border-slate-200 flex items-center px-8 shadow-sm">
          <h1 className="text-18 font-bold text-slate-700 capitalize">
            {location.pathname.split('/').pop() || 'Dashboard'}
          </h1>
        </header>

        {/* Area Konten Dinamis */}
        <div className="flex-1 overflow-auto p-8">
          <Outlet /> 
        </div>
      </main>

    </div>
  );
}