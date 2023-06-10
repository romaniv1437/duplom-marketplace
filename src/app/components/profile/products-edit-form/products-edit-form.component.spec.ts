import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductsEditFormComponent } from './products-edit-form.component';

describe('ProductsEditFormComponent', () => {
  let component: ProductsEditFormComponent;
  let fixture: ComponentFixture<ProductsEditFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProductsEditFormComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductsEditFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
