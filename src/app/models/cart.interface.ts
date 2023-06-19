import {Product, ProductModel} from "./products.interface";
import {User, UserModel} from "./user.interface";

export interface Cart {
  userId: string;
  products: CartProduct[],
  totalPrice: string;
}

export interface CartProduct extends Product {
  qty: number;
  totalPrice: number;
  userId: string;
  status: number;
}

export interface Order {
  firstName: string;
  lastName: string;
  email: string;
  country: string;
  city: string;
  postalCode: number;
  productsQuantity: number;
  user: User;
  totalPrice: number;
  timeCreated: Date;

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
  info: OrderProductModel[]
  totalPrice: number;
  status: string;
  is_read: boolean;
}

export interface OrderProductPayload {
  currency: any;
  products: number;
  seller: number;
  count_products: number;
  total_price: number;
  number_orders: number;
}

export interface OrderProductModel {
  id: number,
  number_orders: number,
  count_products: number,
  total_price: any,
  currency: string,
  status: string,
  products: ProductModel[],
  seller: number
}
