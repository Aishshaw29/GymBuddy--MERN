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
  selector: 'app-users',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatTableModule, MatButtonModule, MatIconModule, MatSnackBarModule, LoadingSpinnerComponent],
  template: `
    <div class="users-page container py-4">
      <header class="page-header animate-up">
        <h1 class="text-gradient">User Management</h1>
        <p class="subtitle">Supervise and manage all platform accounts</p>
      </header>

      <mat-card class="glass users-card animate-up" style="animation-delay: 0.1s">
        <mat-card-content>
          <div *ngIf="!isLoading; else loading">
            <table mat-table [dataSource]="users" class="w-100">
              
              <ng-container matColumnDef="name">
                <th mat-header-cell *mat-header-cell>Name / Email</th>
                <td mat-cell *mat-cell="let u">
                  <div class="user-info">
                    <b>{{ u.name }}</b>
                    <p class="email-text">{{ u.email }}</p>
                  </div>
                </td>
              </ng-container>

              <ng-container matColumnDef="role">
                <th mat-header-cell *mat-header-cell>Role</th>
                <td mat-cell *mat-cell="let u">
                  <span class="role-badge" [class]="u.role.toLowerCase()">{{ u.role }}</span>
                </td>
              </ng-container>

              <ng-container matColumnDef="status">
                <th mat-header-cell *mat-header-cell>Status</th>
                <td mat-cell *mat-cell="let u">
                   <span class="status-dot" [class.active]="true"></span> Active
                </td>
              </ng-container>

              <ng-container matColumnDef="actions">
                <th mat-header-cell *mat-header-cell>Actions</th>
                <td mat-cell *mat-cell="let u">
                  <button mat-icon-button color="warn" (click)="onDelete(u._id!)" *ngIf="u.role !== 'ADMIN'">
                    <mat-icon>person_remove</mat-icon>
                  </button>
                  <button mat-icon-button (click)="onPromote(u._id!)" [disabled]="u.role !== 'USER'">
                    <mat-icon>upgrade</mat-icon>
                  </button>
                </td>
              </ng-container>

              <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
              <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
            </table>
          </div>

          <ng-template #loading>
            <app-loading-spinner message="Fetching user accounts..."></app-loading-spinner>
          </ng-template>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .users-page { max-width: 1000px; margin: 0 auto; padding: 32px 16px; }
    .page-header { margin-bottom: 32px; }
    .users-card { padding: 8px; overflow-x: auto; }
    .w-100 { width: 100%; }
    .user-info b { color: #f8fafc; font-size: 15px; }
    .email-text { margin: 0; font-size: 12px; color: #94a3b8; }
    .role-badge { padding: 4px 10px; border-radius: 6px; font-size: 10px; font-weight: 700; text-transform: uppercase; }
    .role-badge.user { background: rgba(56, 189, 248, 0.1); color: #38bdf8; }
    .role-badge.seller { background: rgba(245, 158, 11, 0.1); color: #f59e0b; }
    .role-badge.admin { background: rgba(239, 68, 68, 0.1); color: #ef4444; }
    .status-dot { display: inline-block; width: 8px; height: 8px; border-radius: 50%; background: #64748b; margin-right: 4px; }
    .status-dot.active { background: #22c55e; box-shadow: 0 0 10px rgba(34, 197, 94, 0.5); }
    .animate-up { animation: slideUp 0.6s ease-out forwards; }
    @keyframes slideUp { from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
  `]
})
export class UsersComponent implements OnInit {
  private adminService = inject(AdminService);
  private snackBar = inject(MatSnackBar);

  users: User[] = [];
  isLoading = true;
  displayedColumns = ['name', 'role', 'status', 'actions'];

  ngOnInit() {
    this.loadUsers();
  }

  loadUsers() {
    this.isLoading = true;
    this.adminService.getUsers().subscribe({
      next: (res) => {
        if (res.success) this.users = res.users;
        this.isLoading = false;
      },
      error: () => this.isLoading = false
    });
  }

  onDelete(id: string) {
    if (confirm('Are you sure? This will permanently delete the account.')) {
      this.adminService.deleteUser(id).subscribe(res => {
        if (res.success) {
          this.snackBar.open('User deleted', 'Close', { duration: 3000 });
          this.loadUsers();
        }
      });
    }
  }

  onPromote(id: string) {
    this.snackBar.open('Promote feature coming soon!', 'Close', { duration: 3000 });
  }
}
