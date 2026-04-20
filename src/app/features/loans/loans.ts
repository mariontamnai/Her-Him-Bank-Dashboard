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

  constructor(private cdr: ChangeDetectorRef, public currencyService: CurrencyService) {}

  ngOnInit() {}

  async applyLoan() {
    this.errorMessage = '';
    this.successMessage = '';

    if (!this.amount || !this.duration) {
      this.errorMessage = 'Fill all fields!';
      return;
    }

    if (parseFloat(this.amount) <= 0) {
      this.errorMessage = 'Invalid amount!';
      return;
    }

    this.loading = true;

    const { data: { user } } = await supabase.auth.getUser();

    if (user) {
      const { error } = await supabase.from('Loans').insert([{
        user_id: user.id,
        amount: parseFloat(this.amount),
        duration: this.duration,
        status: 'pending'
      }]);

      this.loading = false;

      if (error) {
        this.errorMessage = 'Loan request failed!';
      } else {
        this.successMessage = 'Loan request submitted successfully!';
        this.amount = '';
        this.duration = '';
      }
    }

    this.cdr.detectChanges();
  }
}