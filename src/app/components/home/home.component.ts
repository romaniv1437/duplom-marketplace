import {FlatTreeControl} from '@angular/cdk/tree';
import {Component, OnInit} from '@angular/core';
import {MatTreeFlatDataSource, MatTreeFlattener} from "@angular/material/tree";
import {CartFacade} from "../../facades/cart.facade";
import {filter, Observable, take, takeUntil} from "rxjs";
import {AuthFacade} from 'src/app/facades/auth.facade';
import {User} from "../../models/user.interface";
import {AuthService} from 'src/app/services/auth.service';
import {MatSnackBar} from "@angular/material/snack-bar";
import {BaseFacade} from "../../facades/base.facade";
import {ControlSubscribtionComponent} from "../../control-subscriptions/controlSubscribtion.component";
import {NgxSpinnerService} from "ngx-spinner";
import {Router} from "@angular/router";


interface NavNode {
  name: string;
  url: string;
  children?: NavNode[];
}

const TREE_DATA: NavNode[] = [
  {
    name: 'Профіль',
    url: 'profile'
  },
  {
    name: 'Кошик',
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

  constructor(
    private cartFacade: CartFacade,
    private authFacade: AuthFacade,
    public authService: AuthService,
    private baseFacade: BaseFacade,
    private _snackBar: MatSnackBar,
    private spinner: NgxSpinnerService,
    private router: Router,
  ) {
    super();
    this.menuData.data = TREE_DATA;
  }

  ngOnInit(): void {

    this.baseFacade.isLoading$
      .pipe(takeUntil(this.destroyed$))
      .subscribe(isLoading => isLoading ? this.spinner.show() : this.spinner.hide())

    this.baseFacade.error$
      .pipe(takeUntil(this.destroyed$), filter(error => error.length !== 0))
      .subscribe(error => this._snackBar
        .open(error, 'ok', {
          horizontalPosition: "center", verticalPosition: "top", duration: 2000
        }))

    this.user$ = this.authFacade.user$;

    if (this.authService.isAuth) {
      this.authFacade.getUser();
    }
    this.baseFacade.loadCategories();
    this.countProductsInCart$ = this.cartFacade.countCartProducts$;

    this.baseFacade.categories$
      .pipe(filter(categories => categories.length > 0), take(1))
      .subscribe(category => {
        this.menuData.data = [...this.menuData.data, {
          name: 'Категорії',
          url: 'products/all',
          children: category.map(category => ({name: category.title, url: category.url}))
        }]
      })
  }

  logout(): void {
    this.authFacade.logout();
    this.authService.clearToken();

    this.router.navigateByUrl('/authorization').then(r => r);
  }

  hasChild = (_: number, node: ExampleFlatNode) => node.expandable;

  private _transformer = (node: NavNode, level: number) => {
    return {
      expandable: !!node.children && node.children.length > 0,
      name: node.name,
      level: level,
      url: node.url,
    };
  };

  treeFlattener = new MatTreeFlattener(
    this._transformer,
    node => node.level,
    node => node.expandable,
    node => node.children,
  );

  treeControl = new FlatTreeControl<ExampleFlatNode>(
    node => node.level,
    node => node.expandable,
  );
  menuData = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);
}
