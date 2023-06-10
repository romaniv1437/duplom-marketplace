import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'getProductSlug'
})
export class GetProductSlugPipe implements PipeTransform {

  transform(productUrl: string): string {

    if (!productUrl) {
      return '';
    }

    return productUrl.split('/')[2];
  }

}
