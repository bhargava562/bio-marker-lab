export type BiomarkerCategory = 
  | 'glycaemic'
  | 'insulin'
  | 'lipid'
  | 'renal'
  | 'inflammatory'
  | 'anthropometric'
  | 'demographic'
  | 'treatment';

export interface Biomarker {
  id: string;
  name: string;
  abbreviation: string;
  category: BiomarkerCategory;
  categoryLabel: string;
  typicalUnits: string;
  referenceRange: string;
  potentialRelevance: string;
  typicalRole: string; // from Table 0
  plainDescription: string;
  researchRationale: string;
  clinicalCaution: string;
  analyticalTier: 'established' | 'candidate' | 'covariate';
  position3D: [number, number, number];
}

export interface SyntheticPatientRecord {
  id: string;
  patientStudyId: string;
  age: number | null;
  sex: 'M' | 'F' | 'Unknown';
  bmi: number | null;
  fpg: number | null; // Fasting plasma glucose (mg/dL)
  ppg: number | null; // Postprandial glucose (mg/dL)
  hba1c: number | null; // %
  fastingInsulin: number | null; // μIU/mL
  homaIr: number | null;
  triglycerides: number | null; // mg/dL
  hdl: number | null; // mg/dL
  ldl: number | null; // mg/dL
  creatinine: number | null; // mg/dL
  egfr: number | null; // mL/min/1.73m²
  uacr: number | null; // mg/g
  crp: number | null; // mg/L
  medication: string;
  outcomeLabel: 'Normoglycaemic' | 'Abnormal Glycaemic / High Risk';
  flaggedIssues: {
    field: string;
    issueType: 'missing' | 'implausible_unit' | 'biologically_implausible' | 'inconsistent_coding' | 'duplicate';
    description: string;
    proposedCleanAction: string;
    impactExplanation: string;
  }[];
  isDuplicate?: boolean;
}

export interface CandidateModel {
  id: string;
  name: string;
  family: string;
  purpose: string; // from Table 2
  keyConsiderations: string; // from Table 2
  mechanicsDescription: string;
  strengths: string[];
  limitations: string[];
  interpretabilityScore: 'Very High' | 'High' | 'Moderate' | 'Low';
  dataRequirement: string;
  illustrativeAuroc: number;
  illustrativeSensitivity: number;
  illustrativeSpecificity: number;
  architecturalType: 'linear' | 'tree' | 'ensemble' | 'hyperplane' | 'gradient_boost' | 'neural';
}

export interface ConfusionMatrixData {
  tp: number;
  fp: number;
  fn: number;
  tn: number;
}

export interface CalculatedMetrics {
  sensitivity: number | null;
  specificity: number | null;
  precision: number | null;
  npv: number | null;
  f1Score: number | null;
  accuracy: number | null;
}

export interface ResearchStage {
  stageNumber: number;
  title: string;
  activity: string;
  output: string;
  phaseId: string;
  phaseDuration: string;
  governanceNote: string;
  completed: boolean;
}

export type ExplorationMode = 'discovery' | 'research';
