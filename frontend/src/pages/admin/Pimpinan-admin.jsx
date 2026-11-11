import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, X } from 'lucide-react';

export default function Pimpinan() {
  const [dataPimpinan, setDataPimpinan] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  // State untuk form
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);
  const [formData, setFormData] = useState({
    namaLengkap: '',
    jabatan: '',
    periode: '',
    fotoUrl: '',
    bio: '',
    urutan: 0,
    isActive: true
  });

  // Mengambil token dari localStorage untuk otorisasi admin
  const token = localStorage.getItem('adminToken');

  // Load data saat halaman pertama kali dibuka
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/pimpinan');
      const result = await response.json();
      setDataPimpinan(result);
    } catch (error) {
      console.error("Gagal mengambil data:", error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const openAddModal = () => {
    setIsEditing(false);
    setEditId(null);
    setFormData({ namaLengkap: '', jabatan: '', periode: '', fotoUrl: '', bio: '', urutan: 0, isActive: true });
    setIsModalOpen(true);
  };

  const openEditModal = (pimpinan) => {
    setIsEditing(true);
    setEditId(pimpinan.id);
    setFormData({
      namaLengkap: pimpinan.namaLengkap,
      jabatan: pimpinan.jabatan,
      periode: pimpinan.periode || '',
      fotoUrl: pimpinan.fotoUrl || '',
      bio: pimpinan.bio || '',
      urutan: pimpinan.urutan || 0,
      isActive: pimpinan.isActive
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const url = isEditing 
      ? `http://localhost:5000/api/admin/pimpinan/${editId}`
      : `http://localhost:5000/api/admin/pimpinan`;
      
    const method = isEditing ? 'PUT' : 'POST';

    try {
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` // Token dikirim ke backend sebagai kunci
        },
        body: JSON.stringify({
          ...formData,
          urutan: parseInt(formData.urutan)
        }),
      });

      if (response.ok) {
        setIsModalOpen(false);
        fetchData(); // Refresh tabel setelah berhasil
      } else {
        const err = await response.json();
        alert(`Gagal menyimpan data: ${err.message}`);
      }
    } catch (error) {
      alert('Terjadi kesalahan pada server.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Apakah Anda yakin ingin menghapus data ini?')) return;

    try {
      const response = await fetch(`http://localhost:5000/api/admin/pimpinan/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        fetchData(); // Refresh tabel
      } else {
        alert('Gagal menghapus data');
      }
    } catch (error) {
      alert('Terjadi kesalahan pada server.');
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
      {/* Header Halaman */}
      <div className="p-6 border-b border-slate-200 flex justify-between items-center bg-slate-50/50">
        <div>
          <h2 className="text-18 font-bold text-slate-800">Daftar Pimpinan</h2>
          <p className="text-14 text-slate-500 mt-1">Kelola data bupati, wakil bupati, atau sekda.</p>
        </div>
        <button 
          onClick={openAddModal}
          className="flex items-center gap-2 px-4 py-2 bg-[#0B5D34] text-white rounded-lg hover:bg-[#084225] transition-colors text-14 font-medium"
        >
          <Plus size={18} />
          Tambah Pimpinan
        </button>
      </div>

      {/* Tabel Data */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200 text-14 text-slate-600">
              <th className="p-4 font-semibold">Nama Lengkap & Jabatan</th>
              <th className="p-4 font-semibold">Periode</th>
              <th className="p-4 font-semibold text-center">Urutan</th>
              <th className="p-4 font-semibold text-center">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {dataPimpinan.length === 0 ? (
              <tr>
                <td colSpan="4" className="p-8 text-center text-slate-500">Belum ada data pimpinan.</td>
              </tr>
            ) : (
              dataPimpinan.map((item) => (
                <tr key={item.id} className="border-b border-slate-100 hover:bg-slate-50/50 transition-colors">
                  <td className="p-4">
                    <p className="font-bold text-slate-800">{item.namaLengkap}</p>
                    <p className="text-13 text-slate-500">{item.jabatan}</p>
                  </td>
                  <td className="p-4 text-14 text-slate-600">{item.periode || '-'}</td>
                  <td className="p-4 text-center text-14 text-slate-600">{item.urutan}</td>
                  <td className="p-4">
                    <div className="flex items-center justify-center gap-2">
                      <button onClick={() => openEditModal(item)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                        <Edit size={18} />
                      </button>
                      <button onClick={() => handleDelete(item.id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Modal Form Tambah/Edit */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center sticky top-0 bg-white z-10">
              <h3 className="text-18 font-bold text-slate-800">
                {isEditing ? 'Edit Data Pimpinan' : 'Tambah Pimpinan Baru'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-slate-100 rounded-full text-slate-500">
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-14 font-medium text-slate-700 mb-1">Nama Lengkap</label>
                  <input type="text" name="namaLengkap" required value={formData.namaLengkap} onChange={handleInputChange} className="w-full p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#0B5D34] outline-none" />
                </div>
                <div>
                  <label className="block text-14 font-medium text-slate-700 mb-1">Jabatan</label>
                  <input type="text" name="jabatan" required value={formData.jabatan} onChange={handleInputChange} className="w-full p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#0B5D34] outline-none" placeholder="Contoh: Bupati Bekasi" />
                </div>
                <div>
                  <label className="block text-14 font-medium text-slate-700 mb-1">Periode (Opsional)</label>
                  <input type="text" name="periode" value={formData.periode} onChange={handleInputChange} className="w-full p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#0B5D34] outline-none" placeholder="Contoh: 2024 - 2029" />
                </div>
                <div>
                  <label className="block text-14 font-medium text-slate-700 mb-1">Nomor Urut Tampil</label>
                  <input type="number" name="urutan" value={formData.urutan} onChange={handleInputChange} className="w-full p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#0B5D34] outline-none" placeholder="1 untuk tampil pertama" />
                </div>
              </div>

              <div>
                <label className="block text-14 font-medium text-slate-700 mb-1">URL Foto (Opsional)</label>
                <input type="text" name="fotoUrl" value={formData.fotoUrl} onChange={handleInputChange} className="w-full p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#0B5D34] outline-none" placeholder="https://..." />
              </div>

              <div>
                <label className="block text-14 font-medium text-slate-700 mb-1">Biodata Singkat (Opsional)</label>
                <textarea name="bio" rows="4" value={formData.bio} onChange={handleInputChange} className="w-full p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#0B5D34] outline-none"></textarea>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-5 py-2.5 text-14 font-medium text-slate-600 hover:bg-slate-100 rounded-lg transition-colors">
                  Batal
                </button>
                <button type="submit" disabled={isLoading} className="px-5 py-2.5 text-14 font-medium text-white bg-[#0B5D34] hover:bg-[#084225] rounded-lg transition-colors">
                  {isLoading ? 'Menyimpan...' : 'Simpan Data'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}