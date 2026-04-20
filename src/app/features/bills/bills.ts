import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule, Bell, Search, Zap, Tv, Wifi, Droplets, GraduationCap, Phone, Smartphone, ShoppingBag } from 'lucide-angular';
import { supabase } from '../auth/login/supabase';
import { CurrencyService } from '../../services/currency';

@Component({
  selector: 'app-bills',
  imports: [CommonModule, FormsModule, LucideAngularModule],
  templateUrl: './bills.html',
  styleUrl: './bills.css',
})
export class Bills implements OnInit {
  readonly Bell = Bell;
  readonly Search = Search;
  readonly Zap = Zap;
  readonly Tv = Tv;
  readonly Wifi = Wifi;
  readonly Droplets = Droplets;
  readonly GraduationCap = GraduationCap;
  readonly Phone = Phone;
  readonly Smartphone = Smartphone;
  readonly ShoppingBag = ShoppingBag;

  userInitials = '';
  selectedBill: any = null;
  accountNumber = '';
  amount = '';
  accounts: any[] = [];
  selectedAccount = '';
  loading = false;
  successMessage = '';
  errorMessage = '';

  bills = [
    { id: 'kplc', name: 'KPLC', description: 'Kenya Power & Lighting', icon: '⚡', color: '#f39c12', category: 'Utilities' },
    { id: 'dstv', name: 'DSTV', description: 'Digital TV Subscription', icon: '📺', color: '#3498db', category: 'Entertainment' },
    { id: 'internet', name: 'Internet', description: 'Internet & Data Bills', icon: '🌐', color: '#9b59b6', category: 'Utilities' },
    { id: 'water', name: 'Water', description: 'Water & Sewerage Bills', icon: '💧', color: '#2980b9', category: 'Utilities' },
    { id: 'school', name: 'School', description: 'School Fees Payment', icon: '🏫', color: '#27ae60', category: 'Education' },
    { id: 'airtime', name: 'Airtime', description: 'Buy Airtime & Bundles', icon: '📱', color: '#e74c3c', category: 'Telecoms' },
    { id: 'gotv', name: 'GoTV', description: 'GoTV Subscription', icon: '📡', color: '#e67e22', category: 'Entertainment' },
    { id: 'nairobi_water', name: 'Nairobi Water', description: 'Nairobi Water & Sewerage', icon: '🚰', color: '#1abc9c', category: 'Utilities' },
  ];

  constructor(private cdr: ChangeDetectorRef, public currencyService: CurrencyService) {}

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
      }
    }
    this.cdr.detectChanges();
  }

  selectBill(bill: any) {
    this.selectedBill = bill;
    this.accountNumber = '';
    this.amount = '';
    this.successMessage = '';
    this.errorMessage = '';
    this.cdr.detectChanges();
  }

  closeBill() {
    this.selectedBill = null;
    this.cdr.detectChanges();
  }

  async payBill() {
    this.errorMessage = '';
    this.successMessage = '';

    if (!this.accountNumber || !this.amount) {
      this.errorMessage = 'Please fill in all fields!!';
      return;
    }

    if (parseFloat(this.amount) <= 0) {
      this.errorMessage = 'Please enter a valid amount!!';
      return;
    }

    this.loading = true;
    const { data: { user } } = await supabase.auth.getUser();

    if (user) {
      const { error } = await supabase.from('Transactions').insert([{
        user_id: user.id,
        account_id: this.selectedAccount,
        type: 'debit',
        amount: parseFloat(this.amount),
        currency: 'KES',
        recipient_name: this.selectedBill.name,
        recipient_account: this.accountNumber,
        reason: `${this.selectedBill.description} payment`,
        status: 'completed'
      }]);

      this.loading = false;

      if (error) {
        this.errorMessage = 'Payment failed!! Please try again!!';
      } else {
        this.successMessage = `${this.selectedBill.name} payment of KES ${this.amount} was successful!!`;
        this.accountNumber = '';
        this.amount = '';
      }
    }

    this.cdr.detectChanges();
  }
}