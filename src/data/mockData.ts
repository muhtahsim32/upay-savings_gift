import { SavingsPlanTemplate, ActiveUserPlan, SavingsTransaction, UserProfile } from '../types';

export const SAVINGS_PLAN_TEMPLATES: SavingsPlanTemplate[] = [
  {
    id: 'monthly-dps',
    type: 'monthly',
    title: 'Monthly Savings (DPS)',
    tagline: 'Build disciplined wealth with predictable monthly contributions from your wallet.',
    interestRate: 8.5,
    minAmount: 500,
    maxAmount: 25000,
    minTenureMonths: 6,
    maxTenureMonths: 60,
    popularTenures: [12, 24, 36, 60],
    frequency: 'Monthly',
    features: [
      'Guaranteed 8.5% annual compounded profit',
      'Flexible tenures from 6 months up to 5 years',
      'Automated monthly auto-debit from upay balance',
      'Premature withdrawal after 3 months without penalty',
      'Life insurance protection cover (mock tier)'
    ],
    riskRating: 'Capital Protected',
    badge: 'Most Popular',
    colorScheme: {
      primary: '#0284c7', // Sky / Cyan
      border: 'border-sky-200',
      bg: 'bg-sky-50/50',
      text: 'text-sky-700'
    }
  },
  {
    id: 'yearly-saver',
    type: 'yearly',
    title: 'Yearly Savings',
    tagline: 'Annual commitment plan with an elevated bonus yield and lump-sum discipline.',
    interestRate: 8.9,
    minAmount: 10000,
    maxAmount: 200000,
    minTenureMonths: 12,
    maxTenureMonths: 60,
    popularTenures: [12, 24, 36],
    frequency: 'Yearly',
    features: [
      'High 8.9% return per annum',
      'Single annual deposit or 12-month lump milestone',
      '+0.4% loyalty point booster upon annual completion',
      'Zero maintenance or account fees',
      'Eligible for annual cashback lucky draw demo'
    ],
    riskRating: 'Capital Protected',
    badge: 'High Yield',
    colorScheme: {
      primary: '#0d9488', // Teal
      border: 'border-teal-200',
      bg: 'bg-teal-50/50',
      text: 'text-teal-700'
    }
  },
  {
    id: 'goal-based',
    type: 'goal',
    title: 'Goal-Based Savings',
    tagline: 'Set specific milestones like Hajj, Tech Gadget, or Emergency Fund with visual progress.',
    interestRate: 8.2,
    minAmount: 200,
    maxAmount: 500000,
    minTenureMonths: 3,
    maxTenureMonths: 36,
    popularTenures: [6, 12, 18, 24],
    frequency: 'Flexible',
    features: [
      'Flexible deposits anytime from ৳200+',
      'Visual milestone trackers & achievement badges',
      'Daily profit accrual with 8.2% annual yield',
      'Target lock to avoid impulsive spending',
      'Withdraw directly to upay wallet anytime'
    ],
    riskRating: 'Guaranteed',
    badge: 'Most Flexible',
    colorScheme: {
      primary: '#d97706', // Amber
      border: 'border-amber-200',
      bg: 'bg-amber-50/50',
      text: 'text-amber-800'
    }
  },
  {
    id: 'fixed-term-fdr',
    type: 'fixed',
    title: 'Fixed-Term Savings',
    tagline: 'Lock in guaranteed top-tier interest for a fixed duration with zero market volatility.',
    interestRate: 9.25,
    minAmount: 5000,
    maxAmount: 1000000,
    minTenureMonths: 3,
    maxTenureMonths: 36,
    popularTenures: [3, 6, 12, 24],
    frequency: 'One-Time',
    features: [
      'Maximum 9.25% fixed return p.a.',
      'Choice of 3, 6, 12, or 24-month locked terms',
      'Profit payout at maturity or quarterly',
      'Loan facility against FDR up to 80% (concept)',
      '100% principal & interest guarantee'
    ],
    riskRating: 'Guaranteed',
    badge: 'Maximum Return',
    colorScheme: {
      primary: '#4f46e5', // Indigo
      border: 'border-indigo-200',
      bg: 'bg-indigo-50/50',
      text: 'text-indigo-700'
    }
  }
];

export const INITIAL_USER_PROFILE: UserProfile = {
  id: 'usr_rahim_01',
  name: 'Rahim Ahmed',
  mobile: '+880 1712-345678',
  email: 'rahim.ahmed@example.com',
  avatarUrl: '/src/assets/images/avatar_demo_user_1790995439814.jpg',
  walletBalance: 34500,
  nomineeName: 'Nasrin Sultana',
  nomineeRelation: 'Spouse',
  nomineeShare: 100,
  kycStatus: 'Verified (Demo)',
  autoDebitPaymentSource: 'upay Wallet (Linked: 01712-345678)',
  joinDate: '14 January 2025',
  tier: 'Silver Saver',
  rewardPoints: 1850,
  notificationSettings: {
    smsAlerts: true,
    emailMonthlyStatement: true,
    maturityReminders: true
  }
};

