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
        canActivate: [AuthGuard]
      },
      {
        path: 'products/:category',
        component: ProductsComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'products/item/:id',
        component: ProductsPageComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'cart',
        component: CartComponent,
        canActivate: [AuthGuard]
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
