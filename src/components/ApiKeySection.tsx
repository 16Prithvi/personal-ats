"use client";

import React, { useState } from "react";
import {
  KeyRound,
  Eye,
  EyeOff,
  Shield,
  CheckCircle2,
  Lock,
  ArrowRight,
  Server,
  Sparkles,
  Info,
  AlertTriangle,
} from "lucide-react";

export interface ApiKeySectionProps {
  apiKey: string;
  setApiKey: (key: string) => void;
  provider: string;
  setProvider: (provider: string) => void;
  hasServerKey: boolean;
  serverProvider: string;
  isUsingServerKey: boolean;
  setIsUsingServerKey: (val: boolean) => void;
  onContinue: () => void;
  onSampleDemo: () => void;
}

export const PROVIDERS = [
  {
    id: "auto",
    name: "Auto-detect from Key",
    desc: "Automatically detects Gemini, OpenAI, Groq, or OpenRouter",
    placeholder: "Paste any supported API key...",
  },
  {
    id: "gemini",
    name: "Google Gemini",
    desc: "Fast, generous free tier (gemini-3.8-flash)",
    placeholder: "AIzaSy...",
  },
  {
    id: "openai",
    name: "OpenAI",
    desc: "Industry standard models (gpt-4o, gpt-4o-mini)",
    placeholder: "sk-proj-... or sk-...",
  },
  {
    id: "groq",
    name: "Groq Cloud",
    desc: "Ultra-fast inference (llama-3.3-70b-versatile)",
    placeholder: "gsk_...",
  },
  {
    id: "openrouter",
    name: "OpenRouter",
    desc: "Universal AI model routing",
    placeholder: "sk-or-v1-...",
  },
];

