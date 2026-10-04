import React, { createContext, useContext, useState, useEffect } from 'react';
import { ActiveUserPlan, SavingsTransaction, PlanType } from '../types';
import { INITIAL_ACTIVE_PLANS, INITIAL_TRANSACTIONS } from '../data/mockData';

interface SavingsContextType {
  activePlans: ActiveUserPlan[];
  transactions: SavingsTransaction[];
  totalSavings: number;
  totalProfitEarned: number;
  activePlansCount: number;
  nextMaturity: {
    date: string;
    amount: number;
    planTitle: string;
    daysRemaining: number;
  } | null;
  createPlan: (params: {
    planTemplateId: string;
    planTitle: string;
    planType: PlanType;
    goalName?: string;
    installmentAmount: number;
    targetAmount?: number;
    interestRate: number;
    frequency: 'Monthly' | 'Yearly' | 'Flexible' | 'One-Time';
    tenureMonths: number;
    autoDebitEnabled: boolean;
  }) => void;
  depositToPlan: (planId: string, amount: number) => boolean;
  toggleAutoDebit: (planId: string) => void;
  resetSavingsDemo: () => void;
}

const SavingsContext = createContext<SavingsContextType | undefined>(undefined);

export const SavingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activePlans, setActivePlans] = useState<ActiveUserPlan[]>(() => {
    try {
      const saved = localStorage.getItem('upay_active_plans');
      return saved ? JSON.parse(saved) : INITIAL_ACTIVE_PLANS;
    } catch {
      return INITIAL_ACTIVE_PLANS;
    }
  });

  const [transactions, setTransactions] = useState<SavingsTransaction[]>(() => {
    try {
      const saved = localStorage.getItem('upay_transactions');
      return saved ? JSON.parse(saved) : INITIAL_TRANSACTIONS;
    } catch {
      return INITIAL_TRANSACTIONS;
    }
  });

  useEffect(() => {
    localStorage.setItem('upay_active_plans', JSON.stringify(activePlans));
  }, [activePlans]);

  useEffect(() => {
    localStorage.setItem('upay_transactions', JSON.stringify(transactions));
  }, [transactions]);

  // Aggregate totals
  const totalSavings = activePlans.reduce((sum, p) => sum + p.currentBalance, 0);
  const totalProfitEarned = activePlans.reduce((sum, p) => sum + p.profitEarned, 0);
  const activePlansCount = activePlans.filter(p => p.status === 'active').length;

  // Next maturity calculation
  const getNextMaturity = () => {
    const active = activePlans.filter(p => p.status === 'active' && p.maturityDate);
    if (active.length === 0) return null;

    const today = new Date('2026-10-02');
    const sorted = [...active].sort(
      (a, b) => new Date(a.maturityDate).getTime() - new Date(b.maturityDate).getTime()
    );

    const earliest = sorted[0];
    const matDate = new Date(earliest.maturityDate);
    const diffTime = matDate.getTime() - today.getTime();
    const daysRemaining = Math.max(0, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));

    return {
      date: earliest.maturityDate,
      amount: earliest.targetAmount || earliest.currentBalance,
      planTitle: earliest.goalName || earliest.planTitle,
      daysRemaining
    };
  };

  const nextMaturity = getNextMaturity();

  const createPlan = (params: {
    planTemplateId: string;
    planTitle: string;
    planType: PlanType;
    goalName?: string;
    installmentAmount: number;
    targetAmount?: number;
    interestRate: number;
    frequency: 'Monthly' | 'Yearly' | 'Flexible' | 'One-Time';
    tenureMonths: number;
    autoDebitEnabled: boolean;
  }) => {
    const now = new Date('2026-10-02');
    const matDate = new Date(now);
    matDate.setMonth(matDate.getMonth() + params.tenureMonths);

    const initialDeposit = params.installmentAmount;
    const initialProfit = 0;
    const newPlan: ActiveUserPlan = {
      id: `plan_${Date.now()}`,
      planTemplateId: params.planTemplateId,
      planTitle: params.planTitle,
      planType: params.planType,
      goalName: params.goalName || params.planTitle,
      installmentAmount: params.installmentAmount,
      targetAmount: params.targetAmount || params.installmentAmount * (params.tenureMonths || 1),
      currentBalance: initialDeposit,
      totalInvested: initialDeposit,
      profitEarned: initialProfit,
      interestRate: params.interestRate,
      frequency: params.frequency,
      startDate: now.toISOString().split('T')[0],
      maturityDate: matDate.toISOString().split('T')[0],
      tenureMonths: params.tenureMonths,
      completedInstallments: 1,
      totalInstallments: params.planType === 'fixed' ? 1 : params.tenureMonths,
      status: 'active',
      autoDebitEnabled: params.autoDebitEnabled,
      nextDebitDate:
        params.planType !== 'fixed'
          ? new Date(now.getFullYear(), now.getMonth() + 1, now.getDate()).toISOString().split('T')[0]
          : undefined
    };

    const newTx: SavingsTransaction = {
      id: `tx_${Date.now()}`,
      planId: newPlan.id,
      planTitle: newPlan.goalName || newPlan.planTitle,
      amount: initialDeposit,
      type: 'deposit',
      date: now.toISOString().split('T')[0],
      status: 'completed',
      referenceNo: `UP-NEW-${Math.floor(100000 + Math.random() * 900000)}`
    };

    setActivePlans(prev => [newPlan, ...prev]);
    setTransactions(prev => [newTx, ...prev]);
  };

  const depositToPlan = (planId: string, amount: number): boolean => {
    if (amount <= 0) return false;

    const now = new Date('2026-10-02');
    let planFound = false;

    setActivePlans(prev =>
      prev.map(plan => {
        if (plan.id === planId) {
          planFound = true;
          const monthlyEstProfit = Math.round(amount * (plan.interestRate / 100 / 12));
          return {
            ...plan,
            currentBalance: plan.currentBalance + amount,
            totalInvested: plan.totalInvested + amount,
            profitEarned: plan.profitEarned + monthlyEstProfit,
            completedInstallments: Math.min(plan.totalInstallments, plan.completedInstallments + 1)
          };
        }
        return plan;
      })
    );

    if (planFound) {
      const targetPlan = activePlans.find(p => p.id === planId);
      const newTx: SavingsTransaction = {
        id: `tx_${Date.now()}`,
        planId: planId,
        planTitle: targetPlan?.goalName || targetPlan?.planTitle || 'Savings Plan Deposit',
        amount: amount,
        type: 'deposit',
        date: now.toISOString().split('T')[0],
        status: 'completed',
        referenceNo: `UP-DEP-${Math.floor(100000 + Math.random() * 900000)}`
      };
      setTransactions(prev => [newTx, ...prev]);
      return true;
    }
    return false;
  };

  const toggleAutoDebit = (planId: string) => {
    setActivePlans(prev =>
      prev.map(p => (p.id === planId ? { ...p, autoDebitEnabled: !p.autoDebitEnabled } : p))
    );
  };

  const resetSavingsDemo = () => {
    setActivePlans(INITIAL_ACTIVE_PLANS);
    setTransactions(INITIAL_TRANSACTIONS);
    localStorage.removeItem('upay_active_plans');
    localStorage.removeItem('upay_transactions');
  };

  return (
    <SavingsContext.Provider
      value={{
        activePlans,
        transactions,
        totalSavings,
        totalProfitEarned,
        activePlansCount,
        nextMaturity,
        createPlan,
        depositToPlan,
        toggleAutoDebit,
        resetSavingsDemo
      }}
    >
      {children}
    </SavingsContext.Provider>
  );
};

export function useSavings() {
  const context = useContext(SavingsContext);
  if (!context) {
    throw new Error('useSavings must be used within a SavingsProvider');
  }
  return context;
}
