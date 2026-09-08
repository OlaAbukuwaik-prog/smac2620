import React from 'react';
import {
  X,
  Award,
  Cpu,
  ShieldCheck,
  Code2,
  FileText,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';

interface MLKitReportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MLKitReportModal: React.FC<MLKitReportModalProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-3">
      <div className="bg-white rounded-3xl p-5 max-w-sm w-full space-y-4 shadow-2xl border border-purple-100 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-purple-950 font-bold text-sm">
            <Award className="w-5 h-5 text-amber-500" />
            <span>Student Competition AI Dossier</span>
          </div>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Competition Mandate Notice */}
        <div className="p-3 bg-amber-50 rounded-2xl border border-amber-200 text-xs text-amber-950 space-y-1">
          <div className="font-bold text-[11px] uppercase tracking-wider text-amber-900">
            Competition Ethics & Transparency
          </div>
          <p className="text-[11px] leading-relaxed text-slate-700">
            In accordance with competition constraints: AI is utilized strictly as a supporting
            development and on-device NLP tool. No code is copied from external black-box repositories.
          </p>
        </div>

        {/* Primary AI Technology: Google ML Kit */}
        <div className="space-y-2">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
            Google ML Kit Components:
          </span>

          <div className="p-3 rounded-2xl bg-purple-50/70 border border-purple-200 text-xs space-y-1.5">
            <div className="flex items-center gap-1.5 font-bold text-purple-950">
              <Cpu className="w-4 h-4 text-purple-700" />
              <span>1. ML Kit Smart Reply</span>
            </div>
            <p className="text-[11px] text-slate-600">
              Used in the AI Bridge parent-response workflow for generating supportive, calm reply options.
              Includes graceful fallback to predefined neutral responses when offline.
            </p>
            <div className="text-[10px] text-purple-800 font-mono bg-white/80 p-1.5 rounded-lg border border-purple-200">
              com.google.mlkit:smart-reply:17.0.4
            </div>
          </div>

          <div className="p-3 rounded-2xl bg-indigo-50/70 border border-indigo-200 text-xs space-y-1.5">
            <div className="flex items-center gap-1.5 font-bold text-indigo-950">
              <Cpu className="w-4 h-4 text-indigo-700" />
              <span>2. ML Kit Language Identification</span>
            </div>
            <p className="text-[11px] text-slate-600">
              Detects English (en) and Arabic (ar) within Bridge messages with sub-10ms on-device latency
              to adapt communication synthesis.
            </p>
            <div className="text-[10px] text-indigo-800 font-mono bg-white/80 p-1.5 rounded-lg border border-indigo-200">
              com.google.mlkit:language-id:17.0.6
            </div>
          </div>
        </div>

        {/* Explicit Ethical Boundaries */}
        <div className="p-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs space-y-1">
          <div className="font-bold text-slate-800 text-[11px] uppercase tracking-wider flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Strict Ethical Safeguards</span>
          </div>
          <ul className="list-disc list-inside text-[11px] text-slate-600 space-y-0.5">
            <li>No medical, emotional, or psychiatric diagnoses claimed.</li>
            <li>No surveillance or unconsented parental tracking.</li>
            <li>Immediate safety intercept for distress/harm disclosures.</li>
            <li>User approves all calm rewritten text prior to sending.</li>
          </ul>
        </div>

        {/* Development Prompting Log */}
        <div className="space-y-1.5 text-xs">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
            Documented Engineering Stages:
          </span>
          <div className="space-y-1 text-[11px] text-slate-600">
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>Multi-member role architecture & privacy isolation</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>AI Bridge 8-step calm restructuring & approval engine</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>Google Calendar OAuth 2.0 free/busy overlap calculation</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>Offline graceful fallbacks for all on-device ML models</span>
            </div>
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full py-2.5 rounded-xl bg-purple-700 hover:bg-purple-800 text-white font-bold text-xs shadow"
        >
          Close Dossier
        </button>
      </div>
    </div>
  );
};
