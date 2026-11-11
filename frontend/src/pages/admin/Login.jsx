import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, Mail } from 'lucide-react';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // Sesuaikan URL http://localhost:5000 dengan port backend kamu jika berbeda
      const response = await fetch('http://localhost:5000/api/admin/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        // Jika sukses, simpan token ke localStorage
        localStorage.setItem('adminToken', data.token);
        
        // Arahkan ke halaman dashboard
        navigate('/admin/dashboard'); 
      } else {
        // Jika salah password/email
        alert(data.message || 'Gagal login. Periksa email dan password Anda.');
      }
    } catch (error) {
      console.error("Error login:", error);
      alert('Terjadi kesalahan pada server. Pastikan backend sudah berjalan.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl overflow-hidden">
        
        {/* Header Login */}
        <div className="bg-[#0B5D34] p-8 text-center">
          <h2 className="text-24 font-bold text-white mb-2">Dashboard Admin</h2>
          <p className="text-[#CBBAB8] text-14">Pemerintah Kabupaten Bekasi</p>
        </div>

        {/* Form Login */}
        <div className="p-8">
          <form onSubmit={handleLogin} className="space-y-6">
            
            {/* Input Email */}
            <div>
              <label className="block text-14 font-medium text-slate-700 mb-2">
                Alamat Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail size={18} className="text-slate-400" />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#0B5D34] focus:border-[#0B5D34] text-14 outline-none transition-all"
                  placeholder="admin@bekasikab.go.id"
                />
              </div>
            </div>

            {/* Input Password */}
            <div>
              <label className="block text-14 font-medium text-slate-700 mb-2">
                Kata Sandi
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock size={18} className="text-slate-400" />
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#0B5D34] focus:border-[#0B5D34] text-14 outline-none transition-all"
                  placeholder="••••••••"
                />
              </div>
            </div>

            {/* Tombol Submit */}
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-14 font-medium text-white bg-[#0B5D34] hover:bg-[#084225] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0B5D34] transition-colors ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              {isLoading ? 'Memproses...' : 'Masuk'}
            </button>
          </form>
        </div>
        
      </div>
    </div>
  );
}