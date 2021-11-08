import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';
import { AngularFirestore, AngularFirestoreModule } from '@angular/fire/compat/firestore';
import { environment } from 'src/environments/environment';
import { RouterTestingModule } from "@angular/router/testing";

import { NewsfeedPage } from './newsfeed.page';

describe('NewsfeedPage', () => {
  let component: NewsfeedPage;
  let fixture: ComponentFixture<NewsfeedPage>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ NewsfeedPage ],
      imports: [IonicModule.forRoot(),
        AngularFireAuthModule,
        AngularFirestoreModule,
        AngularFireModule.initializeApp(environment.firebaseConfig),
        RouterTestingModule.withRoutes([])
    ],
    providers: [AngularFirestore]
    }).compileComponents();

    fixture = TestBed.createComponent(NewsfeedPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
