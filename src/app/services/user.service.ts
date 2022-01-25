import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private db: AngularFirestore, private auth: AngularFireAuth) { }

  GetUserStats(userID){
    return this.db.collection('Statistics', ref => ref.where('UserID', '==', userID)).valueChanges();
  }
}
