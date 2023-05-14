import {PaginationData} from "./core.interface";

export interface Product {
  title: string;
  image: string;
  price: number;
  description: string;
  category: string;
}

export interface ProductsResponse extends PaginationData {
  items: Product[]
}
