import React, { useState } from 'react';
import {
  TrendingUp,
  ShieldCheck,
  Zap,
  ArrowRight,
  PiggyBank,
  Calendar,
  Lock,
  Target,
  Sparkles,
  Award,
  ChevronRight,
  Clock,
  CheckCircle2,
  Sliders,
  Bot,
  HelpCircle,
  Lightbulb,
  ShieldAlert,
  Wallet,
  Play
} from 'lucide-react';
import { SAVINGS_PLAN_TEMPLATES } from '../data/mockData';
import { calculatePlanReturns, formatCurrency } from '../utils/calculator';
import { PlanType } from '../types';
import heroSavingsVault from '../assets/images/hero_savings_vault_1790995417788.jpg';

interface LandingPageProps {
  onNavigate: (tab: string) => void;
  onOpenCreatePlan: (type?: PlanType) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onNavigate, onOpenCreatePlan }) => {
  // Interactive Calculator State on Landing Page
  const [calcPlanType, setCalcPlanType] = useState<PlanType>('monthly');
  const [calcAmount, setCalcAmount] = useState(5000);
  const [calcTenure, setCalcTenure] = useState(24);

  const selectedTemplate =
    SAVINGS_PLAN_TEMPLATES.find(p => p.type === calcPlanType) || SAVINGS_PLAN_TEMPLATES[0];

  const calcResult = calculatePlanReturns(
    calcPlanType,
    calcAmount,
    calcTenure,
    selectedTemplate.interestRate
  );

  return (
    <div className="space-y-16 pb-20">
      {/* 1. Hero Section: Strong Demo Landing */}
      <section className="relative overflow-hidden pt-8 pb-16 md:pt-14 md:pb-20 bg-gradient-to-b from-blue-50/70 via-white to-slate-50 border-b border-slate-200/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            {/* Left Column: Value Prop */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100/80 text-blue-700 text-xs font-semibold">
                <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                <span>Next-Gen Personal Savings Prototype</span>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900 leading-[1.15] text-balance">
                AI-powered personal savings planning for{' '}
                <span className="text-blue-600">everyday Bangladesh</span>
              </h1>

              <p className="text-base sm:text-lg text-slate-600 max-w-xl leading-relaxed">
                Turn your income, expenses and savings goal into a realistic plan — then compare what happens when you save more or less.
              </p>

              {/* Three Clear Value Points */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                <div className="p-3.5 rounded-xl bg-white border border-blue-100 shadow-sm space-y-1">
                  <div className="flex items-center gap-1.5 text-blue-700 font-bold text-xs">
                    <Bot className="w-4 h-4 text-blue-600 shrink-0" />
                    <span>Gemini AI Coach</span>
                  </div>
                  <p className="text-[11px] text-slate-500 leading-normal">
                    Evaluates goal feasibility and calculates realistic monthly saving rates.
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-white border border-indigo-100 shadow-sm space-y-1">
                  <div className="flex items-center gap-1.5 text-indigo-700 font-bold text-xs">
                    <Sliders className="w-4 h-4 text-indigo-600 shrink-0" />
                    <span>What-If Simulator</span>
                  </div>
                  <p className="text-[11px] text-slate-500 leading-normal">
                    Compare Current Plan, Save More, and Save Less side-by-side on live charts.
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-white border border-slate-200 shadow-sm space-y-1">
                  <div className="flex items-center gap-1.5 text-slate-800 font-bold text-xs">
                    <Target className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Goal-Based Savings Planning</span>
                  </div>
                  <p className="text-[11px] text-slate-500 leading-normal">
                    Structured micro-savings habits for Emergency Fund, Education, and Hajj.
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <button
                  onClick={() => onNavigate('coach')}
                  className="px-6 py-3 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white font-semibold text-sm rounded-xl transition-all shadow-md shadow-blue-500/25 flex items-center gap-2 group"
                >
                  <Sparkles className="w-4 h-4 text-amber-300" />
                  <span>Launch AI Savings Coach</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>

                <button
                  onClick={() => onNavigate('simulator')}
                  className="px-5 py-3 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 text-indigo-700 font-semibold text-sm rounded-xl transition-colors shadow-sm flex items-center gap-1.5"
                >
                  <Sliders className="w-4 h-4 text-indigo-600" />
                  <span>Try What-If Simulator</span>
                </button>

                <button
                  onClick={() => onNavigate('plans')}
                  className="px-4 py-3 bg-white hover:bg-slate-100 border border-slate-300 text-slate-700 font-semibold text-sm rounded-xl transition-colors shadow-sm"
                >
                  Explore Plans
                </button>
              </div>

              {/* Trust Indicators */}
              <div className="pt-4 border-t border-slate-200/80 grid grid-cols-3 gap-4">
                <div>
                  <div className="text-xl sm:text-2xl font-bold font-mono text-indigo-600 tabular-nums">
                    Gemini AI
                  </div>
                  <div className="text-xs text-slate-500 mt-0.5">Smart Guidance</div>
                </div>
                <div>
                  <div className="text-xl sm:text-2xl font-bold font-mono text-slate-900 tabular-nums">
                    ৳500
                  </div>
                  <div className="text-xs text-slate-500 mt-0.5">Micro-Start Amount</div>
                </div>
                <div>
                  <div className="text-xl sm:text-2xl font-bold font-mono text-slate-900 tabular-nums">
                    Instant
                  </div>
                  <div className="text-xs text-slate-500 mt-0.5">Wallet Liquidity</div>
                </div>
              </div>
            </div>

            {/* Right Column: Hero Visual Showcase */}
            <div className="lg:col-span-5 relative">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-slate-200/80 bg-slate-900">
                <img
                  src={heroSavingsVault}
                  alt="Digital savings vault prototype concept"
                  className="w-full max-w-full h-80 sm:h-96 object-cover opacity-90 hover:scale-105 transition-transform duration-700"
                />

                {/* Floating Glassmorphic Metric Overlay */}
                <div className="absolute bottom-4 left-4 right-4 p-4 rounded-xl bg-slate-900/85 backdrop-blur-md border border-white/10 text-white shadow-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-[11px] text-slate-400 uppercase tracking-wider font-semibold">
                        Customer Portfolio Prototype
                      </div>
                      <div className="text-xl font-bold font-mono text-emerald-400 tabular-nums">
                        ৳185,400.00
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="inline-flex items-center gap-1 text-xs font-mono text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800/40">
                        <TrendingUp className="w-3 h-3" /> +৳16,400 Profit
                      </span>
                      <div className="text-[10px] text-slate-400 mt-1">3 Active Plans</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Visual User Journey Flow Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-semibold">
            <TrendingUp className="w-3.5 h-3.5 text-blue-600" />
            <span>Complete Savings Workflow</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            The Intelligent Savings Journey
          </h2>
          <p className="text-xs sm:text-sm text-slate-600">
            More than a simple interest calculator — an end-to-end financial intelligence process.
          </p>
        </div>

        {/* 5-Step Journey Diagram */}
        <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 relative">
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-2 relative">
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 font-bold text-xs flex items-center justify-center">
              1
            </div>
            <h3 className="text-xs font-bold text-slate-900">Your Money</h3>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              Define monthly income and essential expenses to discover disposable surplus.
            </p>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-2 relative">
            <div className="w-8 h-8 rounded-xl bg-teal-50 text-teal-600 font-bold text-xs flex items-center justify-center">
              2
            </div>
            <h3 className="text-xs font-bold text-slate-900">Your Goal</h3>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              Select specific milestones like Emergency Fund, Education, or Wedding.
            </p>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-indigo-200 shadow-sm space-y-2 relative bg-indigo-50/30">
            <div className="w-8 h-8 rounded-xl bg-indigo-100 text-indigo-700 font-bold text-xs flex items-center justify-center">
              3
            </div>
            <h3 className="text-xs font-bold text-indigo-900 flex items-center gap-1">
              <span>AI Analysis</span>
              <Sparkles className="w-3 h-3 text-indigo-600" />
            </h3>
            <p className="text-[11px] text-slate-600 leading-relaxed">
              Gemini evaluates timeline feasibility and recommends realistic monthly savings.
            </p>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-blue-200 shadow-sm space-y-2 relative bg-blue-50/30">
            <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-700 font-bold text-xs flex items-center justify-center">
              4
            </div>
            <h3 className="text-xs font-bold text-blue-900 flex items-center gap-1">
              <span>What-If Scenarios</span>
              <Sliders className="w-3 h-3 text-blue-600" />
            </h3>
            <p className="text-[11px] text-slate-600 leading-relaxed">
              Model Current Plan, Save More, and Save Less side-by-side with visual charts.
            </p>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-emerald-200 shadow-sm space-y-2 relative bg-emerald-50/30">
            <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 font-bold text-xs flex items-center justify-center">
              5
            </div>
            <h3 className="text-xs font-bold text-emerald-900">Action Plan</h3>
            <p className="text-[11px] text-slate-600 leading-relaxed">
              Lock in disciplined recurring auto-debits and actionable micro-saving habits.
            </p>
          </div>
        </div>
      </section>

      {/* 3. "Why This Matters" Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-br from-slate-900 to-indigo-950 rounded-3xl p-8 sm:p-12 text-white shadow-xl space-y-8">
          <div className="max-w-3xl space-y-3">
            <span className="text-xs font-semibold text-blue-400 uppercase tracking-wider">
              The Real Problem in Personal Finance
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
              Why Intelligent Savings Planning Matters
            </h2>
            <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-medium">
              "Many people know they should save, but don't know how much they can realistically save each month."
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2">
              <div className="w-8 h-8 rounded-xl bg-blue-500/20 text-blue-300 flex items-center justify-center text-xs font-bold">
                01
              </div>
              <h3 className="text-sm font-bold text-white">Understand Saving Capacity</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Calculate true disposable surplus from income minus essential living expenses before committing.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2">
              <div className="w-8 h-8 rounded-xl bg-teal-500/20 text-teal-300 flex items-center justify-center text-xs font-bold">
                02
              </div>
              <h3 className="text-sm font-bold text-white">Set Realistic Goals</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Avoid unrealistic targets that fail mid-way by testing feasibility before locking money.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2">
              <div className="w-8 h-8 rounded-xl bg-indigo-500/20 text-indigo-300 flex items-center justify-center text-xs font-bold">
                03
              </div>
              <h3 className="text-sm font-bold text-white">Compare Scenarios</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                See exactly how saving ৳2,000 more or less shifts your milestone completion date.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2">
              <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-300 flex items-center justify-center text-xs font-bold">
                04
              </div>
              <h3 className="text-sm font-bold text-white">Personalized AI Guidance</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Receive educational suggestions from Gemini tailored to Bangladesh living realities.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Trust & Safety Messaging Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 text-slate-700 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <ShieldCheck className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
            <div className="space-y-0.5 text-xs">
              <div className="font-semibold text-slate-900">Educational Planning Prototype</div>
              <p className="text-slate-500 leading-relaxed">
                Educational prototype — not financial advice. Does not process real banking, payment or KYC data. Projections are illustrative and depend on user-provided inputs.
              </p>
            </div>
          </div>

          <button
            onClick={() => onNavigate('coach')}
            className="px-4 py-2 bg-slate-900 hover:bg-blue-600 text-white font-semibold text-xs rounded-xl transition-colors whitespace-nowrap shrink-0"
          >
            Load Demo Scenario
          </button>
        </div>
      </section>

      {/* 5. 4 Savings Plan Cards Preview */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            Tailored savings for every life stage
          </h2>
          <p className="text-sm text-slate-600 mt-2">
            Choose from disciplined recurring DPS, goal-driven micro-pots, or fixed-term wealth multipliers.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {SAVINGS_PLAN_TEMPLATES.map(plan => {
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
                className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:shadow-md hover:border-slate-300 transition-all flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 group-hover:scale-110 transition-transform">
                      {getIcon()}
                    </div>
                    <span className="font-mono text-sm font-bold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-md">
                      {plan.interestRate}% p.a.
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-slate-900 mb-1">{plan.title}</h3>
                  <p className="text-xs text-slate-600 leading-relaxed min-h-[36px]">
                    {plan.tagline}
                  </p>

                  <div className="mt-4 pt-4 border-t border-slate-100 space-y-2 text-xs text-slate-600">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Min. Deposit:</span>
                      <span className="font-mono font-medium text-slate-900">
                        {formatCurrency(plan.minAmount)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Tenure:</span>
                      <span className="font-medium text-slate-900">
                        {plan.minTenureMonths}m – {plan.maxTenureMonths}m
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Protection:</span>
                      <span className="font-medium text-slate-900">{plan.riskRating}</span>
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100">
                  <button
                    onClick={() => onOpenCreatePlan(plan.type)}
                    className="w-full py-2.5 px-3 bg-slate-900 hover:bg-blue-600 active:scale-95 text-white text-xs font-semibold rounded-xl transition-colors flex items-center justify-center gap-1.5 shadow-sm"
                  >
                    <span>Start This Plan</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 6. Interactive Savings Calculator Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-slate-900 rounded-3xl p-6 sm:p-10 text-white shadow-xl overflow-hidden relative">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Controls */}
            <div className="lg:col-span-7 space-y-6">
              <div>
                <span className="text-xs font-semibold text-blue-400 uppercase tracking-wider">
                  Interactive Return Estimator
                </span>
                <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight mt-1">
                  Watch your small deposits multiply
                </h2>
                <p className="text-xs sm:text-sm text-slate-400 mt-1">
                  Adjust plan type, installment amount, and tenure to estimate milestone growth (Illustrative demo only).
                </p>
              </div>

              {/* Plan Type Selector */}
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-2">
                  Select Plan Scheme
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {SAVINGS_PLAN_TEMPLATES.map(p => (
                    <button
                      key={p.id}
                      onClick={() => {
                        setCalcPlanType(p.type);
                        setCalcAmount(p.type === 'fixed' ? 50000 : 5000);
                        setCalcTenure(p.popularTenures[1] || 12);
                      }}
                      className={`py-2 px-3 rounded-xl border text-xs font-medium text-center transition-all ${
                        calcPlanType === p.type
                          ? 'border-blue-500 bg-blue-600/30 text-white'
                          : 'border-slate-800 bg-slate-800/60 text-slate-400 hover:text-white'
                      }`}
                    >
                      {p.type === 'monthly'
                        ? 'Monthly DPS'
                        : p.type === 'yearly'
                        ? 'Yearly Plan'
                        : p.type === 'goal'
                        ? 'Goal-Based'
                        : 'Fixed Deposit'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Amount Slider */}
              <div className="space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-400">
                    {calcPlanType === 'fixed' ? 'Deposit Amount' : 'Monthly Installment'}
                  </span>
                  <span className="font-mono text-base font-bold text-blue-400 tabular-nums">
                    {formatCurrency(calcAmount)}
                  </span>
                </div>
                <input
                  type="range"
                  min={calcPlanType === 'fixed' ? 5000 : 500}
                  max={calcPlanType === 'fixed' ? 300000 : 25000}
                  step={calcPlanType === 'fixed' ? 5000 : 500}
                  value={calcAmount}
                  onChange={e => setCalcAmount(Number(e.target.value))}
                  className="w-full accent-blue-500 h-2 bg-slate-800 rounded-lg cursor-pointer"
                />
                <div className="flex justify-between text-[11px] text-slate-500 font-mono">
                  <span>{formatCurrency(calcPlanType === 'fixed' ? 5000 : 500)}</span>
                  <span>{formatCurrency(calcPlanType === 'fixed' ? 300000 : 25000)}</span>
                </div>
              </div>

              {/* Tenure Slider */}
              <div className="space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-400">Savings Duration</span>
                  <span className="font-mono text-base font-bold text-amber-400 tabular-nums">
                    {calcTenure} Months ({calcTenure >= 12 ? `${(calcTenure / 12).toFixed(1)} Yrs` : `${calcTenure} Mos`})
                  </span>
                </div>
                <div className="flex gap-2">
                  {selectedTemplate.popularTenures.map(t => (
                    <button
                      key={t}
                      onClick={() => setCalcTenure(t)}
                      className={`flex-1 py-1.5 rounded-lg border text-xs font-mono font-medium transition-all ${
                        calcTenure === t
                          ? 'border-amber-500 bg-amber-500/20 text-amber-300'
                          : 'border-slate-800 bg-slate-800/40 text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      {t}M
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Projected Maturity Output Card */}
            <div className="lg:col-span-5 bg-slate-800/80 border border-slate-700/80 rounded-2xl p-6 space-y-6">
              <div className="flex items-center justify-between border-b border-slate-700 pb-4">
                <div>
                  <span className="text-[11px] text-slate-400 uppercase tracking-wider">
                    Total Maturity Value
                  </span>
                  <div className="text-3xl font-extrabold font-mono text-white tabular-nums mt-1">
                    {formatCurrency(calcResult.maturityAmount)}
                  </div>
                </div>
                <div className="p-2.5 rounded-xl bg-blue-500/20 text-blue-400">
                  <TrendingUp className="w-6 h-6" />
                </div>
              </div>

              <div className="space-y-3 text-xs">
                <div className="flex justify-between items-center text-slate-300">
                  <span>Total Amount Invested:</span>
                  <span className="font-mono font-semibold text-white">
                    {formatCurrency(calcResult.totalPrincipal)}
                  </span>
                </div>
                <div className="flex justify-between items-center text-slate-300">
                  <span>Illustrative Profit Accrued:</span>
                  <span className="font-mono font-bold text-emerald-400">
                    +{formatCurrency(calcResult.totalProfit)}
                  </span>
                </div>
                <div className="flex justify-between items-center text-slate-300">
                  <span>Annual Profit Rate:</span>
                  <span className="font-mono font-semibold text-blue-400">
                    {selectedTemplate.interestRate}% p.a.
                  </span>
                </div>
                <div className="flex justify-between items-center text-slate-300">
                  <span>Effective Net Yield:</span>
                  <span className="font-mono font-semibold text-amber-400">
                    ~{calcResult.effectiveYieldPercent}%
                  </span>
                </div>
              </div>

              <button
                onClick={() => onOpenCreatePlan(calcPlanType)}
                className="w-full py-3 bg-blue-600 hover:bg-blue-500 active:scale-95 text-white font-semibold text-sm rounded-xl transition-all shadow-md flex items-center justify-center gap-2"
              >
                <span>Open This Plan (Demo)</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 7. Call to Action Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-700 rounded-3xl p-8 sm:p-12 text-white shadow-xl space-y-5">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight max-w-xl mx-auto">
            Ready to test your prototype savings portfolio?
          </h2>
          <p className="text-sm text-blue-100 max-w-md mx-auto">
            Try the demo mode with Gemini AI coaching, run What-If scenarios, or test opening a customized scheme in real time.
          </p>
          <div className="flex flex-wrap justify-center gap-3 pt-2">
            <button
              onClick={() => onNavigate('coach')}
              className="px-6 py-3 bg-white hover:bg-slate-100 text-blue-900 font-semibold text-xs rounded-xl shadow transition-all active:scale-95 flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5 text-blue-600" />
              <span>Launch AI Savings Coach</span>
            </button>
            <button
              onClick={() => onNavigate('simulator')}
              className="px-6 py-3 bg-indigo-900/80 hover:bg-indigo-900 text-white font-semibold text-xs rounded-xl transition-all flex items-center gap-1.5"
            >
              <Sliders className="w-3.5 h-3.5 text-indigo-300" />
              <span>Smart What-If Simulator</span>
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
