import { useEffect, useState, Component } from 'react';
import API from '../../../services/api';
import heroBg from '../../../assets/contoh-bg.jpg';

import InformasiPemerintahan from './Components/InformasiPemerintahan';
import WilayahAdministrasi from './Components/WilayahAdministrasi';
import BatasWilayah from './Components/BatasWilayah';
import DataPNS from './Components/DataPNS';
import RealisasiAnggaran from './Components/RealisasiAnggaran';

class ErrorBoundary extends Component {
  state = { error: null };
  static getDerivedStateFromError(error) {
    return { error };
  }
  render() {
    if (this.state.error) {
      return (
        <pre className="m-6 whitespace-pre-wrap rounded bg-red-100 p-4 text-14 text-red-800">
          {String(this.state.error.stack || this.state.error)}
        </pre>
      );
    }
    return this.props.children;
  }
}

export default function SelayangPandang() {
  const [data, setData] = useState(null);

  useEffect(() => {
    API.get('/pages/selayang-pandang')
      .then((res) => {
        setData(res.data);
      })
      .catch((err) => {
        console.error('Gagal mengambil data selayang pandang:', err);
      });
  }, []);

  return (
    <ErrorBoundary>
      <div className="w-full bg-off-white text-charcoal pb-16 md:pb-24">
        {/* ==================== 1. HERO BANNER ==================== */}
        <div
          className="w-full relative bg-charcoal bg-cover bg-center py-16 md:py-24 flex items-center overflow-hidden"
          style={{ backgroundImage: `url(${heroBg})` }}
        >
          <div className="absolute inset-0 bg-charcoal/70"></div>
          <div className="relative z-10 w-full max-w-[1728px] mx-auto px-5 md:px-[64px]">
            <h1 className="text-34 md:text-64 font-extrabold text-off-white tracking-tight drop-shadow-md">
              Selayang Pandang
            </h1>
          </div>
        </div>

        {/* ==================== 2. KONTEN UTAMA ==================== */}
        <div className="w-full max-w-[1728px] mx-auto px-5 md:px-[64px] py-2">
          <InformasiPemerintahan />
          <WilayahAdministrasi />
          <BatasWilayah />
          <DataPNS />
          <RealisasiAnggaran />
        </div>
      </div>
    </ErrorBoundary>
  );
}