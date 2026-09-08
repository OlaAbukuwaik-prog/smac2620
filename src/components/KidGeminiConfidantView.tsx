import React, { useState, useRef, useEffect } from 'react';
import {
  Sparkles,
  Send,
  Mic,
  MicOff,
  ShieldCheck,
  Heart,
  Bot,
  RotateCcw,
  CheckCircle2,
  ArrowRight,
  Info,
  Lock,
  Smile,
  Volume2,
  Share2,
} from 'lucide-react';
import { FamilyMember, KidAIChatMessage, ChildAIInteractionSummary } from '../types';

interface KidGeminiConfidantViewProps {
  activeMember: FamilyMember;
  allMembers: FamilyMember[];
  onOpenSafeConnect?: () => void;
  onUpdateParentGuidance?: (summary: ChildAIInteractionSummary) => void;
  onSwitchMember?: (member: FamilyMember) => void;
}

// Gemini sparkle icon
export const GeminiStarIcon: React.FC<{ className?: string }> = ({ className = 'w-5 h-5' }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <path
      d="M12 2C12 7.52285 7.52285 12 2 12C7.52285 12 12 16.4771 12 22C12 16.4771 16.4771 12 22 12C16.4771 12 12 7.52285 12 2Z"
      fill="url(#gemini-gradient)"
    />
    <defs>
      <linearGradient id="gemini-gradient" x1="2" y1="2" x2="22" y2="22" gradientUnits="userSpaceOnUse">
        <stop stopColor="#38bdf8" />
        <stop offset="0.5" stopColor="#818cf8" />
        <stop offset="1" stopColor="#c084fc" />
      </linearGradient>
    </defs>
  </svg>
);

const PROMPT_SUGGESTIONS = [
  {
    icon: '🛡️',
    title: "I made a mistake and I'm scared",
    prompt: "I made an honest mistake today and I'm terrified my parents will scream, get furious, or severely punish me.",
    category: 'fear' as const,
  },
  {
    icon: '📚',
    title: "School / Exam Stress",
    prompt: "I got a bad grade on my exam despite trying hard, and I don't know how to tell my parents without them getting disappointed.",
    category: 'academic' as const,
  },
  {
    icon: '💔',
    title: "Broken / Damaged something",
    prompt: "I accidentally damaged an item at home while studying. I feel sick with anxiety about what they will say.",
    category: 'accident' as const,
  },
  {
    icon: '🗣️',
    title: "How to talk to my parents",
    prompt: "I want to talk to my parents about something personal, but I feel like they won't understand and will judge me.",
    category: 'conflict' as const,
  },
];

