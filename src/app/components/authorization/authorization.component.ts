import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {AuthFacade} from 'src/app/facades/auth.facade';
import {User} from "../../models/user.interface";
import {Observable, takeUntil} from "rxjs";
import {ControlSubscribtionComponent} from "../../control-subscriptions/controlSubscribtion.component";
import {AuthService} from "../../services/auth.service";
import { Router } from '@angular/router';

@Component({
  selector: 'app-authorization',
  templateUrl: './authorization.component.html',
  styleUrls: ['./authorization.component.scss']
})
export class AuthorizationComponent extends ControlSubscribtionComponent implements OnInit {
  public user$: Observable<User> = new Observable<User>();
  public authSelected = 'login'
  public authorizationForm: FormGroup = new FormGroup<any>({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required]),
    firstName: new FormControl(),
    lastName: new FormControl(),
  });

  constructor(
    private authFacade: AuthFacade,
    private authService: AuthService,
    private router: Router
  ) {
    super()
  }

  ngOnInit(): void {
    this.user$ = this.authFacade.user$;

    this.user$.pipe(takeUntil(this.destroyed$)).subscribe(user => {
      if (this.authService.isAuth) {
        this.router.navigateByUrl('/').then(r => r)
      }
    })
  }

  public setAuthSelected(authSelected: string): void {
    this.authSelected = authSelected;
  }

  public login(): void {
    this.authFacade.login(this.authorizationForm.controls['email'].value, this.authorizationForm.controls['password'].value);
  }

  public register(): void {
    this.authFacade.register(this.authorizationForm.value, this.authorizationForm.controls['password'].value);
  }
}
