import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { User } from './interfaces/IUser';
import { AuthenticationService } from './services/authentication.service';
import { GlobalService } from './services/global.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit{

  constructor(public authSvc: AuthenticationService, public globalSvc: GlobalService, private router: Router) {}
  private user = {} as User;
  ngOnInit(): void {
    //   let cookieUser = JSON.parse(localStorage.getItem('user'));
    // if(cookieUser){
    // this.authSvc.GetUserByEmail(cookieUser.email).subscribe(user =>{
    //   console.log(user);
    //   if(user.length > 0){
    //     this.user = user[0] as User;
    //     this.globalSvc.setLoggedInUser(this.user);
    //     console.log("setting logged in user")
    //   }
    //   });
    //}

    // this.globalSvc.user.subscribe(user =>{
    //   if(user.UserID){
    //     this.user = user;
    //   }
    // })
  }

  LogOut(){
    this.authSvc.SignOut().then(result =>{
      //force a refresh to clear cookies
      window.location.reload();
    });
  }
}


