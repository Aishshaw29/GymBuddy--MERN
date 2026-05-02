import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, MatListModule, MatIconModule],
  template: `
    <div class="sidebar-container" *ngIf="authService.currentUser$ | async as user">
      <mat-nav-list>
        <div class="nav-section">
          <p class="section-label">General</p>
          <a mat-list-item [routerLink]="['/' + user.role.toLowerCase()]" routerLinkActive="active" [routerLinkActiveOptions]="{exact: true}">
            <mat-icon matListItemIcon>dashboard</mat-icon>
            <span matListItemTitle>Overview</span>
          </a>
        </div>

        <!-- USER Links -->
        <ng-container *ngIf="user.role === 'USER'">
          <div class="nav-section">
            <p class="section-label">Fitness</p>
            <a mat-list-item routerLink="/user/fitness-tracker" routerLinkActive="active">
              <mat-icon matListItemIcon>fitness_center</mat-icon>
              <span matListItemTitle>Tracker</span>
            </a>
          </div>
          <div class="nav-section">
            <p class="section-label">Shopping</p>
            <a mat-list-item routerLink="/user/shop" routerLinkActive="active">
              <mat-icon matListItemIcon>shopping_bag</mat-icon>
              <span matListItemTitle>Store</span>
            </a>
            <a mat-list-item routerLink="/user/my-orders" routerLinkActive="active">
              <mat-icon matListItemIcon>receipt_long</mat-icon>
              <span matListItemTitle>My Orders</span>
            </a>
          </div>
        </ng-container>

        <!-- SELLER Links -->
        <ng-container *ngIf="user.role === 'SELLER'">
          <div class="nav-section">
            <p class="section-label">Management</p>
            <a mat-list-item routerLink="/seller/products" routerLinkActive="active">
              <mat-icon matListItemIcon>inventory_2</mat-icon>
              <span matListItemTitle>My Products</span>
            </a>
            <a mat-list-item routerLink="/seller/orders" routerLinkActive="active">
              <mat-icon matListItemIcon>local_shipping</mat-icon>
              <span matListItemTitle>Store Orders</span>
            </a>
            <a mat-list-item routerLink="/seller/analytics" routerLinkActive="active">
              <mat-icon matListItemIcon>bar_chart</mat-icon>
              <span matListItemTitle>Analytics</span>
            </a>
          </div>
        </ng-container>

        <!-- ADMIN Links -->
        <ng-container *ngIf="user.role === 'ADMIN'">
          <div class="nav-section">
            <p class="section-label">Platform</p>
            <a mat-list-item routerLink="/admin/analytics" routerLinkActive="active">
              <mat-icon matListItemIcon>query_stats</mat-icon>
              <span matListItemTitle>Global Stats</span>
            </a>
            <a mat-list-item routerLink="/admin/users" routerLinkActive="active">
              <mat-icon matListItemIcon>people</mat-icon>
              <span matListItemTitle>User Accounts</span>
            </a>
            <a mat-list-item routerLink="/admin/seller-approvals" routerLinkActive="active">
              <mat-icon matListItemIcon>verified_user</mat-icon>
              <span matListItemTitle>Seller Requests</span>
            </a>
            <a mat-list-item routerLink="/admin/products" routerLinkActive="active">
              <mat-icon matListItemIcon>shopping_basket</mat-icon>
              <span matListItemTitle>All Products</span>
            </a>
          </div>
        </ng-container>
      </mat-nav-list>
    </div>
  `,
  styles: [`
    .sidebar-container {
      height: 100%;
      background: var(--dark-900);
      border-right: 1px solid rgba(255, 255, 255, 0.05);
      padding: 16px 8px;
    }
    .nav-section {
      margin-bottom: 24px;
    }
    .section-label {
      font-size: 11px;
      text-transform: uppercase;
      color: #64748b;
      font-weight: 700;
      letter-spacing: 1px;
      margin-left: 16px;
      margin-bottom: 8px;
    }
    mat-nav-list a {
      margin-bottom: 4px;
      border-radius: 8px !important;
      transition: all 0.2s ease;
    }
    .active {
      background: rgba(14, 165, 233, 0.1) !important;
      color: #38bdf8 !important;
    }
    .active mat-icon {
      color: #38bdf8 !important;
    }
    mat-icon {
      font-size: 20px;
      color: #94a3b8;
    }
    span[matListItemTitle] {
      font-size: 14px;
      font-weight: 500;
    }
  `]
})
export class SidebarComponent {
  authService = inject(AuthService);
}
