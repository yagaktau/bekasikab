import React, { useState, useEffect, useRef } from 'react';

export default function AdminKecamatan() {
  const [kecamatanList, setKecamatanList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // State Mode Edit
  const [editId, setEditId] = useState(null);
  const [existingFoto, setExistingFoto] = useState(null);
  const fileInputRef = useRef(null);

  // Form State
  const [namaKecamatan, setNamaKecamatan] = useState('');
  const [namaKelurahan, setNamaKelurahan] = useState(['']);
  const [namaDesa, setNamaDesa] = useState(['']);
  const [foto, setFoto] = useState(null);

  const API_URL = `http://${window.location.hostname}:5000/api/kecamatan`;

  // Ambil Data
  const fetchData = async () => {
    try {
      const res = await fetch(API_URL);
      const data = await res.json();
      setKecamatanList(data);
    } catch (error) {
      console.error('Gagal load data:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // --- Handler Dinamis Kelurahan ---
  const handleKelurahanChange = (index, value) => {
    const updated = [...namaKelurahan];
    updated[index] = value;
    setNamaKelurahan(updated);
  };
  const addKelurahanField = () => setNamaKelurahan([...namaKelurahan, '']);
  const removeKelurahanField = (index) =>
    setNamaKelurahan(namaKelurahan.filter((_, i) => i !== index));

  // --- Handler Dinamis Desa ---
  const handleDesaChange = (index, value) => {
    const updated = [...namaDesa];
    updated[index] = value;
    setNamaDesa(updated);
  };
  const addDesaField = () => setNamaDesa([...namaDesa, '']);
  const removeDesaField = (index) =>
    setNamaDesa(namaDesa.filter((_, i) => i !== index));

  // --- Reset Form ---
  const resetForm = () => {
    setEditId(null);
    setExistingFoto(null);
    setNamaKecamatan('');
    setNamaKelurahan(['']);
    setNamaDesa(['']);
    setFoto(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // --- Isi Form Saat Klik Edit ---
  const handleEdit = (item) => {
    setEditId(item.id);
    setNamaKecamatan(item.namaKecamatan || item.title || '');
    setNamaKelurahan(
      Array.isArray(item.namaKelurahan) && item.namaKelurahan.length > 0
        ? item.namaKelurahan
        : ['']
    );
    setNamaDesa(
      Array.isArray(item.namaDesa) && item.namaDesa.length > 0
        ? item.namaDesa
        : ['']
    );
    setExistingFoto(item.foto || item.gambar || null);
    setFoto(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // --- Submit Tambah / Edit ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!namaKecamatan.trim()) return alert('Nama Kecamatan wajib diisi!');

    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append('namaKecamatan', namaKecamatan);

      const filteredKelurahan = namaKelurahan.filter((k) => k.trim() !== '');
      formData.append('namaKelurahan', JSON.stringify(filteredKelurahan));

      const filteredDesa = namaDesa.filter((d) => d.trim() !== '');
      formData.append('namaDesa', JSON.stringify(filteredDesa));

      if (foto) formData.append('foto', foto);

      const url = editId ? `${API_URL}/${editId}` : API_URL;
      const method = editId ? 'PUT' : 'POST';

      const res = await fetch(url, {
        credentials: 'include',
        method,
        body: formData,
      });

      if (res.ok) {
        alert(editId ? 'Data berhasil diperbarui!' : 'Data berhasil ditambahkan!');
        resetForm();
        fetchData();
      } else {
        alert('Gagal menyimpan data.');
      }
    } catch (error) {
      console.error(error);
      alert('Terjadi kesalahan sistem saat menyimpan.');
    } finally {
      setIsLoading(false);
    }
  };

  // --- Hapus Data ---
  const handleDelete = async (id) => {
    if (!window.confirm('Yakin ingin menghapus data ini?')) return;

    try {
      const res = await fetch(`${API_URL}/${id}`, {
        credentials: 'include',
        method: 'DELETE',
      });

      if (res.ok) {
        alert('Data dihapus!');
        if (editId === id) resetForm();
        fetchData();
      }
    } catch (error) {
      console.error('Gagal hapus data:', error);
    }
  };

  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto text-charcoal">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-forest-green">Kelola Data Wilayah</h1>
        <p className="text-charcoal/75 mt-1">
          Tambah, ubah, dan hapus data Kecamatan beserta daftar Kelurahan dan Desa.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* PANEL KIRI: FORM TAMBAH / EDIT DATA */}
        <div className="bg-mint-gray p-6 rounded-xl border border-sage-green/25 shadow-sm h-fit">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-forest-green">
              {editId ? 'Edit Data Wilayah' : 'Tambah Data Wilayah'}
            </h2>
            {editId && (
              <button
                type="button"
                onClick={resetForm}
                className="text-xs bg-off-white hover:bg-sage-green hover:text-off-white text-forest-green border border-sage-green/30 px-2.5 py-1 rounded font-medium transition-colors"
              >
                Batal Edit
              </button>
            )}
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {/* Input Kecamatan */}
            <div>
              <label className="block text-sm font-semibold text-charcoal mb-1">
                Nama Kecamatan *
              </label>
              <input
                type="text"
                value={namaKecamatan}
                onChange={(e) => setNamaKecamatan(e.target.value)}
                placeholder="Cth: Cikarang Pusat"
                className="w-full p-2 bg-off-white text-charcoal border border-sage-green/30 rounded-md focus:outline-none focus:border-forest-green focus:ring-1 focus:ring-sage-green"
                required
              />
            </div>

            {/* Input Dinamis Kelurahan */}
            <div>
              <label className="block text-sm font-semibold text-charcoal mb-1">
                Nama Kelurahan (Jika ada)
              </label>
              {namaKelurahan.map((kelurahan, index) => (
                <div key={index} className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={kelurahan}
                    onChange={(e) => handleKelurahanChange(index, e.target.value)}
                    placeholder={`Nama Kelurahan ${index + 1}`}
                    className="w-full p-2 bg-off-white text-charcoal border border-sage-green/30 rounded-md focus:outline-none focus:border-forest-green focus:ring-1 focus:ring-sage-green"
                  />
                  {namaKelurahan.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeKelurahanField(index)}
                      className="px-3 bg-red-50 text-red-600 rounded-md hover:bg-red-600 hover:text-off-white transition-colors shrink-0 text-sm"
                    >
                      Hapus
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={addKelurahanField}
                className="text-sm text-forest-green font-semibold hover:text-sage-green mt-1 inline-flex items-center gap-1"
              >
                <span>+</span> Tambah Kelurahan Lainnya
              </button>
            </div>

            {/* Input Dinamis Desa */}
            <div>
              <label className="block text-sm font-semibold text-charcoal mb-1">
                Nama Desa
              </label>
              {namaDesa.map((desa, index) => (
                <div key={index} className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={desa}
                    onChange={(e) => handleDesaChange(index, e.target.value)}
                    placeholder={`Nama Desa ${index + 1}`}
                    className="w-full p-2 bg-off-white text-charcoal border border-sage-green/30 rounded-md focus:outline-none focus:border-forest-green focus:ring-1 focus:ring-sage-green"
                  />
                  {namaDesa.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeDesaField(index)}
                      className="px-3 bg-red-50 text-red-600 rounded-md hover:bg-red-600 hover:text-off-white transition-colors shrink-0 text-sm"
                    >
                      Hapus
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={addDesaField}
                className="text-sm text-forest-green font-semibold hover:text-sage-green mt-1 inline-flex items-center gap-1"
              >
                <span>+</span> Tambah Desa Lainnya
              </button>
            </div>

            {/* Input File Foto */}
            <div>
              <label className="block text-sm font-semibold text-charcoal mb-1">
                {editId ? 'Ganti Foto Wilayah (Opsional)' : 'Upload Foto Kantor / Wilayah'}
              </label>
              {editId && existingFoto && !foto && (
                <div className="mb-2 flex items-center gap-3 p-2 bg-off-white rounded-md border border-sage-green/25">
                  <img
                    src={existingFoto}
                    alt="Foto saat ini"
                    className="w-12 h-12 object-cover rounded"
                  />
                  <span className="text-xs text-charcoal/75">
                    Foto saat ini tersimpan. Pilih file baru jika ingin mengganti.
                  </span>
                </div>
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={(e) => setFoto(e.target.files[0])}
                className="w-full p-2 bg-off-white text-charcoal border border-sage-green/30 rounded-md focus:outline-none focus:border-forest-green text-sm file:mr-4 file:py-1.5 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-forest-green file:text-off-white hover:file:bg-sage-green cursor-pointer"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className={`mt-2 text-off-white font-bold py-2.5 rounded-md transition-colors disabled:opacity-50 ${
                editId
                  ? 'bg-sage-green hover:bg-forest-green'
                  : 'bg-forest-green hover:bg-sage-green'
              }`}
            >
              {isLoading
                ? 'Menyimpan...'
                : editId
                ? 'Simpan Perubahan'
                : 'Simpan Data'}
            </button>
          </form>
        </div>

        {/* PANEL KANAN: TABEL DAFTAR DATA */}
        <div className="lg:col-span-2 bg-off-white rounded-xl border border-sage-green/25 shadow-sm overflow-hidden h-fit">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-forest-green text-off-white text-sm border-b border-sage-green/30">
                  <th className="p-4 font-semibold">Kecamatan</th>
                  <th className="p-4 font-semibold">Daftar Kelurahan</th>
                  <th className="p-4 font-semibold">Daftar Desa</th>
                  <th className="p-4 font-semibold text-center">Foto</th>
                  <th className="p-4 font-semibold w-36 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {kecamatanList.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="p-8 text-center text-charcoal/70">
                      Belum ada data wilayah.
                    </td>
                  </tr>
                ) : (
                  kecamatanList.map((item) => (
                    <tr
                      key={item.id}
                      className={`border-b border-sage-green/20 hover:bg-mint-gray/50 transition-colors ${
                        editId === item.id ? 'bg-mint-gray' : ''
                      }`}
                    >
                      <td className="p-4 font-bold text-forest-green">
                        {item.namaKecamatan || item.title}
                      </td>
                      <td className="p-4 text-charcoal">
                        {Array.isArray(item.namaKelurahan) &&
                        item.namaKelurahan.length > 0
                          ? item.namaKelurahan.join(', ')
                          : '-'}
                      </td>
                      <td className="p-4 text-charcoal">
                        {Array.isArray(item.namaDesa) && item.namaDesa.length > 0
                          ? item.namaDesa.join(', ')
                          : '-'}
                      </td>
                      <td className="p-4 text-center">
                        {item.foto || item.gambar ? (
                          <span className="text-forest-green font-semibold text-xs bg-mint-gray border border-sage-green/30 px-2.5 py-1 rounded-full">
                            Ada
                          </span>
                        ) : (
                          <span className="text-charcoal/50 text-xs">Kosong</span>
                        )}
                      </td>
                      <td className="p-4 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => handleEdit(item)}
                            className="bg-mint-gray text-forest-green hover:bg-sage-green hover:text-off-white px-3 py-1.5 rounded-md font-medium transition-colors text-xs"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(item.id)}
                            className="bg-red-50 text-red-600 hover:bg-red-600 hover:text-off-white px-3 py-1.5 rounded-md font-medium transition-colors text-xs"
                          >
                            Hapus
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
      </div>
    </div>
  );
}