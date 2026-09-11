import React, { useState } from 'react';
import { X, Check, Sparkles, Smile, User, Palette } from 'lucide-react';
import { FamilyMember } from '../types';
import { FamilyMemojiAvatar } from './FamilyMemojiAvatar';

interface CustomizeAvatarModalProps {
  isOpen: boolean;
  onClose: () => void;
  member: FamilyMember;
  onSaveAvatar: (memberId: string, updates: Partial<FamilyMember>) => void;
}

const EMOJI_OPTIONS = [
  '🦁', '🐱', '🐶', '🚀', '🌸', '⚡', '🌟', '🎨',
  '⚽', '📚', '🎵', '🧘', '🌿', '🎮', '🦋', '👑',
  '🦄', '🌙', '🌊', '🎯', '🎸', '🧁', '💎', '🦊'
];

const COLOR_OPTIONS = [
  { name: 'Royal Purple', class: 'bg-purple-600 text-white' },
  { name: 'Indigo Twilight', class: 'bg-indigo-600 text-white' },
  { name: 'Rose Pink', class: 'bg-rose-500 text-white' },
  { name: 'Sunset Amber', class: 'bg-amber-500 text-white' },
  { name: 'Emerald Mint', class: 'bg-emerald-600 text-white' },
  { name: 'Ocean Sky', class: 'bg-sky-500 text-white' },
  { name: 'Warm Coral', class: 'bg-orange-500 text-white' },
  { name: 'Pastel Blue', class: 'bg-[#dbeafe] text-slate-800' },
  { name: 'Pastel Rose', class: 'bg-[#fce7f3] text-slate-800' },
  { name: 'Pastel Violet', class: 'bg-[#ede9fe] text-slate-800' },
  { name: 'Pastel Mint', class: 'bg-[#dcfce7] text-slate-800' },
];

