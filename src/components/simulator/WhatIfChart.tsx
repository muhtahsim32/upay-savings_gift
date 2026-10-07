import React from 'react';
import { Target, TrendingUp, CheckCircle2, AlertCircle } from 'lucide-react';
import { formatCurrency } from '../../utils/calculator';
import { WhatIfComparison } from '../../services/whatIfSimulator';

interface WhatIfChartProps {
  comparison: WhatIfComparison;
}

export const WhatIfChart: React.FC<WhatIfChartProps> = ({ comparison }) => {
  const { targetAmount, targetMonths, currentSavings } = comparison.inputs;
  const { current, more, less } = comparison.scenarios;

  // Find max value to calibrate bar scale (ensure target line and bars have breathing room)
  const maxProjected = Math.max(
    targetAmount,
    current.projectedSavings,
    more.projectedSavings,
    less.projectedSavings
  );
  const chartMax = Math.max(1000, maxProjected * 1.15);

  const getBarHeight = (value: number) => {
    return Math.min(100, Math.max(8, (value / chartMax) * 100));
  };

  const targetLinePosition = Math.min(100, Math.max(8, (targetAmount / chartMax) * 100));

  const items = [
    {
      data: less,
      title: 'Save Less',
      color: 'from-amber-400 to-amber-600',
      bgColor: 'bg-amber-500/20',
      borderColor: 'border-amber-300',
      textColor: 'text-amber-800'
    },
    {
      data: current,
      title: 'Current Plan',
      color: 'from-blue-500 to-blue-700',
      bgColor: 'bg-blue-500/20',
      borderColor: 'border-blue-400',
      textColor: 'text-blue-800'
    },
    {
      data: more,
      title: 'Save More',
      color: 'from-indigo-500 to-indigo-700',
      bgColor: 'bg-indigo-500/20',
      borderColor: 'border-indigo-400',
      textColor: 'text-indigo-800'
    }
  ];

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-3">
        <div>
          <h3 className="text-sm font-bold text-slate-900">Projected Accumulation Chart</h3>
          <p className="text-xs text-slate-500">
            Comparing total savings across scenarios at month {targetMonths} against target threshold
          </p>
        </div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-mono">
          <Target className="w-3.5 h-3.5 text-rose-500" />
          <span>Target: {formatCurrency(targetAmount)}</span>
        </div>
      </div>

      {/* Chart Canvas Area */}
      <div className="relative pt-8 pb-4">
        {/* Horizontal Target Reference Line */}
        <div
          className="absolute left-0 right-0 z-10 border-b-2 border-dashed border-rose-500/80 pointer-events-none transition-all duration-300"
          style={{ bottom: `${targetLinePosition}%` }}
        >
          <span className="absolute right-0 -top-6 bg-rose-50 text-rose-700 border border-rose-200 px-2 py-0.5 rounded text-[10px] font-mono font-bold shadow-sm">
            Target Goal Line ({formatCurrency(targetAmount)})
          </span>
        </div>

        {/* 3 Scenario Vertical Bars */}
        <div className="h-64 flex items-end justify-around gap-4 sm:gap-8 px-2 sm:px-6">
          {items.map(({ data, title, color, bgColor, borderColor, textColor }) => {
            const heightPercent = getBarHeight(data.projectedSavings);
            const isExceeded = data.projectedSavings >= targetAmount;

            return (
              <div key={data.id} className="flex-1 flex flex-col items-center h-full justify-end group">
                {/* Metric pill above bar */}
                <div className="text-center mb-2 space-y-0.5">
                  <span className="text-[11px] sm:text-xs font-mono font-bold text-slate-900 block tabular-nums">
                    {formatCurrency(data.projectedSavings)}
                  </span>
                  <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded ${
                    isExceeded ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                  }`}>
                    {data.exactProgressPercent}%
                  </span>
                </div>

                {/* Animated Column Bar */}
                <div className="w-full max-w-[80px] h-full flex items-end">
                  <div
                    className={`w-full rounded-t-xl bg-gradient-to-t ${color} transition-all duration-500 shadow-md relative group-hover:brightness-110 flex flex-col justify-end overflow-hidden`}
                    style={{ height: `${heightPercent}%` }}
                  >
                    {/* Visual segment indicating initial accumulated base */}
                    {currentSavings > 0 && (
                      <div
                        className="w-full bg-white/20 border-t border-white/30 text-[9px] text-white/90 text-center py-0.5 font-mono"
                        style={{
                          height: `${Math.min(100, Math.max(15, (currentSavings / data.projectedSavings) * 100))}%`
                        }}
                        title={`Initial savings: ${formatCurrency(currentSavings)}`}
                      >
                        <span className="hidden sm:inline">Base</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Label under bar */}
                <div className="text-center mt-3 space-y-0.5">
                  <span className="text-xs font-bold text-slate-800 block">{title}</span>
                  <span className="text-[11px] font-mono text-slate-500 block">
                    {formatCurrency(data.monthlySaving)}/mo
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Legend & Summary Footer */}
      <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between text-xs text-slate-500 gap-3">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-full bg-blue-600" />
            <span>Monthly Contributions</span>
          </div>
          {currentSavings > 0 && (
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-full bg-slate-300" />
              <span>Base (৳{currentSavings.toLocaleString()})</span>
            </div>
          )}
          <div className="flex items-center gap-1.5">
            <div className="w-4 h-0.5 border-b-2 border-dashed border-rose-500" />
            <span>Goal Target Line</span>
          </div>
        </div>
        <div className="text-[11px] text-slate-400 italic">
          Calculated for {targetMonths} months horizon
        </div>
      </div>
    </div>
  );
};
