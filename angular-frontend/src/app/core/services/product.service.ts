import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Product, ProductResponse } from '../models/product.model';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/products`;

  getProducts(filters?: any): Observable<ProductResponse> {
    let params = new HttpParams();
    if (filters) {
      Object.keys(filters).forEach(key => {
        if (filters[key]) params = params.append(key, filters[key]);
      });
    }
    return this.http.get<ProductResponse>(this.apiUrl, { params });
  }

  getProduct(id: string): Observable<{ success: boolean; product: Product }> {
    return this.http.get<{ success: boolean; product: Product }>(`${this.apiUrl}/${id}`);
  }

  getMyProducts(): Observable<ProductResponse> {
    return this.http.get<ProductResponse>(`${this.apiUrl}/seller/my-products`);
  }

  createProduct(product: Partial<Product>): Observable<{ success: boolean; product: Product }> {
    return this.http.post<{ success: boolean; product: Product }>(this.apiUrl, product);
  }

  updateProduct(id: string, product: Partial<Product>): Observable<{ success: boolean; product: Product }> {
    return this.http.put<{ success: boolean; product: Product }>(`${this.apiUrl}/${id}`, product);
  }

  deleteProduct(id: string): Observable<{ success: boolean; message: string }> {
    return this.http.delete<{ success: boolean; message: string }>(`${this.apiUrl}/${id}`);
  }
}
