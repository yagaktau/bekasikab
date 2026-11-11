import { motion } from 'framer-motion';
import { X } from 'lucide-react';

export default function ProfileModal({ leader, onClose }) {
  if (!leader) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <motion.div 
        initial={{ opacity: 0, y: 50, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 50, scale: 0.95 }}
        className="bg-white w-full max-w-4xl rounded-2xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]"
      >
        <div className="bg-gov-navy p-6 flex justify-between items-center text-white shrink-0">
          <div>
            <h3 className="text-24 font-bold">{leader.namaLengkap}</h3>
            <p className="text-white/80">{leader.jabatan} • Periode {leader.periode}</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/20 rounded-full transition-colors">
            <X size={24} />
          </button>
        </div>

        <div className="p-6 md:p-8 overflow-y-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-1">
              <img 
              src={leader.fotoUrl} 
              alt={leader.namaLengkap}
              className="w-full rounded-xl object-cover shadow-md bg-gray-200 aspect-[3/4]" />
            </div>
            
            <div className="md:col-span-2 flex flex-col gap-6">
              {leader.bio ? (
                <div>
                  <h4 className="text-18 font-bold text-gov-navy border-b-2 border-bekasi-gold inline-block mb-3">Biografi</h4>
                  <div 
                    className="text-gray-700 leading-relaxed text-justify"
                    dangerouslySetInnerHTML={{ __html: leader.bio }} 
                  />
                </div>
              ) : (
                <div className="text-gray-500 italic flex h-full items-center justify-center">
                  Belum ada biografi yang ditambahkan.
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                 {leader.extraInfo.map((info, idx) => (
                   <div key={idx} className="bg-gray-50 p-4 rounded-xl border border-gray-100 shadow-sm">
                     <h4 className="text-16 font-bold text-gov-navy mb-3">{info.title}</h4>
                     <ul className="list-disc list-outside pl-5 text-14 text-gray-700 space-y-1.5">
                       {info.items.map((item, i) => (
                         <li key={i}>{item}</li>
                       ))}
                     </ul>
                   </div>
                 ))}
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}