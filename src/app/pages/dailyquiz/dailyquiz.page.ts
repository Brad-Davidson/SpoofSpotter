import { Component, OnInit} from '@angular/core';
import { AlertController } from '@ionic/angular';
import { NewsFeed } from 'src/app/interfaces/INewsFeed';
import { NewsFeedService } from 'src/app/services/news-feed.service';

@Component({
  selector: 'app-dailyquiz',
  templateUrl: './dailyquiz.page.html',
  styleUrls: ['./dailyquiz.page.scss'],
})
export class DailyquizPage implements OnInit {

  constructor(public newsSvc: NewsFeedService, private alertController:AlertController) { }
  public currentStreak: string = "3";

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
  ngOnInit() {
      this.newsSvc.GetAllDocuments().subscribe(results =>{
        let newsHeadlines = results as NewsFeed[];
        let fakeNews = newsHeadlines.filter(x => x.IsFake).sort(() => 0.5 - Math.random());
        let realNews = newsHeadlines.filter(x => !x.IsFake).sort(() => 0.5 - Math.random());
        
        this.quizHeadlines.push(realNews.pop());
        this.quizHeadlines.push(realNews.pop());
        this.quizHeadlines.push(realNews.pop());
        this.quizHeadlines.push(fakeNews.pop());

        this.quizHeadlines.sort(() => 0.5 - Math.random());
        console.log(this.quizHeadlines);
      });
  
  }

  CheckQuiz(){
    //check to see if any quiz headlines is selected
    if(this.selectedIndex){
      if(this.quizHeadlines[this.selectedIndex].IsFake){
        this.showAlertCorrect();
      }
      else{
        this.showAlertWrong();
      }
    }
    else{
      alert("You must select a headline before submitting");
    }
  }

}
