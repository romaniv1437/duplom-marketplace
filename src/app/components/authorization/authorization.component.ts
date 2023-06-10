import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {AuthFacade} from 'src/app/facades/auth.facade';
import {User} from "../../models/user.interface";
import {Observable, takeUntil} from "rxjs";
import {ControlSubscribtionComponent} from "../../control-subscriptions/controlSubscribtion.component";
import {AuthService} from "../../services/auth.service";
import {Router} from '@angular/router';

@Component({
  selector: 'app-authorization',
  templateUrl: './authorization.component.html',
  styleUrls: ['./authorization.component.scss']
})
export class AuthorizationComponent extends ControlSubscribtionComponent implements OnInit {
  public user$: Observable<User> = new Observable<User>();
  public authSelected = 'login'
  public loginForm: FormGroup = new FormGroup<any>({
    username: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required]),
    firstName: new FormControl(''),
    lastName: new FormControl(''),
  });
  public registerForm: FormGroup = new FormGroup<any>({
    username: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required]),
    firstName: new FormControl(''),
    lastName: new FormControl(''),
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
    this.authFacade.login(this.loginForm.controls['username'].value, this.loginForm.controls['password'].value);
  }

  public register(): void {
    this.authFacade.register(this.registerForm.value, this.registerForm.controls['password'].value);
  }
}
