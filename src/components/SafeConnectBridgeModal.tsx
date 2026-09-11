import React, { useState, useEffect } from 'react';
import {
  ShieldAlert,
  Heart,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  X,
  CheckCircle2,
  AlertTriangle,
  Smile,
  Send,
  Lock,
  Volume2,
  Check,
  RefreshCw,
  Eye,
  ShieldCheck,
  MessageSquareHeart,
  Bot,
  Flame,
  HelpCircle,
} from 'lucide-react';
import { FamilyMember } from '../types';
import {
  PRESET_TROUBLE_SCENARIOS,
  generateParentCoachingDossier,
  ParentCoachingDossier,
  TroubleScenario,
} from '../services/safeConnectService';
import { FamilyMemojiAvatar } from './FamilyMemojiAvatar';

interface SafeConnectBridgeModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeMember: FamilyMember;
  allMembers: FamilyMember[];
  onResolveWithHarmonyBoost: (boostAmount: number) => void;
  onSwitchActiveMember: (member: FamilyMember) => void;
}

export const SafeConnectBridgeModal: React.FC<SafeConnectBridgeModalProps> = ({
  isOpen,
  onClose,
  activeMember,
  allMembers,
  onResolveWithHarmonyBoost,
  onSwitchActiveMember,
}) => {
  // Wizard steps:
  // 1: Kid Problem Input & Fear
  // 2: AI Shield & Validation for Kid (Preview of Parent Guidance)
  // 3: Parent De-escalation Screen (Breathing Reset + Harm Prevention Dossier)
  // 4: Parent Sends Calm Reassurance
  // 5: Kid Emotional Relief & Harmony Boost
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3 | 4 | 5>(1);

  // Kid input state (clean for real users)
  const [selectedPresetId, setSelectedPresetId] = useState<string>('');
  const [kidProblemText, setKidProblemText] = useState<string>('');
  const [kidFearText, setKidFearText] = useState<string>('');

  // Recipient parent options
  const parentMembers = allMembers.filter((m) => m.role === 'Parent');
  const firstParent = parentMembers[0] || allMembers[1] || allMembers[0];
  const secondParent = parentMembers[1] || allMembers[2] || allMembers[0];
  const [targetParentId, setTargetParentId] = useState<string>(firstParent?.id || '');

  const selectedParent = allMembers.find((m) => m.id === targetParentId) || firstParent;
  const childMember = allMembers.find((m) => m.role === 'Teenager' || m.role === 'Child') || activeMember;
  const childDisplayName = childMember?.name || 'Child';

  // Active Perspective Toggle ('kid' vs 'parent') so the user can easily see both sides
  const [perspectiveView, setPerspectiveView] = useState<'kid' | 'parent'>('kid');

  // Breathing timer for parent de-escalation
  const [breathCount, setBreathCount] = useState<number>(5);
  const [breathPhase, setBreathPhase] = useState<'inhale' | 'exhale' | 'ready'>('inhale');
  const [parentUnlockedDossier, setParentUnlockedDossier] = useState<boolean>(false);

  // Parent reply state
  const [selectedReply, setSelectedReply] = useState<string>('');
  const [customReplyText, setCustomReplyText] = useState<string>('');
  const [isReplySent, setIsReplySent] = useState<boolean>(false);

  // Coaching dossier derived from inputs
  const dossier: ParentCoachingDossier = generateParentCoachingDossier(
    kidProblemText,
    kidFearText,
    childDisplayName,
    selectedParent?.name || 'Parent'
  );

  // Reset or preset selection
  const handleSelectPreset = (preset: TroubleScenario) => {
    setSelectedPresetId(preset.id);
    setKidProblemText(preset.kidInput);
    setKidFearText(preset.kidFear);
  };

  // Breathing animation cycle for parent
  useEffect(() => {
    if (currentStep === 3 && !parentUnlockedDossier) {
      const timer = setInterval(() => {
        setBreathCount((prev) => {
          if (prev <= 1) {
            setBreathPhase('ready');
            setParentUnlockedDossier(true);
            clearInterval(timer);
            return 0;
          }
          if (prev === 3) setBreathPhase('exhale');
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [currentStep, parentUnlockedDossier]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh] border border-purple-100">
        {/* Header with Perspective Switcher */}
        <div className="bg-gradient-to-r from-purple-900 via-indigo-900 to-purple-950 text-white p-4 shrink-0 flex items-center justify-between relative overflow-hidden">
          <div className="flex items-center gap-2.5 z-10">
            <div className="w-9 h-9 rounded-xl bg-purple-500/30 border border-purple-400/40 flex items-center justify-center text-amber-300 shadow-inner">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h2 className="text-sm font-bold text-white tracking-wide">
                  Future AI Connect: Safe Haven
                </h2>
                <span className="text-[10px] bg-amber-400/20 text-amber-300 px-2 py-0.5 rounded-full border border-amber-400/30 font-semibold">
                  Harm Prevention AI
                </span>
              </div>
              <p className="text-[11px] text-purple-200">
                Helping kids confess trouble safely & coaching parents to respond without harm.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-white/10 text-purple-200 hover:text-white transition-colors z-10"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Progress Tracker & Role Bar */}
        <div className="bg-purple-50/80 px-4 py-2 border-b border-purple-100 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold text-purple-950 uppercase tracking-wider">
              Step {currentStep} of 5
            </span>
            <span className="text-slate-300">•</span>
            <span className="text-[11px] font-semibold text-purple-700">
              {currentStep === 1 && "Kid's Honest Confession"}
              {currentStep === 2 && 'AI Protection Shield & Validation'}
              {currentStep === 3 && 'Parent De-escalation & Harm Prevention'}
              {currentStep === 4 && 'Parent Calm Reassurance'}
              {currentStep === 5 && 'Fear Dissolved & Safe Connection'}
            </span>
          </div>

          {/* Perspective Indicator Pill */}
          <div className="flex items-center gap-1 bg-white px-2 py-1 rounded-full border border-purple-200 shadow-2xs">
            <span className="text-[10px] text-slate-500 font-medium">Viewing as:</span>
            <span
              className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                currentStep <= 2 || currentStep === 5
                  ? 'bg-purple-100 text-purple-800'
                  : 'bg-emerald-100 text-emerald-800'
              }`}
            >
              {currentStep <= 2 || currentStep === 5 ? `${childDisplayName} (Child)` : `${selectedParent?.name} (Parent)`}
            </span>
          </div>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 text-slate-800">
          {/* ================= STEP 1: KID TYPES THE TROUBLE & FEAR ================= */}
          {currentStep === 1 && (
            <div className="space-y-4">
              {/* Encouragement Banner */}
              <div className="p-3.5 rounded-2xl bg-gradient-to-r from-purple-50 to-indigo-50 border border-purple-200/80 flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-purple-600 text-white flex items-center justify-center shrink-0 mt-0.5 shadow-sm">
                  <Heart className="w-4 h-4 fill-white" />
                </div>
                <div className="space-y-0.5 text-xs">
                  <h4 className="font-bold text-purple-950">You are in a safe, judgment-free space.</h4>
                  <p className="text-slate-600 leading-relaxed">
                    Did something go wrong? Are you scared of how your family will react or punish you?
                    Type the truth below. Silah's AI will <strong>shield you</strong> and guide your parents
                    step-by-step on how to stay calm, listen, and solve it with you <strong>without yelling or harsh reactions</strong>.
                  </p>
                </div>
              </div>

              {/* Who are you scared to tell? */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-800 flex items-center justify-between">
                  <span>Who are you nervous to talk to?</span>
                  <span className="text-[11px] text-slate-400 font-normal">Select parent</span>
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setTargetParentId(firstParent.id)}
                    className={`p-2.5 rounded-xl border flex items-center gap-2.5 transition-all text-left ${
                      targetParentId === firstParent.id
                        ? 'border-purple-600 bg-purple-50/70 ring-2 ring-purple-600/20'
                        : 'border-slate-200 bg-slate-50/60 hover:bg-slate-100'
                    }`}
                  >
                    <FamilyMemojiAvatar memberId={firstParent.id} name={firstParent.name} role="Parent" size="sm" />
                    <div>
                      <div className="text-xs font-bold text-slate-800">{firstParent.name}</div>
                      <div className="text-[10px] text-slate-500">Parent</div>
                    </div>
                  </button>

                  {secondParent && secondParent.id !== firstParent.id && (
                    <button
                      type="button"
                      onClick={() => setTargetParentId(secondParent.id)}
                      className={`p-2.5 rounded-xl border flex items-center gap-2.5 transition-all text-left ${
                        targetParentId === secondParent.id
                          ? 'border-purple-600 bg-purple-50/70 ring-2 ring-purple-600/20'
                          : 'border-slate-200 bg-slate-50/60 hover:bg-slate-100'
                      }`}
                    >
                      <FamilyMemojiAvatar memberId={secondParent.id} name={secondParent.name} role="Parent" size="sm" />
                      <div>
                        <div className="text-xs font-bold text-slate-800">{secondParent.name}</div>
                        <div className="text-[10px] text-slate-500">Parent</div>
                      </div>
                    </button>
                  )}
                </div>
              </div>

              {/* Quick Scenarios selector */}
              <div className="space-y-1.5">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  Select a common situation or type your own:
                </span>
                <div className="grid grid-cols-2 gap-1.5">
                  {PRESET_TROUBLE_SCENARIOS.map((preset) => (
                    <button
                      key={preset.id}
                      type="button"
                      onClick={() => handleSelectPreset(preset)}
                      className={`px-2.5 py-1.5 rounded-xl border text-[11px] font-medium transition-all text-left truncate ${
                        selectedPresetId === preset.id
                          ? 'border-purple-600 bg-purple-100/70 text-purple-950 font-bold'
                          : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      {preset.title}
                    </button>
                  ))}
                </div>
              </div>

              {/* 1. What happened? */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-800 flex items-center justify-between">
                  <span>1. What happened? (Be 100% honest)</span>
                  <span className="text-[10px] text-emerald-600 flex items-center gap-0.5">
                    <Lock className="w-3 h-3" /> Private until you approve
                  </span>
                </label>
                <textarea
                  rows={3}
                  value={kidProblemText}
                  onChange={(e) => {
                    setKidProblemText(e.target.value);
                    setSelectedPresetId('');
                  }}
                  placeholder="Tell us what went wrong... (e.g. failed an exam, broke something, made a mistake)"
                  className="w-full p-3 rounded-xl border border-purple-200 focus:border-purple-600 focus:ring-2 focus:ring-purple-600/20 text-xs text-slate-800 outline-none leading-relaxed resize-none"
                />
              </div>

              {/* 2. What reaction are you most scared of? */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-800 flex items-center justify-between">
                  <span>2. What reaction are you terrified of?</span>
                  <span className="text-[10px] text-purple-600">The AI will prevent this</span>
                </label>
                <textarea
                  rows={2}
                  value={kidFearText}
                  onChange={(e) => setKidFearText(e.target.value)}
                  placeholder="e.g. Screaming, being called a failure, losing their temper, harsh grounding without listening..."
                  className="w-full p-2.5 rounded-xl border border-purple-200 focus:border-purple-600 focus:ring-2 focus:ring-purple-600/20 text-xs text-slate-800 outline-none leading-relaxed resize-none"
                />
              </div>

              {/* Fear tag quick chips */}
              <div className="flex flex-wrap gap-1 text-[10px]">
                {[
                  'Screaming & Yelling',
                  'Physical punishment / harm',
                  'Being called a failure',
                  'Grounding without hearing my side',
                  'Family humiliation',
                ].map((tag, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setKidFearText((prev) => (prev ? `${prev}, ${tag}` : tag))}
                    className="px-2 py-0.5 rounded-full bg-slate-100 hover:bg-purple-100 text-slate-700 hover:text-purple-800 border border-slate-200 transition-colors"
                  >
                    + {tag}
                  </button>
                ))}
              </div>

              <button
                type="button"
                onClick={() => setCurrentStep(2)}
                disabled={!kidProblemText.trim()}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-700 to-indigo-700 hover:from-purple-800 hover:to-indigo-800 text-white text-xs font-bold shadow-md transition-all flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50"
              >
                <span>Activate AI Protection & Review Shield</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* ================= STEP 2: AI SHIELD & VALIDATION FOR KID ================= */}
          {currentStep === 2 && (
            <div className="space-y-4">
              {/* Validation message to child */}
              <div className="p-4 rounded-2xl bg-purple-900 text-white space-y-2.5 shadow-md">
                <div className="flex items-center gap-2 text-amber-300 text-xs font-bold uppercase tracking-wider">
                  <Sparkles className="w-4 h-4" />
                  <span>AI Protective Shield Activated</span>
                </div>
                <p className="text-xs text-purple-100 leading-relaxed">
                  "Taking responsibility when you are anxious is one of the bravest things a person can do.
                  You are not a bad person for making an honest mistake."
                </p>
                <div className="p-2.5 rounded-xl bg-white/10 text-[11px] text-purple-200 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>
                    We will <strong>NOT</strong> let your parents see your raw text without preparing them first.
                  </span>
                </div>
              </div>

              {/* What the AI will do to protect the child */}
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2.5">
                <h4 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                  <Bot className="w-4 h-4 text-purple-600" />
                  <span>How Silah protects you before your parents read this:</span>
                </h4>

                <div className="space-y-2 text-xs">
                  <div className="flex items-start gap-2">
                    <span className="w-5 h-5 rounded-full bg-purple-100 text-purple-800 flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
                      1
                    </span>
                    <p className="text-slate-600">
                      <strong>5-Second Calming Breathing Pause:</strong> Forces {selectedParent?.name.split(' ')[0]} to pause and breathe before seeing the message so they don't react impulsively.
                    </p>
                  </div>

                  <div className="flex items-start gap-2">
                    <span className="w-5 h-5 rounded-full bg-purple-100 text-purple-800 flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
                      2
                    </span>
                    <p className="text-slate-600">
                      <strong>Parent Harm-Prevention Protocol:</strong> Gives {selectedParent?.name.split(' ')[0]} clear rules: <em>No shouting, no physical threats, no harsh immediate grounding</em>.
                    </p>
                  </div>

                  <div className="flex items-start gap-2">
                    <span className="w-5 h-5 rounded-full bg-purple-100 text-purple-800 flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
                      3
                    </span>
                    <p className="text-slate-600">
                      <strong>First 60 Seconds Script:</strong> Coaches them exactly what loving words to say to you first to make you feel safe.
                    </p>
                  </div>
                </div>
              </div>

              {/* Preview of the Parent Summary */}
              <div className="space-y-1.5">
                <span className="text-[11px] font-bold text-slate-600 uppercase tracking-wider">
                  Preview of what your parent will see:
                </span>
                <div className="p-3 rounded-xl bg-purple-50/70 border border-purple-200 text-xs text-purple-950 italic leading-relaxed">
                  "{dossier.calmSummary}"
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setCurrentStep(1)}
                  className="py-2.5 px-3 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-50 text-xs font-bold flex items-center justify-center gap-1.5 transition-all"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Edit My Problem</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setCurrentStep(3);
                    setPerspectiveView('parent');
                    setBreathCount(5);
                    setBreathPhase('inhale');
                    setParentUnlockedDossier(false);
                  }}
                  className="py-2.5 px-3 rounded-xl bg-purple-700 hover:bg-purple-800 text-white text-xs font-bold shadow-md flex items-center justify-center gap-1.5 transition-all"
                >
                  <span>Send & Switch to Parent View</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

          {/* ================= STEP 3: PARENT PERSPECTIVE & HARM PREVENTION DOSSIER ================= */}
          {currentStep === 3 && (
            <div className="space-y-4">
              {/* Parent View Notice */}
              <div className="p-3 bg-indigo-50 border border-indigo-200 rounded-xl flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FamilyMemojiAvatar memberId={selectedParent.id} name={selectedParent.name} role="Parent" size="sm" />
                  <div>
                    <div className="text-xs font-bold text-indigo-950">
                      Simulating Parent Device: {selectedParent.name}
                    </div>
                    <div className="text-[10px] text-indigo-700">Incoming Safe Connect Notification</div>
                  </div>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-indigo-200 text-indigo-900">
                  Protected Delivery
                </span>
              </div>

              {/* 5-SECOND NERVOUS SYSTEM BREATHING RESET */}
              {!parentUnlockedDossier ? (
                <div className="p-6 rounded-2xl bg-purple-950 text-white text-center space-y-4 shadow-xl border border-purple-800">
                  <div className="w-12 h-12 rounded-full bg-amber-400/20 text-amber-300 flex items-center justify-center mx-auto ring-4 ring-amber-400/10">
                    <ShieldAlert className="w-6 h-6" />
                  </div>

                  <div className="space-y-1">
                    <h3 className="text-sm font-bold text-white">
                      Please Pause Before Opening
                    </h3>
                    <p className="text-xs text-purple-200 max-w-sm mx-auto leading-relaxed">
                      Your child came forward because they trust you, but they are currently <strong>worried about an angry reaction</strong>.
                      How you react right now will define whether they ever confide in you again.
                    </p>
                  </div>

                  {/* Breathing Ring Animation */}
                  <div className="relative w-24 h-24 mx-auto flex items-center justify-center">
                    <div
                      className={`absolute inset-0 rounded-full border-4 border-amber-300/40 transition-all duration-1000 ${
                        breathPhase === 'inhale' ? 'scale-110 border-amber-300' : 'scale-90 border-purple-400'
                      }`}
                    />
                    <div className="text-center">
                      <div className="text-2xl font-black text-amber-300">{breathCount}s</div>
                      <div className="text-[10px] uppercase font-bold text-purple-300">
                        {breathPhase === 'inhale' ? 'Inhale...' : 'Exhale...'}
                      </div>
                    </div>
                  </div>

                  <p className="text-[11px] text-purple-300 italic">
                    "A calm parent solves problems. An angry parent teaches a child to hide."
                  </p>

                  <button
                    type="button"
                    onClick={() => {
                      setParentUnlockedDossier(true);
                    }}
                    className="text-xs underline text-purple-300 hover:text-white"
                  >
                    I'm ready now (Skip breathing)
                  </button>
                </div>
              ) : (
                /* UNLOCKED PARENT GUIDANCE DOSSIER */
                <div className="space-y-4">
                  {/* Urgent Coaching Header */}
                  <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-amber-950 space-y-1.5">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-amber-900">
                      <AlertTriangle className="w-4 h-4 text-amber-600" />
                      <span>Parent Guidance: Child's Core Worry</span>
                    </div>
                    <p className="text-xs leading-relaxed">
                      Your child shared that their biggest worry is:
                    </p>
                    <div className="p-2 bg-white rounded-lg border border-amber-200 text-xs font-semibold text-rose-700">
                      "{kidFearText}"
                    </div>
                  </div>

                  {/* What happened (Calm, Truthful) */}
                  <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5">
                    <div className="flex items-center justify-between text-xs font-bold text-slate-900">
                      <span>What Happened (In Child's Words):</span>
                      <span className="text-[10px] font-normal text-emerald-600">✓ Verified Truth</span>
                    </div>
                    <p className="text-xs text-slate-800 bg-white p-3 rounded-xl border border-slate-200 leading-relaxed">
                      "{kidProblemText}"
                    </p>
                  </div>

                  {/* CRITICAL: Harm Prevention Checklist (What NOT to do) */}
                  <div className="p-3.5 rounded-2xl bg-rose-50/80 border border-rose-200 space-y-2">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-rose-900">
                      <ShieldAlert className="w-4 h-4 text-rose-600" />
                      <span>Harm-Prevention Checklist (What NOT to do):</span>
                    </div>
                    <ul className="space-y-1.5 text-xs text-rose-950">
                      {dossier.harmPreventionChecklist.map((rule, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <span className="text-rose-600 font-bold shrink-0">✕</span>
                          <span className="leading-tight">{rule}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* What to do in the first 60 seconds */}
                  <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 space-y-2">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-900">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>First 60 Seconds: Recommended Script to say</span>
                    </div>
                    <div className="p-3 bg-white rounded-xl border border-emerald-200 text-xs text-slate-800 font-medium leading-relaxed italic">
                      "{dossier.first60SecondsScript}"
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setCurrentStep(4)}
                    className="w-full py-3 rounded-xl bg-purple-700 hover:bg-purple-800 text-white text-xs font-bold shadow-md transition-all flex items-center justify-center gap-2"
                  >
                    <span>Send Calming Reassurance</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          )}

          {/* ================= STEP 4: PARENT SENDS REASSURANCE ================= */}
          {currentStep === 4 && (
            <div className="space-y-4">
              <div className="space-y-1">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900">
                  Send Immediate Reassurance
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Send a 1-tap message so your child knows you are not angry, allowing anxiety to dissolve.
                </p>
              </div>

              {/* Quick 1-Tap Calming Messages */}
              <div className="space-y-2">
                {dossier.suggestedReplies.map((reply, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => {
                      setSelectedReply(reply);
                      setCustomReplyText('');
                    }}
                    className={`w-full p-3 rounded-xl border text-left text-xs transition-all flex items-start gap-2.5 ${
                      selectedReply === reply
                        ? 'border-purple-600 bg-purple-50 text-purple-950 font-semibold ring-2 ring-purple-600/20'
                        : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <div
                      className={`w-4 h-4 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
                        selectedReply === reply ? 'bg-purple-600 text-white' : 'border border-slate-300'
                      }`}
                    >
                      {selectedReply === reply && <Check className="w-3 h-3 stroke-[3]" />}
                    </div>
                    <span className="leading-relaxed">"{reply}"</span>
                  </button>
                ))}
              </div>

              {/* Custom message input */}
              <div className="space-y-1 pt-1">
                <span className="text-[11px] font-bold text-slate-500">Or write custom message:</span>
                <input
                  type="text"
                  value={customReplyText}
                  onChange={(e) => {
                    setCustomReplyText(e.target.value);
                    setSelectedReply('');
                  }}
                  placeholder="e.g. Take a deep breath. We love you, let's talk peacefully."
                  className="w-full p-2.5 rounded-xl border border-slate-300 focus:border-purple-600 text-xs text-slate-800 outline-none"
                />
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsReplySent(true);
                    setCurrentStep(5);
                    setPerspectiveView('kid');
                  }}
                  disabled={!selectedReply && !customReplyText.trim()}
                  className="w-full py-3 rounded-xl bg-purple-700 hover:bg-purple-800 text-white text-xs font-bold shadow-md transition-all flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50"
                >
                  <Send className="w-4 h-4" />
                  <span>Send Reassurance & Switch to Child's Screen</span>
                </button>
              </div>
            </div>
          )}

          {/* ================= STEP 5: FEAR DISSOLVED & RESOLUTION ================= */}
          {currentStep === 5 && (
            <div className="space-y-4 text-center">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-inner ring-8 ring-emerald-50">
                <CheckCircle2 className="w-9 h-9" />
              </div>

              <div className="space-y-1">
                <h3 className="text-base font-bold text-slate-900">
                  Fear Dissolved. Connection Strengthened.
                </h3>
                <p className="text-xs text-slate-600 max-w-sm mx-auto">
                  Because of the AI Safe Haven, your child did not hide in fear, and {selectedParent?.name} responded with calm support.
                </p>
              </div>

              {/* Child's Anxiety Reduction Meter */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="flex items-center justify-between text-xs font-bold">
                  <span className="text-slate-600">Fear & Anxiety Level:</span>
                  <span className="text-emerald-600 font-extrabold">95% ➔ 8% (Safe)</span>
                </div>
                <div className="w-full h-3 bg-slate-200 rounded-full overflow-hidden">
                  <div className="w-[8%] h-full bg-emerald-500 rounded-full transition-all duration-1000" />
                </div>
                <p className="text-[11px] text-slate-500">
                  Emotional safety restored. Conversation ready to happen constructively.
                </p>
              </div>

              {/* The Message Received from Parent */}
              <div className="p-4 rounded-2xl bg-purple-50/80 border border-purple-200 text-left space-y-2">
                <div className="flex items-center justify-between text-xs text-slate-500">
                  <span className="font-bold text-purple-950 flex items-center gap-1.5">
                    <FamilyMemojiAvatar memberId={selectedParent.id} name={selectedParent.name} role="Parent" size="sm" />
                    <span>Message from {selectedParent?.name}:</span>
                  </span>
                  <span className="text-[10px] text-emerald-600 font-semibold bg-emerald-100 px-2 py-0.5 rounded-full">
                    Received Just Now
                  </span>
                </div>
                <p className="text-xs font-medium text-purple-950 bg-white p-3 rounded-xl border border-purple-200 shadow-2xs leading-relaxed">
                  "{selectedReply || customReplyText || "Thank you for being brave enough to tell me. I love you, and I won't yell. Come talk with me whenever you're ready. ❤️"}"
                </p>
              </div>

              {/* Harmony Score Boost */}
              <div className="p-3 bg-gradient-to-r from-purple-100 via-indigo-100 to-purple-100 rounded-2xl border border-purple-200 flex items-center justify-between">
                <div className="flex items-center gap-2 text-left">
                  <div className="w-8 h-8 rounded-full bg-purple-600 text-white flex items-center justify-center font-bold text-xs">
                    +5%
                  </div>
                  <div>
                    <div className="text-xs font-bold text-purple-950">Family Harmony Boost</div>
                    <div className="text-[10px] text-purple-700">Difficult topic resolved through honesty</div>
                  </div>
                </div>
                <Sparkles className="w-5 h-5 text-amber-500 animate-bounce" />
              </div>

              <div className="pt-2 flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setCurrentStep(1);
                    setKidProblemText('');
                    setKidFearText('');
                  }}
                  className="flex-1 py-3 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-50 text-xs font-bold transition-all"
                >
                  Bridge Another Topic
                </button>

                <button
                  type="button"
                  onClick={() => {
                    onResolveWithHarmonyBoost(5);
                    onClose();
                  }}
                  className="flex-1 py-3 rounded-xl bg-purple-700 hover:bg-purple-800 text-white text-xs font-bold shadow-md transition-all"
                >
                  Return to Home
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
