import {
  AnalysisResult,
  SectionScores,
  SkillMatchItem,
  MatchedSkill,
  PartialMatch,
  NotMentionedSkill,
  MissingSkill,
  HardRequirementItem,
  JdTermsBreakdown,
} from "@/types/analysis";
import { SYSTEM_PROMPT, buildAnalysisPrompt } from "@/lib/prompt";
import { computeCoreScores, getReadinessTier } from "@/lib/scoring";

export interface AnalyzeParams {
  resumeText: string;
  jobDescription: string;
  userApiKey?: string;
  userProvider?: string;
  userModel?: string;
}

export class CustomLlmError extends Error {
  code: string;
  status: number;
  constructor(message: string, code: string = "LLM_ERROR", status: number = 500) {
    super(message);
    this.name = "CustomLlmError";
    this.code = code;
    this.status = status;
  }
}

// Ensure no API keys ever appear in error messages or logs
export function sanitizeErrorMessage(message: string, keyToScrub?: string): string {
  if (!message) return "An unexpected error occurred.";
  let cleaned = message;
  if (keyToScrub && keyToScrub.length >= 4) {
    cleaned = cleaned.replaceAll(keyToScrub, "[REDACTED_API_KEY]");
  }
  // Also scrub any Google or OpenAI-style keys that might appear in raw messages
  cleaned = cleaned.replace(/AIza[0-9A-Za-z-_]{30,}/g, "[REDACTED_API_KEY]");
  cleaned = cleaned.replace(/sk-[0-9A-Za-z-_]{20,}/g, "[REDACTED_API_KEY]");
  cleaned = cleaned.replace(/gsk_[0-9A-Za-z-_]{20,}/g, "[REDACTED_API_KEY]");
  return cleaned;
}

export function getServerLlmConfig() {
  const apiKey =
    process.env.LLM_API_KEY ||
    process.env.GEMINI_API_KEY ||
    process.env.OPENAI_API_KEY ||
    process.env.GROQ_API_KEY ||
    process.env.OPENROUTER_API_KEY ||
    "";

  let provider = (process.env.LLM_PROVIDER || "").toLowerCase().trim();

  if (!provider && apiKey) {
    if (apiKey.startsWith("AIza")) {
      provider = "gemini";
    } else if (apiKey.startsWith("gsk_")) {
      provider = "groq";
    } else if (apiKey.startsWith("sk-or-")) {
      provider = "openrouter";
    } else if (apiKey.startsWith("sk-")) {
      provider = "openai";
    } else {
      provider = "gemini";
    }
  }

  const model = process.env.LLM_MODEL || "";
  const customBaseUrl = process.env.LLM_BASE_URL || "";

  return { hasServerKey: Boolean(apiKey), serverKey: apiKey, provider, model, customBaseUrl };
}

function cleanJsonString(raw: string): string {
  let cleaned = raw.trim();
  if (cleaned.startsWith("```json")) {
    cleaned = cleaned.replace(/^```json\s*/i, "").replace(/```\s*$/, "");
  } else if (cleaned.startsWith("```")) {
    cleaned = cleaned.replace(/^```\s*/, "").replace(/```\s*$/, "");
  }
  return cleaned.trim();
}

