# ResumeMatch 🎯

A private, local web application built for personal resume screening and job-matching analysis against specific job descriptions using an LLM.

---

## Architecture Overview

```
Browser (Upload PDF + Paste JD)
  ↓
Next.js Frontend (Tailwind CSS, TypeScript, React)
  ↓
Next.js Server API Route (/api/analyze)
  ↓
PDF Text Extraction (pdf-parse)
  ↓
Structured LLM Analysis (Gemini / OpenAI / Groq / OpenRouter)
  ↓
Algorithmic Weighted Scoring (Resume Match Score: 0-100)
  ↓
Interactive 10-Section Personal Dashboard
```

- **100% Private Local Session**: Resumes and job descriptions are never saved to a database, cloud bucket, or persistent storage.
- **Zero Heavy Infrastructure**: No authentication, no database, no Docker, no Redis, no background queues, and no analytics.

---

## 1. Quick Setup

### Step 1: Install Dependencies
```bash
npm install
```

### Step 2: Configure Your LLM API Key
Create a `.env.local` file in the project root:
```bash
cp .env.example .env.local
```

Open `.env.local` and add your LLM API key:
```env
LLM_API_KEY=your_actual_api_key_here
```

> **Exact Environment Variable Name:** `LLM_API_KEY`  
> *(Optional: If using a non-Gemini key such as OpenAI or Groq, the provider is auto-detected, or you can optionally set `LLM_PROVIDER=openai` or `LLM_PROVIDER=groq`)*

### Step 3: Start the Application
```bash
npm run dev
```

Visit **[http://localhost:3000](http://localhost:3000)** in your browser.

---

## 2. Core Features & Analysis Output

The application analyzes your resume and returns an evidence-based report covering:

1. **Resume Match Score (0–100)**: Deterministically weighted (Skills: 35%, Experience: 15%, Projects: 15%, Job Title Alignment: 10%, Keyword Coverage: 10%, ATS Readability: 5%, Education: 5%, Impact & Evidence: 5%).
2. **Executive Overview**: High-level readiness tier, strongest areas, biggest gaps, and top 3 priority actions.
3. **Skills Match Matrix**: Categorizes requirements into Matched (✓), Partial Match (◐), Not Mentioned (⚠), and Missing (✗) with exact resume evidence quotes.
4. **Keyword & Terminology Audit**: Matched vs. missing keywords with authentic emphasis recommendations (and anti-keyword-stuffing guardrails).
5. **Experience Relevance**: Overlap of proven job responsibilities, strengths, and areas with light evidence.
6. **Project Relevance & Strategy**: Identifies which projects to elevate and what architectural aspects to highlight.
7. **Skills Section Layout**: Specific recommendations on reordering and categorizing your skills block for maximum recruiter visibility.
8. **Bullet Point Improvements**: Side-by-side comparison of current bullets vs. high-impact rewrites (using strictly authentic resume facts—no phantom claims).
9. **Critical Guardrail: "Technologies You Should NOT Add"**: Explicitly warns against adding technologies from the JD that you cannot genuinely defend in technical interviews.
10. **Final Action Plan**: Interactive checklist of edits to complete before submitting your application.
11. **Collapsible Resume View**: Full raw text extractor view with page count and character count to audit ATS text parseability.

---

## 3. Limitations

- **Text-Based PDFs**: Relies on embedded text extraction. Image-only scanned PDFs (without OCR) will trigger a warning.
- **Session Ephemeral**: Refreshing the page clears the current analysis from memory (by design, for privacy). Use the **"Print / Save PDF Report"** button to preserve a copy.
- **LLM Rate Limits**: Governed by your chosen provider's rate limits and token limits.
