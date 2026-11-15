"use client";

import React from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
      <div className="max-w-xl text-center space-y-6">
        <div className="w-12 h-12 rounded-2xl bg-red-50 flex items-center justify-center mx-auto">
          <svg className="w-6 h-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-slate-900">Something went wrong</h2>
        <p className="text-slate-600">
          We encountered an unexpected error. Please try refreshing the page.
        </p>
        <button
          onClick={() => reset()}
          className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-accent-indigo to-indigo-700 text-white font-semibold text-sm hover:from-indigo-500 hover:to-indigo-800 transition-all shadow-md shadow-indigo-200 active:scale-95"
        >
          Try Again
        </button>
      </div>
    </div>
  );
}
