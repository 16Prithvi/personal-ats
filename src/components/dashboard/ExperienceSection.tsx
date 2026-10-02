"use client";

import React from "react";
import { ExperienceAnalysis } from "@/types/analysis";
import { Briefcase, CheckCircle2, AlertTriangle, ArrowRight, Award } from "lucide-react";

interface ExperienceSectionProps {
  experience: ExperienceAnalysis;
}

export const ExperienceSection: React.FC<ExperienceSectionProps> = ({ experience }) => {
  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 p-6 md:p-8 shadow-xs space-y-6">
      {/* Header with Relevance Score */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-100">
        <div>
          <h2 className="text-lg font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Briefcase className="h-5 w-5 text-indigo-600" />
            Professional Experience Relevance
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Evaluates past roles, seniority trajectory, and direct responsibility overlap
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right">
            <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block">
              Experience Score
            </span>
            <span className="text-xs font-medium text-slate-600">
              Seniority & Scope Match
            </span>
          </div>
          <div className="h-12 w-12 rounded-xl bg-slate-900 text-white font-mono font-bold text-lg flex items-center justify-center shadow-2xs">
            {experience.score}
          </div>
        </div>
      </div>

      {/* Matching Responsibilities */}
      {experience.matchingResponsibilities.length > 0 && (
        <div>
          <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-3 flex items-center gap-1.5">
            <Award className="h-4 w-4 text-emerald-600" />
            Directly Matched Job Responsibilities
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
            {experience.matchingResponsibilities.map((resp, idx) => (
              <div
                key={idx}
                className="p-3 rounded-xl bg-emerald-50/40 border border-emerald-200/70 text-xs text-slate-800 flex items-start gap-2.5"
              >
                <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>{resp}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Strengths & Weaknesses 2-Column Split */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Strengths */}
        <div className="p-5 rounded-xl border border-slate-200 bg-slate-50/50">
          <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3 flex items-center gap-1.5">
            <CheckCircle2 className="h-4 w-4 text-emerald-600" />
            Demonstrated Strengths
          </h3>
          <ul className="space-y-2">
            {experience.strengths.map((str, idx) => (
              <li key={idx} className="text-xs text-slate-700 flex items-start gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                <span>{str}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Weaknesses */}
        <div className="p-5 rounded-xl border border-slate-200 bg-slate-50/50">
          <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3 flex items-center gap-1.5">
            <AlertTriangle className="h-4 w-4 text-amber-600" />
            Areas with Light Evidence
          </h3>
          <ul className="space-y-2">
            {experience.weaknesses.map((weak, idx) => (
              <li key={idx} className="text-xs text-slate-700 flex items-start gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-amber-500 mt-1.5 shrink-0" />
                <span>{weak}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Actionable Recommendations */}
      {experience.recommendations.length > 0 && (
        <div className="pt-2">
          <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3 flex items-center gap-1.5">
            <ArrowRight className="h-4 w-4 text-indigo-600" />
            Experience Recommendations
          </h3>
          <div className="space-y-2">
            {experience.recommendations.map((rec, idx) => (
              <div
                key={idx}
                className="p-3 rounded-xl bg-indigo-50/40 border border-indigo-100 text-xs text-slate-800 flex items-start gap-2"
              >
                <span className="font-mono text-[10px] font-bold text-indigo-600 bg-white border border-indigo-200 px-1.5 py-0.5 rounded shrink-0">
                  {idx + 1}
                </span>
                <span>{rec}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
