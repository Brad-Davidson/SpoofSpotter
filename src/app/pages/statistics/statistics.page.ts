import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/interfaces/IUser';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { GlobalService } from 'src/app/services/global.service';
import { NewsFeedService } from 'src/app/services/news-feed.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-statistics',
  templateUrl: './statistics.page.html',
  styleUrls: ['./statistics.page.scss'],
})
export class StatisticsPage implements OnInit {

  constructor(private newsSvc: NewsFeedService, private userSvc: UserService, private authSvc: AuthenticationService, public globalSvc: GlobalService) { }

  public user = {} as User;

  ngOnInit() {
    this.user = this.globalSvc.getLoggedInUser;

    if(this.user && this.user.UserID){
      console.log(this.user.UserID)
      this.userSvc.GetUserStats(this.user.UserID).subscribe(results =>{
        console.log(results);
      });
    }
    else{ //delete this later
      this.userSvc.GetUserStats("Anonymous").subscribe(results =>{
        console.log(results);
      })
    }
  }

}
