import API from '../../../../services/api';
import { useEffect, useMemo, useRef, useState } from 'react';

function useInView() {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.4, rootMargin: '0px 0px -20% 0px' }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);
  return [ref, inView];
}

const CELL = 1.1;
function SlotDigit({ target, active, index, delay }) {
  const strip = useMemo(() => {
    const randoms = Array.from({ length: 10 + index * 4 }, () =>
      Math.floor(Math.random() * 10)
    );
    return [...randoms, target];
  }, [target, index]);

  return (
    <span
      className="inline-block overflow-hidden align-bottom"
      style={{ height: `${CELL}em` }}
    >
      <span
        className="flex flex-col transition-transform motion-reduce:transition-none"
        style={{
          transform: active
            ? `translateY(-${(strip.length - 1) * CELL}em)`
            : 'translateY(0)',
          transitionDuration: `${1400 + index * 250}ms`,
          transitionDelay: `${delay}ms`,
          transitionTimingFunction: 'cubic-bezier(0.22, 1, 0.36, 1)',
        }}
      >
        {strip.map((d, i) => (
          <span
            key={i}
            className="block text-center leading-none"
            style={{ height: `${CELL}em` }}
          >
            {d}
          </span>
        ))}
      </span>
    </span>
  );
}

function SlotNumber({ value, active, delay = 0, className = '' }) {
  const text = value.toLocaleString('id-ID');
  let digitIndex = -1;
  return (
    <span aria-hidden="true" className={`inline-flex tabular-nums ${className}`}>
      {text.split('').map((char, i) => {
        if (!/\d/.test(char))
          return (
            <span key={i} className="leading-none" style={{ height: `${CELL}em` }}>
              {char}
            </span>
          );
        digitIndex += 1;
        return (
          <SlotDigit
            key={i}
            target={Number(char)}
            active={active}
            index={digitIndex}
            delay={delay}
          />
        );
      })}
    </span>
  );
}

function StatCard({ index, active, className = '', children }) {
  return (
    <div
      className={`flex flex-col justify-between gap-4 rounded-2xl bg-mint-gray border border-sage-green/20 text-charcoal p-6 md:p-8 shadow-sm transition-all duration-700 ease-out ${
        active ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
      } ${className}`}
      style={{ transitionDelay: `${index * 150}ms` }}
    >
      {children}
    </div>
  );
}

function useCountUp(target, active, duration, delay = 0) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    if (!active) return;
    let raf, start;
    const timeout = setTimeout(() => {
      const tick = (now) => {
        if (start === undefined) start = now;
        const t = Math.min((now - start) / duration, 1);
        setValue(target * t);
        if (t < 1) raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
    }, delay);
    return () => {
      clearTimeout(timeout);
      cancelAnimationFrame(raf);
    };
  }, [active, target, duration, delay]);
  return value;
}

function GenderDonut({ laki, perempuan, active, delay = 0 }) {
  const total = laki + perempuan;
  const pctL = (laki / total) * 100;
  const pctP = (perempuan / total) * 100;
  const durL = (1600 * pctL) / 100;
  const durP = (1600 * pctP) / 100;
  const shownL = useCountUp(pctL, active, durL, delay);
  const shownP = useCountUp(pctP, active, durP, delay + durL);
  const fmt = (n) => `${n.toFixed(1).replace('.', ',')}%`;

  const ring = {
    cx: 60,
    cy: 60,
    r: 48,
    fill: 'none',
    strokeWidth: 18,
    pathLength: 100,
  };

  return (
    <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3 md:gap-6">
      <div className="flex items-center gap-2 justify-self-start">
        <span className="h-3 w-3 shrink-0 rounded-full bg-sage-green" />
        <span className="min-w-[5ch] text-right text-18 md:text-24 font-medium tabular-nums text-charcoal">
          {fmt(shownP)}
        </span>
      </div>
      <div className="h-28 w-28 md:h-36 md:w-36">
        <svg viewBox="0 0 120 120" className="h-full w-full -rotate-90">
          <circle {...ring} className="stroke-charcoal/15" />
          <circle
            {...ring}
            className="stroke-forest-green"
            style={{
              strokeDasharray: `${active ? pctL : 0} 100`,
              strokeDashoffset: 0,
              transition: `stroke-dasharray ${durL}ms linear ${delay}ms`,
            }}
          />
          <circle
            {...ring}
            className="stroke-sage-green"
            style={{
              strokeDasharray: `${active ? pctP : 0} 100`,
              strokeDashoffset: -pctL,
              transition: `stroke-dasharray ${durP}ms linear ${delay + durL}ms`,
            }}
          />
        </svg>
      </div>
      <div className="flex items-center gap-2 justify-self-end">
        <span className="h-3 w-3 shrink-0 rounded-full bg-forest-green" />
        <span className="min-w-[5ch] text-18 md:text-24 font-medium tabular-nums text-charcoal">
          {fmt(shownL)}
        </span>
      </div>
    </div>
  );
}

