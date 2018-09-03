import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { Push } from '@ionic-native/push';
import { BackgroundMode } from '@ionic-native/background-mode';
import { Geolocation } from '@ionic-native/geolocation';
import { HttpModule } from '@angular/http';

//Pages
import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { LoginPage } from '../pages/login/login';
import { MapPage } from '../pages/map/map';
import { MyCarsPage } from '../pages/my-cars/my-cars';
import { MyCarsDetailsPage } from '../pages/my-cars-details/my-cars-details';
import { ConfigPage } from '../pages/config/config';
import { NotificationPage } from '../pages/notification/notification';
import { PathsPage } from '../pages/paths/paths';
import { DisplacementsPage } from '../pages/displacements/displacements';
import { AboutPage } from '../pages/about/about';

//Providers
import { LoginProvider } from '../providers/login/login';

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    AboutPage,
    LoginPage,
    MapPage,
    MyCarsPage,
    MyCarsDetailsPage,
    ConfigPage,
    NotificationPage,
    PathsPage,
    DisplacementsPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    HttpModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    AboutPage,
    LoginPage,
    MapPage,
    MyCarsPage,
    MyCarsDetailsPage,
    ConfigPage,
    NotificationPage,
    PathsPage,
    DisplacementsPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    Push,
    Geolocation,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    LoginProvider,
    BackgroundMode
  ]
})
export class AppModule {}
