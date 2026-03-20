import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule, Bell, Search } from 'lucide-angular';
import { supabase } from '../auth/login/supabase';

@Component({
  selector: 'app-transfer',
  imports: [CommonModule, FormsModule, LucideAngularModule],
  templateUrl: './transfer.html',
  styleUrl: './transfer.css',
})
export class Transfer implements OnInit {
  readonly Bell = Bell;
  readonly Search = Search;

  userInitials = '';
  accounts: any[] = [];
  recentTransfers: any[] = [];
  selectedAccount = '';
  recipientAccount = '';
  recipientName = '';
  amount = '';
  reason = '';
  currency = 'KES';
  loading = false;
  successMessage = '';
  errorMessage = '';
  transferType = 'bank';
  toAccount = '';
  countryCode = '+254';

  constructor(private cdr: ChangeDetectorRef) {}

  async ngOnInit() {
    const { data: { user } } = await supabase.auth.getUser();

    if (user) {
      const fullName = user.user_metadata?.['full_name'] as string || user.email as string || 'User';
      this.userInitials = fullName.includes('@')
        ? fullName[0].toUpperCase()
        : fullName.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2);

      const { data: accounts } = await supabase
        .from('Accounts')
        .select('*')
        .eq('user_id', user.id);

      if (accounts && accounts.length > 0) {
        this.accounts = accounts;
        this.selectedAccount = accounts[0].id;
        this.currency = accounts[0].currency || 'KES';
      }
    }

    await this.loadRecentTransfers();
    this.cdr.detectChanges();
  }

  async loadRecentTransfers() {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const { data } = await supabase
        .from('Transactions')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(5);

      if (data) {
        this.recentTransfers = data;
      }
    }
    this.cdr.detectChanges();
  }

  async sendMoney() {
    this.errorMessage = '';
    this.successMessage = '';

    if (!this.recipientAccount || !this.recipientName || !this.amount) {
      this.errorMessage = 'Please fill in all required fields!!';
      return;
    }

    if (parseFloat(this.amount) <= 0) {
      this.errorMessage = 'Please enter a valid amount!!';
      return;
    }

    this.loading = true;

    const { data: { user } } = await supabase.auth.getUser();

    if (user) {
      const { error } = await supabase.from('Transactions').insert([
        {
          user_id: user.id,
          account_id: this.selectedAccount,
          type: 'debit',
          amount: parseFloat(this.amount),
          currency: this.currency,
          recipient_name: this.recipientName,
          recipient_account: this.recipientAccount,
          reason: this.reason || null,
          status: 'completed'
        }
      ]);

      this.loading = false;

      if (error) {
        this.errorMessage = 'Transfer failed!! Please try again!!';
        console.log('transfer error:', error);
      } else {
        this.successMessage = `${this.currency} ${this.amount} sent successfully to ${this.recipientName}!!`;
        this.recipientAccount = '';
        this.recipientName = '';
        this.amount = '';
        this.reason = '';
        await this.loadRecentTransfers();
      }
    }

    this.cdr.detectChanges();
  }
  getInitials(name: string): string {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  }
}