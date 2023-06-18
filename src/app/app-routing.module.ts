import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {HomeComponent} from './components/home/home.component';
import {ProductsComponent} from "./components/products/products.component";
import {ProductsPageComponent} from "./components/products/products-page/products-page.component";
import {CartComponent} from "./components/cart/cart.component";
import {AuthorizationComponent} from "./components/authorization/authorization.component";
import {AuthGuard} from "./guards/auth.guard";
import {ProfileComponent} from "./components/profile/profile.component";
import {ProductsAddFormComponent} from "./components/profile/products-add-form/products-add-form.component";
import {ProfileOptionsComponent} from "./components/profile/profile-options/profile-options.component";
import {ProfileEditFormComponent} from "./components/profile/profile-edit-form/profile-edit-form.component";
import {ProductsEditFormComponent} from "./components/profile/products-edit-form/products-edit-form.component";
import {
  ProfileChangePasswordComponent
} from "./components/profile/profile-change-password/profile-change-password.component";
import {OrderFormComponent} from "./components/order-form/order-form.component";

const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    children: [
      {
        path: '',
        component: ProductsComponent,
      },
      {
        path: 'products/:category',
        component: ProductsComponent,
      },
      {
        path: 'products/item/:id',
        component: ProductsPageComponent,
      },
      {
        path: 'cart',
        component: CartComponent,
      },
      {
        path: 'order',
        component: OrderFormComponent
      },
      {
        path: 'profile',
        component: ProfileComponent,
        canActivate: [AuthGuard],
        children: [
          {
            path:'',
            component: ProfileOptionsComponent
          },
          {
            path: 'add-item',
            component: ProductsAddFormComponent,
          }, {
            path: 'edit-item',
            component: ProductsEditFormComponent,
          },
          {
            path: 'edit-profile',
            component: ProfileEditFormComponent,
          },
          {
            path: 'change-password',
            component: ProfileChangePasswordComponent,
          },
        ]
      },
      {
        path: 'profile/:userId',
        component: ProfileComponent,
        children: [
          {
            path:'',
            component: ProfileOptionsComponent
          },
        ]
      },
      {
        path: 'authorization',
        component: AuthorizationComponent
      }
    ]
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
