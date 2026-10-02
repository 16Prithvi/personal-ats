"use client";

import React, { useState } from "react";
import { AnalysisResult } from "@/types/analysis";
import {
  Wand2,
  CheckCircle2,
  ArrowUpDown,
  FolderGit2,
  Briefcase,
  Sliders,
  Copy,
  Check,
  ShieldCheck,
  ShieldAlert,
  Tag,
  Square,
  CheckSquare,
  Sparkles,
} from "lucide-react";

interface ResumeOptimizerProps {
  data: AnalysisResult;
}

export const ResumeOptimizer: React.FC<ResumeOptimizerProps> = ({ data }) => {
  // State for copied bullet index
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  // State for interactive checklist
  const [checkedItems, setCheckedItems] = useState<Record<number, boolean>>({});

  // State for expandable evidence cards
  const [expandedEvidence, setExpandedEvidence] = useState<Record<string, boolean>>({});

  const toggleEvidence = (id: string) => {
    setExpandedEvidence((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleCopyBullet = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const toggleCheckItem = (idx: number) => {
    setCheckedItems((prev) => ({ ...prev, [idx]: !prev[idx] }));
  };

  // Compile High Priority items
  const highPriorityImprovements = (data.resumeImprovements || []).filter(
    (item) => item.priority === "high"
  );
  const highPriorityProjects = (data.projectAnalysis?.relevantProjects || []).filter(
    (proj) => proj.relevance === "High"
  );
  const shouldReorderSkills = data.skillsSectionAnalysis?.shouldReorder || [];
  const shouldBeMoreVisibleSkills = data.skillsSectionAnalysis?.shouldBeMoreVisible || [];
  const experienceRecs = data.experienceAnalysis?.recommendations || [];

  // Compile Medium Priority items
  const mediumPriorityImprovements = (data.resumeImprovements || []).filter(
    (item) => item.priority === "medium"
  );
  const mediumPriorityProjects = (data.projectAnalysis?.relevantProjects || []).filter(
    (proj) => proj.relevance === "Medium"
  );
  const deEmphasizeSkills = data.skillsSectionAnalysis?.irrelevantForJD || [];
  const keywordAdvice = data.keywordsToEmphasize || [];

  // Low priority items
  const lowPriorityImprovements = (data.resumeImprovements || []).filter(
    (item) => item.priority === "low"
  );

  // Top 3-6 Bullet improvements
  const selectedBullets = (data.bulletImprovements || []).slice(0, 6);

  // Do not add items
  const doNotAddList = data.doNotAdd || [];

  // Final Checklist items: Use actionPlan (trimmed to 8) or synthesize
  const rawChecklist = data.actionPlan && data.actionPlan.length > 0
    ? data.actionPlan.slice(0, 8)
    : [
        shouldReorderSkills.length > 0 ? `Reorder skills: ${shouldReorderSkills[0]}` : null,
        highPriorityProjects.length > 0 ? `Lead with ${highPriorityProjects[0].name} project` : null,
        selectedBullets.length > 0 ? "Apply targeted bullet point rewrites" : null,
        deEmphasizeSkills.length > 0 ? `Move less relevant skills lower in hierarchy` : null,
        doNotAddList.length > 0 ? `Verify no unsupported technologies are claimed` : null,
      ].filter(Boolean) as string[];

  const completedCount = Object.values(checkedItems).filter(Boolean).length;
  const checklistTotal = rawChecklist.length;

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-8 shadow-xs space-y-8">
      {/* Section Master Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-200/80">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200 mb-1.5">
            <Sparkles className="h-3.5 w-3.5 text-indigo-600" />
            <span>Actionable Edit Plan</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <Wand2 className="h-6 w-6 text-indigo-600" />
            RESUME OPTIMIZER
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Exact resume changes recommended for this job description. Optimized for truthful relevance, not keyword stuffing.
          </p>
        </div>

        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium text-slate-600 shrink-0">
          <ShieldCheck className="h-4 w-4 text-emerald-600" />
          <span>Factual Grounding Enforced</span>
        </div>
      </div>

      {/* ========================================================== */}
      {/* 1. HIGH PRIORITY RECOMMENDATIONS                           */}
      {/* ========================================================== */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-0.5 rounded-md text-xs font-bold uppercase tracking-wider bg-rose-50 text-rose-700 border border-rose-200">
            High Priority
          </span>
          <span className="text-xs text-slate-500 font-medium">
            Core adjustments with the highest impact on recruiter and ATS screening
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {/* Skills: Reorder & Make Prominent */}
          {(shouldReorderSkills.length > 0 || shouldBeMoreVisibleSkills.length > 0) && (
            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 mb-2 pb-2 border-b border-slate-200/60">
                  <ArrowUpDown className="h-4 w-4 text-indigo-600" />
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-900">
                    Skills Layout & Placement
                  </span>
                </div>
                <div className="space-y-2 text-xs">
                  {shouldReorderSkills.map((item, i) => (
                    <div key={i} className="flex items-start gap-2 text-slate-800">
                      <span className="font-bold text-rose-600 shrink-0">•</span>
                      <div>
                        <strong className="text-slate-900">Move to front:</strong> {item}
                      </div>
                    </div>
                  ))}
                  {shouldBeMoreVisibleSkills.map((item, i) => (
                    <div key={i} className="flex items-start gap-2 text-slate-800">
                      <span className="font-bold text-indigo-600 shrink-0">•</span>
                      <div>
                        <strong className="text-slate-900">Emphasize:</strong> {item}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="mt-3 pt-2 border-t border-slate-200/60 text-[11px] text-slate-500 italic">
                Why: Aligns your strongest matching capabilities directly with primary JD requirements.
              </div>
            </div>
          )}

          {/* Projects: Top Featured Showcase */}
          {highPriorityProjects.length > 0 && (
            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 mb-2 pb-2 border-b border-slate-200/60">
                  <FolderGit2 className="h-4 w-4 text-indigo-600" />
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-900">
                    Lead Project: {highPriorityProjects[0].name}
                  </span>
                </div>
                <p className="text-xs text-slate-800 leading-relaxed">
                  <strong className="text-slate-900">Action:</strong> Feature as project #1 on your resume. {highPriorityProjects[0].recommendation || "Highlight architectural scale and measurable throughput."}
                </p>
                <div className="flex flex-wrap gap-1 mt-2.5">
                  {highPriorityProjects[0].matchingTechnologies.map((tech, tIdx) => (
                    <span
                      key={tIdx}
                      className="px-2 py-0.5 rounded text-[10px] font-mono font-medium bg-white text-slate-700 border border-slate-200 shadow-2xs"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
              <div className="mt-3 pt-2 border-t border-slate-200/60 text-[11px] text-slate-500">
                <button
                  type="button"
                  onClick={() => toggleEvidence(`proj-${highPriorityProjects[0].name}`)}
                  className="text-indigo-600 hover:text-indigo-800 font-medium inline-flex items-center gap-1"
                >
                  <span>{expandedEvidence[`proj-${highPriorityProjects[0].name}`] ? "Hide Reason" : "▸ Why this project matters"}</span>
                </button>
                {expandedEvidence[`proj-${highPriorityProjects[0].name}`] && (
                  <p className="mt-1.5 p-2 rounded bg-white border border-slate-200 text-slate-700 text-[11px] leading-relaxed">
                    {highPriorityProjects[0].why}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* High Priority Structural / Content Improvements */}
          {highPriorityImprovements.map((item, idx) => (
            <div key={idx} className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 mb-2 pb-2 border-b border-slate-200/60">
                  <Sliders className="h-4 w-4 text-indigo-600" />
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-900">
                    Structure: {item.section}
                  </span>
                </div>
                <p className="text-xs text-slate-800 leading-relaxed">
                  <strong className="text-slate-900">Action:</strong> {item.recommendation}
                </p>
              </div>
              <div className="mt-3 pt-2 border-t border-slate-200/60 text-[11px] text-slate-500">
                <span className="font-semibold text-slate-700">Why:</span> {item.reason}
              </div>
            </div>
          ))}

          {/* Experience Phrasing / Highlights */}
          {experienceRecs.length > 0 && (
            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 mb-2 pb-2 border-b border-slate-200/60">
                  <Briefcase className="h-4 w-4 text-indigo-600" />
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-900">
                    Experience Context
                  </span>
                </div>
                <p className="text-xs text-slate-800 leading-relaxed">
                  <strong className="text-slate-900">Action:</strong> {experienceRecs[0]}
                </p>
              </div>
              <div className="mt-3 pt-2 border-t border-slate-200/60 text-[11px] text-slate-500">
                Why: Highlights relevant engineering scope without inventing phantom responsibilities.
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ========================================================== */}
      {/* 2. MEDIUM PRIORITY RECOMMENDATIONS                         */}
      {/* ========================================================== */}
      {(mediumPriorityImprovements.length > 0 || deEmphasizeSkills.length > 0 || keywordAdvice.length > 0) && (
        <div className="space-y-4 pt-3 border-t border-slate-100">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-md text-xs font-bold uppercase tracking-wider bg-amber-50 text-amber-700 border border-amber-200">
              Medium Priority
            </span>
            <span className="text-xs text-slate-500 font-medium">
              Refinements that strengthen nuance, keyword visibility, and layout balance
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
            {/* De-emphasize skills */}
            {deEmphasizeSkills.length > 0 && (
              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/30 flex flex-col justify-between">
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block mb-1">
                    Skills: De-emphasize Lower
                  </span>
                  <div className="space-y-1.5 text-xs text-slate-700">
                    {deEmphasizeSkills.map((skill, i) => (
                      <div key={i} className="flex items-start gap-1.5">
                        <span className="text-amber-500 font-bold">•</span>
                        <span>{skill}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <p className="mt-3 pt-2 border-t border-slate-200/60 text-[11px] text-slate-500 leading-snug">
                  Move lower in the skills block. Do not delete authentic capabilities.
                </p>
              </div>
            )}

            {/* Keyword Placement Advice */}
            {keywordAdvice.slice(0, 2).map((item, i) => (
              <div key={i} className="p-4 rounded-xl border border-slate-200 bg-slate-50/30 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-1.5 mb-1.5">
                    <Tag className="h-3.5 w-3.5 text-indigo-600" />
                    <span className="text-xs font-bold text-slate-900">
                      Keyword: {item.keyword}
                    </span>
                  </div>
                  <p className="text-xs text-slate-700 leading-relaxed">
                    <strong className="text-slate-900">Action:</strong> {item.recommendation}
                  </p>
                </div>
                <p className="mt-2.5 pt-2 border-t border-slate-200/60 text-[11px] text-slate-500">
                  <span className="font-semibold text-slate-700">JD Context:</span> {item.context}
                </p>
              </div>
            ))}

            {/* Medium Priority Projects */}
            {mediumPriorityProjects.slice(0, 2).map((proj, i) => (
              <div key={`med-proj-${i}`} className="p-4 rounded-xl border border-slate-200 bg-slate-50/30 flex flex-col justify-between">
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block mb-1">
                    Project: {proj.name}
                  </span>
                  <p className="text-xs text-slate-800 leading-relaxed">
                    <strong className="text-slate-900">Action:</strong> {proj.recommendation || `Emphasize ${proj.matchingTechnologies.join(", ")}`}
                  </p>
                </div>
                <p className="mt-2.5 pt-2 border-t border-slate-200/60 text-[11px] text-slate-500">
                  <span className="font-semibold text-slate-700">Why:</span> {proj.why}
                </p>
              </div>
            ))}

            {/* Structural Medium Improvements */}
            {mediumPriorityImprovements.slice(0, 2).map((item, i) => (
              <div key={i} className="p-4 rounded-xl border border-slate-200 bg-slate-50/30 flex flex-col justify-between">
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block mb-1">
                    {item.section}
                  </span>
                  <p className="text-xs text-slate-800 leading-relaxed">
                    <strong className="text-slate-900">Action:</strong> {item.recommendation}
                  </p>
                </div>
                <p className="mt-2.5 pt-2 border-t border-slate-200/60 text-[11px] text-slate-500">
                  <span className="font-semibold text-slate-700">Why:</span> {item.reason}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Low Priority Polish if any */}
      {lowPriorityImprovements.length > 0 && (
        <div className="space-y-3 pt-3 border-t border-slate-100">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-md text-xs font-bold uppercase tracking-wider bg-slate-100 text-slate-600 border border-slate-200">
              Low Priority Polish
            </span>
            <span className="text-xs text-slate-500 font-medium">
              Minor formatting and phrasing refinements
            </span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {lowPriorityImprovements.slice(0, 3).map((item, i) => (
              <div key={i} className="p-3 rounded-lg bg-slate-50/50 border border-slate-200/80 text-xs">
                <span className="font-bold text-slate-700 block mb-1 text-[11px]">{item.section}</span>
                <p className="text-slate-600 leading-relaxed">{item.recommendation}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================== */}
      {/* 3. TARGETED BULLET POINT REWRITES (Top 3–6)                */}
      {/* ========================================================== */}
      {selectedBullets.length > 0 && (
        <div className="space-y-4 pt-3 border-t border-slate-100">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-indigo-600" />
                Targeted Bullet Point Rewrites ({selectedBullets.length})
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Strengthens metrics, technical specificity, and action verbs using verified facts only
              </p>
            </div>
            <span className="text-[11px] text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200 self-start sm:self-auto font-medium">
              Zero hallucinated metrics
            </span>
          </div>

          <div className="space-y-3.5">
            {selectedBullets.map((item, idx) => (
              <div
                key={idx}
                className="rounded-xl border border-slate-200 bg-white shadow-2xs overflow-hidden"
              >
                {/* Section header */}
                <div className="bg-slate-50 px-3.5 py-2 border-b border-slate-200 flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-700">
                    Section: {item.section}
                  </span>
                  <span
                    className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded ${
                      item.priority === "high"
                        ? "bg-rose-50 text-rose-700 border border-rose-200"
                        : "bg-amber-50 text-amber-700 border border-amber-200"
                    }`}
                  >
                    {item.priority} priority
                  </span>
                </div>

                <div className="p-4 space-y-3">
                  {/* Current */}
                  <div className="p-3 rounded-lg bg-slate-50/70 border border-slate-200/80 text-xs text-slate-600">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                      Current Bullet:
                    </span>
                    <p className="italic leading-relaxed">{item.currentBullet}</p>
                  </div>

                  {/* Suggested */}
                  <div className="p-3 rounded-lg bg-emerald-50/40 border border-emerald-200 text-xs text-slate-900">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800">
                        Suggested High-Impact Bullet:
                      </span>
                      <button
                        type="button"
                        onClick={() => handleCopyBullet(item.suggestedBullet, idx)}
                        className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-white border border-emerald-200 px-2.5 py-1 rounded-md hover:bg-emerald-50 transition-colors shadow-2xs"
                      >
                        {copiedIndex === idx ? (
                          <>
                            <Check className="h-3 w-3 text-emerald-600" />
                            <span>Copied</span>
                          </>
                        ) : (
                          <>
                            <Copy className="h-3 w-3 text-slate-500" />
                            <span>Copy Bullet</span>
                          </>
                        )}
                      </button>
                    </div>
                    <p className="font-medium leading-relaxed text-slate-900">
                      {item.suggestedBullet}
                    </p>
                  </div>

                  <p className="text-[11px] text-slate-500 leading-snug">
                    <strong className="text-slate-700">Why this helps:</strong> {item.reason}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================== */}
      {/* 4. DO NOT ADD WITHOUT GENUINE EXPERIENCE                   */}
      {/* ========================================================== */}
      {doNotAddList.length > 0 && (
        <div className="p-4 sm:p-5 rounded-2xl bg-rose-50/40 border border-rose-200 space-y-3">
          <div className="flex items-center gap-2">
            <ShieldAlert className="h-5 w-5 text-rose-600 shrink-0" />
            <div>
              <h3 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-rose-900">
                Critical Guardrail: Do Not Add Without Genuine Experience
              </h3>
              <p className="text-[11px] text-rose-800/80">
                These technologies appear in the JD but have no genuine basis in your resume. Claiming experience you cannot defend in a technical interview will fail vetting.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 pt-1">
            {doNotAddList.map((item, idx) => (
              <div
                key={idx}
                className="bg-white rounded-xl border border-rose-200/80 p-3 text-xs flex flex-col justify-between shadow-2xs"
              >
                <div>
                  <span className="font-bold text-slate-900 block mb-1 text-xs">
                    {item.skill}
                  </span>
                  <p className="text-[11px] text-slate-600 leading-relaxed">
                    {item.reason}
                  </p>
                </div>
                <span className="mt-2 text-[10px] font-semibold text-rose-700 bg-rose-50 px-2 py-0.5 rounded border border-rose-200/60 self-start">
                  ⚠ Do not claim
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================== */}
      {/* 5. FINAL EDIT CHECKLIST                                    */}
      {/* ========================================================== */}
      <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/90 space-y-3.5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2.5 border-b border-slate-200">
          <div>
            <h3 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-slate-900 flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4 text-emerald-600" />
              Final Edit Checklist
            </h3>
            <p className="text-[11px] text-slate-500">
              Interactive task list of exact edits to complete before submitting this resume
            </p>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            <span className="text-xs font-semibold text-slate-700 font-mono">
              {completedCount} of {checklistTotal} done
            </span>
            <div className="w-20 bg-slate-200 rounded-full h-2 overflow-hidden">
              <div
                className="bg-indigo-600 h-full rounded-full transition-all duration-300"
                style={{
                  width: `${checklistTotal > 0 ? (completedCount / checklistTotal) * 100 : 0}%`,
                }}
              />
            </div>
          </div>
        </div>

        <div className="space-y-2">
          {rawChecklist.map((item, idx) => {
            const isDone = Boolean(checkedItems[idx]);
            return (
              <div
                key={idx}
                onClick={() => toggleCheckItem(idx)}
                className={`p-3 rounded-xl border transition-all cursor-pointer flex items-start gap-3 select-none ${
                  isDone
                    ? "bg-slate-100/70 border-slate-200 line-through text-slate-400 opacity-70"
                    : "bg-white border-slate-200 hover:border-indigo-300 text-slate-800"
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

                <span className="text-xs font-medium leading-relaxed flex-1">
                  {item}
                </span>

                {isDone && (
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    Done
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
