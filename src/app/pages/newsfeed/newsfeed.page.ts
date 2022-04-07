import { AfterViewInit, Component, ContentChildren, ElementRef, OnInit, QueryList, ViewChildren } from '@angular/core';
import { Router } from '@angular/router';
import { Browser } from '@capacitor/browser';
import { AlertController, GestureController, IonCard, Platform } from '@ionic/angular';
import { Stats } from 'src/app/interfaces/IStats';
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
     private alertController:AlertController, private authSvc: AuthenticationService, public globalSvc: GlobalService,  public router: Router) { }

  //This is initialized as empty first so that it doesn't break the onload functions
  private newsList = []  as NewsFeed[];
  public user = {} as User;
  private longPressActive = false;

  private alertMessage = new Map<string, string>();

  async showFeedback(newsfeed: NewsFeed, answer: boolean, isCorrect: boolean){
   
    await this.alertController.create({
      header: isCorrect ? 'Correct'
       : 'Wrong',
      
      message: isCorrect ? '<p>Great Job!</p>' 
      : '<p>Better luck next time!</p><p>' + (this.alertMessage.has(newsfeed.Category) ? this.alertMessage.get(newsfeed.Category) : 'Please review our training module if you find you need help!') + '</p>',
      buttons:[{
        text: 'Source',
        handler: () => {
          this.OpenBrowser(newsfeed.NewsSource)
        }
        
      },
      {text: 'Training',
      handler: () =>{
        this.router.navigateByUrl("/training", {replaceUrl: true});
      }
    },'Next']
    
    }).then(res=> {
      res.present();
      this.LogAnswer(newsfeed, answer);
    });
  }

  ngOnInit(){
    //initialize the map
    this.alertMessage.set("Current Events", "Looks like you're having some issues with the Current Events category. There can be a lot of conflicting information when a big event happens, so try to find multiple sources sharing the same story. This is more likely to be legitimate.")
    this.alertMessage.set("Politics", "Looks like you're having some issues with the Politics category. It can be difficult, but try to keep personal bias out of your judgement with political news.");
    this.alertMessage.set("Sports", "Looks like you're having some issues with the Sports category. Tom Brady didn't retire after all but that's ok.");
    this.alertMessage.set("Business", "Looks like you're having some issues with the Business category. If something seems too good to be true, it likely is. Try to use critical thinking and your best judgement with business news.");
    this.alertMessage.set("Entertainment", "Looks like you're having some issues with the Entertainment category. Celebrities get up to some crazy antics, but try to verify anything that seems too excessive.");
    this.alertMessage.set("General", " Looks like you're having some issues with the General category. Lots of misinformation can be very convincing, so keep an eye out for things that seem unreasonable or unrealistic.");

    this.newsSvc.GetAllDocuments().subscribe(result =>{
      this.newsList = result as NewsFeed[];
      this.newsList = this.newsList.sort(() => 0.5 - Math.random())
    });
    this.globalSvc.user.subscribe(user =>{
      console.log("Getuser from NewsFeed")
      this.user = user as User;
    })
  }
  ngAfterViewInit() {
    this.cards.changes.subscribe(cardArray =>{
      if(cardArray){
        this.useSwipe(cardArray.toArray());
      }
    });
  }

  async OpenBrowser(url){
    console.log(url);
    await Browser.open({url: url});
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
          //swipe right
          if(ev.deltaX > 150){
            card.nativeElement.style.transform = `translateX(${
              +this.platform.width() * 2
            }px) rotate(${ev.deltaX / 2}deg)`;
            
            if(!this.newsList[i].IsFake){
              this.showFeedback(this.newsList[i], true, true)
              if(this.user && this.user.UserID){
                //this is where we would add to their points
                this.user.Points += 100;
                this.authSvc.UpdateUserDoc(this.user, this.user.UserID);
              }
            }
            else{
              this.showFeedback(this.newsList[i], true, false);
            }
            //this.LogAnswer(this.newsList[i], true);
          }
          //swipe left
          else if(ev.deltaX <  -150){
            card.nativeElement.style.transform = `translateX(-${
              +this.platform.width() * 2
            }px) rotate(${ev.deltaX / 2}deg)`;
            if(this.newsList[i].IsFake){
              this.showFeedback(this.newsList[i], false, true);
              //check to see if the user is logged in. If they are, update their score.
              if(this.user && this.user.UserID){
                //this is where we would add to their points
                this.user.Points += 100;
                this.authSvc.UpdateUserDoc(this.user, this.user.UserID);
              }
            }
            else{
              this.showFeedback(this.newsList[i], false, false)
            }
            //this.LogAnswer(this.newsList[i], false);
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
        this.showFeedback(newsfeed, true, true);
        if(this.user && this.user.UserID){
          //this is where we would add to their points
          this.user.Points += 100;
          this.authSvc.UpdateUserDoc(this.user, this.user.UserID);
        }
      }
      else{
        card.nativeElement.style.transition = '.5s ease-out';
        card.nativeElement.style.visibility = 'hidden'
        this.showFeedback(newsfeed, true, false);
      }
    }
    //they hit "fake"
    else{
      //this.LogAnswer(newsfeed, false);
      //they get it right
      if(newsfeed.IsFake){
        card.nativeElement.style.transition = '.5s ease-out';
        // card.nativeElement.style.transform = `translateX(${
        //   +this.platform.width() * 2
        // }px)`;
        card.nativeElement.style.visibility = 'hidden'
        this.showFeedback(newsfeed, false, true);
        if(this.user && this.user.UserID){
          //this is where we would add to their points
          this.user.Points += 100;
          this.authSvc.UpdateUserDoc(this.user, this.user.UserID);
        }
      }
      else{
        card.nativeElement.style.transition = '.5s ease-out';
        card.nativeElement.style.visibility = 'hidden'
        this.showFeedback(newsfeed, false, false);
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

  async LogAnswer(newsfeed: NewsFeed, answer: boolean){
    let stat = {} as Stats;
    stat.Category = newsfeed.Category;
    stat.NewsFeedID = newsfeed.HeadlineID;
    stat.UserAnswer = answer;
    stat.UserID = (this.user && this.user.UserID) ? this.user.UserID : "Anonymous";
    stat.DateAdded = new Date().toISOString().substring(0, 10);
    stat.IsFake = newsfeed.IsFake;
    stat.CorrectGuess = (stat.IsFake != stat.UserAnswer);

    this.newsSvc.LogAnswerDocument(stat).then((res) =>{
      console.log("Answer Logged");
    });
  }

}
