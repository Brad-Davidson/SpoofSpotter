import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';

@Injectable({
  providedIn: 'root'
})
export class NewsFeedService {

  constructor(private db: AngularFirestore, private auth: AngularFireAuth) { }

  GetRandomNewsFeed(){
    this.auth.authState.subscribe(user =>{
        console.log(user.displayName);
        
      });
      return this.db.collection('NewsFeed').valueChanges();
      
  }
}
