import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule, Eye, EyeOff, Mail, Lock, Phone, User } from 'lucide-angular';
import { supabase } from '../login/supabase';


@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, LucideAngularModule],
  templateUrl: './register.html',
  styleUrl: './register.css'
})
export class Register {
  fullName = '';
  email = '';
  phone = '';
  password = '';
  showPassword = false;
  loading = false;
  activeField = '';
  errorMessage = '';

  readonly Eye = Eye;
  readonly EyeOff = EyeOff;
  readonly Mail = Mail;
  readonly Lock = Lock;
  readonly Phone = Phone;
  readonly User = User;

  constructor(private router: Router) {}

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  async register() {
  this.errorMessage = '';

  if (!this.fullName || !this.email || !this.phone || !this.password) {
  this.errorMessage = 'Please fill in all fields!!';
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

if (!/[a-z]/.test(this.password)) {
  this.errorMessage = 'Password must contain at least one lowercase letter!!';
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
  const { error } = await supabase.auth.signUp({
    email: this.email,
    password: this.password,
    options: {
      data: {
        full_name: this.fullName,
        phone: this.phone
      }
    }
  });

  this.loading = false;
  console.log('error:', error);
  if (error) {
    this.errorMessage = error.message;
  } else {
    this.router.navigate(['/dashboard']);
  }
}
}