import { useState, useEffect, useRef } from 'react';
import { Calendar, MapPin, ChevronLeft, ChevronRight } from 'lucide-react';

// Helper: Ubah teks dipisah "Enter" menjadi Bullet List
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

// Helper: Ubah teks delimiter "|" menjadi Tabel
const renderTable = (textData) => {
  if (!textData) return null;
  const rows = textData.split('\n').filter((row) => row.trim() !== '');
  if (rows.length === 0) return null;

  const headers = rows[0].split('|').map((h) => h.trim());
  const dataRows = rows.slice(1);

  return (
    <div className="overflow-x-auto mt-2 rounded-xl border border-sage-green/25 shadow-sm">
      <table className="w-full text-left text-13 border-collapse">
        <thead className="bg-forest-green text-off-white border-b border-sage-green/30">
          <tr>
            <th className="p-3 font-bold w-10 text-center">No</th>
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
            const columns = row.split('|').map((c) => c.trim());
            return (
              <tr
                key={rowIdx}
                className="hover:bg-mint-gray/70 transition-colors"
              >
                <td className="p-3 text-center text-charcoal/70 font-medium">
                  {rowIdx + 1}
                </td>
                {columns.map((col, colIdx) => (
                  <td
                    key={colIdx}
                    className="p-3 text-charcoal border-l border-sage-green/20"
                  >
                    {col}
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

export default function DesktopPimpinanList({ dataPimpinan = [] }) {
  const [expandedCardIndex, setExpandedCardIndex] = useState(null);
  const [activeLeaderIndex, setActiveLeaderIndex] = useState(0);
  const [displayedLeaderIndex, setDisplayedLeaderIndex] = useState(0);
  const [isFading, setIsFading] = useState(false);

  // phase: 'idle' | 'dropping' | 'expanded' | 'closing'
  const [phase, setPhase] = useState('idle');

  const timerRef = useRef(null);
  const fadeTimerRef = useRef(null);
  const detailScrollRef = useRef(null);

  const leaders = dataPimpinan.slice(0, 3);

  const clearTimer = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  };

  const clearFadeTimer = () => {
    if (fadeTimerRef.current) {
      clearTimeout(fadeTimerRef.current);
      fadeTimerRef.current = null;
    }
  };

  const handleSelectCard = (idx) => {
    if (phase !== 'idle') return;
    clearTimer();
    clearFadeTimer();
    setExpandedCardIndex(idx);
    setActiveLeaderIndex(idx);
    setDisplayedLeaderIndex(idx);
    setIsFading(false);
    setPhase('dropping');

    timerRef.current = setTimeout(() => {
      setPhase('expanded');
    }, 300);
  };

  const handleClose = (e) => {
    if (e) e.stopPropagation();
    clearTimer();
    clearFadeTimer();
    setPhase('closing');

    timerRef.current = setTimeout(() => {
      setPhase('idle');
      setExpandedCardIndex(null);
      setIsFading(false);
    }, 300);
  };

  const switchLeader = (nextIdx) => {
    clearFadeTimer();
    setActiveLeaderIndex(nextIdx);
    setIsFading(true);

    fadeTimerRef.current = setTimeout(() => {
      setDisplayedLeaderIndex(nextIdx);
      if (detailScrollRef.current) {
        detailScrollRef.current.scrollTop = 0;
      }
      setIsFading(false);
    }, 180);
  };

  const handlePrev = (e) => {
    e.stopPropagation();
    const nextIdx = (activeLeaderIndex - 1 + leaders.length) % leaders.length;
    switchLeader(nextIdx);
  };

  const handleNext = (e) => {
    e.stopPropagation();
    const nextIdx = (activeLeaderIndex + 1) % leaders.length;
    switchLeader(nextIdx);
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && phase === 'expanded') {
        handleClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [phase]);

  useEffect(() => {
    return () => {
      clearTimer();
      clearFadeTimer();
    };
  }, []);

  if (leaders.length === 0) {
    return (
      <div className="w-full max-w-[1728px] mx-auto px-[64px] py-24 text-center">
        <div className="bg-mint-gray border border-sage-green/25 rounded-2xl p-12 max-w-xl mx-auto shadow-sm">
          <div className="w-16 h-16 bg-forest-green/10 text-forest-green rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
            !
          </div>
          <h3 className="text-2xl font-bold text-forest-green mb-2">
            Belum Ada Data Pimpinan
          </h3>
          <p className="text-charcoal text-sm">
            Data pimpinan akan ditampilkan di sini setelah ditambahkan melalui
            Dashboard Admin.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-[1728px] mx-auto px-[64px] py-16 overflow-hidden">
      <div className="flex justify-center items-start w-full">
        {leaders.map((leader, idx) => {
          const isSelected = expandedCardIndex === idx;
          const isExpanded = phase === 'expanded' && isSelected;
          const isCollapsedOther = phase === 'expanded' && !isSelected;
          const isDroppingOther =
            (phase === 'dropping' || phase === 'closing') && !isSelected;

          const detailLeader = isExpanded
            ? leaders[displayedLeaderIndex] || leader
            : leader;
          const isSekda = detailLeader?.jabatan
            ?.toLowerCase()
            .includes('sekretaris');

          let cardStateClass =
            'w-[calc(33.333%-24px)] max-w-[460px] mx-3 border border-sage-green/30 hover:border-sage-green hover:-translate-y-2 opacity-100 translate-y-0 cursor-pointer';

          if (isExpanded) {
            cardStateClass =
              'w-full max-w-full mx-0 border border-sage-green/35 opacity-100 translate-y-0';
          } else if (isCollapsedOther) {
            cardStateClass =
              'w-0 max-w-0 mx-0 border-0 opacity-0 translate-y-[180px] pointer-events-none';
          } else if (isDroppingOther) {
            cardStateClass =
              'w-[calc(33.333%-24px)] max-w-[460px] mx-3 border border-sage-green/20 opacity-0 translate-y-[180px] pointer-events-none';
          } else if (
            (phase === 'dropping' || phase === 'closing') &&
            isSelected
          ) {
            cardStateClass =
              'w-[calc(33.333%-24px)] max-w-[460px] mx-3 border border-sage-green opacity-100 translate-y-0';
          }

          return (
            <div
              key={leader.id}
              onClick={() => phase === 'idle' && handleSelectCard(idx)}
              className={`group relative h-[600px] rounded-2xl overflow-hidden bg-mint-gray shadow-xl flex flex-row shrink-0 transition-all motion-reduce:transition-none ${cardStateClass}`}
              style={{
                transitionDuration: isExpanded ? '600ms' : '300ms',
                transitionTimingFunction: isExpanded
                  ? 'cubic-bezier(0.22, 1, 0.36, 1)'
                  : 'cubic-bezier(0.4, 0, 0.2, 1)',
              }}
            >
              {/* KOLOM KIRI: Kotak Foto (Slide Horizontal saat Expanded) */}
              <div
                className={`relative h-full shrink-0 bg-charcoal overflow-hidden transition-[width] motion-reduce:transition-none ${
                  isExpanded
                    ? 'w-[420px] border-r border-sage-green/25'
                    : 'w-full'
                }`}
                style={{
                  transitionDuration: isExpanded ? '600ms' : '300ms',
                  transitionTimingFunction: isExpanded
                    ? 'cubic-bezier(0.22, 1, 0.36, 1)'
                    : 'cubic-bezier(0.4, 0, 0.2, 1)',
                }}
              >
                {isExpanded ? (
                  <>
                    {/* Slider Track Foto */}
                    <div
                      className="flex w-full h-full transition-transform duration-500 motion-reduce:transition-none"
                      style={{
                        transform: `translateX(-${activeLeaderIndex * 100}%)`,
                        transitionTimingFunction:
                          'cubic-bezier(0.22, 1, 0.36, 1)',
                      }}
                    >
                      {leaders.map((slideLeader) => (
                        <div
                          key={slideLeader.id}
                          className="relative w-full h-full shrink-0"
                        >
                          <img
                            src={
                              slideLeader.fotoUrl ||
                              'https://via.placeholder.com/600x800?text=Foto+Pimpinan'
                            }
                            alt={slideLeader.namaLengkap}
                            className="w-full h-full object-cover object-top"
                            onError={(e) => {
                              e.target.src =
                                'https://via.placeholder.com/600x800?text=Foto+Pimpinan';
                            }}
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-charcoal/95 via-charcoal/40 to-transparent" />

                          {/* Info Jabatan & Nama ikut bergeser bersama foto */}
                          <div className="absolute bottom-[78px] inset-x-0 px-7 text-left">
                            <div className="w-12 h-1 bg-sage-green mb-3 rounded-full" />
                            <p className="text-13 font-bold text-mint-gray uppercase tracking-widest mb-1">
                              {slideLeader.jabatan}
                            </p>
                            <h2 className="text-24 font-extrabold text-off-white leading-tight drop-shadow">
                              {slideLeader.namaLengkap}
                            </h2>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Baris Kontrol Statis di Bawah Foto */}
                    <div className="absolute bottom-0 inset-x-0 px-7 pb-6 pt-3 z-10">
                      <div className="flex items-center justify-between pt-3 border-t border-off-white/20">
                        <button
                          type="button"
                          onClick={handleClose}
                          className="inline-flex items-center gap-1.5 text-13 font-semibold text-mint-gray hover:text-off-white transition-colors cursor-pointer"
                        >
                          ← Lihat Lebih Sedikit
                        </button>

                        {leaders.length > 1 && (
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={handlePrev}
                              title="Pimpinan Sebelumnya"
                              className="w-9 h-9 rounded-full bg-forest-green/85 hover:bg-sage-green text-off-white border border-sage-green/60 flex items-center justify-center transition-all cursor-pointer"
                            >
                              <ChevronLeft size={18} />
                            </button>
                            <button
                              type="button"
                              onClick={handleNext}
                              title="Pimpinan Berikutnya"
                              className="w-9 h-9 rounded-full bg-forest-green/85 hover:bg-sage-green text-off-white border border-sage-green/60 flex items-center justify-center transition-all cursor-pointer"
                            >
                              <ChevronRight size={18} />
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </>
                ) : (
                  /* Tampilan Normal (Saat 3 Kartu / Transisi Tutup) */
                  <>
                    <img
                      src={
                        leader.fotoUrl ||
                        'https://via.placeholder.com/600x800?text=Foto+Pimpinan'
                      }
                      alt={leader.namaLengkap}
                      className={`w-full h-full object-cover object-top transition-transform duration-700 ease-out ${
                        phase === 'idle' ? 'group-hover:scale-105' : ''
                      }`}
                      onError={(e) => {
                        e.target.src =
                          'https://via.placeholder.com/600x800?text=Foto+Pimpinan';
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-charcoal/95 via-charcoal/40 to-transparent" />

                    <div className="absolute bottom-0 inset-x-0 p-7 text-left">
                      <div
                        className={`h-1 bg-sage-green mb-3 rounded-full transition-all duration-300 ${
                          phase === 'idle' ? 'w-12 group-hover:w-20' : 'w-12'
                        }`}
                      />
                      <p className="text-13 font-bold text-mint-gray uppercase tracking-widest mb-1">
                        {leader.jabatan}
                      </p>
                      <h2 className="text-24 font-extrabold text-off-white leading-tight drop-shadow mb-5">
                        {leader.namaLengkap}
                      </h2>

                      <span className="inline-flex items-center gap-2 text-13 font-semibold text-mint-gray group-hover:text-off-white transition-colors">
                        Lihat Detail Profil →
                      </span>
                    </div>
                  </>
                )}
              </div>

              {/* KOLOM KANAN: Panel Detail Profil (Mint Gray) */}
              <div
                ref={isExpanded ? detailScrollRef : null}
                aria-hidden={!isExpanded}
                className={`h-full overflow-y-auto bg-mint-gray text-charcoal transition-all motion-reduce:transition-none [scrollbar-width:thin] [scrollbar-color:#397A57_transparent] ${
                  isExpanded
                    ? 'flex-1 opacity-100 p-8'
                    : 'w-0 opacity-0 p-0 overflow-hidden pointer-events-none'
                }`}
                style={{
                  transitionDuration: isExpanded ? '600ms' : '250ms',
                  transitionTimingFunction: isExpanded
                    ? 'cubic-bezier(0.22, 1, 0.36, 1)'
                    : 'cubic-bezier(0.4, 0, 0.2, 1)',
                }}
              >
                <div
                  className={`min-w-[540px] space-y-6 transition-opacity duration-200 ease-in-out ${
                    isFading ? 'opacity-0' : 'opacity-100'
                  }`}
                >
                  {/* HEADER METADATA */}
                  <div className="border-b border-sage-green/25 pb-5">
                    <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-13 text-charcoal">
                      <div className="flex items-center gap-2">
                        <Calendar
                          size={15}
                          className="text-sage-green shrink-0"
                        />
                        <span>
                          <span className="text-charcoal/75">Masa Jabatan:</span>{' '}
                          <strong className="text-forest-green font-semibold">
                            {detailLeader.periode || '-'}
                          </strong>
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin
                          size={15}
                          className="text-sage-green shrink-0"
                        />
                        <span>
                          <span className="text-charcoal/75">
                            Tempat, Tanggal Lahir:
                          </span>{' '}
                          <strong className="text-forest-green font-semibold">
                            {detailLeader.tempatTanggalLahir || '-'}
                          </strong>
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* KONTEN UTAMA: Khusus Sekda vs Bupati/Wakil Bupati */}
                  {isSekda ? (
                    <div className="space-y-6">
                      {detailLeader.riwayatPendidikan && (
                        <div className="bg-off-white border border-sage-green/20 rounded-xl p-5">
                          <h4 className="text-16 font-bold text-forest-green flex items-center gap-2.5 mb-3">
                            <span className="w-1 h-5 bg-sage-green rounded-full" />
                            Pendidikan Formal
                          </h4>
                          {renderList(detailLeader.riwayatPendidikan)}
                        </div>
                      )}

                      {detailLeader.riwayatPangkat && (
                        <div className="bg-off-white border border-sage-green/20 rounded-xl p-5">
                          <h4 className="text-16 font-bold text-forest-green flex items-center gap-2.5 mb-3">
                            <span className="w-1 h-5 bg-sage-green rounded-full" />
                            Riwayat Pangkat
                          </h4>
                          {renderTable(detailLeader.riwayatPangkat)}
                        </div>
                      )}

                      {detailLeader.riwayatDiklat && (
                        <div className="bg-off-white border border-sage-green/20 rounded-xl p-5">
                          <h4 className="text-16 font-bold text-forest-green flex items-center gap-2.5 mb-3">
                            <span className="w-1 h-5 bg-sage-green rounded-full" />
                            Riwayat Pendidikan dan Pelatihan
                          </h4>
                          {renderTable(detailLeader.riwayatDiklat)}
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {/* Biografi Singkat */}
                      {detailLeader.bio && (
                        <div className="bg-off-white border border-sage-green/20 rounded-xl p-5">
                          <h4 className="text-16 font-bold text-forest-green flex items-center gap-2.5 mb-3">
                            <span className="w-1 h-5 bg-sage-green rounded-full" />
                            Biografi Singkat
                          </h4>
                          <div className="text-charcoal leading-relaxed text-justify text-14 whitespace-pre-wrap">
                            {detailLeader.bio}
                          </div>
                        </div>
                      )}

                      {/* Grid 2 Kolom: Pendidikan Formal & Karir Politik */}
                      <div className="grid grid-cols-2 gap-6">
                        {detailLeader.riwayatPendidikan && (
                          <div className="bg-off-white border border-sage-green/20 rounded-xl p-5">
                            <h4 className="text-16 font-bold text-forest-green flex items-center gap-2.5 mb-3">
                              <span className="w-1 h-5 bg-sage-green rounded-full" />
                              Pendidikan Formal
                            </h4>
                            {renderList(detailLeader.riwayatPendidikan)}
                          </div>
                        )}

                        {detailLeader.karirPolitik && (
                          <div className="text-justify bg-off-white border border-sage-green/20 rounded-xl p-5">
                            <h4 className="text-16 font-bold text-forest-green flex items-center gap-2.5 mb-3">
                              <span className="w-1 h-5 bg-sage-green rounded-full" />
                              Karir Politik
                            </h4>
                            {renderList(detailLeader.karirPolitik)}
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}