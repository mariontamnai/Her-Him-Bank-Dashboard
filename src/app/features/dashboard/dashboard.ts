import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule, Eye, EyeOff, Bell, Search, Smartphone, ArrowLeftRight, Send, Download, FileText, Phone, CreditCard } from 'lucide-angular';
import { Home, Wallet, LayoutList, User, Settings, LogOut } from '../../shared/icons/icons';
import { supabase } from '../auth/login/supabase';
import { CurrencyService } from '../../services/currency';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [LucideAngularModule, RouterLink, CommonModule, FormsModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class DashboardComponent implements OnInit {
  readonly Home = Home;
  readonly Wallet = Wallet;
  readonly ArrowLeftRight = ArrowLeftRight;
  readonly LayoutList = LayoutList;
  readonly User = User;
  readonly Settings = Settings;
  readonly LogOut = LogOut;
  readonly Send = Send;
  readonly Download = Download;
  readonly FileText = FileText;
  readonly Phone = Phone;
  readonly Eye = Eye;
  readonly EyeOff = EyeOff;
  readonly Bell = Bell;
  readonly Search = Search;
  readonly Smartphone = Smartphone;
  readonly CreditCard = CreditCard;

  hideBalance = false;
  userName = '';
  userInitials = '';
  greeting = '';
  today = '';
  totalBalance = 0;
  recentTransactions: any[] = [];
  notifications: any[] = [];
  showNotifications = false;
  searchQuery = '';
  searchResults: any[] = [];
  showSearch = false;
  cardFrozen = false;
  maxLoan = 0;

  constructor(private cdr: ChangeDetectorRef, private router: Router, public currencyService: CurrencyService) {}

  toggleBalance() { this.hideBalance = !this.hideBalance; }

  navigateTo(route: string) { this.router.navigate([route]); }

  toggleNotifications() { this.showNotifications = !this.showNotifications; }

  toggleCardFreeze() {
    this.cardFrozen = !this.cardFrozen;
    alert(this.cardFrozen ? 'Card frozen successfully!' : 'Card unfrozen successfully!');
  }

  showCardDetails() {
    alert('Card Details\n\nCard Number: 4582 3901 2847 4582\nExpiry: 10/27\nCVV: ***\n\nFor security, full details are only shown in branch.');
  }

  applyForLoan() { this.router.navigate(['/loans']); }

  closeSearch() {
    this.searchQuery = '';
    this.searchResults = [];
    this.showSearch = false;
  }

  async onSearch() {
    if (!this.searchQuery.trim()) {
      this.searchResults = [];
      this.showSearch = false;
      return;
    }

    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const { data } = await supabase
        .from('Transactions')
        .select('*')
        .eq('user_id', user.id)
        .or(`recipient_name.ilike.%${this.searchQuery}%,reason.ilike.%${this.searchQuery}%`)
        .limit(5);

      if (data) {
        this.searchResults = data;
        this.showSearch = true;
      }
    }
    this.cdr.detectChanges();
  }

  async ngOnInit() {
    const { data: { user } } = await supabase.auth.getUser();

    if (user) {
      const fullName = user.user_metadata?.['full_name'] as string || user.email as string || 'User';
      this.userName = fullName.includes('@') ? fullName.split('@')[0] : fullName.split(' ')[0];
      this.userInitials = fullName.includes('@')
        ? fullName[0].toUpperCase()
        : fullName.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2);

      const { data: accounts } = await supabase
        .from('Accounts')
        .select('balance')
        .eq('user_id', user.id);

      if (accounts) {
        this.totalBalance = accounts.reduce((sum: number, acc: any) => sum + (acc.balance || 0), 0);
      }

      const { data: transactions } = await supabase
        .from('Transactions')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(5);

      if (transactions) {
        this.recentTransactions = transactions;
        this.notifications = transactions.slice(0, 3);
      }
    }

    const hour = new Date().getHours();
    if (hour < 12) this.greeting = 'Good Morning';
    else if (hour < 17) this.greeting = 'Good Afternoon';
    else this.greeting = 'Good Evening';

    this.today = new Date().toLocaleDateString('en-KE', {
      weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
    });

    this.cdr.detectChanges();
  }
}