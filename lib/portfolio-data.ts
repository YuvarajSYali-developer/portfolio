/**
 * Single source of truth for every piece of portfolio content.
 * All facts and links below come from the supplied resume (Nov 2026) and brief.
 * Components read from here — never hardcode content in a section.
 */

import { RESUME_PATH } from "./constants";

/* ───────────────────────── Personal ───────────────────────── */

export const personal = {
  name: "Yuvaraj S Yali",
  displayName: "YUVARAJ S YALI",
  headline: ["Engineering Intelligence.", "Building What Matters."],
  subheadline:
    "Exploring the intersection of Machine Learning, Intelligent Systems, Applied Research and Software Engineering.",
  roles: ["AI/ML Engineer", "Researcher", "Software Developer"],
  metaLine: "Manipal Institute of Technology | Electronics & Communication Engineering",
  email: "yuvarajyali@gmail.com",
  resumePath: RESUME_PATH,
  photo: "/images/profile/yuvaraj-s-yali.webp",
  currentStatus: "Business Intern at Porter HCV",
  shortBio:
    "AI/ML engineer and applied researcher combining electronics, computational intelligence, machine learning research and full-stack development.",
};

/* ───────────────────────── Highlights (quick-scan strip) ───────────────────────── */

export const highlights: { label: string; title: string; detail: string; href: string }[] = [
  { label: "Publication", title: "Paper accepted", detail: "IDEA 2026 · Springer LNNS", href: "#research" },
  { label: "Research", title: "Research Intern", detail: "IIT Dharwad · ML & DL models", href: "#experience" },
  { label: "Industry", title: "Business Intern", detail: "Porter · Heavy Commercial Vehicles", href: "#experience" },
  { label: "Civic tech", title: "Recommended for pilot", detail: "CivilInc · Shivamogga Smart City", href: "#civilinc" },
];

/* ───────────────────────── Social ───────────────────────── */

export type SocialKey = "linkedin" | "github" | "huggingface" | "email";

export const socials: { key: SocialKey; label: string; href: string; handle: string }[] = [
  {
    key: "linkedin",
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/yuvaraj-yali-017b67323",
    handle: "in/yuvaraj-yali",
  },
  {
    key: "github",
    label: "GitHub",
    href: "https://github.com/YuvarajSYali-developer",
    handle: "YuvarajSYali-developer",
  },
  {
    key: "huggingface",
    label: "Hugging Face",
    href: "https://huggingface.co/YuvarajDeveloper",
    handle: "YuvarajDeveloper",
  },
  {
    key: "email",
    label: "Email",
    href: "mailto:yuvarajyali@gmail.com",
    handle: "yuvarajyali@gmail.com",
  },
];

/* ───────────────────────── About ───────────────────────── */

export const about = {
  heading: "Beyond the Code.",
  intro: [
    "I'm Yuvaraj S Yali, an Electronics and Communication Engineering undergraduate at Manipal Institute of Technology.",
    "My interests lie in building intelligent systems that bridge machine learning, software engineering and real-world problem solving.",
    "From developing predictive machine learning models and explainable AI pipelines to building full-stack civic technology platforms and intelligent IoT systems, I enjoy taking ideas from research and turning them into practical applications.",
  ],
  bento: [
    { key: "engineering", label: "Engineering", title: "Electronics & Communication", lines: ["Manipal Institute of Technology"] },
    { key: "intelligence", label: "Intelligence", title: "Machine Learning & Deep Learning", lines: ["Predictive modelling", "Explainable AI"] },
    { key: "research", label: "Research", title: "EEG-Based Cognitive Analysis", lines: ["Explainable AI", "Experimental evaluation"] },
    { key: "development", label: "Development", title: "Full-Stack Engineering", lines: ["FastAPI / React / Python"] },
    { key: "current", label: "Now", title: "Business Intern – Porter HCV", lines: ["Bengaluru, Karnataka"] },
    { key: "interests", label: "Interests", title: "AI Research & Intelligent Systems", lines: ["Chess", "Data-driven problem solving"] },
  ],
} as const;

/* ───────────────────────── Experience ───────────────────────── */

