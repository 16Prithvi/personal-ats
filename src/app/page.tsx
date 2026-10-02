"use client";

import React, { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { UploadZone } from "@/components/UploadZone";
import { JobDescriptionInput } from "@/components/JobDescriptionInput";
import { AnalyzeButton } from "@/components/AnalyzeButton";
import { Dashboard } from "@/components/dashboard/Dashboard";
import { ApiKeySection, PROVIDERS } from "@/components/ApiKeySection";
import { AnalysisResult, ResumeMetadata, AnalyzeApiResponse } from "@/types/analysis";
import {
  AlertCircle,
  KeyRound,
  Sparkles,
  CheckCircle2,
  Shield,
  Lock,
  Sliders,
  ArrowLeft,
} from "lucide-react";

export default function Home() {
  // Step state: 1 = API Key Setup, 2 = Upload Resume + Paste JD
  const [currentStep, setCurrentStep] = useState<1 | 2>(1);

  // In-memory BYOK credentials (NEVER persisted to storage, cookies, or files)
  const [apiKey, setApiKey] = useState<string>("");
  const [provider, setProvider] = useState<string>("auto");
  const [isUsingServerKey, setIsUsingServerKey] = useState<boolean>(false);

  // Server development configuration status (without exposing secrets)
  const [hasServerKey, setHasServerKey] = useState<boolean>(false);
  const [serverProvider, setServerProvider] = useState<string>("");

  // Input states
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [jobDescription, setJobDescription] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [errorCode, setErrorCode] = useState<string | null>(null);

  // Analysis result state
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [resumeMetadata, setResumeMetadata] = useState<ResumeMetadata | null>(null);
  const [isDemoMode, setIsDemoMode] = useState<boolean>(false);

  // Check server configuration on mount
  useEffect(() => {
    fetch("/api/analyze")
      .then((res) => res.json())
      .then((data) => {
        if (data.hasServerKey || data.configured) {
          setHasServerKey(true);
          setServerProvider(data.provider || "configured");
        }
      })
      .catch(() => {
        // Dev server status unreachable
      });
  }, []);

  const handleAnalyze = async () => {
    if (!resumeFile || !jobDescription.trim()) return;

    // Validation: Require either user key or server key
    if (!apiKey.trim() && !isUsingServerKey && !hasServerKey) {
      setErrorMessage("Please enter your API key to continue.");
      setErrorCode("MISSING_API_KEY");
      setCurrentStep(1);
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);
    setErrorCode(null);

    const formData = new FormData();
    formData.append("resume", resumeFile);
    formData.append("jobDescription", jobDescription);

    // Only append user key if explicitly provided
    if (apiKey.trim()) {
      formData.append("apiKey", apiKey.trim());
    }
    if (provider) {
      formData.append("provider", provider);
    }

    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        body: formData,
      });

      const resData: AnalyzeApiResponse = await response.json();

      if (!response.ok || !resData.success) {
        const errorText =
          resData && !resData.success
            ? resData.error
            : `Analysis failed with HTTP status ${response.status}`;
        setErrorMessage(errorText);
        setErrorCode(!resData.success ? resData.code || null : null);
        return;
      }

      setAnalysisResult(resData.data);
      setResumeMetadata(resData.resumeMeta);
      setIsDemoMode(Boolean(resData.isDemo));
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err: unknown) {
      setErrorMessage(
        (err as Error).message ||
          "Network or server connection failed. Please ensure the local server is running."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleSampleDemo = async () => {
    setIsLoading(true);
    setErrorMessage(null);
    setErrorCode(null);

    const formData = new FormData();
    formData.append("isDemo", "true");

    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        body: formData,
      });

      const resData: AnalyzeApiResponse = await response.json();
      if (resData.success) {
        setAnalysisResult(resData.data);
        setResumeMetadata(resData.resumeMeta);
        setIsDemoMode(true);
        window.scrollTo({ top: 0, behavior: "smooth" });
      } else {
        setErrorMessage(resData.error);
      }
    } catch (err: unknown) {
      setErrorMessage((err as Error).message || "Failed to load sample demo.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setAnalysisResult(null);
    setResumeMetadata(null);
    setIsDemoMode(false);
    setErrorMessage(null);
    setErrorCode(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const currentProviderName =
    PROVIDERS.find((p) => p.id === provider)?.name || "Auto-detect";

  return (
    <div className="min-h-screen bg-slate-50/70 text-slate-900 flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
      {/* Application Header */}
      <Header
        onReset={handleReset}
        hasAnalysis={Boolean(analysisResult)}
        hasUserKey={Boolean(apiKey.trim())}
        providerName={currentProviderName}
        onChangeKey={
          !analysisResult && currentStep === 2
            ? () => setCurrentStep(1)
            : undefined
        }
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        {!analysisResult ? (
          <div className="space-y-8 max-w-5xl mx-auto">
            {/* Hero Title Section */}
            <div className="text-center space-y-3">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200 shadow-2xs">
                <Sparkles className="h-3.5 w-3.5 text-indigo-600" />
                <span>Personal Career Intelligence</span>
              </div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight">
                ResumeMatch
              </h1>
              <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
                Objective, evidence-based resume screening against your exact target job description. No buzzword inflation, just actionable alignment.
              </p>
            </div>

            {/* Error Message Display if encountered */}
            {errorMessage && (
              <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start gap-3 shadow-2xs">
                <AlertCircle className="h-4 w-4 text-rose-600 shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="font-semibold text-rose-900">Analysis Error</p>
                  <p className="mt-0.5 leading-relaxed">{errorMessage}</p>

                  {(errorCode === "MISSING_API_KEY" || errorCode === "INVALID_API_KEY") && (
                    <div className="mt-3 p-3 rounded-lg bg-white border border-rose-200 text-slate-700 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="flex items-center gap-2">
                        <KeyRound className="h-4 w-4 text-indigo-600 shrink-0" />
                        <span className="text-xs">
                          {errorCode === "INVALID_API_KEY"
                            ? "Your API key was rejected by the provider. Please update your key."
                            : "An API key is required to perform live LLM resume screening."}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setCurrentStep(1);
                          setErrorMessage(null);
                        }}
                        className="px-3 py-1.5 bg-slate-900 text-white hover:bg-slate-800 rounded-lg text-xs font-medium shrink-0 flex items-center gap-1.5 transition-colors"
                      >
                        <ArrowLeft className="h-3.5 w-3.5" />
                        <span>Update API Key</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* ========================================================== */}
            {/* STEP 1: API KEY & PROVIDER SELECTION                       */}
            {/* ========================================================== */}
            {currentStep === 1 && (
              <ApiKeySection
                apiKey={apiKey}
                setApiKey={setApiKey}
                provider={provider}
                setProvider={setProvider}
                hasServerKey={hasServerKey}
                serverProvider={serverProvider}
                isUsingServerKey={isUsingServerKey}
                setIsUsingServerKey={setIsUsingServerKey}
                onContinue={() => {
                  setErrorMessage(null);
                  setCurrentStep(2);
                }}
                onSampleDemo={handleSampleDemo}
              />
            )}

            {/* ========================================================== */}
            {/* STEP 2: UPLOAD RESUME & PASTE JOB DESCRIPTION              */}
            {/* ========================================================== */}
            {currentStep === 2 && (
              <div className="space-y-6">
                {/* Active Key Status Card */}
                <div className="bg-white rounded-2xl border border-slate-200/90 p-4 sm:p-5 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-700 shrink-0">
                      <Lock className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs font-bold text-slate-900">
                          Active Credentials:
                        </span>
                        <span className="text-xs font-semibold text-indigo-700 bg-indigo-50 px-2.5 py-0.5 rounded-md border border-indigo-200">
                          {isUsingServerKey
                            ? `Server Dev Key (${serverProvider})`
                            : currentProviderName}
                        </span>
                        <span className="text-[11px] font-mono text-slate-500 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                          {isUsingServerKey ? "from .env.local" : "••••••••••••"}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        In-memory session only • Discarded after this analysis completes
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setCurrentStep(1)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-300 text-xs font-medium text-slate-700 hover:bg-slate-50 hover:border-slate-400 transition-colors self-start sm:self-center shrink-0 shadow-2xs"
                  >
                    <Sliders className="h-3.5 w-3.5 text-slate-500" />
                    <span>Change Key / Provider</span>
                  </button>
                </div>

                {/* Balanced Two-Column Input Cards */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
                  {/* Left: Resume Upload Card */}
                  <UploadZone
                    file={resumeFile}
                    onFileSelect={(f) => {
                      setResumeFile(f);
                      setErrorMessage(null);
                    }}
                    disabled={isLoading}
                  />

                  {/* Right: Job Description Card */}
                  <JobDescriptionInput
                    value={jobDescription}
                    onChange={(val) => {
                      setJobDescription(val);
                      setErrorMessage(null);
                    }}
                    disabled={isLoading}
                  />
                </div>

                {/* Action Bar */}
                <div className="pt-2">
                  <AnalyzeButton
                    hasResume={Boolean(resumeFile)}
                    hasJobDescription={jobDescription.trim().length >= 30}
                    isLoading={isLoading}
                    onAnalyze={handleAnalyze}
                    onSampleDemo={handleSampleDemo}
                  />
                </div>
              </div>
            )}

            {/* Feature Highlights Footer */}
            <div className="pt-8 border-t border-slate-200/80 grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
              <div className="p-4 rounded-xl bg-white border border-slate-200/80 shadow-2xs">
                <CheckCircle2 className="h-5 w-5 text-indigo-600 mx-auto mb-2" />
                <h3 className="text-xs font-bold text-slate-900">
                  Strict Truthfulness
                </h3>
                <p className="text-[11px] text-slate-500 mt-1">
                  Never invents phantom experience. Clearly flags what you should NOT add.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-white border border-slate-200/80 shadow-2xs">
                <Sparkles className="h-5 w-5 text-indigo-600 mx-auto mb-2" />
                <h3 className="text-xs font-bold text-slate-900">
                  Targeted Bullet Rewrites
                </h3>
                <p className="text-[11px] text-slate-500 mt-1">
                  Rewrites passive bullets into high-impact metrics using only your real achievements.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-white border border-slate-200/80 shadow-2xs">
                <Shield className="h-5 w-5 text-emerald-600 mx-auto mb-2" />
                <h3 className="text-xs font-bold text-slate-900">
                  100% Private & Ephemeral
                </h3>
                <p className="text-[11px] text-slate-500 mt-1">
                  Zero permanent storage, zero database. Exists only for your current session.
                </p>
              </div>
            </div>
          </div>
        ) : (
          /* ========================================================== */
          /* ANALYSIS DASHBOARD                                         */
          /* ========================================================== */
          resumeMetadata && (
            <Dashboard
              data={analysisResult}
              meta={resumeMetadata}
              isDemo={isDemoMode}
              onNewAnalysis={handleReset}
            />
          )
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-6 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-700">ResumeMatch</span>
            <span>•</span>
            <span>Personal ATS & Job Match Analyzer</span>
          </div>
          <div>
            <span>Local session • In-memory BYOK • Data never stored permanently</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

