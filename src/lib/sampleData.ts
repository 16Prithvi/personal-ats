import { AnalysisResult } from "@/types/analysis";

export const SAMPLE_JOB_DESCRIPTION = `Job Title: Senior Backend Engineer
Company: Apex Financial Systems
Location: Remote (US / Global)

About the Role:
Apex Financial Systems is seeking a Senior Backend Engineer to architect, build, and scale our high-throughput transaction and order matching platform. You will design distributed systems that process tens of thousands of financial events per second with sub-millisecond latencies.

Key Responsibilities:
- Design, build, and maintain mission-critical backend services in Node.js and TypeScript.
- Architect scalable, resilient databases using PostgreSQL, implementing efficient indexing, partitioning, and concurrency controls (row-level locking, MVCC).
- Implement distributed caching, real-time message brokering, and pub/sub pipelines using Redis and Apache Kafka.
- Build real-time bidirectional streaming microservices using WebSockets.
- Containerize and deploy services to Kubernetes clusters on AWS with automated CI/CD pipelines.
- Collaborate with frontend engineers, product managers, and site reliability engineers to ensure 99.99% system availability.

Required Qualifications:
- 4+ years of professional backend development experience building scalable services in Node.js and TypeScript.
- Deep expertise in relational databases, particularly PostgreSQL, including query optimization, ACID transactions, and locking mechanisms.
- Proven hands-on experience with Redis for caching, state management, and pub/sub messaging.
- Strong knowledge of real-time protocols such as WebSockets or gRPC.
- Solid background in concurrency, distributed systems principles, and event-driven architecture.
- Bachelor's degree in Computer Science, Software Engineering, or equivalent practical experience.

Preferred / Nice-to-Have:
- Experience orchestrating microservices in production with Kubernetes and Docker on AWS.
- Familiarity with message brokers such as Kafka or RabbitMQ.
- Knowledge of financial systems, order books, or auction bidding algorithms.
- Experience with Go or Java for low-latency background microservices.`;

export const SAMPLE_RESUME_TEXT = `ALEX CHEN
Full-Stack & Backend Software Engineer
San Francisco, CA | alex.chen@example.com | github.com/alexchen | linkedin.com/in/alexchen

PROFESSIONAL SUMMARY
Results-driven software engineer with 4+ years of experience designing and scaling high-performance web applications, distributed backend services, and real-time APIs using Node.js, TypeScript, and PostgreSQL. Proven track record of improving database query performance by 65% and delivering real-time streaming architectures serving 50,000+ active users.

TECHNICAL SKILLS
- Languages: TypeScript, JavaScript (ES6+), Python, SQL, HTML5/CSS3
- Backend: Node.js, Express, NestJS, REST APIs, GraphQL, WebSockets, Socket.IO
- Databases & Caching: PostgreSQL, MySQL, Redis, MongoDB, Prisma ORM
- DevOps & Cloud: Docker, AWS (S3, EC2, RDS, Lambda), GitHub Actions, Linux
- Concepts: Distributed Systems, Concurrency Control, Event-Driven Architecture, Microservices, CI/CD

PROFESSIONAL EXPERIENCE

Backend Software Engineer | CloudScale Tech | 2022 - Present
- Architected and deployed microservices handling 12,000 requests/sec using Node.js, Express, and Redis caching, cutting P95 latency from 180ms to 42ms.
- Optimized core PostgreSQL database schemas and indexing strategies, eliminating slow full-table scans and boosting query execution speeds by 65%.
- Implemented real-time telemetry streaming pipeline using WebSockets and Redis Pub/Sub to monitor 400+ remote IoT client nodes simultaneously.
- Containerized development and staging environments with Docker and automated build/test pipelines via GitHub Actions.

Software Engineer | Nova Digital Solutions | 2020 - 2022
- Developed customer-facing web applications using React, Node.js, and PostgreSQL for enterprise retail clients.
- Designed RESTful API endpoints and integrated Stripe payment processing, supporting $1.8M in quarterly transaction volume.
- Collaborated in an Agile Scrum squad of 7 engineers, participating in code reviews, technical design docs, and sprint planning.

KEY PROJECTS

Real-Time Auction & Bidding Engine (github.com/alexchen/auction-engine)
- Engineered a real-time multiplayer bidding platform supporting 10,000 concurrent bidders using Node.js, TypeScript, and Socket.IO.
- Designed transactional state management in PostgreSQL utilizing row-level locking to prevent race conditions during sub-second concurrent bids.
- Integrated Redis for in-memory session caching, live auction leaderboards, and broadcast channel distribution.
- Deployed on AWS EC2 with Docker containers and configured NGINX reverse proxy for SSL termination and WebSocket upgrade handling.

Distributed Task Queue & Scheduler
- Built an asynchronous distributed background job processor in TypeScript and Redis BullMQ capable of handling 500,000 tasks daily.
- Implemented exponential backoff retries, dead-letter queues, and atomic job locks to guarantee at-least-once execution semantics.

EDUCATION
Bachelor of Science in Computer Science
University of California, Davis | Graduated 2020`;

