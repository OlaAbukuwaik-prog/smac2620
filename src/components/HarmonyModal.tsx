import React from 'react';
import {
  X,
  TrendingUp,
  Info,
  CheckCircle,
  Clock,
  Sparkles,
  ShieldCheck,
  Award,
} from 'lucide-react';
import { HarmonyReportData } from '../types';

interface HarmonyModalProps {
  isOpen: boolean;
  onClose: () => void;
  report: HarmonyReportData;
}

export const HarmonyModal: React.FC<HarmonyModalProps> = ({
  isOpen,
  onClose,
  report,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-3">
      <div className="bg-white rounded-3xl p-5 max-w-sm w-full space-y-4 shadow-2xl border border-purple-100 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-purple-950 font-bold text-sm">
            <Award className="w-5 h-5 text-purple-600" />
            <span>Family Harmony Report</span>
          </div>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Score Header */}
        <div className="p-4 bg-gradient-to-br from-purple-800 to-indigo-950 text-white rounded-2xl flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold text-purple-200 uppercase tracking-wider block">
              Family Connection Index
            </span>
            <div className="text-3xl font-black tracking-tight">{report.score}%</div>
            <div className="flex items-center gap-1.5 text-xs text-emerald-300 font-semibold mt-0.5">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>+{report.weeklyTrend}% from last week ({report.previousScore}%)</span>
            </div>
          </div>

          <div className="text-right space-y-1 text-xs text-purple-200">
            <div>
              <span className="font-bold text-white">{report.sharedActivitiesCount}</span> Activities
            </div>
            <div>
              <span className="font-bold text-white">{report.challengesCompleted}</span> Challenges
            </div>
            <div>
              <span className="font-bold text-white">{report.sharedTimeHours}</span> Shared Time
            </div>
          </div>
        </div>

        {/* Vital Competition Disclaimer: Not medical / psychological */}
        <div className="p-3 bg-amber-50 rounded-2xl border border-amber-200 text-xs text-amber-950 space-y-1">
          <div className="flex items-center gap-1.5 font-bold text-[11px] uppercase tracking-wider text-amber-900">
            <ShieldCheck className="w-4 h-4 text-amber-700" />
            <span>What This Score Means</span>
          </div>
          <p className="text-[11px] leading-relaxed text-amber-900/90">
            The Harmony Score is strictly an application engagement and family coordination indicator.
            It does <strong>NOT</strong> represent a medical or psychological diagnosis.
          </p>
          <div className="text-[10px] text-amber-800 pt-1 border-t border-amber-200/60">
            Inputs: Completed family dinners, shared walks, AI Bridge respectful dialogues, and voluntary mood trends.
          </div>
        </div>

        {/* Positive Activities this week */}
        <div className="space-y-2">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
            Positive Moments This Week:
          </span>
          <div className="space-y-1.5">
            {report.positiveActivities.map((act, i) => (
              <div
                key={i}
                className="p-2.5 rounded-xl border border-slate-100 bg-slate-50 flex items-start gap-2.5 text-xs"
              >
                <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold text-slate-800">
                    {act.title} <span className="text-[10px] font-normal text-purple-700">({act.count})</span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-0.5">{act.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Suggested Improvements */}
        <div className="space-y-2">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
            Suggested Next Steps:
          </span>
          <div className="space-y-1">
            {report.suggestedImprovements.map((tip, i) => (
              <div
                key={i}
                className="p-2.5 rounded-xl bg-purple-50/70 border border-purple-200 text-xs text-purple-950 flex items-center gap-2"
              >
                <Sparkles className="w-3.5 h-3.5 text-purple-700 shrink-0" />
                <span>{tip}</span>
              </div>
            ))}
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full py-2.5 rounded-xl bg-purple-700 hover:bg-purple-800 text-white font-bold text-xs shadow"
        >
          Got it
        </button>
      </div>
    </div>
  );
};
