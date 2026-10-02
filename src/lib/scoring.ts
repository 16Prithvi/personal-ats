import { SectionScores, HardRequirementItem } from "@/types/analysis";

export const SCORE_WEIGHTS = {
  atsReadability: { label: "ATS Readability", weight: 0.05, percentage: "5%" },
  jobTitleAlignment: { label: "Job Title Alignment", weight: 0.10, percentage: "10%" },
  skillsMatch: { label: "Skills Match (Required & Preferred)", weight: 0.35, percentage: "35%" },
  experienceMatch: { label: "Experience Relevance", weight: 0.15, percentage: "15%" },
  projectMatch: { label: "Project Relevance", weight: 0.15, percentage: "15%" },
  keywordCoverage: { label: "Keyword Coverage", weight: 0.10, percentage: "10%" },
  educationMatch: { label: "Education & Eligibility", weight: 0.05, percentage: "5%" },
  impactAndEvidence: { label: "Impact & Evidence", weight: 0.05, percentage: "5%" },
} as const;

export interface CoreScoreBreakdown {
  technicalMatch: number;
  eligibilityMatch: number;
  resumeQuality: number;
  overallJobFit: number;
  hardRequirementsMet: boolean;
  hardRequirementWarning?: string;
}

export function computeCoreScores(
  rawTechnical: number | undefined,
  rawEligibility: number | undefined,
  rawQuality: number | undefined,
  rawOverall: number | undefined,
  hardRequirements: HardRequirementItem[] = [],
  sectionScores: SectionScores
): CoreScoreBreakdown {
  const clamp = (val: number | undefined, fallback: number) => {
    const num = Number(val);
    if (isNaN(num)) return fallback;
    return Math.min(100, Math.max(0, Math.round(num)));
  };

  // Determine if all hard requirements are met
  const unmetHardReqs = hardRequirements.filter((req) => !req.isMet);
  const hardRequirementsMet = unmetHardReqs.length === 0;

  // 1. Technical Match (skills match + project depth + title alignment)
  const technicalMatch = clamp(
    rawTechnical,
    Math.round(
      sectionScores.skillsMatch * 0.5 +
        sectionScores.projectMatch * 0.35 +
        sectionScores.keywordCoverage * 0.15
    )
  );

  // 2. Eligibility Match (experience match + education match)
  let eligibilityMatch = clamp(
    rawEligibility,
    Math.round(
      sectionScores.experienceMatch * 0.65 + sectionScores.educationMatch * 0.35
    )
  );

  // If a hard requirement is explicitly unmet, heavily penalize Eligibility Match
  if (!hardRequirementsMet) {
    eligibilityMatch = Math.min(eligibilityMatch, Math.max(25, 60 - unmetHardReqs.length * 20));
  }

  // 3. Resume Quality (ATS readability + quantified impact & evidence)
  const resumeQuality = clamp(
    rawQuality,
    Math.round(
      sectionScores.atsReadability * 0.5 + sectionScores.impactAndEvidence * 0.5
    )
  );

  // 4. Overall Job Fit
  // Requirement 8: Do not let a strong project score hide a major professional-experience requirement.
  // Requirement 14: Overall Job Fit should clearly warn when a hard requirement is unmet.
  let overallJobFit: number;
  let hardRequirementWarning: string | undefined = undefined;

  if (!hardRequirementsMet) {
    // Unmet hard requirement caps the overall job fit score
    overallJobFit = Math.min(
      52,
      Math.round(technicalMatch * 0.35 + eligibilityMatch * 0.5 + resumeQuality * 0.15)
    );
    const missingDescriptions = unmetHardReqs.map((r) => r.requirement).join("; ");
    hardRequirementWarning = `Mandatory eligibility requirement not satisfied: ${missingDescriptions}. While technical skills may be relevant, this is a major screening barrier.`;
  } else {
    overallJobFit = clamp(
      rawOverall,
      Math.round(
        technicalMatch * 0.45 + eligibilityMatch * 0.40 + resumeQuality * 0.15
      )
    );
  }

  return {
    technicalMatch,
    eligibilityMatch,
    resumeQuality,
    overallJobFit,
    hardRequirementsMet,
    hardRequirementWarning,
  };
}

export function getReadinessTier(
  score: number,
  hardRequirementsMet: boolean = true
): {
  level: "Strong Match" | "Good Match" | "Moderate Match" | "Low Match";
  colorClass: string;
  badgeClass: string;
  description: string;
} {
  if (!hardRequirementsMet) {
    return {
      level: "Low Match",
      colorClass: "text-rose-600 dark:text-rose-400",
      badgeClass:
        "bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-800",
      description:
        "Unmet mandatory eligibility requirement. The candidate does not satisfy one or more hard requirements (e.g. required professional years or degree) specified in the job description.",
    };
  }

  if (score >= 80) {
    return {
      level: "Strong Match",
      colorClass: "text-emerald-600 dark:text-emerald-400",
      badgeClass:
        "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800",
      description:
        "Your resume demonstrates strong technical competence and fully satisfies all mandatory eligibility requirements for this position.",
    };
  }
  if (score >= 65) {
    return {
      level: "Good Match",
      colorClass: "text-blue-600 dark:text-blue-400",
      badgeClass:
        "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/40 dark:text-blue-300 dark:border-blue-800",
      description:
        "Solid foundational match. All hard requirements appear met. Enhancing specific bullet points and emphasizing relevant projects will notably strengthen your candidacy.",
    };
  }
  if (score >= 50) {
    return {
      level: "Moderate Match",
      colorClass: "text-amber-600 dark:text-amber-400",
      badgeClass:
        "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800",
      description:
        "Partial alignment. While basic eligibility is present, several core technical requirements or engineering practices lack direct evidence in the resume.",
    };
  }
  return {
    level: "Low Match",
    colorClass: "text-rose-600 dark:text-rose-400",
    badgeClass:
      "bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-800",
    description:
      "Significant gaps between the resume and target job profile. Substantial tailoring or prerequisite skill acquisition is needed.",
  };
}
