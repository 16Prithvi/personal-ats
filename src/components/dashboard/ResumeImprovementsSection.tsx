"use client";

import React, { useState } from "react";
import { ResumeImprovement } from "@/types/analysis";
import { AlertCircle, SlidersHorizontal, CheckCircle2 } from "lucide-react";

interface ResumeImprovementsSectionProps {
  improvements: ResumeImprovement[];
}

export const ResumeImprovementsSection: React.FC<ResumeImprovementsSectionProps> = ({
  improvements,
}) => {
  const [priorityFilter, setPriorityFilter] = useState<"all" | "high" | "medium" | "low">("all");

  const filtered = improvements.filter((item) => {
    if (priorityFilter === "all") return true;
    return item.priority === priorityFilter;
  });

  const getPriorityStyle = (priority: "high" | "medium" | "low") => {
    switch (priority) {
      case "high":
        return {
          pill: "bg-rose-50 text-rose-700 border-rose-200",
          border: "border-l-rose-500",
          label: "High Priority",
        };
      case "medium":
        return {
          pill: "bg-amber-50 text-amber-700 border-amber-200",
          border: "border-l-amber-500",
          label: "Medium Priority",
        };
      default:
        return {
          pill: "bg-slate-100 text-slate-700 border-slate-200",
          border: "border-l-slate-400",
          label: "Low Priority",
        };
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 p-6 md:p-8 shadow-xs space-y-6">
      {/* Header & Filter */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-100">
        <div>
          <h2 className="text-lg font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <SlidersHorizontal className="h-5 w-5 text-indigo-600" />
            Resume Structural & Content Improvements
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Section-by-section audit prioritized by expected recruiter conversion impact
          </p>
        </div>

        {/* Priority Filter */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl">
          <button
            type="button"
            onClick={() => setPriorityFilter("all")}
            className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
              priorityFilter === "all"
                ? "bg-white text-slate-900 shadow-2xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            All ({improvements.length})
          </button>
          <button
            type="button"
            onClick={() => setPriorityFilter("high")}
            className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
              priorityFilter === "high"
                ? "bg-white text-rose-700 shadow-2xs"
                : "text-slate-600 hover:text-rose-700"
            }`}
          >
            High
          </button>
          <button
            type="button"
            onClick={() => setPriorityFilter("medium")}
            className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
              priorityFilter === "medium"
                ? "bg-white text-amber-700 shadow-2xs"
                : "text-slate-600 hover:text-amber-700"
            }`}
          >
            Medium
          </button>
          <button
            type="button"
            onClick={() => setPriorityFilter("low")}
            className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
              priorityFilter === "low"
                ? "bg-white text-slate-700 shadow-2xs"
                : "text-slate-600 hover:text-slate-700"
            }`}
          >
            Low
          </button>
        </div>
      </div>

      {/* Improvement Cards */}
      <div className="space-y-4">
        {filtered.map((item, idx) => {
          const style = getPriorityStyle(item.priority);
          return (
            <div
              key={idx}
              className={`p-5 rounded-xl border border-slate-200 bg-white border-l-4 ${style.border} shadow-2xs flex flex-col justify-between`}
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                    Section: {item.section}
                  </span>
                  <span
                    className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border ${style.pill}`}
                  >
                    {style.label}
                  </span>
                </div>

                {/* Problem */}
                <div className="flex items-start gap-2 text-xs text-slate-700 mb-2.5">
                  <AlertCircle className="h-4 w-4 text-slate-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-slate-900">Observed Issue:</strong> {item.issue}
                  </div>
                </div>

                {/* Exact Improvement */}
                <div className="p-3 rounded-lg bg-indigo-50/40 border border-indigo-100 text-xs text-slate-900 mb-2">
                  <div className="flex items-center gap-1.5 font-bold text-indigo-900 text-[11px] mb-1">
                    <CheckCircle2 className="h-3.5 w-3.5 text-indigo-600" />
                    Recommended Action:
                  </div>
                  <p className="leading-relaxed">{item.recommendation}</p>
                </div>
              </div>

              {/* Reason */}
              <div className="text-[11px] text-slate-500 pt-1">
                <strong className="text-slate-700">Recruiter Rationale:</strong> {item.reason}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
