// Sesuaikan import path gambar peta-nya tergantung letak folder ini
import petaBekasi from '../../../../assets/peta-kabbekasi.png'; 

function BatasLabel({ arah, nama, className = '' }) {
  return (
    <div className={`rounded-xl bg-bekasi-blue shadow-sm px-4 py-3 text-20 leading-snug text-bekasi-ink ${className}`}>
      <span className="block">{arah}:</span>
      <span className="block">{nama}</span>
    </div>
  );
}

function BatasPointer({ item }) {
  const isLeft = item.side === 'left';
  return (
    <div className={`absolute flex w-[calc(50%_-_126px)] -translate-y-1/2 items-center gap-1 ${isLeft ? 'left-0' : 'right-0 flex-row-reverse'}`} style={{ top: item.top }}>
      <BatasLabel arah={item.arah} nama={item.nama} className="w-[190px] shrink-0" />
      <span className="h-2.5 w-2.5 shrink-0 rounded-full bg-bekasi-ink" />
      {item.fork ? (
        <div className="relative h-16 flex-1">
          <svg className="h-16 flex-1 text-bekasi-green" aria-hidden="true">
            <line x1="0" y1="50%" x2="37.5%" y2="2%" stroke="currentColor" strokeWidth="2" />
            <line x1="0" y1="50%" x2="45%" y2="80%" stroke="currentColor" strokeWidth="2" />
          </svg>
          <span className="absolute right-[61%] top-[2%] h-2.5 w-2.5 -translate-y-1/2 rounded-full bg-bekasi-green" />
          <span className="absolute right-[54%] top-[80%] h-2.5 w-2.5 -translate-y-1/2 rounded-full bg-bekasi-green" />
        </div>
      ) : (
        <>
          <div className="h-0.5 flex-1 bg-bekasi-green" />
          <line x1="0" y1="50%" x2="37.5%" y2="2%" stroke="currentColor" strokeWidth="2" />
          <span className="h-2.5 w-2.5 shrink-0 rounded-full bg-bekasi-green" />
        </>
      )}
    </div>
  );
}

export default function BatasWilayah() {
  const batasWilayah = [
    { id: 'utara', arah: 'Utara', nama: 'Laut Jawa', side: 'left', top: 50 },
    { id: 'timur', arah: 'Timur', nama: 'Kabupaten Karawang', side: 'right', top: 90 },
    { id: 'barat', arah: 'Barat', nama: 'Kota Jakarta Utara dan Kota Bekasi', side: 'left', top: 240, fork: true },
    { id: 'selatan', arah: 'Selatan', nama: 'Kabupaten Bogor', side: 'left', top: 370 },
  ];

  return (
    <>
      <p className="mt-10 mb-6 text-20 md:text-24 text-gov-navy">Batas Administrasi Wilayah</p>
      <div className="relative mx-auto w-full max-w-[900px] lg:h-[460px]">
        <div className="mx-auto h-[420px] w-full max-w-[300px] box-rounded bg-bekasi-gold p-4 shadow-sm lg:absolute lg:left-1/2 lg:top-0 lg:h-[460px] lg:-translate-x-1/2">
          <div className="h-full w-full overflow-hidden border-2 border-bekasi-green bg-white">
            <img src={petaBekasi} alt="Peta batas administrasi Kabupaten Bekasi" className="h-full w-full object-cover" />
          </div>
        </div>
        <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:hidden">
          {batasWilayah.map((item) => (
            <BatasLabel key={item.id} arah={item.arah} nama={item.nama} />
          ))}
        </div>
        <div className="hidden lg:block">
          {batasWilayah.map((item) => (
            <BatasPointer key={item.id} item={item} />
          ))}
        </div>
      </div>
    </>
  );
}