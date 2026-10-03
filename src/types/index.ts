export type PlanType = 'monthly' | 'yearly' | 'goal' | 'fixed';

export interface SavingsPlanTemplate {
  id: string;
  type: PlanType;
  title: string;
  tagline: string;
  interestRate: number; // e.g. 8.5 for 8.5%
  minAmount: number;
  maxAmount: number;
  minTenureMonths: number;
  maxTenureMonths: number;
  popularTenures: number[]; // e.g. [6, 12, 24, 36]
  frequency: 'Monthly' | 'Yearly' | 'Flexible' | 'One-Time';
  features: string[];
  riskRating: 'Guaranteed' | 'Capital Protected';
  badge?: string;
  colorScheme: {
    primary: string;
    border: string;
    bg: string;
    text: string;
  };
}

export interface ActiveUserPlan {
  id: string;
  planTemplateId: string;
  planTitle: string;
  planType: PlanType;
  goalName?: string;
  iconName?: string;
  installmentAmount: number;
  targetAmount?: number;
  currentBalance: number;
  totalInvested: number;
  profitEarned: number;
  interestRate: number;
  frequency: 'Monthly' | 'Yearly' | 'Flexible' | 'One-Time';
  startDate: string; // ISO date string
  maturityDate: string; // ISO date string
  tenureMonths: number;
  completedInstallments: number;
  totalInstallments: number;
  status: 'active' | 'matured' | 'paused';
  autoDebitEnabled: boolean;
  nextDebitDate?: string;
}

export interface SavingsTransaction {
  id: string;
  planId: string;
  planTitle: string;
  amount: number;
  type: 'deposit' | 'interest_credit' | 'withdrawal' | 'bonus';
  date: string;
  status: 'completed' | 'pending';
  referenceNo: string;
}

export interface UserProfile {
  id: string;
  name: string;
  mobile: string;
  email: string;
  avatarUrl: string;
  walletBalance: number;
  nomineeName: string;
  nomineeRelation: string;
  nomineeShare: number;
  kycStatus: 'Verified (Demo)' | 'Unverified';
  autoDebitPaymentSource: string;
  joinDate: string;
  tier: 'Silver Saver' | 'Gold Saver' | 'Platinum Saver';
  rewardPoints: number;
  notificationSettings: {
    smsAlerts: boolean;
    emailMonthlyStatement: boolean;
    maturityReminders: boolean;
  };
}
