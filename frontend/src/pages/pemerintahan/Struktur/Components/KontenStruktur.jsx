import React, { useEffect, useRef } from 'react';
import { dprdTasks } from '../../../../data/strukturData';

export default function StrukturContent() {
  const revealRefs = useRef([]);

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
    <div className="max-w-[1400px] mx-auto px-5 md:px-[64px] mt-12 md:mt-16 flex flex-col gap-16 md:gap-24">
      
      {/* ================= SECTION: STRUKTUR ORGANISASI ================= */}
      <section>
        <h2 ref={addToRefs} className="opacity-0 translate-y-24 transition-all duration-700 ease-out text-24 md:text-32 font-bold text-slate-900 mb-6">
          Struktur Organisasi
        </h2>
        <p ref={addToRefs} className="opacity-0 translate-y-24 transition-all duration-700 ease-out text-14 md:text-16 text-slate-800 mb-10 leading-relaxed text-justify">
          Berdasarkan Undang Undang Nomor 23 Tahun 2014 Tentang Pemerintah Daerah Berikut adalah Susunan Organisasi dan Tata Kerja Kerja Pemerintah Kabupaten Bekasi
        </p>
        
        <div 
          ref={addToRefs} 
          className="opacity-0 translate-y-24 transition-all duration-700 ease-out w-full bg-[#EADFDE] rounded-xl p-4 md:p-8 flex items-center justify-center min-h-[300px] md:min-h-[500px] border-2 border-dashed border-[#A38A88]"
        >
          <p className="text-slate-500 font-semibold text-center">
            ( Tempat Gambar Struktur Organisasi )
          </p>
        </div>
      </section>

      {/* ================= SECTION: TUGAS POKOK DAN FUNGSI ================= */}
      <section>
        <h2 ref={addToRefs} className="opacity-0 translate-y-24 transition-all duration-700 ease-out text-24 md:text-32 font-bold text-slate-900 mb-10">
          Tugas Pokok dan Fungsi
        </h2>

        <div className="flex flex-col gap-12">
          
          {/* --- SUBSECTION: SEKRETARIAT DAERAH --- */}
          <div className="flex flex-col gap-4">
            <h3 ref={addToRefs} className="opacity-0 translate-y-24 transition-all duration-700 ease-out text-20 md:text-24 font-bold text-slate-900">
              Sekretariat Daerah
            </h3>
            <p ref={addToRefs} className="opacity-0 translate-y-24 transition-all duration-700 ease-out text-14 md:text-16 text-slate-800 leading-relaxed text-justify">
              Sekretariat Daerah dipimpin oleh <strong>Sekretaris Daerah.</strong>
            </p>
            <p ref={addToRefs} className="opacity-0 translate-y-24 transition-all duration-700 ease-out text-14 md:text-16 text-slate-800 leading-relaxed text-justify">
              Sekretaris Daerah mempunyai tugas membantu kepala daerah dalam penyusunan kebijakan dan pengoordinasian administratif terhadap pelaksanaan tugas Perangkat Daerah serta pelayanan administratif.
            </p>
          </div>

          {/* --- SUBSECTION: SEKRETARIAT DPRD --- */}
          <div className="flex flex-col gap-4">
            <h3 ref={addToRefs} className="opacity-0 translate-y-24 transition-all duration-700 ease-out text-20 md:text-24 font-bold text-slate-900">
              Sekretariat DPRD
            </h3>
            <p ref={addToRefs} className="opacity-0 translate-y-24 transition-all duration-700 ease-out text-14 md:text-16 text-slate-800 leading-relaxed text-justify">
              Sekretariat DPRD dipimpin oleh <strong>Sekretaris DPRD.</strong>
            </p>
            <p ref={addToRefs} className="opacity-0 translate-y-24 transition-all duration-700 ease-out text-14 md:text-16 text-slate-800 leading-relaxed text-justify mb-2">
              Sekretaris DPRD mempunyai tugas:
            </p>

            {/* GRID KOTAK TUGAS DPRD */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-8">
              {dprdTasks.map((task, index) => {
                const isLastItem = index === 3;
                return (
                  <div
                    key={index}
                    ref={addToRefs}
                    className={`opacity-0 translate-y-24 transition-all duration-700 ease-out group bg-[#F3EFEF] border border-[#A38A88] rounded-xl p-5 md:p-6 flex items-center justify-center cursor-default hover:bg-[#0B5D34] hover:border-[#0B5D34] hover:shadow-lg ${
                      isLastItem ? 'md:col-span-3' : 'md:col-span-1'
                    }`}
                  >
                    <p className="text-14 md:text-16 text-center text-slate-800 font-medium group-hover:text-white transition-colors duration-300">
                      {task}
                    </p>
                  </div>
                );
              })}
            </div>

            {/* BARIS BAWAH: FOTO DAN TEKS */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-10 items-center">
              <div 
                ref={addToRefs} 
                className="opacity-0 translate-y-24 transition-all duration-700 ease-out md:col-span-4 lg:col-span-3 h-[250px] md:h-[300px] overflow-hidden rounded-xl shadow-md bg-gray-200"
              >
                <img 
                  src="https://images.unsplash.com/photo-1575517111478-7f6afd0973db?auto=format&fit=crop&w=800&q=80" 
                  alt="Sekretaris DPRD" 
                  className="w-full h-full object-cover hover:scale-110 transition-transform duration-700 ease-in-out"
                />
              </div>
              <div 
                ref={addToRefs} 
                className="opacity-0 translate-y-24 transition-all duration-700 ease-out md:col-span-8 lg:col-span-9"
              >
                <p className="text-14 md:text-16 text-slate-800 leading-relaxed text-justify">
                  Sekretaris DPRD dalam melaksanakan tugasnya secara teknis operasional bertanggung jawab kepada pimpinan DPRD dan secara administratif bertanggung jawab kepada kepala daerah melalui Sekretaris Daerah.
                </p>
              </div>
            </div>
          </div>

          {/* --- SUBSECTION: INSPEKTORAT DAERAH --- */}
          <div className="mt-8 md:mt-12">
            <h3 ref={addToRefs} className="opacity-0 translate-y-24 transition-all duration-700 ease-out text-20 md:text-24 font-bold text-slate-900 mb-4">
              Inspektorat Daerah
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-10 items-start">
              <div className="md:col-span-8 lg:col-span-9 flex flex-col gap-4">
                <p ref={addToRefs} className="opacity-0 translate-y-24 transition-all duration-700 ease-out text-14 md:text-16 text-slate-800 leading-relaxed text-justify">
                  Inspektorat Daerah dipimpin oleh <strong>Inspektur</strong>.
                </p>
                <p ref={addToRefs} className="opacity-0 translate-y-24 transition-all duration-700 ease-out text-14 md:text-16 text-slate-800 leading-relaxed text-justify">
                  Inspektorat Daerah mempunyai tugas <strong>membantu kepala daerah membina dan mengawasi pelaksanaan Urusan Pemerintahan yang menjadi kewenangan Daerah dan Tugas Pembantuan oleh Perangkat Daerah</strong>.
                </p>
                <p ref={addToRefs} className="opacity-0 translate-y-24 transition-all duration-700 ease-out text-14 md:text-16 text-slate-800 leading-relaxed text-justify">
                  Inspektorat Daerah dalam melaksanakan tugasnya bertanggung jawab kepada kepala daerah melalui Sekretaris Daerah.
                </p>
              </div>
              <div 
                ref={addToRefs} 
                className="opacity-0 translate-y-24 transition-all duration-700 ease-out md:col-span-4 lg:col-span-3 h-[250px] md:h-[300px] overflow-hidden rounded-xl shadow-md bg-gray-200"
              >
                <img 
                  src="https://images.unsplash.com/photo-1555529902-5261145633bf?auto=format&fit=crop&w=800&q=80" 
                  alt="Inspektur Daerah" 
                  className="w-full h-full object-cover hover:scale-110 transition-transform duration-700 ease-in-out"
                />
              </div>
            </div>
          </div>

          {/* --- SUBSECTION: DINAS DAERAH --- */}
          <div className="flex flex-col gap-4 mt-8 md:mt-12">
            <h3 ref={addToRefs} className="opacity-0 translate-y-24 transition-all duration-700 ease-out text-20 md:text-24 font-bold text-slate-900">
              Dinas Daerah
            </h3>
            <p ref={addToRefs} className="opacity-0 translate-y-24 transition-all duration-700 ease-out text-14 md:text-16 text-slate-800 leading-relaxed text-justify">
              Dinas dibentuk untuk melaksanakan Urusan Pemerintahan yang menjadi kewenangan Daerah. Dinas dipimpin oleh <strong>seorang Kepala</strong>.
            </p>
            <p ref={addToRefs} className="opacity-0 translate-y-24 transition-all duration-700 ease-out text-14 md:text-16 text-slate-800 leading-relaxed text-justify">
              Kepala Dinas mempunyai tugas <strong>membantu kepala daerah melaksanakan Urusan Pemerintahan yang menjadi kewenangan Daerah</strong>. Kepala Dinas dalam melaksanakan tugasnya bertanggung jawab kepada kepala daerah melalui Sekretaris Daerah.
            </p>
          </div>

        </div>
      </section>
      
    </div>
  );
}