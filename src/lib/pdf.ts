import "pdf-parse/worker";
import { PDFParse } from "pdf-parse";

export const runtime = "nodejs";

export interface ExtractedPdfResult {
  text: string;
  numPages: number;
  charCount: number;
  wordCount: number;
  isSparse: boolean;
  preview: string;
}

export async function extractTextFromPdf(buffer: Buffer): Promise<ExtractedPdfResult> {
  if (!buffer || buffer.length === 0) {
    throw new Error("Uploaded PDF file is empty.");
  }

  // Validate PDF magic number (%PDF-)
  const header = buffer.subarray(0, 5).toString("utf-8");
  if (!header.startsWith("%PDF")) {
    throw new Error("Invalid file format. The uploaded file does not have a valid PDF header.");
  }

  let parser: InstanceType<typeof PDFParse> | null = null;
  try {
    parser = new PDFParse({ data: buffer });
    const textResult = await parser.getText();
    const numPages = textResult.total || 1;
    let rawText = textResult.text || "";

    // Clean and normalize text
    // Replace null bytes and strange control characters
    rawText = rawText.replace(/\0/g, "");

    // Normalize excessive horizontal whitespace while preserving paragraph breaks
    const normalizedLines = rawText
      .split("\n")
      .map((line) => line.trim())
      .filter((line, i, arr) => {
        // filter out more than 2 consecutive blank lines
        if (line === "" && arr[i - 1] === "") return false;
        return true;
      });

    const cleanText = normalizedLines.join("\n").trim();
    const charCount = cleanText.length;
    const wordCount = cleanText.length > 0 ? cleanText.split(/\s+/).filter(Boolean).length : 0;

    // Check if text is suspiciously sparse (e.g. scanned image resume without embedded text)
    const isSparse = charCount < 200 || (charCount / numPages) < 150;

    // Preview for debug drawer
    const preview = cleanText.slice(0, 1500) + (cleanText.length > 1500 ? "..." : "");

    return {
      text: cleanText,
      numPages,
      charCount,
      wordCount,
      isSparse,
      preview,
    };
  } catch (error: unknown) {
    const err = error as Error;
    if (err.name === "PasswordException" || err.message?.toLowerCase().includes("password")) {
      throw new Error("This PDF is password-protected. Please upload an unlocked PDF.");
    }
    throw new Error(`Failed to extract text from PDF: ${err.message || "Unknown error"}`);
  } finally {
    if (parser && typeof parser.destroy === "function") {
      try {
        await parser.destroy();
      } catch {
        // Ignore cleanup errors
      }
    }
  }
}
