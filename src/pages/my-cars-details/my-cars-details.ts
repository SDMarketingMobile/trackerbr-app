import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, App, LoadingController } from 'ionic-angular';
import { Http, Headers } from '@angular/http';
import leaflet from 'leaflet'; 
import 'leaflet-routing-machine';

import { PathsPage } from '../paths/paths';
import { LoginPage } from '../login/login';

import { LoginProvider } from '../../providers/login/login';

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
		public loadingCtrl: LoadingController,
		public login: LoginProvider
	){}

	map: any;
	public veiculo = {};
	public color = "";
	public circle: any;

	ionViewDidLoad() {
		this.veiculo = this.navParams.data.veiculo;
		this.initMapLeaflet(this.veiculo);
		this.colorToolbar(this.veiculo);
		let latLng = {
			lat: this.veiculo['lat'],
			lng: this.veiculo['lng']
		}
		this.getStreetName(latLng);
	}

	initMapLeaflet(veiculo){
		this.map = leaflet.map('map').fitWorld();
		leaflet.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
		  attributions: 'www.tphangout.com',
		  maxZoom: 18
		}).addTo(this.map);

		this.setLocation(veiculo);
	}

	setLocation(veiculo){
		this.map.setView(veiculo, 18);

		var icon_car = leaflet.icon({
			iconUrl: 'assets/imgs/icon-car.png',
			iconSize: [25, 20]
		});

		if(this.circle)
			this.map.removeLayer(this.circle);

		this.circle = leaflet.marker(veiculo, {icon: icon_car}).addTo(this.map);
	}

	getStreetName(latLng){
		var error = false;
		this.http.get('https://nominatim.openstreetmap.org/reverse?format=json&lat='+ latLng.lat +'&lon='+ latLng.lng +'&zoom=18&addressdetails=1')
		.subscribe(res => {
			if (res['_body']) {
				var endereco = JSON.parse(res['_body']);
				if (endereco['address']['road'])
					this.veiculo['rua'] = endereco['address']['road'];
				else
					this.veiculo['rua'] = "N/D";
				
				if (endereco['address']['house_number'])
					this.veiculo['numero_endereco'] = endereco['address']['house_number'];
				else
					this.veiculo['numero_endereco'] = "N/D";
				
				if (endereco['address']['city_district'])
					this.veiculo['bairro'] = endereco['address']['city_district'];
				else 
					this.veiculo['bairro'] = "N/D";

				if (endereco['address']['city'])
					this.veiculo['cidade'] = endereco['address']['city'];
				else
					this.veiculo['cidade'] = "N/D";
			}
		}, (err) => {
			if (error === false) {
				this.veiculo['rua'] = "N/D";
				this.veiculo['numero_endereco'] = "N/D";
				this.veiculo['bairro'] = "N/D";
				this.veiculo['cidade'] = "N/D";
			}
			error = true;
		});
	}

	colorToolbar(veiculo){
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

	load(id_veiculo){
		let loader = this.loadingCtrl.create({
			content: "Aguarde!"
		});

		loader.present();

		var token = JSON.parse(localStorage.getItem('app.trackerbr.user.data'));

		let headers = new Headers();
		headers.append('Authorization', token.token_type+" "+token.access_token);

		this.http.get('https://api.getrak.com/v0.1/localizacoes', {headers: headers})
			.subscribe(res => {
				if (res['_body']) {
					let veiculos = JSON.parse(res['_body']).veiculos;
					for(let item of veiculos){
						if(item.id_veiculo == id_veiculo){
							let latLng = {
								lat: item.lat,
								lng: item.lng
							}
							this.getStreetName(latLng);
							this.veiculo = item;
						}
					}
					this.colorToolbar(this.veiculo);
					this.setLocation(this.veiculo);
					loader.dismiss();
				}
			}, (err) => {
				/*if (err['status'] == 401) {
					loader.dismiss();
					if (localStorage.getItem('app.trackerbr.user.doLogin') == 'true') {
						this.login.doLogin(this.load(), this.error());
					} else{
						this.appCtrl.getRootNav().setRoot(LoginPage);
						this.resetLocalStorage();
					}
				}*/
			});
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
