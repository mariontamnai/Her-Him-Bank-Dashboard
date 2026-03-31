import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { LucideAngularModule, Bell, } from 'lucide-angular';
import { CurrencyService } from '../../services/currency';
import { supabase } from '../auth/login/supabase';

@Component({
  selector: 'app-settings',
  imports: [CommonModule, FormsModule, LucideAngularModule],
  templateUrl: './settings.html',
  styleUrl: './settings.css',
})
export class Settings implements OnInit {
  readonly Bell = Bell;
  

  userInitials = '';
  fullName = '';
  email = '';
  phone = '';
  editingName = false;
  editingEmail = false;
  editingPhone = false;
  editName = '';
  editEmail = '';
  editPhone = '';
  successMessage = '';

  qrCode = '';
  verifyCode = '';
  mfaFactorId = '';
  showQR = false;
  mfaEnabled = false;

  emailNotifications = true;
  smsNotifications = true;
  pushNotifications = true;

  biometricLogin = false;
  biometricSupported = false;
  biometricRegistered = false;
  language = 'english';
  currency = 'KES';
  constructor(private cdr: ChangeDetectorRef, private router: Router, public currencyService: CurrencyService) {}

  async checkBiometricSupport() {
  if (window.PublicKeyCredential) {
    this.biometricSupported = await PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable();
  }
  const saved = localStorage.getItem('biometricRegistered');
  if (saved === 'true') this.biometricRegistered = true;
  this.cdr.detectChanges();
}

async enableBiometric() {
  if (!this.biometricSupported) {
    this.successMessage = ' Biometric authentication not supported on this device!!';
    this.cdr.detectChanges();
    return;
  }

  try {
    const credential = await navigator.credentials.create({
      publicKey: {
        challenge: crypto.getRandomValues(new Uint8Array(32)),
        rp: {
          name: 'Her&Him Bank',
          id: window.location.hostname
        },
        user: {
          id: new TextEncoder().encode(this.email),
          name: this.email,
          displayName: this.fullName
        },
        pubKeyCredParams: [
          { alg: -7, type: 'public-key' },
          { alg: -257, type: 'public-key' }
        ],
        authenticatorSelection: {
          authenticatorAttachment: 'platform',
          userVerification: 'required'
        },
        timeout: 60000
      }
    });

    if (credential) {
      localStorage.setItem('biometricRegistered', 'true');
      this.biometricRegistered = true;
      this.biometricLogin = true;
      this.successMessage = ' Biometric login enabled successfully!!';
      this.cdr.detectChanges();
    }
  } catch (error: any) {
    this.successMessage = ' Biometric setup failed: ' + error.message;
    this.cdr.detectChanges();
  }
}

async disableBiometric() {
  localStorage.removeItem('biometricRegistered');
  this.biometricRegistered = false;
  this.biometricLogin = false;
  this.successMessage = ' Biometric login disabled!!';
  this.cdr.detectChanges();
}

  async enableTwoFA() {
  const { data, error } = await supabase.auth.mfa.enroll({
    factorType: 'totp',
    friendlyName: 'Her&Him Bank'
  });

  if (error) {
    this.successMessage = 'Error enabling 2FA: ' + error.message;
    return;
  }

  if (data) {
    this.qrCode = data.totp.qr_code;
    this.mfaFactorId = data.id;
    this.showQR = true;
    this.cdr.detectChanges();
  }
}

async verifyTwoFA() {
  const { data, error } = await supabase.auth.mfa.challengeAndVerify({
    factorId: this.mfaFactorId,
    code: this.verifyCode
  });

  if (error) {
    this.successMessage = 'Invalid code!! Please try again!!';
    return;
  }

  if (data) {
    this.mfaEnabled = true;
    this.showQR = false;
    this.successMessage = 'Two Factor Authentication enabled successfully!!';
    this.cdr.detectChanges();
  }
}

  async saveName() {
  const { error } = await supabase.auth.updateUser({
    data: { full_name: this.editName }
  });
  if (!error) {
    this.fullName = this.editName;
    this.userInitials = this.editName.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2);
    this.editingName = false;
    this.successMessage = 'Name updated successfully!!';
  }
  this.cdr.detectChanges();
}

async saveEmail() {
  const { error } = await supabase.auth.updateUser({
    email: this.editEmail
  });
  if (!error) {
    this.email = this.editEmail;
    this.editingEmail = false;
    this.successMessage = 'Email updated!! Check your inbox to confirm!!';
  }
  this.cdr.detectChanges();
}

async savePhone() {
  const { error } = await supabase.auth.updateUser({
    data: { phone: this.editPhone }
  });
  if (!error) {
    this.phone = this.editPhone;
    this.editingPhone = false;
    this.successMessage = 'Phone number updated successfully!!';
  }
  this.cdr.detectChanges();
}
  


  async ngOnInit() {
    const { data: { user } } = await supabase.auth.getUser();

    if (user) {
      const name = user.user_metadata?.['full_name'] as string || user.email as string || 'User';
      this.fullName = name;
      this.email = user.email || '';
      this.phone = user.user_metadata?.['phone'] || 'Not provided';
      this.userInitials = name.includes('@')
        ? name[0].toUpperCase()
        : name.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2);
      this.editName = this.fullName;
      this.editEmail = this.email;
      this.editPhone = this.phone;
    }

    this.cdr.detectChanges();
    await this.checkBiometricSupport();
  }

  changePassword() {
    this.router.navigate(['/reset-password']);
  }
}