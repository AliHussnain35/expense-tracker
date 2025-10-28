import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Expense, MonthlySummary } from '../models/expense.model';

/**
 * Expense Service
 * Handles all expense-related data operations and business logic
 */
@Injectable({
  providedIn: 'root'
})
export class ExpenseService {
  // Private BehaviorSubject to store expenses
  private expensesSubject = new BehaviorSubject<Expense[]>([]);
  
  // Public observable for components to subscribe
  public expenses$: Observable<Expense[]> = this.expensesSubject.asObservable();

  constructor() {
    // Load expenses from localStorage on service initialization
    this.loadExpensesFromStorage();
  }

  /**
   * Get all expenses
   * @returns Array of all expenses
   */
  getExpenses(): Expense[] {
    return this.expensesSubject.value;
  }

  /**
   * Add a new expense
   * @param expense - The expense object to add
   */
  addExpense(expense: Omit<Expense, 'id'>): void {
    const newExpense: Expense = {
      ...expense,
      id: this.generateId()
    };
    
    const currentExpenses = this.getExpenses();
    const updatedExpenses = [...currentExpenses, newExpense];
    
    this.updateExpenses(updatedExpenses);
  }

  /**
   * Delete an expense by ID
   * @param id - The ID of the expense to delete
   */
  deleteExpense(id: string): void {
    const currentExpenses = this.getExpenses();
    const updatedExpenses = currentExpenses.filter(exp => exp.id !== id);
    
    this.updateExpenses(updatedExpenses);
  }

  /**
   * Get expenses filtered by category
   * @param category - The category to filter by
   * @returns Array of filtered expenses
   */
  getExpensesByCategory(category: string): Expense[] {
    return this.getExpenses().filter(exp => exp.category === category);
  }

  /**
   * Calculate monthly summary
   * @returns MonthlySummary object with aggregated data
   */
  getMonthlySummary(): MonthlySummary {
    const expenses = this.getExpenses();
    const currentDate = new Date();
    const currentMonth = currentDate.toLocaleString('default', { month: 'long' });
    const currentYear = currentDate.getFullYear();

    // Filter expenses for current month
    const monthlyExpenses = expenses.filter(exp => {
      const expDate = new Date(exp.date);
      return expDate.getMonth() === currentDate.getMonth() && 
             expDate.getFullYear() === currentYear;
    });

    // Calculate total
    const totalExpenses = monthlyExpenses.reduce((sum, exp) => sum + exp.amount, 0);

    // Calculate category breakdown
    const categoryBreakdown: { [key: string]: number } = {};
    monthlyExpenses.forEach(exp => {
      categoryBreakdown[exp.category] = (categoryBreakdown[exp.category] || 0) + exp.amount;
    });

    return {
      month: currentMonth,
      year: currentYear,
      totalExpenses,
      categoryBreakdown,
      expenseCount: monthlyExpenses.length
    };
  }

  /**
   * Get total expenses amount
   * @returns Total sum of all expenses
   */
  getTotalExpenses(): number {
    return this.getExpenses().reduce((sum, exp) => sum + exp.amount, 0);
  }

  /**
   * Private helper: Update expenses and save to localStorage
   * @param expenses - Updated array of expenses
   */
  private updateExpenses(expenses: Expense[]): void {
    this.expensesSubject.next(expenses);
    this.saveExpensesToStorage(expenses);
  }

  /**
   * Private helper: Generate unique ID
   * @returns Unique string ID
   */
  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  /**
   * Private helper: Save expenses to localStorage
   * @param expenses - Array of expenses to save
   */
  private saveExpensesToStorage(expenses: Expense[]): void {
    localStorage.setItem('expenses', JSON.stringify(expenses));
  }

  /**
   * Private helper: Load expenses from localStorage
   */
  private loadExpensesFromStorage(): void {
    const stored = localStorage.getItem('expenses');
    if (stored) {
      try {
        const expenses = JSON.parse(stored);
        this.expensesSubject.next(expenses);
      } catch (error) {
        console.error('Error loading expenses from storage:', error);
      }
    }
  }
}