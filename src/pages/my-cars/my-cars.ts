import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, App, ViewController } from 'ionic-angular';
import { Http, Headers } from '@angular/http';
import * as _ from 'underscore';

import { AlertController } from 'ionic-angular';
import { LoadingController } from 'ionic-angular';

import { MapPage } from '../map/map';
import { MyCarsDetailsPage } from '../my-cars-details/my-cars-details';

declare var google;
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
	public tipos_veiculos = [];
	public showSelect = false;
	public selected = {};

	ionViewDidLoad() {
  		this.veiculos = this.navParams.data.veiculos;
  		this.tipos_veiculos = _.groupBy(this.veiculos, 'tipo');

		for(let item of this.veiculos){
			let latLon = {
				lat: item.lat,
				lng: item.lon
			};

			var geocoder = new google.maps.Geocoder;
			geocoder.geocode({'location': latLon}, function(results, status) {
				if (status === 'OK') {
					if (results != null && typeof(results[0]) != 'undefined' && typeof(results[0].formatted_address) != 'undefined')
						item.rua = results[0].formatted_address;
					else
						item.rua = "não trouxe essa merda";
				}
			});
		}
  		/*for(let index in this.veiculos){
  			this.veiculos[index].index = index;
  			
  			let latLon = {
				lat: this.veiculos[index].lat,
				lng: this.veiculos[index].lon
			};

			var geocoder = new google.maps.Geocoder;
			geocoder.geocode({'location': latLon}, function(results, status) {
				if (status === 'OK') {
					if (results[1])
						this.veiculos[index].rua;
				}
			});

			for(let index in this.veiculos) {
				this.initMap(index);
			}
		}*/
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
		
		var map = new google.maps.Map(document.getElementById('map-car-'+index), {
          zoom: 10,
          center: latLon
        });

        new google.maps.Marker({
       		position: latLon,
       		map: map
       	});
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
				}
				/*for(let item of this.veiculos){
					let latLon = {
						lat: item.lat,
						lng: item.lon
					}
					this.initMap(latLon);
				}*/
			}, (err) => {
				console.log(err);
			});
	}
}
