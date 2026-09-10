import React from 'react';

export default function DietaryBadge({ isVeg, isEggless, className = '' }) {
  // Check if item is vegetarian / eggless
  const isVegetarian = isVeg !== false && isEggless !== false;

  return (
    <div className={`inline-flex items-center gap-1.5 ${className}`}>
      {isVegetarian ? (
        /* Vegetarian / Eggless: Green square with solid green dot */
        <svg
          className="w-4 h-4 min-w-[16px] min-h-[16px] shrink-0 shadow-xs"
          viewBox="0 0 16 16"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-label="100% Vegetarian / Eggless"
        >
          <rect x="1" y="1" width="14" height="14" rx="2.5" fill="#FFFFFF" stroke="#16A34A" strokeWidth="1.8" />
          <circle cx="8" cy="8" r="3.75" fill="#16A34A" />
        </svg>
      ) : (
        /* Non-Vegetarian / Contains Egg: Red square with solid red dot */
        <svg
          className="w-4 h-4 min-w-[16px] min-h-[16px] shrink-0 shadow-xs"
          viewBox="0 0 16 16"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-label="Contains Egg / Non-Vegetarian"
        >
          <rect x="1" y="1" width="14" height="14" rx="2.5" fill="#FFFFFF" stroke="#DC2626" strokeWidth="1.8" />
          <circle cx="8" cy="8" r="3.75" fill="#DC2626" />
        </svg>
      )}

      {isVegetarian ? (
        <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-pill bg-[#FFDAED] text-[#112229] border border-[#FFA7EE]/60 shadow-xs shrink-0">
          Eggless
        </span>
      ) : (
        <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-pill bg-rose-50 text-rose-900 border border-rose-300 shadow-xs shrink-0">
          Contains Egg
        </span>
      )}
    </div>
  );
}
