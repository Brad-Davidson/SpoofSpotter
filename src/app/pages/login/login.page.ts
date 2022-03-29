import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { User } from 'src/app/interfaces/IUser';
import { GlobalService } from 'src/app/services/global.service';
import { AuthenticationService } from '../../services/authentication.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  public email: string = "";
  public password: string = "";

  constructor(
    public authService: AuthenticationService,
    public router: Router,
    public globalSvc: GlobalService,
    public alertCtrl: AlertController
  ) { }

  ngOnInit() {
    if(this.authService.isLoggedIn){
      this.router.navigateByUrl("/")
    }
  }

  async showInvalidCredentials(){
   
    await this.alertCtrl.create({
      header: 'Invalid Credentials',
      
      message: 'Please enter a valid email and passwords',
      buttons:['Okay']
    
    }).then(res=> res.present());
  }

  logIn(email, password){
    this.authService.SignIn(email, password)
      .then((res) =>{
        //if this call is successful, we can assume that they have a user account in our system
        this.authService.GetUserByEmail(email).subscribe(results =>{
          let user = results as unknown as User[];
          if(user.length > 0 && user[0].UserID){
            this.authService.SetUserData(user[0]);
            this.globalSvc.setLoggedInUser(user[0]);
            this.router.navigateByUrl("/", {replaceUrl: true});
          }
        })
      }).catch((err) =>{
        this.showInvalidCredentials();
        this.password = ""; //clear password, not email
      });
  }

}
