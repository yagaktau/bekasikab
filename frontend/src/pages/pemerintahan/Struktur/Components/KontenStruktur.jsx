import React, { useEffect, useState, useCallback, useRef } from 'react';
import ReactFlow, { 
  Background, 
  Controls, 
  applyNodeChanges,
  Handle,
  Position,
  ConnectionMode
} from 'reactflow';
import 'reactflow/dist/style.css';
import { ChevronRight } from 'lucide-react';

// --- KOMPONEN KUSTOM UNTUK KOTAK JABATAN ---
const JabatanNode = ({ data }) => (
  <div className="bg-white border-2 border-[#0B5D34] rounded-lg p-3 md:p-4 shadow-lg min-w-[180px] md:min-w-[220px] text-center relative">
    
    {/* Titik penghubung transparan agar garis bisa nyambung */}
    <Handle type="target" position={Position.Top} id="top" className="opacity-0 w-1 h-1" />
    <Handle type="target" position={Position.Left} id="left" className="opacity-0 w-1 h-1" />
    <Handle type="source" position={Position.Bottom} id="bottom" className="opacity-0 w-1 h-1" />
    <Handle type="source" position={Position.Right} id="right" className="opacity-0 w-1 h-1" />

    <div className="font-bold text-[#0B5D34] border-b border-gray-200 pb-2 mb-2 text-sm md:text-base">
      {data.jabatan}
    </div>
    <div className="text-xs md:text-sm font-semibold text-gray-700">
      {data.nama}
    </div>
  </div>
);

