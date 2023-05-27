import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import {ProductsComponent} from "./components/products/products.component";
import {ProductsPageComponent} from "./components/products/products-page/products-page.component";
import {CartComponent} from "./components/cart/cart.component";
import {AuthorizationComponent} from "./components/authorization/authorization.component";
import {AuthGuard} from "./guards/auth.guard";
import {ProfileComponent} from "./components/profile/profile.component";
import {ProductsAddFormComponent} from "./components/products/products-add-form/products-add-form.component";

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
        path: 'profile/add-item',
        component: ProductsAddFormComponent,
        canActivate: [AuthGuard]
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
        path: 'profile',
        component: ProfileComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'profile/:userId',
        component: ProfileComponent,
      },
      {
        path: 'authorization',
        component: AuthorizationComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
