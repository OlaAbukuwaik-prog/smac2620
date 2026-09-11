import React from 'react';
import { FamilyMember } from '../types';

interface AndroidFrameProps {
  children: React.ReactNode;
  activeMember?: FamilyMember;
  allMembers?: FamilyMember[];
  onSwitchMember?: (member: FamilyMember) => void;
  onOpenMLKitReport?: () => void;
  onOpenGoogleIntegration?: () => void;
  googleEmail?: string;
  onSignOut?: () => void;
}

export const AndroidFrame: React.FC<AndroidFrameProps> = ({
  children,
}) => {
  return (
    <div className="min-h-screen w-full bg-slate-900/95 sm:bg-slate-950 flex flex-col items-center justify-center p-0 sm:p-4 md:p-6 selection:bg-purple-500 selection:text-white">
      {/* Mobile App Container (Native Mobile App Experience) */}
      <div
        id="android-phone-frame"
        className="w-full max-w-md h-screen sm:h-[880px] sm:max-h-[94vh] flex flex-col bg-white sm:rounded-[40px] sm:shadow-[0_25px_60px_-15px_rgba(0,0,0,0.6)] sm:border-[8px] sm:border-slate-800 overflow-hidden relative"
      >
        {/* Mobile Status Bar (Android / Native Phone look) */}
        <div className="w-full bg-[#f8f6fb] px-6 pt-2.5 pb-1 flex items-center justify-between text-[11px] font-semibold text-slate-700 select-none shrink-0 z-30">
          <span>9:41</span>
          {/* Subtle speaker / camera notch for phone look on desktop */}
          <div className="w-24 h-4 bg-slate-900/20 rounded-full hidden sm:block" />
          <div className="flex items-center gap-2 text-[11px] text-slate-600 font-medium">
            <span>5G</span>
            <span>100%</span>
          </div>
        </div>

        {/* Main App Content - Pure Mobile App Experience */}
        <div className="flex-1 flex flex-col overflow-y-auto bg-[#f8f6fb]">
          {children}
        </div>
      </div>
    </div>
  );
};
