import React from 'react';
import { Link } from 'react-router-dom';

export default function NotFoundPage() {
  return (
    <div className="pt-32 pb-24 px-[4vw] bg-[#FAF8F5] min-h-[85vh] flex items-center justify-center">
      <div className="max-w-xl mx-auto text-center space-y-6 bg-white p-10 sm:p-14 rounded-3xl md:rounded-[40px] border border-[#112229]/10 shadow-lg">
        <span className="font-title text-7xl sm:text-9xl font-black text-[#147C98] block leading-none">
          404
        </span>

        <span className="text-4xl block">🍪</span>

        <h1 className="font-title text-2xl sm:text-3xl font-black uppercase text-[#112229] tracking-tight">
          Page Not Found
        </h1>

        <p className="text-sm md:text-base text-[#112229]/75 max-w-md mx-auto leading-relaxed">
          "Oops! The page you are looking for seems to have crumbled away or does not exist."
        </p>

        <div className="pt-4">
          <Link
            to="/"
            className="inline-block px-8 py-4 rounded-pill bg-[#112229] hover:bg-[#147C98] text-[#F8F8F2] font-title font-bold text-xs uppercase tracking-wider transition-colors shadow-md"
          >
            RETURN TO HOME →
          </Link>
        </div>
      </div>
    </div>
  );
}
