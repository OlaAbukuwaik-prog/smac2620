import { Family, FamilyMember, ChildAIInteractionSummary, FamilyRole, FamilyEvent } from '../types';

const REGISTRY_KEY = 'silah_families_registry';
const GUIDANCE_PREFIX = 'silah_guidance_';

// Initial default registered family for seamless testing out-of-the-box
const DEFAULT_REGISTERED_FAMILY: Family = {
  id: 'fam-main-01',
  name: 'Our Family',
  arabicName: 'عائلتنا',
  inviteCode: 'SILAH-7842',
  harmonyScore: 88,
  previousHarmonyScore: 80,
  weeklyTrendPercent: 8,
  members: [
    {
      id: 'member-parent',
      name: 'Parent',
      arabicName: 'الوالد',
      role: 'Parent',
      ageRange: '40-49',
      avatarColor: 'bg-indigo-600 text-white',
      initials: 'P',
      preferences: ['Quiet conversation', 'Family dinner', 'Evening walk'],
      currentMood: 'Good',
      privacySettings: {
        shareGeneralMoodWithFamily: true,
        shareDetailedMood: true,
        sharePrivateNotes: false,
        shareCalendarAvailability: true,
        enableAiAssistance: true,
        visibleActivityHistory: true,
      },
      calendar: {
        provider: 'google',
        accountEmail: 'parent@gmail.com',
        isConnected: true,
        scopes: ['https://www.googleapis.com/auth/calendar.freebusy'],
      },
    },
    {
      id: 'member-kid',
      name: 'Child',
      arabicName: 'الابن / الابنة',
      role: 'Teenager',
      ageRange: '15-17',
      avatarColor: 'bg-purple-600 text-white',
      initials: 'C',
      preferences: ['Art', 'Music', 'Board games'],
      currentMood: 'Okay',
      privacySettings: {
        shareGeneralMoodWithFamily: true,
        shareDetailedMood: false,
        sharePrivateNotes: false,
        shareCalendarAvailability: true,
        enableAiAssistance: true,
        visibleActivityHistory: true,
      },
      calendar: {
        provider: 'google',
        accountEmail: 'child@gmail.com',
        isConnected: true,
        scopes: ['https://www.googleapis.com/auth/calendar.freebusy'],
      },
    },
  ],
};

/**
 * Retrieve all registered families from localStorage
 */
export function getSavedFamilies(): Family[] {
  try {
    const raw = localStorage.getItem(REGISTRY_KEY);
    if (!raw) {
      // Initialize with starter family
      localStorage.setItem(REGISTRY_KEY, JSON.stringify([DEFAULT_REGISTERED_FAMILY]));
      return [DEFAULT_REGISTERED_FAMILY];
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed;
    }
    return [DEFAULT_REGISTERED_FAMILY];
  } catch {
    return [DEFAULT_REGISTERED_FAMILY];
  }
}

/**
 * Save or update a family in the registry
 */
export function saveFamilyToRegistry(family: Family): void {
  try {
    const families = getSavedFamilies();
    const index = families.findIndex((f) => f.id === family.id || f.inviteCode.toUpperCase() === family.inviteCode.toUpperCase());
    if (index >= 0) {
      families[index] = family;
    } else {
      families.push(family);
    }
    localStorage.setItem(REGISTRY_KEY, JSON.stringify(families));
  } catch (err) {
    console.error('Failed to save family to registry:', err);
  }
}

/**
 * Look up a family strictly by invite code
 */
export function findFamilyByInviteCode(code: string): Family | undefined {
  if (!code) return undefined;
  const cleanCode = code.trim().toUpperCase();
  const families = getSavedFamilies();
  return families.find((f) => f.inviteCode.trim().toUpperCase() === cleanCode);
}

/**
 * Add a member to a family found by invite code
 */
export function addMemberToFamily(inviteCode: string, member: FamilyMember): Family | undefined {
  const family = findFamilyByInviteCode(inviteCode);
  if (!family) return undefined;

  const existingIdx = family.members.findIndex((m) => m.id === member.id || m.name.toLowerCase() === member.name.toLowerCase());
  if (existingIdx >= 0) {
    family.members[existingIdx] = member;
  } else {
    family.members.push(member);
  }

  saveFamilyToRegistry(family);
  return family;
}

/**
 * Generate a unique, human-friendly family invite code
 */
export function generateUniqueInviteCode(): string {
  const prefix = 'FAM';
  const num = Math.floor(1000 + Math.random() * 9000);
  return `${prefix}-${num}`;
}

/**
 * Get automatically generated parent guidance for a family
 */
export function getFamilyGuidance(familyId: string): ChildAIInteractionSummary | undefined {
  try {
    const raw = localStorage.getItem(`${GUIDANCE_PREFIX}${familyId}`);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch {
    // ignore
  }
  return undefined;
}

/**
 * Save automatically generated parent guidance for a family
 */
export function saveFamilyGuidance(familyId: string, guidance: ChildAIInteractionSummary): void {
  try {
    localStorage.setItem(`${GUIDANCE_PREFIX}${familyId}`, JSON.stringify(guidance));
    // Also dispatch a custom storage event so active tabs update immediately
    window.dispatchEvent(new CustomEvent('silah-guidance-updated', { detail: { familyId, guidance } }));
  } catch (err) {
    console.error('Failed to save family guidance:', err);
  }
}

/**
 * Record a notification when someone joins the family via code
 */
export function recordMemberJoinedNotification(familyId: string, memberName: string, role: string): void {
  try {
    const key = `silah_join_notifs_${familyId}`;
    const raw = localStorage.getItem(key);
    const existing = raw ? JSON.parse(raw) : [];
    existing.push({
      id: `join-${Date.now()}`,
      memberName,
      role,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    });
    localStorage.setItem(key, JSON.stringify(existing));
    window.dispatchEvent(
      new CustomEvent('silah-member-joined', {
        detail: { familyId, memberName, role },
      })
    );
  } catch (err) {
    console.error('Failed to record join notification:', err);
  }
}

export function getMemberJoinedNotifications(familyId: string): Array<{ id: string; memberName: string; role: string; timestamp: string }> {
  try {
    const raw = localStorage.getItem(`silah_join_notifs_${familyId}`);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

