import React, { useState } from 'react';
import {
  Sparkles,
  Bot,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Target,
  ArrowRight,
  RefreshCw,
  Wallet,
  ShieldCheck,
  ShieldAlert,
  Lightbulb,
  CheckCircle,
  HelpCircle,
  ChevronRight,
  Info
} from 'lucide-react';
import { formatCurrency } from '../utils/calculator';
import {
  SavingsCoachInput,
  SavingsCoachAnalysis,
  DeterministicMetrics,
  calculateDeterministicMetrics,
  analyzeSavingsPlan
} from '../services/aiSavingsCoach';

interface AiSavingsCoachPageProps {
  onNavigate: (tab: string) => void;
  onOpenCreatePlan?: () => void;
}

// Preset demonstration configurations requested in specification
const DEMO_PRESETS = [
  {
    id: 'example-a',
    label: 'Example A: Emergency Fund',
    subtitle: '৳30k Income · 10 Mos Target',
    data: {
      monthlyIncome: 30000,
      monthlyEssentialExpenses: 22000,
      currentSavings: 5000,
      monthlySaving: 5000,
      goalName: 'Emergency Fund',
      targetAmount: 50000,
      targetMonths: 10
    }
  },
  {
    id: 'example-b',
    label: 'Example B: Higher Education',
    subtitle: '৳50k Income · 12 Mos Target',
    data: {
      monthlyIncome: 50000,
      monthlyEssentialExpenses: 30000,
      currentSavings: 10000,
      monthlySaving: 10000,
      goalName: 'Higher Education',
      targetAmount: 120000,
      targetMonths: 12
    }
  },
  {
    id: 'example-c',
    label: 'Example C: High Aspiration',
    subtitle: '৳40k Income · Stretched Timeline',
    data: {
      monthlyIncome: 40000,
      monthlyEssentialExpenses: 32000,
      currentSavings: 15000,
      monthlySaving: 6000,
      goalName: 'New Tech Setup & Gear',
      targetAmount: 150000,
      targetMonths: 12
    }
  }
];

const GOAL_SUGGESTIONS = [
  'Emergency Fund',
  'Higher Education',
  'Home Downpayment',
  'Family Hajj / Umrah',
  'Freelance Workstation',
  'Medical Cushion'
];

