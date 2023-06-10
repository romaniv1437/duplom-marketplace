import {Pipe, PipeTransform} from '@angular/core';
import {DomSanitizer} from "@angular/platform-browser";

@Pipe({
  name: 'fileToUrl'
})
export class FileToUrlPipe implements PipeTransform {
  constructor(private sanitizer: DomSanitizer) {
  }

  transform(value: File, ...args: unknown[]): string {
    console.log(value)
    return <string>this.sanitizer.bypassSecurityTrustUrl(URL.createObjectURL(value));
  }

}
