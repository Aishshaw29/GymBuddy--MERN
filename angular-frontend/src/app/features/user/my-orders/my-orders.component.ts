import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { OrderService } from '../../../core/services/order.service';
import { Order } from '../../../core/models/order.model';
import { LoadingSpinnerComponent } from '../../../shared/components/loading-spinner/loading-spinner.component';

@Component({
  selector: 'app-my-orders',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatTableModule, MatIconModule, MatButtonModule, LoadingSpinnerComponent],
  template: `
    <div class="orders-page container py-4">
      <header class="page-header animate-up">
        <h1 class="text-gradient">My Orders</h1>
        <p class="subtitle">History of your supplement and gear purchases</p>
      </header>

      <mat-card class="glass orders-card animate-up" style="animation-delay: 0.1s">
        <mat-card-content>
          <div *ngIf="!isLoading; else loading">
            <table mat-table [dataSource]="orders" class="w-100" *ngIf="orders.length > 0; else empty">
              
              <ng-container matColumnDef="id">
                <th mat-header-cell *mat-header-cell>Order ID</th>
                <td mat-cell *mat-cell="let o"><code>#{{ o._id.substring(o._id.length - 6) }}</code></td>
              </ng-container>

              <ng-container matColumnDef="date">
                <th mat-header-cell *mat-header-cell>Date</th>
                <td mat-cell *mat-cell="let o">{{ o.orderDate | date:'mediumDate' }}</td>
              </ng-container>

              <ng-container matColumnDef="items">
                <th mat-header-cell *mat-header-cell>Items</th>
                <td mat-cell *mat-cell="let o">
                  <div class="items-list">
                    <span *ngFor="let p of o.products" class="item-badge">{{ p.quantity }}x {{ p.name }}</span>
                  </div>
                </td>
              </ng-container>

              <ng-container matColumnDef="total">
                <th mat-header-cell *mat-header-cell>Total</th>
                <td mat-cell *mat-cell="let o"><span class="price">{{ o.totalAmount | currency }}</span></td>
              </ng-container>

              <ng-container matColumnDef="status">
                <th mat-header-cell *mat-header-cell>Status</th>
                <td mat-cell *mat-cell="let o">
                  <span class="status-badge" [class]="o.status.toLowerCase()">{{ o.status }}</span>
                </td>
              </ng-container>

              <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
              <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
            </table>

            <ng-template #empty>
              <div class="empty-state">
                <mat-icon>shopping_cart</mat-icon>
                <p>No orders found. Time to go shopping!</p>
                <button mat-flat-button color="primary" routerLink="/user/shop">Browse Shop</button>
              </div>
            </ng-template>
          </div>

          <ng-template #loading>
            <app-loading-spinner message="Fetching your orders..."></app-loading-spinner>
          </ng-template>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .orders-page { max-width: 1000px; margin: 0 auto; padding: 32px 16px; }
    .page-header { margin-bottom: 32px; }
    .orders-card { padding: 16px; overflow-x: auto; }
    .w-100 { width: 100%; }
    .price { font-weight: 700; color: #38bdf8; }
    .items-list { display: flex; flex-wrap: wrap; gap: 4px; }
    .item-badge { font-size: 11px; background: rgba(56, 189, 248, 0.1); color: #38bdf8; padding: 2px 8px; border-radius: 4px; }
    .status-badge { padding: 4px 10px; border-radius: 20px; font-size: 11px; font-weight: 700; text-transform: uppercase; }
    .status-badge.pending { background: rgba(245, 158, 11, 0.1); color: #f59e0b; }
    .status-badge.processing { background: rgba(14, 165, 233, 0.1); color: #0ea5e9; }
    .status-badge.shipped { background: rgba(139, 92, 246, 0.1); color: #8b5cf6; }
    .status-badge.delivered { background: rgba(34, 197, 94, 0.1); color: #22c55e; }
    .status-badge.cancelled { background: rgba(239, 68, 68, 0.1); color: #ef4444; }
    .empty-state { padding: 60px; text-align: center; color: #94a3b8; }
    .empty-state mat-icon { font-size: 64px; width: 64px; height: 64px; margin-bottom: 16px; opacity: 0.5; }
    .animate-up { animation: slideUp 0.6s ease-out forwards; }
    @keyframes slideUp { from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
  `]
})
export class MyOrdersComponent implements OnInit {
  private orderService = inject(OrderService);
  isLoading = true;
  orders: Order[] = [];
  displayedColumns = ['id', 'date', 'items', 'total', 'status'];

  ngOnInit() {
    this.orderService.getUserOrders().subscribe({
      next: (res) => {
        this.orders = res.orders;
        this.isLoading = false;
      },
      error: () => this.isLoading = false
    });
  }
}
