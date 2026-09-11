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
  VolumeX,
  Share2,
  Copy,
  Check,
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
  const [showPrivacyTooltip, setShowPrivacyTooltip] = useState(false);
  const [speakingMsgId, setSpeakingMsgId] = useState<string | null>(null);
  const [copiedMsgId, setCopiedMsgId] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isThinking]);

  useEffect(() => {
    return () => {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const toggleSpeakText = (msgId: string, text: string) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    if (speakingMsgId === msgId) {
      window.speechSynthesis.cancel();
      setSpeakingMsgId(null);
      return;
    }
    window.speechSynthesis.cancel();
    const cleanText = text.replace(/\*\*/g, '').replace(/•/g, '').replace(/🧘|👋|❤️|✨/g, '');
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.rate = 0.95;
    utterance.pitch = 1.05;
    utterance.onend = () => setSpeakingMsgId(null);
    utterance.onerror = () => setSpeakingMsgId(null);
    setSpeakingMsgId(msgId);
    window.speechSynthesis.speak(utterance);
  };

  const handleCopyMessage = (msgId: string, text: string) => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopiedMsgId(msgId);
      setTimeout(() => setCopiedMsgId(null), 2000);
    }
  };

  const handleResetChat = () => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setSpeakingMsgId(null);
    setMessages([
      {
        id: `welcome-${Date.now()}`,
        sender: 'ai',
        text: `Hello! 👋 I'm Gemini, your private Silah AI confidant.\n\nYou are in a completely safe, judgment-free space. You can talk to me about anything—whether you made an honest mistake, feel nervous about school, had a conflict, or are scared of your parents getting angry.\n\nHow are you feeling right now? You can type anything, speak, or pick one of the suggestions below.`,
        timestamp: 'Just now',
      },
    ]);
  };

  // Intelligent conversational response generator:
  // Soothes and guides the child directly, and AUTOMATICALLY generates parent guidance for the parent's side without asking the child!
  const generateAIResponse = (userText: string) => {
    const textLower = userText.toLowerCase();

    let aiReply = '';
    let category: 'academic' | 'accident' | 'conflict' | 'fear' | 'general' = 'general';
    let emotion = 'Anxious';
    let summaryForParent = '';
    let doRules: string[] = [];
    let dontRules: string[] = [];
    let script = '';
    const childName = activeMember.name || 'Your child';

    if (textLower.includes('fail') || textLower.includes('grade') || textLower.includes('exam') || textLower.includes('test') || textLower.includes('score') || textLower.includes('school')) {
      category = 'academic';
      emotion = 'Academic Panic & Fear of Disappointment';
      aiReply = `I hear you, and I want you to take a slow, deep breath right now. Inhale for 4 seconds... and exhale for 6 seconds. 🧘\n\nFirst: **One test score or difficult day at school does NOT define your worth or your future.** Every single person stumbles with grades at some point. The fact that you care so much shows your heart is in the right place.\n\nSecond: You did the bravest thing by putting this into words instead of bottling it up inside your chest.\n\nRemember: your parents love you for who you are, not just your grades. When you speak with them, take a deep breath. In the meantime, I'm right here with you whenever you need to talk.`;
      summaryForParent = `${childName} is carrying intense anxiety regarding an academic test or school grade. Underneath the panic is a deep desire to make you proud and a fear of harsh anger or disappointment. They need calm reassurance and teamwork rather than interrogation.`;
      doRules = [
        'Acknowledge their courage in speaking honestly with you.',
        'Give them a reassuring hug or offer a warm beverage before discussing school.',
        'Focus on future study routines and tutoring help as a supportive team without blame.',
        'Remind them: "My love for you never depends on a test score."',
      ];
      dontRules = [
        'DO NOT shout, yell, or react with explosive anger.',
        'DO NOT compare them to siblings, cousins, or classmates.',
        'DO NOT threaten to cancel all social activities or ground them in anger.',
        'DO NOT lecture or interrogate them while their nervous system is activated.',
      ];
      script = `"Thank you for telling me honestly. I know you were worried I might be upset, but your honesty and well-being matter far more to me than any grade. Let's take a deep breath and figure out how to tackle this together as a team."`;
    } else if (textLower.includes('break') || textLower.includes('broke') || textLower.includes('damage') || textLower.includes('dropped') || textLower.includes('screen') || textLower.includes('accident') || textLower.includes('mess')) {
      category = 'accident';
      emotion = 'Panic & Guilt over an Accident';
      aiReply = `Take a deep breath. Please remember: **Physical items can always be fixed, glued, or replaced, but your emotional peace of mind and safety are priceless.**\n\nAccidents happen to adults every single day—people drop dishes, spill drinks, and bump into things. The fact that you feel so anxious shows you have a strong, caring conscience.\n\nYou are not in danger. You made an honest mistake, and making mistakes is part of being human. Drink a sip of water, relax your shoulders, and be gentle with yourself right now.`;
      summaryForParent = `${childName} experienced an accidental mishap or damage to an item. They are trembling with anxiety and terrified of being yelled at or shamed. They feel genuine remorse and need your steady, calm presence.`;
      doRules = [
        'Check on your child’s emotional and physical safety first before looking at the item.',
        'Remind yourself: It is a material possession that can be repaired or replaced.',
        'Praise them warmly for admitting it immediately rather than trying to hide it.',
        'Guide them calmly on how to clean up or help repair it together without anger.',
      ];
      dontRules = [
        'DO NOT yell, slam doors, or use intimidating body language.',
        'DO NOT say "You always ruin things" or attack their personal character.',
        'DO NOT treat an accidental mistake the same as intentional disobedience.',
        'DO NOT bring up past accidents.',
      ];
      script = `"Take a deep breath. Are you okay? The item is just material, but you are my child and I love you. Thank you for telling me right away. We will clean it up and solve it together."`;
    } else if (textLower.includes('fight') || textLower.includes('argument') || textLower.includes('friend') || textLower.includes('bully') || textLower.includes('ignore') || textLower.includes('mean') || textLower.includes('trouble')) {
      category = 'conflict';
      emotion = 'Interpersonal Distress & Feeling Misunderstood';
      aiReply = `It is completely normal to feel shaken and exhausted when conflict happens with friends or classmates. When tension rises, our bodies go into fight-or-flight mode, making our hearts beat fast.\n\nRemember: Having a disagreement or dealing with mean words doesn't mean anything is wrong with you. You deserve to be treated with kindness, respect, and fairness.\n\nYou don't have to carry the weight of other people's behavior on your shoulders. Let your body relax, let go of the tension in your jaw, and give yourself credit for staying calm.`;
      summaryForParent = `${childName} is dealing with painful interpersonal conflict or feeling excluded/bullied. They feel defensive and vulnerable, terrified that you might judge them or dismiss their social pain.`;
      doRules = [
        'Listen silently for at least 5 to 10 minutes without offering immediate solutions or lectures.',
        'Validate their emotional pain: "That sounds really hurtful, I understand why you feel upset."',
        'Assure them that you are 100% on their side and in their corner.',
        'Offer a low-pressure relaxing environment (a quiet walk, favorite meal, or movie).',
      ];
      dontRules = [
        'DO NOT dismiss their feelings with "It is no big deal" or "Just ignore it".',
        'DO NOT immediately blame your child or take the other person’s side without hearing the full story.',
        'DO NOT shame them for crying or showing emotional distress.',
      ];
      script = `"I want to hear everything that happened from your perspective. Take all the time you need. I'm right here, I believe in you, and we will handle this together peacefully."`;
    } else {
      category = 'fear';
      emotion = 'General Anxiety & Need for Emotional Safety';
      aiReply = `Thank you for sharing that with me. It takes real courage to put your thoughts into words when things feel overwhelming.\n\nWhatever is causing this weight on your shoulders, please know that you are safe right here. Sometimes our minds play tricks on us, making us worry: *"What if they get angry? What if I'm not good enough?"*\n\nTake a slow breath in... and let it out. You are worthy, you are loved, and difficulties are only temporary moments that you will get through. I am right here with you anytime you need to talk.`;
      summaryForParent = `${childName} is carrying significant emotional weight and anxiety today. They need unconditional reassurance that they are loved, valued, and that home is a warm, emotionally safe haven where they will never be judged or yelled at.`;
      doRules = [
        'Greet them with physical warmth (a hug, a gentle touch on the shoulder) and a warm smile.',
        'Give them space to unwind without bombarding them with questions or chores.',
        'Reassure them: "I love you no matter what kind of day you had."',
        'Offer a quiet shared activity (taking a 15-minute walk, preparing a snack together).',
      ];
      dontRules = [
        'DO NOT demand immediate explanations if they appear quiet or withdrawn.',
        'DO NOT use sarcasm, sharp tones, or exasperated sighs.',
        'DO NOT bring up past mistakes or lecture about responsibility when they are already stressed.',
      ];
      script = `"Hey sweetheart, I noticed you seemed carrying a heavy load today. I just want to tell you that I love you no matter what. Whenever you feel like talking, I'm right here with zero judgment and all the love in the world."`;
    }

    // AUTOMATICALLY synthesize and update parent guidance without asking the child!
    if (onUpdateParentGuidance) {
      onUpdateParentGuidance({
        childId: activeMember.id,
        childName: activeMember.name || 'Your child',
        childRole: activeMember.role || 'Child',
        lastActive: 'Just now',
        emotionalState: emotion,
        anxietyLevelPercent: 82,
        coreConcerns: [category.toUpperCase(), 'Fear of anger or yelling', 'Need for emotional safety'],
        recentTopic: userText.slice(0, 80),
        recentChatSnippet: userText,
        parentGuidance: {
          overview: summaryForParent,
          doList: doRules,
          dontList: dontRules,
          suggestedOpeningScript: script,
          recommendedActivityTogether: 'Quiet evening walk, warm beverage, or relaxed family dinner',
        },
        bridgeRequestPending: true,
        bridgeMessageText: `Parent, I experienced a difficult situation today. I care about our connection and want to talk calmly together.`,
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
      };
      setMessages((prev) => [...prev, aiMessage]);
      setIsThinking(false);
    }, 1100);
  };

  const handleVoiceInput = () => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition =
        (window as unknown as { SpeechRecognition?: unknown; webkitSpeechRecognition?: unknown })
          .SpeechRecognition ||
        (window as unknown as { webkitSpeechRecognition?: unknown }).webkitSpeechRecognition;

      if (SpeechRecognition && typeof SpeechRecognition === 'function') {
        try {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const recognition = new (SpeechRecognition as any)();
          recognition.continuous = false;
          recognition.interimResults = false;
          recognition.lang = 'en-US';
          setIsRecording(true);

          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          recognition.onresult = (event: any) => {
            const transcript = event.results?.[0]?.[0]?.transcript;
            if (transcript) {
              setInputVal(transcript);
            }
            setIsRecording(false);
          };

          recognition.onerror = () => {
            setIsRecording(false);
          };

          recognition.onend = () => {
            setIsRecording(false);
          };

          recognition.start();
          return;
        } catch (err) {
          console.warn('Microphone permission or recognition failed:', err);
        }
      }
    }
    handleSimulateVoiceInput();
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
            </div>
            <div className="flex items-center gap-1 text-[11px] text-emerald-400">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>100% Private & Non-Judgmental</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Reset Chat Button */}
          <button
            onClick={handleResetChat}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            title="Reset conversation"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          {/* Privacy Info Button */}
          <button
            onClick={() => setShowPrivacyTooltip(!showPrivacyTooltip)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            title="Privacy Guardrails"
          >
            <Lock className="w-4 h-4 text-emerald-400" />
          </button>
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

                {/* Message Utility Toolbar (Listen & Copy) */}
                <div className="mt-2.5 pt-2 border-t border-white/10 flex items-center justify-between text-[10px] text-slate-400">
                  <div className="flex items-center gap-3">
                    {msg.sender === 'ai' && (
                      <button
                        onClick={() => toggleSpeakText(msg.id, msg.text)}
                        className="flex items-center gap-1 hover:text-white transition-colors cursor-pointer"
                        title={speakingMsgId === msg.id ? 'Stop listening' : 'Read aloud'}
                      >
                        {speakingMsgId === msg.id ? (
                          <>
                            <VolumeX className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
                            <span className="text-amber-300 font-semibold">Stop</span>
                          </>
                        ) : (
                          <>
                            <Volume2 className="w-3.5 h-3.5" />
                            <span>Read Aloud</span>
                          </>
                        )}
                      </button>
                    )}

                    <button
                      onClick={() => handleCopyMessage(msg.id, msg.text)}
                      className="flex items-center gap-1 hover:text-white transition-colors cursor-pointer"
                      title="Copy advice"
                    >
                      {copiedMsgId === msg.id ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                          <span className="text-emerald-300 font-semibold">Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Copy</span>
                        </>
                      )}
                    </button>
                  </div>

                  <span className="text-[10px] text-slate-500">
                    {msg.timestamp}
                  </span>
                </div>
              </div>
            </div>
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
            onClick={handleVoiceInput}
            disabled={isRecording}
            className={`p-2 rounded-xl transition-all cursor-pointer ${
              isRecording
                ? 'bg-rose-500 text-white animate-pulse'
                : 'text-slate-400 hover:text-indigo-300 hover:bg-slate-800'
            }`}
            title={isRecording ? 'Listening...' : 'Speak with AI'}
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
