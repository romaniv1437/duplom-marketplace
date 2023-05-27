import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import {ProductsComponent} from "./components/products/products.component";
import {ProductsPageComponent} from "./components/products/products-page/products-page.component";
import {CartComponent} from "./components/cart/cart.component";
import {AuthorizationComponent} from "./components/authorization/authorization.component";
import {AuthGuard} from "./guards/auth.guard";

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
