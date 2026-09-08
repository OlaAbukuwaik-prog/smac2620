import React, { useState } from 'react';
import {
  X,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  HeartHandshake,
  Calendar as CalendarIcon,
  Smile,
  Users,
  Award,
  ChevronRight,
} from 'lucide-react';
import { FamilyMember, Family, FamilyEvent, WeeklyChallenge } from '../types';

interface CompetitionStoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyStepAction: (stepNumber: number) => void;
}

const STORY_STEPS = [
  {
    step: 1,
    actor: 'Teenager',
    title: 'Daily Mood Check',
    description: 'The teenager opens Silah after facing a stressful situation and logs their mood as "Nervous / Not great".',
    actionLabel: 'Log "Nervous" Mood',
    tag: 'Mood Tracker',
  },
  {
    step: 2,
    actor: 'Teenager',
    title: 'Opens AI Bridge',
    description: 'The teenager selects [Tell Someone Something] to address a difficult conversation without triggering anger.',
    actionLabel: 'Open Bridge',
    tag: 'AI Bridge',
  },
  {
    step: 3,
    actor: 'Teenager',
    title: 'Writes Raw Thoughts',
    description: '"I am worried about sharing an honest mistake with my family because I fear an angry reaction."',
    actionLabel: 'Input Honest Concern',
    tag: 'Raw Input',
  },
  {
    step: 4,
    actor: 'Silah On-Device ML Kit',
    title: 'Calm Truthful Synthesis',
    description: 'Language ID detects English (99%). Tone analyzer identifies worry about reaction. Generates a calm, truthful, respectful message.',
    actionLabel: 'Synthesize Calmer Version',
    tag: 'Google ML Kit',
  },
  {
    step: 5,
    actor: 'Teenager',
    title: 'Reviews & Approves',
    description: 'The teenager reviews the calm text, confirms it preserves the honest truth, and approves sending it.',
    actionLabel: 'Approve & Send',
    tag: 'User Privacy Control',
  },
  {
    step: 6,
    actor: 'Parent',
    title: 'Parent Receives Message',
    description: 'Notification arrives: "Your child wants to share something important with you." Calming listening notice displayed first.',
    actionLabel: 'Switch to Parent Screen',
    tag: 'Parent View',
  },
  {
    step: 7,
    actor: 'Google ML Kit',
    title: 'Smart Reply Support',
    description: 'On-device ML Kit generates calm options: "Thank you for telling me.", "Of course. We can talk calmly."',
    actionLabel: 'View Smart Reply Options',
    tag: 'Smart Reply',
  },
  {
    step: 8,
    actor: 'Parent',
    title: 'Parent Calm Reply',
    description: 'Parent selects: "Thank you for telling me honestly. Let’s talk calmly after dinner."',
    actionLabel: 'Send Supportive Reply',
    tag: 'Parent Response',
  },
  {
    step: 9,
    actor: 'Teenager',
    title: 'Conversation Completion',
    description: 'The teenager receives the warm response and rates the outcome: ❤️ "I feel better".',
    actionLabel: 'Rate Outcome ❤️',
    tag: 'Relief',
  },
  {
    step: 10,
    actor: 'Silah Engine',
    title: 'Family Harmony Increases',
    description: 'Harmony score increases from 82% to 84% (+2%) reflecting positive communication without conflict.',
    actionLabel: 'Update Harmony Score',
    tag: 'Harmony Index',
  },
  {
    step: 11,
    actor: 'Shared Family Calendar',
    title: 'Calculates Free Overlap',
    description: 'Find Free Time checks authorized schedules: Father free after 5:00 PM, Mother after 6:00 PM. "Everyone is free 6:00 PM to 8:00 PM."',
    actionLabel: 'Calculate Availability',
    tag: 'OAuth Calendar',
  },
  {
    step: 12,
    actor: 'Silah AI Suggestion',
    title: 'Family Dinner Recommendation',
    description: 'Silah recommends: "Family dinner at 6:30 PM in the dining room with phone-free table."',
    actionLabel: 'Show Recommendation',
    tag: 'Smart Suggestion',
  },
  {
    step: 13,
    actor: 'The Family',
    title: 'Family Accepts Suggestion',
    description: 'The family accepts the suggested dinner, scheduling dedicated face-to-face time.',
    actionLabel: 'Add Dinner to Calendar',
    tag: 'Coordinated Time',
  },
  {
    step: 14,
    actor: 'Weekly Challenge',
    title: 'Challenge Progress: 100%',
    description: 'Shared dinner reaches 2 of 2 completed. The weekly challenge is achieved with celebration! 🎉',
    actionLabel: 'Complete Challenge',
    tag: 'Milestone',
  },
  {
    step: 15,
    actor: 'Silah Core Principle',
    title: 'Central Philosophy',
    description: '"Silah doesn\'t replace family conversations. It helps families have them."',
    actionLabel: 'Finish Showcase',
    tag: 'Grand Finale',
  },
];

