"use client";

import React, { useEffect, useState } from "react";
import { Sparkles, Shield, Cpu, RefreshCw } from "lucide-react";

interface HeaderProps {
  onReset?: () => void;
  hasAnalysis?: boolean;
  hasUserKey?: boolean;
  providerName?: string;
  onChangeKey?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onReset,
  hasAnalysis,
  hasUserKey,
  providerName,
  onChangeKey,
}) => {
  const [apiStatus, setApiStatus] = useState<{
    configured: boolean;
    hasServerKey?: boolean;
    provider: string;
    model?: string;
  } | null>(null);

  useEffect(() => {
    fetch("/api/analyze")
      .then((res) => res.json())
      .then((data) => setApiStatus(data))
      .catch(() => setApiStatus(null));
  }, []);

  const isConnected = hasUserKey || Boolean(apiStatus?.hasServerKey);
  const statusLabel = hasUserKey
    ? `BYOK (${providerName || "Active"})`
    : apiStatus?.hasServerKey
    ? `Dev Key (${apiStatus.provider})`
    : "API Key Needed";

  return (
    <header className="border-b border-slate-200 bg-white/95 backdrop-blur-sm sticky top-0 z-40 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-slate-900 flex items-center justify-center text-white shadow-xs">
            <Sparkles className="h-5 w-5 text-indigo-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-lg text-slate-900 tracking-tight">
                ResumeMatch
              </span>
              <span className="text-[10px] font-semibold tracking-wider uppercase px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                Personal
              </span>
            </div>
            <p className="text-xs text-slate-500 hidden sm:block">
              AI-powered resume analysis for your next application
            </p>
          </div>
        </div>

        {/* Right Status Indicators */}
        <div className="flex items-center gap-3">
          {/* AI Engine Status indicator */}
          <div
            onClick={onChangeKey}
            className={`hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs border transition-colors ${
              onChangeKey ? "cursor-pointer hover:bg-slate-100" : ""
            } ${
              isConnected
                ? "bg-slate-50 border-slate-200 text-slate-700"
                : "bg-amber-50/70 border-amber-200 text-amber-800"
            }`}
          >
            <Cpu className="h-3.5 w-3.5 text-slate-500" />
            <span className="font-medium">Engine: {statusLabel}</span>
            <span
              className={`h-2 w-2 rounded-full ${
                isConnected
                  ? "bg-emerald-500 ring-2 ring-emerald-200"
                  : "bg-amber-400 ring-2 ring-amber-200"
              }`}
              title={
                isConnected
                  ? "LLM API Key connected"
                  : "Enter your API key to analyze resumes"
              }
            />
          </div>

          {/* Privacy badge */}
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
            <Shield className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">100% Private Local Session</span>
            <span className="sm:hidden">Local</span>
          </div>

          {/* Reset button if currently viewing results */}
          {hasAnalysis && onReset && (
            <button
              onClick={onReset}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 hover:border-slate-400 transition-colors shadow-2xs"
            >
              <RefreshCw className="h-3.5 w-3.5" />
              <span>New Analysis</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
