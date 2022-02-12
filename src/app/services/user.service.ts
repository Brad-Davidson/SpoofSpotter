import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Friend } from '../interfaces/IFriend';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private db: AngularFirestore, private auth: AngularFireAuth) { }

  //gets all of the headlines that a user has gotten wrong
  GetUserStats(userID){
    return this.db.collection('Statistics', ref => 
      ref.where('UserID', '==', userID, ).where('CorrectGuess', '==', false)).valueChanges();
  }

  GetUserByUsername(username){
    return this.db.collection('Users', ref => 
      ref.where('UserName', '==', username, )).valueChanges();
  }

  AddUserFriend(friendID, friendName, userID){
    return this.db.collection(`Users/${userID}/Friends`).add({
      'FriendID': friendID,
      'FriendName': friendName
    });
  }

  UpdateUserFriend(friend: Friend, userID){
    return this.db.doc(`Users/${userID}/Friends/${friend.DocumentID}`).update({
      'DocumentID': friend.DocumentID,
      'FriendID': friend.FriendID,
      'FriendName': friend.FriendName
    });
  }

  RemoveUserFriend(docID, userID){
    return this.db.doc(`Users/${userID}/Friends/${docID}`).delete();
  }

  GetFriendsList(userID){
    return this.db.collection(`Users/${userID}/Friends`).valueChanges();
  }

  GetLeaderBoard(){
    return this.db.collection('Users', ref => ref.orderBy('Points', 'desc').limit(5)).valueChanges();
  }
}
