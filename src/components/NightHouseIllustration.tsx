import React from 'react';

export const NightHouseIllustration: React.FC<{ className?: string }> = ({ className = 'w-36 h-28' }) => {
  return (
    <div className={`relative flex items-center justify-center shrink-0 ${className}`}>
      {/* Background Soft Twilight Gradient Container */}
      <div className="w-full h-full rounded-2xl bg-gradient-to-b from-purple-200/60 via-purple-100/40 to-transparent flex items-end justify-center relative overflow-hidden">
        {/* Soft Radial Glow behind house */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-28 h-28 rounded-full bg-amber-100/40 blur-xl pointer-events-none" />

        {/* Crescent Moon in upper sky */}
        <svg
          className="absolute top-2 left-6 w-5 h-5 text-amber-100 drop-shadow-sm"
          viewBox="0 0 24 24"
          fill="currentColor"
        >
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
        </svg>

        {/* Twinkling Stars */}
        <div className="absolute top-3.5 right-7 w-1 h-1 bg-white rounded-full opacity-80" />
        <div className="absolute top-6 right-12 w-1.5 h-1.5 bg-amber-200/90 rounded-full blur-[0.5px]" />
        <div className="absolute top-4 left-14 w-1 h-1 bg-white rounded-full opacity-70" />

        {/* Cute Cozy House Vector */}
        <svg
          className="w-28 h-22 relative z-10 -mb-0.5"
          viewBox="0 0 160 120"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Back Trees / Shrubs */}
          <ellipse cx="26" cy="94" rx="14" ry="18" fill="#475569" />
          <ellipse cx="32" cy="90" rx="12" ry="16" fill="#334155" />
          <ellipse cx="134" cy="92" rx="15" ry="18" fill="#475569" />
          <ellipse cx="140" cy="96" rx="12" ry="15" fill="#334155" />

          {/* House Main Body */}
          <rect x="42" y="52" width="76" height="52" rx="2" fill="#585175" />
          <rect x="46" y="52" width="68" height="50" fill="#4a4267" />

          {/* Roof */}
          <polygon points="34,54 80,18 126,54" fill="#383053" />
          <polygon points="38,52 80,21 122,52" fill="#433a60" />

          {/* Chimney */}
          <rect x="94" y="24" width="10" height="18" fill="#383053" />

          {/* Attic window */}
          <circle cx="80" cy="38" r="5.5" fill="#fef08a" />
          <line x1="80" y1="32.5" x2="80" y2="43.5" stroke="#433a60" strokeWidth="1" />
          <line x1="74.5" y1="38" x2="85.5" y2="38" stroke="#433a60" strokeWidth="1" />

          {/* Front Door */}
          <rect x="71" y="74" width="18" height="30" rx="2" fill="#2d2644" />
          <circle cx="84" cy="88" r="1.5" fill="#fef08a" />

          {/* Left Warm Glowing Window */}
          <rect x="52" y="66" width="14" height="16" rx="1.5" fill="#fef08a" />
          <line x1="59" y1="66" x2="59" y2="82" stroke="#4a4267" strokeWidth="1.2" />
          <line x1="52" y1="74" x2="66" y2="74" stroke="#4a4267" strokeWidth="1.2" />

          {/* Right Warm Glowing Window */}
          <rect x="94" y="66" width="14" height="16" rx="1.5" fill="#fef08a" />
          <line x1="101" y1="66" x2="101" y2="82" stroke="#4a4267" strokeWidth="1.2" />
          <line x1="94" y1="74" x2="108" y2="74" stroke="#4a4267" strokeWidth="1.2" />

          {/* Ground path / lawn line */}
          <rect x="0" y="104" width="160" height="16" fill="#e2e8f0" opacity="0.3" />
        </svg>
      </div>
    </div>
  );
};
