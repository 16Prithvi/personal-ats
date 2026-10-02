"use client";

import React from "react";
import { DoNotAdd } from "@/types/analysis";
import { ShieldAlert, AlertOctagon } from "lucide-react";

interface DoNotAddSectionProps {
  doNotAdd: DoNotAdd[];
}

export const DoNotAddSection: React.FC<DoNotAddSectionProps> = ({ doNotAdd }) => {
  return (
    <div className="bg-rose-50/40 rounded-2xl border border-rose-200/90 p-6 md:p-8 shadow-xs space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-rose-700 font-bold text-lg tracking-tight">
          <ShieldAlert className="h-5 w-5 text-rose-600" />
          <h2>Critical Guardrail: Technologies You Should NOT Add</h2>
        </div>
        <p className="text-xs text-rose-800/80 mt-1 max-w-3xl leading-relaxed">
          These tools appear in the job description but have no visible foundation in your resume. Claiming experience you cannot defend in a live technical interview harms credibility.
        </p>
      </div>

      {/* Cards */}
      {doNotAdd.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {doNotAdd.map((item, idx) => (
            <div
              key={idx}
              className="bg-white rounded-xl border border-rose-200 p-4 shadow-2xs flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center gap-2 mb-2 pb-2 border-b border-rose-100">
                  <AlertOctagon className="h-4 w-4 text-rose-600 shrink-0" />
                  <span className="font-bold text-sm text-slate-900">
                    {item.skill}
                  </span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {item.reason}
                </p>
              </div>

              <div className="mt-3 pt-2 border-t border-slate-100">
                <span className="text-[11px] font-semibold text-rose-700 bg-rose-50 px-2 py-0.5 rounded inline-block">
                  ⚠ Do not claim without hands-on experience
                </span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="p-4 bg-white rounded-xl border border-rose-100 text-xs text-slate-600">
          No critical unevidenced technologies were detected.
        </div>
      )}
    </div>
  );
};
