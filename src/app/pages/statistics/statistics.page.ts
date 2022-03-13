import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Stats } from 'src/app/interfaces/IStats';
import { User } from 'src/app/interfaces/IUser';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { GlobalService } from 'src/app/services/global.service';
import { NewsFeedService } from 'src/app/services/news-feed.service';
import { UserService } from 'src/app/services/user.service';
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
  @ViewChild('lineCanvas') private lineCanvas: ElementRef;


  public stats = [] as Stats[];
  doughnutChart: any;
  lineChart: any;
  public labels = [] as string[];
  public values = [] as number[];
  public statMap = new Map<string, number>()
  public trueStatMap = new Map<string, number>()
  public isDataLoaded: boolean = false;

 
  ngOnInit() {
   
    this.globalSvc.user.subscribe(user =>{
      this.user = user as User;
    })

    if(this.user && this.user.UserID){
      console.log(this.user.UserID)
      
      this.userSvc.GetUserStats(this.user.UserID).subscribe(results =>{
        this.stats = results as Stats[]
        console.log(this.stats);
        this.buildStatMap();
        console.log(this.statMap);
        this.doughnutChartMethod();
         
      });
    }
    else{ //delete this later
      
      this.userSvc.GetUserStats("Anonymous").subscribe(results =>{
        this.stats = results as Stats[]
        console.log(this.stats);
        this.buildStatMap();
        console.log(this.statMap);
        this.doughnutChartMethod();
      })
    }

   this.userSvc.GetUserStatsIfTrue(this.user.UserID).subscribe(trueResults =>{
      this.stats = trueResults as Stats [] 
      this.buildTrueStatMap();
      this.lineChartMethod();
    })
   

  }

  buildStatMap(){
    this.statMap = new Map<string, number>()
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
    
  }
  
  buildTrueStatMap(){
    this.trueStatMap = new Map<string, number>()
    this.stats.forEach(stat =>{
      if(this.trueStatMap.has(stat.DateAdded)){
        let value = this.trueStatMap.get(stat.DateAdded);
        value = value + 1;
        this.trueStatMap.set(stat.DateAdded, value); //if the category exists, iterate the value associated with it.
      }
      else{
        this.trueStatMap.set(stat.DateAdded, 1);
      }
    });
  }

  
  doughnutChartMethod(){
    
    this.doughnutChart = new Chart(this.doughnutCanvas.nativeElement, {
      type: 'doughnut',
      data: {
        labels: [...this.statMap.keys()],
        datasets: [{  
          data: [...this.statMap.values()],
           backgroundColor: [
            'rgba(255, 99, 132, 0.2)',
            'rgba(17, 18, 17, 0.2)',
            'rgba(255, 205, 86, 0.2)',
            'rgba(75, 192, 192, 0.2)',
            'rgba(54, 162, 235, 0.2)',
            'rgba(153, 102, 255, 0.2)',
            'rgba(201, 203, 207, 0.2)',
            'rgba(245, 40, 145, 0.2)',
            'rgba(143, 245, 39, 0.2)',
            'rgba(198, 161, 121, 0.2)',
            'rgba(176, 244, 242, 0.2)',
            'rgba(249, 255, 50, 0.2)',
            'rgba(255, 0, 0, 0.2)'

           ],
            borderColor: [
            'rgb(255, 99, 132)',
            'rgb(17, 18, 17)',
            'rgb(255, 159, 64)',
            'rgb(75, 192, 192)',
            'rgb(54, 162, 235)',
            'rgb(153, 102, 255)',
            'rgb(201, 203, 207)',
            'rgb(245, 40, 145)',
            'rgb(143, 245, 39)',
            'rgb(198, 161, 121)',
            'rgb(176, 244, 242)',
            'rgb(249, 255, 50)',
            'rgb(255, 0, 0)'
          ],
        }]
      }
    });

  }


    lineChartMethod() {
      this.lineChart = new Chart(this.lineCanvas.nativeElement, {
        type: 'line',
        data: {
          datasets: [
            {
              label: 'Correct choices by day',
              fill: false,
              lineTension: 0.3,
              backgroundColor: 'rgba(75,192,192,0.4)',
              borderColor: 'rgba(75,192,192,1)',
              borderCapStyle: 'butt',
              borderDash: [],
              borderDashOffset: 0.0,
              borderJoinStyle: 'miter',
              pointBorderColor: 'rgba(75,192,192,1)',
              pointBackgroundColor: '#fff',
              pointBorderWidth: 1,
              pointHoverRadius: 5,
              pointHoverBackgroundColor: 'rgba(75,192,192,1)',
              pointHoverBorderColor: 'rgba(220,220,220,1)',
              pointHoverBorderWidth: 2,
              pointRadius: 1,
              pointHitRadius: 10,
              data: [ 
          { x: "2022-01-03", y: 3 },
          { x: "2022-01-12", y: 6 },
          { x: "2022-01-16", y: 7 },
          { x: "2022-02-01", y: 15 },
          { x: "2022-02-03", y: 10 },
          { x: "2022-02-08", y: 14},
          { x: "2022-02-12", y: 6 },
          { x: "2022-02-19", y: 10 },
          { x: "2022-02-22", y: 11 },
          { x: "2022-02-28", y: 17},
          { x: "2022-03-02", y: 13 },
          { x: "2022-03-07", y: 19 }
        ],
      }]
    },
    options: {
      responsive: true,
      legend: {
        display: true
      },
      scales: {
        yAxes: [{
          startAtZero: true,
          ticks: {
            stepsize: 1,
            display: true,
          },        
          gridLines: {
            display: true
          }
        }],
        xAxes: [{
          label:'# of ',
          type: 'time',
          time: {
            unit: 'day',
            tooltipFormat: 'MMM DD'
          },
          gridLines: {
            display:false
          }
        }]
      }
    }
        
      });}
  
     
  ngAfterViewInit(): void {      
  if(this.isDataLoaded = true){
     this.doughnutChartMethod();
    this.lineChartMethod();
  }
}
}
