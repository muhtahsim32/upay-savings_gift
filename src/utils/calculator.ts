import { PlanType } from '../types';

/**
 * Format currency with BDT ৳ symbol and comma grouping
 */
export function formatCurrency(amount: number): string {
  const rounded = Math.round(amount);
  return `৳${rounded.toLocaleString('en-IN')}`;
}

/**
 * Format compact numbers (e.g. ৳1.2L or ৳45K)
 */
export function formatCompactCurrency(amount: number): string {
  if (amount >= 10000000) {
    return `৳${(amount / 10000000).toFixed(2)} Cr`;
  }
  if (amount >= 100000) {
    return `৳${(amount / 100000).toFixed(2)} Lakh`;
  }
  if (amount >= 1000) {
    return `৳${(amount / 1000).toFixed(1)}K`;
  }
  return `৳${Math.round(amount)}`;
}

/**
 * Calculate maturity and interest for different plan types
 */
export interface CalculationResult {
  totalPrincipal: number;
  totalProfit: number;
  maturityAmount: number;
  effectiveYieldPercent: number;
  monthlyBreakdown?: Array<{
    month: number;
    invested: number;
    profit: number;
    balance: number;
  }>;
}

export function calculatePlanReturns(
  planType: PlanType,
  installmentOrLumpSum: number,
  tenureMonths: number,
  annualInterestRate: number // e.g. 8.5 for 8.5%
): CalculationResult {
  const r = annualInterestRate / 100;
  const monthlyRate = r / 12;

  if (planType === 'monthly' || planType === 'goal') {
    // Recurring monthly deposits
    let totalInvested = 0;
    let balance = 0;
    const breakdown = [];

    for (let month = 1; month <= tenureMonths; month++) {
      totalInvested += installmentOrLumpSum;
      balance = (balance + installmentOrLumpSum) * (1 + monthlyRate);
      if (month <= 12 || month % 6 === 0 || month === tenureMonths) {
        breakdown.push({
          month,
          invested: totalInvested,
          profit: Math.round(balance - totalInvested),
          balance: Math.round(balance)
        });
      }
    }

    const totalProfit = Math.max(0, balance - totalInvested);

    return {
      totalPrincipal: totalInvested,
      totalProfit: Math.round(totalProfit),
      maturityAmount: Math.round(balance),
      effectiveYieldPercent: Number(((totalProfit / totalInvested) * 100).toFixed(2)),
      monthlyBreakdown: breakdown
    };
  } else if (planType === 'yearly') {
    // Yearly plan: e.g. deposit per year
    const years = Math.max(1, Math.round(tenureMonths / 12));
    let totalInvested = installmentOrLumpSum * years;
    // Compounded annually
    let balance = 0;
    for (let y = 1; y <= years; y++) {
      balance = (balance + installmentOrLumpSum) * (1 + r);
    }
    const totalProfit = Math.max(0, balance - totalInvested);

    return {
      totalPrincipal: totalInvested,
      totalProfit: Math.round(totalProfit),
      maturityAmount: Math.round(balance),
      effectiveYieldPercent: Number(((totalProfit / totalInvested) * 100).toFixed(2))
    };
  } else {
    // Fixed-term (FDR / Term Deposit): One-time lump sum
    const totalInvested = installmentOrLumpSum;
    // Quarterly compounding for term deposit
    const quarters = tenureMonths / 3;
    const quarterlyRate = r / 4;
    const maturityAmount = totalInvested * Math.pow(1 + quarterlyRate, quarters);
    const totalProfit = maturityAmount - totalInvested;

    return {
      totalPrincipal: totalInvested,
      totalProfit: Math.round(totalProfit),
      maturityAmount: Math.round(maturityAmount),
      effectiveYieldPercent: Number(((totalProfit / totalInvested) * 100).toFixed(2))
    };
  }
}
