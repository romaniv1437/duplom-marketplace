import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {AuthFacade} from "../../../facades/auth.facade";

@Component({
  selector: 'app-profile-change-password',
  templateUrl: './profile-change-password.component.html',
  styleUrls: ['./profile-change-password.component.scss']
})
export class ProfileChangePasswordComponent implements OnInit {

  public passwordForm: FormGroup = new FormGroup<any>({
    oldPassword: new FormControl('', [Validators.required]),
    newPassword: new FormControl('',[Validators.required]),
    confirmPassword: new FormControl('',[Validators.required])
  });

  constructor(private authFacade: AuthFacade) { }

  ngOnInit(): void {
  }

  public changePassword(): void {
    this.authFacade.changePassword({...this.passwordForm.value})
  }
}
