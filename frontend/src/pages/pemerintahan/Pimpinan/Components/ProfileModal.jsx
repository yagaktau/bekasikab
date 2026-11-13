import { motion } from 'framer-motion';
import { X, Calendar, MapPin } from 'lucide-react';

export default function ProfileModal({ leader, onClose }) {
  if (!leader) return null;

  // Fungsi pintar untuk mengubah teks yang dipisah "Enter" menjadi List (<ul><li>)
  const renderList = (textData) => {
    if (!textData) return null;
    const items = textData.split('\n').filter(item => item.trim() !== '');
    return (
      <ul className="list-disc list-outside pl-5 text-14 text-gray-700 space-y-2">
        {items.map((item, idx) => <li key={idx} className="leading-relaxed">{item}</li>)}
      </ul>
    );
  };

  // Fungsi sakti untuk merakit teks dengan delimiter "|" menjadi Tabel HTML
  const renderTable = (textData) => {
    if (!textData) return null;
    const rows = textData.split('\n').filter(row => row.trim() !== '');
    if (rows.length === 0) return null;

    // Baris pertama dijadikan Header (th)
    const headers = rows[0].split('|').map(h => h.trim());
    const dataRows = rows.slice(1);

    return (
      <div className="overflow-x-auto mt-2 rounded-xl border border-gray-200 shadow-sm">
        <table className="w-full text-left text-14 border-collapse">
          <thead className="bg-gray-100 border-b border-gray-200">
            <tr>
              <th className="p-3 font-bold text-gov-navy w-12 text-center">No</th>
              {headers.map((header, idx) => (
                <th key={idx} className="p-3 font-bold text-gov-navy border-l border-gray-200">{header}</th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-100">
            {dataRows.map((row, rowIdx) => {
              const columns = row.split('|').map(c => c.trim());
              return (
                <tr key={rowIdx} className="hover:bg-gray-50 transition-colors">
                  <td className="p-3 text-center text-gray-500">{rowIdx + 1}</td>
                  {columns.map((col, colIdx) => (
                    <td key={colIdx} className="p-3 text-gray-700 border-l border-gray-100">{col}</td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8 bg-black/70 backdrop-blur-sm">
      <motion.div 
        initial={{ opacity: 0, y: 50, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 50, scale: 0.95 }}
        className="bg-white w-full max-w-5xl rounded-2xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]"
      >
        {/* HEADER MODAL */}
        <div className="bg-gov-navy p-6 md:px-8 flex justify-between items-center text-white shrink-0">
          <div>
            <h3 className="text-20 md:text-24 font-bold">{leader.jabatan}</h3>
            <p className="text-white/80 text-14 mt-1 font-medium">Kabupaten Bekasi • Periode {leader.periode || '-'}</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/20 rounded-full transition-colors">
            <X size={24} />
          </button>
        </div>

        {/* AREA KONTEN (Bisa di-scroll) */}
        <div className="p-6 md:p-8 overflow-y-auto bg-gray-50/50">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-10">
            
            {/* KIRI: Foto & Identitas Dasar */}
            <div className="md:col-span-4 flex flex-col gap-5">
              <div className="bg-white p-3 rounded-2xl shadow-sm border border-gray-100">
                <img src={leader.fotoUrl} alt={leader.namaLengkap} className="w-full rounded-xl object-cover aspect-[3/4] bg-gray-100" />
              </div>
              
              <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
                <h4 className="text-18 font-extrabold text-gov-navy mb-4 border-b pb-3">{leader.namaLengkap}</h4>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <MapPin size={18} className="text-bekasi-gold shrink-0 mt-0.5" />
                    <div>
                      <p className="text-12 text-gray-500 uppercase font-semibold">Tempat, Tanggal Lahir</p>
                      <p className="text-14 text-gray-800 font-medium">{leader.tempatTanggalLahir || '-'}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Calendar size={18} className="text-bekasi-gold shrink-0 mt-0.5" />
                    <div>
                      <p className="text-12 text-gray-500 uppercase font-semibold">Masa Jabatan</p>
                      <p className="text-14 text-gray-800 font-medium">{leader.periode || '-'}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* KANAN: Sekat-sekat Detail (Biografi, Riwayat, Karir) */}
            <div className="md:col-span-8 flex flex-col gap-6">
              
              {(() => {
                // Deteksi apakah pimpinan ini adalah Sekretaris Daerah
                const isSekda = leader.jabatan?.toLowerCase().includes('sekretaris');

                if (isSekda) {
                  // ==========================================
                  // TAMPILAN KHUSUS SEKRETARIS DAERAH
                  // ==========================================
                  return (
                    <>
                      {/* SEKAT: Pendidikan Formal (Bullet List) */}
                      {leader.riwayatPendidikan && (
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                          <h4 className="text-18 font-bold text-gov-navy border-b-2 border-bekasi-gold inline-block mb-4">Pendidikan Formal</h4>
                          {renderList(leader.riwayatPendidikan)}
                        </div>
                      )}

                      {/* SEKAT: Tabel Riwayat Pangkat */}
                      {leader.riwayatPangkat && (
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                          <h4 className="text-18 font-bold text-gov-navy border-b-2 border-bekasi-gold inline-block mb-4">Riwayat Pangkat</h4>
                          {renderTable(leader.riwayatPangkat)}
                        </div>
                      )}

                      {/* SEKAT: Tabel Riwayat Pendidikan dan Pelatihan */}
                      {leader.riwayatDiklat && (
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                          <h4 className="text-18 font-bold text-gov-navy border-b-2 border-bekasi-gold inline-block mb-4">Riwayat Pendidikan dan Pelatihan</h4>
                          {renderTable(leader.riwayatDiklat)}
                        </div>
                      )}
                    </>
                  );
                } else {
                  // ==========================================
                  // TAMPILAN KHUSUS BUPATI & WAKIL BUPATI
                  // ==========================================
                  return (
                    <>
                      {/* SEKAT: Biografi Singkat */}
                      {leader.bio && (
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                          <h4 className="text-18 font-bold text-gov-navy border-b-2 border-bekasi-gold inline-block mb-4">Biografi Singkat</h4>
                          <div className="text-gray-700 leading-relaxed text-justify text-15 whitespace-pre-wrap">
                            {leader.bio}
                          </div>
                        </div>
                      )}

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* SEKAT: Pendidikan Formal (Bullet List) */}
                        {leader.riwayatPendidikan && (
                          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 h-full">
                            <h4 className="text-18 font-bold text-gov-navy border-b-2 border-bekasi-gold inline-block mb-4">Pendidikan Formal</h4>
                            {renderList(leader.riwayatPendidikan)}
                          </div>
                        )}
                        
                        {/* SEKAT: Karir Politik (Bullet List) */}
                        {leader.karirPolitik && (
                          <div className="text-justify bg-white p-6 rounded-2xl shadow-sm border border-gray-100 h-full">
                            <h4 className="text-18 font-bold text-gov-navy border-b-2 border-bekasi-gold inline-block mb-4">Karir Politik</h4>
                            {renderList(leader.karirPolitik)}
                          </div>
                        )}
                      </div>
                    </>
                  );
                }
              })()}

            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}