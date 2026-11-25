import { motion } from 'framer-motion';
import { X, Calendar, MapPin } from 'lucide-react';

export default function ProfileModal({ leader, onClose }) {
  if (!leader) return null;

  const renderList = (textData) => {
    if (!textData) return null;
    const items = textData.split('\n').filter((item) => item.trim() !== '');
    return (
      <ul className="list-disc list-outside pl-5 text-14 text-charcoal space-y-2">
        {items.map((item, idx) => (
          <li key={idx} className="leading-relaxed">
            {item}
          </li>
        ))}
      </ul>
    );
  };

  const renderTable = (textData) => {
    if (!textData) return null;
    const rows = textData.split('\n').filter((row) => row.trim() !== '');
    if (rows.length === 0) return null;

    const headers = rows[0].split('|').map((h) => h.trim());
    if (headers.length > 1 && headers[headers.length - 1] === '') {
      headers.pop();
    }
    const dataRows = rows.slice(1);

    return (
      <div className="overflow-x-auto mt-2 rounded-xl border border-sage-green/25 shadow-sm">
        <table className="w-full text-left text-14 border-collapse">
          <thead className="bg-forest-green text-off-white border-b border-sage-green/30">
            <tr>
              <th className="p-3 font-bold w-12 text-center">No</th>
              {headers.map((header, idx) => (
                <th
                  key={idx}
                  className="p-3 font-bold border-l border-off-white/15"
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-off-white divide-y divide-sage-green/20">
            {dataRows.map((row, rowIdx) => {
              const rawColumns = row.split('|').map((c) => c.trim());
              return (
                <tr
                  key={rowIdx}
                  className="hover:bg-mint-gray/70 transition-colors"
                >
                  <td className="p-3 text-center text-charcoal/70 font-medium">
                    {rowIdx + 1}
                  </td>
                  {headers.map((_, colIdx) => (
                    <td
                      key={colIdx}
                      className="p-3 text-charcoal border-l border-sage-green/20"
                    >
                      {rawColumns[colIdx] || ''}
                    </td>
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8 bg-charcoal/70 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, y: 50, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 50, scale: 0.95 }}
        className="bg-off-white w-full max-w-5xl rounded-2xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh] border border-sage-green/30"
      >
        {/* HEADER MODAL (Forest Green) */}
        <div className="bg-forest-green p-6 md:px-8 flex justify-between items-center text-off-white shrink-0">
          <div>
            <h3 className="text-20 md:text-24 font-bold text-off-white">
              {leader.jabatan}
            </h3>
            <p className="text-mint-gray text-14 mt-1 font-medium">
              Kabupaten Bekasi
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-sage-green rounded-full transition-colors text-off-white"
          >
            <X size={24} />
          </button>
        </div>

        {/* AREA KONTEN (Off White) */}
        <div className="p-6 md:p-8 overflow-y-auto bg-off-white text-charcoal">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-10">
            {/* KIRI: Foto & Identitas Dasar */}
            <div className="md:col-span-4 flex flex-col gap-5">
              <div className="bg-mint-gray p-3 rounded-2xl shadow-sm border border-sage-green/20">
                <img
                  src={leader.fotoUrl}
                  alt={leader.namaLengkap}
                  className="w-full rounded-xl object-cover aspect-[3/4] bg-off-white"
                />
              </div>

              <div className="bg-mint-gray p-5 rounded-xl shadow-sm border border-sage-green/20">
                <h4 className="text-18 font-extrabold text-forest-green mb-4 border-b border-sage-green/25 pb-3">
                  {leader.namaLengkap}
                </h4>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <MapPin
                      size={18}
                      className="text-sage-green shrink-0 mt-0.5"
                    />
                    <div>
                      <p className="text-12 text-charcoal/75 uppercase font-semibold">
                        Tempat, Tanggal Lahir
                      </p>
                      <p className="text-14 text-charcoal font-medium">
                        {leader.tempatTanggalLahir || '-'}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Calendar
                      size={18}
                      className="text-sage-green shrink-0 mt-0.5"
                    />
                    <div>
                      <p className="text-12 text-charcoal/75 uppercase font-semibold">
                        Masa Jabatan
                      </p>
                      <p className="text-14 text-charcoal font-medium">
                        {leader.periode || '-'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* KANAN: Sekat-sekat Detail (Biografi, Riwayat, Karir) */}
            <div className="md:col-span-8 flex flex-col gap-6">
              {(() => {
                const isSekda = leader.jabatan
                  ?.toLowerCase()
                  .includes('sekretaris');

                if (isSekda) {
                  return (
                    <>
                      {leader.riwayatPendidikan && (
                        <div className="bg-mint-gray p-6 rounded-2xl shadow-sm border border-sage-green/20">
                          <h4 className="text-18 font-bold text-forest-green border-b-2 border-sage-green inline-block mb-4">
                            Pendidikan Formal
                          </h4>
                          {renderList(leader.riwayatPendidikan)}
                        </div>
                      )}

                      {leader.riwayatPangkat && (
                        <div className="bg-mint-gray p-6 rounded-2xl shadow-sm border border-sage-green/20">
                          <h4 className="text-18 font-bold text-forest-green border-b-2 border-sage-green inline-block mb-4">
                            Riwayat Pangkat
                          </h4>
                          {renderTable(leader.riwayatPangkat)}
                        </div>
                      )}

                      {leader.riwayatDiklat && (
                        <div className="bg-mint-gray p-6 rounded-2xl shadow-sm border border-sage-green/20">
                          <h4 className="text-18 font-bold text-forest-green border-b-2 border-sage-green inline-block mb-4">
                            Riwayat Pendidikan dan Pelatihan
                          </h4>
                          {renderTable(leader.riwayatDiklat)}
                        </div>
                      )}
                    </>
                  );
                } else {
                  return (
                    <>
                      {leader.bio && (
                        <div className="bg-mint-gray p-6 rounded-2xl shadow-sm border border-sage-green/20">
                          <h4 className="text-18 font-bold text-forest-green border-b-2 border-sage-green inline-block mb-4">
                            Biografi Singkat
                          </h4>
                          <div className="text-charcoal leading-relaxed text-justify text-15 whitespace-pre-wrap">
                            {leader.bio}
                          </div>
                        </div>
                      )}

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {leader.riwayatPendidikan && (
                          <div className="bg-mint-gray p-6 rounded-2xl shadow-sm border border-sage-green/20 h-full">
                            <h4 className="text-18 font-bold text-forest-green border-b-2 border-sage-green inline-block mb-4">
                              Pendidikan Formal
                            </h4>
                            {renderList(leader.riwayatPendidikan)}
                          </div>
                        )}

                        {leader.karirPolitik && (
                          <div className="text-justify bg-mint-gray p-6 rounded-2xl shadow-sm border border-sage-green/20 h-full">
                            <h4 className="text-18 font-bold text-forest-green border-b-2 border-sage-green inline-block mb-4">
                              Karir Politik
                            </h4>
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