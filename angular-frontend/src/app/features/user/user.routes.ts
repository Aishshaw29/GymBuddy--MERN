import { Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { FitnessTrackerComponent } from './fitness-tracker/fitness-tracker.component';
import { ShopComponent } from './shop/shop.component';
import { MyOrdersComponent } from './my-orders/my-orders.component';

export const USER_ROUTES: Routes = [
  { path: '', component: DashboardComponent },
  { path: 'fitness-tracker', component: FitnessTrackerComponent },
  { path: 'shop', component: ShopComponent },
  { path: 'my-orders', component: MyOrdersComponent }
];
