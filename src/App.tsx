import React, { useState, useEffect } from 'react';
import {
  INITIAL_MEMBERS,
  INITIAL_FAMILY,
  INITIAL_MOOD_HISTORY,
  INITIAL_EVENTS,
  INITIAL_ACTIVITIES,
  INITIAL_CHALLENGE,
  INITIAL_NOTIFICATIONS,
  INITIAL_HARMONY_REPORT,
} from './data/mockData';
import {
  FamilyMember,
  Family,
  MoodEntry,
  FamilyEvent,
  Activity,
  WeeklyChallenge,
  AppNotification,
  HarmonyReportData,
  BridgeMessage,
  ChildAIInteractionSummary,
} from './types';
import {
  getSavedFamilies,
  getFamilyGuidance,
  saveFamilyGuidance,
} from './services/familyRegistry';
import { AndroidFrame } from './components/AndroidFrame';
import { TopAppBar, BottomNavigation, TabType } from './components/Navigation';
import { HomeScreen } from './components/HomeScreen';
import { BridgeScreen } from './components/BridgeScreen';
import { CalendarScreen } from './components/CalendarScreen';
import { ActivitiesScreen } from './components/ActivitiesScreen';
import { ProfileScreen } from './components/ProfileScreen';
import { MoodTrackerModal } from './components/MoodTrackerModal';
import { FamilyMoodDashboard } from './components/FamilyMoodDashboard';
import { HarmonyModal } from './components/HarmonyModal';
import { ChallengeModal } from './components/ChallengeModal';
import { AssistantModal } from './components/AssistantModal';
import { PrivacyModal } from './components/PrivacyModal';
import { CalendarOAuthModal } from './components/CalendarOAuthModal';
import { MLKitReportModal } from './components/MLKitReportModal';
import { NotificationDrawer } from './components/NotificationDrawer';
import { SafeConnectBridgeModal } from './components/SafeConnectBridgeModal';
import { FamilyAdminSetupModal } from './components/FamilyAdminSetupModal';
import { AppFeatureGuideModal } from './components/AppFeatureGuideModal';
import { GoogleSignInScreen } from './components/GoogleSignInScreen';
import { GoogleIntegrationModal } from './components/GoogleIntegrationModal';
import {
  MessageSquareHeart,
  Smile,
  Calendar as CalendarIcon,
  Compass,
  X,
  MapPin,
  Clock,
  Users,
  ShieldAlert,
  Sparkles,
} from 'lucide-react';

