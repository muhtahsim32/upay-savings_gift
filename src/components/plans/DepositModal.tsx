import React, { useState } from 'react';
import { X, CheckCircle, Wallet, ArrowUpRight } from 'lucide-react';
import { ActiveUserPlan } from '../../types';
import { useSavings } from '../../context/SavingsContext';
import { useAuth } from '../../context/AuthContext';
import { formatCurrency } from '../../utils/calculator';

interface DepositModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedPlan: ActiveUserPlan | null;
}

export const DepositModal: React.FC<DepositModalProps> = ({ isOpen, onClose, selectedPlan }) => {
  const { depositToPlan } = useSavings();
  const { user } = useAuth();

  const [amount, setAmount] = useState(2000);
  const [isSuccess, setIsSuccess] = useState(false);

  React.useEffect(() => {
    if (selectedPlan) {
      setAmount(selectedPlan.installmentAmount || 2000);
      setIsSuccess(false);
    }
  }, [selectedPlan, isOpen]);

  if (!isOpen || !selectedPlan) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const success = depositToPlan(selectedPlan.id, amount);
    if (success) {
      setIsSuccess(true);
      setTimeout(() => {
        setIsSuccess(false);
        onClose();
      }, 1200);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/70">
          <div>
            <h3 className="text-base font-semibold text-slate-900">Deposit to Savings</h3>
            <p className="text-xs text-slate-500">Fast wallet debit · Instant demo accrual</p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-200/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {isSuccess ? (
          <div className="p-8 text-center flex flex-col items-center justify-center">
            <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mb-3">
              <CheckCircle className="w-7 h-7" />
            </div>
            <h4 className="text-base font-bold text-slate-900">Deposit Successful!</h4>
            <p className="text-xs text-slate-600 mt-1">
              {formatCurrency(amount)} credited to {selectedPlan.goalName || selectedPlan.planTitle}.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            {/* Target Plan Summary */}
            <div className="p-3 bg-blue-50/70 rounded-xl border border-blue-100 text-xs">
              <span className="text-blue-600 font-semibold uppercase tracking-wider text-[10px] block">
                Target Savings Plan
              </span>
              <p className="font-semibold text-slate-900 mt-0.5">
                {selectedPlan.goalName || selectedPlan.planTitle}
              </p>
              <div className="flex justify-between items-center mt-2 text-slate-600">
                <span>Current Balance:</span>
                <span className="font-mono font-semibold text-slate-900">
                  {formatCurrency(selectedPlan.currentBalance)}
                </span>
              </div>
            </div>

            {/* Source Wallet Info */}
            <div className="flex items-center justify-between p-3 rounded-lg border border-slate-200 bg-slate-50/50 text-xs">
              <div className="flex items-center gap-2">
                <Wallet className="w-4 h-4 text-blue-600" />
                <span className="text-slate-700">upay Wallet Balance:</span>
              </div>
              <span className="font-mono font-bold text-slate-900">
                {formatCurrency(user?.walletBalance || 34500)}
              </span>
            </div>

            {/* Deposit Amount */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Deposit Amount
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-bold">
                  ৳
                </span>
                <input
                  type="number"
                  min="500"
                  step="500"
                  value={amount}
                  onChange={e => setAmount(Number(e.target.value))}
                  className="w-full pl-8 pr-3.5 py-2 text-base font-mono font-semibold text-slate-900 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 tabular-nums"
                  required
                />
              </div>

              <div className="flex items-center gap-1.5 mt-2">
                {[1000, 2000, 5000, 10000].map(val => (
                  <button
                    key={val}
                    type="button"
                    onClick={() => setAmount(val)}
                    className="flex-1 py-1 text-xs font-mono rounded border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 transition-colors"
                  >
                    +{val >= 1000 ? `${val / 1000}k` : val}
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-700 active:scale-[0.99] text-white font-semibold rounded-xl text-sm transition-all shadow-sm flex items-center justify-center gap-2"
              >
                <span>Confirm Demo Deposit</span>
                <ArrowUpRight className="w-4 h-4" />
              </button>
              <p className="text-[11px] text-slate-400 text-center mt-2">
                No real balance is deducted. Simulated transaction.
              </p>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