export const ApiKeySection: React.FC<ApiKeySectionProps> = ({
  apiKey,
  setApiKey,
  provider,
  setProvider,
  hasServerKey,
  serverProvider,
  isUsingServerKey,
  setIsUsingServerKey,
  onContinue,
  onSampleDemo,
}) => {
  const [showKey, setShowKey] = useState<boolean>(false);
  const [inputError, setInputError] = useState<string | null>(null);

  // Auto-detect provider if user pastes a recognizable key prefix
  const handleKeyChange = (val: string) => {
    const trimmed = val.trim();
    setApiKey(trimmed);
    setIsUsingServerKey(false);
    setInputError(null);

    if (trimmed.length > 0) {
      if (trimmed.startsWith("AIza")) {
        setProvider("gemini");
      } else if (trimmed.startsWith("gsk_")) {
        setProvider("groq");
      } else if (trimmed.startsWith("sk-or-")) {
        setProvider("openrouter");
      } else if (trimmed.startsWith("sk-")) {
        setProvider("openai");
      }
    }
  };

  const handleContinue = (e: React.FormEvent) => {
    e.preventDefault();
    if (isUsingServerKey) {
      onContinue();
      return;
    }

    if (!apiKey.trim()) {
      setInputError("Please enter an API key to continue.");
      return;
    }

    if (apiKey.trim().length < 10) {
      setInputError("The API key appears too short. Please check your key.");
      return;
    }

    setInputError(null);
    onContinue();
  };

  const handleUseDevFallback = () => {
    setIsUsingServerKey(true);
    setApiKey("");
    setInputError(null);
    onContinue();
  };

  const currentProviderObj =
    PROVIDERS.find((p) => p.id === provider) || PROVIDERS[0];

  const canContinue = isUsingServerKey || apiKey.trim().length >= 10;

  return (
    <div className="max-w-xl mx-auto space-y-6">
      {/* Step Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200">
          <KeyRound className="h-3.5 w-3.5 text-indigo-600" />
          <span>Step 1 of 3: AI Authentication</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
          Bring Your Own API Key
        </h2>
        <p className="text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
          Use your personal LLM API key to analyze your resume. Keys are used strictly for this request in-memory and never stored.
        </p>
      </div>

      {/* Main Credentials Card */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-7 space-y-6">
        <form onSubmit={handleContinue} className="space-y-5">
          {/* Provider Selection */}
          <div className="space-y-1.5">
            <label
              htmlFor="ai-provider"
              className="block text-xs font-bold uppercase tracking-wider text-slate-700"
            >
              AI Provider
            </label>
            <div className="relative">
              <select
                id="ai-provider"
                value={provider}
                onChange={(e) => {
                  setProvider(e.target.value);
                  setIsUsingServerKey(false);
                }}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors cursor-pointer"
              >
                {PROVIDERS.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} — {p.desc}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* API Key Password Input */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label
                htmlFor="api-key-input"
                className="block text-xs font-bold uppercase tracking-wider text-slate-700"
              >
                API Key
              </label>
              {apiKey && (
                <span className="text-[11px] text-emerald-600 font-medium flex items-center gap-1">
                  <CheckCircle2 className="h-3 w-3" /> Key entered (in-memory)
                </span>
              )}
            </div>

            <div className="relative">
              <input
                id="api-key-input"
                type={showKey ? "text" : "password"}
                value={apiKey}
                onChange={(e) => handleKeyChange(e.target.value)}
                placeholder={currentProviderObj.placeholder}
                autoComplete="off"
                spellCheck={false}
                className="w-full pl-3.5 pr-11 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-mono text-slate-900 placeholder:text-slate-400 placeholder:font-sans focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowKey(!showKey)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1 rounded-md transition-colors"
                title={showKey ? "Hide API key" : "Show API key"}
                aria-label={showKey ? "Hide API key" : "Show API key"}
              >
                {showKey ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>

            {inputError && (
              <p className="text-xs text-rose-600 flex items-center gap-1 mt-1">
                <AlertTriangle className="h-3.5 w-3.5 shrink-0" />
                <span>{inputError}</span>
              </p>
            )}
          </div>

          {/* Masked Preview if key entered */}
          {apiKey.trim().length > 0 && (
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <Lock className="h-3.5 w-3.5 text-indigo-600" />
                <span className="text-slate-500 font-medium">Session Key:</span>
                <span className="font-mono text-slate-800 font-bold tracking-widest">
                  ••••••••••••••••
                </span>
              </div>
              <span className="text-[10px] text-slate-500 bg-white px-2 py-0.5 rounded border border-slate-200">
                {apiKey.length} chars
              </span>
            </div>
          )}

          {/* Privacy & Security Notice */}
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 text-xs text-slate-600 space-y-2">
            <div className="flex items-start gap-2">
              <Shield className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-slate-800">
                  🔒 In-Memory Only Security
                </p>
                <p className="text-[11px] text-slate-500 leading-relaxed mt-0.5">
                  Your API key is used only for the current analysis request and is not stored by ResumeMatch. It is never written to disk, databases, cookies, or browser storage.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-2 pt-1.5 border-t border-slate-200/60">
              <Info className="h-3.5 w-3.5 text-slate-400 shrink-0 mt-0.5" />
              <p className="text-[11px] text-slate-500 leading-relaxed">
                Your resume and job description are processed directly with your chosen AI provider to generate the analysis.
              </p>
            </div>
          </div>

          {/* Primary Action Button */}
          <button
            type="submit"
            disabled={!canContinue}
            className={`w-full py-3 px-4 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 transition-all ${
              canContinue
                ? "bg-slate-900 text-white hover:bg-slate-800 shadow-sm cursor-pointer active:scale-[0.99]"
                : "bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed"
            }`}
          >
            <span>Continue to Upload Resume</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </form>

        {/* Development Fallback Option (if .env.local has key) */}
        {hasServerKey && (
          <div className="pt-4 border-t border-slate-100">
            <div className="p-3 rounded-xl bg-indigo-50/70 border border-indigo-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
              <div className="flex items-start sm:items-center gap-2">
                <Server className="h-4 w-4 text-indigo-600 shrink-0 mt-0.5 sm:mt-0" />
                <div>
                  <span className="font-semibold text-indigo-950">
                    Local Dev Key Detected
                  </span>
                  <p className="text-[11px] text-indigo-700/80">
                    Server has a key configured in .env.local ({serverProvider})
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={handleUseDevFallback}
                className="px-3 py-1.5 bg-white border border-indigo-200 text-indigo-700 hover:bg-indigo-50 font-medium rounded-lg text-xs transition-colors shrink-0 shadow-2xs inline-flex items-center gap-1"
              >
                <span>Use Dev Key</span>
                <ArrowRight className="h-3 w-3" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Alternative Demo Link */}
      <div className="text-center">
        <button
          type="button"
          onClick={onSampleDemo}
          className="text-xs text-slate-500 hover:text-indigo-600 font-medium inline-flex items-center gap-1.5 transition-colors"
        >
          <Sparkles className="h-3.5 w-3.5 text-indigo-500" />
          <span>Don&apos;t have an API key right now? Explore Sample Analysis</span>
        </button>
      </div>
    </div>
  );
};
