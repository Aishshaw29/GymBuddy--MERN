import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { AdminService } from '../../../core/services/admin.service';
import { User } from '../../../core/models/user.model';
import { LoadingSpinnerComponent } from '../../../shared/components/loading-spinner/loading-spinner.component';

@Component({
  selector: 'app-seller-approvals',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatTableModule, MatButtonModule, MatIconModule, MatSnackBarModule, LoadingSpinnerComponent],
  template: `
    <div class="approvals-page container py-4">
      <header class="page-header animate-up">
        <h1 class="text-gradient">Seller Approvals</h1>
        <p class="subtitle">Review and verify businesses wanting to sell on GymBuddy</p>
      </header>

      <mat-card class="glass card-glow animate-up" style="animation-delay: 0.1s">
        <mat-card-content>
          <div *ngIf="!isLoading; else loading">
            <table mat-table [dataSource]="pendingSellers" class="w-100" *ngIf="pendingSellers.length > 0; else empty">
              
              <ng-container matColumnDef="name">
                <th mat-header-cell *mat-header-cell>Business Name</th>
                <td mat-cell *mat-cell="let s"><b>{{ s.name }}</b></td>
              </ng-container>

              <ng-container matColumnDef="email">
                <th mat-header-cell *mat-header-cell>Email</th>
                <td mat-cell *mat-cell="let s">{{ s.email }}</td>
              </ng-container>

              <ng-container matColumnDef="date">
                <th mat-header-cell *mat-header-cell>Applied On</th>
                <td mat-cell *mat-cell="let s">{{ '2026-03-12' | date }}</td>
              </ng-container>

              <ng-container matColumnDef="actions">
                <th mat-header-cell *mat-header-cell>Actions</th>
                <td mat-cell *mat-cell="let s">
                  <button mat-flat-button color="primary" class="me-2" (click)="onApprove(s._id!)">
                    <mat-icon>check</mat-icon> Approve
                  </button>
                  <button mat-stroked-button color="warn" (click)="onReject(s._id!)">
                    <mat-icon>close</mat-icon> Reject
                  </button>
                </td>
              </ng-container>

              <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
              <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
            </table>

            <ng-template #empty>
              <div class="empty-state">
                <mat-icon>verified</mat-icon>
                <p>No pending seller applications. You're all caught up!</p>
              </div>
            </ng-template>
          </div>

          <ng-template #loading>
            <app-loading-spinner message="Checking for pending applications..."></app-loading-spinner>
          </ng-template>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .approvals-page { max-width: 1000px; margin: 0 auto; padding: 32px 16px; }
    .page-header { margin-bottom: 32px; }
    .w-100 { width: 100%; }
    .me-2 { margin-right: 8px; }
    .empty-state { padding: 60px; text-align: center; color: #94a3b8; }
    .empty-state mat-icon { font-size: 64px; width: 64px; height: 64px; margin-bottom: 16px; color: #38bdf8; }
    .animate-up { animation: slideUp 0.6s ease-out forwards; }
    @keyframes slideUp { from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
  `]
})
export class SellerApprovalsComponent implements OnInit {
  private adminService = inject(AdminService);
  private snackBar = inject(MatSnackBar);

  pendingSellers: User[] = [];
  isLoading = true;
  displayedColumns = ['name', 'email', 'date', 'actions'];

  ngOnInit() {
    this.loadPending();
  }

  loadPending() {
    this.isLoading = true;
    this.adminService.getUsers().subscribe({
      next: (res) => {
        if (res.success) {
          // Filter for users who are sellers but not yet active or just all sellers for demo
          this.pendingSellers = res.users.filter(u => u.role === 'SELLER');
        }
        this.isLoading = false;
      },
      error: () => this.isLoading = false
    });
  }

  onApprove(id: string) {
    this.adminService.approveSeller(id).subscribe(res => {
      if (res.success) {
        this.snackBar.open('Seller account verified!', 'Close', { duration: 3000 });
        this.loadPending();
      }
    });
  }

  onReject(id: string) {
    this.snackBar.open('Application rejected', 'Close', { duration: 3000 });
    this.loadPending();
  }
}
