import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { User } from 'src/app/interfaces/IUser';
import { AuthenticationService } from '../../services/authentication.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  public email: string = "Test";
  public password: string = "";

  constructor(
    public authService: AuthenticationService,
    public router: Router
  ) { }

  ngOnInit() {
  }

  logIn(email, password){
    this.authService.SignIn(email, password)
      .then((res) =>{
        //if this call is successful, we can assume that they have a user account in our system
        this.authService.GetUserByEmail(email).subscribe(results =>{
          let user = results as unknown as User[];
          if(user.length > 0 && user[0].UserID){
            this.authService.SetUserData(user);
            this.router.navigate(["home"])
          }
        })
      });
  }

}
