import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AddFriendPopoverPageRoutingModule } from './add-friend-popover-routing.module';

import { AddFriendPopoverPage } from './add-friend-popover.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AddFriendPopoverPageRoutingModule
  ],
  declarations: [AddFriendPopoverPage]
})
export class AddFriendPopoverPageModule {}
