import { useState, useEffect } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import tailwindConfig from '../../../../../tailwind.config.js';
import API from '../../../../services/api';

export default function RealisasiAnggaran() {
  const [dataAnggaran, setDataAnggaran] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const [startYear, setStartYear] = useState(0);
  const [endYear, setEndYear] = useState(0);

  useEffect(() => {
    API.get('/realisasi-anggaran')
      .then((res) => {
        const data = res.data;
        if (data && data.length > 0) {
          setDataAnggaran(data);
          setStartYear(data[0].year);
          setEndYear(data[data.length - 1].year);
        }
        setIsLoading(false);
      })
      .catch((err) => {
        console.error('Gagal mengambil data Realisasi Anggaran:', err);
        setIsLoading(false);
      });
  }, []);

  const formatAngka = (angka) => {
    return Number(angka).toLocaleString('id-ID');
  };

  const filteredData = dataAnggaran.filter(
    (item) => item.year >= startYear && item.year <= endYear
  );

  const chartData = filteredData.map((item) => ({
    year: item.year,
    anggaran: Number(item.amount) / 1000000000,
  }));

  const yearOptions = dataAnggaran.map((item) => item.year);
  const twColors = tailwindConfig.theme.extend.colors;

  return (
    <>
      <div className="mt-12 md:mt-16 mb-8">
        <h2 className="text-24 md:text-34 font-bold text-forest-green border-b-2 border-sage-green pb-2 inline-block">
          Realisasi Belanja Pemerintah
        </h2>
      </div>

      <div className="bg-mint-gray rounded-2xl p-6 md:p-8 shadow-sm h-fit transition-all duration-300 border border-sage-green/20">
        <p className="text-14 md:text-16 text-charcoal leading-relaxed mb-6 max-w-4xl">
          Realisasi belanja Pemerintah Kabupaten Bekasi tiap tahun selalu meningkat sesuai dengan kebutuhan dan inflasi.
        </p>

        {isLoading ? (
          <div className="text-forest-green font-semibold text-14 md:text-16 py-10">
            Memuat data Realisasi Anggaran...
          </div>
        ) : dataAnggaran.length === 0 ? (
          <div className="bg-off-white border border-sage-green/20 rounded-xl p-8 text-center text-14 md:text-16 text-charcoal mb-8">
            Belum ada data Realisasi Anggaran yang ditambahkan.
          </div>
        ) : (
          <>
            <span className="text-14 md:text-16 font-semibold text-forest-green block mb-2">
              Rentang tahun:
            </span>
            <div className="flex flex-wrap items-center gap-3 mb-8 bg-off-white border border-sage-green/20 p-3 rounded-lg w-fit">
              <select
                value={startYear}
                onChange={(e) => setStartYear(Number(e.target.value))}
                className="bg-off-white border border-sage-green rounded-md px-3 py-1.5 text-14 md:text-16 text-charcoal outline-none focus:border-forest-green"
              >
                {yearOptions.map((year) => (
                  <option
                    key={`start-${year}`}
                    value={year}
                    disabled={year > endYear}
                  >
                    {year}
                  </option>
                ))}
              </select>
              <span className="text-forest-green font-bold text-14 md:text-16">-</span>
              <select
                value={endYear}
                onChange={(e) => setEndYear(Number(e.target.value))}
                className="bg-off-white border border-sage-green rounded-md px-3 py-1.5 text-14 md:text-16 text-charcoal outline-none focus:border-forest-green"
              >
                {yearOptions.map((year) => (
                  <option
                    key={`end-${year}`}
                    value={year}
                    disabled={year < startYear}
                  >
                    {year}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
              <div className="bg-off-white border border-sage-green/20 rounded-xl p-5 md:p-6 h-fit transition-all duration-300">
                <h3 className="text-18 md:text-20 font-bold text-forest-green mb-4">
                  Detail Anggaran
                </h3>
                <div className="flex flex-col gap-3">
                  {filteredData.length > 0 ? (
                    filteredData.map((item) => (
                      <div
                        key={item.year}
                        className="flex justify-between items-center bg-mint-gray border border-sage-green/15 px-4 py-3 rounded-md"
                      >
                        <span className="text-14 md:text-16 font-bold text-forest-green">
                          {item.year}:
                        </span>
                        <span className="text-14 md:text-16 font-medium text-charcoal">
                          {formatAngka(item.amount)}
                        </span>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-4 text-14 text-charcoal/70 italic">
                      Data tidak ditemukan.
                    </div>
                  )}
                </div>
              </div>

              <div className="bg-off-white border border-sage-green/20 rounded-xl p-5 md:p-6 h-fit">
                <h3 className="text-18 md:text-20 font-bold text-forest-green mb-4">
                  Visualisasi Perkembangan Anggaran
                </h3>
                <div className="bg-off-white rounded-lg p-4 h-[300px] w-full flex items-center justify-center border border-sage-green/20">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={chartData}
                      margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                    >
                      <CartesianGrid
                        strokeDasharray="3 3"
                        vertical={false}
                        stroke={twColors['sage-green'] || '#397A57'}
                        strokeOpacity={0.25}
                      />
                      <XAxis
                        dataKey="year"
                        tick={{
                          fontSize: 12,
                          fill: twColors['charcoal'] || '#343D38',
                        }}
                        tickLine={false}
                        axisLine={{
                          stroke: twColors['sage-green'] || '#397A57',
                        }}
                        dy={10}
                      />
                      <YAxis
                        tick={{
                          fontSize: 12,
                          fill: twColors['charcoal'] || '#343D38',
                        }}
                        tickLine={false}
                        axisLine={false}
                        dx={-10}
                      />
                      <Tooltip
                        formatter={(value) => [`${value} Miliar`, 'Anggaran']}
                      />
                      <Legend
                        wrapperStyle={{ paddingTop: '20px', fontSize: '14px' }}
                      />
                      <Line
                        type="linear"
                        dataKey="anggaran"
                        name="Anggaran"
                        stroke={twColors['forest-green'] || '#174D36'}
                        strokeWidth={2.5}
                        dot={{
                          r: 4,
                          fill: twColors['off-white'] || '#F7F8F5',
                          stroke: twColors['forest-green'] || '#174D36',
                          strokeWidth: 2,
                        }}
                        activeDot={{
                          r: 6,
                          fill: twColors['sage-green'] || '#397A57',
                          stroke: twColors['off-white'] || '#F7F8F5',
                        }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
                <p className="text-13 md:text-14 text-charcoal mt-4 font-medium">
                  Anggaran dalam jumlah "Miliar".
                </p>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
}