export interface Product {
  _id?: string;
  name: string;
  category: string;
  price: number;
  description: string;
  stock: number;
  imageUrl: string;
  isActive: boolean;
  sellerId?: {
    name: string;
    email: string;
  };
}

export interface ProductResponse {
  success: boolean;
  count: number;
  products: Product[];
}
