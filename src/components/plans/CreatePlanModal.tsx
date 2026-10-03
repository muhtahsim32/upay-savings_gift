import React, { useState } from 'react';
import { X, CheckCircle, ShieldCheck, TrendingUp, Sparkles } from 'lucide-react';
import { SAVINGS_PLAN_TEMPLATES } from '../../data/mockData';
import { PlanType, SavingsPlanTemplate } from '../../types';
import { useSavings } from '../../context/SavingsContext';
import { useAuth } from '../../context/AuthContext';
import { calculatePlanReturns, formatCurrency } from '../../utils/calculator';

interface CreatePlanModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultPlanType?: PlanType;
  onSuccess?: () => void;
}

export const CreatePlanModal: React.FC<CreatePlanModalProps> = ({
  isOpen,
  onClose,
  defaultPlanType = 'monthly',
  onSuccess
}) => {
  const { createPlan } = useSavings();
  const { user } = useAuth();

  const [selectedType, setSelectedType] = useState<PlanType>(defaultPlanType);
  const [goalName, setGoalName] = useState('');
  const [tenureMonths, setTenureMonths] = useState(12);
  const [amount, setAmount] = useState(2000);
  const [autoDebit, setAutoDebit] = useState(true);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Sync if defaultPlanType prop changes
  React.useEffect(() => {
    if (defaultPlanType) {
      setSelectedType(defaultPlanType);
      const plan = SAVINGS_PLAN_TEMPLATES.find(p => p.type === defaultPlanType);
      if (plan) {
        setAmount(plan.minAmount * 2);
        setTenureMonths(plan.popularTenures[1] || plan.popularTenures[0]);
      }
    }
  }, [defaultPlanType, isOpen]);

  if (!isOpen) return null;

  const currentTemplate: SavingsPlanTemplate =
    SAVINGS_PLAN_TEMPLATES.find(p => p.type === selectedType) || SAVINGS_PLAN_TEMPLATES[0];

  const calculation = calculatePlanReturns(
    selectedType,
    amount,
    tenureMonths,
    currentTemplate.interestRate
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    createPlan({
      planTemplateId: currentTemplate.id,
      planTitle: currentTemplate.title,
      planType: selectedType,
      goalName: selectedType === 'goal' ? (goalName || 'My Custom Goal') : `${currentTemplate.title} (${tenureMonths}M)`,
      installmentAmount: amount,
      targetAmount: calculation.maturityAmount,
      interestRate: currentTemplate.interestRate,
      frequency: currentTemplate.frequency,
      tenureMonths,
      autoDebitEnabled: autoDebit
    });

    setIsSubmitted(true);
    setTimeout(() => {
      setIsSubmitted(false);
      onClose();
      if (onSuccess) onSuccess();
    }, 1200);
  };

  const quickAmounts =
    selectedType === 'fixed'
      ? [10000, 25000, 50000, 100000]
      : selectedType === 'yearly'
      ? [12000, 24000, 50000, 100000]
      : [1000, 2500, 5000, 10000];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="relative w-full max-w-xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/70">
          <div>
            <h3 className="text-base font-semibold text-slate-900">Open a New Savings Plan</h3>
            <p className="text-xs text-slate-500">Fast digital enrollment · Demo instant approval</p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-200/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {isSubmitted ? (
          <div className="p-8 text-center flex flex-col items-center justify-center my-auto">
            <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mb-4 animate-bounce">
              <CheckCircle className="w-8 h-8" />
            </div>
            <h4 className="text-lg font-bold text-slate-900">Savings Plan Activated!</h4>
            <p className="text-sm text-slate-600 mt-1 max-w-sm">
              Your <span className="font-semibold text-slate-800">{currentTemplate.title}</span> has been created with demo confirmation.
            </p>
            <div className="mt-4 p-3 bg-emerald-50 rounded-lg text-emerald-800 text-xs font-mono">
              Initial Deposit: {formatCurrency(amount)} · Yield: {currentTemplate.interestRate}% p.a.
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="overflow-y-auto px-6 py-5 space-y-5">
            {/* Step 1: Select Plan Type */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                1. Select Savings Scheme
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {SAVINGS_PLAN_TEMPLATES.map(plan => (
                  <button
                    key={plan.id}
                    type="button"
                    onClick={() => {
                      setSelectedType(plan.type);
                      setAmount(plan.minAmount * 2);
                      setTenureMonths(plan.popularTenures[1] || plan.popularTenures[0]);
                    }}
                    className={`p-2.5 rounded-xl border text-left transition-all flex flex-col justify-between ${
                      selectedType === plan.type
                        ? 'border-blue-600 bg-blue-50/70 shadow-sm ring-1 ring-blue-600/30'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <div>
                      <span className="text-[10px] font-medium text-blue-600 font-mono">
                        {plan.interestRate}% p.a.
                      </span>
                      <p className="text-xs font-semibold text-slate-900 leading-tight mt-0.5">
                        {plan.type === 'monthly'
                          ? 'Monthly DPS'
                          : plan.type === 'yearly'
                          ? 'Yearly Plan'
                          : plan.type === 'goal'
                          ? 'Goal-Based'
                          : 'Fixed Deposit'}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* If Goal-Based: Custom Goal Name */}
            {selectedType === 'goal' && (
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                  Goal Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. Hajj Journey, New Laptop, Wedding, Emergency"
                  value={goalName}
                  onChange={e => setGoalName(e.target.value)}
                  className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
                  required
                />
              </div>
            )}

            {/* Step 2: Amount */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
                  2. {selectedType === 'fixed' ? 'One-Time Deposit Amount' : 'Installment Amount'}
                </label>
                <span className="text-xs font-mono font-medium text-slate-500">
                  Min {formatCurrency(currentTemplate.minAmount)}
                </span>
              </div>

              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-bold">
                  ৳
                </span>
                <input
                  type="number"
                  min={currentTemplate.minAmount}
                  max={currentTemplate.maxAmount}
                  step={selectedType === 'fixed' ? 1000 : 500}
                  value={amount}
                  onChange={e => setAmount(Number(e.target.value))}
                  className="w-full pl-8 pr-3.5 py-2.5 text-base font-mono font-semibold text-slate-900 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 tabular-nums"
                  required
                />
              </div>

              {/* Quick Select Amount Chips */}
              <div className="flex flex-wrap items-center gap-1.5 mt-2">
                <span className="text-[11px] text-slate-400 mr-1">Quick:</span>
                {quickAmounts.map(val => (
                  <button
                    key={val}
                    type="button"
                    onClick={() => setAmount(val)}
                    className={`px-2 py-0.5 text-xs font-mono rounded border transition-colors ${
                      amount === val
                        ? 'bg-blue-600 text-white border-blue-600'
                        : 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200'
                    }`}
                  >
                    +{val >= 1000 ? `${val / 1000}k` : val}
                  </button>
                ))}
              </div>
            </div>

            {/* Step 3: Tenure Selection */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                3. Savings Duration / Tenure
              </label>
              <div className="grid grid-cols-4 gap-2">
                {currentTemplate.popularTenures.map(months => (
                  <button
                    key={months}
                    type="button"
                    onClick={() => setTenureMonths(months)}
                    className={`py-2 px-3 text-center rounded-lg border text-xs font-medium transition-all ${
                      tenureMonths === months
                        ? 'border-blue-600 bg-blue-50 text-blue-700 font-semibold'
                        : 'border-slate-200 hover:border-slate-300 text-slate-700'
                    }`}
                  >
                    {months >= 12 ? `${months / 12} ${months === 12 ? 'Year' : 'Years'}` : `${months} Months`}
                  </button>
                ))}
              </div>
            </div>

            {/* Projected Returns Box */}
            <div className="p-4 rounded-xl bg-slate-900 text-white space-y-3">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span className="flex items-center gap-1.5">
                  <TrendingUp className="w-3.5 h-3.5 text-amber-400" />
                  Projected Maturity Value
                </span>
                <span className="font-mono text-emerald-400 font-medium">
                  {currentTemplate.interestRate}% p.a.
                </span>
              </div>

              <div className="flex items-baseline justify-between">
                <div>
                  <div className="text-2xl font-bold font-mono text-white tabular-nums tracking-tight">
                    {formatCurrency(calculation.maturityAmount)}
                  </div>
                  <div className="text-[11px] text-slate-400 mt-0.5">
                    Total Estimated Return at {tenureMonths} Months
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-semibold font-mono text-emerald-400 tabular-nums">
                    +{formatCurrency(calculation.totalProfit)}
                  </div>
                  <div className="text-[11px] text-slate-400">Estimated Profit</div>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
                <span>Total Principal: {formatCurrency(calculation.totalPrincipal)}</span>
                <span>Effective Yield: ~{calculation.effectiveYieldPercent}%</span>
              </div>
            </div>

            {/* Auto-Debit Option */}
            {selectedType !== 'fixed' && (
              <label className="flex items-start gap-3 p-3 rounded-lg border border-slate-200 bg-slate-50/50 cursor-pointer hover:bg-slate-50">
                <input
                  type="checkbox"
                  checked={autoDebit}
                  onChange={e => setAutoDebit(e.target.checked)}
                  className="mt-0.5 rounded text-blue-600 focus:ring-blue-500"
                />
                <div className="text-xs">
                  <span className="font-semibold text-slate-900 block">
                    Auto-Debit from linked upay Wallet
                  </span>
                  <span className="text-slate-500">
                    Automatically deduct {formatCurrency(amount)} monthly from{' '}
                    {user?.mobile || '01712-345678'}. Can be paused anytime.
                  </span>
                </div>
              </label>
            )}

            {/* Submit Action */}
            <div className="pt-2">
              <button
                type="submit"
                className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 active:scale-[0.99] text-white font-semibold rounded-xl text-sm transition-all shadow-sm flex items-center justify-center gap-2"
              >
                <span>Activate Demo Plan</span>
                <span className="text-blue-200 font-mono">({formatCurrency(amount)})</span>
              </button>
              <p className="text-[11px] text-slate-400 text-center mt-2">
                Simulated demo subscription. No bank fees or real payment required.
              </p>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
