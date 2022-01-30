import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Stats } from 'src/app/interfaces/IStats';
import { User } from 'src/app/interfaces/IUser';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { GlobalService } from 'src/app/services/global.service';
import { NewsFeedService } from 'src/app/services/news-feed.service';
import { UserService } from 'src/app/services/user.service';

import * as HighCharts from 'highcharts';
import {Chart} from 'chart.js';

@Component({
  selector: 'app-statistics',
  templateUrl: './statistics.page.html',
  styleUrls: ['./statistics.page.scss'],
})
export class StatisticsPage implements OnInit, AfterViewInit{

  constructor(private newsSvc: NewsFeedService, private userSvc: UserService, private authSvc: AuthenticationService, public globalSvc: GlobalService) {

   }

  public user = {} as User;
  @ViewChild('doughnutCanvas') private doughnutCanvas: ElementRef;
  public stats = [] as Stats[];
  doughnutChart: Chart;
  public labels = [] as string[];
  public values = [] as number[];
  public statMap = new Map<string, number>()
  public isDataLoaded: boolean = false;


  ngOnInit() {
    this.user = this.globalSvc.getLoggedInUser;

    if(this.user && this.user.UserID){
      console.log(this.user.UserID)
      this.userSvc.GetUserStats(this.user.UserID).subscribe(results =>{
        this.stats = results as Stats[]
        this.buildStatMap()
      });
    }
    else{ //delete this later
      this.userSvc.GetUserStats("Anonymous").subscribe(results =>{
        this.stats = results as Stats[]
        console.log(this.stats);
        this.buildStatMap()
      })
    }

  }

  buildStatMap(){
    this.stats.forEach(stat =>{
      if(this.statMap.has(stat.Category)){
        let value = this.statMap.get(stat.Category);
        value = value + 1;
        this.statMap.set(stat.Category, value); //if the category exists, iterate the value associated with it.
      }
      else{
        this.statMap.set(stat.Category, 1);
      }
    });
    this.isDataLoaded = true;
      if(this.doughnutChart){
        this.doughnutChart.update();
      }
    
  }

  ngAfterViewInit(): void {
    if(this.isDataLoaded){
    this.doughnutChart = new Chart(this.doughnutCanvas.nativeElement, {
      type: 'doughnut',
      data: {
        labels: [...this.statMap.keys()],
        datasets: [{
          label: '# of Incorrect guesses',
          data: [...this.statMap.values()],
        //   backgroundColor: [
        //     'rgba(255, 159, 64, 0.2)',
        //     'rgba(255, 99, 132, 0.2)',
        //     'rgba(54, 162, 235, 0.2)',
        //     'rgba(255, 206, 86, 0.2)',
        //     'rgba(75, 192, 192, 0.2)'
        //   ],
        //   hoverBackgroundColor: [
        //     '#FFCE56',
        //     '#FF6384',
        //     '#36A2EB',
        //     '#FFCE56',
        //     '#FF6384'
        //   ]
        }]
      }
    });
  }
  }



}
