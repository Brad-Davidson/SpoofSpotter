import { JsonPipe } from '@angular/common';
import { Injectable, NgZone } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/compat/firestore';
import { Router } from '@angular/router';
import firebase from 'firebase/compat/app';
import { User } from '../interfaces/IUser';


@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  userData: any;

  constructor(
    public fireAuth: AngularFireAuth,
    public router: Router,
    public ngZone: NgZone,
    public fireStore: AngularFirestore
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

  RegisterUser(email, password){
    return this.fireAuth.createUserWithEmailAndPassword(email, password);
  }
  CreateUserDoc(user){
    return this.fireStore.collection('Users').add(user);
  }
  UpdateUserDoc(user, userID){
    return this.fireStore.doc(`Users/${userID}`).update({UserID: userID, PrimaryEmail: user.PrimaryEmail});
  }

  PasswordRecover(passwordResetEmail){
    return this.fireAuth.sendPasswordResetEmail(passwordResetEmail).then(() =>{
      window.alert("Password reset email has been sent");
    });
  }

  get isLoggedIn(): boolean{
    const user = JSON.parse(localStorage.getItem('user'));
    return (user !== null) ? true: false;
  }

  get isEmailVerified(): boolean{
    const user = JSON.parse(localStorage.getItem('user'));
    return (user.emailVerified !== false);
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

  GetUserByEmail(email){
    return this.fireStore.collection("Users", ref => ref.where("PrimaryEmail", "==", email).limit(1)).valueChanges();
  }

  SetUserData(user){
    const userRef: AngularFirestoreDocument<any> = this.fireStore.doc(`users/${user.UserID}`);
    const userData: User = {
      UserID: user.UserID,
      UserName: user.UserName,
      PrimaryEmail: user.PrimaryEmail,
      FirstName: user.FirstName,
      LastName: user.UserName,
      Points: 0,
      Streak: 0,
      DateCreated: user.DateCreated,
      IsActive: user.IsActive
    }
  }

  SignOut(){
    return this.fireAuth.signOut().then(() =>{
      localStorage.removeItem('user');
      this.router.navigate(['login']);
    })
  }
}
