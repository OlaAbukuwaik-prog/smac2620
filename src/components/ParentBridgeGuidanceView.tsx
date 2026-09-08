import React, { useState } from 'react';
import {
  Heart,
  ShieldCheck,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Send,
  Volume2,
  Copy,
  Check,
  Smile,
  Bot,
  UserCheck,
  RefreshCw,
  Flame,
  MessageSquareHeart,
  Wind,
} from 'lucide-react';
import { FamilyMember, ChildAIInteractionSummary } from '../types';
import { FamilyMemojiAvatar } from './FamilyMemojiAvatar';

interface ParentBridgeGuidanceViewProps {
  activeMember: FamilyMember;
  allMembers: FamilyMember[];
  guidanceSummary?: ChildAIInteractionSummary;
  onSendReassurance?: (replyText: string) => void;
  onOpenSafeConnect?: () => void;
  onSwitchMember?: (member: FamilyMember) => void;
}

export const ParentBridgeGuidanceView: React.FC<ParentBridgeGuidanceViewProps> = ({
  activeMember,
  allMembers,
  guidanceSummary,
  onSendReassurance,
  onOpenSafeConnect,
  onSwitchMember,
}) => {
  // Find children in family
  const childrenMembers = allMembers.filter((m) => m.role === 'Teenager' || m.role === 'Child');
  const [selectedChildId, setSelectedChildId] = useState<string>(
    childrenMembers[0]?.id || 'user-sarah'
  );

  const selectedChild =
    allMembers.find((m) => m.id === selectedChildId) || childrenMembers[0] || allMembers[2];

  // Fallback / default guidance if kid hasn't chatted yet
  const activeGuidance: ChildAIInteractionSummary = guidanceSummary || {
    childId: selectedChild.id,
    childName: selectedChild.name,
    childRole: selectedChild.role,
    lastActive: '10 minutes ago',
    emotionalState: 'High Anxiety',
    anxietyLevelPercent: 84,
    coreConcerns: ['Fear of angry parental reaction', 'Academic Stress', 'Fear of Disappointing You'],
    recentTopic: 'Discussed difficulty with an exam and fear of being yelled at or punished.',
    recentChatSnippet:
      "I made a mistake today and I am terrified my parents will scream, get furious, or severely punish me.",
    parentGuidance: {
      overview:
        "Your child reached out to the AI confidant carrying intense anxiety. Their deepest fear is that you will react with explosive anger, yelling, or disappointment. They chose transparency over hiding—rewarding that courage with calm understanding will cement their trust in you for life.",
      doList: [
        "Acknowledge their courage: 'Thank you for coming to me honestly.'",
        "Give them physical reassurance: a warm drink, a hug, or sitting side-by-side.",
        "Listen to the complete story for at least 5 minutes before speaking or problem-solving.",
        "Affirm that your love and trust in them are unconditional.",
      ],
      dontList: [
        "DO NOT yell, raise your voice, or use aggressive body language.",
        "DO NOT compare them to siblings, cousins, or classmates.",
        "DO NOT impose sudden, irreversible punishments in the heat of anger.",
        "DO NOT attack their identity ('Why are you so careless / a disappointment?').",
      ],
      suggestedOpeningScript:
        "\"Hey, I noticed you were feeling weighed down today. I want you to know that I love you more than any test score or mistake. Take a deep breath. Let's sit together and talk peacefully—no yelling, I promise.\"",
      recommendedActivityTogether: 'A quiet evening tea, walk, or relaxed dinner together.',
    },
    bridgeRequestPending: true,
    bridgeMessageText:
      "Parent, I want to talk to you about something that I was afraid to share. I experienced a setback, but I value your guidance and want to discuss it calmly together.",
  };

  // State for interactive features
  const [copiedScript, setCopiedScript] = useState(false);
  const [customReplyText, setCustomReplyText] = useState('');
  const [selectedPresetReply, setSelectedPresetReply] = useState<string | null>(null);
  const [reassuranceSent, setReassuranceSent] = useState(false);
  const [isBreathingActive, setIsBreathingActive] = useState(false);
  const [breathPhase, setBreathPhase] = useState<'Inhale' | 'Hold' | 'Exhale'>('Inhale');
  const [breathSeconds, setBreathSeconds] = useState(4);

  // Calming breathing timer
  const handleToggleBreathing = () => {
    if (isBreathingActive) {
      setIsBreathingActive(false);
      return;
    }
    setIsBreathingActive(true);
    setBreathPhase('Inhale');
    setBreathSeconds(4);

    let count = 4;
    let phase: 'Inhale' | 'Hold' | 'Exhale' = 'Inhale';

    const interval = setInterval(() => {
      count -= 1;
      if (count <= 0) {
        if (phase === 'Inhale') {
          phase = 'Hold';
          count = 4;
        } else if (phase === 'Hold') {
          phase = 'Exhale';
          count = 6;
        } else {
          phase = 'Inhale';
          count = 4;
        }
        setBreathPhase(phase);
      }
      setBreathSeconds(count);
    }, 1000);

    // Stop after 30 seconds
    setTimeout(() => {
      clearInterval(interval);
      setIsBreathingActive(false);
    }, 28000);
  };

  const handleCopyScript = () => {
    navigator.clipboard?.writeText(activeGuidance.parentGuidance.suggestedOpeningScript);
    setCopiedScript(true);
    setTimeout(() => setCopiedScript(false), 2500);
  };

  const handleSendReassurance = (textToSend?: string) => {
    const text = textToSend || customReplyText || selectedPresetReply;
    if (!text) return;

    setReassuranceSent(true);
    if (onSendReassurance) {
      onSendReassurance(text);
    }
  };

  const PRESET_REPLIES = [
    "Thank you for being brave enough to tell me. I love you, let's talk calmly with no anger. ❤️",
    "Take a deep breath. We will figure this out together as a family.",
    "Your honesty means the world to me. Come talk with me whenever you are ready.",
  ];

  return (
    <div className="flex-1 bg-[#f8f6fb] px-4 py-4 space-y-4 pb-20">
      {/* Top Header */}
      <section className="bg-gradient-to-r from-purple-800 via-indigo-800 to-indigo-950 text-white rounded-2xl p-4 shadow-sm relative overflow-hidden">
        <div className="flex items-center justify-between gap-2 mb-1.5">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-xl bg-purple-600/50 text-amber-300">
              <Heart className="w-5 h-5 fill-amber-300/30" />
            </span>
            <div>
              <h1 className="text-base font-bold">Parent Guidance Hub</h1>
              <span className="text-[11px] text-purple-200">
                AI Coaching Synthesized from Your Children's Chats
              </span>
            </div>
          </div>
          <span className="text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 px-2 py-0.5 rounded-full font-semibold">
            Live Insights
          </span>
        </div>

        <p className="text-xs text-purple-100 leading-relaxed mt-2">
          When your kids chat with their private AI confidant, the AI analyzes their emotional state and equips you with empathetic parenting guides on how to respond constructively with zero shouting.
        </p>

        {/* Switch perspective shortcut */}
        {selectedChild && onSwitchMember && (
          <div className="mt-3 pt-2.5 border-t border-white/10 flex items-center justify-between">
            <span className="text-[11px] text-purple-200">
              Want to see the Kid's Gemini Chat screen?
            </span>
            <button
              onClick={() => onSwitchMember(selectedChild)}
              className="text-xs font-bold px-3 py-1 rounded-xl bg-white/20 hover:bg-white/30 text-white transition-all flex items-center gap-1 active:scale-95"
            >
              <span>Switch to {selectedChild.name} (Kid)</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </section>

      {/* Child Selector Pill Tabs */}
      {childrenMembers.length > 1 && (
        <div className="flex items-center gap-2 bg-white p-1.5 rounded-2xl border border-purple-100 shadow-xs">
          <span className="text-[11px] font-bold text-slate-400 px-2">Select Child:</span>
          {childrenMembers.map((child) => (
            <button
              key={child.id}
              onClick={() => setSelectedChildId(child.id)}
              className={`flex-1 py-1.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                selectedChildId === child.id
                  ? 'bg-purple-700 text-white shadow-xs'
                  : 'text-slate-600 hover:bg-purple-50'
              }`}
            >
              <div
                className={`w-4 h-4 rounded-full flex items-center justify-center text-[8px] font-bold ${child.avatarColor}`}
              >
                {child.initials}
              </div>
              <span>{child.name}</span>
            </button>
          ))}
        </div>
      )}

      {/* Child's Emotional Pulse Card */}
      <section className="bg-white rounded-2xl p-4 border border-purple-100 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div
              className={`w-9 h-9 rounded-2xl flex items-center justify-center text-xs font-bold ${selectedChild.avatarColor}`}
            >
              {selectedChild.initials}
            </div>
            <div>
              <div className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                <span>{selectedChild.name}'s Emotional Pulse</span>
                <span className="text-[10px] px-1.5 py-0.2 rounded-md bg-purple-100 text-purple-800 font-medium">
                  {selectedChild.role}
                </span>
              </div>
              <div className="text-[11px] text-slate-400">
                Last AI Confidant interaction: {activeGuidance.lastActive}
              </div>
            </div>
          </div>

          <div className="text-right">
            <span className="text-xs font-extrabold text-rose-600 bg-rose-50 border border-rose-200 px-2 py-0.5 rounded-full inline-flex items-center gap-1">
              <AlertTriangle className="w-3 h-3" />
              <span>Anxiety: {activeGuidance.anxietyLevelPercent}%</span>
            </span>
          </div>
        </div>

        {/* Emotional state summary */}
        <div className="p-3 bg-amber-50/70 border border-amber-200/80 rounded-xl space-y-1.5">
          <div className="text-xs font-bold text-amber-950 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            <span>Key Concern Detected by AI:</span>
          </div>
          <p className="text-xs text-amber-900 leading-relaxed font-medium">
            "{activeGuidance.recentTopic}"
          </p>
          <div className="flex flex-wrap gap-1.5 pt-1">
            {activeGuidance.coreConcerns.map((concern, idx) => (
              <span
                key={idx}
                className="text-[10px] font-semibold bg-white/80 border border-amber-200 text-amber-900 px-2 py-0.5 rounded-full"
              >
                {concern}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Recommended 30-Second Parent Reset (Breathing Visualizer) */}
      <section className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl p-4 border border-indigo-100 shadow-xs flex items-center justify-between gap-3">
        <div className="space-y-1 flex-1">
          <div className="flex items-center gap-1.5 text-indigo-900 font-bold text-xs">
            <Wind className="w-4 h-4 text-indigo-600" />
            <span>Parent 30-Second Reset (Before Speaking)</span>
          </div>
          <p className="text-[11px] text-indigo-700 leading-relaxed">
            Take 3 calm breaths to regulate your own nervous system so you enter the conversation grounded, open, and patient.
          </p>
        </div>

        <button
          onClick={handleToggleBreathing}
          className={`px-3 py-2 rounded-xl text-xs font-bold transition-all shrink-0 flex flex-col items-center justify-center ${
            isBreathingActive
              ? 'bg-indigo-600 text-white shadow-md animate-pulse min-w-[90px]'
              : 'bg-white hover:bg-indigo-100 text-indigo-800 border border-indigo-200 min-w-[90px]'
          }`}
        >
          {isBreathingActive ? (
            <>
              <span className="text-[10px] uppercase font-mono tracking-wider">{breathPhase}</span>
              <span className="text-sm font-extrabold">{breathSeconds}s</span>
            </>
          ) : (
            <>
              <Wind className="w-4 h-4 mb-0.5" />
              <span>Start Reset</span>
            </>
          )}
        </button>
      </section>

      {/* AI Coaching Guide: How to Treat Your Child Today */}
      <section className="bg-white rounded-2xl p-4 border border-purple-100 shadow-xs space-y-4">
        <div className="flex items-center gap-2">
          <div className="p-1 rounded-lg bg-purple-100 text-purple-700">
            <UserCheck className="w-4 h-4" />
          </div>
          <h2 className="text-sm font-bold text-slate-900">
            How to Treat {selectedChild.name} Today
          </h2>
        </div>

        {/* Psychological overview */}
        <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-100">
          {activeGuidance.parentGuidance.overview}
        </p>

        {/* DO and DONT lists */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {/* DO LIST */}
          <div className="p-3 bg-emerald-50/70 border border-emerald-200 rounded-xl space-y-2">
            <div className="text-xs font-bold text-emerald-900 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>What to DO (Build Trust)</span>
            </div>
            <ul className="text-xs text-emerald-950 space-y-1.5">
              {activeGuidance.parentGuidance.doList.map((item, idx) => (
                <li key={idx} className="flex items-start gap-1.5">
                  <span className="text-emerald-600 font-bold shrink-0">•</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* DONT LIST */}
          <div className="p-3 bg-rose-50/70 border border-rose-200 rounded-xl space-y-2">
            <div className="text-xs font-bold text-rose-900 flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4 text-rose-600" />
              <span>What to AVOID (Prevent Harm & Panic)</span>
            </div>
            <ul className="text-xs text-rose-950 space-y-1.5">
              {activeGuidance.parentGuidance.dontList.map((item, idx) => (
                <li key={idx} className="flex items-start gap-1.5">
                  <span className="text-rose-600 font-bold shrink-0">•</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Recommended Opening Script */}
        <div className="p-3.5 bg-indigo-50/80 border border-indigo-200 rounded-xl space-y-2">
          <div className="flex items-center justify-between">
            <div className="text-xs font-bold text-indigo-950 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
              <span>Recommended Opening Script (First 60 Seconds)</span>
            </div>
            <button
              onClick={handleCopyScript}
              className="text-[11px] text-indigo-700 hover:text-indigo-900 font-semibold flex items-center gap-1 bg-white px-2 py-0.5 rounded-lg border border-indigo-200 transition-colors"
            >
              {copiedScript ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
              <span>{copiedScript ? 'Copied' : 'Copy Script'}</span>
            </button>
          </div>

          <p className="text-xs text-indigo-950 italic font-serif leading-relaxed bg-white/80 p-2.5 rounded-lg border border-indigo-100">
            {activeGuidance.parentGuidance.suggestedOpeningScript}
          </p>

          <p className="text-[10px] text-indigo-600">
            💡 <strong>Why this works:</strong> Disarms fight-or-flight panic within 5 seconds and signals that your relationship is unconditional.
          </p>
        </div>
      </section>

      {/* Child's Bridge Message & 1-Tap Reassuring Replies */}
      <section className="bg-white rounded-2xl p-4 border border-purple-100 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-1 rounded-lg bg-amber-100 text-amber-700">
              <MessageSquareHeart className="w-4 h-4" />
            </div>
            <h2 className="text-sm font-bold text-slate-900">
              Send Reassurance Back to {selectedChild.name}
            </h2>
          </div>
          <span className="text-[10px] bg-amber-100 text-amber-800 font-bold px-2 py-0.5 rounded-full">
            Safe Bridge Active
          </span>
        </div>

        {/* Bridge Message Preview from Child */}
        <div className="p-3 bg-purple-50/60 border border-purple-200 rounded-xl space-y-1">
          <span className="text-[10px] uppercase font-bold tracking-wider text-purple-700">
            Calm Message from {selectedChild.name}:
          </span>
          <p className="text-xs text-purple-950 italic">
            "{activeGuidance.bridgeMessageText}"
          </p>
        </div>

        {/* 1-Tap Quick Reassurances */}
        <div className="space-y-2">
          <span className="text-[11px] font-semibold text-slate-500">
            Tap to send instant reassurance to your child's screen:
          </span>
          <div className="space-y-1.5">
            {PRESET_REPLIES.map((reply, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setSelectedPresetReply(reply);
                  handleSendReassurance(reply);
                }}
                className={`w-full text-left p-2.5 rounded-xl border text-xs leading-relaxed transition-all flex items-center justify-between gap-2 cursor-pointer ${
                  selectedPresetReply === reply
                    ? 'border-purple-600 bg-purple-50 text-purple-950 font-bold'
                    : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
                }`}
              >
                <span>{reply}</span>
                <Send className="w-3.5 h-3.5 text-purple-600 shrink-0" />
              </button>
            ))}
          </div>
        </div>

        {/* Custom reply input */}
        <div className="pt-2 flex gap-2">
          <input
            type="text"
            value={customReplyText}
            onChange={(e) => setCustomReplyText(e.target.value)}
            placeholder="Or write your own loving, calm note..."
            className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 placeholder-slate-400 outline-none focus:border-purple-500 focus:bg-white"
          />
          <button
            onClick={() => handleSendReassurance()}
            disabled={!customReplyText.trim()}
            className="px-3.5 py-2 rounded-xl bg-purple-700 hover:bg-purple-800 text-white font-bold text-xs disabled:opacity-40 transition-all flex items-center gap-1 shrink-0 cursor-pointer"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Send</span>
          </button>
        </div>

        {/* Success Confirmation Toast */}
        {reassuranceSent && (
          <div className="p-3 bg-emerald-50 border border-emerald-300 rounded-xl text-xs text-emerald-900 flex items-center gap-2 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <div>
              <p className="font-bold">Reassurance Sent to {selectedChild.name}!</p>
              <p className="text-[11px] text-emerald-700">
                Your child received your calm words immediately. Family Harmony Score boosted +5!
              </p>
            </div>
          </div>
        )}
      </section>

      {/* Link to full harm prevention protocol */}
      {onOpenSafeConnect && (
        <div className="p-3 bg-slate-100 rounded-2xl flex items-center justify-between text-xs text-slate-600">
          <span>Need deeper scenario breakdowns for severe mistakes?</span>
          <button
            onClick={onOpenSafeConnect}
            className="text-purple-700 hover:text-purple-900 font-bold hover:underline"
          >
            Safe Haven Protocol ➔
          </button>
        </div>
      )}
    </div>
  );
};
