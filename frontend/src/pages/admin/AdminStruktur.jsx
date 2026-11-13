import React, { useState, useEffect, useCallback } from 'react';
import ReactFlow, { 
  Background, 
  Controls, 
  applyNodeChanges, 
  applyEdgeChanges,
  addEdge,
  Handle,
  Position,
  ConnectionMode
} from 'reactflow';
import 'reactflow/dist/style.css';

// --- KOMPONEN KUSTOM KOTAK ADMIN (DENGAN TITIK PENGHUBUNG) ---
const AdminJabatanNode = ({ data }) => (
  <div className="bg-white border-2 border-blue-600 rounded-lg p-3 shadow-md min-w-[200px] text-center relative group">
    
    <Handle type="source" position={Position.Top} id="top" className="w-3 h-3 bg-blue-600" />
    <Handle type="source" position={Position.Left} id="left" className="w-3 h-3 bg-blue-600" />
    <Handle type="source" position={Position.Right} id="right" className="w-3 h-3 bg-blue-600" />
    <Handle type="source" position={Position.Bottom} id="bottom" className="w-3 h-3 bg-blue-600" />

    <div className="font-bold text-blue-800 border-b border-gray-200 pb-2 mb-2 text-sm">
      {data.jabatan}
    </div>
    <div className="text-sm font-semibold text-gray-700">
      {data.nama}
    </div>
  </div>
);

const nodeTypes = { jabatan: AdminJabatanNode };

