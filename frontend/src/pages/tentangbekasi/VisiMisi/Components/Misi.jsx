import React from 'react';
import { misiItems } from '../../../../data/visimisiData';

export default function Misi() {
  return (
    <>
      <div className="mt-12 md:mt-16 mb-8">
        <h2 className="text-32 md:text-48 font-bold text-forest-green border-b-2 border-sage-green pb-2 inline-block">
          Misi Pemerintahan Kabupaten Bekasi
        </h2>
      </div>

      <div className="flex flex-col gap-6 md:gap-8 items-center w-full">
        {/* Baris 1: Misi 1 & 2 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 w-full">
          {misiItems.slice(0, 2).map((item) => (
            <div
              key={item.id}
              className="group bg-mint-gray rounded-xl p-8 flex flex-col items-center justify-center text-center cursor-default hover:bg-sage-green hover:shadow-xl border border-sage-green/20 hover:border-sage-green transition-all duration-300"
            >
              <div className="w-16 h-16 rounded-full bg-forest-green text-off-white flex items-center justify-center mb-5 transition-transform duration-500 group-hover:scale-125 group-hover:bg-off-white group-hover:text-forest-green shadow-md">
                {item.icon}
              </div>
              <p className="text-base md:text-lg font-medium text-charcoal group-hover:text-off-white transition-colors duration-300 leading-relaxed">
                {item.text}
              </p>
            </div>
          ))}
        </div>

        {/* Baris 2: Misi 3 (Tengah) */}
        <div className="w-full md:w-1/2">
          <div className="group bg-mint-gray rounded-xl p-8 flex flex-col items-center justify-center text-center cursor-default hover:bg-sage-green hover:shadow-xl border border-sage-green/20 hover:border-sage-green transition-all duration-300">
            <div className="w-16 h-16 rounded-full bg-forest-green text-off-white flex items-center justify-center mb-5 transition-transform duration-500 group-hover:scale-125 group-hover:bg-off-white group-hover:text-forest-green shadow-md">
              {misiItems[2].icon}
            </div>
            <p className="text-base md:text-lg font-medium text-charcoal group-hover:text-off-white transition-colors duration-300 leading-relaxed">
              {misiItems[2].text}
            </p>
          </div>
        </div>

        {/* Baris 3: Misi 4 & 5 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 w-full">
          {misiItems.slice(3, 5).map((item) => (
            <div
              key={item.id}
              className="group bg-mint-gray rounded-xl p-8 flex flex-col items-center justify-center text-center cursor-default hover:bg-sage-green hover:shadow-xl border border-sage-green/20 hover:border-sage-green transition-all duration-300"
            >
              <div className="w-16 h-16 rounded-full bg-forest-green text-off-white flex items-center justify-center mb-5 transition-transform duration-500 group-hover:scale-125 group-hover:bg-off-white group-hover:text-forest-green shadow-md">
                {item.icon}
              </div>
              <p className="text-base md:text-lg font-medium text-charcoal group-hover:text-off-white transition-colors duration-300 leading-relaxed">
                {item.text}
              </p>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}