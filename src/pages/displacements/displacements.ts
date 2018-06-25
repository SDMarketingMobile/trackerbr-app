import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, App, LoadingController } from 'ionic-angular';
import { Http, Headers } from '@angular/http';
import leaflet from 'leaflet';
import * as _ from 'underscore';

import { LoginPage } from '../login/login';

/**
 * Generated class for the DisplacementsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-displacements',
  templateUrl: 'displacements.html',
})
export class DisplacementsPage {

  constructor(	public navCtrl: NavController, 
				public navParams: NavParams, 
				public http: Http,
				public appCtrl: App,
				public loadingCtrl: LoadingController
			) {}

 	public trajeto: any;
 	public trajetos: any;
 	public ruas: any;
	public circle: any;
 	public locations = [];
 	public busca = {
 		id_veiculo: null,
 		dta_inicial: "",
 		dta_final: ""
 	};
	directions:any;
	map: any;

	ionViewDidLoad() {
		this.trajeto = this.navParams.data.trajeto;
		this.loadTrajetos();
	}

	loadTrajetos(){
		let loader = this.loadingCtrl.create({
			content: "Aguarde!"
		});

		loader.present();

		this.busca['id_veiculo'] = this.trajeto.id_veiculo;
		this.busca['dta_inicial'] = this.trajeto.data_ini;
		this.busca['dta_final'] = this.trajeto.data_fim;

		var token = JSON.parse(localStorage.getItem('app.trackerbr.user.data'));

		let headers = new Headers();
		headers.append('Authorization', token.token_type+" "+token.access_token);

		this.http.get('https://api.getrak.com/v0.1/trajetos/'+this.busca['id_veiculo']+'/'+this.busca['dta_inicial']+'T00%3A00%3A00'+'/'+this.busca['dta_final']+'T23%3A59%3A59', {headers: headers})
			.subscribe(res => {
				if (res['_body']) {
					this.trajetos = JSON.parse(res['_body']);
					this.initMapLeaflet(this.trajetos);
					loader.dismiss();
				}
			}, (err) => {
				if (err['status'] == 401) {
					loader.dismiss();
					this.appCtrl.getRootNav().setRoot(LoginPage);
					localStorage.removeItem('app.trackerbr.user.data');
				}
			});
	}

	initMapLeaflet(locations){
		this.map = leaflet.map('mapDisplacements').fitWorld();
		leaflet.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
		  attributions: 'www.tphangout.com'
		}).addTo(this.map);

		var waypoints = []

		for(let item of locations){
			var latLng = leaflet.latLng(item.lat, item.lon)
			waypoints.push(latLng);
		}

		var firstItem = locations['0'];
		var lastItem = _.last(locations);

		var markerA = leaflet.marker(firstItem).addTo(this.map);
		markerA.bindPopup('Inicio');
	
		var markerB = leaflet.marker(lastItem).addTo(this.map);
		markerB.bindPopup('Fim');

		this.map.setView(firstItem, 13);
		
		var latlngs = waypoints;
		leaflet.polyline(latlngs, {color: 'black'}).addTo(this.map);
		
	}

	addMarker(item){
		var icon_car = leaflet.icon({
			iconUrl: '../assets/imgs/icon-car.png',
			iconSize: [25, 20]
		});

		if(this.circle)
			this.map.removeLayer(this.circle);

		this.circle = leaflet.marker([item.lat, item.lon], {icon: icon_car}).addTo(this.map);

		this.map.setView([item.lat, item.lon], 15);

	}

}
