import React from 'react';
import {
  Smile,
  ShieldCheck,
  Info,
  TrendingUp,
  Heart,
  Calendar,
  X,
} from 'lucide-react';
import { FamilyMember } from '../types';

interface FamilyMoodDashboardProps {
  isOpen: boolean;
  onClose: () => void;
  allMembers: FamilyMember[];
  activeMember: FamilyMember;
  onOpenMoodCheck: () => void;
}

const getMoodStyle = (mood?: string) => {
  switch (mood) {
    case 'Great':
      return { emoji: '😀', bg: 'bg-emerald-50 text-emerald-800 border-emerald-200' };
    case 'Good':
      return { emoji: '🙂', bg: 'bg-teal-50 text-teal-800 border-teal-200' };
    case 'Okay':
      return { emoji: '😐', bg: 'bg-amber-50 text-amber-800 border-amber-200' };
    case 'Tired':
      return { emoji: '🥱', bg: 'bg-indigo-50 text-indigo-800 border-indigo-200' };
    case 'Stressed':
      return { emoji: '😰', bg: 'bg-orange-50 text-orange-800 border-orange-200' };
    case 'Sad':
    case 'Low':
      return { emoji: '😔', bg: 'bg-purple-50 text-purple-800 border-purple-200' };
    default:
      return { emoji: '✨', bg: 'bg-slate-50 text-slate-800 border-slate-200' };
  }
};

export const FamilyMoodDashboard: React.FC<FamilyMoodDashboardProps> = ({
  isOpen,
  onClose,
  allMembers,
  activeMember,
  onOpenMoodCheck,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-3">
      <div className="bg-white rounded-3xl p-5 max-w-sm w-full space-y-4 shadow-2xl border border-purple-100 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Smile className="w-5 h-5 text-purple-600" />
            <h2 className="text-sm font-bold text-slate-900">Family Mood Overview</h2>
          </div>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Anti-Surveillance Privacy Banner */}
        <div className="p-3 bg-purple-50/80 rounded-2xl border border-purple-200 text-xs space-y-1">
          <div className="flex items-center gap-1.5 font-bold text-purple-900 text-[11px] uppercase tracking-wider">
            <ShieldCheck className="w-4 h-4 text-purple-700" />
            <span>Awareness, Not Surveillance</span>
          </div>
          <p className="text-[11px] text-slate-600 leading-relaxed">
            Only general mood statuses voluntarily shared by family members are displayed here.
            Private diary notes and Bridge drafts are strictly never visible.
          </p>
        </div>

        {/* Family Member Cards */}
        <div className="space-y-2.5">
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            Current Shared Moods:
          </div>

          {allMembers.map((member) => {
            const isYou = member.id === activeMember.id;
            const moodStyle = getMoodStyle(member.currentMood);
            return (
              <div
                key={member.id}
                className="p-3 rounded-2xl border border-slate-200 bg-white flex items-center justify-between shadow-xs"
              >
                <div className="flex items-center gap-2.5">
                  <div
                    className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold ${member.avatarColor}`}
                  >
                    {member.initials}
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-900 flex items-center gap-1">
                      <span>{member.name}</span>
                      {isYou && (
                        <span className="text-[10px] text-purple-700 bg-purple-100 px-1.5 py-0.2 rounded font-semibold">
                          You
                        </span>
                      )}
                    </div>
                    <div className="text-[10px] text-slate-400">{member.moodUpdatedAt || 'Updated recently'}</div>
                  </div>
                </div>

                <div
                  className={`px-3 py-1.5 rounded-xl border text-xs font-semibold flex items-center gap-1.5 ${moodStyle.bg}`}
                >
                  <span className="text-base">{moodStyle.emoji}</span>
                  <span>{member.currentMood || 'Good'}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Weekly Family Mood Trend Pattern */}
        <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 text-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="font-bold text-slate-800 text-[11px] uppercase tracking-wider flex items-center gap-1">
              <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />
              <span>General Mood Trends</span>
            </span>
            <span className="text-[10px] text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded-full">
              Stable & Warm
            </span>
          </div>
          <p className="text-[11px] text-slate-600 leading-relaxed">
            Family energy is calm this week with weekend recovery after busy school and work schedules.
          </p>
        </div>

        <button
          onClick={() => {
            onClose();
            onOpenMoodCheck();
          }}
          className="w-full py-2.5 rounded-xl bg-purple-700 hover:bg-purple-800 text-white font-bold text-xs shadow"
        >
          Update Your Mood Check-in
        </button>
      </div>
    </div>
  );
};
