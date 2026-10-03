import React, { useState } from 'react';
import { SAVINGS_PLAN_TEMPLATES } from '../data/mockData';
import { PlanType, SavingsPlanTemplate } from '../types';
import { calculatePlanReturns, formatCurrency } from '../utils/calculator';
import {
  Calendar,
  PiggyBank,
  Target,
  Lock,
  ArrowRight,
  TrendingUp,
  Check,
  HelpCircle,
  ShieldCheck,
  Sparkles,
  Info
} from 'lucide-react';

interface SavingsPlansPageProps {
  onOpenCreatePlan: (type?: PlanType) => void;
}

export const SavingsPlansPage: React.FC<SavingsPlansPageProps> = ({ onOpenCreatePlan }) => {
  const [selectedCategory, setSelectedCategory] = useState<'all' | PlanType>('all');
  const [calculatorPlan, setCalculatorPlan] = useState<PlanType>('monthly');
  const [calcDeposit, setCalcDeposit] = useState(5000);
  const [calcTenure, setCalcTenure] = useState(24);

  const filteredPlans =
    selectedCategory === 'all'
      ? SAVINGS_PLAN_TEMPLATES
      : SAVINGS_PLAN_TEMPLATES.filter(p => p.type === selectedCategory);

  const activeCalcTemplate =
    SAVINGS_PLAN_TEMPLATES.find(p => p.type === calculatorPlan) || SAVINGS_PLAN_TEMPLATES[0];

  const calcResult = calculatePlanReturns(
    calculatorPlan,
    calcDeposit,
    calcTenure,
    activeCalcTemplate.interestRate
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12 pb-20">
      {/* Header */}
      <div className="max-w-3xl space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-100/70 text-blue-700 text-xs font-semibold">
          <Sparkles className="w-3.5 h-3.5 text-blue-600" />
          <span>Curated Savings Schemes</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900">
          Transparent savings plans tailored to your financial goals
        </h1>
        <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
          From micro-daily habits to fixed multi-year endowments, earn high market-competitive interest rates backed by scheduled bank trustees.
        </p>
      </div>

      {/* Category Filter Tabs */}
      <div className="flex items-center gap-2 p-1.5 bg-slate-100 rounded-xl overflow-x-auto max-w-full">
        <button
          onClick={() => setSelectedCategory('all')}
          className={`px-4 py-2 text-xs font-semibold rounded-lg whitespace-nowrap transition-colors ${
            selectedCategory === 'all'
              ? 'bg-white text-slate-900 shadow-sm'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          All 4 Plans
        </button>
        <button
          onClick={() => setSelectedCategory('monthly')}
          className={`px-4 py-2 text-xs font-semibold rounded-lg whitespace-nowrap transition-colors ${
            selectedCategory === 'monthly'
              ? 'bg-white text-slate-900 shadow-sm'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Monthly Savings (DPS)
        </button>
        <button
          onClick={() => setSelectedCategory('yearly')}
          className={`px-4 py-2 text-xs font-semibold rounded-lg whitespace-nowrap transition-colors ${
            selectedCategory === 'yearly'
              ? 'bg-white text-slate-900 shadow-sm'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Yearly Savings
        </button>
        <button
          onClick={() => setSelectedCategory('goal')}
          className={`px-4 py-2 text-xs font-semibold rounded-lg whitespace-nowrap transition-colors ${
            selectedCategory === 'goal'
              ? 'bg-white text-slate-900 shadow-sm'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Goal-Based Savings
        </button>
        <button
          onClick={() => setSelectedCategory('fixed')}
          className={`px-4 py-2 text-xs font-semibold rounded-lg whitespace-nowrap transition-colors ${
            selectedCategory === 'fixed'
              ? 'bg-white text-slate-900 shadow-sm'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Fixed-Term Savings (FDR)
        </button>
      </div>

      {/* 4 Savings Plan Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {filteredPlans.map(plan => {
          const getIcon = () => {
            switch (plan.type) {
              case 'monthly':
                return <Calendar className="w-5 h-5 text-sky-600" />;
              case 'yearly':
                return <PiggyBank className="w-5 h-5 text-teal-600" />;
              case 'goal':
                return <Target className="w-5 h-5 text-amber-600" />;
              case 'fixed':
                return <Lock className="w-5 h-5 text-indigo-600" />;
            }
          };

          return (
            <div
              key={plan.id}
              className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:shadow-md hover:border-slate-300 transition-all flex flex-col justify-between"
            >
              <div>
                {/* Header of card */}
                <div className="flex items-center justify-between mb-4">
                  <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                    {getIcon()}
                  </div>
                  <span className="font-mono text-sm font-bold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-md">
                    {plan.interestRate}% p.a.
                  </span>
                </div>

                <div className="space-y-1">
                  <h3 className="text-lg font-bold text-slate-900">{plan.title}</h3>
                  <p className="text-xs text-slate-600 leading-relaxed min-h-[44px]">
                    {plan.tagline}
                  </p>
                </div>

                {/* Key Spec Grid */}
                <div className="mt-4 pt-4 border-t border-slate-100 space-y-2 text-xs text-slate-600">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Frequency:</span>
                    <span className="font-medium text-slate-900">{plan.frequency}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Deposit Range:</span>
                    <span className="font-mono font-medium text-slate-900">
                      {formatCurrency(plan.minAmount)} – {formatCurrency(plan.maxAmount)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Duration Range:</span>
                    <span className="font-medium text-slate-900">
                      {plan.minTenureMonths}m to {plan.maxTenureMonths}m
                    </span>
                  </div>
                </div>

                {/* Feature Bullet Points */}
                <div className="mt-4 pt-4 border-t border-slate-100 space-y-2">
                  <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">
                    Key Advantages
                  </span>
                  {plan.features.slice(0, 3).map((feat, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-xs text-slate-600">
                      <Check className="w-3.5 h-3.5 text-blue-600 shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action */}
              <div className="mt-6 pt-4 border-t border-slate-100 space-y-2">
                <button
                  onClick={() => onOpenCreatePlan(plan.type)}
                  className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white font-semibold text-xs rounded-xl transition-all shadow-sm flex items-center justify-center gap-1.5"
                >
                  <span>Start {plan.title}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => {
                    setCalculatorPlan(plan.type);
                    setCalcDeposit(plan.type === 'fixed' ? 50000 : 5000);
                    const el = document.getElementById('plans-calculator');
                    el?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="w-full py-1.5 text-slate-500 hover:text-slate-800 text-[11px] font-medium transition-colors"
                >
                  Simulate in Calculator ↓
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Embedded Deep Calculator */}
      <div id="plans-calculator" className="bg-slate-900 rounded-3xl p-6 sm:p-10 text-white shadow-xl space-y-8">
        <div>
          <span className="text-xs font-semibold text-blue-400 uppercase tracking-wider">
            Savings Growth Simulator
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight mt-1">
            Calculate your exact maturity profit
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-xl">
            See the compounding effect across tenures with zero guesswork and transparent daily accruals.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left inputs */}
          <div className="lg:col-span-7 space-y-6">
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-2">
                Choose Scheme to Model:
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {SAVINGS_PLAN_TEMPLATES.map(p => (
                  <button
                    key={p.id}
                    onClick={() => {
                      setCalculatorPlan(p.type);
                      setCalcDeposit(p.type === 'fixed' ? 50000 : 5000);
                      setCalcTenure(p.popularTenures[1] || 12);
                    }}
                    className={`p-2.5 rounded-xl border text-xs text-left transition-all ${
                      calculatorPlan === p.type
                        ? 'border-blue-500 bg-blue-600/30 text-white shadow-sm'
                        : 'border-slate-800 bg-slate-800/40 text-slate-400 hover:text-white'
                    }`}
                  >
                    <span className="font-mono text-[10px] text-blue-400 block font-semibold">
                      {p.interestRate}% p.a.
                    </span>
                    <span className="font-medium mt-0.5 block truncate">{p.title}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Deposit Slider */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-400">
                  {calculatorPlan === 'fixed' ? 'Deposit Principal' : 'Monthly Installment'}
                </span>
                <span className="font-mono text-lg font-bold text-white tabular-nums">
                  {formatCurrency(calcDeposit)}
                </span>
              </div>
              <input
                type="range"
                min={calculatorPlan === 'fixed' ? 5000 : 500}
                max={calculatorPlan === 'fixed' ? 500000 : 25000}
                step={calculatorPlan === 'fixed' ? 5000 : 500}
                value={calcDeposit}
                onChange={e => setCalcDeposit(Number(e.target.value))}
                className="w-full accent-blue-500 h-2 bg-slate-800 rounded-lg cursor-pointer"
              />
              <div className="flex justify-between text-[11px] text-slate-500 font-mono">
                <span>{formatCurrency(calculatorPlan === 'fixed' ? 5000 : 500)}</span>
                <span>{formatCurrency(calculatorPlan === 'fixed' ? 500000 : 25000)}</span>
              </div>
            </div>

            {/* Tenure Options */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-400">Tenure (Duration)</span>
                <span className="font-mono text-base font-bold text-amber-400 tabular-nums">
                  {calcTenure} Months ({calcTenure >= 12 ? `${(calcTenure / 12).toFixed(1)} Years` : `${calcTenure} Mos`})
                </span>
              </div>
              <div className="grid grid-cols-4 gap-2">
                {activeCalcTemplate.popularTenures.map(months => (
                  <button
                    key={months}
                    onClick={() => setCalcTenure(months)}
                    className={`py-2 px-3 rounded-xl border text-xs font-mono font-medium transition-all ${
                      calcTenure === months
                        ? 'border-amber-500 bg-amber-500/20 text-amber-300'
                        : 'border-slate-800 bg-slate-800/40 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {months}M
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Right Summary Payout */}
          <div className="lg:col-span-5 bg-slate-800/90 border border-slate-700/80 rounded-2xl p-6 space-y-5">
            <div className="border-b border-slate-700 pb-4">
              <span className="text-[11px] text-slate-400 uppercase tracking-wider block">
                Projected Maturity Payout
              </span>
              <div className="text-3xl font-extrabold font-mono text-white tabular-nums mt-1">
                {formatCurrency(calcResult.maturityAmount)}
              </div>
              <p className="text-xs text-slate-400 mt-1">
                At {calcTenure} months maturity date
              </p>
            </div>

            <div className="space-y-2.5 text-xs">
              <div className="flex justify-between text-slate-300">
                <span>Principal Invested:</span>
                <span className="font-mono font-semibold text-white">
                  {formatCurrency(calcResult.totalPrincipal)}
                </span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span>Total Net Profit Accrued:</span>
                <span className="font-mono font-bold text-emerald-400">
                  +{formatCurrency(calcResult.totalProfit)}
                </span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span>Compounded Annual Yield:</span>
                <span className="font-mono font-semibold text-blue-400">
                  {activeCalcTemplate.interestRate}% p.a.
                </span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span>Effective Capital Return:</span>
                <span className="font-mono font-semibold text-amber-400">
                  ~{calcResult.effectiveYieldPercent}%
                </span>
              </div>
            </div>

            <button
              onClick={() => onOpenCreatePlan(calculatorPlan)}
              className="w-full py-3 bg-blue-600 hover:bg-blue-500 active:scale-95 text-white font-semibold text-xs rounded-xl transition-all shadow-md flex items-center justify-center gap-2"
            >
              <span>Activate This Savings Plan (Demo)</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Feature Comparison Matrix */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900 tracking-tight">Scheme Comparison Matrix</h2>
          <p className="text-xs text-slate-500">Detailed parameters for all four prototype savings models</p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-200 text-slate-400 font-semibold uppercase tracking-wider text-[10px]">
                <th className="py-3 px-4">Feature / Metric</th>
                <th className="py-3 px-4">Monthly DPS</th>
                <th className="py-3 px-4">Yearly Savings</th>
                <th className="py-3 px-4">Goal-Based</th>
                <th className="py-3 px-4">Fixed-Term (FDR)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              <tr>
                <td className="py-3 px-4 font-semibold text-slate-900">Profit Rate (p.a.)</td>
                <td className="py-3 px-4 font-mono font-bold text-blue-600">8.5%</td>
                <td className="py-3 px-4 font-mono font-bold text-teal-600">8.9%</td>
                <td className="py-3 px-4 font-mono font-bold text-amber-600">8.2%</td>
                <td className="py-3 px-4 font-mono font-bold text-indigo-600">9.25%</td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-semibold text-slate-900">Minimum Deposit</td>
                <td className="py-3 px-4 font-mono">৳500 / month</td>
                <td className="py-3 px-4 font-mono">৳10,000 / year</td>
                <td className="py-3 px-4 font-mono">৳200 anytime</td>
                <td className="py-3 px-4 font-mono">৳5,000 lump sum</td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-semibold text-slate-900">Tenure Options</td>
                <td className="py-3 px-4">6m – 60m</td>
                <td className="py-3 px-4">12m – 60m</td>
                <td className="py-3 px-4">3m – 36m</td>
                <td className="py-3 px-4">3m – 36m</td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-semibold text-slate-900">Auto-Debit Support</td>
                <td className="py-3 px-4 text-emerald-600 font-medium">Yes (Scheduled)</td>
                <td className="py-3 px-4 text-emerald-600 font-medium">Yes (Annual)</td>
                <td className="py-3 px-4 text-emerald-600 font-medium">Optional</td>
                <td className="py-3 px-4 text-slate-400">N/A (One-Time)</td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-semibold text-slate-900">Premature Encashment</td>
                <td className="py-3 px-4">After 3 months</td>
                <td className="py-3 px-4">After 6 months</td>
                <td className="py-3 px-4 text-emerald-600">Anytime Instant</td>
                <td className="py-3 px-4">At maturity or reduced rate</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
