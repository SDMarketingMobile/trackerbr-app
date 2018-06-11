import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MyCarsDetailsPage } from './my-cars-details';

@NgModule({
  declarations: [
    MyCarsDetailsPage,
  ],
  imports: [
    IonicPageModule.forChild(MyCarsDetailsPage),
  ],
})
export class MyCarsDetailsPageModule {}
