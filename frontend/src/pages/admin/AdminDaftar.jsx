import React, { useState, useEffect, useMemo } from 'react';
import { Search, Plus, Edit, Trash2, X, Link as LinkIcon, Mail, Image as ImageIcon } from 'lucide-react';
import API from '../../services/api'; // Sesuaikan dengan path axios Abang

export default function AdminDaftar() {
  const [dataPerangkat, setDataPerangkat] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  // State untuk Modal Form
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
  // State untuk File Gambar
  const [selectedFile, setSelectedFile] = useState(null);

  // State untuk Data Form
  const [formData, setFormData] = useState({
    id: null,
    name: '',
    email: '',
    website: '',
    logo: '' 
  });

  // 1. Ambil Data dari API
  const fetchPerangkat = () => {
    setIsLoading(true);
    API.get('/perangkat')
      .then((res) => {
        // Pengaman: pastikan data yang diterima berupa Array
        const validData = Array.isArray(res.data) ? res.data : (res.data?.data || []);
        setDataPerangkat(validData);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error("Gagal mengambil data perangkat:", err);
        setDataPerangkat([]);
        setIsLoading(false);
      });
  };

  useEffect(() => {
    fetchPerangkat();
  }, []);

  // 2. Filter Pencarian (Dengan pengaman Array.isArray)
  const filteredData = useMemo(() => {
    if (!Array.isArray(dataPerangkat)) return [];
    return dataPerangkat.filter(item => 
      item.name?.toLowerCase().includes(searchQuery.toLowerCase()) || 
      item.email?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [dataPerangkat, searchQuery]);

  // 3. Handler Modal & Form
  const openAddModal = () => {
    setFormData({ id: null, name: '', email: '', website: '', logo: '' });
    setSelectedFile(null);
    setIsEditing(false);
    setIsModalOpen(true);
  };

  const openEditModal = (item) => {
    setFormData({ 
      id: item.id, 
      name: item.name || '', 
      email: item.email || '', 
      website: item.website || '', 
      logo: item.logo || '' 
    });
    setSelectedFile(null);
    setIsEditing(true);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedFile(null);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  // 4. Proses Simpan
  const handleSave = async (e) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      let finalLogoUrl = formData.logo;

      if (selectedFile) {
        const uploadData = new FormData();
        uploadData.append('image', selectedFile);

        const uploadRes = await API.post('/admin/upload', uploadData);
        
        finalLogoUrl = uploadRes.data.imageUrl;
      }

      const payload = { ...formData, logo: finalLogoUrl };

      if (isEditing) {
        await API.put(`/admin/perangkat/${formData.id}`, payload);
        alert('Data berhasil diperbarui!');
      } else {
        await API.post('/admin/perangkat', payload);
        alert('Data berhasil ditambahkan!');
      }
      
      closeModal();
      fetchPerangkat();

    } catch (err) {
      console.error("Gagal menyimpan data:", err);
      alert('Terjadi kesalahan saat menyimpan data. Cek console browser untuk detailnya.');
    } finally {
      setIsSaving(false);
    }
  };

  // 5. Proses Hapus
  const handleDelete = async (id, name) => {
    if (window.confirm(`Yakin ingin menghapus data "${name}"?`)) {
      try {
        await API.delete(`/admin/perangkat/${id}`);
        alert('Data berhasil dihapus!');
        fetchPerangkat();
      } catch (err) {
        console.error("Gagal menghapus data:", err);
        alert('Terjadi kesalahan saat menghapus data.');
      }
    }
  };

  return (
    <div className="p-6 md:p-8 bg-slate-50 min-h-screen">
      
      {/* HEADER & TOOLBAR */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-slate-800">Manajemen Perangkat Daerah</h1>
          <p className="text-slate-500 text-sm mt-1">Kelola daftar badan, institusi, dan dinas Kabupaten Bekasi.</p>
        </div>
        
        <button 
          onClick={openAddModal}
          className="flex items-center gap-2 bg-[#0B5D34] hover:bg-[#084225] text-white px-5 py-2.5 rounded-lg font-semibold transition-colors shadow-sm"
        >
          <Plus size={18} />
          Tambah Data
        </button>
      </div>

      {/* SEARCH BAR */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 mb-6 flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="relative w-full md:w-96">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input 
            type="text" 
            placeholder="Cari berdasarkan nama atau email..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-300 focus:outline-none focus:border-[#0B5D34] focus:ring-1 focus:ring-[#0B5D34] text-sm"
          />
        </div>
        <div className="text-sm text-slate-500 font-medium">
          Total: <span className="text-slate-800 font-bold">{filteredData.length}</span> Perangkat
        </div>
      </div>

      {/* TABEL DATA */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50 text-slate-700 uppercase text-xs font-bold border-b border-slate-200">
              <tr>
                <th className="px-6 py-4 w-16 text-center">No</th>
                <th className="px-6 py-4 w-20">Logo</th>
                <th className="px-6 py-4">Nama Perangkat</th>
                <th className="px-6 py-4">Kontak & Info</th>
                <th className="px-6 py-4 text-center w-32">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {isLoading ? (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center text-slate-500 font-medium">
                    Memuat data...
                  </td>
                </tr>
              ) : filteredData.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center text-slate-500">
                    Tidak ada data perangkat ditemukan.
                  </td>
                </tr>
              ) : (
                filteredData.map((item, index) => (
                  <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 text-center font-medium">{index + 1}</td>
                    <td className="px-6 py-4">
                      <div className="w-10 h-10 bg-slate-200 rounded-md overflow-hidden flex items-center justify-center border border-slate-300">
                        {item.logo ? (
                          <img src={item.logo} alt="Logo" className="w-full h-full object-cover bg-white" />
                        ) : (
                          <ImageIcon size={18} className="text-slate-400" />
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-bold text-slate-800">{item.name}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-1 text-xs">
                        <div className="flex items-center gap-2">
                          <Mail size={14} className="text-slate-400" />
                          <span>{item.email || '-'}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <LinkIcon size={14} className="text-slate-400" />
                          <a href={item.website || '#'} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline truncate max-w-[200px]">
                            {item.website || '-'}
                          </a>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-2">
                        <button 
                          onClick={() => openEditModal(item)}
                          className="p-1.5 bg-amber-100 text-amber-700 hover:bg-amber-200 rounded transition-colors"
                          title="Edit Data"
                        >
                          <Edit size={16} />
                        </button>
                        <button 
                          onClick={() => handleDelete(item.id, item.name)}
                          className="p-1.5 bg-red-100 text-red-700 hover:bg-red-200 rounded transition-colors"
                          title="Hapus Data"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ================= MODAL TAMBAH/EDIT ================= */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden">
            
            <div className="flex justify-between items-center px-6 py-4 border-b border-slate-200 bg-slate-50">
              <h3 className="text-lg font-bold text-slate-800">
                {isEditing ? 'Edit Data Perangkat' : 'Tambah Perangkat Baru'}
              </h3>
              <button onClick={closeModal} className="text-slate-400 hover:text-red-500 transition-colors">
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-6 flex flex-col gap-4">
              
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Nama Perangkat <span className="text-red-500">*</span></label>
                <input 
                  type="text" name="name" required
                  value={formData.name} onChange={handleChange}
                  placeholder="Contoh: Dinas Kesehatan"
                  className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:outline-none focus:border-[#0B5D34] focus:ring-1 focus:ring-[#0B5D34]"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Alamat Email</label>
                <input 
                  type="email" name="email"
                  value={formData.email} onChange={handleChange}
                  placeholder="Contoh: info@dinkes.bekasikab.go.id"
                  className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:outline-none focus:border-[#0B5D34] focus:ring-1 focus:ring-[#0B5D34]"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Link Website</label>
                <input 
                  type="url" name="website"
                  value={formData.website} onChange={handleChange}
                  placeholder="Contoh: https://dinkes.bekasikab.go.id"
                  className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:outline-none focus:border-[#0B5D34] focus:ring-1 focus:ring-[#0B5D34]"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Logo / Foto Instansi</label>
                <input 
                  type="file" 
                  accept="image/*"
                  onChange={handleFileChange}
                  className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:outline-none focus:border-[#0B5D34] file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-[#EADFDE] file:text-[#0B5D34] hover:file:bg-[#D8C7C6] cursor-pointer"
                />
                
                {formData.logo && !selectedFile && (
                  <div className="mt-2 flex items-center gap-3 bg-slate-50 p-2 rounded border border-slate-200 w-fit">
                    <span className="text-xs text-slate-500 font-medium">Logo saat ini:</span>
                    <img src={formData.logo} alt="Preview Logo" className="h-10 w-auto rounded object-contain bg-white border border-slate-200" />
                  </div>
                )}
                {selectedFile && (
                  <p className="text-xs text-emerald-600 font-medium mt-2 flex items-center gap-1">
                    ✓ File siap diupload: {selectedFile.name}
                  </p>
                )}
              </div>

              <div className="flex justify-end gap-3 mt-4 pt-4 border-t border-slate-100">
                <button 
                  type="button" 
                  onClick={closeModal}
                  disabled={isSaving}
                  className="px-5 py-2 rounded-lg text-slate-600 font-semibold hover:bg-slate-100 transition-colors disabled:opacity-50"
                >
                  Batal
                </button>
                <button 
                  type="submit"
                  disabled={isSaving}
                  className="px-5 py-2 rounded-lg bg-[#0B5D34] text-white font-semibold hover:bg-[#084225] transition-colors disabled:opacity-50 flex items-center gap-2"
                >
                  {isSaving ? 'Menyimpan...' : 'Simpan Data'}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
}