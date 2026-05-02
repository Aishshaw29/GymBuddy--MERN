import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-stat-card',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatIconModule],
  template: `
    <mat-card class="stat-card glass h-100">
      <mat-card-content>
        <div class="stat-content">
          <div class="stat-icon-wrapper" [style.background-color]="iconBg">
            <mat-icon>{{ icon }}</mat-icon>
          </div>
          <div class="stat-info">
            <p class="stat-label">{{ label }}</p>
            <h3 class="stat-value">{{ value }}</h3>
            <p class="stat-subtext" *ngIf="subtext" [class.positive]="isPositive" [class.negative]="!isPositive">
              {{ subtext }}
            </p>
          </div>
        </div>
      </mat-card-content>
    </mat-card>
  `,
  styles: [`
    .stat-card {
      padding: 20px;
      transition: transform 0.2s ease, box-shadow 0.2s ease;
    }
    .stat-card:hover {
      transform: translateY(-4px);
      box-shadow: 0 8px 30px rgba(0,0,0,0.4);
    }
    .stat-content {
      display: flex;
      align-items: center;
      gap: 20px;
    }
    .stat-icon-wrapper {
      width: 56px;
      height: 56px;
      border-radius: 12px;
      display: flex;
      justify-content: center;
      align-items: center;
    }
    .stat-icon-wrapper mat-icon {
      color: white;
      font-size: 28px;
      width: 28px;
      height: 28px;
    }
    .stat-info {
      display: flex;
      flex-direction: column;
    }
    .stat-label {
      color: #94a3b8;
      font-size: 13px;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 1px;
      margin: 0 0 4px 0;
    }
    .stat-value {
      font-size: 24px;
      font-weight: 800;
      margin: 0;
      color: #f8fafc;
    }
    .stat-subtext {
      font-size: 12px;
      margin-top: 4px;
      font-weight: 500;
    }
    .positive { color: #22c55e; }
    .negative { color: #ef4444; }
  `]
})
export class StatCardComponent {
  @Input() icon: string = 'bolt';
  @Input() iconBg: string = '#38bdf8';
  @Input() label: string = 'Metric';
  @Input() value: string | number | null = '0';
  @Input() subtext: string = '';
  @Input() isPositive: boolean = true;
}
