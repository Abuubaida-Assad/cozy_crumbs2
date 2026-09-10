import React from 'react';

export default function MarqueeRibbon() {
  const items = [
    'COZY CRUMBS',
    'ARTISANAL BAKERY',
    'HANDCRAFTED DAILY',
    'CELEBRATION CAKES',
    '36-HOUR SOURDOUGH',
    'HYDERABAD',
    'BELGIAN CHOCOLATE',
    'FLAKY PUFFS',
  ];

  return (
    <div className="py-6 bg-[#FAF8F5] border-y border-[#112229]/10 overflow-hidden select-none">
      {/* Top Forward Marquee */}
      <div className="flex overflow-hidden whitespace-nowrap">
        <div className="animate-marquee-scroll flex items-center gap-6 md:gap-10">
          {[...items, ...items].map((text, i) => (
            <div key={`m1-${i}`} className="flex items-center gap-6 md:gap-10">
              <span className="font-title font-black uppercase text-3xl sm:text-5xl md:text-6xl text-[#147C98] tracking-tight">
                {text}
              </span>
              <span className="w-3 h-3 rounded-full bg-[#FFA7EE]" />
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Reverse Marquee with Outlined Style */}
      <div className="flex overflow-hidden whitespace-nowrap mt-2">
        <div className="animate-marquee-reverse flex items-center gap-6 md:gap-10">
          {[...items, ...items].reverse().map((text, i) => (
            <div key={`m2-${i}`} className="flex items-center gap-6 md:gap-10">
              <span
                className="font-title font-black uppercase text-3xl sm:text-5xl md:text-6xl text-transparent tracking-tight"
                style={{ WebkitTextStroke: '1.5px #112229' }}
              >
                {text}
              </span>
              <span className="w-3 h-3 rounded-full bg-[#112229]" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
