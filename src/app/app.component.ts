import { Component, OnInit } from '@angular/core';
import { User } from './interfaces/IUser';
import { AuthenticationService } from './services/authentication.service';
import { GlobalService } from './services/global.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit{

  constructor(public authSvc: AuthenticationService, public globalSvc: GlobalService) {}
  private user: User;
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