export const DEMO_USERS: Record<string, UserProfile> = {
  rahim: INITIAL_USER_PROFILE,
  sadia: {
    id: 'usr_sadia_02',
    name: 'Sadia Rahman',
    mobile: '+880 1898-765432',
    email: 'sadia.rahman@student.ac.bd',
    avatarUrl: '/src/assets/images/avatar_demo_user_1790995439814.jpg',
    walletBalance: 8200,
    nomineeName: 'Abdul Rahman',
    nomineeRelation: 'Father',
    nomineeShare: 100,
    kycStatus: 'Verified (Demo)',
    autoDebitPaymentSource: 'upay Wallet (Linked: 01898-765432)',
    joinDate: '02 June 2025',
    tier: 'Gold Saver',
    rewardPoints: 620,
    notificationSettings: {
      smsAlerts: true,
      emailMonthlyStatement: false,
      maturityReminders: true
    }
  }
};

export const INITIAL_ACTIVE_PLANS: ActiveUserPlan[] = [
  {
    id: 'act_plan_001',
    planTemplateId: 'monthly-dps',
    planTitle: 'Monthly Savings (DPS)',
    planType: 'monthly',
    goalName: 'Child Higher Education Fund',
    iconName: 'GraduationCap',
    installmentAmount: 5000,
    targetAmount: 135000,
    currentBalance: 73400,
    totalInvested: 65000,
    profitEarned: 8400,
    interestRate: 8.5,
    frequency: 'Monthly',
    startDate: '2025-08-10',
    maturityDate: '2027-08-10',
    tenureMonths: 24,
    completedInstallments: 13,
    totalInstallments: 24,
    status: 'active',
    autoDebitEnabled: true,
    nextDebitDate: '2026-11-10'
  },
  {
    id: 'act_plan_002',
    planTemplateId: 'fixed-term-fdr',
    planTitle: 'Fixed-Term Savings',
    planType: 'fixed',
    goalName: '1-Year High-Yield Term Deposit',
    iconName: 'Lock',
    installmentAmount: 50000,
    targetAmount: 54625,
    currentBalance: 53600,
    totalInvested: 50000,
    profitEarned: 3600,
    interestRate: 9.25,
    frequency: 'One-Time',
    startDate: '2025-11-15',
    maturityDate: '2026-11-15',
    tenureMonths: 12,
    completedInstallments: 1,
    totalInstallments: 1,
    status: 'active',
    autoDebitEnabled: false,
    nextDebitDate: undefined
  },
  {
    id: 'act_plan_003',
    planTemplateId: 'goal-based',
    planTitle: 'Goal-Based Savings',
    planType: 'goal',
    goalName: 'Emergency Rainy Day Reserve',
    iconName: 'ShieldAlert',
    installmentAmount: 3000,
    targetAmount: 80000,
    currentBalance: 58400,
    totalInvested: 54000,
    profitEarned: 4400,
    interestRate: 8.2,
    frequency: 'Flexible',
    startDate: '2025-06-01',
    maturityDate: '2027-06-01',
    tenureMonths: 24,
    completedInstallments: 18,
    totalInstallments: 24,
    status: 'active',
    autoDebitEnabled: true,
    nextDebitDate: '2026-11-01'
  }
];

export const INITIAL_TRANSACTIONS: SavingsTransaction[] = [
  {
    id: 'tx_98124',
    planId: 'act_plan_001',
    planTitle: 'Child Higher Education Fund',
    amount: 5000,
    type: 'deposit',
    date: '2026-10-10',
    status: 'completed',
    referenceNo: 'UP-SAV-892341'
  },
  {
    id: 'tx_98099',
    planId: 'act_plan_003',
    planTitle: 'Emergency Rainy Day Reserve',
    amount: 3000,
    type: 'deposit',
    date: '2026-10-01',
    status: 'completed',
    referenceNo: 'UP-SAV-890214'
  },
  {
    id: 'tx_97880',
    planId: 'act_plan_002',
    planTitle: '1-Year High-Yield Term Deposit',
    amount: 1156,
    type: 'interest_credit',
    date: '2026-09-30',
    status: 'completed',
    referenceNo: 'UP-INT-774012'
  },
  {
    id: 'tx_97621',
    planId: 'act_plan_001',
    planTitle: 'Child Higher Education Fund',
    amount: 5000,
    type: 'deposit',
    date: '2026-09-10',
    status: 'completed',
    referenceNo: 'UP-SAV-873910'
  },
  {
    id: 'tx_97510',
    planId: 'act_plan_003',
    planTitle: 'Emergency Rainy Day Reserve',
    amount: 3000,
    type: 'deposit',
    date: '2026-09-01',
    status: 'completed',
    referenceNo: 'UP-SAV-869201'
  },
  {
    id: 'tx_96901',
    planId: 'general',
    planTitle: 'Savings Discipline Streak',
    amount: 250,
    type: 'bonus',
    date: '2026-08-15',
    status: 'completed',
    referenceNo: 'UP-REW-664019'
  }
];
