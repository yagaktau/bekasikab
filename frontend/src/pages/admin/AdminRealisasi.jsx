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
    <div className="p-6 md:p-8 bg-off-white text-charcoal rounded-xl shadow-sm border border-sage-green/25">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-24 font-bold text-forest-green">Kelola Realisasi Anggaran</h2>
        <button
          onClick={() => {
            resetForm();
            setShowForm(true);
          }}
          className="bg-forest-green text-off-white px-4 py-2 rounded-lg hover:bg-sage-green transition font-medium"
        >
          + Tambah Data
        </button>
      </div>

      {showForm && (
        <form
          onSubmit={handleSave}
          className="bg-mint-gray p-6 rounded-lg border border-sage-green/25 mb-8 grid grid-cols-1 md:grid-cols-2 gap-4"
        >
          <div>
            <label className="block text-14 font-semibold text-charcoal mb-1">
              Tahun Anggaran
            </label>
            <input
              type="number"
              name="year"
              required
              placeholder="Contoh: 2024"
              value={formData.year}
              onChange={handleInputChange}
              className="w-full bg-off-white text-charcoal border border-sage-green/30 rounded-md px-4 py-2 outline-none focus:border-forest-green focus:ring-1 focus:ring-sage-green"
            />
          </div>
          <div>
            <label className="block text-14 font-semibold text-charcoal mb-1">
              Jumlah Anggaran (Nilai Penuh)
            </label>
            <input
              type="number"
              name="amount"
              required
              placeholder="Contoh: 315000000000"
              value={formData.amount}
              onChange={handleInputChange}
              className="w-full bg-off-white text-charcoal border border-sage-green/30 rounded-md px-4 py-2 outline-none focus:border-forest-green focus:ring-1 focus:ring-sage-green"
            />
            <p className="text-12 text-charcoal/75 mt-1">
              *Masukkan angka secara penuh tanpa titik. Contoh: 300 Miliar ditulis 300000000000
            </p>
          </div>
          <div className="md:col-span-2 flex justify-end gap-3 mt-2">
            <button
              type="button"
              onClick={resetForm}
              className="px-4 py-2 border border-sage-green/30 bg-off-white rounded-lg text-charcoal hover:bg-mint-gray transition"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-forest-green text-off-white rounded-lg hover:bg-sage-green transition font-medium"
            >
              {isEditing ? 'Simpan Perubahan' : 'Simpan Data'}
            </button>
          </div>
        </form>
      )}

      {isLoading ? (
        <div className="text-center py-10 text-forest-green font-medium">Memuat data...</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-sage-green/25">
            <thead className="bg-forest-green text-off-white">
              <tr>
                <th className="border border-sage-green/30 px-4 py-3 text-left text-sm font-semibold">
                  Tahun
                </th>
                <th className="border border-sage-green/30 px-4 py-3 text-left text-sm font-semibold">
                  Jumlah Anggaran (Rp)
                </th>
                <th className="border border-sage-green/30 px-4 py-3 text-center text-sm font-semibold w-40">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody>
              {data.length > 0 ? (
                data.map((item) => (
                  <tr key={item.id} className="hover:bg-mint-gray/50 transition-colors">
                    <td className="border border-sage-green/20 px-4 py-3 font-bold text-forest-green">
                      {item.year}
                    </td>
                    <td className="border border-sage-green/20 px-4 py-3 text-charcoal">
                      Rp {Number(item.amount).toLocaleString('id-ID')}
                    </td>
                    <td className="border border-sage-green/20 px-4 py-3 text-center">
                      <button
                        onClick={() => handleEdit(item)}
                        className="text-forest-green hover:text-sage-green hover:underline mr-3 text-sm font-semibold"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="text-red-600 hover:underline text-sm font-semibold"
                      >
                        Hapus
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="3"
                    className="text-center py-6 text-charcoal/70 border border-sage-green/20"
                  >
                    Belum ada data anggaran.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}