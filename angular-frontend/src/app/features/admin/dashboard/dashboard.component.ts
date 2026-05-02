import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { StatCardComponent } from '../../../shared/components/stat-card/stat-card.component';
import { AdminService } from '../../../core/services/admin.service';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink, MatButtonModule, MatIconModule, StatCardComponent],
  template: `
    <div class="dashboard-page container py-4">
      <header class="dashboard-header animate-up">
        <div class="welcome-text">
          <h1 class="text-gradient">Platform Admin</h1>
          <p class="subtitle">GymBuddy system overview and control</p>
        </div>
        <div class="actions">
          <button mat-flat-button color="warn" routerLink="/admin/analytics">
             <mat-icon>insights</mat-icon> Detailed Reports
          </button>
        </div>
      </header>

      <div class="stats-grid animate-up" style="animation-delay: 0.1s">
        <app-stat-card 
          label="Total Users" 
          [value]="stats.totalUsers" 
          icon="people" 
          iconBg="#38bdf8">
        </app-stat-card>
        
        <app-stat-card 
          label="Total Sellers" 
          [value]="stats.totalSellers" 
          icon="storefront" 
          iconBg="#f59e0b">
        </app-stat-card>
        
        <app-stat-card 
          label="Total Products" 
          [value]="stats.totalProducts" 
          icon="inventory_2" 
          iconBg="#22c55e">
        </app-stat-card>

        <app-stat-card 
          label="Platform Orders" 
          [value]="stats.totalOrders" 
          icon="shopping_bag" 
          iconBg="#8b5cf6">
        </app-stat-card>
      </div>

      <div class="quick-links animate-up" style="animation-delay: 0.2s">
        <div class="link-card glass" routerLink="/admin/users">
          <div class="link-icon" style="background: rgba(14, 165, 233, 0.1); color: #0ea5e9;">
            <mat-icon>manage_accounts</mat-icon>
          </div>
          <div class="link-text">
            <h3>User Management</h3>
            <p>Restrict, delete or promote users</p>
          </div>
          <mat-icon class="arrow">chevron_right</mat-icon>
        </div>

        <div class="link-card glass" routerLink="/admin/seller-approvals">
          <div class="link-icon" style="background: rgba(34, 197, 94, 0.1); color: #22c55e;">
            <mat-icon>verified_user</mat-icon>
          </div>
          <div class="link-text">
            <h3>Seller Approvals</h3>
            <p>Review and verify new seller accounts</p>
          </div>
          <mat-icon class="arrow">chevron_right</mat-icon>
        </div>

        <div class="link-card glass" routerLink="/admin/products">
          <div class="link-icon" style="background: rgba(245, 158, 11, 0.1); color: #f59e0b;">
            <mat-icon>gavel</mat-icon>
          </div>
          <div class="link-text">
            <h3>Content Moderation</h3>
            <p>Monitor products and remove policy violations</p>
          </div>
          <mat-icon class="arrow">chevron_right</mat-icon>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .dashboard-page { max-width: 1200px; margin: 0 auto; padding: 32px 16px; }
    .dashboard-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 40px; }
    .welcome-text h1 { font-size: 32px; font-weight: 800; margin: 0; }
    .subtitle { color: #94a3b8; font-size: 16px; }
    .stats-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 24px; margin-bottom: 40px; }
    .quick-links { display: grid; grid-template-columns: repeat(auto-fit, minmax(350px, 1fr)); gap: 24px; }
    .link-card { display: flex; align-items: center; padding: 24px; cursor: pointer; transition: all 0.3s ease; text-decoration: none; color: inherit; }
    .link-card:hover { transform: scale(1.02); background: rgba(15, 23, 42, 0.4); }
    .link-icon { width: 50px; height: 50px; border-radius: 12px; display: flex; justify-content: center; align-items: center; margin-right: 20px; }
    .link-text h3 { font-size: 18px; font-weight: 700; margin: 0; color: #f8fafc; }
    .link-text p { margin: 4px 0 0 0; color: #94a3b8; font-size: 14px; }
    .arrow { margin-left: auto; color: #334155; }
    .animate-up { animation: slideUp 0.6s ease-out forwards; }
    @keyframes slideUp { from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
  `]
})
export class DashboardComponent implements OnInit {
  private adminService = inject(AdminService);

  stats = {
    totalUsers: 0,
    totalSellers: 0,
    totalProducts: 0,
    totalOrders: 0
  };

  ngOnInit() {
    this.adminService.getPlatformAnalytics().subscribe({
      next: (res) => {
        if (res.success) {
          const a = res.analytics;
          this.stats.totalUsers = a.userGrowth.reduce((sum: number, g: any) => sum + g.count, 0);
          this.stats.totalSellers = Math.floor(this.stats.totalUsers * 0.1); // Mock ratio if not provided
          this.stats.totalProducts = a.totalProducts;
          this.stats.totalOrders = a.revenueData.length * 10; // Mock
        }
      }
    });
  }
}
