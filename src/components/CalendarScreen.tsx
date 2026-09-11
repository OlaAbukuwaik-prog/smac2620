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
  Trash2,
  CalendarDays,
  UserCheck,
} from 'lucide-react';
import { FamilyEvent, FamilyMember } from '../types';

interface CalendarScreenProps {
  events: FamilyEvent[];
  allMembers: FamilyMember[];
  activeMember: FamilyMember;
  onAddEvent: (event: Omit<FamilyEvent, 'id' | 'createdBy'>) => void;
  onDeleteEvent?: (eventId: string) => void;
  onOpenOAuthModal: () => void;
}

export const CalendarScreen: React.FC<CalendarScreenProps> = ({
  events,
  allMembers,
  activeMember,
  onAddEvent,
  onDeleteEvent,
  onOpenOAuthModal,
}) => {
  const [viewMode, setViewMode] = useState<'Month' | 'Week' | 'Day'>('Week');
  const [weekOffset, setWeekOffset] = useState(0);
  const [selectedDate, setSelectedDate] = useState<string>(
    () => new Date().toISOString().split('T')[0]
  );
  const [showAddModal, setShowAddModal] = useState(false);
  const [showFindFreeModal, setShowFindFreeModal] = useState(false);
  const [selectedEventForDetail, setSelectedEventForDetail] = useState<FamilyEvent | null>(null);

  // New Event Form State
  const [newEventTitle, setNewEventTitle] = useState('');
  const [newEventDate, setNewEventDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [newEventStart, setNewEventStart] = useState('18:30');
  const [newEventEnd, setNewEventEnd] = useState('19:30');
  const [newEventLocation, setNewEventLocation] = useState('Home Dining Room');
  const [selectedParticipants, setSelectedParticipants] = useState<string[]>(
    allMembers.map((m) => m.id)
  );

  // Calculate days for the active week based on weekOffset
  const getWeekDays = (offset: number) => {
    const today = new Date();
    const dayOfWeek = today.getDay(); // 0 = Sunday
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - dayOfWeek + offset * 7);

    const days = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date(startOfWeek);
      d.setDate(startOfWeek.getDate() + i);
      const dateString = d.toISOString().split('T')[0];
      days.push({
        dateString,
        dayName: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][d.getDay()],
        dayNum: d.getDate(),
        monthName: d.toLocaleString('en-US', { month: 'short' }),
        fullMonth: d.toLocaleString('en-US', { month: 'long' }),
        year: d.getFullYear(),
        isToday: d.toDateString() === new Date().toDateString(),
        isSelected: dateString === selectedDate,
      });
    }
    return days;
  };

  const weekDays = getWeekDays(weekOffset);
  const currentMonthLabel = `${weekDays[0].fullMonth} ${weekDays[0].year}`;
  const weekRangeLabel = `${weekDays[0].monthName} ${weekDays[0].dayNum} – ${weekDays[6].monthName} ${weekDays[6].dayNum}`;

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
      date: selectedDate || new Date().toISOString().split('T')[0],
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

  const toggleParticipant = (memberId: string) => {
    setSelectedParticipants((prev) => {
      if (prev.includes(memberId)) {
        if (prev.length > 1) {
          return prev.filter((id) => id !== memberId);
        }
        return prev;
      } else {
        return [...prev, memberId];
      }
    });
  };

  // Filter events for current view
  const weekDateStrings = weekDays.map((d) => d.dateString);
  const displayedEvents =
    viewMode === 'Day'
      ? events.filter((e) => e.date === selectedDate)
      : events;

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
              className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                viewMode === mode ? 'bg-white text-purple-950 shadow-sm font-bold' : 'hover:text-slate-900'
              }`}
            >
              {mode}
            </button>
          ))}
        </div>
      </section>

      {/* Action Buttons: [+ Add Event] [Find Free Time] [Sync Status] */}
      <section className="grid grid-cols-3 gap-2">
        <button
          id="calendar-add-event-btn"
          onClick={() => {
            setNewEventDate(selectedDate);
            setShowAddModal(true);
          }}
          className="p-2.5 rounded-xl bg-purple-700 hover:bg-purple-800 text-white font-bold text-xs shadow flex items-center justify-center gap-1 transition-all cursor-pointer active:scale-95"
        >
          <Plus className="w-3.5 h-3.5 stroke-[3]" />
          <span>Add Event</span>
        </button>

        <button
          id="calendar-find-free-time-btn"
          onClick={() => setShowFindFreeModal(true)}
          className="p-2.5 rounded-xl bg-white border border-purple-200 hover:bg-purple-50 text-purple-900 font-bold text-xs shadow-sm flex items-center justify-center gap-1 transition-all cursor-pointer active:scale-95"
        >
          <Search className="w-3.5 h-3.5 text-purple-600" />
          <span>Find Free Time</span>
        </button>

        <button
          id="calendar-oauth-status-btn"
          onClick={onOpenOAuthModal}
          className="p-2.5 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold text-xs shadow-sm flex items-center justify-center gap-1 transition-all cursor-pointer active:scale-95"
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
        <div className="flex items-center gap-3 overflow-x-auto">
          {allMembers.map((m) => (
            <div key={m.id} className="flex items-center gap-1.5 shrink-0">
              <span className={`w-2.5 h-2.5 rounded-full ${m.avatarColor.split(' ')[0] || 'bg-purple-600'}`} />
              <span className="text-slate-700 font-medium">{m.name}</span>
            </div>
          ))}
        </div>
      </section>

      {/* VIEW: WEEK VIEW */}
      {viewMode === 'Week' && (
        <section className="bg-white rounded-2xl p-4 shadow-sm border border-purple-100 space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xs font-bold uppercase tracking-wider text-purple-950">
                {currentMonthLabel}
              </h2>
              <span className="text-[11px] text-slate-500 font-medium">
                {weekRangeLabel}
              </span>
            </div>

            <div className="flex items-center gap-1.5">
              {weekOffset !== 0 && (
                <button
                  onClick={() => {
                    setWeekOffset(0);
                    setSelectedDate(new Date().toISOString().split('T')[0]);
                  }}
                  className="px-2 py-0.5 text-[10px] bg-purple-50 text-purple-700 border border-purple-200 rounded-lg font-bold hover:bg-purple-100 cursor-pointer"
                >
                  Today
                </button>
              )}
              <button
                onClick={() => setWeekOffset((prev) => prev - 1)}
                className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-600 cursor-pointer transition-colors"
                title="Previous Week"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => setWeekOffset((prev) => prev + 1)}
                className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-600 cursor-pointer transition-colors"
                title="Next Week"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Days of week interactive header */}
          <div className="grid grid-cols-7 gap-1 text-center text-xs">
            {weekDays.map((day) => {
              const hasEventOnDay = events.some((e) => e.date === day.dateString);
              return (
                <button
                  key={day.dateString}
                  onClick={() => setSelectedDate(day.dateString)}
                  className={`py-2 rounded-xl flex flex-col items-center transition-all cursor-pointer relative ${
                    day.isSelected
                      ? 'bg-purple-700 text-white font-bold shadow-sm'
                      : day.isToday
                      ? 'bg-purple-100 text-purple-900 font-bold border border-purple-300'
                      : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <span className="text-[10px] opacity-80">{day.dayName}</span>
                  <span className="text-xs font-semibold">{day.dayNum}</span>
                  {hasEventOnDay && (
                    <span
                      className={`w-1.5 h-1.5 rounded-full mt-0.5 ${
                        day.isSelected ? 'bg-amber-300' : 'bg-purple-600'
                      }`}
                    />
                  )}
                </button>
              );
            })}
          </div>

          {/* Events list */}
          <div className="space-y-2 pt-2 border-t border-slate-100">
            <div className="flex items-center justify-between text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              <span>Scheduled Family Events ({displayedEvents.length})</span>
              <span className="text-purple-700 font-normal">Tap event for details</span>
            </div>

            {displayedEvents.length === 0 ? (
              <div className="text-center py-6 text-slate-400 text-xs space-y-1 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                <CalendarDays className="w-6 h-6 mx-auto text-slate-300" />
                <p>No events scheduled for this view.</p>
                <button
                  onClick={() => setShowAddModal(true)}
                  className="text-purple-700 font-semibold hover:underline cursor-pointer"
                >
                  + Add one now
                </button>
              </div>
            ) : (
              displayedEvents.map((ev) => (
                <div
                  key={ev.id}
                  onClick={() => setSelectedEventForDetail(ev)}
                  className="p-3 rounded-xl border border-slate-100 hover:border-purple-300 bg-purple-50/20 hover:bg-purple-50/40 flex items-start justify-between gap-2 transition-all cursor-pointer group"
                >
                  <div className="flex items-start gap-2.5">
                    <div
                      className="w-2.5 h-10 rounded-full shrink-0 group-hover:scale-105 transition-transform"
                      style={{ backgroundColor: ev.color }}
                    />
                    <div>
                      <h4 className="text-xs font-bold text-slate-900 group-hover:text-purple-900 transition-colors">
                        {ev.title}
                      </h4>
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
              ))
            )}
          </div>
        </section>
      )}

      {/* VIEW: DAY VIEW */}
      {viewMode === 'Day' && (
        <section className="bg-white rounded-2xl p-4 shadow-sm border border-purple-100 space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xs font-bold uppercase tracking-wider text-purple-950">
                Day Timeline: {selectedDate}
              </h2>
              <p className="text-[11px] text-slate-500">Hourly schedule & overlap</p>
            </div>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="text-xs p-1 rounded-lg border border-slate-200 outline-none text-slate-700"
            />
          </div>

          {/* Hourly Timeline (8:00 AM to 10:00 PM) */}
          <div className="space-y-1.5 pt-2 border-t border-slate-100 max-h-[380px] overflow-y-auto pr-1">
            {['08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00', '22:00'].map((timeStr) => {
              const hourNum = parseInt(timeStr.split(':')[0], 10);
              const eventsAtHour = events.filter((e) => {
                if (e.date !== selectedDate) return false;
                const eStartHour = parseInt(e.startTime.split(':')[0], 10);
                return eStartHour === hourNum;
              });

              return (
                <div key={timeStr} className="flex items-start gap-2.5 py-1 border-b border-slate-50">
                  <span className="text-[11px] font-mono text-slate-400 w-12 shrink-0 pt-0.5">
                    {timeStr}
                  </span>
                  <div className="flex-1 min-h-[26px]">
                    {eventsAtHour.length > 0 ? (
                      <div className="space-y-1">
                        {eventsAtHour.map((ev) => (
                          <div
                            key={ev.id}
                            onClick={() => setSelectedEventForDetail(ev)}
                            className="p-2 rounded-xl bg-purple-100 border border-purple-200 text-purple-950 flex items-center justify-between cursor-pointer hover:bg-purple-200 transition-colors"
                          >
                            <div className="flex items-center gap-1.5">
                              <span className="font-bold text-xs">{ev.title}</span>
                              <span className="text-[10px] text-purple-700">
                                ({ev.startTime} - {ev.endTime})
                              </span>
                            </div>
                            <span className="text-[10px] font-semibold text-purple-800 bg-white/70 px-1.5 py-0.5 rounded">
                              {ev.location || 'Home'}
                            </span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="h-5 rounded-lg border border-dashed border-slate-100 flex items-center px-2">
                        <span className="text-[9px] text-slate-300">Free time</span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* VIEW: MONTH VIEW */}
      {viewMode === 'Month' && (
        <section className="bg-white rounded-2xl p-4 shadow-sm border border-purple-100 space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-bold uppercase tracking-wider text-purple-950">
              {currentMonthLabel} (Full Month Overview)
            </h2>
            <button
              onClick={() => {
                setSelectedDate(new Date().toISOString().split('T')[0]);
                setViewMode('Week');
              }}
              className="text-[11px] text-purple-700 font-bold hover:underline cursor-pointer"
            >
              Switch to Week View →
            </button>
          </div>

          <div className="grid grid-cols-7 gap-1 text-center text-[10px] font-bold text-slate-400 uppercase pt-1">
            {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((d) => (
              <span key={d}>{d}</span>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-1 text-center text-xs">
            {Array.from({ length: 31 }, (_, idx) => {
              const dayNumber = idx + 1;
              const dateStr = `2026-09-${String(dayNumber).padStart(2, '0')}`;
              const hasEvents = events.some((e) => e.date === dateStr);
              const isSelected = selectedDate === dateStr;

              return (
                <button
                  key={dayNumber}
                  onClick={() => {
                    setSelectedDate(dateStr);
                    setViewMode('Day');
                  }}
                  className={`p-2 rounded-xl flex flex-col items-center justify-center transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-purple-700 text-white font-bold'
                      : hasEvents
                      ? 'bg-purple-50 text-purple-900 font-bold border border-purple-200'
                      : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <span>{dayNumber}</span>
                  {hasEvents && (
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-0.5" />
                  )}
                </button>
              );
            })}
          </div>
        </section>
      )}

      {/* FIND FREE TIME MODAL */}
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
                className="p-1 text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-600">
              Silah calculates shared free windows across all {allMembers.length} family Google calendars without exposing private event details.
            </p>

            {/* Member schedules calculated */}
            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 text-xs space-y-2">
              <div className="font-bold text-slate-800 text-[11px] uppercase tracking-wider">
                Availability for {selectedDate}:
              </div>
              <div className="space-y-1.5 text-slate-700">
                {allMembers.map((m) => (
                  <div key={m.id} className="flex justify-between items-center">
                    <span className="font-medium text-slate-800">{m.name} ({m.role}):</span>
                    <span className="font-semibold text-purple-700 text-[11px]">
                      Free after {m.role === 'Child' ? '4:00 PM' : m.role === 'Teenager' ? '5:00 PM' : '6:00 PM'}
                    </span>
                  </div>
                ))}
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
                className="py-2.5 px-3 rounded-xl border border-slate-300 text-slate-700 text-xs font-bold hover:bg-slate-50 cursor-pointer"
              >
                Cancel
              </button>
              <button
                id="accept-dinner-suggestion-btn"
                onClick={handleAcceptDinnerSuggestion}
                className="py-2.5 px-3 rounded-xl bg-purple-700 hover:bg-purple-800 text-white text-xs font-bold shadow flex items-center justify-center gap-1 cursor-pointer active:scale-95"
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
            className="bg-white rounded-3xl p-5 max-w-sm w-full space-y-3.5 shadow-2xl border border-purple-100 animate-in fade-in"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900">Add Family Event</h3>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="p-1 text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-2.5 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Event Title</label>
                <input
                  type="text"
                  required
                  value={newEventTitle}
                  onChange={(e) => setNewEventTitle(e.target.value)}
                  placeholder="e.g. Board Game Evening, Family Dinner"
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

              {/* Participants Selector */}
              <div>
                <label className="block font-semibold text-slate-700 mb-1.5">
                  Select Participants ({selectedParticipants.length}):
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {allMembers.map((m) => {
                    const isSelected = selectedParticipants.includes(m.id);
                    return (
                      <button
                        key={m.id}
                        type="button"
                        onClick={() => toggleParticipant(m.id)}
                        className={`px-2.5 py-1 rounded-xl text-[11px] font-semibold flex items-center gap-1 border transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-purple-100 border-purple-300 text-purple-900 shadow-xs'
                            : 'bg-slate-50 border-slate-200 text-slate-500 hover:bg-slate-100'
                        }`}
                      >
                        <span>{isSelected ? '✓' : '+'}</span>
                        <span>{m.name}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="pt-2 flex gap-2">
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="flex-1 py-2.5 rounded-xl border border-slate-300 text-slate-700 font-bold text-xs hover:bg-slate-50 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                id="create-event-confirm-btn"
                className="flex-1 py-2.5 rounded-xl bg-purple-700 hover:bg-purple-800 text-white font-bold text-xs shadow cursor-pointer active:scale-95"
              >
                Create Event
              </button>
            </div>
          </form>
        </div>
      )}

      {/* EVENT DETAIL & ACTION MODAL */}
      {selectedEventForDetail && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-5 max-w-sm w-full space-y-4 shadow-2xl border border-purple-100 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <div
                  className="w-3.5 h-3.5 rounded-full"
                  style={{ backgroundColor: selectedEventForDetail.color }}
                />
                <h3 className="text-sm font-bold text-slate-900">
                  {selectedEventForDetail.title}
                </h3>
              </div>
              <button
                onClick={() => setSelectedEventForDetail(null)}
                className="p-1 text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-2.5 text-xs">
              <div className="flex items-center gap-2 text-slate-700">
                <Clock className="w-4 h-4 text-purple-600 shrink-0" />
                <span>
                  {selectedEventForDetail.date} • {selectedEventForDetail.startTime} - {selectedEventForDetail.endTime}
                </span>
              </div>

              {selectedEventForDetail.location && (
                <div className="flex items-center gap-2 text-slate-700">
                  <MapPin className="w-4 h-4 text-rose-500 shrink-0" />
                  <span>{selectedEventForDetail.location}</span>
                </div>
              )}

              {selectedEventForDetail.notes && (
                <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 text-slate-600 italic">
                  "{selectedEventForDetail.notes}"
                </div>
              )}

              {/* Attendees */}
              <div className="space-y-1.5 pt-1">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                  Attending Family Members:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {selectedEventForDetail.participantIds.map((pId) => {
                    const member = allMembers.find((m) => m.id === pId);
                    if (!member) return null;
                    return (
                      <span
                        key={pId}
                        className="inline-flex items-center gap-1.5 px-2 py-1 bg-purple-50 rounded-lg text-purple-900 font-medium"
                      >
                        <span
                          className={`w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-bold ${member.avatarColor}`}
                        >
                          {member.initials}
                        </span>
                        <span>{member.name}</span>
                      </span>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Modal Actions: Delete & Close */}
            <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
              {onDeleteEvent && (
                <button
                  onClick={() => {
                    onDeleteEvent(selectedEventForDetail.id);
                    setSelectedEventForDetail(null);
                  }}
                  className="px-3 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-xs flex items-center gap-1 border border-rose-200 transition-colors cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Delete</span>
                </button>
              )}
              <button
                onClick={() => setSelectedEventForDetail(null)}
                className="flex-1 py-2 rounded-xl bg-slate-800 hover:bg-slate-900 text-white font-bold text-xs cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
