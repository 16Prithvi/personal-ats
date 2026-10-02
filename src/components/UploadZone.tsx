"use client";

import React, { useRef, useState } from "react";
import { Upload, FileText, CheckCircle2, Trash2, AlertCircle } from "lucide-react";

interface UploadZoneProps {
  file: File | null;
  onFileSelect: (file: File | null) => void;
  disabled?: boolean;
}

export const UploadZone: React.FC<UploadZoneProps> = ({
  file,
  onFileSelect,
  disabled = false,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  const handleFileValidation = (candidateFile: File | null) => {
    setErrorMessage(null);
    if (!candidateFile) return;

    if (
      candidateFile.type !== "application/pdf" &&
      !candidateFile.name.toLowerCase().endsWith(".pdf")
    ) {
      setErrorMessage("Please upload a PDF document (.pdf only).");
      return;
    }

    if (candidateFile.size > 10 * 1024 * 1024) {
      setErrorMessage("File size exceeds 10MB limit.");
      return;
    }

    onFileSelect(candidateFile);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!disabled) setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (disabled) return;

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileValidation(e.dataTransfer.files[0]);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFileValidation(e.target.files[0]);
    }
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (fileInputRef.current) fileInputRef.current.value = "";
    onFileSelect(null);
    setErrorMessage(null);
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-6 flex flex-col h-full transition-all">
      {/* Card Header */}
      <div className="mb-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-semibold text-slate-900 tracking-tight flex items-center gap-2">
            <FileText className="h-4 w-4 text-indigo-600" />
            Your Resume
          </h2>
          {file && (
            <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
              <CheckCircle2 className="h-3 w-3" />
              Ready
            </span>
          )}
        </div>
        <p className="text-xs text-slate-500 mt-1">
          Upload your current resume as a PDF document
        </p>
      </div>

      <input
        type="file"
        ref={fileInputRef}
        onChange={handleInputChange}
        accept=".pdf,application/pdf"
        className="hidden"
        disabled={disabled}
      />

      {/* Main Upload / File Zone */}
      {!file ? (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => !disabled && fileInputRef.current?.click()}
          className={`flex-1 min-h-[220px] rounded-xl border-2 border-dashed flex flex-col items-center justify-center p-6 text-center cursor-pointer transition-all ${
            isDragging
              ? "border-indigo-500 bg-indigo-50/50 scale-[0.99]"
              : "border-slate-300 hover:border-slate-400 bg-slate-50/60 hover:bg-slate-50"
          } ${disabled ? "opacity-60 cursor-not-allowed" : ""}`}
        >
          <div className="h-12 w-12 rounded-full bg-white border border-slate-200 shadow-2xs flex items-center justify-center text-slate-600 mb-3 group-hover:scale-105 transition-transform">
            <Upload className="h-5 w-5 text-indigo-600" />
          </div>
          <p className="text-sm font-medium text-slate-800">
            <span className="text-indigo-600 hover:underline">Click to browse</span>{" "}
            or drag & drop your PDF
          </p>
          <p className="text-xs text-slate-400 mt-1">
            Supports text-based PDF resumes up to 10MB
          </p>
        </div>
      ) : (
        <div className="flex-1 min-h-[220px] rounded-xl border border-slate-200 bg-slate-50/70 p-5 flex flex-col justify-between">
          <div className="flex items-start gap-3.5">
            <div className="h-11 w-11 rounded-lg bg-indigo-600/10 border border-indigo-200/60 text-indigo-700 flex items-center justify-center shrink-0">
              <FileText className="h-6 w-6" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5">
                <p className="text-sm font-semibold text-slate-900 truncate">
                  {file.name}
                </p>
                <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                {formatFileSize(file.size)} • PDF document
              </p>
              <div className="mt-3 inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium bg-emerald-100/70 text-emerald-800">
                ✓ Ready for analysis
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-200/80 flex items-center justify-between">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={disabled}
              className="text-xs font-medium text-indigo-600 hover:text-indigo-700 hover:underline py-1"
            >
              Replace PDF
            </button>
            <button
              type="button"
              onClick={handleRemove}
              disabled={disabled}
              className="inline-flex items-center gap-1 text-xs font-medium text-rose-600 hover:text-rose-700 hover:bg-rose-50 px-2 py-1 rounded transition-colors"
            >
              <Trash2 className="h-3.5 w-3.5" />
              Remove
            </button>
          </div>
        </div>
      )}

      {/* Error message */}
      {errorMessage && (
        <div className="mt-3 p-2.5 rounded-lg bg-rose-50 border border-rose-200 flex items-start gap-2 text-xs text-rose-700">
          <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
          <span>{errorMessage}</span>
        </div>
      )}
    </div>
  );
};
