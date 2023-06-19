export interface CategoriesResponse {
  count: number;
  next: string;
  previous: string;
  results: CategoryModel[]
}

export interface CategoriesModel {
  countAll: number;
  nextPage: string;
  prevPage: string;
  results: Category[]
}

export interface CurrencyModel {
  countAll: number;
  nextPage: string;
  prevPage: string;
  results: Currency[]
}

export interface CategoryModel extends Category {
  slug: string
}

export interface Category {
  id: number;
  title: string;
  url: string;
  slug: string;
}

export interface Currency {
  id: number;
  title: string;
}
