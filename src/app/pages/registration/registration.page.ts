import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { User } from 'src/app/interfaces/IUser';
import { AuthenticationService } from '../../services/authentication.service';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.page.html',
  styleUrls: ['./registration.page.scss'],
})
export class RegistrationPage implements OnInit {

  public email: string;
  public password: string;
  public firstName: string;
  public lastName: string;
  public userName: string;

  constructor(public authSvc: AuthenticationService
    ,public router: Router) { } 

  ngOnInit() {
  }

  signUp(){
    this.authSvc.RegisterUser(this.email, this.password).then(res =>{
      this.authSvc.CreateUserDoc({
        PrimaryEmail: this.email,
        FirstName: this.firstName,
        LastName: this.lastName,
        UserName: this.userName,
        IsActive: true,
        Points: 0,
        Streak: 0
      } as User).then(results =>{
        this.authSvc.UpdateUserDoc({
          PrimaryEmail: this.email,
          FirstName: this.firstName,
          LastName: this.lastName,
          UserName: this.userName,
          IsActive: true,
          Points: 0,
          Streak: 0
        } as User, results.id).then(() =>{
          console.log('success');
        })
        this.router.navigate(['login']);
      }).catch(error =>{
        alert(error.message);
      });
    }).catch((error) =>{
      window.alert(error.message);
    })
  }

}