export type ExperienceVisual = "logistics" | "eeg" | "policy" | "smartcity";

export type ExperienceItem = {
  id: string;
  organisation: string;
  shortName: string;
  role: string;
  location?: string;
  date: string;
  current?: boolean;
  note?: string;
  description: string[];
  tags: string[];
  visual: ExperienceVisual;
  /** Optional verified logo in /public/images/logos — leave undefined until a real asset exists. */
  logo?: string;
  links?: { label: string; href: string }[];
};

export const experience: ExperienceItem[] = [
  {
    id: "porter",
    organisation: "Porter",
    shortName: "PORTER",
    role: "Business Intern – HCV",
    location: "Bengaluru, Karnataka",
    date: "July 2026 – Present",
    current: true,
    description: [
      "Driving business process improvement initiatives by analyzing operational data and identifying bottlenecks.",
      "Recommending scalable solutions for business and operational efficiency.",
      "Supporting market research, stakeholder coordination, performance tracking and strategic planning.",
      "Leveraging Excel, data analysis and structured problem-solving to generate actionable operational insights.",
    ],
    tags: ["Operations Analytics", "Process Improvement", "Market Research", "Excel", "Strategy"],
    visual: "logistics",
  },
  {
    id: "iit-dharwad",
    organisation: "Indian Institute of Technology Dharwad",
    shortName: "IIT DHARWAD",
    role: "Research Intern – ML & DL Models",
    date: "May 2026 – June 2026",
    description: [
      "Conducted machine learning and deep learning research under faculty supervision.",
      "Worked on EEG-based cognitive analysis.",
      "Explored model optimization and experimental evaluation.",
      "Collaborated with the research group on applied AI research and academic publications.",
    ],
    tags: ["Machine Learning", "Deep Learning", "EEG", "Model Optimization", "Experimental Evaluation"],
    visual: "eeg",
  },
  {
    id: "building-bharat",
    organisation: "Building Bharat",
    shortName: "BUILDING BHARAT",
    role: "Policy Research Intern",
    location: "Remote",
    date: "May 2025 – July 2025",
    note: "Political innovation startup · IIT KGP endorsed",
    description: [
      "Selected to support digital initiatives involving political awareness, citizen engagement and governance reforms.",
      "Contributed to research on AI-driven voter influence models.",
      "Worked on public policy evaluation and data-driven outreach strategies.",
    ],
    tags: ["Policy Research", "AI Modelling", "Data-Driven Outreach", "Governance"],
    visual: "policy",
    links: [
      { label: "Certificate", href: "https://certificate.givemycertificate.com/c/ebdb7715-2269-4fad-84c7-70b3fb8377d3" },
      { label: "BharatVote Space", href: "https://huggingface.co/spaces/YuvarajYali2004/bharatvote" },
    ],
  },
  {
    id: "shivamogga-smart-city",
    organisation: "Shivamogga Smart City Limited",
    shortName: "SHIVAMOGGA SMART CITY",
    role: "Web Development Engineer Intern",
    location: "Shivamogga, Karnataka",
    date: "June 2024 – July 2024",
    note: "Government of India smart-city programme",
    description: [
      "Independently conceptualized, designed and developed CivilInc, a full-stack civic-tech platform.",
      "Implemented an end-to-end grievance redressal system.",
      "Developed cross-departmental coordination functionality.",
      "Built real-time municipal performance dashboards.",
      "The project was officially recognized and recommended for pilot integration into government smart-city systems.",
    ],
    tags: ["Full-Stack", "Civic Tech", "FastAPI", "React", "Dashboards"],
    visual: "smartcity",
    links: [
      { label: "Letter of recommendation", href: "https://drive.google.com/file/d/11FIlg5xBjwsjVPPxFTvyUpoKl7ZBqQMe/view" },
      { label: "CivilInc demo video", href: "https://drive.google.com/file/d/1-2umKmdAozOkQ_fgVM5R_CvBsdhk6MLK/view?usp=sharing" },
    ],
  },
];

/* ───────────────────────── Projects ───────────────────────── */

export type ProjectVisual = "netguard" | "gazeforge" | "avital" | "chess" | "civilinc" | "water";