export const CustomizeAvatarModal: React.FC<CustomizeAvatarModalProps> = ({
  isOpen,
  onClose,
  member,
  onSaveAvatar,
}) => {
  const [avatarType, setAvatarType] = useState<'memoji' | 'emoji' | 'initials'>(
    member.customAvatarType || (member.customAvatarIcon ? 'emoji' : 'memoji')
  );
  const [selectedEmoji, setSelectedEmoji] = useState<string>(
    member.customAvatarIcon || '🌟'
  );
  const [selectedPreset, setSelectedPreset] = useState<'dad' | 'mom' | 'teen' | 'child'>(
    member.customMemojiPreset ||
      (member.role === 'Parent'
        ? member.name.toLowerCase().includes('mom') || member.name.toLowerCase().includes('mother')
          ? 'mom'
          : 'dad'
        : member.role === 'Teenager'
        ? 'teen'
        : 'child')
  );
  const [selectedColor, setSelectedColor] = useState<string>(
    member.avatarColor || 'bg-purple-600 text-white'
  );

  if (!isOpen) return null;

  const handleSave = () => {
    onSaveAvatar(member.id, {
      customAvatarType: avatarType,
      customAvatarIcon: avatarType === 'emoji' ? selectedEmoji : undefined,
      customMemojiPreset: avatarType === 'memoji' ? selectedPreset : undefined,
      avatarColor: selectedColor,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="w-full max-w-sm bg-white rounded-3xl shadow-2xl border border-purple-100 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-5 py-4 bg-gradient-to-r from-purple-700 to-indigo-700 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Palette className="w-5 h-5 text-amber-300" />
            <div>
              <h3 className="font-bold text-sm">Customize Avatar</h3>
              <p className="text-[11px] text-purple-200">{member.name} ({member.role})</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-purple-200 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 overflow-y-auto space-y-5">
          {/* Live Avatar Preview */}
          <div className="flex flex-col items-center justify-center py-3 bg-purple-50/50 rounded-2xl border border-purple-100">
            <FamilyMemojiAvatar
              memberId={member.id}
              name={member.name}
              role={member.role}
              size="lg"
              customAvatarType={avatarType}
              customAvatarIcon={selectedEmoji}
              customMemojiPreset={selectedPreset}
              avatarColor={selectedColor}
              moodBadge="happy"
            />
            <span className="text-xs font-bold text-slate-800 mt-2">{member.name}</span>
            <span className="text-[10px] text-purple-700 font-semibold">Live Preview</span>
          </div>

          {/* Style Selector Tabs */}
          <div className="grid grid-cols-3 gap-1 p-1 bg-slate-100 rounded-xl">
            <button
              onClick={() => setAvatarType('memoji')}
              className={`py-1.5 text-xs font-bold rounded-lg flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                avatarType === 'memoji'
                  ? 'bg-white text-purple-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <User className="w-3.5 h-3.5" />
              <span>Memoji</span>
            </button>
            <button
              onClick={() => setAvatarType('emoji')}
              className={`py-1.5 text-xs font-bold rounded-lg flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                avatarType === 'emoji'
                  ? 'bg-white text-purple-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Smile className="w-3.5 h-3.5" />
              <span>Emoji</span>
            </button>
            <button
              onClick={() => setAvatarType('initials')}
              className={`py-1.5 text-xs font-bold rounded-lg flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                avatarType === 'initials'
                  ? 'bg-white text-purple-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Initials</span>
            </button>
          </div>

          {/* Memoji Preset Selection */}
          {avatarType === 'memoji' && (
            <div className="space-y-2">
              <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider">
                Character Archetype:
              </label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: 'dad', label: 'Father / Mature', icon: '👨' },
                  { id: 'mom', label: 'Mother / Gentle', icon: '👩' },
                  { id: 'teen', label: 'Teenager / Cool', icon: '🧑' },
                  { id: 'child', label: 'Child / Playful', icon: '👦' },
                ].map((preset) => (
                  <button
                    key={preset.id}
                    onClick={() => setSelectedPreset(preset.id as any)}
                    className={`p-2.5 rounded-xl border text-left flex items-center gap-2 transition-all cursor-pointer ${
                      selectedPreset === preset.id
                        ? 'border-purple-600 bg-purple-50 text-purple-950 font-bold ring-1 ring-purple-500'
                        : 'border-slate-200 hover:border-slate-300 text-slate-700'
                    }`}
                  >
                    <span className="text-xl">{preset.icon}</span>
                    <span className="text-xs">{preset.label}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Emoji Grid Selection */}
          {avatarType === 'emoji' && (
            <div className="space-y-2">
              <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider">
                Choose Emoji Symbol:
              </label>
              <div className="grid grid-cols-6 gap-2 p-2 bg-slate-50 rounded-2xl border border-slate-200/80 max-h-40 overflow-y-auto">
                {EMOJI_OPTIONS.map((emoji) => (
                  <button
                    key={emoji}
                    onClick={() => setSelectedEmoji(emoji)}
                    className={`h-10 rounded-xl flex items-center justify-center text-xl transition-all cursor-pointer ${
                      selectedEmoji === emoji
                        ? 'bg-purple-600 text-white shadow-sm scale-110'
                        : 'hover:bg-white hover:shadow-2xs'
                    }`}
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Background Color Themes */}
          <div className="space-y-2">
            <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider">
              Background Color Theme:
            </label>
            <div className="grid grid-cols-4 gap-2">
              {COLOR_OPTIONS.map((col) => (
                <button
                  key={col.name}
                  onClick={() => setSelectedColor(col.class)}
                  className={`h-9 rounded-xl flex items-center justify-center border transition-all cursor-pointer relative ${col.class} ${
                    selectedColor === col.class
                      ? 'ring-2 ring-purple-600 ring-offset-2 font-bold'
                      : 'border-transparent hover:opacity-90'
                  }`}
                  title={col.name}
                >
                  {selectedColor === col.class && (
                    <Check className="w-4 h-4 stroke-[3]" />
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-200 transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-purple-700 hover:bg-purple-800 shadow-md shadow-purple-600/20 active:scale-95 transition-all cursor-pointer"
          >
            Save Avatar
          </button>
        </div>
      </div>
    </div>
  );
};
