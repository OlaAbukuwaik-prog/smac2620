import React, { useState } from 'react';
import {
  X,
  Lock,
  Eye,
  Check,
  Smile,
  ShieldCheck,
  TrendingUp,
  BarChart2,
} from 'lucide-react';
import { MoodType, MoodEntry, FamilyMember } from '../types';

interface MoodTrackerModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeMember: FamilyMember;
  moodHistory: MoodEntry[];
  onSaveMood: (entry: Omit<MoodEntry, 'id' | 'timestamp'>) => void;
}

const MOODS: { type: MoodType; emoji: string; label: string; desc: string }[] = [
  { type: 'Great', emoji: '😀', label: 'Great', desc: 'Feeling energized and happy' },
  { type: 'Good', emoji: '🙂', label: 'Good', desc: 'Positive and calm' },
  { type: 'Okay', emoji: '😐', label: 'Okay', desc: 'Balanced or neutral' },
  { type: 'Not great', emoji: '😕', label: 'Not great', desc: 'Stressed or slightly down' },
  { type: 'Low', emoji: '😔', label: 'Low', desc: 'Struggling, sad, or overwhelmed' },
];

export const MoodTrackerModal: React.FC<MoodTrackerModalProps> = ({
  isOpen,
  onClose,
  activeMember,
  moodHistory,
  onSaveMood,
}) => {
  const [selectedMood, setSelectedMood] = useState<MoodType>(
    activeMember.currentMood || 'Okay'
  );
  const [energy, setEnergy] = useState<number>(3);
  const [stress, setStress] = useState<number>(3);
  const [sleep, setSleep] = useState<number>(3);
  const [familyConnection, setFamilyConnection] = useState<number>(4);
  const [privateNote, setPrivateNote] = useState('');
  const [shareGeneralMood, setShareGeneralMood] = useState(
    activeMember.privacySettings.shareGeneralMoodWithFamily
  );
  const [viewTab, setViewTab] = useState<'checkin' | 'history'>('checkin');

  if (!isOpen) return null;

  const handleSave = () => {
    onSaveMood({
      userId: activeMember.id,
      date: new Date().toISOString().split('T')[0],
      mood: selectedMood,
      energy,
      stress,
      sleep,
      familyConnection,
      privateNote: privateNote.trim() || undefined,
      sharedWithFamily: shareGeneralMood,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-3">
      <div className="bg-white rounded-3xl p-5 max-w-sm w-full space-y-4 shadow-2xl border border-purple-100 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Smile className="w-5 h-5 text-purple-600" />
            <h2 className="text-sm font-bold text-slate-900">Personal Mood Tracker</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-600 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switch between Daily Check-in and Personal History */}
        <div className="flex p-0.5 bg-slate-100 rounded-xl text-xs font-semibold text-slate-600">
          <button
            onClick={() => setViewTab('checkin')}
            className={`flex-1 py-1.5 rounded-lg transition-all ${
              viewTab === 'checkin' ? 'bg-white text-purple-900 shadow-sm' : ''
            }`}
          >
            Today's Check-in
          </button>
          <button
            onClick={() => setViewTab('history')}
            className={`flex-1 py-1.5 rounded-lg transition-all ${
              viewTab === 'history' ? 'bg-white text-purple-900 shadow-sm' : ''
            }`}
          >
            Personal History
          </button>
        </div>

        {viewTab === 'checkin' ? (
          <div className="space-y-3.5">
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1.5">
                How are you feeling today?
              </label>
              <div className="grid grid-cols-5 gap-1.5">
                {MOODS.map((m) => (
                  <button
                    key={m.type}
                    type="button"
                    onClick={() => setSelectedMood(m.type)}
                    className={`p-2 rounded-xl border flex flex-col items-center gap-1 transition-all ${
                      selectedMood === m.type
                        ? 'border-purple-600 bg-purple-50 ring-2 ring-purple-600/20'
                        : 'border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <span className="text-xl">{m.emoji}</span>
                    <span className="text-[10px] font-semibold text-slate-700">{m.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Optional detailed sliders */}
            <div className="space-y-2.5 pt-2 border-t border-slate-100">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Optional Wellness Questions:
              </span>

              <div className="space-y-1">
                <div className="flex justify-between text-xs text-slate-700">
                  <span>Energy Level:</span>
                  <span className="font-semibold text-purple-700">{energy}/5</span>
                </div>
                <input
                  type="range"
                  min={1}
                  max={5}
                  value={energy}
                  onChange={(e) => setEnergy(Number(e.target.value))}
                  className="w-full accent-purple-600"
                />
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-xs text-slate-700">
                  <span>Stress Level:</span>
                  <span className="font-semibold text-purple-700">{stress}/5</span>
                </div>
                <input
                  type="range"
                  min={1}
                  max={5}
                  value={stress}
                  onChange={(e) => setStress(Number(e.target.value))}
                  className="w-full accent-purple-600"
                />
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-xs text-slate-700">
                  <span>Sleep Quality:</span>
                  <span className="font-semibold text-purple-700">{sleep}/5</span>
                </div>
                <input
                  type="range"
                  min={1}
                  max={5}
                  value={sleep}
                  onChange={(e) => setSleep(Number(e.target.value))}
                  className="w-full accent-purple-600"
                />
              </div>
            </div>

            {/* Private Note Box (Encrypted/Private strictly) */}
            <div className="space-y-1.5 pt-2 border-t border-slate-100">
              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800">
                <Lock className="w-3.5 h-3.5 text-purple-600" />
                <span>Private Journal Note</span>
              </div>
              <textarea
                rows={2}
                value={privateNote}
                onChange={(e) => setPrivateNote(e.target.value)}
                placeholder="Write your thoughts freely. This is encrypted and NEVER visible to family members."
                className="w-full p-2.5 rounded-xl border border-slate-200 text-xs text-slate-800 focus:border-purple-600 outline-none resize-none"
              />
              <p className="text-[10px] text-slate-400">
                🔒 Protected by device boundary. Never shared in family feed.
              </p>
            </div>

            {/* Family Sharing Toggles */}
            <div className="p-3 bg-purple-50/70 rounded-2xl border border-purple-200/80 space-y-2 text-xs">
              <span className="font-bold text-purple-950 text-[11px] uppercase tracking-wider block">
                Family Sharing Preferences:
              </span>
              <label className="flex items-center gap-2 text-slate-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={shareGeneralMood}
                  onChange={(e) => setShareGeneralMood(e.target.checked)}
                  className="rounded text-purple-600 focus:ring-purple-500"
                />
                <span className="text-[11px]">Share general mood status with family</span>
              </label>

              <label className="flex items-center gap-2 text-slate-400 cursor-not-allowed">
                <input type="checkbox" disabled checked={false} className="rounded" />
                <span className="text-[11px]">Share private notes (Permanently Disabled)</span>
              </label>
            </div>

            <button
              id="save-daily-mood-btn"
              onClick={handleSave}
              className="w-full py-2.5 rounded-xl bg-purple-700 hover:bg-purple-800 text-white font-bold text-xs shadow flex items-center justify-center gap-1.5"
            >
              <Check className="w-4 h-4" />
              <span>Save Mood Check-in</span>
            </button>
          </div>
        ) : (
          /* PERSONAL MOOD HISTORY */
          <div className="space-y-3">
            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200">
              <div className="text-xs font-bold text-slate-800 mb-2 flex items-center gap-1.5">
                <BarChart2 className="w-4 h-4 text-purple-600" />
                <span>Your 7-Day Trend</span>
              </div>

              <div className="space-y-2">
                {moodHistory.map((entry) => (
                  <div
                    key={entry.id}
                    className="p-2 rounded-xl bg-white border border-slate-100 flex items-center justify-between text-xs"
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-base">
                        {MOODS.find((m) => m.type === entry.mood)?.emoji || '🙂'}
                      </span>
                      <div>
                        <div className="font-semibold text-slate-800">{entry.mood}</div>
                        <div className="text-[10px] text-slate-400">{entry.date}</div>
                      </div>
                    </div>
                    {entry.privateNote && (
                      <span
                        className="text-[10px] px-1.5 py-0.5 rounded bg-purple-100 text-purple-800 flex items-center gap-0.5"
                        title="Private note saved"
                      >
                        <Lock className="w-2.5 h-2.5" /> Note
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <p className="text-[11px] text-slate-500 text-center">
              Only you can see this complete historical log.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
