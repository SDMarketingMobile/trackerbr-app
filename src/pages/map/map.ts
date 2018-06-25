import { Component } from '@angular/core';
import { NavController, NavParams, App, LoadingController } from 'ionic-angular';
import { Geolocation } from '@ionic-native/geolocation';
import { Http, Headers } from '@angular/http';
import leaflet from 'leaflet'; 

import { LoginPage } from '../login/login';

/**
* Generated class for the MapPage page.
*
* See https://ionicframework.com/docs/components/#navigation for more info on
* Ionic pages and navigation.
*/

@Component({
	selector: 'page-map',
	templateUrl: 'map.html',
})
export class MapPage {
	map: any;
	constructor(	public navCtrl: NavController, 
					public navParams: NavParams, 
					public http: Http,
					public appCtrl: App,
					public loadingCtrl: LoadingController,
					public geolocation: Geolocation ){
					//private nativePageTransitions: NativePageTransitions){

	}

	ionViewDidLoad() {
		this.load();
		
	}

	public veiculos: any;
	public veiculo = [];
	public locations = [];

	load(){
		let loader = this.loadingCtrl.create({
			content: "Aguarde!"
		});
		
		if (this.navParams.data.veiculos) {
			this.veiculos = this.navParams.data.veiculos;
			for(let item of this.veiculos){
				if (item.selected) {
					let latLon = {
						lat: item.lat,
						lng: item.lon,
						placa: item.placa
					}
					this.locations.push(latLon);
				}
			}
			
			this.initMapLeaflet(this.locations);

		} else if (this.navParams.data.veiculo){
			this.veiculo = this.navParams.data.veiculo;
			this.locations.push(this.veiculo);
			
			this.initMapLeaflet(this.locations);

		} else {
			var token = JSON.parse(localStorage.getItem('app.trackerbr.user.data'));

			let headers = new Headers();
			headers.append('Authorization', token.token_type+" "+token.access_token);

			this.http.get('https://api.getrak.com/v0.1/localizacoes', {headers: headers})
				.subscribe(res => {
					if (res['_body']) {
						loader.dismiss();
						this.veiculos = JSON.parse(res['_body']).veiculos
						for(let item of this.veiculos){
							if (item.velocidade > 0) {
								let latLon = {
									lat: item.lat,
									lng: item.lon,
									placa: item.placa
								}
								this.locations.push(latLon);
							}
						}
						this.initMapLeaflet(this.locations);
					}
				}, (err) => {
					if (err['status'] == 401) {
						loader.dismiss();
						this.appCtrl.getRootNav().setRoot(LoginPage);
						localStorage.removeItem('app.trackerbr.user.data');
					}
				});
		}

	}

	initMapLeaflet(locations){
		this.map = leaflet.map('map').fitWorld();
		leaflet.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
		  attributions: 'www.tphangout.com',
		  maxZoom: 18
		}).addTo(this.map);


		this.geolocation.getCurrentPosition().then((resp) => {
			alert(resp);
		 // resp.coords.latitude
		 // resp.coords.longitude
		}).catch((error) => {
			alert('Erro ao pegar localização, definindo São Paulo')
			this.localfixa();
		});

		var icon_car = leaflet.icon({
			iconUrl: '../assets/imgs/icon-car.png',
			iconSize: [25, 20]
		});

		for(let item of locations){
			var marker = leaflet.marker([item.lat, item.lng], {icon: icon_car}).addTo(this.map);
			marker.bindPopup(item.placa);
		}
	}

	localfixa(){
		this.map.setView([-23.551328, -46.633347], 10);
	}

}
