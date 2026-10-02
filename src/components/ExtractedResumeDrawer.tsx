"use client";

import React, { useState } from "react";
import { ChevronDown, ChevronUp, Copy, Check, AlertTriangle, FileText } from "lucide-react";
import { ResumeMetadata } from "@/types/analysis";

interface ExtractedResumeDrawerProps {
  meta: ResumeMetadata;
}

export const ExtractedResumeDrawer: React.FC<ExtractedResumeDrawerProps> = ({ meta }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(meta.fullExtractedText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs overflow-hidden transition-all">
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-slate-50/70 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-600">
            <FileText className="h-4 w-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-slate-800">
                View extracted resume text
              </span>
              <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200">
                {meta.numPages} {meta.numPages === 1 ? "page" : "pages"} • {meta.wordCount} words
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Useful for verifying raw text parsing and ATS readability
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-slate-500">
          <span className="text-xs font-medium hidden sm:inline">
            {isOpen ? "Collapse" : "Expand"}
          </span>
          {isOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </div>
      </button>

      {isOpen && (
        <div className="px-6 pb-6 pt-2 border-t border-slate-100">
          {/* Sparse Text Warning */}
          {meta.isSparse && (
            <div className="mb-4 p-3 rounded-xl bg-amber-50 border border-amber-200 flex items-start gap-2.5 text-xs text-amber-800">
              <AlertTriangle className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold">
                  Some text may not have been extracted correctly from this PDF.
                </p>
                <p className="mt-0.5 text-amber-700">
                  The extracted text is unusually brief ({meta.charCount} characters). If this is a scanned document or uses non-standard embedded fonts, ATS engines may have difficulty reading your content.
                </p>
              </div>
            </div>
          )}

          {/* Action header */}
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-slate-500">
              Extracted Raw Text ({meta.charCount} characters):
            </span>
            <button
              type="button"
              onClick={handleCopy}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium text-slate-700 bg-white border border-slate-200 rounded-md hover:bg-slate-50 transition-colors shadow-2xs"
            >
              {copied ? (
                <>
                  <Check className="h-3.5 w-3.5 text-emerald-600" />
                  <span className="text-emerald-700">Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="h-3.5 w-3.5 text-slate-500" />
                  <span>Copy Text</span>
                </>
              )}
            </button>
          </div>

          {/* Raw Text Container */}
          <pre className="p-4 bg-slate-900 text-slate-200 rounded-xl text-xs font-mono max-h-96 overflow-y-auto whitespace-pre-wrap leading-relaxed border border-slate-800 selection:bg-indigo-500 selection:text-white">
            {meta.fullExtractedText}
          </pre>
        </div>
      )}
    </div>
  );
};
