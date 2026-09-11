import React from 'react';

export default function DietaryBadge({ isVeg, isEggless, className = '' }) {
  // Only highlight eggless items across the whole website.
  // Items containing egg or non-veg are not highlighted.
  const isEgglessItem = Boolean(isEggless) && isVeg !== false;

  if (!isEgglessItem) {
    return null;
  }

  return (
    <div className={`inline-flex items-center gap-1.5 ${className}`}>
      {/* 100% Eggless: Green square with solid green dot */}
      <svg
        className="w-4 h-4 min-w-[16px] min-h-[16px] shrink-0 shadow-xs"
        viewBox="0 0 16 16"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-label="100% Eggless"
      >
        <rect x="1" y="1" width="14" height="14" rx="2.5" fill="#FFFFFF" stroke="#16A34A" strokeWidth="1.8" />
        <circle cx="8" cy="8" r="3.75" fill="#16A34A" />
      </svg>

      <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-pill bg-[#FFDAED] text-[#112229] border border-[#FFA7EE]/60 shadow-xs shrink-0">
        Eggless
      </span>
    </div>
  );
}
