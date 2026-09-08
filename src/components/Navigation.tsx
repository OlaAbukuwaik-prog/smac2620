import React from 'react';
import {
  Home,
  MessageCircle,
  Plus,
  Calendar,
  User,
  Bell,
  Menu,
  Compass,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';
import { FamilyMember, Family } from '../types';

export type TabType = 'home' | 'bridge' | 'family' | 'profile';

interface NavigationProps {
  currentTab: TabType;
  onSelectTab: (tab: TabType) => void;
  onOpenQuickMenu: () => void;
  onOpenNotifications: () => void;
  onOpenMenuDrawer: () => void;
  unreadCount: number;
  activeMember: FamilyMember;
  family?: Family;
  onOpenFeatureGuide?: () => void;
  onOpenFamilyAdmin?: () => void;
}

export const TopAppBar: React.FC<{
  onOpenNotifications: () => void;
  onOpenMenuDrawer: () => void;
  unreadCount: number;
  activeMember: FamilyMember;
  family?: Family;
  allMembers?: FamilyMember[];
  onSwitchMember?: (member: FamilyMember) => void;
  onOpenFeatureGuide?: () => void;
  onOpenFamilyAdmin?: () => void;
}> = ({
  onOpenNotifications,
  onOpenMenuDrawer,
  unreadCount,
  activeMember,
  family,
  allMembers,
  onSwitchMember,
  onOpenFeatureGuide,
  onOpenFamilyAdmin,
}) => {
  const isParent = activeMember.role === 'Parent';

  // Toggle quick switch modal/dropdown
  const [showQuickSwitch, setShowQuickSwitch] = React.useState(false);
  const [copiedCode, setCopiedCode] = React.useState(false);

  return (
    <header className="px-3 py-2 bg-[#f8f6fb] flex items-center justify-between sticky top-0 z-20 border-b border-purple-100/60 shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
      <div className="flex items-center gap-1.5">
        <button
          id="top-menu-btn"
          onClick={onOpenMenuDrawer}
          className="p-1 rounded-xl text-slate-800 hover:bg-purple-100 active:scale-95 transition-all cursor-pointer"
          aria-label="Menu"
        >
          <Menu className="w-5 h-5 text-slate-800 stroke-[2.2]" />
        </button>

        {/* Quick Role Perspective Tag */}
        <div className="relative">
          <button
            onClick={() => setShowQuickSwitch(!showQuickSwitch)}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-white hover:bg-purple-50 border border-purple-200/80 shadow-2xs text-slate-800 transition-all cursor-pointer"
            title="Tap to switch between Parent and Kid accounts"
          >
            <div
              className={`w-4 h-4 rounded-full flex items-center justify-center text-[8px] font-bold ${activeMember.avatarColor}`}
            >
              {activeMember.initials}
            </div>
            <span className="text-xs font-bold text-purple-950">{activeMember.name}</span>
            <span
              className={`text-[9px] font-bold px-1.5 py-0.2 rounded-md ${
                isParent
                  ? 'bg-indigo-100 text-indigo-800 border border-indigo-200'
                  : 'bg-amber-100 text-amber-900 border border-amber-200'
              }`}
            >
              {activeMember.role}
            </span>
          </button>

          {showQuickSwitch && allMembers && onSwitchMember && (
            <div className="absolute left-0 mt-1 w-60 bg-white rounded-2xl shadow-xl border border-purple-100 z-50 p-2 space-y-1.5 animate-in fade-in">
              {family && (
                <div className="p-2 bg-purple-50/80 rounded-xl border border-purple-100/80 space-y-1">
                  <div className="text-[10px] font-bold text-purple-950 flex items-center justify-between">
                    <span className="truncate">{family.name}</span>
                    <span className="text-[9px] bg-purple-200 text-purple-800 px-1.5 py-0.2 rounded font-mono font-bold">
                      {family.inviteCode}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-[10px] text-slate-500">
                    <span>{allMembers.length} Family Members</span>
                    <button
                      onClick={() => {
                        navigator.clipboard?.writeText(family.inviteCode);
                        setCopiedCode(true);
                        setTimeout(() => setCopiedCode(false), 2000);
                      }}
                      className="text-purple-700 hover:text-purple-900 font-bold underline cursor-pointer"
                    >
                      {copiedCode ? 'Copied code!' : 'Copy invite code'}
                    </button>
                  </div>
                </div>
              )}

              <div className="text-[9px] font-bold text-slate-400 uppercase tracking-wider px-1 pt-0.5">
                Switch Perspective:
              </div>
              <div className="space-y-0.5 max-h-48 overflow-y-auto">
                {allMembers.map((m) => (
                  <button
                    key={m.id}
                    onClick={() => {
                      onSwitchMember(m);
                      setShowQuickSwitch(false);
                    }}
                    className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-xl text-xs text-left transition-colors cursor-pointer ${
                      m.id === activeMember.id
                        ? 'bg-purple-100 text-purple-900 font-bold'
                        : 'hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <div className="flex items-center gap-1.5 truncate">
                      <div
                        className={`w-4 h-4 rounded-full flex items-center justify-center text-[8px] font-bold ${m.avatarColor} shrink-0`}
                      >
                        {m.initials}
                      </div>
                      <span className="truncate">{m.name}</span>
                    </div>
                    <span className="text-[9px] text-purple-700 font-semibold bg-purple-50 px-1.5 py-0.2 rounded-md shrink-0">
                      {m.role}
                    </span>
                  </button>
                ))}
              </div>

              {isParent && onOpenFamilyAdmin && (
                <button
                  onClick={() => {
                    setShowQuickSwitch(false);
                    onOpenFamilyAdmin();
                  }}
                  className="w-full text-center py-1 text-[11px] text-indigo-700 hover:text-indigo-900 font-bold border-t border-slate-100 pt-1.5 cursor-pointer block"
                >
                  + Manage / Add Members
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center gap-1.5">
        {/* App Guide Button */}
        {onOpenFeatureGuide && (
          <button
            id="top-feature-guide-btn"
            onClick={onOpenFeatureGuide}
            className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-purple-700 hover:bg-purple-800 text-white text-[11px] font-bold shadow-xs active:scale-95 transition-all cursor-pointer"
          >
            <Compass className="w-3 h-3 text-amber-300" />
            <span>Guide</span>
          </button>
        )}

        {/* Notifications */}
        <button
          id="top-notifications-btn"
          onClick={onOpenNotifications}
          className="relative p-1.5 rounded-xl text-slate-800 hover:bg-purple-100 active:scale-95 transition-all cursor-pointer"
          aria-label="Notifications"
        >
          <Bell className="w-5 h-5 text-slate-800 stroke-[2.2]" />
          {unreadCount > 0 ? (
            <span
              id="notifications-badge"
              className="absolute top-1 right-1 w-2 h-2 bg-purple-600 rounded-full ring-2 ring-[#f8f6fb]"
            />
          ) : (
            <span className="absolute top-1 right-1 w-1.5 h-1.5 bg-purple-600 rounded-full" />
          )}
        </button>
      </div>
    </header>
  );
};

export const BottomNavigation: React.FC<NavigationProps> = ({
  currentTab,
  onSelectTab,
  onOpenQuickMenu,
  activeMember,
}) => {
  const isKid = activeMember.role === 'Teenager' || activeMember.role === 'Child';

  return (
    <nav className="px-3 py-2 bg-white/95 backdrop-blur border-t border-slate-100 flex items-center justify-around sticky bottom-0 z-20 shadow-[0_-4px_20px_rgba(0,0,0,0.03)]">
      {/* HOME */}
      <button
        id="nav-home-btn"
        onClick={() => onSelectTab('home')}
        className={`flex-1 flex flex-col items-center justify-center py-1 transition-all ${
          currentTab === 'home' ? 'text-purple-700 font-bold' : 'text-slate-400 hover:text-slate-600'
        }`}
      >
        <Home className={`w-5 h-5 ${currentTab === 'home' ? 'stroke-[2.5] fill-purple-100' : 'stroke-[1.8]'}`} />
        <span className="text-[10px] mt-1 tracking-tight font-medium">Home</span>
      </button>

      {/* BRIDGE: AI CHAT (FOR KIDS) OR PARENT GUIDE (FOR PARENTS) */}
      <button
        id="nav-bridge-btn"
        onClick={() => onSelectTab('bridge')}
        className={`flex-1 flex flex-col items-center justify-center py-1 transition-all ${
          currentTab === 'bridge' ? 'text-purple-700 font-bold scale-105' : 'text-slate-400 hover:text-slate-600'
        }`}
        title={isKid ? 'Talk with Gemini AI Confidant' : 'View Parent Guidance based on Child AI Chats'}
      >
        <div className="relative">
          {isKid ? (
            <Sparkles
              className={`w-5 h-5 ${
                currentTab === 'bridge' ? 'stroke-[2.5] text-indigo-600 fill-indigo-100' : 'stroke-[1.8]'
              }`}
            />
          ) : (
            <MessageCircle
              className={`w-5 h-5 ${
                currentTab === 'bridge' ? 'stroke-[2.5] text-purple-700 fill-purple-100' : 'stroke-[1.8]'
              }`}
            />
          )}
          <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-gradient-to-r from-sky-400 to-indigo-600 rounded-full animate-pulse" />
        </div>
        <span className="text-[10px] mt-1 tracking-tight font-semibold">
          {isKid ? 'AI Chat' : 'Parent Guide'}
        </span>
      </button>

      {/* + QUICK ACTION BUTTON */}
      <div className="flex-1 flex justify-center items-center">
        <button
          id="nav-quick-add-btn"
          onClick={onOpenQuickMenu}
          className="w-12 h-12 -mt-5 rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white flex items-center justify-center shadow-lg shadow-purple-600/30 hover:scale-105 active:scale-95 transition-all"
          aria-label="Quick Actions"
        >
          <Plus className="w-7 h-7 stroke-[2.5]" />
        </button>
      </div>

      {/* FAMILY (Calendar icon matching screenshot) */}
      <button
        id="nav-family-btn"
        onClick={() => onSelectTab('family')}
        className={`flex-1 flex flex-col items-center justify-center py-1 transition-all ${
          currentTab === 'family' ? 'text-purple-700 font-bold' : 'text-slate-400 hover:text-slate-600'
        }`}
      >
        <Calendar className={`w-5 h-5 ${currentTab === 'family' ? 'stroke-[2.5] fill-purple-100' : 'stroke-[1.8]'}`} />
        <span className="text-[10px] mt-1 tracking-tight font-medium">Family</span>
      </button>

      {/* PROFILE */}
      <button
        id="nav-profile-btn"
        onClick={() => onSelectTab('profile')}
        className={`flex-1 flex flex-col items-center justify-center py-1 transition-all ${
          currentTab === 'profile' ? 'text-purple-700 font-bold' : 'text-slate-400 hover:text-slate-600'
        }`}
      >
        <User className={`w-5 h-5 ${currentTab === 'profile' ? 'stroke-[2.5] fill-purple-100' : 'stroke-[1.8]'}`} />
        <span className="text-[10px] mt-1 tracking-tight font-medium">Profile</span>
      </button>
    </nav>
  );
};
