import React, { useState } from 'react';
import {
  Sparkles,
  Heart,
  Bot,
  UserCheck,
  ShieldCheck,
  RotateCcw,
  ArrowRight,
} from 'lucide-react';
import { FamilyMember, BridgeMessage, ChildAIInteractionSummary } from '../types';
import { KidGeminiConfidantView, GeminiStarIcon } from './KidGeminiConfidantView';
import { ParentBridgeGuidanceView } from './ParentBridgeGuidanceView';

interface BridgeScreenProps {
  activeMember: FamilyMember;
  allMembers: FamilyMember[];
  onConversationCompleted: (message: BridgeMessage) => void;
  onSwitchMember: (member: FamilyMember) => void;
  onOpenSafeConnect?: () => void;
  guidanceSummary?: ChildAIInteractionSummary;
  onUpdateParentGuidance?: (summary: ChildAIInteractionSummary) => void;
}

export const BridgeScreen: React.FC<BridgeScreenProps> = ({
  activeMember,
  allMembers,
  onConversationCompleted,
  onSwitchMember,
  onOpenSafeConnect,
  guidanceSummary,
  onUpdateParentGuidance,
}) => {
  const isParent = activeMember.role === 'Parent';

  // Allow toggling view mode directly: 'kid-gemini' or 'parent-guidance'
  // Defaults based on who is currently logged in!
  const [viewMode, setViewMode] = useState<'kid-gemini' | 'parent-guidance'>(
    isParent ? 'parent-guidance' : 'kid-gemini'
  );

  // Sync viewMode if activeMember role changes
  React.useEffect(() => {
    setViewMode(activeMember.role === 'Parent' ? 'parent-guidance' : 'kid-gemini');
  }, [activeMember.role]);

  const handleParentReassuranceSent = (replyText: string) => {
    const parentMember = allMembers.find((m) => m.role === 'Parent') || activeMember;
    const kidMember = allMembers.find((m) => m.role === 'Teenager' || m.role === 'Child') || allMembers[2];

    const completedMsg: BridgeMessage = {
      id: `bridge-${Date.now()}`,
      senderId: kidMember.id,
      recipientId: parentMember.id,
      originalText: guidanceSummary?.recentChatSnippet || 'Discussed an honest mistake and anxiety about parental anger.',
      detectedLanguage: 'English',
      languageCode: 'en',
      languageConfidence: 0.99,
      detectedToneCategories: ['fear', 'anxiety', 'academic'],
      understandingSummary: guidanceSummary?.parentGuidance.overview || 'Child sought emotional safety and calm reassurance.',
      calmSuggestedText: guidanceSummary?.bridgeMessageText || 'I made an honest mistake and value your support.',
      finalApprovedText: guidanceSummary?.bridgeMessageText || 'I made an honest mistake and value your support.',
      status: 'completed',
      createdAt: new Date().toISOString(),
      sentAt: new Date().toISOString(),
      parentResponse: {
        text: replyText,
        action: 'talk',
        smartReplyUsed: true,
        respondedAt: new Date().toISOString(),
      },
      outcomeRating: 'better',
    };

    onConversationCompleted(completedMsg);
  };

  return (
    <div className="flex-1 flex flex-col">
      {/* Top Perspective / View Mode Switcher Pill */}
      <div className="bg-[#1e293b] px-3 py-2 border-b border-slate-700/80 flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5 text-xs text-slate-300">
          <span className="text-[11px] text-slate-400 font-medium">Perspective:</span>
          <span className="font-bold text-white flex items-center gap-1">
            {activeMember.name}
            <span className="text-[10px] px-1.5 py-0.2 rounded-md bg-purple-500/20 text-purple-300 border border-purple-500/30">
              {activeMember.role}
            </span>
          </span>
        </div>

        {/* 1-Tap Toggle between Kid Gemini AI Screen and Parent Guidance Screen */}
        <div className="flex items-center bg-slate-900/80 p-0.5 rounded-xl border border-slate-700">
          <button
            onClick={() => setViewMode('kid-gemini')}
            className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              viewMode === 'kid-gemini'
                ? 'bg-gradient-to-r from-sky-500 to-indigo-600 text-white shadow-xs'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <GeminiStarIcon className="w-3.5 h-3.5" />
            <span>Kid AI Chat</span>
          </button>

          <button
            onClick={() => setViewMode('parent-guidance')}
            className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              viewMode === 'parent-guidance'
                ? 'bg-gradient-to-r from-purple-700 to-indigo-700 text-white shadow-xs'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Heart className="w-3.5 h-3.5 text-rose-300" />
            <span>Parent Guide</span>
          </button>
        </div>
      </div>

      {/* RENDER ACTIVE SCREEN */}
      {viewMode === 'kid-gemini' ? (
        <KidGeminiConfidantView
          activeMember={activeMember}
          allMembers={allMembers}
          onOpenSafeConnect={onOpenSafeConnect}
          onUpdateParentGuidance={onUpdateParentGuidance}
          onSwitchMember={onSwitchMember}
        />
      ) : (
        <ParentBridgeGuidanceView
          activeMember={activeMember}
          allMembers={allMembers}
          guidanceSummary={guidanceSummary}
          onSendReassurance={handleParentReassuranceSent}
          onOpenSafeConnect={onOpenSafeConnect}
          onSwitchMember={onSwitchMember}
        />
      )}
    </div>
  );
};
