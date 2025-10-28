import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ExpenseService } from '../../services/expense';
import { ExpenseCategory } from '../../models/expense.model';

@Component({
  selector: 'app-add-expense',
  standalone: false,
  templateUrl: './add-expense.html',
  styleUrls: ['./add-expense.scss']
})
export class AddExpenseComponent {
  // Form data model
  expenseData = {
    title: '',
    amount: 0,
    category: 'Food' as ExpenseCategory,
    date: new Date().toISOString().split('T')[0], // Today's date in YYYY-MM-DD format
    description: ''
  };

  // Available categories
  categories: ExpenseCategory[] = ['Food', 'Transport', 'Entertainment', 'Bills', 'Shopping', 'Healthcare', 'Other'];

  // Form submission state
  isSubmitting = false;

  constructor(
    private expenseService: ExpenseService,
    private router: Router
  ) {}

  /**
   * Handle form submission
   */
  onSubmit(): void {
    // Validate form
    if (!this.isFormValid()) {
      alert('Please fill in all required fields correctly.');
      return;
    }

    this.isSubmitting = true;

    // Create expense object
    const expense = {
      title: this.expenseData.title.trim(),
      amount: Number(this.expenseData.amount),
      category: this.expenseData.category,
      date: new Date(this.expenseData.date),
      description: this.expenseData.description.trim()
    };

    // Add expense via service
    this.expenseService.addExpense(expense);

    // Show success message
    alert('✅ Expense added successfully!');

    // Navigate back to home
    this.router.navigate(['/home']);
  }

  /**
   * Validate form data
   * @returns True if form is valid
   */
  isFormValid(): boolean {
    return (
      this.expenseData.title.trim().length > 0 &&
      this.expenseData.amount > 0 &&
      this.expenseData.date !== ''
    );
  }

  /**
   * Reset form to initial state
   */
  resetForm(): void {
    this.expenseData = {
      title: '',
      amount: 0,
      category: 'Food',
      date: new Date().toISOString().split('T')[0],
      description: ''
    };
  }

  /**
   * Handle cancel button click
   */
  onCancel(): void {
    if (confirm('Are you sure you want to cancel? All data will be lost.')) {
      this.router.navigate(['/home']);
    }
  }
}