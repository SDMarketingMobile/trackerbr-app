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

  public username: any;
  public total_veiculos_cadastrados = 0;

  ionViewDidLoad() {
    this.total_veiculos_cadastrados = this.navParams.data.total_veiculos_cadastrados;
    this.username = localStorage.getItem('app.trackerbr.user.username');
  }

  logout(){
		this.appCtrl.getRootNav().setRoot(LoginPage);
    localStorage.removeItem('app.trackerbr.user.data');
		localStorage.removeItem('app.trackerbr.user.username');
	}
}
