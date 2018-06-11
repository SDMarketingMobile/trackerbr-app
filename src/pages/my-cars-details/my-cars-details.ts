import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, App, LoadingController } from 'ionic-angular';
import { Http, Headers } from '@angular/http';

import { PathsPage } from '../paths/paths';

declare var google;

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

	public veiculo = {};
	public color = "";

	ionViewDidLoad() {
		this.veiculo = this.navParams.data.veiculo;
		this.initMap(this.veiculo);
		this.testecor(this.veiculo);
	}

	initMap(veiculo){

		var map = new google.maps.Map(document.getElementById('map'), {
          zoom: 16,
          center: veiculo
        });

        
		return new google.maps.Marker({
			position: veiculo,
			map: map
 		});
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
