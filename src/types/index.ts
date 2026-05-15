import { LucideIcon } from 'lucide-react';

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  wholesalePrice: number;
  minQuantity: number;
  stock: number;
  category: string;
  images: string[];
  sellerId: string;
  sellerName: string;
  sellerPhone?: string;
  sellerWhatsapp?: string;
  sellerShopNo?: string;
  sellerBlock?: string;
  createdAt: number;
}

export interface Seller {
  uid: string;
  businessName: string;
  description: string;
  location: string;
  phoneNumber: string;
  email: string;
  rating: number;
  reviewsCount: number;
  openingHours: string;
  returnPolicy: string;
}

export interface Order {
  id: string;
  buyerId: string;
  sellerId: string;
  items: OrderItem[];
  totalAmount: number;
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
  createdAt: number;
}

export interface OrderItem {
  productId: string;
  quantity: number;
  price: number;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
}

export interface Review {
  id: string;
  productId: string;
  wholesalerId: string;
  buyerId: string;
  buyerName: string;
  rating: number; // 1-5
  comment: string;
  createdAt: number;
}

export interface SaleRecord {
  id: string;
  sellerId: string;
  productId: string;
  productName: string;
  quantity: number;
  salePrice: number;
  totalAmount: number;
  costPrice: number; // For profit calculation
  profit: number;
  type: string;
  createdAt: number;
}

export interface ExpenseRecord {
  id: string;
  sellerId: string;
  description: string;
  amount: number;
  category: string;
  createdAt: number;
}
