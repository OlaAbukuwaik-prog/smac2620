import React, { useState } from 'react';
import {
  X,
  ShieldCheck,
  Calendar as CalendarIcon,
  CheckCircle2,
  RefreshCw,
  LogOut,
  ExternalLink,
  Cpu,
  Lock,
  UserCheck,
} from 'lucide-react';
import { FamilyMember } from '../types';
import { GoogleGLogo } from './GoogleSignInScreen';

interface GoogleIntegrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeMember: FamilyMember;
  allMembers: FamilyMember[];
  googleEmail: string;
  onSignOut: () => void;
  onSwitchGoogleAccount: (member: FamilyMember) => void;
}

export const GoogleIntegrationModal: React.FC<GoogleIntegrationModalProps> = ({
  isOpen,
  onClose,
  activeMember,
  allMembers,
  googleEmail,
  onSignOut,
  onSwitchGoogleAccount,
}) => {
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncSuccessMsg, setSyncSuccessMsg] = useState('');

  if (!isOpen) return null;

  const handleManualSync = () => {
    setIsSyncing(true);
    setTimeout(() => {
      setIsSyncing(false);
      setSyncSuccessMsg('Successfully synced 4 family calendars with Google Calendar API.');
      setTimeout(() => setSyncSuccessMsg(''), 3500);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white rounded-3xl max-w-lg w-full max-h-[92vh] overflow-y-auto shadow-2xl border border-purple-100 flex flex-col">
        {/* Modal Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between sticky top-0 bg-white z-10">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-purple-50 flex items-center justify-center border border-purple-100">
              <GoogleGLogo className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                <span>Google Integration & Account Manager</span>
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
              </h2>
              <p className="text-[11px] text-slate-500">
                Connected via Google OAuth 2.0 & Calendar API
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 space-y-4 text-xs">
          {/* Active Google User Card */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-purple-50 via-indigo-50 to-purple-50/50 border border-purple-100 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div
                className={`w-10 h-10 rounded-2xl flex items-center justify-center font-bold text-sm text-white shadow-xs ${activeMember.avatarColor}`}
              >
                {activeMember.initials}
              </div>
              <div className="space-y-0.5">
                <div className="font-bold text-slate-900 flex items-center gap-2">
                  <span>{activeMember.name}</span>
                  <span className="text-[10px] bg-purple-200/80 text-purple-900 px-2 py-0.2 rounded-md font-semibold">
                    {activeMember.role}
                  </span>
                </div>
                <div className="text-[11px] text-slate-600 font-mono flex items-center gap-1">
                  <span>{googleEmail}</span>
                  <span className="text-emerald-600 font-bold">• Active</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => {
                onClose();
                onSignOut();
              }}
              className="px-2.5 py-1.5 rounded-xl bg-white hover:bg-rose-50 text-rose-600 border border-rose-200 text-[11px] font-bold flex items-center gap-1 transition-colors cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
          </div>

          {/* Sync Status & Action */}
          <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between">
            <div>
              <div className="font-bold text-slate-800 flex items-center gap-1.5">
                <CalendarIcon className="w-4 h-4 text-purple-700" />
                <span>Google Calendar Real-Time Status</span>
              </div>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Last checked: Just now • Auto-sync every 15 mins
              </p>
            </div>

            <button
              onClick={handleManualSync}
              disabled={isSyncing}
              className="px-3 py-1.5 bg-purple-700 hover:bg-purple-800 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xs transition-all cursor-pointer active:scale-95"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
              <span>{isSyncing ? 'Syncing...' : 'Sync Now'}</span>
            </button>
          </div>

          {syncSuccessMsg && (
            <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-[11px] font-semibold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{syncSuccessMsg}</span>
            </div>
          )}

          {/* 4 Synced Family Members Accounts */}
          <div className="space-y-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
              Synced Family Google Calendars (4 Active):
            </span>

            <div className="space-y-1.5">
              {allMembers.map((member) => (
                <div
                  key={member.id}
                  className="p-2.5 bg-white rounded-xl border border-slate-200 flex items-center justify-between"
                >
                  <div className="flex items-center gap-2.5">
                    <div
                      className={`w-7 h-7 rounded-xl flex items-center justify-center font-bold text-[11px] ${member.avatarColor}`}
                    >
                      {member.initials}
                    </div>
                    <div>
                      <div className="font-bold text-slate-800 text-xs flex items-center gap-1.5">
                        <span>{member.name}</span>
                        <span className="text-[9px] text-slate-500 font-normal">
                          ({member.role})
                        </span>
                      </div>
                      <div className="text-[10px] text-slate-400 font-mono">
                        {member.calendar.accountEmail || `${member.name.toLowerCase()}@gmail.com`}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-emerald-700 bg-emerald-50 font-bold px-2 py-0.5 rounded-full border border-emerald-200">
                      ✓ Connected
                    </span>
                    {member.id !== activeMember.id && (
                      <button
                        onClick={() => {
                          onSwitchGoogleAccount(member);
                          onClose();
                        }}
                        className="text-[10px] text-purple-700 hover:underline font-semibold cursor-pointer"
                      >
                        Switch To
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Scopes & Security Info */}
          <div className="p-3.5 bg-indigo-50/70 rounded-2xl border border-indigo-100 space-y-2">
            <div className="flex items-center gap-1.5 font-bold text-indigo-950 text-[11px] uppercase tracking-wider">
              <Lock className="w-3.5 h-3.5 text-indigo-700" />
              <span>Google API Privacy & Security</span>
            </div>
            <p className="text-[11px] text-slate-600 leading-relaxed">
              Silah only accesses Google Calendar events to find mutually free time slots for family dinners. Private event descriptions and emails are never logged on external servers.
            </p>
            <div className="text-[10px] text-indigo-900 font-mono space-y-0.5 pt-1">
              <div>✓ https://www.googleapis.com/auth/calendar.events</div>
              <div>✓ https://www.googleapis.com/auth/userinfo.email</div>
              <div>✓ Google ML Kit on-device natural language classification</div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-xl text-xs font-bold cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
