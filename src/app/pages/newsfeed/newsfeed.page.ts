import { AfterViewInit, Component, ContentChildren, ElementRef, OnInit, QueryList, ViewChildren } from '@angular/core';
import { AlertController, GestureController, IonCard, Platform } from '@ionic/angular';
import { User } from 'src/app/interfaces/IUser';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { GlobalService } from 'src/app/services/global.service';
import { NewsFeed } from '../../interfaces/INewsFeed';
import { NewsFeedService } from '../../services/news-feed.service';

@Component({
  selector: 'app-newsfeed',
  templateUrl: './newsfeed.page.html',
  styleUrls: ['./newsfeed.page.scss'],
})
export class NewsfeedPage implements OnInit, AfterViewInit{
  @ViewChildren(IonCard, {read: ElementRef}) cards: QueryList<ElementRef>;
  constructor(private newsSvc: NewsFeedService, private gestureCtrl: GestureController, private platform: Platform,
     private alertController:AlertController, private authSvc: AuthenticationService, public globalSvc: GlobalService) { }

  //This is initialized as empty first so that it doesn't break the onload functions
  private newsList = []  as NewsFeed[];
  public user = {} as User;
  private longPressActive = false;

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
     
      message: 'Try again!',
      buttons:['Next']
    
    }).then(res=> res.present());
  }
  ngOnInit(){
    this.newsSvc.GetAllDocuments().subscribe(result =>{
      this.newsList = result as NewsFeed[];
      this.newsList = this.newsList.sort(() => 0.5 - Math.random())
    });
    this.user = this.globalSvc.getLoggedInUser;
  }
  ngAfterViewInit() {
    this.cards.changes.subscribe(cardArray =>{
      if(cardArray){
        this.useSwipe(cardArray.toArray());
      }
    });
  }


  
  useSwipe(cardArray){
    for(let i = 0; i < cardArray.length; i++){
      const card = cardArray[i];
      const gesture = this.gestureCtrl.create({
        el: card.nativeElement,
        gestureName: 'swipe',
        onStart: ev => {
        },
        onMove: ev => {
          card.nativeElement.style.transform = `translateX(${ev.deltaX}px) rotate(${ev.deltaX / 10}deg)`;
          this.setCardColor(ev.deltaX, card.nativeElement);
        },
        onEnd: ev => {
          card.nativeElement.style.transition = '.5s ease-out';
          //swipe left
          if(ev.deltaX > 150){
            card.nativeElement.style.transform = `translateX(${
              +this.platform.width() * 2
            }px) rotate(${ev.deltaX / 2}deg)`;
            if(!this.newsList[i].IsFake){
              this.showAlertCorrect()
              if(this.user && this.user.UserID){
                //this is where we would add to their points
                this.user.Points += 100;
                this.authSvc.UpdateUserDoc(this.user, this.user.UserID);
              }
            }
            else{
              this.showAlertWrong();
            }
          }
          //swipe right
          else if(ev.deltaX <  -150){
            card.nativeElement.style.transform = `translateX(-${
              +this.platform.width() * 2
            }px) rotate(${ev.deltaX / 2}deg)`;
            if(this.newsList[i].IsFake){
              this.showAlertCorrect();
              //check to see if the user is logged in. If they are, update their score.
              if(this.user && this.user.UserID){
                //this is where we would add to their points
                this.user.Points += 100;
                this.authSvc.UpdateUserDoc(this.user, this.user.UserID);
              }
            }
            else{
              this.showAlertWrong()
            }
          }
          else{
            card.nativeElement.style.transform = '';
          }
        }
      });
      gesture.enable(true);
    }
  }

  Guess(newsfeed, guessReal){
    let index = this.newsList.indexOf(newsfeed) as number;
    let card = this.cards.toArray()[index];
    //they hit "real"
    if(guessReal){
      //they get it right
      if(!newsfeed.IsFake){
        card.nativeElement.style.transition = '.5s ease-out';
        // card.nativeElement.style.transform = `translateX(${
        //   +this.platform.width() * 2
        // }px)`;
        card.nativeElement.style.visibility = 'hidden'
        this.showAlertCorrect();
        if(this.user && this.user.UserID){
          //this is where we would add to their points
          this.user.Points += 100;
          this.authSvc.UpdateUserDoc(this.user, this.user.UserID);
        }
      }
      else{
        card.nativeElement.style.transition = '.5s ease-out';
        card.nativeElement.style.visibility = 'hidden'
        this.showAlertWrong();
      }
    }
    //they hit "fake"
    else{
      //they get it right
      if(newsfeed.IsFake){
        card.nativeElement.style.transition = '.5s ease-out';
        // card.nativeElement.style.transform = `translateX(${
        //   +this.platform.width() * 2
        // }px)`;
        card.nativeElement.style.visibility = 'hidden'
        this.showAlertCorrect();
        if(this.user && this.user.UserID){
          //this is where we would add to their points
          this.user.Points += 100;
          this.authSvc.UpdateUserDoc(this.user, this.user.UserID);
        }
      }
      else{
        card.nativeElement.style.transition = '.5s ease-out';
        card.nativeElement.style.visibility = 'hidden'
        this.showAlertWrong();
      }
    }
  }

  setCardColor(x, element) {
    let color = "";
    const abs = Math.abs(x);
    const min = Math.trunc(Math.min(16 * 16 - abs, 16 * 16));
    const hexCode = this.decimalToHex(min, 2);

    if (x < 0) {
      color = "#FF" + hexCode + "FF" + hexCode;
    } else {
      color = "#" + hexCode + "FF" + hexCode;
    }
    element.style.background = color;
  }

  decimalToHex(d, padding) {
    let hex = Number(d).toString(16);
    padding =
      typeof padding === "undefined" || padding === null
        ? (padding = 2)
        : padding;

    while (hex.length < padding) {
      hex = "0" + hex;
    }
    return hex;
  }

}