export const AiSavingsCoachPage: React.FC<AiSavingsCoachPageProps> = ({
  onNavigate,
  onOpenCreatePlan
}) => {
  // Form State
  const [inputs, setInputs] = useState<SavingsCoachInput>({
    monthlyIncome: 30000,
    monthlyEssentialExpenses: 22000,
    currentSavings: 5000,
    monthlySaving: 5000,
    goalName: 'Emergency Fund',
    targetAmount: 50000,
    targetMonths: 10
  });

  // Local calculation & analysis state
  const [analysis, setAnalysis] = useState<SavingsCoachAnalysis | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Real-time deterministic calculation based on current inputs
  const deterministic: DeterministicMetrics = calculateDeterministicMetrics(inputs);

  const handleInputChange = (field: keyof SavingsCoachInput, value: string | number) => {
    setInputs(prev => ({
      ...prev,
      [field]: typeof value === 'number' ? value : value
    }));
  };

  const handleLoadPreset = (presetData: SavingsCoachInput) => {
    setInputs({ ...presetData });
    setAnalysis(null);
    setErrorMessage(null);
  };

  const handleRunAnalysis = async () => {
    if (!deterministic.isValidInput) {
      setErrorMessage(deterministic.validationError || 'Please provide valid financial figures.');
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);

    try {
      const result = await analyzeSavingsPlan(inputs, deterministic);
      setAnalysis(result);
    } catch (err: any) {
      console.error('AI Coach analysis failed:', err);
      setErrorMessage(
        err.message || 'Unable to connect to the Gemini AI service. Please verify your connection and try again.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Status Badge Helper
  const renderStatusBadge = (status: SavingsCoachAnalysis['status']) => {
    switch (status) {
      case 'achievable':
        return (
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300 font-bold text-xs uppercase tracking-wider">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Achievable Goal</span>
          </div>
        );
      case 'challenging':
        return (
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-800 border border-amber-300 font-bold text-xs uppercase tracking-wider">
            <AlertTriangle className="w-4 h-4 text-amber-600" />
            <span>Challenging Timeline</span>
          </div>
        );
      case 'unrealistic':
        return (
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-100 text-rose-800 border border-rose-300 font-bold text-xs uppercase tracking-wider">
            <ShieldAlert className="w-4 h-4 text-rose-600" />
            <span>Unrealistic Parameters</span>
          </div>
        );
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10 pb-24">
      {/* Top Banner & Header */}
      <div className="space-y-4">
        <div className="flex flex-wrap items-center gap-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-100/80 text-indigo-800 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
            <span>Powered by Gemini AI</span>
          </div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-100/70 text-blue-800 text-xs font-medium">
            <Bot className="w-3.5 h-3.5 text-blue-600" />
            <span>AI-generated educational guidance</span>
          </div>
        </div>

        <div className="max-w-3xl">
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900">
            Gemini AI Savings Coach
          </h1>
          <p className="text-sm sm:text-base text-slate-600 mt-2 leading-relaxed font-medium">
            Analyze your savings capacity and get personalized educational guidance.
          </p>
        </div>

        {/* Educational Prototype Disclaimer Callout */}
        <div className="p-3.5 bg-amber-500/10 border border-amber-500/30 rounded-xl text-xs text-amber-950 flex items-start gap-2.5">
          <Info className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            <span className="font-semibold uppercase tracking-wider text-[10px] mr-1">Prototype Notice:</span>
            This prototype does not execute real financial transactions. AI suggestions are generated by Google Gemini for educational demonstration and planning guidance only, and do not constitute financial advice.
          </p>
        </div>
      </div>

      {/* Preset Quick Load Row */}
      <div className="space-y-2">
        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">
          Select or Benchmark with Demo Scenarios:
        </span>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {DEMO_PRESETS.map(preset => (
            <button
              key={preset.id}
              onClick={() => handleLoadPreset(preset.data)}
              className="p-3.5 rounded-xl border border-slate-200 bg-white hover:border-blue-400 hover:bg-blue-50/40 text-left transition-all shadow-sm group"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-900 group-hover:text-blue-700">
                  {preset.label}
                </span>
                <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-0.5 group-hover:text-blue-600 transition-transform" />
              </div>
              <p className="text-[11px] text-slate-500 mt-1 font-mono">{preset.subtitle}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Main Grid: Inputs Column & Results Column */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Input Form (5 cols) */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-6">
          <div className="border-b border-slate-100 pb-3">
            <h2 className="text-base font-bold text-slate-900">Your Financial Baseline</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Input income and target figures in Bangladeshi Taka (BDT)
            </p>
          </div>

          <div className="space-y-4">
            {/* Monthly Income */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Monthly Income (BDT)
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-mono text-xs">
                  ৳
                </span>
                <input
                  type="number"
                  min="1000"
                  step="1000"
                  value={inputs.monthlyIncome}
                  onChange={e => handleInputChange('monthlyIncome', Number(e.target.value))}
                  className="w-full pl-8 pr-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 font-mono"
                  placeholder="e.g. 30000"
                />
              </div>
            </div>

            {/* Essential Expenses */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Essential Monthly Expenses (BDT)
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-mono text-xs">
                  ৳
                </span>
                <input
                  type="number"
                  min="0"
                  step="500"
                  value={inputs.monthlyEssentialExpenses}
                  onChange={e => handleInputChange('monthlyEssentialExpenses', Number(e.target.value))}
                  className="w-full pl-8 pr-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 font-mono"
                  placeholder="Rent, food, utilities, loan"
                />
              </div>
              <div className="flex justify-between items-center mt-1 text-[11px]">
                <span className="text-slate-500">Calculated Disposable Surplus:</span>
                <span
                  className={`font-mono font-bold ${
                    deterministic.availableMonthlyAmount < 0
                      ? 'text-rose-600'
                      : 'text-emerald-700'
                  }`}
                >
                  {formatCurrency(deterministic.availableMonthlyAmount)}
                </span>
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

            {/* Planned Monthly Saving */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Planned Monthly Saving (BDT)
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-mono text-xs">
                  ৳
                </span>
                <input
                  type="number"
                  min="100"
                  step="500"
                  value={inputs.monthlySaving}
                  onChange={e => handleInputChange('monthlySaving', Number(e.target.value))}
                  className="w-full pl-8 pr-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 font-mono"
                  placeholder="e.g. 5000"
                />
              </div>
              {deterministic.isSavingOverAvailable && (
                <p className="text-[11px] text-amber-700 mt-1 flex items-center gap-1 font-medium">
                  <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                  Planned saving exceeds disposable surplus ({formatCurrency(deterministic.availableMonthlyAmount)}).
                </p>
              )}
            </div>

            {/* Goal Title */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Savings Goal Title
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

            {/* Target Amount */}
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
                  min="500"
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
                {[6, 10, 12, 24, 36].map(m => (
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
          </div>

          {/* Primary Action Button */}
          <button
            onClick={handleRunAnalysis}
            disabled={isLoading || !deterministic.isValidInput}
            className="w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 active:scale-[0.99] text-white font-semibold text-sm rounded-xl transition-all shadow-md shadow-blue-500/20 flex items-center justify-center gap-2 disabled:opacity-50 disabled:pointer-events-none"
          >
            {isLoading ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Consulting Gemini AI Coach...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Analyze My Savings Plan</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>

        {/* Right Column: AI & Deterministic Results (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Error Banner with Retry */}
          {errorMessage && (
            <div className="p-5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-900 space-y-3 shadow-sm">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                <div>
                  <h3 className="text-sm font-bold text-rose-900">Analysis Notice</h3>
                  <p className="text-xs text-rose-700 mt-1 leading-relaxed">{errorMessage}</p>
                </div>
              </div>
              <button
                onClick={handleRunAnalysis}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white font-semibold text-xs rounded-lg transition-colors flex items-center gap-1.5"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Retry Analysis</span>
              </button>
            </div>
          )}

          {/* Loading State Animation */}
          {isLoading && (
            <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm text-center space-y-4 animate-pulse">
              <div className="w-14 h-14 rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center mx-auto shadow-inner">
                <Bot className="w-8 h-8 animate-bounce" />
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-bold text-slate-900">
                  Gemini AI Coach is Analyzing Your Plan...
                </h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  Synthesizing your ৳{inputs.monthlyIncome.toLocaleString()} monthly income, ৳{inputs.monthlySaving.toLocaleString()} savings rate, and Bangladesh inflation context.
                </p>
              </div>
              <div className="max-w-xs mx-auto space-y-2 pt-2">
                <div className="flex items-center gap-2 text-xs text-slate-600 justify-center">
                  <div className="w-2 h-2 rounded-full bg-blue-500 animate-ping" />
                  <span>Checking disposable surplus ratios</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-600 justify-center">
                  <div className="w-2 h-2 rounded-full bg-indigo-500 animate-ping" />
                  <span>Structuring conservative action plan</span>
                </div>
              </div>
            </div>
          )}

          {/* Prompt to run if not loaded yet */}
          {!analysis && !isLoading && !errorMessage && (
            <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm space-y-6 text-center">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-blue-100 to-indigo-100 text-blue-600 flex items-center justify-center mx-auto border border-blue-200/50">
                <Sparkles className="w-8 h-8 text-blue-600" />
              </div>
              <div className="space-y-2 max-w-md mx-auto">
                <h3 className="text-lg font-bold text-slate-900">
                  Ready to test "{inputs.goalName}"?
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Click <span className="font-semibold text-slate-800">"Analyze My Savings Plan"</span> on the left to invoke Gemini AI for a feasibility assessment, structured action steps, and daily money-saving tips.
                </p>
              </div>

              {/* Instant Math Preview Card */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-left space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-700">Deterministic Math Preview:</span>
                  <span className="text-[11px] font-mono text-slate-500">Local TypeScript Engine</span>
                </div>
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="bg-white p-2.5 rounded-lg border border-slate-200">
                    <span className="text-slate-400 block text-[10px]">Projected at {inputs.targetMonths}M:</span>
                    <span className="font-mono font-bold text-slate-900 text-sm">
                      {formatCurrency(deterministic.projectedSavings)}
                    </span>
                  </div>
                  <div className="bg-white p-2.5 rounded-lg border border-slate-200">
                    <span className="text-slate-400 block text-[10px]">Current Goal Gap:</span>
                    <span className="font-mono font-bold text-slate-900 text-sm">
                      {formatCurrency(deterministic.goalGap)}
                    </span>
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <button
                  onClick={handleRunAnalysis}
                  className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-xl shadow transition-all"
                >
                  Run Gemini AI Evaluation
                </button>
              </div>
            </div>
          )}

          {/* AI Analysis Result Cards */}
          {analysis && !isLoading && (
            <div className="space-y-6 animate-in fade-in duration-300">
              {/* Card 1: Feasibility Status & Executive Summary */}
              <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-3">
                  <div>
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                      STATUS
                    </span>
                    <h2 className="text-lg font-bold text-slate-900 mt-0.5">
                      {inputs.goalName}
                    </h2>
                  </div>
                  {renderStatusBadge(analysis.status)}
                </div>

                {/* Highlight Recommended Monthly Saving */}
                <div className="p-4 rounded-xl bg-blue-50/70 border border-blue-200 flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <span className="text-[11px] font-bold text-blue-700 uppercase tracking-wider block">
                      Recommended Monthly Saving
                    </span>
                    <div className="text-2xl font-extrabold font-mono text-blue-900 mt-0.5">
                      {formatCurrency(analysis.recommendedMonthlySaving)}
                      <span className="text-xs font-normal text-blue-600 font-sans ml-1">/ month</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-[11px] text-slate-500 block">Planned Deposit:</span>
                    <span className="text-sm font-semibold font-mono text-slate-700">
                      {formatCurrency(inputs.monthlySaving)}/month
                    </span>
                  </div>
                </div>

                {/* Why Section */}
                <div className="space-y-1">
                  <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                    Why
                  </span>
                  <p className="text-sm text-slate-700 leading-relaxed font-medium">
                    {analysis.summary}
                  </p>
                </div>

                {/* Warning callout if present */}
                {(analysis.warning || deterministic.isSavingOverAvailable) && (
                  <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 flex items-start gap-2.5 text-xs">
                    <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold uppercase tracking-wider text-[11px] block text-amber-950">
                        Warning
                      </span>
                      <p className="mt-0.5 leading-relaxed">
                        {analysis.warning ||
                          `Your planned monthly saving of ${formatCurrency(
                            inputs.monthlySaving
                          )} exceeds your disposable monthly surplus of ${formatCurrency(
                            deterministic.availableMonthlyAmount
                          )}. Consider adjusting discretionary expenditures.`}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Card 2: Deterministic Financial Metrics Grid (6 tiles) */}
              <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <h3 className="text-sm font-bold text-slate-900">Deterministic Milestone Breakdown</h3>
                  <span className="text-[11px] font-mono text-slate-400">TypeScript Calculations</span>
                </div>

                {/* Visual Progress Bar */}
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-600 font-medium">Accumulated Goal Progress</span>
                    <span className="font-mono font-bold text-blue-600">
                      {deterministic.goalProgress}%
                    </span>
                  </div>
                  <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-blue-600 rounded-full transition-all duration-500"
                      style={{ width: `${Math.min(100, deterministic.goalProgress)}%` }}
                    />
                  </div>
                </div>

                {/* 6 Metric Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80">
                    <span className="text-[10px] text-slate-500 uppercase tracking-wider block font-semibold">
                      Monthly Surplus
                    </span>
                    <span className="text-base font-bold font-mono text-slate-900 tabular-nums">
                      {formatCurrency(deterministic.availableMonthlyAmount)}
                    </span>
                    <span className="text-[10px] text-slate-400 block mt-0.5">Income – Expenses</span>
                  </div>

                  <div className="p-3 rounded-xl bg-blue-50/60 border border-blue-200">
                    <span className="text-[10px] text-blue-700 uppercase tracking-wider block font-semibold">
                      AI Recommended
                    </span>
                    <span className="text-base font-bold font-mono text-blue-700 tabular-nums">
                      {formatCurrency(analysis.recommendedMonthlySaving)}
                    </span>
                    <span className="text-[10px] text-blue-600 block mt-0.5">Optimal monthly</span>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80">
                    <span className="text-[10px] text-slate-500 uppercase tracking-wider block font-semibold">
                      Est. Completion
                    </span>
                    <span className="text-sm font-bold font-mono text-slate-900 truncate block">
                      {deterministic.estimatedMonthsDisplay}
                    </span>
                    <span className="text-[10px] text-slate-400 block mt-0.5">At planned rate</span>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80">
                    <span className="text-[10px] text-slate-500 uppercase tracking-wider block font-semibold">
                      Projected Total
                    </span>
                    <span className="text-base font-bold font-mono text-emerald-700 tabular-nums">
                      {formatCurrency(deterministic.projectedSavings)}
                    </span>
                    <span className="text-[10px] text-slate-400 block mt-0.5">After {inputs.targetMonths}M</span>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80">
                    <span className="text-[10px] text-slate-500 uppercase tracking-wider block font-semibold">
                      Remaining Gap
                    </span>
                    <span className="text-base font-bold font-mono text-slate-900 tabular-nums">
                      {deterministic.goalGap > 0
                        ? formatCurrency(deterministic.goalGap)
                        : 'Fully Covered!'}
                    </span>
                    <span className="text-[10px] text-slate-400 block mt-0.5">To target</span>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80">
                    <span className="text-[10px] text-slate-500 uppercase tracking-wider block font-semibold">
                      Target Amount
                    </span>
                    <span className="text-base font-bold font-mono text-slate-900 tabular-nums">
                      {formatCurrency(inputs.targetAmount)}
                    </span>
                    <span className="text-[10px] text-slate-400 block mt-0.5">In {inputs.targetMonths} Months</span>
                  </div>
                </div>
              </div>

              {/* Card 3: AI Strategy & Roadmap */}
              <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
                <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
                  <TrendingUp className="w-4 h-4 text-blue-600" />
                  <span>AI Savings Strategy</span>
                </div>
                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed bg-blue-50/40 p-4 rounded-xl border border-blue-100">
                  {analysis.strategy}
                </p>

                {/* Sequential Action Plan */}
                <div className="space-y-3 pt-2">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-blue-600" />
                    <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                      Action Plan
                    </h4>
                  </div>
                  <div className="space-y-2">
                    {analysis.actionPlan.map((step, idx) => (
                      <div
                        key={idx}
                        className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs"
                      >
                        <div className="w-5 h-5 rounded-full bg-blue-600 text-white font-bold text-[11px] flex items-center justify-center shrink-0 mt-0.5">
                          {idx + 1}
                        </div>
                        <p className="text-slate-800 leading-relaxed">{step}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Smart Saving Tips */}
                <div className="space-y-3 pt-2 border-t border-slate-100">
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-900 uppercase tracking-wider">
                    <Lightbulb className="w-4 h-4 text-amber-500" />
                    <span>Tips</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                    {analysis.tips.map((tip, idx) => (
                      <div
                        key={idx}
                        className="p-3 rounded-xl bg-amber-50/50 border border-amber-200/60 text-xs text-slate-700 space-y-1"
                      >
                        <span className="font-semibold text-amber-900 block text-[11px]">
                          Tip #{idx + 1}
                        </span>
                        <p className="text-[11px] leading-relaxed">{tip}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Footer Action Card */}
              <div className="bg-slate-900 rounded-2xl p-6 text-white flex flex-wrap items-center justify-between gap-4">
                <div className="space-y-1">
                  <h4 className="text-sm font-bold text-white">Execute This Plan in Prototype</h4>
                  <p className="text-xs text-slate-400">
                    Open a goal-based or monthly savings scheme modeled on this recommendation.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onNavigate('simulator')}
                    className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 active:scale-95 text-white font-semibold text-xs rounded-xl transition-all shadow"
                  >
                    What-If Simulator
                  </button>
                  <button
                    onClick={() => {
                      if (onOpenCreatePlan) onOpenCreatePlan();
                      else onNavigate('plans');
                    }}
                    className="px-4 py-2.5 bg-blue-600 hover:bg-blue-500 active:scale-95 text-white font-semibold text-xs rounded-xl transition-all shadow"
                  >
                    Start Savings Plan
                  </button>
                  <button
                    onClick={() => {
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs rounded-xl transition-all"
                  >
                    Adjust Inputs
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
