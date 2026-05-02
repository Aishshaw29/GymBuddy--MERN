import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { NgChartsModule } from 'ng2-charts';
import { ChartConfiguration, ChartOptions, ChartType } from 'chart.js';
import { WorkoutService } from '../../../core/services/workout.service';
import { StatCardComponent } from '../../../shared/components/stat-card/stat-card.component';
import { Workout, WorkoutAnalytics } from '../../../core/models/workout.model';

@Component({
  selector: 'app-fitness-tracker',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatIconModule,
    MatTableModule,
    MatSnackBarModule,
    NgChartsModule,
    StatCardComponent
  ],
  template: `
    <div class="tracker-page container py-4">
      <header class="section-header animate-up">
        <h1 class="text-gradient">Fitness Tracker</h1>
        <p class="subtitle">Track your workouts and see your progress</p>
      </header>

      <div class="stats-grid animate-up">
        <app-stat-card label="Current Streak" [value]="analytics?.currentStreak || 0" icon="bolt" iconBg="#f59e0b"></app-stat-card>
        <app-stat-card label="Workouts (Week)" [value]="analytics?.totalWorkouts || 0" icon="event" iconBg="#38bdf8"></app-stat-card>
        <app-stat-card label="Calories Burned" [value]="analytics?.totalCaloriesBurned || 0" icon="local_fire_department" iconBg="#ef4444"></app-stat-card>
        <app-stat-card label="Longest Streak" [value]="analytics?.longestStreak || 0" icon="workspace_premium" iconBg="#22c55e"></app-stat-card>
      </div>

      <div class="charts-row animate-up" style="animation-delay: 0.1s">
        <mat-card class="chart-card glass">
          <mat-card-header>
            <mat-card-title>Workout Frequency</mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <div style="display: block;">
              <canvas baseChart
                [data]="barChartData"
                [options]="barChartOptions"
                [type]="'bar'">
              </canvas>
            </div>
          </mat-card-content>
        </mat-card>

        <mat-card class="chart-card glass">
          <mat-card-header>
            <mat-card-title>Calories Burned (7 Days)</mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <div style="display: block;">
              <canvas baseChart
                [data]="lineChartData"
                [options]="lineChartOptions"
                [type]="'line'">
              </canvas>
            </div>
          </mat-card-content>
        </mat-card>
      </div>

      <div class="actions-row animate-up" style="animation-delay: 0.2s">
        <mat-card class="log-form-card glass">
          <mat-card-header>
            <mat-card-title>Log New Workout</mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <form [formGroup]="workoutForm" (ngSubmit)="onSubmit()" class="workout-form">
              <div class="form-grid">
                <mat-form-field appearance="outline">
                  <mat-label>Exercise Name</mat-label>
                  <input matInput formControlName="exerciseName">
                  <mat-error *ngIf="workoutForm.get('exerciseName')?.hasError('required')">Required</mat-error>
                </mat-form-field>
 
                <mat-form-field appearance="outline">
                  <mat-label>Workout Type</mat-label>
                  <mat-select formControlName="workoutType">
                    <mat-option value="Strength">Strength</mat-option>
                    <mat-option value="Cardio">Cardio</mat-option>
                    <mat-option value="Flexibility">Flexibility</mat-option>
                  </mat-select>
                </mat-form-field>
 
                <mat-form-field appearance="outline">
                  <mat-label>Sets</mat-label>
                  <input matInput type="number" formControlName="sets">
                </mat-form-field>
 
                <mat-form-field appearance="outline">
                  <mat-label>Reps</mat-label>
                  <input matInput type="number" formControlName="reps">
                </mat-form-field>
 
                <mat-form-field appearance="outline">
                  <mat-label>Weight (kg)</mat-label>
                  <input matInput type="number" formControlName="weight">
                </mat-form-field>
 
                <mat-form-field appearance="outline">
                  <mat-label>Duration (mins)</mat-label>
                  <input matInput type="number" formControlName="duration">
                </mat-form-field>
 
                <mat-form-field appearance="outline">
                  <mat-label>Calories</mat-label>
                  <input matInput type="number" formControlName="caloriesBurned">
                </mat-form-field>
 
                <mat-form-field appearance="outline">
                  <mat-label>Date</mat-label>
                  <input matInput type="date" formControlName="date">
                </mat-form-field>
              </div>
 
              <mat-form-field appearance="outline" class="w-100 mt-2">
                <mat-label>Notes</mat-label>
                <textarea matInput formControlName="notes" rows="3"></textarea>
              </mat-form-field>
 
              <button mat-flat-button color="primary" type="submit" [disabled]="workoutForm.invalid || isLoading" class="save-btn mt-3">
                <mat-icon>save</mat-icon> {{ isLoading ? 'Saving...' : 'Save Workout' }}
              </button>
            </form>
          </mat-card-content>
        </mat-card>
      </div>

      <div class="history-row animate-up" style="animation-delay: 0.3s">
        <mat-card class="history-card glass">
          <mat-card-header>
            <mat-card-title>Recent Workouts</mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <table mat-table [dataSource]="workouts" class="w-100">
              <ng-container matColumnDef="date">
                <th mat-header-cell *mat-header-cell>Date</th>
                <td mat-cell *mat-cell="let w">{{ w.date | date:'shortDate' }}</td>
              </ng-container>
              <ng-container matColumnDef="exercise">
                <th mat-header-cell *mat-header-cell>Exercise</th>
                <td mat-cell *mat-cell="let w"><b>{{ w.exerciseName }}</b></td>
              </ng-container>
              <ng-container matColumnDef="type">
                <th mat-header-cell *mat-header-cell>Type</th>
                <td mat-cell *mat-cell="let w">
                  <span class="badge" [class.strength]="w.workoutType === 'Strength'">{{ w.workoutType }}</span>
                </td>
              </ng-container>
              <ng-container matColumnDef="details">
                <th mat-header-cell *mat-header-cell>Details</th>
                <td mat-cell *mat-cell="let w">{{ w.sets }} x {{ w.reps }} ({{ w.weight }}kg)</td>
              </ng-container>
              <ng-container matColumnDef="calories">
                <th mat-header-cell *mat-header-cell>Cals</th>
                <td mat-cell *mat-cell="let w">{{ w.caloriesBurned }} kcal</td>
              </ng-container>
              <ng-container matColumnDef="actions">
                <th mat-header-cell *mat-header-cell></th>
                <td mat-cell *mat-cell="let w">
                  <button mat-icon-button color="warn" (click)="onDelete(w._id)">
                    <mat-icon>delete_outline</mat-icon>
                  </button>
                </td>
              </ng-container>

              <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
              <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
            </table>

            <div *ngIf="workouts.length === 0" class="empty-state">
              <mat-icon>inbox</mat-icon>
              <p>No workouts logged yet. Start training!</p>
            </div>
          </mat-card-content>
        </mat-card>
      </div>
    </div>
  `,
  styles: [`
    .tracker-page { max-width: 1200px; margin: 0 auto; padding: 32px 16px; }
    .section-header { margin-bottom: 32px; }
    .stats-grid { 
      display: grid; 
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); 
      gap: 20px; 
      margin-bottom: 32px; 
    }
    .charts-row { 
      display: grid; 
      grid-template-columns: repeat(auto-fit, minmax(450px, 1fr)); 
      gap: 24px; 
      margin-bottom: 32px; 
    }
    .chart-card { padding: 16px; }
    .log-form-card { margin-bottom: 32px; }
    .form-grid { 
      display: grid; 
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); 
      gap: 16px; 
      margin-bottom: 16px;
    }
    .w-100 { width: 100%; }
    .history-card { padding: 16px; overflow-x: auto; }
    .badge {
      padding: 4px 10px;
      border-radius: 6px;
      font-size: 11px;
      font-weight: 700;
      background: rgba(148, 163, 184, 0.1);
      color: #94a3b8;
    }
    .badge.strength { background: rgba(56, 189, 248, 0.1); color: #38bdf8; }
    .empty-state {
      padding: 40px;
      text-align: center;
      color: #64748b;
    }
    .empty-state mat-icon { font-size: 48px; width: 48px; height: 48px; margin-bottom: 12px; }
    .animate-up { animation: slideUp 0.6s ease-out forwards; }
    @keyframes slideUp { from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
  `]
})
export class FitnessTrackerComponent implements OnInit {
  private fb = inject(FormBuilder);
  private workoutService = inject(WorkoutService);
  private snackBar = inject(MatSnackBar);

