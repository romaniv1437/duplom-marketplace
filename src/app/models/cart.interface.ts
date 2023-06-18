import {Product} from "./products.interface";
import { User } from "./user.interface";

export interface Cart {
  userId: string;
  products: CartProduct[],
  totalPrice: number;
}

export interface CartProduct extends Product {
  qty: number;
  totalPrice: number;
  userId: string;
}

export interface Order {
  products: CartProduct[]
}

export interface OrderResponse {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  country: string;
  city: string;
  post_index: number;
  count_products: number;
  time_create: Date;
  buyer: User;
  products: CartProduct[];
  totalPrice: number;
  status: string;
  is_read: boolean;
}
