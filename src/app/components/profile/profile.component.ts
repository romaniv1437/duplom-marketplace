import {Component, OnInit} from '@angular/core';
import {Observable, startWith, takeUntil} from "rxjs";
import {AuthFacade} from 'src/app/facades/auth.facade';
import {User} from "../../models/user.interface";
import {PlaceholderImages} from "../../enums/placeholderImage.enum";
import {ActivatedRoute, Router} from "@angular/router";
import {FormControl, FormGroup} from '@angular/forms';
import {ControlSubscribtionComponent} from "../../control-subscriptions/controlSubscribtion.component";
import {AuthService} from "../../services/auth.service";
import {CartFacade} from "../../facades/cart.facade";
import {BaseFacade} from "../../facades/base.facade";

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent extends ControlSubscribtionComponent implements OnInit {

  public profileRateForm: FormGroup = new FormGroup<any>({
    rating: new FormControl(0),
    info: new FormControl('')
  });
  public username: string | undefined;
  public user$: Observable<User> = new Observable<User>();
  public placeholderImages = PlaceholderImages;

  public userId: string | undefined;

  constructor(
    private authFacade: AuthFacade,
    private cartFacade: CartFacade,
    private route: ActivatedRoute,
    private baseFacade: BaseFacade,
    private router: Router,
    private authService: AuthService) {
    super()
  }

  ngOnInit(): void {

    this.authFacade.user$.pipe(takeUntil(this.destroyed$)).subscribe(user => {
      this.userId = user.username;
    })

    this.router.events
      .pipe(takeUntil(this.destroyed$), startWith({}))
      .subscribe(() => {
        this.baseFacade.clearState();
        this.username = this.route.snapshot.params['userId']
        if (this.username) {
          this.authFacade.getUserByUsername(this.username)
          this.user$ = this.authFacade.profile$;
        } else if (this.authService.isAuth) {
          this.authFacade.getUser();
          this.cartFacade.getUserOrders();
          this.cartFacade.getUserSells();
          this.user$ = this.authFacade.user$;
        }
      })

    this.profileRateForm.valueChanges
      .pipe(takeUntil(this.destroyed$))
      .subscribe(value => {
        this.setRating(value.rating);
      })

    this.user$.pipe(takeUntil(this.destroyed$))
      .subscribe(value => {
        this.profileRateForm.patchValue({rating: value.you_stars}, {emitEvent: false})
      })
  }

  private setRating(rate: number): void {
    if (this.username) {
      this.authFacade.setRating(this.username, rate);
    }
  }
}