async function callGeminiApi(
  apiKey: string,
  model: string,
  systemPrompt: string,
  userPrompt: string
): Promise<string> {
  const modelsToTry = [model, "gemini-3.8-flash", "gemini-2.5-flash", "gemini-1.5-flash"].filter(
    (m, i, arr) => m && arr.indexOf(m) === i
  );

  let lastError: CustomLlmError | null = null;

  for (const candidateModel of modelsToTry) {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${candidateModel}:generateContent?key=${encodeURIComponent(
      apiKey
    )}`;

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            {
              role: "user",
              parts: [{ text: userPrompt }],
            },
          ],
          systemInstruction: {
            parts: [{ text: systemPrompt }],
          },
          generationConfig: {
            responseMimeType: "application/json",
            temperature: 0.1,
          },
        }),
      });

      if (!response.ok) {
        const rawErrorText = await response.text();
        const sanitizedBody = sanitizeErrorMessage(rawErrorText, apiKey);

        if (
          response.status === 400 &&
          (sanitizedBody.includes("API_KEY_INVALID") || sanitizedBody.includes("API key not valid"))
        ) {
          throw new CustomLlmError(
            "The API key was rejected by the AI provider. Please check your key and try again.",
            "INVALID_API_KEY",
            401
          );
        }

        if (response.status === 401 || response.status === 403) {
          throw new CustomLlmError(
            "The API key was rejected by the AI provider. Please check your key and try again.",
            "INVALID_API_KEY",
            401
          );
        }

        if (
          response.status === 429 ||
          sanitizedBody.includes("RESOURCE_EXHAUSTED") ||
          sanitizedBody.includes("quota")
        ) {
          if (sanitizedBody.toLowerCase().includes("quota") || sanitizedBody.toLowerCase().includes("billing")) {
            throw new CustomLlmError(
              "Your API provider reports that this API key has insufficient quota or billing availability.",
              "QUOTA_EXCEEDED",
              429
            );
          }
          // If rate limit, try alternative fallback model first before throwing
          lastError = new CustomLlmError(
            "Your API provider has rate-limited this request. Please try again later or use another API key.",
            "RATE_LIMIT",
            429
          );
          continue;
        }

        if (response.status === 503) {
          // Model temporarily overloaded, try fallback model
          lastError = new CustomLlmError(
            "The AI provider is currently experiencing temporary high demand. Please try again in a moment.",
            "PROVIDER_OVERLOAD",
            503
          );
          continue;
        }

        throw new CustomLlmError(
          "Something went wrong with the AI provider while analyzing your resume. Please try again.",
          "PROVIDER_ERROR",
          response.status
        );
      }

      const data = await response.json();
      const candidate = data.candidates?.[0];
      if (!candidate || !candidate.content?.parts?.[0]?.text) {
        throw new CustomLlmError(
          "No response text returned from the AI provider. Please try again.",
          "MALFORMED_RESPONSE",
          500
        );
      }

      return candidate.content.parts[0].text;
    } catch (err: unknown) {
      if (err instanceof CustomLlmError) {
        if (err.code === "INVALID_API_KEY" || err.code === "QUOTA_EXCEEDED") {
          throw err;
        }
        lastError = err;
      } else {
        lastError = new CustomLlmError(
          "Failed to establish connection to the AI provider. Please check your network.",
          "NETWORK_ERROR",
          500
        );
      }
    }
  }

  throw (
    lastError ||
    new CustomLlmError(
      "Failed to obtain a response from the AI provider. Please try again.",
      "PROVIDER_ERROR",
      500
    )
  );
}

async function callOpenAiCompatibleApi(
  apiKey: string,
  endpointUrl: string,
  model: string,
  systemPrompt: string,
  userPrompt: string
): Promise<string> {
  let response: Response;
  try {
    response = await fetch(endpointUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model,
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        response_format: { type: "json_object" },
        temperature: 0.1,
      }),
    });
  } catch {
    throw new CustomLlmError(
      "Failed to connect to the AI provider endpoint. Please check your network.",
      "NETWORK_ERROR",
      500
    );
  }

  if (!response.ok) {
    const rawErrorText = await response.text();
    const sanitizedBody = sanitizeErrorMessage(rawErrorText, apiKey).toLowerCase();

    if (response.status === 401 || response.status === 403) {
      throw new CustomLlmError(
        "The API key was rejected by the AI provider. Please check your key and try again.",
        "INVALID_API_KEY",
        401
      );
    }

    if (response.status === 429) {
      if (sanitizedBody.includes("quota") || sanitizedBody.includes("billing") || sanitizedBody.includes("exceeded")) {
        throw new CustomLlmError(
          "Your API provider reports that this API key has insufficient quota or billing availability.",
          "QUOTA_EXCEEDED",
          429
        );
      }
      throw new CustomLlmError(
        "Your API provider has rate-limited this request. Please try again later or use another API key.",
        "RATE_LIMIT",
        429
      );
    }

    if (response.status >= 500) {
      throw new CustomLlmError(
        "The AI provider server encountered an error. Please try again later.",
        "PROVIDER_ERROR",
        502
      );
    }

    throw new CustomLlmError(
      "Something went wrong while analyzing your resume with the AI provider.",
      "PROVIDER_ERROR",
      response.status
    );
  }

  let data;
  try {
    data = await response.json();
  } catch {
    throw new CustomLlmError(
      "Malformed JSON response received from the AI provider.",
      "MALFORMED_RESPONSE",
      500
    );
  }

  const content = data.choices?.[0]?.message?.content;
  if (!content) {
    throw new CustomLlmError(
      "No response content returned from the AI provider.",
      "MALFORMED_RESPONSE",
      500
    );
  }

  return content;
}

export async function analyzeResumeWithLLM({
  resumeText,
  jobDescription,
  userApiKey,
  userProvider,
  userModel,
}: AnalyzeParams): Promise<AnalysisResult> {
  // Step 1: Resolve Request-Scoped API Key
  const trimmedUserKey = (userApiKey || "").trim();
  const serverConfig = getServerLlmConfig();

  let activeApiKey = "";
  let isUsingUserKey = false;

  if (trimmedUserKey) {
    activeApiKey = trimmedUserKey;
    isUsingUserKey = true;
  } else if (serverConfig.hasServerKey) {
    // Development fallback only if no key was passed
    activeApiKey = serverConfig.serverKey;
    isUsingUserKey = false;
  }

  if (!activeApiKey) {
    throw new CustomLlmError("Please enter your API key to continue.", "MISSING_API_KEY", 401);
  }

  // Step 2: Resolve Provider and Model
  let provider = (userProvider || "").toLowerCase().trim();

  if (!provider || provider === "auto") {
    if (activeApiKey.startsWith("AIza")) {
      provider = "gemini";
    } else if (activeApiKey.startsWith("gsk_")) {
      provider = "groq";
    } else if (activeApiKey.startsWith("sk-or-")) {
      provider = "openrouter";
    } else if (activeApiKey.startsWith("sk-")) {
      provider = "openai";
    } else if (!isUsingUserKey && serverConfig.provider) {
      provider = serverConfig.provider;
    } else {
      provider = "gemini"; // default
    }
  }

  let defaultModel = "gemini-3.8-flash";
  if (provider === "openai") defaultModel = "gpt-4o-mini";
  else if (provider === "groq") defaultModel = "llama-3.3-70b-versatile";
  else if (provider === "openrouter") defaultModel = "meta-llama/llama-3.3-70b-instruct";
  else if (provider === "gemini") defaultModel = "gemini-3.8-flash";

  const model = userModel || (!isUsingUserKey && serverConfig.model ? serverConfig.model : defaultModel);
  const customBaseUrl = !isUsingUserKey ? serverConfig.customBaseUrl : "";

  // Step 3: Execute Request-Scoped LLM call
  const userPrompt = buildAnalysisPrompt(resumeText, jobDescription);
  let rawResponseText = "";

  try {
    if (provider === "gemini") {
      rawResponseText = await callGeminiApi(activeApiKey, model, SYSTEM_PROMPT, userPrompt);
    } else if (provider === "groq") {
      const url = customBaseUrl || "https://api.groq.com/openai/v1/chat/completions";
      rawResponseText = await callOpenAiCompatibleApi(activeApiKey, url, model, SYSTEM_PROMPT, userPrompt);
    } else if (provider === "openrouter") {
      const url = customBaseUrl || "https://openrouter.ai/api/v1/chat/completions";
      rawResponseText = await callOpenAiCompatibleApi(activeApiKey, url, model, SYSTEM_PROMPT, userPrompt);
    } else {
      // OpenAI or custom OpenAI-compatible
      const url = customBaseUrl || "https://api.openai.com/v1/chat/completions";
      rawResponseText = await callOpenAiCompatibleApi(activeApiKey, url, model, SYSTEM_PROMPT, userPrompt);
    }
  } catch (apiErr: unknown) {
    if (apiErr instanceof CustomLlmError) {
      throw apiErr;
    }
    const rawMsg = (apiErr as Error).message || "AI Provider connection failed.";
    throw new CustomLlmError(
      sanitizeErrorMessage(rawMsg, activeApiKey),
      "PROVIDER_ERROR",
      500
    );
  }

  // Step 4: Parse and validate JSON structure
  const cleanedJson = cleanJsonString(rawResponseText);
  let parsed: Partial<AnalysisResult>;
  try {
    parsed = JSON.parse(cleanedJson);
  } catch {
    throw new CustomLlmError(
      "Failed to parse the structured analysis response from the AI provider. Please try again.",
      "MALFORMED_LLM_RESPONSE",
      500
    );
  }

  // Ensure and validate section scores
  const rawScores = parsed.sectionScores || ({} as Partial<SectionScores>);
  const sectionScores: SectionScores = {
    atsReadability: Math.min(100, Math.max(0, Number(rawScores.atsReadability) || 75)),
    jobTitleAlignment: Math.min(100, Math.max(0, Number(rawScores.jobTitleAlignment) || 70)),
    skillsMatch: Math.min(100, Math.max(0, Number(rawScores.skillsMatch) || 70)),
    experienceMatch: Math.min(100, Math.max(0, Number(rawScores.experienceMatch) || 70)),
    projectMatch: Math.min(100, Math.max(0, Number(rawScores.projectMatch) || 70)),
    educationMatch: Math.min(100, Math.max(0, Number(rawScores.educationMatch) || 80)),
    keywordCoverage: Math.min(100, Math.max(0, Number(rawScores.keywordCoverage) || 70)),
    impactAndEvidence: Math.min(100, Math.max(0, Number(rawScores.impactAndEvidence) || 70)),
  };

  // Hard Requirements Processing
  const rawHardReqs = (parsed.hardRequirements || []) as HardRequirementItem[];
  const hardRequirements: HardRequirementItem[] = rawHardReqs.map((req) => ({
    requirement: req.requirement || "Eligibility requirement",
    isMet: Boolean(req.isMet),
    resumeEvidence: req.resumeEvidence || (req.isMet ? "Verified in resume" : "Not found in resume"),
    gapExplanation: req.gapExplanation || (req.isMet ? "Requirement met" : "Missing from candidate profile"),
  }));

  // Compute Core Scores deterministically
  const coreScores = computeCoreScores(
    parsed.technicalMatch,
    parsed.eligibilityMatch,
    parsed.resumeQuality,
    parsed.overallScore,
    hardRequirements,
    sectionScores
  );

  const readinessTier = getReadinessTier(coreScores.overallJobFit, coreScores.hardRequirementsMet);

  // Process and unify Skill Matches with source fields (Requirement 1 & 16)
  const rawSkillsList = (parsed.skillsMatchList || []) as SkillMatchItem[];
  const skillsMatchList: SkillMatchItem[] = [];

  const matchedSkills: MatchedSkill[] = [];
  const partialMatches: PartialMatch[] = [];
  const notMentioned: NotMentionedSkill[] = [];
  const missingSkills: MissingSkill[] = [];

  if (rawSkillsList.length > 0) {
    for (const item of rawSkillsList) {
      const status = item.status || "not_mentioned";
      const skillItem: SkillMatchItem = {
        skill: item.skill,
        category: item.category || "technical",
        importance: item.importance || "required",
        status,
        resume_evidence:
          item.resume_evidence || (status === "explicit_match" ? "Direct match in resume" : "Not mentioned in resume"),
        jd_evidence: item.jd_evidence || "Required by job description",
        explanation: item.explanation || "",
      };
      skillsMatchList.push(skillItem);

      if (status === "explicit_match") {
        matchedSkills.push({
          skill: skillItem.skill,
          category: skillItem.category,
          importance: skillItem.importance,
          resume_evidence: skillItem.resume_evidence,
          jd_evidence: skillItem.jd_evidence,
          evidence: skillItem.resume_evidence,
          strength: "strong",
          explanation: skillItem.explanation,
        });
      } else if (status === "partial_match") {
        partialMatches.push({
          skill: skillItem.skill,
          category: skillItem.category,
          importance: skillItem.importance,
          resume_evidence: skillItem.resume_evidence,
          jd_evidence: skillItem.jd_evidence,
          resumeEvidence: skillItem.resume_evidence,
          explanation: skillItem.explanation,
        });
      } else if (status === "not_mentioned") {
        notMentioned.push({
          skill: skillItem.skill,
          category: skillItem.category,
          importance: skillItem.importance,
          resume_evidence: skillItem.resume_evidence,
          jd_evidence: skillItem.jd_evidence,
          explanation: skillItem.explanation,
        });
      } else {
        missingSkills.push({
          skill: skillItem.skill,
          category: skillItem.category,
          importance: skillItem.importance,
          resume_evidence: skillItem.resume_evidence,
          jd_evidence: skillItem.jd_evidence,
          explanation: skillItem.explanation,
        });
      }
    }
  }

  // Categorized JD terms (Requirement 11)
  const rawTerms = parsed.jdTerms || ({} as Partial<JdTermsBreakdown>);
  const jdTerms: JdTermsBreakdown = {
    technicalSkills: rawTerms.technicalSkills || parsed.jobOverview?.primarySkills || [],
    engineeringPractices: rawTerms.engineeringPractices || [],
    responsibilities: rawTerms.responsibilities || parsed.jobOverview?.responsibilities || [],
    softSkills: rawTerms.softSkills || [],
    eligibilityRequirements: rawTerms.eligibilityRequirements || parsed.jobOverview?.experienceRequirements || [],
  };

  const fullResult: AnalysisResult = {
    technicalMatch: coreScores.technicalMatch,
    eligibilityMatch: coreScores.eligibilityMatch,
    resumeQuality: coreScores.resumeQuality,
    overallScore: coreScores.overallJobFit,

    hardRequirements,
    hardRequirementsMet: coreScores.hardRequirementsMet,
    hardRequirementWarning: coreScores.hardRequirementWarning || parsed.hardRequirementWarning,

    summary: parsed.summary || "Analysis completed against the provided job description.",
    summaryRecommendation: parsed.summaryRecommendation,

    sectionScores,
    jobOverview: {
      role: parsed.jobOverview?.role || "Target Role",
      seniority: parsed.jobOverview?.seniority || "Mid-to-Senior",
      company: parsed.jobOverview?.company || "Not specified",
      primarySkills: parsed.jobOverview?.primarySkills || [],
      secondarySkills: parsed.jobOverview?.secondarySkills || [],
      responsibilities: parsed.jobOverview?.responsibilities || [],
      educationRequirements: parsed.jobOverview?.educationRequirements || [],
      experienceRequirements: parsed.jobOverview?.experienceRequirements || [],
      locationRequirements: parsed.jobOverview?.locationRequirements || [],
    },
    jdTerms,

    strongestAreas: parsed.strongestAreas || [
      "Core technology requirements alignment",
      "Demonstrated relevant project and work history",
    ],
    biggestGaps: parsed.biggestGaps || [
      "Certain niche tools or preferred certifications from the JD are not mentioned",
    ],
    topRecommendations: parsed.topRecommendations || [
      "Emphasize matched core skills at the top of your resume",
      "Ensure bullet points describe direct impact with concrete metrics",
      "Do not add technologies you lack genuine experience in",
    ],

    skillsMatchList,
    matchedSkills,
    partialMatches,
    notMentioned,
    missingSkills,

    matchedKeywords: parsed.matchedKeywords || [],
    missingKeywords: parsed.missingKeywords || [],
    keywordsToEmphasize: parsed.keywordsToEmphasize || [],

    experienceAnalysis: {
      score: parsed.experienceAnalysis?.score || sectionScores.experienceMatch,
      matchingResponsibilities: parsed.experienceAnalysis?.matchingResponsibilities || [],
      strengths: parsed.experienceAnalysis?.strengths || [],
      weaknesses: parsed.experienceAnalysis?.weaknesses || [],
      recommendations: parsed.experienceAnalysis?.recommendations || [],
    },
    projectAnalysis: {
      score: parsed.projectAnalysis?.score || sectionScores.projectMatch,
      strengths: parsed.projectAnalysis?.strengths || [],
      weaknesses: parsed.projectAnalysis?.weaknesses || [],
      recommendations: parsed.projectAnalysis?.recommendations || [],
      relevantProjects: parsed.projectAnalysis?.relevantProjects || [],
    },
    skillsSectionAnalysis: {
      score: parsed.skillsSectionAnalysis?.score || sectionScores.skillsMatch,
      alreadyAligned: parsed.skillsSectionAnalysis?.alreadyAligned || [],
      shouldReorder: parsed.skillsSectionAnalysis?.shouldReorder || [],
      irrelevantForJD: parsed.skillsSectionAnalysis?.irrelevantForJD || [],
      shouldBeMoreVisible: parsed.skillsSectionAnalysis?.shouldBeMoreVisible || [],
      recommendations: parsed.skillsSectionAnalysis?.recommendations || [],
    },
    educationAnalysis: {
      score: parsed.educationAnalysis?.score || sectionScores.educationMatch,
      matchStatus: parsed.educationAnalysis?.matchStatus || "Eligible",
      recommendations: parsed.educationAnalysis?.recommendations || [],
    },
    atsFormattingAnalysis: {
      score: parsed.atsFormattingAnalysis?.score || sectionScores.atsReadability,
      strengths: parsed.atsFormattingAnalysis?.strengths || [
        "Standard typography and parseable section headers",
      ],
      issues: parsed.atsFormattingAnalysis?.issues || [],
    },
    bulletImprovements: parsed.bulletImprovements || [],
    resumeImprovements: parsed.resumeImprovements || [],
    doNotAdd: parsed.doNotAdd || [],
    applicationReadiness: {
      level: coreScores.hardRequirementsMet
        ? parsed.applicationReadiness?.level || readinessTier.level
        : "Low Match",
      reason: coreScores.hardRequirementsMet
        ? parsed.applicationReadiness?.reason || readinessTier.description
        : coreScores.hardRequirementWarning || "Candidate fails one or more mandatory eligibility requirements.",
    },
    actionPlan: parsed.actionPlan || [
      "Refine resume summary and top skills to mirror the job title and core requirements",
      "Update bullet points with suggested high-impact phrasing",
      "Highlight top relevant projects",
      "Avoid adding technologies not supported by genuine experience",
    ],
  };

  return fullResult;
}
