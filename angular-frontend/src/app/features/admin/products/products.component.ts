import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { AdminService } from '../../../core/services/admin.service';
import { Product } from '../../../core/models/product.model';
import { LoadingSpinnerComponent } from '../../../shared/components/loading-spinner/loading-spinner.component';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatTableModule, MatButtonModule, MatIconModule, MatSlideToggleModule, MatSnackBarModule, LoadingSpinnerComponent],
  template: `
    <div class="products-page container py-4">
      <header class="page-header animate-up">
        <h1 class="text-gradient">Content Moderation</h1>
        <p class="subtitle">Monitor and control product listings across the platform</p>
      </header>

      <mat-card class="glass products-card animate-up" style="animation-delay: 0.1s">
        <mat-card-content>
          <div *ngIf="!isLoading; else loading">
            <table mat-table [dataSource]="products" class="w-100" *ngIf="products.length > 0; else empty">
              
              <ng-container matColumnDef="product">
                <th mat-header-cell *mat-header-cell>Product / Category</th>
                <td mat-cell *mat-cell="let p">
                  <div class="prod-cell">
                    <img [src]="p.imageUrl" class="prod-thumb">
                    <div class="prod-info">
                      <b>{{ p.name }}</b>
                      <p>{{ p.category }}</p>
                    </div>
                  </div>
                </td>
              </ng-container>

              <ng-container matColumnDef="seller">
                <th mat-header-cell *mat-header-cell>Seller</th>
                <td mat-cell *mat-cell="let p">Store #{{ (p.sellerId || '').toString().slice(-4) }}</td>
              </ng-container>

              <ng-container matColumnDef="price">
                <th mat-header-cell *mat-header-cell>Price</th>
                <td mat-cell *mat-cell="let p">{{ p.price | currency }}</td>
              </ng-container>

              <ng-container matColumnDef="status">
                <th mat-header-cell *mat-header-cell>Active</th>
                <td mat-cell *mat-cell="let p">
                  <mat-slide-toggle [checked]="p.isActive" (change)="toggleProduct(p)"></mat-slide-toggle>
                </td>
              </ng-container>

              <ng-container matColumnDef="actions">
                <th mat-header-cell *mat-header-cell>Actions</th>
                <td mat-cell *mat-cell="let p">
                  <button mat-icon-button color="warn" (click)="onRemove(p._id!)">
                    <mat-icon>delete_forever</mat-icon>
                  </button>
                </td>
              </ng-container>

              <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
              <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
            </table>

            <ng-template #empty>
              <div class="empty-state">
                <mat-icon>inventory_2</mat-icon>
                <p>No products found on the platform.</p>
              </div>
            </ng-template>
          </div>

          <ng-template #loading>
            <app-loading-spinner message="Scanning platform listings..."></app-loading-spinner>
          </ng-template>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .products-page { max-width: 1200px; margin: 0 auto; padding: 32px 16px; }
    .page-header { margin-bottom: 32px; }
    .products-card { padding: 8px; overflow-x: auto; }
    .w-100 { width: 100%; }
    .prod-cell { display: flex; gap: 12px; align-items: center; margin: 8px 0; }
    .prod-thumb { width: 44px; height: 44px; border-radius: 8px; object-fit: cover; }
    .prod-info b { font-size: 14px; color: #f8fafc; }
    .prod-info p { margin: 0; font-size: 11px; color: #64748b; text-transform: uppercase; }
    .empty-state { padding: 60px; text-align: center; color: #94a3b8; }
    .empty-state mat-icon { font-size: 64px; width: 64px; height: 64px; margin-bottom: 16px; opacity: 0.5; }
    .animate-up { animation: slideUp 0.6s ease-out forwards; }
    @keyframes slideUp { from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
  `]
})
export class ProductsComponent implements OnInit {
  private adminService = inject(AdminService);
  private snackBar = inject(MatSnackBar);

  products: Product[] = [];
  isLoading = true;
  displayedColumns = ['product', 'seller', 'price', 'status', 'actions'];

  ngOnInit() {
    this.loadProducts();
  }

  loadProducts() {
    this.isLoading = true;
    this.adminService.getModerationProducts().subscribe({
      next: (res) => {
        if (res.success) this.products = res.products;
        this.isLoading = false;
      },
      error: () => this.isLoading = false
    });
  }

  toggleProduct(product: Product) {
    const newStatus = !product.isActive;
    this.adminService.updateProductStatus(product._id!, newStatus).subscribe(res => {
      if (res.success) {
        this.snackBar.open(`Product ${newStatus ? 'activated' : 'deactivated'}`, 'Close', { duration: 3000 });
        product.isActive = newStatus;
      }
    });
  }

  onRemove(id: string) {
    if (confirm('Delete this product permanently? Error corrected cannot be revoked.')) {
      this.adminService.deleteProduct(id).subscribe(res => {
        if (res.success) {
          this.snackBar.open('Product purged from platform', 'Close', { duration: 3000 });
          this.loadProducts();
        }
      });
    }
  }
}
