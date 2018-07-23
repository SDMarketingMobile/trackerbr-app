import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, App, ViewController, Platform, AlertController, LoadingController } from 'ionic-angular';
import { Http, Headers } from '@angular/http';
import leaflet from 'leaflet';
import * as _ from 'underscore';
import moment from 'moment';

import { LoginPage } from '../login/login';
import { MapPage } from '../map/map';
import { MyCarsDetailsPage } from '../my-cars-details/my-cars-details';

import { LoginProvider } from '../../providers/login/login';

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
					public appCtrl: App,
					public plt: Platform,
					public login: LoginProvider
				){
	}

	public veiculos: any;
	public ruas: any;
	public tipos_veiculos = [];
	public showSelect = false;
	public selected = {};
	public active_veiculos: any;
	public status_selected: any;
	public statuses_vehicles: any;

	ionViewDidLoad() {
  		this.veiculos = this.navParams.data.veiculos;
  		this.tipos_veiculos = [];
  		this.statuses_vehicles = _.groupBy(this.veiculos, 'lig');
  		if (this.navParams.data.filter) {
  			if (this.navParams.data.filter == 'lig'){
  				this.status_selected = "1";
  			} else{
				this.status_selected = "0";
  			}
  		} else{
			this.status_selected = "1";
  		}
  		this.getActiveVehicleList(this.status_selected);
  		this.getStreetName(this.veiculos);
	}

	getActiveVehicleList(status_selected){
		let loader = this.loadingCtrl.create({
			content: "Aguarde!",
			duration: 500
		});
		loader.present();

		this.status_selected = status_selected;
		this.active_veiculos = this.statuses_vehicles[status_selected];
	}

	colorCard(item){
		if (item.lig == 1  && item.velocidade == 0) {
			return '#ff9800';
		} else if (item.lig == 1 && item.velocidade > 0){
			return '#2ebb46';
		} else {
			return '#b93939';
		}
	}

	initMap(index){
		let latLon = {
			lat: this.veiculos[index].lat,
			lng: this.veiculos[index].lon
		};

		var mapContainerId = "mapCar" + index;
		var map = leaflet.map(mapContainerId).fitWorld();
		leaflet.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
		  attributions: 'www.tphangout.com'
		}).addTo(map);

		map.setView(latLon, 13);
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
		} else{
			this.showSelect = false;
		}
	}

	goToMyCarsDetailsPage(item){
		this.navCtrl.push(MyCarsDetailsPage, {'veiculo' : item});
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
					this.getStreetName(this.veiculos);
					for(let item of this.veiculos){
						item.date = moment(item.dataServidor.date).format("DD/MM/YYYY");
						item.hour = moment(item.dataServidor.date).format("HH:mm:ss");
					}
					this.statuses_vehicles = _.groupBy(this.veiculos, 'lig');
			  		this.status_selected = "1";
			  		this.getActiveVehicleList(this.status_selected);
					if (refresher != null) {
						refresher.complete();					
					}
				}
			}, (err) => {
				if (err['status'] == 401) {
					if (localStorage.getItem('app.trackerbr.user.doLogin') == 'true') {
						this.login.doLogin(this.doRefresh(null), this.error());
					} else{
						this.appCtrl.getRootNav().setRoot(LoginPage);
						this.resetLocalStorage();
					}
				}
			});
	}

	getStreetName(veiculos){
		for(let item of veiculos){
			this.http.get('https://nominatim.openstreetmap.org/reverse?format=json&lat='+ item.lat +'&lon='+ item.lon +'&zoom=18&addressdetails=1')
			.subscribe(res => {
				if (res['_body']) {
					var endereco = JSON.parse(res['_body']);
					if (endereco['address']['road'])
						item.rua = endereco['address']['road'];
					else
						item.rua = "N/D";
					
					if (endereco['address']['house_number'])
						item.numero_endereco = endereco['address']['house_number'];
					else
						item.numero_endereco = "N/D";
					
					if (endereco['address']['city_district'])
						item.bairro = endereco['address']['city_district'];
					else 
						item.bairro = "N/D";

					if (endereco['address']['city'])
						item.cidade = endereco['address']['city'];
					else
						item.cidade = "N/D";
				}
			}, (err) => {
				item.rua = "N/D";
				item.numero_endereco = "N/D";
				item.bairro = "N/D";
				item.cidade = "N/D";
			});
		}
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
