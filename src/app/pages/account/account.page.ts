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
  public editing = false;

  //these are seperated from the rest of the fields so that any updates don't trigger subscriptions right away.
  public firstname = "";
  public lastname = "";

  constructor(public globalSvc: GlobalService, private popover: PopoverController, private userSvc: UserService, private authSvc: AuthenticationService) { }

  ngOnInit() {
    this.globalSvc.user.subscribe(user =>{
      this.user = user as User;
      this.firstname = user.FirstName;
      this.lastname = user.LastName;
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

  EditProfile(){
    //flips the switch for editing, updates the html
    if(this.firstname.length > 0 && this.lastname.length > 0){
      this.user.FirstName = this.firstname;
      this.user.LastName = this.lastname;
      console.log("Updating User");
      console.log(this.user)
      this.authSvc.UpdateUserDoc(this.user, this.user.UserID).then(result =>{
        this.editing = false;
      })
    }else{
      alert("First and Last name required");
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
