import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { ProductService } from '../../../core/services/product.service';
import { CartService } from '../../../core/services/cart.service';
import { Product } from '../../../core/models/product.model';
import { LoadingSpinnerComponent } from '../../../shared/components/loading-spinner/loading-spinner.component';
import { MatSidenav } from '@angular/material/sidenav';

@Component({
  selector: 'app-shop',
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule, 
    MatCardModule, 
    MatButtonModule, 
    MatIconModule, 
    MatTabsModule, 
    MatSnackBarModule,
    MatSidenavModule,
    LoadingSpinnerComponent
  ],
  template: `
    <mat-sidenav-container class="shop-container">
      <mat-sidenav-content>
        <div class="container py-4">
          <header class="page-header animate-up">
            <h1 class="text-gradient">Fitness Shop</h1>
            <p class="subtitle">Premium supplements and gym gear</p>
          </header>

          <mat-tab-group (selectedTabChange)="onCategoryChange($event.tab.textLabel)" class="animate-up">
            <mat-tab label="All"></mat-tab>
            <mat-tab label="Protein"></mat-tab>
            <mat-tab label="Creatine"></mat-tab>
            <mat-tab label="Pre-workout"></mat-tab>
            <mat-tab label="Vitamins"></mat-tab>
          </mat-tab-group>

          <div class="product-grid mt-4" *ngIf="!isLoading; else loading">
            <mat-card class="product-card glass animate-up" *ngFor="let p of products; let i = index" [style.animation-delay]="(i * 0.05) + 's'">
              <img [src]="p.imageUrl || 'https://via.placeholder.com/300x300?text=No+Image'" [alt]="p.name" class="p-image" (error)="onImageError($event)">
              <mat-card-content>
                <div class="p-details">
                  <h3>{{ p.name }}</h3>
                  <p class="category">{{ p.category }}</p>
                  <p class="seller" *ngIf="p.sellerId">Seller: {{ p.sellerId.name || 'Unknown' }}</p>
                </div>
                <div class="price-tag">{{ p.price | currency }}</div>
              </mat-card-content>
              <mat-card-actions>
                <button mat-flat-button color="primary" class="w-100" (click)="addToCart(p)" [disabled]="p.stock === 0">
                  <mat-icon>add_shopping_cart</mat-icon> 
                  {{ p.stock > 0 ? 'Add to Cart' : 'Out of Stock' }}
                </button>
              </mat-card-actions>
            </mat-card>
          </div>

          <ng-template #loading>
            <app-loading-spinner message="Loading products..."></app-loading-spinner>
          </ng-template>

          <div *ngIf="!isLoading && products.length === 0" class="empty-state">
            <mat-icon>search_off</mat-icon>
            <p>No products found in this category.</p>
          </div>
        </div>
      </mat-sidenav-content>

      <mat-sidenav #cartDrawer mode="over" position="end" class="cart-drawer glass">
        <div class="cart-header">
          <h2>My Cart</h2>
          <button mat-icon-button (click)="cartDrawer.close()"><mat-icon>close</mat-icon></button>
        </div>
        
        <div class="cart-items">
          <div class="cart-item" *ngFor="let item of cartService.cartItems$ | async">
            <img [src]="item.imageUrl || 'https://via.placeholder.com/300x300?text=No+Image'" [alt]="item.name" (error)="onImageError($event)">
            <div class="item-info">
              <h4>{{ item.name }}</h4>
              <p>{{ item.price | currency }} x {{ item.quantity }}</p>
            </div>
            <div class="item-actions">
              <button mat-icon-button size="small" (click)="cartService.removeFromCart(item._id!)">
                <mat-icon>delete_outline</mat-icon>
              </button>
            </div>
          </div>
        </div>

        <div class="cart-footer" *ngIf="(cartService.cartItems$ | async)?.length">
          <div class="total-row">
            <span>Total:</span>
            <span class="total-price">{{ cartService.cartTotal | currency }}</span>
          </div>
          <button mat-flat-button color="accent" class="w-100 checkout-btn" (click)="goToCheckout()">
            Proceed to Checkout
          </button>
        </div>
      </mat-sidenav>
    </mat-sidenav-container>
  `,
  styles: [`
    .shop-container { min-height: calc(100vh - 70px); background: transparent; }
    .page-header { margin-bottom: 24px; }
    .product-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
      gap: 24px;
    }
    .product-card { padding: 0; overflow: hidden; height: 100%; display: flex; flex-direction: column; }
    .product-img { width: 100%; height: 200px; object-fit: cover; }
    .mat-mdc-card-content { padding: 16px !important; flex-grow: 1; }
    .price-tag { font-size: 20px; font-weight: 800; color: #38bdf8; margin-bottom: 8px; }
    .product-name { font-size: 16px; font-weight: 700; margin: 0; color: #f8fafc; }
    .product-category { font-size: 12px; color: #64748b; text-transform: uppercase; letter-spacing: 1px; }
    .w-100 { width: 100%; }
    .cart-drawer { width: 350px; padding: 20px; }
    .cart-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; }
    .cart-item { display: flex; gap: 12px; align-items: center; margin-bottom: 16px; padding-bottom: 16px; border-bottom: 1px solid rgba(255,255,255,0.05); }
    .cart-item img { width: 50px; height: 50px; border-radius: 8px; object-fit: cover; }
    .item-info h4 { margin: 0; font-size: 14px; color: #f8fafc; }
    .item-info p { margin: 0; font-size: 12px; color: #94a3b8; }
    .cart-footer { margin-top: auto; padding-top: 20px; border-top: 1px solid rgba(255,255,255,0.1); }
    .total-row { display: flex; justify-content: space-between; font-size: 18px; font-weight: 700; margin-bottom: 20px; }
    .total-price { color: #22c55e; }
    .animate-up { animation: slideUp 0.6s ease-out forwards; }
    @keyframes slideUp { from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
  `]
})
export class ShopComponent implements OnInit {
  @ViewChild('cartDrawer') cartDrawer!: MatSidenav;
  
  private productService = inject(ProductService);
  cartService = inject(CartService);
  private snackBar = inject(MatSnackBar);

  products: Product[] = [];
  isLoading = true;
  selectedCategory = 'All';

  ngOnInit() {
    this.loadProducts();
  }

  loadProducts() {
    this.isLoading = true;
    const filters = this.selectedCategory === 'All' ? {} : { category: this.selectedCategory };
    this.productService.getProducts(filters).subscribe({
      next: (res) => {
        this.products = res.products;
        this.isLoading = false;
      },
      error: () => this.isLoading = false
    });
  }

  onCategoryChange(category: string) {
    this.selectedCategory = category;
    this.loadProducts();
  }

  onImageError(event: any) {
    event.target.src = 'https://via.placeholder.com/300x300?text=No+Image';
  }

  addToCart(product: Product) {
    this.cartService.addToCart(product);
    this.snackBar.open(`${product.name} added to cart!`, 'View Cart', { duration: 3000 })
      .onAction().subscribe(() => {
        this.cartDrawer.open();
      });
  }

  goToCheckout() {
    // Navigate to checkout or open checkout dialog
    this.snackBar.open('Checkout feature coming soon!', 'Close', { duration: 3000 });
  }
}
