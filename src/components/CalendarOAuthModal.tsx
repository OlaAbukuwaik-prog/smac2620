import React, { useState } from 'react';
import {
  X,
  ShieldCheck,
  Calendar as CalendarIcon,
  CheckCircle,
  ExternalLink,
  Lock,
  RefreshCw,
  LogOut,
} from 'lucide-react';
import { FamilyMember } from '../types';

interface CalendarOAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeMember: FamilyMember;
  onToggleConnection: (connected: boolean) => void;
}

export const CalendarOAuthModal: React.FC<CalendarOAuthModalProps> = ({
  isOpen,
  onClose,
  activeMember,
  onToggleConnection,
}) => {
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const isConnected = activeMember.calendar.isConnected;

  if (!isOpen) return null;

  const handleConnect = () => {
    setIsAuthenticating(true);
    setTimeout(() => {
      setIsAuthenticating(false);
      onToggleConnection(true);
    }, 1500);
  };

  const handleDisconnect = () => {
    onToggleConnection(false);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-3">
      <div className="bg-white rounded-3xl p-5 max-w-sm w-full space-y-4 shadow-2xl border border-purple-100 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-purple-950 font-bold text-sm">
            <CalendarIcon className="w-5 h-5 text-purple-600" />
            <span>Calendar Authentication</span>
          </div>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Security Pledge (Section 20) */}
        <div className="p-3 bg-indigo-50 border border-indigo-200 rounded-2xl text-xs space-y-1.5">
          <div className="flex items-center gap-1.5 font-bold text-indigo-950 text-[11px] uppercase tracking-wider">
            <ShieldCheck className="w-4 h-4 text-indigo-700" />
            <span>Secure OAuth 2.0 Authorization</span>
          </div>
          <p className="text-[11px] text-slate-600 leading-relaxed">
            Silah uses Google OAuth token authorization. We <strong>never</strong> ask for or store
            your calendar password, and we request only minimal permissions.
          </p>
        </div>

        {/* Status card */}
        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-800">Connected Account:</span>
            <span
              className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                isConnected ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-600'
              }`}
            >
              {isConnected ? 'Active & Synced' : 'Disconnected'}
            </span>
          </div>

          <div className="text-xs text-slate-700 font-mono">
            {activeMember.calendar.accountEmail || 'No account linked'}
          </div>

          {isConnected && (
            <div className="text-[10px] text-slate-400">
              Provider: Google Calendar API • Token refresh: Automatic
            </div>
          )}
        </div>

        {/* Minimum Scopes Requested */}
        <div className="space-y-1.5 text-xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Requested Scopes (Principle of Least Privilege):
          </span>
          <div className="space-y-1 text-[11px] text-slate-600">
            <div className="flex items-center gap-1.5">
              <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
              <span>Read free/busy availability slots</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
              <span>View shared family calendar events</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
              <span>Add approved family activities to schedule</span>
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div className="pt-2">
          {isConnected ? (
            <button
              onClick={handleDisconnect}
              className="w-full py-2.5 rounded-xl border border-rose-300 text-rose-700 hover:bg-rose-50 text-xs font-bold flex items-center justify-center gap-1.5 transition-all"
            >
              <LogOut className="w-4 h-4" />
              <span>Disconnect Calendar</span>
            </button>
          ) : (
            <button
              onClick={handleConnect}
              disabled={isAuthenticating}
              className="w-full py-2.5 rounded-xl bg-purple-700 hover:bg-purple-800 text-white font-bold text-xs shadow flex items-center justify-center gap-1.5 transition-all"
            >
              {isAuthenticating ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Authorizing via Google...</span>
                </>
              ) : (
                <>
                  <CalendarIcon className="w-4 h-4" />
                  <span>Authorize Google Calendar</span>
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
