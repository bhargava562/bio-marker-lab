import { describe, it, expect } from 'vitest';
import {
  calculateSensitivity,
  calculateSpecificity,
  calculatePrecision,
  calculateNpv,
  calculateF1Score,
  calculateAccuracy,
  calculateAllMetrics,
} from './metricsCalculator';

describe('Clinical Metric Calculations', () => {
  it('correctly calculates metrics for a standard confusion matrix', () => {
    // Standard illustrative cohort: TP=142, FP=28, FN=18, TN=312 (Total = 500)
    const cm = { tp: 142, fp: 28, fn: 18, tn: 312 };
    const metrics = calculateAllMetrics(cm);

    // Sensitivity = 142 / (142 + 18) = 142 / 160 = 0.8875
    expect(metrics.sensitivity).toBeCloseTo(0.8875, 4);

    // Specificity = 312 / (312 + 28) = 312 / 340 = 0.9176
    expect(metrics.specificity).toBeCloseTo(0.9176, 4);

    // Precision = 142 / (142 + 28) = 142 / 170 = 0.8353
    expect(metrics.precision).toBeCloseTo(0.8353, 4);

    // NPV = 312 / (312 + 18) = 312 / 330 = 0.9455
    expect(metrics.npv).toBeCloseTo(0.9455, 4);

    // F1 = 2 * (0.8353 * 0.8875) / (0.8353 + 0.8875) = 0.8606
    expect(metrics.f1Score).toBeCloseTo(0.8606, 3);

    // Accuracy = (142 + 312) / 500 = 454 / 500 = 0.908
    expect(metrics.accuracy).toBeCloseTo(0.908, 3);
  });

  it('safely handles zero denominators without throwing or returning NaN', () => {
    // When TP and FN are 0
    expect(calculateSensitivity(0, 0)).toBeNull();

    // When TN and FP are 0
    expect(calculateSpecificity(0, 0)).toBeNull();

    // When TP and FP are 0
    expect(calculatePrecision(0, 0)).toBeNull();

    // When TN and FN are 0
    expect(calculateNpv(0, 0)).toBeNull();

    // F1 with null inputs
    expect(calculateF1Score(null, 0.8)).toBeNull();
    expect(calculateF1Score(0, 0)).toBeNull();

    // Accuracy with zero total
    expect(calculateAccuracy(0, 0, 0, 0)).toBeNull();
  });
});
