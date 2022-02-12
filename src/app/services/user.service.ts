import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';

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
}
