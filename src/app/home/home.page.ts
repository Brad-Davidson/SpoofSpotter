import { Component, OnInit } from '@angular/core';
import { User } from '../interfaces/IUser';
import { AuthenticationService } from '../services/authentication.service';
import { GlobalService } from '../services/global.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit{
  public user = {} as User;
  constructor(public authSvc: AuthenticationService, public globalSvc: GlobalService) {}

  ngOnInit(): void {
    let cookieUser = JSON.parse(localStorage.getItem('user'));
    if(cookieUser){
    this.authSvc.GetUserByEmail(cookieUser.email).subscribe(user =>{
      if(user.length > 0){
        this.user = user[0] as User;
        this.globalSvc.setLoggedInUser(this.user);
      }
    });
  }
  }

}
