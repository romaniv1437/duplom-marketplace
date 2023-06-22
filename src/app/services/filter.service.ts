import { Injectable } from '@angular/core';
import { Product } from '../models/products.interface';

@Injectable({
  providedIn: 'root'
})
export class FilterService {

  constructor() { }

  productsFilter(product: Product, search: string) : boolean {
    const foundTitle = product.title.replace(/\s+/g, '').toLowerCase().indexOf(search?.replace(/\s+/g, '').toLowerCase()) !== -1;
    const foundDescription = product.description.replace(/\s+/g, '').toLowerCase().indexOf(search?.replace(/\s+/g, '').toLowerCase()) !== -1;
    const foundPrice = String(product.price).replace(/\s+/g, '').toLowerCase().indexOf(search?.replace(/\s+/g, '').toLowerCase()) !== -1;

    return foundTitle || foundDescription || foundPrice;
  }

  productsCategoryFilter(products: Product[], category: string): Product[] {
    if (!category.length || category === 'all') {
      return products;
    }
    return products.filter(product => product.category.slug === category)
  }
}
