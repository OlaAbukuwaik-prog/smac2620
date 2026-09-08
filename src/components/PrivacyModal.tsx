import React, { useState } from 'react';
import { X, Shield, Lock, Check, EyeOff } from 'lucide-react';
import { PrivacySettings } from '../types';

interface PrivacyModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: PrivacySettings;
  onSave: (settings: PrivacySettings) => void;
}

export const PrivacyModal: React.FC<PrivacyModalProps> = ({
  isOpen,
  onClose,
  settings,
  onSave,
}) => {
  const [current, setCurrent] = useState<PrivacySettings>(settings);

  if (!isOpen) return null;

  const handleToggle = (key: keyof PrivacySettings) => {
    if (key === 'sharePrivateNotes') return; // strictly forbidden
    setCurrent((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSave = () => {
    onSave(current);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-3">
      <div className="bg-white rounded-3xl p-5 max-w-sm w-full space-y-4 shadow-2xl border border-purple-100 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-purple-950 font-bold text-sm">
            <Shield className="w-5 h-5 text-emerald-600" />
            <span>Family Privacy Controls</span>
          </div>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        <p className="text-xs text-slate-600 leading-relaxed">
          Silah follows an anti-surveillance privacy architecture. You decide exactly what is shared with your family.
        </p>

        <div className="space-y-3 pt-1">
          {/* Toggle 1: General Mood */}
          <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
            <div className="pr-2">
              <div className="text-xs font-bold text-slate-800">Share General Mood</div>
              <p className="text-[10px] text-slate-500">
                Displays your status circle (e.g. "Okay", "Good") on family home screen.
              </p>
            </div>
            <input
              type="checkbox"
              checked={current.shareGeneralMoodWithFamily}
              onChange={() => handleToggle('shareGeneralMoodWithFamily')}
              className="w-4 h-4 rounded text-purple-600 focus:ring-purple-500"
            />
          </div>

          {/* Toggle 2: Calendar Availability */}
          <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
            <div className="pr-2">
              <div className="text-xs font-bold text-slate-800">Share Free/Busy Availability</div>
              <p className="text-[10px] text-slate-500">
                Allows finding free overlapping times for family dinner without revealing event details.
              </p>
            </div>
            <input
              type="checkbox"
              checked={current.shareCalendarAvailability}
              onChange={() => handleToggle('shareCalendarAvailability')}
              className="w-4 h-4 rounded text-purple-600 focus:ring-purple-500"
            />
          </div>

          {/* Toggle 3: AI Bridge Assistance */}
          <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
            <div className="pr-2">
              <div className="text-xs font-bold text-slate-800">AI Communication Assistant</div>
              <p className="text-[10px] text-slate-500">
                Enables on-device ML Kit language suggestions and calmer text rewrites.
              </p>
            </div>
            <input
              type="checkbox"
              checked={current.enableAiAssistance}
              onChange={() => handleToggle('enableAiAssistance')}
              className="w-4 h-4 rounded text-purple-600 focus:ring-purple-500"
            />
          </div>

          {/* Toggle 4: Strictly Locked Private Notes */}
          <div className="p-3 rounded-2xl bg-purple-50/60 border border-purple-200 flex items-center justify-between opacity-85">
            <div className="pr-2">
              <div className="text-xs font-bold text-purple-950 flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-purple-700" />
                <span>Private Notes & Bridge Drafts</span>
              </div>
              <p className="text-[10px] text-purple-800">
                Permanently locked: Private drafts are never shared or readable by anyone until explicitly sent.
              </p>
            </div>
            <span className="text-[10px] px-2 py-0.5 rounded bg-purple-200 text-purple-900 font-bold">
              Protected
            </span>
          </div>
        </div>

        <button
          onClick={handleSave}
          className="w-full py-2.5 rounded-xl bg-purple-700 hover:bg-purple-800 text-white font-bold text-xs shadow flex items-center justify-center gap-1.5"
        >
          <Check className="w-4 h-4" />
          <span>Save Privacy Settings</span>
        </button>
      </div>
    </div>
  );
};
