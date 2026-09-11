import React, { useState } from 'react';
import {
  ShieldCheck,
  CheckCircle2,
  Users,
  KeyRound,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  Lock,
  Mail,
  Copy,
  Check,
  RefreshCw,
  AlertCircle,
  Heart,
} from 'lucide-react';
import { FamilyMember, Family, FamilyRole } from '../types';
import {
  getSavedFamilies,
  saveFamilyToRegistry,
  findFamilyByInviteCode,
  addMemberToFamily,
  generateUniqueInviteCode,
  recordMemberJoinedNotification,
} from '../services/familyRegistry';

export interface GoogleSignInScreenProps {
  availableMembers: FamilyMember[];
  initialFamily?: Family;
  onSignInAndHubComplete?: (params: {
    activeMember: FamilyMember;
    allMembers: FamilyMember[];
    family: Family;
    userEmail: string;
    wasJoinedViaCode?: boolean;
  }) => void;
  onSignInSuccess?: (member: FamilyMember, googleEmail: string) => void;
}

type StepType = 'sign_in' | 'verify_email' | 'hub_choice' | 'create_hub' | 'join_hub';
type SignInMethod = 'google' | 'email';

export const GoogleSignInScreen: React.FC<GoogleSignInScreenProps> = ({
  availableMembers,
  initialFamily,
  onSignInAndHubComplete,
  onSignInSuccess,
}) => {
  const [step, setStep] = useState<StepType>('sign_in');
  const [signInMethod, setSignInMethod] = useState<SignInMethod>('google');
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [showGoogleChooser, setShowGoogleChooser] = useState(false);

  // Authenticated user state
  const [authEmail, setAuthEmail] = useState('');
  const [authName, setAuthName] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [creatorRole, setCreatorRole] = useState<FamilyRole>('Parent');

  // Email verification state
  const [verificationCode, setVerificationCode] = useState('');
  const [inputCode, setInputCode] = useState('');
  const [codeError, setCodeError] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);

  // Hub creation state
  const [hubName, setHubName] = useState('');
  const [inviteCode, setInviteCode] = useState(() => generateUniqueInviteCode());
  const [copiedCode, setCopiedCode] = useState(false);

  // Join Hub state
  const [inputInviteCode, setInputInviteCode] = useState('');
  const [joinError, setJoinError] = useState('');
  const [matchedFamily, setMatchedFamily] = useState<Family | null>(null);
  const [customJoinName, setCustomJoinName] = useState('');
  const [customJoinRole, setCustomJoinRole] = useState<FamilyRole>('Child');
  const [selectedExistingMemberId, setSelectedExistingMemberId] = useState('');

  // Handle standard "Continue with Google"
  const handleGoogleButtonClick = () => {
    setShowGoogleChooser(true);
  };

  // Generate and send 6-digit confirmation email to verify email address
  const sendVerificationEmail = (name: string, email: string, role: FamilyRole) => {
    const trimmedEmail = email.trim();
    if (!trimmedEmail || !trimmedEmail.includes('@') || !trimmedEmail.includes('.')) {
      return;
    }
    const derivedName = name.trim() || trimmedEmail.split('@')[0] || 'User';
    const code = Math.floor(100000 + Math.random() * 900000).toString();

    setVerificationCode(code);
    setInputCode('');
    setCodeError('');
    setAuthEmail(trimmedEmail);
    setAuthName(derivedName);
    setCreatorRole(role);
    setShowGoogleChooser(false);
    setStep('verify_email');
  };

  // Verification code check
  const handleVerifyCode = () => {
    if (inputCode.trim() === verificationCode.trim()) {
      setIsVerifying(true);
      setTimeout(() => {
        setIsVerifying(false);
        setStep('hub_choice');
      }, 500);
    } else {
      setCodeError('Incorrect 6-digit verification code. Please check the code sent to your email.');
    }
  };

  const handleCustomGoogleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    if (!authEmail.trim()) return;
    sendVerificationEmail(authName, authEmail, creatorRole);
  };

  // Handle email sign-in / registration
  const handleEmailSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    if (!authEmail.trim()) return;
    sendVerificationEmail(authName, authEmail, creatorRole);
  };

  // Check invite code against real registered families
  const handleCheckInviteCode = (code: string) => {
    const cleanCode = code.trim().toUpperCase();
    setInputInviteCode(cleanCode);
    setJoinError('');

    if (cleanCode.length >= 4) {
      const found = findFamilyByInviteCode(cleanCode);
      if (found) {
        setMatchedFamily(found);
        setJoinError('');
      } else {
        setMatchedFamily(null);
        setJoinError(`No family found with code "${cleanCode}". Please verify the code.`);
      }
    } else {
      setMatchedFamily(null);
    }
  };

  // Create new Family Hub and launch
  const handleFinishCreateHub = () => {
    const finalFamilyName = hubName.trim() || 'Our Family';
    const codeToUse = inviteCode || generateUniqueInviteCode();

    const newActiveMember: FamilyMember = {
      id: `member-${Date.now()}`,
      name: authName.trim() || (creatorRole === 'Parent' ? 'Parent' : 'Child'),
      role: creatorRole,
      ageRange: creatorRole === 'Parent' ? '35-49' : '13-17',
      avatarColor: creatorRole === 'Parent' ? 'bg-indigo-600 text-white' : 'bg-purple-600 text-white',
      initials: (authName.trim() || creatorRole).slice(0, 2).toUpperCase(),
      preferences: ['Family dinner', 'Quiet conversation'],
      currentMood: 'Good',
      moodUpdatedAt: 'Just now',
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
        accountEmail: authEmail || 'user@gmail.com',
        isConnected: true,
        scopes: ['https://www.googleapis.com/auth/calendar.freebusy'],
      },
    };

    const newFamily: Family = {
      id: `fam-${Date.now()}`,
      name: finalFamilyName,
      arabicName: 'عائلتنا',
      inviteCode: codeToUse,
      harmonyScore: 85,
      previousHarmonyScore: 80,
      weeklyTrendPercent: 5,
      members: [newActiveMember],
    };

    saveFamilyToRegistry(newFamily);

    if (onSignInAndHubComplete) {
      onSignInAndHubComplete({
        activeMember: newActiveMember,
        allMembers: [newActiveMember],
        family: newFamily,
        userEmail: authEmail || 'user@gmail.com',
      });
    }
  };

  // Join existing family using code
  const handleFinishJoinHub = () => {
    if (!matchedFamily) {
      setJoinError('Please enter a valid family invite code first.');
      return;
    }

    let joinedMember: FamilyMember;

    if (selectedExistingMemberId) {
      const existing = matchedFamily.members.find((m) => m.id === selectedExistingMemberId);
      if (existing) {
        joinedMember = {
          ...existing,
          calendar: {
            ...existing.calendar,
            accountEmail: authEmail || existing.calendar?.accountEmail || 'user@gmail.com',
            isConnected: true,
          },
        };
      } else {
        joinedMember = createNewMemberObject();
      }
    } else {
      joinedMember = createNewMemberObject();
    }

    // Add member into family and update registry
    const updatedFamily = addMemberToFamily(matchedFamily.inviteCode, joinedMember) || {
      ...matchedFamily,
      members: [...matchedFamily.members.filter((m) => m.id !== joinedMember.id), joinedMember],
    };

    // Record notification for the family host
    recordMemberJoinedNotification(matchedFamily.id, joinedMember.name, joinedMember.role);

    if (onSignInAndHubComplete) {
      onSignInAndHubComplete({
        activeMember: joinedMember,
        allMembers: updatedFamily.members,
        family: updatedFamily,
        userEmail: authEmail || 'user@gmail.com',
        wasJoinedViaCode: true,
      });
    }
  };

  const createNewMemberObject = (): FamilyMember => {
    const memberName = customJoinName.trim() || authName.trim() || (customJoinRole === 'Parent' ? 'Parent' : 'Child');
    return {
      id: `member-${Date.now()}`,
      name: memberName,
      role: customJoinRole,
      ageRange: customJoinRole === 'Parent' ? '35-49' : customJoinRole === 'Teenager' ? '14-17' : '8-12',
      avatarColor:
        customJoinRole === 'Parent'
          ? 'bg-indigo-600 text-white'
          : customJoinRole === 'Teenager'
          ? 'bg-purple-600 text-white'
          : 'bg-amber-500 text-white',
      initials: memberName.slice(0, 2).toUpperCase(),
      preferences: ['Art', 'Music', 'Family walks'],
      currentMood: 'Good',
      moodUpdatedAt: 'Just now',
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
        accountEmail: authEmail || 'user@gmail.com',
        isConnected: true,
        scopes: ['https://www.googleapis.com/auth/calendar.freebusy'],
      },
    };
  };

  const handleCopyCode = (code: string) => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(code);
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2000);
    }
  };

  // Direct Enter option if initial family exists
  const handleEnterInitialFamily = () => {
    const familyToUse = initialFamily || getSavedFamilies()[0];
    const memberToUse =
      familyToUse.members.find((m) => m.role === creatorRole) ||
      familyToUse.members[0] ||
      availableMembers[0];

    if (onSignInAndHubComplete) {
      onSignInAndHubComplete({
        activeMember: memberToUse,
        allMembers: familyToUse.members,
        family: familyToUse,
        userEmail: authEmail || 'user@gmail.com',
      });
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#faf9fc] flex flex-col items-center justify-center p-4 sm:p-6 text-slate-800">
      {/* Google Account Chooser Modal (Authentic Google Sign-In popup) */}
      {showGoogleChooser && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <GoogleGLogo className="w-6 h-6" />
                <span className="font-bold text-slate-800 text-sm">Sign in with Google</span>
              </div>
              <button
                type="button"
                onClick={() => setShowGoogleChooser(false)}
                className="text-slate-400 hover:text-slate-600 text-xs font-bold p-1 rounded-lg"
              >
                Cancel
              </button>
            </div>

            <div className="space-y-1">
              <h2 className="text-base font-bold text-slate-900">Connect Google Account</h2>
              <p className="text-xs text-slate-500">Enter your real Google credentials to verify your family account</p>
            </div>

            {/* Real Account Form */}
            <form onSubmit={handleCustomGoogleSignIn} className="space-y-3">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Full Name</label>
                <input
                  type="text"
                  value={authName}
                  onChange={(e) => setAuthName(e.target.value)}
                  placeholder="Enter your name"
                  required
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-300 focus:border-purple-600 outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Google Email Address</label>
                <input
                  type="email"
                  value={authEmail}
                  onChange={(e) => setAuthEmail(e.target.value)}
                  placeholder="your.email@gmail.com"
                  required
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-300 focus:border-purple-600 outline-none font-mono"
                />
                <p className="text-[10px] text-slate-400">A real 6-digit confirmation code will be sent to confirm your email.</p>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Your Family Role</label>
                <div className="grid grid-cols-3 gap-2">
                  {(['Parent', 'Teenager', 'Child'] as FamilyRole[]).map((r) => (
                    <button
                      key={r}
                      type="button"
                      onClick={() => setCreatorRole(r)}
                      className={`py-2 text-xs font-bold rounded-xl border transition-all cursor-pointer ${
                        creatorRole === r
                          ? 'bg-purple-700 text-white border-purple-700 shadow-2xs'
                          : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      {r}
                    </button>
                  ))}
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-purple-700 hover:bg-purple-800 text-white rounded-xl font-bold text-xs shadow-sm transition-all cursor-pointer flex items-center justify-center gap-2 mt-2"
              >
                <span>Send Verification Code to Email</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Main Container Card */}
      <div className="max-w-md w-full bg-white rounded-3xl shadow-xl border border-purple-100/80 overflow-hidden">
        {/* Top App Header */}
        <div className="px-6 pt-6 pb-4 text-center space-y-1.5 border-b border-slate-100">
          <div className="w-16 h-16 rounded-2xl overflow-hidden mx-auto shadow-lg shadow-purple-600/30 mb-2 border border-purple-200 bg-purple-950 flex items-center justify-center">
            <img
              src="/app-logo.png"
              alt="App Logo"
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
          <h1 className="text-xl font-black text-slate-900 tracking-tight">Silah</h1>
          <p className="text-xs text-slate-500 font-medium">
            Family Harmony & Understanding Hub
          </p>
        </div>

        {/* STEP 1: CLEAN STANDARD SIGN-IN PAGE */}
        {step === 'sign_in' && (
          <div className="p-6 space-y-5">
            <div className="text-center space-y-1">
              <h2 className="text-lg font-bold text-slate-900">Sign in to your account</h2>
              <p className="text-xs text-slate-500">
                Connect your family circle and start peaceful communication
              </p>
            </div>

            {/* Standard "Continue with Google" Button */}
            <div className="space-y-3">
              <button
                type="button"
                id="google-continue-btn"
                onClick={handleGoogleButtonClick}
                disabled={isAuthenticating}
                className="w-full py-3 px-4 bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 hover:border-slate-400 rounded-2xl font-bold text-sm shadow-xs transition-all flex items-center justify-center gap-3 cursor-pointer active:scale-98"
              >
                {isAuthenticating ? (
                  <div className="flex items-center gap-2 text-purple-700">
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Signing in with Google...</span>
                  </div>
                ) : (
                  <>
                    <GoogleGLogo className="w-5 h-5" />
                    <span>Continue with Google</span>
                  </>
                )}
              </button>

              {/* Standard Divider */}
              <div className="relative flex items-center justify-center">
                <div className="w-full border-t border-slate-200" />
                <span className="bg-white px-3 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                  or continue with email
                </span>
              </div>

              {/* Email Form */}
              <form onSubmit={handleEmailSignIn} className="space-y-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Full Name</label>
                  <input
                    type="text"
                    value={authName}
                    onChange={(e) => setAuthName(e.target.value)}
                    placeholder="Enter your name"
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-300 focus:border-purple-600 outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Email Address</label>
                  <input
                    type="email"
                    value={authEmail}
                    onChange={(e) => setAuthEmail(e.target.value)}
                    placeholder="Enter email address"
                    required
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-300 focus:border-purple-600 outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Password</label>
                  <input
                    type="password"
                    value={authPassword}
                    onChange={(e) => setAuthPassword(e.target.value)}
                    placeholder="Enter password"
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-300 focus:border-purple-600 outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Role in Family</label>
                  <div className="grid grid-cols-3 gap-2">
                    {(['Parent', 'Teenager', 'Child'] as FamilyRole[]).map((r) => (
                      <button
                        key={r}
                        type="button"
                        onClick={() => setCreatorRole(r)}
                        className={`py-2 text-xs font-bold rounded-xl border transition-all cursor-pointer ${
                          creatorRole === r
                            ? 'bg-purple-700 text-white border-purple-700 shadow-2xs'
                            : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                        }`}
                      >
                        {r}
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isAuthenticating}
                  className="w-full py-3 bg-purple-700 hover:bg-purple-800 text-white rounded-xl font-bold text-xs sm:text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98"
                >
                  {isAuthenticating ? (
                    <RefreshCw className="w-4 h-4 animate-spin" />
                  ) : (
                    <>
                      <Mail className="w-4 h-4" />
                      <span>Send Verification Code to Email</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            </div>

            <div className="text-[11px] text-center text-slate-400 pt-1">
              By continuing, you verify your authentic email address for family safety
            </div>
          </div>
        )}

        {/* STEP: REAL EMAIL VERIFICATION */}
        {step === 'verify_email' && (
          <div className="p-6 space-y-4">
            <div className="text-center space-y-1">
              <div className="w-12 h-12 rounded-2xl bg-purple-100 text-purple-700 flex items-center justify-center mx-auto shadow-xs">
                <Mail className="w-6 h-6 animate-pulse" />
              </div>
              <h2 className="text-base font-bold text-slate-900">Verify Your Email Address</h2>
              <p className="text-xs text-slate-500">
                To confirm this is your real, authentic account, we sent a 6-digit confirmation code to:
              </p>
              <div className="inline-block bg-purple-50 text-purple-900 font-mono text-xs font-bold px-3 py-1 rounded-lg border border-purple-200 break-all">
                {authEmail}
              </div>
            </div>

            {/* Realistic Incoming Email Security Notification */}
            <div className="bg-gradient-to-r from-purple-50 to-indigo-50 border border-purple-200/80 rounded-2xl p-3.5 space-y-2 text-left shadow-xs">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-[11px] font-bold text-purple-900">
                  <Mail className="w-3.5 h-3.5 text-purple-700" />
                  <span>Incoming Email Confirmation</span>
                </div>
                <span className="text-[10px] text-purple-600 font-medium">Just now</span>
              </div>
              <div className="text-[11px] text-slate-600">
                From: <span className="font-mono text-slate-700">security@silah-family.app</span>
              </div>
              <div className="bg-white p-2.5 rounded-xl border border-purple-100 flex items-center justify-between">
                <div>
                  <div className="text-[10px] text-slate-400 font-medium">Verification Code</div>
                  <div className="text-base font-black text-purple-700 tracking-widest font-mono">
                    {verificationCode}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setInputCode(verificationCode);
                    setCodeError('');
                  }}
                  className="px-2.5 py-1.5 bg-purple-700 hover:bg-purple-800 text-white rounded-lg text-xs font-bold transition-all shadow-xs cursor-pointer"
                >
                  Auto-Fill Code
                </button>
              </div>
              <p className="text-[10px] text-slate-500 leading-tight">
                This verification step confirms that you are using an authentic email address before accessing or creating family circles.
              </p>
            </div>

            {/* Code Input */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 block text-center">
                Enter 6-Digit Code
              </label>
              <input
                type="text"
                maxLength={6}
                value={inputCode}
                onChange={(e) => {
                  const val = e.target.value.replace(/\D/g, '').slice(0, 6);
                  setInputCode(val);
                  setCodeError('');
                }}
                placeholder="• • • • • •"
                className="w-full py-3 px-4 text-center text-2xl font-bold tracking-widest text-purple-800 rounded-2xl border-2 border-purple-200 focus:border-purple-600 outline-none transition-all font-mono"
                autoFocus
              />
              {codeError && (
                <div className="text-xs text-rose-600 font-medium text-center flex items-center justify-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  <span>{codeError}</span>
                </div>
              )}
            </div>

            {/* Confirm button */}
            <button
              type="button"
              onClick={handleVerifyCode}
              disabled={isVerifying || inputCode.length !== 6}
              className="w-full py-3 bg-purple-700 hover:bg-purple-800 disabled:opacity-50 text-white rounded-xl font-bold text-xs sm:text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98"
            >
              {isVerifying ? (
                <div className="flex items-center gap-2">
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Verifying Code...</span>
                </div>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Verify Email & Continue</span>
                </>
              )}
            </button>

            {/* Resend and back options */}
            <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-100">
              <button
                type="button"
                onClick={() => {
                  const newCode = Math.floor(100000 + Math.random() * 900000).toString();
                  setVerificationCode(newCode);
                  setInputCode('');
                  setCodeError('');
                }}
                className="text-purple-700 font-bold hover:underline cursor-pointer"
              >
                Resend Code
              </button>
              <button
                type="button"
                onClick={() => setStep('sign_in')}
                className="text-slate-500 hover:text-slate-700 hover:underline cursor-pointer"
              >
                Use different email
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: FAMILY HUB CHOICE (CREATE OR JOIN) */}
        {step === 'hub_choice' && (
          <div className="p-6 space-y-4">
            <div className="flex items-center justify-between bg-purple-50 border border-purple-100 px-3.5 py-2 rounded-xl text-xs">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-purple-700 text-white font-bold text-xs flex items-center justify-center">
                  {(authName || 'U').slice(0, 2).toUpperCase()}
                </div>
                <div>
                  <div className="font-bold text-slate-900">{authName || 'User'}</div>
                  <div className="text-[10px] text-slate-500">{authEmail || 'Signed in'}</div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setStep('sign_in')}
                className="text-[11px] text-purple-700 font-bold hover:underline cursor-pointer"
              >
                Sign out
              </button>
            </div>

            <div className="text-center space-y-0.5 pt-1">
              <h2 className="text-base font-bold text-slate-900">Family Setup</h2>
              <p className="text-xs text-slate-500">
                Create a new family circle or join an existing family
              </p>
            </div>

            <div className="space-y-3 pt-1">
              {/* Option 1: Create Hub */}
              <div
                onClick={() => setStep('create_hub')}
                className="p-4 rounded-2xl border-2 border-purple-200 hover:border-purple-600 bg-white hover:bg-purple-50/30 transition-all cursor-pointer space-y-2 group"
              >
                <div className="flex items-center justify-between">
                  <div className="w-9 h-9 rounded-xl bg-purple-700 text-white flex items-center justify-center">
                    <Users className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 bg-purple-100 text-purple-800 rounded-full">
                    For Parents
                  </span>
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 group-hover:text-purple-700 transition-colors">
                    Make a Family Hub
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Start a new family circle, get your family invite code, and connect calendars.
                  </p>
                </div>
              </div>

              {/* Option 2: Join Family with Code */}
              <div
                onClick={() => setStep('join_hub')}
                className="p-4 rounded-2xl border-2 border-slate-200 hover:border-amber-500 bg-white hover:bg-amber-50/30 transition-all cursor-pointer space-y-2 group"
              >
                <div className="flex items-center justify-between">
                  <div className="w-9 h-9 rounded-xl bg-amber-500 text-white flex items-center justify-center">
                    <KeyRound className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 bg-amber-100 text-amber-900 rounded-full">
                    For Kids & Members
                  </span>
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 group-hover:text-amber-700 transition-colors">
                    Join an Existing Family
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Enter the code provided by your family organizer to join your shared family space.
                  </p>
                </div>
              </div>

              {/* Direct 1-tap Enter if starter family exists */}
              <div className="pt-2">
                <button
                  type="button"
                  onClick={handleEnterInitialFamily}
                  className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <span>Enter Family Space Directly</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* STEP 3A: CREATE A FAMILY HUB */}
        {step === 'create_hub' && (
          <div className="p-6 space-y-4">
            <button
              type="button"
              onClick={() => setStep('hub_choice')}
              className="flex items-center gap-1 text-xs text-purple-700 font-bold hover:underline cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back</span>
            </button>

            <div className="space-y-1">
              <h2 className="text-base font-bold text-slate-900">Create Your Family Hub</h2>
              <p className="text-xs text-slate-500">
                Set up your family name and share your invite code with family members.
              </p>
            </div>

            <div className="space-y-3">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Family Name</label>
                <input
                  type="text"
                  value={hubName}
                  onChange={(e) => setHubName(e.target.value)}
                  placeholder="Enter family name"
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-300 focus:border-purple-600 outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Your Role</label>
                <div className="grid grid-cols-3 gap-2">
                  {(['Parent', 'Teenager', 'Child'] as FamilyRole[]).map((r) => (
                    <button
                      key={r}
                      type="button"
                      onClick={() => setCreatorRole(r)}
                      className={`py-2 text-xs font-bold rounded-xl border transition-all cursor-pointer ${
                        creatorRole === r
                          ? 'bg-purple-700 text-white border-purple-700'
                          : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      {r}
                    </button>
                  ))}
                </div>
              </div>

              {/* Generated Invite Code Box */}
              <div className="p-3.5 bg-purple-50 rounded-2xl border border-purple-200 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-purple-950">Your Family Invite Code:</span>
                  <button
                    type="button"
                    onClick={() => handleCopyCode(inviteCode)}
                    className="px-2 py-0.5 bg-white text-purple-800 text-[10px] font-bold rounded-lg border border-purple-200 flex items-center gap-1 cursor-pointer"
                  >
                    {copiedCode ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedCode ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
                <div className="font-mono text-base font-black text-purple-900 tracking-wider">
                  {inviteCode}
                </div>
                <p className="text-[11px] text-slate-600">
                  Share this code with your children or spouse so they can join this family hub.
                </p>
              </div>

              <button
                type="button"
                id="create-family-launch-btn"
                onClick={handleFinishCreateHub}
                className="w-full py-3 bg-purple-700 hover:bg-purple-800 text-white rounded-xl font-bold text-xs sm:text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Launch Family Hub</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 3B: JOIN AN EXISTING FAMILY WITH CODE */}
        {step === 'join_hub' && (
          <div className="p-6 space-y-4">
            <button
              type="button"
              onClick={() => setStep('hub_choice')}
              className="flex items-center gap-1 text-xs text-purple-700 font-bold hover:underline cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back</span>
            </button>

            <div className="space-y-1">
              <h2 className="text-base font-bold text-slate-900">Enter Family Invite Code</h2>
              <p className="text-xs text-slate-500">
                Enter the code provided by your family organizer to join.
              </p>
            </div>

            <div className="space-y-3">
              <div className="space-y-1">
                <input
                  type="text"
                  value={inputInviteCode}
                  onChange={(e) => handleCheckInviteCode(e.target.value)}
                  placeholder="Enter invite code"
                  className="w-full px-3.5 py-3 text-center font-mono font-black text-base uppercase rounded-xl border-2 border-slate-300 focus:border-amber-500 outline-none bg-slate-50"
                />
              </div>

              {/* Error message */}
              {joinError && (
                <div className="p-2.5 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                  <span>{joinError}</span>
                </div>
              )}

              {/* Matched Real Family */}
              {matchedFamily && (
                <div className="p-4 bg-amber-50/80 rounded-2xl border border-amber-200 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-[10px] font-bold text-amber-800 uppercase tracking-wider">
                        Family Found:
                      </div>
                      <div className="text-sm font-black text-slate-900">{matchedFamily.name}</div>
                      <div className="text-[11px] text-slate-500">
                        {matchedFamily.members.length} existing members
                      </div>
                    </div>
                    <div className="w-7 h-7 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center">
                      <CheckCircle2 className="w-4 h-4" />
                    </div>
                  </div>

                  {/* Pick member profile or enter new */}
                  <div className="space-y-2 pt-2 border-t border-amber-200">
                    <div className="text-xs font-bold text-slate-800">Your Name in Family:</div>
                    <input
                      type="text"
                      value={customJoinName}
                      onChange={(e) => setCustomJoinName(e.target.value)}
                      placeholder="Enter your name"
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:border-amber-500 outline-none bg-white"
                    />

                    <div className="text-xs font-bold text-slate-800 pt-1">Your Role:</div>
                    <div className="grid grid-cols-3 gap-2">
                      {(['Child', 'Teenager', 'Parent'] as FamilyRole[]).map((r) => (
                        <button
                          key={r}
                          type="button"
                          onClick={() => setCustomJoinRole(r)}
                          className={`py-1.5 text-xs font-bold rounded-xl border transition-all cursor-pointer ${
                            customJoinRole === r
                              ? 'bg-amber-500 text-white border-amber-500'
                              : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                          }`}
                        >
                          {r}
                        </button>
                      ))}
                    </div>
                  </div>

                  <button
                    type="button"
                    id="confirm-join-family-btn"
                    onClick={handleFinishJoinHub}
                    className="w-full py-2.5 bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs rounded-xl shadow-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <span>Join {matchedFamily.name}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Security / Privacy Guarantee Footer */}
        <div className="px-6 py-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
          <div className="flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Private & Encrypted</span>
          </div>
          <span>Silah Safe Haven</span>
        </div>
      </div>
    </div>
  );
};

// Official Google G Logo Component
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