export type Project = {
  id: string;
  number: string;
  title: string;
  subtitle: string;
  category: string;
  accent: string;
  description: string;
  problem: string;
  approach: string[];
  results: { value: string; label: string }[];
  details: string[];
  tags: string[];
  links: { label: string; href: string; kind: "demo" | "video" | "github" | "doc" }[];
  visual: ProjectVisual;
  /** Drop a real screenshot into /public/images/projects and set this path to replace the abstract visual. */
  image?: string;
  visualNote: string;
};

export const projects: Project[] = [
  {
    id: "netguard-pro",
    number: "01",
    title: "NetGuard Pro",
    subtitle: "Network Anomaly Detection",
    category: "ML Engineering · Security",
    accent: "#32D6E5",
    description:
      "A six-layer weighted ensemble system combining supervised and unsupervised anomaly detection methods to identify different forms of network threats.",
    problem:
      "Network threats take many forms — some resemble known attack patterns, others only appear as statistical deviations in traffic. A single detector tends to miss one kind or the other, and alerts without explanations are hard for analysts to act on.",
    approach: [
      "Weighted ensemble of supervised (XGBoost, Random Forest) and unsupervised (Isolation Forest, IQR, Z-Score, EWMA) detectors.",
      "12 statistical flow-based features, with SMOTE to handle extreme class imbalance.",
      "SHAP TreeExplainer with a 1,000-sample background set for per-alert feature attributions.",
      "Real-time SOC dashboard with live traffic visualization and an attack simulator.",
    ],
    results: [
      { value: "95.21%", label: "F1-Score" },
      { value: "0.9668", label: "ROC-AUC" },
    ],
    details: [
      "Metrics reported on cross-dataset evaluation.",
      "Six detection layers combined through a weighted vote.",
      "Explainability is computed per alert rather than only globally.",
    ],
    tags: ["XGBoost", "Random Forest", "Isolation Forest", "SMOTE", "SHAP", "EWMA"],
    links: [{ label: "Live demo", href: "https://huggingface.co/spaces/YuvarajDeveloper/network_anamoly_detectors", kind: "demo" }],
    visual: "netguard",
    visualNote: "Illustrative SOC interface — not live traffic",
  },
  {
    id: "gazeforge",
    number: "02",
    title: "GazeForge",
    subtitle: "Synthetic Eye Motion on Google's GNM Head",
    category: "3D Graphics · Synthetic Data · XR",
    accent: "#8B7AFF",
    description:
      "Samsung PRISM XR Hackathon 2026 (Track 1) entry: textures and animates Google's GNM v3 head model in Blender, without remeshing it, with photoreal procedural textures and physiologically timed eye, eyelid and brow motion.",
    problem:
      "Gaze-estimation and XR systems need large amounts of labelled eye imagery. GazeForge generates it synthetically: realistic faces whose eyes, lids and head move the way real ones do, with exact per-frame labels.",
    approach: [
      "8 complete UDIM texture sets (4K skin, separate left/right irises, teeth, tongue) across 8 GNM identities and skin tones — seam-free because every texel is evaluated in 3D.",
      "Saccades on the Baloh (1975) main-sequence profile, timed blinks, microsaccades, eye–head coordination (VOR) and Listing's-law fixation.",
      "Eyelid and brow actions isolated from GNM's own expression basis by a masked ridge least-squares fit.",
      "Left / Right / Generate Motion scripts render frames and MP4s with a per-frame motion JSON; a Timeline-animated .blend.",
    ],
    results: [
      { value: "8", label: "Photoreal texture sets across 8 identities" },
      { value: "1.1×10⁻⁷ m", label: "NumPy GNM evaluator vs Google's reference" },
    ],
    details: [
      "Earlier V2 calibrated eye rig: 9/9 acceptance groups (63/63 checks); labels within 0.26 px of detected pupils.",
      "Runs on Blender 4.2+ with only NumPy — no TensorFlow; Colab notebook for full-HD GPU renders.",
      "Textures are procedural — no images of real people.",
    ],
    tags: ["Blender", "Python", "NumPy", "GNM v3", "Computer Vision", "Synthetic Data"],
    links: [
      { label: "GitHub", href: "https://github.com/YuvarajSYali-developer/GazeForge", kind: "github" },
      { label: "Demo video", href: "https://github.com/YuvarajSYali-developer/GazeForge/blob/main/demo/GazeForge_demo.mp4", kind: "video" },
    ],
    visual: "gazeforge",
    image: "/images/projects/gazeforge.webp",
    visualNote: "Renders from the project",
  },
  {
    id: "a-vital-pro",
    number: "03",
    title: "A-VITAL PRO",
    subtitle: "Animal Health Disease Prediction",
    category: "Applied ML · Interactive 3D",
    accent: "#8B7AFF",
    description:
      "A machine learning-based animal disease prediction platform designed for livestock health analysis, with an immersive interactive 3D diagnostic interface.",
    problem:
      "Livestock disease signs overlap heavily, and in borderline cases a single most-likely label can hide a serious alternative. The goal was a predictor that surfaces ranked possibilities in an interface that is fast and intuitive to read.",
    approach: [
      "XGBoost classifier trained on 8,000+ clinical records across 20 livestock diseases.",
      "Custom top-3 probabilistic inference to reduce false negatives in borderline cases.",
      "Three.js + GSAP web interface with a reactive 3D neural core visualizing diagnostic threat levels.",
    ],
    results: [
      { value: "99.7%", label: "Reported model accuracy" },
      { value: "<50ms", label: "Reported interface latency" },
    ],
    details: [
      "20 livestock diseases covered.",
      "Top-3 ranked output rather than a single hard label.",
      "Real-time 3D visual feedback driven by prediction confidence.",
    ],
    tags: ["XGBoost", "Python", "Three.js", "GSAP", "Probabilistic Inference"],
    links: [{ label: "Live demo", href: "https://animal-health-disease-prediction-model.onrender.com/", kind: "demo" }],
    visual: "avital",
    visualNote: "Representative diagnostic visual",
  },
  {
    id: "chess-guru",
    number: "04",
    title: "Chess-Guru",
    subtitle: "AI Chess Error Prediction System",
    category: "ML Research · Interpretability",
    accent: "#628AFF",
    description:
      "An AI-driven chess analysis system that predicts errors and provides interpretable move-by-move analysis.",
    problem:
      "Engines tell players what the best move was, not why they tend to go wrong. Chess-Guru models when and where a human is likely to make a mistake, and explains it in terms a player can act on.",
    approach: [
      "50,000 games (~3.6M moves) processed, with centipawn loss computed via Stockfish.",
      "52 interpretable engineered features feeding a Random Forest baseline.",
      "Board-only CNN on an 8×8×14 tensor input, without engine-derived features.",
      "DeLong significance testing at 95% confidence intervals to compare models.",
    ],
    results: [
      { value: "0.87", label: "Random Forest AUC" },
      { value: "88%", label: "of 25 evaluated players reported actionable insights" },
    ],
    details: [
      "Random Forest RMSE: 45.16.",
      "Board-only CNN AUC: 0.774.",
      "Evaluated players ranged from 1200 to 2200 ELO.",
      "Web-based move-by-move mistake detection and phase-wise reports.",
    ],
    tags: ["Stockfish", "Random Forest", "CNN", "Feature Engineering", "DeLong Test"],
    links: [{ label: "Live demo", href: "https://huggingface.co/spaces/YuvarajDeveloper/chess-personal-coach", kind: "demo" }],
    visual: "chess",
    visualNote: "Illustrative board analysis",
  },
  {
    id: "civilinc",
    number: "05",
    title: "CivilInc",
    subtitle: "Smart Civic Infrastructure Navigator",
    category: "Full-Stack · Civic Tech",
    accent: "#32D6E5",
    description:
      "A full-stack civic-tech platform designed to support smart-city governance and digital service delivery.",
    problem:
      "Municipal grievances move between departments with little visibility for citizens or officials. CivilInc gives them one system for reporting, routing and tracking, with data that can inform governance decisions.",
    approach: [
      "Asynchronous FastAPI backend managing 5+ core entities, with a React frontend.",
      "Redis caching with TTL-indexed keys to reduce ML inference latency.",
      "Secure OAuth2 / JWT / Bcrypt authentication.",
      "Predictive ML pipeline with a custom preprocessing layer for governance insights.",
    ],
    results: [
      { value: "Pilot", label: "Recommended for pilot integration into government smart-city systems" },
      { value: "5+", label: "Core entities in the async backend" },
    ],
    details: [
      "Built during the Shivamogga Smart City Limited internship.",
      "End-to-end grievance redressal with cross-departmental coordination.",
      "Real-time municipal performance dashboards.",
    ],
    tags: ["FastAPI", "React", "SQLAlchemy", "Redis", "OAuth2", "JWT", "Bcrypt"],
    links: [
      { label: "Demo video", href: "https://drive.google.com/file/d/1-2umKmdAozOkQ_fgVM5R_CvBsdhk6MLK/view?usp=sharing", kind: "video" },
      { label: "GitHub", href: "https://github.com/YuvarajSYali-developer/Civilinc---Submitted", kind: "github" },
    ],
    visual: "civilinc",
    visualNote: "Illustrative civic dashboard",
  },
];

