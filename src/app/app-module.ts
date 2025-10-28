// src/app/app.module.ts

import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing-module';
import { AppComponent } from './app';

// Pages
import { HomeComponent } from './pages/home/home';
import { AddExpenseComponent } from './pages/add-expense/add-expense';

// Components
import { HeaderComponent } from './components/header/header';
import { ExpenseCardComponent } from './components/expense-card/expense-card';

// Services
import { ExpenseService } from './services/expense';

/**
 * Main Application Module
 * Contains all declarations, imports, and providers for the app
 */
@NgModule({
  declarations: [
    // Root Component
    AppComponent,
    
    // Page Components
    HomeComponent,
    AddExpenseComponent,
    
    // Reusable Components
    HeaderComponent,
    ExpenseCardComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    AppRoutingModule
  ],
  providers: [
    ExpenseService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }