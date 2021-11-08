import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';
import { AngularFirestore, AngularFirestoreModule } from '@angular/fire/compat/firestore';
import { environment } from 'src/environments/environment';
import { RouterTestingModule } from "@angular/router/testing";

import { DailyquizPage } from './dailyquiz.page';

describe('DailyquizPage', () => {
  let component: DailyquizPage;
  let fixture: ComponentFixture<DailyquizPage>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ DailyquizPage ],
      imports: [IonicModule.forRoot(),
        AngularFireAuthModule,
        AngularFirestoreModule,
        AngularFireModule.initializeApp(environment.firebaseConfig),
        RouterTestingModule.withRoutes([])
    ],
    providers: [AngularFirestore]
    }).compileComponents();

    fixture = TestBed.createComponent(DailyquizPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
