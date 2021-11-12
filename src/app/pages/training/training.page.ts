import { Component, OnInit } from '@angular/core';
import { Browser } from '@capacitor/browser';
import { User } from 'src/app/interfaces/IUser';
import { AuthenticationService } from 'src/app/services/authentication.service';

@Component({
  selector: 'app-training',
  templateUrl: './training.page.html',
  styleUrls: ['./training.page.scss'],
})
export class TrainingPage implements OnInit {

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

  async OpenBrowser(url){
    await Browser.open({url: url});
  }
}
