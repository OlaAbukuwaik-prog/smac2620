/**
 * Data structures and types for صلة (Silah)
 * Mobile family-connection and communication application
 */

export type FamilyRole = 'Parent' | 'Teenager' | 'Child' | 'Other family member';

export type MoodType = 'Great' | 'Good' | 'Okay' | 'Not great' | 'Low' | 'Tired' | 'Stressed';

export interface PrivacySettings {
  shareGeneralMoodWithFamily: boolean;
  shareDetailedMood: boolean;
  sharePrivateNotes: boolean; // Strictly false by default
  shareCalendarAvailability: boolean;
  enableAiAssistance: boolean;
  visibleActivityHistory: boolean;
}

export interface ConnectedCalendar {
  provider: 'google' | 'none';
  accountEmail: string;
  isConnected: boolean;
  authorizedAt?: string;
  scopes: string[]; // e.g. ['https://www.googleapis.com/auth/calendar.freebusy', 'https://www.googleapis.com/auth/calendar.events.readonly']
}

export interface FamilyMember {
  id: string;
  name: string;
  arabicName: string;
  role: FamilyRole;
  ageRange: string;
  avatarColor: string;
  initials: string;
  preferences: string[];
  currentMood?: MoodType;
  moodUpdatedAt?: string;
  privacySettings: PrivacySettings;
  calendar: ConnectedCalendar;
}

export interface Family {
  id: string;
  name: string;
  arabicName: string;
  inviteCode: string;
  harmonyScore: number;
  previousHarmonyScore: number;
  weeklyTrendPercent: number;
  members: FamilyMember[];
}

export interface MoodEntry {
  id: string;
  userId: string;
  date: string; // YYYY-MM-DD
  timestamp: string;
  mood: MoodType;
  energy?: number; // 1-5
  stress?: number; // 1-5
  sleep?: number; // 1-5
  familyConnection?: number; // 1-5
  privateNote?: string; // Stored securely, never shared with family
  sharedWithFamily: boolean;
}

export interface BridgeMessage {
  id: string;
  senderId: string;
  recipientId: string;
  originalText: string;
  detectedLanguage: string; // e.g. 'English', 'Arabic'
  languageCode: string; // 'en', 'ar', 'other'
  languageConfidence: number; // e.g. 0.98
  detectedToneCategories: string[]; // e.g. ['fear', 'concern', 'stress']
  understandingSummary: string; // Non-medical empathetic rephrase
  calmSuggestedText: string;
  finalApprovedText: string;
  status: 'draft' | 'sent' | 'read' | 'replied' | 'completed';
  createdAt: string;
  sentAt?: string;
  parentResponse?: {
    text: string;
    action: 'listen' | 'talk' | 'reply';
    smartReplyUsed?: boolean;
    respondedAt: string;
  };
  outcomeRating?: 'better' | 'well' | 'okay' | 'difficult';
  isSafetyConcern?: boolean;
}

export interface FamilyEvent {
  id: string;
  title: string;
  arabicTitle?: string;
  date: string; // YYYY-MM-DD
  startTime: string; // HH:MM
  endTime: string; // HH:MM
  location: string;
  participantIds: string[];
  notes?: string;
  category: 'dinner' | 'trip' | 'celebration' | 'activity' | 'personal';
  color: string;
  createdBy: string;
}

export interface FreeTimeSlot {
  day: string;
  date: string;
  startTime: string;
  endTime: string;
  durationMinutes: number;
  availableMemberIds: string[];
  suggestedActivity?: string;
}

export type ActivityCategory =
  | 'All'
  | 'Indoor'
  | 'Outdoor'
  | 'Free'
  | 'Low Cost'
  | 'Weekend'
  | 'Short'
  | 'Special Occasion';

export interface Activity {
  id: string;
  title: string;
  arabicTitle?: string;
  category: ActivityCategory[];
  duration: string;
  cost: 'Free' | '$' | '$$';
  suits: string;
  whyRecommended: string;
  description: string;
  iconName: string;
}

export interface WeeklyChallenge {
  id: string;
  title: string;
  arabicTitle?: string;
  goalDescription: string;
  targetCount: number;
  currentCount: number;
  unit: string;
  participantIds: string[];
  remainingDays: number;
  isCompleted: boolean;
  rewardNote: string;
}

export interface AppNotification {
  id: string;
  recipientId: string;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  type: 'bridge' | 'calendar' | 'challenge' | 'mood' | 'recommendation';
  actionTarget?: string;
}

export interface HarmonyReportData {
  score: number;
  previousScore: number;
  weeklyTrend: number;
  sharedActivitiesCount: number;
  challengesCompleted: number;
  sharedTimeHours: string;
  positiveActivities: { title: string; count: string; description: string }[];
  suggestedImprovements: string[];
}

export interface KidAIChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
  topicCategory?: 'academic' | 'accident' | 'conflict' | 'fear' | 'general';
  suggestedAction?: 'bridge' | 'calm' | 'explore';
  detectedEmotion?: string;
  bridgePrepared?: boolean;
}

export interface ChildAIInteractionSummary {
  childId: string;
  childName: string;
  childRole: FamilyRole;
  lastActive: string;
  emotionalState: 'High Anxiety' | 'Mild Stress' | 'Vulnerable' | 'Calm' | 'Hopeful';
  anxietyLevelPercent: number;
  coreConcerns: string[];
  recentTopic: string;
  recentChatSnippet: string;
  parentGuidance: {
    overview: string;
    doList: string[];
    dontList: string[];
    suggestedOpeningScript: string;
    recommendedActivityTogether: string;
  };
  bridgeRequestPending: boolean;
  bridgeMessageText?: string;
  parentReassuranceSent?: string;
}
