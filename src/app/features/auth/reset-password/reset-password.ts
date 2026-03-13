import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule, Eye, EyeOff, Lock } from 'lucide-angular';
import { supabase } from '../login/supabase';

@Component({
  selector: 'app-reset-password',
  imports: [CommonModule, FormsModule, LucideAngularModule],
  templateUrl: './reset-password.html',
  styleUrl: './reset-password.css'
})
export class ResetPassword {
  password = '';
  confirmPassword = '';
  showPassword = false;
  loading = false;
  errorMessage = '';
  successMessage = '';

  readonly Eye = Eye;
  readonly EyeOff = EyeOff;
  readonly Lock = Lock;

  constructor(private router: Router) {}

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  async updatePassword() {
    this.errorMessage = '';

    if (!this.password || !this.confirmPassword) {
      this.errorMessage = 'Please fill in all fields!!';
      return;
    }

    if (this.password !== this.confirmPassword) {
      this.errorMessage = 'Passwords do not match!!';
      return;
    }

    if (this.password.length < 8) {
      this.errorMessage = 'Password must be at least 8 characters!!';
      return;
    }

    if (!/[A-Z]/.test(this.password)) {
      this.errorMessage = 'Password must contain at least one uppercase letter!!';
      return;
    }

    if (!/[0-9]/.test(this.password)) {
      this.errorMessage = 'Password must contain at least one number!!';
      return;
    }

    if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(this.password)) {
      this.errorMessage = 'Password must contain at least one special character!!';
      return;
    }

    this.loading = true;
    const { error } = await supabase.auth.updateUser({
      password: this.password
    });

    this.loading = false;
    if (error) {
      this.errorMessage = error.message;
    } else {
      this.successMessage = 'Password updated successfully!!';
      setTimeout(() => this.router.navigate(['/login']), 2000);
    }
  }
}