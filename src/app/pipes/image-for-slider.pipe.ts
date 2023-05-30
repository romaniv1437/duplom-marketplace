import { Pipe, PipeTransform } from '@angular/core';

interface SliderImage {
  image: string;
  thumbImage: string;
  alt: string;
  title: string;
}

@Pipe({
  name: 'imageForSlider'
})
export class ImageForSliderPipe implements PipeTransform {

  transform(images: string[], productName: string): SliderImage[] {
    return images.map(image => ({image: image, thumbImage: image, alt: productName, title: productName}));
  }

}
