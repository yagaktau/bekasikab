import React, { useState } from 'react';
import { visiData } from '../../../../data/visimisiData';

export default function Visi() {
  const [activeCards, setActiveCards] = useState([]);

  const handleToggleCard = (id) => {
    setActiveCards((prev) =>
      prev.includes(id)
        ? prev.filter((cardId) => cardId !== id)
        : [...prev, id]
    );
  };

  return (
    <>
      <div className="mt-12 md:mt-16 mb-8">
        <h2 className="text-32 md:text-48 font-bold text-gov-navy border-b-2 border-bekasi-green pb-2 inline-block">
          Visi Pemerintahan Kabupaten Bekasi
        </h2>
      </div>

      <div className="bg-[#D8C7C6]/40 border border-[#D8C7C6] p-6 md:p-10 rounded-xl mb-8 shadow-sm">
        <p className="text-base md:text-lg leading-relaxed text-center font-medium text-slate-900">
          {visiData.ringkasan}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 items-start">
        {visiData.items.map((item) => {
          const isOpen = activeCards.includes(item.id);

          return (
            <div
              key={item.id}
              className="group flex flex-col bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300"
            >
              <div className="h-48 md:h-56 w-full overflow-hidden bg-slate-100 relative">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors duration-300" />
              </div>

              <div
                onClick={() => handleToggleCard(item.id)}
                className={`cursor-pointer py-4 px-5 text-center transition-colors duration-300 ${
                  isOpen
                    ? 'bg-[#0B5D34] text-white'
                    : 'bg-[#A48887] text-white group-hover:bg-[#0B5D34]'
                }`}
              >
                <h3 className="text-lg md:text-xl font-bold tracking-wide flex items-center justify-center gap-2">
                  {item.title}
                  <svg
                    className={`w-5 h-5 transition-transform duration-300 ${
                      isOpen ? 'rotate-180' : 'rotate-0'
                    }`}
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </h3>
              </div>

              <div
                className={`bg-slate-50 transition-all duration-500 ease-in-out overflow-hidden border-t ${
                  isOpen ? 'max-h-[500px] opacity-100 border-[#0B5D34]/20' : 'max-h-0 opacity-0 border-transparent'
                }`}
              >
                <div className="p-5">
                  <p className="text-sm md:text-base text-slate-700 leading-relaxed text-center font-normal">
                    {item.info}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}