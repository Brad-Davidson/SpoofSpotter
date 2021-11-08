import { Component, } from '@angular/core';
import { Router } from '@angular/router';
import { DailyquizPage } from '../pages/dailyquiz/dailyquiz.page';
import { NewsfeedPage } from '../pages/newsfeed/newsfeed.page';
import { TrainingPage } from '../pages/training/training.page';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  dailyquiz:DailyquizPage;
  newsfeed:NewsfeedPage;
  training:TrainingPage;

  constructor(public route:Router){}

  goToDailyQuiz(){
    this.route.navigate(['/dailyquiz'])
  }
  goToNewsFeed(){
    this.route.navigate(['/newsfeed'])
  }
  goToTraining(){
    this.route.navigate(['/training'])
  }
}
