import {FlatTreeControl} from '@angular/cdk/tree';
import {Component, OnInit} from '@angular/core';
import {MatTreeFlatDataSource, MatTreeFlattener} from "@angular/material/tree";
import {categories} from "../../mock/mock.data";
import {ProductsFacade} from "../../facades/products.facade";
import {CartFacade} from "../../facades/cart.facade";
import {filter, Observable, takeUntil} from "rxjs";
import {AuthFacade} from 'src/app/facades/auth.facade';
import {User} from "../../models/user.interface";
import {AuthService} from 'src/app/services/auth.service';
import {MatSnackBar} from "@angular/material/snack-bar";
import {BaseFacade} from "../../facades/base.facade";
import {ControlSubscribtionComponent} from "../../control-subscriptions/controlSubscribtion.component";


interface NavNode {
  name: string;
  url: string;
  children?: NavNode[];
}

const TREE_DATA: NavNode[] = [
  {
    name: 'Категорії',
    url: 'products/all',
    children: categories,
  },
  {
    name: 'Профіль',
    url: 'profile'
  },
  {
    name: 'Cart',
    url: 'cart'
  },
];

interface ExampleFlatNode {
  expandable: boolean;
  name: string;
  url: string;
  level: number;
}

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent extends ControlSubscribtionComponent implements OnInit {

  public user$: Observable<User> = new Observable<User>();
  public countProductsInCart$: Observable<number> = new Observable<number>();

  private _transformer = (node: NavNode, level: number) => {
    return {
      expandable: !!node.children && node.children.length > 0,
      name: node.name,
      level: level,
      url: node.url,
    };
  };

  treeControl = new FlatTreeControl<ExampleFlatNode>(
    node => node.level,
    node => node.expandable,
  );

  treeFlattener = new MatTreeFlattener(
    this._transformer,
    node => node.level,
    node => node.expandable,
    node => node.children,
  );

  dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);

  constructor(
    private cartFacade: CartFacade,
    private authFacade: AuthFacade,
    public authService: AuthService,
    private baseFacade: BaseFacade,
    private _snackBar: MatSnackBar
  ) {
    super();
    this.dataSource.data = TREE_DATA;
  }

  ngOnInit(): void {

    this.baseFacade.error$
      .pipe(takeUntil(this.destroyed$), filter(error => error.length !== 0))
      .subscribe(error => this._snackBar
        .open(error, 'ok', {
          horizontalPosition: "center", verticalPosition: "top", duration: 2000
        }))

    this.user$ = this.authFacade.user$;

    this.authFacade.getUser();
    this.baseFacade.loadCategories();
    this.countProductsInCart$ = this.cartFacade.countCartProducts$;
  }

  logout(): void {
    this.authFacade.logout();
    this.authService.clearToken();
  }

  hasChild = (_: number, node: ExampleFlatNode) => node.expandable;

}
