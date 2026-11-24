import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, X, ShieldCheck, User, Eye, EyeOff } from 'lucide-react';

export default function AdminUser() {
  const [admins, setAdmins] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);
  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'ADMIN',
  });

  const API_URL = `http://${window.location.hostname}:5000/api/admin/users`;

  const currentAdmin = (() => {
    try {
      return JSON.parse(localStorage.getItem('adminUser') || '{}');
    } catch {
      return {};
    }
  })();

  const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };
  };

  const fetchAdmins = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(API_URL, { headers: getAuthHeaders() });
      const data = await res.json();
      if (res.ok) {
        setAdmins(Array.isArray(data) ? data : []);
      } else {
        alert(data.message || 'Gagal memuat daftar admin.');
      }
    } catch (error) {
      console.error('Error fetch admins:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAdmins();
  }, []);

  const openAddModal = () => {
    setIsEditing(false);
    setEditId(null);
    setShowPassword(false);
    setFormData({ name: '', email: '', password: '', role: 'ADMIN' });
    setIsModalOpen(true);
  };

  const openEditModal = (admin) => {
    setIsEditing(true);
    setEditId(admin.id);
    setShowPassword(false);
    setFormData({
      name: admin.name,
      email: admin.email,
      password: '',
      role: admin.role || 'ADMIN',
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      const url = isEditing ? `${API_URL}/${editId}` : API_URL;
      const method = isEditing ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: getAuthHeaders(),
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (res.ok) {
        alert(data.message || 'Berhasil disimpan!');
        setIsModalOpen(false);
        fetchAdmins();
      } else {
        alert(data.message || 'Gagal menyimpan data admin.');
      }
    } catch (error) {
      console.error('Error save admin:', error);
      alert('Terjadi kesalahan server.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (admin) => {
    if (!window.confirm(`Yakin ingin menghapus akun admin "${admin.name}"?`)) return;

    try {
      const res = await fetch(`${API_URL}/${admin.id}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });
      const data = await res.json();
      if (res.ok) {
        alert(data.message || 'Admin dihapus!');
        fetchAdmins();
      } else {
        alert(data.message || 'Gagal menghapus admin.');
      }
    } catch (error) {
      console.error('Error delete admin:', error);
    }
  };

  return (
    <div className="bg-off-white text-charcoal rounded-xl shadow-sm border border-sage-green/25 overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b border-sage-green/25 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-mint-gray">
        <div>
          <h2 className="text-18 font-bold text-forest-green">Manajemen Akun Admin</h2>
          <p className="text-13 text-charcoal/75 mt-0.5">
            Kelola jumlah akun dan hak akses pengelola website (Total: {admins.length} akun)
          </p>
        </div>
        <button
          onClick={openAddModal}
          className="flex items-center gap-2 px-4 py-2 bg-forest-green hover:bg-sage-green text-off-white rounded-lg transition-colors text-14 font-medium"
        >
          <Plus size={18} /> Tambah Admin
        </button>
      </div>

      {/* Tabel */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-forest-green border-b border-sage-green/30 text-13 uppercase text-off-white">
              <th className="p-4 font-semibold w-14 text-center">No</th>
              <th className="p-4 font-semibold">Nama</th>
              <th className="p-4 font-semibold">Email</th>
              <th className="p-4 font-semibold">Role / Hak Akses</th>
              <th className="p-4 font-semibold text-center w-32">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-sage-green/20 text-14">
            {isLoading ? (
              <tr>
                <td colSpan="5" className="p-8 text-center text-forest-green font-medium">
                  Memuat data admin...
                </td>
              </tr>
            ) : admins.length === 0 ? (
              <tr>
                <td colSpan="5" className="p-8 text-center text-charcoal/70">
                  Belum ada data admin.
                </td>
              </tr>
            ) : (
              admins.map((admin, idx) => {
                const isSuper = admin.role === 'SUPER_ADMIN';
                const isSelf = admin.id === currentAdmin.id;

                return (
                  <tr key={admin.id} className="hover:bg-mint-gray/50 transition-colors">
                    <td className="p-4 text-center text-charcoal/75">{idx + 1}</td>
                    <td className="p-4 font-bold text-forest-green">
                      {admin.name}{' '}
                      {isSelf && (
                        <span className="ml-1.5 text-11 font-semibold px-2 py-0.5 rounded bg-mint-gray border border-sage-green/30 text-forest-green">
                          Anda
                        </span>
                      )}
                    </td>
                    <td className="p-4 text-charcoal">{admin.email}</td>
                    <td className="p-4">
                      {isSuper ? (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-12 font-bold bg-forest-green text-off-white">
                          <ShieldCheck size={14} /> Super Admin
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-12 font-semibold bg-mint-gray text-forest-green border border-sage-green/30">
                          <User size={14} /> Admin
                        </span>
                      )}
                    </td>
                    <td className="p-4">
                      <div className="flex justify-center gap-2">
                        <button
                          onClick={() => openEditModal(admin)}
                          className="p-2 text-forest-green hover:bg-mint-gray rounded-lg transition-colors"
                          title="Edit Admin"
                        >
                          <Edit size={18} />
                        </button>
                        {!isSelf && (
                          <button
                            onClick={() => handleDelete(admin)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Hapus Admin"
                          >
                            <Trash2 size={18} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Modal Tambah / Edit */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-charcoal/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-off-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden border border-sage-green/30">
            <div className="p-5 border-b border-sage-green/25 bg-forest-green text-off-white flex justify-between items-center">
              <h3 className="text-18 font-bold text-off-white">
                {isEditing ? 'Edit Akun Admin' : 'Tambah Akun Admin Baru'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 hover:bg-sage-green rounded-full text-off-white transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-14 font-semibold text-charcoal mb-1">
                  Nama Lengkap
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Contoh: Budi Santoso"
                  className="w-full p-2.5 bg-off-white text-charcoal border border-sage-green/30 rounded-lg focus:ring-2 focus:ring-sage-green focus:border-forest-green outline-none text-14"
                />
              </div>

              <div>
                <label className="block text-14 font-semibold text-charcoal mb-1">
                  Email Login
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="admin2@bekasikab.go.id"
                  className="w-full p-2.5 bg-off-white text-charcoal border border-sage-green/30 rounded-lg focus:ring-2 focus:ring-sage-green focus:border-forest-green outline-none text-14"
                />
              </div>

              <div>
                <label className="block text-14 font-semibold text-charcoal mb-1">
                  {isEditing ? 'Kata Sandi Baru (Kosongkan jika tidak diubah)' : 'Kata Sandi'}
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required={!isEditing}
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    placeholder="••••••••"
                    className="w-full p-2.5 pr-10 bg-off-white text-charcoal border border-sage-green/30 rounded-lg focus:ring-2 focus:ring-sage-green focus:border-forest-green outline-none text-14"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-sage-green hover:text-forest-green"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-14 font-semibold text-charcoal mb-1">
                  Role / Hak Akses
                </label>
                <select
                  value={formData.role}
                  disabled={isEditing && editId === currentAdmin.id}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  className="w-full p-2.5 bg-off-white text-charcoal border border-sage-green/30 rounded-lg focus:ring-2 focus:ring-sage-green focus:border-forest-green outline-none text-14 disabled:bg-mint-gray"
                >
                  <option value="ADMIN">Admin (Kelola Konten)</option>
                  <option value="SUPER_ADMIN">Super Admin (Semua Konten + Kelola Admin)</option>
                </select>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-sage-green/20">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-14 font-medium text-charcoal bg-mint-gray hover:bg-sage-green/20 rounded-lg transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-5 py-2 text-14 font-medium text-off-white bg-forest-green hover:bg-sage-green rounded-lg disabled:opacity-50 transition-colors"
                >
                  {isSaving ? 'Menyimpan...' : 'Simpan'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}