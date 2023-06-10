import {Component, forwardRef, OnInit} from '@angular/core';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from "@angular/forms";

@Component({
  selector: 'app-star-rating',
  templateUrl: './star-rating.component.html',
  styleUrls: ['./star-rating.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => StarRatingComponent),
      multi: true
    }
  ]
})
export class StarRatingComponent implements OnInit, ControlValueAccessor {
  ngOnInit(): void {

  }
  public ratings = [
    {
      stars: 1,
      text: 'Дуже погано'
    },
    {
      stars: 2,
      text: 'Погано'
    },
    {
      stars: 3,
      text: 'Нормально'
    },
    {
      stars: 4,
      text: 'Добре'
    },
    {
      stars: 5,
      text: 'Дуже добре'
    }
  ]
  public disabled: boolean = false;
  public ratingText: string = "";
  public _value: number = 0;

  onChanged: any = () => {}
  onTouched: any = () => {}
  displayText: string = '';

  writeValue(val: number) {
    this._value = val;
  }

  registerOnChange(fn: any){
    this.onChanged = fn
  }
  registerOnTouched(fn: any){
    this.onTouched = fn
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  setRating(star: any) {
    if(!this.disabled) {
      this._value = star.stars;
      this.ratingText = star.text
      this.onChanged(star.stars);
      this.onTouched();
    }
  }

}
