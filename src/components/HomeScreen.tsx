import React, { useState } from 'react';
import {
  Info,
  Heart,
  Calendar as CalendarIcon,
  Gift,
  Sun,
  MessageSquareHeart,
  Smile,
  Users,
  Bot,
  ChevronRight,
  ShieldAlert,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Check,
  Send,
  Lock,
  Compass,
  AlertTriangle,
  Copy,
  Palette,
} from 'lucide-react';
import {
  Family,
  FamilyMember,
  FamilyEvent,
  WeeklyChallenge,
  Activity,
  ChildAIInteractionSummary,
} from '../types';
import { NightHouseIllustration } from './NightHouseIllustration';
import { FamilyMemojiAvatar } from './FamilyMemojiAvatar';
import { CustomizeAvatarModal } from './CustomizeAvatarModal';

interface HomeScreenProps {
  family: Family;
  activeMember: FamilyMember;
  allMembers: FamilyMember[];
  upcomingEvents: FamilyEvent[];
  weeklyChallenge: WeeklyChallenge;
  todaySuggestion: Activity;
  guidanceSummary?: ChildAIInteractionSummary;
  onOpenHarmonyReport: () => void;
  onOpenMoodDashboard: () => void;
  onOpenCalendar: () => void;
  onSelectEvent: (event: FamilyEvent) => void;
  onOpenBridge: () => void;
  onOpenMoodCheck: () => void;
  onOpenActivities: () => void;
  onOpenAssistant: () => void;
  onOpenChallengeDetails: () => void;
  onStartActivity: (activity: Activity) => void;
  onOpenSafeConnect?: () => void;
  onOpenFamilyAdmin?: () => void;
  onOpenFeatureGuide?: () => void;
  onProposeOutingToParents?: (title: string) => void;
  onTriggerKidChatToParentGuidance?: (situation: string) => void;
  onUpdateMemberAvatar?: (memberId: string, updates: Partial<FamilyMember>) => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  family,
  activeMember,
  allMembers,
  upcomingEvents,
  weeklyChallenge,
  todaySuggestion,
  onOpenHarmonyReport,
  onOpenMoodDashboard,
  onOpenCalendar,
  onSelectEvent,
  onOpenBridge,
  onOpenMoodCheck,
  onOpenActivities,
  onOpenAssistant,
  onOpenChallengeDetails,
  onStartActivity,
  onOpenSafeConnect,
  onOpenFamilyAdmin,
  onOpenFeatureGuide,
  onProposeOutingToParents,
  guidanceSummary,
  onTriggerKidChatToParentGuidance,
  onUpdateMemberAvatar,
}) => {
  const isParent = activeMember.role === 'Parent';

  const [proposedOutingMsg, setProposedOutingMsg] = useState('');
  const [parentApprovedOuting, setParentApprovedOuting] = useState(false);
  const [customizingMember, setCustomizingMember] = useState<FamilyMember | null>(null);
  const [copiedCode, setCopiedCode] = useState(false);

  // Time-aware greeting
  const currentHour = new Date().getHours();
  const greetingText =
    currentHour < 12 ? 'Good morning,' : currentHour < 17 ? 'Good afternoon,' : 'Good evening,';

  // Harmony gauge calculations (82%)
  const harmonyScore = family.harmonyScore || 82;
  const radius = 28;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (harmonyScore / 100) * circumference;

  // Filter 2 upcoming events to match the screenshot items
  const dinnerEvent =
    upcomingEvents.find(
      (e) =>
        e.title.toLowerCase().includes('dinner') ||
        e.category === 'meal'
    ) || {
      id: 'dinner-tonight',
      title: 'Dinner Tonight',
      date: 'Today',
      startTime: '7:30 PM',
      location: 'At Home',
    };

  const birthdayEvent =
    upcomingEvents.find(
      (e) =>
        e.title.toLowerCase().includes('birthday') ||
        e.category === 'celebration'
    ) || {
      id: 'dad-bday',
      title: "Dad's Birthday",
      date: 'In 2 days',
      startTime: 'May 15',
      location: 'Family Dining',
    };

  return (
    <div className="flex-1 overflow-y-auto px-4 py-3 space-y-4 text-slate-800">
      {/* 1. GREETING & NIGHT HOUSE SCENE (Direct Match with Screenshot) */}
      <div className="flex items-center justify-between pt-1">
        <div className="space-y-0.5">
          <div className="flex items-center gap-1.5">
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
              {greetingText}
            </h1>
          </div>
          <div className="text-2xl font-bold text-[#7c3aed] flex items-center gap-1.5">
            <span>{activeMember.name || 'Family Member'}</span>
            <span className="text-2xl">👋</span>
          </div>
          <div className="flex items-center gap-2 pt-0.5">
            <span className="text-[11px] font-bold text-purple-900 bg-purple-100/90 border border-purple-200/70 px-2 py-0.5 rounded-lg">
              {family.name || 'Family Hub'}
            </span>
            <span className="text-[10px] text-slate-500 font-mono bg-white border border-slate-200 px-1.5 py-0.5 rounded-md">
              Code: {family.inviteCode}
            </span>
          </div>
          <p className="text-xs text-slate-500 font-normal pt-0.5">
            Here's what's happening with your family today.
          </p>
        </div>

        {/* Night house with crescent moon & warm yellow windows */}
        <NightHouseIllustration className="w-32 h-24 -mr-1" />
      </div>

      {/* 2. FAMILY HARMONY CARD (82%) */}
      <div
        id="family-harmony-card"
        onClick={onOpenHarmonyReport}
        className="bg-white rounded-3xl p-5 shadow-[0_2px_12px_rgba(0,0,0,0.03)] border border-purple-50 flex items-center justify-between cursor-pointer hover:shadow-md transition-all"
      >
        <div className="space-y-2 flex-1 pr-4">
          <div className="flex items-center gap-1.5 text-slate-700">
            <span className="text-sm font-bold text-slate-800">Family Harmony</span>
            <Info className="w-3.5 h-3.5 text-slate-400 hover:text-slate-600" />
          </div>

          <div className="text-4xl font-extrabold text-[#7c3aed] tracking-tight">
            {harmonyScore}%
          </div>

          <p className="text-xs text-slate-500 font-medium">
            Great job! Keep it up 💜
          </p>

          {/* Progress bar matching purple line in screenshot */}
          <div className="w-full max-w-[180px] h-2 bg-[#ede9fe] rounded-full overflow-hidden">
            <div
              className="h-full bg-[#7c3aed] rounded-full transition-all duration-700"
              style={{ width: `${harmonyScore}%` }}
            />
          </div>
        </div>

        {/* Circular Progress Gauge with Heart inside */}
        <div className="relative w-20 h-20 shrink-0 flex items-center justify-center">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 72 72">
            {/* Background ring */}
            <circle
              cx="36"
              cy="36"
              r={radius}
              stroke="#ede9fe"
              strokeWidth="6"
              fill="transparent"
            />
            {/* Foreground filled purple ring */}
            <circle
              cx="36"
              cy="36"
              r={radius}
              stroke="#7c3aed"
              strokeWidth="6"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              fill="transparent"
              className="transition-all duration-1000"
            />
          </svg>

          {/* Heart in center of circle */}
          <div className="absolute inset-0 flex items-center justify-center">
            <Heart className="w-7 h-7 text-[#7c3aed] fill-[#a78bfa]" />
          </div>
        </div>
      </div>

      {/* 4. FAMILY MOOD TODAY - Shows ONLY actual family members */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h2 className="text-sm font-bold text-slate-900">Family Mood Today</h2>
            <span className="text-[10px] bg-purple-100 text-purple-800 font-bold px-2 py-0.5 rounded-full">
              {allMembers.length} {allMembers.length === 1 ? 'Member' : 'Members'}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCustomizingMember(activeMember)}
              className="flex items-center gap-1 text-xs font-semibold text-purple-700 hover:text-purple-900 bg-purple-50 hover:bg-purple-100 px-2 py-1 rounded-lg border border-purple-200 transition-colors cursor-pointer"
              title="Customize your avatar"
            >
              <Palette className="w-3.5 h-3.5" />
              <span>Customize</span>
            </button>
            <button
              id="view-all-moods-btn"
              onClick={onOpenMoodDashboard}
              className="text-xs font-semibold text-[#7c3aed] hover:text-[#6d28d9] hover:underline cursor-pointer"
            >
              View All
            </button>
          </div>
        </div>

        {/* Real Family Members Avatars (Dynamic, no phantom default members) */}
        <div className="flex items-center gap-3 overflow-x-auto pb-1 px-1">
          {allMembers.map((member) => {
            const isMe = member.id === activeMember.id;
            const moodBadge: 'happy' | 'neutral' | 'calm' | 'sad' =
              member.currentMood === 'Great' || member.currentMood === 'Good'
                ? 'happy'
                : member.currentMood === 'Okay'
                ? 'calm'
                : member.currentMood === 'Low' || member.currentMood === 'Stressed'
                ? 'sad'
                : 'neutral';

            return (
              <div
                key={member.id}
                className="flex flex-col items-center gap-1.5 cursor-pointer hover:opacity-90 transition-all shrink-0 group"
                onClick={() => {
                  if (isMe) {
                    setCustomizingMember(member);
                  } else {
                    onOpenMoodDashboard();
                  }
                }}
              >
                <div className="relative">
                  <FamilyMemojiAvatar
                    memberId={member.id}
                    name={member.name}
                    role={member.role}
                    moodBadge={moodBadge}
                    size="md"
                    customAvatarType={member.customAvatarType}
                    customAvatarIcon={member.customAvatarIcon}
                    customMemojiPreset={member.customMemojiPreset}
                    avatarColor={member.avatarColor}
                  />
                  {isMe && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setCustomizingMember(member);
                      }}
                      className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-purple-700 text-white flex items-center justify-center text-[8px] shadow-xs hover:scale-110 transition-transform"
                      title="Customize Avatar"
                    >
                      ✎
                    </button>
                  )}
                </div>
                <div className="text-center">
                  <div className={`text-xs font-medium truncate max-w-[70px] ${isMe ? 'font-bold text-purple-700' : 'text-slate-700'}`}>
                    {isMe ? `${member.name} (You)` : member.name}
                  </div>
                  <div className="text-[10px] text-slate-400">
                    {member.currentMood || 'Good'}
                  </div>
                </div>
              </div>
            );
          })}

          {/* Invite Code Pill / Button to add real members to family */}
          <button
            onClick={() => {
              if (onOpenFamilyAdmin) {
                onOpenFamilyAdmin();
              } else if (family?.inviteCode) {
                navigator.clipboard?.writeText(family.inviteCode);
                setCopiedCode(true);
                setTimeout(() => setCopiedCode(false), 2000);
              }
            }}
            className="flex flex-col items-center gap-1.5 shrink-0 hover:opacity-90 transition-all p-1 cursor-pointer"
            title={`Family Code: ${family.inviteCode}`}
          >
            <div className="w-14 h-14 rounded-full border-2 border-dashed border-purple-300 bg-purple-50/60 hover:bg-purple-100 flex flex-col items-center justify-center text-purple-600 transition-colors">
              <span className="text-lg font-bold leading-none">+</span>
              <span className="text-[9px] font-bold">Invite</span>
            </div>
            <span className="text-[10px] font-semibold text-purple-700">
              {copiedCode ? 'Copied!' : 'Code'}
            </span>
          </button>
        </div>
      </div>

      {/* 5. TWO-COLUMN ROW: UPCOMING EVENTS & TODAY'S SUGGESTION */}
      <div className="grid grid-cols-2 gap-3">
        {/* Left Column: Upcoming Events */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-slate-900">Upcoming Events</h3>
            <button
              onClick={onOpenCalendar}
              className="text-[11px] font-semibold text-[#7c3aed] hover:underline cursor-pointer"
            >
              See All
            </button>
          </div>

          <div className="bg-white rounded-3xl p-3.5 shadow-[0_2px_10px_rgba(0,0,0,0.02)] border border-purple-50 space-y-3">
            {/* Event 1: Dinner Tonight */}
            <div
              className="flex items-center gap-2.5 cursor-pointer hover:opacity-80 transition-opacity"
              onClick={onOpenCalendar}
            >
              <div className="w-9 h-9 rounded-2xl bg-purple-100/90 text-[#7c3aed] flex items-center justify-center shrink-0 border border-purple-200/60">
                <CalendarIcon className="w-4 h-4" />
              </div>
              <div className="min-w-0 flex-1">
                <h4 className="text-xs font-bold text-slate-800 truncate">
                  {dinnerEvent.title}
                </h4>
                <p className="text-[10px] text-slate-400 truncate">
                  {dinnerEvent.startTime} • {dinnerEvent.location || 'At Home'}
                </p>
              </div>
            </div>

            {/* Event 2: Dad's Birthday */}
            <div
              className="flex items-center gap-2.5 cursor-pointer hover:opacity-80 transition-opacity"
              onClick={onOpenCalendar}
            >
              <div className="w-9 h-9 rounded-2xl bg-pink-100/90 text-pink-500 flex items-center justify-center shrink-0 border border-pink-200/60">
                <Gift className="w-4 h-4" />
              </div>
              <div className="min-w-0 flex-1">
                <h4 className="text-xs font-bold text-slate-800 truncate">
                  {birthdayEvent.title}
                </h4>
                <p className="text-[10px] text-slate-400 truncate">
                  {birthdayEvent.date} • {birthdayEvent.startTime}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Today's Suggestion */}
        <div className="space-y-2">
          <h3 className="text-xs font-bold text-slate-900 opacity-0">Suggestion</h3>

          <div className="bg-[#fffdf2] rounded-3xl p-3.5 shadow-[0_2px_10px_rgba(0,0,0,0.02)] border border-amber-100/80 flex flex-col justify-between h-[134px]">
            <div>
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-xl bg-amber-100 flex items-center justify-center text-amber-500">
                  <Sun className="w-4 h-4 fill-amber-400" />
                </div>
                <h4 className="text-xs font-bold text-slate-800">
                  Today's Suggestion
                </h4>
              </div>

              <p className="text-[11px] text-slate-600 leading-snug mt-1.5">
                Spend 15 minutes talking together.
              </p>
            </div>

            <button
              onClick={() => onStartActivity(todaySuggestion)}
              className="w-full py-1.5 px-3 rounded-xl bg-[#7c3aed] hover:bg-[#6d28d9] text-white text-xs font-semibold shadow-xs active:scale-95 transition-all text-center cursor-pointer"
            >
              Start Activity
            </button>
          </div>
        </div>
      </div>

      {/* 6. RECOMMENDED FAMILY OUTINGS & KID WISHLIST */}
      <div className="p-3.5 rounded-3xl bg-white border border-purple-50 shadow-[0_2px_10px_rgba(0,0,0,0.02)] space-y-2.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <Compass className="w-4 h-4 text-purple-700" />
            <h3 className="text-xs font-bold text-slate-900">
              {isParent ? 'Kid Outing Proposals & Approval Queue' : 'Recommended Hangouts & Outings'}
            </h3>
          </div>
          <button
            onClick={onOpenActivities}
            className="text-[11px] font-semibold text-[#7c3aed] hover:underline cursor-pointer"
          >
            Explore All
          </button>
        </div>

        {isParent ? (
          /* Parent Outing Approval View */
          <div className="p-2.5 bg-indigo-50/70 rounded-2xl border border-indigo-100 flex items-center justify-between text-xs">
            <div className="space-y-0.5">
              <div className="font-bold text-indigo-950 flex items-center gap-1.5">
                <span>Laser Tag & Board Games</span>
                <span className="text-[9px] bg-purple-200 text-purple-800 px-1.5 py-0.2 rounded font-semibold">
                  Child Proposed
                </span>
              </div>
              <div className="text-[10px] text-indigo-700">
                Saturday 4:00 PM • Matches everyone's Google Calendar free slot
              </div>
            </div>

            <button
              onClick={() => {
                setParentApprovedOuting(true);
                setTimeout(() => setParentApprovedOuting(false), 3000);
              }}
              disabled={parentApprovedOuting}
              className={`px-3 py-1.5 rounded-xl font-bold text-xs transition-all cursor-pointer ${
                parentApprovedOuting
                  ? 'bg-emerald-600 text-white'
                  : 'bg-purple-700 hover:bg-purple-800 text-white shadow-xs active:scale-95'
              }`}
            >
              {parentApprovedOuting ? 'Synced to Google!' : 'Approve & Sync'}
            </button>
          </div>
        ) : (
          /* Kid Outing Proposal Buttons */
          <div className="space-y-2 text-xs">
            <p className="text-[11px] text-slate-500">
              Pick a fun place you love! We'll quietly suggest it to Dad & Mom for this weekend:
            </p>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => {
                  setProposedOutingMsg('Suggested VR Escape Room to Dad & Mom!');
                  if (onProposeOutingToParents) onProposeOutingToParents('VR Escape Room');
                  setTimeout(() => setProposedOutingMsg(''), 2500);
                }}
                className="p-2 bg-purple-50 hover:bg-purple-100 rounded-2xl border border-purple-100 text-left space-y-0.5 transition-all cursor-pointer"
              >
                <div className="font-bold text-purple-950">🎮 VR Escape Room</div>
                <div className="text-[10px] text-purple-600">Indoor • Teen favorite</div>
              </button>

              <button
                type="button"
                onClick={() => {
                  setProposedOutingMsg('Suggested Boba Tea Lounge to Dad & Mom!');
                  if (onProposeOutingToParents) onProposeOutingToParents('Boba Lounge');
                  setTimeout(() => setProposedOutingMsg(''), 2500);
                }}
                className="p-2 bg-pink-50 hover:bg-pink-100 rounded-2xl border border-pink-100 text-left space-y-0.5 transition-all cursor-pointer"
              >
                <div className="font-bold text-pink-950">🧋 Boba Tea Lounge</div>
                <div className="text-[10px] text-pink-600">Casual • Fun vibe</div>
              </button>
            </div>

            {proposedOutingMsg && (
              <div className="text-[11px] text-emerald-700 font-bold text-center bg-emerald-50 p-1.5 rounded-xl">
                {proposedOutingMsg}
              </div>
            )}
          </div>
        )}
      </div>

      {/* 7. QUICK ACTIONS (5 Items Row) */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
            Quick Actions
          </h3>
          {onOpenFeatureGuide && (
            <button
              onClick={onOpenFeatureGuide}
              className="text-[10px] font-bold text-purple-700 hover:underline flex items-center gap-1 cursor-pointer"
            >
              <span>📖 Button Guide</span>
            </button>
          )}
        </div>

        <div className="grid grid-cols-5 gap-2 text-center">
          {/* 1. Tell Someone Something */}
          <button
            type="button"
            onClick={onOpenBridge}
            className="flex flex-col items-center gap-1.5 group cursor-pointer"
          >
            <div className="w-12 h-12 rounded-2xl bg-[#7c3aed] group-hover:bg-[#6d28d9] text-white flex items-center justify-center shadow-md shadow-purple-600/20 group-hover:scale-105 active:scale-95 transition-all relative">
              <MessageSquareHeart className="w-6 h-6" />
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-amber-400 rounded-full ring-2 ring-[#f8f6fb]" />
            </div>
            <span className="text-[10px] font-semibold text-purple-950 leading-tight">
              Tell Someone Something
            </span>
          </button>

          {/* 2. Mood Check */}
          <button
            type="button"
            onClick={onOpenMoodCheck}
            className="flex flex-col items-center gap-1.5 group cursor-pointer"
          >
            <div className="w-12 h-12 rounded-2xl bg-white border border-purple-100 group-hover:border-purple-200 text-rose-500 flex items-center justify-center shadow-xs group-hover:scale-105 active:scale-95 transition-all">
              <Heart className="w-6 h-6 fill-rose-500/20 stroke-[2]" />
            </div>
            <span className="text-[10px] font-medium text-slate-700 leading-tight">
              Mood Check
            </span>
          </button>

          {/* 3. Calendar */}
          <button
            type="button"
            onClick={onOpenCalendar}
            className="flex flex-col items-center gap-1.5 group cursor-pointer"
          >
            <div className="w-12 h-12 rounded-2xl bg-white border border-purple-100 group-hover:border-purple-200 text-emerald-600 flex items-center justify-center shadow-xs group-hover:scale-105 active:scale-95 transition-all">
              <CalendarIcon className="w-6 h-6 stroke-[2]" />
            </div>
            <span className="text-[10px] font-medium text-slate-700 leading-tight">
              Calendar
            </span>
          </button>

          {/* 4. Activities */}
          <button
            type="button"
            onClick={onOpenActivities}
            className="flex flex-col items-center gap-1.5 group cursor-pointer"
          >
            <div className="w-12 h-12 rounded-2xl bg-white border border-purple-100 group-hover:border-purple-200 text-blue-500 flex items-center justify-center shadow-xs group-hover:scale-105 active:scale-95 transition-all">
              <Users className="w-6 h-6 stroke-[2]" />
            </div>
            <span className="text-[10px] font-medium text-slate-700 leading-tight">
              Activities
            </span>
          </button>

          {/* 5. AI Assistant */}
          <button
            type="button"
            onClick={onOpenAssistant}
            className="flex flex-col items-center gap-1.5 group cursor-pointer"
          >
            <div className="w-12 h-12 rounded-2xl bg-white border border-purple-100 group-hover:border-purple-200 text-[#7c3aed] flex items-center justify-center shadow-xs group-hover:scale-105 active:scale-95 transition-all">
              <Bot className="w-6 h-6 stroke-[2]" />
            </div>
            <span className="text-[10px] font-medium text-slate-700 leading-tight">
              AI Assistant
            </span>
          </button>
        </div>
      </div>

      {/* 8. WEEKLY CHALLENGE */}
      <div
        onClick={onOpenChallengeDetails}
        className="bg-white rounded-3xl p-3.5 shadow-[0_2px_10px_rgba(0,0,0,0.02)] border border-purple-50 flex items-center justify-between cursor-pointer hover:bg-slate-50/80 transition-all"
      >
        <div className="flex items-center gap-3 flex-1 pr-2">
          {/* Green Users Icon Box */}
          <div className="w-10 h-10 rounded-2xl bg-[#dcfce7] text-[#16a34a] flex items-center justify-center shrink-0">
            <Users className="w-5 h-5" />
          </div>

          <div className="flex-1 space-y-1">
            <h4 className="text-xs font-bold text-slate-800">
              {weeklyChallenge.title || 'Complete dinner together'}
            </h4>

            {/* Green progress bar with 70% label */}
            <div className="flex items-center gap-2">
              <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#22c55e] rounded-full"
                  style={{ width: `${weeklyChallenge.progressPercentage || 70}%` }}
                />
              </div>
              <span className="text-[10px] font-bold text-slate-500">
                {weeklyChallenge.progressPercentage || 70}%
              </span>
            </div>
          </div>
        </div>

        <ChevronRight className="w-5 h-5 text-slate-400 shrink-0" />
      </div>

      {/* Customize Avatar Modal */}
      {customizingMember && (
        <CustomizeAvatarModal
          isOpen={!!customizingMember}
          member={customizingMember}
          onClose={() => setCustomizingMember(null)}
          onSaveAvatar={(memberId, updates) => {
            if (onUpdateMemberAvatar) {
              onUpdateMemberAvatar(memberId, updates);
            }
          }}
        />
      )}
    </div>
  );
};
