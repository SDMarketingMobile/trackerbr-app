import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, App, LoadingController } from 'ionic-angular';
import { Http, Headers } from '@angular/http';
import leaflet from 'leaflet'; 
import 'leaflet-routing-machine';

import { PathsPage } from '../paths/paths';

/**
 * Generated class for the MyCarsDetailsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-my-cars-details',
  templateUrl: 'my-cars-details.html',
})
export class MyCarsDetailsPage {

	constructor(	
	  	public navCtrl: NavController, 
		public navParams: NavParams, 
		public http: Http,
		public appCtrl: App,
		public loadingCtrl: LoadingController 
	){}

	map: any;
	public veiculo = {};
	public color = "";

	ionViewDidLoad() {
		this.veiculo = this.navParams.data.veiculo;
		this.initMapLeaflet(this.veiculo);
		this.testecor(this.veiculo);
	}

	initMapLeaflet(veiculo){
		this.map = leaflet.map('map').fitWorld();
		leaflet.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
		  attributions: 'www.tphangout.com',
		  maxZoom: 18
		}).addTo(this.map);

		this.map.setView(veiculo, 15);

		var icon_car = leaflet.icon({
			iconUrl: '../assets/imgs/icon-car.png',
			iconSize:     [30, 30]
		});

		var marker = leaflet.marker(veiculo, {icon: icon_car}).addTo(this.map);
	}

	testecor(veiculo){
		if (veiculo.lig == 1  && veiculo.velocidade == 0) {
			this.color =  'toolbar-notification';
		} else if (veiculo.lig == 1 && veiculo.velocidade > 0){
			this.color = 'toolbar-map';
		} else {
			this.color = 'toolbar-my-cars';
		}
	}

	goToPathsPage(id_veiculo){
		this.navCtrl.push(PathsPage, {id_veiculo});
	}

} 
