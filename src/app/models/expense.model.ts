export interface Expense {
  id: string;
  title: string;
  amount: number;
  category: string;
  date: Date;
  description?: string;
}


export type ExpenseCategory = 'Food' | 'Transport' | 'Entertainment' | 'Bills' | 'Shopping' | 'Healthcare' | 'Other';

export interface MonthlySummary {
  month: string;
  year: number;
  totalExpenses: number;
  categoryBreakdown: { [key: string]: number };
  expenseCount: number;
}