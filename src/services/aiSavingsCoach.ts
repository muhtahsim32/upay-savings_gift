export interface SavingsCoachInput {
  monthlyIncome: number;
  monthlyEssentialExpenses: number;
  currentSavings: number;
  monthlySaving: number;
  goalName: string;
  targetAmount: number;
  targetMonths: number;
}

export interface DeterministicMetrics {
  availableMonthlyAmount: number;
  estimatedMonths: number | null;
  estimatedMonthsDisplay: string;
  projectedSavings: number;
  goalGap: number;
  goalProgress: number;
  isTargetAchieved: boolean;
  isSavingOverAvailable: boolean;
  isDeficitBudget: boolean;
  isValidInput: boolean;
  validationError?: string;
}

export interface SavingsCoachAnalysis {
  status: 'achievable' | 'challenging' | 'unrealistic';
  summary: string;
  recommendedMonthlySaving: number;
  strategy: string;
  actionPlan: string[];
  tips: string[];
  warning?: string;
}

/**
 * Perform local deterministic financial calculations in TypeScript.
 * Protects against NaN, Infinity, negative values, and edge cases.
 */
export function calculateDeterministicMetrics(input: SavingsCoachInput): DeterministicMetrics {
  const {
    monthlyIncome,
    monthlyEssentialExpenses,
    currentSavings,
    monthlySaving,
    targetAmount,
    targetMonths
  } = input;

  // Validation checks
  if (monthlyIncome <= 0 || isNaN(monthlyIncome)) {
    return createEmptyMetrics('Monthly income must be greater than zero.');
  }
  if (monthlyEssentialExpenses < 0 || isNaN(monthlyEssentialExpenses)) {
    return createEmptyMetrics('Monthly expenses cannot be negative.');
  }
  if (currentSavings < 0 || isNaN(currentSavings)) {
    return createEmptyMetrics('Current savings cannot be negative.');
  }
  if (targetAmount <= 0 || isNaN(targetAmount)) {
    return createEmptyMetrics('Target goal amount must be greater than zero.');
  }
  if (targetMonths <= 0 || isNaN(targetMonths)) {
    return createEmptyMetrics('Target duration must be at least 1 month.');
  }

  const availableMonthlyAmount = Math.max(-1000000, monthlyIncome - monthlyEssentialExpenses);
  const isDeficitBudget = availableMonthlyAmount <= 0;
  const isSavingOverAvailable = !isDeficitBudget && monthlySaving > availableMonthlyAmount;
  const isTargetAchieved = currentSavings >= targetAmount;

  // Goal Progress (Clamped between 0 and 100%)
  const rawProgress = targetAmount > 0 ? (currentSavings / targetAmount) * 100 : 0;
  const goalProgress = Math.min(100, Math.max(0, Math.round(rawProgress * 10) / 10));

  // Projected savings at target duration
  const projectedSavings = Math.max(0, currentSavings + Math.max(0, monthlySaving) * targetMonths);

  // Remaining Goal Gap
  const goalGap = Math.max(0, targetAmount - projectedSavings);

  // Estimated Months to reach target
  let estimatedMonths: number | null = null;
  let estimatedMonthsDisplay = 'N/A';

  if (isTargetAchieved) {
    estimatedMonths = 0;
    estimatedMonthsDisplay = 'Achieved!';
  } else if (monthlySaving <= 0) {
    estimatedMonths = null;
    estimatedMonthsDisplay = 'No monthly savings planned';
  } else {
    const remainingNeed = targetAmount - currentSavings;
    const rawMonths = remainingNeed / monthlySaving;
    if (isFinite(rawMonths) && rawMonths > 0) {
      estimatedMonths = Math.ceil(rawMonths);
      if (estimatedMonths >= 12) {
        const years = (estimatedMonths / 12).toFixed(1);
        estimatedMonthsDisplay = `${estimatedMonths} mos (~${years} yrs)`;
      } else {
        estimatedMonthsDisplay = `${estimatedMonths} months`;
      }
    } else {
      estimatedMonthsDisplay = 'Indefinite';
    }
  }

  return {
    availableMonthlyAmount,
    estimatedMonths,
    estimatedMonthsDisplay,
    projectedSavings,
    goalGap,
    goalProgress,
    isTargetAchieved,
    isSavingOverAvailable,
    isDeficitBudget,
    isValidInput: true
  };
}

