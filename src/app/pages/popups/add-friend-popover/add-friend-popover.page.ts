import { Component, OnInit } from '@angular/core';
import { PopoverController } from '@ionic/angular';
import { Friend } from 'src/app/interfaces/IFriend';
import { User } from 'src/app/interfaces/IUser';
import { GlobalService } from 'src/app/services/global.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-add-friend-popover',
  templateUrl: './add-friend-popover.page.html',
  styleUrls: ['./add-friend-popover.page.scss'],
})
export class AddFriendPopoverPage implements OnInit {

  constructor(private popover: PopoverController, private userSvc: UserService, private globalSvc: GlobalService) { }

  public username = "" as string;
  public user = {} as User;

  ngOnInit() {
    this.globalSvc.user.subscribe(user =>{
      this.user = user;
    })
  }
  AddFollower(){
    if(this.user.UserID){
      this.userSvc.GetUserByUsername(this.username).subscribe(results =>{
        console.log(results)
        if(results.length > 0){
          let foundUser = results[0] as User;
          this.userSvc.AddUserFriend(foundUser.UserID, foundUser.UserName, this.user.UserID).then(docID =>{
            let friend = {} as Friend;
            friend.DocumentID = docID.id as string;
            friend.FriendID = foundUser.UserID;
            friend.FriendName = this.username;
            this.userSvc.UpdateUserFriend(friend, this.user.UserID).then(finished =>{
              console.log("friend added");
              this.popover.dismiss();
            })
          })
        }
      })
    }
    else{
      console.log("Cannot add friend as anonymous user")
    }
  }
  ClosePopover(){
    this.popover.dismiss();
  }

}
