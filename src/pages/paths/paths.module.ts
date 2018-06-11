import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PathsPage } from './paths';

@NgModule({
  declarations: [
    PathsPage,
  ],
  imports: [
    IonicPageModule.forChild(PathsPage),
  ],
})
export class PathsPageModule {}
