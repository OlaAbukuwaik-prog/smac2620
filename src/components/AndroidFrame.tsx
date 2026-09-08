import React, { useState, useEffect } from 'react';
import {
  Users,
  Award,
  Sparkles,
  ChevronDown,
  ShieldCheck,
  LogOut,
  Calendar as CalendarIcon,
  RefreshCw,
  Compass,
} from 'lucide-react';
import { FamilyMember } from '../types';
import { GoogleGLogo } from './GoogleSignInScreen';

interface AndroidFrameProps {
  children: React.ReactNode;
  activeMember: FamilyMember;
  allMembers: FamilyMember[];
  onSwitchMember: (member: FamilyMember) => void;
  onOpenCompetitionDemo: () => void;
  onOpenMLKitReport: () => void;
  onOpenGoogleIntegration?: () => void;
  googleEmail?: string;
  onSignOut?: () => void;
}

export const AndroidFrame: React.FC<AndroidFrameProps> = ({
  children,
  activeMember,
  allMembers,
  onSwitchMember,
  onOpenCompetitionDemo,
  onOpenMLKitReport,
  onOpenGoogleIntegration,
  googleEmail = 'lovelyspurelove@gmail.com',
  onSignOut,
}) => {
  const [showMemberDropdown, setShowMemberDropdown] = useState(false);

  return (
    <div className="min-h-screen w-full bg-[#f8f6fb] text-slate-800 flex flex-col selection:bg-purple-500 selection:text-white">
      {/* Top Application Header for Full Web App (Matching CSS selector 2) */}
      <header className="w-full bg-white/95 backdrop-blur-md border-b border-purple-100 shadow-xs px-4 sm:px-6 md:px-8 py-3 flex flex-wrap items-center justify-between gap-3 sticky top-0 z-30">
        {/* Brand & Mission Statement */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-purple-700 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-purple-600/20 font-bold text-lg">
            <span className="font-arabic font-extrabold text-xl text-amber-300">ص</span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-purple-900 font-arabic text-lg leading-none">
                صلة
              </span>
              <span className="font-extrabold text-slate-900 tracking-tight text-base leading-none">
                Silah
              </span>
              <span className="hidden sm:inline-block text-[10px] bg-purple-100 text-purple-800 font-bold px-2 py-0.5 rounded-full">
                Full App
              </span>
            </div>
            <p className="text-[11px] text-slate-500 hidden md:block">
              Family Connection, De-escalation & Google Calendar Integration
            </p>
          </div>
        </div>

        {/* Center & Right Controls: Google Status, Perspective Switcher, Actions */}
        <div className="flex items-center gap-2.5 flex-wrap">
          {/* Google Connected Status Pill */}
          <button
            id="google-status-pill"
            onClick={onOpenGoogleIntegration}
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-50 hover:bg-purple-50 border border-slate-200 hover:border-purple-200 text-xs font-medium text-slate-700 transition-all cursor-pointer shadow-xs active:scale-95"
            title="View Google Account & Calendar API Sync status"
          >
            <GoogleGLogo className="w-4 h-4" />
            <div className="text-left hidden sm:block">
              <div className="text-[10px] text-slate-400 leading-tight font-medium">
                Google Linked
              </div>
              <div className="text-[11px] font-bold text-purple-950 leading-tight truncate max-w-[130px]">
                {googleEmail}
              </div>
            </div>
            <span className="w-2 h-2 rounded-full bg-emerald-500 ring-2 ring-emerald-100 shrink-0" />
          </button>

          {/* Active Family Member Switcher */}
          <div className="relative">
            <button
              id="role-switcher-btn"
              onClick={() => setShowMemberDropdown(!showMemberDropdown)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-purple-50 hover:bg-purple-100/80 border border-purple-200 text-purple-950 transition-all font-semibold text-xs cursor-pointer shadow-xs"
              title="Switch user perspective"
            >
              <div
                className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${activeMember.avatarColor}`}
              >
                {activeMember.initials}
              </div>
              <span>{activeMember.name}</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded-md bg-purple-200 text-purple-800 font-bold">
                {activeMember.role}
              </span>
              <ChevronDown className="w-3.5 h-3.5 opacity-60" />
            </button>

            {showMemberDropdown && (
              <div
                id="role-dropdown-menu"
                className="absolute right-0 mt-1.5 w-60 bg-white border border-purple-100 rounded-2xl shadow-xl z-50 p-2 space-y-1 animate-in fade-in"
              >
                <div className="px-2.5 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Switch Active Perspective:
                </div>
                {allMembers.map((member) => (
                  <button
                    key={member.id}
                    id={`switch-to-${member.id}`}
                    onClick={() => {
                      onSwitchMember(member);
                      setShowMemberDropdown(false);
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-left transition-colors cursor-pointer ${
                      member.id === activeMember.id
                        ? 'bg-purple-100 text-purple-900 font-bold'
                        : 'hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold ${member.avatarColor}`}
                      >
                        {member.initials}
                      </div>
                      <div>
                        <div className="text-xs">{member.name}</div>
                        <div className="text-[10px] text-slate-400 font-arabic">
                          {member.arabicName}
                        </div>
                      </div>
                    </div>
                    <span className="text-[10px] text-purple-700 font-semibold">{member.role}</span>
                  </button>
                ))}

                {onSignOut && (
                  <div className="pt-1 border-t border-slate-100">
                    <button
                      onClick={() => {
                        setShowMemberDropdown(false);
                        onSignOut();
                      }}
                      className="w-full flex items-center gap-2 px-3 py-1.5 text-xs text-rose-600 hover:bg-rose-50 rounded-xl transition-colors cursor-pointer font-semibold"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Sign Out / Switch Google Account</span>
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Guided Story Demo Button */}
          <button
            id="start-demo-story-btn"
            onClick={onOpenCompetitionDemo}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-purple-700 to-indigo-700 hover:from-purple-800 hover:to-indigo-800 text-white font-bold shadow-xs transition-all active:scale-95 text-xs cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>Demo Story</span>
          </button>

          {/* ML Kit Tech Button */}
          <button
            id="open-mlkit-docs-btn"
            onClick={onOpenMLKitReport}
            className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors cursor-pointer"
            title="View Google ML Kit integration"
          >
            <Award className="w-3.5 h-3.5 text-purple-700" />
            <span>ML Kit Docs</span>
          </button>
        </div>
      </header>

      {/* Main Full-App Viewport (Matching CSS selector 1: #android-phone-frame) */}
      <div className="w-full flex-1 flex flex-col justify-start items-center p-0 sm:p-4 md:p-6">
        <div
          id="android-phone-frame"
          className="w-full max-w-4xl flex-1 flex flex-col bg-white sm:rounded-3xl sm:shadow-lg sm:border sm:border-purple-100/80 overflow-hidden relative min-h-[calc(100vh-100px)]"
        >
          {/* Main App Content */}
          <div className="flex-1 flex flex-col overflow-y-auto">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};
