import React from 'react';

export default function ValueStrip() {
  const values = [
    {
      step: '01',
      title: 'Freshly Baked',
      subtitle: 'Every Single Day',
      desc: 'Our deck ovens light up before dawn so your morning sourdough and celebration cakes arrive oven-fresh.',
      icon: '🥖'
    },
    {
      step: '02',
      title: 'Made With Care',
      subtitle: 'Pure Artisanal Craft',
      desc: 'No premixes or shortcuts. Every sponge, cream layer, and lamination is handcrafted by seasoned master bakers.',
      icon: '✨'
    },
    {
      step: '03',
      title: 'Original Recipes',
      subtitle: 'Premium Quality Ingredients',
      desc: 'Pure churned butter, Belgian dark chocolate, stone-milled flours, and farm-fresh local dairy.',
      icon: '🍫'
    }
  ];

  return (
    <section className="py-16 md:py-24 px-[4vw] bg-white border-b border-[#112229]/10">
      <div className="max-w-7xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-12 md:mb-16">
          <span className="font-title text-xs font-bold uppercase tracking-[0.24em] text-[#147C98]">
            THE COZY CRUMBS PROMISE
          </span>
          <h2 className="font-title text-3xl sm:text-4xl md:text-5xl font-black uppercase text-[#112229] mt-2 tracking-tight">
            Handcrafted with Integrity
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-10">
          {values.map((v) => (
            <div
              key={v.step}
              className="relative p-8 rounded-3xl bg-[#FAF8F5] border border-[#112229]/10 hover:border-[#147C98] transition-all duration-500 group"
            >
              <div className="flex items-center justify-between mb-6">
                <span className="w-12 h-12 rounded-2xl bg-[#FFDAED] flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                  {v.icon}
                </span>
                <span className="font-title text-xs font-black text-[#147C98] tracking-widest">
                  {v.step}
                </span>
              </div>

              <h3 className="font-title text-xl font-bold uppercase text-[#112229] mb-1">
                {v.title}
              </h3>
              <p className="text-xs uppercase font-bold tracking-wider text-[#147C98] mb-3">
                {v.subtitle}
              </p>
              <p className="text-sm text-[#112229]/70 leading-relaxed">
                {v.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
