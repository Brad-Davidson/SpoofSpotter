import { Injectable } from '@angular/core';
import { User } from '../interfaces/IUser';

@Injectable({
  providedIn: 'root'
})
export class GlobalService {
  private user: User;

  constructor() { }

  get getLoggedInUser(){
    return this.user;
  }
  setLoggedInUser(user: User){
    this.user = user;
  }
}
