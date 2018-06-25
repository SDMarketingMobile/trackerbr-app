import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, App, ViewController, Platform } from 'ionic-angular';
import { Http, Headers } from '@angular/http';
import leaflet from 'leaflet';
import * as _ from 'underscore';

import { AlertController } from 'ionic-angular';
import { LoadingController } from 'ionic-angular';

import { LoginPage } from '../login/login';
import { MapPage } from '../map/map';
import { MyCarsDetailsPage } from '../my-cars-details/my-cars-details';

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
					public appCtrl: App,
					public plt: Platform
				){
	}

	public veiculos: any;
	public ruas: any;
	public tipos_veiculos = [];
	public showSelect = false;
	public selected = {};

	ionViewDidLoad() {
  		this.veiculos = this.navParams.data.veiculos;
  		this.tipos_veiculos = _.groupBy(this.veiculos, 'tipo');
		this.getStreetName(this.veiculos);
		
  		for(let index in this.veiculos){
  			this.veiculos[index].index = index;

			/*for(let index in this.veiculos) {
				this.initMap(index);
			}*/
		}
	}

	testecor(item){
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

		var map = leaflet.map('map-car-'+index).fitWorld();
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
					refresher.complete();
					this.getStreetName(this.veiculos);
				}
			}, (err) => {
				if (err['status'] == 401) {
					this.appCtrl.getRootNav().setRoot(LoginPage);
					localStorage.removeItem('app.trackerbr.user.data');
				}
			});
	}

	getStreetName(veiculos){
		var error = false;
		for(let item of veiculos){
			this.http.get('https://nominatim.openstreetmap.org/reverse?format=json&lat='+ item.lat +'&lon='+ item.lon +'&zoom=18&addressdetails=1')
			.subscribe(res => {
				if (res['_body']) {
					var endereco = JSON.parse(res['_body']);
					item.rua = endereco['address']['road'];
					item.numero_endereco = endereco['address']['house_number'];
					item.bairro = endereco['address']['city_district'];
					item.cidade = endereco['address']['city'];
					item.estado = endereco['address']['state'];
					item.cep = endereco['address']['postcode'];
					item.pais = endereco['address']['country'];
				}
			}, (err) => {
				if (error === false) {
					alert('Erro ao carregar ruas!');
				}
				error = true;
			});
		}
	}
}
