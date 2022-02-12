import { Component, OnInit } from '@angular/core';
import { PopoverController } from '@ionic/angular';
import { Friend } from 'src/app/interfaces/IFriend';
import { User } from 'src/app/interfaces/IUser';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { GlobalService } from 'src/app/services/global.service';
import { UserService } from 'src/app/services/user.service';
import { AddFriendPopoverPage } from '../popups/add-friend-popover/add-friend-popover.page';

@Component({
  selector: 'app-account',
  templateUrl: './account.page.html',
  styleUrls: ['./account.page.scss'],
})
export class AccountPage implements OnInit {
  public user = {} as User;

  public following = [] as Friend[]
  public leaderboard = [] as User[];
  constructor(public globalSvc: GlobalService, private popover: PopoverController, private userSvc: UserService) { }

  ngOnInit() {
    this.globalSvc.user.subscribe(user =>{
      this.user = user as User;
    });

    if(this.user && this.user.UserID){
      this.userSvc.GetLeaderBoard().subscribe(leaderboard =>{
        console.log(leaderboard)
        this.leaderboard = leaderboard as User[];
      })
      console.log(this.userSvc.GetFriendsList(this.user.UserID));
      this.userSvc.GetFriendsList(this.user.UserID).subscribe(followers =>{
        this.following = followers as Friend[];
        console.log(this.following)
      });
    }

    
  }

  OpenPopover(){
    this.popover.create({component: AddFriendPopoverPage,
    showBackdrop: true}).then((popoverElement) =>{
      popoverElement.present();
    })
  }

  RemoveFriend(friend: Friend){
    this.userSvc.RemoveUserFriend(friend.DocumentID, this.user.UserID)
  }

}
