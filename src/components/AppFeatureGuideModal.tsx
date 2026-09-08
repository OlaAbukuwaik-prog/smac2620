import React, { useState } from 'react';
import {
  X,
  Compass,
  Calendar,
  ShieldAlert,
  Heart,
  Users,
  MessageSquareHeart,
  Sparkles,
  CheckCircle2,
  Lock,
  ArrowRight,
  Sun,
  Gift,
  Bot,
  Layers,
  ChevronRight,
  Smile,
  ShieldCheck,
} from 'lucide-react';

interface AppFeatureGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSwitchPerspective?: (role: 'Parent' | 'Teenager') => void;
}

export const AppFeatureGuideModal: React.FC<AppFeatureGuideModalProps> = ({
  isOpen,
  onClose,
  onSwitchPerspective,
}) => {
  const [activeTab, setActiveTab] = useState<
    'overview' | 'buttons' | 'kidView' | 'parentView' | 'calendar' | 'safeConnect'
  >('overview');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3">
      <div className="bg-white rounded-3xl p-5 max-w-lg w-full space-y-4 shadow-2xl border border-purple-100 max-h-[92vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-purple-950 font-bold text-sm">
            <span className="p-1 rounded-xl bg-purple-100 text-purple-700">
              <Compass className="w-5 h-5" />
            </span>
            <div>
              <h2 className="text-sm font-bold text-slate-900">App Guide & Feature Catalog</h2>
              <p className="text-[10px] text-purple-700">صلة (Silah) • Architecture & Every Button Explained</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Category Navigation Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs scrollbar-none">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition-all ${
              activeTab === 'overview'
                ? 'bg-purple-700 text-white shadow-xs'
                : 'bg-purple-50 text-purple-900 hover:bg-purple-100'
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab('buttons')}
            className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition-all ${
              activeTab === 'buttons'
                ? 'bg-purple-700 text-white shadow-xs'
                : 'bg-purple-50 text-purple-900 hover:bg-purple-100'
            }`}
          >
            Home Screen & Buttons
          </button>
          <button
            onClick={() => setActiveTab('kidView')}
            className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition-all ${
              activeTab === 'kidView'
                ? 'bg-violet-700 text-white shadow-xs'
                : 'bg-violet-50 text-violet-900 hover:bg-violet-100'
            }`}
          >
            Kid's Screen (Safe Haven)
          </button>
          <button
            onClick={() => setActiveTab('parentView')}
            className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition-all ${
              activeTab === 'parentView'
                ? 'bg-indigo-700 text-white shadow-xs'
                : 'bg-indigo-50 text-indigo-900 hover:bg-indigo-100'
            }`}
          >
            Parent View (Admin Control)
          </button>
          <button
            onClick={() => setActiveTab('safeConnect')}
            className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition-all ${
              activeTab === 'safeConnect'
                ? 'bg-amber-600 text-white shadow-xs'
                : 'bg-amber-50 text-amber-900 hover:bg-amber-100'
            }`}
          >
            AI Connect & Harm Shield
          </button>
          <button
            onClick={() => setActiveTab('calendar')}
            className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition-all ${
              activeTab === 'calendar'
                ? 'bg-emerald-700 text-white shadow-xs'
                : 'bg-emerald-50 text-emerald-900 hover:bg-emerald-100'
            }`}
          >
            Google Calendar Sync
          </button>
        </div>

        {/* TAB 1: OVERVIEW */}
        {activeTab === 'overview' && (
          <div className="space-y-3 text-xs text-slate-700">
            <div className="p-3.5 bg-gradient-to-br from-purple-900 to-indigo-950 text-white rounded-2xl space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-amber-300 uppercase tracking-wider">
                  The Core Concept
                </span>
                <span className="text-[10px] bg-white/20 px-2 py-0.5 rounded-full font-semibold">
                  Dual-Role Architecture
                </span>
              </div>
              <p className="text-xs leading-relaxed text-purple-100">
                Silah (صلة) bridges parents and teenagers by resolving the single greatest family crisis:
                <strong> teenagers being afraid to tell their parents the truth when they make a mistake</strong>,
                and parents reacting with immediate anger, yelling, or harsh punishment.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              <div className="p-3 bg-purple-50 rounded-2xl border border-purple-100 space-y-1">
                <div className="font-bold text-purple-950 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-purple-600" />
                  <span>1. Father Starts First</span>
                </div>
                <p className="text-[11px] text-slate-600 leading-snug">
                  Father logs in with Google, registers family members, and sets up parental guardian controls.
                </p>
              </div>

              <div className="p-3 bg-violet-50 rounded-2xl border border-violet-100 space-y-1">
                <div className="font-bold text-violet-950 flex items-center gap-1.5">
                  <Bot className="w-4 h-4 text-violet-600" />
                  <span>2. Kid Confides in AI</span>
                </div>
                <p className="text-[11px] text-slate-600 leading-snug">
                  Teenager vents freely to their comforting AI companion with zero fear of being yelled at or punished.
                </p>
              </div>

              <div className="p-3 bg-amber-50 rounded-2xl border border-amber-100 space-y-1">
                <div className="font-bold text-amber-950 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-amber-600" />
                  <span>3. Secret Parent Bridge</span>
                </div>
                <p className="text-[11px] text-slate-600 leading-snug">
                  Without revealing the kid's private diary, AI provides parents with calming scripts and empathetic ways to connect.
                </p>
              </div>

              <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-100 space-y-1">
                <div className="font-bold text-emerald-950 flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-emerald-600" />
                  <span>4. Google Shared Sync</span>
                </div>
                <p className="text-[11px] text-slate-600 leading-snug">
                  Automated free/busy matching across Google accounts finds open times for family dinners and outings.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: HOME SCREEN & EVERY BUTTON EXPLAINED */}
        {activeTab === 'buttons' && (
          <div className="space-y-3 text-xs text-slate-700">
            <h3 className="font-bold text-slate-900 uppercase tracking-wider text-[11px]">
              Every Button & Section On The Home Screen
            </h3>

            <div className="space-y-2">
              {/* 1. Top Bar */}
              <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-2xl space-y-1">
                <div className="font-bold text-slate-900 flex items-center justify-between">
                  <span className="text-purple-700">Top App Bar</span>
                  <span className="text-[10px] text-slate-400">Header Controls</span>
                </div>
                <ul className="text-[11px] text-slate-600 space-y-1 list-disc list-inside">
                  <li><strong>Menu Icon (Left):</strong> Opens AI Assistant & Quick Navigation Drawer.</li>
                  <li><strong>Bell Icon (Right):</strong> Opens notification center with unread badges for bridge alerts, calendar reminders, and challenge updates.</li>
                  <li><strong>Top Role Switcher (Frame):</strong> 1-tap switcher between Father, Mother, Teenager, and Child.</li>
                </ul>
              </div>

              {/* 2. Greeting & Night Illustration */}
              <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-2xl space-y-1">
                <div className="font-bold text-slate-900 flex items-center justify-between">
                  <span className="text-purple-700">Greeting & Night Scene</span>
                  <span className="text-[10px] text-slate-400">Atmospheric Header</span>
                </div>
                <p className="text-[11px] text-slate-600">
                  "Good evening 👋" paired with the cozy night house illustration featuring a crescent moon and warm glowing windows, creating an emotionally calm entrance.
                </p>
              </div>

              {/* 3. Future AI Connect: Safe Haven Hero */}
              <div className="p-2.5 bg-purple-900 text-white rounded-2xl space-y-1">
                <div className="font-bold flex items-center justify-between">
                  <span className="text-amber-300">Safe Haven AI Shield Hero Button</span>
                  <span className="text-[9px] bg-white/20 px-1.5 py-0.5 rounded font-mono">Launch</span>
                </div>
                <p className="text-[11px] text-purple-200 leading-snug">
                  <strong>"Launch Harm-Prevention Shield & Parent Dossier":</strong> The primary button for kids in trouble. Opens the 5-step mediation flow that protects the child and resets parental anger before any conversation occurs.
                </p>
              </div>

              {/* 4. Family Harmony (82%) */}
              <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-2xl space-y-1">
                <div className="font-bold text-slate-900 flex items-center justify-between">
                  <span className="text-purple-700">Family Harmony Card (82%)</span>
                  <span className="text-[10px] text-slate-400">Tappable Card</span>
                </div>
                <p className="text-[11px] text-slate-600">
                  Tapping the 82% gauge opens the <strong>Harmony Analytics Modal</strong> displaying weekly trends, shared dinner counters, positive activity breakdown, and AI recommendations.
                </p>
              </div>

              {/* 5. Family Mood Today */}
              <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-2xl space-y-1">
                <div className="font-bold text-slate-900 flex items-center justify-between">
                  <span className="text-purple-700">Family Mood Avatars & "View All"</span>
                  <span className="text-[10px] text-slate-400">Mood Bar</span>
                </div>
                <p className="text-[11px] text-slate-600">
                  4 Memoji avatars (Father, Mother, Teenager, Child) with live emotion badges. Tapping any avatar or <strong>"View All"</strong> opens the <strong>Family Mood Dashboard</strong>.
                </p>
              </div>

              {/* 6. Upcoming Events & Today's Suggestion */}
              <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-2xl space-y-1">
                <div className="font-bold text-slate-900 flex items-center justify-between">
                  <span className="text-purple-700">Upcoming Events & "Start Activity"</span>
                  <span className="text-[10px] text-slate-400">Two-Column Row</span>
                </div>
                <ul className="text-[11px] text-slate-600 space-y-1 list-disc list-inside">
                  <li><strong>"See All" / Event item:</strong> Opens the Shared Google Calendar.</li>
                  <li><strong>"Start Activity" button:</strong> Immediately schedules the 15-minute conversation activity and updates family harmony.</li>
                </ul>
              </div>

              {/* 7. 5 Quick Action Buttons */}
              <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-2xl space-y-1">
                <div className="font-bold text-slate-900 flex items-center justify-between">
                  <span className="text-purple-700">The 5 Quick Action Buttons</span>
                  <span className="text-[10px] text-slate-400">Navigation Row</span>
                </div>
                <ul className="text-[11px] text-slate-600 space-y-1 list-disc list-inside">
                  <li><strong>Tell Someone Something (Purple Highlighted):</strong> Directly launches the Safe Haven Bridge.</li>
                  <li><strong>Mood Check:</strong> Opens the private mood & energy logger.</li>
                  <li><strong>Calendar:</strong> Opens Google shared family calendar.</li>
                  <li><strong>Activities:</strong> Opens categorized family outings (Indoor, Outdoor, Free, Weekend).</li>
                  <li><strong>AI Assistant:</strong> Opens the smart AI family assistant chat.</li>
                </ul>
              </div>

              {/* 8. Weekly Challenge */}
              <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-2xl space-y-1">
                <div className="font-bold text-slate-900 flex items-center justify-between">
                  <span className="text-purple-700">Weekly Challenge Banner (70%)</span>
                  <span className="text-[10px] text-slate-400">Tappable Banner</span>
                </div>
                <p className="text-[11px] text-slate-600">
                  "Complete dinner together" with progress bar. Tapping opens challenge details and allows logging completed shared meals for reward points.
                </p>
              </div>

              {/* 9. Bottom Navigation */}
              <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-2xl space-y-1">
                <div className="font-bold text-slate-900 flex items-center justify-between">
                  <span className="text-purple-700">Bottom Navigation Bar</span>
                  <span className="text-[10px] text-slate-400">Persistent Bar</span>
                </div>
                <ul className="text-[11px] text-slate-600 space-y-1 list-disc list-inside">
                  <li><strong>Home:</strong> Active dashboard view.</li>
                  <li><strong>Bridge:</strong> Guided parent-child communication wizard.</li>
                  <li><strong>Floating Center (+):</strong> Quick action menu popup with Safe Connect highlight.</li>
                  <li><strong>Family:</strong> Sub-tabs for Shared Calendar & Curated Outings.</li>
                  <li><strong>Profile:</strong> Privacy controls, invite codes, ML Kit technical dossier, Google OAuth.</li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: KID'S SCREEN (SAFE HAVEN & AI CONFIDANT) */}
        {activeTab === 'kidView' && (
          <div className="space-y-3 text-xs text-slate-700">
            <div className="p-3.5 bg-gradient-to-r from-violet-900 to-purple-950 text-white rounded-2xl space-y-2">
              <span className="text-xs font-bold text-amber-300 uppercase tracking-wider">
                Teenager & Child Psychological Comfort
              </span>
              <p className="text-xs leading-relaxed text-purple-100">
                When a Teenager or Child opens Silah, the screen transforms into an emotionally safe sanctuary.
                The primary focal point is the <strong>AI Confidant Chat</strong> where the child can speak freely without fear of judgment, screaming, or retaliation.
              </p>
            </div>

            <div className="space-y-2">
              <div className="p-3 bg-violet-50 rounded-2xl border border-violet-200 space-y-1">
                <div className="font-bold text-violet-950 flex items-center gap-1.5">
                  <Bot className="w-4 h-4 text-violet-700" />
                  <span>Interactive AI Confidant Console</span>
                </div>
                <p className="text-[11px] text-slate-600 leading-relaxed">
                  Allows the teenager to type or choose common concerns: academic stress, mistakes, friendship issues, or feeling overwhelmed. The AI validates their feelings, soothes their anxiety, and assures them that their worth is not tied to a single setback.
                </p>
              </div>

              <div className="p-3 bg-amber-50 rounded-2xl border border-amber-200 space-y-1">
                <div className="font-bold text-amber-950 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-amber-700" />
                  <span>The Invisible Parent Connection Bridge</span>
                </div>
                <p className="text-[11px] text-slate-600 leading-relaxed">
                  Without exposing the child's raw private chat logs, the AI synthesizes an empathetic guidance brief for parents. It advises: <em>"Your child is carrying intense emotional stress tonight. They need quiet reassurance and understanding."</em>
                </p>
              </div>

              <div className="p-3 bg-purple-50 rounded-2xl border border-purple-200 space-y-1">
                <div className="font-bold text-purple-950 flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-purple-700" />
                  <span>Kid Outing Wishlist & Calendar</span>
                </div>
                <p className="text-[11px] text-slate-600 leading-relaxed">
                  Kids can browse recommended spots (laser tag, cafe, escape room, board games) and tap <strong>"Suggest to Parents"</strong>, adding it to the parents' queue.
                </p>
              </div>
            </div>

            {onSwitchPerspective && (
              <button
                onClick={() => {
                  onSwitchPerspective('Teenager');
                  onClose();
                }}
                className="w-full py-2.5 rounded-xl bg-violet-700 hover:bg-violet-800 text-white font-bold text-xs shadow flex items-center justify-center gap-1.5"
              >
                <span>Switch to Teenager View Now</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        )}

        {/* TAB 4: PARENT VIEW (ADMIN CONTROL) */}
        {activeTab === 'parentView' && (
          <div className="space-y-3 text-xs text-slate-700">
            <div className="p-3.5 bg-gradient-to-r from-indigo-900 to-slate-900 text-white rounded-2xl space-y-2">
              <span className="text-xs font-bold text-amber-300 uppercase tracking-wider">
                Guardian Control Center (Father & Mother)
              </span>
              <p className="text-xs leading-relaxed text-indigo-100">
                Parents have full administrative oversight. They receive de-escalated alerts, view family calendar synchronization, manage members, and approve family outings.
              </p>
            </div>

            <div className="space-y-2">
              <div className="p-3 bg-indigo-50 rounded-2xl border border-indigo-200 space-y-1">
                <div className="font-bold text-indigo-950 flex items-center gap-1.5">
                  <ShieldAlert className="w-4 h-4 text-indigo-700" />
                  <span>De-escalated Guidance Inbox</span>
                </div>
                <p className="text-[11px] text-slate-600 leading-relaxed">
                  When a child reports fear or difficulty, parents receive a protective coaching card. Before opening, the parent undergoes a <strong>5-second nervous-system reset</strong> to eliminate reactive anger and yelling.
                </p>
              </div>

              <div className="p-3 bg-purple-50 rounded-2xl border border-purple-200 space-y-1">
                <div className="font-bold text-purple-950 flex items-center gap-1.5">
                  <Users className="w-4 h-4 text-purple-700" />
                  <span>Family Roster & Google Sync Status</span>
                </div>
                <p className="text-[11px] text-slate-600 leading-relaxed">
                  Parents can add new family members, generate invite codes, and review whose Google Accounts are actively synced for shared availability.
                </p>
              </div>

              <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-200 space-y-1">
                <div className="font-bold text-emerald-950 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                  <span>Kid Outing Request Approvals</span>
                </div>
                <p className="text-[11px] text-slate-600 leading-relaxed">
                  When kids request an activity, parents can approve with 1 tap, automatically inserting it into everyone's synced Google Calendar.
                </p>
              </div>
            </div>

            {onSwitchPerspective && (
              <button
                onClick={() => {
                  onSwitchPerspective('Parent');
                  onClose();
                }}
                className="w-full py-2.5 rounded-xl bg-indigo-700 hover:bg-indigo-800 text-white font-bold text-xs shadow flex items-center justify-center gap-1.5"
              >
                <span>Switch to Parent View Now</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        )}

        {/* TAB 5: AI CONNECT & HARM PREVENTION SHIELD */}
        {activeTab === 'safeConnect' && (
          <div className="space-y-3 text-xs text-slate-700">
            <div className="p-3.5 bg-gradient-to-r from-purple-950 via-indigo-950 to-slate-900 text-white rounded-2xl space-y-2">
              <span className="text-xs font-bold text-amber-300 uppercase tracking-wider">
                How Harm-Prevention Works
              </span>
              <p className="text-xs text-purple-200 leading-relaxed">
                When a child makes an honest mistake, their biggest fear is: <em>"My parents will react with anger or harsh punishment."</em>
              </p>
            </div>

            <div className="space-y-2">
              <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-2xl space-y-1">
                <span className="font-bold text-purple-900">Step 1: Child Honest Confession</span>
                <p className="text-[11px] text-slate-600">The child types the exact truth and selects their deepest fear (yelling, punishment, humiliation).</p>
              </div>

              <div className="p-2.5 bg-violet-50 border border-violet-200 rounded-2xl space-y-1">
                <span className="font-bold text-violet-900">Step 2: AI Shield & Validation</span>
                <p className="text-[11px] text-slate-600">The AI validates the child's courage: <em>"You are safe here. We won't let your parents see this until they are calm and coached."</em></p>
              </div>

              <div className="p-2.5 bg-amber-50 border border-amber-200 rounded-2xl space-y-1">
                <span className="font-bold text-amber-900">Step 3: 5-Second Parent Reset & Harm Checklist</span>
                <p className="text-[11px] text-slate-600">Parent must complete a mandatory breathing pause. AI displays the <strong>What NOT to Do</strong> checklist (no screaming, no physical threats, no instant groundings).</p>
              </div>

              <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-2xl space-y-1">
                <span className="font-bold text-emerald-900">Step 4: The First 60 Seconds Script</span>
                <p className="text-[11px] text-slate-600">Parent is given the exact words: <em>"Thank you for being brave enough to tell me. We will solve this together."</em></p>
              </div>

              <div className="p-2.5 bg-purple-50 border border-purple-200 rounded-2xl space-y-1">
                <span className="font-bold text-purple-900">Step 5: Fear Dissolved & Trust Restored</span>
                <p className="text-[11px] text-slate-600">Child's anxiety drops from 95% down to 8%, earning +5% Family Harmony boost.</p>
              </div>
            </div>
          </div>
        )}

        {/* TAB 6: GOOGLE CALENDAR SYNC */}
        {activeTab === 'calendar' && (
          <div className="space-y-3 text-xs text-slate-700">
            <div className="p-3.5 bg-gradient-to-r from-emerald-900 to-teal-950 text-white rounded-2xl space-y-2">
              <span className="text-xs font-bold text-emerald-300 uppercase tracking-wider">
                Google Accounts Shared Calendar Architecture
              </span>
              <p className="text-xs leading-relaxed text-emerald-100">
                Silah uses modern Google OAuth 2.0 with the Principle of Least Privilege so each family member links their existing <code>@gmail.com</code> account.
              </p>
            </div>

            <div className="space-y-2">
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-2xl space-y-1">
                <div className="font-bold text-slate-900 flex items-center justify-between">
                  <span>1. OAuth 2.0 Token Authorization</span>
                  <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full font-bold">Secure</span>
                </div>
                <p className="text-[11px] text-slate-600">
                  Users never enter their Google password into Silah. Authentication is handled via Google Identity Services, issuing a secure, revocable token.
                </p>
              </div>

              <div className="p-3 bg-slate-50 border border-slate-200 rounded-2xl space-y-1">
                <div className="font-bold text-slate-900">2. Principle of Least Privilege Scopes</div>
                <ul className="text-[11px] text-slate-600 space-y-1 list-disc list-inside">
                  <li><code>https://www.googleapis.com/auth/calendar.freebusy</code>: Reads <em>only</em> when members are busy or free. Never reads private meeting notes or titles.</li>
                  <li><code>https://www.googleapis.com/auth/calendar.events.readonly</code>: Identifies family-tagged schedule items.</li>
                  <li><code>https://www.googleapis.com/auth/calendar.events</code>: Inserts approved family dinners and weekend outings into everyone's real Google Calendar.</li>
                </ul>
              </div>

              <div className="p-3 bg-slate-50 border border-slate-200 rounded-2xl space-y-1">
                <div className="font-bold text-slate-900">3. Algorithmic Free-Time Overlap Detection</div>
                <p className="text-[11px] text-slate-600 leading-relaxed">
                  Silah aggregates everyone's busy blocks and computes mutual free intervals. For example, when family members finish their daytime commitments, Silah recommends <strong>"Dinner Tonight at 7:30 PM"</strong> or a <strong>"Weekend Outing (6:30 PM - 9:30 PM)"</strong> that fits all members without conflicts.
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="pt-2">
          <button
            onClick={onClose}
            className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-900 text-white font-bold text-xs"
          >
            Close Guide
          </button>
        </div>
      </div>
    </div>
  );
};
