"use client";

import React from "react";
import { SkillsSectionAnalysis as SkillsSectionType } from "@/types/analysis";
import { Layers, CheckCircle2, ArrowUpDown, Eye, EyeOff, ShieldCheck } from "lucide-react";

interface SkillsSectionAnalysisProps {
  analysis: SkillsSectionType;
}

export const SkillsSectionAnalysis: React.FC<SkillsSectionAnalysisProps> = ({ analysis }) => {
  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 p-6 md:p-8 shadow-xs space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-100">
        <div>
          <h2 className="text-lg font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Layers className="h-5 w-5 text-indigo-600" />
            Skills Section Layout & Reordering Audit
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Optimizes the visual hierarchy of your resume&apos;s technical skills block
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right">
            <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block">
              Alignment Score
            </span>
            <span className="text-xs font-medium text-slate-600">
              Skills Hierarchy
            </span>
          </div>
          <div className="h-12 w-12 rounded-xl bg-slate-900 text-white font-mono font-bold text-lg flex items-center justify-center shadow-2xs">
            {analysis.score}
          </div>
        </div>
      </div>

      {/* Guardrail Note */}
      <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-start gap-2.5 text-xs text-slate-600">
        <ShieldCheck className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
        <div>
          <strong className="text-slate-800">Ethical ATS Rule:</strong> Never delete authentic, legitimate skills from your resume solely to cater to a single ATS posting. Instead, restructure the layout so the most relevant skills are front and center.
        </div>
      </div>

      {/* 4 Categorized Boxes */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Already Aligned */}
        <div className="p-5 rounded-xl border border-emerald-200/80 bg-emerald-50/20">
          <h3 className="text-xs font-bold text-emerald-900 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
            Already Well Aligned
          </h3>
          <ul className="space-y-1.5">
            {analysis.alreadyAligned.map((item, idx) => (
              <li key={idx} className="text-xs text-slate-700 flex items-start gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Should Reorder / Move to Front */}
        <div className="p-5 rounded-xl border border-indigo-200/80 bg-indigo-50/20">
          <h3 className="text-xs font-bold text-indigo-900 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
            <ArrowUpDown className="h-3.5 w-3.5 text-indigo-600" />
            Should Reorder (Move to Front)
          </h3>
          <ul className="space-y-1.5">
            {analysis.shouldReorder.map((item, idx) => (
              <li key={idx} className="text-xs text-slate-700 flex items-start gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-indigo-500 mt-1.5 shrink-0" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Should Be More Visible */}
        <div className="p-5 rounded-xl border border-blue-200/80 bg-blue-50/20">
          <h3 className="text-xs font-bold text-blue-900 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
            <Eye className="h-3.5 w-3.5 text-blue-600" />
            Make More Prominent
          </h3>
          <ul className="space-y-1.5">
            {analysis.shouldBeMoreVisible.map((item, idx) => (
              <li key={idx} className="text-xs text-slate-700 flex items-start gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-blue-500 mt-1.5 shrink-0" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Irrelevant / Tangential for this JD */}
        <div className="p-5 rounded-xl border border-slate-200 bg-slate-50/50">
          <h3 className="text-xs font-bold text-slate-600 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
            <EyeOff className="h-3.5 w-3.5 text-slate-400" />
            Tangential to this Specific Role
          </h3>
          <ul className="space-y-1.5">
            {analysis.irrelevantForJD.map((item, idx) => (
              <li key={idx} className="text-xs text-slate-500 flex items-start gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-slate-400 mt-1.5 shrink-0" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Strategic Recommendations */}
      {analysis.recommendations.length > 0 && (
        <div className="pt-2">
          <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2.5">
            Recommendations for Skills Formatting
          </h3>
          <div className="space-y-2">
            {analysis.recommendations.map((rec, idx) => (
              <div
                key={idx}
                className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700 flex items-start gap-2"
              >
                <span className="font-mono text-[10px] font-bold text-slate-600 bg-white border border-slate-200 px-1.5 py-0.5 rounded shrink-0">
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
