import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { ExpenseService } from '../../services/expense';
import { Expense, MonthlySummary } from '../../models/expense.model';

/**
 * Home Component (Page)
 * Displays dashboard with expense list and monthly summary
 */
@Component({
  selector: 'app-home',
  standalone: false,
  templateUrl: './home.html',
  styleUrls: ['./home.scss']
})
export class HomeComponent implements OnInit, OnDestroy {
  /** All expenses from the service */
  expenses: Expense[] = [];

  /** Filtered expenses for current category */
  filteredExpenses: Expense[] = [];

  /** Summary data for the current month */
  monthlySummary: MonthlySummary | null = null;

  /** Currently selected filter category */
  selectedCategory: string = 'All';

  /** Available categories */
  categories: string[] = [
    'All', 'Food', 'Transport', 'Entertainment',
    'Bills', 'Shopping', 'Healthcare', 'Other'
  ];

  /** Subscription to the expenses observable */
  private expensesSubscription?: Subscription;

  constructor(private expenseService: ExpenseService) {}

  ngOnInit(): void {
    // Subscribe to changes in expenses
    this.expensesSubscription = this.expenseService.expenses$.subscribe(expenses => {
      this.expenses = expenses;
      this.applyFilter();
      this.loadMonthlySummary();
    });
  }

  ngOnDestroy(): void {
    this.expensesSubscription?.unsubscribe(); 
  }

  /** Load monthly summary data */
  loadMonthlySummary(): void {
    this.monthlySummary = this.expenseService.getMonthlySummary();
  }

  /** Filter expenses by category */
  applyFilter(): void {
    if (this.selectedCategory === 'All') {
      this.filteredExpenses = [...this.expenses];
    } else {
      this.filteredExpenses = this.expenseService.getExpensesByCategory(this.selectedCategory);
    }
  }

  /** Handle category change */
  onCategoryChange(category: string): void {
    this.selectedCategory = category;
    this.applyFilter();
  }

  /** Handle delete event from child component */
  onDeleteExpense(id: string): void {
    this.expenseService.deleteExpense(id);
  }

  /** Convert category breakdown to array form for *ngFor */
  getCategoryBreakdownArray(): { category: string; amount: number }[] {
    if (!this.monthlySummary) return [];
    return Object.entries(this.monthlySummary.categoryBreakdown).map(([category, amount]) => ({
      category,
      amount
    }));
  }
}