// Dideklarasikan di luar komponen utama agar tidak re-render terus-menerus
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
    // Mengambil data posisi kotak dari database
    fetch('http://localhost:5000/api/struktur-nodes') // Sesuaikan dengan PORT backend
      .then(res => res.json())
      .then(data => {
        if (!data || data.length === 0) return;

        const flowNodes = data.map(item => ({
          id: item.id,
          type: 'jabatan',
          position: { x: item.posX, y: item.posY },
          data: { jabatan: item.jabatan, nama: item.nama }
        }));
        
        const flowEdges = [];
        data.forEach(item => {
          if (!item.parentId) return;
          try {
            const parsedEdges = JSON.parse(item.parentId);
            if (Array.isArray(parsedEdges)) {
              parsedEdges.forEach((edge, idx) => {
                const isKoordinasi = edge.tipeGaris === 'koordinasi';
                flowEdges.push({
                  id: `e-${edge.source}-${item.id}-${idx}`,
                  source: edge.source,
                  target: item.id,
                  sourceHandle: edge.sourceHandle,
                  targetHandle: edge.targetHandle,
                  type: 'smoothstep',
                  animated: true,
                  style: {
                    stroke: isKoordinasi ? '#f59e0b' : '#0B5D34',
                    strokeWidth: 2,
                    strokeDasharray: isKoordinasi ? '5,5' : 'none'
                  }
                });
              });
            }
          } catch (e) {
            flowEdges.push({
              id: `e-${item.parentId}-${item.id}`,
              source: item.parentId,
              target: item.id,
              type: 'smoothstep',
              animated: true,
              style: { stroke: '#0B5D34', strokeWidth: 2 }
            });
          }
        });

        setNodes(flowNodes);
        setEdges(flowEdges);
        setDefaultNodes(flowNodes); 
      })
      .catch(err => console.error("Gagal mengambil data struktur:", err));
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
      <section ref={addToRefs} className="opacity-0 translate-y-24 transition-all duration-700 ease-out w-full">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-6 gap-4">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-2">Struktur Organisasi</h2>
            <p className="text-sm md:text-base text-slate-800 max-w-3xl">
              Berdasarkan Undang Undang Nomor 23 Tahun 2014 Tentang Pemerintah Daerah, berikut adalah Susunan Organisasi dan Tata Kerja Pemerintah Kabupaten Bekasi.
              <br />
              <span className="text-[#0B5D34] font-medium text-xs md:text-sm italic">
                *Geser kotak untuk merapikan, scroll untuk zoom. Tekan reset untuk mengembalikan tampilan.
              </span>
            </p>
          </div>
          <button 
            onClick={handleReset}
            className="px-4 py-2 text-sm bg-[#FACC15] text-[#0B5D34] font-bold rounded-lg hover:bg-yellow-500 transition-colors shadow-md whitespace-nowrap"
          >
            Reset Tampilan
          </button>
        </div>
        
        {/* Canvas React Flow */}
        <div className="w-full bg-[#f8f9fa] rounded-xl flex items-center justify-center h-[400px] md:h-[500px] border-2 border-slate-200 overflow-hidden shadow-inner">
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
            <Background color="#ccc" gap={16} />
            <Controls />
          </ReactFlow>
        </div>
      </section>

      {/* --- BAGIAN 2: TUGAS POKOK DAN FUNGSI --- */}
      <section ref={addToRefs} className="opacity-0 translate-y-24 transition-all duration-700 ease-out w-full">
        <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-8">Tugas Pokok dan Fungsi</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Card 1: Sekretariat Daerah */}
          <div className="bg-white rounded-xl shadow-md border border-slate-100 overflow-hidden hover:shadow-lg transition-shadow">
            <div className="h-48 bg-slate-200 overflow-hidden">
              <img src="https://images.unsplash.com/photo-1541872703-74c5e44368f9?q=80&w=800&auto=format&fit=crop" alt="Sekretariat Daerah" className="w-full h-full object-cover" />
            </div>
            <div className="p-6">
              <h3 className="text-xl font-bold text-[#0B5D34] mb-3">Sekretariat Daerah</h3>
              <p className="text-slate-600 text-sm mb-4 line-clamp-3">
                Sekretariat Daerah merupakan unsur staf Pemerintah Daerah yang dipimpin oleh Sekretaris Daerah. Memiliki tugas membantu Bupati dalam penyusunan kebijakan dan pengoordinasian administratif.
              </p>
              <button className="flex items-center text-sm font-semibold text-[#FACC15] hover:text-yellow-600 transition-colors">
                Baca Selengkapnya <ChevronRight size={16} className="ml-1" />
              </button>
            </div>
          </div>

          {/* Card 2: Sekretariat DPRD */}
          <div className="bg-white rounded-xl shadow-md border border-slate-100 overflow-hidden hover:shadow-lg transition-shadow">
            <div className="h-48 bg-slate-200 overflow-hidden">
              <img src="https://images.unsplash.com/photo-1577493340887-b7bfff550145?q=80&w=800&auto=format&fit=crop" alt="Sekretariat DPRD" className="w-full h-full object-cover" />
            </div>
            <div className="p-6">
              <h3 className="text-xl font-bold text-[#0B5D34] mb-3">Sekretariat DPRD</h3>
              <p className="text-slate-600 text-sm mb-4 line-clamp-3">
                Sekretariat DPRD merupakan unsur pelayanan administrasi dan pemberian dukungan operasional kepada DPRD. Dipimpin oleh Sekretaris DPRD.
              </p>
              <button className="flex items-center text-sm font-semibold text-[#FACC15] hover:text-yellow-600 transition-colors">
                Baca Selengkapnya <ChevronRight size={16} className="ml-1" />
              </button>
            </div>
          </div>

          {/* Card 3: Inspektorat Daerah */}
          <div className="bg-white rounded-xl shadow-md border border-slate-100 overflow-hidden hover:shadow-lg transition-shadow">
            <div className="h-48 bg-slate-200 overflow-hidden">
              <img src="https://images.unsplash.com/photo-1450101499163-c8848c66ca85?q=80&w=800&auto=format&fit=crop" alt="Inspektorat Daerah" className="w-full h-full object-cover" />
            </div>
            <div className="p-6">
              <h3 className="text-xl font-bold text-[#0B5D34] mb-3">Inspektorat Daerah</h3>
              <p className="text-slate-600 text-sm mb-4 line-clamp-3">
                Inspektorat Daerah merupakan unsur pengawas penyelenggaraan Pemerintahan Daerah. Dipimpin oleh Inspektur yang bertanggung jawab langsung kepada Bupati.
              </p>
              <button className="flex items-center text-sm font-semibold text-[#FACC15] hover:text-yellow-600 transition-colors">
                Baca Selengkapnya <ChevronRight size={16} className="ml-1" />
              </button>
            </div>
          </div>

          {/* Card 4: Dinas Daerah */}
          <div className="bg-white rounded-xl shadow-md border border-slate-100 overflow-hidden hover:shadow-lg transition-shadow">
            <div className="h-48 bg-slate-200 overflow-hidden">
              <img src="https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=800&auto=format&fit=crop" alt="Dinas Daerah" className="w-full h-full object-cover" />
            </div>
            <div className="p-6">
              <h3 className="text-xl font-bold text-[#0B5D34] mb-3">Dinas Daerah</h3>
              <p className="text-slate-600 text-sm mb-4 line-clamp-3">
                Dinas Daerah merupakan unsur pelaksana urusan pemerintahan yang menjadi kewenangan daerah. Dipimpin oleh Kepala Dinas.
              </p>
              <button className="flex items-center text-sm font-semibold text-[#FACC15] hover:text-yellow-600 transition-colors">
                Baca Selengkapnya <ChevronRight size={16} className="ml-1" />
              </button>
            </div>
          </div>

        </div>
      </section>

    </div>
  );
}