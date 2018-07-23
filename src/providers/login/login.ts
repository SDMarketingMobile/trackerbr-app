import { Http, Headers } from '@angular/http';
import { Injectable } from '@angular/core';
import { App, LoadingController } from 'ionic-angular';

@Injectable()
export class LoginProvider {

	constructor(private http: Http, public appCtrl: App, public loadingCtrl: LoadingController) {

	}

	doLogin(successCallback, errorCallback){
		let loader = this.loadingCtrl.create({
			content: "Aguarde!"
		});
		loader.present();

		var username = localStorage.getItem('app.trackerbr.user.username');
		var password = localStorage.getItem('app.trackerbr.user.password');

		let headers = new Headers();

		headers.append('Content-Type', 'application/x-www-form-urlencoded');
		headers.append('authorization', 'Basic dHJhY2tlcmJyOjkyQzgzKkE4MTEtOTQjZmFjMCpBRGM3');

		let body = "username="+ username + "@trackerbr" +"&password="+ password +"&grant_type=password";

		this.http.post('https://api.getrak.com/newkoauth/oauth/token', body, {headers: headers})
			.subscribe(res => {
				if (res.status == 200){
					localStorage.setItem("app.trackerbr.user.data", res['_body']);
					successCallback();
				}
				loader.dismiss();
			}, (err) => {
				if (err.status == 400 || err.status == 401){
					errorCallback();
				}
				loader.dismiss();
			});
	}

}
