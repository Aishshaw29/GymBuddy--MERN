import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatBadgeModule } from '@angular/material/badge';
import { MatMenuModule } from '@angular/material/menu';
import { AuthService } from '../../../core/services/auth.service';
import { CartService } from '../../../core/services/cart.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [
    CommonModule, 
    RouterLink, 
    RouterLinkActive,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatBadgeModule,
    MatMenuModule
  ],
  template: `
    <mat-toolbar class="glass navbar">
      <div class="container">
        <span class="logo text-gradient" routerLink="/">GymBuddy</span>
        
        <span class="spacer"></span>

        <div class="nav-links" *ngIf="authService.currentUser$ | async as user; else guestLinks">
          <!-- Role specific links could go here, or just dashboard link -->
           <button mat-button [routerLink]="['/' + user.role.toLowerCase()]" routerLinkActive="active-link">
             Dashboard
           </button>

           <ng-container *ngIf="user.role === 'USER'">
             <button mat-icon-button class="cart-btn" routerLink="/user/shop">
               <mat-icon matBadge="{{ cartService.cartCount }}" matBadgeColor="accent" [matBadgeHidden]="cartService.cartCount === 0">
                 shopping_cart
               </mat-icon>
             </button>
           </ng-container>

           <button mat-button [matMenuTriggerFor]="profileMenu" class="profile-toggle">
             <mat-icon>account_circle</mat-icon>
             <span class="username">{{ user.name }}</span>
           </button>

           <mat-menu #profileMenu="matMenu" class="glass-menu">
             <div class="menu-header">
               <p class="role-badge">{{ user.role }}</p>
             </div>
             <button mat-menu-item (click)="authService.logout()">
               <mat-icon>logout</mat-icon>
               <span>Logout</span>
             </button>
           </mat-menu>
        </div>

        <ng-template #guestLinks>
          <div class="guest-links">
            <button mat-button routerLink="/login">Login</button>
            <button mat-flat-button color="primary" routerLink="/register">Get Started</button>
          </div>
        </ng-template>
      </div>
    </mat-toolbar>
  `,
  styles: [`
    .navbar {
      position: sticky;
      top: 0;
      z-index: 1000;
      height: 70px;
      border-bottom: 1px solid rgba(255, 255, 255, 0.1);
      background: rgba(15, 23, 42, 0.8) !important;
      backdrop-filter: blur(10px);
    }
    .container {
      display: flex;
      align-items: center;
      width: 100%;
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 16px;
    }
    .logo {
      font-size: 24px;
      font-weight: 800;
      cursor: pointer;
      letter-spacing: -0.5px;
    }
    .spacer {
      flex: 1 1 auto;
    }
    .active-link {
      color: #38bdf8 !important;
    }
    .profile-toggle {
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .username {
      font-weight: 500;
      font-size: 14px;
    }
    .menu-header {
      padding: 8px 16px;
      border-bottom: 1px solid rgba(255,255,255,0.1);
      margin-bottom: 8px;
    }
    .role-badge {
      display: inline-block;
      padding: 2px 8px;
      background: #334155;
      border-radius: 4px;
      font-size: 10px;
      font-weight: bold;
      color: #94a3b8;
      margin: 0;
    }
    @media (max-width: 600px) {
      .username { display: none; }
    }
  `]
})
export class NavbarComponent {
  authService = inject(AuthService);
  cartService = inject(CartService);
}
