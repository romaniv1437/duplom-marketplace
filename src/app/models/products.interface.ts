import {Category} from "./category.interface";
import {PaginationData} from "./core.interface";

export interface Product {
  url: string;
  id: number;
  title: string;
  image: string;
  images: File[];
  price: number;
  description: string;
  category: Category;
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
  photo: string[]
}
