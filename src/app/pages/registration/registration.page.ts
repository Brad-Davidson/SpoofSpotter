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

  constructor(public authSvc: AuthenticationService
    ,public router: Router) { } 

  ngOnInit() {
  }

  signUp(email, password){
    this.authSvc.RegisterUser(email, password).then(res =>{
      this.authSvc.CreateUserDoc({PrimaryEmail: email} as User).then(results =>{
        this.authSvc.UpdateUserDoc({PrimaryEmail: email} as User, results.id).then(() =>{
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
