export type EvidenceStatus =
  | "explicit_match"
  | "partial_match"
  | "not_mentioned"
  | "missing";

export type TermCategory =
  | "technical"
  | "practice"
  | "responsibility"
  | "soft_skill"
  | "eligibility";

export interface SectionScores {
  atsReadability: number;
  jobTitleAlignment: number;
  skillsMatch: number;
  experienceMatch: number;
  projectMatch: number;
  educationMatch: number;
  keywordCoverage: number;
  impactAndEvidence: number;
}

export interface HardRequirementItem {
  requirement: string;
  isMet: boolean;
  resumeEvidence: string;
  gapExplanation: string;
}

export interface JdTermsBreakdown {
  technicalSkills: string[];
  engineeringPractices: string[];
  responsibilities: string[];
  softSkills: string[];
  eligibilityRequirements: string[];
}

export interface JobOverview {
  role: string;
  seniority: string;
  company?: string;
  primarySkills: string[];
  secondarySkills: string[];
  responsibilities: string[];
  educationRequirements: string[];
  experienceRequirements: string[];
  locationRequirements?: string[];
}

export interface SkillMatchItem {
  skill: string;
  category: TermCategory;
  importance: "required" | "preferred" | "bonus";
  status: EvidenceStatus;
  resume_evidence: string; // Exact short excerpt from extracted resume text ONLY
  jd_evidence: string;     // Exact short requirement from JD
  explanation: string;
}

export interface MatchedSkill {
  skill: string;
  category?: TermCategory;
  importance: "required" | "preferred" | "bonus";
  resume_evidence: string;
  jd_evidence: string;
  strength: "strong" | "moderate";
  explanation?: string;
  evidence?: string; // fallback for backward compatibility
}

export interface PartialMatch {
  skill: string;
  category?: TermCategory;
  importance: "required" | "preferred" | "bonus";
  resume_evidence: string;
  jd_evidence: string;
  explanation: string;
  resumeEvidence?: string; // fallback for backward compatibility
}

export interface NotMentionedSkill {
  skill: string;
  category?: TermCategory;
  importance: "required" | "preferred" | "bonus";
  resume_evidence: string;
  jd_evidence: string;
  explanation: string;
}

export interface MissingSkill {
  skill: string;
  category?: TermCategory;
  importance: "required" | "preferred" | "bonus";
  resume_evidence: string;
  jd_evidence: string;
  explanation: string;
}

export interface KeywordToEmphasize {
  keyword: string;
  context: string;
  recommendation: string;
}

export interface ExperienceAnalysis {
  score: number;
  matchingResponsibilities: string[];
  strengths: string[];
  weaknesses: string[];
  recommendations: string[];
}

export interface RelevantProject {
  name: string;
  relevance: "High" | "Medium" | "Low";
  matchingTechnologies: string[];
  why: string;
  recommendation: string;
}

export interface ProjectAnalysis {
  score: number;
  strengths: string[];
  weaknesses: string[];
  recommendations: string[];
  relevantProjects: RelevantProject[];
}

export interface SkillsSectionAnalysis {
  score: number;
  alreadyAligned: string[];
  shouldReorder: string[];
  irrelevantForJD: string[];
  shouldBeMoreVisible: string[];
  recommendations: string[];
}

export interface EducationAnalysis {
  score: number;
  matchStatus: string;
  recommendations: string[];
}

export interface AtsFormattingAnalysis {
  score: number;
  strengths: string[];
  issues: string[];
}

export interface BulletImprovement {
  section: string;
  currentBullet: string;
  suggestedBullet: string;
  reason: string;
  priority: "high" | "medium" | "low";
}

export interface ResumeImprovement {
  section: string;
  priority: "high" | "medium" | "low";
  issue: string;
  recommendation: string;
  reason: string;
}

export interface DoNotAdd {
  skill: string;
  reason: string;
}

export interface ApplicationReadiness {
  level: "Strong Match" | "Good Match" | "Moderate Match" | "Low Match" | string;
  reason: string;
}

export interface SummaryRecommendation {
  recommended: boolean;
  reason: string;
  suggestedSummary?: string;
}

export interface AnalysisResult {
  // Four Core Scores requested:
  technicalMatch: number;   // Technical Match: X/100
  eligibilityMatch: number; // Eligibility Match: X/100
  resumeQuality: number;    // Resume Quality: X/100
  overallScore: number;     // Overall Job Fit: X/100

  // Hard Requirements / Eligibility Detection
  hardRequirements: HardRequirementItem[];
  hardRequirementsMet: boolean;
  hardRequirementWarning?: string;

  summary: string;
  summaryRecommendation?: SummaryRecommendation;

  sectionScores: SectionScores;
  jobOverview: JobOverview;
  jdTerms: JdTermsBreakdown;

  strongestAreas: string[];
  biggestGaps: string[];
  topRecommendations: string[];

  // Master list of evaluated skills & requirements
  skillsMatchList: SkillMatchItem[];

  // Grouped lists for rendering convenience
  matchedSkills: MatchedSkill[];
  partialMatches: PartialMatch[];
  notMentioned: NotMentionedSkill[];
  missingSkills: MissingSkill[];

  matchedKeywords: string[];
  missingKeywords: string[];
  keywordsToEmphasize: KeywordToEmphasize[];

  experienceAnalysis: ExperienceAnalysis;
  projectAnalysis: ProjectAnalysis;
  skillsSectionAnalysis: SkillsSectionAnalysis;
  educationAnalysis: EducationAnalysis;
  atsFormattingAnalysis: AtsFormattingAnalysis;

  bulletImprovements: BulletImprovement[];
  resumeImprovements: ResumeImprovement[];
  doNotAdd: DoNotAdd[];
  applicationReadiness: ApplicationReadiness;
  actionPlan: string[];
}

export interface ResumeMetadata {
  fileName: string;
  fileSizeBytes: number;
  numPages: number;
  charCount: number;
  wordCount: number;
  isSparse: boolean;
  extractedTextPreview: string;
  fullExtractedText: string;
}

export interface AnalyzeSuccessResponse {
  success: true;
  data: AnalysisResult;
  resumeMeta: ResumeMetadata;
  isDemo?: boolean;
}

export interface AnalyzeErrorResponse {
  success: false;
  error: string;
  code?: string;
  details?: string;
}

export type AnalyzeApiResponse = AnalyzeSuccessResponse | AnalyzeErrorResponse;
