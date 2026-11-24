import React, { useEffect, useState, useCallback, useRef } from 'react';
import ReactFlow, {
  Background,
  Controls,
  applyNodeChanges,
  Handle,
  Position,
  ConnectionMode,
} from 'reactflow';
import 'reactflow/dist/style.css';

// --- KOMPONEN KUSTOM UNTUK KOTAK JABATAN ---
const JabatanNode = ({ data }) => (
  <div className="bg-off-white border-2 border-forest-green rounded-lg p-3 shadow-md min-w-[200px] text-center relative">
    {/* Titik penghubung transparan */}
    <Handle
      type="source"
      position={Position.Top}
      id="top"
      className="opacity-0 w-3 h-3"
    />
    <Handle
      type="source"
      position={Position.Left}
      id="left"
      className="opacity-0 w-3 h-3"
    />
    <Handle
      type="source"
      position={Position.Right}
      id="right"
      className="opacity-0 w-3 h-3"
    />
    <Handle
      type="source"
      position={Position.Bottom}
      id="bottom"
      className="opacity-0 w-3 h-3"
    />

    <div className="font-bold text-forest-green border-b border-sage-green/30 pb-2 mb-2 text-sm">
      {data.jabatan}
    </div>
    <div className="text-sm font-semibold text-charcoal">{data.nama}</div>
  </div>
);

const nodeTypes = { jabatan: JabatanNode };

