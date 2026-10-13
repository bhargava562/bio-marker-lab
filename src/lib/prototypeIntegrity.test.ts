import { describe, it, expect } from 'vitest';
import { 
  calculateAllMetrics 
} from './metricsCalculator';
import { BIOMARKERS } from '../data/biomarkers';
import { SYNTHETIC_PATIENT_RECORDS, DATA_DOMAINS_TABLE } from '../data/dataQuality';
import { CANDIDATE_MODELS } from '../data/models';
import { RESEARCH_STAGES, WORK_PLAN_PHASES } from '../data/stages';

describe('Scratchpad Prototype Comprehensive Verification', () => {
  it('verifies confusion matrix formulas under high accuracy and extreme imbalance', () => {
    // 95% accuracy with 0% sensitivity test (5% prevalence, all predicted negative)
    const imbalancedCm = { tp: 0, fp: 0, fn: 50, tn: 950 };
    const imbalancedMetrics = calculateAllMetrics(imbalancedCm);
    
    expect(imbalancedMetrics.accuracy).toBeCloseTo(0.95, 2);
    expect(imbalancedMetrics.sensitivity).toBe(0.0); // 0 / 50 = 0
    expect(imbalancedMetrics.precision).toBeNull(); // 0 / 0 = null (safely handled!)
    expect(imbalancedMetrics.f1Score).toBeNull(); // safely handled
    expect(imbalancedMetrics.specificity).toBe(1.0); // 950 / 950 = 1.0
  });

  it('verifies 3-layer architecture data definitions and 14 biomarker variables', () => {
    expect(BIOMARKERS).toHaveLength(14);
    const categories = new Set(BIOMARKERS.map(b => b.category));
    expect(categories.has('glycaemic')).toBe(true);
    expect(categories.has('insulin')).toBe(true);
    expect(categories.has('lipid')).toBe(true);
    expect(categories.has('renal')).toBe(true);
    expect(categories.has('anthropometric')).toBe(true);
  });

  it('verifies 8 synthetic patient records with data quality flags', () => {
    expect(SYNTHETIC_PATIENT_RECORDS).toHaveLength(8);
    const unitMismatches = SYNTHETIC_PATIENT_RECORDS.filter(r => r.flaggedIssues.some(i => i.issueType === 'implausible_unit'));
    expect(unitMismatches.length).toBeGreaterThanOrEqual(1);
    expect(unitMismatches[0].patientStudyId).toBe('SYNTH-BLJ-1042');
  });

  it('verifies Table 1, 2, 3, 4, 5 data integrity from BRAINS report', () => {
    expect(DATA_DOMAINS_TABLE).toHaveLength(6);
    expect(CANDIDATE_MODELS).toHaveLength(7);
    expect(RESEARCH_STAGES).toHaveLength(10);
    expect(WORK_PLAN_PHASES).toHaveLength(9);
  });
});
