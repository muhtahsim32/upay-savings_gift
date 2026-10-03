import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Wallet, Plus, LogOut, Menu, X, User as UserIcon } from 'lucide-react';
import { formatCurrency } from '../../utils/calculator';

interface NavbarProps {
  currentTab: string;
  onNavigate: (tab: string) => void;
  onOpenCreatePlan: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentTab, onNavigate, onOpenCreatePlan }) => {
  const { user, isAuthenticated, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { id: 'landing', label: 'Home' },
    { id: 'plans', label: 'Savings Plans' },
    ...(isAuthenticated ? [{ id: 'dashboard', label: 'Dashboard' }] : []),
    ...(isAuthenticated ? [{ id: 'profile', label: 'Profile' }] : [])
  ];

  const handleNavClick = (id: string) => {
    onNavigate(id);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Zone 1: Single element brand wordmark */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => handleNavClick('landing')}
              className="flex items-center gap-2 text-left group"
            >
              <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold text-lg shadow-sm group-hover:bg-blue-700 transition-colors">
                u
              </div>
              <div className="flex items-baseline">
                <span className="text-xl font-bold tracking-tight text-slate-900">upay</span>
                <span className="text-xl font-semibold text-blue-600 ml-1">Savings</span>
              </div>
            </button>
          </div>

          {/* Zone 2: 4-6 text navigation links */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
            {navLinks.map(link => {
              const isActive = currentTab === link.id;
              return (
                <button
                  key={link.id}
                  onClick={() => handleNavClick(link.id)}
                  className={`transition-colors relative py-1 ${
                    isActive
                      ? 'text-blue-600 font-semibold after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-blue-600'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {link.label}
                </button>
              );
            })}
          </nav>

          {/* Zone 3: 1-2 primary actions */}
          <div className="hidden sm:flex items-center gap-3">
            {isAuthenticated ? (
              <>
                <button
                  onClick={onOpenCreatePlan}
                  className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 active:scale-95 transition-all shadow-sm"
                >
                  <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
                  <span>Start Plan</span>
                </button>

                <div className="h-4 w-px bg-slate-200 mx-1" />

                <button
                  onClick={() => handleNavClick('profile')}
                  className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg border border-slate-200 hover:border-slate-300 text-slate-700 hover:bg-slate-50 transition-colors text-xs font-medium"
                >
                  <img
                    src={user?.avatarUrl || '/src/assets/images/avatar_demo_user_1790995439814.jpg'}
                    alt={user?.name || 'User'}
                    className="w-5 h-5 rounded-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                  <span className="max-w-[100px] truncate">{user?.name?.split(' ')[0]}</span>
                  <span className="text-slate-400 font-mono text-[11px] tabular-nums">
                    {formatCurrency(user?.walletBalance || 0)}
                  </span>
                </button>
              </>
            ) : (
              <button
                onClick={() => handleNavClick('login')}
                className="px-4 py-2 text-xs font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 active:scale-95 transition-all shadow-sm"
              >
                Log In
              </button>
            )}
          </div>

          {/* Mobile menu trigger */}
          <div className="flex md:hidden items-center gap-2">
            {isAuthenticated && (
              <button
                onClick={onOpenCreatePlan}
                className="p-1.5 text-white bg-blue-600 rounded-md"
                title="Start plan"
              >
                <Plus className="w-4 h-4" />
              </button>
            )}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 pt-2 pb-4 space-y-2">
          {navLinks.map(link => (
            <button
              key={link.id}
              onClick={() => handleNavClick(link.id)}
              className={`block w-full text-left px-3 py-2 rounded-md text-sm font-medium ${
                currentTab === link.id
                  ? 'bg-blue-50 text-blue-600'
                  : 'text-slate-700 hover:bg-slate-50'
              }`}
            >
              {link.label}
            </button>
          ))}

          <div className="pt-2 border-t border-slate-100">
            {isAuthenticated ? (
              <div className="space-y-2">
                <div className="flex items-center justify-between px-3 py-1.5 text-xs text-slate-500">
                  <span>Linked upay Wallet</span>
                  <span className="font-mono font-medium text-slate-800">
                    {formatCurrency(user?.walletBalance || 0)}
                  </span>
                </div>
                <button
                  onClick={() => {
                    logout();
                    setMobileMenuOpen(false);
                    onNavigate('landing');
                  }}
                  className="flex items-center gap-2 w-full text-left px-3 py-2 text-sm text-rose-600 hover:bg-rose-50 rounded-md"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Log Out</span>
                </button>
              </div>
            ) : (
              <button
                onClick={() => handleNavClick('login')}
                className="w-full text-center px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg"
              >
                Log In
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
