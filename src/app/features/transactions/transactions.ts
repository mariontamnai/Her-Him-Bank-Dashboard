import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule, Bell, Search } from 'lucide-angular';
import { supabase } from '../auth/login/supabase';

@Component({
  selector: 'app-transactions',
  imports: [CommonModule, FormsModule, LucideAngularModule],
  templateUrl: './transactions.html',
  styleUrl: './transactions.css',
})
export class Transactions implements OnInit {
  readonly Bell = Bell;
  readonly Search = Search;

  userInitials = '';
  allTransactions: any[] = [];
  filteredTransactions: any[] = [];
  activeFilter = 'all';
  searchQuery = '';

  constructor(private cdr: ChangeDetectorRef) {}

  async ngOnInit() {
    const { data: { user } } = await supabase.auth.getUser();

    if (user) {
      const fullName = user.user_metadata?.['full_name'] as string || user.email as string || 'User';
      this.userInitials = fullName.includes('@')
        ? fullName[0].toUpperCase()
        : fullName.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2);

      const { data } = await supabase
        .from('Transactions')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (data) {
        this.allTransactions = data;
        this.filteredTransactions = data;
      }
    }
    this.cdr.detectChanges();
  }

  setFilter(filter: string) {
    this.activeFilter = filter;
    this.applyFilters();
  }

  onSearch() {
  const query = this.searchQuery.toLowerCase();

  if (query === 'credit') {
    this.activeFilter = 'credit';
  } else if (query === 'debit') {
    this.activeFilter = 'debit';
  } else if (query === 'this month' || query === 'month') {
    this.activeFilter = 'month';
  } else {
    this.activeFilter = 'all';
  }

  this.applyFilters();
}

  applyFilters() {
    let filtered = [...this.allTransactions];

    if (this.activeFilter === 'credit') {
      filtered = filtered.filter(t => t.type === 'credit');
    } else if (this.activeFilter === 'debit') {
      filtered = filtered.filter(t => t.type === 'debit');
    } else if (this.activeFilter === 'month') {
      const now = new Date();
      filtered = filtered.filter(t => {
        const date = new Date(t.created_at);
        return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
      });
    }

    if (this.searchQuery) {
      filtered = filtered.filter(t =>
        t.recipient_name?.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        t.reason?.toLowerCase().includes(this.searchQuery.toLowerCase())
      );
    }

    this.filteredTransactions = filtered;
    this.cdr.detectChanges();
  }
}