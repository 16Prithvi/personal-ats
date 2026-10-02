"use client";

import React from "react";
import { KeywordToEmphasize } from "@/types/analysis";
import { Tag, Check, X, ShieldAlert, Sparkles, ArrowDown } from "lucide-react";

interface KeywordsSectionProps {
  matchedKeywords: string[];
  missingKeywords: string[];
  keywordsToEmphasize: KeywordToEmphasize[];
}

export const KeywordsSection: React.FC<KeywordsSectionProps> = ({
  matchedKeywords,
  missingKeywords,
  keywordsToEmphasize,
}) => {
  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-7 shadow-xs space-y-5">
      {/* Section Header */}
      <div>
        <h2 className="text-lg font-bold text-slate-900 tracking-tight flex items-center gap-2">
          <Tag className="h-5 w-5 text-indigo-600" />
          Keywords Analysis
        </h2>
        <p className="text-xs text-slate-500 mt-1">
          Direct keyword comparison between the job description and your resume text
        </p>
      </div>

      {/* Anti-Keyword Stuffing Guardrail Banner */}
      <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-start gap-2.5 text-xs text-slate-600">
        <ShieldAlert className="h-4 w-4 text-indigo-600 shrink-0 mt-0.5" />
        <div>
          <span className="font-semibold text-slate-800">
            Truthful Alignment Notice:
          </span>{" "}
          Do not blindly stuff keywords. Modern ATS parsers and human recruiters evaluate contextual evidence. Only emphasize keywords where you have genuine experience.
        </div>
      </div>

      {/* 2 Columns: Found / Matched vs Missing / Not Mentioned */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Found in Resume */}
        <div className="p-4 rounded-xl border border-emerald-200/80 bg-emerald-50/20 flex flex-col">
          <div className="flex items-center justify-between mb-3 pb-2 border-b border-emerald-100">
            <span className="text-xs font-bold text-emerald-900 uppercase tracking-wider flex items-center gap-1.5">
              <Check className="h-3.5 w-3.5 text-emerald-600" />
              Found / Matched ({matchedKeywords.length})
            </span>
          </div>
          <div className="flex flex-wrap gap-1.5 flex-1 content-start">
            {matchedKeywords.length > 0 ? (
              matchedKeywords.map((kw, i) => (
                <span
                  key={i}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium bg-white text-emerald-800 border border-emerald-200 shadow-2xs"
                >
                  <Check className="h-3 w-3 text-emerald-600" />
                  {kw}
                </span>
              ))
            ) : (
              <span className="text-xs text-slate-400 italic">None detected</span>
            )}
          </div>
        </div>

        {/* Missing / Not Mentioned */}
        <div className="p-4 rounded-xl border border-rose-200/80 bg-rose-50/20 flex flex-col">
          <div className="flex items-center justify-between mb-3 pb-2 border-b border-rose-100">
            <span className="text-xs font-bold text-rose-900 uppercase tracking-wider flex items-center gap-1.5">
              <X className="h-3.5 w-3.5 text-rose-600" />
              Missing / Not Mentioned ({missingKeywords.length})
            </span>
          </div>
          <div className="flex flex-wrap gap-1.5 flex-1 content-start">
            {missingKeywords.length > 0 ? (
              missingKeywords.map((kw, i) => (
                <span
                  key={i}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium bg-white text-slate-700 border border-rose-200 shadow-2xs"
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-rose-500" />
                  {kw}
                </span>
              ))
            ) : (
              <span className="text-xs text-slate-400 italic">None missing</span>
            )}
          </div>
        </div>
      </div>

      {/* Important Keywords to Emphasize */}
      {keywordsToEmphasize.length > 0 && (
        <div className="pt-2">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 flex items-center gap-1.5">
              <Sparkles className="h-4 w-4 text-indigo-600" />
              Important Keywords to Emphasize ({keywordsToEmphasize.length})
            </h3>
            <span className="text-[11px] text-indigo-600 font-medium hidden sm:inline-flex items-center gap-1">
              <span>Detailed placement in Resume Optimizer</span>
              <ArrowDown className="h-3 w-3" />
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {keywordsToEmphasize.map((item, idx) => (
              <div
                key={idx}
                className="p-3.5 rounded-xl border border-indigo-100 bg-indigo-50/20 flex flex-col justify-between"
              >
                <div>
                  <span className="text-xs font-bold text-indigo-950 block">
                    {item.keyword}
                  </span>
                  <p className="text-[11px] text-slate-500 mt-1 line-clamp-2">
                    <strong className="text-slate-700">JD Context:</strong> {item.context}
                  </p>
                </div>
                <div className="mt-2.5 pt-2 border-t border-indigo-100 text-[11px] text-slate-700">
                  <span className="font-semibold text-indigo-700 block">
                    Recommendation:
                  </span>
                  <p className="line-clamp-2 mt-0.5">{item.recommendation}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
