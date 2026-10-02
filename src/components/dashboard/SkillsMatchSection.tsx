"use client";

import React, { useState } from "react";
import { MatchedSkill, PartialMatch, NotMentionedSkill, MissingSkill } from "@/types/analysis";
import { CheckCircle2, CircleDashed, AlertTriangle, XCircle, Code2, FileText, Briefcase } from "lucide-react";

interface SkillsMatchSectionProps {
  matchedSkills: MatchedSkill[];
  partialMatches: PartialMatch[];
  notMentioned: NotMentionedSkill[];
  missingSkills: MissingSkill[];
}

type TabType = "all" | "explicit" | "partial" | "notMentioned" | "missing";

export const SkillsMatchSection: React.FC<SkillsMatchSectionProps> = ({
  matchedSkills,
  partialMatches,
  notMentioned,
  missingSkills,
}) => {
  const [activeTab, setActiveTab] = useState<TabType>("all");

  const totalSkills =
    matchedSkills.length +
    partialMatches.length +
    notMentioned.length +
    missingSkills.length;

  const renderImportanceBadge = (importance: "required" | "preferred" | "bonus") => {
    switch (importance) {
      case "required":
        return (
          <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-rose-50 text-rose-700 border border-rose-200">
            Required
          </span>
        );
      case "preferred":
        return (
          <span className="text-[10px] uppercase font-semibold tracking-wider px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200">
            Preferred
          </span>
        );
      default:
        return (
          <span className="text-[10px] uppercase font-medium tracking-wider px-2 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200">
            Bonus
          </span>
        );
    }
  };

  const renderCategoryBadge = (category?: string) => {
    if (!category) return null;
    const label =
      category === "technical"
        ? "Technical Skill"
        : category === "practice"
        ? "Engineering Practice"
        : category === "responsibility"
        ? "Responsibility"
        : category === "soft_skill"
        ? "Soft Skill"
        : "Eligibility";
    return (
      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200">
        {label}
      </span>
    );
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 p-6 md:p-8 shadow-xs">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-100">
        <div>
          <h2 className="text-lg font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Code2 className="h-5 w-5 text-indigo-600" />
            Skills & Requirements Match Matrix
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Verified across 4 strict evidence states. Compares exact JD requirements directly with verbatim resume evidence.
          </p>
        </div>

        {/* Tab Filter Pills (Requirement 3: Four Evidence States) */}
        <div className="flex flex-wrap gap-1.5 p-1 bg-slate-100 rounded-xl">
          <button
            type="button"
            onClick={() => setActiveTab("all")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === "all"
                ? "bg-white text-slate-900 shadow-2xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            All ({totalSkills})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("explicit")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
              activeTab === "explicit"
                ? "bg-white text-emerald-800 shadow-2xs"
                : "text-slate-600 hover:text-emerald-700"
            }`}
          >
            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
            <span>Explicit Match ({matchedSkills.length})</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("partial")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
              activeTab === "partial"
                ? "bg-white text-blue-800 shadow-2xs"
                : "text-slate-600 hover:text-blue-700"
            }`}
          >
            <CircleDashed className="h-3.5 w-3.5 text-blue-600" />
            <span>Partial / Related ({partialMatches.length})</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("notMentioned")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
              activeTab === "notMentioned"
                ? "bg-white text-amber-800 shadow-2xs"
                : "text-slate-600 hover:text-amber-700"
            }`}
          >
            <AlertTriangle className="h-3.5 w-3.5 text-amber-600" />
            <span>Not Mentioned ({notMentioned.length})</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("missing")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
              activeTab === "missing"
                ? "bg-white text-rose-800 shadow-2xs"
                : "text-slate-600 hover:text-rose-700"
            }`}
          >
            <XCircle className="h-3.5 w-3.5 text-rose-600" />
            <span>Missing ({missingSkills.length})</span>
          </button>
        </div>
      </div>

      {/* Grid of Skill Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
        {/* Explicit Matches */}
        {(activeTab === "all" || activeTab === "explicit") &&
          matchedSkills.map((item, idx) => (
            <div
              key={`match-${idx}`}
              className="p-4 rounded-xl border border-emerald-200/80 bg-emerald-50/20 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                    <span className="font-semibold text-sm text-slate-900">
                      {item.skill}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    {renderCategoryBadge(item.category)}
                    {renderImportanceBadge(item.importance)}
                  </div>
                </div>

                {/* JD Evidence Quote */}
                {item.jd_evidence && (
                  <div className="mt-2 text-xs text-slate-600 bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                    <span className="font-semibold text-slate-700 flex items-center gap-1 text-[11px] mb-0.5">
                      <Briefcase className="h-3 w-3 text-slate-500" />
                      JD Requirement:
                    </span>
                    <p className="italic">&ldquo;{item.jd_evidence}&rdquo;</p>
                  </div>
                )}

                {/* Verbatim Resume Evidence Quote (Requirement 1 & 16) */}
                <div className="mt-2 text-xs text-emerald-950 bg-white p-2.5 rounded-lg border border-emerald-200 shadow-2xs">
                  <span className="font-bold text-emerald-800 flex items-center gap-1 text-[11px] mb-0.5">
                    <FileText className="h-3 w-3 text-emerald-600" />
                    Resume Evidence (Verbatim Excerpt):
                  </span>
                  <p className="font-medium leading-relaxed">
                    &ldquo;{item.resume_evidence || item.evidence}&rdquo;
                  </p>
                </div>
              </div>
            </div>
          ))}

        {/* Partial Matches */}
        {(activeTab === "all" || activeTab === "partial") &&
          partialMatches.map((item, idx) => (
            <div
              key={`partial-${idx}`}
              className="p-4 rounded-xl border border-blue-200/80 bg-blue-50/20 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <CircleDashed className="h-4 w-4 text-blue-600 shrink-0" />
                    <span className="font-semibold text-sm text-slate-900">
                      {item.skill}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    {renderCategoryBadge(item.category)}
                    {renderImportanceBadge(item.importance)}
                  </div>
                </div>

                {/* JD Evidence */}
                {item.jd_evidence && (
                  <div className="mt-2 text-xs text-slate-600 bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                    <span className="font-semibold text-slate-700 flex items-center gap-1 text-[11px] mb-0.5">
                      <Briefcase className="h-3 w-3 text-slate-500" />
                      JD Requirement:
                    </span>
                    <p className="italic">&ldquo;{item.jd_evidence}&rdquo;</p>
                  </div>
                )}

                {/* Resume Evidence */}
                <div className="mt-2 text-xs text-blue-950 bg-white p-2.5 rounded-lg border border-blue-200">
                  <span className="font-bold text-blue-800 flex items-center gap-1 text-[11px] mb-0.5">
                    <FileText className="h-3 w-3 text-blue-600" />
                    Adjacent Resume Evidence:
                  </span>
                  <p className="leading-relaxed font-medium">
                    &ldquo;{item.resume_evidence || item.resumeEvidence}&rdquo;
                  </p>
                </div>

                {/* Why it's partial */}
                <p className="text-[11px] text-slate-600 mt-2 bg-blue-50/60 p-2 rounded border border-blue-100">
                  <strong>Assessment:</strong> {item.explanation}
                </p>
              </div>
            </div>
          ))}

        {/* Not Mentioned */}
        {(activeTab === "all" || activeTab === "notMentioned") &&
          notMentioned.map((item, idx) => (
            <div
              key={`notMentioned-${idx}`}
              className="p-4 rounded-xl border border-amber-200/80 bg-amber-50/20 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-amber-600 shrink-0" />
                    <span className="font-semibold text-sm text-slate-900">
                      {item.skill}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    {renderCategoryBadge(item.category)}
                    {renderImportanceBadge(item.importance)}
                  </div>
                </div>

                {/* JD Evidence */}
                {item.jd_evidence && (
                  <div className="mt-2 text-xs text-slate-600 bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                    <span className="font-semibold text-slate-700 flex items-center gap-1 text-[11px] mb-0.5">
                      <Briefcase className="h-3 w-3 text-slate-500" />
                      JD Requirement:
                    </span>
                    <p className="italic">&ldquo;{item.jd_evidence}&rdquo;</p>
                  </div>
                )}

                {/* Resume Status */}
                <div className="mt-2 text-xs text-amber-950 bg-white p-2.5 rounded-lg border border-amber-200">
                  <span className="font-bold text-amber-800 flex items-center gap-1 text-[11px] mb-0.5">
                    <FileText className="h-3 w-3 text-amber-600" />
                    Resume Evidence:
                  </span>
                  <p className="italic text-slate-500">
                    {item.resume_evidence || "Not mentioned in resume"}
                  </p>
                </div>

                <p className="text-[11px] text-slate-600 mt-2 bg-amber-50/60 p-2 rounded border border-amber-100">
                  <strong>Assessment:</strong> {item.explanation}
                </p>
              </div>
            </div>
          ))}

        {/* Missing Skills */}
        {(activeTab === "all" || activeTab === "missing") &&
          missingSkills.map((item, idx) => (
            <div
              key={`missing-${idx}`}
              className="p-4 rounded-xl border border-rose-200/80 bg-rose-50/20 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <XCircle className="h-4 w-4 text-rose-600 shrink-0" />
                    <span className="font-semibold text-sm text-slate-900">
                      {item.skill}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    {renderCategoryBadge(item.category)}
                    {renderImportanceBadge(item.importance)}
                  </div>
                </div>

                {/* JD Evidence */}
                {item.jd_evidence && (
                  <div className="mt-2 text-xs text-slate-600 bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                    <span className="font-semibold text-slate-700 flex items-center gap-1 text-[11px] mb-0.5">
                      <Briefcase className="h-3 w-3 text-slate-500" />
                      JD Requirement:
                    </span>
                    <p className="italic">&ldquo;{item.jd_evidence}&rdquo;</p>
                  </div>
                )}

                {/* Resume Status */}
                <div className="mt-2 text-xs text-rose-950 bg-white p-2.5 rounded-lg border border-rose-200">
                  <span className="font-bold text-rose-800 flex items-center gap-1 text-[11px] mb-0.5">
                    <FileText className="h-3 w-3 text-rose-600" />
                    Resume Evidence:
                  </span>
                  <p className="italic text-slate-500">
                    {item.resume_evidence || "No evidence found in resume"}
                  </p>
                </div>

                <p className="text-[11px] text-slate-600 mt-2 bg-rose-50/60 p-2 rounded border border-rose-100">
                  <strong>Assessment:</strong> {item.explanation}
                </p>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};
