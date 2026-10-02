"use client";

import React, { useState } from "react";
import { BulletImprovement } from "@/types/analysis";
import { Sparkles, Copy, Check, Minus, Plus, ShieldCheck } from "lucide-react";

interface BulletImprovementsSectionProps {
  bulletImprovements: BulletImprovement[];
}

export const BulletImprovementsSection: React.FC<BulletImprovementsSectionProps> = ({
  bulletImprovements,
}) => {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const handleCopy = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const getPriorityBadge = (priority: "high" | "medium" | "low") => {
    switch (priority) {
      case "high":
        return (
          <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-rose-50 text-rose-700 border border-rose-200">
            High Priority
          </span>
        );
      case "medium":
        return (
          <span className="text-[10px] uppercase font-semibold tracking-wider px-2 py-0.5 rounded bg-amber-50 text-amber-700 border border-amber-200">
            Medium Priority
          </span>
        );
      default:
        return (
          <span className="text-[10px] uppercase font-medium tracking-wider px-2 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200">
            Low Priority
          </span>
        );
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 p-6 md:p-8 shadow-xs space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-100">
        <div>
          <h2 className="text-lg font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-indigo-600" />
            Targeted Bullet Point Improvements
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Strengthen action verbs, scope, and technical evidence while strictly adhering to genuine facts
          </p>
        </div>

        <div className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-medium">
          <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
          <span>Resume-verified claims only</span>
        </div>
      </div>

      {/* Bullet Cards */}
      <div className="space-y-5">
        {bulletImprovements.map((item, idx) => (
          <div
            key={idx}
            className="rounded-xl border border-slate-200 bg-white shadow-2xs overflow-hidden"
          >
            {/* Top Bar with Section & Priority */}
            <div className="bg-slate-50 px-4 py-2.5 border-b border-slate-200/80 flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-slate-400" />
                Section: {item.section}
              </span>
              {getPriorityBadge(item.priority)}
            </div>

            {/* Comparison Body */}
            <div className="p-4 sm:p-5 space-y-3.5">
              {/* Current */}
              <div className="p-3.5 rounded-lg bg-slate-50/80 border border-slate-200 text-xs text-slate-600">
                <div className="flex items-center gap-1.5 font-bold uppercase tracking-wider text-[10px] text-slate-500 mb-1.5">
                  <Minus className="h-3 w-3 text-slate-400" />
                  Current Bullet
                </div>
                <p className="italic leading-relaxed">{item.currentBullet}</p>
              </div>

              {/* Suggested */}
              <div className="p-3.5 rounded-lg bg-emerald-50/40 border border-emerald-200 text-xs text-slate-900">
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-1.5 font-bold uppercase tracking-wider text-[10px] text-emerald-800">
                    <Plus className="h-3 w-3 text-emerald-600" />
                    Suggested High-Impact Bullet
                  </div>
                  <button
                    type="button"
                    onClick={() => handleCopy(item.suggestedBullet, idx)}
                    className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-800 hover:text-emerald-950 bg-white px-2 py-0.5 rounded border border-emerald-200 shadow-2xs transition-colors"
                  >
                    {copiedIndex === idx ? (
                      <>
                        <Check className="h-3 w-3 text-emerald-600" />
                        <span>Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="h-3 w-3 text-slate-500" />
                        <span>Copy</span>
                      </>
                    )}
                  </button>
                </div>
                <p className="font-medium leading-relaxed">{item.suggestedBullet}</p>
              </div>

              {/* Reason */}
              <div className="text-[11px] text-slate-500 flex items-start gap-1.5 pt-1">
                <strong className="text-slate-700 shrink-0">Reason for enhancement:</strong>
                <span>{item.reason}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
