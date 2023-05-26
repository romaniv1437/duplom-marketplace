import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {AuthFacade} from 'src/app/facades/auth.facade';
import {User} from "../../models/user.interface";

@Component({
  selector: 'app-authorization',
  templateUrl: './authorization.component.html',
  styleUrls: ['./authorization.component.scss']
})
export class AuthorizationComponent implements OnInit {
  public authSelected = 'login'
  public authorizationForm: FormGroup = new FormGroup<any>({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required]),
    firstName: new FormControl(),
    lastName: new FormControl(),
  });

  constructor(private authFacade: AuthFacade) {
  }

  ngOnInit(): void {
  }

  public setAuthSelected(authSelected: string): void {
    this.authSelected = authSelected;
  }

  public login(): void {
    this.authFacade.login('', '');
  }

  public register(): void {
    this.authFacade.register({} as User, '');
  }
}