  analytics?: WorkoutAnalytics;
  workouts: Workout[] = [];
  displayedColumns: string[] = ['date', 'exercise', 'type', 'details', 'calories', 'actions'];
  isLoading = false;

  workoutForm: FormGroup = this.fb.group({
    exerciseName: ['', Validators.required],
    workoutType: ['Strength', Validators.required],
    sets: [3, [Validators.required, Validators.min(1)]],
    reps: [10, [Validators.required, Validators.min(1)]],
    weight: [0, [Validators.required, Validators.min(0)]],
    duration: [30, [Validators.required, Validators.min(1)]],
    caloriesBurned: [200, [Validators.required, Validators.min(0)]],
    date: [new Date().toISOString().split('T')[0], Validators.required],
    notes: ['']
  });

  // Chart Data
  public barChartOptions: ChartOptions = {
    responsive: true,
    scales: { x: { grid: { display: false } }, y: { grid: { color: 'rgba(255,255,255,0.05)' } } }
  };
  public barChartData: ChartConfiguration<'bar'>['data'] = {
    labels: [],
    datasets: [{ data: [], label: 'Count', backgroundColor: '#38bdf8' }]
  };

  public lineChartOptions: ChartOptions = {
    responsive: true,
    scales: { x: { grid: { display: false } }, y: { grid: { color: 'rgba(255,255,255,0.05)' } } }
  };
  public lineChartData: ChartConfiguration<'line'>['data'] = {
    labels: [],
    datasets: [{ 
      data: [], 
      label: 'Calories', 
      borderColor: '#f59e0b', 
      backgroundColor: 'rgba(245, 158, 11, 0.1)', 
      fill: true,
      tension: 0.4
    }]
  };

