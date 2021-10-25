import { JsonPipe } from '@angular/common';
import { Injectable, NgZone } from '@angular/core';
import { AngularFireAuth, AngularFireAuthModule } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';
import firebase from 'firebase/compat/app';


@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  userData: any;

  constructor(
    public fireAuth: AngularFireAuth,
    public router: Router,
    public ngZone: NgZone
  ) { 
    this.fireAuth.authState.subscribe(user =>{
      if(user){
        this.userData = user;
        localStorage.setItem('user', JSON.stringify(this.userData));
        JSON.parse(localStorage.getItem('user'));
      }
      else{
        localStorage.setItem('user', null);
        JSON.parse(localStorage.getItem('user'));
      }
    });
  }

  SignIn(email, password){
    return this.fireAuth.signInWithEmailAndPassword(email, password);
  }

  get isLoggedIn(): boolean{
    const user = JSON.parse(localStorage.getItem('user'));
    return (user !== null) ? true: false;
  }
  
  GoogleAuth() {
    return this.AuthLogin(new firebase.auth.GoogleAuthProvider());
  }

  AuthLogin(provider){
    return this.fireAuth.signInWithPopup(provider)
    .then((result)=>
    {
      this.ngZone.run(() =>{
        this.router.navigate(['home']);
        alert("signed in");
      })
    });
  }
}
