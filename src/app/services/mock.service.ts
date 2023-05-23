import { Injectable } from '@angular/core';
import { Product } from '../models/products.interface';
import {categories} from "../mock/mock.data";

@Injectable({
  providedIn: 'root'
})
export class MockService {

  private productNames: string[] = ['Айфон 11', "Самсунг 23", "Айфон 14", "Макбук"]
  private productDescriptions: string[] = ['Підходить дизайнерам', "Використовується у бізнесі", "Для закоханих"]
  private productImages: string[] = [
    'https://images.freeimages.com/images/large-previews/198/orange-paint-texture-1638432.jpg',
    'https://media.istockphoto.com/id/163739725/uk/%D1%84%D0%BE%D1%82%D0%BE/%D0%B0%D0%B1%D1%81%D1%82%D1%80%D0%B0%D0%BA%D1%82%D0%BD%D1%96-%D0%BF%D0%BE%D1%84%D0%B0%D1%80%D0%B1%D0%BE%D0%B2%D0%B0%D0%BD%D1%96-%D1%81%D0%B8%D0%BD%D1%96-%D1%84%D0%BE%D0%BD%D0%B8-%D0%BC%D0%B8%D1%81%D1%82%D0%B5%D1%86%D1%82%D0%B2%D0%B0.jpg?s=612x612&w=0&k=20&c=3erB0qBO-eAUXMelDf85XBl3kIqhi17dlyZSlSzvo7Q=',
    'https://media.istockphoto.com/id/493028062/uk/%D1%84%D0%BE%D1%82%D0%BE/%D1%85%D1%83%D0%B4%D0%BE%D0%B6%D0%BD%D1%8F-%D1%80%D1%83%D1%87%D0%BD%D0%B0-%D1%80%D0%BE%D0%B7%D0%BF%D0%B8%D1%81%D0%BA%D0%B0-%D0%B1%D0%B0%D0%B3%D0%B0%D1%82%D0%BE%D1%88%D0%B0%D1%80%D0%BE%D0%B2%D0%BE%D0%B3%D0%BE-%D1%87%D0%B5%D1%80%D0%B2%D0%BE%D0%BD%D0%BE%D0%B3%D0%BE-%D1%84%D0%BE%D0%BD%D1%83.jpg?s=612x612&w=0&k=20&c=JRG-1lJkoVDPChXKHS9BrKxsc8RlJAv-_SmpW_2xqgY=',
    'https://media.istockphoto.com/id/1044292966/uk/%D0%B2%D0%B5%D0%BA%D1%82%D0%BE%D1%80%D0%BD%D1%96-%D0%B7%D0%BE%D0%B1%D1%80%D0%B0%D0%B6%D0%B5%D0%BD%D0%BD%D1%8F/%D0%B7%D0%BD%D0%B5%D1%88%D0%BA%D0%BE%D0%B4%D0%B6%D0%B5%D0%BD%D0%B8%D0%B9-%D0%B0%D0%B1%D1%81%D1%82%D1%80%D0%B0%D0%BA%D1%82%D0%BD%D0%B8%D0%B9-%D1%81%D0%B8%D0%BD%D1%96%D0%B9-%D1%96-%D0%B7%D0%B5%D0%BB%D0%B5%D0%BD%D0%B8%D0%B9-%D1%84%D0%BE%D0%BD.jpg?s=612x612&w=0&k=20&c=sir9CSRRJxXcBNoqfAMHq2QnD2v8dKrEkQ1TKNdyRp4='
  ]


  public products = this.generateProducts(150);

  constructor() { }

  private generateProducts(count: number): Product[] {
    const products: Product[] = []

    for (let i = 0; i <= count; i++) {
      const category = categories[Math.floor(Math.random() * categories.length)]
      const product = {
        id: Math.floor(Math.random() * 9999),
        title: category.displayName + ' ' + (i+1),
        description: this.productDescriptions[Math.floor(Math.random() * this.productDescriptions.length)],
        image: this.productImages[Math.floor(Math.random() * this.productImages.length)],
        price: Math.floor(Math.random() * 100) + 1,
        categoryId: category.key,
      } as Product

      products.push(product)
    }

    return products
  }
}
