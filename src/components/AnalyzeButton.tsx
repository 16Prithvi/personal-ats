"use client";

import React, { useEffect, useState } from "react";
import { Sparkles, Loader2, ArrowRight } from "lucide-react";

interface AnalyzeButtonProps {
  hasResume: boolean;
  hasJobDescription: boolean;
  isLoading: boolean;
  onAnalyze: () => void;
  onSampleDemo: () => void;
}

const LOADING_STEPS = [
  "Extracting text from PDF resume...",
  "Analyzing job requirements & core competencies...",
  "Evaluating skills, experience, and project overlap...",
  "Synthesizing ATS readability & keyword coverage...",
  "Formulating targeted bullet improvements...",
  "Finalizing comprehensive match report...",
];

export const AnalyzeButton: React.FC<AnalyzeButtonProps> = ({
  hasResume,
  hasJobDescription,
  isLoading,
  onAnalyze,
  onSampleDemo,
}) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  useEffect(() => {
    if (!isLoading) return;

    const interval = setInterval(() => {
      setCurrentStepIndex((prev) => (prev + 1) % LOADING_STEPS.length);
    }, 2400);

    return () => {
      clearInterval(interval);
      setCurrentStepIndex(0);
    };
  }, [isLoading]);

  const isReady = hasResume && hasJobDescription && !isLoading;

  return (
    <div className="flex flex-col items-center gap-3">
      {/* Primary Action Button */}
      <button
        type="button"
        onClick={onAnalyze}
        disabled={!isReady}
        className={`w-full sm:w-auto min-w-[280px] px-8 py-3.5 rounded-xl font-semibold text-sm shadow-sm flex items-center justify-center gap-2.5 transition-all ${
          isReady
            ? "bg-slate-900 text-white hover:bg-slate-800 hover:shadow-md cursor-pointer active:scale-[0.99]"
            : isLoading
            ? "bg-slate-900 text-white cursor-wait opacity-95"
            : "bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed"
        }`}
      >
        {isLoading ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin text-indigo-400" />
            <span>Analyzing your resume...</span>
          </>
        ) : (
          <>
            <Sparkles className="h-4 w-4 text-indigo-400" />
            <span>Analyze Resume</span>
            <ArrowRight className="h-4 w-4 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
          </>
        )}
      </button>

      {/* Dynamic Loading Message */}
      {isLoading && (
        <div className="flex items-center gap-2 text-xs font-medium text-slate-600 animate-pulse">
          <span className="h-1.5 w-1.5 rounded-full bg-indigo-600 animate-ping" />
          <span>{LOADING_STEPS[currentStepIndex]}</span>
        </div>
      )}

      {/* Instant Demo Option */}
      {!isLoading && (
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <span>Want to preview the dashboard first?</span>
          <button
            type="button"
            onClick={onSampleDemo}
            className="text-indigo-600 hover:text-indigo-700 font-medium hover:underline inline-flex items-center gap-1"
          >
            <span>View Sample Analysis Report</span>
            <ArrowRight className="h-3 w-3" />
          </button>
        </div>
      )}
    </div>
  );
};
