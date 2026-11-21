import { useState, useEffect } from 'react';
import API from '../../services/api';

export default function AdminRealisasi() {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  
  const [formData, setFormData] = useState({ id: null, year: '', amount: '' });

    const fetchData = async () => {
    setIsLoading(true);
    try {
      const res = await API.get('/realisasi-anggaran');
      setData(res.data);
    } catch (error) {
      console.error('Error fetching data:', error);
      alert('Gagal mengambil data Realisasi Anggaran');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      if (isEditing) {
        await API.put(`/admin/realisasi-anggaran/${formData.id}`, formData, { headers });
        alert('Data berhasil diperbarui!');
      } else {
        await API.post('/admin/realisasi-anggaran', formData, { headers });
        alert('Data berhasil ditambahkan!');
      }
      setShowForm(false);
      fetchData();
    } catch (error) {
      console.error('Error saving data:', error);
      alert('Gagal menyimpan data. Pastikan tahun tidak duplikat.');
    }
  };

  const handleEdit = (item) => {
    setFormData({ id: item.id, year: item.year, amount: item.amount });
    setIsEditing(true);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Yakin ingin menghapus data tahun ini?')) return;
    try {
      await API.delete(`/admin/realisasi-anggaran/${id}`, { headers });
      alert('Data berhasil dihapus!');
      fetchData();
    } catch (error) {
      console.error('Error deleting data:', error);
      alert('Gagal menghapus data');
    }
  };

  const resetForm = () => {
    setFormData({ id: null, year: '', amount: '' });
    setIsEditing(false);
    setShowForm(false);
  };

  return (
    <div className="p-6 md:p-8 bg-white rounded-xl shadow-sm border border-slate-200">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-24 font-bold text-gov-navy">Kelola Realisasi Anggaran</h2>
        <button
          onClick={() => { resetForm(); setShowForm(true); }}
          className="bg-bekasi-green text-white px-4 py-2 rounded-lg hover:bg-green-700 transition font-medium"
        >
          + Tambah Data
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSave} className="bg-slate-50 p-6 rounded-lg border border-slate-200 mb-8 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-14 font-semibold text-slate-700 mb-1">Tahun Anggaran</label>
            <input
              type="number"
              name="year"
              required
              placeholder="Contoh: 2024"
              value={formData.year}
              onChange={handleInputChange}
              className="w-full border border-slate-300 rounded-md px-4 py-2 outline-none focus:border-bekasi-green"
            />
          </div>
          <div>
            <label className="block text-14 font-semibold text-slate-700 mb-1">Jumlah Anggaran (Nilai Penuh)</label>
            <input
              type="number"
              name="amount"
              required
              placeholder="Contoh: 315000000000"
              value={formData.amount}
              onChange={handleInputChange}
              className="w-full border border-slate-300 rounded-md px-4 py-2 outline-none focus:border-bekasi-green"
            />
            <p className="text-12 text-slate-500 mt-1">*Masukkan angka secara penuh tanpa titik. Contoh: 300 Miliar ditulis 300000000000</p>
          </div>
          <div className="md:col-span-2 flex justify-end gap-3 mt-2">
            <button type="button" onClick={resetForm} className="px-4 py-2 border border-slate-300 rounded-lg text-slate-600 hover:bg-slate-200 transition">
              Batal
            </button>
            <button type="submit" className="px-4 py-2 bg-gov-navy text-white rounded-lg hover:bg-blue-900 transition">
              {isEditing ? 'Simpan Perubahan' : 'Simpan Data'}
            </button>
          </div>
        </form>
      )}

      {isLoading ? (
        <div className="text-center py-10 text-slate-500">Memuat data...</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-slate-200">
            <thead className="bg-slate-100">
              <tr>
                <th className="border border-slate-200 px-4 py-3 text-left text-sm font-semibold text-slate-700">Tahun</th>
                <th className="border border-slate-200 px-4 py-3 text-left text-sm font-semibold text-slate-700">Jumlah Anggaran (Rp)</th>
                <th className="border border-slate-200 px-4 py-3 text-center text-sm font-semibold text-slate-700 w-40">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {data.length > 0 ? (
                data.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50">
                    <td className="border border-slate-200 px-4 py-3 font-medium text-slate-800">{item.year}</td>
                    <td className="border border-slate-200 px-4 py-3 text-slate-600">Rp {Number(item.amount).toLocaleString('id-ID')}</td>
                    <td className="border border-slate-200 px-4 py-3 text-center">
                      <button onClick={() => handleEdit(item)} className="text-blue-600 hover:underline mr-3 text-sm font-medium">Edit</button>
                      <button onClick={() => handleDelete(item.id)} className="text-red-600 hover:underline text-sm font-medium">Hapus</button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3" className="text-center py-6 text-slate-500 border border-slate-200">Belum ada data anggaran.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}