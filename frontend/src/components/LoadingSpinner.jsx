import React, { useState } from 'react';

// =========================================================================
// 1. LoadingSpinner Component
// =========================================================================

/**
 * A highly visible, animated loading spinner component using Tailwind CSS.
 * @param {string} size - Tailwind size class for width and height (e.g., 'w-12 h-12').
 * @param {string} color - Tailwind class for the primary border color (e.g., 'border-indigo-500').
 * @param {string} text - Optional text displayed below the spinner.
 */
const LoadingSpinner = ({ size = 'w-10 h-10', color = 'border-indigo-600', text = 'Loading data...' }) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 bg-white/70 backdrop-blur-sm rounded-xl">
      {/* The main spinning ring */}
      <div
        className={`
          ${size} 
          ${color} 
          border-4 
          border-t-transparent 
          rounded-full 
          animate-spin
        `}
        role="status"
        aria-live="polite"
        aria-label="Loading"
      >
        <span className="sr-only">Loading...</span>
      </div>
      
      {/* Optional loading text */}
      <p className="mt-4 text-sm font-medium text-gray-600">
        {text}
      </p>
    </div>
  );
};

export default LoadingSpinner;