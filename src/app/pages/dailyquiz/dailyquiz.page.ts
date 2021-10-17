import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-dailyquiz',
  templateUrl: './dailyquiz.page.html',
  styleUrls: ['./dailyquiz.page.scss'],
})
export class DailyquizPage implements OnInit {

  constructor() { }
  public currentStreak: string = "3";
  ngOnInit() {
  }

}
