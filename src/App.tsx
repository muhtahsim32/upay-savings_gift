import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { SavingsProvider } from './context/SavingsContext';
import { PrototypeDisclaimerBanner } from './components/common/PrototypeDisclaimerBanner';
import { Navbar } from './components/common/Navbar';
import { Footer } from './components/common/Footer';
import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { DashboardPage } from './pages/DashboardPage';
import { SavingsPlansPage } from './pages/SavingsPlansPage';
import { ProfilePage } from './pages/ProfilePage';
import { AiSavingsCoachPage } from './pages/AiSavingsCoachPage';
import { WhatIfSimulatorPage } from './pages/WhatIfSimulatorPage';
import { CreatePlanModal } from './components/plans/CreatePlanModal';
import { DepositModal } from './components/plans/DepositModal';
import { PlanType, ActiveUserPlan } from './types';

function AppContent() {
  const { isAuthenticated } = useAuth();
  const [currentTab, setCurrentTab] = useState<string>('landing');
  const [createPlanModalOpen, setCreatePlanModalOpen] = useState(false);
  const [depositModalOpen, setDepositModalOpen] = useState(false);
  const [modalDefaultPlanType, setModalDefaultPlanType] = useState<PlanType>('monthly');
  const [selectedPlanForDeposit, setSelectedPlanForDeposit] = useState<ActiveUserPlan | null>(null);

  const navigateTo = (tab: string) => {
    // If navigating to dashboard or profile when not logged in, route to login
    if ((tab === 'dashboard' || tab === 'profile') && !isAuthenticated) {
      setCurrentTab('login');
    } else {
      setCurrentTab(tab);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenCreatePlan = (type?: PlanType) => {
    if (type) setModalDefaultPlanType(type);
    setCreatePlanModalOpen(true);
  };

  const handleOpenDeposit = (plan: ActiveUserPlan) => {
    setSelectedPlanForDeposit(plan);
    setDepositModalOpen(true);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans selection:bg-blue-100 selection:text-blue-900">
      {/* Top Disclaimer Banner */}
      <PrototypeDisclaimerBanner />

      {/* Top Bar Navigation */}
      <Navbar
        currentTab={currentTab}
        onNavigate={navigateTo}
        onOpenCreatePlan={() => handleOpenCreatePlan()}
      />

      {/* Main Page Content */}
      <main className="flex-1">
        {currentTab === 'landing' && (
          <LandingPage
            onNavigate={navigateTo}
            onOpenCreatePlan={handleOpenCreatePlan}
          />
        )}

        {currentTab === 'login' && (
          <LoginPage
            onSuccess={() => navigateTo('dashboard')}
            onNavigate={navigateTo}
          />
        )}

        {currentTab === 'dashboard' && (
          <DashboardPage
            onOpenCreatePlan={() => handleOpenCreatePlan()}
            onOpenDeposit={handleOpenDeposit}
            onNavigate={navigateTo}
          />
        )}

        {currentTab === 'plans' && (
          <SavingsPlansPage
            onOpenCreatePlan={handleOpenCreatePlan}
          />
        )}

        {currentTab === 'coach' && (
          <AiSavingsCoachPage
            onNavigate={navigateTo}
            onOpenCreatePlan={() => handleOpenCreatePlan('goal')}
          />
        )}

        {currentTab === 'simulator' && (
          <WhatIfSimulatorPage
            onNavigate={navigateTo}
            onOpenCreatePlan={() => handleOpenCreatePlan('goal')}
          />
        )}

        {currentTab === 'profile' && (
          <ProfilePage
            onNavigate={navigateTo}
          />
        )}
      </main>

      {/* Footer */}
      <Footer onNavigate={navigateTo} />

      {/* Global Modals */}
      <CreatePlanModal
        isOpen={createPlanModalOpen}
        onClose={() => setCreatePlanModalOpen(false)}
        defaultPlanType={modalDefaultPlanType}
        onSuccess={() => {
          navigateTo('dashboard');
        }}
      />

      <DepositModal
        isOpen={depositModalOpen}
        onClose={() => {
          setDepositModalOpen(false);
          setSelectedPlanForDeposit(null);
        }}
        selectedPlan={selectedPlanForDeposit}
      />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <SavingsProvider>
        <AppContent />
      </SavingsProvider>
    </AuthProvider>
  );
}
