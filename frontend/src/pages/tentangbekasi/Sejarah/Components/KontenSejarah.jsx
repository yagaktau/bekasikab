import React, { useEffect, useRef } from 'react';
import foto1 from '../../../../assets/fotosejarah-1.jpg';
import foto2 from '../../../../assets/fotosejarah-2.jpg';
import foto3 from '../../../../assets/fotosejarah-3.jpg';
import foto4 from '../../../../assets/fotosejarah-4.jpg';
import foto5 from '../../../../assets/fotosejarah-5.jpg';
import foto6 from '../../../../assets/fotosejarah-6.jpg';
import { tuntutanData } from '../../../../data/sejarahData';

export default function SejarahContent() {
  const revealRefs = useRef([]);
  revealRefs.current = [];

  const addToRefs = (el) => {
    if (el && !revealRefs.current.includes(el)) {
      revealRefs.current.push(el);
    }
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('opacity-100', 'translate-y-0');
            entry.target.classList.remove('opacity-0', 'translate-y-24');
          }
        });
      },
      { threshold: 0.15 } 
    );

    revealRefs.current.forEach((ref) => {
      observer.observe(ref);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <>
      <div className="mt-12 md:mt-16 mb-8">
        <h2 className="text-32 md:text-48 font-bold text-gov-navy border-b-2 border-bekasi-green pb-2 inline-block">
          Sejarah Kabupaten Bekasi
        </h2>
      </div>

      <div className="flex flex-col gap-12 md:gap-16">
        
        {/* BARIS 1: Teks Kiri - Gambar Kanan */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div ref={addToRefs} className="opacity-0 translate-y-24 transition-all duration-700 ease-out text-slate-800 text-justify text-sm md:text-base leading-relaxed order-2 md:order-1">
            <p>
              Kabupaten Bekasi terbentuk pada tanggal 15 Agustus 1950. Sebelumnya, Bekasi masuk dalam Kabupaten Jatinegara. Dalam catatan sejarah, nama Bekasi memiliki arti dan nilai sejarah yang khas. Menurut <strong>Poerbatjaraka</strong>, seorang ahli bahasa Sansekerta dan Jawa Kuno, menerjemahkan asal mula kata Bekasi secara filosofis, berasal dari kata Chandrabhaga. <em>Chandra</em> berarti bulan dalam bahasa Jawa Kuno, sama dengan kata <em>Sasi</em>, dan <em>Bhaga</em> berarti bagian. Jadi, secara etimologis, kata Chandrabhaga berarti bagian dari bulan.
            </p>
          </div>
          <div ref={addToRefs} className="opacity-0 translate-y-24 transition-all duration-700 ease-out order-1 md:order-2 h-64 md:h-80 overflow-hidden rounded-xl shadow-md">
            <img 
              src={foto1} 
              alt="Sejarah 1" 
              className="w-full h-full object-cover hover:scale-110 transition-transform duration-700 ease-in-out"
            />
          </div>
        </div>

        {/* BARIS 2: Gambar Kiri - Teks Kanan */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div ref={addToRefs} className="opacity-0 translate-y-24 transition-all duration-700 ease-out h-64 md:h-80 overflow-hidden rounded-xl shadow-md">
            <img 
              src={foto2} 
              alt="Sejarah 2" 
              className="w-full h-full object-cover hover:scale-110 transition-transform duration-700 ease-in-out"
            />
          </div>
          <div ref={addToRefs} className="opacity-0 translate-y-24 transition-all duration-700 ease-out text-slate-800 text-justify text-sm md:text-base leading-relaxed">
            <p>
              Kata Chandrabhaga berubah menjadi Bhagasasi yang pengucapannya sering disingkat menjadi Bhagasi. Kata Bhagasi ini dalam pelafalan bahasa Belanda seringkali ditulis <em>Bacassie</em>, kemudian berubah menjadi Bekasi hingga kini. Bekasi dikenal sebagai Bumi Patriot, yakni sebuah daerah yang dijaga para pembela tanah air. Mereka berjuang sampai titik darah penghabisan untuk mempertahankan negeri tercinta dan merebut kemerdekaan dari tangan penjajah.
            </p>
          </div>
        </div>

        {/* BARIS 3: Teks Kiri - Gambar Kanan */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div ref={addToRefs} className="opacity-0 translate-y-24 transition-all duration-700 ease-out text-slate-800 text-justify text-sm md:text-base leading-relaxed order-2 md:order-1">
            <p>
              Sejarah terbentuknya Kabupaten Bekasi dimulai dengan dibentuknya Panitia Amanat Rakyat Bekasi yang dipelopori oleh <strong>R. Supardi</strong>, <strong>M. Hasibuan</strong>, <strong>KH. Noer Alie</strong>, <strong>Namin</strong>, <strong>Aminudin</strong>, dan <strong>Marzuki Urmaini</strong> yang menentang keberadaan RIS - Pasundan dan menuntut berdirinya kembali Negara Kesatuan RI. Selanjutnya, diadakan Rapat Raksasa di Alun-alun Bekasi yang dihadiri sekitar 40.000 orang rakyat Bekasi pada tanggal 17 Februari 1950.
            </p>
          </div>
          <div ref={addToRefs} className="opacity-0 translate-y-24 transition-all duration-700 ease-out order-1 md:order-2 h-64 md:h-80 overflow-hidden rounded-xl shadow-md">
            <img 
              src={foto3} 
              alt="Sejarah 3" 
              className="w-full h-full object-cover hover:scale-110 transition-transform duration-700 ease-in-out"
            />
          </div>
        </div>
      </div>

      {/* ================= TUNTUTAN RAKYAT BEKASI ================= */}
      <div className="mt-16 mb-16">
        <h3 ref={addToRefs} className="opacity-0 translate-y-24 transition-all duration-700 ease-out text-xl md:text-2xl font-bold text-center text-slate-900 mb-8">
          Tuntutan Rakyat Bekasi
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {tuntutanData.map((tuntutan, index) => (
            <div 
              key={index}
              ref={addToRefs}
              className="group opacity-0 translate-y-24 transition-all duration-700 ease-out bg-[#F3EFEF] border border-red-900/20 rounded-xl p-5 md:p-6 flex items-center justify-center cursor-default hover:bg-[#0B5D34] hover:border-[#0B5D34] hover:shadow-lg"
            >
              <p className="text-sm text-center text-slate-800 font-medium group-hover:text-white transition-colors duration-300">
                {tuntutan}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-12 md:gap-16">
        {/* BARIS 4: Gambar Kiri - Teks Kanan */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div ref={addToRefs} className="opacity-0 translate-y-24 transition-all duration-700 ease-out h-64 md:h-80 overflow-hidden rounded-xl shadow-md">
            <img 
              src={foto4} 
              alt="Sejarah 4" 
              className="w-full h-full object-cover hover:scale-110 transition-transform duration-700 ease-in-out"
            />
          </div>
          <div ref={addToRefs} className="opacity-0 translate-y-24 transition-all duration-700 ease-out text-slate-800 text-justify text-sm md:text-base leading-relaxed">
            <p>
              Upaya para pemimpin Panitia Amanat Rakyat Bekasi untuk memperoleh dukungan dari berbagai pihak terus dilakukan, di antaranya mendekati para pemimpin Masjumi, tokoh militer <strong>Mayor Lukas Kustaryo</strong> dan <strong>Moh. Moefreini Mukmin</strong> di Jakarta. Pengajuan usul dilakukan tiga kali antara bulan Februari sampai dengan bulan Juni 1950 hingga akhirnya setelah dibicarakan dengan DPR RIS, dan <strong>Mohammad Hatta</strong> menyetujui penggantian nama "Kabupaten Jatinegara" menjadi Kabupaten Bekasi.
            </p>
          </div>
        </div>

        {/* BARIS 5: Teks Kiri - Gambar Kanan */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div ref={addToRefs} className="opacity-0 translate-y-24 transition-all duration-700 ease-out text-slate-800 text-justify text-sm md:text-base leading-relaxed order-2 md:order-1">
            <p>
              Persetujuan pembentukan Kabupaten Bekasi semakin kuat setelah dikeluarkannya Undang-undang No. 14 Tahun 1950. Kabupaten Bekasi secara resmi dibentuk dan ditetapkan tanggal 15 Agustus 1950 sebagai Hari Jadi Kabupaten Bekasi. Selanjutnya pada tanggal 2 April 1960, Pusat Pemda Bekasi semula dipusatkan di Jatinegara (sekarang Markas Kodim 0505 Jayakarta, Jakarta) dipindahkan ke gedung baru Mustika Pura Kantor Pemda Bekasi yang terletak di Bekasi Kaum Jl. Ir. H. Juanda. Kemudian pada tahun 1982 saat Bupati Bekasi dijabat <strong>H. Abdul Fatah</strong>, pusat perkantoran Pemda Kabupaten Bekasi kembali dipindah ke Jalan A Yani No. 1 Bekasi.
            </p>
          </div>
          <div ref={addToRefs} className="opacity-0 translate-y-24 transition-all duration-700 ease-out order-1 md:order-2 h-64 md:h-80 overflow-hidden rounded-xl shadow-md">
            <img 
              src={foto5} 
              alt="Sejarah 5" 
              className="w-full h-full object-cover hover:scale-110 transition-transform duration-700 ease-in-out"
            />
          </div>
        </div>

        {/* BARIS 6: Gambar Kiri - Teks Kanan */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div ref={addToRefs} className="opacity-0 translate-y-24 transition-all duration-700 ease-out h-64 md:h-80 overflow-hidden rounded-xl shadow-md">
            <img 
              src={foto6}
              alt="Sejarah 6" 
              className="w-full h-full object-cover hover:scale-110 transition-transform duration-700 ease-in-out"
            />
          </div>
          <div ref={addToRefs} className="opacity-0 translate-y-24 transition-all duration-700 ease-out text-slate-800 text-justify text-sm md:text-base leading-relaxed">
            <p>
              Kabupaten Bekasi sendiri terdiri dari empat kewedanan, 13 kecamatan, dan 95 desa. Seiring berjalannya waktu, Bekasi mengalami perkembangan yang cukup pesat. Sehingga Kecamatan Bekasi menuntut dimekarkannya Kabupaten Bekasi menjadi Kota Administratif Bekasi yang terdiri atas empat kecamatan yaitu: Kecamatan Bekasi Timur, Bekasi Selatan, Bekasi Barat, Bekasi Utara, yang seluruhnya meliputi 18 kelurahan dan delapan desa. Ini semua berdasarkan Peraturan Pemerintah Nomor 48 Tahun 1981. Sementara peresmian Kota administratif sendiri dilakukan oleh Menteri Dalam Negeri pada tanggal 20 April 1982.
            </p>
          </div>
        </div>
      </div>

      {/* PARAGRAF PENUTUP */}
      <div ref={addToRefs} className="mt-16 md:mt-20 opacity-0 translate-y-24 transition-all duration-700 ease-out max-w-4xl mx-auto">
        <p className="text-center text-sm md:text-base text-slate-700 font-medium">
          Perkembangan Bekasi yang semakin pesat membuat wilayah ini harus dimekarkan kembali menjadi dua wilayah, yaitu Kota Bekasi dan Kabupaten Bekasi melalui Undang-undang Nomor 9 Tahun 1996.
        </p>
      </div>
    </>
  );
}