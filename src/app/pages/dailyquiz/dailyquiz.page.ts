import { Component, OnInit} from '@angular/core';
import { AlertController } from '@ionic/angular';
import { NewsFeed } from 'src/app/interfaces/INewsFeed';
import { User } from 'src/app/interfaces/IUser';
import { GlobalService } from 'src/app/services/global.service';
import { NewsFeedService } from 'src/app/services/news-feed.service';
import {Storage} from '@capacitor/storage';

import { SplashScreen } from '@capacitor/splash-screen';
import { Router } from '@angular/router';
import { AuthenticationService } from 'src/app/services/authentication.service';

@Component({
  selector: 'app-dailyquiz',
  templateUrl: './dailyquiz.page.html',
  styleUrls: ['./dailyquiz.page.scss'],
})
export class DailyquizPage implements OnInit {

  constructor(public newsSvc: NewsFeedService, private authSvc: AuthenticationService, private alertController:AlertController, public globalSvc: GlobalService, private router: Router) { }
  public user = {} as User;

  public quizHeadlines = [] as NewsFeed[];
  public selectedIndex;

  async showAlertCorrect(){
   
    await this.alertController.create({
      header: 'Correct',
      
      message: 'Great Job!',
      buttons:['Next']
    
    }).then(res=> res.present());
  }

  async showAlertWrong(){
   
    await this.alertController.create({
      header: 'Wrong',
     
      message: 'Try again tomorrow',
      buttons:['Close']
    
    }).then(res=> res.present());
  }

  async showTimerAlert(){
   
    await this.alertController.create({
      header: 'Uh oh',
      
      message: 'You have already done a quiz today, come again tomorrow.',
      buttons:['Okay']
    
    }).then(res=> res.present());
  }
  ngOnInit() {
    const ret = Storage.get({key: 'quiz'});
    ret.then(result =>{
      if(result.value != null){
        console.log(result);
        let dateStr = JSON.parse(result.value);
        let quizDate = new Date(dateStr.date);
  
        let currentDate = new Date();
        if(quizDate.toDateString() == currentDate.toDateString()){
          this.showTimerAlert();
          this.router.navigateByUrl('/', {
            replaceUrl: true
          });
        }
        else{
          this.newsSvc.GetAllDocuments().subscribe(results =>{
            let newsHeadlines = results as NewsFeed[];
            let fakeNews = newsHeadlines.filter(x => x.IsFake).sort(() => 0.5 - Math.random()); //shuffle the fake headlines into a list
            let realNews = newsHeadlines.filter(x => !x.IsFake).sort(() => 0.5 - Math.random()); //shuffle the real headlines into a list
            
            //build quiz, 3 real and 1 fake
            this.quizHeadlines.push(realNews.pop());
            this.quizHeadlines.push(realNews.pop());
            this.quizHeadlines.push(realNews.pop());
            this.quizHeadlines.push(fakeNews.pop());
    
            //shuffel the quiz list so the fake headline is hidden
            this.quizHeadlines.sort(() => 0.5 - Math.random());
            console.log(this.quizHeadlines);
          });
          this.globalSvc.user.subscribe(user =>{
            this.user = user as User;
          }) 
        }
      }
      else{
        this.newsSvc.GetAllDocuments().subscribe(results =>{
          let newsHeadlines = results as NewsFeed[];
          let fakeNews = newsHeadlines.filter(x => x.IsFake).sort(() => 0.5 - Math.random()); //shuffle the fake headlines into a list
          let realNews = newsHeadlines.filter(x => !x.IsFake).sort(() => 0.5 - Math.random()); //shuffle the real headlines into a list
          
          //build quiz, 3 real and 1 fake
          this.quizHeadlines.push(realNews.pop());
          this.quizHeadlines.push(realNews.pop());
          this.quizHeadlines.push(realNews.pop());
          this.quizHeadlines.push(fakeNews.pop());
  
          //shuffel the quiz list so the fake headline is hidden
          this.quizHeadlines.sort(() => 0.5 - Math.random());
          console.log(this.quizHeadlines);
        });
        this.globalSvc.user.subscribe(user =>{
          this.user = user as User;
        }) 
      }
    });
  }

  CheckQuiz(){
    //check to see if any quiz headlines is selected
    if(this.selectedIndex){
      Storage.set({
        key: 'quiz',
        value: JSON.stringify({date: new Date()})
      });
      if(this.quizHeadlines[this.selectedIndex].IsFake){
        this.showAlertCorrect();
        if(this.user && this.user.UserID){
          //this is where we would add to their points
          this.user.Points += 250;
          this.user.Streak += 1;
          this.authSvc.UpdateUserDoc(this.user, this.user.UserID);
        }
      }
      else{
        this.showAlertWrong();
        if(this.user && this.user.UserID){
          //this is where we would add to their points
          this.user.Streak = 0;
          this.authSvc.UpdateUserDoc(this.user, this.user.UserID);
        }
      }
      this.router.navigateByUrl('/', {
        replaceUrl: true
      });
    }
    else{
      alert("You must select a headline before submitting");
    }
  }

}
