"use client";

import React from "react";
import { ProjectAnalysis } from "@/types/analysis";
import { FolderGit2, Sparkles, CheckCircle2, ArrowRight } from "lucide-react";

interface ProjectsSectionProps {
  projects: ProjectAnalysis;
}

export const ProjectsSection: React.FC<ProjectsSectionProps> = ({ projects }) => {
  const getRelevanceBadge = (relevance: "High" | "Medium" | "Low") => {
    switch (relevance) {
      case "High":
        return (
          <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 border border-emerald-300">
            Relevance: High
          </span>
        );
      case "Medium":
        return (
          <span className="text-[10px] uppercase font-semibold tracking-wider px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200">
            Relevance: Medium
          </span>
        );
      default:
        return (
          <span className="text-[10px] uppercase font-medium tracking-wider px-2 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200">
            Relevance: Low
          </span>
        );
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 p-6 md:p-8 shadow-xs space-y-6">
      {/* Header with Project Score */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-100">
        <div>
          <h2 className="text-lg font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <FolderGit2 className="h-5 w-5 text-indigo-600" />
            Project Relevance & Showcase Strategy
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Pinpoints which projects provide direct architectural proof of your qualifications
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right">
            <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block">
              Project Match
            </span>
            <span className="text-xs font-medium text-slate-600">
              Technical Depth
            </span>
          </div>
          <div className="h-12 w-12 rounded-xl bg-slate-900 text-white font-mono font-bold text-lg flex items-center justify-center shadow-2xs">
            {projects.score}
          </div>
        </div>
      </div>

      {/* Relevant Projects List */}
      <div className="space-y-4">
        {projects.relevantProjects.map((proj, idx) => (
          <div
            key={idx}
            className="p-5 rounded-xl border border-slate-200 bg-slate-50/40 hover:border-slate-300 transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-indigo-600" />
                  {proj.name}
                </h3>
                {getRelevanceBadge(proj.relevance)}
              </div>

              {/* Matching Tech Tags */}
              <div className="flex flex-wrap gap-1.5 my-2.5">
                {proj.matchingTechnologies.map((tech, tIdx) => (
                  <span
                    key={tIdx}
                    className="text-[11px] font-mono px-2 py-0.5 rounded-md bg-white border border-slate-200 text-slate-700 shadow-2xs"
                  >
                    {tech}
                  </span>
                ))}
              </div>

              {/* Why it matches */}
              <div className="mt-3 text-xs text-slate-700 leading-relaxed bg-white p-3 rounded-lg border border-slate-200/80">
                <span className="font-semibold text-slate-900 block text-[11px] mb-1">
                  Why this project matters to the JD:
                </span>
                {proj.why}
              </div>
            </div>

            {/* Recommended Emphasis */}
            <div className="mt-3 pt-3 border-t border-slate-200/70 flex items-start gap-2 text-xs text-indigo-900 bg-indigo-50/50 p-3 rounded-lg border border-indigo-100">
              <Sparkles className="h-4 w-4 text-indigo-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold block text-[11px] text-indigo-800 mb-0.5">
                  Recommended Emphasis:
                </span>
                {proj.recommendation}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Overall Project Recommendations */}
      {projects.recommendations.length > 0 && (
        <div className="pt-2">
          <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3 flex items-center gap-1.5">
            <ArrowRight className="h-4 w-4 text-indigo-600" />
            General Project Advice
          </h3>
          <div className="space-y-2">
            {projects.recommendations.map((rec, idx) => (
              <div
                key={idx}
                className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700 flex items-start gap-2"
              >
                <CheckCircle2 className="h-4 w-4 text-slate-400 shrink-0 mt-0.5" />
                <span>{rec}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
