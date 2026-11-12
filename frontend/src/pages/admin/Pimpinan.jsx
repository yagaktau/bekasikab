import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, X, Upload } from 'lucide-react';

export default function AdminPimpinan() {
  const [dataPimpinan, setDataPimpinan] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);
  
  // File state khusus untuk menampung gambar dari komputer
  const [fotoFile, setFotoFile] = useState(null);
  const [fotoPreview, setFotoPreview] = useState('');

  // Form Data disesuaikan untuk 2 input periode
  const [formData, setFormData] = useState({
    namaLengkap: '',
    jabatan: '',
    periodeAwal: '',
    periodeAkhir: '',
    fotoUrl: '', // Ini akan diisi oleh backend setelah upload berhasil
    bio: '',
    urutan: 0,
    isActive: true
  });

  const token = localStorage.getItem('adminToken');
  const API_BASE_URL = `http://${window.location.hostname}:5000`;

  const JABATAN_OPTIONS = [
    { label: 'Bupati Kabupaten Bekasi', urutan: 1 },
    { label: 'Wakil Bupati Kabupaten Bekasi', urutan: 2 },
    { label: 'Sekretaris Daerah', urutan: 3 },
  ];

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/pimpinan`);
      const result = await response.json();
      if (Array.isArray(result)) setDataPimpinan(result);
      else setDataPimpinan([]);
    } catch (error) {
      console.error("Gagal mengambil data:", error);
      setDataPimpinan([]);
    }
  };

  const isJabatanTaken = (jabatanLabel) => {
    if (isEditing && formData.jabatan === jabatanLabel) return false;
    return dataPimpinan.some(item => item.jabatan === jabatanLabel);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleJabatanChange = (e) => {
    const selectedJabatan = e.target.value;
    const matchedOption = JABATAN_OPTIONS.find(opt => opt.label === selectedJabatan);
    setFormData(prev => ({
      ...prev,
      jabatan: selectedJabatan,
      urutan: matchedOption ? matchedOption.urutan : 0
    }));
  };

  // Mengelola saat admin memilih foto dari komputer
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFotoFile(file);
      setFotoPreview(URL.createObjectURL(file)); // Buat preview sementara
    }
  };

  const openAddModal = () => {
    setIsEditing(false);
    setEditId(null);
    setFotoFile(null);
    setFotoPreview('');
    setFormData({ namaLengkap: '', jabatan: '', periodeAwal: '', periodeAkhir: '', fotoUrl: '', bio: '', urutan: 0, isActive: true });
    setIsModalOpen(true);
  };

  const openEditModal = (pimpinan) => {
    setIsEditing(true);
    setEditId(pimpinan.id);
    
    // Memecah teks "2024 - 2029" menjadi dua bagian untuk diisi ke dalam input
    const periodeSplit = pimpinan.periode ? pimpinan.periode.split(' - ') : ['', ''];
    
    setFotoFile(null);
    setFotoPreview(pimpinan.fotoUrl || '');
    setFormData({
      namaLengkap: pimpinan.namaLengkap,
      jabatan: pimpinan.jabatan,
      periodeAwal: periodeSplit[0] || '',
      periodeAkhir: periodeSplit[1] || '',
      fotoUrl: pimpinan.fotoUrl || '',
      bio: pimpinan.bio || '',
      urutan: pimpinan.urutan || 0,
      isActive: pimpinan.isActive
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.jabatan) return alert("Silakan pilih jabatan terlebih dahulu.");
    setIsLoading(true);

    try {
      let finalFotoUrl = formData.fotoUrl;

      // 1. Jika ada file foto baru, Upload dulu fotonya ke backend!
      if (fotoFile) {
        const uploadData = new FormData();
        uploadData.append('image', fotoFile);

       const uploadRes = await fetch(`${API_BASE_URL}/api/admin/upload`, {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${token}` },
          body: uploadData
        });

        if (uploadRes.ok) {
          const result = await uploadRes.json();
          finalFotoUrl = result.imageUrl; // Dapatkan URL permanen dari server
        } else {
          alert("Gagal mengunggah foto. Pastikan format file sesuai.");
          setIsLoading(false);
          return;
        }
      }

      // 2. Gabungkan periode sebelum dikirim (Contoh: "2024 - 2029")
      const periodeGabungan = formData.periodeAwal && formData.periodeAkhir 
        ? `${formData.periodeAwal} - ${formData.periodeAkhir}` 
        : '';

      const payload = {
        namaLengkap: formData.namaLengkap,
        jabatan: formData.jabatan,
        periode: periodeGabungan,
        fotoUrl: finalFotoUrl,
        bio: formData.bio,
        urutan: formData.urutan,
        isActive: formData.isActive
      };

      // 3. Simpan data Pimpinan ke Database
      const url = isEditing 
        ? `${API_BASE_URL}/api/admin/pimpinan/${editId}`
        : `${API_BASE_URL}/api/admin/pimpinan`;
      const method = isEditing ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        setIsModalOpen(false);
        fetchData(); 
      } else {
        const err = await response.json();
        alert(`Gagal menyimpan data: ${err.message}`);
      }
    } catch (error) {
      alert('Terjadi kesalahan pada server saat menyimpan data.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Apakah Anda yakin ingin menghapus data ini?')) return;
    try {
      const response = await fetch(`http://localhost:5000/api/admin/pimpinan/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) fetchData();
    } catch (error) {
      alert('Terjadi kesalahan.');
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
      <div className="p-6 border-b border-slate-200 flex justify-between items-center bg-slate-50/50">
        <div>
          <h2 className="text-18 font-bold text-slate-800">Daftar Pimpinan</h2>
          <p className="text-14 text-slate-500 mt-1">Kelola data bupati, wakil bupati, atau sekda.</p>
        </div>
        <button 
          onClick={openAddModal}
          disabled={dataPimpinan.length >= 3}
          className={`flex items-center gap-2 px-4 py-2 text-white rounded-lg transition-colors text-14 font-medium ${
            dataPimpinan.length >= 3 ? 'bg-slate-400 cursor-not-allowed' : 'bg-[#0B5D34] hover:bg-[#084225]'
          }`}
        >
          <Plus size={18} />
          {dataPimpinan.length >= 3 ? 'Posisi Penuh' : 'Tambah Pimpinan'}
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200 text-14 text-slate-600">
              <th className="p-4 font-semibold w-16 text-center">Foto</th>
              <th className="p-4 font-semibold">Nama Lengkap & Jabatan</th>
              <th className="p-4 font-semibold">Periode</th>
              <th className="p-4 font-semibold text-center">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {dataPimpinan.length === 0 ? (
              <tr><td colSpan="4" className="p-8 text-center text-slate-500">Belum ada data pimpinan.</td></tr>
            ) : (
              dataPimpinan.map((item) => (
                <tr key={item.id} className="border-b border-slate-100 hover:bg-slate-50/50 transition-colors">
                  <td className="p-4 text-center">
                    <img 
                      src={item.fotoUrl || 'https://via.placeholder.com/50'} 
                      alt="Foto Pimpinan" 
                      className="w-12 h-12 object-cover rounded-full bg-slate-200 mx-auto"
                    />
                  </td>
                  <td className="p-4">
                    <p className="font-bold text-slate-800">{item.namaLengkap}</p>
                    <p className="text-13 text-slate-500">{item.jabatan}</p>
                  </td>
                  <td className="p-4 text-14 text-slate-600">{item.periode || '-'}</td>
                  <td className="p-4">
                    <div className="flex items-center justify-center gap-2">
                      <button onClick={() => openEditModal(item)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"><Edit size={18} /></button>
                      <button onClick={() => handleDelete(item.id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"><Trash2 size={18} /></button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center sticky top-0 bg-white z-10">
              <h3 className="text-18 font-bold text-slate-800">
                {isEditing ? 'Edit Data Pimpinan' : 'Tambah Pimpinan Baru'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-slate-100 rounded-full text-slate-500"><X size={20} /></button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-14 font-medium text-slate-700 mb-1">Nama Lengkap</label>
                  <input type="text" name="namaLengkap" required value={formData.namaLengkap} onChange={handleInputChange} className="w-full p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#0B5D34] outline-none" />
                </div>
                
                <div>
                  <label className="block text-14 font-medium text-slate-700 mb-1">Jabatan</label>
                  <select name="jabatan" required value={formData.jabatan} onChange={handleJabatanChange} className="w-full p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#0B5D34] outline-none bg-white">
                    <option value="" disabled>-- Pilih Jabatan --</option>
                    {JABATAN_OPTIONS.map((opt) => (
                      <option key={opt.urutan} value={opt.label} disabled={isJabatanTaken(opt.label)}>
                        {opt.label} {isJabatanTaken(opt.label) ? '(Terisi)' : ''}
                      </option>
                    ))}
                  </select>
                </div>
                
                {/* Bagian Periode dengan 2 Input */}
                <div className="md:col-span-2">
                  <label className="block text-14 font-medium text-slate-700 mb-1">Periode Masa Jabatan</label>
                  <div className="flex items-center gap-3">
                    <input type="number" name="periodeAwal" value={formData.periodeAwal} onChange={handleInputChange} placeholder="Tahun Mulai (Misal: 2024)" className="w-full p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#0B5D34] outline-none" />
                    <span className="text-slate-500 font-bold">-</span>
                    <input type="number" name="periodeAkhir" value={formData.periodeAkhir} onChange={handleInputChange} placeholder="Tahun Selesai (Misal: 2029)" className="w-full p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#0B5D34] outline-none" />
                  </div>
                </div>
              </div>

              {/* Area Upload Foto Fisik */}
              <div>
                <label className="block text-14 font-medium text-slate-700 mb-2">Foto Pimpinan</label>
                <div className="flex items-center gap-5">
                  {fotoPreview ? (
                    <img src={fotoPreview} alt="Preview" className="w-24 h-24 object-cover rounded-xl border border-slate-200" />
                  ) : (
                    <div className="w-24 h-24 bg-slate-100 flex items-center justify-center rounded-xl border border-slate-200 text-slate-400">
                      <Upload size={24} />
                    </div>
                  )}
                  <div className="flex-1">
                    <input 
                      type="file" 
                      accept="image/*" 
                      onChange={handleFileChange}
                      className="w-full text-14 text-slate-600 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[#0B5D34]/10 file:text-[#0B5D34] hover:file:bg-[#0B5D34]/20 cursor-pointer"
                    />
                    <p className="text-12 text-slate-400 mt-2">Format yang disarankan: JPG, PNG, atau WEBP. Maks 2MB.</p>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-14 font-medium text-slate-700 mb-1">Biodata Singkat (Opsional)</label>
                <textarea name="bio" rows="4" value={formData.bio} onChange={handleInputChange} className="w-full p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#0B5D34] outline-none"></textarea>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-5 py-2.5 text-14 font-medium text-slate-600 hover:bg-slate-100 rounded-lg transition-colors">Batal</button>
                <button type="submit" disabled={isLoading} className="px-5 py-2.5 text-14 font-medium text-white bg-[#0B5D34] hover:bg-[#084225] rounded-lg transition-colors flex items-center gap-2">
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