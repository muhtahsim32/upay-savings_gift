import { formatCurrency } from '../utils/calculator';

export interface SimulatorInputs {
  goalName: string;
  currentSavings: number;
  targetAmount: number;
  targetMonths: number;
  currentPlanMonthly: number;
  saveMoreMonthly: number;
  saveLessMonthly: number;
}

export interface ScenarioResult {
  id: 'current' | 'more' | 'less';
  label: 'Current Plan' | 'Save More' | 'Save Less';
  monthlySaving: number;
  totalContribution: number;
  projectedSavings: number;
  goalGap: number;
  surplus: number;
  estimatedMonths: number | null;
  estimatedMonthsDisplay: string;
  isAchievable: boolean;
  progressPercent: number; // clamped 0-100 for progress bar
  exactProgressPercent: number; // e.g. 110% or 70%
  statusBadge: {
    label: string;
    variant: 'success' | 'warning' | 'danger';
  };
}

export interface WhatIfComparison {
  inputs: SimulatorInputs;
  scenarios: {
    current: ScenarioResult;
    more: ScenarioResult;
    less: ScenarioResult;
  };
  requiredMonthlyToMeetTarget: number;
  isCurrentAchieved: boolean;
}

export interface WhatIfAiInsight {
  recommendedScenario: 'Current Plan' | 'Save More' | 'Save Less';
  reason: string;
  insight: string;
  action: string;
}

/**
 * Deterministically calculates all three scenarios in pure TypeScript.
 * Protects against NaN, Infinity, negative values, and zero monthly deposits.
 */
export function calculateScenario(
  id: 'current' | 'more' | 'less',
  label: 'Current Plan' | 'Save More' | 'Save Less',
  monthlySavingRaw: number,
  currentSavingsRaw: number,
  targetAmountRaw: number,
  targetMonthsRaw: number
): ScenarioResult {
  const currentSavings = Math.max(0, Number(currentSavingsRaw) || 0);
  const targetAmount = Math.max(0, Number(targetAmountRaw) || 0);
  const targetMonths = Math.max(1, Math.round(Number(targetMonthsRaw) || 1));
  const monthlySaving = Math.max(0, Math.round(Number(monthlySavingRaw) || 0));

  // Core formula: projectedSavings = currentSavings + (monthlySaving * targetMonths)
  const totalContribution = monthlySaving * targetMonths;
  const projectedSavings = currentSavings + totalContribution;

  // goalGap = Math.max(targetAmount - projectedSavings, 0)
  const goalGap = Math.max(0, targetAmount - projectedSavings);
  const surplus = Math.max(0, projectedSavings - targetAmount);
  const isAchievable = projectedSavings >= targetAmount;

  // Estimated Months = Math.ceil(Math.max(targetAmount - currentSavings, 0) / monthlySaving)
  let estimatedMonths: number | null = null;
  let estimatedMonthsDisplay = 'N/A';

  if (currentSavings >= targetAmount) {
    estimatedMonths = 0;
    estimatedMonthsDisplay = 'Already Met!';
  } else if (monthlySaving <= 0) {
    estimatedMonths = null;
    estimatedMonthsDisplay = 'Indefinite';
  } else {
    const remainingNeed = Math.max(0, targetAmount - currentSavings);
    const months = Math.ceil(remainingNeed / monthlySaving);
    if (isFinite(months) && months > 0) {
      estimatedMonths = months;
      if (months <= targetMonths) {
        estimatedMonthsDisplay = `${months} mos (${targetMonths - months}m early)`;
      } else {
        estimatedMonthsDisplay = `${months} mos (${months - targetMonths}m late)`;
      }
    } else {
      estimatedMonthsDisplay = 'Indefinite';
    }
  }

  // Progress percentage
  const exactProgressPercent = targetAmount > 0
    ? Math.round((projectedSavings / targetAmount) * 100)
    : 0;
  const progressPercent = Math.min(100, Math.max(0, exactProgressPercent));

  // Status Badge
  let statusBadge: ScenarioResult['statusBadge'];
  if (isAchievable) {
    if (surplus > 0) {
      statusBadge = {
        label: `Target Met (+${formatCurrency(surplus)} buffer)`,
        variant: 'success'
      };
    } else {
      statusBadge = {
        label: 'Exactly on Target',
        variant: 'success'
      };
    }
  } else {
    if (goalGap > targetAmount * 0.4) {
      statusBadge = {
        label: `${formatCurrency(goalGap)} Shortfall (High)`,
        variant: 'danger'
      };
    } else {
      statusBadge = {
        label: `${formatCurrency(goalGap)} Shortfall`,
        variant: 'warning'
      };
    }
  }

  return {
    id,
    label,
    monthlySaving,
    totalContribution,
    projectedSavings,
    goalGap,
    surplus,
    estimatedMonths,
    estimatedMonthsDisplay,
    isAchievable,
    progressPercent,
    exactProgressPercent,
    statusBadge
  };
}

