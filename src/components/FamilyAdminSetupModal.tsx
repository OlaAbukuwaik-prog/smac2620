import React, { useState } from 'react';
import {
  ShieldCheck,
  UserPlus,
  Users,
  CheckCircle2,
  Calendar,
  Lock,
  ArrowRight,
  Sparkles,
  X,
  Mail,
  User,
  Heart,
  ChevronRight,
  ShieldAlert,
} from 'lucide-react';
import { FamilyMember, Family } from '../types';

interface FamilyAdminSetupModalProps {
  isOpen: boolean;
  onClose: () => void;
  family?: Family;
  allMembers?: FamilyMember[];
  currentMembers?: FamilyMember[];
  adminEmail?: string;
  adminName?: string;
  onAddMember: (newMember: Partial<FamilyMember>) => void;
  onSwitchToFather: () => void;
}

export const FamilyAdminSetupModal: React.FC<FamilyAdminSetupModalProps> = ({
  isOpen,
  onClose,
  family,
  allMembers,
  currentMembers,
  adminEmail,
  adminName,
  onAddMember,
  onSwitchToFather,
}) => {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const effectiveMembers = allMembers || currentMembers || [];
  const displayEmail = adminEmail || 'lovelyspurelove@gmail.com';
  const displayName = adminName || 'Father (Parent)';
  const [newMemberName, setNewMemberName] = useState('');
  const [newMemberRole, setNewMemberRole] = useState<'Parent' | 'Teenager' | 'Child'>('Teenager');
  const [newMemberEmail, setNewMemberEmail] = useState('');
  const [addedSuccessMsg, setAddedSuccessMsg] = useState('');

  if (!isOpen) return null;

  const handleAddNewMember = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMemberName) return;

    onAddMember({
      name: newMemberName,
      arabicName: newMemberName,
      role: newMemberRole,
      ageRange: newMemberRole === 'Child' ? '9-12' : newMemberRole === 'Teenager' ? '15-17' : '40-49',
      avatarColor:
        newMemberRole === 'Child'
          ? 'bg-amber-500 text-white'
          : newMemberRole === 'Teenager'
          ? 'bg-violet-500 text-white'
          : 'bg-rose-500 text-white',
      initials: newMemberName.slice(0, 2).toUpperCase(),
      preferences: ['Family dinners', 'Outdoor activities'],
      calendar: {
        provider: 'google',
        accountEmail: newMemberEmail || `${newMemberName.toLowerCase().replace(/\s+/g, '')}@gmail.com`,
        isConnected: true,
        scopes: [
          'https://www.googleapis.com/auth/calendar.freebusy',
          'https://www.googleapis.com/auth/calendar.events.readonly',
        ],
      },
    });

    setAddedSuccessMsg(`Added ${newMemberName} (${newMemberRole}) to family!`);
    setNewMemberName('');
    setNewMemberEmail('');
    setTimeout(() => setAddedSuccessMsg(''), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3">
      <div className="bg-white rounded-3xl p-5 max-w-md w-full space-y-4 shadow-2xl border border-purple-100 max-h-[92vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-purple-950 font-bold text-sm">
            <span className="p-1 rounded-xl bg-purple-100 text-purple-700">
              <ShieldCheck className="w-5 h-5" />
            </span>
            <span>Father Sign-in & Family Control Setup</span>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step Indicator */}
        <div className="flex items-center justify-between px-2 pt-1">
          <div className="flex items-center gap-1">
            <span
              className={`w-6 h-6 rounded-full text-xs font-bold flex items-center justify-center ${
                step === 1 ? 'bg-purple-700 text-white' : 'bg-purple-100 text-purple-700'
              }`}
            >
              1
            </span>
            <span className="text-xs font-semibold text-slate-700">Father Sign-in</span>
          </div>
          <div className="w-8 h-0.5 bg-slate-200" />
          <div className="flex items-center gap-1">
            <span
              className={`w-6 h-6 rounded-full text-xs font-bold flex items-center justify-center ${
                step === 2 ? 'bg-purple-700 text-white' : 'bg-purple-100 text-purple-700'
              }`}
            >
              2
            </span>
            <span className="text-xs font-semibold text-slate-700">Family Members</span>
          </div>
          <div className="w-8 h-0.5 bg-slate-200" />
          <div className="flex items-center gap-1">
            <span
              className={`w-6 h-6 rounded-full text-xs font-bold flex items-center justify-center ${
                step === 3 ? 'bg-purple-700 text-white' : 'bg-purple-100 text-purple-700'
              }`}
            >
              3
            </span>
            <span className="text-xs font-semibold text-slate-700">Control Rules</span>
          </div>
        </div>

        {/* STEP 1: Father Sign-in & Primary Admin Credentials */}
        {step === 1 && (
          <div className="space-y-3.5">
            <div className="p-3.5 rounded-2xl bg-gradient-to-br from-purple-900 to-indigo-950 text-white space-y-2 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-amber-300 uppercase tracking-wider">
                  Primary Family Administrator
                </span>
                <span className="text-[10px] bg-emerald-500/30 text-emerald-300 px-2 py-0.5 rounded-full font-semibold">
                  Active Session
                </span>
              </div>
              <h3 className="text-sm font-bold">{displayName}</h3>
              <div className="flex items-center gap-1.5 text-xs text-purple-200 font-mono">
                <Mail className="w-3.5 h-3.5" />
                <span>{displayEmail}</span>
              </div>
              <p className="text-[11px] text-purple-200 pt-1">
                As the primary account administrator, you and family guardians have parental control.
                You receive de-escalated communication alerts and manage family schedules.
              </p>
            </div>

            <div className="p-3 bg-indigo-50 border border-indigo-200 rounded-2xl space-y-2 text-xs text-slate-700">
              <div className="font-bold text-indigo-950 flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-indigo-600" />
                <span>Google Account Calendar Linked</span>
              </div>
              <p className="text-[11px] text-slate-600 leading-relaxed">
                Your Google Calendar is synchronized for automatic family availability matching
                (Friday free slots, weekend outings).
              </p>
            </div>

            <button
              onClick={() => setStep(2)}
              className="w-full py-2.5 rounded-xl bg-purple-700 hover:bg-purple-800 text-white font-bold text-xs shadow flex items-center justify-center gap-2"
            >
              <span>Continue to Family Members</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* STEP 2: Manage and Add Family Members */}
        {step === 2 && (
          <div className="space-y-3.5">
            <div className="space-y-1">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Current Family Roster ({effectiveMembers.length} Members)
              </h3>
              <p className="text-[11px] text-slate-500">
                Parents are in control; kids receive the comforting Safe Haven AI screen.
              </p>
            </div>

            {/* List of members */}
            <div className="space-y-2">
              {effectiveMembers.map((member) => (
                <div
                  key={member.id}
                  className="p-2.5 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs"
                >
                  <div className="flex items-center gap-2.5">
                    <div
                      className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold text-xs ${member.avatarColor}`}
                    >
                      {member.initials}
                    </div>
                    <div>
                      <div className="font-bold text-slate-800 flex items-center gap-1">
                        <span>{member.name}</span>
                        {member.role === 'Parent' && (
                          <span className="text-[9px] px-1.5 py-0.2 bg-purple-100 text-purple-800 font-bold rounded">
                            Guardian
                          </span>
                        )}
                        {member.role === 'Teenager' && (
                          <span className="text-[9px] px-1.5 py-0.2 bg-violet-100 text-violet-800 font-bold rounded">
                            Safe Haven AI
                          </span>
                        )}
                      </div>
                      <div className="text-[10px] text-slate-500">
                        {member.calendar.accountEmail || 'No email linked'}
                      </div>
                    </div>
                  </div>

                  <span className="text-[10px] text-emerald-700 font-semibold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Linked</span>
                  </span>
                </div>
              ))}
            </div>

            {/* Add new member form */}
            <form
              onSubmit={handleAddNewMember}
              className="p-3 bg-purple-50/60 border border-purple-200 rounded-2xl space-y-2.5"
            >
              <span className="text-xs font-bold text-purple-950 flex items-center gap-1">
                <UserPlus className="w-3.5 h-3.5 text-purple-700" />
                <span>Add Another Family Member</span>
              </span>

              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  placeholder="Name (e.g. Layla)"
                  value={newMemberName}
                  onChange={(e) => setNewMemberName(e.target.value)}
                  className="px-2.5 py-1.5 text-xs bg-white rounded-xl border border-slate-300 focus:outline-purple-600"
                />
                <select
                  value={newMemberRole}
                  onChange={(e) => setNewMemberRole(e.target.value as any)}
                  className="px-2.5 py-1.5 text-xs bg-white rounded-xl border border-slate-300 focus:outline-purple-600"
                >
                  <option value="Teenager">Teenager (Safe Haven View)</option>
                  <option value="Child">Child (Kid View)</option>
                  <option value="Parent">Parent (Guardian Control)</option>
                </select>
              </div>

              <input
                type="email"
                placeholder="Google Account Email (@gmail.com)"
                value={newMemberEmail}
                onChange={(e) => setNewMemberEmail(e.target.value)}
                className="w-full px-2.5 py-1.5 text-xs bg-white rounded-xl border border-slate-300 focus:outline-purple-600"
              />

              <button
                type="submit"
                className="w-full py-2 rounded-xl bg-purple-700 hover:bg-purple-800 text-white font-bold text-xs shadow active:scale-95 transition-all"
              >
                + Add Member to Family
              </button>

              {addedSuccessMsg && (
                <div className="text-[11px] text-emerald-700 font-bold text-center">
                  {addedSuccessMsg}
                </div>
              )}
            </form>

            <div className="flex gap-2">
              <button
                onClick={() => setStep(1)}
                className="flex-1 py-2 rounded-xl border border-slate-300 text-slate-700 text-xs font-semibold"
              >
                Back
              </button>
              <button
                onClick={() => setStep(3)}
                className="flex-1 py-2 rounded-xl bg-purple-700 hover:bg-purple-800 text-white text-xs font-bold flex items-center justify-center gap-1"
              >
                <span>Next: Control Rules</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: Control & Harm-Prevention Policies */}
        {step === 3 && (
          <div className="space-y-3.5">
            <div className="p-3 bg-amber-50 border border-amber-200 rounded-2xl space-y-2 text-xs">
              <div className="flex items-center gap-1.5 font-bold text-amber-950">
                <ShieldAlert className="w-4 h-4 text-amber-700" />
                <span>Parent Control & Protection Protocols</span>
              </div>
              <ul className="space-y-1.5 text-[11px] text-amber-900 leading-relaxed list-disc list-inside">
                <li>
                  <strong>Parents in Control:</strong> Parents receive all
                  de-escalated alerts and approve outing plans.
                </li>
                <li>
                  <strong>Kids' Psychological Safety:</strong> Kids speak to their AI companion
                  without fear of explosive parental reactions or immediate punishment.
                </li>
                <li>
                  <strong>Secret Empathy Coaching:</strong> The AI distills actionable, warm guidance
                  for the parents to understand the kid's feelings without exposing raw private chat
                  logs.
                </li>
                <li>
                  <strong>Google Calendar Sync:</strong> Real-time shared scheduling across all
                  members' devices.
                </li>
              </ul>
            </div>

            <div className="p-3 bg-purple-50 rounded-2xl border border-purple-100 space-y-1.5">
              <div className="text-xs font-bold text-purple-950">Family Invite Code:</div>
              <div className="flex items-center justify-between p-2 rounded-xl bg-white border border-purple-200 font-mono font-bold text-purple-900 text-sm">
                <span>{family.inviteCode}</span>
                <span className="text-[10px] text-purple-500 font-sans">Active & Ready</span>
              </div>
            </div>

            <div className="flex gap-2 pt-1">
              <button
                onClick={() => setStep(2)}
                className="flex-1 py-2.5 rounded-xl border border-slate-300 text-slate-700 text-xs font-semibold"
              >
                Back
              </button>
              <button
                onClick={() => {
                  onSwitchToFather();
                  onClose();
                }}
                className="flex-1 py-2.5 rounded-xl bg-purple-700 hover:bg-purple-800 text-white text-xs font-bold shadow flex items-center justify-center gap-1"
              >
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span>Switch to Father View</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