export default function StrukturContent() {
  // --- STATE UNTUK ANIMASI SCROLL ---
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
      { threshold: 0.1 }
    );

    revealRefs.current.forEach((ref) => {
      observer.observe(ref);
    });

    return () => observer.disconnect();
  }, []);

  // --- STATE UNTUK REACT FLOW (STRUKTUR ORGANISASI) ---
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);
  const [defaultNodes, setDefaultNodes] = useState([]);

  useEffect(() => {
    const fetchStrukturPublic = async () => {
      try {
        const response = await fetch(
          `http://${window.location.hostname}:5000/api/struktur-nodes`
        );
        const rawData = await response.json();

        if (rawData && rawData.length > 0) {
          const fetchedNodes = rawData.map((item) => ({
            id: item.id,
            position: { x: item.posX, y: item.posY },
            data: { jabatan: item.jabatan, nama: item.nama },
            type: 'jabatan',
          }));

          const fetchedEdges = [];
          rawData.forEach((item) => {
            if (item.parentId) {
              const incomingEdges = JSON.parse(item.parentId);
              incomingEdges.forEach((edgeData) => {
                const isKoordinasi = edgeData.tipeGaris === 'koordinasi';

                fetchedEdges.push({
                  id: `e-${edgeData.source}-${item.id}-${Math.random()
                    .toString(36)
                    .substring(7)}`,
                  source: edgeData.source,
                  target: item.id,
                  sourceHandle: edgeData.sourceHandle || 'bottom',
                  targetHandle: edgeData.targetHandle || 'top',
                  type: 'smoothstep',
                  style: {
                    strokeWidth: 2,
                    stroke: isKoordinasi ? '#397A57' : '#174D36', // Sage Green (koordinasi) & Forest Green (komando)
                    strokeDasharray: isKoordinasi ? '5,5' : 'none',
                  },
                });
              });
            }
          });

          setNodes(fetchedNodes);
          setDefaultNodes(fetchedNodes);
          setEdges(fetchedEdges);
        }
      } catch (error) {
        console.error('Gagal mengambil data struktur organisasi:', error);
      }
    };

    fetchStrukturPublic();
  }, []);

  const onNodesChange = useCallback(
    (changes) => setNodes((nds) => applyNodeChanges(changes, nds)),
    []
  );

  const handleReset = () => {
    setNodes(defaultNodes);
  };

  return (
    <div className="max-w-[1400px] mx-auto px-5 md:px-[64px] mt-12 md:mt-16 flex flex-col gap-16 md:gap-24 mb-20">
      {/* --- BAGIAN 1: STRUKTUR ORGANISASI (INTERAKTIF) --- */}
      <section
        ref={addToRefs}
        className="opacity-0 translate-y-24 transition-all duration-700 ease-out w-full"
      >
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-6 gap-4">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-forest-green border-b-2 border-sage-green pb-2 inline-block mb-3">
              Struktur Organisasi
            </h2>
            <p className="text-sm md:text-base text-charcoal max-w-3xl leading-relaxed">
              Berdasarkan Undang Undang Nomor 23 Tahun 2014 Tentang Pemerintah Daerah, berikut adalah Susunan Organisasi dan Tata Kerja Pemerintah Kabupaten Bekasi.
              <br />
              <span className="text-sage-green font-medium text-xs md:text-sm italic">
                *Geser kotak untuk merapikan, scroll untuk zoom. Tekan reset untuk mengembalikan tampilan.
              </span>
            </p>
          </div>
          <button
            onClick={handleReset}
            className="px-4 py-2 text-sm bg-forest-green text-off-white font-bold rounded-lg hover:bg-sage-green transition-colors shadow-md whitespace-nowrap"
          >
            Reset Tampilan
          </button>
        </div>

        {/* Canvas React Flow (Mint Gray) */}
        <div className="relative w-full bg-mint-gray rounded-xl flex items-center justify-center h-[400px] md:h-[500px] border-2 border-sage-green/30 overflow-hidden shadow-inner">
          {nodes.length > 0 ? (
            <ReactFlow
              nodes={nodes}
              edges={edges}
              onNodesChange={onNodesChange}
              nodeTypes={nodeTypes}
              fitView
              minZoom={0.2}
              maxZoom={2}
              attributionPosition="bottom-left"
              connectionMode={ConnectionMode.Loose}
            >
              <Background color="#397A57" gap={16} />
              <Controls />
            </ReactFlow>
          ) : (
            <div className="text-forest-green font-medium animate-pulse">
              Memuat Struktur Organisasi...
            </div>
          )}
        </div>

        {/* KETERANGAN GARIS (LEGEND) */}
        <div className="mt-4 bg-mint-gray px-5 py-3.5 rounded-lg border border-sage-green/25 shadow-sm inline-flex flex-wrap items-center gap-4 md:gap-6">
          <span className="text-sm font-bold text-forest-green">
            Keterangan:
          </span>

          <div className="flex items-center gap-2">
            <div className="w-8 border-b-2 border-forest-green"></div>
            <span className="text-xs md:text-sm text-charcoal font-medium">
              Garis Komando
            </span>
          </div>

          <div className="flex items-center gap-2">
            <div className="w-8 border-b-2 border-dashed border-sage-green"></div>
            <span className="text-xs md:text-sm text-charcoal font-medium">
              Garis Koordinasi
            </span>
          </div>
        </div>
      </section>

      {/* --- BAGIAN 2: TUGAS POKOK DAN FUNGSI --- */}
      <section
        ref={addToRefs}
        className="opacity-0 translate-y-24 transition-all duration-700 ease-out w-full"
      >
        <div className="mb-10">
          <h2 className="text-2xl md:text-3xl font-bold text-forest-green border-b-2 border-sage-green pb-2 inline-block">
            Tugas Pokok dan Fungsi
          </h2>
        </div>

        <div className="flex flex-col gap-16 md:gap-20">
          {/* 1. SEKRETARIAT DAERAH (Foto Kiri, Teks Kanan) */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 items-center">
            <div className="group overflow-hidden rounded-2xl shadow-lg border border-sage-green/20 h-64 md:h-80">
              <img
                src="https://images.unsplash.com/photo-1541872703-74c5e44368f9?q=80&w=800&auto=format&fit=crop"
                alt="Sekretariat Daerah"
                className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
              />
            </div>

            <div>
              <h3 className="text-xl md:text-2xl font-bold text-forest-green mb-3">
                Sekretariat Daerah
              </h3>
              <p className="text-charcoal text-sm md:text-base mb-5 leading-relaxed">
                Sekretariat Daerah dipimpin oleh{' '}
                <strong className="text-forest-green">Sekretaris Daerah.</strong>
              </p>
              <p className="text-charcoal text-sm text-justify md:text-base mb-5 leading-relaxed">
                Sekretaris Daerah mempunyai tugas membantu kepala daerah dalam penyusunan kebijakan dan pengoordinasian administratif terhadap pelaksanaan tugas Perangkat Daerah serta pelayanan administratif.
              </p>
            </div>
          </div>

          {/* 2. SEKRETARIAT DPRD (Teks & Kotak Tugas Kiri, Foto Kanan) */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 items-stretch">
            <div className="order-2 lg:order-1">
              <h3 className="text-xl md:text-2xl font-bold text-forest-green mb-3">
                Sekretariat DPRD
              </h3>
              <p className="text-charcoal text-sm md:text-base mb-5 leading-relaxed">
                Sekretariat DPRD dipimpin oleh{' '}
                <strong className="text-forest-green">Sekretaris DPRD.</strong>
              </p>
              <p className="text-charcoal text-sm md:text-base mb-5 leading-relaxed">
                Sekretaris DPRD mempunyai tugas:
              </p>

              {/* Grid Kotak Tugas: 3 di atas, 1 memanjang penuh di bawah */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 text-center">
                {[
                  'Menyelenggarakan administrasi kesekretariatan',
                  'Menyelenggarakan administrasi keuangan',
                  'Mendukung pelaksanaan tugas dan fungsi DPRD',
                  'Menyediakan dan mengoordinasikan tenaga ahli yang diperlukan oleh DPRD dalam melaksanakan fungsinya sesuai dengan kebutuhan',
                ].map((tugas, index) => (
                  <div
                    key={index}
                    className={`group bg-mint-gray border border-sage-green/20 rounded-xl p-4 shadow-sm transition-all duration-300 ease-in-out hover:bg-sage-green hover:border-sage-green hover:shadow-md cursor-default flex items-center justify-center ${
                      index === 3 ? 'sm:col-span-3' : ''
                    }`}
                  >
                    <p className="text-xs md:text-sm font-medium text-charcoal group-hover:text-off-white transition-colors duration-300 leading-relaxed">
                      {tugas}
                    </p>
                  </div>
                ))}
              </div>

              <p className="text-charcoal text-justify text-sm md:text-base mt-5 leading-relaxed">
                Sekretaris DPRD dalam melaksanakan tugasnya secara teknis operasional bertanggung jawab kepada pimpinan DPRD dan secara administratif bertanggung jawab kepada kepala daerah melalui Sekretaris Daerah.
              </p>
            </div>

            <div className="order-1 lg:order-2 group overflow-hidden rounded-2xl shadow-lg border border-sage-green/20 h-64 md:h-80 lg:h-auto relative">
              <img
                src="https://images.unsplash.com/photo-1577493340887-b7bfff550145?q=80&w=800&auto=format&fit=crop"
                alt="Sekretariat DPRD"
                className="w-full h-full lg:absolute lg:inset-0 object-cover transition-transform duration-500 ease-out group-hover:scale-105"
              />
            </div>
          </div>

          {/* 3. INSPEKTORAT (Foto Kiri, Teks Kanan) */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 items-center">
            <div className="group overflow-hidden rounded-2xl shadow-lg border border-sage-green/20 h-64 md:h-80">
              <img
                src="https://images.unsplash.com/photo-1450101499163-c8848c66ca85?q=80&w=800&auto=format&fit=crop"
                alt="Inspektorat"
                className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
              />
            </div>

            <div>
              <h3 className="text-xl md:text-2xl font-bold text-forest-green mb-3">
                Inspektorat
              </h3>
              <p className="text-charcoal text-justify text-sm md:text-base mb-5 leading-relaxed">
                Inspektorat Daerah dipimpin oleh{' '}
                <strong className="text-forest-green">Inspektur.</strong>
              </p>
              <p className="text-charcoal text-justify text-sm md:text-base mb-5 leading-relaxed">
                Inspektorat Daerah mempunyai tugas{' '}
                <strong className="text-forest-green">
                  membantu kepala daerah membina dan mengawasi pelaksanaan Urusan Pemerintahan yang menjadi kewenangan Daerah dan Tugas Pembantuan oleh Perangkat Daerah.
                </strong>
              </p>
              <p className="text-charcoal text-justify text-sm md:text-base mb-5 leading-relaxed">
                Inspektorat Daerah dalam melaksanakan tugasnya bertanggung jawab kepada kepala daerah melalui Sekretaris Daerah.
              </p>
            </div>
          </div>

          {/* 4. DINAS DAERAH (Teks Kiri, Foto Kanan) */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 items-center">
            <div className="order-2 lg:order-1">
              <h3 className="text-xl md:text-2xl font-bold text-forest-green mb-3">
                Dinas Daerah
              </h3>
              <p className="text-charcoal text-justify text-sm md:text-base mb-5 leading-relaxed">
                Dinas dibentuk untuk melaksanakan Urusan Pemerintahan yang menjadi kewenangan Daerah. Dinas dipimpin oleh seorang{' '}
                <strong className="text-forest-green">Kepala.</strong>
              </p>
              <p className="text-charcoal text-justify text-sm md:text-base mb-5 leading-relaxed">
                Kepala Dinas mempunyai tugas{' '}
                <strong className="text-forest-green">
                  membantu kepala daerah melaksanakan Urusan Pemerintahan yang menjadi kewenangan Daerah.
                </strong>{' '}
                Kepala Dinas dalam melaksanakan tugasnya bertanggung jawab kepada kepala daerah melalui Sekretaris Daerah.
              </p>
            </div>

            <div className="order-1 lg:order-2 group overflow-hidden rounded-2xl shadow-lg border border-sage-green/20 h-64 md:h-80">
              <img
                src="https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=800&auto=format&fit=crop"
                alt="Dinas Daerah"
                className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}