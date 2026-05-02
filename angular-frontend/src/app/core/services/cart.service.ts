import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Product } from '../models/product.model';

export interface CartItem extends Product {
  quantity: number;
}

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private cartItemsSubject = new BehaviorSubject<CartItem[]>(this.getCartFromStorage());
  public cartItems$ = this.cartItemsSubject.asObservable();

  get cartItems(): CartItem[] {
    return this.cartItemsSubject.value;
  }

  get cartTotal(): number {
    return this.cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  }

  get cartCount(): number {
    return this.cartItems.reduce((count, item) => count + item.quantity, 0);
  }

  addToCart(product: Product): void {
    const currentItems = [...this.cartItems];
    const existingItem = currentItems.find(item => item._id === product._id);

    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      currentItems.push({ ...product, quantity: 1 } as CartItem);
    }

    this.updateCart(currentItems);
  }

  removeFromCart(productId: string): void {
    const currentItems = this.cartItems.filter(item => item._id !== productId);
    this.updateCart(currentItems);
  }

  updateQuantity(productId: string, quantity: number): void {
    if (quantity <= 0) {
      this.removeFromCart(productId);
      return;
    }

    const currentItems = [...this.cartItems];
    const item = currentItems.find(i => i._id === productId);
    if (item) {
      item.quantity = quantity;
      this.updateCart(currentItems);
    }
  }

  clearCart(): void {
    this.updateCart([]);
  }

  private updateCart(items: CartItem[]): void {
    this.cartItemsSubject.next(items);
    localStorage.setItem('cart', JSON.stringify(items));
  }

  private getCartFromStorage(): CartItem[] {
    const cart = localStorage.getItem('cart');
    return cart ? JSON.parse(cart) : [];
  }
}