/* ───────────────────────── Research ───────────────────────── */

export const research = {
  heading: "Researching Intelligence.",
  paper: {
    title: "NeuroScan-MMSE: EEG-Based Cognitive Score Prediction Using Ensemble Machine Learning and Deep Learning",
    status: "Accepted — IDEA 2026",
    statusShort: "Accepted",
    venue: "IDEA 2026 — Intelligent Data Engineering and AI",
    venueShort: "IDEA 2026",
    venueDetail: "Jio Institute, Navi Mumbai · Dec 3–5, 2026 · Springer LNNS proceedings",
    overview:
      "A framework for predicting MMSE cognitive scores from resting-state EEG data using machine learning and deep learning models, explainability methods and structured experimental evaluation.",
    manuscript: "https://drive.google.com/file/d/10NVwHHnoxDLM9xIUZVDsaUxlZsNNtsMO/view?usp=sharing",
  },
  facts: [
    { label: "Dataset", value: "OpenNeuro ds004504" },
    { label: "Participants", value: "N = 88" },
    { label: "Feature pipeline", value: "480 dimensions" },
    { label: "Models", value: "8 ML / DL models" },
    { label: "Validation", value: "5-fold cross-validation" },
    { label: "Explainability", value: "SHAP · Grad-CAM" },
  ],
  bestModel: {
    name: "Gradient Boosting",
    metrics: [
      { label: "MAE", value: "3.564" },
      { label: "Pearson r", value: "0.636" },
    ],
  },
  pipeline: [
    { step: "EEG Data", detail: "Resting-state EEG recordings from OpenNeuro ds004504 (N = 88)." },
    { step: "Signal Processing", detail: "Preparing raw multichannel signals for analysis." },
    { step: "Feature Engineering", detail: "Deriving descriptive features from the processed signals." },
    { step: "480-Dimensional Feature Pipeline", detail: "Features assembled into a 480-dimensional representation per participant." },
    { step: "Model Training", detail: "Eight machine learning and deep learning models trained on the pipeline." },
    { step: "Model Evaluation", detail: "Five-fold cross-validation; Gradient Boosting performed best (MAE 3.564, r 0.636)." },
    { step: "Explainable AI", detail: "SHAP and Grad-CAM used to interpret what drives predictions." },
    { step: "Cognitive Score Prediction", detail: "Predicted MMSE cognitive score from EEG alone." },
  ],
} as const;

