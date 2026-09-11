import React, { useState } from 'react';
import {
  User,
  Shield,
  Calendar as CalendarIcon,
  Bell,
  Users,
  Globe,
  Award,
  Lock,
  Copy,
  Check,
  ChevronRight,
  ExternalLink,
  Bot,
  Sparkles,
  LogOut,
  Settings,
  Heart,
} from 'lucide-react';
import { FamilyMember, Family } from '../types';

interface ProfileScreenProps {
  activeMember: FamilyMember;
  family: Family;
  onOpenPrivacyModal: () => void;
  onOpenOAuthModal: () => void;
  onOpenMLKitReport: () => void;
  onOpenMoodHistory: () => void;
  onUpdatePrivacy: (newSettings: FamilyMember['privacySettings']) => void;
  onOpenAdminModal?: () => void;
  onOpenParentGuide?: () => void;
  onSignOut?: () => void;
}

export const ProfileScreen: React.FC<ProfileScreenProps> = ({
  activeMember,
  family,
  onOpenPrivacyModal,
  onOpenOAuthModal,
  onOpenMLKitReport,
  onOpenMoodHistory,
  onUpdatePrivacy,
  onOpenAdminModal,
  onOpenParentGuide,
  onSignOut,
}) => {
  const [copiedCode, setCopiedCode] = useState(false);

  const handleCopyCode = () => {
    navigator.clipboard?.writeText(family.inviteCode);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  return (
    <div className="flex-1 px-4 py-4 space-y-4 pb-20">
      {/* Member Card */}
      <section className="bg-white rounded-2xl p-4 shadow-sm border border-purple-100 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div
            className={`w-14 h-14 rounded-2xl flex items-center justify-center text-lg font-bold shadow-sm ${activeMember.avatarColor}`}
          >
            {activeMember.initials}
          </div>
          <div>
            <h1 className="text-base font-bold text-slate-900">{activeMember.name}</h1>
            <div className="text-xs text-purple-700 font-arabic">{activeMember.arabicName}</div>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-100 text-purple-800 font-semibold">
                {activeMember.role}
              </span>
              <span className="text-[10px] text-slate-400">Age: {activeMember.ageRange}</span>
            </div>
          </div>
        </div>
      </section>

      {/* Family Invite Code Box */}
      <section className="bg-gradient-to-br from-purple-900 to-indigo-950 text-white rounded-2xl p-3.5 shadow-sm space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-bold uppercase tracking-wider text-purple-200">
            Family Invite Code
          </span>
          <span className="text-[11px] text-amber-300 font-semibold">{family.name}</span>
        </div>
        <div className="flex items-center justify-between p-2 rounded-xl bg-white/10 border border-white/15">
          <span className="text-sm font-mono font-bold tracking-widest text-white">
            {family.inviteCode}
          </span>
          <button
            onClick={handleCopyCode}
            className="flex items-center gap-1 text-xs px-2.5 py-1 rounded-lg bg-white/20 hover:bg-white/30 text-white font-medium transition-all"
          >
            {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedCode ? 'Copied' : 'Share'}</span>
          </button>
        </div>
        <p className="text-[10px] text-purple-200">
          Share with family members to let them join with individual accounts.
        </p>
      </section>

      {/* Profile Sections List */}
      <section className="bg-white rounded-2xl shadow-sm border border-purple-100 overflow-hidden divide-y divide-slate-100">
        {/* Parent Guide (Visible ONLY in the parents profile) */}
        {activeMember.role === 'Parent' && onOpenParentGuide && (
          <button
            id="profile-parent-guide-btn"
            onClick={onOpenParentGuide}
            className="w-full p-3.5 text-left flex items-center justify-between hover:bg-amber-50/60 transition-colors bg-amber-50/20"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center">
                <Heart className="w-4 h-4 text-rose-500 fill-rose-500" />
              </div>
              <div>
                <div className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                  <span>Parent Guidance & De-escalation Hub</span>
                  <span className="text-[9px] px-1.5 py-0.2 rounded bg-amber-200 text-purple-950 font-bold">
                    Parents Only
                  </span>
                </div>
                <div className="text-[10px] text-slate-500">
                  Ways to treat your child calmly with love, scripts, and no anger
                </div>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400" />
          </button>
        )}

        {/* 1. My Mood */}
        <button
          id="profile-my-mood-btn"
          onClick={onOpenMoodHistory}
          className="w-full p-3.5 text-left flex items-center justify-between hover:bg-slate-50 transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <User className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-slate-800">My Mood & History</div>
              <div className="text-[10px] text-slate-400">View personal entries & trends</div>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-400" />
        </button>

        {/* 2. My Privacy Controls */}
        <button
          id="profile-privacy-btn"
          onClick={onOpenPrivacyModal}
          className="w-full p-3.5 text-left flex items-center justify-between hover:bg-slate-50 transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Shield className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-slate-800">My Privacy Controls</div>
              <div className="text-[10px] text-slate-400">Manage what family members can see</div>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-400" />
        </button>

        {/* 3. Calendar Connection (OAuth) */}
        <button
          id="profile-calendar-btn"
          onClick={onOpenOAuthModal}
          className="w-full p-3.5 text-left flex items-center justify-between hover:bg-slate-50 transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <CalendarIcon className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-slate-800">Calendar Connection (OAuth)</div>
              <div className="text-[10px] text-slate-400">
                {activeMember.calendar.isConnected ? 'Connected securely' : 'Not connected'}
              </div>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-400" />
        </button>

        {/* 4. Student Competition & ML Kit Transparency Report */}
        <button
          id="profile-competition-report-btn"
          onClick={onOpenMLKitReport}
          className="w-full p-3.5 text-left flex items-center justify-between hover:bg-purple-50/50 transition-colors bg-purple-50/20"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Award className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-purple-950 flex items-center gap-1.5">
                <span>Competition & ML Kit Dossier</span>
                <span className="text-[9px] px-1.5 py-0.2 rounded bg-amber-200 text-amber-900 font-bold">
                  SMAC
                </span>
              </div>
              <div className="text-[10px] text-slate-500">
                Tech architecture, prompts, and disclosures
              </div>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-400" />
        </button>

        {/* 5. Family Admin & Role Control */}
        {onOpenAdminModal && (
          <button
            id="profile-admin-setup-btn"
            onClick={onOpenAdminModal}
            className="w-full p-3.5 text-left flex items-center justify-between hover:bg-slate-50 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center">
                <Settings className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-bold text-slate-800">Family Admin & Roster Setup</div>
                <div className="text-[10px] text-slate-400">Manage guardian controls and add members</div>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400" />
          </button>
        )}

        {/* 6. Sign Out / Switch Account */}
        {onSignOut && (
          <button
            id="profile-signout-btn"
            onClick={onSignOut}
            className="w-full p-3.5 text-left flex items-center justify-between hover:bg-rose-50/50 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
                <LogOut className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-bold text-rose-600">Sign Out / Switch Family</div>
                <div className="text-[10px] text-slate-400">Return to Google sign-in & hub choice</div>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-rose-300" />
          </button>
        )}
      </section>

      {/* App Version & Mission Quote */}
      <section className="text-center py-2 space-y-1">
        <p className="text-[11px] text-purple-900 font-medium italic">
          "Silah doesn't replace family conversations. It helps families have them."
        </p>
        <p className="text-[10px] text-slate-400">
          Silah v1.0 • Android Mobile Edition • Google ML Kit On-Device AI
        </p>
      </section>
    </div>
  );
};
