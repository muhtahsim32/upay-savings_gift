import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useSavings } from '../context/SavingsContext';
import {
  User,
  ShieldCheck,
  Wallet,
  HeartHandshake,
  Bell,
  RefreshCw,
  LogOut,
  CheckCircle,
  Phone,
  Mail,
  Award,
  Sparkles
} from 'lucide-react';
import { formatCurrency } from '../utils/calculator';

interface ProfilePageProps {
  onNavigate: (tab: string) => void;
}

export const ProfilePage: React.FC<ProfilePageProps> = ({ onNavigate }) => {
  const { user, updateProfile, resetDemoUser, logout, loginAsDemo } = useAuth();
  const { resetSavingsDemo } = useSavings();

  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [nomineeName, setNomineeName] = useState(user?.nomineeName || '');
  const [nomineeRelation, setNomineeRelation] = useState(user?.nomineeRelation || '');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2500);
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({
      name,
      email,
      nomineeName,
      nomineeRelation
    });
    setIsEditing(false);
    showToast('Profile information updated (Demo)');
  };

  const handleToggleNotification = (key: 'smsAlerts' | 'emailMonthlyStatement' | 'maturityReminders') => {
    if (!user) return;
    updateProfile({
      notificationSettings: {
        ...user.notificationSettings,
        [key]: !user.notificationSettings[key]
      }
    });
    showToast('Preference saved');
  };

  const handleFullReset = () => {
    if (window.confirm('Reset all demo savings plans and profile data back to default?')) {
      resetDemoUser();
      resetSavingsDemo();
      showToast('All demo state reset to defaults');
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 pb-20">
      {/* Toast Notice */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 bg-slate-900 text-white text-xs px-4 py-2.5 rounded-xl shadow-lg border border-slate-800 flex items-center gap-2 animate-in fade-in">
          <CheckCircle className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Account & Profile</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage your personal savings identity, linked wallet, and nominee allocation
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              const targetKey = user?.name.includes('Sadia') ? 'rahim' : 'sadia';
              loginAsDemo(targetKey);
              showToast(`Switched persona to ${targetKey === 'rahim' ? 'Rahim' : 'Sadia'}`);
            }}
            className="px-3 py-1.5 text-xs font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors border border-blue-200/60"
          >
            Switch to {user?.name.includes('Sadia') ? 'Rahim' : 'Sadia'} Demo
          </button>

          <button
            onClick={() => {
              logout();
              onNavigate('landing');
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 rounded-lg transition-colors border border-rose-200/60"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Column: Identity & KYC Card */}
        <div className="md:col-span-1 space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm text-center space-y-4">
            <div className="relative inline-block">
              <img
                src={user?.avatarUrl || '/src/assets/images/avatar_demo_user_1790995439814.jpg'}
                alt={user?.name || 'User'}
                className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-md mx-auto"
                referrerPolicy="no-referrer"
              />
              <span className="absolute bottom-0 right-1 p-1 bg-emerald-500 text-white rounded-full ring-2 ring-white">
                <CheckCircle className="w-4 h-4" />
              </span>
            </div>

            <div>
              <h2 className="text-base font-bold text-slate-900">{user?.name}</h2>
              <p className="text-xs font-mono text-slate-500">{user?.mobile}</p>
              <div className="inline-flex items-center gap-1 mt-2 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200/70">
                <ShieldCheck className="w-3 h-3" />
                <span>{user?.kycStatus}</span>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 text-left space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-400">Membership Tier:</span>
                <span className="font-semibold text-slate-800 flex items-center gap-1">
                  <Award className="w-3.5 h-3.5 text-blue-600" />
                  {user?.tier}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Saver Points:</span>
                <span className="font-mono font-bold text-indigo-600">
                  {user?.rewardPoints?.toLocaleString()} pts
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Member Since:</span>
                <span className="text-slate-700">{user?.joinDate}</span>
              </div>
            </div>
          </div>

          {/* Linked Payment Source */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-3">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-blue-50 text-blue-600">
                <Wallet className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-xs font-bold text-slate-900">Linked Payment Source</h3>
                <p className="text-[11px] text-slate-500">Auto-debit for installments</p>
              </div>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5 text-xs">
              <span className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold block">
                Primary Wallet
              </span>
              <p className="font-semibold text-slate-900">{user?.autoDebitPaymentSource}</p>
              <div className="flex justify-between items-center pt-2 border-t border-slate-200/60">
                <span className="text-slate-500">Demo Wallet Balance:</span>
                <span className="font-mono font-bold text-slate-900">
                  {formatCurrency(user?.walletBalance || 34500)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Profile Form & Nominee Details */}
        <div className="md:col-span-2 space-y-6">
          {/* Personal Info Form */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Personal Information</h3>
                <p className="text-xs text-slate-500">Official saver account details</p>
              </div>
              <button
                onClick={() => {
                  if (isEditing) {
                    setName(user?.name || '');
                    setEmail(user?.email || '');
                    setNomineeName(user?.nomineeName || '');
                    setNomineeRelation(user?.nomineeRelation || '');
                  }
                  setIsEditing(!isEditing);
                }}
                className="text-xs font-semibold text-blue-600 hover:text-blue-700"
              >
                {isEditing ? 'Cancel Edit' : 'Edit Details'}
              </button>
            </div>

            <form onSubmit={handleSaveProfile} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    Full Legal Name
                  </label>
                  <input
                    type="text"
                    disabled={!isEditing}
                    value={name}
                    onChange={e => setName(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg disabled:bg-slate-50 disabled:text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    Mobile Number
                  </label>
                  <input
                    type="text"
                    disabled
                    value={user?.mobile || ''}
                    className="w-full px-3 py-2 text-xs border border-slate-200 bg-slate-50 text-slate-500 font-mono rounded-lg cursor-not-allowed"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    disabled={!isEditing}
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg disabled:bg-slate-50 disabled:text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
                    required
                  />
                </div>
              </div>

              {/* Nominee Details Section */}
              <div className="pt-4 border-t border-slate-100 space-y-3">
                <div className="flex items-center gap-2">
                  <HeartHandshake className="w-4 h-4 text-rose-500" />
                  <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                    Nominee & Inheritance Designation
                  </h4>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-slate-600 mb-1">Nominee Full Name</label>
                    <input
                      type="text"
                      disabled={!isEditing}
                      value={nomineeName}
                      onChange={e => setNomineeName(e.target.value)}
                      className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg disabled:bg-slate-50 disabled:text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs text-slate-600 mb-1">Relationship</label>
                    <input
                      type="text"
                      disabled={!isEditing}
                      value={nomineeRelation}
                      onChange={e => setNomineeRelation(e.target.value)}
                      className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg disabled:bg-slate-50 disabled:text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
                      required
                    />
                  </div>
                </div>
              </div>

              {isEditing && (
                <div className="pt-2 flex justify-end">
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-xl shadow-sm transition-colors"
                  >
                    Save Changes
                  </button>
                </div>
              )}
            </form>
          </div>

          {/* Notification Preferences */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
              <Bell className="w-4 h-4 text-blue-600" />
              <div>
                <h3 className="text-sm font-bold text-slate-900">Notification Alerts</h3>
                <p className="text-xs text-slate-500">Maturity reminders and monthly auto-debit statements</p>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 rounded-xl border border-slate-100 bg-slate-50/50">
                <div className="text-xs">
                  <span className="font-semibold text-slate-900 block">SMS Auto-Debit Notifications</span>
                  <span className="text-slate-500">Instant SMS confirmation when monthly installment executes</span>
                </div>
                <input
                  type="checkbox"
                  checked={user?.notificationSettings?.smsAlerts ?? true}
                  onChange={() => handleToggleNotification('smsAlerts')}
                  className="rounded text-blue-600 focus:ring-blue-500 w-4 h-4 cursor-pointer"
                />
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl border border-slate-100 bg-slate-50/50">
                <div className="text-xs">
                  <span className="font-semibold text-slate-900 block">Monthly Statement via Email</span>
                  <span className="text-slate-500">Consolidated PDF portfolio summary sent on the 1st</span>
                </div>
                <input
                  type="checkbox"
                  checked={user?.notificationSettings?.emailMonthlyStatement ?? true}
                  onChange={() => handleToggleNotification('emailMonthlyStatement')}
                  className="rounded text-blue-600 focus:ring-blue-500 w-4 h-4 cursor-pointer"
                />
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl border border-slate-100 bg-slate-50/50">
                <div className="text-xs">
                  <span className="font-semibold text-slate-900 block">Upcoming Maturity Reminders</span>
                  <span className="text-slate-500">Notify 7 days prior to deposit maturity for rollover or payout</span>
                </div>
                <input
                  type="checkbox"
                  checked={user?.notificationSettings?.maturityReminders ?? true}
                  onChange={() => handleToggleNotification('maturityReminders')}
                  className="rounded text-blue-600 focus:ring-blue-500 w-4 h-4 cursor-pointer"
                />
              </div>
            </div>
          </div>

          {/* Prototype Reset Danger Zone */}
          <div className="p-5 rounded-2xl border border-slate-200 bg-slate-100/60 flex items-center justify-between gap-4">
            <div>
              <h4 className="text-xs font-bold text-slate-800">Reset Demo Environment</h4>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Clear all custom-created plans and restore pre-seeded portfolio data.
              </p>
            </div>
            <button
              onClick={handleFullReset}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-200 border border-slate-300 rounded-lg transition-colors shrink-0"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Reset Demo</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
