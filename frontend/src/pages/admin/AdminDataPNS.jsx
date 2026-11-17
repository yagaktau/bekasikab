import { useState, useEffect } from 'react';

export default function AdminDataPNS() {
  const [dataPNS, setDataPNS] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);

  const [formData, setFormData] = useState({
    periode: '', 
    totalPNS: 0,
    lakiLaki: 0,
    perempuan: 0,
    golongan: [], 
    pendidikan: [] 
  });

  const apiAdminUrl = `http://${window.location.hostname}:5000/api/admin/datapns`;

  // Fungsi Pembantu: Ambil header token dari local storage
  const getAuthHeaders = () => ({
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${localStorage.getItem('token')}`
  });

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(apiAdminUrl, { headers: getAuthHeaders() });
      if (!res.ok) throw new Error("Gagal mengambil data");
      const data = await res.json();
      setDataPNS(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Error Fetch:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleGolonganChange = (index, field, value) => {
    const newGolongan = [...formData.golongan];
    newGolongan[index][field] = value;
    setFormData((prev) => ({ ...prev, golongan: newGolongan }));
  };

  const handlePendidikanChange = (index, field, value) => {
    const newPendidikan = [...formData.pendidikan];
    newPendidikan[index][field] = value;
    setFormData((prev) => ({ ...prev, pendidikan: newPendidikan }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const method = isEditing ? 'PUT' : 'POST';
      const url = isEditing ? `${apiAdminUrl}/${editId}` : apiAdminUrl;

      const res = await fetch(url, {
        method,
        headers: getAuthHeaders(),
        body: JSON.stringify(formData)
      });

      if (res.ok) {
        setShowModal(false);
        fetchData();
        resetForm();
      } else {
        alert("Gagal menyimpan data! Pastikan sesi Anda belum habis.");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Yakin ingin menghapus data ini?")) return;
    try {
      await fetch(`${apiAdminUrl}/${id}`, { 
        method: 'DELETE',
        headers: getAuthHeaders()
      });
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  const resetForm = () => {
    setFormData({ periode: '', totalPNS: 0, lakiLaki: 0, perempuan: 0, golongan: [], pendidikan: [] });
    setIsEditing(false);
    setEditId(null);
  };

  const openAddModal = () => {
    resetForm();
    setShowModal(true);
  };

  const openEditModal = (item) => {
    setFormData({
      periode: item.periode,
      totalPNS: item.totalPNS,
      lakiLaki: item.lakiLaki,
      perempuan: item.perempuan,
      golongan: item.golongan || [],
      pendidikan: item.pendidikan || []
    });
    setIsEditing(true);
    setEditId(item.id);
    setShowModal(true);
  };

  return (
    <div className="p-6 md:p-8 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Kelola Data PNS</h1>
          <p className="text-gray-500 text-sm mt-1">Manajemen statistik jumlah PNS, golongan, dan pendidikan.</p>
        </div>
        <button onClick={openAddModal} className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg font-semibold shadow-md transition-colors">
          + Tambah Data
        </button>
      </div>

      {isLoading ? (
        <div className="text-center py-10">Memuat data...</div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-100 text-gray-700">
                <th className="p-4 border-b">Periode</th>
                <th className="p-4 border-b">Total PNS</th>
                <th className="p-4 border-b">Laki-laki</th>
                <th className="p-4 border-b">Perempuan</th>
                <th className="p-4 border-b text-center">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {dataPNS.length === 0 ? (
                <tr><td colSpan="5" className="p-6 text-center text-gray-500">Belum ada data PNS.</td></tr>
              ) : (
                dataPNS.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="p-4 border-b font-medium">{item.periode}</td>
                    <td className="p-4 border-b">{item.totalPNS}</td>
                    <td className="p-4 border-b">{item.lakiLaki}</td>
                    <td className="p-4 border-b">{item.perempuan}</td>
                    <td className="p-4 border-b text-center space-x-2">
                      <button onClick={() => openEditModal(item)} className="bg-amber-500 hover:bg-amber-600 text-white px-3 py-1.5 rounded-md text-sm">Edit</button>
                      <button onClick={() => handleDelete(item.id)} className="bg-red-500 hover:bg-red-600 text-white px-3 py-1.5 rounded-md text-sm">Hapus</button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* MODAL FORM */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 z-50 flex justify-center items-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center z-10">
              <h2 className="text-xl font-bold text-gray-800">{isEditing ? 'Edit Data PNS' : 'Tambah Data PNS'}</h2>
              <button onClick={() => setShowModal(false)} className="text-gray-500 hover:text-red-500 font-bold text-xl">&times;</button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold mb-1">Periode / Keterangan (Cth: 2024)</label>
                  <input type="text" name="periode" value={formData.periode} onChange={handleInputChange} required className="w-full border rounded-lg p-2.5 outline-none focus:border-blue-500" />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1">Total PNS</label>
                  <input type="number" name="totalPNS" value={formData.totalPNS} onChange={handleInputChange} required className="w-full border rounded-lg p-2.5 outline-none focus:border-blue-500" />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1">Laki-laki</label>
                  <input type="number" name="lakiLaki" value={formData.lakiLaki} onChange={handleInputChange} required className="w-full border rounded-lg p-2.5 outline-none focus:border-blue-500" />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1">Perempuan</label>
                  <input type="number" name="perempuan" value={formData.perempuan} onChange={handleInputChange} required className="w-full border rounded-lg p-2.5 outline-none focus:border-blue-500" />
                </div>
              </div>

              <hr />

              {/* DATA GOLONGAN */}
              <div>
                <div className="flex justify-between items-center mb-3">
                  <h3 className="font-bold text-gray-800">Jumlah PNS Berdasarkan Golongan</h3>
                  <button type="button" onClick={() => setFormData(p => ({ ...p, golongan: [...p.golongan, { nama: '', jumlah: 0 }] }))} className="text-sm bg-blue-100 text-blue-700 px-3 py-1 rounded-md hover:bg-blue-200">+ Tambah Baris</button>
                </div>
                <div className="space-y-3">
                  {formData.golongan.map((gol, index) => (
                    <div key={index} className="flex gap-3 items-center bg-gray-50 p-3 rounded-lg border">
                      <div className="flex-1">
                        <label className="text-xs text-gray-500 mb-1 block">Nama Golongan (Cth: I/a)</label>
                        <input type="text" value={gol.nama} onChange={(e) => handleGolonganChange(index, 'nama', e.target.value)} required className="w-full border rounded p-2 text-sm" />
                      </div>
                      <div className="flex-1">
                        <label className="text-xs text-gray-500 mb-1 block">Jumlah Orang</label>
                        <input type="number" value={gol.jumlah} onChange={(e) => handleGolonganChange(index, 'jumlah', e.target.value)} required className="w-full border rounded p-2 text-sm" />
                      </div>
                      <button type="button" onClick={() => setFormData(p => ({ ...p, golongan: p.golongan.filter((_, i) => i !== index) }))} className="mt-5 text-red-500 hover:text-red-700 font-bold px-2">&times;</button>
                    </div>
                  ))}
                </div>
              </div>

              <hr />

              {/* DATA PENDIDIKAN */}
              <div>
                <div className="flex justify-between items-center mb-3">
                  <h3 className="font-bold text-gray-800">Jumlah PNS Berdasarkan Pendidikan</h3>
                  <button type="button" onClick={() => setFormData(p => ({ ...p, pendidikan: [...p.pendidikan, { tingkat: '', jumlah: 0 }] }))} className="text-sm bg-emerald-100 text-emerald-700 px-3 py-1 rounded-md hover:bg-emerald-200">+ Tambah Baris</button>
                </div>
                <div className="space-y-3">
                  {formData.pendidikan.map((pend, index) => (
                    <div key={index} className="flex gap-3 items-center bg-gray-50 p-3 rounded-lg border">
                      <div className="flex-1">
                        <label className="text-xs text-gray-500 mb-1 block">Pendidikan (Cth: S1, D3)</label>
                        <input type="text" value={pend.tingkat} onChange={(e) => handlePendidikanChange(index, 'tingkat', e.target.value)} required className="w-full border rounded p-2 text-sm" />
                      </div>
                      <div className="flex-1">
                        <label className="text-xs text-gray-500 mb-1 block">Jumlah Orang</label>
                        <input type="number" value={pend.jumlah} onChange={(e) => handlePendidikanChange(index, 'jumlah', e.target.value)} required className="w-full border rounded p-2 text-sm" />
                      </div>
                      <button type="button" onClick={() => setFormData(p => ({ ...p, pendidikan: p.pendidikan.filter((_, i) => i !== index) }))} className="mt-5 text-red-500 hover:text-red-700 font-bold px-2">&times;</button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="sticky bottom-0 bg-white pt-4 pb-2 border-t mt-6 flex justify-end gap-3">
                <button type="button" onClick={() => setShowModal(false)} className="px-5 py-2.5 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100">Batal</button>
                <button type="submit" className="px-5 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-md">Simpan Data</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}