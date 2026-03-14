import { Component } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { LucideAngularModule, Home, Wallet, ArrowLeftRight, LayoutList, User, Settings, LogOut } from 'lucide-angular';
import { supabase } from '../../features/auth/login/supabase';

@Component({
  selector: 'app-layout',
  imports: [LucideAngularModule, RouterLink, RouterLinkActive, RouterOutlet],
  templateUrl: './layout.html',
  styleUrl: './layout.css'
})
export class LayoutComponent {
  readonly Home = Home;
  readonly Wallet = Wallet;
  readonly ArrowLeftRight = ArrowLeftRight;
  readonly LayoutList = LayoutList;
  readonly User = User;
  readonly Settings = Settings;
  readonly LogOut = LogOut;

  constructor(private router: Router) {}

  async logout() {
    await supabase.auth.signOut();
    this.router.navigate(['/login']);
  }
}