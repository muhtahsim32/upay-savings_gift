import React, { useState } from 'react';
import { useSavings } from '../context/SavingsContext';
import { useAuth } from '../context/AuthContext';
import {
  TrendingUp,
  Plus,
  ArrowUpRight,
  Calendar,
  Award,
  Wallet,
  Clock,
  ArrowDownLeft,
  ChevronRight,
  ShieldCheck,
  CheckCircle,
  FileText,
  Filter,
  RefreshCw,
  Sparkles
} from 'lucide-react';
import { formatCurrency, formatCompactCurrency } from '../utils/calculator';
import { ActiveUserPlan } from '../types';

interface DashboardPageProps {
  onOpenCreatePlan: () => void;
  onOpenDeposit: (plan: ActiveUserPlan) => void;
  onNavigate: (tab: string) => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({
  onOpenCreatePlan,
  onOpenDeposit,
  onNavigate
}) => {
  const { user } = useAuth();
  const {
    activePlans,
    transactions,
    totalSavings,
    totalProfitEarned,
    activePlansCount,
    nextMaturity,
    toggleAutoDebit
  } = useSavings();

  const [txFilter, setTxFilter] = useState<'all' | 'deposit' | 'interest_credit'>('all');
  const [statementDownloaded, setStatementDownloaded] = useState(false);

  const filteredTransactions = transactions.filter(tx => {
    if (txFilter === 'all') return true;
    return tx.type === txFilter;
  });

  const handleDownloadStatement = () => {
    setStatementDownloaded(true);
    setTimeout(() => setStatementDownloaded(false), 2500);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Greeting & Quick Actions Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              Welcome back, {user?.name || 'Customer'}
            </h1>
            <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200/60">
              {user?.tier || 'Silver Saver'}
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Linked Wallet: <span className="font-mono">{user?.mobile}</span> · Auto-debit active
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={handleDownloadStatement}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 rounded-xl transition-colors shadow-sm"
          >
            <FileText className="w-3.5 h-3.5" />
            <span>{statementDownloaded ? 'Statement Exported (Demo)' : 'e-Statement'}</span>
          </button>

          <button
            onClick={onOpenCreatePlan}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 active:scale-95 rounded-xl transition-all shadow-sm"
          >
            <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>Open New Plan</span>
          </button>
        </div>
      </div>

      {/* 4 Required Key Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1: Total Savings */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span className="font-medium">Total Savings</span>
            <div className="p-1.5 rounded-lg bg-blue-50 text-blue-600">
              <Wallet className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold font-mono text-slate-900 tabular-nums">
            {formatCurrency(totalSavings)}
          </div>
          <div className="flex items-center gap-1 text-[11px] text-emerald-600 font-mono">
            <TrendingUp className="w-3 h-3" />
            <span>+{formatCurrency(totalProfitEarned)} total profit</span>
          </div>
        </div>

        {/* Metric 2: Active Plans */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span className="font-medium">Active Plans</span>
            <div className="p-1.5 rounded-lg bg-teal-50 text-teal-600">
              <Calendar className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold font-mono text-slate-900 tabular-nums">
            {activePlansCount}
          </div>
          <div className="text-[11px] text-slate-500">
            <span>DPS, Fixed-Term & Goals</span>
          </div>
        </div>

        {/* Metric 3: Next Maturity */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span className="font-medium">Next Maturity</span>
            <div className="p-1.5 rounded-lg bg-amber-50 text-amber-600">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          {nextMaturity ? (
            <>
              <div className="text-lg font-bold font-mono text-slate-900 tabular-nums truncate">
                {formatCurrency(nextMaturity.amount)}
              </div>
              <div className="text-[11px] text-slate-600 font-mono">
                {nextMaturity.date} · <span className="text-amber-700 font-semibold">{nextMaturity.daysRemaining}d left</span>
              </div>
            </>
          ) : (
            <>
              <div className="text-sm font-semibold text-slate-400">No active maturities</div>
              <div className="text-[11px] text-slate-400">Start a plan to begin</div>
            </>
          )}
        </div>

        {/* Metric 4: Reward Points */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span className="font-medium">Reward Points</span>
            <div className="p-1.5 rounded-lg bg-indigo-50 text-indigo-600">
              <Award className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold font-mono text-slate-900 tabular-nums">
            {user?.rewardPoints?.toLocaleString() || '1,850'}{' '}
            <span className="text-xs font-normal text-slate-500">pts</span>
          </div>
          <div className="text-[11px] text-indigo-700 font-medium">
            Next Milestone: 2,000 pts (Gold)
          </div>
        </div>
      </div>

      {/* Active Plans Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900 tracking-tight">Active Savings Portfolios</h2>
            <p className="text-xs text-slate-500">Monitor ongoing progress, scheduled debits, and profit accruals</p>
          </div>
          <button
            onClick={() => onNavigate('plans')}
            className="text-xs font-semibold text-blue-600 hover:text-blue-700 transition-colors flex items-center gap-1"
          >
            <span>Browse All Plans</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {activePlans.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mx-auto">
              <Sparkles className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900">No active plans yet</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Start your first monthly DPS, goal-based pot, or fixed deposit to build your savings habit.
            </p>
            <button
              onClick={onOpenCreatePlan}
              className="px-4 py-2 bg-blue-600 text-white font-semibold text-xs rounded-xl"
            >
              Start Plan Now
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {activePlans.map(plan => {
              const progressPercent = Math.min(
                100,
                Math.round(
                  plan.planType === 'fixed'
                    ? 100
                    : ((plan.completedInstallments || 1) / (plan.totalInstallments || 1)) * 100
                )
              );

              return (
                <div
                  key={plan.id}
                  className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between space-y-4"
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <span className="text-[10px] font-semibold text-blue-600 uppercase tracking-wider font-mono">
                          {plan.planTitle}
                        </span>
                        <h3 className="text-sm font-bold text-slate-900 mt-0.5 line-clamp-1">
                          {plan.goalName || plan.planTitle}
                        </h3>
                      </div>
                      <span className="text-xs font-mono font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200/60 shrink-0">
                        {plan.interestRate}% p.a.
                      </span>
                    </div>

                    {/* Progress Bar */}
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs text-slate-500">
                        <span>Balance:</span>
                        <span className="font-mono font-bold text-slate-900">
                          {formatCurrency(plan.currentBalance)}
                        </span>
                      </div>
                      <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                        <div
                          className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                          style={{ width: `${progressPercent}%` }}
                        />
                      </div>
                      <div className="flex justify-between text-[11px] text-slate-400 font-mono">
                        <span>
                          {plan.planType === 'fixed'
                            ? '100% Locked'
                            : `${plan.completedInstallments}/${plan.totalInstallments} paid`}
                        </span>
                        <span>Target: {formatCurrency(plan.targetAmount || 0)}</span>
                      </div>
                    </div>

                    {/* Accrued Profit and Details */}
                    <div className="pt-2 border-t border-slate-100 space-y-1.5 text-xs text-slate-600">
                      <div className="flex justify-between">
                        <span className="text-slate-400">Total Invested:</span>
                        <span className="font-mono font-medium text-slate-800">
                          {formatCurrency(plan.totalInvested)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Accrued Profit:</span>
                        <span className="font-mono font-semibold text-emerald-600">
                          +{formatCurrency(plan.profitEarned)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Maturity Date:</span>
                        <span className="font-mono text-slate-700">{plan.maturityDate}</span>
                      </div>
                    </div>
                  </div>

                  {/* Auto-Debit & Actions */}
                  <div className="pt-3 border-t border-slate-100 space-y-3">
                    {plan.planType !== 'fixed' && (
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-slate-500">Auto-Debit:</span>
                        <button
                          onClick={() => toggleAutoDebit(plan.id)}
                          className={`px-2 py-0.5 rounded text-[11px] font-medium transition-colors ${
                            plan.autoDebitEnabled
                              ? 'bg-blue-50 text-blue-700 hover:bg-blue-100'
                              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                          }`}
                        >
                          {plan.autoDebitEnabled ? 'Enabled (Active)' : 'Paused'}
                        </button>
                      </div>
                    )}

                    <div className="flex gap-2">
                      <button
                        onClick={() => onOpenDeposit(plan)}
                        className="flex-1 py-2 px-3 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white text-xs font-semibold rounded-xl transition-all shadow-sm flex items-center justify-center gap-1"
                      >
                        <ArrowUpRight className="w-3.5 h-3.5" />
                        <span>Deposit More</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Recent Savings Activity / Transactions Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden space-y-4 p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-base font-bold text-slate-900 tracking-tight">
              Recent Savings Ledger
            </h2>
            <p className="text-xs text-slate-500">All deposits, automated debits, and profit credits</p>
          </div>

          {/* Interactive filter tabs */}
          <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg self-start sm:self-auto">
            <button
              onClick={() => setTxFilter('all')}
              className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
                txFilter === 'all'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              All Records
            </button>
            <button
              onClick={() => setTxFilter('deposit')}
              className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
                txFilter === 'deposit'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Deposits
            </button>
            <button
              onClick={() => setTxFilter('interest_credit')}
              className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
                txFilter === 'interest_credit'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Profit Credits
            </button>
          </div>
        </div>

        {/* Clean data table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-200 text-slate-400 font-semibold uppercase tracking-wider text-[10px]">
                <th className="py-2.5 px-3">Plan / Description</th>
                <th className="py-2.5 px-3">Reference</th>
                <th className="py-2.5 px-3">Date</th>
                <th className="py-2.5 px-3">Type</th>
                <th className="py-2.5 px-3 text-right">Amount</th>
                <th className="py-2.5 px-3 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredTransactions.slice(0, 8).map(tx => {
                const isCredit = tx.type === 'interest_credit' || tx.type === 'bonus';
                return (
                  <tr key={tx.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3 px-3 font-medium text-slate-900 max-w-xs truncate">
                      {tx.planTitle}
                    </td>
                    <td className="py-3 px-3 font-mono text-slate-500 text-[11px]">
                      {tx.referenceNo}
                    </td>
                    <td className="py-3 px-3 text-slate-600 font-mono text-[11px]">
                      {tx.date}
                    </td>
                    <td className="py-3 px-3">
                      <span className="capitalize text-slate-600">
                        {tx.type.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right font-mono font-bold tabular-nums">
                      <span className={isCredit ? 'text-emerald-600' : 'text-blue-600'}>
                        {isCredit ? '+' : ''}{formatCurrency(tx.amount)}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right">
                      <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-700">
                        <CheckCircle className="w-3 h-3" />
                        Completed
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
