import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Stats } from 'src/app/interfaces/IStats';
import { User } from 'src/app/interfaces/IUser';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { GlobalService } from 'src/app/services/global.service';
import { NewsFeedService } from 'src/app/services/news-feed.service';
import { UserService } from 'src/app/services/user.service';
import {Chart} from 'chart.js';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { getOptions, map } from 'highcharts';



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
  public statsTrue = [] as Stats[];
  doughnutChart: Chart;
  lineChart: Chart;
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

    if(this.user && this.user.UserID){
      console.log(this.user.UserID)
      
      this.userSvc.GetUserTrueStats(this.user.UserID).subscribe(results =>{
        this.statsTrue = results as Stats[]
        console.log(this.statsTrue);
        this.buildTrueStatMap();
        this.lineChartMethod();
        
      });
    }
    else{ //delete this later
      this.userSvc.GetUserTrueStats("Anonymous").subscribe(results =>{
        this.statsTrue = results as Stats[]
        this.buildTrueStatMap();
        this.lineChartMethod();
        
      })
    }

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
    this.statsTrue.forEach(stat =>{
   
      if(this.trueStatMap.has(stat.DateAdded)){
        let value = this.trueStatMap.get(stat.DateAdded);
        value = value + 1;
        this.trueStatMap.set(stat.DateAdded, value); //if the date exists, iterate the value associated with it.
      }
      else{
        this.trueStatMap.set(stat.DateAdded, 1);
      }
    });
  }

  lineChartMethod(){
    
    this.lineChart = new Chart(this.lineCanvas.nativeElement, {
      type: 'line',
      data: {
        labels: [...this.trueStatMap.keys()],
        datasets: [
          {
            data: [...this.trueStatMap.values()],
              label: 'Total Questions',
              fill: false,
              lineTension: 2.0,
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
          }], 
              spanGaps: false,
              

        },
        options: {

          scales: {
            yAxes: [{
                ticks: {
                    beginAtZero: true
                }
            }],
        
          plugins: {
              sort:
                  {
                      enable: true,
                      sortFunction: (a,b) => {/** implement your own sort function here **/}
                  }
          }
        }
      }
        })
      }
          
      

  doughnutChartMethod(){
    
    this.doughnutChart = new Chart(this.doughnutCanvas.nativeElement, {
      type: 'doughnut',
      data: {
        labels: [...this.statMap.keys()],
        datasets: [{  
          data: [...this.statMap.values()],
           backgroundColor: [
            'rgba(21, 93, 236, 0.2)',
            'rgba(204, 54, 40, 0.2)',
            'rgba(255, 205, 86, 0.2)',
            'rgba(75, 252, 192, 0.2)',
            'rgba(54, 162, 235, 0.2)',
            'rgba(153, 102, 255, 0.2)',
            'rgba(39, 203, 68, 0.2)'
           ],
            borderColor: [
            'rgb(21, 93, 236)',
            'rgb(204, 54, 40)',
            'rgb(255, 205, 86)',
            'rgb(75, 252, 192)',
            'rgb(54, 162, 235)',
            'rgb(153, 102, 255)',
            'rgb(39, 203, 68)'],
        }]
      }
    });

  }

  ngAfterViewInit(): void {      
  if(this.isDataLoaded = true){
    this.lineChartMethod();
    this.doughnutChartMethod();
   this.lineChart.update();
   this.doughnutChart.update();
  }
    }

}
