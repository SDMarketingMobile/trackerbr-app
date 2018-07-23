import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, App, LoadingController } from 'ionic-angular';
import { Http, Headers } from '@angular/http';
import moment from 'moment';

import { AlertController } from 'ionic-angular';

import { LoginPage } from '../login/login';
import { DisplacementsPage } from '../displacements/displacements';

import { LoginProvider } from '../../providers/login/login';

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
		public loadingCtrl: LoadingController,
		public login: LoginProvider
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
					for(let item of this.delocamentos){
						item.data_ini_m = moment(item.data_ini).format("DD/MM/YYYY HH:mm:ss");
						item.data_fim_m = moment(item.data_fim).format("DD/MM/YYYY HH:mm:ss");
					}
					loader.dismiss();			
				}
			}, (err) => {
				if (err['status'] == 401) {
					loader.dismiss();
					if (localStorage.getItem('app.trackerbr.user.doLogin') == 'true') {
						this.login.doLogin(this.loadDeslocamentos(), this.error());
					} else{
						this.appCtrl.getRootNav().setRoot(LoginPage);
						this.resetLocalStorage();
					}
				}
			});
		
	}

	goToDisplacementsPage(item){
		item['id_veiculo'] = (this.id_veiculo);
		this.navCtrl.push(DisplacementsPage, {'trajeto':item});
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