/* ───────────────────────── Skills ───────────────────────── */

export const skillGroups: { group: string; items: string[] }[] = [
  { group: "Programming", items: ["Python", "JavaScript ES6+", "C/C++"] },
  { group: "Frontend", items: ["React", "Next.js", "Tailwind CSS", "shadcn/ui", "REST API Integration", "UI/UX"] },
  { group: "Backend", items: ["FastAPI", "Flask", "Node.js", "Express.js", "SQLAlchemy", "SQLite"] },
  {
    group: "Machine Learning",
    items: ["PyTorch", "TensorFlow", "Scikit-learn", "XGBoost", "PyTorch Geometric", "Transformers", "CNN"],
  },
  { group: "Explainable AI", items: ["SHAP", "Grad-CAM"] },
  { group: "Tools", items: ["Git", "Docker", "Blender", "Hugging Face", "Render", "Railway", "Arduino"] },
];

/** simple-icons slugs used in the 3D cloud (XGBoost, SHAP, Grad-CAM have no official logo — listed in text). */
export const iconCloudSlugs = [
  "python",
  "javascript",
  "cplusplus",
  "react",
  "nextdotjs",
  "tailwindcss",
  "shadcnui",
  "fastapi",
  "flask",
  "nodedotjs",
  "express",
  "sqlalchemy",
  "sqlite",
  "pytorch",
  "tensorflow",
  "scikitlearn",
  "pyg",
  "huggingface",
  "git",
  "docker",
  "render",
  "railway",
  "arduino",
  "blender",
  "numpy",
  "pandas",
] as const;