  ngOnInit() {
    this.refreshData();
  }

  refreshData() {
    this.workoutService.getAnalytics('week').subscribe(res => {
      if (res.success) {
        this.analytics = res.analytics;
        this.workouts = res.analytics.workouts;
        this.updateCharts(res.analytics);
      }
    });
  }

  updateCharts(a: WorkoutAnalytics) {
    const dates = Object.keys(a.workoutsByDate).sort();
    this.barChartData.labels = dates;
    this.barChartData.datasets[0].data = dates.map(d => a.workoutsByDate[d]);

    const calDates = Object.keys(a.caloriesByDate).sort();
    this.lineChartData.labels = calDates;
    this.lineChartData.datasets[0].data = calDates.map(d => a.caloriesByDate[d]);
  }

  onSubmit() {
    if (this.workoutForm.invalid) return;
    this.isLoading = true;
    
    // Ensure workoutType matches Mongoose enum expectation (lowercase)
    const payload = {
      ...this.workoutForm.value,
      workoutType: this.workoutForm.value.workoutType.toLowerCase()
    };

    this.workoutService.addWorkout(payload).subscribe({
      next: (res) => {
        this.isLoading = false;
        if (res.success) {
          this.snackBar.open('Workout logged!', 'Close', { duration: 3000 });
          this.workoutForm.reset({
            date: new Date().toISOString().split('T')[0],
            workoutType: 'Strength',
            sets: 3, reps: 10, weight: 0, duration: 30, caloriesBurned: 200
          });
          this.refreshData();
        }
      },
      error: () => this.isLoading = false
    });
  }

  onDelete(id: string) {
    if (confirm('Delete this workout entry?')) {
      this.workoutService.deleteWorkout(id).subscribe(res => {
        if (res.success) {
          this.snackBar.open('Deleted', 'Close', { duration: 2000 });
          this.refreshData();
        }
      });
    }
  }
}
