import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ProductService } from '../../../core/services/product.service';
import { Product } from '../../../core/models/product.model';
import { LoadingSpinnerComponent } from '../../../shared/components/loading-spinner/loading-spinner.component';
import { ConfirmDialogComponent } from '../../../shared/components/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [
    CommonModule, 
    MatCardModule, 
    MatTableModule, 
    MatButtonModule, 
    MatIconModule, 
    MatSnackBarModule,
    MatDialogModule,
    LoadingSpinnerComponent
  ],
  template: `
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-up">
      <header class="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10 gap-4">
        <div>
          <h1 class="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-blue-600 mb-1">My Products</h1>
          <p class="text-slate-400 text-sm m-0">Manage your inventory and pricing</p>
        </div>
        <button mat-flat-button color="accent" (click)="onAddProduct()" class="!rounded-lg !px-6 !py-2 shadow-lg shadow-sky-500/20">
          <mat-icon class="mr-1">add</mat-icon> Add Product
        </button>
      </header>

      <mat-card class="!bg-slate-800/50 !backdrop-blur-md !border !border-slate-700/50 !rounded-2xl !shadow-xl !shadow-black/20 overflow-hidden animate-up" style="animation-delay: 0.1s">
        <mat-card-content class="!p-0">
          <div *ngIf="!isLoading; else loading" class="overflow-x-auto">
            <table mat-table [dataSource]="products" class="w-full !bg-transparent" *ngIf="products.length > 0; else empty">
              
              <ng-container matColumnDef="image">
                <th mat-header-cell *mat-header-cell class="!text-slate-400 !font-semibold border-b !border-slate-700/50">Image</th>
                <td mat-cell *mat-cell="let p" class="border-b !border-slate-700/50 py-3">
                  <img [src]="p.imageUrl" class="w-12 h-12 rounded-lg object-cover shadow-md">
                </td>
              </ng-container>

              <ng-container matColumnDef="name">
                <th mat-header-cell *mat-header-cell class="!text-slate-400 !font-semibold border-b !border-slate-700/50">Product Name</th>
                <td mat-cell *mat-cell="let p" class="border-b !border-slate-700/50 py-3">
                  <div class="font-bold text-slate-200">{{ p.name }}</div>
                  <div class="text-[11px] text-slate-500 uppercase tracking-wider font-semibold mt-0.5">{{ p.category }}</div>
                </td>
              </ng-container>

              <ng-container matColumnDef="price">
                <th mat-header-cell *mat-header-cell class="!text-slate-400 !font-semibold border-b !border-slate-700/50">Price</th>
                <td mat-cell *mat-cell="let p" class="border-b !border-slate-700/50 py-3 font-semibold text-sky-400">{{ p.price | currency }}</td>
              </ng-container>

              <ng-container matColumnDef="stock">
                <th mat-header-cell *mat-header-cell class="!text-slate-400 !font-semibold border-b !border-slate-700/50">Stock</th>
                <td mat-cell *mat-cell="let p" class="border-b !border-slate-700/50 py-3">
                  <span class="font-bold" [ngClass]="{'text-green-500': p.stock > 0, 'text-red-500': p.stock === 0}">{{ p.stock }} units</span>
                </td>
              </ng-container>

              <ng-container matColumnDef="status">
                <th mat-header-cell *mat-header-cell class="!text-slate-400 !font-semibold border-b !border-slate-700/50">Status</th>
                <td mat-cell *mat-cell="let p" class="border-b !border-slate-700/50 py-3">
                  <span class="px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wide" 
                        [ngClass]="p.isActive ? 'bg-green-500/10 text-green-500' : 'bg-slate-500/10 text-slate-400'">
                    {{ p.isActive ? 'Active' : 'Inactive' }}
                  </span>
                </td>
              </ng-container>

              <ng-container matColumnDef="actions">
                <th mat-header-cell *mat-header-cell class="!text-slate-400 !font-semibold border-b !border-slate-700/50">Actions</th>
                <td mat-cell *mat-cell="let p" class="border-b !border-slate-700/50 py-3 text-right">
                  <button mat-icon-button (click)="onEdit(p)" class="!text-slate-400 hover:!text-sky-400 transition-colors"><mat-icon>edit</mat-icon></button>
                  <button mat-icon-button color="warn" (click)="onDelete(p._id!)" class="hover:!text-red-400 transition-colors"><mat-icon>delete_outline</mat-icon></button>
                </td>
              </ng-container>

              <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
              <tr mat-row *matRowDef="let row; columns: displayedColumns;" class="hover:bg-slate-800/30 transition-colors"></tr>
            </table>

            <ng-template #empty>
              <div class="py-16 text-center">
                <mat-icon class="text-6xl text-slate-600 mb-4 opacity-50 !w-16 !h-16">inventory</mat-icon>
                <p class="text-slate-400 mb-6">You haven't added any products yet.</p>
                <button mat-stroked-button color="accent" (click)="onAddProduct()" class="!border-sky-500/50 !text-sky-400 hover:!bg-sky-500/10">Create First Listing</button>
              </div>
            </ng-template>
          </div>

          <ng-template #loading>
            <div class="p-8">
              <app-loading-spinner message="Loading inventory..."></app-loading-spinner>
            </div>
          </ng-template>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .animate-up { animation: slideUp 0.6s ease-out forwards; }
    @keyframes slideUp { from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
  `]
})
export class ProductsComponent implements OnInit {
  private productService = inject(ProductService);
  private snackBar = inject(MatSnackBar);
  private dialog = inject(MatDialog);

  products: Product[] = [];
  isLoading = true;
  displayedColumns = ['image', 'name', 'price', 'stock', 'status', 'actions'];

  ngOnInit() {
    this.loadProducts();
  }

  loadProducts() {
    this.isLoading = true;
    this.productService.getMyProducts().subscribe({
      next: (res) => {
        this.products = res.products;
        this.isLoading = false;
      },
      error: () => this.isLoading = false
    });
  }

  onAddProduct() {
     this.snackBar.open('Add Product dialog coming soon!', 'Close', { duration: 3000 });
  }

  onEdit(product: Product) {
    this.snackBar.open(`Editing ${product.name}...`, 'Close', { duration: 2000 });
  }

  onDelete(id: string) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Delete Product?',
        message: 'This action cannot be undone. Any active orders for this product will stay in history.',
        color: 'warn'
      },
      panelClass: 'glass-dialog'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.productService.deleteProduct(id).subscribe(res => {
          if (res.success) {
            this.snackBar.open('Product removed', 'Close', { duration: 3000 });
            this.loadProducts();
          }
        });
      }
    });
  }
}
