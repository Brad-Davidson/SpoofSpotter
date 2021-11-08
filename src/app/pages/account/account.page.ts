import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/interfaces/IUser';
import { AuthenticationService } from 'src/app/services/authentication.service';

@Component({
  selector: 'app-account',
  templateUrl: './account.page.html',
  styleUrls: ['./account.page.scss'],
})
export class AccountPage implements OnInit {
  public user = {} as User;
  constructor(public authSvc: AuthenticationService) { }

  ngOnInit() {
    let cookieUser = JSON.parse(localStorage.getItem('user'));
    if(cookieUser){
    this.authSvc.GetUserByEmail(cookieUser.email).subscribe(user =>{
      if(user.length > 0){
        this.user = user[0] as User;
      }
    });
  }
  }

}
