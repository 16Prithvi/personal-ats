"use client";

import React, { useState } from "react";
import { CheckSquare, Square, ListOrdered, CheckCircle2 } from "lucide-react";

interface ActionPlanSectionProps {
  actionPlan: string[];
}

export const ActionPlanSection: React.FC<ActionPlanSectionProps> = ({ actionPlan }) => {
  const [completedSteps, setCompletedSteps] = useState<Record<number, boolean>>({});

  const toggleStep = (idx: number) => {
    setCompletedSteps((prev) => ({
      ...prev,
      [idx]: !prev[idx],
    }));
  };

  const totalSteps = actionPlan.length;
  const completedCount = Object.values(completedSteps).filter(Boolean).length;
  const progressPercent = totalSteps > 0 ? Math.round((completedCount / totalSteps) * 100) : 0;

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 p-6 md:p-8 shadow-xs space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-100">
        <div>
          <h2 className="text-lg font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <ListOrdered className="h-5 w-5 text-indigo-600" />
            Final Action Plan: Before You Apply
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Prioritized checklist of edits to execute before submitting your application
          </p>
        </div>

        {/* Progress pill */}
        <div className="flex items-center gap-3">
          <div className="text-right">
            <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block">
              Execution Progress
            </span>
            <span className="text-xs font-semibold text-slate-700 font-mono">
              {completedCount} of {totalSteps} completed
            </span>
          </div>
          <div className="w-24 bg-slate-100 rounded-full h-2 overflow-hidden">
            <div
              className="bg-indigo-600 h-full rounded-full transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* Interactive Action List */}
      <div className="space-y-2.5">
        {actionPlan.map((step, idx) => {
          const isDone = Boolean(completedSteps[idx]);
          return (
            <div
              key={idx}
              onClick={() => toggleStep(idx)}
              className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-start gap-3 select-none ${
                isDone
                  ? "bg-slate-50 border-slate-200 opacity-60 line-through text-slate-400"
                  : "bg-white border-slate-200 hover:border-indigo-300 hover:bg-slate-50/50 text-slate-800"
              }`}
            >
              <button
                type="button"
                className="mt-0.5 text-slate-400 hover:text-indigo-600 transition-colors shrink-0"
              >
                {isDone ? (
                  <CheckSquare className="h-4 w-4 text-emerald-600" />
                ) : (
                  <Square className="h-4 w-4 text-slate-400" />
                )}
              </button>

              <div className="flex-1 text-xs leading-relaxed font-medium">
                <span className="font-mono text-slate-400 mr-2">#{idx + 1}</span>
                {step}
              </div>

              {isDone && (
                <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  <CheckCircle2 className="h-3 w-3" />
                  Done
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
