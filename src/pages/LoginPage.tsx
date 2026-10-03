import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { ShieldCheck, UserCheck, Smartphone, KeyRound, ArrowRight, Sparkles, CheckCircle2 } from 'lucide-react';
import { DEMO_USERS } from '../data/mockData';

interface LoginPageProps {
  onSuccess: () => void;
  onNavigate: (tab: string) => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onSuccess, onNavigate }) => {
  const { loginAsDemo, loginCustom } = useAuth();
  const [mobile, setMobile] = useState('+880 1712-345678');
  const [pin, setPin] = useState('1234');
  const [loginMode, setLoginMode] = useState<'quick' | 'manual'>('quick');

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loginCustom(mobile, pin);
    onSuccess();
  };

  const handleDemoSelect = (key: 'rahim' | 'sadia') => {
    loginAsDemo(key);
    onSuccess();
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-6">
        {/* Brand header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-blue-600 text-white font-bold text-2xl shadow-md">
            u
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Sign in to upay Savings
          </h1>
          <p className="text-xs text-slate-500">
            Phase 1 Frontend Prototype · Mock Authentication
          </p>
        </div>

        {/* Demo Mode Notice */}
        <div className="p-3.5 bg-blue-50/80 border border-blue-100 rounded-xl text-xs text-blue-900 flex items-start gap-2.5">
          <Sparkles className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <span className="font-semibold block">Instant Demo Access:</span>
            <p className="text-blue-700 leading-relaxed text-[11px]">
              No real OTP or password verification is performed. Select a pre-loaded demo persona below or sign in with any mock phone number.
            </p>
          </div>
        </div>

        {/* Card Container */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-6">
          {/* Segmented Switcher */}
          <div className="flex p-1 bg-slate-100 rounded-xl">
            <button
              onClick={() => setLoginMode('quick')}
              className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                loginMode === 'quick'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              1-Click Demo Profiles
            </button>
            <button
              onClick={() => setLoginMode('manual')}
              className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                loginMode === 'manual'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Custom Phone & PIN
            </button>
          </div>

          {loginMode === 'quick' ? (
            <div className="space-y-3">
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider">
                Select a Test Profile:
              </label>

              {/* Demo Account 1 */}
              <button
                onClick={() => handleDemoSelect('rahim')}
                className="w-full p-4 rounded-xl border border-slate-200 hover:border-blue-500 hover:bg-blue-50/50 text-left transition-all group flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-700 font-bold flex items-center justify-center shrink-0">
                    RA
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 group-hover:text-blue-600">
                      {DEMO_USERS.rahim.name}
                    </h3>
                    <p className="text-xs text-slate-500 font-mono">
                      {DEMO_USERS.rahim.mobile}
                    </p>
                    <div className="flex items-center gap-2 mt-1 text-[11px] text-slate-600">
                      <span>3 Active Plans</span>
                      <span>·</span>
                      <span className="font-mono text-emerald-600 font-medium">৳185.4k Saved</span>
                    </div>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
              </button>

              {/* Demo Account 2 */}
              <button
                onClick={() => handleDemoSelect('sadia')}
                className="w-full p-4 rounded-xl border border-slate-200 hover:border-teal-500 hover:bg-teal-50/50 text-left transition-all group flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-teal-100 text-teal-700 font-bold flex items-center justify-center shrink-0">
                    SR
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 group-hover:text-teal-600">
                      {DEMO_USERS.sadia.name}
                    </h3>
                    <p className="text-xs text-slate-500 font-mono">
                      {DEMO_USERS.sadia.mobile}
                    </p>
                    <div className="flex items-center gap-2 mt-1 text-[11px] text-slate-600">
                      <span>Student Saver</span>
                      <span>·</span>
                      <span className="font-mono text-teal-600 font-medium">৳24.5k Saved</span>
                    </div>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-teal-600 group-hover:translate-x-1 transition-all" />
              </button>
            </div>
          ) : (
            <form onSubmit={handleManualSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                  upay Mobile Number
                </label>
                <div className="relative">
                  <Smartphone className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={mobile}
                    onChange={e => setMobile(e.target.value)}
                    placeholder="+880 17XX-XXXXXX"
                    className="w-full pl-9 pr-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 font-mono"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                  4-Digit Wallet PIN
                </label>
                <div className="relative">
                  <KeyRound className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    maxLength={4}
                    value={pin}
                    onChange={e => setPin(e.target.value)}
                    placeholder="••••"
                    className="w-full pl-9 pr-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 font-mono tracking-widest"
                    required
                  />
                </div>
                <span className="text-[11px] text-slate-400 mt-1 block">
                  Any 4 digits accepted in prototype mode.
                </span>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl text-sm transition-colors shadow-sm flex items-center justify-center gap-2"
              >
                <span>Enter Demo Dashboard</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}

          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              Demo Environment
            </span>
            <button
              onClick={() => onNavigate('landing')}
              className="hover:text-slate-900 transition-colors"
            >
              Back to Home
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
