import type { ConfusionMatrixData } from '../types';

export const METRIC_DEFINITIONS_TABLE = [
  {
    name: 'Sensitivity / Recall',
    formula: 'TP / (TP + FN)',
    interpretation: 'Ability to identify true positive cases (patients with the diabetic outcome)',
    clinicalImportance: 'Critical in clinical screening scenarios to avoid missing high-risk individuals (minimizing False Negatives).',
  },
  {
    name: 'Specificity',
    formula: 'TN / (TN + FP)',
    interpretation: 'Ability to correctly identify negative cases (normoglycaemic or low-risk individuals)',
    clinicalImportance: 'Critical in confirmatory testing to prevent patient anxiety, unnecessary treatments, and costly follow-ups.',
  },
  {
    name: 'Precision / PPV',
    formula: 'TP / (TP + FP)',
    interpretation: 'Proportion of model-predicted positives that are genuinely positive',
    clinicalImportance: 'Tells the clinician how reliable a positive alert is when an automated biomarker warning flags.',
  },
  {
    name: 'NPV (Negative Predictive Value)',
    formula: 'TN / (TN + FN)',
    interpretation: 'Proportion of model-predicted negatives that are genuinely negative',
    clinicalImportance: 'Reassures clinician and patient that a negative result carries low likelihood of hidden disease.',
  },
  {
    name: 'F1-Score',
    formula: '2 × (Precision × Recall) / (Precision + Recall)',
    interpretation: 'Harmonic mean balancing precision and recall into a single metric',
    clinicalImportance: 'Essential when classes are imbalanced, where simple accuracy gives a false sense of success.',
  },
  {
    name: 'AUROC',
    formula: 'Area Under Receiver Operating Characteristic Curve',
    interpretation: 'Probability that a randomly chosen positive case ranks higher than a randomly chosen negative case',
    clinicalImportance: 'Threshold-independent measure of overall discriminatory separation across all possible operating cutoffs.',
  },
  {
    name: 'AUPRC',
    formula: 'Area Under Precision-Recall Curve',
    interpretation: 'Integrated precision across varying sensitivity thresholds',
    clinicalImportance: 'Provides realistic discrimination assessment in low-prevalence complication cohorts.',
  },
  {
    name: 'Calibration (Reliability)',
    formula: 'Agreement between predicted probabilities and empirical event rates',
    interpretation: 'If model predicts 70% risk for 100 patients, approximately 70 should experience the outcome',
    clinicalImportance: 'Vital for clinical decision-making; a model can have high AUROC but poor probability calibration.',
  },
  {
    name: 'Brier Score',
    formula: '(1/N) × Σ (Predicted Probability - Actual Outcome)²',
    interpretation: 'Mean squared probabilistic error (ranges from 0 = perfect to 0.25 = uninformative coin toss)',
    clinicalImportance: 'Penalizes both overconfident wrong guesses and underconfident correct predictions.',
  },
];

export const DEFAULT_CONFUSION_MATRIX: ConfusionMatrixData = {
  tp: 142,
  fp: 28,
  fn: 18,
  tn: 312,
};

export const CLINICAL_CHALLENGE_SCENARIOS = [
  {
    id: 'scen-1',
    title: 'Challenge: High Accuracy on Imbalanced Data',
    scenarioDescription: 'A candidate model achieves 95.0% accuracy on a cohort where diabetic retinopathy prevalence is only 5.0%. The model predicted every single patient as "Negative" (0 positives).',
    question: 'Can this model be trusted for clinical screening?',
    options: [
      {
        text: 'Yes — 95% accuracy exceeds conventional medical threshold benchmarks.',
        isCorrect: false,
        feedback: 'Incorrect. High accuracy is completely deceptive here. The model caught 0 out of 5 true diabetic cases (Sensitivity = 0%), making it clinically useless and dangerous for screening.',
      },
      {
        text: 'No — Sensitivity is 0%; it fails to identify a single affected patient despite high headline accuracy.',
        isCorrect: true,
        feedback: 'Correct! When outcomes are imbalanced (5% prevalence), predicting the majority class yields 95% accuracy with 0% sensitivity. Sensitivity, AUPRC, and F1-score are essential.',
      },
      {
        text: 'Yes — Provided it has been checked for demographic fairness.',
        isCorrect: false,
        feedback: 'Incorrect. Even with demographic fairness, a model that classifies zero patients as positive fails the clinical task completely.',
      },
    ],
  },
  {
    id: 'scen-2',
    title: 'Challenge: Internal vs External Validation Drift',
    scenarioDescription: 'A gradient boosting model achieved AUROC 0.93 during 10-fold cross-validation on hospital cohort A. When tested without retraining on regional community clinic cohort B, AUROC dropped to 0.69.',
    question: 'What is the most probable cause of this performance drop?',
    options: [
      {
        text: 'The model suffered from population dataset shift and potential feature leakage specific to Hospital A.',
        isCorrect: true,
        feedback: 'Correct! Internal CV only measures generalizability within the same population. Hospital A may have had specific laboratory assay protocols, older patients, or severe inpatient referrals that community clinics do not share.',
      },
      {
        text: 'The learning rate in Gradient Boosting was set too low.',
        isCorrect: false,
        feedback: 'Incorrect. Hyperparameters would affect internal CV as well; a sharp drop only upon external testing points to cohort shift and generalizability failure.',
      },
      {
        text: 'External validation cohorts should always be merged with training data before testing.',
        isCorrect: false,
        feedback: 'Incorrect! Merging external data into training invalidates its purpose as an independent test, causing severe evaluation bias.',
      },
    ],
  },
];

