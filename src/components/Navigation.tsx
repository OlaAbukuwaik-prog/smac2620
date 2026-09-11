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
    <header className="px-4 py-2.5 bg-[#f8f6fb] flex items-center justify-between sticky top-0 z-20 border-b border-purple-100/40">
      <div className="flex items-center gap-2">
        <button
          id="top-menu-btn"
          onClick={onOpenMenuDrawer}
          className="p-1.5 rounded-xl text-slate-800 hover:bg-purple-100 active:scale-95 transition-all cursor-pointer"
          aria-label="Menu"
        >
          <Menu className="w-5 h-5 text-slate-800 stroke-[2.2]" />
        </button>
      </div>

      <div className="flex items-center gap-2">
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
