import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, App } from 'ionic-angular';

import { LoginPage } from '../login/login';

/**
 * Generated class for the ConfigPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-config',
  templateUrl: 'config.html',
})
export class ConfigPage {

  constructor(	public navCtrl: NavController, 
  				public navParams: NavParams,
  				public appCtrl: App) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ConfigPage');
  }

  logout(){
		this.appCtrl.getRootNav().setRoot(LoginPage);
		localStorage.setItem("app.trackerbr.user.data", '');
	}
}
