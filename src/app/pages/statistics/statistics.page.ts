import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Stats } from 'src/app/interfaces/IStats';
import { User } from 'src/app/interfaces/IUser';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { GlobalService } from 'src/app/services/global.service';
import { NewsFeedService } from 'src/app/services/news-feed.service';
import { UserService } from 'src/app/services/user.service';
import {Chart} from 'chart.js';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { map } from 'highcharts';


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
  @ViewChild('barCanvas') private barCanvas: ElementRef;
  public stats = [] as Stats[];
  doughnutChart: Chart;
  barChart: Chart;
  public labels = [] as string[];
  public values = [] as number[];
  public statMap = new Map<string, number>()
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
        this.barChartMethod();
        this.doughnutChartMethod();
      });
    }
    else{ //delete this later
      
      this.userSvc.GetUserStats("Anonymous").subscribe(results =>{
        this.stats = results as Stats[]
        console.log(this.stats);
        this.buildStatMap();
        console.log(this.statMap);
        this.barChartMethod();
        this.doughnutChartMethod();
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

  barChartMethod(){
    
    this.barChart = new Chart(this.barCanvas.nativeElement, {
      type: 'bar',
      data: {
        label: "Categories",
        labels: [...this.statMap.keys()],
        datasets: [
          {    
            label: "# of Incorrect Guesses",
            data: [...this.statMap.values()],
            backgroundColor: ['rgba(255, 99, 132, 0.2)',
            'rgba(255, 159, 64, 0.2)',
            'rgba(255, 205, 86, 0.2)',
            'rgba(75, 192, 192, 0.2)',
            'rgba(54, 162, 235, 0.2)',
            'rgba(153, 102, 255, 0.2)',
            'rgba(201, 203, 207, 0.2)'],
            borderColor: ['rgb(255, 99, 132)',
            'rgb(255, 159, 64)',
            'rgb(255, 205, 86)',
            'rgb(75, 192, 192)',
            'rgb(54, 162, 235)',
            'rgb(153, 102, 255)',
            'rgb(201, 203, 207)'],
            borderWidth: 1,
          
          }
        ]
      }, options: {
        scales:{
          yAxes:[
            
            {label:"# of Incorrect Guesses",
              ticks:{
                beginAtZero: true
              }
            }
          ]
        }
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
            'rgba(255, 159, 64, 0.2)',
            'rgba(255, 205, 86, 0.2)',
            'rgba(75, 192, 192, 0.2)',
            'rgba(54, 162, 235, 0.2)',
            'rgba(153, 102, 255, 0.2)',
            'rgba(201, 203, 207, 0.2)'
           ],
            borderColor: ['rgb(255, 99, 132)',
            'rgb(255, 159, 64)',
            'rgb(255, 205, 86)',
            'rgb(75, 192, 192)',
            'rgb(54, 162, 235)',
            'rgb(153, 102, 255)',
            'rgb(201, 203, 207)'],
        }]
      }
    });

  }

  ngAfterViewInit(): void {      
  if(this.isDataLoaded = true){
    this.barChartMethod();
     this.doughnutChartMethod();
    this.barChart.update();
    this.doughnutChart.update();
    
    
    
    
    
    
  }
    }
     
    
}
