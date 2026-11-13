import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, X, Upload, Info } from 'lucide-react';

export default function AdminPimpinan() {
  const [dataPimpinan, setDataPimpinan] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);
  const [fotoFile, setFotoFile] = useState(null);
  const [fotoPreview, setFotoPreview] = useState('');

  // Tambahkan field baru di state
  const [formData, setFormData] = useState({
    namaLengkap: '', jabatan: '', periodeAwal: '', periodeAkhir: '', 
    fotoUrl: '', bio: '', urutan: 0, isActive: true,
    tempatTanggalLahir: '', riwayatPendidikan: '', karirPolitik: '', riwayatPangkat: ''
  });

  const token = localStorage.getItem('adminToken');
  const API_BASE_URL = `http://${window.location.hostname}:5000`;

  const JABATAN_OPTIONS = [
    { label: 'Bupati Kabupaten Bekasi', urutan: 1 },
    { label: 'Wakil Bupati Kabupaten Bekasi', urutan: 2 },
    { label: 'Sekretaris Daerah', urutan: 3 },
  ];

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/pimpinan`);
      const result = await res.json();
      setDataPimpinan(Array.isArray(result) ? result : []);
    } catch (error) { setDataPimpinan([]); }
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
    setFormData(prev => ({ ...prev, jabatan: selectedJabatan, urutan: matchedOption ? matchedOption.urutan : 0 }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFotoFile(file);
      setFotoPreview(URL.createObjectURL(file));
    }
  };

  const openAddModal = () => {
    setIsEditing(false); setEditId(null); setFotoFile(null); setFotoPreview('');
    setFormData({ namaLengkap: '', jabatan: '', periodeAwal: '', periodeAkhir: '', fotoUrl: '', bio: '', urutan: 0, isActive: true, tempatTanggalLahir: '', riwayatPendidikan: '', karirPolitik: '', riwayatPangkat: '' });
    setIsModalOpen(true);
  };

  const openEditModal = (pimpinan) => {
    setIsEditing(true); setEditId(pimpinan.id);
    const periodeSplit = pimpinan.periode ? pimpinan.periode.split(' - ') : ['', ''];
    setFotoFile(null); setFotoPreview(pimpinan.fotoUrl || '');
    setFormData({
      ...pimpinan,
      periodeAwal: periodeSplit[0] || '',
      periodeAkhir: periodeSplit[1] || '',
      tempatTanggalLahir: pimpinan.tempatTanggalLahir || '',
      riwayatPendidikan: pimpinan.riwayatPendidikan || '',
      karirPolitik: pimpinan.karirPolitik || '',
      riwayatPangkat: pimpinan.riwayatPangkat || ''
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.jabatan) return alert("Pilih jabatan dulu.");
    setIsLoading(true);

    try {
      let finalFotoUrl = formData.fotoUrl;
      if (fotoFile) {
        const uploadData = new FormData(); uploadData.append('image', fotoFile);
        const uploadRes = await fetch(`${API_BASE_URL}/api/admin/upload`, { method: 'POST', headers: { 'Authorization': `Bearer ${token}` }, body: uploadData });
        if (uploadRes.ok) {
          const result = await uploadRes.json();
          finalFotoUrl = result.imageUrl;
        }
      }

      const payload = {
        namaLengkap: formData.namaLengkap,
        jabatan: formData.jabatan,
        periode: formData.periodeAwal && formData.periodeAkhir ? `${formData.periodeAwal} - ${formData.periodeAkhir}` : '',
        fotoUrl: finalFotoUrl,
        bio: formData.bio || "",
        urutan: formData.urutan,
        isActive: formData.isActive,
        tempatTanggalLahir: formData.tempatTanggalLahir || "",
        riwayatPendidikan: formData.riwayatPendidikan || "",
        karirPolitik: formData.karirPolitik || "",
        riwayatPangkat: formData.riwayatPangkat || "",
        riwayatDiklat: formData.riwayatDiklat || "" 
      };

      const url = isEditing ? `${API_BASE_URL}/api/admin/pimpinan/${editId}` : `${API_BASE_URL}/api/admin/pimpinan`;
      const res = await fetch(url, {
        method: isEditing ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify(payload),
      });

      if (res.ok) { setIsModalOpen(false); fetchData(); } 
      else alert("Gagal menyimpan data.");
    } catch (error) { alert('Terjadi kesalahan server.'); } 
    finally { setIsLoading(false); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Hapus data ini?')) return;
    const res = await fetch(`${API_BASE_URL}/api/admin/pimpinan/${id}`, { method: 'DELETE', headers: { 'Authorization': `Bearer ${token}` } });
    if (res.ok) fetchData();
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
      <div className="p-6 border-b border-slate-200 flex justify-between items-center bg-slate-50/50">
        <div><h2 className="text-18 font-bold text-slate-800">Daftar Pimpinan</h2></div>
        <button onClick={openAddModal} disabled={dataPimpinan.length >= 3} className={`flex items-center gap-2 px-4 py-2 text-white rounded-lg transition-colors text-14 font-medium ${dataPimpinan.length >= 3 ? 'bg-slate-400' : 'bg-[#0B5D34] hover:bg-[#084225]'}`}><Plus size={18} /> Tambah Pimpinan</button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200 text-14 text-slate-600">
              <th className="p-4 font-semibold w-16">Foto</th>
              <th className="p-4 font-semibold">Nama & Jabatan</th>
              <th className="p-4 font-semibold text-center">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {dataPimpinan.map((item) => (
              <tr key={item.id} className="border-b border-slate-100 hover:bg-slate-50/50">
                <td className="p-4"><img src={item.fotoUrl || 'https://via.placeholder.com/50'} className="w-12 h-12 object-cover rounded-full bg-slate-200" alt=""/></td>
                <td className="p-4"><p className="font-bold text-slate-800">{item.namaLengkap}</p><p className="text-13 text-slate-500">{item.jabatan}</p></td>
                <td className="p-4 flex justify-center gap-2">
                  <button onClick={() => openEditModal(item)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"><Edit size={18} /></button>
                  <button onClick={() => handleDelete(item.id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg"><Trash2 size={18} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 z-50 flex items-center justify-center p-4 md:p-6 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-3xl max-h-[95vh] overflow-y-auto shadow-2xl relative">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center sticky top-0 bg-white z-10 rounded-t-2xl">
              <h3 className="text-18 font-bold text-slate-800">{isEditing ? 'Edit Profil' : 'Tambah Profil'}</h3>
              <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-slate-100 rounded-full"><X size={20} /></button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              
              {/* === BAGIAN 1: INFO DASAR (NAMA, JABATAN, PERIODE) === */}
              <div className="bg-slate-50 p-4 rounded-xl space-y-4 border border-slate-100">
                <h4 className="font-bold text-slate-700 border-b pb-2">1. Informasi Dasar</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-14 font-medium text-slate-700 mb-1">Nama Lengkap</label>
                    <input type="text" name="namaLengkap" required value={formData.namaLengkap} onChange={handleInputChange} className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-[#0B5D34]" />
                  </div>
                  <div>
                    <label className="block text-14 font-medium text-slate-700 mb-1">Jabatan</label>
                    <select name="jabatan" required value={formData.jabatan} onChange={handleJabatanChange} className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-[#0B5D34] bg-white">
                      <option value="" disabled>-- Pilih --</option>
                      {JABATAN_OPTIONS.map((opt) => <option key={opt.urutan} value={opt.label} disabled={isJabatanTaken(opt.label)}>{opt.label}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-14 font-medium text-slate-700 mb-1">Tempat, Tanggal Lahir</label>
                    <input type="text" name="tempatTanggalLahir" value={formData.tempatTanggalLahir} onChange={handleInputChange} placeholder="Contoh: Bekasi, 15 Agustus 1993" className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-[#0B5D34]" />
                  </div>
                  <div>
                    <label className="block text-14 font-medium text-slate-700 mb-1">Periode Masa Jabatan</label>
                    <div className="flex gap-2">
                      <input type="number" name="periodeAwal" value={formData.periodeAwal} onChange={handleInputChange} placeholder="Mulai" className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-[#0B5D34]" />
                      <input type="number" name="periodeAkhir" value={formData.periodeAkhir} onChange={handleInputChange} placeholder="Selesai" className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-[#0B5D34]" />
                    </div>
                  </div>
                </div>
              </div>

              {/* === DETEKSI JABATAN === */}
              {(() => {
                const isSekda = formData.jabatan && formData.jabatan.toLowerCase().includes('sekretaris');
                
                return (
                  <>
                    {/* HANYA MUNCUL JIKA BUKAN SEKDA (Bupati / Wakil Bupati) */}
                    {!isSekda && (
                      <div className="bg-slate-50 p-4 rounded-xl space-y-4 border border-slate-100">
                        <h4 className="font-bold text-slate-700 border-b pb-2">2. Foto & Biografi Utama</h4>
                        <div>
                          <label className="block text-14 font-medium text-slate-700 mb-2">Upload Foto</label>
                          <div className="flex items-center gap-4">
                            {fotoPreview ? <img src={fotoPreview} className="w-20 h-20 object-cover rounded-lg border" alt="preview" /> : <div className="w-20 h-20 bg-slate-200 rounded-lg flex items-center justify-center"><Upload size={20} className="text-slate-400"/></div>}
                            <input type="file" accept="image/*" onChange={handleFileChange} className="text-14" />
                          </div>
                        </div>
                        <div>
                          <label className="block text-14 font-medium text-slate-700 mb-1">Biografi Singkat</label>
                          <textarea name="bio" rows="4" value={formData.bio} onChange={handleInputChange} className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-[#0B5D34]"></textarea>
                        </div>
                      </div>
                    )}

                    {/* MUNCUL UNTUK SEKDA MAUPUN BUPATI */}
                    <div className="bg-[#0B5D34]/5 p-4 rounded-xl space-y-4 border border-[#0B5D34]/20">
                      <h4 className="font-bold text-[#0B5D34] border-b border-[#0B5D34]/20 pb-2 flex items-center gap-2"><Info size={18}/> {isSekda ? '2. Detail Riwayat (Khusus Sekda)' : '3. Detail Riwayat Tambahan'}</h4>
                      
                      {/* Form Foto Khusus Sekda (Karena Sekda tidak punya form biografi) */}
                      {isSekda && (
                         <div className="mb-4 pb-4 border-b border-[#0B5D34]/20">
                          <label className="block text-14 font-medium text-slate-700 mb-2">Upload Foto</label>
                          <div className="flex items-center gap-4">
                            {fotoPreview ? <img src={fotoPreview} className="w-20 h-20 object-cover rounded-lg border" alt="preview" /> : <div className="w-20 h-20 bg-slate-200 rounded-lg flex items-center justify-center"><Upload size={20} className="text-slate-400"/></div>}
                            <input type="file" accept="image/*" onChange={handleFileChange} className="text-14" />
                          </div>
                        </div>
                      )}

                      <div>
                        <label className="block text-14 font-medium text-slate-700 mb-1">Pendidikan Formal (List)</label>
                        <p className="text-12 text-slate-500 mb-2">Gunakan tombol <b>Enter</b> untuk memisahkan setiap poin.</p>
                        <textarea name="riwayatPendidikan" rows="3" value={formData.riwayatPendidikan} onChange={handleInputChange} placeholder="SD Negeri Sukadami 03&#10;SMP Negeri 1 Cikarang" className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-[#0B5D34]"></textarea>
                      </div>

                      {/* KHUSUS BUPATI/WAKIL */}
                      {!isSekda && (
                        <div>
                          <label className="block text-14 font-medium text-slate-700 mb-1">Karir Politik (List)</label>
                          <textarea name="karirPolitik" rows="3" value={formData.karirPolitik} onChange={handleInputChange} placeholder="Anggota DPRD Kabupaten Bekasi&#10;Ketua Fraksi..." className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-[#0B5D34]"></textarea>
                        </div>
                      )}

                      {/* KHUSUS SEKDA */}
                      {isSekda && (
                        <>
                          <div>
                            <label className="block text-14 font-medium text-slate-700 mb-1">Riwayat Pangkat (TABEL)</label>
                            <p className="text-12 text-slate-500 mb-2"><b>Baris 1 adalah Header.</b> Pemisah kolom: <b>|</b>. Pemisah baris: <b>Enter</b>.</p>
                            <textarea name="riwayatPangkat" rows="4" value={formData.riwayatPangkat} onChange={handleInputChange} placeholder="Gol/Ruang | TMT | Keterangan&#10;Pembina (IV/a) | 01-10-2015 | SK Bupati" className="w-full p-2.5 border rounded-lg font-mono text-13 focus:ring-2 focus:ring-[#0B5D34]"></textarea>
                          </div>
                          <div>
                            <label className="block text-14 font-medium text-slate-700 mb-1">Riwayat Pendidikan dan Pelatihan (TABEL)</label>
                            <p className="text-12 text-slate-500 mb-2"><b>Baris 1 adalah Header.</b> Pemisah kolom: <b>|</b>. Pemisah baris: <b>Enter</b>.</p>
                            <textarea name="riwayatDiklat" rows="4" value={formData.riwayatDiklat} onChange={handleInputChange} placeholder="Nama Pelatihan | Tahun | Penyelenggara&#10;Diklat PIM II | 2018 | LAN RI" className="w-full p-2.5 border rounded-lg font-mono text-13 focus:ring-2 focus:ring-[#0B5D34]"></textarea>
                          </div>
                        </>
                      )}
                    </div>
                  </>
                );
              })()}

              {/* === TOMBOL SIMPAN === */}
              <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-5 py-2.5 text-14 font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg">Batal</button>
                <button type="submit" disabled={isLoading} className="px-5 py-2.5 text-14 font-medium text-white bg-[#0B5D34] hover:bg-[#084225] rounded-lg">
                  {isLoading ? 'Menyimpan...' : 'Simpan Data Lengkap'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}