import React from 'react';

interface FamilyMemojiAvatarProps {
  memberId: string;
  name: string;
  role: string;
  moodBadge?: 'happy' | 'neutral' | 'calm' | 'sad';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  customAvatarIcon?: string;
  customAvatarType?: 'memoji' | 'emoji' | 'initials';
  customMemojiPreset?: 'dad' | 'mom' | 'teen' | 'child';
  avatarColor?: string;
}

export const FamilyMemojiAvatar: React.FC<FamilyMemojiAvatarProps> = ({
  memberId,
  name,
  role,
  moodBadge = 'happy',
  size = 'md',
  className = '',
  customAvatarIcon,
  customAvatarType = 'memoji',
  customMemojiPreset,
  avatarColor,
}) => {
  const sizeMap = {
    sm: 'w-10 h-10 text-base',
    md: 'w-14 h-14 text-2xl',
    lg: 'w-18 h-18 text-3xl',
  };

  // Determine avatar character based on presets or role/name
  const isDad =
    customMemojiPreset === 'dad' ||
    (!customMemojiPreset && (memberId === 'm-dad' || memberId === 'm-father' || (role === 'Parent' && (name.toLowerCase().includes('father') || name.toLowerCase().includes('dad')))));
  const isMom =
    customMemojiPreset === 'mom' ||
    (!customMemojiPreset && (memberId === 'm-mom' || memberId === 'm-mother' || (role === 'Parent' && (name.toLowerCase().includes('mother') || name.toLowerCase().includes('mom')))));
  const isTeen =
    customMemojiPreset === 'teen' ||
    (!customMemojiPreset && (memberId === 'm-teen' || role === 'Teenager'));
  const isChild =
    customMemojiPreset === 'child' ||
    (!customMemojiPreset && !isDad && !isMom && !isTeen);

  // Badge emoji & background color
  const badgeConfig = {
    happy: { bg: 'bg-[#22c55e]', icon: '😃' },
    neutral: { bg: 'bg-[#f59e0b]', icon: '😐' },
    calm: { bg: 'bg-[#22c55e]', icon: '🙂' },
    sad: { bg: 'bg-[#64748b]', icon: '😔' },
  }[moodBadge] || { bg: 'bg-[#22c55e]', icon: '😃' };

  return (
    <div className={`relative inline-flex items-center justify-center shrink-0 ${className}`}>
      {/* Outer circular container with custom or pastel background */}
      <div
        className={`${sizeMap[size]} rounded-full flex items-center justify-center overflow-hidden border-2 border-white shadow-sm transition-transform hover:scale-105 ${
          avatarColor
            ? avatarColor
            : isDad
            ? 'bg-[#dbeafe]' // soft blue
            : isMom
            ? 'bg-[#fce7f3]' // soft pink
            : isTeen
            ? 'bg-[#ede9fe]' // soft lavender
            : 'bg-[#dcfce7]' // soft green
        }`}
      >
        {/* Custom Emoji Avatar */}
        {customAvatarType === 'emoji' && customAvatarIcon ? (
          <span className="select-none animate-in zoom-in-75 duration-200">
            {customAvatarIcon}
          </span>
        ) : customAvatarType === 'initials' ? (
          <span className="font-bold text-white text-sm select-none">
            {name.slice(0, 2).toUpperCase()}
          </span>
        ) : (
          <>
            {/* Dad Memoji Avatar */}
            {isDad && (
          <svg className="w-full h-full transform scale-110 translate-y-1" viewBox="0 0 100 100" fill="none">
            {/* Skin */}
            <circle cx="50" cy="52" r="26" fill="#f8c8a2" />
            {/* Hair */}
            <path d="M26 44 C26 25, 74 25, 74 44 C68 32, 34 32, 26 44 Z" fill="#4a2810" />
            <path d="M25 44 C23 35, 35 24, 52 24 C70 24, 76 34, 75 44 C72 37, 62 30, 48 30 C34 30, 27 38, 25 44 Z" fill="#3a1e0b" />
            {/* Ears */}
            <circle cx="24" cy="52" r="5" fill="#f8c8a2" />
            <circle cx="76" cy="52" r="5" fill="#f8c8a2" />
            {/* Eyes */}
            <ellipse cx="41" cy="50" rx="3" ry="3.5" fill="#2d1a0e" />
            <ellipse cx="59" cy="50" rx="3" ry="3.5" fill="#2d1a0e" />
            <circle cx="42" cy="49" r="1" fill="#ffffff" />
            <circle cx="60" cy="49" r="1" fill="#ffffff" />
            {/* Eyebrows */}
            <path d="M36 43 Q41 40 46 43" stroke="#3a1e0b" strokeWidth="2.2" strokeLinecap="round" />
            <path d="M54 43 Q59 40 64 43" stroke="#3a1e0b" strokeWidth="2.2" strokeLinecap="round" />
            {/* Nose */}
            <path d="M50 50 L50 56 L53 56" stroke="#e09d6f" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            {/* Beard & Mustache */}
            <path d="M32 54 C32 74, 68 74, 68 54 C68 62, 60 70, 50 70 C40 70, 32 62, 32 54 Z" fill="#4a2810" />
            <path d="M42 60 Q50 63 58 60 Q50 66 42 60" fill="#3a1e0b" />
            {/* Smile */}
            <path d="M45 64 Q50 67 55 64" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" />
          </svg>
        )}

        {/* Mom Memoji Avatar */}
        {isMom && (
          <svg className="w-full h-full transform scale-110 translate-y-1" viewBox="0 0 100 100" fill="none">
            {/* Hair Back */}
            <path d="M22 50 C20 30, 80 30, 78 50 C82 70, 70 78, 70 78 C70 78, 62 65, 62 55 C38 55, 38 65, 30 78 C30 78, 18 70, 22 50 Z" fill="#432616" />
            {/* Skin */}
            <circle cx="50" cy="50" r="24" fill="#fbd3b6" />
            {/* Ears & Earrings */}
            <circle cx="26" cy="52" r="4.5" fill="#fbd3b6" />
            <circle cx="74" cy="52" r="4.5" fill="#fbd3b6" />
            <circle cx="26" cy="57" r="2" fill="#f59e0b" />
            <circle cx="74" cy="57" r="2" fill="#f59e0b" />
            {/* Hair Front / Wavy Bangs */}
            <path d="M24 45 C28 28, 72 28, 76 45 C70 34, 58 32, 50 36 C42 32, 30 34, 24 45 Z" fill="#522e1b" />
            {/* Serene Closed Eyes (gentle curve smile) */}
            <path d="M38 50 Q43 54 48 50" stroke="#331c10" strokeWidth="2.2" strokeLinecap="round" fill="none" />
            <path d="M52 50 Q57 54 62 50" stroke="#331c10" strokeWidth="2.2" strokeLinecap="round" fill="none" />
            {/* Eyebrows */}
            <path d="M37 44 Q43 41 48 44" stroke="#522e1b" strokeWidth="1.8" strokeLinecap="round" />
            <path d="M52 44 Q57 41 63 44" stroke="#522e1b" strokeWidth="1.8" strokeLinecap="round" />
            {/* Nose */}
            <path d="M50 49 L50 54 L52 54" stroke="#e5a478" strokeWidth="1.6" strokeLinecap="round" />
            {/* Lips / Gentle Sweet Smile */}
            <path d="M44 60 Q50 65 56 60" stroke="#e11d48" strokeWidth="2" strokeLinecap="round" fill="none" />
            {/* Cheeks Blush */}
            <circle cx="36" cy="55" r="3.5" fill="#f43f5e" opacity="0.25" />
            <circle cx="64" cy="55" r="3.5" fill="#f43f5e" opacity="0.25" />
          </svg>
        )}

        {/* Teenager Memoji Avatar */}
        {isTeen && (
          <svg className="w-full h-full transform scale-110 translate-y-1" viewBox="0 0 100 100" fill="none">
            {/* Hair Bun on top */}
            <circle cx="50" cy="20" r="13" fill="#3b2010" />
            <circle cx="50" cy="20" r="10" fill="#4a2c17" />
            {/* Skin */}
            <circle cx="50" cy="52" r="24" fill="#fcd7ba" />
            {/* Ears */}
            <circle cx="26" cy="52" r="4.5" fill="#fcd7ba" />
            <circle cx="74" cy="52" r="4.5" fill="#fcd7ba" />
            {/* Front Hair with Bun Sides */}
            <path d="M26 48 C28 32, 72 32, 74 48 C68 36, 56 34, 50 38 C44 34, 32 36, 26 48 Z" fill="#4a2c17" />
            {/* Eyes */}
            <ellipse cx="40" cy="50" rx="3.2" ry="3.5" fill="#2d170b" />
            <ellipse cx="60" cy="50" rx="3.2" ry="3.5" fill="#2d170b" />
            <circle cx="41" cy="49" r="1.1" fill="#ffffff" />
            <circle cx="61" cy="49" r="1.1" fill="#ffffff" />
            {/* Soft Eyelashes */}
            <path d="M43 47 L45 45" stroke="#2d170b" strokeWidth="1.2" strokeLinecap="round" />
            <path d="M63 47 L65 45" stroke="#2d170b" strokeWidth="1.2" strokeLinecap="round" />
            {/* Eyebrows */}
            <path d="M36 43 Q41 40 45 43" stroke="#4a2c17" strokeWidth="1.8" strokeLinecap="round" />
            <path d="M55 43 Q59 40 64 43" stroke="#4a2c17" strokeWidth="1.8" strokeLinecap="round" />
            {/* Small Cute Nose */}
            <path d="M50 51 L50 55 L52 55" stroke="#e8a379" strokeWidth="1.5" strokeLinecap="round" />
            {/* Neutral / Slight Thoughtful Smile */}
            <path d="M45 61 Q50 63 55 61" stroke="#be123c" strokeWidth="2" strokeLinecap="round" />
          </svg>
        )}

        {/* Child Memoji Avatar */}
        {isChild && (
          <svg className="w-full h-full transform scale-110 translate-y-1" viewBox="0 0 100 100" fill="none">
            {/* Skin */}
            <circle cx="50" cy="52" r="25" fill="#f8cfae" />
            {/* Boy Short Hair */}
            <path d="M26 46 C24 28, 76 28, 74 46 C68 34, 32 34, 26 46 Z" fill="#362012" />
            <path d="M28 36 C34 26, 66 26, 72 36 C66 30, 34 30, 28 36 Z" fill="#4a2d1a" />
            {/* Ears */}
            <circle cx="25" cy="52" r="5" fill="#f8cfae" />
            <circle cx="75" cy="52" r="5" fill="#f8cfae" />
            {/* Eyes */}
            <ellipse cx="40" cy="49" rx="3.2" ry="3.5" fill="#2d1a0e" />
            <ellipse cx="60" cy="49" rx="3.2" ry="3.5" fill="#2d1a0e" />
            <circle cx="41" cy="48" r="1" fill="#ffffff" />
            <circle cx="61" cy="48" r="1" fill="#ffffff" />
            {/* Eyebrows */}
            <path d="M35 42 Q40 39 45 42" stroke="#362012" strokeWidth="2" strokeLinecap="round" />
            <path d="M55 42 Q60 39 65 42" stroke="#362012" strokeWidth="2" strokeLinecap="round" />
            {/* Nose */}
            <circle cx="50" cy="54" r="1.5" fill="#e29b6e" />
            {/* Big Open Boy Smile */}
            <path d="M43 60 Q50 68 57 60 Z" fill="#e11d48" />
            <path d="M44 60 Q50 62 56 60" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" />
          </svg>
        )}
          </>
        )}
      </div>

      {/* Floating Status Badge at bottom-right (green smiley / yellow neutral) */}
      <div
        className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center text-[10px] text-white shadow-sm ring-2 ring-white ${badgeConfig.bg}`}
      >
        {isTeen ? '😐' : '😃'}
      </div>
    </div>
  );
};