export const SAMPLE_ANALYSIS: AnalysisResult = {
  // Four Core Scores (Requirement 13)
  technicalMatch: 88,
  eligibilityMatch: 96,
  resumeQuality: 92,
  overallScore: 90, // Overall Job Fit: 90/100

  // Hard Requirements / Eligibility Detection (Requirement 7 & 14)
  hardRequirementsMet: true,
  hardRequirementWarning: undefined,
  hardRequirements: [
    {
      requirement: "4+ years of professional backend development experience building scalable services",
      isMet: true,
      resumeEvidence: "4+ years of experience (CloudScale Tech: 2022 - Present, 2 years; Nova Digital: 2020 - 2022, 2 years; total 4+ years)",
      gapExplanation: "Fully satisfies the 4-year professional backend seniority requirement.",
    },
    {
      requirement: "Bachelor's degree in Computer Science, Software Engineering, or equivalent",
      isMet: true,
      resumeEvidence: "Bachelor of Science in Computer Science, University of California, Davis | Graduated 2020",
      gapExplanation: "Degree requirement fully satisfied.",
    },
  ],

  summary:
    "Strong candidate match. Candidate meets all mandatory eligibility criteria (4+ years professional experience and BS in Computer Science). The resume provides explicit, verifiable evidence for Node.js, TypeScript, PostgreSQL (indexing & row-level locking), Redis (caching & Pub/Sub), WebSockets, and Docker. The primary technical gaps are Kubernetes and Apache Kafka, neither of which are mentioned in the resume.",

  summaryRecommendation: {
    recommended: false,
    reason: "The resume already features an effective, factual 3-line Professional Summary. Adding a redundant summary is not necessary.",
  },

  // Categorized JD terms (Requirement 11)
  jdTerms: {
    technicalSkills: [
      "Node.js",
      "TypeScript",
      "PostgreSQL",
      "Redis",
      "WebSockets",
      "Docker",
      "AWS",
      "Kubernetes",
      "Apache Kafka",
      "Go",
      "Java",
    ],
    engineeringPractices: [
      "Row-level locking",
      "ACID transactions",
      "Indexing & query optimization",
      "Concurrency control",
      "Event-driven architecture",
      "CI/CD automation",
    ],
    responsibilities: [
      "Design, build, and maintain mission-critical backend services in Node.js and TypeScript",
      "Architect scalable databases using PostgreSQL with indexing and concurrency controls",
      "Implement distributed caching, real-time message brokering, and pub/sub pipelines",
      "Build real-time bidirectional streaming microservices using WebSockets",
    ],
    softSkills: [
      "Agile Scrum collaboration",
      "Technical design documentation",
      "Code reviews",
      "Engineering collaboration",
    ],
    eligibilityRequirements: [
      "4+ years professional backend development experience",
      "Bachelor's degree in Computer Science or equivalent",
    ],
  },

  sectionScores: {
    atsReadability: 96,
    jobTitleAlignment: 88,
    skillsMatch: 88,
    experienceMatch: 92,
    projectMatch: 94,
    educationMatch: 98,
    keywordCoverage: 84,
    impactAndEvidence: 88,
  },

  jobOverview: {
    role: "Senior Backend Engineer",
    seniority: "Senior (4+ years)",
    company: "Apex Financial Systems",
    primarySkills: ["Node.js", "TypeScript", "PostgreSQL", "Redis", "WebSockets"],
    secondarySkills: ["Kubernetes", "Docker", "AWS", "Kafka", "Distributed Systems"],
    responsibilities: [
      "Architect and scale high-throughput transaction and order matching services in Node.js/TypeScript",
      "Optimize PostgreSQL databases using indexing, partitioning, and concurrency controls",
      "Build real-time streaming services with WebSockets and Redis pub/sub",
      "Deploy containerized microservices to cloud infrastructure on AWS",
    ],
    educationRequirements: ["Bachelor's degree in Computer Science, Software Engineering, or equivalent"],
    experienceRequirements: ["4+ years of professional backend development experience building scalable services"],
    locationRequirements: ["Remote (US / Global)"],
  },

  // Granular Skill Verification with Source Fields (Requirement 1 & 16)
  skillsMatchList: [
    {
      skill: "Node.js",
      category: "technical",
      importance: "required",
      status: "explicit_match",
      resume_evidence: "Architected and deployed microservices handling 12,000 requests/sec using Node.js, Express, and Redis caching",
      jd_evidence: "4+ years of professional backend development experience building scalable services in Node.js and TypeScript",
      explanation: "Direct verbatim match found across multiple production roles and showcase projects.",
    },
    {
      skill: "TypeScript",
      category: "technical",
      importance: "required",
      status: "explicit_match",
      resume_evidence: "Engineered a real-time multiplayer bidding platform supporting 10,000 concurrent bidders using Node.js, TypeScript, and Socket.IO",
      jd_evidence: "Design, build, and maintain mission-critical backend services in Node.js and TypeScript",
      explanation: "Explicit match evidenced in professional summary, technical skills list, and projects.",
    },
    {
      skill: "PostgreSQL",
      category: "technical",
      importance: "required",
      status: "explicit_match",
      resume_evidence: "Optimized core PostgreSQL database schemas and indexing strategies, eliminating slow full-table scans and boosting query execution speeds by 65%",
      jd_evidence: "Deep expertise in relational databases, particularly PostgreSQL, including query optimization, ACID transactions, and locking mechanisms",
      explanation: "Direct match with explicit performance metrics and concurrency locking.",
    },
    {
      skill: "Redis",
      category: "technical",
      importance: "required",
      status: "explicit_match",
      resume_evidence: "Integrated Redis for in-memory session caching, live auction leaderboards, and broadcast channel distribution",
      jd_evidence: "Proven hands-on experience with Redis for caching, state management, and pub/sub messaging",
      explanation: "Direct match for caching, Pub/Sub, and distributed task queues.",
    },
    {
      skill: "WebSockets",
      category: "technical",
      importance: "required",
      status: "explicit_match",
      resume_evidence: "Implemented real-time telemetry streaming pipeline using WebSockets and Redis Pub/Sub to monitor 400+ remote IoT client nodes simultaneously",
      jd_evidence: "Build real-time bidirectional streaming microservices using WebSockets",
      explanation: "Direct match with bidirectional telemetry stream implementation.",
    },
    {
      skill: "REST APIs",
      category: "technical",
      importance: "required",
      status: "explicit_match",
      resume_evidence: "Designed RESTful API endpoints and integrated Stripe payment processing, supporting $1.8M in quarterly transaction volume",
      jd_evidence: "Design, build, and maintain mission-critical backend services and APIs",
      explanation: "Explicitly evidenced by 'Designed RESTful API endpoints' in professional experience (not inferred from general backend).",
    },
    {
      skill: "Docker",
      category: "technical",
      importance: "preferred",
      status: "explicit_match",
      resume_evidence: "Containerized development and staging environments with Docker and automated build/test pipelines via GitHub Actions",
      jd_evidence: "Experience orchestrating microservices in production with Kubernetes and Docker on AWS",
      explanation: "Explicit match for Docker containerization.",
    },
    {
      skill: "AWS Cloud",
      category: "technical",
      importance: "preferred",
      status: "explicit_match",
      resume_evidence: "Deployed on AWS EC2 with Docker containers and configured NGINX reverse proxy for SSL termination",
      jd_evidence: "Containerize and deploy services to cloud infrastructure on AWS",
      explanation: "Explicit match evidenced by EC2, S3, RDS, Lambda in skills and project deployment.",
    },
    {
      skill: "Distributed Systems & Event-Driven Architecture",
      category: "practice",
      importance: "required",
      status: "partial_match",
      resume_evidence: "Built an asynchronous distributed background job processor in TypeScript and Redis BullMQ capable of handling 500,000 tasks daily",
      jd_evidence: "Solid background in concurrency, distributed systems principles, and event-driven architecture",
      explanation: "Candidate evidences distributed task queues and Pub/Sub pipelines, but does not evidence large-scale multi-region distributed clusters or enterprise event brokers like Kafka.",
    },
    {
      skill: "Kubernetes",
      category: "technical",
      importance: "preferred",
      status: "not_mentioned",
      resume_evidence: "Not mentioned in resume",
      jd_evidence: "Containerize and deploy services to Kubernetes clusters on AWS",
      explanation: "Not mentioned — while Docker containerization and AWS deployments exist, Kubernetes cluster management is not explicitly evidenced.",
    },
    {
      skill: "Apache Kafka",
      category: "technical",
      importance: "preferred",
      status: "not_mentioned",
      resume_evidence: "Not mentioned in resume",
      jd_evidence: "Implement distributed caching, real-time message brokering, and pub/sub pipelines using Redis and Apache Kafka",
      explanation: "Not mentioned — candidate has demonstrated message brokering and event pipelines with Redis Pub/Sub, but Kafka is not visible in the resume.",
    },
    {
      skill: "Go / Java",
      category: "technical",
      importance: "bonus",
      status: "missing",
      resume_evidence: "No evidence found in resume",
      jd_evidence: "Experience with Go or Java for low-latency background microservices",
      explanation: "Missing — no evidence found in resume. Listed as nice-to-have in JD.",
    },
  ],

  // Convenience mapped lists
  matchedSkills: [
    {
      skill: "Node.js",
      category: "technical",
      importance: "required",
      resume_evidence: "Architected and deployed microservices handling 12,000 requests/sec using Node.js, Express, and Redis caching",
      jd_evidence: "4+ years of professional backend development experience building scalable services in Node.js and TypeScript",
      evidence: "Architected and deployed microservices handling 12,000 requests/sec using Node.js, Express, and Redis caching",
      strength: "strong",
      explanation: "Direct verbatim match found across multiple production roles and showcase projects.",
    },
    {
      skill: "TypeScript",
      category: "technical",
      importance: "required",
      resume_evidence: "Engineered a real-time multiplayer bidding platform supporting 10,000 concurrent bidders using Node.js, TypeScript, and Socket.IO",
      jd_evidence: "Design, build, and maintain mission-critical backend services in Node.js and TypeScript",
      evidence: "Engineered a real-time multiplayer bidding platform supporting 10,000 concurrent bidders using Node.js, TypeScript, and Socket.IO",
      strength: "strong",
      explanation: "Explicit match evidenced in professional summary, technical skills list, and projects.",
    },
    {
      skill: "PostgreSQL",
      category: "technical",
      importance: "required",
      resume_evidence: "Optimized core PostgreSQL database schemas and indexing strategies, eliminating slow full-table scans and boosting query execution speeds by 65%",
      jd_evidence: "Deep expertise in relational databases, particularly PostgreSQL, including query optimization, ACID transactions, and locking mechanisms",
      evidence: "Optimized core PostgreSQL database schemas and indexing strategies, eliminating slow full-table scans and boosting query execution speeds by 65%",
      strength: "strong",
      explanation: "Direct match with explicit performance metrics and concurrency locking.",
    },
    {
      skill: "Redis",
      category: "technical",
      importance: "required",
      resume_evidence: "Integrated Redis for in-memory session caching, live auction leaderboards, and broadcast channel distribution",
      jd_evidence: "Proven hands-on experience with Redis for caching, state management, and pub/sub messaging",
      evidence: "Integrated Redis for in-memory session caching, live auction leaderboards, and broadcast channel distribution",
      strength: "strong",
      explanation: "Direct match for caching, Pub/Sub, and distributed task queues.",
    },
    {
      skill: "WebSockets",
      category: "technical",
      importance: "required",
      resume_evidence: "Implemented real-time telemetry streaming pipeline using WebSockets and Redis Pub/Sub to monitor 400+ remote IoT client nodes simultaneously",
      jd_evidence: "Build real-time bidirectional streaming microservices using WebSockets",
      evidence: "Implemented real-time telemetry streaming pipeline using WebSockets and Redis Pub/Sub to monitor 400+ remote IoT client nodes simultaneously",
      strength: "strong",
      explanation: "Direct match with bidirectional telemetry stream implementation.",
    },
    {
      skill: "REST APIs",
      category: "technical",
      importance: "required",
      resume_evidence: "Designed RESTful API endpoints and integrated Stripe payment processing, supporting $1.8M in quarterly transaction volume",
      jd_evidence: "Design, build, and maintain mission-critical backend services and APIs",
      evidence: "Designed RESTful API endpoints and integrated Stripe payment processing, supporting $1.8M in quarterly transaction volume",
      strength: "strong",
      explanation: "Explicitly evidenced by 'Designed RESTful API endpoints' in professional experience.",
    },
    {
      skill: "Docker",
      category: "technical",
      importance: "preferred",
      resume_evidence: "Containerized development and staging environments with Docker and automated build/test pipelines via GitHub Actions",
      jd_evidence: "Experience orchestrating microservices in production with Kubernetes and Docker on AWS",
      evidence: "Containerized development and staging environments with Docker and automated build/test pipelines via GitHub Actions",
      strength: "strong",
      explanation: "Explicit match for Docker containerization.",
    },
    {
      skill: "AWS Cloud",
      category: "technical",
      importance: "preferred",
      resume_evidence: "Deployed on AWS EC2 with Docker containers and configured NGINX reverse proxy for SSL termination",
      jd_evidence: "Containerize and deploy services to cloud infrastructure on AWS",
      evidence: "Deployed on AWS EC2 with Docker containers and configured NGINX reverse proxy for SSL termination",
      strength: "moderate",
      explanation: "Explicit match evidenced by EC2, S3, RDS, Lambda in skills and project deployment.",
    },
  ],

  partialMatches: [
    {
      skill: "Distributed Systems & Event-Driven Architecture",
      category: "practice",
      importance: "required",
      resume_evidence: "Built an asynchronous distributed background job processor in TypeScript and Redis BullMQ capable of handling 500,000 tasks daily",
      jd_evidence: "Solid background in concurrency, distributed systems principles, and event-driven architecture",
      resumeEvidence: "Built an asynchronous distributed background job processor in TypeScript and Redis BullMQ capable of handling 500,000 tasks daily",
      explanation: "Candidate evidences distributed task queues and Pub/Sub pipelines, but does not evidence large-scale multi-region distributed clusters or enterprise event brokers like Kafka.",
    },
  ],

  notMentioned: [
    {
      skill: "Kubernetes",
      category: "technical",
      importance: "preferred",
      resume_evidence: "Not mentioned in resume",
      jd_evidence: "Containerize and deploy services to Kubernetes clusters on AWS",
      explanation: "Not mentioned — while Docker containerization and AWS deployments exist, Kubernetes cluster management is not explicitly evidenced.",
    },
    {
      skill: "Apache Kafka",
      category: "technical",
      importance: "preferred",
      resume_evidence: "Not mentioned in resume",
      jd_evidence: "Implement distributed caching, real-time message brokering, and pub/sub pipelines using Redis and Apache Kafka",
      explanation: "Not mentioned — candidate has demonstrated message brokering and event pipelines with Redis Pub/Sub, but Kafka is not visible in the resume.",
    },
  ],

  missingSkills: [
    {
      skill: "Go / Java",
      category: "technical",
      importance: "bonus",
      resume_evidence: "No evidence found in resume",
      jd_evidence: "Experience with Go or Java for low-latency background microservices",
      explanation: "Missing — no evidence found in resume. Listed as nice-to-have in JD.",
    },
  ],

  strongestAreas: [
    "Core backend technology overlap (Node.js, TypeScript, PostgreSQL, Redis, WebSockets)",
    "Demonstrated concurrency control and high-throughput real-time architectures",
    "Verified 4 years of professional experience matching the required seniority",
  ],
  biggestGaps: [
    "Kubernetes container orchestration (required/preferred in JD, not demonstrated in resume)",
    "Enterprise event streaming tools (Kafka / RabbitMQ not mentioned)",
    "Go or Java low-latency background (listed as JD preferred nice-to-have)",
  ],
  topRecommendations: [
    "Highlight concurrency, row-level locking, and transactional integrity in your primary work experience bullets.",
    "Prominently position TypeScript, PostgreSQL, and Redis at the start of your Technical Skills section.",
    "Do NOT add Kubernetes or Kafka to your skills unless you have genuine hands-on experience; instead emphasize strong Docker containerization and Redis pub/sub.",
  ],

  matchedKeywords: [
    "Node.js",
    "TypeScript",
    "PostgreSQL",
    "Redis",
    "WebSockets",
    "Docker",
    "AWS",
    "Microservices",
    "Concurrency Control",
    "REST APIs",
    "CI/CD",
  ],
  missingKeywords: [
    "Kubernetes",
    "Apache Kafka",
    "Order Matching",
    "Sub-millisecond",
    "Partitioning",
    "gRPC",
  ],
  keywordsToEmphasize: [
    {
      keyword: "Row-Level Locking & Concurrency Control",
      context: "Prominently mentioned in the JD regarding transactional integrity and high-throughput order processing.",
      recommendation: "Elevate your existing PostgreSQL row-level locking implementation from your projects into your top summary or CloudScale experience bullets.",
    },
    {
      keyword: "Sub-millisecond / Low-Latency Optimization",
      context: "JD stresses processing events with sub-millisecond latencies.",
      recommendation: "Mention the specific 42ms P95 latency reduction prominently and explain caching strategies used to achieve it.",
    },
    {
      keyword: "Event-Driven Microservices",
      context: "JD specifies event-driven architectures and message pipelines.",
      recommendation: "Explicitly frame your Redis Pub/Sub and BullMQ architecture as 'event-driven microservices'.",
    },
  ],
  experienceAnalysis: {
    score: 92,
    matchingResponsibilities: [
      "Architected backend microservices in Node.js/TypeScript handling 12,000 req/sec",
      "PostgreSQL schema optimization and query performance tuning (65% improvement)",
      "Real-time data streaming over WebSockets and Redis Pub/Sub",
      "Automated CI/CD workflows and containerized deployments",
    ],
    strengths: [
      "Quantifiable performance metrics (12k req/sec, 65% query speedup, 42ms P95 latency)",
      "Clear trajectory from Full-Stack to specialized Backend/Distributed Systems",
      "Direct stack parity with Node.js, TypeScript, PostgreSQL, and Redis",
    ],
    weaknesses: [
      "No direct mention of financial transactions, order books, or fintech compliance",
      "Cloud infrastructure is focused on single EC2 instances rather than Kubernetes auto-scaling clusters",
    ],
    recommendations: [
      "Incorporate financial/bidding domain parallels from your Auction project into your professional summary.",
      "Add detail regarding high-concurrency safety and ACID compliance during peak traffic periods.",
    ],
  },
  projectAnalysis: {
    score: 94,
    strengths: [
      "The Real-Time Auction & Bidding Engine is an outstanding direct parallel to high-throughput financial order matching.",
      "Distributed Task Queue shows advanced understanding of asynchronous processing, retries, and distributed locks.",
    ],
    weaknesses: [
      "Project descriptions could emphasize architecture tradeoffs and benchmark figures more prominently.",
    ],
    recommendations: [
      "Feature the Auction & Bidding Engine as your primary showcase project; highlight row-level locking and WebSocket concurrency.",
      "Mention exact throughput or volume benchmarks handled during local load testing.",
    ],
    relevantProjects: [
      {
        name: "Real-Time Auction & Bidding Engine",
        relevance: "High",
        matchingTechnologies: ["Node.js", "TypeScript", "PostgreSQL", "Redis", "Socket.IO", "Docker", "AWS"],
        why: "Directly models the high-concurrency, real-time bidding, and row-level locking requirements demanded by Apex's financial transaction system.",
        recommendation: "Emphasize how concurrency conflicts and race conditions were mitigated when multiple bids arrived in the same millisecond window.",
      },
      {
        name: "Distributed Task Queue & Scheduler",
        relevance: "Medium",
        matchingTechnologies: ["TypeScript", "Redis BullMQ", "Distributed Systems", "Worker Nodes"],
        why: "Demonstrates asynchronous job distribution, atomic locking, and reliable task execution without data loss.",
        recommendation: "Highlight the dead-letter queue and idempotency patterns implemented for fault tolerance.",
      },
    ],
  },
  skillsSectionAnalysis: {
    score: 88,
    alreadyAligned: [
      "Node.js, TypeScript, PostgreSQL, Redis, WebSockets, Docker, AWS",
    ],
    shouldReorder: [
      "Move TypeScript and Node.js to the very beginning of the Languages & Backend categories.",
      "Ensure PostgreSQL and Redis appear first under Databases & Caching before MySQL or MongoDB.",
    ],
    irrelevantForJD: [
      "React, HTML5/CSS3, and MongoDB are tangential to this Senior Backend role (keep them brief or secondary).",
    ],
    shouldBeMoreVisible: [
      "Add 'Row-Level Locking' and 'ACID Transactions' under Concepts/Databases since they are demonstrated in your projects.",
    ],
    recommendations: [
      "Group skills into clear tiers: 'Core Backend' (Node.js, TypeScript, PostgreSQL, Redis), 'Architecture & Protocols' (WebSockets, Event-Driven, Concurrency), and 'Cloud & Tooling' (Docker, AWS, CI/CD).",
      "Do NOT remove legitimate skills like Python or React just to fit the JD, but ensure backend technologies occupy the top visual hierarchy.",
    ],
  },
  educationAnalysis: {
    score: 98,
    matchStatus: "Eligible",
    recommendations: [
      "Candidate holds a BS in Computer Science from UC Davis, satisfying the Bachelor's degree requirement in full.",
    ],
  },
  atsFormattingAnalysis: {
    score: 96,
    strengths: [
      "Clean single-column layout parseable by all major ATS engines (Workday, Greenhouse, Lever).",
      "Standard section headers: Summary, Technical Skills, Professional Experience, Projects, Education.",
      "Consistent reverse-chronological dating format.",
    ],
    issues: [
      "Ensure contact info does not reside in header/footer containers which some legacy ATS engines overlook.",
    ],
  },
  bulletImprovements: [
    {
      section: "Real-Time Auction & Bidding Engine",
      currentBullet: "Designed transactional state management in PostgreSQL utilizing row-level locking to prevent race conditions during sub-second concurrent bids.",
      suggestedBullet: "Architected high-concurrency order matching state machine in PostgreSQL using row-level locking and ACID transactions, successfully eliminating race conditions across 10,000 simultaneous bids.",
      reason: "Better aligns with the JD's requirement for transaction processing, order matching, and concurrency guarantees, using only facts present in the resume.",
      priority: "high",
    },
    {
      section: "CloudScale Tech Experience",
      currentBullet: "Architected and deployed microservices handling 12,000 requests/sec using Node.js, Express, and Redis caching, cutting P95 latency from 180ms to 42ms.",
      suggestedBullet: "Engineered high-throughput event-driven microservices in Node.js and TypeScript handling 12,000 req/sec; leveraged Redis caching to reduce P95 latency by 76% (180ms to 42ms).",
      reason: "Reinforces TypeScript usage and highlights percentage improvement alongside absolute metrics.",
      priority: "medium",
    },
    {
      section: "CloudScale Tech Experience",
      currentBullet: "Implemented real-time telemetry streaming pipeline using WebSockets and Redis Pub/Sub to monitor 400+ remote IoT client nodes simultaneously.",
      suggestedBullet: "Constructed resilient bidirectional streaming pipeline utilizing WebSockets and Redis Pub/Sub, facilitating continuous sub-second telemetry across 400+ active distributed clients.",
      reason: "Emphasizes bidirectional streaming and sub-second latency, directly mirroring phrasing in the JD.",
      priority: "high",
    },
  ],
  resumeImprovements: [
    {
      section: "Professional Summary",
      priority: "high",
      issue: "Summary does not emphasize high-throughput financial/transactional or concurrency focus.",
      recommendation: "Infuse keywords like 'high-concurrency transaction processing', 'row-level locking', and 'event-driven architecture' directly into the 3-line summary.",
      reason: "Recruiters and hiring managers spend 6-8 seconds scanning the top third of the page; immediate keyword alignment drastically increases interview conversion.",
    },
    {
      section: "Technical Skills",
      priority: "medium",
      issue: "Relational database expertise is grouped alongside generic NoSQL databases.",
      recommendation: "Separate into 'Relational Databases & Concurrency: PostgreSQL (Row-level Locking, Index Tuning, Partitioning)' and 'Caching & In-Memory: Redis (Pub/Sub, BullMQ)'.",
      reason: "Demonstrates specialized database depth rather than a superficial tools checklist.",
    },
    {
      section: "Projects",
      priority: "low",
      issue: "Link URLs are plain text rather than active hyperlinks.",
      recommendation: "Ensure GitHub repository links are clickable and clean.",
      reason: "Enables engineering managers reviewing the PDF to instantly inspect your code quality and schema design.",
    },
  ],
  doNotAdd: [
    {
      skill: "Kubernetes (Production Cluster Orchestration)",
      reason: "No evidence found in the resume. While you have Docker and AWS experience, Kubernetes cluster administration in production is a specialized discipline. Do not add Kubernetes unless you have genuine hands-on operational experience.",
    },
    {
      skill: "Apache Kafka",
      reason: "No evidence found in the resume. You have demonstrated Redis Pub/Sub and BullMQ, which solve related messaging needs, but claiming Kafka experience without genuine familiarity will quickly falter during technical system design interviews.",
    },
    {
      skill: "Go / Java",
      reason: "No evidence found in the resume. The role lists these as optional nice-to-have languages. Your strong TypeScript/Node.js mastery is already sufficient for the core role.",
    },
  ],
  actionPlan: [
    "Refine the Professional Summary to emphasize high-concurrency transaction processing and real-time streaming architectures.",
    "Promote the 'Real-Time Auction & Bidding Engine' project to the top of your Projects section; adopt the suggested row-level locking bullet point.",
    "Reorganize the Skills block: place Node.js, TypeScript, PostgreSQL, and Redis in the primary visual position.",
    "In your CloudScale experience bullets, emphasize the 76% latency reduction and bidirectional WebSocket streaming.",
    "Do NOT add Kubernetes or Kafka to your resume unless you genuinely have hands-on experience with them.",
    "Review your PDF export to confirm all section headings are recognized as standard text by ATS parsers.",
  ],
  applicationReadiness: {
    level: "Strong Match",
    reason: "Candidate meets all mandatory eligibility criteria and provides explicit evidence for the core backend technology stack.",
  },
};