export default function AdminStruktur() {
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);
  const [isSaving, setIsSaving] = useState(false);
  const [jenisGaris, setJenisGaris] = useState('komando');

  // Form State
  const [formData, setFormData] = useState({ jabatan: '', nama: '' });

  // 1. Ambil data saat pertama kali render
  useEffect(() => {
    fetch('http://localhost:5000/api/struktur-nodes')
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
            // Bongkar kembali daftar garis dari JSON
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
                  style: {
                    stroke: isKoordinasi ? '#f59e0b' : '#2563eb',
                    strokeWidth: 2,
                    strokeDasharray: isKoordinasi ? '5,5' : 'none'
                  }
                });
              });
            }
          } catch (e) {
            // Fallback kalau masih ada data format lama
            flowEdges.push({
              id: `e-${item.parentId}-${item.id}`,
              source: item.parentId,
              target: item.id,
              type: 'smoothstep',
              style: { stroke: '#2563eb', strokeWidth: 2 }
            });
          }
        });

        setNodes(flowNodes);
        setEdges(flowEdges);
      })
      .catch(err => console.error("Gagal load data:", err));
  }, []);

  // 2. Fungsi bawaan React Flow untuk geser dan hapus (Node & Edge)
  const onNodesChange = useCallback((changes) => setNodes((nds) => applyNodeChanges(changes, nds)), []);
  const onEdgesChange = useCallback((changes) => setEdges((eds) => applyEdgeChanges(changes, eds)), []);
  const onConnect = useCallback(
    (params) => {
      // Cek apakah jenis garis yang dipilih adalah koordinasi
      const isKoordinasi = jenisGaris === 'koordinasi';

      const newEdge = {
        ...params,
        type: 'smoothstep', // Bikin garisnya siku-siku
        style: {
          strokeWidth: 2,
          // Garis Komando = Biru, Koordinasi = Orange (biar beda dan jelas)
          stroke: isKoordinasi ? '#f59e0b' : '#2563eb', 
          // Efek putus-putus untuk Koordinasi
          strokeDasharray: isKoordinasi ? '5,5' : 'none', 
        },
      };
      setEdges((eds) => addEdge(newEdge, eds));
    },
    [jenisGaris, setEdges] // <-- Jangan lupa masukkan jenisGaris ke sini
  );

  // 3. Tambah Kotak Baru
  const handleAddNode = (e) => {
    e.preventDefault();
    if (!formData.jabatan || !formData.nama) return alert("Isi Jabatan dan Nama dulu!");

    const newNode = {
      id: `node-${Date.now()}`, // Bikin ID unik
      type: 'jabatan',
      position: { x: 50, y: 50 }, // Posisi default saat baru ditambah
      data: { jabatan: formData.jabatan, nama: formData.nama }
    };

    setNodes((nds) => [...nds, newNode]);
    setFormData({ jabatan: '', nama: '' }); // Reset form
  };

  // 4. Simpan Layout ke Backend
  const handleSaveLayout = async () => {
    setIsSaving(true);
    try {
      // Format ulang data agar sesuai dengan Prisma Schema
      const payloadNodes = nodes.map(node => {
        // Ambil SEMUA garis yang masuk ke kotak ini (pakai .filter, bukan .find)
        const incomingEdges = edges.filter(e => e.target === node.id);
        
        // Bungkus semua info garisnya jadi satu data JSON
        const edgesData = incomingEdges.map(e => ({
          source: e.source,
          sourceHandle: e.sourceHandle || 'bottom',
          targetHandle: e.targetHandle || 'top',
          tipeGaris: e.style?.strokeDasharray === '5,5' ? 'koordinasi' : 'komando'
        }));

        return {
          id: node.id,
          jabatan: node.data.jabatan,
          nama: node.data.nama,
          posX: node.position.x,
          posY: node.position.y,
          // Simpan semua garisnya dalam bentuk string JSON di parentId
          parentId: edgesData.length > 0 ? JSON.stringify(edgesData) : null,
          sourceHandle: null,
          targetHandle: null,
          tipeGaris: 'komando'
        };
      });

      const response = await fetch('http://localhost:5000/api/admin/struktur-nodes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        // Kalau pakai token admin, tambahkan: 'Authorization': `Bearer ${token}`
        body: JSON.stringify({ nodes: payloadNodes })
      });

      if (response.ok) {
        alert("Layout Struktur berhasil disimpan!");
      } else {
        alert("Gagal menyimpan layout");
      }
    } catch (error) {
      console.error(error);
      alert("Terjadi kesalahan sistem");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Admin Struktur Organisasi</h1>
          <p className="text-slate-600 mt-1">Tambah, geser, hubungkan garis, dan simpan posisi kotak.</p>
          <p className="text-sm text-red-500 font-semibold mt-1">*Klik kotak lalu tekan Backspace untuk menghapus.</p>
        </div>
        <button 
          onClick={handleSaveLayout}
          disabled={isSaving}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-bold shadow-md disabled:bg-blue-300"
        >
          {isSaving ? "Menyimpan..." : "Simpan Layout"}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* PANEL KIRI: FORM TAMBAH */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm h-fit">
          <h2 className="text-lg font-bold text-slate-800 mb-4">Tambah Jabatan</h2>
          <form onSubmit={handleAddNode} className="flex flex-col gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Nama Jabatan</label>
              <input 
                type="text" 
                className="w-full p-2 border border-slate-300 rounded-md focus:outline-blue-500"
                placeholder="Cth: Kepala Dinas"
                value={formData.jabatan}
                onChange={(e) => setFormData({...formData, jabatan: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Nama Pejabat</label>
              <input 
                type="text" 
                className="w-full p-2 border border-slate-300 rounded-md focus:outline-blue-500"
                placeholder="Cth: Dr. H. Fulan, M.Si"
                value={formData.nama}
                onChange={(e) => setFormData({...formData, nama: e.target.value})}
              />
            </div>
            <button 
              type="submit" 
              className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 rounded-md transition-colors"
            >
              + Tambah ke Canvas
            </button>

            {/* --- PILIHAN JENIS GARIS & KETERANGAN --- */}
            <div className="mt-6 border-t border-gray-200 pt-4">
              <h3 className="font-bold text-sm text-gray-800 mb-3">Jenis Garis Hubungan</h3>
              
              <div className="flex flex-col gap-3">
                <label className="flex items-center gap-2 text-sm cursor-pointer">
                  <input 
                    type="radio" 
                    name="garis" 
                    value="komando" 
                    checked={jenisGaris === 'komando'}
                    onChange={() => setJenisGaris('komando')}
                    className="w-4 h-4 text-blue-600"
                  />
                  <span>Garis Komando</span>
                </label>
                
                <label className="flex items-center gap-2 text-sm cursor-pointer">
                  <input 
                    type="radio" 
                    name="garis" 
                    value="koordinasi" 
                    checked={jenisGaris === 'koordinasi'}
                    onChange={() => setJenisGaris('koordinasi')}
                    className="w-4 h-4 text-amber-500"
                  />
                  <span>Garis Koordinasi</span>
                </label>
              </div>
              
              {/* Box Keterangan (Legend) */}
              <div className="mt-5 bg-slate-50 border border-slate-200 p-3 rounded-lg text-xs text-slate-700">
                <p className="font-bold mb-2">Keterangan:</p>
                <div className="flex items-center gap-3 mt-1">
                  <div className="w-6 h-0.5 bg-[#2563eb]"></div> 
                  <span>Komando (Instruksi langsung)</span>
                </div>
                <div className="flex items-center gap-3 mt-2">
                  <div className="w-6 border-t-2 border-dashed border-[#f59e0b]"></div> 
                  <span>Koordinasi (Setara/Konsultatif)</span>
                </div>
              </div>
            </div>
          </form>
        </div>

        {/* PANEL KANAN: CANVAS REACT FLOW */}
        <div className="lg:col-span-3 bg-[#f8f9fa] rounded-xl border-2 border-slate-300 h-[600px] overflow-hidden shadow-inner">
          <ReactFlow 
            nodes={nodes} 
            edges={edges} 
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            nodeTypes={nodeTypes}
            fitView
            connectionMode={ConnectionMode.Loose}
          >
            <Background color="#ccc" gap={16} />
            <Controls />
          </ReactFlow>
        </div>
      </div>
    </div>
  );
}