import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AddFriendPopoverPage } from './add-friend-popover.page';

const routes: Routes = [
  {
    path: '',
    component: AddFriendPopoverPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AddFriendPopoverPageRoutingModule {}
