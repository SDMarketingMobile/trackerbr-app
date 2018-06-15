import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, App, LoadingController } from 'ionic-angular';
import { Http, Headers } from '@angular/http';

import { AlertController } from 'ionic-angular';

import { DisplacementsPage } from '../displacements/displacements';

/**
 * Generated class for the PathsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-paths',
  templateUrl: 'paths.html',
})
export class PathsPage {

	constructor(	
		public navCtrl: NavController, 
		public navParams: NavParams, 
		public http: Http,
		public appCtrl: App,
		public alertCtrl: AlertController,
		public loadingCtrl: LoadingController
	){}

	public delocamentos: any;
	public id_veiculo = "";
	public busca = {};

	ionViewDidLoad() {
		this.id_veiculo = this.navParams.data.id_veiculo;
	}

	loadDeslocamentos(){
		let loader = this.loadingCtrl.create({
			content: "Aguarde!"
		});

		loader.present();

		if (this.busca['dta_inicial'] == undefined) {
			let alert = this.alertCtrl.create({
				title: 'Atenção!',
				subTitle: 'Preencha a data inicial!',
				buttons: ['OK']
			});

			loader.dismiss();
			alert.present();

			return false;
		}

		if (this.busca['dta_final'] == undefined) {
			let alert = this.alertCtrl.create({
				title: 'Atenção!',
				subTitle: 'Preencha a data final!',
				buttons: ['OK']
			});

			loader.dismiss();
			alert.present();

			return false;
		}

		var token = JSON.parse(localStorage.getItem('app.trackerbr.user.data'));

		let headers = new Headers();
		headers.append('Authorization', token.token_type+" "+token.access_token);

		this.http.get('https://api.getrak.com/v0.1/deslocamentos/'+this.id_veiculo+'/'+this.busca['dta_inicial']+'T00%3A00%3A00'+'/'+this.busca['dta_final']+'T23%3A59%3A59', {headers: headers})
			.subscribe(res => {
				if (res['_body']) {
					this.delocamentos = JSON.parse(res['_body']); 	
					loader.dismiss();			
				}
			}, (err) => {
				console.log(err);
			});

		
	}

	goToDisplacementsPage(item){
		item['id_veiculo'] = (this.id_veiculo);
		this.navCtrl.push(DisplacementsPage, {'trajeto':item});
	}

}
