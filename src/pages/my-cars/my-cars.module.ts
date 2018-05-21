import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MyCarsPage } from './my-cars';

@NgModule({
  declarations: [
    MyCarsPage,
  ],
  imports: [
    IonicPageModule.forChild(MyCarsPage),
  ],
})
export class MyCarsPageModule {}
