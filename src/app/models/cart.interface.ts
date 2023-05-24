import { Product } from "./products.interface";

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
