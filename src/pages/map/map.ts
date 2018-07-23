import { Component } from '@angular/core';
import { NavController, NavParams, App, LoadingController } from 'ionic-angular';
import { Geolocation } from '@ionic-native/geolocation';
import { Http, Headers } from '@angular/http';
import leaflet from 'leaflet'; 

import { LoginPage } from '../login/login';

import { LoginProvider } from '../../providers/login/login';

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
					public geolocation: Geolocation,
					public login: LoginProvider ){
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
						if (localStorage.getItem('app.trackerbr.user.doLogin') == 'true') {
							this.login.doLogin(this.load(), this.error());
						} else{
							this.appCtrl.getRootNav().setRoot(LoginPage);
							this.resetLocalStorage();
						}
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


		this.geolocation.getCurrentPosition()
			.then((resp) => {
				this.map.setView([resp.coords.latitude, resp.coords.longitude], 10);
			}).catch((error) => {
				//alert('Erro ao pegar sua localização, definindo São Paulo');
				this.defaultLocale();
			});

		var icon_car = leaflet.icon({
			iconUrl: 'assets/imgs/icon-car.png',
			iconSize: [25, 20]
		});

		for(let item of locations){
			var marker = leaflet.marker([item.lat, item.lng], {icon: icon_car}).addTo(this.map);
			marker.bindPopup(item.placa);
		}
	}

	defaultLocale(){
		this.map.setView([-23.551328, -46.633347], 10);
	}

	error(){
		this.appCtrl.getRootNav().setRoot(LoginPage);
		this.resetLocalStorage();
	}

	resetLocalStorage(){
		localStorage.removeItem('app.trackerbr.user.data');
		localStorage.removeItem('app.trackerbr.user.username');
		localStorage.removeItem('app.trackerbr.user.password');
		localStorage.removeItem('app.trackerbr.user.doLogin');
	}

}
