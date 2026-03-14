import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { LucideAngularModule } from 'lucide-angular';
import { Home, Wallet, ArrowLeftRight, LayoutList, User, Settings, LogOut, Send, Download, FileText, Phone } from '../../shared/icons/icons';
import { supabase } from '../auth/login/supabase';

@Component({
  selector: 'app-dashboard',
  imports: [LucideAngularModule, RouterLink, CommonModule],
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

  userName = '';
  userInitials = '';
  greeting = '';
  today = '';

  constructor(private cdr: ChangeDetectorRef) {}

  async ngOnInit() {
    console.log('ngOnInit called!!');
    const { data: { user } } = await supabase.auth.getUser();

    console.log('user data:', user);

    if (user) {
      const fullName = user.user_metadata?.['full_name'] as string || user.email as string || 'User';
      this.userName = fullName.includes('@') ? fullName.split('@')[0] : fullName.split(' ')[0];
      this.userInitials = fullName.includes('@') 
      ? fullName[0].toUpperCase() 
      : fullName.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2);
    }

    const hour = new Date().getHours();
    if (hour < 12) this.greeting = 'Good Morning';
    else if (hour < 17) this.greeting = 'Good Afternoon';
    else this.greeting = 'Good Evening';

    this.today = new Date().toLocaleDateString('en-KE', {
  weekday: 'long',
  day: 'numeric',
  month: 'long',
  year: 'numeric'
});

this.cdr.detectChanges();
  }
}