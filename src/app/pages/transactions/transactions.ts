// src/app/pages/transactions/transactions.component.ts

import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { Subscription } from 'rxjs';
import { TransactionService } from '../../services/transaction';
import { Transaction, TransactionSummary } from '../../models/expense.model';

/**
 * Transactions Component (Standalone with Lazy Loading)
 * Displays all transactions (income and expenses) with filtering
 */
@Component({
  selector: 'app-transactions',
  standalone: true,
  imports: [
    CommonModule,    // For *ngIf, *ngFor, pipes
    FormsModule,     // For ngModel
    RouterModule     // For routerLink
  ],
  templateUrl: './transactions.html',
  styleUrls: ['./transactions.scss']
})
export class TransactionsComponent implements OnInit, OnDestroy {
  // All transactions
  transactions: Transaction[] = [];
  
  // Filtered transactions
  filteredTransactions: Transaction[] = [];
  
  // Transaction summary
  summary: TransactionSummary = {
    totalIncome: 0,
    totalExpenses: 0,
    balance: 0,
    transactionCount: 0
  };
  
  // Filter options
  selectedFilter: 'all' | 'income' | 'expense' = 'all';
  
  // New transaction form
  showAddForm = false;
  newTransaction = {
    title: '',
    amount: 0,
    type: 'expense' as 'income' | 'expense',
    category: 'Food',
    date: new Date().toISOString().split('T')[0],
    description: ''
  };
  
  // Categories
  categories = ['Food', 'Transport', 'Entertainment', 'Bills', 'Shopping', 'Healthcare', 'Salary', 'Freelance', 'Investment', 'Other'];
  
  // Subscription
  private transactionSubscription?: Subscription;

  constructor(private transactionService: TransactionService) {}

  ngOnInit(): void {
    console.log('✅ Transactions Component Lazy Loaded Successfully!');
    
    // Subscribe to transactions
    this.transactionSubscription = this.transactionService.transactions$.subscribe(
      transactions => {
        this.transactions = transactions.sort((a, b) => 
          new Date(b.date).getTime() - new Date(a.date).getTime()
        );
        this.applyFilter();
        this.loadSummary();
      }
    );
  }

  ngOnDestroy(): void {
    this.transactionSubscription?.unsubscribe();
  }

  /**
   * Load transaction summary
   */
  loadSummary(): void {
    this.summary = this.transactionService.getTransactionSummary();
  }

  /**
   * Apply filter to transactions
   */
  applyFilter(): void {
    if (this.selectedFilter === 'all') {
      this.filteredTransactions = [...this.transactions];
    } else {
      this.filteredTransactions = this.transactionService.getTransactionsByType(this.selectedFilter);
    }
  }

  /**
   * Change filter
   */
  onFilterChange(filter: 'all' | 'income' | 'expense'): void {
    this.selectedFilter = filter;
    this.applyFilter();
  }

  /**
   * Toggle add form
   */
  toggleAddForm(): void {
    this.showAddForm = !this.showAddForm;
    if (this.showAddForm) {
      this.resetForm();
    }
  }

  /**
   * Add new transaction
   */
  addTransaction(): void {
    if (!this.newTransaction.title || this.newTransaction.amount <= 0) {
      alert('Please fill in all required fields');
      return;
    }

    this.transactionService.addTransaction({
      ...this.newTransaction,
      date: new Date(this.newTransaction.date)
    });

    alert('✅ Transaction added successfully!');
    this.showAddForm = false;
    this.resetForm();
  }

  /**
   * Delete transaction
   */
  deleteTransaction(id: string): void {
    if (confirm('Are you sure you want to delete this transaction?')) {
      this.transactionService.deleteTransaction(id);
    }
  }

  /**
   * Reset form
   */
  resetForm(): void {
    this.newTransaction = {
      title: '',
      amount: 0,
      type: 'expense',
      category: 'Food',
      date: new Date().toISOString().split('T')[0],
      description: ''
    };
  }

  /**
   * Get transaction icon
   */
  getTransactionIcon(transaction: Transaction): string {
    if (transaction.type === 'income') {
      return '💰';
    }
    
    const icons: { [key: string]: string } = {
      'Food': '🍔',
      'Transport': '🚗',
      'Entertainment': '🎬',
      'Bills': '💡',
      'Shopping': '🛍️',
      'Healthcare': '🏥',
      'Salary': '💼',
      'Freelance': '💻',
      'Investment': '📈',
      'Other': '📦'
    };
    return icons[transaction.category] || '📦';
  }

  /**
   * Get formatted date
   */
  getFormattedDate(date: Date): string {
    return new Date(date).toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  }

  /**
   * Get transaction class for styling
   */
  getTransactionClass(type: 'income' | 'expense'): string {
    return type === 'income' ? 'transaction-income' : 'transaction-expense';
  }
}