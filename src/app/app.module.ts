import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { HttpModule } from '@angular/http';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { LoginPage } from '../pages/login/login';
import { MapPage } from '../pages/map/map';
import { MyCarsPage } from '../pages/my-cars/my-cars';
import { MyCarsDetailsPage } from '../pages/my-cars-details/my-cars-details';
import { ConfigPage } from '../pages/config/config';
import { NotificationPage } from '../pages/notification/notification';
import { AboutPage } from '../pages/about/about';
import { UsersProvider } from '../providers/users/users';
import { ProdutosProvider } from '../providers/produtos/produtos';

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
    NotificationPage
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
    NotificationPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    UsersProvider,
    ProdutosProvider
  ]
})
export class AppModule {}
