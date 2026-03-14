import { Component, ChangeDetectorRef } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule, Eye, EyeOff, Mail, Lock } from 'lucide-angular';
import { supabase } from './supabase';

@Component({
  selector: 'app-login',
  imports: [CommonModule, FormsModule, RouterLink, LucideAngularModule],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {
  email = '';
  password = '';
  showPassword = false;
  loading = false;
  activeField = '';
  rememberMe = false;
  errorMessage = '';

  readonly Eye = Eye;
  readonly EyeOff = EyeOff;
  readonly Mail = Mail;
  readonly Lock = Lock;

  constructor(private router: Router, private cdr: ChangeDetectorRef) {}

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  async forgotPassword() {
    if (!this.email) {
      this.errorMessage = 'Please enter your email address first!!';
      return;
    }

    const { error } = await supabase.auth.resetPasswordForEmail(this.email, {
      redirectTo: 'http://localhost:4200/reset-password'
    });

    if (error) {
      this.errorMessage = error.message;
    } else {
      this.errorMessage = '';
      alert('Password reset email sent!! Check your inbox 📧');
    }
    this.cdr.detectChanges();
  }

  async signInWithGoogle() {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: 'http://localhost:4200/dashboard'
      }
    });
    if (error) {
      this.errorMessage = error.message;
      this.cdr.detectChanges();
    }
  }

  async signIn() {
    this.errorMessage = '';

    if (!this.email || !this.password) {
      this.errorMessage = 'Please fill in all fields!!';
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(this.email)) {
      this.errorMessage = 'Please enter a valid email address!!';
      return;
    }

    if (this.password.length < 6) {
      this.errorMessage = 'Password must be at least 6 characters!!';
      return;
    }

    this.loading = true;
    const { error } = await supabase.auth.signInWithPassword({
      email: this.email,
      password: this.password
    });

    this.loading = false;
    if (error) {
      this.errorMessage = 'Incorrect email or password. Please try again!!';
    } else {
      this.router.navigate(['/dashboard']);
    }
    this.cdr.detectChanges();
  }
}