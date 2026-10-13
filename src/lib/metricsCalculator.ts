import type { ConfusionMatrixData, CalculatedMetrics } from '../types';

/**
 * Pure functions to compute clinical performance metrics from confusion matrix counts.
 * Strictly avoids division by zero, returning null when a denominator is zero.
 */
export function calculateSensitivity(tp: number, fn: number): number | null {
  const denominator = tp + fn;
  if (denominator <= 0) return null;
  return tp / denominator;
}

export function calculateSpecificity(tn: number, fp: number): number | null {
  const denominator = tn + fp;
  if (denominator <= 0) return null;
  return tn / denominator;
}

export function calculatePrecision(tp: number, fp: number): number | null {
  const denominator = tp + fp;
  if (denominator <= 0) return null;
  return tp / denominator;
}

export function calculateNpv(tn: number, fn: number): number | null {
  const denominator = tn + fn;
  if (denominator <= 0) return null;
  return tn / denominator;
}

export function calculateF1Score(precision: number | null, recall: number | null): number | null {
  if (precision === null || recall === null) return null;
  const denominator = precision + recall;
  if (denominator <= 0) return null;
  return (2 * precision * recall) / denominator;
}

export function calculateAccuracy(tp: number, tn: number, fp: number, fn: number): number | null {
  const total = tp + tn + fp + fn;
  if (total <= 0) return null;
  return (tp + tn) / total;
}

export function calculateAllMetrics(cm: ConfusionMatrixData): CalculatedMetrics {
  const sensitivity = calculateSensitivity(cm.tp, cm.fn);
  const specificity = calculateSpecificity(cm.tn, cm.fp);
  const precision = calculatePrecision(cm.tp, cm.fp);
  const npv = calculateNpv(cm.tn, cm.fn);
  const f1Score = calculateF1Score(precision, sensitivity);
  const accuracy = calculateAccuracy(cm.tp, cm.tn, cm.fp, cm.fn);

  return {
    sensitivity,
    specificity,
    precision,
    npv,
    f1Score,
    accuracy,
  };
}

export function formatMetricPercentage(value: number | null): string {
  if (value === null || isNaN(value)) return 'N/A (Undef)';
  return `${(value * 100).toFixed(1)}%`;
}

export function formatMetricDecimal(value: number | null, decimals: number = 3): string {
  if (value === null || isNaN(value)) return 'N/A';
  return value.toFixed(decimals);
}
