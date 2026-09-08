import React, { useState } from 'react';
import {
  Calendar as CalendarIcon,
  Clock,
  MapPin,
  Users,
  Plus,
  Search,
  Sparkles,
  ShieldCheck,
  Check,
  X,
  ChevronLeft,
  ChevronRight,
  Filter,
} from 'lucide-react';
import { FamilyEvent, FamilyMember } from '../types';

interface CalendarScreenProps {
  events: FamilyEvent[];
  allMembers: FamilyMember[];
  activeMember: FamilyMember;
  onAddEvent: (event: Omit<FamilyEvent, 'id' | 'createdBy'>) => void;
  onOpenOAuthModal: () => void;
}

export const CalendarScreen: React.FC<CalendarScreenProps> = ({
  events,
  allMembers,
  activeMember,
  onAddEvent,
  onOpenOAuthModal,
}) => {
  const [viewMode, setViewMode] = useState<'Month' | 'Week' | 'Day'>('Week');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showFindFreeModal, setShowFindFreeModal] = useState(false);
  const [newEventTitle, setNewEventTitle] = useState('');
  const [newEventDate, setNewEventDate] = useState('2026-09-06');
  const [newEventStart, setNewEventStart] = useState('18:30');
  const [newEventEnd, setNewEventEnd] = useState('19:30');
  const [newEventLocation, setNewEventLocation] = useState('Home Dining Room');
  const [selectedParticipants, setSelectedParticipants] = useState<string[]>(
    allMembers.map((m) => m.id)
  );

  // Find free time state
  const [freeTimeCalculated, setFreeTimeCalculated] = useState(false);

  const handleCreateEventSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEventTitle.trim()) return;

    onAddEvent({
      title: newEventTitle,
      date: newEventDate,
      startTime: newEventStart,
      endTime: newEventEnd,
      location: newEventLocation,
      participantIds: selectedParticipants,
      category: 'dinner',
      color: '#8b5cf6',
      notes: 'Scheduled via Silah Shared Family Calendar.',
    });

    setNewEventTitle('');
    setShowAddModal(false);
  };

  const handleAcceptDinnerSuggestion = () => {
    onAddEvent({
      title: 'Family Dinner',
      arabicTitle: 'عشاء عائلي',
      date: '2026-09-06',
      startTime: '18:30',
      endTime: '19:30',
      location: 'Home Dining Room',
      participantIds: allMembers.map((m) => m.id),
      category: 'dinner',
      color: '#8b5cf6',
      notes: 'Scheduled via Free Time overlap calculation.',
    });
    setShowFindFreeModal(false);
  };

  return (
    <div className="flex-1 px-4 py-4 space-y-4 pb-20">
      {/* Top Header & View Tabs */}
      <section className="flex items-center justify-between">
        <div>
          <h1 className="text-base font-bold text-slate-900">Shared Family Calendar</h1>
          <p className="text-xs text-slate-500">Coordinating schedules respectfully</p>
        </div>

        {/* View Switcher [Month] [Week] [Day] */}
        <div className="flex p-0.5 bg-slate-200/80 rounded-xl text-xs font-semibold text-slate-600">
          {(['Month', 'Week', 'Day'] as const).map((mode) => (
            <button
              key={mode}
              id={`calendar-view-${mode.toLowerCase()}`}
              onClick={() => setViewMode(mode)}
              className={`px-2.5 py-1 rounded-lg transition-all ${
                viewMode === mode ? 'bg-white text-purple-950 shadow-sm' : 'hover:text-slate-900'
              }`}
            >
              {mode}
            </button>
          ))}
        </div>
      </section>

      {/* Action Buttons: [+ Add Event] [Find Free Time] [AI Suggestion] */}
      <section className="grid grid-cols-3 gap-2">
        <button
          id="calendar-add-event-btn"
          onClick={() => setShowAddModal(true)}
          className="p-2.5 rounded-xl bg-purple-700 hover:bg-purple-800 text-white font-bold text-xs shadow flex items-center justify-center gap-1 transition-all"
        >
          <Plus className="w-3.5 h-3.5 stroke-[3]" />
          <span>Add Event</span>
        </button>

        <button
          id="calendar-find-free-time-btn"
          onClick={() => {
            setShowFindFreeModal(true);
            setFreeTimeCalculated(true);
          }}
          className="p-2.5 rounded-xl bg-white border border-purple-200 hover:bg-purple-50 text-purple-900 font-bold text-xs shadow-sm flex items-center justify-center gap-1 transition-all"
        >
          <Search className="w-3.5 h-3.5 text-purple-600" />
          <span>Find Free Time</span>
        </button>

        <button
          id="calendar-oauth-status-btn"
          onClick={onOpenOAuthModal}
          className="p-2.5 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold text-xs shadow-sm flex items-center justify-center gap-1 transition-all"
        >
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          <span>Sync Status</span>
        </button>
      </section>

      {/* Member Color Legend */}
      <section className="p-2.5 bg-white rounded-xl border border-slate-200 flex items-center justify-between gap-1 overflow-x-auto text-[11px]">
        <span className="font-semibold text-slate-400 uppercase text-[9px] tracking-wider shrink-0">
          Members:
        </span>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-indigo-600" />
            <span className="text-slate-700">Dad</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
            <span className="text-slate-700">Mom</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-violet-500" />
            <span className="text-slate-700">Teen</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
            <span className="text-slate-700">Brother</span>
          </div>
        </div>
      </section>

      {/* Calendar Week View Grid */}
      <section className="bg-white rounded-2xl p-4 shadow-sm border border-purple-100 space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-bold uppercase tracking-wider text-purple-950">
            September 2026 • Week 36
          </h2>
          <div className="flex items-center gap-1">
            <button className="p-1 rounded-lg hover:bg-slate-100 text-slate-500">
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button className="p-1 rounded-lg hover:bg-slate-100 text-slate-500">
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Days of week header */}
        <div className="grid grid-cols-7 gap-1 text-center text-xs">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day, i) => {
            const isToday = day === 'Sun'; // Sunday Sep 6
            return (
              <div
                key={day}
                className={`py-1.5 rounded-xl flex flex-col items-center ${
                  isToday ? 'bg-purple-700 text-white font-bold' : 'text-slate-600'
                }`}
              >
                <span className="text-[10px] opacity-80">{day}</span>
                <span className="text-xs font-semibold">{6 + i}</span>
              </div>
            );
          })}
        </div>

        {/* Events list */}
        <div className="space-y-2 pt-2 border-t border-slate-100">
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            Scheduled Family Events ({events.length})
          </div>

          {events.map((ev) => (
            <div
              key={ev.id}
              className="p-3 rounded-xl border border-slate-100 hover:border-purple-200 bg-purple-50/20 flex items-start justify-between gap-2 transition-all"
            >
              <div className="flex items-start gap-2.5">
                <div
                  className="w-2.5 h-10 rounded-full shrink-0"
                  style={{ backgroundColor: ev.color }}
                />
                <div>
                  <h4 className="text-xs font-bold text-slate-900">{ev.title}</h4>
                  <div className="flex items-center gap-2 text-[11px] text-slate-500 mt-0.5">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {ev.date} • {ev.startTime} - {ev.endTime}
                    </span>
                    {ev.location && (
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        {ev.location}
                      </span>
                    )}
                  </div>
                  {ev.notes && <p className="text-[11px] text-slate-600 mt-1 italic">{ev.notes}</p>}
                </div>
              </div>

              <div className="flex -space-x-1 shrink-0">
                {ev.participantIds.map((pId) => {
                  const m = allMembers.find((mem) => mem.id === pId);
                  if (!m) return null;
                  return (
                    <div
                      key={pId}
                      className={`w-5 h-5 rounded-full border-2 border-white flex items-center justify-center text-[9px] font-bold ${m.avatarColor}`}
                      title={m.name}
                    >
                      {m.initials}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FIND FREE TIME MODAL / CARD (Section 8 & 9) */}
      {showFindFreeModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-5 max-w-sm w-full space-y-4 shadow-2xl border border-purple-100 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-purple-900 font-bold text-sm">
                <Search className="w-4 h-4 text-purple-600" />
                <span>Find Free Family Time</span>
              </div>
              <button
                onClick={() => setShowFindFreeModal(false)}
                className="p-1 text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-600">
              Silah reads free/busy schedules via authorized calendar connection without exposing private details.
            </p>

            {/* Member schedules calculated */}
            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 text-xs space-y-2">
              <div className="font-bold text-slate-800 text-[11px] uppercase tracking-wider">
                Availability Today:
              </div>
              <div className="space-y-1 text-slate-700">
                <div className="flex justify-between">
                  <span>Father:</span>
                  <span className="font-semibold text-indigo-700">Free after 5:00 PM</span>
                </div>
                <div className="flex justify-between">
                  <span>Mother:</span>
                  <span className="font-semibold text-rose-700">Free after 6:00 PM</span>
                </div>
                <div className="flex justify-between">
                  <span>Teenager:</span>
                  <span className="font-semibold text-purple-700">Free after 5:00 PM</span>
                </div>
                <div className="flex justify-between">
                  <span>Child:</span>
                  <span className="font-semibold text-amber-700">Free after 6:00 PM</span>
                </div>
              </div>
            </div>

            {/* Silah Overlap Calculation */}
            <div className="p-3.5 bg-gradient-to-br from-purple-900 to-indigo-950 text-white rounded-2xl space-y-2 shadow">
              <div className="flex items-center gap-1.5 text-amber-300 text-xs font-bold">
                <Sparkles className="w-4 h-4" />
                <span>Overlapping Window Found</span>
              </div>
              <p className="text-xs text-purple-100 font-medium">
                "Everyone is available from 6:00 PM to 8:00 PM."
              </p>
              <div className="pt-2 border-t border-white/10 flex items-center justify-between text-xs">
                <span>Suggestion: <strong>Family dinner at 6:30 PM?</strong></span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-1">
              <button
                onClick={() => setShowFindFreeModal(false)}
                className="py-2.5 px-3 rounded-xl border border-slate-300 text-slate-700 text-xs font-bold hover:bg-slate-50"
              >
                Decline
              </button>
              <button
                id="accept-dinner-suggestion-btn"
                onClick={handleAcceptDinnerSuggestion}
                className="py-2.5 px-3 rounded-xl bg-purple-700 hover:bg-purple-800 text-white text-xs font-bold shadow flex items-center justify-center gap-1"
              >
                <Check className="w-4 h-4" />
                <span>Add to Calendar</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ADD EVENT MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <form
            onSubmit={handleCreateEventSubmit}
            className="bg-white rounded-3xl p-5 max-w-sm w-full space-y-3.5 shadow-2xl border border-purple-100"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900">Add Family Event</h3>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="p-1 text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-2 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Event Title</label>
                <input
                  type="text"
                  required
                  value={newEventTitle}
                  onChange={(e) => setNewEventTitle(e.target.value)}
                  placeholder="e.g. Board Game Evening"
                  className="w-full p-2.5 rounded-xl border border-slate-300 text-xs outline-none focus:border-purple-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Date</label>
                  <input
                    type="date"
                    value={newEventDate}
                    onChange={(e) => setNewEventDate(e.target.value)}
                    className="w-full p-2 rounded-xl border border-slate-300 text-xs outline-none"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Location</label>
                  <input
                    type="text"
                    value={newEventLocation}
                    onChange={(e) => setNewEventLocation(e.target.value)}
                    className="w-full p-2 rounded-xl border border-slate-300 text-xs outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Start Time</label>
                  <input
                    type="time"
                    value={newEventStart}
                    onChange={(e) => setNewEventStart(e.target.value)}
                    className="w-full p-2 rounded-xl border border-slate-300 text-xs outline-none"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">End Time</label>
                  <input
                    type="time"
                    value={newEventEnd}
                    onChange={(e) => setNewEventEnd(e.target.value)}
                    className="w-full p-2 rounded-xl border border-slate-300 text-xs outline-none"
                  />
                </div>
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                id="create-event-confirm-btn"
                className="w-full py-2.5 rounded-xl bg-purple-700 hover:bg-purple-800 text-white font-bold text-xs shadow"
              >
                Create Event
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
