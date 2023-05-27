import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import { BaseFacade } from 'src/app/facades/base.facade';
import {requiredFileType} from "../../shared/file-upload/file-validation";
import {Observable} from "rxjs";
import {Category} from "../../../models/category.interface";
import {ProductsFacade} from "../../../facades/products.facade";
import {Product} from "../../../models/products.interface";

@Component({
  selector: 'app-products-add-form',
  templateUrl: './products-add-form.component.html',
  styleUrls: ['./products-add-form.component.scss']
})
export class ProductsAddFormComponent implements OnInit {
  public categories$: Observable<Category[]> = new Observable<Category[]>();
  public productForm: FormGroup = new FormGroup<any>({
    title: new FormControl(null, [Validators.required]),
    price: new FormControl(null, [Validators.required]),
    description: new FormControl(null, [Validators.required]),
    category: new FormControl(null, [Validators.required]),
    photo: new FormControl<File[] | null>(null, [Validators.required, requiredFileType('png')])
  })
  constructor(private baseFacade: BaseFacade, private productsFacade: ProductsFacade) { }

  ngOnInit(): void {
    this.categories$ = this.baseFacade.categories$;
    this.productForm.valueChanges.subscribe(val => console.log(val))
  }

  public createProduct(): void {
    const reader = new FileReader();
    const product = {
      title:  this.productForm.controls['title'].value,
      price:  this.productForm.controls['price'].value,
      description:  this.productForm.controls['description'].value,
      category:  this.productForm.controls['category'].value.id,
      images: this.productForm.controls['photo'].value.map((file: File) => file),
    } as Product;
    console.log(product)
    this.productsFacade.createProduct(product);
  }
}
