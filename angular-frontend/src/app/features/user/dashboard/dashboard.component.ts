import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { StatCardComponent } from '../../../shared/components/stat-card/stat-card.component';
import { AuthService } from '../../../core/services/auth.service';
import { WorkoutService } from '../../../core/services/workout.service';
import { OrderService } from '../../../core/services/order.service';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink, MatButtonModule, MatIconModule, StatCardComponent],
  template: `
    <div class="dashboard-page container py-4">
      <header class="dashboard-header animate-up">
        <div class="welcome-text">
          <h1 class="text-gradient">Hello, {{ authService.currentUser?.name }}!</h1>
          <p class="subtitle">Ready to crush your goals today?</p>
        </div>
        <div class="actions">
          <button mat-flat-button color="primary" routerLink="/user/fitness-tracker">
            <mat-icon>add</mat-icon> Log Workout
          </button>
        </div>
      </header>

      <div class="stats-grid animate-up" style="animation-delay: 0.1s">
        <app-stat-card 
          label="Total Workouts" 
          [value]="stats.totalWorkouts" 
          icon="fitness_center" 
          iconBg="#0ea5e9">
        </app-stat-card>
        
        <app-stat-card 
          label="Active Calories" 
          [value]="stats.totalCalories" 
          icon="local_fire_department" 
          iconBg="#f59e0b">
        </app-stat-card>
        
        <app-stat-card 
          label="Current Streak" 
          [value]="stats.streak" 
          icon="trending_up" 
          iconBg="#22c55e"
          subtext="Keep it up!">
        </app-stat-card>

        <app-stat-card 
          label="My Orders" 
          [value]="stats.orderCount" 
          icon="shopping_basket" 
          iconBg="#8b5cf6">
        </app-stat-card>
      </div>

      <div class="quick-links animate-up" style="animation-delay: 0.2s">
        <div class="link-card glass" routerLink="/user/fitness-tracker">
          <div class="link-icon" style="background: rgba(14, 165, 233, 0.1); color: #0ea5e9;">
            <mat-icon>analytics</mat-icon>
          </div>
          <div class="link-text">
            <h3>Fitness Analytics</h3>
            <p>View your progress charts and history</p>
          </div>
          <mat-icon class="arrow">chevron_right</mat-icon>
        </div>

        <div class="link-card glass" routerLink="/user/shop">
          <div class="link-icon" style="background: rgba(34, 197, 94, 0.1); color: #22c55e;">
            <mat-icon>storefont</mat-icon>
          </div>
          <div class="link-text">
            <h3>Visit Shop</h3>
            <p>Browse supplements and gear</p>
          </div>
          <mat-icon class="arrow">chevron_right</mat-icon>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .dashboard-page {
      max-width: 1200px;
      margin: 0 auto;
      padding: 32px 16px;
    }
    .dashboard-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 40px;
    }
    .welcome-text h1 {
      font-size: 32px;
      font-weight: 800;
      margin: 0;
      letter-spacing: -0.5px;
    }
    .subtitle {
      color: #94a3b8;
      font-size: 16px;
      margin: 4px 0 0 0;
    }
    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
      gap: 24px;
      margin-bottom: 40px;
    }
    .quick-links {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
      gap: 24px;
    }
    .link-card {
      display: flex;
      align-items: center;
      padding: 24px;
      cursor: pointer;
      transition: all 0.3s ease;
      text-decoration: none;
      color: inherit;
    }
    .link-card:hover {
      transform: scale(1.02);
      border-color: rgba(56, 189, 248, 0.3);
      background: rgba(15, 23, 42, 0.4);
    }
    .link-icon {
      width: 50px;
      height: 50px;
      border-radius: 12px;
      display: flex;
      justify-content: center;
      align-items: center;
      margin-right: 20px;
    }
    .link-text h3 {
      font-size: 18px;
      font-weight: 700;
      margin: 0 0 4px 0;
      color: #f8fafc;
    }
    .link-text p {
      margin: 0;
      color: #94a3b8;
      font-size: 14px;
    }
    .arrow {
      margin-left: auto;
      color: #334155;
    }
    .h-100 { height: 100%; }
    .animate-up {
      animation: slideUp 0.6s ease-out forwards;
    }
    @keyframes slideUp {
      from { transform: translateY(20px); opacity: 0; }
      to { transform: translateY(0); opacity: 1; }
    }
  `]
})
export class DashboardComponent implements OnInit {
  authService = inject(AuthService);
  private workoutService = inject(WorkoutService);
  private orderService = inject(OrderService);

  stats = {
    totalWorkouts: 0,
    totalCalories: 0,
    streak: 0,
    orderCount: 0
  };

  ngOnInit() {
    this.loadStats();
  }

  loadStats() {
    forkJoin({
      analytics: this.workoutService.getAnalytics('month'),
      orders: this.orderService.getUserOrders()
    }).subscribe({
      next: (res) => {
        if (res.analytics.success) {
          const a = res.analytics.analytics;
          this.stats.totalWorkouts = a.totalWorkouts;
          this.stats.totalCalories = a.totalCaloriesBurned;
          this.stats.streak = a.currentStreak;
        }
        if (res.orders.success) {
          this.stats.orderCount = res.orders.count;
        }
      }
    });
  }
}