export const CompetitionStoryModal: React.FC<CompetitionStoryModalProps> = ({
  isOpen,
  onClose,
  onApplyStepAction,
}) => {
  const [currentIdx, setCurrentIdx] = useState(0);

  if (!isOpen) return null;

  const currentStep = STORY_STEPS[currentIdx];
  const isLast = currentIdx === STORY_STEPS.length - 1;

  const handleNext = () => {
    onApplyStepAction(currentStep.step);
    if (!isLast) {
      setCurrentIdx(currentIdx + 1);
    } else {
      onClose();
    }
  };

  const handlePrev = () => {
    if (currentIdx > 0) {
      setCurrentIdx(currentIdx - 1);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3">
      <div className="bg-white rounded-3xl p-5 max-w-sm w-full space-y-4 shadow-2xl border border-purple-100 animate-in fade-in zoom-in-95 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="p-1 rounded-lg bg-amber-100 text-amber-800 font-bold text-xs">
              SMAC Story
            </span>
            <h2 className="text-xs font-bold text-slate-800">
              Competition Flow ({currentIdx + 1}/{STORY_STEPS.length})
            </h2>
          </div>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Story Progress Bar */}
        <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-purple-600 to-indigo-600 rounded-full transition-all duration-300"
            style={{ width: `${((currentIdx + 1) / STORY_STEPS.length) * 100}%` }}
          />
        </div>

        {/* Step Card */}
        <div className="p-4 bg-gradient-to-br from-purple-900 to-indigo-950 text-white rounded-2xl space-y-2.5 shadow-md">
          <div className="flex items-center justify-between text-[11px]">
            <span className="font-semibold text-purple-200">{currentStep.actor}</span>
            <span className="px-2 py-0.5 rounded-full bg-white/20 text-amber-300 font-bold text-[10px]">
              {currentStep.tag}
            </span>
          </div>

          <h3 className="text-base font-bold text-white leading-snug">{currentStep.title}</h3>
          <p className="text-xs text-purple-100 leading-relaxed font-normal">
            {currentStep.description}
          </p>
        </div>

        {/* Action Controls */}
        <div className="space-y-2 pt-1">
          <button
            id={`story-step-action-btn-${currentStep.step}`}
            onClick={handleNext}
            className="w-full py-3 rounded-xl bg-purple-700 hover:bg-purple-800 text-white font-bold text-xs shadow flex items-center justify-center gap-2 transition-all active:scale-95"
          >
            <span>{currentStep.actionLabel}</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <div className="flex items-center justify-between text-xs pt-1">
            <button
              onClick={handlePrev}
              disabled={currentIdx === 0}
              className="text-slate-400 hover:text-slate-600 disabled:opacity-30 font-medium flex items-center gap-1"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Previous</span>
            </button>

            <button
              onClick={onClose}
              className="text-purple-700 hover:text-purple-900 font-semibold"
            >
              Skip Walkthrough
            </button>
          </div>
        </div>

        {/* Central Creed Footer */}
        <div className="pt-2 border-t border-slate-100 text-center">
          <p className="text-[10px] text-slate-500 italic">
            "Silah doesn't replace family conversations. It helps families have them."
          </p>
        </div>
      </div>
    </div>
  );
};
