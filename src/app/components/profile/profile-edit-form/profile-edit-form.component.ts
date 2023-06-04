import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {Observable, takeUntil} from "rxjs";
import {User} from "../../../models/user.interface";
import {AuthFacade} from "../../../facades/auth.facade";
import {ControlSubscribtionComponent} from "../../../control-subscriptions/controlSubscribtion.component";

@Component({
  selector: 'app-profile-edit-form',
  templateUrl: './profile-edit-form.component.html',
  styleUrls: ['./profile-edit-form.component.scss']
})
export class ProfileEditFormComponent extends ControlSubscribtionComponent implements OnInit {
  public user$: Observable<User> = new Observable<User>();


  profileForm: FormGroup = new FormGroup({
    email: new FormControl('',),
    username: new FormControl('', [Validators.required]),
    password: new FormControl('',),
    firstName: new FormControl(),
    lastName: new FormControl(),
    photo: new FormControl(),
  })

  constructor(private authFacade: AuthFacade) {
    super()
  }

  ngOnInit(): void {
    this.user$ = this.authFacade.user$;

    this.user$.pipe(takeUntil(this.destroyed$)).subscribe(user => {
      this.profileForm.patchValue(user)
    })
  }


  editProfile(): void {
    const value = this.profileForm.value;
    this.authFacade.edit({...value, imageFile: value.photo ? value.photo[0] : null})
  }
}
