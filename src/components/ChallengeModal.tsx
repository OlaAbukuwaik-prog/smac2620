import React from 'react';
import {
  X,
  CheckCircle2,
  Users,
  Clock,
  Award,
  Sparkles,
  PartyPopper,
} from 'lucide-react';
import { WeeklyChallenge, FamilyMember } from '../types';

interface ChallengeModalProps {
  isOpen: boolean;
  onClose: () => void;
  challenge: WeeklyChallenge;
  allMembers: FamilyMember[];
  onIncrementChallenge: () => void;
}

export const ChallengeModal: React.FC<ChallengeModalProps> = ({
  isOpen,
  onClose,
  challenge,
  allMembers,
  onIncrementChallenge,
}) => {
  if (!isOpen) return null;

  const percent = Math.min(
    100,
    Math.round((challenge.currentCount / challenge.targetCount) * 100)
  );

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-3">
      <div className="bg-white rounded-3xl p-5 max-w-sm w-full space-y-4 shadow-2xl border border-purple-100 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-purple-950 font-bold text-sm">
            <CheckCircle2 className="w-5 h-5 text-purple-600" />
            <span>Weekly Family Challenge</span>
          </div>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Challenge Header Card */}
        <div className="p-4 bg-gradient-to-br from-purple-800 to-indigo-900 text-white rounded-2xl space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase font-bold text-amber-300">Active Challenge</span>
            <span className="text-[11px] font-semibold text-purple-200">
              {challenge.remainingDays} days remaining
            </span>
          </div>

          <h3 className="text-base font-bold text-white">{challenge.title}</h3>
          <p className="text-xs text-purple-100">{challenge.goalDescription}</p>

          {/* Progress Bar */}
          <div className="pt-2">
            <div className="flex justify-between text-xs font-semibold text-purple-200 mb-1">
              <span>Progress:</span>
              <span className="text-white">
                {challenge.currentCount} / {challenge.targetCount} {challenge.unit} ({percent}%)
              </span>
            </div>
            <div className="w-full h-3 bg-white/20 rounded-full overflow-hidden">
              <div
                className="h-full bg-amber-400 rounded-full transition-all duration-500"
                style={{ width: `${percent}%` }}
              />
            </div>
          </div>
        </div>

        {/* Participants */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-slate-700">Participating Family Members:</span>
            <span className="text-purple-700 font-semibold">{challenge.participantIds.length} members</span>
          </div>

          <div className="flex items-center gap-2">
            {challenge.participantIds.map((pId) => {
              const m = allMembers.find((mem) => mem.id === pId);
              if (!m) return null;
              return (
                <div
                  key={pId}
                  className="flex items-center gap-1 px-2 py-1 rounded-xl bg-slate-100 text-xs font-medium text-slate-700"
                >
                  <div
                    className={`w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-bold ${m.avatarColor}`}
                  >
                    {m.initials}
                  </div>
                  <span>{m.name.split(' ')[0]}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Achievement / Reward note */}
        <div className="p-3 bg-purple-50 rounded-2xl border border-purple-200 text-xs text-purple-900 flex items-start gap-2">
          <Sparkles className="w-4 h-4 text-purple-600 shrink-0 mt-0.5" />
          <div>
            <div className="font-bold">Challenge Reward:</div>
            <p className="text-[11px] text-purple-800">{challenge.rewardNote}</p>
          </div>
        </div>

        {challenge.isCompleted ? (
          <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl text-xs font-semibold flex items-center justify-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            <span>Challenge Completed! +5 Harmony points awarded!</span>
          </div>
        ) : (
          <button
            id="mark-dinner-completed-btn"
            onClick={onIncrementChallenge}
            className="w-full py-2.5 rounded-xl bg-purple-700 hover:bg-purple-800 text-white font-bold text-xs shadow flex items-center justify-center gap-2 transition-all active:scale-95"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Mark Shared Dinner as Completed (+1)</span>
          </button>
        )}
      </div>
    </div>
  );
};
