import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, App, LoadingController, Platform } from 'ionic-angular';
import { Http, Headers } from '@angular/http';

declare var google: any;

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
				public loadingCtrl: LoadingController,
				private platform: Platform
			) {}

 	public trajeto: any;
 	public trajetos: any;
 	public locations = [];
 	public busca = {
 		id_veiculo: null,
 		dta_inicial: "",
 		dta_final: ""
 	};
 	directions:any;
 	map: any;

 	initTraceRoute(){

		this.platform.ready().then(() =>{
			this.loadMap();
		});
 	}

 	loadMap(){
 		this.map = new google.maps.Map(document.getElementById('map'), {
          zoom: 10,
          center: {lat: -23.551328, lng: -46.633347}
        });

		this.calcRoute(-23.551328, -46.633347);
 	}

 	calcRoute(latitude: number, longitude: number){
 		let directionsRenderer = new google.maps.DirectionsRenderer();
 		directionsRenderer.setMap(this.map);

 		var origem = {
			lat: this.trajetos[0]['lat'],
			lng: this.trajetos[0]['lon']
		}

		var destino = {
			lat: this.trajetos[this.trajetos.length-1]['lat'],
			lng: this.trajetos[this.trajetos.length-1]['lon']
		}

 		let directionsService = new google.maps.DirectionsService();


 		var params = {
 			origin: origem,
 			destination: destino,
 			travelMode: google.maps.TravelMode.DRIVING,
 			waypoints: []
 		};

 		var wp = [];
 		
 		
 		/*for(var i = 0; i = this.trajetos.length; i++){
 			if( i != (this.trajetos.length-1)) {
 				i--;
 				wp.push({lat: this.trajetos[i]['lat'], lng: this.trajetos[i]['lon']});
			}
 		}*/

 		for(let i of this.trajetos){
			if(i != this.trajetos.length - 1) {
				var myLatLng = new google.maps.LatLng(i.lat, i.lon);
				wp.push({location: myLatLng});
			}
 		}

		params.waypoints = wp;
 		directionsService.route(params, (result, status) => {
 			if (status === google.maps.DirectionsStatus.OK) {
				directionsRenderer.setDirections(result);
 			} 
 		});
 	}

	ionViewDidLoad() {
		this.trajeto = this.navParams.data.trajeto;
		this.loadTrajetos();
	}

	loadTrajetos(){
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
					/*for(let item of this.trajetos){
						let latLon = {
							lat: item.lat,
							lng: item.lon
						}
						this.locations.push(latLon);
					}
					this.initMap(this.locations);*/
					this.initTraceRoute();
				}
			}, (err) => {
				console.log(err);
			});
	}

	/*initMap(locations){

		var map = new google.maps.Map(document.getElementById('map'), {
          zoom: 10,
          center: {lat: -23.551328, lng: -46.633347}
        });

        for(let item of locations){
        	new google.maps.Marker({
           		position: item,
           		map: map
         	 });
        }
	}*/

}
