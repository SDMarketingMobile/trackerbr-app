import { Component } from '@angular/core';
import { NavController, NavParams, App, LoadingController } from 'ionic-angular';
import { Http, Headers } from '@angular/http';

import { LoginPage } from '../login/login';
import { MyCarsPage } from '../my-cars/my-cars';
import { MapPage } from '../map/map';
import { ConfigPage } from '../config/config';
import { NotificationPage } from '../notification/notification';

@Component({
	selector: 'page-home',
	templateUrl: 'home.html'
})
export class HomePage {
	constructor(	public navCtrl: NavController, 
					public navParams: NavParams, 
					public http: Http,
					public appCtrl: App,
					public loadingCtrl: LoadingController ){
					//private nativePageTransitions: NativePageTransitions){

	}

	goToMyCarsPage(){
		let loader = this.loadingCtrl.create({
			content: "Aguarde!",
			duration: 500
		});

		loader.present();
		//let options: NativeTransitionOptions = {
		//	direction: 'up',
		//	duration: 500,
		//	slowdownfactor: 3,
		//	slidePixels: 20,
		//	iosdelay: 100,
		//	androiddelay: 150,
		//	fixedPixelsTop: 0,
		//	fixedPixelsBottom: 60
		//};

		//this.nativePageTransitions.slide(options);
		this.navCtrl.push(MyCarsPage, {'veiculos' : this.veiculos});
	}

	goToMapPage(){
		this.navCtrl.push(MapPage);
	}

	goToConfigPage(){
		this.navCtrl.push(ConfigPage, {'total_veiculos_cadastrados': this.veiculos.length});
	}

	goToNotificationPage(){
		this.navCtrl.push(NotificationPage);
	}

	ionViewDidLoad() {
		this.load()
	}

	public veiculos: any;
	public total_veiculos: 0;
	public total_ligados = 0;
	public total_desligados = 0;
	public total_movimento = 0;

	load(){
		let loader = this.loadingCtrl.create({
			content: "Aguarde!"
		});

		loader.present();

		this.total_veiculos = 0;
		this.total_ligados = 0;
		this.total_desligados = 0;
		this.total_movimento = 0;

		var token = JSON.parse(localStorage.getItem('app.trackerbr.user.data'));

		let headers = new Headers();
		headers.append('Authorization', token.token_type+" "+token.access_token);

		this.http.get('https://api.getrak.com/v0.1/localizacoes', {headers: headers})
			.subscribe(res => {
				if (res['_body']) {
					this.veiculos = JSON.parse(res['_body']).veiculos
					this.total_veiculos = this.veiculos.length;
					for(let item of this.veiculos){
						if (item.velocidade > 0) {
							this.total_movimento ++;
						}
						switch (item.lig) {
							case 0:
							 	this.total_desligados ++;
							 	break;
							case 1:
								this.total_ligados ++;
								break;
						}
					}
					loader.dismiss();
				}
			}, (err) => {
				if (err['status'] == 401) {
					loader.dismiss();
					this.appCtrl.getRootNav().setRoot(LoginPage);
					localStorage.removeItem('app.trackerbr.user.data');
				}
			});
	}
}
