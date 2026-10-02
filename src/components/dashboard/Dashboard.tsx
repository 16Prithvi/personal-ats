"use client";

import React, { useState } from "react";
import { AnalysisResult, ResumeMetadata } from "@/types/analysis";
import { OverviewSection } from "./OverviewSection";
import { SkillsMatchSection } from "./SkillsMatchSection";
import { KeywordsSection } from "./KeywordsSection";
import { ResumeOptimizer } from "./ResumeOptimizer";
import { ExtractedResumeDrawer } from "@/components/ExtractedResumeDrawer";
import { Printer, RotateCcw, Sparkles } from "lucide-react";

interface DashboardProps {
  data: AnalysisResult;
  meta: ResumeMetadata;
  isDemo?: boolean;
  onNewAnalysis: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  data,
  meta,
  isDemo = false,
  onNewAnalysis,
}) => {
  const [activeSection, setActiveSection] = useState<string>("overview");

  const scrollTo = (id: string) => {
    setActiveSection(id);
    const element = document.getElementById(id);
    if (element) {
      const yOffset = -80;
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: "smooth" });
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const navLinks = [
    { id: "overview", label: "Overview" },
    { id: "skills", label: "Skills Match" },
    { id: "keywords", label: "Keywords" },
    { id: "optimizer", label: "Resume Optimizer" },
  ];

  return (
    <div className="space-y-8 pb-16">
      {/* Demo Mode Notice Banner if viewing sample */}
      {isDemo && (
        <div className="p-4 rounded-2xl bg-indigo-50/80 border border-indigo-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-indigo-950 shadow-2xs">
          <div className="flex items-center gap-2.5">
            <Sparkles className="h-4 w-4 text-indigo-600 shrink-0" />
            <div>
              <span className="font-bold">Viewing Sample Demonstration Analysis:</span>{" "}
              This is simulated data for a Senior Backend Engineer role. Upload your own resume PDF and JD to get your custom report.
            </div>
          </div>
          <button
            type="button"
            onClick={onNewAnalysis}
            className="self-start sm:self-auto shrink-0 px-3 py-1.5 rounded-lg bg-indigo-600 text-white font-semibold hover:bg-indigo-700 transition-colors shadow-2xs"
          >
            Upload Your Resume
          </button>
        </div>
      )}

      {/* Top Action Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onNewAnalysis}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-200 hover:border-slate-300 hover:bg-slate-50 rounded-xl transition-all shadow-2xs"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span>Start New Analysis</span>
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handlePrint}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-200 hover:border-slate-300 hover:bg-slate-50 rounded-xl transition-all shadow-2xs"
          >
            <Printer className="h-3.5 w-3.5" />
            <span>Print / Save PDF Report</span>
          </button>
        </div>
      </div>

      {/* Sticky Navigation Sub-Header (Only 4 Primary Sections) */}
      <div className="sticky top-16 z-30 bg-white/95 backdrop-blur-md py-2.5 border-y border-slate-200/90 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 shadow-2xs transition-all overflow-x-auto no-scrollbar">
        <nav className="flex items-center gap-1.5 min-w-max max-w-7xl mx-auto">
          {navLinks.map((item) => (
            <button
              key={item.id}
              onClick={() => scrollTo(item.id)}
              className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                activeSection === item.id
                  ? "bg-slate-900 text-white shadow-2xs"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
              }`}
            >
              {item.label}
            </button>
          ))}
        </nav>
      </div>

      {/* 1. OVERVIEW */}
      <section id="overview" className="scroll-mt-32">
        <OverviewSection data={data} />
      </section>

      {/* 2. SKILLS MATCH */}
      <section id="skills" className="scroll-mt-32">
        <SkillsMatchSection
          matchedSkills={data.matchedSkills}
          partialMatches={data.partialMatches}
          notMentioned={data.notMentioned}
          missingSkills={data.missingSkills}
        />
      </section>

      {/* 3. KEYWORDS */}
      <section id="keywords" className="scroll-mt-32">
        <KeywordsSection
          matchedKeywords={data.matchedKeywords}
          missingKeywords={data.missingKeywords}
          keywordsToEmphasize={data.keywordsToEmphasize}
        />
      </section>

      {/* 4. RESUME OPTIMIZER (Consolidated Engine) */}
      <section id="optimizer" className="scroll-mt-32">
        <ResumeOptimizer data={data} />
      </section>

      {/* Extracted Resume Drawer for Debugging / Verification */}
      <section className="pt-2">
        <ExtractedResumeDrawer meta={meta} />
      </section>
    </div>
  );
};
