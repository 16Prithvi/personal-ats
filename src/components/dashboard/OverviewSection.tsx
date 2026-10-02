"use client";

import React, { useState } from "react";
import { AnalysisResult } from "@/types/analysis";
import { getReadinessTier, SCORE_WEIGHTS } from "@/lib/scoring";
import {
  CheckCircle2,
  AlertTriangle,
  Lightbulb,
  Building2,
  Briefcase,
  ShieldAlert,
  Code2,
  GraduationCap,
  FileCheck2,
  ChevronDown,
  ChevronUp,
  XCircle,
  FolderGit2,
  Tag,
  Target,
  Award,
} from "lucide-react";

interface OverviewSectionProps {
  data: AnalysisResult;
}

export const OverviewSection: React.FC<OverviewSectionProps> = ({ data }) => {
  const [showDetailedScores, setShowDetailedScores] = useState<boolean>(false);
  const readiness = getReadinessTier(data.overallScore, data.hardRequirementsMet);

  const detailedScoreCards = [
    { label: "Skills Match", value: data.sectionScores.skillsMatch, weight: SCORE_WEIGHTS.skillsMatch.percentage, icon: Code2 },
    { label: "Experience", value: data.sectionScores.experienceMatch, weight: SCORE_WEIGHTS.experienceMatch.percentage, icon: Briefcase },
    { label: "Projects", value: data.sectionScores.projectMatch, weight: SCORE_WEIGHTS.projectMatch.percentage, icon: FolderGit2 },
    { label: "Keywords", value: data.sectionScores.keywordCoverage, weight: SCORE_WEIGHTS.keywordCoverage.percentage, icon: Tag },
    { label: "ATS Readability", value: data.sectionScores.atsReadability, weight: SCORE_WEIGHTS.atsReadability.percentage, icon: FileCheck2 },
    { label: "Title Alignment", value: data.sectionScores.jobTitleAlignment, weight: SCORE_WEIGHTS.jobTitleAlignment.percentage, icon: Target },
    { label: "Education", value: data.sectionScores.educationMatch, weight: SCORE_WEIGHTS.educationMatch.percentage, icon: GraduationCap },
    { label: "Impact & Evidence", value: data.sectionScores.impactAndEvidence, weight: SCORE_WEIGHTS.impactAndEvidence.percentage, icon: Award },
  ];

  return (
    <div className="space-y-5">
      {/* Top Hero Score Card */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-7 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-5">
          {/* Left: Job Meta & Title */}
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-0.5 rounded-md bg-slate-100 text-slate-700 border border-slate-200">
                <Briefcase className="h-3 w-3 text-slate-500" />
                {data.jobOverview.role}
              </span>
              {data.jobOverview.company && data.jobOverview.company !== "Not specified" && (
                <span className="inline-flex items-center gap-1 text-xs font-medium px-2.5 py-0.5 rounded-md bg-slate-50 text-slate-600 border border-slate-200">
                  <Building2 className="h-3 w-3 text-slate-400" />
                  {data.jobOverview.company}
                </span>
              )}
              <span className="text-xs text-slate-400 font-mono">
                {data.jobOverview.seniority}
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Resume Match Analysis
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed max-w-3xl">
              {data.summary}
            </p>

            {/* Hard Requirement Warning Banner if unmet */}
            {(!data.hardRequirementsMet || data.hardRequirementWarning) && (
              <div className="mt-3.5 p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-900 flex items-start gap-2.5 shadow-2xs">
                <ShieldAlert className="h-4 w-4 text-rose-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-rose-950 block text-xs">
                    Mandatory Hard Requirement Unmet
                  </span>
                  <p className="leading-relaxed text-[11px] mt-0.5 text-rose-800">
                    {data.hardRequirementWarning ||
                      "One or more essential eligibility criteria are not satisfied by this resume. This presents a key ATS screening barrier."}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Right: Big Overall Job Fit Score */}
          <div className="flex flex-row lg:flex-col items-center justify-between lg:items-end gap-4 lg:gap-1.5 shrink-0 bg-slate-50 p-4 sm:p-5 rounded-2xl border border-slate-200/80 min-w-[200px]">
            <div className="text-left lg:text-right">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block">
                Overall Job Fit
              </span>
              <div className="flex items-baseline gap-1 font-mono mt-0.5">
                <span className="text-4xl sm:text-5xl font-black tracking-tight text-slate-900">
                  {data.overallScore}
                </span>
                <span className="text-sm font-semibold text-slate-400">/ 100</span>
              </div>
            </div>

            <div className="flex flex-col items-end">
              <span
                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${readiness.badgeClass}`}
              >
                {data.applicationReadiness.level || readiness.level}
              </span>
            </div>
          </div>
        </div>

        {/* 3 Core Pillar Score Row */}
        <div className="mt-5 pt-5 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* Technical Match */}
          <div className="p-3.5 rounded-xl border border-slate-200/80 bg-slate-50/50 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="p-1.5 rounded-lg bg-indigo-50 text-indigo-700">
                <Code2 className="h-4 w-4" />
              </div>
              <div>
                <span className="text-xs font-bold text-slate-800 block">
                  Technical Match
                </span>
                <span className="text-[10px] text-slate-400">
                  Skills & stack overlap
                </span>
              </div>
            </div>
            <span className="text-lg font-bold font-mono text-slate-900 bg-white px-2 py-0.5 rounded-lg border border-slate-200 shadow-2xs">
              {data.technicalMatch ?? data.sectionScores.skillsMatch}/100
            </span>
          </div>

          {/* Eligibility Match */}
          <div className="p-3.5 rounded-xl border border-slate-200/80 bg-slate-50/50 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div
                className={`p-1.5 rounded-lg ${
                  data.hardRequirementsMet
                    ? "bg-emerald-50 text-emerald-700"
                    : "bg-rose-50 text-rose-700"
                }`}
              >
                <GraduationCap className="h-4 w-4" />
              </div>
              <div>
                <span className="text-xs font-bold text-slate-800 block">
                  Eligibility Match
                </span>
                <span className="text-[10px] text-slate-400">
                  Years & mandatory criteria
                </span>
              </div>
            </div>
            <span
              className={`text-lg font-bold font-mono px-2 py-0.5 rounded-lg border shadow-2xs ${
                data.hardRequirementsMet
                  ? "text-slate-900 bg-white border-slate-200"
                  : "text-rose-700 bg-rose-50 border-rose-200"
              }`}
            >
              {data.eligibilityMatch ?? data.sectionScores.experienceMatch}/100
            </span>
          </div>

          {/* Resume Quality */}
          <div className="p-3.5 rounded-xl border border-slate-200/80 bg-slate-50/50 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="p-1.5 rounded-lg bg-blue-50 text-blue-700">
                <FileCheck2 className="h-4 w-4" />
              </div>
              <div>
                <span className="text-xs font-bold text-slate-800 block">
                  Resume Quality
                </span>
                <span className="text-[10px] text-slate-400">
                  ATS readability & evidence
                </span>
              </div>
            </div>
            <span className="text-lg font-bold font-mono text-slate-900 bg-white px-2 py-0.5 rounded-lg border border-slate-200 shadow-2xs">
              {data.resumeQuality ?? data.sectionScores.atsReadability}/100
            </span>
          </div>
        </div>

        {/* Compact Mandatory Requirements Table */}
        {data.hardRequirements && data.hardRequirements.length > 0 && (
          <div className="mt-5 pt-4 border-t border-slate-100">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-600">
                Mandatory Requirements Verification
              </span>
              <span className="text-[10px] text-slate-400">
                Requirement | Status | Evidence
              </span>
            </div>

            <div className="border border-slate-200 rounded-xl overflow-hidden divide-y divide-slate-100 text-xs">
              {data.hardRequirements.map((req, rIdx) => (
                <div
                  key={rIdx}
                  className={`p-2.5 sm:px-3.5 sm:py-2 flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 sm:gap-4 ${
                    req.isMet ? "bg-white" : "bg-rose-50/40"
                  }`}
                >
                  <div className="flex items-center gap-2 min-w-[200px] sm:w-1/3">
                    {req.isMet ? (
                      <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                    ) : (
                      <XCircle className="h-4 w-4 text-rose-600 shrink-0" />
                    )}
                    <span className="font-semibold text-slate-900 text-xs">
                      {req.requirement}
                    </span>
                  </div>

                  <div className="sm:w-28 shrink-0">
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                        req.isMet
                          ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                          : "bg-rose-100 text-rose-800 border border-rose-200"
                      }`}
                    >
                      {req.isMet ? "Verified Met" : "Not Met"}
                    </span>
                  </div>

                  <div className="flex-1 text-[11px] text-slate-500 sm:text-right">
                    {req.isMet ? req.resumeEvidence : req.gapExplanation}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Optional Collapsible 8-Pillar Scoring Breakdown */}
        <div className="mt-4 pt-3 border-t border-slate-100">
          <button
            type="button"
            onClick={() => setShowDetailedScores(!showDetailedScores)}
            className="text-[11px] font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 transition-colors"
          >
            {showDetailedScores ? (
              <>
                <ChevronUp className="h-3.5 w-3.5" />
                <span>Hide Detailed 8-Pillar Scores</span>
              </>
            ) : (
              <>
                <ChevronDown className="h-3.5 w-3.5" />
                <span>View Detailed 8-Pillar Scoring Breakdown</span>
              </>
            )}
          </button>

          {showDetailedScores && (
            <div className="mt-3 grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-2 border-t border-slate-100">
              {detailedScoreCards.map((sc, i) => (
                <div key={i} className="p-2.5 rounded-lg bg-slate-50 border border-slate-200/80 text-xs">
                  <div className="flex items-center justify-between text-slate-500 mb-1">
                    <span className="text-[10px] uppercase font-bold">{sc.label}</span>
                    <span className="text-[10px] font-mono">{sc.weight}%</span>
                  </div>
                  <div className="text-base font-bold font-mono text-slate-900">
                    {sc.value}/100
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* 3 Strategic Columns: Strongest Areas, Key Gaps, Top Priority Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
        {/* Strongest Areas */}
        <div className="bg-white rounded-xl border border-slate-200/90 p-4 shadow-2xs flex flex-col">
          <div className="flex items-center gap-1.5 mb-2.5 pb-2 border-b border-slate-100">
            <CheckCircle2 className="h-4 w-4 text-emerald-600" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900">
              Strongest Areas
            </h3>
          </div>
          <ul className="space-y-1.5 flex-1">
            {data.strongestAreas.map((area, idx) => (
              <li key={idx} className="text-xs text-slate-700 flex items-start gap-2 leading-snug">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                <span>{area}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Key Gaps */}
        <div className="bg-white rounded-xl border border-slate-200/90 p-4 shadow-2xs flex flex-col">
          <div className="flex items-center gap-1.5 mb-2.5 pb-2 border-b border-slate-100">
            <AlertTriangle className="h-4 w-4 text-amber-600" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900">
              Key Gaps & Unverified
            </h3>
          </div>
          <ul className="space-y-1.5 flex-1">
            {data.biggestGaps.map((gap, idx) => (
              <li key={idx} className="text-xs text-slate-700 flex items-start gap-2 leading-snug">
                <span className="h-1.5 w-1.5 rounded-full bg-amber-500 mt-1.5 shrink-0" />
                <span>{gap}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Top Priority Actions */}
        <div className="bg-white rounded-xl border border-slate-200/90 p-4 shadow-2xs flex flex-col">
          <div className="flex items-center gap-1.5 mb-2.5 pb-2 border-b border-slate-100">
            <Lightbulb className="h-4 w-4 text-indigo-600" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900">
              Top Priority Actions
            </h3>
          </div>
          <ul className="space-y-2 flex-1">
            {data.topRecommendations.map((rec, idx) => (
              <li key={idx} className="text-xs text-slate-700 flex items-start gap-2 leading-snug">
                <span className="font-mono text-[10px] font-bold text-indigo-600 bg-indigo-50 border border-indigo-200 px-1 rounded shrink-0">
                  {idx + 1}
                </span>
                <span>{rec}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

