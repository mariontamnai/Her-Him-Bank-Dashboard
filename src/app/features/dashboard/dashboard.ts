import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LucideAngularModule } from 'lucide-angular';
import { Home, Wallet, ArrowLeftRight, LayoutList, User, Settings, LogOut, Send, Download, FileText, Phone } from '../../shared/icons/icons';

@Component({
  selector: 'app-dashboard',
  imports: [LucideAngularModule, RouterLink ],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class DashboardComponent {
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
}