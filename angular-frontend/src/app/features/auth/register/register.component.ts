import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatIconModule,
    MatSnackBarModule
  ],
  template: `
    <div class="auth-container gradient-bg">
      <div class="auth-card-wrapper animate-up">
        <mat-card class="auth-card glass card-glow">
          <mat-card-header>
            <mat-icon class="logo-icon">person_add</mat-icon>
            <mat-card-title>Create Account</mat-card-title>
            <mat-card-subtitle>Join the GymBuddy community today</mat-card-subtitle>
          </mat-card-header>
          
          <mat-card-content>
            <form [formGroup]="registerForm" (ngSubmit)="onSubmit()" class="auth-form">
              <mat-form-field appearance="outline">
                <mat-label>Full Name</mat-label>
                <input matInput formControlName="name" placeholder="John Doe">
                <mat-icon matPrefix>person</mat-icon>
                <mat-error *ngIf="registerForm.get('name')?.hasError('required')">Name is required</mat-error>
              </mat-form-field>

              <mat-form-field appearance="outline">
                <mat-label>Email address</mat-label>
                <input matInput formControlName="email" type="email" placeholder="user&#64;example.com">
                <mat-icon matPrefix>email</mat-icon>
                <mat-error *ngIf="registerForm.get('email')?.hasError('required')">Email is required</mat-error>
                <mat-error *ngIf="registerForm.get('email')?.hasError('email')">Invalid email address</mat-error>
              </mat-form-field>

              <mat-form-field appearance="outline">
                <mat-label>Account Type</mat-label>
                <mat-select formControlName="role">
                  <mat-option value="USER">Gym Member (USER)</mat-option>
                  <mat-option value="SELLER">Product Seller (SELLER)</mat-option>
                </mat-select>
                <mat-icon matPrefix>badge</mat-icon>
              </mat-form-field>

              <mat-form-field appearance="outline">
                <mat-label>Password</mat-label>
                <input matInput [type]="hidePassword ? 'password' : 'text'" formControlName="password">
                <mat-icon matPrefix>lock</mat-icon>
                <button mat-icon-button matSuffix (click)="hidePassword = !hidePassword" type="button">
                  <mat-icon>{{ hidePassword ? 'visibility_off' : 'visibility' }}</mat-icon>
                </button>
                <mat-error *ngIf="registerForm.get('password')?.hasError('required')">Password is required</mat-error>
                <mat-error *ngIf="registerForm.get('password')?.hasError('minlength')">Minimum 6 characters</mat-error>
              </mat-form-field>

              <button mat-flat-button color="primary" type="submit" [disabled]="registerForm.invalid || isLoading" class="submit-btn" [class.loading]="isLoading">
                {{ isLoading ? 'Creating Account...' : 'Register' }}
              </button>
            </form>

            <div class="auth-footer">
              <p>Already have an account? <a routerLink="/login">Login</a></p>
            </div>
          </mat-card-content>
        </mat-card>
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
      color: #22c55e;
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
      color: #22c55e;
      text-decoration: none;
      font-weight: 600;
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
export class RegisterComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);
  private snackBar = inject(MatSnackBar);

  registerForm: FormGroup = this.fb.group({
    name: ['', [Validators.required]],
    email: ['', [Validators.required, Validators.email]],
    role: ['USER', [Validators.required]],
    password: ['', [Validators.required, Validators.minLength(6)]]
  });

  isLoading = false;
  hidePassword = true;

  onSubmit() {
    if (this.registerForm.invalid) return;

    this.isLoading = true;
    this.authService.register(this.registerForm.value).subscribe({
      next: (res) => {
        this.isLoading = false;
        if (res.success) {
          const role = res.user?.role.toLowerCase();
          this.router.navigate([`/${role}`]);
          this.snackBar.open('Account created successfully!', 'Close', { duration: 3000 });
        }
      },
      error: (err) => {
        this.isLoading = false;
        this.snackBar.open(err.error?.message || 'Registration failed', 'Close', { duration: 5000 });
      }
    });
  }
}
