import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { NewsFeed } from '../interfaces/INewsFeed';

@Injectable({
  providedIn: 'root'
})
export class NewsFeedService {

  constructor(private db: AngularFirestore, private auth: AngularFireAuth) { }

  GetAllDocuments(){
    return this.db.collection('NewsFeeds').valueChanges();
  }

}
