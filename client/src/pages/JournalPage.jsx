import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { articlesData } from '../data/siteData';

export default function JournalPage() {
  const [selectedArticle, setSelectedArticle] = useState(null);

  return (
    <div className="pt-28 md:pt-36 pb-24 px-[4vw] bg-[#FAF8F5] min-h-screen">
      <div className="max-w-6xl mx-auto space-y-16">
        {/* Page Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <span className="font-title text-xs font-bold uppercase tracking-[0.28em] text-[#147C98]">
            THE FLOUR & BUTTER JOURNAL
          </span>
          <h1 className="font-title text-4xl sm:text-6xl font-black uppercase text-[#112229] tracking-tight">
            Notes from the Bakery
          </h1>
          <p className="text-sm md:text-base text-[#112229]/75 max-w-xl mx-auto leading-relaxed">
            Explorations into fermentation chemistry, chocolate tempering, Hyderabad culinary traditions, and cake design tips.
          </p>
        </div>

        {/* Articles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10">
          {articlesData.map((article) => (
            <article
              key={article.id}
              id={article.slug}
              className="group bg-white rounded-3xl md:rounded-[36px] overflow-hidden border border-[#112229]/10 hover:border-[#147C98] hover:shadow-xl transition-all duration-500 flex flex-col justify-between"
            >
              <div>
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

                <div className="p-8 space-y-4">
                  <div className="flex items-center gap-2 text-xs font-semibold text-[#147C98]">
                    <span>{article.date}</span>
                    <span>•</span>
                    <span>{article.readTime}</span>
                  </div>

                  <h2 className="font-title text-2xl font-black uppercase text-[#112229] group-hover:text-[#147C98] transition-colors leading-tight">
                    {article.title}
                  </h2>

                  <p className="text-sm text-[#112229]/75 leading-relaxed">
                    {article.summary}
                  </p>
                </div>
              </div>

              <div className="px-8 pb-8 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedArticle(article)}
                  className="w-full py-3.5 rounded-pill bg-[#FAF8F5] border border-[#112229]/15 hover:bg-[#112229] hover:text-white text-[#112229] font-title font-bold text-xs uppercase tracking-wider transition-colors flex items-center justify-center gap-2"
                >
                  <span>Read Full Article</span>
                  <span>→</span>
                </button>
              </div>
            </article>
          ))}
        </div>

        {/* Full Article Reading Modal */}
        {selectedArticle && (
          <div className="fixed inset-0 z-[35000] flex items-center justify-center p-4 sm:p-6 md:p-10">
            <div
              className="fixed inset-0 bg-[#112229]/75 backdrop-blur-sm"
              onClick={() => setSelectedArticle(null)}
            />
            <div className="relative z-[35001] w-full max-w-3xl max-h-[85vh] overflow-y-auto bg-[#FAF8F5] rounded-3xl md:rounded-[36px] shadow-2xl p-6 sm:p-10 md:p-12 space-y-6">
              <button
                type="button"
                onClick={() => setSelectedArticle(null)}
                className="absolute top-6 right-6 w-10 h-10 rounded-full bg-white border border-[#112229]/15 flex items-center justify-center text-[#112229] hover:bg-[#FFA7EE] transition-colors"
              >
                ✕
              </button>

              <div className="space-y-2">
                <span className="font-title text-xs font-bold uppercase tracking-widest text-[#147C98]">
                  {selectedArticle.category} • {selectedArticle.readTime}
                </span>
                <h2 className="font-title text-2xl sm:text-3xl md:text-4xl font-black uppercase text-[#112229] leading-tight">
                  {selectedArticle.title}
                </h2>
                <span className="text-xs text-[#112229]/60 font-medium block">
                  Published {selectedArticle.date} by Cozy Crumbs Bakery Studio
                </span>
              </div>

              <div className="aspect-[16/9] rounded-2xl overflow-hidden shadow-inner">
                <img
                  src={selectedArticle.image}
                  alt={selectedArticle.title}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="prose text-sm md:text-base text-[#112229]/80 leading-relaxed space-y-4">
                <p className="font-medium text-[#112229]">{selectedArticle.summary}</p>
                <p>{selectedArticle.content}</p>
              </div>

              <div className="pt-6 border-t border-[#112229]/10 flex justify-between items-center">
                <Link
                  to="/menu"
                  onClick={() => setSelectedArticle(null)}
                  className="text-xs font-title font-bold uppercase text-[#147C98] hover:underline"
                >
                  Order Related Bakes →
                </Link>
                <button
                  type="button"
                  onClick={() => setSelectedArticle(null)}
                  className="px-6 py-2.5 rounded-pill bg-[#112229] text-white text-xs font-title font-bold uppercase"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
