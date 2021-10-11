import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DailyquizPageRoutingModule } from './dailyquiz-routing.module';

import { DailyquizPage } from './dailyquiz.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DailyquizPageRoutingModule
  ],
  declarations: [DailyquizPage]
})
export class DailyquizPageModule {}
