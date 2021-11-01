import { AfterViewInit, Component, ContentChildren, ElementRef, OnInit, QueryList, ViewChildren } from '@angular/core';
import { GestureController, IonCard, Platform } from '@ionic/angular';
import { NewsFeed } from '../../interfaces/INewsFeed';
import { NewsFeedService } from '../../services/news-feed.service';

@Component({
  selector: 'app-newsfeed',
  templateUrl: './newsfeed.page.html',
  styleUrls: ['./newsfeed.page.scss'],
})
export class NewsfeedPage implements OnInit, AfterViewInit{

  //This retrieves every card on the html template, assume every card is a question
  @ViewChildren(IonCard, {read: ElementRef}) cards: QueryList<ElementRef>;
  constructor(private newsSvc: NewsFeedService, private gestureCtrl: GestureController, private platform: Platform) { }

  //This is initialized as empty first so that it doesn't break the onload functions
  private newsList = []  as NewsFeed[];

  ngOnInit(){
    this.newsSvc.GetAllDocuments().subscribe(result =>{
      this.newsList = result as NewsFeed[];
    });
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

            //check whether the answer is correct
            if(!this.newsList[i].IsFake){
              alert("correct!")
            }
            else{
              alert("wrong");
            }
          }
          //swipe right
          else if(ev.deltaX <  -150){
            card.nativeElement.style.transform = `translateX(-${
              +this.platform.width() * 2
            }px) rotate(${ev.deltaX / 2}deg)`;

            //check for whether the answer is correct
            if(this.newsList[i].IsFake){
              alert("correct!")
              
            }
            else{
              alert("wrong")
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
        card.nativeElement.style.transform = `translateX(${
          +this.platform.width() * 2
        }px)`;
        alert("correct");
      }
      else{
        card.nativeElement.style.transition = '.5s ease-out';
        card.nativeElement.style.transform = `translateX(-${
          +this.platform.width() * 2
        }px)`;
        alert("WRONG")
      }
    }
    //they hit "fake"
    else{
      //they get it right
      if(newsfeed.IsFake){
        card.nativeElement.style.transition = '.5s ease-out';
        card.nativeElement.style.transform = `translateX(${
          +this.platform.width() * 2
        }px)`;
        alert("correct");
      }
      else{
        card.nativeElement.style.transition = '.5s ease-out';
        card.nativeElement.style.transform = `translateX(-${
          +this.platform.width() * 2
        }px)`;
        alert("WRONG")
      }
    }
  }

  //Code from https://github.com/mallajay/Ionic-5-Swiper-Gestures (A demo project)
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
