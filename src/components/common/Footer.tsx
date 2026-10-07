import React from 'react';
import { ShieldCheck, Lock, Landmark, HeartHandshake } from 'lucide-react';

interface FooterProps {
  onNavigate: (tab: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="bg-slate-900 text-slate-400 text-sm border-t border-slate-800">
      {/* Proof & Reliability Bar */}
      <div className="border-b border-slate-800/80 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-slate-800 text-blue-400 shrink-0">
                <Landmark className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-white font-medium text-xs">Scheduled Banks Trust</h4>
                <p className="text-xs text-slate-400 mt-0.5">Partnered with regulated partner banks for client funds protection</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-slate-800 text-blue-400 shrink-0">
                <Lock className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-white font-medium text-xs">256-bit Encryption</h4>
                <p className="text-xs text-slate-400 mt-0.5">Simulated financial-grade transaction integrity & tokenization</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-slate-800 text-blue-400 shrink-0">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-white font-medium text-xs">Instant Liquidity</h4>
                <p className="text-xs text-slate-400 mt-0.5">Withdraw funds back to your wallet without physical bank visits</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-slate-800 text-blue-400 shrink-0">
                <HeartHandshake className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-white font-medium text-xs">Transparent Yields</h4>
                <p className="text-xs text-slate-400 mt-0.5">Clear illustrative savings returns with a transparent fee concept</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold text-sm">
                u
              </div>
              <span className="text-lg font-bold text-white tracking-tight">upay Savings</span>
            </div>
            <p className="text-xs text-slate-400 max-w-sm leading-relaxed">
              Empowering individuals and households with automated micro-savings, high-return fixed term deposits, and goal-oriented wealth building.
            </p>
            <div className="pt-2 text-[11px] text-amber-400/90 bg-amber-950/40 p-3 rounded-lg border border-amber-800/40 leading-relaxed">
              <strong>Notice:</strong> This is a frontend prototype project created for presentation and interface design demonstration. It is not an official United Commercial Bank PLC / upay product and does not handle real currency.
            </div>
          </div>

          <div>
            <h5 className="text-white text-xs font-semibold uppercase tracking-wider mb-3">Savings Products</h5>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={() => onNavigate('plans')} className="hover:text-white transition-colors">
                  Monthly Savings (DPS)
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('plans')} className="hover:text-white transition-colors">
                  Yearly Wealth Builder
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('plans')} className="hover:text-white transition-colors">
                  Goal-Based Micro-Savings
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('plans')} className="hover:text-white transition-colors">
                  Fixed-Term Deposit (FDR)
                </button>
              </li>
            </ul>
          </div>

          <div>
            <h5 className="text-white text-xs font-semibold uppercase tracking-wider mb-3">Prototype Navigation</h5>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={() => onNavigate('landing')} className="hover:text-white transition-colors">
                  Home Overview
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('dashboard')} className="hover:text-white transition-colors">
                  Customer Dashboard
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('plans')} className="hover:text-white transition-colors">
                  Interactive Calculator
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('profile')} className="hover:text-white transition-colors">
                  User Profile & Nominee
                </button>
              </li>
            </ul>
          </div>

          <div>
            <h5 className="text-white text-xs font-semibold uppercase tracking-wider mb-3">Support & Legal</h5>
            <ul className="space-y-2 text-xs">
              <li className="text-slate-500">Helpline: 16268 (Mock)</li>
              <li className="text-slate-500">Email: demo@upay-savings.concept</li>
              <li className="text-slate-500">Terms of Demonstration</li>
              <li className="text-slate-500">Privacy Concept</li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© 2026 upay Savings Concept Prototype. Phase 1 UI Demonstration.</p>
          <div className="flex items-center gap-4 text-xs">
            <span>Mock Auth Active</span>
            <span>·</span>
            <span>Local State Only</span>
            <span>·</span>
            <span>No Real Banking</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