export default function App() {
  // User Session & Persistence for Real Users
  const [isSignedIn, setIsSignedIn] = useState<boolean>(() => {
    try {
      return localStorage.getItem('silah_is_signed_in') === 'true';
    } catch {
      return false;
    }
  });

  const [googleUserEmail, setGoogleUserEmail] = useState<string>(() => {
    try {
      return localStorage.getItem('silah_user_email') || '';
    } catch {
      return '';
    }
  });

  const [family, setFamily] = useState<Family>(() => {
    try {
      const saved = localStorage.getItem('silah_family');
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return INITIAL_FAMILY;
  });

  const [allMembers, setAllMembers] = useState<FamilyMember[]>(() => {
    try {
      const saved = localStorage.getItem('silah_members');
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return INITIAL_MEMBERS;
  });

  const [activeMember, setActiveMember] = useState<FamilyMember>(() => {
    try {
      const saved = localStorage.getItem('silah_active_member');
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return INITIAL_MEMBERS[0];
  });

  const [currentTab, setCurrentTab] = useState<TabType>('home');

  // Sync state to local storage for real-world continuity
  useEffect(() => {
    try {
      if (isSignedIn) {
        localStorage.setItem('silah_is_signed_in', 'true');
        localStorage.setItem('silah_user_email', googleUserEmail);
        localStorage.setItem('silah_active_member', JSON.stringify(activeMember));
        localStorage.setItem('silah_members', JSON.stringify(allMembers));
        localStorage.setItem('silah_family', JSON.stringify(family));
      }
    } catch {
      // ignore
    }
  }, [isSignedIn, googleUserEmail, activeMember, allMembers, family]);

  const handleSignOut = () => {
    try {
      localStorage.removeItem('silah_is_signed_in');
      localStorage.removeItem('silah_active_member');
    } catch {
      // ignore
    }
    setIsSignedIn(false);
  };

  // Content state
  const [moodHistory, setMoodHistory] = useState<MoodEntry[]>(INITIAL_MOOD_HISTORY);
  const [events, setEvents] = useState<FamilyEvent[]>(INITIAL_EVENTS);
  const [weeklyChallenge, setWeeklyChallenge] = useState<WeeklyChallenge>(INITIAL_CHALLENGE);
  const [todaySuggestion, setTodaySuggestion] = useState<Activity>(INITIAL_ACTIVITIES[0]);
  const [activities] = useState<Activity[]>(INITIAL_ACTIVITIES);
  const [notifications, setNotifications] = useState<AppNotification[]>(INITIAL_NOTIFICATIONS);
  const [harmonyReport, setHarmonyReport] = useState<HarmonyReportData>(INITIAL_HARMONY_REPORT);

  // Modal Controls
  const [showHarmonyModal, setShowHarmonyModal] = useState(false);
  const [showMoodModal, setShowMoodModal] = useState(false);
  const [showMoodDashboard, setShowMoodDashboard] = useState(false);
  const [showOAuthModal, setShowOAuthModal] = useState(false);
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);
  const [showMLKitModal, setShowMLKitModal] = useState(false);
  const [showChallengeModal, setShowChallengeModal] = useState(false);
  const [showAssistantModal, setShowAssistantModal] = useState(false);
  const [showNotificationDrawer, setShowNotificationDrawer] = useState(false);
  const [showSafeConnectModal, setShowSafeConnectModal] = useState(false);
  const [showFamilyAdminModal, setShowFamilyAdminModal] = useState(false);
  const [showFeatureGuideModal, setShowFeatureGuideModal] = useState(false);
  const [showQuickAddMenu, setShowQuickAddMenu] = useState(false);
  const [selectedEventDetails, setSelectedEventDetails] = useState<FamilyEvent | null>(null);

  // Google Sign-In & Integration State
  const [showGoogleIntegrationModal, setShowGoogleIntegrationModal] = useState(false);

  // Live Child AI Interaction Summary (Ways to Treat Your Kid - generated automatically from kid's AI confidant)
  const [guidanceSummary, setGuidanceSummary] = useState<ChildAIInteractionSummary | undefined>(() => {
    try {
      const saved = getFamilyGuidance(family?.id || 'fam-01');
      if (saved) return saved;
    } catch {
      // ignore
    }
    return undefined;
  });

  // Listen to cross-component guidance update events
  useEffect(() => {
    // Listen to cross-component guidance update events
    const handleGuidanceEvent = (e: CustomEvent<ChildAIInteractionSummary>) => {
      if (e.detail) {
        setGuidanceSummary(e.detail);
      }
    };
    window.addEventListener('silah-guidance-updated', handleGuidanceEvent as EventListener);

    // Listen to new member joined via code events
    const handleMemberJoinedEvent = (e: CustomEvent<{ memberName: string; familyName?: string }>) => {
      if (e.detail?.memberName) {
        const notif: AppNotification = {
          id: `notif-join-${Date.now()}`,
          recipientId: activeMember.id,
          title: `New Family Member Joined! 🎉`,
          message: `${e.detail.memberName} just joined your family using the invite code.`,
          timestamp: 'Just now',
          read: false,
          type: 'recommendation',
        };
        setNotifications((prev) => [notif, ...prev]);
      }
    };
    window.addEventListener('silah-member-joined', handleMemberJoinedEvent as EventListener);

    return () => {
      window.removeEventListener('silah-guidance-updated', handleGuidanceEvent as EventListener);
      window.removeEventListener('silah-member-joined', handleMemberJoinedEvent as EventListener);
    };
  }, [activeMember.id]);

  const handleUpdateParentGuidance = (summary: ChildAIInteractionSummary) => {
    setGuidanceSummary(summary);
    if (family?.id) {
      saveFamilyGuidance(family.id, summary);
    }
    // Also notify parents about the new coaching guide
    const parent = allMembers.find((m) => m.role === 'Parent');
    const newNotif: AppNotification = {
      id: `notif-guide-${Date.now()}`,
      recipientId: parent?.id || 'user-dad',
      title: `AI Guidance for ${summary.childName}`,
      message: `${summary.childName} talked with AI Confidant. Check Parent Guidance for empathetic advice and connection scripts.`,
      timestamp: 'Just now',
      read: false,
      type: 'bridge',
      actionTarget: 'bridge',
    };
    setNotifications((prev) => [newNotif, ...prev]);
  };

  // Automatically generates ways to treat the kid on the parent side when the kid chats
  const handleKidTriggerGuidance = (kidPrompt: string) => {
    const textLower = kidPrompt.toLowerCase();
    let emotion = 'Anxious & Overwhelmed';
    let summaryForParent = '';
    let doRules: string[] = [];
    let dontRules: string[] = [];
    let script = '';
    const childName = activeMember.name || 'Your child';

    if (textLower.includes('fail') || textLower.includes('grade') || textLower.includes('exam') || textLower.includes('school') || textLower.includes('academic')) {
      emotion = 'Academic Panic & Fear of Disappointment';
      summaryForParent = `${childName} is carrying intense anxiety regarding an academic test or school grade. Underneath the panic is a deep desire to make you proud and a fear of harsh anger or disappointment. They need calm reassurance and teamwork rather than interrogation.`;
      doRules = [
        'Acknowledge their courage in speaking honestly with you.',
        'Give them a reassuring hug or offer a warm beverage before discussing school.',
        'Focus on future study routines and tutoring help as a supportive team without blame.',
        'Remind them: "My love for you never depends on a test score."',
      ];
      dontRules = [
        'DO NOT shout, yell, or react with explosive anger.',
        'DO NOT compare them to siblings, cousins, or classmates.',
        'DO NOT threaten to cancel all social activities or ground them in anger.',
      ];
      script = `"Thank you for telling me honestly. I know you were worried I might be upset, but your honesty and well-being matter far more to me than any grade. Let's take a deep breath and figure out how to tackle this together as a team."`;
    } else if (textLower.includes('break') || textLower.includes('damage') || textLower.includes('accident') || textLower.includes('mess')) {
      emotion = 'Panic & Guilt over an Accident';
      summaryForParent = `${childName} experienced an accidental mishap or damage to an item. They are trembling with anxiety and terrified of being yelled at or shamed. They feel genuine remorse and need your steady, calm presence.`;
      doRules = [
        'Check on your child’s emotional and physical safety first before looking at the item.',
        'Remind yourself: It is a material possession that can be repaired or replaced.',
        'Praise them warmly for admitting it immediately rather than trying to hide it.',
        'Guide them calmly on how to clean up or help repair it together without anger.',
      ];
      dontRules = [
        'DO NOT yell, slam doors, or use intimidating body language.',
        'DO NOT say "You always ruin things" or attack their personal character.',
        'DO NOT treat an accidental mistake the same as intentional disobedience.',
      ];
      script = `"Take a deep breath. Are you okay? The item is just material, but you are my child and I love you. Thank you for telling me right away. We will clean it up and solve it together."`;
    } else {
      emotion = 'General Anxiety & Need for Emotional Safety';
      summaryForParent = `${childName} is carrying significant emotional weight and anxiety today. They need unconditional reassurance that they are loved, valued, and that home is a warm, emotionally safe haven where they will never be judged or yelled at.`;
      doRules = [
        'Greet them with physical warmth (a hug, a gentle touch on the shoulder) and a warm smile.',
        'Give them space to unwind without bombarding them with questions or chores.',
        'Reassure them: "I love you no matter what kind of day you had."',
      ];
      dontRules = [
        'DO NOT demand immediate explanations if they appear quiet or withdrawn.',
        'DO NOT use sarcasm, sharp tones, or exasperated sighs.',
        'DO NOT bring up past mistakes or lecture about responsibility when they are already stressed.',
      ];
      script = `"Hey sweetheart, I noticed you seemed carrying a heavy load today. I just want to tell you that I love you no matter what. Whenever you feel like talking, I'm right here with zero judgment and all the love in the world."`;
    }

    const newGuidance: ChildAIInteractionSummary = {
      childId: activeMember.id,
      childName,
      childRole: activeMember.role || 'Child',
      lastActive: 'Just now',
      emotionalState: emotion,
      anxietyLevelPercent: 82,
      coreConcerns: ['Fear of anger or yelling', 'Need for emotional safety', 'Trust preservation'],
      recentTopic: kidPrompt.slice(0, 80),
      recentChatSnippet: kidPrompt,
      parentGuidance: {
        overview: summaryForParent,
        doList: doRules,
        dontList: dontRules,
        suggestedOpeningScript: script,
        recommendedActivityTogether: 'Quiet evening walk, warm beverage, or relaxed family dinner',
      },
      bridgeRequestPending: true,
      bridgeMessageText: `Parent, I experienced a difficult situation today. I care about our connection and want to talk calmly together.`,
    };

    handleUpdateParentGuidance(newGuidance);
  };

  // Outing Proposal from Kid to Parents
  const handleProposeOuting = (outingTitle: string) => {
    const parent = allMembers.find((m) => m.role === 'Parent');
    const newNotif: AppNotification = {
      id: `notif-${Date.now()}`,
      recipientId: parent?.id || 'user-dad',
      title: `${activeMember.name} proposed: ${outingTitle}!`,
      message: `Family member requested this activity. Fits everyone's Google Calendar free slot this weekend.`,
      timestamp: 'Just now',
      read: false,
      type: 'calendar',
      actionTarget: 'calendar',
    };
    setNotifications((prev) => [newNotif, ...prev]);
  };

  // Family Sub-navigation in "Family" Tab: 'calendar' | 'activities'
  const [familySubTab, setFamilySubTab] = useState<'calendar' | 'activities'>('calendar');

  // Handle Switching Active Persona
  const handleSwitchMember = (member: FamilyMember) => {
    setActiveMember(member);
  };

  // Add event handler
  const handleAddEvent = (newEventData: Omit<FamilyEvent, 'id' | 'createdBy'>) => {
    const newEvent: FamilyEvent = {
      ...newEventData,
      id: `ev-${Date.now()}`,
      createdBy: activeMember.id,
    };
    setEvents((prev) => [newEvent, ...prev]);

    // Send notification
    const notif: AppNotification = {
      id: `notif-${Date.now()}`,
      recipientId: activeMember.id,
      title: 'Event Scheduled',
      message: `"${newEvent.title}" has been added to the family calendar.`,
      timestamp: 'Just now',
      read: false,
      type: 'calendar',
    };
    setNotifications((prev) => [notif, ...prev]);
  };

  // Delete event handler
  const handleDeleteEvent = (eventId: string) => {
    setEvents((prev) => prev.filter((e) => e.id !== eventId));
  };

  // Save Mood Check-in
  const handleSaveMood = (entryData: Omit<MoodEntry, 'id' | 'timestamp'>) => {
    const newEntry: MoodEntry = {
      ...entryData,
      id: `mood-${Date.now()}`,
      timestamp: new Date().toISOString(),
    };
    setMoodHistory((prev) => [newEntry, ...prev]);

    // Update active member's current mood
    setAllMembers((prev) =>
      prev.map((m) =>
        m.id === activeMember.id
          ? { ...m, currentMood: entryData.mood, moodUpdatedAt: 'Just now' }
          : m
      )
    );
    setActiveMember((prev) => ({
      ...prev,
      currentMood: entryData.mood,
      moodUpdatedAt: 'Just now',
    }));
  };

  // Add Family Member
  const handleAddFamilyMember = (newMemberData: Partial<FamilyMember>) => {
    const fullMember: FamilyMember = {
      id: `member-${Date.now()}`,
      name: newMemberData.name || 'Family Member',
      arabicName: newMemberData.arabicName || newMemberData.name || 'عضو بالعائلة',
      role: newMemberData.role || 'Teenager',
      ageRange: newMemberData.ageRange || '13-17',
      avatarColor: newMemberData.avatarColor || 'bg-purple-600 text-white',
      initials:
        newMemberData.initials ||
        (newMemberData.name ? newMemberData.name.slice(0, 2).toUpperCase() : 'FM'),
      preferences: newMemberData.preferences || ['Family outings', 'Family meals'],
      calendar: newMemberData.calendar || {
        provider: 'google',
        accountEmail:
          newMemberData.calendar?.accountEmail ||
          `${(newMemberData.name || 'member').toLowerCase().replace(/\s+/g, '')}@gmail.com`,
        isConnected: true,
        scopes: ['https://www.googleapis.com/auth/calendar.events.readonly'],
      },
      privacySettings: {
        shareGeneralMoodWithFamily: true,
        shareDetailedMood: false,
        sharePrivateNotes: false,
        shareCalendarAvailability: true,
        enableAiAssistance: true,
        visibleActivityHistory: true,
      },
      currentMood: 'Good',
    };

    setAllMembers((prev) => [...prev, fullMember]);
    setFamily((prev) => ({
      ...prev,
      members: [...prev.members, fullMember],
    }));
  };

  // Bridge Conversation Completed
  const handleBridgeConversationCompleted = (message: BridgeMessage) => {
    const recipient = allMembers.find((m) => m.id === message.recipientId);
    const recipientName = recipient ? recipient.name : 'Parent';

    // Increase Harmony score by 2%
    setFamily((prev) => {
      const newScore = Math.min(100, prev.harmonyScore + 2);
      return {
        ...prev,
        harmonyScore: newScore,
        weeklyTrendPercent: prev.weeklyTrendPercent + 2,
      };
    });

    setHarmonyReport((prev) => ({
      ...prev,
      score: Math.min(100, prev.score + 2),
      weeklyTrend: prev.weeklyTrend + 2,
      positiveActivities: [
        {
          title: 'Bridge Dialogue Completed',
          count: 'New',
          description: `Respectful conversation with ${recipientName} completed peacefully.`,
        },
        ...prev.positiveActivities,
      ],
    }));

    // Add celebration notification
    const completedNotif: AppNotification = {
      id: `notif-${Date.now()}`,
      recipientId: activeMember.id,
      title: 'Bridge Conversation Completed ❤️',
      message: 'You and your parent completed an honest, calm conversation. Harmony increased +2%!',
      timestamp: 'Just now',
      read: false,
      type: 'bridge',
    };
    setNotifications((prev) => [completedNotif, ...prev]);
  };

  // Increment Weekly Challenge
  const handleIncrementChallenge = () => {
    setWeeklyChallenge((prev) => {
      const nextCount = Math.min(prev.targetCount, prev.currentCount + 1);
      const isCompleted = nextCount >= prev.targetCount;
      return {
        ...prev,
        currentCount: nextCount,
        isCompleted,
      };
    });

    // Reward Harmony points
    setFamily((prev) => ({
      ...prev,
      harmonyScore: Math.min(100, prev.harmonyScore + 5),
      weeklyTrendPercent: prev.weeklyTrendPercent + 5,
    }));
  };

  const unreadNotificationCount = notifications.filter((n) => !n.read).length;

  if (!isSignedIn) {
    return (
      <GoogleSignInScreen
        initialFamily={family}
        availableMembers={allMembers}
        onSignInAndHubComplete={({ activeMember: newActive, allMembers: newMembers, family: newFamily, userEmail }) => {
          setActiveMember(newActive);
          setAllMembers(newMembers);
          setFamily(newFamily);
          setGoogleUserEmail(userEmail);
          setIsSignedIn(true);
          setCurrentTab('home');
        }}
        onSignInSuccess={(member, email) => {
          setActiveMember(member);
          setGoogleUserEmail(email);
          setIsSignedIn(true);
          setCurrentTab('home');
        }}
      />
    );
  }

  return (
    <AndroidFrame
      activeMember={activeMember}
      allMembers={allMembers}
      onSwitchMember={handleSwitchMember}
      onOpenMLKitReport={() => setShowMLKitModal(true)}
      onOpenGoogleIntegration={() => setShowGoogleIntegrationModal(true)}
      googleEmail={googleUserEmail}
      onSignOut={handleSignOut}
    >
      {/* Top Application Bar */}
      <TopAppBar
        onOpenNotifications={() => setShowNotificationDrawer(true)}
        onOpenMenuDrawer={() => setShowAssistantModal(true)}
        unreadCount={unreadNotificationCount}
        activeMember={activeMember}
        family={family}
        allMembers={allMembers}
        onSwitchMember={handleSwitchMember}
        onOpenFeatureGuide={() => setShowFeatureGuideModal(true)}
        onOpenFamilyAdmin={() => setShowFamilyAdminModal(true)}
      />

      {/* Main Tab Screen Content */}
      <main className="flex-1 flex flex-col">
        {currentTab === 'home' && (
          <HomeScreen
            family={family}
            activeMember={activeMember}
            allMembers={allMembers}
            upcomingEvents={events}
            weeklyChallenge={weeklyChallenge}
            todaySuggestion={todaySuggestion}
            onOpenHarmonyReport={() => setShowHarmonyModal(true)}
            onOpenMoodDashboard={() => setShowMoodDashboard(true)}
            onOpenCalendar={() => {
              setCurrentTab('family');
              setFamilySubTab('calendar');
            }}
            onSelectEvent={(ev) => setSelectedEventDetails(ev)}
            onOpenBridge={() => setCurrentTab('bridge')}
            onOpenMoodCheck={() => setShowMoodModal(true)}
            onOpenActivities={() => {
              setCurrentTab('family');
              setFamilySubTab('activities');
            }}
            onOpenAssistant={() => setShowAssistantModal(true)}
            onOpenChallengeDetails={() => setShowChallengeModal(true)}
            onOpenSafeConnect={() => setShowSafeConnectModal(true)}
            onOpenFamilyAdmin={() => setShowFamilyAdminModal(true)}
            onOpenFeatureGuide={() => setShowFeatureGuideModal(true)}
            guidanceSummary={guidanceSummary}
            onTriggerKidChatToParentGuidance={handleKidTriggerGuidance}
            onProposeOutingToParents={handleProposeOuting}
            onStartActivity={(act) => {
              handleAddEvent({
                title: act.title,
                date: '2026-09-06',
                startTime: '18:00',
                endTime: '19:00',
                location: 'Home',
                participantIds: allMembers.map((m) => m.id),
                category: 'activity',
                color: '#8b5cf6',
                notes: act.description,
              });
            }}
          />
        )}

        {currentTab === 'bridge' && (
          <BridgeScreen
            activeMember={activeMember}
            allMembers={allMembers}
            onConversationCompleted={handleBridgeConversationCompleted}
            onSwitchMember={handleSwitchMember}
            onOpenSafeConnect={() => setShowSafeConnectModal(true)}
            guidanceSummary={guidanceSummary}
            onUpdateParentGuidance={handleUpdateParentGuidance}
          />
        )}

        {currentTab === 'family' && (
          <div className="flex-1 flex flex-col">
            {/* Sub-navigation between Calendar and Activities */}
            <div className="px-4 pt-3 pb-1 flex gap-2">
              <button
                id="family-tab-calendar-btn"
                onClick={() => setFamilySubTab('calendar')}
                className={`flex-1 py-1.5 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-1.5 ${
                  familySubTab === 'calendar'
                    ? 'bg-purple-700 text-white shadow-sm'
                    : 'bg-white border border-purple-100 text-slate-600 hover:bg-purple-50'
                }`}
              >
                <CalendarIcon className="w-3.5 h-3.5" />
                <span>Shared Calendar</span>
              </button>
              <button
                id="family-tab-activities-btn"
                onClick={() => setFamilySubTab('activities')}
                className={`flex-1 py-1.5 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-1.5 ${
                  familySubTab === 'activities'
                    ? 'bg-purple-700 text-white shadow-sm'
                    : 'bg-white border border-purple-100 text-slate-600 hover:bg-purple-50'
                }`}
              >
                <Compass className="w-3.5 h-3.5" />
                <span>Activities</span>
              </button>
            </div>

            {familySubTab === 'calendar' ? (
              <CalendarScreen
                events={events}
                allMembers={allMembers}
                activeMember={activeMember}
                onAddEvent={handleAddEvent}
                onDeleteEvent={handleDeleteEvent}
                onOpenOAuthModal={() => setShowOAuthModal(true)}
              />
            ) : (
              <ActivitiesScreen
                activities={activities}
                onAddActivityToCalendar={(act) => {
                  handleAddEvent({
                    title: act.title,
                    date: new Date().toISOString().split('T')[0],
                    startTime: '18:00',
                    endTime: '19:00',
                    location: 'Home / Outdoors',
                    participantIds: allMembers.map((m) => m.id),
                    category: 'activity',
                    color: '#8b5cf6',
                    notes: act.description,
                  });
                }}
              />
            )}
          </div>
        )}

        {currentTab === 'profile' && (
          <ProfileScreen
            activeMember={activeMember}
            family={family}
            onOpenPrivacyModal={() => setShowPrivacyModal(true)}
            onOpenOAuthModal={() => setShowOAuthModal(true)}
            onOpenMLKitReport={() => setShowMLKitModal(true)}
            onOpenMoodHistory={() => setShowMoodModal(true)}
            onOpenAdminModal={() => setShowFamilyAdminModal(true)}
            onOpenParentGuide={() => setCurrentTab('bridge')}
            onSignOut={handleSignOut}
            onUpdatePrivacy={(newPrivacy) => {
              setActiveMember((prev) => ({ ...prev, privacySettings: newPrivacy }));
            }}
          />
        )}
      </main>

      {/* Android Bottom Navigation */}
      <BottomNavigation
        currentTab={currentTab}
        onSelectTab={(tab) => setCurrentTab(tab)}
        onOpenQuickMenu={() => setShowQuickAddMenu(true)}
        onOpenNotifications={() => setShowNotificationDrawer(true)}
        onOpenMenuDrawer={() => setShowAssistantModal(true)}
        unreadCount={unreadNotificationCount}
        activeMember={activeMember}
      />

      {/* QUICK ADD ACTION SHEET (+ Button in Bottom Navigation) */}
      {showQuickAddMenu && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-end justify-center p-3 animate-in fade-in">
          <div className="bg-white rounded-3xl p-5 max-w-sm w-full space-y-3 shadow-2xl border border-purple-100 animate-in slide-in-from-bottom">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <span className="text-xs font-bold uppercase tracking-wider text-purple-950">
                Quick Family Actions
              </span>
              <button
                onClick={() => setShowQuickAddMenu(false)}
                className="p-1 text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              {/* AI CONFIDANT CHAT */}
              <button
                id="quick-menu-safeconnect-btn"
                onClick={() => {
                  setShowQuickAddMenu(false);
                  setCurrentTab('bridge');
                }}
                className="col-span-2 p-3.5 rounded-2xl bg-gradient-to-r from-purple-800 to-indigo-800 text-white text-left space-y-1 shadow hover:from-purple-900 hover:to-indigo-900 transition-all active:scale-95"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 font-bold text-xs text-amber-300">
                    <Sparkles className="w-4 h-4" />
                    <span>Talk with AI Confidant</span>
                  </div>
                  <span className="text-[9px] bg-white/20 text-white px-2 py-0.5 rounded font-semibold">
                    100% Private
                  </span>
                </div>
                <div className="text-[10px] text-purple-200">
                  Chat freely about any feelings, questions, or stress in a safe space.
                </div>
              </button>

              <button
                id="quick-menu-bridge-btn"
                onClick={() => {
                  setShowQuickAddMenu(false);
                  setCurrentTab('bridge');
                }}
                className="p-3.5 rounded-2xl bg-purple-700 text-white text-left space-y-1 shadow hover:bg-purple-800 transition-all active:scale-95"
              >
                <MessageSquareHeart className="w-5 h-5 text-white" />
                <div className="font-bold text-xs">Tell Someone</div>
                <div className="text-[10px] text-purple-200">Start calm Bridge message</div>
              </button>

              <button
                id="quick-menu-mood-btn"
                onClick={() => {
                  setShowQuickAddMenu(false);
                  setShowMoodModal(true);
                }}
                className="p-3.5 rounded-2xl bg-amber-500 text-white text-left space-y-1 shadow hover:bg-amber-600 transition-all active:scale-95"
              >
                <Smile className="w-5 h-5 text-white" />
                <div className="font-bold text-xs">Mood Check</div>
                <div className="text-[10px] text-amber-100">Record daily feeling</div>
              </button>

              <button
                id="quick-menu-calendar-btn"
                onClick={() => {
                  setShowQuickAddMenu(false);
                  setCurrentTab('family');
                  setFamilySubTab('calendar');
                }}
                className="p-3.5 rounded-2xl bg-indigo-600 text-white text-left space-y-1 shadow hover:bg-indigo-700 transition-all active:scale-95"
              >
                <CalendarIcon className="w-5 h-5 text-white" />
                <div className="font-bold text-xs">Add Event</div>
                <div className="text-[10px] text-indigo-200">Schedule family time</div>
              </button>

              <button
                id="quick-menu-activities-btn"
                onClick={() => {
                  setShowQuickAddMenu(false);
                  setCurrentTab('family');
                  setFamilySubTab('activities');
                }}
                className="p-3.5 rounded-2xl bg-emerald-600 text-white text-left space-y-1 shadow hover:bg-emerald-700 transition-all active:scale-95"
              >
                <Compass className="w-5 h-5 text-white" />
                <div className="font-bold text-xs">Family Activity</div>
                <div className="text-[10px] text-emerald-100">Browse recommendations</div>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* EVENT DETAILS MODAL (When clicking upcoming events on Home) */}
      {selectedEventDetails && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-3">
          <div className="bg-white rounded-3xl p-5 max-w-sm w-full space-y-4 shadow-2xl border border-purple-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: selectedEventDetails.color }}
                />
                <h3 className="text-sm font-bold text-slate-900">{selectedEventDetails.title}</h3>
              </div>
              <button
                onClick={() => setSelectedEventDetails(null)}
                className="p-1 text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {selectedEventDetails.arabicTitle && (
              <div className="text-xs font-arabic text-purple-700 -mt-2">
                {selectedEventDetails.arabicTitle}
              </div>
            )}

            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 text-xs space-y-2">
              <div className="flex items-center gap-2 text-slate-700">
                <Clock className="w-4 h-4 text-purple-600" />
                <span>
                  {selectedEventDetails.date} • {selectedEventDetails.startTime} -{' '}
                  {selectedEventDetails.endTime}
                </span>
              </div>
              {selectedEventDetails.location && (
                <div className="flex items-center gap-2 text-slate-700">
                  <MapPin className="w-4 h-4 text-purple-600" />
                  <span>{selectedEventDetails.location}</span>
                </div>
              )}
            </div>

            {selectedEventDetails.notes && (
              <p className="text-xs text-slate-600 leading-relaxed italic bg-purple-50/50 p-2.5 rounded-xl border border-purple-100">
                "{selectedEventDetails.notes}"
              </p>
            )}

            <div className="space-y-1 text-xs">
              <span className="font-bold text-slate-700 text-[11px] uppercase tracking-wider block">
                Participants:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {selectedEventDetails.participantIds.map((pId) => {
                  const m = allMembers.find((mem) => mem.id === pId);
                  if (!m) return null;
                  return (
                    <span
                      key={pId}
                      className="px-2 py-1 rounded-xl bg-slate-100 text-[11px] font-medium text-slate-700 flex items-center gap-1"
                    >
                      <div
                        className={`w-3.5 h-3.5 rounded-full flex items-center justify-center text-[8px] font-bold ${m.avatarColor}`}
                      >
                        {m.initials}
                      </div>
                      <span>{m.name}</span>
                    </span>
                  );
                })}
              </div>
            </div>

            <button
              onClick={() => setSelectedEventDetails(null)}
              className="w-full py-2.5 rounded-xl bg-purple-700 text-white font-bold text-xs shadow"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Modals */}
      <HarmonyModal
        isOpen={showHarmonyModal}
        onClose={() => setShowHarmonyModal(false)}
        report={harmonyReport}
      />

      <MoodTrackerModal
        isOpen={showMoodModal}
        onClose={() => setShowMoodModal(false)}
        activeMember={activeMember}
        moodHistory={moodHistory}
        onSaveMood={handleSaveMood}
      />

      <FamilyMoodDashboard
        isOpen={showMoodDashboard}
        onClose={() => setShowMoodDashboard(false)}
        allMembers={allMembers}
        activeMember={activeMember}
        onOpenMoodCheck={() => {
          setShowMoodDashboard(false);
          setShowMoodModal(true);
        }}
      />

      <ChallengeModal
        isOpen={showChallengeModal}
        onClose={() => setShowChallengeModal(false)}
        challenge={weeklyChallenge}
        allMembers={allMembers}
        onIncrementChallenge={handleIncrementChallenge}
      />

      <AssistantModal
        isOpen={showAssistantModal}
        onClose={() => setShowAssistantModal(false)}
        activeMember={activeMember}
      />

      <PrivacyModal
        isOpen={showPrivacyModal}
        onClose={() => setShowPrivacyModal(false)}
        settings={activeMember.privacySettings}
        onSave={(newSettings) => {
          setActiveMember((prev) => ({ ...prev, privacySettings: newSettings }));
          setAllMembers((prev) =>
            prev.map((m) => (m.id === activeMember.id ? { ...m, privacySettings: newSettings } : m))
          );
        }}
      />

      <CalendarOAuthModal
        isOpen={showOAuthModal}
        onClose={() => setShowOAuthModal(false)}
        activeMember={activeMember}
        onToggleConnection={(connected) => {
          setActiveMember((prev) => ({
            ...prev,
            calendar: { ...prev.calendar, isConnected: connected },
          }));
          setAllMembers((prev) =>
            prev.map((m) =>
              m.id === activeMember.id
                ? { ...m, calendar: { ...m.calendar, isConnected: connected } }
                : m
            )
          );
        }}
      />

      <MLKitReportModal
        isOpen={showMLKitModal}
        onClose={() => setShowMLKitModal(false)}
      />

      <SafeConnectBridgeModal
        isOpen={showSafeConnectModal}
        onClose={() => setShowSafeConnectModal(false)}
        activeMember={activeMember}
        allMembers={allMembers}
        onResolveWithHarmonyBoost={(boost) => {
          setFamily((prev) => ({
            ...prev,
            harmonyScore: Math.min(100, (prev.harmonyScore || 82) + boost),
          }));
        }}
        onSwitchActiveMember={(member) => setActiveMember(member)}
      />

      <FamilyAdminSetupModal
        isOpen={showFamilyAdminModal}
        onClose={() => setShowFamilyAdminModal(false)}
        family={family}
        allMembers={allMembers}
        adminEmail={googleUserEmail || activeMember.calendar?.accountEmail}
        adminName={activeMember.name}
        onAddMember={(newMember) => {
          handleAddFamilyMember(newMember);
        }}
        onSwitchToFather={() => {
          const parent = allMembers.find((m) => m.role === 'Parent');
          if (parent) setActiveMember(parent);
          setShowFamilyAdminModal(false);
        }}
      />

      <AppFeatureGuideModal
        isOpen={showFeatureGuideModal}
        onClose={() => setShowFeatureGuideModal(false)}
        activeRole={activeMember.role}
        onSwitchRole={(role) => {
          const target = allMembers.find((m) => m.role === role);
          if (target) setActiveMember(target);
        }}
      />

      <NotificationDrawer
        isOpen={showNotificationDrawer}
        onClose={() => setShowNotificationDrawer(false)}
        notifications={notifications}
        onMarkAllRead={() => {
          setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
        }}
        onSelectNotification={(notif) => {
          if (notif.type === 'bridge') setCurrentTab('bridge');
          else if (notif.type === 'calendar') {
            setCurrentTab('family');
            setFamilySubTab('calendar');
          } else if (notif.type === 'challenge') setShowChallengeModal(true);
          else if (notif.type === 'mood') setShowMoodModal(true);
        }}
      />

      <GoogleIntegrationModal
        isOpen={showGoogleIntegrationModal}
        onClose={() => setShowGoogleIntegrationModal(false)}
        activeMember={activeMember}
        allMembers={allMembers}
        googleEmail={googleUserEmail}
        onSignOut={() => {
          setShowGoogleIntegrationModal(false);
          setIsSignedIn(false);
        }}
        onSwitchGoogleAccount={(member) => {
          setActiveMember(member);
          setGoogleUserEmail(`${member.name.toLowerCase()}@gmail.com`);
        }}
      />
    </AndroidFrame>
  );
}
