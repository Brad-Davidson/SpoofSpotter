import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/interfaces/IUser';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { GlobalService } from 'src/app/services/global.service';

@Component({
  selector: 'app-account',
  templateUrl: './account.page.html',
  styleUrls: ['./account.page.scss'],
})
export class AccountPage implements OnInit {
  public user = {} as User;
  constructor(public globalSvc: GlobalService) { }

  ngOnInit() {
    this.globalSvc.user.subscribe(user =>{
      this.user = user as User;
    })
  }

}
