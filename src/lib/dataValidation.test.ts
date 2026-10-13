import { describe, it, expect } from 'vitest';
import { BIOMARKERS } from '../data/biomarkers';
import { SYNTHETIC_PATIENT_RECORDS, DATA_DOMAINS_TABLE } from '../data/dataQuality';
import { CANDIDATE_MODELS } from '../data/models';
import { RESEARCH_STAGES, WORK_PLAN_PHASES } from '../data/stages';
import { METRIC_DEFINITIONS_TABLE } from '../data/metrics';

describe('Research Protocol Data Integrity', () => {
  it('loads all 14 biomarkers from Table 0 with valid 3D coordinates and categories', () => {
    expect(BIOMARKERS).toHaveLength(14);
    BIOMARKERS.forEach((b) => {
      expect(b.id).toBeDefined();
      expect(b.name).toBeDefined();
      expect(b.typicalRole).toBeDefined();
      expect(b.position3D).toHaveLength(3);
    });
  });

  it('includes synthetic records with expected anomalies in data quality audit', () => {
    expect(SYNTHETIC_PATIENT_RECORDS.length).toBeGreaterThanOrEqual(8);
    const unitMismatch = SYNTHETIC_PATIENT_RECORDS.find((r) =>
      r.flaggedIssues.some((i) => i.issueType === 'implausible_unit')
    );
    expect(unitMismatch).toBeDefined();
    expect(unitMismatch?.patientStudyId).toBe('SYNTH-BLJ-1042');

    const duplicateRecord = SYNTHETIC_PATIENT_RECORDS.find((r) => r.isDuplicate);
    expect(duplicateRecord).toBeDefined();
  });

  it('contains the 6 clinical data domains from Table 1 of BRAINS submission', () => {
    expect(DATA_DOMAINS_TABLE).toHaveLength(6);
    const domains = DATA_DOMAINS_TABLE.map((d) => d.domain);
    expect(domains).toContain('Demographic');
    expect(domains).toContain('Laboratory');
    expect(domains).toContain('Outcome');
  });

  it('contains candidate models from Table 2 with verified metrics and considerations', () => {
    expect(CANDIDATE_MODELS.length).toBeGreaterThanOrEqual(7);
    CANDIDATE_MODELS.forEach((m) => {
      expect(m.name).toBeDefined();
      expect(m.purpose).toBeDefined();
      expect(m.keyConsiderations).toBeDefined();
      expect(m.illustrativeAuroc).toBeGreaterThan(0.5);
    });
  });

  it('contains all 10 Research Stages and 9 Work Plan Phases from Table 3 & 5', () => {
    expect(RESEARCH_STAGES).toHaveLength(10);
    expect(WORK_PLAN_PHASES).toHaveLength(9);
  });

  it('contains all 9 clinical performance metric definitions from Table 4', () => {
    expect(METRIC_DEFINITIONS_TABLE).toHaveLength(9);
  });
});
