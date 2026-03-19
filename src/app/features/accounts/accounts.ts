import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule, Bell, Search } from 'lucide-angular';
import { supabase } from '../auth/login/supabase';

@Component({
  selector: 'app-accounts',
  imports: [CommonModule, LucideAngularModule],
  templateUrl: './accounts.html',
  styleUrl: './accounts.css',
})
export class Accounts implements OnInit {
  readonly Bell = Bell;
  readonly Search = Search;

  userInitials = '';
  accounts: any[] = [];
  totalBalance = 0;

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

        if (accounts) {
          this.accounts = accounts;
          this.totalBalance = accounts.reduce((sum, account) => sum + account.balance, 0);
        }
    }
    this.cdr.detectChanges();
  }
}