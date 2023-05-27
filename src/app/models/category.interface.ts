export interface CategoryModel extends Category{
  slug: string
}

export interface Category {
  id: number;
  title: string;
  url: string;
}
