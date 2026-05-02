import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { OrderService } from '../../../core/services/order.service';
import { Order } from '../../../core/models/order.model';
import { LoadingSpinnerComponent } from '../../../shared/components/loading-spinner/loading-spinner.component';

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatTableModule, MatSelectModule, MatIconModule, MatSnackBarModule, LoadingSpinnerComponent],
  template: `
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-up">
      <header class="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10 gap-4">
        <div>
          <h1 class="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-blue-600 mb-1">Store Orders</h1>
          <p class="text-slate-400 text-sm m-0">Fulfill orders and track delivery status</p>
        </div>
      </header>

      <mat-card class="!bg-slate-800/50 !backdrop-blur-md !border !border-slate-700/50 !rounded-2xl !shadow-xl !shadow-black/20 overflow-hidden animate-up" style="animation-delay: 0.1s">
        <mat-card-content class="!p-0">
          <div *ngIf="!isLoading; else loading" class="overflow-x-auto">
            <table mat-table [dataSource]="orders" class="w-full !bg-transparent" *ngIf="orders.length > 0; else empty">
              
              <ng-container matColumnDef="orderId">
                <th mat-header-cell *mat-header-cell class="!text-slate-400 !font-semibold border-b !border-slate-700/50">Order ID</th>
                <td mat-cell *mat-cell="let o" class="border-b !border-slate-700/50 py-4">
                  <code class="text-sky-400 bg-sky-500/10 px-2 py-1 rounded text-xs">#{{ o._id.substring(o._id.length - 6) }}</code>
                </td>
              </ng-container>

              <ng-container matColumnDef="customer">
                <th mat-header-cell *mat-header-cell class="!text-slate-400 !font-semibold border-b !border-slate-700/50">Address</th>
                <td mat-cell *mat-cell="let o" class="border-b !border-slate-700/50 py-4">
                  <div class="max-w-[200px] whitespace-nowrap overflow-hidden text-ellipsis text-sm text-slate-400" [title]="o.deliveryAddress">
                    {{ o.deliveryAddress }}
                  </div>
                </td>
              </ng-container>

              <ng-container matColumnDef="items">
                <th mat-header-cell *mat-header-cell class="!text-slate-400 !font-semibold border-b !border-slate-700/50">Items (My Portion)</th>
                <td mat-cell *mat-cell="let o" class="border-b !border-slate-700/50 py-4">
                  <div class="flex flex-wrap gap-2">
                    <span *ngFor="let p of o.products" class="text-[11px] bg-sky-500/10 text-sky-400 px-2 py-0.5 rounded shadow-sm">
                      {{ p.quantity }}x {{ p.name }}
                    </span>
                  </div>
                </td>
              </ng-container>

              <ng-container matColumnDef="total">
                <th mat-header-cell *mat-header-cell class="!text-slate-400 !font-semibold border-b !border-slate-700/50">Earning</th>
                <td mat-cell *mat-cell="let o" class="border-b !border-slate-700/50 py-4 font-bold text-green-500">
                  {{ o.totalAmount | currency }}
                </td>
              </ng-container>

              <ng-container matColumnDef="status">
                <th mat-header-cell *mat-header-cell class="!text-slate-400 !font-semibold border-b !border-slate-700/50">Status</th>
                <td mat-cell *mat-cell="let o" class="border-b !border-slate-700/50 py-4 text-right">
                  <!-- Simplified styling for select since Material deeply scopes its classes -->
                  <div class="inline-block relative">
                    <mat-select [value]="o.status" (selectionChange)="onStatusChange(o._id, $event.value)" 
                      class="text-xs font-bold !px-3 !py-1 rounded-full border border-slate-600/50 bg-slate-800/80 w-32"
                      [ngClass]="{
                        '!text-amber-500 !border-amber-500/50': o.status === 'PENDING',
                        '!text-sky-500 !border-sky-500/50': o.status === 'PROCESSING',
                        '!text-purple-500 !border-purple-500/50': o.status === 'SHIPPED',
                        '!text-green-500 !border-green-500/50': o.status === 'DELIVERED',
                        '!text-red-500 !border-red-500/50': o.status === 'CANCELLED'
                      }">
                      <mat-option value="PENDING" class="!text-amber-500 !font-bold">PENDING</mat-option>
                      <mat-option value="PROCESSING" class="!text-sky-500 !font-bold">PROCESSING</mat-option>
                      <mat-option value="SHIPPED" class="!text-purple-500 !font-bold">SHIPPED</mat-option>
                      <mat-option value="DELIVERED" class="!text-green-500 !font-bold">DELIVERED</mat-option>
                      <mat-option value="CANCELLED" class="!text-red-500 !font-bold">CANCELLED</mat-option>
                    </mat-select>
                  </div>
                </td>
              </ng-container>

              <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
              <tr mat-row *matRowDef="let row; columns: displayedColumns;" class="hover:bg-slate-800/30 transition-colors"></tr>
            </table>

            <ng-template #empty>
              <div class="py-16 text-center">
                <mat-icon class="text-6xl text-slate-600 mb-4 opacity-50 !w-16 !h-16">local_shipping</mat-icon>
                <p class="text-slate-400">No orders received yet. Optimize your listings!</p>
              </div>
            </ng-template>
          </div>

          <ng-template #loading>
            <div class="p-8">
              <app-loading-spinner message="Loading seller orders..."></app-loading-spinner>
            </div>
          </ng-template>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .animate-up { animation: slideUp 0.6s ease-out forwards; }
    @keyframes slideUp { from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }

    /* Custom Mat Select arrow styling for modern look */
    ::ng-deep .mat-mdc-select-arrow {
      color: rgba(255,255,255,0.5) !important;
    }
  `]
})
export class OrdersComponent implements OnInit {
  private orderService = inject(OrderService);
  private snackBar = inject(MatSnackBar);

  orders: Order[] = [];
  isLoading = true;
  displayedColumns = ['orderId', 'customer', 'items', 'total', 'status'];

  ngOnInit() {
    this.loadOrders();
  }

  loadOrders() {
    this.isLoading = true;
    this.orderService.getSellerOrders().subscribe({
      next: (res) => {
        this.orders = res.orders;
        this.isLoading = false;
      },
      error: () => this.isLoading = false
    });
  }

  onStatusChange(orderId: string, newStatus: string) {
    this.orderService.updateOrderStatus(orderId, newStatus).subscribe(res => {
      if (res.success) {
        this.snackBar.open(`Order status updated to ${newStatus}`, 'Close', { duration: 3000 });
        this.loadOrders();
      }
    });
  }
}
