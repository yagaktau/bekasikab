import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, X, Upload, Info } from 'lucide-react';
import API from '../../services/api';

export default function AdminPimpinan() {
  const [dataPimpinan, setDataPimpinan] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);
  const [fotoFile, setFotoFile] = useState(null);
  const [fotoPreview, setFotoPreview] = useState('');

  const [formData, setFormData] = useState({
    namaLengkap: '',
    jabatan: '',
    periodeAwal: '',
    periodeAkhir: '',
    fotoUrl: '',
    bio: '',
    urutan: 0,
    isActive: true,
    tempatTanggalLahir: '',
    riwayatPendidikan: '',
    karirPolitik: '',
    riwayatPangkat: '',
    riwayatDiklat: '',
  });

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
      const res = await API.get('/pimpinan');
      const result = Array.isArray(res.data) ? res.data : res.data?.data || [];
      setDataPimpinan(result);
    } catch (error) {
      console.error('Gagal mengambil data pimpinan:', error);
      setDataPimpinan([]);
    }
  };

  const isJabatanTaken = (jabatanLabel) => {
    if (isEditing && formData.jabatan === jabatanLabel) return false;
    return dataPimpinan.some((item) => item.jabatan === jabatanLabel);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleJabatanChange = (e) => {
    const selectedJabatan = e.target.value;
    const matchedOption = JABATAN_OPTIONS.find((opt) => opt.label === selectedJabatan);
    setFormData((prev) => ({
      ...prev,
      jabatan: selectedJabatan,
      urutan: matchedOption ? matchedOption.urutan : 0,
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFotoFile(file);
      setFotoPreview(URL.createObjectURL(file));
    }
  };

  const openAddModal = () => {
    setIsEditing(false);
    setEditId(null);
    setFotoFile(null);
    setFotoPreview('');
    setFormData({
      namaLengkap: '',
      jabatan: '',
      periodeAwal: '',
      periodeAkhir: '',
      fotoUrl: '',
      bio: '',
      urutan: 0,
      isActive: true,
      tempatTanggalLahir: '',
      riwayatPendidikan: '',
      karirPolitik: '',
      riwayatPangkat: '',
      riwayatDiklat: '',
    });
    setIsModalOpen(true);
  };

  const openEditModal = (pimpinan) => {
    setIsEditing(true);
    setEditId(pimpinan.id);
    const periodeSplit = pimpinan.periode ? pimpinan.periode.split(' - ') : ['', ''];
    setFotoFile(null);
    setFotoPreview(pimpinan.fotoUrl || '');
    setFormData({
      ...pimpinan,
      periodeAwal: periodeSplit[0] || '',
      periodeAkhir: periodeSplit[1] || '',
      tempatTanggalLahir: pimpinan.tempatTanggalLahir || '',
      riwayatPendidikan: pimpinan.riwayatPendidikan || '',
      karirPolitik: pimpinan.karirPolitik || '',
      riwayatPangkat: pimpinan.riwayatPangkat || '',
      riwayatDiklat: pimpinan.riwayatDiklat || '',
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.jabatan) return alert('Pilih jabatan dulu.');
    setIsLoading(true);

    try {
      const token = localStorage.getItem('token');
      const authHeader = token ? { Authorization: `Bearer ${token}` } : {};

      let finalFotoUrl = formData.fotoUrl;
      if (fotoFile) {
        const uploadData = new FormData();
        uploadData.append('image', fotoFile);
        const uploadRes = await fetch('http://localhost:5000/api/admin/upload', {
          method: 'POST',
          headers: authHeader,
          body: uploadData,
        });
        if (uploadRes.ok) {
          const result = await uploadRes.json();
          finalFotoUrl = result.imageUrl;
        }
      }

      const payload = {
        namaLengkap: formData.namaLengkap,
        jabatan: formData.jabatan,
        periode:
          formData.periodeAwal && formData.periodeAkhir
            ? `${formData.periodeAwal} - ${formData.periodeAkhir}`
            : '',
        fotoUrl: finalFotoUrl,
        bio: formData.bio || '',
        urutan: formData.urutan,
        isActive: formData.isActive,
        tempatTanggalLahir: formData.tempatTanggalLahir || '',
        riwayatPendidikan: formData.riwayatPendidikan || '',
        karirPolitik: formData.karirPolitik || '',
        riwayatPangkat: formData.riwayatPangkat || '',
        riwayatDiklat: formData.riwayatDiklat || '',
      };

      const url = isEditing
        ? `http://localhost:5000/api/admin/pimpinan/${editId}`
        : 'http://localhost:5000/api/admin/pimpinan';

      const res = await fetch(url, {
        method: isEditing ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...authHeader,
        },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        alert(isEditing ? 'Data berhasil diperbarui!' : 'Data berhasil ditambahkan!');
        setIsModalOpen(false);
        fetchData();
      } else {
        const errData = await res.json().catch(() => ({}));
        alert(errData.message || 'Gagal menyimpan data.');
      }
    } catch (error) {
      console.error('Error saat menyimpan pimpinan:', error);
      alert('Terjadi kesalahan server.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Hapus data ini?')) return;
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`http://localhost:5000/api/admin/pimpinan/${id}`, {
        method: 'DELETE',
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      if (res.ok) {
        alert('Data berhasil dihapus!');
        fetchData();
      }
    } catch (error) {
      console.error('Gagal menghapus data:', error);
    }
  };

  return (
    <div className="bg-off-white text-charcoal rounded-xl shadow-sm border border-sage-green/25 overflow-hidden">
      <div className="p-6 border-b border-sage-green/25 flex justify-between items-center bg-mint-gray">
        <div>
          <h2 className="text-18 font-bold text-forest-green">Daftar Pimpinan</h2>
        </div>
        <button
          onClick={openAddModal}
          disabled={dataPimpinan.length >= 3}
          className={`flex items-center gap-2 px-4 py-2 text-off-white rounded-lg transition-colors text-14 font-medium ${
            dataPimpinan.length >= 3
              ? 'bg-charcoal/40 cursor-not-allowed'
              : 'bg-forest-green hover:bg-sage-green'
          }`}
        >
          <Plus size={18} /> Tambah Pimpinan
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-forest-green border-b border-sage-green/30 text-14 text-off-white">
              <th className="p-4 font-semibold w-16">Foto</th>
              <th className="p-4 font-semibold">Nama & Jabatan</th>
              <th className="p-4 font-semibold text-center">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {dataPimpinan.map((item) => (
              <tr key={item.id} className="border-b border-sage-green/20 hover:bg-mint-gray/50">
                <td className="p-4">
                  <img
                    src={item.fotoUrl || 'https://via.placeholder.com/50'}
                    className="w-12 h-12 object-cover rounded-full bg-mint-gray border border-sage-green/25"
                    alt=""
                  />
                </td>
                <td className="p-4">
                  <p className="font-bold text-forest-green">{item.namaLengkap}</p>
                  <p className="text-13 text-charcoal/75">{item.jabatan}</p>
                </td>
                <td className="p-4 flex justify-center gap-2">
                  <button
                    onClick={() => openEditModal(item)}
                    className="p-2 text-forest-green hover:bg-mint-gray rounded-lg transition-colors"
                  >
                    <Edit size={18} />
                  </button>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-charcoal/60 z-50 flex items-center justify-center p-4 md:p-6 backdrop-blur-sm">
          <div className="bg-off-white rounded-2xl w-full max-w-3xl max-h-[95vh] overflow-y-auto shadow-2xl relative border border-sage-green/30">
            <div className="p-6 border-b border-sage-green/25 flex justify-between items-center sticky top-0 bg-forest-green text-off-white z-10 rounded-t-2xl">
              <h3 className="text-18 font-bold text-off-white">
                {isEditing ? 'Edit Profil' : 'Tambah Profil'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 hover:bg-sage-green rounded-full text-off-white transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              {/* === BAGIAN 1: INFO DASAR === */}
              <div className="bg-mint-gray p-4 rounded-xl space-y-4 border border-sage-green/25">
                <h4 className="font-bold text-forest-green border-b border-sage-green/25 pb-2">
                  1. Informasi Dasar
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-14 font-semibold text-charcoal mb-1">
                      Nama Lengkap
                    </label>
                    <input
                      type="text"
                      name="namaLengkap"
                      required
                      value={formData.namaLengkap}
                      onChange={handleInputChange}
                      className="w-full p-2.5 bg-off-white text-charcoal border border-sage-green/30 rounded-lg focus:ring-2 focus:ring-sage-green focus:border-forest-green outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-14 font-semibold text-charcoal mb-1">
                      Jabatan
                    </label>
                    <select
                      name="jabatan"
                      required
                      value={formData.jabatan}
                      onChange={handleJabatanChange}
                      className="w-full p-2.5 bg-off-white text-charcoal border border-sage-green/30 rounded-lg focus:ring-2 focus:ring-sage-green focus:border-forest-green outline-none"
                    >
                      <option value="" disabled>
                        -- Pilih --
                      </option>
                      {JABATAN_OPTIONS.map((opt) => (
                        <option
                          key={opt.urutan}
                          value={opt.label}
                          disabled={isJabatanTaken(opt.label)}
                        >
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-14 font-semibold text-charcoal mb-1">
                      Tempat, Tanggal Lahir
                    </label>
                    <input
                      type="text"
                      name="tempatTanggalLahir"
                      value={formData.tempatTanggalLahir}
                      onChange={handleInputChange}
                      placeholder="Contoh: Bekasi, 15 Agustus 1993"
                      className="w-full p-2.5 bg-off-white text-charcoal border border-sage-green/30 rounded-lg focus:ring-2 focus:ring-sage-green focus:border-forest-green outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-14 font-semibold text-charcoal mb-1">
                      Periode Masa Jabatan
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="number"
                        name="periodeAwal"
                        value={formData.periodeAwal}
                        onChange={handleInputChange}
                        placeholder="Mulai"
                        className="w-full p-2.5 bg-off-white text-charcoal border border-sage-green/30 rounded-lg focus:ring-2 focus:ring-sage-green focus:border-forest-green outline-none"
                      />
                      <input
                        type="number"
                        name="periodeAkhir"
                        value={formData.periodeAkhir}
                        onChange={handleInputChange}
                        placeholder="Selesai"
                        className="w-full p-2.5 bg-off-white text-charcoal border border-sage-green/30 rounded-lg focus:ring-2 focus:ring-sage-green focus:border-forest-green outline-none"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* === DETEKSI JABATAN === */}
              {(() => {
                const isSekda =
                  formData.jabatan && formData.jabatan.toLowerCase().includes('sekretaris');

                return (
                  <>
                    {/* HANYA MUNCUL JIKA BUKAN SEKDA */}
                    {!isSekda && (
                      <div className="bg-mint-gray p-4 rounded-xl space-y-4 border border-sage-green/25">
                        <h4 className="font-bold text-forest-green border-b border-sage-green/25 pb-2">
                          2. Foto & Biografi Utama
                        </h4>
                        <div>
                          <label className="block text-14 font-semibold text-charcoal mb-2">
                            Upload Foto
                          </label>
                          <div className="flex items-center gap-4">
                            {fotoPreview ? (
                              <img
                                src={fotoPreview}
                                className="w-20 h-20 object-cover rounded-lg border border-sage-green/30"
                                alt="preview"
                              />
                            ) : (
                              <div className="w-20 h-20 bg-off-white border border-sage-green/30 rounded-lg flex items-center justify-center">
                                <Upload size={20} className="text-sage-green" />
                              </div>
                            )}
                            <input
                              type="file"
                              accept="image/*"
                              onChange={handleFileChange}
                              className="text-14 text-charcoal"
                            />
                          </div>
                        </div>
                        <div>
                          <label className="block text-14 font-semibold text-charcoal mb-1">
                            Biografi Singkat
                          </label>
                          <textarea
                            name="bio"
                            rows="4"
                            value={formData.bio}
                            onChange={handleInputChange}
                            className="w-full p-2.5 bg-off-white text-charcoal border border-sage-green/30 rounded-lg focus:ring-2 focus:ring-sage-green focus:border-forest-green outline-none"
                          ></textarea>
                        </div>
                      </div>
                    )}

                    {/* MUNCUL UNTUK SEKDA MAUPUN BUPATI */}
                    <div className="bg-mint-gray/70 p-4 rounded-xl space-y-4 border border-sage-green/30">
                      <h4 className="font-bold text-forest-green border-b border-sage-green/25 pb-2 flex items-center gap-2">
                        <Info size={18} className="text-sage-green" />{' '}
                        {isSekda
                          ? '2. Detail Riwayat (Khusus Sekda)'
                          : '3. Detail Riwayat Tambahan'}
                      </h4>

                      {/* Form Foto Khusus Sekda */}
                      {isSekda && (
                        <div className="mb-4 pb-4 border-b border-sage-green/25">
                          <label className="block text-14 font-semibold text-charcoal mb-2">
                            Upload Foto
                          </label>
                          <div className="flex items-center gap-4">
                            {fotoPreview ? (
                              <img
                                src={fotoPreview}
                                className="w-20 h-20 object-cover rounded-lg border border-sage-green/30"
                                alt="preview"
                              />
                            ) : (
                              <div className="w-20 h-20 bg-off-white border border-sage-green/30 rounded-lg flex items-center justify-center">
                                <Upload size={20} className="text-sage-green" />
                              </div>
                            )}
                            <input
                              type="file"
                              accept="image/*"
                              onChange={handleFileChange}
                              className="text-14 text-charcoal"
                            />
                          </div>
                        </div>
                      )}

                      <div>
                        <label className="block text-14 font-semibold text-charcoal mb-1">
                          Pendidikan Formal (List)
                        </label>
                        <p className="text-12 text-charcoal/75 mb-2">
                          Gunakan tombol <b>Enter</b> untuk memisahkan setiap poin.
                        </p>
                        <textarea
                          name="riwayatPendidikan"
                          rows="3"
                          value={formData.riwayatPendidikan}
                          onChange={handleInputChange}
                          placeholder="SD Negeri Sukadami 03&#10;SMP Negeri 1 Cikarang"
                          className="w-full p-2.5 bg-off-white text-charcoal border border-sage-green/30 rounded-lg focus:ring-2 focus:ring-sage-green focus:border-forest-green outline-none"
                        ></textarea>
                      </div>

                      {/* KHUSUS BUPATI/WAKIL */}
                      {!isSekda && (
                        <div>
                          <label className="block text-14 font-semibold text-charcoal mb-1">
                            Karir Politik (List)
                          </label>
                          <textarea
                            name="karirPolitik"
                            rows="3"
                            value={formData.karirPolitik}
                            onChange={handleInputChange}
                            placeholder="Anggota DPRD Kabupaten Bekasi&#10;Ketua Fraksi..."
                            className="w-full p-2.5 bg-off-white text-charcoal border border-sage-green/30 rounded-lg focus:ring-2 focus:ring-sage-green focus:border-forest-green outline-none"
                          ></textarea>
                        </div>
                      )}

                      {/* KHUSUS SEKDA */}
                      {isSekda && (
                        <>
                          <div>
                            <label className="block text-14 font-semibold text-charcoal mb-1">
                              Riwayat Pangkat (TABEL)
                            </label>
                            <p className="text-12 text-charcoal/75 mb-2">
                              <b>Baris 1 adalah Header.</b> Pemisah kolom: <b>|</b>. Pemisah baris:{' '}
                              <b>Enter</b>.
                            </p>
                            <textarea
                              name="riwayatPangkat"
                              rows="4"
                              value={formData.riwayatPangkat}
                              onChange={handleInputChange}
                              placeholder="Gol/Ruang | TMT | Keterangan&#10;Pembina (IV/a) | 01-10-2015 | SK Bupati"
                              className="w-full p-2.5 bg-off-white text-charcoal border border-sage-green/30 rounded-lg font-mono text-13 focus:ring-2 focus:ring-sage-green focus:border-forest-green outline-none"
                            ></textarea>
                          </div>
                          <div>
                            <label className="block text-14 font-semibold text-charcoal mb-1">
                              Riwayat Pendidikan dan Pelatihan (TABEL)
                            </label>
                            <p className="text-12 text-charcoal/75 mb-2">
                              <b>Baris 1 adalah Header.</b> Pemisah kolom: <b>|</b>. Pemisah baris:{' '}
                              <b>Enter</b>.
                            </p>
                            <textarea
                              name="riwayatDiklat"
                              rows="4"
                              value={formData.riwayatDiklat}
                              onChange={handleInputChange}
                              placeholder="Nama Pelatihan | Tahun | Penyelenggara&#10;Diklat PIM II | 2018 | LAN RI"
                              className="w-full p-2.5 bg-off-white text-charcoal border border-sage-green/30 rounded-lg font-mono text-13 focus:ring-2 focus:ring-sage-green focus:border-forest-green outline-none"
                            ></textarea>
                          </div>
                        </>
                      )}
                    </div>
                  </>
                );
              })()}

              {/* === TOMBOL SIMPAN === */}
              <div className="flex justify-end gap-3 pt-4 border-t border-sage-green/20">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 text-14 font-medium text-charcoal bg-mint-gray hover:bg-sage-green/20 rounded-lg transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="px-5 py-2.5 text-14 font-medium text-off-white bg-forest-green hover:bg-sage-green rounded-lg transition-colors"
                >
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