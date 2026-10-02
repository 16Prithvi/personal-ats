"use client";

import React from "react";
import { SectionScores } from "@/types/analysis";
import { SCORE_WEIGHTS } from "@/lib/scoring";
import {
  FileCheck2,
  Code2,
  Briefcase,
  FolderGit2,
  Tag,
  GraduationCap,
  Target,
  Award,
} from "lucide-react";

interface ScoreCardsGridProps {
  scores: SectionScores;
}

export const ScoreCardsGrid: React.FC<ScoreCardsGridProps> = ({ scores }) => {
  const cards = [
    {
      key: "skillsMatch",
      label: "Skills Match",
      value: scores.skillsMatch,
      weight: SCORE_WEIGHTS.skillsMatch.percentage,
      icon: Code2,
      description: "Required & preferred technical stack overlap",
    },
    {
      key: "experienceMatch",
      label: "Experience",
      value: scores.experienceMatch,
      weight: SCORE_WEIGHTS.experienceMatch.percentage,
      icon: Briefcase,
      description: "Seniority & responsibilities alignment",
    },
    {
      key: "projectMatch",
      label: "Projects",
      value: scores.projectMatch,
      weight: SCORE_WEIGHTS.projectMatch.percentage,
      icon: FolderGit2,
      description: "Technical depth in demonstrated projects",
    },
    {
      key: "keywordCoverage",
      label: "Keywords",
      value: scores.keywordCoverage,
      weight: SCORE_WEIGHTS.keywordCoverage.percentage,
      icon: Tag,
      description: "Contextual industry terminology coverage",
    },
    {
      key: "atsReadability",
      label: "ATS Readability",
      value: scores.atsReadability,
      weight: SCORE_WEIGHTS.atsReadability.percentage,
      icon: FileCheck2,
      description: "Layout structure, headers & text parseability",
    },
    {
      key: "jobTitleAlignment",
      label: "Title Alignment",
      value: scores.jobTitleAlignment,
      weight: SCORE_WEIGHTS.jobTitleAlignment.percentage,
      icon: Target,
      description: "Target title vs current title & trajectory",
    },
    {
      key: "educationMatch",
      label: "Education",
      value: scores.educationMatch,
      weight: SCORE_WEIGHTS.educationMatch.percentage,
      icon: GraduationCap,
      description: "Degree, field of study & credentials",
    },
    {
      key: "impactAndEvidence",
      label: "Impact & Evidence",
      value: scores.impactAndEvidence,
      weight: SCORE_WEIGHTS.impactAndEvidence.percentage,
      icon: Award,
      description: "Quantified outcomes and verified metrics",
    },
  ];

  const getScoreColor = (val: number) => {
    if (val >= 85) return "text-emerald-700 bg-emerald-50 border-emerald-200";
    if (val >= 70) return "text-blue-700 bg-blue-50 border-blue-200";
    if (val >= 55) return "text-amber-700 bg-amber-50 border-amber-200";
    return "text-rose-700 bg-rose-50 border-rose-200";
  };

  const getBarColor = (val: number) => {
    if (val >= 85) return "bg-emerald-500";
    if (val >= 70) return "bg-blue-500";
    if (val >= 55) return "bg-amber-500";
    return "bg-rose-500";
  };

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5">
      {cards.map((card) => {
        const IconComponent = card.icon;
        return (
          <div
            key={card.key}
            className="bg-white rounded-xl border border-slate-200/90 p-4 shadow-2xs hover:border-slate-300 transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="p-1.5 rounded-lg bg-slate-100 text-slate-700">
                  <IconComponent className="h-4 w-4" />
                </div>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-100 text-slate-500 font-medium">
                  Weight {card.weight}
                </span>
              </div>
              <h3 className="text-xs font-semibold text-slate-700 truncate">
                {card.label}
              </h3>
              <p className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">
                {card.description}
              </p>
            </div>

            <div className="mt-3 pt-2 border-t border-slate-100">
              <div className="flex items-baseline justify-between mb-1.5">
                <span
                  className={`text-lg font-bold font-mono px-2 py-0.5 rounded border text-center ${getScoreColor(
                    card.value
                  )}`}
                >
                  {card.value}
                </span>
                <span className="text-[11px] font-mono text-slate-400">/ 100</span>
              </div>
              {/* Progress bar */}
              <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${getBarColor(
                    card.value
                  )}`}
                  style={{ width: `${card.value}%` }}
                />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
