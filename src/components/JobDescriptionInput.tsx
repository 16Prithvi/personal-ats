"use client";

import React, { useState } from "react";
import { Briefcase, ClipboardPaste, Sparkles, X, Check } from "lucide-react";
import { SAMPLE_JOB_DESCRIPTION } from "@/lib/sampleData";

interface JobDescriptionInputProps {
  value: string;
  onChange: (val: string) => void;
  disabled?: boolean;
}

export const JobDescriptionInput: React.FC<JobDescriptionInputProps> = ({
  value,
  onChange,
  disabled = false,
}) => {
  const [copiedNotification, setCopiedNotification] = useState(false);

  const charCount = value.length;
  const wordCount = value.trim() ? value.trim().split(/\s+/).length : 0;
  const isTooShort = charCount > 0 && charCount < 50;

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text) {
        onChange(text);
        setCopiedNotification(true);
        setTimeout(() => setCopiedNotification(false), 2000);
      }
    } catch {
      // Browser clipboard permission denied or not supported
    }
  };

  const handleLoadSample = () => {
    onChange(SAMPLE_JOB_DESCRIPTION);
  };

  const handleClear = () => {
    onChange("");
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-6 flex flex-col h-full transition-all">
      {/* Card Header */}
      <div className="mb-4 flex items-start justify-between">
        <div>
          <h2 className="text-base font-semibold text-slate-900 tracking-tight flex items-center gap-2">
            <Briefcase className="h-4 w-4 text-indigo-600" />
            Job Description
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Paste the complete target job posting or requirements
          </p>
        </div>

        {/* Action shortcuts */}
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={handleLoadSample}
            disabled={disabled}
            className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-indigo-700 bg-indigo-50 hover:bg-indigo-100 rounded-md border border-indigo-200/70 transition-colors"
            title="Load a realistic senior backend job description for demonstration"
          >
            <Sparkles className="h-3 w-3" />
            <span>Load Sample JD</span>
          </button>

          {value && (
            <button
              type="button"
              onClick={handleClear}
              disabled={disabled}
              className="p-1 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded transition-colors"
              title="Clear job description"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>

      {/* Textarea container */}
      <div className="relative flex-1 flex flex-col">
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          placeholder="Paste job title, responsibilities, required skills, preferred qualifications, and company requirements here..."
          className="w-full flex-1 min-h-[220px] p-4 text-sm leading-relaxed text-slate-800 placeholder-slate-400 bg-slate-50/50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 resize-none font-sans transition-colors"
        />

        {/* Floating Quick-Paste Button if empty */}
        {!value && (
          <button
            type="button"
            onClick={handlePaste}
            disabled={disabled}
            className="absolute bottom-4 right-4 inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-200 rounded-lg shadow-2xs hover:bg-slate-50 hover:border-slate-300 transition-all"
          >
            {copiedNotification ? (
              <>
                <Check className="h-3.5 w-3.5 text-emerald-600" />
                <span className="text-emerald-700">Pasted!</span>
              </>
            ) : (
              <>
                <ClipboardPaste className="h-3.5 w-3.5 text-slate-500" />
                <span>Paste from clipboard</span>
              </>
            )}
          </button>
        )}
      </div>

      {/* Footer Counters & Guidance */}
      <div className="mt-3 flex items-center justify-between text-xs text-slate-500">
        <div>
          {isTooShort ? (
            <span className="text-amber-600 font-medium">
              A bit short. Paste the full description for more accurate matching.
            </span>
          ) : (
            <span>Paste full role requirements for best results</span>
          )}
        </div>
        <div className="flex items-center gap-3 tabular-nums font-mono text-[11px] text-slate-400">
          <span>{wordCount} words</span>
          <span>•</span>
          <span>{charCount} chars</span>
        </div>
      </div>
    </div>
  );
};
