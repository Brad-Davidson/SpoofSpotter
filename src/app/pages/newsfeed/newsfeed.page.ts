import { Component, OnInit } from '@angular/core';
import { NewsFeedService } from 'src/app/services/news-feed.service';

@Component({
  selector: 'app-newsfeed',
  templateUrl: './newsfeed.page.html',
  styleUrls: ['./newsfeed.page.scss'],
})
export class NewsfeedPage implements OnInit {

  constructor(private newsSvc: NewsFeedService) { }

  ngOnInit() {
    this.newsSvc.GetAllDocuments().subscribe(result =>{
      console.log(result);
    })
  }

}
