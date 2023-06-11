import {Component, OnInit} from '@angular/core';
import {Observable, takeUntil} from "rxjs";
import {Category} from "../../../models/category.interface";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {BaseFacade} from "../../../facades/base.facade";
import {ProductsFacade} from "../../../facades/products.facade";
import {Product} from "../../../models/products.interface";
import {ControlSubscribtionComponent} from "../../../control-subscriptions/controlSubscribtion.component";

@Component({
  selector: 'app-products-edit-form',
  templateUrl: './products-edit-form.component.html',
  styleUrls: ['./products-edit-form.component.scss']
})
export class ProductsEditFormComponent extends ControlSubscribtionComponent implements OnInit {

  public currentProduct$: Observable<Product> = new Observable<Product>();
  public categories$: Observable<Category[]> = new Observable<Category[]>();
  public productForm: FormGroup = new FormGroup<any>({
    title: new FormControl(null, [Validators.required]),
    price: new FormControl(null, [Validators.required]),
    description: new FormControl(null, [Validators.required]),
    category: new FormControl(null, [Validators.required]),
    photo: new FormControl<File[] | null>(null, [Validators.required]),
    slug: new FormControl('')
  })

  constructor(private baseFacade: BaseFacade, private productsFacade: ProductsFacade) {
    super()
  }

  ngOnInit(): void {
    this.categories$ = this.baseFacade.categories$;

    this.currentProduct$ = this.productsFacade.product$;

    this.currentProduct$.pipe(takeUntil(this.destroyed$)).subscribe(product => {
      this.productForm.reset();

      this.productForm.patchValue({
        title: product.title,
        price: product.price,
        description: product.description,
        category: product.category,
        slug: product.slug,
      })
      product.images?.map(async (image, index) => {
        const response = await fetch(image);
        return await response.blob().then(r => this.productForm
          .patchValue({
            ...this.productForm.value,
            photo: [...new Map(
              [...this.productForm.value.photo || [], new File([r], product.title + '_' + index)]
                .map(item => [item.name, item])
            ).values()]
          }));
      })
    })
  }

  public editProduct(): void {
    const product = {
      title: this.productForm.controls['title'].value,
      price: this.productForm.controls['price'].value,
      description: this.productForm.controls['description'].value,
      category: this.productForm.controls['category'].value.id,
      slug: this.productForm.controls['slug'].value,
      imageFiles: this.productForm.controls['photo'].value.map((file: File) => file),
    } as Product;

    this.productsFacade.editProduct(product);
  }


  compareFn(c1: any, c2: any): boolean {
    return c1 && c2 ? c1.id === c2.id : c1 === c2;
  }
}