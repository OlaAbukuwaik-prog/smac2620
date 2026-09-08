import React, { useState } from 'react';
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
import { CompetitionStoryModal } from './components/CompetitionStoryModal';
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
  // Family & Member State
  const [allMembers, setAllMembers] = useState<FamilyMember[]>(INITIAL_MEMBERS);
  const [activeMember, setActiveMember] = useState<FamilyMember>(INITIAL_MEMBERS[0]);
  const [family, setFamily] = useState<Family>(INITIAL_FAMILY);
  const [currentTab, setCurrentTab] = useState<TabType>('home');

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
  const [showCompetitionStoryModal, setShowCompetitionStoryModal] = useState(false);
  const [showSafeConnectModal, setShowSafeConnectModal] = useState(false);
  const [showFamilyAdminModal, setShowFamilyAdminModal] = useState(false);
  const [showFeatureGuideModal, setShowFeatureGuideModal] = useState(false);
  const [showQuickAddMenu, setShowQuickAddMenu] = useState(false);
  const [selectedEventDetails, setSelectedEventDetails] = useState<FamilyEvent | null>(null);

  // Google Sign-In & Integration State
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [googleUserEmail, setGoogleUserEmail] = useState('parent@gmail.com');
  const [showGoogleIntegrationModal, setShowGoogleIntegrationModal] = useState(false);

  // Live Child AI Interaction Summary (Coaching guide generated for parents)
  const [guidanceSummary, setGuidanceSummary] = useState<ChildAIInteractionSummary | undefined>(undefined);

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

  // Bridge Conversation Completed
  const handleBridgeConversationCompleted = (message: BridgeMessage) => {
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
          description: `Respectful conversation with ${message.recipientId === 'user-dad' ? 'Dad' : 'Parent'} completed peacefully.`,
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

  // Apply Action from Guided Competition Demo Flow (Section 23)
  const handleApplyStoryStep = (stepNumber: number) => {
    switch (stepNumber) {
      case 1:
        // Mood check: Nervous
        handleSaveMood({
          userId: 'user-teen',
          date: '2026-09-06',
          mood: 'Not great',
          energy: 2,
          stress: 5,
          sleep: 2,
          familyConnection: 3,
          privateNote: 'Worried about my exam grade.',
          sharedWithFamily: true,
        });
        break;
      case 2:
      case 3:
      case 4:
      case 5:
        setCurrentTab('bridge');
        break;
      case 6:
      case 7:
      case 8: {
        const dad = allMembers.find((m) => m.role === 'Parent');
        if (dad) setActiveMember(dad);
        setCurrentTab('bridge');
        break;
      }
      case 9:
      case 10: {
        const teen = allMembers.find((m) => m.role === 'Teenager');
        if (teen) setActiveMember(teen);
        setFamily((prev) => ({ ...prev, harmonyScore: 84, weeklyTrendPercent: 10 }));
        setCurrentTab('home');
        break;
      }
      case 11:
      case 12:
        setCurrentTab('family');
        setFamilySubTab('calendar');
        break;
      case 13: {
        handleAddEvent({
          title: 'Family Dinner Tonight',
          arabicTitle: 'عشاء العائلة الليلة',
          date: '2026-09-06',
          startTime: '18:30',
          endTime: '19:30',
          location: 'Home Dining Room',
          participantIds: allMembers.map((m) => m.id),
          category: 'dinner',
          color: '#8b5cf6',
          notes: 'Scheduled via Free Time overlap calculation.',
        });
        break;
      }
      case 14:
        handleIncrementChallenge();
        setCurrentTab('home');
        break;
      default:
        break;
    }
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
      onOpenCompetitionDemo={() => setShowCompetitionStoryModal(true)}
      onOpenMLKitReport={() => setShowMLKitModal(true)}
      onOpenGoogleIntegration={() => setShowGoogleIntegrationModal(true)}
      googleEmail={googleUserEmail}
      onSignOut={() => setIsSignedIn(false)}
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
            onUpdateParentGuidance={setGuidanceSummary}
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
                onOpenOAuthModal={() => setShowOAuthModal(true)}
              />
            ) : (
              <ActivitiesScreen
                activities={activities}
                onAddActivityToCalendar={(act) => {
                  handleAddEvent({
                    title: act.title,
                    date: '2026-09-06',
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
              {/* FUTURE AI CONNECT: SAFE HAVEN (Highlight in Quick Menu) */}
              <button
                id="quick-menu-safeconnect-btn"
                onClick={() => {
                  setShowQuickAddMenu(false);
                  setShowSafeConnectModal(true);
                }}
                className="col-span-2 p-3.5 rounded-2xl bg-gradient-to-r from-purple-900 via-indigo-900 to-purple-950 text-white text-left space-y-1 shadow hover:from-purple-950 hover:to-indigo-950 transition-all active:scale-95 border border-purple-400/30"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 font-bold text-xs text-amber-300">
                    <ShieldAlert className="w-4 h-4" />
                    <span>Future AI Connect (Safe Haven)</span>
                  </div>
                  <span className="text-[9px] bg-amber-400/20 text-amber-300 px-2 py-0.5 rounded font-semibold border border-amber-400/30">
                    Harm Prevention
                  </span>
                </div>
                <div className="text-[10px] text-purple-200">
                  Scared of parents' reaction? Confess safely & coach parents to respond without harm.
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

      <CompetitionStoryModal
        isOpen={showCompetitionStoryModal}
        onClose={() => setShowCompetitionStoryModal(false)}
        onApplyStepAction={handleApplyStoryStep}
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
        currentMembers={allMembers}
        onAddMember={(newMember) => {
          setAllMembers((prev) => [...prev, newMember]);
        }}
        onSwitchToFather={() => {
          const parent = allMembers.find((m) => m.role === 'Parent');
          if (parent) setActiveMember(parent);
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
