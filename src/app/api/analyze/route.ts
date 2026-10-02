import { NextRequest, NextResponse } from "next/server";
import { extractTextFromPdf } from "@/lib/pdf";
import { analyzeResumeWithLLM, getServerLlmConfig, CustomLlmError, sanitizeErrorMessage } from "@/lib/llm";
import { SAMPLE_ANALYSIS } from "@/lib/sampleData";
import { AnalyzeApiResponse, ResumeMetadata } from "@/types/analysis";

// Return config status without exposing secrets
export async function GET() {
  const { hasServerKey, provider, model } = getServerLlmConfig();
  return NextResponse.json({
    hasServerKey,
    configured: hasServerKey,
    provider: provider || "not_configured",
    model: hasServerKey ? model : undefined,
  });
}

export async function POST(req: NextRequest) {
  let userApiKey = "";
  try {
    const formData = await req.formData();
    const isDemo = formData.get("isDemo") === "true";
    const jobDescription = (formData.get("jobDescription") as string || "").trim();
    const file = formData.get("resume") as File | null;
    userApiKey = (formData.get("apiKey") as string || "").trim();
    const userProvider = (formData.get("provider") as string || "").trim();

    // Handle demo mode explicitly requested
    if (isDemo) {
      const demoMeta: ResumeMetadata = {
        fileName: "alex_chen_senior_backend_resume.pdf",
        fileSizeBytes: 184200,
        numPages: 2,
        charCount: 2980,
        wordCount: 462,
        isSparse: false,
        extractedTextPreview: "ALEX CHEN\nFull-Stack & Backend Software Engineer...",
        fullExtractedText: "Sample extracted resume text for demonstration.",
      };

      const response: AnalyzeApiResponse = {
        success: true,
        data: SAMPLE_ANALYSIS,
        resumeMeta: demoMeta,
        isDemo: true,
      };
      return NextResponse.json(response);
    }

    // Validate Resume File
    if (!file) {
      return NextResponse.json(
        { success: false, error: "Please upload a resume PDF file.", code: "MISSING_RESUME" },
        { status: 400 }
      );
    }

    const fileName = file.name || "resume.pdf";
    if (!fileName.toLowerCase().endsWith(".pdf") && file.type !== "application/pdf") {
      return NextResponse.json(
        { success: false, error: "Invalid file type. Only PDF documents are supported.", code: "INVALID_FILE_TYPE" },
        { status: 400 }
      );
    }

    // Check file size (limit: 10MB)
    const MAX_FILE_SIZE = 10 * 1024 * 1024;
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { success: false, error: "File size exceeds 10MB limit. Please upload a smaller PDF.", code: "FILE_TOO_LARGE" },
        { status: 400 }
      );
    }

    // Validate Job Description
    if (!jobDescription) {
      return NextResponse.json(
        { success: false, error: "Please enter a job description before analyzing.", code: "EMPTY_JOB_DESCRIPTION" },
        { status: 400 }
      );
    }

    if (jobDescription.length < 50) {
      return NextResponse.json(
        {
          success: false,
          error: "Job description is too brief. Please paste the complete job description (at least 50 characters) for accurate matching.",
          code: "JOB_DESCRIPTION_TOO_SHORT",
        },
        { status: 400 }
      );
    }

    // Read file buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Extract PDF text
    let pdfData;
    try {
      pdfData = await extractTextFromPdf(buffer);
    } catch (extractError: unknown) {
      const rawMsg = (extractError as Error).message || "Failed to extract text from the uploaded PDF.";
      return NextResponse.json(
        {
          success: false,
          error: sanitizeErrorMessage(rawMsg, userApiKey),
          code: "PDF_EXTRACTION_FAILED",
        },
        { status: 422 }
      );
    }

    if (!pdfData.text || pdfData.charCount < 30) {
      return NextResponse.json(
        {
          success: false,
          error: "Unable to extract readable text from this PDF. Please upload a text-based resume PDF.",
          code: "PDF_EMPTY_TEXT",
        },
        { status: 422 }
      );
    }

    const resumeMeta: ResumeMetadata = {
      fileName,
      fileSizeBytes: file.size,
      numPages: pdfData.numPages,
      charCount: pdfData.charCount,
      wordCount: pdfData.wordCount,
      isSparse: pdfData.isSparse,
      extractedTextPreview: pdfData.preview,
      fullExtractedText: pdfData.text,
    };

    // Analyze with LLM using request-scoped key
    try {
      const analysisData = await analyzeResumeWithLLM({
        resumeText: pdfData.text,
        jobDescription,
        userApiKey: userApiKey || undefined,
        userProvider: userProvider || undefined,
      });

      const response: AnalyzeApiResponse = {
        success: true,
        data: analysisData,
        resumeMeta,
      };

      return NextResponse.json(response);
    } catch (llmError: unknown) {
      if (llmError instanceof CustomLlmError) {
        return NextResponse.json(
          {
            success: false,
            error: sanitizeErrorMessage(llmError.message, userApiKey),
            code: llmError.code,
          },
          { status: llmError.status }
        );
      }

      const rawMsg = (llmError as Error).message || "LLM analysis failed";
      const sanitized = sanitizeErrorMessage(rawMsg, userApiKey);
      console.error("LLM analysis failed:", sanitized);

      return NextResponse.json(
        {
          success: false,
          error: "Something went wrong while analyzing your resume. Please try again.",
          code: "PROVIDER_ERROR",
        },
        { status: 500 }
      );
    }
  } catch (err: unknown) {
    const rawMsg = (err as Error).message || "An unexpected server error occurred during analysis.";
    const sanitized = sanitizeErrorMessage(rawMsg, userApiKey);
    console.error("Server error:", sanitized);
    return NextResponse.json(
      {
        success: false,
        error: "Something went wrong while analyzing your resume. Please try again.",
        code: "SERVER_ERROR",
      },
      { status: 500 }
    );
  }
}
