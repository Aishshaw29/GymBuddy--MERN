import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { NgChartsModule } from 'ng2-charts';
import { ChartConfiguration, ChartOptions } from 'chart.js';
import { OrderService } from '../../../core/services/order.service';
import { LoadingSpinnerComponent } from '../../../shared/components/loading-spinner/loading-spinner.component';

@Component({
  selector: 'app-analytics',
  standalone: true,
  imports: [CommonModule, MatCardModule, NgChartsModule, LoadingSpinnerComponent],
  template: `
    <div class="analytics-page container py-4">
      <header class="page-header animate-up">
        <h1 class="text-gradient">Store Analytics</h1>
        <p class="subtitle">Performance insights and sales trends</p>
      </header>

      <div class="charts-row animate-up" style="animation-delay: 0.1s">
        <mat-card class="chart-card glass">
          <mat-card-header>
            <mat-card-title>Monthly Revenue Trend</mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <div *ngIf="!isLoading; else loading" style="display: block;">
              <canvas baseChart
                [data]="lineChartData"
                [options]="lineChartOptions"
                [type]="'line'">
              </canvas>
            </div>
          </mat-card-content>
        </mat-card>

        <mat-card class="chart-card glass">
          <mat-card-header>
            <mat-card-title>Order Status Distribution</mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <div *ngIf="!isLoading; else loading" style="display: block; height: 300px;">
              <canvas baseChart
                [data]="doughnutChartData"
                [options]="doughnutChartOptions"
                [type]="'doughnut'">
              </canvas>
            </div>
          </mat-card-content>
        </mat-card>
      </div>

      <ng-template #loading>
        <app-loading-spinner message="Crunching numbers..."></app-loading-spinner>
      </ng-template>
    </div>
  `,
  styles: [`
    .analytics-page { max-width: 1200px; margin: 0 auto; padding: 32px 16px; }
    .page-header { margin-bottom: 32px; }
    .charts-row { 
      display: grid; 
      grid-template-columns: repeat(auto-fit, minmax(450px, 1fr)); 
      gap: 24px; 
    }
    .chart-card { padding: 16px; height: 100%; display: flex; flex-direction: column; }
    .mat-mdc-card-content { flex-grow: 1; padding-top: 20px !important; }
    .animate-up { animation: slideUp 0.6s ease-out forwards; }
    @keyframes slideUp { from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
  `]
})
export class AnalyticsComponent implements OnInit {
  private orderService = inject(OrderService);
  isLoading = true;

  // Revenue Line Chart
  public lineChartOptions: ChartOptions = {
    responsive: true,
    scales: { x: { grid: { display: false } }, y: { grid: { color: 'rgba(255,255,255,0.05)' } } }
  };
  public lineChartData: ChartConfiguration<'line'>['data'] = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [{ 
      data: [1200, 1900, 1500, 2100, 2400, 2800], 
      label: 'Revenue', 
      borderColor: '#22c55e', 
      backgroundColor: 'rgba(34, 197, 94, 0.1)', 
      fill: true,
      tension: 0.4
    }]
  };

  // Status Doughnut Chart
  public doughnutChartOptions: ChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { position: 'bottom', labels: { color: '#94a3b8' } } }
  };
  public doughnutChartData: ChartConfiguration<'doughnut'>['data'] = {
    labels: ['Pending', 'Shipped', 'Delivered'],
    datasets: [{ 
      data: [5, 12, 45], 
      backgroundColor: ['#f59e0b', '#38bdf8', '#22c55e'],
      borderWidth: 0
    }]
  };

  ngOnInit() {
    // In a real app, we'd fetch actual data. For demo, we use mocked start values and then stop loading.
    setTimeout(() => {
      this.isLoading = false;
    }, 800);
  }
}
