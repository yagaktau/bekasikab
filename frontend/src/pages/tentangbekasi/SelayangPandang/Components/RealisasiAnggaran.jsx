import { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Legend, Tooltip, ResponsiveContainer } from 'recharts';
import tailwindConfig from '../../../../../tailwind.config.js'; // Sesuaikan import tailwind-nya
import API from '../../../../services/api'; // Sesuaikan path ini dengan API client kamu

export default function RealisasiAnggaran() {
  const [dataAnggaran, setDataAnggaran] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const [startYear, setStartYear] = useState(0);
  const [endYear, setEndYear] = useState(0);

  useEffect(() => {
    API.get('/realisasi-anggaran') // Sesuaikan dengan endpoint backend
      .then((res) => {
        const data = res.data;
        if (data && data.length > 0) {
          setDataAnggaran(data);
          // Set default filter ke rentang tahun full
          setStartYear(data[0].year);
          setEndYear(data[data.length - 1].year);
        }
        setIsLoading(false);
      })
      .catch((err) => {
        console.error("Gagal mengambil data Realisasi Anggaran:", err);
        setIsLoading(false);
      });
  }, []);

  // Helper untuk format angka ke bentuk string dengan titik (contoh: 315.000.000.000)
  const formatAngka = (angka) => {
    return Number(angka).toLocaleString('id-ID');
  };

  const filteredData = dataAnggaran.filter((item) => item.year >= startYear && item.year <= endYear);
  
  // Konversi otomatis ke nilai Miliar untuk chart (dibagi 1.000.000.000)
  const chartData = filteredData.map((item) => ({
    year: item.year,
    anggaran: Number(item.amount) / 1000000000, 
  }));

  const yearOptions = dataAnggaran.map((item) => item.year);
  const twColors = tailwindConfig.theme.extend.colors;

  return (
    <>
      <div className="mt-12 md:mt-16 mb-8">
        <h2 className="text-32 md:text-48 font-bold text-gov-navy border-b-2 border-bekasi-green pb-2 inline-block">
          Realisasi Belanja Pemerintah
        </h2>
      </div>

      <div className="bg-bekasi-mint/40 rounded-2xl p-6 md:p-8 shadow-sm h-fit transition-all duration-300 border border-bekasi-green/20">
        <p className="text-16 md:text-20 text-gov-navy leading-relaxed mb-6 max-w-4xl">
          Realisasi belanja Pemerintah Kabupaten Bekasi tiap tahun selalu meningkat sesuai dengan kebutuhan dan inflasi.
        </p>

        {isLoading ? (
          <div className="text-gov-navy font-semibold py-10">Memuat data Realisasi Anggaran...</div>
        ) : dataAnggaran.length === 0 ? (
          <div className="bg-white/60 border border-gray-200 rounded-xl p-8 text-center text-gray-500 mb-8">
            Belum ada data Realisasi Anggaran yang ditambahkan.
          </div>
        ) : (
          <>
            <span className="text-16 font-semibold text-gov-navy">Rentang tahun:</span>
            <div className="flex flex-wrap items-center gap-3 mb-8 bg-white/60 p-3 rounded-lg w-fit">            
              <select value={startYear} onChange={(e) => setStartYear(Number(e.target.value))} className="bg-white border border-bekasi-green rounded-md px-3 py-1.5 text-gov-navy outline-none">
                {yearOptions.map((year) => <option key={`start-${year}`} value={year} disabled={year > endYear}>{year}</option>)}
              </select>
              <span className="text-gov-navy font-bold">-</span>
              <select value={endYear} onChange={(e) => setEndYear(Number(e.target.value))} className="bg-white border border-bekasi-green rounded-md px-3 py-1.5 text-gov-navy outline-none">
                {yearOptions.map((year) => <option key={`end-${year}`} value={year} disabled={year < startYear}>{year}</option>)}
              </select>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
              <div className="bg-black/5 rounded-xl p-5 md:p-6 h-fit transition-all duration-300">
                <h3 className="text-16 md:text-20 font-bold text-gov-navy mb-4">Detail Anggaran</h3>
                <div className="flex flex-col gap-3">
                  {filteredData.length > 0 ? (
                    filteredData.map((item) => (
                      <div key={item.year} className="flex justify-between items-center bg-black/10 px-4 py-3 rounded-md">
                        <span className="text-16 font-bold text-gov-navy">{item.year}:</span>
                        <span className="text-16 text-gov-navy">{formatAngka(item.amount)}</span>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-4 text-gov-navy/60 italic">Data tidak ditemukan.</div>
                  )}
                </div>
              </div>

              <div className="bg-black/5 rounded-xl p-5 md:p-6 h-fit">
                <h3 className="text-16 md:text-20 font-bold text-gov-navy mb-4">Visualisasi Perkembangan Anggaran</h3>
                <div className="bg-white/70 rounded-lg p-4 h-[300px] w-full flex items-center justify-center border border-slate-200">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={twColors['card-border'] || '#E2E8F0'} />
                      <XAxis dataKey="year" tick={{ fontSize: 12, fill: twColors['gov-navy']?.muted || '#64748b' }} tickLine={false} axisLine={{ stroke: twColors['card-border'] || '#cbd5e1' }} dy={10} />
                      <YAxis tick={{ fontSize: 12, fill: twColors['gov-navy']?.muted || '#64748b' }} tickLine={false} axisLine={false} dx={-10} />
                      <Tooltip formatter={(value) => [`${value} Miliar`, 'Anggaran']} />
                      <Legend wrapperStyle={{ paddingTop: '20px', fontSize: '14px' }} />
                      <Line type="linear" dataKey="anggaran" name="Anggaran" stroke={twColors['bekasi-green']?.DEFAULT || '#0B5D34'} strokeWidth={2} dot={{ r: 4, fill: '#ffffff', stroke: twColors['bekasi-green']?.DEFAULT || '#0B5D34', strokeWidth: 2 }} activeDot={{ r: 6, fill: twColors['bekasi-green']?.DEFAULT || '#0B5D34', stroke: '#ffffff' }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
                <p className="text-14 text-gov-navy mt-4 font-medium">Anggaran dalam jumlah "Miliar".</p>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
}