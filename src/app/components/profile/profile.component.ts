import {Component, OnInit} from '@angular/core';
import {Observable} from "rxjs";
import {AuthFacade} from 'src/app/facades/auth.facade';
import {User} from "../../models/user.interface";
import {PlaceholderImages} from "../../enums/placeholderImage.enum";

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  public user$: Observable<User> = new Observable<User>();
  public placeholderImages = PlaceholderImages;

  constructor(private authFacade: AuthFacade) {
  }

  ngOnInit(): void {
    this.user$ = this.authFacade.user$;
  }
}
