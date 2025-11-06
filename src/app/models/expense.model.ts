// src/app/models/expense.model.ts

/**
 * Expense Model Interface
 * Defines the structure of an expense object
 */
export interface Expense {
  id: string;
  title: string;
  amount: number;
  category: string;
  date: Date;
  description?: string;
}

/**
 * Category types for expenses
 */
export type ExpenseCategory = 'Food' | 'Transport' | 'Entertainment' | 'Bills' | 'Shopping' | 'Healthcare' | 'Other';

/**
 * Monthly Summary Interface
 */
export interface MonthlySummary {
  month: string;
  year: number;
  totalExpenses: number;
  categoryBreakdown: { [key: string]: number };
  expenseCount: number;
}

export interface Transaction {
  id: string;
  title: string;
  amount: number;
  type: 'income' | 'expense';
  category: string;
  date: Date;
  description?: string;
}

export interface TransactionSummary {
  totalIncome: number;
  totalExpenses: number;
  balance: number;
  transactionCount: number;
}