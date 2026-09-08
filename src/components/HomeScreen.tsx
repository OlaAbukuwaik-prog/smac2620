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
} from 'lucide-react';
import {
  Family,
  FamilyMember,
  FamilyEvent,
  WeeklyChallenge,
  Activity,
} from '../types';
import { NightHouseIllustration } from './NightHouseIllustration';
import { FamilyMemojiAvatar } from './FamilyMemojiAvatar';

interface HomeScreenProps {
  family: Family;
  activeMember: FamilyMember;
  allMembers: FamilyMember[];
  upcomingEvents: FamilyEvent[];
  weeklyChallenge: WeeklyChallenge;
  todaySuggestion: Activity;
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
}) => {
  const isParent = activeMember.role === 'Parent';

  // Kid AI Confidant interactive state
  const [kidChatInput, setKidChatInput] = useState('');
  const [kidActiveConversation, setKidActiveConversation] = useState<{
    userText: string;
    aiResponse: string;
    parentCoachingPreview: string;
  } | null>({
    userText: 'I made a difficult mistake today and I am terrified my parents will be angry and react harshly...',
    aiResponse:
      'Take a deep, slow breath. You are completely safe here. Making a mistake is a normal part of learning. We are going to protect your communication space. The AI will prepare your parents with a calm de-escalation protocol so you can discuss this with empathy and problem-solving rather than anger.',
    parentCoachingPreview:
      "💡 AI Guidance for Parents: 'Your child chose to be honest about a mistake instead of hiding it. Welcome this transparency with calm reassurance. Listen first before problem-solving.'",
  });

  const [proposedOutingMsg, setProposedOutingMsg] = useState('');
  const [parentApprovedOuting, setParentApprovedOuting] = useState(false);

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

  const handleKidQuickVent = (situation: string, fear: string) => {
    setKidActiveConversation({
      userText: `${situation} (${fear})`,
      aiResponse: `I hear you loud and clear. Take a breath—you are not in danger. You did the hardest part by acknowledging it. We are shielding you, and we will coach your parents step-by-step so they speak to you with warmth and no shouting.`,
      parentCoachingPreview: `💡 AI Guidance prepared for Dad & Mom: 'Your child is coming forward about a mistake. Respond with calm praise for their honesty. Under no circumstances yell or impose immediate punishment.'`,
    });
  };

  const handleKidSubmitCustomVent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!kidChatInput.trim()) return;
    setKidActiveConversation({
      userText: kidChatInput,
      aiResponse: `Thank you for trusting me with this. You are safe here. We will prepare your parents with a calm nervous-system reset before they speak to you, ensuring they react with understanding and constructive help.`,
      parentCoachingPreview: `💡 AI Guidance prepared for Dad & Mom: 'Your child shared a vulnerable situation. Approach them with love, listen without interrupting, and solve it together.'`,
    });
    setKidChatInput('');
  };

  return (
    <div className="flex-1 overflow-y-auto px-4 py-3 space-y-4 text-slate-800">
      {/* 1. GREETING & NIGHT HOUSE SCENE (Direct Match with Screenshot) */}
      <div className="flex items-center justify-between pt-1">
        <div className="space-y-0.5">
          <div className="flex items-center gap-1.5">
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
              Good evening,
            </h1>
            {isParent && (
              <span className="text-[10px] bg-indigo-100 text-indigo-800 font-bold px-2 py-0.5 rounded-full">
                Parent Control
              </span>
            )}
            {!isParent && (
              <span className="text-[10px] bg-violet-100 text-violet-800 font-bold px-2 py-0.5 rounded-full">
                Safe Haven
              </span>
            )}
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
            {isParent
              ? 'Guardian Dashboard: Overseeing family harmony and de-escalated communication.'
              : "Here's what's happening with your family today."}
          </p>
        </div>

        {/* Night house with crescent moon & warm yellow windows */}
        <NightHouseIllustration className="w-32 h-24 -mr-1" />
      </div>

      {/* 2. ROLE-SPECIFIC CORE HERO SECTION */}
      {isParent ? (
        /* ================= PARENT VIEW (FATHER & MOTHER CONTROL CENTER) ================= */
        <div className="p-4 rounded-3xl bg-gradient-to-r from-indigo-950 via-slate-900 to-purple-950 text-white shadow-md relative overflow-hidden border border-indigo-700/50 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="p-1 rounded-lg bg-indigo-400/20 text-indigo-300 border border-indigo-400/30">
                <ShieldCheck className="w-4 h-4" />
              </span>
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-200">
                Parent Guardian Control Center
              </span>
            </div>
            <button
              onClick={onOpenFamilyAdmin}
              className="text-[10px] bg-white/15 hover:bg-white/25 px-2.5 py-1 rounded-xl text-white font-semibold flex items-center gap-1 transition-all cursor-pointer"
            >
              <span>Manage Family</span>
              <ChevronRight className="w-3 h-3" />
            </button>
          </div>

          {/* Pending Safe Haven De-escalation Alert */}
          <div className="p-3 rounded-2xl bg-amber-500/15 border border-amber-400/30 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-amber-300 flex items-center gap-1.5">
                <ShieldAlert className="w-4 h-4 text-amber-400" />
                <span>Pending De-escalation Briefing from Child</span>
              </span>
              <span className="text-[9px] bg-amber-400 text-purple-950 font-bold px-1.5 py-0.2 rounded">
                Action Required
              </span>
            </div>
            <p className="text-xs text-amber-100 leading-relaxed">
              Your child needs to tell you about a difficult situation and is scared of an angry reaction. The AI has prepared a <strong>calming script and 5-second reset</strong> so you can solve this together with reassurance.
            </p>
            <button
              onClick={onOpenBridge}
              className="w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-amber-400 to-amber-300 hover:from-amber-300 hover:to-amber-200 text-purple-950 font-bold text-xs shadow-md flex items-center justify-center gap-1.5 transition-all cursor-pointer active:scale-95"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Open Parent Guidance Hub (Insights from Kid Chats)</span>
              <ArrowRight className="w-3.5 h-3.5 ml-0.5" />
            </button>
          </div>

          {/* Google Calendar Sync & Family Status */}
          <div className="flex items-center justify-between pt-1 border-t border-white/10 text-xs">
            <div className="flex items-center gap-2 text-purple-200">
              <CalendarIcon className="w-3.5 h-3.5 text-emerald-400" />
              <span>Google Calendar: 4 Accounts Synced</span>
            </div>
            <button
              onClick={onOpenCalendar}
              className="text-emerald-300 hover:underline font-semibold text-[11px] cursor-pointer"
            >
              View Free Slots →
            </button>
          </div>
        </div>
      ) : (
        /* ================= KID / TEENAGER VIEW (SAFE HAVEN & AI CONFIDANT) ================= */
        <div className="p-4 rounded-3xl bg-gradient-to-r from-[#2e1065] via-[#3b0764] to-[#1e1b4b] text-white shadow-md relative overflow-hidden border border-purple-800/40 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="p-1 rounded-lg bg-amber-400/20 text-amber-300 border border-amber-400/30">
                <ShieldAlert className="w-4 h-4" />
              </span>
              <span className="text-xs font-bold uppercase tracking-wider text-amber-300">
                Future AI Connect • Safe Haven
              </span>
            </div>
            <span className="text-[10px] bg-white/10 px-2 py-0.5 rounded-full text-purple-200 font-semibold">
              Harm Prevention AI
            </span>
          </div>

          <div className="space-y-1">
            <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
              <span>Afraid of your parents' reaction?</span>
              <Heart className="w-4 h-4 text-rose-400 fill-rose-400" />
            </h3>
            <p className="text-xs text-purple-200 leading-relaxed">
              Talk safely to your AI confidant. We will comfort you and coach your parents how to react with warmth <strong>without screaming, humiliating, or harming you</strong>.
            </p>
          </div>

          {/* Quick Confession Chips */}
          <div className="space-y-1.5">
            <span className="text-[10px] font-bold uppercase tracking-wider text-purple-300">
              Quick Situations You Can Tap:
            </span>
            <div className="flex flex-wrap gap-1.5">
              <button
                type="button"
                onClick={() =>
                  handleKidQuickVent(
                    'I received poor results on an exam today',
                    'Terrified my parents will be angry and punish me'
                  )
                }
                className="text-[10px] px-2.5 py-1 rounded-xl bg-white/10 hover:bg-white/20 text-purple-100 border border-white/15 active:scale-95 transition-all cursor-pointer"
              >
                📝 Academic Difficulties
              </button>
              <button
                type="button"
                onClick={() =>
                  handleKidQuickVent(
                    "I accidentally damaged an item at home",
                    'Scared of an angry shouting reaction'
                  )
                }
                className="text-[10px] px-2.5 py-1 rounded-xl bg-white/10 hover:bg-white/20 text-purple-100 border border-white/15 active:scale-95 transition-all cursor-pointer"
              >
                🛠️ Accidental Damage
              </button>
              <button
                type="button"
                onClick={() =>
                  handleKidQuickVent(
                    'Overwhelmed by daily stress and expectations',
                    'Afraid parents will misunderstand me'
                  )
                }
                className="text-[10px] px-2.5 py-1 rounded-xl bg-white/10 hover:bg-white/20 text-purple-100 border border-white/15 active:scale-95 transition-all cursor-pointer"
              >
                😰 Daily Stress
              </button>
            </div>
          </div>

          {/* Active AI Confidant Response Box */}
          {kidActiveConversation && (
            <div className="p-3 bg-white/10 rounded-2xl border border-white/15 space-y-2 text-xs">
              <div className="space-y-1">
                <div className="text-[10px] text-purple-300 font-bold uppercase tracking-wider">
                  You Confided:
                </div>
                <div className="text-purple-100 italic bg-black/20 p-2 rounded-xl text-[11px]">
                  "{kidActiveConversation.userText}"
                </div>
              </div>

              <div className="space-y-1">
                <div className="text-[10px] text-amber-300 font-bold uppercase tracking-wider flex items-center gap-1">
                  <Bot className="w-3.5 h-3.5" />
                  <span>AI Confidant Reassurance:</span>
                </div>
                <div className="text-purple-100 leading-relaxed text-[11px]">
                  {kidActiveConversation.aiResponse}
                </div>
              </div>

              <div className="p-2 rounded-xl bg-purple-950/60 border border-purple-400/30 text-[10px] text-amber-200">
                {kidActiveConversation.parentCoachingPreview}
              </div>
            </div>
          )}

          {/* Interactive Vent Input */}
          <form onSubmit={handleKidSubmitCustomVent} className="flex gap-1.5">
            <input
              type="text"
              placeholder="Or type what you are afraid to tell them..."
              value={kidChatInput}
              onChange={(e) => setKidChatInput(e.target.value)}
              className="flex-1 px-3 py-2 text-xs bg-white/10 border border-white/20 rounded-xl text-white placeholder-purple-300 focus:outline-none focus:border-amber-400"
            />
            <button
              type="submit"
              className="px-3 py-2 bg-amber-400 hover:bg-amber-300 text-purple-950 rounded-xl font-bold text-xs flex items-center justify-center transition-all cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>

          {/* Launch Gemini Confidant Chat Button */}
          <button
            id="hero-safe-connect-btn"
            type="button"
            onClick={onOpenBridge}
            className="w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-sky-500 via-indigo-600 to-purple-600 hover:from-sky-400 hover:via-indigo-500 hover:to-purple-500 text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2 active:scale-95 cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span>Open Gemini AI Confidant (Private & Safe Chat)</span>
            <ArrowRight className="w-3.5 h-3.5 ml-0.5" />
          </button>
        </div>
      )}

      {/* 3. FAMILY HARMONY CARD (82%) */}
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

      {/* 4. FAMILY MOOD TODAY */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-slate-900">Family Mood Today</h2>
          <button
            id="view-all-moods-btn"
            onClick={onOpenMoodDashboard}
            className="text-xs font-semibold text-[#7c3aed] hover:text-[#6d28d9] hover:underline cursor-pointer"
          >
            View All
          </button>
        </div>

        {/* 4 Illustrated Memoji Avatars: Father, Mother, You, Child */}
        <div className="flex items-center justify-between px-1">
          {/* Father */}
          <div
            className="flex flex-col items-center gap-1.5 cursor-pointer hover:opacity-90 transition-opacity"
            onClick={onOpenMoodDashboard}
          >
            <FamilyMemojiAvatar
              memberId="m-dad"
              name="Father"
              role="Parent"
              moodBadge="happy"
              size="md"
            />
            <span className="text-xs font-medium text-slate-700">Father</span>
          </div>

          {/* Mother */}
          <div
            className="flex flex-col items-center gap-1.5 cursor-pointer hover:opacity-90 transition-opacity"
            onClick={onOpenMoodDashboard}
          >
            <FamilyMemojiAvatar
              memberId="m-mom"
              name="Mother"
              role="Parent"
              moodBadge="happy"
              size="md"
            />
            <span className="text-xs font-medium text-slate-700">Mother</span>
          </div>

          {/* You (Active member) */}
          <div
            className="flex flex-col items-center gap-1.5 cursor-pointer hover:opacity-90 transition-opacity"
            onClick={onOpenMoodCheck}
          >
            <FamilyMemojiAvatar
              memberId={activeMember.id}
              name={activeMember.name}
              role={activeMember.role}
              moodBadge="neutral"
              size="md"
            />
            <span className="text-xs font-semibold text-[#7c3aed]">You</span>
          </div>

          {/* Child */}
          <div
            className="flex flex-col items-center gap-1.5 cursor-pointer hover:opacity-90 transition-opacity"
            onClick={onOpenMoodDashboard}
          >
            <FamilyMemojiAvatar
              memberId="m-brother"
              name="Child"
              role="Child"
              moodBadge="happy"
              size="md"
            />
            <span className="text-xs font-medium text-slate-700">Child</span>
          </div>
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
          {/* 1. Tell Someone Something (Purple Highlighted with Safe Connect) */}
          <button
            type="button"
            onClick={onOpenSafeConnect || onOpenBridge}
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
    </div>
  );
};
