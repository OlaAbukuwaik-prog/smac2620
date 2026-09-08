import React, { useState } from 'react';
import {
  ShieldCheck,
  Calendar as CalendarIcon,
  Users,
  CheckCircle2,
  Lock,
  ArrowRight,
  Info,
  Sparkles,
  ChevronRight,
  RefreshCw,
  Mail,
  KeyRound,
  UserPlus,
  Copy,
  Check,
  ArrowLeft,
  Plus,
  Trash2,
  User,
  Heart,
} from 'lucide-react';
import { FamilyMember, Family, FamilyRole } from '../types';

export interface GoogleSignInScreenProps {
  availableMembers: FamilyMember[];
  initialFamily?: Family;
  onSignInAndHubComplete?: (params: {
    activeMember: FamilyMember;
    allMembers: FamilyMember[];
    family: Family;
    userEmail: string;
  }) => void;
  onSignInSuccess?: (member: FamilyMember, googleEmail: string) => void;
}

type StepType = 'sign_in' | 'hub_choice' | 'create_hub' | 'join_hub';
type SignInMethod = 'google' | 'email';

export const GoogleSignInScreen: React.FC<GoogleSignInScreenProps> = ({
  availableMembers,
  initialFamily,
  onSignInAndHubComplete,
  onSignInSuccess,
}) => {
  // Navigation & Step state
  const [step, setStep] = useState<StepType>('sign_in');
  const [signInMethod, setSignInMethod] = useState<SignInMethod>('google');
  const [showHowItWorksTab, setShowHowItWorksTab] = useState(false);
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [showConsentPreview, setShowConsentPreview] = useState(false);

  // Authenticated user state
  const [authEmail, setAuthEmail] = useState('lovelyspurelove@gmail.com');
  const [authName, setAuthName] = useState('Ahmed (Father)');
  const [authPassword, setAuthPassword] = useState('••••••••');
  const [selectedPresetUser, setSelectedPresetUser] = useState<string>('m-dad');

  // Create Hub state
  const [hubName, setHubName] = useState(initialFamily?.name || 'Al-Mansoor Family');
  const [creatorRole, setCreatorRole] = useState<FamilyRole>('Parent');
  const [inviteCode, setInviteCode] = useState(initialFamily?.inviteCode || 'SILAH-7842');
  const [copiedCode, setCopiedCode] = useState(false);

  // Family members list for the new hub
  const [hubMembers, setHubMembers] = useState<FamilyMember[]>(() => {
    if (availableMembers && availableMembers.length > 0) {
      return [...availableMembers];
    }
    return [
      {
        id: 'user-dad',
        name: 'Ahmed (Father)',
        arabicName: 'الأب أحمد',
        role: 'Parent',
        ageRange: '40-49',
        avatarColor: 'bg-indigo-600 text-white',
        initials: 'AH',
        preferences: ['Evening walks', 'Family dinners'],
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
          accountEmail: 'lovelyspurelove@gmail.com',
          isConnected: true,
          scopes: ['https://www.googleapis.com/auth/calendar.freebusy'],
        },
      },
    ];
  });

  // Adding a new member inside Create Hub
  const [newMemberName, setNewMemberName] = useState('');
  const [newMemberRole, setNewMemberRole] = useState<FamilyRole>('Teenager');
  const [newMemberEmail, setNewMemberEmail] = useState('');
  const [showAddMemberForm, setShowAddMemberForm] = useState(false);

  // Join Hub state
  const [inputInviteCode, setInputInviteCode] = useState('');
  const [isCodeVerified, setIsCodeVerified] = useState(false);
  const [selectedJoinMemberId, setSelectedJoinMemberId] = useState<string>('user-teen');
  const [customJoinName, setCustomJoinName] = useState('');
  const [customJoinRole, setCustomJoinRole] = useState<FamilyRole>('Teenager');

  const defaultEmailMap: Record<string, { email: string; name: string; role: FamilyRole }> = {
    'm-dad': { email: 'lovelyspurelove@gmail.com', name: 'Ahmed (Father)', role: 'Parent' },
    'm-mom': { email: 'mona.almansoor@gmail.com', name: 'Mona (Mother)', role: 'Parent' },
    'm-sarah': { email: 'sarah.teen@gmail.com', name: 'Sarah (Teenager)', role: 'Teenager' },
    'm-brother': { email: 'omar.school@gmail.com', name: 'Omar (Younger Child)', role: 'Child' },
  };

  // 1. Handle Sign In
  const handlePerformSignIn = (presetKey?: string) => {
    setIsAuthenticating(true);

    const chosenKey = presetKey || selectedPresetUser;
    const preset = defaultEmailMap[chosenKey];

    const emailToUse = presetKey ? preset.email : authEmail;
    const nameToUse = presetKey ? preset.name : authName || 'Family Member';
    const roleToUse = presetKey ? preset.role : 'Parent';

    setAuthEmail(emailToUse);
    setAuthName(nameToUse);
    setCreatorRole(roleToUse);

    setTimeout(() => {
      setIsAuthenticating(false);
      // Move to Step 2: Make or Join a Family Hub
      setStep('hub_choice');
    }, 900);
  };

  // Copy code helper
  const handleCopyCode = (code: string) => {
    navigator.clipboard?.writeText(code);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  // Quick add pre-made member to hub
  const handleQuickAddMember = (name: string, role: FamilyRole, email: string, color: string) => {
    const exists = hubMembers.some((m) => m.name.toLowerCase().includes(name.toLowerCase()));
    if (exists) return;

    const newM: FamilyMember = {
      id: `member-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      name,
      arabicName: name,
      role,
      ageRange: role === 'Child' ? '9-12' : role === 'Teenager' ? '15-17' : '35-45',
      avatarColor: color,
      initials: name.slice(0, 2).toUpperCase(),
      preferences: ['Family time', 'Weekend dinner'],
      currentMood: 'Good',
      privacySettings: {
        shareGeneralMoodWithFamily: true,
        shareDetailedMood: role === 'Parent',
        sharePrivateNotes: false,
        shareCalendarAvailability: true,
        enableAiAssistance: true,
        visibleActivityHistory: true,
      },
      calendar: {
        provider: 'google',
        accountEmail: email,
        isConnected: true,
        scopes: ['https://www.googleapis.com/auth/calendar.freebusy'],
      },
    };

    setHubMembers((prev) => [...prev, newM]);
  };

  // Custom add member
  const handleAddCustomMember = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMemberName.trim()) return;

    const colors = [
      'bg-purple-600 text-white',
      'bg-indigo-600 text-white',
      'bg-rose-500 text-white',
      'bg-amber-500 text-white',
      'bg-emerald-600 text-white',
      'bg-cyan-600 text-white',
    ];
    const pickedColor = colors[hubMembers.length % colors.length];

    const newM: FamilyMember = {
      id: `member-${Date.now()}`,
      name: newMemberName.trim(),
      arabicName: newMemberName.trim(),
      role: newMemberRole,
      ageRange: newMemberRole === 'Child' ? '10-12' : newMemberRole === 'Teenager' ? '15-17' : '40-49',
      avatarColor: pickedColor,
      initials: newMemberName.slice(0, 2).toUpperCase(),
      preferences: ['Family outings', 'Reading'],
      currentMood: 'Good',
      privacySettings: {
        shareGeneralMoodWithFamily: true,
        shareDetailedMood: newMemberRole === 'Parent',
        sharePrivateNotes: false,
        shareCalendarAvailability: true,
        enableAiAssistance: true,
        visibleActivityHistory: true,
      },
      calendar: {
        provider: 'google',
        accountEmail: newMemberEmail || `${newMemberName.toLowerCase().replace(/\s+/g, '')}@gmail.com`,
        isConnected: true,
        scopes: ['https://www.googleapis.com/auth/calendar.freebusy'],
      },
    };

    setHubMembers((prev) => [...prev, newM]);
    setNewMemberName('');
    setNewMemberEmail('');
    setShowAddMemberForm(false);
  };

  // Remove member from hub
  const handleRemoveMember = (memberId: string) => {
    if (hubMembers.length <= 1) return; // Keep at least one
    setHubMembers((prev) => prev.filter((m) => m.id !== memberId));
  };

  // Finalize Hub Creation & Enter Home Page
  const handleFinishCreateHub = () => {
    // Determine active member (the creator)
    let activeM = hubMembers.find(
      (m) =>
        m.role === creatorRole ||
        m.name.toLowerCase().includes(authName.toLowerCase()) ||
        m.calendar?.accountEmail === authEmail
    );

    if (!activeM) {
      // Create creator as first member if not matching
      activeM = {
        id: `user-creator-${Date.now()}`,
        name: authName,
        arabicName: authName,
        role: creatorRole,
        ageRange: creatorRole === 'Parent' ? '40-49' : '15-17',
        avatarColor: 'bg-purple-700 text-white',
        initials: authName.slice(0, 2).toUpperCase(),
        preferences: ['Family bonding', 'Peaceful dinners'],
        currentMood: 'Good',
        privacySettings: {
          shareGeneralMoodWithFamily: true,
          shareDetailedMood: creatorRole === 'Parent',
          sharePrivateNotes: false,
          shareCalendarAvailability: true,
          enableAiAssistance: true,
          visibleActivityHistory: true,
        },
        calendar: {
          provider: 'google',
          accountEmail: authEmail,
          isConnected: true,
          scopes: ['https://www.googleapis.com/auth/calendar.freebusy'],
        },
      };
      setHubMembers((prev) => [activeM!, ...prev]);
    }

    const updatedFamily: Family = {
      id: `fam-${Date.now()}`,
      name: hubName || 'Our Family',
      arabicName: hubName || 'عائلتنا',
      inviteCode: inviteCode || 'SILAH-7842',
      harmonyScore: initialFamily?.harmonyScore || 85,
      previousHarmonyScore: initialFamily?.previousHarmonyScore || 78,
      weeklyTrendPercent: 7,
      members: hubMembers.length > 0 ? hubMembers : [activeM],
    };

    if (onSignInAndHubComplete) {
      onSignInAndHubComplete({
        activeMember: activeM,
        allMembers: hubMembers.length > 0 ? hubMembers : [activeM],
        family: updatedFamily,
        userEmail: authEmail,
      });
    } else if (onSignInSuccess) {
      onSignInSuccess(activeM, authEmail);
    }
  };

  // Finalize Joining Hub & Enter Home Page
  const handleFinishJoinHub = () => {
    const currentFamilyMembers = hubMembers.length > 0 ? hubMembers : availableMembers;
    let chosenMember = currentFamilyMembers.find((m) => m.id === selectedJoinMemberId);

    if (!chosenMember && customJoinName) {
      chosenMember = {
        id: `member-${Date.now()}`,
        name: customJoinName,
        arabicName: customJoinName,
        role: customJoinRole,
        ageRange: customJoinRole === 'Child' ? '10-12' : customJoinRole === 'Teenager' ? '15-17' : '35-45',
        avatarColor: customJoinRole === 'Child' ? 'bg-amber-500 text-white' : 'bg-violet-600 text-white',
        initials: customJoinName.slice(0, 2).toUpperCase(),
        preferences: ['Gaming', 'Family outings'],
        currentMood: 'Good',
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
          accountEmail: authEmail,
          isConnected: true,
          scopes: ['https://www.googleapis.com/auth/calendar.freebusy'],
        },
      };
      setHubMembers((prev) => [...prev, chosenMember!]);
    }

    const activeM = chosenMember || currentFamilyMembers[0];

    const updatedFamily: Family = {
      id: initialFamily?.id || 'fam-01',
      name: initialFamily?.name || 'Al-Mansoor Family',
      arabicName: initialFamily?.arabicName || 'عائلة آل منصور',
      inviteCode: inputInviteCode || initialFamily?.inviteCode || 'SILAH-7842',
      harmonyScore: initialFamily?.harmonyScore || 82,
      previousHarmonyScore: initialFamily?.previousHarmonyScore || 74,
      weeklyTrendPercent: 8,
      members: currentFamilyMembers,
    };

    if (onSignInAndHubComplete) {
      onSignInAndHubComplete({
        activeMember: activeM,
        allMembers: currentFamilyMembers,
        family: updatedFamily,
        userEmail: authEmail,
      });
    } else if (onSignInSuccess) {
      onSignInSuccess(activeM, authEmail);
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#f8f6fb] text-slate-800 flex flex-col items-center justify-center p-3 sm:p-6 md:p-10 selection:bg-purple-600 selection:text-white">
      {/* Main Elevated Card Container */}
      <div className="w-full max-w-4xl bg-white rounded-3xl shadow-xl border border-purple-100/90 overflow-hidden flex flex-col">
        {/* Brand Banner */}
        <div className="bg-gradient-to-r from-purple-900 via-indigo-900 to-purple-950 p-6 sm:p-7 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-purple-600/15 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1.5">
              <div className="flex items-center gap-2.5">
                <span className="text-2xl font-black text-amber-300 font-arabic">صلة</span>
                <span className="text-2xl font-bold tracking-tight text-white">Silah</span>
                <span className="text-[11px] bg-purple-800/80 text-purple-200 border border-purple-600/40 px-2.5 py-0.5 rounded-full font-medium">
                  Family Harmony & Connection
                </span>
              </div>
              <h1 className="text-lg sm:text-xl font-extrabold text-white">
                {step === 'sign_in' && 'Sign in to access your synchronized Family Hub'}
                {step === 'hub_choice' && 'Set Up Your Family Hub'}
                {step === 'create_hub' && 'Create Your Private Family Hub'}
                {step === 'join_hub' && 'Join an Existing Family Hub'}
              </h1>
              <p className="text-xs text-purple-200/90 max-w-xl">
                {step === 'sign_in' &&
                  'Seamless connection with Google Calendar, Google Identity, and empathetic AI de-escalation.'}
                {step === 'hub_choice' &&
                  'Parents usually create the family group and invite members, while kids and teens can join with an invite code.'}
                {step === 'create_hub' &&
                  'Name your family, add all family members, and receive an invite code to share with them.'}
                {step === 'join_hub' &&
                  'Enter your family invite code to join your family’s shared calendar and safe bridge.'}
              </p>
            </div>

            {/* Stepper indicator if past sign-in */}
            {step !== 'sign_in' ? (
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur border border-white/20 px-3.5 py-2 rounded-2xl shrink-0">
                <div className="w-8 h-8 rounded-full bg-amber-400 text-purple-950 font-black text-xs flex items-center justify-center">
                  {step === 'hub_choice' ? '1/2' : '2/2'}
                </div>
                <div className="text-left">
                  <div className="text-[11px] font-bold text-white">
                    {step === 'hub_choice' ? 'Setup Choice' : step === 'create_hub' ? 'Make Hub' : 'Join Hub'}
                  </div>
                  <div className="text-[10px] text-purple-200 truncate max-w-[120px]">{authName}</div>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-3 bg-white/10 backdrop-blur border border-white/20 p-2.5 sm:p-3 rounded-2xl shrink-0">
                <GoogleGLogo className="w-7 h-7" />
                <div>
                  <div className="text-xs font-bold text-white flex items-center gap-1">
                    <span>Google Verified</span>
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  </div>
                  <div className="text-[10px] text-purple-200">OAuth 2.0 & Calendar API</div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* STEP 1: FULL SIGN IN SCREEN (GOOGLE OR EMAIL) */}
        {step === 'sign_in' && (
          <div className="p-6 sm:p-8 space-y-6">
            {/* Top Switcher: Google vs Email vs How it's Linked */}
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4">
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setSignInMethod('google');
                    setShowHowItWorksTab(false);
                  }}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
                    signInMethod === 'google' && !showHowItWorksTab
                      ? 'bg-purple-700 text-white shadow-sm'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  <GoogleGLogo className="w-3.5 h-3.5" />
                  <span>Sign In with Google</span>
                </button>

                <button
                  onClick={() => {
                    setSignInMethod('email');
                    setShowHowItWorksTab(false);
                  }}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
                    signInMethod === 'email' && !showHowItWorksTab
                      ? 'bg-purple-700 text-white shadow-sm'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  <Mail className="w-3.5 h-3.5" />
                  <span>Sign In with Email</span>
                </button>
              </div>

              <button
                onClick={() => setShowHowItWorksTab(!showHowItWorksTab)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                  showHowItWorksTab
                    ? 'bg-indigo-100 text-indigo-900 font-bold'
                    : 'text-purple-700 hover:bg-purple-50'
                }`}
              >
                <Info className="w-3.5 h-3.5 text-purple-600" />
                <span>How Silah Links with Google</span>
              </button>
            </div>

            {/* If user clicked 'How Silah Links with Google' */}
            {showHowItWorksTab ? (
              <div className="space-y-4 p-5 bg-purple-50/60 rounded-2xl border border-purple-100 animate-in fade-in">
                <div className="flex items-center gap-2 text-purple-900 font-bold text-sm">
                  <Sparkles className="w-4 h-4 text-purple-600" />
                  <span>Google Integration Architecture & Least-Privilege Design</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                  <div className="p-3 bg-white rounded-xl border border-purple-100 space-y-1">
                    <div className="font-bold text-slate-800 flex items-center gap-1.5">
                      <CalendarIcon className="w-3.5 h-3.5 text-purple-600" />
                      <span>Google Calendar Sync</span>
                    </div>
                    <p className="text-[11px] text-slate-600">
                      Syncs family free/busy times and automatically books de-escalated family dinners and outings.
                    </p>
                  </div>
                  <div className="p-3 bg-white rounded-xl border border-purple-100 space-y-1">
                    <div className="font-bold text-slate-800 flex items-center gap-1.5">
                      <ShieldCheck className="w-3.5 h-3.5 text-indigo-600" />
                      <span>Google Identity</span>
                    </div>
                    <p className="text-[11px] text-slate-600">
                      Encrypted authentication via Google OAuth 2.0 without exposing raw credentials.
                    </p>
                  </div>
                  <div className="p-3 bg-white rounded-xl border border-purple-100 space-y-1">
                    <div className="font-bold text-slate-800 flex items-center gap-1.5">
                      <Lock className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Privacy Shield</span>
                    </div>
                    <p className="text-[11px] text-slate-600">
                      Kid AI Confidant conversations remain strictly shielded while preparing calm parental coaching notes.
                    </p>
                  </div>
                </div>
              </div>
            ) : null}

            {/* Main Sign-In Forms */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
              <div className="md:col-span-7 space-y-4">
                {signInMethod === 'google' ? (
                  <div className="space-y-4">
                    <div>
                      <h2 className="text-base font-bold text-slate-900">
                        Continue with your Google Account
                      </h2>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Uses Google OAuth 2.0 to safely identify family members and link family calendars.
                      </p>
                    </div>

                    {/* Google Email Input / Account Selector */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-700">Google Account Email:</label>
                      <div className="relative">
                        <input
                          type="email"
                          value={authEmail}
                          onChange={(e) => setAuthEmail(e.target.value)}
                          placeholder="e.g. yourname@gmail.com"
                          className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-300 focus:border-purple-600 focus:ring-1 focus:ring-purple-600 outline-none bg-slate-50/50"
                        />
                        <div className="absolute right-3 top-2.5">
                          <GoogleGLogo className="w-4 h-4 opacity-70" />
                        </div>
                      </div>
                    </div>

                    {/* Primary Google Action Button */}
                    <button
                      id="google-primary-signin-btn"
                      onClick={() => handlePerformSignIn()}
                      disabled={isAuthenticating}
                      className="w-full py-3.5 px-4 bg-white hover:bg-slate-50 text-slate-800 border-2 border-slate-200 hover:border-purple-300 rounded-2xl font-bold text-xs sm:text-sm shadow-xs transition-all flex items-center justify-center gap-3 active:scale-98 cursor-pointer group"
                    >
                      {isAuthenticating ? (
                        <div className="flex items-center gap-2 text-purple-700">
                          <RefreshCw className="w-4 h-4 animate-spin" />
                          <span>Connecting with Google...</span>
                        </div>
                      ) : (
                        <>
                          <GoogleGLogo className="w-5 h-5" />
                          <span>Sign In with Google Account</span>
                          <ArrowRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition-transform" />
                        </>
                      )}
                    </button>

                    <div className="flex items-center justify-between text-[11px] text-slate-500 px-1 pt-1">
                      <span className="flex items-center gap-1">
                        <Lock className="w-3.5 h-3.5 text-emerald-600" />
                        Encrypted OAuth 2.0 Token
                      </span>
                      <button
                        onClick={() => setShowConsentPreview(!showConsentPreview)}
                        className="text-purple-700 font-semibold hover:underline cursor-pointer"
                      >
                        {showConsentPreview ? 'Hide OAuth Details' : 'View Google Permissions'}
                      </button>
                    </div>

                    {showConsentPreview && (
                      <div className="p-3.5 bg-indigo-50/80 border border-indigo-100 rounded-2xl space-y-2 text-xs animate-in fade-in">
                        <div className="font-bold text-indigo-950 flex items-center gap-1.5 text-xs">
                          <ShieldCheck className="w-3.5 h-3.5 text-indigo-700" />
                          <span>Google Scopes Requested:</span>
                        </div>
                        <ul className="space-y-1 text-[11px] text-slate-600 pl-1">
                          <li className="flex items-center gap-1.5">
                            <CheckCircle2 className="w-3 h-3 text-emerald-600 shrink-0" />
                            <span><strong>calendar.events</strong> - Read free/busy slots and book family events</span>
                          </li>
                          <li className="flex items-center gap-1.5">
                            <CheckCircle2 className="w-3 h-3 text-emerald-600 shrink-0" />
                            <span><strong>userinfo.email</strong> - Verify family membership identity</span>
                          </li>
                        </ul>
                      </div>
                    )}
                  </div>
                ) : (
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      handlePerformSignIn();
                    }}
                    className="space-y-3.5"
                  >
                    <div>
                      <h2 className="text-base font-bold text-slate-900">
                        Sign In with Email
                      </h2>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Log in or create your Silah account using your email address.
                      </p>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-700">Full Name:</label>
                      <input
                        type="text"
                        value={authName}
                        onChange={(e) => setAuthName(e.target.value)}
                        placeholder="e.g., Ahmed Al-Mansoor"
                        required
                        className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-300 focus:border-purple-600 focus:ring-1 focus:ring-purple-600 outline-none"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-700">Email Address:</label>
                      <input
                        type="email"
                        value={authEmail}
                        onChange={(e) => setAuthEmail(e.target.value)}
                        placeholder="you@example.com"
                        required
                        className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-300 focus:border-purple-600 focus:ring-1 focus:ring-purple-600 outline-none"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <label className="text-xs font-bold text-slate-700">Password / Access Key:</label>
                        <span className="text-[10px] text-purple-700 font-semibold cursor-pointer">
                          Forgot passcode?
                        </span>
                      </div>
                      <input
                        type="password"
                        value={authPassword}
                        onChange={(e) => setAuthPassword(e.target.value)}
                        placeholder="••••••••"
                        required
                        className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-300 focus:border-purple-600 focus:ring-1 focus:ring-purple-600 outline-none"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={isAuthenticating}
                      className="w-full py-3 px-4 bg-purple-700 hover:bg-purple-800 text-white rounded-2xl font-bold text-xs sm:text-sm shadow-md transition-all flex items-center justify-center gap-2 active:scale-98 cursor-pointer"
                    >
                      {isAuthenticating ? (
                        <RefreshCw className="w-4 h-4 animate-spin" />
                      ) : (
                        <>
                          <Mail className="w-4 h-4" />
                          <span>Sign In / Register</span>
                          <ArrowRight className="w-4 h-4" />
                        </>
                      )}
                    </button>
                  </form>
                )}
              </div>

              {/* Right Column: Quick Demo Profile Picker (1-Click Evaluation) */}
              <div className="md:col-span-5 bg-slate-50/80 p-4 rounded-2xl border border-slate-200/80 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-600">
                    1-Click Test Personas:
                  </span>
                  <span className="text-[10px] bg-purple-100 text-purple-800 px-2 py-0.5 rounded-full font-bold">
                    Fast Demo
                  </span>
                </div>
                <p className="text-[11px] text-slate-500">
                  Select an account below to sign in instantly with Google or Email:
                </p>

                <div className="space-y-2">
                  {Object.entries(defaultEmailMap).map(([key, data]) => {
                    const isSelected = selectedPresetUser === key;
                    const roleColor =
                      data.role === 'Parent'
                        ? 'bg-indigo-100 text-indigo-800 border-indigo-200'
                        : data.role === 'Teenager'
                        ? 'bg-purple-100 text-purple-800 border-purple-200'
                        : 'bg-amber-100 text-amber-900 border-amber-200';

                    return (
                      <button
                        key={key}
                        onClick={() => {
                          setSelectedPresetUser(key);
                          handlePerformSignIn(key);
                        }}
                        className={`w-full p-2.5 rounded-xl border text-left flex items-center justify-between transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-white border-purple-400 shadow-xs ring-1 ring-purple-300'
                            : 'bg-white/70 hover:bg-white border-slate-200 hover:border-purple-200'
                        }`}
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-purple-600 to-indigo-700 text-white font-bold text-xs flex items-center justify-center shrink-0">
                            {data.name.slice(0, 1)}
                          </div>
                          <div className="min-w-0">
                            <div className="text-xs font-bold text-slate-800 truncate">
                              {data.name}
                            </div>
                            <div className="text-[10px] text-slate-400 truncate">{data.email}</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-1.5 shrink-0">
                          <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded border ${roleColor}`}>
                            {data.role}
                          </span>
                          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* STEP 2: FAMILY HUB CHOICE (MAKE A FAMILY HUB vs JOIN A FAMILY) */}
        {step === 'hub_choice' && (
          <div className="p-6 sm:p-8 space-y-6 animate-in fade-in">
            {/* Authenticated user pill */}
            <div className="flex items-center justify-between bg-purple-50 border border-purple-200/80 px-4 py-2.5 rounded-2xl">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-purple-700 text-white font-bold text-xs flex items-center justify-center">
                  {authName.slice(0, 2).toUpperCase()}
                </div>
                <div>
                  <div className="text-xs font-bold text-purple-950 flex items-center gap-1.5">
                    <span>Signed in as: {authName}</span>
                    <span className="text-[9px] bg-purple-200 text-purple-800 font-bold px-1.5 py-0.2 rounded">
                      {creatorRole}
                    </span>
                  </div>
                  <div className="text-[10px] text-purple-700 font-mono">{authEmail}</div>
                </div>
              </div>
              <button
                onClick={() => setStep('sign_in')}
                className="text-[11px] text-slate-500 hover:text-purple-700 font-semibold cursor-pointer"
              >
                Change Account
              </button>
            </div>

            <div className="text-center max-w-lg mx-auto space-y-1 pt-2">
              <h2 className="text-xl font-extrabold text-slate-900">
                Choose How to Set Up Your Family
              </h2>
              <p className="text-xs text-slate-500">
                Would you like to make a new Family Hub group or join an existing family circle?
              </p>
            </div>

            {/* Two Main Cards: Make vs Join */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              {/* Card 1: Make a Family Hub (Parent flow) */}
              <div
                onClick={() => setStep('create_hub')}
                className="p-6 bg-gradient-to-br from-white to-purple-50/40 rounded-3xl border-2 border-purple-200 hover:border-purple-600 shadow-sm hover:shadow-md transition-all cursor-pointer flex flex-col justify-between space-y-4 group"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="w-12 h-12 rounded-2xl bg-purple-700 text-white flex items-center justify-center shadow-md shadow-purple-600/20 group-hover:scale-105 transition-transform">
                      <Users className="w-6 h-6" />
                    </div>
                    <span className="text-[10px] font-extrabold px-2 py-0.5 bg-indigo-100 text-indigo-800 rounded-full border border-indigo-200">
                      Recommended for Parents
                    </span>
                  </div>

                  <div>
                    <h3 className="text-base font-bold text-slate-900 group-hover:text-purple-700 transition-colors">
                      Make a Family Hub
                    </h3>
                    <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                      Start your family circle. Add all family members (parents, teens, and kids), connect Google Calendars, and get an invite code for your family.
                    </p>
                  </div>

                  <ul className="space-y-1.5 text-[11px] text-slate-500">
                    <li className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-purple-600 shrink-0" />
                      <span>Add each family member and customize roles</span>
                    </li>
                    <li className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-purple-600 shrink-0" />
                      <span>Generates private family invite code (e.g. SILAH-7842)</span>
                    </li>
                    <li className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-purple-600 shrink-0" />
                      <span>Parental de-escalation protocols and harmony scoring</span>
                    </li>
                  </ul>
                </div>

                <button className="w-full py-2.5 px-4 bg-purple-700 group-hover:bg-purple-800 text-white font-bold text-xs rounded-xl shadow-xs flex items-center justify-center gap-2 transition-all">
                  <span>Create Family Hub</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>

              {/* Card 2: Join an Existing Family Hub (Kid / Teen / Member flow) */}
              <div
                onClick={() => setStep('join_hub')}
                className="p-6 bg-gradient-to-br from-white to-amber-50/30 rounded-3xl border-2 border-slate-200 hover:border-amber-500 shadow-sm hover:shadow-md transition-all cursor-pointer flex flex-col justify-between space-y-4 group"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="w-12 h-12 rounded-2xl bg-amber-500 text-white flex items-center justify-center shadow-md shadow-amber-500/20 group-hover:scale-105 transition-transform">
                      <KeyRound className="w-6 h-6" />
                    </div>
                    <span className="text-[10px] font-extrabold px-2 py-0.5 bg-amber-100 text-amber-900 rounded-full border border-amber-200">
                      For Kids, Teens & Relatives
                    </span>
                  </div>

                  <div>
                    <h3 className="text-base font-bold text-slate-900 group-hover:text-amber-700 transition-colors">
                      Join an Existing Family
                    </h3>
                    <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                      Have a family code from your parent or spouse? Enter the code to join your family’s shared calendar, mood tracking, and empathetic AI confidant.
                    </p>
                  </div>

                  <ul className="space-y-1.5 text-[11px] text-slate-500">
                    <li className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                      <span>Enter your family invite code</span>
                    </li>
                    <li className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                      <span>Select your name or profile slot in the family</span>
                    </li>
                    <li className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                      <span>Kid AI Safe Haven and vent shield</span>
                    </li>
                  </ul>
                </div>

                <button className="w-full py-2.5 px-4 bg-amber-500 group-hover:bg-amber-600 text-white font-bold text-xs rounded-xl shadow-xs flex items-center justify-center gap-2 transition-all">
                  <span>Join with Invite Code</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* STEP 3A: MAKE A FAMILY HUB (PARENT GROUP CREATION & ADDING MEMBERS) */}
        {step === 'create_hub' && (
          <div className="p-6 sm:p-8 space-y-6 animate-in fade-in">
            {/* Header with back link */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <button
                onClick={() => setStep('hub_choice')}
                className="flex items-center gap-1.5 text-xs text-purple-700 hover:text-purple-900 font-bold cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back to choices</span>
              </button>
              <div className="text-xs text-slate-400">Step 2 of 2: Family Setup</div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
              {/* Left Column: Family Info & Members */}
              <div className="md:col-span-7 space-y-5">
                <div className="space-y-3">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-800">Family Hub Name:</label>
                    <input
                      type="text"
                      value={hubName}
                      onChange={(e) => setHubName(e.target.value)}
                      placeholder="e.g. Al-Mansoor Family, The Smith Household"
                      className="w-full px-3.5 py-2.5 text-xs sm:text-sm font-semibold rounded-xl border border-slate-300 focus:border-purple-600 focus:ring-1 focus:ring-purple-600 outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-800">Your Role in this Family:</label>
                    <div className="grid grid-cols-3 gap-2">
                      {(['Parent', 'Teenager', 'Child'] as FamilyRole[]).map((r) => (
                        <button
                          key={r}
                          type="button"
                          onClick={() => setCreatorRole(r)}
                          className={`py-2 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                            creatorRole === r
                              ? 'bg-purple-700 text-white shadow-xs'
                              : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                          }`}
                        >
                          {r}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Adding Members Section */}
                <div className="space-y-3 pt-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
                        <Users className="w-4 h-4 text-purple-700" />
                        <span>Family Members ({hubMembers.length}):</span>
                      </h3>
                      <p className="text-[11px] text-slate-500">
                        Add your spouse, children, or relatives to this hub.
                      </p>
                    </div>
                    <button
                      onClick={() => setShowAddMemberForm(!showAddMemberForm)}
                      className="flex items-center gap-1 text-xs font-bold px-3 py-1.5 rounded-xl bg-purple-100 text-purple-900 hover:bg-purple-200 transition-colors cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>{showAddMemberForm ? 'Close Form' : 'Add Member'}</span>
                    </button>
                  </div>

                  {/* Add Member Form */}
                  {showAddMemberForm && (
                    <form
                      onSubmit={handleAddCustomMember}
                      className="p-3.5 bg-purple-50/70 border border-purple-200 rounded-2xl space-y-2.5 animate-in fade-in"
                    >
                      <div className="font-bold text-xs text-purple-950 flex items-center gap-1">
                        <UserPlus className="w-3.5 h-3.5 text-purple-700" />
                        <span>Add a Family Member to Hub</span>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        <input
                          type="text"
                          value={newMemberName}
                          onChange={(e) => setNewMemberName(e.target.value)}
                          placeholder="Member Name (e.g. Sarah)"
                          required
                          className="px-3 py-2 text-xs rounded-xl border border-purple-200 bg-white outline-none focus:border-purple-600"
                        />
                        <select
                          value={newMemberRole}
                          onChange={(e) => setNewMemberRole(e.target.value as FamilyRole)}
                          className="px-3 py-2 text-xs rounded-xl border border-purple-200 bg-white outline-none focus:border-purple-600"
                        >
                          <option value="Parent">Parent (Mother / Father)</option>
                          <option value="Teenager">Teenager (13-18 yrs)</option>
                          <option value="Child">Child (6-12 yrs)</option>
                          <option value="Other family member">Other family member</option>
                        </select>
                      </div>
                      <input
                        type="email"
                        value={newMemberEmail}
                        onChange={(e) => setNewMemberEmail(e.target.value)}
                        placeholder="Google Account Email (optional, for calendar)"
                        className="w-full px-3 py-2 text-xs rounded-xl border border-purple-200 bg-white outline-none focus:border-purple-600"
                      />
                      <div className="flex justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => setShowAddMemberForm(false)}
                          className="px-3 py-1.5 text-xs text-slate-500 hover:text-slate-700 font-semibold cursor-pointer"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="px-4 py-1.5 text-xs font-bold rounded-xl bg-purple-700 hover:bg-purple-800 text-white shadow-xs cursor-pointer"
                        >
                          Save Member
                        </button>
                      </div>
                    </form>
                  )}

                  {/* Member List */}
                  <div className="space-y-2">
                    {hubMembers.map((m) => (
                      <div
                        key={m.id}
                        className="p-3 bg-white rounded-2xl border border-slate-200 flex items-center justify-between gap-2 shadow-2xs"
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <div
                            className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold text-xs ${m.avatarColor} shrink-0`}
                          >
                            {m.initials}
                          </div>
                          <div className="min-w-0">
                            <div className="text-xs font-bold text-slate-900 truncate flex items-center gap-1.5">
                              <span>{m.name}</span>
                              <span
                                className={`text-[9px] px-1.5 py-0.2 rounded font-semibold ${
                                  m.role === 'Parent'
                                    ? 'bg-indigo-100 text-indigo-800'
                                    : m.role === 'Teenager'
                                    ? 'bg-purple-100 text-purple-800'
                                    : 'bg-amber-100 text-amber-900'
                                }`}
                              >
                                {m.role}
                              </span>
                            </div>
                            <div className="text-[10px] text-slate-400 truncate">
                              {m.calendar?.accountEmail || 'No email attached'}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleRemoveMember(m.id)}
                            className="p-1 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                            title="Remove member"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* 1-Click Preset Members */}
                  <div className="pt-1">
                    <div className="text-[11px] font-bold text-slate-500 mb-1.5">
                      Quick Add Suggestions:
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      <button
                        type="button"
                        onClick={() =>
                          handleQuickAddMember('Mona (Mother)', 'Parent', 'mona.almansoor@gmail.com', 'bg-rose-500 text-white')
                        }
                        className="text-[11px] px-2.5 py-1 rounded-xl bg-slate-100 hover:bg-purple-100 hover:text-purple-900 text-slate-700 font-semibold transition-colors cursor-pointer flex items-center gap-1"
                      >
                        <Plus className="w-3 h-3 text-purple-700" />
                        <span>+ Mother (Mona)</span>
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          handleQuickAddMember('Sarah (Teenager)', 'Teenager', 'sarah.teen@gmail.com', 'bg-violet-600 text-white')
                        }
                        className="text-[11px] px-2.5 py-1 rounded-xl bg-slate-100 hover:bg-purple-100 hover:text-purple-900 text-slate-700 font-semibold transition-colors cursor-pointer flex items-center gap-1"
                      >
                        <Plus className="w-3 h-3 text-purple-700" />
                        <span>+ Teenager (Sarah)</span>
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          handleQuickAddMember('Omar (Child)', 'Child', 'omar.school@gmail.com', 'bg-amber-500 text-white')
                        }
                        className="text-[11px] px-2.5 py-1 rounded-xl bg-slate-100 hover:bg-purple-100 hover:text-purple-900 text-slate-700 font-semibold transition-colors cursor-pointer flex items-center gap-1"
                      >
                        <Plus className="w-3 h-3 text-purple-700" />
                        <span>+ Child (Omar)</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column: Family Hub Code & Enter App */}
              <div className="md:col-span-5 space-y-4">
                {/* Invite Code Box */}
                <div className="p-5 bg-gradient-to-br from-purple-50 to-indigo-50/80 rounded-3xl border border-purple-200 space-y-3">
                  <div className="flex items-center gap-2 text-purple-950 font-bold text-xs">
                    <KeyRound className="w-4 h-4 text-purple-700" />
                    <span>Your Family Hub Invite Code:</span>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-white rounded-2xl border border-purple-200">
                    <span className="font-mono text-base font-extrabold text-purple-900 tracking-wider">
                      {inviteCode}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleCopyCode(inviteCode)}
                      className="px-2.5 py-1 bg-purple-100 hover:bg-purple-200 text-purple-900 text-xs font-bold rounded-xl flex items-center gap-1 transition-colors cursor-pointer"
                    >
                      {copiedCode ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Copy</span>
                        </>
                      )}
                    </button>
                  </div>

                  <p className="text-[11px] text-slate-600 leading-normal">
                    Share this code with your children or spouse. When they sign in, they can simply choose <strong>"Join an Existing Family"</strong> and enter this code!
                  </p>
                </div>

                {/* Final Launch CTA */}
                <div className="space-y-2 pt-2">
                  <button
                    id="finish-create-hub-btn"
                    onClick={handleFinishCreateHub}
                    className="w-full py-4 px-5 bg-gradient-to-r from-purple-700 to-indigo-700 hover:from-purple-800 hover:to-indigo-800 text-white rounded-2xl font-extrabold text-sm shadow-md transition-all flex items-center justify-center gap-2 active:scale-98 cursor-pointer"
                  >
                    <span>Launch Family Hub & Open Home</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                  <p className="text-[10px] text-center text-slate-400">
                    You can add more members or update calendar settings anytime from the Admin menu.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* STEP 3B: JOIN AN EXISTING FAMILY HUB (KID / TEEN / INVITED MEMBER FLOW) */}
        {step === 'join_hub' && (
          <div className="p-6 sm:p-8 space-y-6 animate-in fade-in">
            {/* Header with back link */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <button
                onClick={() => setStep('hub_choice')}
                className="flex items-center gap-1.5 text-xs text-purple-700 hover:text-purple-900 font-bold cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back to choices</span>
              </button>
              <div className="text-xs text-slate-400">Step 2 of 2: Join Family</div>
            </div>

            <div className="max-w-xl mx-auto space-y-5">
              <div className="text-center space-y-1">
                <div className="w-12 h-12 rounded-2xl bg-amber-500 text-white flex items-center justify-center mx-auto shadow-md shadow-amber-500/20">
                  <KeyRound className="w-6 h-6" />
                </div>
                <h2 className="text-lg font-bold text-slate-900">
                  Enter Your Family's Invite Code
                </h2>
                <p className="text-xs text-slate-500">
                  Ask your parent or the family organizer for the 6-character code (e.g. SILAH-7842).
                </p>
              </div>

              {/* Code Input */}
              <div className="space-y-2">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={inputInviteCode}
                    onChange={(e) => {
                      setInputInviteCode(e.target.value.toUpperCase());
                      if (e.target.value.trim().length >= 4) {
                        setIsCodeVerified(true);
                      }
                    }}
                    placeholder="e.g. SILAH-7842"
                    className="flex-1 px-4 py-3 text-center text-base font-mono font-bold tracking-widest uppercase rounded-2xl border-2 border-slate-300 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 outline-none"
                  />
                  <button
                    onClick={() => {
                      setInputInviteCode('SILAH-7842');
                      setIsCodeVerified(true);
                    }}
                    className="px-3.5 py-2 bg-amber-100 hover:bg-amber-200 text-amber-900 text-xs font-bold rounded-2xl transition-colors cursor-pointer shrink-0"
                  >
                    Use Demo Code
                  </button>
                </div>
              </div>

              {/* Verified Family Hub Card Preview */}
              {(isCodeVerified || inputInviteCode.length >= 4) && (
                <div className="p-5 bg-gradient-to-br from-amber-50/70 to-purple-50/70 rounded-3xl border-2 border-amber-200 space-y-4 animate-in fade-in">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-[10px] font-bold uppercase tracking-wider text-amber-800">
                        Family Hub Found:
                      </div>
                      <h3 className="text-base font-black text-slate-900">
                        {hubName || 'Al-Mansoor Family Hub'}
                      </h3>
                      <p className="text-[11px] text-slate-500">
                        Organizer: Ahmed (Parent) • 4 synced members
                      </p>
                    </div>
                    <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
                      <CheckCircle2 className="w-5 h-5" />
                    </div>
                  </div>

                  {/* Choose who you are in this family */}
                  <div className="space-y-2 pt-1 border-t border-amber-200/60">
                    <label className="text-xs font-bold text-slate-800">
                      Who are you in this family?
                    </label>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {hubMembers.map((m) => (
                        <div
                          key={m.id}
                          onClick={() => {
                            setSelectedJoinMemberId(m.id);
                            setCustomJoinName('');
                          }}
                          className={`p-2.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-2 ${
                            selectedJoinMemberId === m.id && !customJoinName
                              ? 'bg-amber-100/80 border-amber-500 shadow-2xs font-bold'
                              : 'bg-white border-slate-200 hover:border-amber-300'
                          }`}
                        >
                          <div className="flex items-center gap-2 min-w-0">
                            <div
                              className={`w-6 h-6 rounded-lg flex items-center justify-center text-[10px] font-bold ${m.avatarColor}`}
                            >
                              {m.initials}
                            </div>
                            <div className="text-xs truncate">{m.name}</div>
                          </div>
                          <span className="text-[9px] px-1.5 py-0.2 rounded bg-white text-slate-600 font-semibold shrink-0">
                            {m.role}
                          </span>
                        </div>
                      ))}
                    </div>

                    {/* Or join as custom name */}
                    <div className="pt-2">
                      <div className="text-[11px] text-slate-500 font-semibold mb-1">
                        Or join with a new member profile:
                      </div>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={customJoinName}
                          onChange={(e) => {
                            setCustomJoinName(e.target.value);
                            setSelectedJoinMemberId('');
                          }}
                          placeholder="Your Name (e.g. Layla)"
                          className="flex-1 px-3 py-2 text-xs rounded-xl border border-slate-300 focus:border-amber-500 outline-none bg-white"
                        />
                        <select
                          value={customJoinRole}
                          onChange={(e) => setCustomJoinRole(e.target.value as FamilyRole)}
                          className="px-3 py-2 text-xs rounded-xl border border-slate-300 focus:border-amber-500 outline-none bg-white"
                        >
                          <option value="Teenager">Teenager</option>
                          <option value="Child">Child</option>
                          <option value="Parent">Parent</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Join Action CTA */}
                  <button
                    id="finish-join-hub-btn"
                    onClick={handleFinishJoinHub}
                    className="w-full py-3.5 px-4 bg-amber-500 hover:bg-amber-600 text-white font-extrabold text-xs sm:text-sm rounded-2xl shadow-md transition-all flex items-center justify-center gap-2 active:scale-98 cursor-pointer"
                  >
                    <span>Join Family & Open Home Page</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Bottom Security Footer */}
        <div className="bg-slate-50 px-6 py-3 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-slate-500">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Google Workspace, Calendar API & Android ML Kit Certified</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-slate-400">© 2026 Silah Project</span>
            <span className="text-purple-700 font-semibold">Privacy First Design</span>
          </div>
        </div>
      </div>
    </div>
  );
};

// Official Google Multi-Color G Icon
export const GoogleGLogo: React.FC<{ className?: string }> = ({ className = 'w-5 h-5' }) => (
  <svg className={className} viewBox="0 0 24 24">
    <path
      fill="#4285F4"
      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
    />
    <path
      fill="#34A853"
      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
    />
    <path
      fill="#FBBC05"
      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
    />
    <path
      fill="#EA4335"
      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
    />
  </svg>
);
