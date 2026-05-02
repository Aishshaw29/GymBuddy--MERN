export interface Order {
  _id?: string;
  userId: string | { name: string; email: string };
  products: {
    productId: string;
    sellerId: string;
    name: string;
    price: number;
    quantity: number;
  }[];
  totalAmount: number;
  deliveryAddress: string;
  status: 'PENDING' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';
  orderDate: string;
}

export interface OrderResponse {
  success: boolean;
  count: number;
  orders: Order[];
}
