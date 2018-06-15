import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { DisplacementsPage } from './displacements';

@NgModule({
  declarations: [
    DisplacementsPage,
  ],
  imports: [
    IonicPageModule.forChild(DisplacementsPage),
  ],
})
export class DisplacementsPageModule {}
