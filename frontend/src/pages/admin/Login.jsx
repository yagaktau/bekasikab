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
      const response = await fetch('http://localhost:5000/api/admin/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        if (data.token) {
          localStorage.setItem('token', data.token);
        }
        if (data.admin) {
          localStorage.setItem('adminUser', JSON.stringify(data.admin));
        }
        navigate('/admin/dashboard');
      } else {
        alert(data.message || 'Gagal login. Periksa email dan password Anda.');
      }
    } catch (error) {
      console.error('Error login:', error);
      alert('Terjadi kesalahan pada server. Pastikan backend sudah berjalan.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-mint-gray text-charcoal flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-off-white rounded-2xl shadow-xl overflow-hidden border border-sage-green/25">
        {/* Header Login */}
        <div className="bg-forest-green p-8 text-center border-b-4 border-sage-green">
          <h2 className="text-24 font-bold text-off-white mb-2">Dashboard Admin</h2>
          <p className="text-mint-gray text-14">Pemerintah Kabupaten Bekasi</p>
        </div>

        {/* Form Login */}
        <div className="p-8">
          <form onSubmit={handleLogin} className="space-y-6">
            {/* Input Email */}
            <div>
              <label className="block text-14 font-semibold text-charcoal mb-2">
                Alamat Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail size={18} className="text-sage-green" />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2.5 bg-off-white text-charcoal placeholder-charcoal/50 border border-sage-green/30 rounded-lg focus:ring-2 focus:ring-sage-green focus:border-forest-green text-14 outline-none transition-all"
                  placeholder="admin@bekasikab.go.id"
                />
              </div>
            </div>

            {/* Input Password */}
            <div>
              <label className="block text-14 font-semibold text-charcoal mb-2">
                Kata Sandi
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock size={18} className="text-sage-green" />
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2.5 bg-off-white text-charcoal placeholder-charcoal/50 border border-sage-green/30 rounded-lg focus:ring-2 focus:ring-sage-green focus:border-forest-green text-14 outline-none transition-all"
                  placeholder="••••••••"
                />
              </div>
            </div>

            {/* Tombol Submit */}
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-14 font-semibold text-off-white bg-forest-green hover:bg-sage-green focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sage-green transition-colors ${
                isLoading ? 'opacity-70 cursor-not-allowed' : ''
              }`}
            >
              {isLoading ? 'Memproses...' : 'Masuk'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}