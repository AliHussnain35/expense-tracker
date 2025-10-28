// src/app/components/expense-card/expense-card.component.ts

import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Expense } from '../../models/expense.model';

/**
 * Expense Card Component
 * Reusable component to display individual expense details
 */
@Component({
  selector: 'app-expense-card',
  standalone: false,
  templateUrl: './expense-card.html',
  styleUrls: ['./expense-card.scss']
})
export class ExpenseCardComponent {
  // Input: Expense data to display
  @Input() expense!: Expense;
  
  // Output: Event emitter for delete action
  @Output() onDelete = new EventEmitter<string>();

  /**
   * Handle delete button click
   */
  handleDelete(): void {
    if (confirm('Are you sure you want to delete this expense?')) {
      this.onDelete.emit(this.expense.id);
    }
  }

  /**
   * Get category icon based on expense category
   * @returns Emoji icon for the category
   */
  getCategoryIcon(): string {
    const icons: { [key: string]: string } = {
      'Food': '🍔',
      'Transport': '🚗',
      'Entertainment': '🎬',
      'Bills': '💡',
      'Shopping': '🛍️',
      'Healthcare': '🏥',
      'Other': '📦'
    };
    return icons[this.expense.category] || '📦';
  }

  /**
   * Format date to readable string
   * @returns Formatted date string
   */
  getFormattedDate(): string {
    const date = new Date(this.expense.date);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  }
}