function createEmptyMetrics(validationError: string): DeterministicMetrics {
  return {
    availableMonthlyAmount: 0,
    estimatedMonths: null,
    estimatedMonthsDisplay: 'Invalid Input',
    projectedSavings: 0,
    goalGap: 0,
    goalProgress: 0,
    isTargetAchieved: false,
    isSavingOverAvailable: false,
    isDeficitBudget: false,
    isValidInput: false,
    validationError
  };
}

/**
 * Call the Gemini-powered AI Savings Coach service.
 * Sends structured input and deterministic calculations to the server endpoint.
 */
export async function analyzeSavingsPlan(
  input: SavingsCoachInput,
  deterministic: DeterministicMetrics
): Promise<SavingsCoachAnalysis> {
  const response = await fetch('/api/ai-savings-coach', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      ...input,
      deterministicMetrics: deterministic
    })
  });

  if (!response.ok) {
    let errorMsg = 'Failed to analyze savings plan';
    try {
      const errData = await response.json();
      if (errData?.error) {
        errorMsg = errData.error;
      }
    } catch {
      // fallback
    }
    throw new Error(errorMsg);
  }

  const data = await response.json();

  // Validate the AI response format
  return validateAiResponse(data);
}

/**
 * Validate that the returned object satisfies the SavingsCoachAnalysis schema.
 */
function validateAiResponse(data: any): SavingsCoachAnalysis {
  if (!data || typeof data !== 'object') {
    throw new Error('AI response was not a valid JSON object.');
  }

  // Validate status
  const validStatuses: Array<SavingsCoachAnalysis['status']> = ['achievable', 'challenging', 'unrealistic'];
  let status: SavingsCoachAnalysis['status'] = 'challenging';
  if (typeof data.status === 'string' && validStatuses.includes(data.status.toLowerCase() as any)) {
    status = data.status.toLowerCase() as SavingsCoachAnalysis['status'];
  }

  // Validate summary
  const summary = typeof data.summary === 'string' && data.summary.trim().length > 0
    ? data.summary.trim()
    : 'Evaluation of your financial goal based on current income and timeline parameters.';

  // Validate recommendedMonthlySaving
  const recommendedMonthlySaving = typeof data.recommendedMonthlySaving === 'number' && !isNaN(data.recommendedMonthlySaving)
    ? Math.max(0, Math.round(data.recommendedMonthlySaving))
    : 0;

  // Validate strategy
  const strategy = typeof data.strategy === 'string' && data.strategy.trim().length > 0
    ? data.strategy.trim()
    : 'Adopt disciplined automated monthly micro-deductions from your wallet to maintain momentum.';

  // Validate actionPlan array
  const actionPlan = Array.isArray(data.actionPlan) && data.actionPlan.length > 0
    ? data.actionPlan.map((item: any) => String(item).trim()).filter((item: string) => item.length > 0)
    : [
        'Automate your monthly deposit directly on income disbursement date.',
        'Review discretionary recurring expenses to free up surplus cash.',
        'Track milestone progress every quarter to adjust deposit amounts.'
      ];

  // Validate tips array
  const tips = Array.isArray(data.tips) && data.tips.length > 0
    ? data.tips.map((item: any) => String(item).trim()).filter((item: string) => item.length > 0)
    : [
        'Utilize separate digital wallet pots to keep savings segregated from daily spending.',
        'Avoid making impulse purchases during salary week by utilizing a 48-hour pause rule.',
        'Reinvest temporary windfalls or festival bonuses into your target fund.'
      ];

  // Optional warning
  const warning = typeof data.warning === 'string' && data.warning.trim().length > 0
    ? data.warning.trim()
    : undefined;

  return {
    status,
    summary,
    recommendedMonthlySaving,
    strategy,
    actionPlan,
    tips,
    warning
  };
}
