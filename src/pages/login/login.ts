import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, App, ViewController } from 'ionic-angular';
import { Http, Headers } from '@angular/http';

import { AlertController } from 'ionic-angular';
import { LoadingController } from 'ionic-angular';

import { HomePage } from '../home/home';

/**
* Generated class for the LoginPage page.
*
* See https://ionicframework.com/docs/components/#navigation for more info on
* Ionic pages and navigation.
*/

@IonicPage()
@Component({
	selector: 'page-login',
	templateUrl: 'login.html',
})
export class LoginPage {

	constructor(	public navCtrl: NavController, 
					public navParams: NavParams, 
					public http: Http, 
					public alertCtrl: AlertController,
					public loadingCtrl: LoadingController,
					public viewCtrl: ViewController,
					public appCtrl: App
				){

	}

	ionViewDidLoad() {
		console.log('ionViewDidLoad LoginPage');
	}

	goToHomePage(){
		this.appCtrl.getRootNav().setRoot(HomePage);
	}

	data = {
		username: "",
		password: ""
	};

	doLogin(){
		let loader = this.loadingCtrl.create({
			content: "Aguarde!"
		});

		loader.present();

		if (this.data.username.length == 0){
			let alert = this.alertCtrl.create({
				title: 'Atenção!',
				subTitle: 'Preencha o campo Login!',
				buttons: ['OK']
			});

			loader.dismiss();
			alert.present();

			return false;

		} else if (this.data.password.length == 0){
			let alert = this.alertCtrl.create({
				title: 'Atenção!',
				subTitle: 'Preencha o campo Senha!',
				buttons: ['OK']
			});

			loader.dismiss();
			alert.present();
			
			return false;
		}

		let headers = new Headers();

		headers.append('Content-Type', 'application/x-www-form-urlencoded');
		headers.append('authorization', 'Basic dHJhY2tlcmJyOjkyQzgzKkE4MTEtOTQjZmFjMCpBRGM3');

		let body = "username="+ this.data.username + "@trackerbr" +"&password="+ this.data.password +"&grant_type=password";

		this.http.post('https://api.getrak.com/newkoauth/oauth/token', body, {headers: headers})
			.subscribe(res => {
				if (res.status == 200){
					this.goToHomePage();
					localStorage.setItem("app.trackerbr.user.data", res['_body']);
				}

				loader.dismiss();
			}, (err) => {
				if (err.status == 400 || err.status == 401){
					let alert = this.alertCtrl.create({
						title: 'Atenção!',
						subTitle: 'Usuário e/ou Senha inválido(s)!',
						buttons: ['OK']
					});

					alert.present();
				}

				loader.dismiss();
			});
	}
}