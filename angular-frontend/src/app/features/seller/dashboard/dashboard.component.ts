import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { StatCardComponent } from '../../../shared/components/stat-card/stat-card.component';
import { ProductService } from '../../../core/services/product.service';
import { OrderService } from '../../../core/services/order.service';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink, MatButtonModule, MatIconModule, StatCardComponent],
  template: `
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-up">
      <header class="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10 gap-4">
        <div>
          <h1 class="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-blue-600 mb-1">Seller Center</h1>
          <p class="text-slate-400 text-sm m-0">Manage your products, inventory, and recent orders.</p>
        </div>
        <div>
          <button mat-flat-button color="accent" routerLink="/seller/products" class="!rounded-lg !px-6 !py-2 shadow-lg shadow-sky-500/20">
            <mat-icon class="mr-1">add</mat-icon> New Product
          </button>
        </div>
      </header>

      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10 animate-up" style="animation-delay: 0.1s">
        <app-stat-card 
          label="Total Products" 
          [value]="stats.totalProducts" 
          icon="inventory_2" 
          iconBg="#38bdf8">
        </app-stat-card>
        
        <app-stat-card 
          label="Active Orders" 
          [value]="stats.activeOrders" 
          icon="local_shipping" 
          iconBg="#f59e0b">
        </app-stat-card>
        
        <app-stat-card 
          label="Total Revenue" 
          [value]="stats.totalRevenue | currency" 
          icon="payments" 
          iconBg="#22c55e">
        </app-stat-card>

        <app-stat-card 
          label="Pending Items" 
          [value]="stats.pendingItems" 
          icon="hourglass_empty" 
          iconBg="#8b5cf6">
        </app-stat-card>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6 animate-up" style="animation-delay: 0.2s">
        <div class="group flex items-center p-6 bg-slate-800/50 backdrop-blur-md rounded-2xl border border-slate-700/50 hover:bg-slate-800 hover:border-sky-500/50 transition-all duration-300 cursor-pointer shadow-xl shadow-black/20" routerLink="/seller/products">
          <div class="w-14 h-14 rounded-xl flex justify-center items-center mr-5 bg-sky-500/10 text-sky-400 group-hover:scale-110 transition-transform duration-300">
            <mat-icon>list_alt</mat-icon>
          </div>
          <div>
            <h3 class="text-lg font-bold text-slate-100 mb-1">Inventory Management</h3>
            <p class="text-sm text-slate-400 m-0">Edit stock, prices, and product details</p>
          </div>
          <mat-icon class="ml-auto text-slate-500 group-hover:text-sky-400 transition-colors">chevron_right</mat-icon>
        </div>

        <div class="group flex items-center p-6 bg-slate-800/50 backdrop-blur-md rounded-2xl border border-slate-700/50 hover:bg-slate-800 hover:border-purple-500/50 transition-all duration-300 cursor-pointer shadow-xl shadow-black/20" routerLink="/seller/orders">
          <div class="w-14 h-14 rounded-xl flex justify-center items-center mr-5 bg-purple-500/10 text-purple-400 group-hover:scale-110 transition-transform duration-300">
            <mat-icon>assignment_turned_in</mat-icon>
          </div>
          <div>
            <h3 class="text-lg font-bold text-slate-100 mb-1">Process Orders</h3>
            <p class="text-sm text-slate-400 m-0">Update fulfillment status and ship items</p>
          </div>
          <mat-icon class="ml-auto text-slate-500 group-hover:text-purple-400 transition-colors">chevron_right</mat-icon>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .animate-up { animation: slideUp 0.6s ease-out forwards; }
    @keyframes slideUp { from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
  `]
})
export class DashboardComponent implements OnInit {
  private productService = inject(ProductService);
  private orderService = inject(OrderService);

  stats = {
    totalProducts: 0,
    activeOrders: 0,
    totalRevenue: 0,
    pendingItems: 0
  };

  ngOnInit() {
    this.loadStats();
  }

  loadStats() {
    forkJoin({
      products: this.productService.getMyProducts(),
      orders: this.orderService.getSellerOrders()
    }).subscribe({
      next: (res) => {
        if (res.products.success) {
          this.stats.totalProducts = res.products.count;
          this.stats.pendingItems = res.products.products.filter(p => p.stock === 0).length;
        }
        if (res.orders.success) {
          this.stats.activeOrders = res.orders.orders.filter(o => o.status !== 'DELIVERED').length;
          this.stats.totalRevenue = res.orders.orders.reduce((sum, o) => sum + o.totalAmount, 0);
        }
      }
    });
  }
}
