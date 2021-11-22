import { Component, OnInit } from '@angular/core';
import { Browser } from '@capacitor/browser';
import { User } from 'src/app/interfaces/IUser';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { GlobalService } from 'src/app/services/global.service';

@Component({
  selector: 'app-training',
  templateUrl: './training.page.html',
  styleUrls: ['./training.page.scss'],
})
export class TrainingPage implements OnInit {

  public user = {} as User;
  constructor(public authSvc: AuthenticationService, public globalSvc: GlobalService) { }

  ngOnInit() {
    this.user = this.globalSvc.getLoggedInUser;
}

  async OpenBrowser(url){
    await Browser.open({url: url});
  }
}
