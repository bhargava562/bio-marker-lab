import type { CandidateModel } from '../types';

export const CANDIDATE_MODELS: CandidateModel[] = [
  {
    id: 'logistic_regression',
    name: 'Logistic Regression (Baseline)',
    family: 'Generalized Linear Models',
    purpose: 'Interpretable baseline classifier',
    keyConsiderations: 'Assumes log-odds linearity, sensitive to multicollinearity (e.g. FPG vs PPG vs HbA1c), requires calibration check.',
    mechanicsDescription: 'Fits a linear combination of biomarker weights transformed through a sigmoid link function. Provides direct odds ratios (OR) for each unit change in biomarker.',
    strengths: [
      'Gold standard for clinical transparency and regulatory interpretability',
      'Provides direct probabilistic odds ratios for biomarker risk estimates',
      'Computationally instantaneous and mathematically deterministic',
      'Clear baseline against which nonlinear model gains must be justified'
    ],
    limitations: [
      'Cannot automatically discover complex nonlinear biomarker interactions without explicit interaction terms',
      'Severely impacted by collinear clinical markers (e.g., FPG, HbA1c, and HOMA-IR in same model)',
      'Underfits when true pathophysiological decision boundary is highly curved'
    ],
    interpretabilityScore: 'Very High',
    dataRequirement: 'Low to moderate sample size; sensitive to missing data and unscaled outliers',
    illustrativeAuroc: 0.812,
    illustrativeSensitivity: 0.795,
    illustrativeSpecificity: 0.824,
    architecturalType: 'linear',
  },
  {
    id: 'regularized_logistic',
    name: 'Regularized Logistic Regression (Lasso / ElasticNet)',
    family: 'Penalized Linear Models',
    purpose: 'Feature selection and robust baseline',
    keyConsiderations: 'L1 (Lasso) penalty drives redundant biomarker coefficients to zero; L2 (Ridge) handles high multicollinearity among lipid and glucose subfractions.',
    mechanicsDescription: 'Adds an L1/L2 penalty to the loss function to shrink coefficients and eliminate uninformative biomarkers during training.',
    strengths: [
      'Automates biomarker sparsity by penalizing redundant features',
      'Prevents severe overfitting on cohorts with high feature-to-sample ratios',
      'Retains clean odds-ratio clinical interpretability for remaining non-zero features'
    ],
    limitations: [
      'Requires hyperparameter tuning of penalty weight (lambda / alpha) via inner cross-validation',
      'Still constrained by linear boundary assumptions in log-odds space',
      'Sensitive to relative scaling of biomarker measurement units'
    ],
    interpretabilityScore: 'Very High',
    dataRequirement: 'Moderate sample size; standardized numerical features mandatory',
    illustrativeAuroc: 0.838,
    illustrativeSensitivity: 0.820,
    illustrativeSpecificity: 0.845,
    architecturalType: 'linear',
  },
  {
    id: 'decision_tree',
    name: 'Decision Tree (CART)',
    family: 'Rule-Based Learning',
    purpose: 'Interpretable nonlinear baseline',
    keyConsiderations: 'Requires explicit pruning, minimum leaf size constraints, and depth limits to prevent deep-leaf overfitting.',
    mechanicsDescription: 'Recursively partitions the biomarker feature space into orthogonal rectangular regions using threshold rules (e.g., "If HbA1c > 6.5% AND Triglycerides > 180").',
    strengths: [
      'Produces human-readable visual flowchart that mirrors clinical decision protocols',
      'Naturally handles mixed continuous and categorical variables without one-hot dilemmas',
      'Robust to monotonic transformations and unscaled outlier values'
    ],
    limitations: [
      'High variance: minor variations in sample data can drastically alter tree structure',
      'Axis-aligned splits struggle to approximate smooth diagonal biological interactions',
      'Prone to severe overfitting without aggressive post-pruning'
    ],
    interpretabilityScore: 'High',
    dataRequirement: 'Small to moderate sample size; prone to instability in small cohorts',
    illustrativeAuroc: 0.785,
    illustrativeSensitivity: 0.760,
    illustrativeSpecificity: 0.801,
    architecturalType: 'tree',
  },
  {
    id: 'random_forest',
    name: 'Random Forest Ensemble',
    family: 'Bagged Tree Ensembles',
    purpose: 'Nonlinear ensemble model',
    keyConsiderations: 'Evaluates feature importance via Mean Decrease in Impurity / Permutation; hyperparameter tuning for number of trees and max features per split.',
    mechanicsDescription: 'Constructs a forest of hundreds of decorrelated decision trees, each trained on bootstrap subsets of data with random feature subsampling, aggregating by majority vote.',
    strengths: [
      'Substantially mitigates single-tree variance and overfitting',
      'Captures intricate nonlinear biomarker interactions and synergistic effects',
      'Provides internal Out-Of-Bag (OOB) error estimates and robust Gini importance metrics'
    ],
    limitations: [
      'Ensemble averaging obscures simple transparent decision logic into an opaque model',
      'Can be biased towards continuous biomarkers with many distinct split values',
      'Prediction probabilities may lack sharp calibration near extreme probability tails'
    ],
    interpretabilityScore: 'Moderate',
    dataRequirement: 'Moderate to large sample size; resistant to noise and outliers',
    illustrativeAuroc: 0.874,
    illustrativeSensitivity: 0.852,
    illustrativeSpecificity: 0.890,
    architecturalType: 'ensemble',
  },
  {
    id: 'gradient_boosting',
    name: 'Gradient Boosting (XGBoost / LightGBM)',
    family: 'Sequential Boosted Trees',
    purpose: 'High-performance tabular model',
    keyConsiderations: 'Careful hyperparameter optimization (learning rate, tree depth, subsample ratio), early stopping, explicit calibration curve verification.',
    mechanicsDescription: 'Sequentially trains shallow decision trees where each subsequent tree fits the negative gradient (residual errors) of the ensemble combined with shrinkage.',
    strengths: [
      'Empirically state-of-the-art performance on clinical tabular laboratory data',
      'Native handling of missing values without requiring artificial imputation',
      'Seamlessly pairs with TreeSHAP for exact, efficient game-theoretic feature attributions'
    ],
    limitations: [
      'Risk of overfitting if hyperparameters (depth, shrinkage, subsample) are not tuned via nested CV',
      'Output probabilities frequently require post-hoc Platt scaling or Isotonic calibration',
      'Requires strict containment to prevent temporal target leakage during training'
    ],
    interpretabilityScore: 'Moderate',
    dataRequirement: 'Moderate to large multi-centre cohort for robust convergence',
    illustrativeAuroc: 0.896,
    illustrativeSensitivity: 0.885,
    illustrativeSpecificity: 0.912,
    architecturalType: 'gradient_boost',
  },
  {
    id: 'svm',
    name: 'Support Vector Machine (RBF Kernel)',
    family: 'Kernel Margin Classifiers',
    purpose: 'Alternative nonlinear classifier',
    keyConsiderations: 'Strict feature scaling mandatory; kernel choice (Radial Basis Function vs Linear); optimization of cost C and gamma parameters.',
    mechanicsDescription: 'Maps biomarker vectors into high-dimensional Hilbert space via kernel trick to identify the maximum-margin hyperplane separating clinical outcome classes.',
    strengths: [
      'Highly effective in high-dimensional spaces where sample sizes are modest',
      'Maximizes geometric separation margin, providing theoretical generalization bounds',
      'Robust to points distant from the decision boundary (governed strictly by support vectors)'
    ],
    limitations: [
      'Black-box geometry makes direct clinical interpretation difficult without surrogate models',
      'Computation scales quadratically with sample size O(N²), limiting very large cohorts',
      'Does not natively yield true posterior probabilities (requires Platt sigmoid calibration)'
    ],
    interpretabilityScore: 'Low',
    dataRequirement: 'Small to moderate sample size; requires strict zero-mean unit-variance scaling',
    illustrativeAuroc: 0.851,
    illustrativeSensitivity: 0.835,
    illustrativeSpecificity: 0.865,
    architecturalType: 'hyperplane',
  },
  {
    id: 'neural_network',
    name: 'Multilayer Perceptron (Tabular Neural Net)',
    family: 'Deep Learning / Representation',
    purpose: 'Optional nonlinear model for larger datasets',
    keyConsiderations: 'Sample size justification, dropout / weight decay regularization to avoid overfitting, interpretability trade-offs.',
    mechanicsDescription: 'Passes biomarker inputs through multiple hidden layers with nonlinear activations (ReLU/GELU) to learn hierarchical representations.',
    strengths: [
      'Capable of learning arbitrary nonlinear representations and composite multi-analyte embeddings',
      'Can be extended to multi-task learning (e.g. predicting diabetes and nephropathy simultaneously)',
      'Integrates with continuous multimodal inputs if imaging or ECG features are added later'
    ],
    limitations: [
      'Prone to severe overfitting on typical clinical laboratory sample sizes (<5,000 cases)',
      'Requires substantial tuning of learning rates, layer depth, batch norm, and dropout',
      'Explainability requires perturbation techniques or Integrated Gradients'
    ],
    interpretabilityScore: 'Low',
    dataRequirement: 'Large multi-thousand patient cohort required to outperform boosted trees',
    illustrativeAuroc: 0.862,
    illustrativeSensitivity: 0.840,
    illustrativeSpecificity: 0.878,
    architecturalType: 'neural',
  },
];
