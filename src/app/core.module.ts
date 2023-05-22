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
import { ProductsComponent } from './components/products/products.component';
import {baseFeatureKey, baseReducer} from "./store/reducer";
import {BaseEffects} from "./store/effects";
import {HttpClientModule} from "@angular/common/http";
import {LetModule, PushModule} from "@ngrx/component";
import {MatCardModule} from "@angular/material/card";
import {NgOptimizedImage} from "@angular/common";
import {MatSidenavModule} from "@angular/material/sidenav";
import {MatTreeModule} from "@angular/material/tree";
import {MatPaginatorModule} from "@angular/material/paginator";
import { ProductsDisplayComponent } from './components/products/products-display/products-display.component';
import { ProductsPageComponent } from './components/products/products-page/products-page.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    ProductsComponent,
    ProductsDisplayComponent,
    ProductsPageComponent
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
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class CoreModule {
}
