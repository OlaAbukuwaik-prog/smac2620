import React, { useState } from 'react';
import {
  Compass,
  Clock,
  DollarSign,
  Users,
  Sparkles,
  CalendarPlus,
  Check,
  Coffee,
  Footprints,
  Gamepad2,
  UtensilsCrossed,
} from 'lucide-react';
import { Activity, ActivityCategory } from '../types';

interface ActivitiesScreenProps {
  activities: Activity[];
  onAddActivityToCalendar: (activity: Activity) => void;
}

const CATEGORIES: ActivityCategory[] = [
  'All',
  'Indoor',
  'Outdoor',
  'Free',
  'Low Cost',
  'Weekend',
  'Short',
  'Special Occasion',
];

const renderIcon = (iconName: string) => {
  switch (iconName) {
    case 'Coffee':
      return <Coffee className="w-5 h-5 text-purple-600" />;
    case 'Footprints':
      return <Footprints className="w-5 h-5 text-emerald-600" />;
    case 'Gamepad2':
      return <Gamepad2 className="w-5 h-5 text-indigo-600" />;
    case 'UtensilsCrossed':
      return <UtensilsCrossed className="w-5 h-5 text-amber-600" />;
    default:
      return <Sparkles className="w-5 h-5 text-purple-600" />;
  }
};

export const ActivitiesScreen: React.FC<ActivitiesScreenProps> = ({
  activities,
  onAddActivityToCalendar,
}) => {
  const [activeCategory, setActiveCategory] = useState<ActivityCategory>('All');
  const [scheduledId, setScheduledId] = useState<string | null>(null);

  const filteredActivities = activities.filter((act) => {
    if (activeCategory === 'All') return true;
    return act.category.includes(activeCategory);
  });

  const handleAdd = (act: Activity) => {
    setScheduledId(act.id);
    onAddActivityToCalendar(act);
    setTimeout(() => {
      setScheduledId(null);
    }, 2000);
  };

  return (
    <div className="flex-1 px-4 py-4 space-y-4 pb-20">
      {/* Header */}
      <section className="space-y-0.5">
        <div className="flex items-center gap-2">
          <Compass className="w-5 h-5 text-purple-700" />
          <h1 className="text-base font-bold text-slate-900">Family Activities</h1>
        </div>
        <p className="text-xs text-slate-500">
          Tailored suggestions designed to bring your family together meaningfully.
        </p>
      </section>

      {/* Category Pills Slider */}
      <section className="flex gap-1.5 overflow-x-auto pb-1 no-scrollbar text-xs">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            id={`filter-${cat.toLowerCase().replace(' ', '-')}`}
            onClick={() => setActiveCategory(cat)}
            className={`px-3 py-1.5 rounded-full font-semibold whitespace-nowrap transition-all ${
              activeCategory === cat
                ? 'bg-purple-700 text-white shadow-sm'
                : 'bg-white text-slate-600 border border-slate-200 hover:border-purple-200'
            }`}
          >
            {cat}
          </button>
        ))}
      </section>

      {/* Activities Grid */}
      <section className="space-y-3">
        {filteredActivities.map((act) => {
          const isJustAdded = scheduledId === act.id;
          return (
            <div
              key={act.id}
              id={`activity-card-${act.id}`}
              className="bg-white rounded-2xl p-4 shadow-sm border border-purple-100 hover:shadow-md transition-all space-y-3"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-purple-50 border border-purple-100 flex items-center justify-center shrink-0">
                    {renderIcon(act.iconName)}
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">{act.title}</h3>
                    {act.arabicTitle && (
                      <span className="text-[11px] text-purple-700 font-arabic block -mt-0.5">
                        {act.arabicTitle}
                      </span>
                    )}
                    <div className="flex flex-wrap items-center gap-2 text-[11px] text-slate-500 mt-1">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {act.duration}
                      </span>
                      <span>•</span>
                      <span className="font-medium text-slate-700">{act.cost}</span>
                      <span>•</span>
                      <span className="text-purple-700">{act.suits}</span>
                    </div>
                  </div>
                </div>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed">{act.description}</p>

              {/* AI Recommendation Reason */}
              <div className="p-2.5 bg-purple-50/70 rounded-xl border border-purple-200/70 text-xs text-purple-950 flex items-start gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-purple-600 shrink-0 mt-0.5" />
                <p className="text-[11px] leading-tight">
                  <strong>Why Silah recommends it:</strong> {act.whyRecommended}
                </p>
              </div>

              <div className="flex items-center justify-between pt-1 border-t border-slate-100">
                <div className="flex gap-1">
                  {act.category.slice(0, 2).map((c, i) => (
                    <span
                      key={i}
                      className="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 font-medium"
                    >
                      {c}
                    </span>
                  ))}
                </div>

                <button
                  id={`add-activity-btn-${act.id}`}
                  onClick={() => handleAdd(act)}
                  className={`px-3 py-1.5 rounded-xl font-bold text-xs shadow transition-all flex items-center gap-1.5 ${
                    isJustAdded
                      ? 'bg-emerald-600 text-white'
                      : 'bg-purple-700 hover:bg-purple-800 text-white active:scale-95'
                  }`}
                >
                  {isJustAdded ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>Added!</span>
                    </>
                  ) : (
                    <>
                      <CalendarPlus className="w-3.5 h-3.5" />
                      <span>Add to Calendar</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </section>
    </div>
  );
};