export default function DataPNS() {
  const [pnsRef, pnsInView] = useInView();

  const displayData = {
    total: 13116,
    lakiLaki: 4839,
    perempuan: 8277,
    golongan: 'Golongan III',
    golonganJumlah: 5659,
    pendidikan: 'S1/Sarjana',
    pendidikanJumlah: 9408,
  };

  return (
    <div ref={pnsRef}>
      <div className="mt-12 md:mt-16 mb-8">
        <h2 className="text-24 md:text-34 font-bold text-forest-green border-b-2 border-sage-green pb-2 inline-block">
          Data Pegawai Negeri Sipil (PNS)
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 items-stretch">
        <StatCard index={0} active={pnsInView}>
          <p className="text-14 md:text-16 font-medium text-charcoal leading-relaxed">
            Jumlah PNS di lingkungan Pemerintah Daerah Kabupaten Bekasi sebanyak
          </p>
          <p className="flex items-end gap-3 mt-4">
            <SlotNumber
              value={displayData.total}
              active={pnsInView}
              delay={300}
              className="text-48 md:text-96 font-bold text-forest-green"
            />
            <span className="pb-2 text-16 md:text-20 font-semibold text-charcoal">
              Orang
            </span>
          </p>
        </StatCard>

        <StatCard index={1} active={pnsInView} className="!gap-2">
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <p className="text-14 md:text-16 font-medium text-charcoal">
                Perempuan
              </p>
              <div className="flex items-end gap-1">
                <SlotNumber
                  value={displayData.perempuan}
                  active={pnsInView}
                  delay={450}
                  className="text-48 md:text-96 font-bold text-sage-green"
                />
              </div>
              <p className="text-16 md:text-20 font-medium text-charcoal">Orang</p>
            </div>
            <div className="flex flex-col items-end text-right">
              <p className="text-14 md:text-16 font-medium text-charcoal">
                Laki-laki
              </p>
              <div className="flex items-end gap-1">
                <SlotNumber
                  value={displayData.lakiLaki}
                  active={pnsInView}
                  delay={450}
                  className="text-48 md:text-96 font-bold text-forest-green"
                />
              </div>
              <p className="text-16 md:text-20 font-medium text-charcoal">Orang</p>
            </div>
          </div>
          {displayData.total > 0 && (
            <GenderDonut
              laki={displayData.lakiLaki}
              perempuan={displayData.perempuan}
              active={pnsInView}
              delay={800}
            />
          )}
        </StatCard>

        <StatCard index={2} active={pnsInView}>
          <p className="text-14 md:text-16 font-medium text-charcoal leading-relaxed">
            Golongan terbanyak yang diduduki oleh PNS
          </p>
          <p className="text-24 md:text-34 font-bold leading-tight text-sage-green mt-2">
            {displayData.golongan}
          </p>
          <div className="mt-4">
            <p className="text-14 md:text-16 font-medium text-charcoal">Sebanyak</p>
            <p className="flex items-end gap-2">
              <SlotNumber
                value={displayData.golonganJumlah}
                active={pnsInView}
                delay={600}
                className="text-48 md:text-96 font-bold text-forest-green"
              />
              <span className="pb-1 text-16 md:text-20 font-medium text-charcoal">
                Orang
              </span>
            </p>
          </div>
        </StatCard>

        <StatCard index={3} active={pnsInView} className="items-end text-right">
          <p className="text-14 md:text-16 font-medium text-charcoal leading-relaxed">
            Latar belakang pendidikan terbanyak
          </p>
          <p className="text-24 md:text-34 font-bold leading-tight text-sage-green mt-2">
            {displayData.pendidikan}
          </p>
          <div className="flex flex-col items-end mt-4">
            <p className="text-14 md:text-16 font-medium text-charcoal">Sebanyak</p>
            <p className="flex items-end gap-2">
              <SlotNumber
                value={displayData.pendidikanJumlah}
                active={pnsInView}
                delay={750}
                className="text-48 md:text-96 font-bold text-forest-green"
              />
              <span className="pb-1 text-16 md:text-20 font-medium text-charcoal">
                Orang
              </span>
            </p>
          </div>
        </StatCard>
      </div>
    </div>
  );
}