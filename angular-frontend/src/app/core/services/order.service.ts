import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Order, OrderResponse } from '../models/order.model';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/orders`;

  placeOrder(orderData: { products: { productId: string; quantity: number }[]; deliveryAddress: string }): Observable<{ success: boolean; order: Order }> {
    return this.http.post<{ success: boolean; order: Order }>(this.apiUrl, orderData);
  }

  getUserOrders(): Observable<OrderResponse> {
    return this.http.get<OrderResponse>(`${this.apiUrl}/user`);
  }

  getSellerOrders(): Observable<OrderResponse> {
    return this.http.get<OrderResponse>(`${this.apiUrl}/seller`);
  }

  updateOrderStatus(id: string, status: string): Observable<{ success: boolean; order: Order }> {
    return this.http.put<{ success: boolean; order: Order }>(`${this.apiUrl}/${id}/status`, { status });
  }

  getOrderDetails(id: string): Observable<{ success: boolean; order: Order }> {
    return this.http.get<{ success: boolean; order: Order }>(`${this.apiUrl}/${id}`);
  }
}
