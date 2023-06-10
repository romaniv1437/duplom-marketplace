import {Component, OnInit} from '@angular/core';
import {Observable, takeUntil} from "rxjs";
import {AuthFacade} from 'src/app/facades/auth.facade';
import {User} from "../../models/user.interface";
import {PlaceholderImages} from "../../enums/placeholderImage.enum";
import {ActivatedRoute} from "@angular/router";
import {FormControl, FormGroup} from '@angular/forms';
import {ControlSubscribtionComponent} from "../../control-subscriptions/controlSubscribtion.component";

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

  public userId: number | undefined;

  constructor(private authFacade: AuthFacade, private route: ActivatedRoute,) {
    super()
  }

  ngOnInit(): void {

    this.authFacade.user$.pipe(takeUntil(this.destroyed$)).subscribe(user => {
      this.userId = user.id;
    })

    this.route.params
      .pipe(takeUntil(this.destroyed$))
      .subscribe(() => {
        this.username = this.route.snapshot.params['userId']
        if (this.username) {
          this.authFacade.getUserByUsername(this.username)
          this.user$ = this.authFacade.profile$;
        } else {
          this.authFacade.getUser();
          this.user$ = this.authFacade.user$;
        }
      })

    this.profileRateForm.valueChanges
      .pipe(takeUntil(this.destroyed$))
      .subscribe(value => {
        this.setRating(value.rating);
      })
  }

  private setRating(rate: number): void {
    if (this.username) {
      this.authFacade.setRating(this.username, rate);
    }
  }
}
