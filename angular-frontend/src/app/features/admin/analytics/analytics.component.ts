import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { NgChartsModule } from 'ng2-charts';
import { ChartConfiguration, ChartOptions } from 'chart.js';
import { AdminService } from '../../../core/services/admin.service';
import { LoadingSpinnerComponent } from '../../../shared/components/loading-spinner/loading-spinner.component';

@Component({
  selector: 'app-analytics',
  standalone: true,
  imports: [CommonModule, MatCardModule, NgChartsModule, LoadingSpinnerComponent],
  template: `
    <div class="analytics-page container py-4">
      <header class="page-header animate-up">
        <h1 class="text-gradient">Platform Analytics</h1>
        <p class="subtitle">Real-time health and growth projections</p>
      </header>

      <div class="charts-grid animate-up" style="animation-delay: 0.1s">
        <mat-card class="chart-card glass">
          <mat-card-header>
            <mat-card-title>User Registration Growth</mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <div *ngIf="!isLoading; else loading" class="chart-container">
              <canvas baseChart
                [data]="growthChartData"
                [options]="growthChartOptions"
                [type]="'line'">
              </canvas>
            </div>
          </mat-card-content>
        </mat-card>

        <mat-card class="chart-card glass">
          <mat-card-header>
            <mat-card-title>Category Distribution</mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <div *ngIf="!isLoading; else loading" class="chart-container">
              <canvas baseChart
                [data]="pieChartData"
                [options]="pieChartOptions"
                [type]="'pie'">
              </canvas>
            </div>
          </mat-card-content>
        </mat-card>
      </div>

      <ng-template #loading>
        <app-loading-spinner message="Loading big data..."></app-loading-spinner>
      </ng-template>
    </div>
  `,
  styles: [`
    .analytics-page { max-width: 1200px; margin: 0 auto; padding: 32px 16px; }
    .page-header { margin-bottom: 32px; }
    .charts-grid { 
      display: grid; 
      grid-template-columns: repeat(auto-fit, minmax(450px, 1fr)); 
      gap: 24px; 
    }
    .chart-card { padding: 16px; min-height: 400px; display: flex; flex-direction: column; }
    .chart-container { flex-grow: 1; min-height: 300px; padding-top: 20px; }
    .animate-up { animation: slideUp 0.6s ease-out forwards; }
    @keyframes slideUp { from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
  `]
})
export class AnalyticsComponent implements OnInit {
  private adminService = inject(AdminService);
  isLoading = true;

  // Growth Chart
  public growthChartOptions: ChartOptions = {
    responsive: true,
    scales: { x: { grid: { display: false } }, y: { grid: { color: 'rgba(255,255,255,0.05)' } } }
  };
  public growthChartData: ChartConfiguration<'line'>['data'] = {
    labels: [],
    datasets: [{ 
      data: [], 
      label: 'New Users', 
      borderColor: '#38bdf8', 
      backgroundColor: 'rgba(56, 189, 248, 0.1)', 
      fill: true,
      tension: 0.4
    }]
  };

  // Pie Chart
  public pieChartOptions: ChartOptions = {
    responsive: true,
    plugins: { legend: { position: 'bottom', labels: { color: '#94a3b8' } } }
  };
  public pieChartData: ChartConfiguration<'pie'>['data'] = {
    labels: ['Protein', 'Creatine', 'Pre-workout', 'Vitamins'],
    datasets: [{ 
      data: [300, 150, 100, 80], 
      backgroundColor: ['#38bdf8', '#8b5cf6', '#f59e0b', '#22c55e'],
      borderWidth: 0
    }]
  };

  ngOnInit() {
    this.adminService.getPlatformAnalytics().subscribe({
      next: (res) => {
        if (res.success) {
          const a = res.analytics;
          this.growthChartData.labels = a.userGrowth.map((g: any) => g._id);
          this.growthChartData.datasets[0].data = a.userGrowth.map((g: any) => g.count);
        }
        this.isLoading = false;
      },
      error: () => this.isLoading = false
    });
  }
}
