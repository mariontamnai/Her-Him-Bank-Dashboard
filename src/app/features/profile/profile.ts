
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule, Bell, } from 'lucide-angular';
import { supabase } from '../auth/login/supabase';

@Component({
  selector: 'app-profile',
  imports: [CommonModule, LucideAngularModule],
  templateUrl: './profile.html',
  styleUrl: './profile.css',
})
export class Profile implements OnInit {
  readonly Bell = Bell;
  

  userInitials = '';
  fullName = '';
  email = '';
  phone = '';
  memberSince = '';
  userId = '';

  constructor(private cdr: ChangeDetectorRef) {}

  async ngOnInit() {
    const { data: { user } } = await supabase.auth.getUser();

    if (user) {
      const name = user.user_metadata?.['full_name'] as string || user.email as string || 'User';
      this.fullName = name;
      this.email = user.email || '';
      this.phone = user.user_metadata?.['phone'] || 'Not provided';
      this.userId = 'HH-' + user.id.slice(0, 8).toUpperCase();
      this.memberSince = new Date(user.created_at).toLocaleDateString('en-KE', {
        month: 'long',
        year: 'numeric'
      });

      this.userInitials = name.includes('@')
        ? name[0].toUpperCase()
        : name.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2);
    }
    this.cdr.detectChanges();
  }
}