import React, { useState } from 'react';
import {
  X,
  Bot,
  Sparkles,
  Send,
  ShieldAlert,
  ArrowRight,
  Lightbulb,
} from 'lucide-react';
import { FamilyMember } from '../types';

interface AssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeMember: FamilyMember;
}

interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  actionButton?: { label: string; action: string };
}

const PRESET_PROMPTS = [
  'Suggest something we can do tonight',
  'Help me apologize',
  'Find a time everyone is free',
  'Give us a family challenge',
  'How can I start a conversation with my mom?',
];

export const AssistantModal: React.FC<AssistantModalProps> = ({
  isOpen,
  onClose,
  activeMember,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      sender: 'assistant',
      text: `Hello ${activeMember.name}! I'm your Silah Family Assistant. I help your family coordinate schedules, plan meaningful activities, and find thoughtful words for family conversations. How can I help today?`,
    },
  ]);
  const [inputText, setInputText] = useState('');

  if (!isOpen) return null;

  const handleSendPrompt = (promptText: string) => {
    if (!promptText.trim()) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: promptText,
    };

    let reply = '';
    const textLower = promptText.toLowerCase();

    if (textLower.includes('tonight') || textLower.includes('do')) {
      reply =
        'Looking at your family calendar, everyone is free after 6:00 PM tonight. How about a 30-minute Sunset Walk around the neighborhood park, followed by home pasta dinner together? Walking side-by-side creates a relaxing setting to chat.';
    } else if (textLower.includes('apologize') || textLower.includes('sorry')) {
      reply =
        'A sincere family apology has 3 parts:\n1. Acknowledge what happened simply ("I made a mistake with...").\n2. Own the impact without making excuses ("I realize it caused frustration, and I am sorry.").\n3. Offer a constructive next step ("How can I help fix this?").\nWould you like to draft this in the Bridge tool?';
    } else if (textLower.includes('free') || textLower.includes('time')) {
      reply =
        'I scanned today’s schedules: Dad is free after 5:00 PM, Mom after 6:00 PM, and you are free after 5:00 PM. Your shared window is 6:00 PM to 8:00 PM!';
    } else if (textLower.includes('challenge')) {
      reply =
        'Here is an engaging weekly family challenge: "Dinner Table Trivia" — spend 20 minutes sharing one interesting thing you learned this week without any smartphones at the table!';
    } else if (textLower.includes('mom') || textLower.includes('start a conversation')) {
      reply =
        'Starting a conversation with a parent is easiest during a neutral moment, like offering to make tea or walking together. Try opening with: "Mom, when you have a quiet few minutes later, there’s something I’d love to ask your advice on."';
    } else {
      reply =
        'That’s a great family thought. Let’s look for ways to communicate honestly, respect each person’s schedule, and foster warm connection.';
    }

    const assistantMsg: ChatMessage = {
      id: `asst-${Date.now() + 1}`,
      sender: 'assistant',
      text: reply,
    };

    setMessages((prev) => [...prev, userMsg, assistantMsg]);
    setInputText('');
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-3">
      <div className="bg-white rounded-3xl p-4 max-w-sm w-full space-y-3 shadow-2xl border border-purple-100 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between pb-2 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900">AI Family Assistant</h2>
              <span className="text-[10px] text-purple-600 font-medium">
                Communication & Coordination Aid
              </span>
            </div>
          </div>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Ethical Non-Therapist Boundary Banner */}
        <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-[10px] text-slate-500 leading-snug flex items-start gap-1.5 shrink-0">
          <ShieldAlert className="w-3.5 h-3.5 text-purple-600 shrink-0 mt-0.5" />
          <span>
            <strong>Competition Disclosure:</strong> Silah Assistant does not offer therapy, medical,
            or psychiatric diagnosis. It supports family logistics and healthy dialogue.
          </span>
        </div>

        {/* Chat message feed */}
        <div className="flex-1 overflow-y-auto space-y-2.5 pr-1 py-1 max-h-[340px]">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
            >
              <div
                className={`p-3 rounded-2xl max-w-[88%] text-xs leading-relaxed ${
                  msg.sender === 'user'
                    ? 'bg-purple-700 text-white rounded-tr-xs'
                    : 'bg-purple-50/80 text-slate-800 border border-purple-100 rounded-tl-xs whitespace-pre-line'
                }`}
              >
                {msg.text}
              </div>
            </div>
          ))}
        </div>

        {/* Preset Prompt Suggestions */}
        <div className="space-y-1 shrink-0">
          <div className="flex items-center gap-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
            <Lightbulb className="w-3 h-3 text-amber-500" />
            <span>Suggested Inquiries:</span>
          </div>
          <div className="flex gap-1.5 overflow-x-auto pb-1 no-scrollbar">
            {PRESET_PROMPTS.map((prompt, idx) => (
              <button
                key={idx}
                onClick={() => handleSendPrompt(prompt)}
                className="px-2.5 py-1 rounded-full bg-slate-100 hover:bg-purple-100 text-slate-700 hover:text-purple-900 text-[10px] font-medium whitespace-nowrap border border-slate-200 transition-colors shrink-0"
              >
                {prompt}
              </button>
            ))}
          </div>
        </div>

        {/* Input box */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendPrompt(inputText);
          }}
          className="flex items-center gap-2 pt-1 border-t border-slate-100 shrink-0"
        >
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Ask for family advice or planning..."
            className="flex-1 p-2.5 rounded-xl border border-slate-200 text-xs text-slate-800 outline-none focus:border-purple-600"
          />
          <button
            type="submit"
            disabled={!inputText.trim()}
            className="p-2.5 rounded-xl bg-purple-700 hover:bg-purple-800 disabled:opacity-40 text-white shadow transition-all active:scale-95"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
