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

  // If not parent, strictly lock to kid AI confidant
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
      {/* RENDER ACTIVE SCREEN */}
      {!isParent ? (
        <KidGeminiConfidantView
          activeMember={activeMember}
          allMembers={allMembers}
          onUpdateParentGuidance={onUpdateParentGuidance}
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
