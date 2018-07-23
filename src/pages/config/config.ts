import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, App, LoadingController } from 'ionic-angular';

import { LoginPage } from '../login/login';
import { MyCarsPage } from '../my-cars/my-cars';

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
  				public appCtrl: App,
          public loadingCtrl: LoadingController) {
  }

  public username: any;
  public total_veiculos_cadastrados = 0;
  public total_veiculos_movimento = 0;
  public total_veiculos_desligados = 0;
  public veiculos: any;

  ionViewDidLoad() {
    this.total_veiculos_cadastrados = this.navParams.data.total_veiculos_cadastrados;
    this.total_veiculos_movimento = this.navParams.data.total_veiculos_movimento;
    this.total_veiculos_desligados = this.navParams.data.total_veiculos_desligados;

    this.username = localStorage.getItem('app.trackerbr.user.username');
  }

  goToMyCars(filter){
    this.veiculos = this.navParams.data.veiculos;
    let loader = this.loadingCtrl.create({
      content: "Aguarde!",
      duration: 500
    });

    loader.present();

    if (filter == 'lig')
      this.navCtrl.push(MyCarsPage, {'veiculos' : this.veiculos, 'filter': 'lig'});
    else
      this.navCtrl.push(MyCarsPage, {'veiculos' : this.veiculos, 'filter': 'des'});
  }

  logout(){
		this.appCtrl.getRootNav().setRoot(LoginPage);
    localStorage.removeItem('app.trackerbr.user.data');
    localStorage.removeItem('app.trackerbr.user.username');
    localStorage.removeItem('app.trackerbr.user.password');
    localStorage.removeItem('app.trackerbr.user.doLogin');
	}
}
