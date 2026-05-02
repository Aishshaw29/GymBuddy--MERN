import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { User } from '../models/user.model';
import { ProductResponse } from '../models/product.model';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/admin`;

  getUsers(): Observable<{ success: boolean; users: User[] }> {
    return this.http.get<{ success: boolean; users: User[] }>(`${this.apiUrl}/users`);
  }

  toggleUserStatus(id: string, isActive: boolean): Observable<{ success: boolean; user: User }> {
    return this.http.patch<{ success: boolean; user: User }>(`${this.apiUrl}/users/${id}/status`, { isActive });
  }

  deleteUser(id: string): Observable<{ success: boolean; message: string }> {
    return this.http.delete<{ success: boolean; message: string }>(`${this.apiUrl}/users/${id}`);
  }

  getPendingSellers(): Observable<{ success: boolean; sellers: User[] }> {
    return this.http.get<{ success: boolean; sellers: User[] }>(`${this.apiUrl}/sellers/pending`);
  }

  approveSeller(id: string): Observable<{ success: boolean; seller: User }> {
    return this.http.put<{ success: boolean; seller: User }>(`${this.apiUrl}/sellers/${id}/approve`, { isApproved: true });
  }

  getPlatformAnalytics(): Observable<{ success: boolean; analytics: any }> {
    return this.http.get<{ success: boolean; analytics: any }>(`${this.apiUrl}/analytics`);
  }

  // Alias for legacy calls if any
  getAnalytics(): Observable<{ success: boolean; analytics: any }> {
    return this.getPlatformAnalytics();
  }

  getModerationProducts(): Observable<ProductResponse> {
    return this.http.get<ProductResponse>(`${this.apiUrl}/products`);
  }

  // Alias
  getAdminProducts(): Observable<ProductResponse> {
    return this.getModerationProducts();
  }

  updateProductStatus(productId: string, isActive: boolean): Observable<{ success: boolean; product: any }> {
    return this.http.put<{ success: boolean; product: any }>(`${this.apiUrl}/products/${productId}/status`, { isActive });
  }

  deleteProduct(productId: string): Observable<{ success: boolean; message: string }> {
    return this.http.delete<{ success: boolean; message: string }>(`${this.apiUrl}/products/${productId}`);
  }

  // Alias
  adminDeleteProduct(id: string): Observable<{ success: boolean; message: string }> {
    return this.deleteProduct(id);
  }
}
