export enum Priority {
  High = 'Alta',
  Medium = 'Media',
  Low = 'Baja',
}

export enum Frequency {
  OneTime = 'Una vez',
  Weekly = 'Semanal',
  BiWeekly = 'Quincenal',
  Monthly = 'Mensual',
  BiMonthly = 'Bimestral',
  Annual = 'Anual',
}

export interface WishlistItem {
  id: string;
  name: string;
  category: string;
  priority: Priority;
  estimatedAmount?: number;
  url?: string;
  distributor?: string;
}

export interface SavingsGoal {
  id: string;
  name: string;
  targetAmount: number;
  savedAmount: number;
  category: string;
  priority: Priority;
  color: string;
  projection?: {
    amount: number;
    frequency: Frequency;
    targetDate?: string;
  };
  createdAt: string;
}

export interface Payment {
  id: string;
  name: string;
  amount: number;
  paidAmount: number;
  dueDate: string;
  category: string;
  frequency: Frequency;
  color: string;
  creditCardId?: string;
}

export interface CreditCard {
  id: string;
  name: string;
  creditLimit: number;
  currentBalance: number;
  paymentForNoInterest?: number;
  cutOffDay: number; // Day of the month (1-31)
  paymentDueDateDay: number; // Day of the month (1-31)
  color: string;
  lastCutOffProcessed?: string; // Format 'YYYY-MM'
}

export interface TimelessPaymentContribution {
  id: string;
  amount: number;
  date: string;
}

export interface TimelessPayment {
  id: string;
  name: string;
  totalAmount: number;
  paidAmount: number;
  isCompleted: boolean;
  color: string;
  createdAt: string;
  contributions: TimelessPaymentContribution[];
}