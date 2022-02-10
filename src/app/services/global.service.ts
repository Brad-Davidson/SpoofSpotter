import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { User } from '../interfaces/IUser';

@Injectable({
  providedIn: 'root'
})
export class GlobalService {
  private _user: BehaviorSubject<User> = new BehaviorSubject({} as User);

  public readonly user: Observable<User> = this._user.asObservable();

  constructor() { }

  get getLoggedInUser(){
    return this._user.asObservable();
  }

  setLoggedInUser(user: User){
    this._user.next(user);
  }

}
