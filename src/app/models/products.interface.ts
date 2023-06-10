import {Category} from "./category.interface";
import {PaginationData} from "./core.interface";
import {User, UserModel} from "./user.interface";

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

export interface ProductsResponse {
  count: number;
  next: string;
  previous: string;
  results: ProductModel[];
}

export interface ProductsModel {
  countAll: number;
  nextPage: string;
  prevPage: string;
  results: Product[];
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
  user: UserModel,
  photo: string[]
}
