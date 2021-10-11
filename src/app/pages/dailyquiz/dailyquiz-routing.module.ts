import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DailyquizPage } from './dailyquiz.page';

const routes: Routes = [
  {
    path: '',
    component: DailyquizPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DailyquizPageRoutingModule {}
