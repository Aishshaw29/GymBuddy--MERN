import { Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AnalyticsComponent } from './analytics/analytics.component';
import { UsersComponent } from './users/users.component';
import { SellerApprovalsComponent } from './seller-approvals/seller-approvals.component';
import { ProductsComponent } from './products/products.component';

export const ADMIN_ROUTES: Routes = [
  { path: '', component: DashboardComponent },
  { path: 'analytics', component: AnalyticsComponent },
  { path: 'users', component: UsersComponent },
  { path: 'seller-approvals', component: SellerApprovalsComponent },
  { path: 'products', component: ProductsComponent }
];
