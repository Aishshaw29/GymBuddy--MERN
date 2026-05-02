import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatSnackBarModule
  ],
  template: `
    <div class="auth-container gradient-bg">
      <div class="auth-card-wrapper animate-up">
        <mat-card class="auth-card glass card-glow">
          <mat-card-header>
            <mat-icon class="logo-icon">fitness_center</mat-icon>
            <mat-card-title>Welcome Back</mat-card-title>
            <mat-card-subtitle>Login to your GymBuddy account</mat-card-subtitle>
          </mat-card-header>
          
          <mat-card-content>
            <form [formGroup]="loginForm" (ngSubmit)="onSubmit()" class="auth-form">
              <mat-form-field appearance="outline">
                <mat-label>Email address</mat-label>
                <input matInput formControlName="email" type="email" placeholder="user&#64;example.com">
                <mat-icon matPrefix>email</mat-icon>
                <mat-error *ngIf="loginForm.get('email')?.hasError('required')">Email is required</mat-error>
                <mat-error *ngIf="loginForm.get('email')?.hasError('email')">Invalid email address</mat-error>
              </mat-form-field>

              <mat-form-field appearance="outline">
                <mat-label>Password</mat-label>
                <input matInput [type]="hidePassword ? 'password' : 'text'" formControlName="password">
                <mat-icon matPrefix>lock</mat-icon>
                <button mat-icon-button matSuffix (click)="hidePassword = !hidePassword" type="button">
                  <mat-icon>{{ hidePassword ? 'visibility_off' : 'visibility' }}</mat-icon>
                </button>
                <mat-error *ngIf="loginForm.get('password')?.hasError('required')">Password is required</mat-error>
              </mat-form-field>

              <button mat-flat-button color="primary" type="submit" [disabled]="loginForm.invalid || isLoading" class="submit-btn" [class.loading]="isLoading">
                {{ isLoading ? 'Logging in...' : 'Login' }}
              </button>
            </form>

            <div class="auth-footer">
              <p>Don't have an account? <a routerLink="/register">Sign up</a></p>
            </div>
          </mat-card-content>
        </mat-card>

        <div class="demo-panel glass animate-up" style="animation-delay: 0.1s">
          <h3><mat-icon>info</mat-icon> Demo Credentials</h3>
          <div class="demo-grid">
            <div class="demo-item">
              <span>USER:</span>
               <code>user&#64;demo.com / password123</code>
            </div>
            <div class="demo-item">
              <span>SELLER:</span>
               <code>seller&#64;demo.com / password123</code>
            </div>
            <div class="demo-item">
              <span>ADMIN:</span>
               <code>admin&#64;demo.com / password123</code>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .auth-container {
      display: flex;
      justify-content: center;
      align-items: center;
      padding: 20px;
    }
    .auth-card-wrapper {
      width: 100%;
      max-width: 450px;
      display: flex;
      flex-direction: column;
      gap: 20px;
    }
    .auth-card {
      padding: 30px;
      text-align: center;
    }
    .logo-icon {
      font-size: 40px;
      width: 40px;
      height: 40px;
      margin: 0 auto 16px;
      color: #38bdf8;
    }
    mat-card-title {
      font-size: 28px;
      font-weight: 800;
      margin-bottom: 8px !important;
      color: #f8fafc;
    }
    mat-card-subtitle {
      color: #94a3b8;
      margin-bottom: 30px !important;
    }
    .auth-form {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }
    mat-form-field { width: 100%; }
    .submit-btn {
      height: 50px;
      font-size: 16px;
      font-weight: 600;
      border-radius: 12px;
      margin-top: 10px;
    }
    .auth-footer {
      margin-top: 24px;
      color: #94a3b8;
      font-size: 14px;
    }
    .auth-footer a {
      color: #38bdf8;
      text-decoration: none;
      font-weight: 600;
    }
    .demo-panel {
      padding: 20px;
      border-radius: 16px;
    }
    .demo-panel h3 {
      font-size: 14px;
      font-weight: 700;
      color: #38bdf8;
      margin: 0 0 12px 0;
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .demo-grid {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }
    .demo-item {
      font-size: 12px;
      display: flex;
      justify-content: space-between;
      color: #94a3b8;
    }
    code {
      color: #22c55e;
      background: rgba(34, 197, 94, 0.1);
      padding: 2px 6px;
      border-radius: 4px;
    }
    .animate-up {
      animation: slideUp 0.6s ease-out forwards;
    }
    @keyframes slideUp {
      from { transform: translateY(20px); opacity: 0; }
      to { transform: translateY(0); opacity: 1; }
    }
  `]
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);
  private snackBar = inject(MatSnackBar);

  loginForm: FormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]]
  });

  isLoading = false;
  hidePassword = true;

  onSubmit() {
    if (this.loginForm.invalid) return;

    this.isLoading = true;
    this.authService.login(this.loginForm.value).subscribe({
      next: (res) => {
        this.isLoading = false;
        if (res.success) {
          const role = res.user?.role.toLowerCase();
          this.router.navigate([`/${role}`]);
          this.snackBar.open('Login successful!', 'Close', { duration: 3000, panelClass: 'success-snackbar' });
        }
      },
      error: (err) => {
        this.isLoading = false;
        this.snackBar.open(err.error?.message || 'Login failed', 'Close', { duration: 5000 });
      }
    });
  }
}
