
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home';
import { AddExpenseComponent } from './pages/add-expense/add-expense';

/**
 * Application Routes Configuration
 * Defines navigation paths for the application
 * 
 * Lazy Loading: The transactions route uses lazy loading to load
 * the TransactionsComponent only when the user navigates to /transactions
 */
const routes: Routes = [
  { 
    path: '', 
    redirectTo: '/home', 
    pathMatch: 'full' 
  },
  { 
    path: 'home', 
    component: HomeComponent 
  },
  { 
    path: 'add-expense', 
    component: AddExpenseComponent 
  },
  {
    path: 'transactions',
    loadComponent: () => import('./pages/transactions/transactions')
      .then(m => m.TransactionsComponent)
    // ✅ Lazy Loading: Component loads only when route is accessed
    // ✅ Standalone component can be lazy loaded without a module
  },
  { 
    path: '**', 
    redirectTo: '/home' 
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }