import { Component } from '@angular/core';
import { NavController, NavParams, App, LoadingController } from 'ionic-angular';
import { Http, Headers } from '@angular/http';
import leaflet from 'leaflet'; 

//declare var google;

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
					public loadingCtrl: LoadingController ){
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
						lng: item.lon
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
					console.log(err);
					loader.dismiss();
				});
		}

	}

	initMapLeaflet(locations){
		this.map = leaflet.map('map').fitWorld();
		leaflet.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
		  attributions: 'www.tphangout.com',
		  maxZoom: 18
		}).addTo(this.map);

		this.map.setView([-23.551328, -46.633347], 12);

		var icon_car = leaflet.icon({
			iconUrl: '../assets/imgs/icon-car.png',
			iconSize:     [30, 30]
		});

		for(let item of locations){
			var marker = leaflet.marker([item.lat, item.lng], {icon: icon_car}).addTo(this.map);
			marker.bindPopup(item.placa);
		}
	}

}