/* ───────────────────────── Metrics ───────────────────────── */

export const metrics: {
  value: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
  label: string;
  context: string;
  projectId: string;
}[] = [
  { value: 50000, label: "Chess games processed", context: "Chess-Guru", projectId: "chess-guru" },
  { value: 3.6, decimals: 1, suffix: "M", prefix: "~", label: "Chess moves analysed", context: "Chess-Guru", projectId: "chess-guru" },
  { value: 8000, suffix: "+", label: "Clinical records used", context: "A-VITAL PRO", projectId: "a-vital-pro" },
  { value: 20, label: "Livestock diseases covered", context: "A-VITAL PRO", projectId: "a-vital-pro" },
  { value: 95.21, decimals: 2, suffix: "%", label: "F1-Score", context: "NetGuard Pro", projectId: "netguard-pro" },
  { value: 99.7, decimals: 1, suffix: "%", label: "Reported model accuracy", context: "A-VITAL PRO", projectId: "a-vital-pro" },
];

/* ───────────────────────── Education & certifications ───────────────────────── */

export const education = {
  institution: "Manipal Institute of Technology (MAHE)",
  location: "Manipal, Karnataka, India",
  degree: "B.Tech — Electronics and Communication Engineering",
  duration: "2023 – 2027",
  cgpa: "7.41",
};

export const certifications: { title: string; issuer?: string; detail?: string; href?: string }[] = [
  {
    title: "Introduction to Internet of Things",
    issuer: "NPTEL",
    detail: "Jul–Oct 2026 · 12 weeks · Score 90%",
    href: "https://drive.google.com/file/d/1mJ7f3cOdW4DOXFplomonNnXJxynoVlas/view?usp=sharing",
  },
  {
    title: "Advanced R Programming for Data Analytics in Business",
    issuer: "NPTEL",
    detail: "Jul–Oct 2026 · 12 weeks · Score 87%",
    href: "https://drive.google.com/file/d/1UDquV-Dvrio2HziRvSNdTXd4_fFlAGI0/view?usp=sharing",
  },
  {
    title: "FastAPI & Backend Development",
    issuer: "Udemy",
    href: "https://www.udemy.com/certificate/UC-c98480e7-3c3b-4b32-ab91-693ee4b0217b/",
  },
  {
    title: "Google Business Intelligence",
    issuer: "Google",
    href: "https://www.coursera.org/account/accomplishments/professional-cert/LPVEL7H0LJE6",
  },
  {
    title: "Microsoft UX Design",
    issuer: "Microsoft",
    href: "https://www.coursera.org/account/accomplishments/professional-cert/543D2KLM2068",
  },
];

/* ───────────────────────── Contact & footer ───────────────────────── */

export const contact = {
  heading: "Let's Build Something Intelligent.",
  copy: "I'm interested in building intelligent systems, exploring applied research and collaborating on meaningful technology.",
};

export const footer = {
  tagline: "Engineering Intelligence. Building What Matters.",
  copyright: "© 2026 Yuvaraj S Yali. All rights reserved.",
};
