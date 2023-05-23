import {PaginationData} from "./core.interface";

export interface Category {

}

export interface Product {
  url: string;
  id: number;
  title: string;
  image: string;
  images: string[];
  price: number;
  description: string;
  categoryId: string;
}

export interface ProductsResponse extends PaginationData {
  items: Product[]
}

export interface ProductModel {
  id: number,
  title: string,
  description: string,
  slug: string,
  price: string,
  time_create: Date,
  time_update: Date,
  number_photo: number,
  is_active: boolean,
  category: number,
  user: number,
  images: string[]
}
