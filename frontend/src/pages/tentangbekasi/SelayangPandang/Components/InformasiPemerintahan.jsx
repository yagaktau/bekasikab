import { useState, useRef, useEffect } from 'react';

function CollapsePanel({ isOpen, children }) {
  const contentRef = useRef(null);
  const [height, setHeight] = useState(0);

  useEffect(() => {
    const el = contentRef.current;
    if (!el) return;
    const update = () => setHeight(isOpen ? el.scrollHeight : 0);
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, [isOpen, children]);

  return (
    <div
      aria-hidden={!isOpen}
      className="overflow-hidden bg-bekasi-card transition-[height] motion-reduce:transition-none"
      style={{
        height,
        transitionDuration: isOpen ? '600ms' : '300ms',
        transitionTimingFunction: isOpen ? 'cubic-bezier(0.34, 1.3, 0.64, 1)' : 'cubic-bezier(0.4, 0, 0.2, 1)',
      }}
    >
      <div ref={contentRef} className="border-t border-bekasi-ink/20 p-4 md:p-6 text-14 md:text-20 text-justify text-bekasi-ink whitespace-pre-line">
        {children}
      </div>
    </div>
  );
}

function ExpandableCard({ title, buttonLabel, isOpen, onToggle, children }) {
  return (
    <div className="flex flex-col md:grid md:grid-cols-12 w-full shrink-0 shadow-sm rounded-[20px] md:rounded-none overflow-hidden md:overflow-visible bg-bekasi-gold-light md:bg-transparent">
      
      {/* KIRI: Ditambahkan md:rounded-l-[20px] untuk menimpa lengkungan di desktop */}
      <div className="md:col-span-10 bg-bekasi-gold-light md:box-rounded-left md:rounded-l-[20px] flex flex-col order-1">
        <div className="min-h-[80px] md:min-h-[110px] p-4 md:p-6 flex items-center">
          <span className="text-16 md:text-32 font-bold text-bekasi-ink leading-snug w-[85%] md:w-full">{title}</span>
        </div>
        <div className="hidden md:block">
          <CollapsePanel isOpen={isOpen}>{children}</CollapsePanel>
        </div>
      </div>
      
      <div className="order-2 md:hidden w-full bg-bekasi-gold-light">
        <CollapsePanel isOpen={isOpen}>{children}</CollapsePanel>
      </div>
      
      {/* KANAN (TOMBOL): Ditambahkan md:rounded-r-[20px] agar serasi dengan kiri */}
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={isOpen}
        className="order-3 md:col-span-2 bg-bekasi-gold text-bekasi-ink hover:bg-bekasi-gold-hover hover:text-white transition-colors duration-300 flex items-center justify-center py-2.5 px-4 md:p-3 text-center text-14 md:text-20 font-bold leading-tight md:box-rounded-right md:rounded-r-[20px] w-full border-t border-bekasi-ink/10 md:border-t-0"
      >
        {isOpen ? 'Tutup' : buttonLabel}
      </button>
    </div>
  );
}

export default function InformasiPemerintahan() {
  const [openInfoId, setOpenInfoId] = useState(null);

  const daftarInformasi = [
    { id: 1, title: 'Dewan Perwakilan Rakyat Daerah', isi: 'Anggota Dewan Perwakilan Rakyat Daerah (DPRD) dipilih melalui pemilihan umum (pemilu) dan dilantik dalam masa jabatan lima tahun.' },
    { id: 2, title: 'Pegawai Negeri Sipil', isi: 'Pegawai Negeri Sipil (PNS) adalah setiap warga Republik Indonesia yang telah memenuhi syarat yang ditentukan, diangkat oleh pejabat yang berwenang dan diserahi tugas dalam jabatan negeri, atau diserahi tugas negara lainnya, dan digaji berdasarkan peraturan perundang-undangan yang berlaku.\n\n PNS terdiri dari PNS pusat dan PNS daerah.' },
    { id: 3, title: 'Desa', isi: 'Desa adalah kesatuan masyarakat hukum yang memiliki batas wilayah yang berwenang untuk mengatur dan mengurus urusan pemerintahan...' },
    { id: 4, title: 'Kelurahan', isi: 'Kelurahan adalah suatu wilayah yang dipimpin oleh seorang Lurah sebagai perangkat daerah kabupaten dan/atau daerah kota di bawah kecamatan...' },
  ];

  return (
    <>
      <div className="mt-12 md:mt-16 mb-8">
        <h2 className="text-32 md:text-48 font-bold text-gov-navy border-b-2 border-bekasi-green pb-2 inline-block">
          Informasi Pemerintahan
        </h2>
      </div>
      <div className="flex flex-col gap-2 md:gap-[20px]">
        {daftarInformasi.map((item) => (
          <ExpandableCard
            key={item.id}
            title={item.title}
            buttonLabel="Baca Selengkapnya"
            isOpen={openInfoId === item.id}
            onToggle={() => setOpenInfoId(openInfoId === item.id ? null : item.id)}
          >
            {item.isi}
          </ExpandableCard>
        ))}
      </div>
    </>
  );
}