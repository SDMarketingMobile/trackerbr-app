import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { LoginPage } from '../pages/login/login';
import { HomePage } from '../pages/home/home';
import { MapPage } from '../pages/map/map';
import { MyCarsPage } from '../pages/my-cars/my-cars';
import { ConfigPage } from '../pages/config/config';
import { NotificationPage } from '../pages/notification/notification';
import { MyCarsDetailsPage } from '../pages/my-cars-details/my-cars-details';
import { PathsPage } from '../pages/paths/paths';
import { DisplacementsPage } from '../pages/displacements/displacements';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage:any = LoginPage;

  constructor(platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();
    });
  }
}

