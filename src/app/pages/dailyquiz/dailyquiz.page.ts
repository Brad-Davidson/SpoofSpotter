import { Component, OnInit } from '@angular/core';
import { NewsFeed } from 'src/app/interfaces/INewsFeed';
import { NewsFeedService } from 'src/app/services/news-feed.service';

@Component({
  selector: 'app-dailyquiz',
  templateUrl: './dailyquiz.page.html',
  styleUrls: ['./dailyquiz.page.scss'],
})
export class DailyquizPage implements OnInit {

  constructor(public newsSvc: NewsFeedService) { }
  public currentStreak: string = "3";

  public quizHeadlines = [] as NewsFeed[];
  public selectedIndex;
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
        alert('Correct, you rock!');
      }
      else{
        alert('Sorry, that is not correct');
      }
    }
    else{
      alert("You must select a headline before submitting");
    }
  }

}
