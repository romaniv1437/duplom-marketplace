import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {StoreModule} from '@ngrx/store';
import {EffectsModule} from '@ngrx/effects';
import {StoreDevtoolsModule} from '@ngrx/store-devtools';
import {environment} from '../environments/environment';
import {HomeComponent} from './components/home/home.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatIconModule} from "@angular/material/icon";
import {MatButtonModule} from '@angular/material/button';
import {ProductsComponent} from './components/products/products.component';
import {baseFeatureKey, baseReducer} from "./store/reducer";
import {BaseEffects} from "./store/effects";
import {HTTP_INTERCEPTORS, HttpClientModule} from "@angular/common/http";
import {LetModule, PushModule} from "@ngrx/component";
import {MatCardModule} from "@angular/material/card";
import {NgOptimizedImage} from "@angular/common";
import {MatSidenavModule} from "@angular/material/sidenav";
import {MatTreeModule} from "@angular/material/tree";
import {MatPaginatorModule} from "@angular/material/paginator";
import {ProductsDisplayComponent} from './components/products/products-display/products-display.component';
import {ProductsPageComponent} from './components/products/products-page/products-page.component';
import {MatBadgeModule} from "@angular/material/badge";
import {IsProductInCartPipe} from './pipes/is-product-in-cart.pipe';
import {CartComponent} from './components/cart/cart.component';
import {GetCartProductPipe} from "./pipes/get-cart-product.pipe";
import {AuthorizationComponent} from './components/authorization/authorization.component';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MatInputModule} from "@angular/material/input";
import {AuthInterceptor} from "./interceptors/auth.interceptor";
import {MatSnackBarModule} from "@angular/material/snack-bar";
import {ProfileComponent} from './components/profile/profile.component';
import {ProductsAddFormComponent} from './components/profile/products-add-form/products-add-form.component';
import {FileUploadComponent} from './components/shared/file-upload/file-upload.component';
import {FileToUrlPipe} from './pipes/file-to-url.pipe';
import {MatSelectModule} from "@angular/material/select";
import {NgImageSliderModule} from "ng-image-slider";
import {ImageForSliderPipe} from './pipes/image-for-slider.pipe';
import {NgxSpinnerModule} from "ngx-spinner";
import {ProfileEditFormComponent} from './components/profile/profile-edit-form/profile-edit-form.component';
import {ProfileOptionsComponent} from './components/profile/profile-options/profile-options.component';
import { ProductsEditFormComponent } from './components/profile/products-edit-form/products-edit-form.component';
import { GetProductSlugPipe } from './pipes/get-product-slug.pipe';
import { ProfileChangePasswordComponent } from './components/profile/profile-change-password/profile-change-password.component';
import { StarRatingComponent } from './components/shared/star-rating/star-rating.component';
import { AutofocusDirective } from './directives/autofocus.directive';
import { OrderFormComponent } from './components/order-form/order-form.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    ProductsComponent,
    ProductsDisplayComponent,
    ProductsPageComponent,
    IsProductInCartPipe,
    CartComponent,
    GetCartProductPipe,
    AuthorizationComponent,
    ProfileComponent,
    ProductsAddFormComponent,
    FileUploadComponent,
    FileToUrlPipe,
    ImageForSliderPipe,
    ProfileEditFormComponent,
    ProfileOptionsComponent,
    ProductsEditFormComponent,
    GetProductSlugPipe,
    ProfileChangePasswordComponent,
    StarRatingComponent,
    AutofocusDirective,
    OrderFormComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    StoreModule.forRoot({[baseFeatureKey]: baseReducer}),
    EffectsModule.forRoot([BaseEffects]),
    StoreDevtoolsModule.instrument({maxAge: 25, logOnly: environment.production}),
    BrowserAnimationsModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    HttpClientModule,
    PushModule,
    MatCardModule,
    NgOptimizedImage,
    MatSidenavModule,
    MatTreeModule,
    MatPaginatorModule,
    LetModule,
    MatBadgeModule,
    ReactiveFormsModule,
    MatInputModule,
    MatSnackBarModule,
    FormsModule,
    MatSelectModule,
    NgImageSliderModule,
    NgxSpinnerModule.forRoot({type: 'ball-scale-multiple'})
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true,
    },
  ],
  bootstrap: [AppComponent]
})
export class CoreModule {
}