export const GLOBAL_FEATURE_IMPORTANCES = [
  { name: 'HbA1c', importance: 0.34, category: 'glycaemic', meanValue: '6.4%', description: 'Primary driver of long-term metabolic variance' },
  { name: 'FPG (Fasting Glucose)', importance: 0.22, category: 'glycaemic', meanValue: '124 mg/dL', description: 'Core acute fasting homeostasis variable' },
  { name: 'HOMA-IR', importance: 0.15, category: 'insulin', meanValue: '3.4', description: 'Derived marker of peripheral insulin resistance' },
  { name: 'Triglycerides', importance: 0.09, category: 'lipid', meanValue: '172 mg/dL', description: 'Cardiometabolic and hepatic lipid clearance' },
  { name: 'BMI / Waist', importance: 0.07, category: 'anthropometric', meanValue: '28.1 kg/m²', description: 'Adiposity and metabolic load covariate' },
  { name: 'Age & Duration', importance: 0.06, category: 'demographic', meanValue: '54.2 yrs', description: 'Cumulative biological exposure timeline' },
  { name: 'eGFR / UACR', importance: 0.04, category: 'renal', meanValue: '82 mL/min', description: 'Renal microvascular integrity indicators' },
  { name: 'hs-CRP', importance: 0.03, category: 'inflammatory', meanValue: '2.4 mg/L', description: 'Low-grade systemic inflammatory activity' },
];

export const LOCAL_PATIENT_EXPLANATION = {
  patientId: 'SYNTH-BLJ-1041',
  baseRateRisk: 0.22, // Population average risk
  predictedProbability: 0.74, // Model estimated risk
  contributions: [
    { feature: 'HbA1c (7.2%)', impact: +0.26, direction: 'increases_risk', reasoning: 'Exceeds clinical threshold (≥6.5%), strong positive pushing effect.' },
    { feature: 'FPG (142 mg/dL)', impact: +0.14, direction: 'increases_risk', reasoning: 'Fasting hyperglycaemia confirms acute dysglycaemia.' },
    { feature: 'HOMA-IR (6.49)', impact: +0.11, direction: 'increases_risk', reasoning: 'Severe insulin resistance indicates high metabolic strain.' },
    { feature: 'Triglycerides (210 mg/dL)', impact: +0.05, direction: 'increases_risk', reasoning: 'Elevated dyslipidaemia consistent with metabolic syndrome.' },
    { feature: 'Age (54 yrs)', impact: +0.03, direction: 'increases_risk', reasoning: 'Mid-life demographic covariate.' },
    { feature: 'eGFR (78 mL/min)', impact: -0.04, direction: 'decreases_risk', reasoning: 'Preserved glomerular filtration moderates renal complication risk score.' },
    { feature: 'HDL (38 mg/dL)', impact: +0.02, direction: 'increases_risk', reasoning: 'Suboptimal protective lipoprotein concentration.' },
    { feature: 'hs-CRP (3.1 mg/L)', impact: -0.05, direction: 'decreases_risk', reasoning: 'Absence of severe acute systemic infection protects baseline prediction.' },
  ],
};
