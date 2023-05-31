import {Component, ElementRef, HostListener, ViewChild} from '@angular/core';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from "@angular/forms";

@Component({
  selector: 'app-file-upload',
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: FileUploadComponent,
      multi: true
    }
  ]
})
export class FileUploadComponent implements ControlValueAccessor {
  @ViewChild('fileInput') fileInput!: ElementRef;
  onChange!: Function;
  public files: File[] = [];

  constructor(private host: ElementRef<HTMLInputElement>) {
  }

  @HostListener('change', ['$event.target.files']) emitFiles(event: FileList) {
    for (let i = 0; i < event.length; i++) {
      this.files!.push(event.item(i)!);
    }

    this.onChange(this.files);
  }

  writeValue(value: null) {
    // clear file input
    this.host.nativeElement.value = '';
    this.files = [];
  }

  registerOnChange(fn: Function) {
    this.onChange = fn;
  }

  registerOnTouched(fn: Function) {
  }

  removeFile(file: File) {
    this.files = this.files.filter(existFile => existFile.name !== file.name);

    if (this.files.length === 0) {
      this.fileInput.nativeElement.value = '';
    }

    this.onChange(this.files);
  }
}
