import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Transaction, TransactionSummary } from '../models/expense.model';


@Injectable({
  providedIn: 'root' // Available globally even for lazy-loaded modules
})
export class TransactionService {
  // Private BehaviorSubject to store transactions
  private transactionsSubject = new BehaviorSubject<Transaction[]>([]);
  
  // Public observable for components to subscribe
  public transactions$: Observable<Transaction[]> = this.transactionsSubject.asObservable();

  constructor() {
    // Load transactions from localStorage on service initialization
    this.loadTransactionsFromStorage();
  }

  /**
   * Get all transactions
   * @returns Array of all transactions
   */
  getTransactions(): Transaction[] {
    return this.transactionsSubject.value;
  }

  /**
   * Get transactions by type
   * @param type - 'income' or 'expense'
   * @returns Filtered transactions
   */
  getTransactionsByType(type: 'income' | 'expense'): Transaction[] {
    return this.getTransactions().filter(t => t.type === type);
  }

  /**
   * Add a new transaction
   * @param transaction - The transaction object to add
   */
  addTransaction(transaction: Omit<Transaction, 'id'>): void {
    const newTransaction: Transaction = {
      ...transaction,
      id: this.generateId()
    };
    
    const currentTransactions = this.getTransactions();
    const updatedTransactions = [...currentTransactions, newTransaction];
    
    this.updateTransactions(updatedTransactions);
  }

  /**
   * Delete a transaction by ID
   * @param id - The ID of the transaction to delete
   */
  deleteTransaction(id: string): void {
    const currentTransactions = this.getTransactions();
    const updatedTransactions = currentTransactions.filter(t => t.id !== id);
    
    this.updateTransactions(updatedTransactions);
  }

  /**
   * Update an existing transaction
   * @param id - Transaction ID
   * @param updates - Partial transaction updates
   */
  updateTransaction(id: string, updates: Partial<Transaction>): void {
    const currentTransactions = this.getTransactions();
    const updatedTransactions = currentTransactions.map(t => 
      t.id === id ? { ...t, ...updates } : t
    );
    
    this.updateTransactions(updatedTransactions);
  }

  /**
   * Get transaction summary
   * @returns Summary with income, expenses, and balance
   */
  getTransactionSummary(): TransactionSummary {
    const transactions = this.getTransactions();
    
    const totalIncome = transactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
    
    const totalExpenses = transactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);
    
    return {
      totalIncome,
      totalExpenses,
      balance: totalIncome - totalExpenses,
      transactionCount: transactions.length
    };
  }

  /**
   * Get monthly transactions
   * @returns Transactions for current month
   */
  getMonthlyTransactions(): Transaction[] {
    const transactions = this.getTransactions();
    const currentDate = new Date();
    
    return transactions.filter(t => {
      const tDate = new Date(t.date);
      return tDate.getMonth() === currentDate.getMonth() && 
             tDate.getFullYear() === currentDate.getFullYear();
    });
  }

  /**
   * Clear all transactions
   */
  clearAllTransactions(): void {
    this.updateTransactions([]);
  }

  /**
   * Private helper: Update transactions and save to localStorage
   * @param transactions - Updated array of transactions
   */
  private updateTransactions(transactions: Transaction[]): void {
    this.transactionsSubject.next(transactions);
    this.saveTransactionsToStorage(transactions);
  }

  /**
   * Private helper: Generate unique ID
   * @returns Unique string ID
   */
  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  /**
   * Private helper: Save transactions to localStorage
   * @param transactions - Array of transactions to save
   */
  private saveTransactionsToStorage(transactions: Transaction[]): void {
    localStorage.setItem('transactions', JSON.stringify(transactions));
  }

  /**
   * Private helper: Load transactions from localStorage
   */
  private loadTransactionsFromStorage(): void {
    const stored = localStorage.getItem('transactions');
    if (stored) {
      try {
        const transactions = JSON.parse(stored);
        this.transactionsSubject.next(transactions);
      } catch (error) {
        console.error('Error loading transactions from storage:', error);
      }
    }
  }
}