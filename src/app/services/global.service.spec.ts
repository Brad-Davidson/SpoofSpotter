import { TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';
import { AngularFirestore, AngularFirestoreModule } from '@angular/fire/compat/firestore';
import { environment } from 'src/environments/environment';
import { RouterTestingModule } from "@angular/router/testing";

import { GlobalService } from './global.service';

describe('GlobalService', () => {
  let service: GlobalService;

  beforeEach(() => {
    TestBed.configureTestingModule({imports: [IonicModule.forRoot(),
      AngularFireAuthModule,
      AngularFirestoreModule,
      AngularFireModule.initializeApp(environment.firebaseConfig),
      RouterTestingModule.withRoutes([])
  ],
  providers: [AngularFirestore]
  });
    service = TestBed.inject(GlobalService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
