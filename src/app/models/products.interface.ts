import {Category} from "./category.interface";
import {PaginationData} from "./core.interface";
import {User} from "./user.interface";

export interface Product {
  url: string;
  id: number;
  title: string;
  image: string;
  images: string[];
  price: number;
  description: string;
  category: Category;
  user: User;
  imageFiles: File[];
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
  user: User,
  photo: string[]
}