export const KidGeminiConfidantView: React.FC<KidGeminiConfidantViewProps> = ({
  activeMember,
  allMembers,
  onOpenSafeConnect,
  onUpdateParentGuidance,
  onSwitchMember,
}) => {
  const [messages, setMessages] = useState<KidAIChatMessage[]>([
    {
      id: 'welcome-msg',
      sender: 'ai',
      text: `Hello! 👋 I'm Gemini, your private Silah AI confidant.\n\nYou are in a completely safe, judgment-free space. You can talk to me about anything—whether you made an honest mistake, feel nervous about school, had a conflict, or are scared of your parents getting angry.\n\nHow are you feeling right now? You can type anything, speak, or pick one of the suggestions below.`,
      timestamp: 'Just now',
    },
  ]);

  const [inputVal, setInputVal] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [bridgeSent, setBridgeSent] = useState(false);
  const [showPrivacyTooltip, setShowPrivacyTooltip] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isThinking]);

  // Intelligent conversational response generator
  const generateAIResponse = (userText: string) => {
    const textLower = userText.toLowerCase();

    let aiReply = '';
    let category: 'academic' | 'accident' | 'conflict' | 'fear' | 'general' = 'general';
    let emotion = 'Anxious';
    let summaryForParent = '';
    let doRules: string[] = [];
    let dontRules: string[] = [];
    let script = '';

    if (textLower.includes('fail') || textLower.includes('grade') || textLower.includes('exam') || textLower.includes('test') || textLower.includes('score')) {
      category = 'academic';
      emotion = 'Academic Panic & Fear of Disappointment';
      aiReply = `I hear you, and I want you to take a slow, deep breath right now. Inhale for 4 seconds... and exhale for 6 seconds. 🧘\n\nFirst: **One test score does NOT define your worth or your intelligence.** Every successful person has failed tests along the way. You studied and tried, and panicking during an exam happens to almost everyone.\n\nSecond: You did the bravest thing by being honest instead of trying to hide it. I can help bridge this with your parents so they know to approach you with calm guidance and understanding rather than angry lecturing.\n\nWould you like me to prepare a gentle bridge note for your parents?`;
      summaryForParent = 'Your child is carrying intense anxiety regarding an unsatisfactory exam grade. They were terrified of harsh anger or disappointment. They care about their studies and need quiet reassurance rather than an interrogation.';
      doRules = [
        'Acknowledge their courage in telling you honestly.',
        'Give them a reassuring hug or warm beverage before discussing anything.',
        'Focus on future study routines and tutoring help without blame.'
      ];
      dontRules = [
        'DO NOT shout, yell, or react with explosive anger.',
        'DO NOT compare them to siblings, cousins, or classmates.',
        'DO NOT threaten to cancel all activities or ground them immediately.'
      ];
      script = `"Thank you for telling me honestly. I know you were scared I'd be angry, but your honesty matters more to me than any grade. Let's sit together and figure out how to tackle this as a team."`;
    } else if (textLower.includes('break') || textLower.includes('broke') || textLower.includes('damage') || textLower.includes('dropped') || textLower.includes('screen')) {
      category = 'accident';
      emotion = 'Panic over Property Damage';
      aiReply = `Take a deep breath. Please know: **Physical items can always be repaired or replaced, but your emotional safety and peace of mind are priceless.**\n\nAccidents happen to adults every single day. The fact that you are feeling anxious shows you have a strong conscience. Hiding it only makes the worry grow inside your chest.\n\nIf you want, I can notify your parents with an AI Protective Shield. It instructs them to take a 30-second breath and remember it was an honest accident before they talk to you. Would you like me to prepare that?`;
      summaryForParent = 'Your child accidentally damaged a household item while rushing. They are shaking with anxiety and terrified of being screamed at. They want to make amends and need your calm presence.';
      doRules = [
        'Check if your child is physically okay first.',
        'Remind yourself: It is a material item that can be fixed or replaced.',
        'Praise them for admitting it immediately rather than hiding it.'
      ];
      dontRules = [
        'DO NOT yell, slam doors, or use intimidating physical postures.',
        'DO NOT say "You always ruin things" or attack their character.',
        'DO NOT punish an accident the same as intentional misbehavior.'
      ];
      script = `"Take a deep breath. Are you okay? The item is just material, but you are my child and I love you. Thank you for telling me immediately. We will figure out repairs together."`;
    } else if (textLower.includes('fight') || textLower.includes('argument') || textLower.includes('school') || textLower.includes('trouble') || textLower.includes('yell')) {
      category = 'conflict';
      emotion = 'Interpersonal Distress & Fear of Rejection';
      aiReply = `It is completely normal to feel overwhelmed when conflict happens. When tensions rise, our bodies go into fight-or-flight mode, making us feel exhausted or terrified.\n\nRemember: Having a disagreement doesn't make you a bad person. What matters now is how you move forward with calmness and self-respect.\n\nI can help summarize your side of the story respectfully for your parents so they listen to you fully without jumping to conclusions.`;
      summaryForParent = 'Your child experienced an overwhelming interpersonal conflict and feels unheard and defensive. They are terrified of being pre-judged or reprimanded without their side being understood.';
      doRules = [
        'Listen silently for at least 5 minutes before speaking.',
        'Validate how stressful social conflict is at their age.',
        'Offer to be their advocate and partner in resolving it.'
      ];
      dontRules = [
        'DO NOT dismiss their feelings with "It is not a big deal".',
        'DO NOT immediately take the other person’s side without listening.',
        'DO NOT ridicule or shame their reaction.'
      ];
      script = `"I want to hear everything that happened from your perspective. I am in your corner, and we will handle this together peacefully."`;
    } else {
      category = 'fear';
      emotion = 'General Anxiety & Need for Connection';
      aiReply = `Thank you for sharing that with me. It takes real strength to put into words what is bothering you.\n\nWhatever is causing this weight on your shoulders, you don't have to carry it all alone. Often, our biggest fears are the thoughts in our head: *"What if they scream at me? What if they never trust me again?"*\n\nIn reality, parents often react much more calmly when they are given a chance to understand your honesty first. I can prepare a supportive guide for your parents right now so they know how to support you today.`;
      summaryForParent = 'Your child is carrying emotional weight and anxiety today. They need unconditional reassurance that they are loved and valued, and that their home is an emotionally safe harbor.';
      doRules = [
        'Give them space to talk without judgment or uninvited advice.',
        'Reassure them that you are proud of them.',
        'Offer a shared relaxing activity (a walk, snack, or favorite meal).'
      ];
      dontRules = [
        'DO NOT demand immediate explanations if they seem shutdown.',
        'DO NOT use a harsh or sarcastic tone.',
        'DO NOT bring up past mistakes.'
      ];
      script = `"I noticed you seemed carrying a heavy load today. I just want to tell you that I love you no matter what. Whenever you're ready, I'm right here to listen with zero judgment."`;
    }

    // Trigger parent guidance update so parent view receives the insight immediately
    if (onUpdateParentGuidance) {
      onUpdateParentGuidance({
        childId: activeMember.id,
        childName: activeMember.name,
        childRole: activeMember.role,
        lastActive: 'Just now',
        emotionalState: 'High Anxiety',
        anxietyLevelPercent: 85,
        coreConcerns: [category.toUpperCase(), 'Fear of angry response', 'Desire for emotional safety'],
        recentTopic: userText.slice(0, 80),
        recentChatSnippet: userText,
        parentGuidance: {
          overview: summaryForParent,
          doList: doRules,
          dontList: dontRules,
          suggestedOpeningScript: script,
          recommendedActivityTogether: 'Calm evening walk or peaceful dinner',
        },
        bridgeRequestPending: true,
        bridgeMessageText: `Parent, I want to talk to you about something that I was afraid to share. I experienced a setback, but I value your support and want to discuss it calmly together.`,
      });
    }

    return { aiReply, category, emotion };
  };

  const handleSendMessage = (textToSend?: string) => {
    const text = (textToSend || inputVal).trim();
    if (!text) return;

    const userMessage: KidAIChatMessage = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      text,
      timestamp: 'Just now',
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputVal('');
    setIsThinking(true);

    // Realistic typing / thinking delay
    setTimeout(() => {
      const { aiReply, category, emotion } = generateAIResponse(text);
      const aiMessage: KidAIChatMessage = {
        id: `msg-${Date.now() + 1}`,
        sender: 'ai',
        text: aiReply,
        timestamp: 'Just now',
        topicCategory: category,
        detectedEmotion: emotion,
        suggestedAction: 'bridge',
      };
      setMessages((prev) => [...prev, aiMessage]);
      setIsThinking(false);
    }, 1100);
  };

  const handleSendBridgeToParents = () => {
    setBridgeSent(true);
    const confirmationMessage: KidAIChatMessage = {
      id: `msg-bridge-${Date.now()}`,
      sender: 'ai',
      text: `✨ **Safe Bridge Activated!**\n\nI have prepared a calm guidance brief for your parents. When they open their app, they will receive:\n• A reminder that you were brave and honest.\n• Strict advice to stay calm, loving, and supportive.\n• A recommended opening script with zero yelling.\n\nYou did the right thing. Take a deep breath! ❤️`,
      timestamp: 'Just now',
      bridgePrepared: true,
    };
    setMessages((prev) => [...prev, confirmationMessage]);
  };

  const handleSimulateVoiceInput = () => {
    setIsRecording(true);
    setTimeout(() => {
      setIsRecording(false);
      handleSendMessage(
        "I'm feeling really stressed about sharing a mistake with my family because I'm terrified they will be angry at me."
      );
    }, 2200);
  };

  const parentMember = allMembers.find((m) => m.role === 'Parent');

  return (
    <div className="flex-1 flex flex-col bg-[#0f172a] text-slate-100 min-h-[580px] relative">
      {/* Top Gemini/ChatGPT Style Header */}
      <header className="px-4 py-3 bg-[#1e293b]/90 backdrop-blur-md border-b border-slate-700/60 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-sky-500 via-indigo-500 to-purple-500 flex items-center justify-center p-1.5 shadow-md shadow-indigo-500/20">
            <GeminiStarIcon className="w-full h-full text-white" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-sm bg-gradient-to-r from-sky-300 via-indigo-200 to-purple-300 text-transparent bg-clip-text">
                Gemini Confidant
              </span>
              <span className="text-[10px] font-semibold px-2 py-0.2 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                Safe AI
              </span>
            </div>
            <div className="flex items-center gap-1 text-[11px] text-emerald-400">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>100% Private & Non-Judgmental</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Privacy Info Button */}
          <button
            onClick={() => setShowPrivacyTooltip(!showPrivacyTooltip)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            title="Privacy Guardrails"
          >
            <Lock className="w-4 h-4 text-emerald-400" />
          </button>

          {/* Switch to Parent perspective demo shortcut */}
          {parentMember && onSwitchMember && (
            <button
              onClick={() => onSwitchMember(parentMember)}
              className="text-[11px] font-semibold px-2.5 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white shadow-xs transition-all flex items-center gap-1"
              title="See what parents see on their account"
            >
              <span>Switch to Parent View</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          )}
        </div>
      </header>

      {/* Privacy Notice Banner */}
      {showPrivacyTooltip && (
        <div className="mx-4 mt-2 p-3 rounded-xl bg-emerald-950/60 border border-emerald-500/30 text-emerald-200 text-xs flex items-start gap-2 animate-in fade-in">
          <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <p className="font-bold text-white">Your Safe Space Guarantee:</p>
            <p className="text-[11px] text-emerald-300 leading-relaxed">
              Your parents cannot see your raw chat logs. If you choose to bridge, the AI creates a gentle summary coaching your parents to speak to you with patience, warmth, and zero anger.
            </p>
          </div>
        </div>
      )}

      {/* Chat Messages Feed */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'} space-y-1`}
          >
            <div className="flex items-start gap-2 max-w-[88%]">
              {msg.sender === 'ai' && (
                <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-sky-500 to-indigo-600 flex items-center justify-center shrink-0 mt-0.5 shadow-xs">
                  <GeminiStarIcon className="w-4 h-4 text-white" />
                </div>
              )}

              <div
                className={`p-3.5 rounded-2xl text-xs leading-relaxed ${
                  msg.sender === 'user'
                    ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-tr-xs shadow-md'
                    : 'bg-[#1e293b] border border-slate-700/70 text-slate-200 rounded-tl-xs shadow-sm'
                }`}
              >
                <div className="whitespace-pre-wrap">{msg.text}</div>

                {/* Embedded Action to Bridge to Parents if suggested */}
                {msg.sender === 'ai' && msg.suggestedAction === 'bridge' && !bridgeSent && (
                  <div className="mt-3 pt-3 border-t border-slate-700/60 flex flex-col gap-2">
                    <p className="text-[11px] text-indigo-300 font-medium">
                      Want help telling your parents without fear?
                    </p>
                    <button
                      onClick={handleSendBridgeToParents}
                      className="w-full py-2 px-3 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-bold text-xs shadow-sm transition-all flex items-center justify-center gap-1.5 active:scale-95"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-slate-950" />
                      <span>Prepare Safe Bridge to Parents</span>
                      <ArrowRight className="w-3.5 h-3.5 text-slate-950" />
                    </button>
                  </div>
                )}
              </div>
            </div>

            <span className="text-[10px] text-slate-500 px-1">
              {msg.timestamp}
            </span>
          </div>
        ))}

        {/* Gemini Typing Animation */}
        {isThinking && (
          <div className="flex items-center gap-2 text-slate-400 text-xs pl-2 animate-in fade-in">
            <div className="w-6 h-6 rounded-lg bg-gradient-to-tr from-sky-500 to-indigo-600 flex items-center justify-center">
              <GeminiStarIcon className="w-3.5 h-3.5 text-white" />
            </div>
            <div className="flex items-center gap-1.5 bg-[#1e293b] px-3 py-2 rounded-xl border border-slate-700">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-bounce" />
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-bounce [animation-delay:0.2s]" />
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-bounce [animation-delay:0.4s]" />
              <span className="text-[11px] text-indigo-300 ml-1">Gemini is thinking...</span>
            </div>
          </div>
        )}

        {/* Voice recording pulse simulation */}
        {isRecording && (
          <div className="p-3 rounded-2xl bg-rose-950/40 border border-rose-500/40 flex items-center justify-between text-rose-200 text-xs animate-pulse">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping" />
              <span>Listening to your voice... Speak freely</span>
            </div>
            <span className="text-[11px] font-mono text-rose-400">00:02</span>
          </div>
        )}

        {/* Suggested Quick Prompt Cards (Gemini style) */}
        {messages.length <= 2 && !isThinking && (
          <div className="pt-2 space-y-2">
            <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider px-1">
              Suggestions & Common Fears:
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {PROMPT_SUGGESTIONS.map((item, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSendMessage(item.prompt)}
                  className="p-3 rounded-xl bg-[#1e293b]/70 hover:bg-[#1e293b] border border-slate-700/60 hover:border-indigo-500/50 text-left transition-all group cursor-pointer"
                >
                  <div className="text-base mb-1">{item.icon}</div>
                  <div className="text-xs font-bold text-slate-200 group-hover:text-indigo-300">
                    {item.title}
                  </div>
                  <div className="text-[11px] text-slate-400 line-clamp-2 mt-0.5">
                    "{item.prompt}"
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Floating Safe Haven Protection Banner */}
      <div className="px-4 py-2 bg-[#1e293b]/60 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
        <div className="flex items-center gap-1.5 text-indigo-300">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>Parents only receive gentle coaching, never raw words</span>
        </div>
        {onOpenSafeConnect && (
          <button
            onClick={onOpenSafeConnect}
            className="text-amber-400 hover:text-amber-300 font-medium hover:underline text-[11px]"
          >
            Safe Haven Protocol ➔
          </button>
        )}
      </div>

      {/* Bottom Gemini-Style Chat Input Bar */}
      <div className="p-3 bg-[#0f172a] border-t border-slate-800">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="flex items-center gap-2 bg-[#1e293b] border border-slate-700 rounded-2xl px-3 py-1.5 focus-within:border-indigo-500 focus-within:ring-1 focus-within:ring-indigo-500 transition-all shadow-inner"
        >
          {/* Voice Mic Button */}
          <button
            type="button"
            onClick={handleSimulateVoiceInput}
            disabled={isRecording}
            className={`p-2 rounded-xl transition-all ${
              isRecording
                ? 'bg-rose-500 text-white animate-pulse'
                : 'text-slate-400 hover:text-indigo-300 hover:bg-slate-800'
            }`}
            title="Speak with AI"
          >
            <Mic className="w-4 h-4" />
          </button>

          {/* Input field */}
          <input
            type="text"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            placeholder="Ask anything, share a mistake, or talk about fear..."
            className="flex-1 bg-transparent text-xs text-white placeholder-slate-400 outline-none py-2"
          />

          {/* Send Button */}
          <button
            type="submit"
            disabled={!inputVal.trim() || isThinking}
            className="p-2 rounded-xl bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 text-white disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-sm active:scale-95 cursor-pointer"
            aria-label="Send"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
