import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, App, ViewController } from 'ionic-angular';
import { Http, Headers } from '@angular/http';
import * as _ from 'underscore';

import { AlertController } from 'ionic-angular';
import { LoadingController } from 'ionic-angular';

import { MapPage } from '../map/map';
/**
 * Generated class for the MyCarsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-my-cars',
  templateUrl: 'my-cars.html',
})
export class MyCarsPage {

  constructor(	public navCtrl: NavController, 
					public navParams: NavParams, 
					public http: Http, 
					public alertCtrl: AlertController,
					public loadingCtrl: LoadingController,
					public viewCtrl: ViewController,
					public appCtrl: App
				){

	}

	public veiculos: any;
	public showSelect = false;
	public selected = {};

  	load(){
  		this.veiculos = this.navParams.data.veiculos;
	}

	showSelectMyCars(){
		for(let item of this.veiculos){
			item.selected = false;
		}
		this.showSelect = !this.showSelect;
	}

	goToMapPage(veiculos){
		if (_.findWhere(veiculos, {selected:true})) {
			this.navCtrl.push(MapPage, {'veiculos' : veiculos});
		}else {
			this.showSelect = false;
		}
	}

	doRefresh(refresher) {
		this.showSelect = false;
		var token = JSON.parse(localStorage.getItem('app.trackerbr.user.data'));

		let headers = new Headers();
		headers.append('Authorization', token.token_type+" "+token.access_token);

		this.http.get('https://api.getrak.com/v0.1/localizacoes', {headers: headers})
			.subscribe(res => {
				if (res['_body']) {
					this.veiculos = JSON.parse(res['_body']).veiculos;
					refresher.complete();
				}
			}, (err) => {
				console.log(err);
			});
	}

	ionViewDidLoad() {
		this.load()
	}
}
