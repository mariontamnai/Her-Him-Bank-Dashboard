import { Component, ChangeDetectorRef, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { supabase } from '../auth/login/supabase';
import { CurrencyService } from '../../services/currency';

@Component({
  selector: 'app-loans',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './loans.html',
  styleUrl: './loans.css'
})
export class Loans implements OnInit {

  amount = '';
  duration = '';
  loading = false;
  successMessage = '';
  errorMessage = '';
  maxLoan = 0;

  constructor(private cdr: ChangeDetectorRef, public currencyService: CurrencyService) {}

  ngOnInit() {}

  async applyLoan() {
    this.errorMessage = '';
    this.successMessage = '';

    if (!this.amount || !this.duration) {
      this.errorMessage = 'Fill all fields!';
      return;
    }

    const loanAmount = parseFloat(this.amount);

    if (loanAmount <= 0) {
      this.errorMessage = 'Invalid amount!';
      return;
    }
    
    this.loading = true;

    const { data: { user } } = await supabase.auth.getUser();

    if (user) {
      const { data: accounts } = await supabase
        .from('Accounts')
        .select('balance')
        .eq('user_id', user.id);

      let totalBalance = 0;
      if (accounts) {
        totalBalance = accounts.reduce((sum: number, acc: any) => sum + (acc.balance || 0), 0);
      }

      this.maxLoan = totalBalance * 2;

      let status = 'pending';

      if (loanAmount <= totalBalance * 0.5) {
        status = 'approved';
      } else if (loanAmount > totalBalance * 2) {
        status = 'rejected';
      }

      const { error } = await supabase.from('Loans').insert([{
        user_id: user.id,
        amount: loanAmount,
        duration: this.duration,
        status: status
      }]);
        
      this.loading = false;

      if (error) {
        this.errorMessage = 'Loan request failed!';
      } else {
        if (status === 'approved') {
          this.successMessage = 'Loan approved! Funds will be disbursed shortly.';
        } else if (status === 'pending') {
          this.successMessage = 'Loan is under review.';
        } else {
          this.errorMessage = 'Loan request rejected!';
        }

        this.amount = '';
        this.duration = '';
      }
    }

    this.cdr.detectChanges();
  }
}