/**
 * Calculates full What-If Comparison containing all three scenarios
 */
export function calculateWhatIfComparison(inputs: SimulatorInputs): WhatIfComparison {
  const currentSavings = Math.max(0, Number(inputs.currentSavings) || 0);
  const targetAmount = Math.max(0, Number(inputs.targetAmount) || 0);
  const targetMonths = Math.max(1, Math.round(Number(inputs.targetMonths) || 1));

  const current = calculateScenario(
    'current',
    'Current Plan',
    inputs.currentPlanMonthly,
    currentSavings,
    targetAmount,
    targetMonths
  );

  const more = calculateScenario(
    'more',
    'Save More',
    inputs.saveMoreMonthly,
    currentSavings,
    targetAmount,
    targetMonths
  );

  const less = calculateScenario(
    'less',
    'Save Less',
    inputs.saveLessMonthly,
    currentSavings,
    targetAmount,
    targetMonths
  );

  const remainingPrincipal = Math.max(0, targetAmount - currentSavings);
  const requiredMonthlyToMeetTarget = targetMonths > 0
    ? Math.ceil(remainingPrincipal / targetMonths)
    : remainingPrincipal;

  return {
    inputs,
    scenarios: { current, more, less },
    requiredMonthlyToMeetTarget,
    isCurrentAchieved: current.isAchievable
  };
}

/**
 * Calls the backend Gemini AI scenario insight endpoint.
 * Note: Gemini only receives calculated numbers and context; math is already completed.
 */
export async function fetchWhatIfAiInsight(comparison: WhatIfComparison): Promise<WhatIfAiInsight> {
  const response = await fetch('/api/ai-what-if-insight', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      goalName: comparison.inputs.goalName,
      targetAmount: comparison.inputs.targetAmount,
      targetMonths: comparison.inputs.targetMonths,
      currentSavings: comparison.inputs.currentSavings,
      requiredMonthly: comparison.requiredMonthlyToMeetTarget,
      scenarios: [
        {
          label: comparison.scenarios.current.label,
          monthlySaving: comparison.scenarios.current.monthlySaving,
          projected: comparison.scenarios.current.projectedSavings,
          gap: comparison.scenarios.current.goalGap,
          surplus: comparison.scenarios.current.surplus,
          achievable: comparison.scenarios.current.isAchievable,
          estimatedMonths: comparison.scenarios.current.estimatedMonthsDisplay
        },
        {
          label: comparison.scenarios.more.label,
          monthlySaving: comparison.scenarios.more.monthlySaving,
          projected: comparison.scenarios.more.projectedSavings,
          gap: comparison.scenarios.more.goalGap,
          surplus: comparison.scenarios.more.surplus,
          achievable: comparison.scenarios.more.isAchievable,
          estimatedMonths: comparison.scenarios.more.estimatedMonthsDisplay
        },
        {
          label: comparison.scenarios.less.label,
          monthlySaving: comparison.scenarios.less.monthlySaving,
          projected: comparison.scenarios.less.projectedSavings,
          gap: comparison.scenarios.less.goalGap,
          surplus: comparison.scenarios.less.surplus,
          achievable: comparison.scenarios.less.isAchievable,
          estimatedMonths: comparison.scenarios.less.estimatedMonthsDisplay
        }
      ]
    })
  });

  if (!response.ok) {
    let errorMsg = 'Failed to generate scenario insight';
    try {
      const err = await response.json();
      if (err?.error) errorMsg = err.error;
    } catch {
      // fallback
    }
    throw new Error(errorMsg);
  }

  const data = await response.json();
  return validateAiInsight(data);
}

function validateAiInsight(data: any): WhatIfAiInsight {
  if (!data || typeof data !== 'object') {
    throw new Error('AI scenario insight was not a valid object.');
  }

  const validScenarios: Array<WhatIfAiInsight['recommendedScenario']> = [
    'Current Plan',
    'Save More',
    'Save Less'
  ];

  let recommendedScenario: WhatIfAiInsight['recommendedScenario'] = 'Current Plan';
  if (typeof data.recommendedScenario === 'string') {
    const match = validScenarios.find(
      s => s.toLowerCase() === data.recommendedScenario.toLowerCase().trim()
    );
    if (match) recommendedScenario = match;
  }

  const reason = typeof data.reason === 'string' && data.reason.trim().length > 0
    ? data.reason.trim()
    : 'Balances milestone feasibility with sustainable daily cashflow buffer.';

  const insight = typeof data.insight === 'string' && data.insight.trim().length > 0
    ? data.insight.trim()
    : 'Modest adjustments in monthly contributions create substantial compound buffers over multi-month tenures.';

  const action = typeof data.action === 'string' && data.action.trim().length > 0
    ? data.action.trim()
    : 'Lock in this contribution amount via monthly auto-debit on salary arrival.';

  return {
    recommendedScenario,
    reason,
    insight,
    action
  };
}
