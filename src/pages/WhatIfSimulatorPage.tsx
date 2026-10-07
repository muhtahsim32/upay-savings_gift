import React, { useState } from 'react';
import {
  TrendingUp,
  Target,
  Sparkles,
  Bot,
  Zap,
  ArrowRight,
  RefreshCw,
  Sliders,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Wallet,
  ShieldCheck,
  Info,
  ChevronRight,
  Percent,
  Plus,
  Minus
} from 'lucide-react';
import { formatCurrency } from '../utils/calculator';
import {
  SimulatorInputs,
  WhatIfComparison,
  WhatIfAiInsight,
  calculateWhatIfComparison,
  fetchWhatIfAiInsight
} from '../services/whatIfSimulator';
import { WhatIfChart } from '../components/simulator/WhatIfChart';

interface WhatIfSimulatorPageProps {
  onNavigate: (tab: string) => void;
  onOpenCreatePlan?: () => void;
}

const GOAL_SUGGESTIONS = [
  'Emergency Fund',
  'Higher Education',
  'Wedding Ceremony',
  'Family Hajj / Umrah',
  'Small Business Startup',
  'Holiday Travel'
];

export const WhatIfSimulatorPage: React.FC<WhatIfSimulatorPageProps> = ({
  onNavigate,
  onOpenCreatePlan
}) => {
  // Baseline initial state pre-populated with exact prompt verification test
  const [inputs, setInputs] = useState<SimulatorInputs>({
    goalName: 'Emergency Fund',
    currentSavings: 5000,
    targetAmount: 50000,
    targetMonths: 10,
    currentPlanMonthly: 5000,
    saveMoreMonthly: 7000,
    saveLessMonthly: 3000
  });

  // AI Insight State
  const [aiInsight, setAiInsight] = useState<WhatIfAiInsight | null>(null);
  const [isLoadingAi, setIsLoadingAi] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);

  // Recalculate deterministic comparison on every input update
  const comparison: WhatIfComparison = calculateWhatIfComparison(inputs);

  const handleInputChange = (field: keyof SimulatorInputs, value: string | number) => {
    setInputs(prev => ({
      ...prev,
      [field]: typeof value === 'number' ? value : value
    }));
  };

  // Dynamic quick scenario modifiers
  const handleApplyPlus20Percent = () => {
    const newMore = Math.round(inputs.currentPlanMonthly * 1.2);
    setInputs(prev => ({ ...prev, saveMoreMonthly: newMore }));
  };

  const handleApplyMinus20Percent = () => {
    const newLess = Math.round(inputs.currentPlanMonthly * 0.8);
    setInputs(prev => ({ ...prev, saveLessMonthly: Math.max(500, newLess) }));
  };

  const handleReachGoalFaster = () => {
    // Calculates exact required monthly deposit to reach target within tenure
    const required = comparison.requiredMonthlyToMeetTarget;
    // Set Save More to 15% above required to finish early with safety buffer
    const fasterRate = Math.max(required, Math.round(required * 1.15));
    setInputs(prev => ({ ...prev, saveMoreMonthly: fasterRate }));
  };

  const handleResetToBaselineTest = () => {
    setInputs({
      goalName: 'Emergency Fund',
      currentSavings: 5000,
      targetAmount: 50000,
      targetMonths: 10,
      currentPlanMonthly: 5000,
      saveMoreMonthly: 7000,
      saveLessMonthly: 3000
    });
    setAiInsight(null);
    setAiError(null);
  };

  const handleGenerateAiInsight = async () => {
    setIsLoadingAi(true);
    setAiError(null);

    try {
      const insight = await fetchWhatIfAiInsight(comparison);
      setAiInsight(insight);
    } catch (err: any) {
      console.error('AI insight error:', err);
      setAiError(
        err.message || 'Unable to connect to the scenario insight service. Please try again.'
      );
    } finally {
      setIsLoadingAi(false);
    }
  };

  const { current, more, less } = comparison.scenarios;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10 pb-24">
      {/* Top Header & Context Badges */}
      <div className="space-y-4">
        <div className="flex flex-wrap items-center gap-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-100/80 text-blue-800 text-xs font-semibold">
            <Sliders className="w-3.5 h-3.5 text-blue-600" />
            <span>Smart What-If Analysis</span>
          </div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-100/80 text-indigo-800 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
            <span>Powered by Gemini AI</span>
          </div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-medium">
            <Bot className="w-3.5 h-3.5 text-slate-600" />
            <span>AI-generated educational guidance</span>
          </div>
        </div>

        <div className="max-w-3xl">
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900">
            Smart What-If Simulator
          </h1>
          <p className="text-sm sm:text-base text-slate-600 mt-2 leading-relaxed">
            Compare how small changes in your monthly saving can change your goal timeline.
            Simulate scenarios side-by-side, view milestone completion horizons, and consult Gemini for trade-off insights.
          </p>
        </div>

        {/* Prototype Disclaimer */}
        <div className="p-3.5 bg-amber-500/10 border border-amber-500/30 rounded-xl text-xs text-amber-950 flex items-start gap-2.5">
          <Info className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            <span className="font-semibold uppercase tracking-wider text-[10px] mr-1">Product Notice:</span>
            Illustrative planning only — not financial advice. This prototype does not execute real financial transactions.
          </p>
        </div>
      </div>

      {/* Main Grid: Input Parameters & Real-Time Scenarios */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Simulator Input Controls (5 cols) */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h2 className="text-base font-bold text-slate-900">Goal & Baseline Setup</h2>
              <p className="text-xs text-slate-500 mt-0.5">Define your target and duration in Bangladeshi Taka (BDT)</p>
            </div>
            <button
              onClick={handleResetToBaselineTest}
              className="text-[11px] text-blue-600 hover:text-blue-700 font-medium"
              title="Reset to ৳50k / 10M test case"
            >
              Reset Benchmark
            </button>
          </div>

          <div className="space-y-4">
            {/* Goal Title */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Savings Goal
              </label>
              <input
                type="text"
                value={inputs.goalName}
                onChange={e => handleInputChange('goalName', e.target.value)}
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
                placeholder="e.g. Emergency Fund"
              />
              <div className="flex flex-wrap gap-1 mt-1.5">
                {GOAL_SUGGESTIONS.map(goal => (
                  <button
                    key={goal}
                    type="button"
                    onClick={() => handleInputChange('goalName', goal)}
                    className="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors"
                  >
                    {goal}
                  </button>
                ))}
              </div>
            </div>

            {/* Current Accumulated Savings */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Current Accumulated Savings (BDT)
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-mono text-xs">
                  ৳
                </span>
                <input
                  type="number"
                  min="0"
                  step="1000"
                  value={inputs.currentSavings}
                  onChange={e => handleInputChange('currentSavings', Number(e.target.value))}
                  className="w-full pl-8 pr-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 font-mono"
                  placeholder="e.g. 5000"
                />
              </div>
            </div>

            {/* Target Goal Amount */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Target Amount (BDT)
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-mono text-xs">
                  ৳
                </span>
                <input
                  type="number"
                  min="1000"
                  step="5000"
                  value={inputs.targetAmount}
                  onChange={e => handleInputChange('targetAmount', Number(e.target.value))}
                  className="w-full pl-8 pr-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 font-mono"
                  placeholder="e.g. 50000"
                />
              </div>
            </div>

            {/* Target Duration */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Target Duration (Months)
              </label>
              <input
                type="number"
                min="1"
                max="120"
                value={inputs.targetMonths}
                onChange={e => handleInputChange('targetMonths', Number(e.target.value))}
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 font-mono"
                placeholder="e.g. 10"
              />
              <div className="flex gap-2 mt-2">
                {[6, 10, 12, 18, 24].map(m => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => handleInputChange('targetMonths', m)}
                    className={`flex-1 py-1 text-xs rounded border transition-colors ${
                      inputs.targetMonths === m
                        ? 'border-blue-600 bg-blue-50 text-blue-700 font-semibold'
                        : 'border-slate-200 hover:bg-slate-50 text-slate-600'
                    }`}
                  >
                    {m}M
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-2">
                Adjust Monthly Saving Rates (BDT):
              </span>

              {/* Scenario 1: Current Plan */}
              <div className="space-y-1 mb-3">
                <div className="flex justify-between text-xs">
                  <span className="font-semibold text-blue-700">Current Plan:</span>
                  <span className="font-mono font-bold text-slate-900">
                    {formatCurrency(inputs.currentPlanMonthly)}/mo
                  </span>
                </div>
                <input
                  type="number"
                  min="500"
                  step="500"
                  value={inputs.currentPlanMonthly}
                  onChange={e => handleInputChange('currentPlanMonthly', Number(e.target.value))}
                  className="w-full px-3 py-1.5 text-xs border border-blue-300 rounded-lg font-mono"
                />
              </div>

              {/* Scenario 2: Save More */}
              <div className="space-y-1 mb-3">
                <div className="flex justify-between text-xs">
                  <span className="font-semibold text-indigo-700">Save More:</span>
                  <span className="font-mono font-bold text-slate-900">
                    {formatCurrency(inputs.saveMoreMonthly)}/mo
                  </span>
                </div>
                <input
                  type="number"
                  min="500"
                  step="500"
                  value={inputs.saveMoreMonthly}
                  onChange={e => handleInputChange('saveMoreMonthly', Number(e.target.value))}
                  className="w-full px-3 py-1.5 text-xs border border-indigo-300 rounded-lg font-mono"
                />
              </div>

              {/* Scenario 3: Save Less */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="font-semibold text-amber-700">Save Less:</span>
                  <span className="font-mono font-bold text-slate-900">
                    {formatCurrency(inputs.saveLessMonthly)}/mo
                  </span>
                </div>
                <input
                  type="number"
                  min="500"
                  step="500"
                  value={inputs.saveLessMonthly}
                  onChange={e => handleInputChange('saveLessMonthly', Number(e.target.value))}
                  className="w-full px-3 py-1.5 text-xs border border-amber-300 rounded-lg font-mono"
                />
              </div>
            </div>

            {/* Quick Scenario Modifier Buttons */}
            <div className="pt-2 border-t border-slate-100 space-y-2">
              <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
                Quick Scenario Presets:
              </span>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={handleApplyPlus20Percent}
                  className="py-1.5 px-2 bg-slate-50 hover:bg-indigo-50 border border-slate-200 hover:border-indigo-300 text-slate-700 hover:text-indigo-700 text-[11px] font-semibold rounded-lg transition-colors text-center"
                  title="Increase Save More by +20% over Current Plan"
                >
                  +20% Saving
                </button>
                <button
                  type="button"
                  onClick={handleApplyMinus20Percent}
                  className="py-1.5 px-2 bg-slate-50 hover:bg-amber-50 border border-slate-200 hover:border-amber-300 text-slate-700 hover:text-amber-700 text-[11px] font-semibold rounded-lg transition-colors text-center"
                  title="Decrease Save Less by -20% from Current Plan"
                >
                  -20% Saving
                </button>
                <button
                  type="button"
                  onClick={handleReachGoalFaster}
                  className="py-1.5 px-2 bg-blue-50 hover:bg-blue-100 border border-blue-200 text-blue-700 text-[11px] font-semibold rounded-lg transition-colors text-center"
                  title="Calculate required monthly saving to reach goal faster"
                >
                  Goal Faster
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: 3 Scenario Cards, Chart & AI Insight (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Section: 3 Comparison Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Card 1: Save Less */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-3 relative overflow-hidden flex flex-col justify-between">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-amber-700 uppercase tracking-wider bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                    Save Less
                  </span>
                  <span className="font-mono text-xs font-bold text-slate-700">
                    {formatCurrency(less.monthlySaving)}/m
                  </span>
                </div>

                <div className="pt-1">
                  <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-semibold">
                    Projected at {inputs.targetMonths}M:
                  </span>
                  <div className="text-xl font-bold font-mono text-slate-900 tabular-nums">
                    {formatCurrency(less.projectedSavings)}
                  </div>
                </div>

                {/* Progress bar */}
                <div className="space-y-1">
                  <div className="flex justify-between text-[11px] text-slate-500">
                    <span>Progress</span>
                    <span className="font-mono font-bold text-amber-600">{less.exactProgressPercent}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-amber-500 rounded-full transition-all duration-300"
                      style={{ width: `${less.progressPercent}%` }}
                    />
                  </div>
                </div>

                <div className="space-y-1.5 text-xs pt-1 border-t border-slate-100">
                  <div className="flex justify-between text-slate-600">
                    <span className="text-slate-400">Total Deposit:</span>
                    <span className="font-mono">{formatCurrency(less.totalContribution)}</span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span className="text-slate-400">Est. Timeline:</span>
                    <span className="font-mono">{less.estimatedMonthsDisplay}</span>
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <span className={`block text-center py-1 px-2 rounded-lg text-[11px] font-semibold ${
                  less.statusBadge.variant === 'success'
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                    : 'bg-amber-50 text-amber-800 border border-amber-200'
                }`}>
                  {less.statusBadge.label}
                </span>
              </div>
            </div>

            {/* Card 2: Current Plan */}
            <div className="bg-white rounded-2xl border-2 border-blue-500 p-5 shadow-md space-y-3 relative overflow-hidden flex flex-col justify-between">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-blue-700 uppercase tracking-wider bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                    Current Plan
                  </span>
                  <span className="font-mono text-xs font-bold text-blue-700">
                    {formatCurrency(current.monthlySaving)}/m
                  </span>
                </div>

                <div className="pt-1">
                  <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-semibold">
                    Projected at {inputs.targetMonths}M:
                  </span>
                  <div className="text-xl font-bold font-mono text-blue-900 tabular-nums">
                    {formatCurrency(current.projectedSavings)}
                  </div>
                </div>

                {/* Progress bar */}
                <div className="space-y-1">
                  <div className="flex justify-between text-[11px] text-slate-500">
                    <span>Progress</span>
                    <span className="font-mono font-bold text-blue-600">{current.exactProgressPercent}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-blue-600 rounded-full transition-all duration-300"
                      style={{ width: `${current.progressPercent}%` }}
                    />
                  </div>
                </div>

                <div className="space-y-1.5 text-xs pt-1 border-t border-slate-100">
                  <div className="flex justify-between text-slate-600">
                    <span className="text-slate-400">Total Deposit:</span>
                    <span className="font-mono">{formatCurrency(current.totalContribution)}</span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span className="text-slate-400">Est. Timeline:</span>
                    <span className="font-mono font-bold text-slate-800">{current.estimatedMonthsDisplay}</span>
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <span className={`block text-center py-1 px-2 rounded-lg text-[11px] font-semibold ${
                  current.statusBadge.variant === 'success'
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                    : 'bg-amber-50 text-amber-800 border border-amber-200'
                }`}>
                  {current.statusBadge.label}
                </span>
              </div>
            </div>

            {/* Card 3: Save More */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-3 relative overflow-hidden flex flex-col justify-between">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-indigo-700 uppercase tracking-wider bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200">
                    Save More
                  </span>
                  <span className="font-mono text-xs font-bold text-indigo-700">
                    {formatCurrency(more.monthlySaving)}/m
                  </span>
                </div>

                <div className="pt-1">
                  <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-semibold">
                    Projected at {inputs.targetMonths}M:
                  </span>
                  <div className="text-xl font-bold font-mono text-indigo-900 tabular-nums">
                    {formatCurrency(more.projectedSavings)}
                  </div>
                </div>

                {/* Progress bar */}
                <div className="space-y-1">
                  <div className="flex justify-between text-[11px] text-slate-500">
                    <span>Progress</span>
                    <span className="font-mono font-bold text-indigo-600">{more.exactProgressPercent}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-indigo-600 rounded-full transition-all duration-300"
                      style={{ width: `${more.progressPercent}%` }}
                    />
                  </div>
                </div>

                <div className="space-y-1.5 text-xs pt-1 border-t border-slate-100">
                  <div className="flex justify-between text-slate-600">
                    <span className="text-slate-400">Total Deposit:</span>
                    <span className="font-mono">{formatCurrency(more.totalContribution)}</span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span className="text-slate-400">Est. Timeline:</span>
                    <span className="font-mono">{more.estimatedMonthsDisplay}</span>
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <span className={`block text-center py-1 px-2 rounded-lg text-[11px] font-semibold ${
                  more.statusBadge.variant === 'success'
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                    : 'bg-amber-50 text-amber-800 border border-amber-200'
                }`}>
                  {more.statusBadge.label}
                </span>
              </div>
            </div>
          </div>

          {/* Section: Visual Comparison Chart */}
          <WhatIfChart comparison={comparison} />

          {/* Section: AI Scenario Insight (Gemini-Powered) */}
          <div className="bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 rounded-2xl p-6 text-white shadow-lg space-y-4 border border-indigo-800/40">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-indigo-800/60 pb-3">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-indigo-600/30 text-indigo-300 border border-indigo-400/30">
                  <Sparkles className="w-4 h-4 text-amber-300" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">Gemini Scenario Intelligence</h3>
                  <p className="text-[11px] text-slate-400">
                    Consult Gemini AI to evaluate tradeoffs and sustainability
                  </p>
                </div>
              </div>

              <button
                onClick={handleGenerateAiInsight}
                disabled={isLoadingAi}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 active:scale-95 text-white font-semibold text-xs rounded-xl transition-all shadow-md flex items-center gap-1.5 disabled:opacity-50"
              >
                {isLoadingAi ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Analyzing Trade-offs...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>{aiInsight ? 'Re-analyze Scenarios' : 'Get Gemini Scenario Insight'}</span>
                  </>
                )}
              </button>
            </div>

            {/* Error banner if AI service fails */}
            {aiError && (
              <div className="p-3.5 rounded-xl bg-rose-950/60 border border-rose-800/50 text-rose-200 text-xs flex items-start gap-2.5">
                <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold block">Notice:</span>
                  <p className="mt-0.5 text-[11px] leading-relaxed">{aiError}</p>
                </div>
              </div>
            )}

            {/* Generated AI Insight Content */}
            {aiInsight ? (
              <div className="space-y-4 pt-1 animate-in fade-in duration-300">
                <div className="flex flex-wrap items-center gap-3">
                  <span className="text-xs text-slate-400">AI Recommended Strategy:</span>
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-xs font-bold font-mono">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    {aiInsight.recommendedScenario}
                  </span>
                </div>

                <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 text-xs space-y-2">
                  <p className="text-slate-200 leading-relaxed font-medium">
                    {aiInsight.reason}
                  </p>
                  <p className="text-slate-400 text-[11px] leading-relaxed">
                    <strong className="text-slate-300">Trade-off Insight: </strong>
                    {aiInsight.insight}
                  </p>
                </div>

                <div className="flex items-center gap-2 text-xs text-indigo-300 bg-indigo-950/50 p-3 rounded-xl border border-indigo-800/40">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>
                    <strong className="text-white">Recommended Action: </strong>
                    {aiInsight.action}
                  </span>
                </div>
              </div>
            ) : (
              !isLoadingAi && (
                <div className="text-xs text-slate-400 leading-relaxed pt-1">
                  Click <span className="text-white font-semibold">"Get Gemini Scenario Insight"</span> above to receive structured AI trade-off analysis comparing your three configured monthly saving tiers.
                </div>
              )
            )}
          </div>

          {/* Bottom Execution Card */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm flex flex-wrap items-center justify-between gap-4">
            <div className="space-y-0.5">
              <h4 className="text-sm font-bold text-slate-900">Apply Your Scenario</h4>
              <p className="text-xs text-slate-500">
                Ready to commit to this monthly target? Open a prototype plan or consult the AI Coach.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => onNavigate('coach')}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-xl transition-colors"
              >
                Go to AI Coach
              </button>
              <button
                onClick={() => {
                  if (onOpenCreatePlan) onOpenCreatePlan();
                  else onNavigate('plans');
                }}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white font-semibold text-xs rounded-xl transition-all shadow-sm"
              >
                Start Savings Plan
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
