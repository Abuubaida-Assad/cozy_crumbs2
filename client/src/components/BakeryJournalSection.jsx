import React from 'react';
import { Link } from 'react-router-dom';
import { articlesData } from '../data/siteData';

export default function BakeryJournalSection() {
  return (
    <section className="py-20 md:py-28 px-[4vw] bg-white border-t border-[#112229]/10">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <span className="font-title text-xs font-bold uppercase tracking-[0.24em] text-[#147C98]">
              BAKERY JOURNAL
            </span>
            <h2 className="font-title text-3xl sm:text-5xl font-black uppercase text-[#112229] mt-2 tracking-tight">
              Stories from the Flour Studio
            </h2>
          </div>

          <Link
            to="/journal"
            className="inline-flex items-center gap-2 font-title text-sm font-bold uppercase text-[#112229] hover:text-[#147C98] transition-colors"
          >
            <span>READ ALL ARTICLES</span>
            <span>→</span>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {articlesData.slice(0, 3).map((article) => (
            <Link
              key={article.id}
              to={`/journal#${article.slug}`}
              className="group flex flex-col bg-[#FAF8F5] rounded-3xl overflow-hidden border border-[#112229]/10 hover:border-[#147C98] hover:shadow-xl transition-all duration-500"
            >
              <div className="aspect-[16/10] overflow-hidden bg-[#FFDAED]/30 relative">
                <img
                  src={article.image}
                  alt={article.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-[cubic-bezier(.28,_.71,_0,_.98)]"
                  onError={(e) => {
                    e.target.src = '/images/products/cakes/chocolate-cake.webp';
                  }}
                />
                <span className="absolute top-4 left-4 px-3 py-1 rounded-pill bg-[#112229] text-white font-title text-[10px] font-bold uppercase tracking-wider">
                  {article.category}
                </span>
              </div>

              <div className="p-6 flex flex-col justify-between flex-grow">
                <div>
                  <div className="flex items-center gap-2 text-[11px] font-semibold text-[#147C98] mb-2">
                    <span>{article.date}</span>
                    <span>•</span>
                    <span>{article.readTime}</span>
                  </div>

                  <h3 className="font-title text-lg font-bold uppercase text-[#112229] group-hover:text-[#147C98] transition-colors leading-snug">
                    {article.title}
                  </h3>

                  <p className="mt-2 text-xs text-[#112229]/70 line-clamp-3 leading-relaxed">
                    {article.summary}
                  </p>
                </div>

                <div className="mt-6 pt-3 border-t border-[#112229]/10 flex items-center justify-between text-xs font-title font-bold uppercase text-[#112229] group-hover:text-[#147C98]">
                  <span>Read Story</span>
                  <span className="group-hover:translate-x-1 transition-transform">→</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
